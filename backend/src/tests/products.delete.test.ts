import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

const createdProductIds: number[] = [];
let adminToken: string;
let adminUserId: number;
let customerToken: string;

before(async () => {
  await cleanupTestUsers();
  const adminEmail = uniqueEmail('admin-delete');
  const adminRes = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminUserId = adminRes.rows[0]!.id;
  adminToken = signToken(adminUserId, 'Admin');

  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('cust-delete'), password: 'password123', first_name: 'C', last_name: 'U' });
  customerToken = custRes.body.token;
});

after(async () => {
  // clean up any remaining test products
  if (createdProductIds.length) {
    await pool.query('DELETE FROM order_items WHERE product_id = ANY($1::int[])', [createdProductIds]);
    await pool.query('DELETE FROM products WHERE id = ANY($1::int[])', [createdProductIds]);
  }
  await pool.query('DELETE FROM orders WHERE user_id = $1', [adminUserId]);
  await cleanupTestUsers();
  await closePool();
});

async function createTestProduct(): Promise<number> {
  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: `TDD-DEL-${Date.now()}`, category: 'PSU', price: 3500, specifications: { wattage: 750 } });
  createdProductIds.push(res.body.id);
  return res.body.id;
}

test('DELETE /api/products/:id — Admin deletes unreferenced product returns 204', async () => {
  const id = await createTestProduct();

  const res = await request(app)
    .delete(`/api/products/${id}`)
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 204, `expected 204, got ${res.status}: ${res.text}`);

  // confirm gone
  const check = await request(app).get(`/api/products/${id}`);
  assert.equal(check.status, 404);
});

test('DELETE /api/products/:id — product with order_items returns 409', async () => {
  const id = await createTestProduct();

  // create an order referencing this product
  const orderRes = await pool.query<{ id: number }>(
    `INSERT INTO orders (user_id, total_price, shipping_address) VALUES ($1, 3500, 'test addr') RETURNING id`,
    [adminUserId]
  );
  await pool.query(
    `INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) VALUES ($1, $2, 1, 3500)`,
    [orderRes.rows[0]!.id, id]
  );

  const res = await request(app)
    .delete(`/api/products/${id}`)
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 409, `expected 409, got ${res.status}: ${res.text}`);
  assert.match(res.body.message, /order/i);
});

test('DELETE /api/products/:id — Customer returns 403', async () => {
  const id = await createTestProduct();
  const res = await request(app)
    .delete(`/api/products/${id}`)
    .set('Authorization', `Bearer ${customerToken}`);
  assert.equal(res.status, 403);
});

test('DELETE /api/products/:id — not found returns 404', async () => {
  const res = await request(app)
    .delete('/api/products/999999')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(res.status, 404);
});
