import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

let customerAToken: string;
let customerBToken: string;
let adminToken: string;
let adminUserId: number;
let orderIdA: number;
let productId: number;
const createdOrderIds: number[] = [];

const MOCK_SLIP = 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoIAAgAAkA4JZQCdAEO/hepgAAA/v3dP//brf//' ;

before(async () => {
  await cleanupTestUsers();

  // customer A
  const custARes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('custA-pay'), password: 'password123', first_name: 'A', last_name: 'A' });
  customerAToken = custARes.body.token;

  // customer B
  const custBRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('custB-pay'), password: 'password123', first_name: 'B', last_name: 'B' });
  customerBToken = custBRes.body.token;

  // admin
  const adminEmail = uniqueEmail('admin-pay');
  const adminRes = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminUserId = adminRes.rows[0]!.id;
  adminToken = signToken(adminUserId, 'Admin');

  // product
  const prodRes = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'TDD-PAY prod', category: 'RAM', price: 2500, stock_quantity: 20, specifications: { ram_type: 'DDR5' } });
  productId = prodRes.body.id;

  // customer A creates order
  const orderRes = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerAToken}`)
    .send({ items: [{ product_id: productId, quantity: 2 }], shipping_address: 'Pay test addr' });
  orderIdA = orderRes.body.id;
  createdOrderIds.push(orderIdA);
});

after(async () => {
  if (createdOrderIds.length) {
    await pool.query('DELETE FROM order_logs WHERE order_id = ANY($1::int[])', [createdOrderIds]);
    await pool.query('DELETE FROM order_items WHERE order_id = ANY($1::int[])', [createdOrderIds]);
    await pool.query('DELETE FROM orders WHERE id = ANY($1::int[])', [createdOrderIds]);
  }
  await pool.query('DELETE FROM products WHERE id = $1', [productId]);
  await cleanupTestUsers();
  await closePool();
});

// --- Upload slip ---
test('PATCH /api/orders/:id/payment — Customer uploads slip successfully', async () => {
  const res = await request(app)
    .patch(`/api/orders/${orderIdA}/payment`)
    .set('Authorization', `Bearer ${customerAToken}`)
    .send({ payment_slip: MOCK_SLIP });

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  assert.equal(res.body.id, orderIdA);
  assert.equal(res.body.payment_slip_mockup, MOCK_SLIP);

  // verify order_log
  const logs = await pool.query(
    `SELECT status FROM order_logs WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [orderIdA]
  );
  assert.equal(logs.rows[0]!.status, 'Slip Uploaded');
});

test('PATCH /api/orders/:id/payment — Customer B cannot upload to A order (403)', async () => {
  const res = await request(app)
    .patch(`/api/orders/${orderIdA}/payment`)
    .set('Authorization', `Bearer ${customerBToken}`)
    .send({ payment_slip: MOCK_SLIP });
  assert.equal(res.status, 403);
});

test('PATCH /api/orders/:id/payment — missing payment_slip returns 400', async () => {
  const res = await request(app)
    .patch(`/api/orders/${orderIdA}/payment`)
    .set('Authorization', `Bearer ${customerAToken}`)
    .send({});
  assert.equal(res.status, 400);
});

test('PATCH /api/orders/:id/payment — no auth returns 401', async () => {
  const res = await request(app)
    .patch(`/api/orders/${orderIdA}/payment`)
    .send({ payment_slip: MOCK_SLIP });
  assert.equal(res.status, 401);
});
