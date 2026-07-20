import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { closePool } from './helpers';

after(closePool);

test('GET /api/products/:id — returns product with JSONB specifications', async () => {
  // Seed row is CPU id=1 (Intel Core i5-14600K)
  const res = await request(app).get('/api/products/1');

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  assert.equal(res.body.id, 1);
  assert.equal(res.body.category, 'CPU');
  assert.ok(res.body.specifications, 'must include specifications');
  assert.equal(typeof res.body.specifications.socket, 'string');
  assert.equal(typeof res.body.specifications.tdp, 'number');
  assert.ok(Array.isArray(res.body.specifications.supported_ram));
});

test('GET /api/products/:id — returns 404 for missing id', async () => {
  const res = await request(app).get('/api/products/999999');
  assert.equal(res.status, 404, `expected 404, got ${res.status}: ${res.text}`);
});

test('GET /api/products/:id — returns 400 for non-numeric id', async () => {
  const res = await request(app).get('/api/products/abc');
  assert.equal(res.status, 400);
});

test('GET /api/products/:id — returns inactive product (for order history)', async () => {
  const insert = await pool.query<{ id: number }>(
    `INSERT INTO products (name, category, price, stock_quantity, specifications, is_active)
     VALUES ('TDD-INACTIVE-DETAIL', 'GPU', 1.00, 0, '{}', FALSE)
     RETURNING id`
  );
  const inactiveId = insert.rows[0]!.id;

  try {
    const res = await request(app).get(`/api/products/${inactiveId}`);
    assert.equal(res.status, 200, 'inactive products must still be fetchable by id');
    assert.equal(res.body.id, inactiveId);
    assert.equal(res.body.is_active, false);
  } finally {
    await pool.query('DELETE FROM products WHERE id = $1', [inactiveId]);
  }
});
