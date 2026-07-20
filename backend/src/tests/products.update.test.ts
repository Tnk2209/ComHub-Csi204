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

  const adminEmail = uniqueEmail('admin-update');
  const adminRes = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminToken = signToken(adminRes.rows[0]!.id, 'Admin');

  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('cust-update'), password: 'password123', first_name: 'C', last_name: 'U' });
  customerToken = custRes.body.token;
});

after(async () => {
  if (createdProductIds.length) {
    await pool.query('DELETE FROM products WHERE id = ANY($1::int[])', [createdProductIds]);
  }
  await cleanupTestUsers();
  await closePool();
});

async function createTestProduct(overrides: Record<string, unknown> = {}): Promise<number> {
  const body = {
    name: `TDD-UPDATE test-${Date.now()}`,
    category: 'CPU',
    price: 15000,
    stock_quantity: 10,
    specifications: { socket: 'LGA1700', tdp: 125 },
    ...overrides,
  };
  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(body);
  createdProductIds.push(res.body.id);
  return res.body.id;
}

// --- PUT success ---
test('PUT /api/products/:id — Admin updates product returns 200 + updated data', async () => {
  const id = await createTestProduct();

  const updated = {
    name: 'TDD-UPDATE Intel i7-14700K',
    category: 'CPU',
    price: 18900,
    stock_quantity: 20,
    image_url: '/images/updated.webp',
    specifications: { socket: 'LGA1700', tdp: 253 },
  };

  const res = await request(app)
    .put(`/api/products/${id}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send(updated);

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  assert.equal(res.body.id, id);
  assert.equal(res.body.name, updated.name);
  assert.equal(res.body.category, 'CPU');
  assert.equal(Number(res.body.price), 18900);
  assert.equal(res.body.stock_quantity, 20);
  assert.equal(res.body.image_url, '/images/updated.webp');
  assert.deepEqual(res.body.specifications, updated.specifications);
});

// --- PUT RBAC ---
test('PUT /api/products/:id — Customer token returns 403', async () => {
  const id = await createTestProduct();

  const res = await request(app)
    .put(`/api/products/${id}`)
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ name: 'hacked', category: 'CPU', price: 1, specifications: { socket: 'X', tdp: 1 } });

  assert.equal(res.status, 403);
});

test('PUT /api/products/:id — No auth returns 401', async () => {
  const id = await createTestProduct();
  const res = await request(app)
    .put(`/api/products/${id}`)
    .send({ name: 'hacked', category: 'CPU', price: 1, specifications: { socket: 'X', tdp: 1 } });
  assert.equal(res.status, 401);
});

// --- PUT validation ---
test('PUT /api/products/:id — invalid category returns 400', async () => {
  const id = await createTestProduct();

  const res = await request(app)
    .put(`/api/products/${id}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'test', category: 'Keyboard', price: 100, specifications: {} });

  assert.equal(res.status, 400);
  assert.match(res.body.message, /category/);
});

test('PUT /api/products/:id — missing required spec keys for CPU returns 400', async () => {
  const id = await createTestProduct();

  const res = await request(app)
    .put(`/api/products/${id}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'test', category: 'CPU', price: 100, specifications: { cores: 8 } });

  assert.equal(res.status, 400, `expected 400, got ${res.status}: ${res.text}`);
  assert.match(res.body.message, /socket|tdp/);
});

test('PUT /api/products/:id — Mainboard requires socket + form_factor + supported_ram', async () => {
  const id = await createTestProduct();

  const res = await request(app)
    .put(`/api/products/${id}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'test', category: 'Mainboard', price: 100, specifications: { socket: 'LGA1700' } });

  assert.equal(res.status, 400, `expected 400, got ${res.status}: ${res.text}`);
  assert.match(res.body.message, /form_factor|supported_ram/);
});

// --- PUT not found ---
test('PUT /api/products/999999 — returns 404', async () => {
  const res = await request(app)
    .put('/api/products/999999')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'ghost', category: 'CPU', price: 1, specifications: { socket: 'X', tdp: 1 } });

  assert.equal(res.status, 404);
});
