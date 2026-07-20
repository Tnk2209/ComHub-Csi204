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
let orderIdA: number;
const createdProductIds: number[] = [];
const createdOrderIds: number[] = [];

before(async () => {
  await cleanupTestUsers();

  // customer A
  const custARes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('custA-list'), password: 'password123', first_name: 'A', last_name: 'A' });
  customerAToken = custARes.body.token;

  // customer B
  const custBRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('custB-list'), password: 'password123', first_name: 'B', last_name: 'B' });
  customerBToken = custBRes.body.token;

  // admin
  const adminEmail = uniqueEmail('admin-list-orders');
  const adminRes = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminToken = signToken(adminRes.rows[0]!.id, 'Admin');

  // create product
  const prodRes = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'TDD-ORDERLIST prod', category: 'SSD', price: 3000, stock_quantity: 50, specifications: { form_factor: 'M.2' } });
  createdProductIds.push(prodRes.body.id);

  // customer A creates an order
  const orderRes = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerAToken}`)
    .send({ items: [{ product_id: prodRes.body.id, quantity: 1 }], shipping_address: 'A addr' });
  orderIdA = orderRes.body.id;
  createdOrderIds.push(orderIdA);

  // customer B creates an order
  const orderBRes = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerBToken}`)
    .send({ items: [{ product_id: prodRes.body.id, quantity: 2 }], shipping_address: 'B addr' });
  createdOrderIds.push(orderBRes.body.id);
});

after(async () => {
  if (createdOrderIds.length) {
    await pool.query('DELETE FROM order_logs WHERE order_id = ANY($1::int[])', [createdOrderIds]);
    await pool.query('DELETE FROM order_items WHERE order_id = ANY($1::int[])', [createdOrderIds]);
    await pool.query('DELETE FROM orders WHERE id = ANY($1::int[])', [createdOrderIds]);
  }
  if (createdProductIds.length) {
    await pool.query('DELETE FROM products WHERE id = ANY($1::int[])', [createdProductIds]);
  }
  await cleanupTestUsers();
  await closePool();
});

// --- GET /api/orders ---
test('GET /api/orders — Customer A sees only own orders', async () => {
  const res = await request(app)
    .get('/api/orders')
    .set('Authorization', `Bearer ${customerAToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.length, 1);
  assert.equal(res.body[0].id, orderIdA);
  assert.equal(res.body[0].shipping_address, 'A addr');
});

test('GET /api/orders — no auth returns 401', async () => {
  const res = await request(app).get('/api/orders');
  assert.equal(res.status, 401);
});

// --- GET /api/orders/:id ---
test('GET /api/orders/:id — Customer A sees own order detail with items + logs', async () => {
  const res = await request(app)
    .get(`/api/orders/${orderIdA}`)
    .set('Authorization', `Bearer ${customerAToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.id, orderIdA);
  assert.ok(Array.isArray(res.body.items));
  assert.ok(res.body.items.length > 0);
  assert.ok(Array.isArray(res.body.logs));
  assert.ok(res.body.logs.length > 0);
  assert.equal(res.body.logs[0].status, 'Order Created');
});

test('GET /api/orders/:id — Customer B cannot see Customer A order (403)', async () => {
  const res = await request(app)
    .get(`/api/orders/${orderIdA}`)
    .set('Authorization', `Bearer ${customerBToken}`);

  assert.equal(res.status, 403);
});

test('GET /api/orders/:id — not found returns 404', async () => {
  const res = await request(app)
    .get('/api/orders/999999')
    .set('Authorization', `Bearer ${customerAToken}`);
  assert.equal(res.status, 404);
});
