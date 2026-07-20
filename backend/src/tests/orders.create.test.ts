import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

let customerToken: string;
let customerUserId: number;
let adminToken: string;
let productA: { id: number; price: number };
let productB: { id: number; price: number };
const createdProductIds: number[] = [];
const createdOrderIds: number[] = [];

before(async () => {
  await cleanupTestUsers();

  // create customer
  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('cust-order'), password: 'password123', first_name: 'C', last_name: 'U' });
  customerToken = custRes.body.token;
  customerUserId = custRes.body.user.id;

  // create admin
  const adminEmail = uniqueEmail('admin-order');
  const adminRes = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminToken = signToken(adminRes.rows[0]!.id, 'Admin');

  // create test products with known stock
  const resA = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'TDD-ORDER Product A', category: 'CPU', price: 10000, stock_quantity: 5, specifications: { socket: 'AM5', tdp: 105 } });
  productA = { id: resA.body.id, price: 10000 };
  createdProductIds.push(resA.body.id);

  const resB = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'TDD-ORDER Product B', category: 'GPU', price: 25000, stock_quantity: 2, specifications: { tdp: 300 } });
  productB = { id: resB.body.id, price: 25000 };
  createdProductIds.push(resB.body.id);
});

after(async () => {
  if (createdOrderIds.length) {
    await pool.query('DELETE FROM order_logs WHERE order_id = ANY($1::int[])', [createdOrderIds]);
    await pool.query('DELETE FROM order_items WHERE order_id = ANY($1::int[])', [createdOrderIds]);
    await pool.query('DELETE FROM orders WHERE id = ANY($1::int[])', [createdOrderIds]);
  }
  if (createdProductIds.length) {
    await pool.query('DELETE FROM products WHERE id = ANY($1::int[])', [createdProductIds]);
  }
  await cleanupTestUsers();
  await closePool();
});

// --- Tracer bullet: happy path ---
test('POST /api/orders — Customer creates order, stock deducted, returns 201', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({
      items: [
        { product_id: productA.id, quantity: 2 },
        { product_id: productB.id, quantity: 1 },
      ],
      shipping_address: '123 Test St, Bangkok 10110',
    });

  assert.equal(res.status, 201, `expected 201, got ${res.status}: ${res.text}`);
  createdOrderIds.push(res.body.id);

  // verify order fields
  assert.equal(res.body.user_id, customerUserId);
  assert.equal(Number(res.body.total_price), 10000 * 2 + 25000 * 1); // 45000
  assert.equal(res.body.order_status, 'pending_payment');
  assert.equal(res.body.payment_status, 'pending');
  assert.equal(res.body.shipping_address, '123 Test St, Bangkok 10110');

  // verify items in response
  assert.equal(res.body.items.length, 2);
  const itemA = res.body.items.find((i: any) => i.product_id === productA.id);
  assert.equal(itemA.quantity, 2);
  assert.equal(Number(itemA.price_per_unit), 10000);

  // verify stock was deducted
  const stockA = await pool.query('SELECT stock_quantity FROM products WHERE id = $1', [productA.id]);
  assert.equal(stockA.rows[0]!.stock_quantity, 3); // was 5, bought 2

  const stockB = await pool.query('SELECT stock_quantity FROM products WHERE id = $1', [productB.id]);
  assert.equal(stockB.rows[0]!.stock_quantity, 1); // was 2, bought 1

  // verify order_log created
  const logs = await pool.query('SELECT * FROM order_logs WHERE order_id = $1', [res.body.id]);
  assert.equal(logs.rows.length, 1);
  assert.equal(logs.rows[0]!.status, 'Order Created');
  assert.equal(logs.rows[0]!.changed_by_user_id, customerUserId);
});

// --- Stock insufficient ---
test('POST /api/orders — insufficient stock returns 400 and does not deduct', async () => {
  // productB now has 1 stock (deducted from previous test), try to buy 5
  const res = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({
      items: [{ product_id: productB.id, quantity: 5 }],
      shipping_address: 'Addr',
    });

  assert.equal(res.status, 400, `expected 400, got ${res.status}: ${res.text}`);
  assert.match(res.body.message, /stock/i);

  // stock unchanged
  const stockB = await pool.query('SELECT stock_quantity FROM products WHERE id = $1', [productB.id]);
  assert.equal(stockB.rows[0]!.stock_quantity, 1);
});

// --- RBAC ---
test('POST /api/orders — Admin cannot create order (403)', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      items: [{ product_id: productA.id, quantity: 1 }],
      shipping_address: 'Addr',
    });
  assert.equal(res.status, 403);
});

test('POST /api/orders — no auth returns 401', async () => {
  const res = await request(app)
    .post('/api/orders')
    .send({ items: [{ product_id: productA.id, quantity: 1 }], shipping_address: 'Addr' });
  assert.equal(res.status, 401);
});

// --- Validation ---
test('POST /api/orders — empty items returns 400', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ items: [], shipping_address: 'Addr' });
  assert.equal(res.status, 400);
});

test('POST /api/orders — missing shipping_address returns 400', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ items: [{ product_id: productA.id, quantity: 1 }] });
  assert.equal(res.status, 400);
});

test('POST /api/orders — invalid product_id returns 400', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ items: [{ product_id: 999999, quantity: 1 }], shipping_address: 'Addr' });
  assert.equal(res.status, 400);
});
