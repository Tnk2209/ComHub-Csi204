import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

let adminToken: string;
const createdIds: number[] = [];

before(async () => {
  await cleanupTestUsers();

  const adminEmail = uniqueEmail('admin-bycat');
  const adminResult = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminToken = signToken(adminResult.rows[0]!.id, 'Admin');

  // Create test products: 2 active CPUs, 1 inactive CPU, 1 active GPU
  const products = [
    { name: 'TDD-Cat Active CPU A', category: 'CPU', price: 5000, stock_quantity: 10, specifications: { socket: 'AM5', tdp: 65 } },
    { name: 'TDD-Cat Active CPU B', category: 'CPU', price: 8000, stock_quantity: 5, specifications: { socket: 'LGA1700', tdp: 125 } },
    { name: 'TDD-Cat Inactive CPU', category: 'CPU', price: 3000, stock_quantity: 0, specifications: { socket: 'AM4', tdp: 95 } },
    { name: 'TDD-Cat Active GPU', category: 'GPU', price: 20000, stock_quantity: 3, specifications: { tdp: 300 } },
  ];

  for (const p of products) {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(p);
    createdIds.push(res.body.id);
  }

  // Deactivate the 3rd product (inactive CPU)
  await request(app)
    .patch(`/api/products/${createdIds[2]}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ is_active: false });
});

after(async () => {
  if (createdIds.length) {
    await pool.query('DELETE FROM products WHERE id = ANY($1::int[])', [createdIds]);
  }
  await cleanupTestUsers();
  await closePool();
});

test('GET /api/products/by-category/CPU — Returns only active CPUs', async () => {
  const res = await request(app).get('/api/products/by-category/CPU');

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  // Should include our 2 active CPUs (may also include seed data CPUs)
  const ours = res.body.filter((p: any) => p.name.startsWith('TDD-Cat'));
  assert.equal(ours.length, 2);
  // Should NOT include the inactive one
  assert.ok(!res.body.some((p: any) => p.name === 'TDD-Cat Inactive CPU'));
});

test('GET /api/products/by-category/CPU — Sorted by name', async () => {
  const res = await request(app).get('/api/products/by-category/CPU');

  assert.equal(res.status, 200);
  const names = res.body.map((p: any) => p.name);
  const sorted = [...names].sort((a: string, b: string) => a.localeCompare(b));
  assert.deepEqual(names, sorted);
});

test('GET /api/products/by-category/CPU — Includes specifications JSONB', async () => {
  const res = await request(app).get('/api/products/by-category/CPU');

  assert.equal(res.status, 200);
  const product = res.body.find((p: any) => p.name === 'TDD-Cat Active CPU A');
  assert.ok(product);
  assert.equal(product.specifications.socket, 'AM5');
  assert.equal(product.specifications.tdp, 65);
  assert.ok(product.id);
  assert.ok(product.price);
  assert.ok(product.image_url !== undefined);
  assert.ok(product.stock_quantity !== undefined);
});

test('GET /api/products/by-category/GPU — Returns only GPU products', async () => {
  const res = await request(app).get('/api/products/by-category/GPU');

  assert.equal(res.status, 200);
  assert.ok(res.body.every((p: any) => p.category === 'GPU'));
  const ours = res.body.filter((p: any) => p.name === 'TDD-Cat Active GPU');
  assert.equal(ours.length, 1);
});

test('GET /api/products/by-category/InvalidCategory — Returns empty array', async () => {
  const res = await request(app).get('/api/products/by-category/Keyboard');

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.equal(res.body.length, 0);
});

test('GET /api/products/by-category/CPU — Public (no auth needed)', async () => {
  const res = await request(app).get('/api/products/by-category/CPU');
  assert.equal(res.status, 200);
});
