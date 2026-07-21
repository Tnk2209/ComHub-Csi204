import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

const createdProductIds: number[] = [];
let adminToken: string;
let customerToken: string;

before(async () => {
  await cleanupTestUsers();
  const adminEmail = uniqueEmail('admin-adminlist');
  const adminRes = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminToken = signToken(adminRes.rows[0]!.id, 'Admin');

  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('cust-adminlist'), password: 'password123', first_name: 'C', last_name: 'U' });
  customerToken = custRes.body.token;

  // create one active + one inactive product
  const active = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'TDD-ADMINLIST-active', category: 'RAM', price: 2500, specifications: { ram_type: 'DDR5' } });
  createdProductIds.push(active.body.id);

  const inactive = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'TDD-ADMINLIST-inactive', category: 'RAM', price: 2000, specifications: { ram_type: 'DDR4' } });
  createdProductIds.push(inactive.body.id);
  // deactivate it
  await request(app)
    .patch(`/api/products/${inactive.body.id}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ is_active: false });
});

after(async () => {
  if (createdProductIds.length) {
    await pool.query('DELETE FROM products WHERE id = ANY($1::int[])', [createdProductIds]);
  }
  await cleanupTestUsers();
  await closePool();
});

test('GET /api/admin/products — Admin sees inactive products', async () => {
  const res = await request(app)
    .get('/api/admin/products?include_inactive=true&limit=200')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  const names = res.body.map((p: { name: string }) => p.name);
  assert.ok(names.includes('TDD-ADMINLIST-active'), 'should include active product');
  assert.ok(names.includes('TDD-ADMINLIST-inactive'), 'should include inactive product');
});

test('GET /api/admin/products — without include_inactive still shows all for admin', async () => {
  const res = await request(app)
    .get('/api/admin/products?limit=200')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  // default admin list shows all (active + inactive)
  const names = res.body.map((p: { name: string }) => p.name);
  assert.ok(names.includes('TDD-ADMINLIST-active'));
  assert.ok(names.includes('TDD-ADMINLIST-inactive'));
});

test('GET /api/admin/products — Customer returns 403', async () => {
  const res = await request(app)
    .get('/api/admin/products')
    .set('Authorization', `Bearer ${customerToken}`);
  assert.equal(res.status, 403);
});

test('GET /api/admin/products — no auth returns 401', async () => {
  const res = await request(app).get('/api/admin/products');
  assert.equal(res.status, 401);
});
