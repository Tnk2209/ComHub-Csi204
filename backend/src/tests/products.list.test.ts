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

test('GET /api/products — returns X-Total-Count header', async () => {
  const res = await request(app).get('/api/products?limit=5');
  assert.equal(res.status, 200);
  assert.ok(res.headers['x-total-count'], 'X-Total-Count header should be present');
  const count = parseInt(res.headers['x-total-count'], 10);
  assert.ok(count >= 5, `expected X-Total-Count >= 5, got ${count}`);
});

test('GET /api/products?min_price=10000&max_price=20000 — filters price range', async () => {
  const res = await request(app).get('/api/products?min_price=10000&max_price=20000');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  for (const p of res.body) {
    const price = Number(p.price);
    assert.ok(price >= 10000 && price <= 20000, `price ${price} should be between 10000 and 20000`);
  }
});

test('GET /api/products?in_stock=true — filters out out-of-stock items', async () => {
  const res = await request(app).get('/api/products?in_stock=true');
  assert.equal(res.status, 200);
  for (const p of res.body) {
    assert.ok(p.stock_quantity > 0, `product ${p.id} stock should be > 0, got ${p.stock_quantity}`);
  }
});

test('GET /api/products?sort=price_asc — sorts by price ascending', async () => {
  const res = await request(app).get('/api/products?sort=price_asc&limit=10');
  assert.equal(res.status, 200);
  for (let i = 1; i < res.body.length; i++) {
    const prev = Number(res.body[i - 1].price);
    const curr = Number(res.body[i].price);
    assert.ok(prev <= curr, `expected ${prev} <= ${curr} for price_asc`);
  }
});

test('GET /api/products?sort=price_desc — sorts by price descending', async () => {
  const res = await request(app).get('/api/products?sort=price_desc&limit=10');
  assert.equal(res.status, 200);
  for (let i = 1; i < res.body.length; i++) {
    const prev = Number(res.body[i - 1].price);
    const curr = Number(res.body[i].price);
    assert.ok(prev >= curr, `expected ${prev} >= ${curr} for price_desc`);
  }
});

test('GET /api/products?sort=name_asc — sorts by name ascending', async () => {
  const res = await request(app).get('/api/products?sort=name_asc&limit=10');
  assert.equal(res.status, 200);
  for (let i = 1; i < res.body.length; i++) {
    const prev = res.body[i - 1].name;
    const curr = res.body[i].name;
    assert.ok(prev.localeCompare(curr) <= 0, `expected "${prev}" <= "${curr}" for name_asc`);
  }
});

test('GET /api/products?brand=Intel,AMD — supports comma-separated brand filter', async () => {
  const res = await request(app).get('/api/products?brand=Intel,AMD');
  assert.equal(res.status, 200);
  assert.ok(res.body.length > 0);
  for (const p of res.body) {
    assert.ok(['Intel', 'AMD'].includes(p.brand), `brand should be Intel or AMD, got ${p.brand}`);
  }
});

