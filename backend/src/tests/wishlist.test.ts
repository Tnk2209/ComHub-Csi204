import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

let customerTokenStr: string;
let adminTokenStr: string;
let testProductId: number;

before(async () => {
  await cleanupTestUsers();

  // Create a customer
  const custEmail = uniqueEmail('cust-wishlist');
  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ email: custEmail, password: 'password123', first_name: 'W', last_name: 'C' });
  customerTokenStr = custRes.body.token;

  // Create an admin
  const adminEmail = uniqueEmail('admin-wishlist');
  const adminResult = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminTokenStr = signToken(adminResult.rows[0]!.id, 'Admin');

  // Create a test product
  const prodRes = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminTokenStr}`)
    .send({
      name: 'TDD-Wishlist Test CPU',
      category: 'CPU',
      price: 9999,
      stock_quantity: 10,
      specifications: { socket: 'LGA1700', tdp: 125 },
    });
  testProductId = prodRes.body.id;
});

after(async () => {
  await pool.query('DELETE FROM wishlist_items WHERE product_id = $1', [testProductId]);
  await pool.query('DELETE FROM products WHERE id = $1', [testProductId]);
  await cleanupTestUsers();
  await closePool();
});

test('POST /api/wishlist — Customer adds product → 201', async () => {
  const res = await request(app)
    .post('/api/wishlist')
    .set('Authorization', `Bearer ${customerTokenStr}`)
    .send({ product_id: testProductId });

  assert.equal(res.status, 201);
  assert.equal(res.body.product_id, testProductId);
  assert.equal(res.body.is_alert_enabled, false);
});

test('POST /api/wishlist — Duplicate product → 409', async () => {
  const res = await request(app)
    .post('/api/wishlist')
    .set('Authorization', `Bearer ${customerTokenStr}`)
    .send({ product_id: testProductId });

  assert.equal(res.status, 409);
});

test('POST /api/wishlist — Non-existent product → 404', async () => {
  const res = await request(app)
    .post('/api/wishlist')
    .set('Authorization', `Bearer ${customerTokenStr}`)
    .send({ product_id: 999999 });

  assert.equal(res.status, 404);
});

test('POST /api/wishlist — No auth → 401', async () => {
  const res = await request(app)
    .post('/api/wishlist')
    .send({ product_id: testProductId });

  assert.equal(res.status, 401);
});

test('GET /api/wishlist — Returns user wishlist with product info', async () => {
  const res = await request(app)
    .get('/api/wishlist')
    .set('Authorization', `Bearer ${customerTokenStr}`);

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length >= 1);
  const item = res.body.find((i: any) => i.product_id === testProductId);
  assert.ok(item);
  assert.ok(item.product_name);
  assert.ok(item.product_price !== undefined);
});

test('PATCH /api/wishlist/:product_id/alert — Toggle alert → 200', async () => {
  const res = await request(app)
    .patch(`/api/wishlist/${testProductId}/alert`)
    .set('Authorization', `Bearer ${customerTokenStr}`)
    .send({ is_alert_enabled: true });

  assert.equal(res.status, 200);
  assert.equal(res.body.is_alert_enabled, true);
});

test('PATCH /api/wishlist/:product_id/alert — Toggle back to false', async () => {
  const res = await request(app)
    .patch(`/api/wishlist/${testProductId}/alert`)
    .set('Authorization', `Bearer ${customerTokenStr}`)
    .send({ is_alert_enabled: false });

  assert.equal(res.status, 200);
  assert.equal(res.body.is_alert_enabled, false);
});

test('DELETE /api/wishlist/:product_id — Removes from wishlist → 204', async () => {
  const res = await request(app)
    .delete(`/api/wishlist/${testProductId}`)
    .set('Authorization', `Bearer ${customerTokenStr}`);

  assert.equal(res.status, 204);
});

test('DELETE /api/wishlist/:product_id — Not in wishlist → 404', async () => {
  const res = await request(app)
    .delete(`/api/wishlist/${testProductId}`)
    .set('Authorization', `Bearer ${customerTokenStr}`);

  assert.equal(res.status, 404);
});
