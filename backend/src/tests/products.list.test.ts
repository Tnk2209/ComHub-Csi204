import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { closePool } from './helpers';

after(closePool);

test('GET /api/products — returns array of active products (seeded)', async () => {
  const res = await request(app).get('/api/products');

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  assert.ok(Array.isArray(res.body), 'response should be an array');
  assert.ok(res.body.length > 0, 'should return at least one seeded product');

  const p = res.body[0];
  assert.equal(typeof p.id, 'number');
  assert.equal(typeof p.name, 'string');
  assert.equal(typeof p.category, 'string');
  assert.ok(p.specifications, 'each product should include specifications JSONB');
  assert.equal(typeof p.specifications, 'object');
});

test('GET /api/products?category=CPU — returns only CPUs (5 seeded)', async () => {
  const res = await request(app).get('/api/products?category=CPU');

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length >= 5, `expected ≥5 CPUs, got ${res.body.length}`);
  for (const p of res.body) {
    assert.equal(p.category, 'CPU', `product ${p.id} has wrong category: ${p.category}`);
  }
});

test('GET /api/products?category=BadCategory — returns 400', async () => {
  const res = await request(app).get('/api/products?category=BadCategory');
  assert.equal(res.status, 400, `expected 400, got ${res.status}: ${res.text}`);
});

test('GET /api/products?q=Intel — full-text search finds 3 Intel CPUs', async () => {
  const res = await request(app).get('/api/products?q=Intel');

  assert.equal(res.status, 200);
  assert.ok(res.body.length >= 3, `expected ≥3 hits for "Intel", got ${res.body.length}`);
  for (const p of res.body) {
    assert.ok(
      p.name.toLowerCase().includes('intel'),
      `search result should mention "intel", got: ${p.name}`
    );
  }
});

test('GET /api/products?q=nomatch-xyz-12345 — returns empty array', async () => {
  const res = await request(app).get('/api/products?q=nomatch-xyz-12345');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, []);
});

test('GET /api/products?limit=5 — returns at most 5 items', async () => {
  const res = await request(app).get('/api/products?limit=5');
  assert.equal(res.status, 200);
  assert.equal(res.body.length, 5);
});

test('GET /api/products?limit=5&offset=5 — different page than offset=0', async () => {
  const page1 = await request(app).get('/api/products?limit=5&offset=0');
  const page2 = await request(app).get('/api/products?limit=5&offset=5');
  assert.equal(page1.status, 200);
  assert.equal(page2.status, 200);
  assert.equal(page1.body.length, 5);
  assert.equal(page2.body.length, 5);
  const ids1 = new Set(page1.body.map((p: { id: number }) => p.id));
  for (const p of page2.body) {
    assert.ok(!ids1.has(p.id), `page 2 id ${p.id} should not appear in page 1`);
  }
});

test('GET /api/products?limit=abc — returns 400 on non-numeric limit', async () => {
  const res = await request(app).get('/api/products?limit=abc');
  assert.equal(res.status, 400);
});

test('GET /api/products — excludes inactive products (is_active=false)', async () => {
  const { pool } = await import('../config/db');
  const insert = await pool.query<{ id: number }>(
    `INSERT INTO products (name, category, price, stock_quantity, specifications, is_active)
     VALUES ('TDD-INACTIVE-CPU', 'CPU', 100.00, 0, '{}', FALSE)
     RETURNING id`
  );
  const inactiveId = insert.rows[0]!.id;

  try {
    const res = await request(app).get('/api/products?limit=100');
    assert.equal(res.status, 200);
    const ids = res.body.map((p: { id: number }) => p.id);
    assert.ok(!ids.includes(inactiveId), `inactive product ${inactiveId} should not appear`);
  } finally {
    await pool.query('DELETE FROM products WHERE id = $1', [inactiveId]);
  }
});
