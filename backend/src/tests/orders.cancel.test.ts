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

  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('cust-cancel'), password: 'password123', first_name: 'C', last_name: 'U' });
  customerToken = custRes.body.token;

  const adminEmail = uniqueEmail('admin-cancel');
  const adminRes = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminToken = signToken(adminRes.rows[0]!.id, 'Admin');

  const prodRes = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Cancel-test product', category: 'RAM', price: 1500, stock_quantity: 10, specifications: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 6000, tdp: 8 } });
  createdProductIds.push(prodRes.body.id);

  // create 3 orders for different cancel scenarios
  for (let i = 0; i < 3; i++) {
    const o = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ product_id: prodRes.body.id, quantity: 1 }], shipping_address: `Addr ${i}` });
    createdOrderIds.push(o.body.id);
  }
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

test('PATCH /api/admin/orders/:id/cancel — Admin cancels pending_payment order', async () => {
  const orderId = createdOrderIds[0]!;

  // verify stock before
  const before = await pool.query<{ stock_quantity: number }>('SELECT stock_quantity FROM products WHERE id = $1', [createdProductIds[0]]);
  const stockBefore = before.rows[0]!.stock_quantity;

  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/cancel`)
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.order_status, 'cancelled');

  // stock should be restored
  const after = await pool.query<{ stock_quantity: number }>('SELECT stock_quantity FROM products WHERE id = $1', [createdProductIds[0]]);
  assert.equal(after.rows[0]!.stock_quantity, stockBefore + 1);
});

test('PATCH /api/admin/orders/:id/cancel — Admin cancels processing order', async () => {
  const orderId = createdOrderIds[1]!;

  // move to processing by approving payment
  await pool.query(`UPDATE orders SET payment_status = 'approved', order_status = 'processing' WHERE id = $1`, [orderId]);

  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/cancel`)
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.order_status, 'cancelled');
});

test('PATCH /api/admin/orders/:id/cancel — cannot cancel shipped order', async () => {
  const orderId = createdOrderIds[2]!;

  // move to shipped
  await pool.query(
    `UPDATE orders SET payment_status = 'approved', order_status = 'shipped', tracking_number = 'TRK123' WHERE id = $1`,
    [orderId]
  );

  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/cancel`)
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 400);
  assert.ok(res.body.error);
});

test('PATCH /api/admin/orders/:id/cancel — Customer returns 403', async () => {
  const res = await request(app)
    .patch(`/api/admin/orders/${createdOrderIds[0]}/cancel`)
    .set('Authorization', `Bearer ${customerToken}`);
  assert.equal(res.status, 403);
});

test('PATCH /api/admin/orders/:id/cancel — no auth returns 401', async () => {
  const res = await request(app).patch(`/api/admin/orders/${createdOrderIds[0]}/cancel`);
  assert.equal(res.status, 401);
});

test('PATCH /api/admin/orders/:id/cancel — nonexistent order returns 404', async () => {
  const res = await request(app)
    .patch('/api/admin/orders/999999/cancel')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(res.status, 404);
});
