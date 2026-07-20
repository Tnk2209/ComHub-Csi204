import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

let customerToken: string;
let adminToken: string;
const createdProductIds: number[] = [];
const createdOrderIds: number[] = [];

before(async () => {
  await cleanupTestUsers();

  // customer
  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('cust-admin-orders'), password: 'password123', first_name: 'C', last_name: 'U' });
  customerToken = custRes.body.token;

  // admin
  const adminEmail = uniqueEmail('admin-orders');
  const adminRes = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminToken = signToken(adminRes.rows[0]!.id, 'Admin');

  // product
  const prodRes = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'TDD-ADMINORDER prod', category: 'Case', price: 4000, stock_quantity: 50, specifications: { form_factor: 'ATX', max_gpu_length_mm: 380 } });
  createdProductIds.push(prodRes.body.id);

  // customer creates 2 orders
  const o1 = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ items: [{ product_id: prodRes.body.id, quantity: 1 }], shipping_address: 'Addr 1' });
  createdOrderIds.push(o1.body.id);

  const o2 = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ items: [{ product_id: prodRes.body.id, quantity: 2 }], shipping_address: 'Addr 2' });
  createdOrderIds.push(o2.body.id);
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

test('GET /api/admin/orders — Admin sees all orders', async () => {
  const res = await request(app)
    .get('/api/admin/orders')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  // should include our 2 test orders (there may be more from other tests)
  const ourOrders = res.body.filter((o: any) => createdOrderIds.includes(o.id));
  assert.equal(ourOrders.length, 2);
});

test('GET /api/admin/orders?order_status=pending_payment — filters by status', async () => {
  const res = await request(app)
    .get('/api/admin/orders?order_status=pending_payment')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  for (const order of res.body) {
    assert.equal(order.order_status, 'pending_payment');
  }
});

test('GET /api/admin/orders — Customer returns 403', async () => {
  const res = await request(app)
    .get('/api/admin/orders')
    .set('Authorization', `Bearer ${customerToken}`);
  assert.equal(res.status, 403);
});

test('GET /api/admin/orders — no auth returns 401', async () => {
  const res = await request(app).get('/api/admin/orders');
  assert.equal(res.status, 401);
});
