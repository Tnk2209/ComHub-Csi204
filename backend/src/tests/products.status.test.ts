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
  const adminEmail = uniqueEmail('admin-status');
  const adminRes = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminToken = signToken(adminRes.rows[0]!.id, 'Admin');

  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('cust-status'), password: 'password123', first_name: 'C', last_name: 'U' });
  customerToken = custRes.body.token;
});

after(async () => {
  if (createdProductIds.length) {
    await pool.query('DELETE FROM products WHERE id = ANY($1::int[])', [createdProductIds]);
  }
  await cleanupTestUsers();
  await closePool();
});

async function createTestProduct(): Promise<number> {
  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: `TDD-STATUS-${Date.now()}`, category: 'GPU', price: 20000, specifications: { tdp: 250 } });
  createdProductIds.push(res.body.id);
  return res.body.id;
}

test('PATCH /api/products/:id/status — Admin deactivates product', async () => {
  const id = await createTestProduct();

  const res = await request(app)
    .patch(`/api/products/${id}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ is_active: false });

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  assert.equal(res.body.id, id);
  assert.equal(res.body.is_active, false);
});

test('PATCH /api/products/:id/status — Admin re-activates product', async () => {
  const id = await createTestProduct();
  // deactivate first
  await request(app)
    .patch(`/api/products/${id}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ is_active: false });

  const res = await request(app)
    .patch(`/api/products/${id}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ is_active: true });

  assert.equal(res.status, 200);
  assert.equal(res.body.is_active, true);
});

test('PATCH /api/products/:id/status — Customer returns 403', async () => {
  const id = await createTestProduct();
  const res = await request(app)
    .patch(`/api/products/${id}/status`)
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ is_active: false });
  assert.equal(res.status, 403);
});

test('PATCH /api/products/:id/status — missing is_active returns 400', async () => {
  const id = await createTestProduct();
  const res = await request(app)
    .patch(`/api/products/${id}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({});
  assert.equal(res.status, 400);
});

test('PATCH /api/products/:id/status — product not found returns 404', async () => {
  const res = await request(app)
    .patch('/api/products/999999/status')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ is_active: false });
  assert.equal(res.status, 404);
});
