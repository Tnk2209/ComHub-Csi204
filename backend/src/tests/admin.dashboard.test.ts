import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

let customerToken: string;
let adminToken: string;

before(async () => {
  await cleanupTestUsers();

  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('cust-dashboard'), password: 'password123', first_name: 'C', last_name: 'U' });
  customerToken = custRes.body.token;

  const adminEmail = uniqueEmail('admin-dashboard');
  const adminRes = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminToken = signToken(adminRes.rows[0]!.id, 'Admin');
});

after(async () => {
  await cleanupTestUsers();
  await closePool();
});

test('GET /api/admin/dashboard — returns 403 for Customer', async () => {
  const res = await request(app)
    .get('/api/admin/dashboard')
    .set('Authorization', `Bearer ${customerToken}`);
  assert.equal(res.status, 403);
});

test('GET /api/admin/dashboard — returns 401 without token', async () => {
  const res = await request(app).get('/api/admin/dashboard');
  assert.equal(res.status, 401);
});

test('GET /api/admin/dashboard — returns aggregated data for Admin', async () => {
  const res = await request(app)
    .get('/api/admin/dashboard')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(res.status, 200);
  assert.ok('total_revenue' in res.body);
  assert.ok('total_orders' in res.body);
  assert.ok('top_products' in res.body);
  assert.ok('low_stock_products' in res.body);
  assert.ok(typeof res.body.total_revenue === 'number');
  assert.ok(Array.isArray(res.body.top_products));
  assert.ok(Array.isArray(res.body.low_stock_products));
});

test('GET /api/admin/dashboard — total_orders has status breakdown', async () => {
  const res = await request(app)
    .get('/api/admin/dashboard')
    .set('Authorization', `Bearer ${adminToken}`);
  const orders = res.body.total_orders;
  assert.ok(typeof orders === 'object');
  assert.ok(typeof orders.total === 'number');
});

test('GET /api/admin/dashboard — low_stock_products only includes stock ≤ 3', async () => {
  const res = await request(app)
    .get('/api/admin/dashboard')
    .set('Authorization', `Bearer ${adminToken}`);
  for (const p of res.body.low_stock_products) {
    assert.ok(p.stock_quantity <= 3, `product ${p.name} has stock ${p.stock_quantity} > 3`);
  }
});
