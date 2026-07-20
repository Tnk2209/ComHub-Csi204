import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

let customerToken: string;
let adminToken: string;
let adminUserId: number;
let productId: number;
const createdOrderIds: number[] = [];

const MOCK_SLIP = 'data:image/webp;base64,UklGRlYAAABXRUJQ';

before(async () => {
  await cleanupTestUsers();

  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('cust-review'), password: 'password123', first_name: 'C', last_name: 'U' });
  customerToken = custRes.body.token;

  const adminEmail = uniqueEmail('admin-review');
  const adminRes = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminUserId = adminRes.rows[0]!.id;
  adminToken = signToken(adminUserId, 'Admin');

  const prodRes = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'TDD-REVIEW prod', category: 'PSU', price: 4000, stock_quantity: 10, specifications: { wattage: 850 } });
  productId = prodRes.body.id;
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

async function createOrderWithSlip(qty = 2): Promise<number> {
  const orderRes = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ items: [{ product_id: productId, quantity: qty }], shipping_address: 'Review addr' });
  const orderId = orderRes.body.id;
  createdOrderIds.push(orderId);

  await request(app)
    .patch(`/api/orders/${orderId}/payment`)
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ payment_slip: MOCK_SLIP });

  return orderId;
}

// ==================== APPROVE ====================
test('PATCH /api/admin/orders/:id/approve-payment — Admin approves, status changes', async () => {
  const orderId = await createOrderWithSlip(1);

  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/approve-payment`)
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  assert.equal(res.body.payment_status, 'approved');
  assert.equal(res.body.order_status, 'paid');

  // verify order_log
  const logs = await pool.query(
    `SELECT status FROM order_logs WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [orderId]
  );
  assert.equal(logs.rows[0]!.status, 'Payment Approved');
});

test('PATCH /api/admin/orders/:id/approve-payment — Customer returns 403', async () => {
  const orderId = await createOrderWithSlip(1);
  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/approve-payment`)
    .set('Authorization', `Bearer ${customerToken}`);
  assert.equal(res.status, 403);
});

// ==================== REJECT ====================
test('PATCH /api/admin/orders/:id/reject-payment — Admin rejects, stock restored', async () => {
  const stockBefore = await pool.query<{ stock_quantity: number }>('SELECT stock_quantity FROM products WHERE id = $1', [productId]);
  const beforeQty = stockBefore.rows[0]!.stock_quantity;

  const orderId = await createOrderWithSlip(2);

  // stock should have decreased by 2
  const stockAfterOrder = await pool.query<{ stock_quantity: number }>('SELECT stock_quantity FROM products WHERE id = $1', [productId]);
  assert.equal(stockAfterOrder.rows[0]!.stock_quantity, beforeQty - 2);

  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/reject-payment`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ reason: 'Slip is blurry' });

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  assert.equal(res.body.payment_status, 'rejected');
  assert.equal(res.body.order_status, 'cancelled');

  // stock restored
  const stockAfterReject = await pool.query<{ stock_quantity: number }>('SELECT stock_quantity FROM products WHERE id = $1', [productId]);
  assert.equal(stockAfterReject.rows[0]!.stock_quantity, beforeQty);

  // verify order_log
  const logs = await pool.query(
    `SELECT status FROM order_logs WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [orderId]
  );
  assert.equal(logs.rows[0]!.status, 'Payment Rejected: Slip is blurry');
});

test('PATCH /api/admin/orders/:id/reject-payment — Customer returns 403', async () => {
  const orderId = await createOrderWithSlip(1);
  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/reject-payment`)
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ reason: 'test' });
  assert.equal(res.status, 403);
});

// ==================== STATUS TRANSITIONS ====================
test('PATCH /api/admin/orders/:id/status — processing → shipped (with tracking)', async () => {
  const orderId = await createOrderWithSlip(1);
  // approve first
  await request(app)
    .patch(`/api/admin/orders/${orderId}/approve-payment`)
    .set('Authorization', `Bearer ${adminToken}`);

  // transition to processing first
  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ order_status: 'processing' });

  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ order_status: 'shipped', tracking_number: 'TH123456789' });

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  assert.equal(res.body.order_status, 'shipped');
  assert.equal(res.body.tracking_number, 'TH123456789');
});

test('PATCH /api/admin/orders/:id/status — shipped → delivered', async () => {
  const orderId = await createOrderWithSlip(1);
  await request(app)
    .patch(`/api/admin/orders/${orderId}/approve-payment`)
    .set('Authorization', `Bearer ${adminToken}`);

  // transition to processing first
  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ order_status: 'processing' });
  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ order_status: 'shipped', tracking_number: 'TH999' });

  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ order_status: 'delivered' });

  assert.equal(res.status, 200);
  assert.equal(res.body.order_status, 'delivered');
});

test('PATCH /api/admin/orders/:id/status — shipped without tracking_number returns 400', async () => {
  const orderId = await createOrderWithSlip(1);
  await request(app)
    .patch(`/api/admin/orders/${orderId}/approve-payment`)
    .set('Authorization', `Bearer ${adminToken}`);

  // transition to processing first
  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ order_status: 'processing' });

  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ order_status: 'shipped' });

  assert.equal(res.status, 400, `expected 400, got ${res.status}: ${res.text}`);
  assert.match(res.body.message, /tracking_number/);
});

test('PATCH /api/admin/orders/:id/status — backward transition returns 400', async () => {
  const orderId = await createOrderWithSlip(1);
  await request(app)
    .patch(`/api/admin/orders/${orderId}/approve-payment`)
    .set('Authorization', `Bearer ${adminToken}`);

  // transition to processing first
  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ order_status: 'processing' });
  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ order_status: 'shipped', tracking_number: 'TH111' });

  // try to go back to processing
  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ order_status: 'processing' });

  assert.equal(res.status, 400);
  assert.match(res.body.message, /transition/i);
});

test('PATCH /api/admin/orders/:id/status — Customer returns 403', async () => {
  const orderId = await createOrderWithSlip(1);
  const res = await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ order_status: 'shipped', tracking_number: 'X' });
  assert.equal(res.status, 403);
});
