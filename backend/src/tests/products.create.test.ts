import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

const createdIds: number[] = [];

before(cleanupTestUsers);
after(async () => {
  if (createdIds.length) {
    await pool.query('DELETE FROM products WHERE id = ANY($1::int[])', [createdIds]);
  }
  await cleanupTestUsers();
  await closePool();
});

async function customerToken(): Promise<string> {
  const email = uniqueEmail('cust-createprod');
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'password123', first_name: 'C', last_name: 'U' });
  return res.body.token as string;
}

async function adminToken(): Promise<string> {
  const email = uniqueEmail('admin-createprod');
  const result = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [email]
  );
  return signToken(result.rows[0]!.id, 'Admin');
}

const validBody = {
  name: 'TDD-CREATE Intel i9-14900KS',
  category: 'CPU',
  price: 25900,
  stock_quantity: 5,
  image_url: '/images/products/tdd-i9.webp',
  specifications: { socket: 'LGA1700', tdp: 150, supported_ram: ['DDR4', 'DDR5'] },
};

test('POST /api/products — Admin creates product returns 201 + created row', async () => {
  const token = await adminToken();

  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send(validBody);

  assert.equal(res.status, 201, `expected 201, got ${res.status}: ${res.text}`);
  assert.equal(typeof res.body.id, 'number');
  assert.equal(res.body.name, validBody.name);
  assert.equal(res.body.category, 'CPU');
  assert.equal(Number(res.body.price), 25900);
  assert.equal(res.body.stock_quantity, 5);
  assert.deepEqual(res.body.specifications, validBody.specifications);
  assert.equal(res.body.is_active, true);
  createdIds.push(res.body.id);
});

test('POST /api/products — Customer token returns 403', async () => {
  const token = await customerToken();

  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...validBody, name: 'TDD-CREATE customer-attempt' });

  assert.equal(res.status, 403, `expected 403, got ${res.status}: ${res.text}`);
});

test('POST /api/products — no auth returns 401', async () => {
  const res = await request(app).post('/api/products').send(validBody);
  assert.equal(res.status, 401);
});

test('POST /api/products — missing name returns 400', async () => {
  const token = await adminToken();
  const { name: _n, ...noName } = validBody;
  void _n;

  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send(noName);

  assert.equal(res.status, 400, `expected 400, got ${res.status}: ${res.text}`);
});

test('POST /api/products — invalid category returns 400', async () => {
  const token = await adminToken();

  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...validBody, name: 'TDD-CREATE bad-cat', category: 'Keyboard' });

  assert.equal(res.status, 400);
});

test('POST /api/products — negative price returns 400', async () => {
  const token = await adminToken();

  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...validBody, name: 'TDD-CREATE neg-price', price: -100 });

  assert.equal(res.status, 400);
});
