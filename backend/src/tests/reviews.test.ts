import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

let customer1Token: string;
let customer2Token: string;
let adminToken: string;
let testProductId: number;
let createdReviewId: number;

before(async () => {
  await cleanupTestUsers();

  // Customer 1
  const c1 = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('cust1-review'), password: 'pass123', first_name: 'R', last_name: 'One' });
  customer1Token = c1.body.token;

  // Customer 2
  const c2 = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('cust2-review'), password: 'pass123', first_name: 'R', last_name: 'Two' });
  customer2Token = c2.body.token;

  // Admin
  const adminEmail = uniqueEmail('admin-review');
  const adminResult = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminToken = signToken(adminResult.rows[0]!.id, 'Admin');

  // Test product
  const prodRes = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'TDD-Review Test GPU',
      category: 'GPU',
      price: 15000,
      stock_quantity: 5,
      specifications: { tdp: 250 },
    });
  testProductId = prodRes.body.id;
});

after(async () => {
  await pool.query('DELETE FROM reviews WHERE product_id = $1', [testProductId]);
  await pool.query('DELETE FROM products WHERE id = $1', [testProductId]);
  await cleanupTestUsers();
  await closePool();
});

test('POST /api/products/:id/reviews — Customer creates review → 201', async () => {
  const res = await request(app)
    .post(`/api/products/${testProductId}/reviews`)
    .set('Authorization', `Bearer ${customer1Token}`)
    .send({ rating: 5, comment: 'Excellent GPU!' });

  assert.equal(res.status, 201);
  assert.equal(res.body.rating, 5);
  assert.equal(res.body.comment, 'Excellent GPU!');
  assert.ok(res.body.id);
  createdReviewId = res.body.id;
});

test('POST /api/products/:id/reviews — Duplicate (same user+product) → 409', async () => {
  const res = await request(app)
    .post(`/api/products/${testProductId}/reviews`)
    .set('Authorization', `Bearer ${customer1Token}`)
    .send({ rating: 4, comment: 'Another review' });

  assert.equal(res.status, 409);
});

test('POST /api/products/:id/reviews — Invalid rating (0) → 400', async () => {
  const res = await request(app)
    .post(`/api/products/${testProductId}/reviews`)
    .set('Authorization', `Bearer ${customer2Token}`)
    .send({ rating: 0, comment: 'Bad rating' });

  assert.equal(res.status, 400);
});

test('POST /api/products/:id/reviews — Invalid rating (6) → 400', async () => {
  const res = await request(app)
    .post(`/api/products/${testProductId}/reviews`)
    .set('Authorization', `Bearer ${customer2Token}`)
    .send({ rating: 6, comment: 'Too high' });

  assert.equal(res.status, 400);
});

test('POST /api/products/:id/reviews — Comment too long (>1000) → 400', async () => {
  const res = await request(app)
    .post(`/api/products/${testProductId}/reviews`)
    .set('Authorization', `Bearer ${customer2Token}`)
    .send({ rating: 3, comment: 'x'.repeat(1001) });

  assert.equal(res.status, 400);
});

test('POST /api/products/:id/reviews — No auth → 401', async () => {
  const res = await request(app)
    .post(`/api/products/${testProductId}/reviews`)
    .send({ rating: 4, comment: 'No auth' });

  assert.equal(res.status, 401);
});

test('POST /api/products/:id/reviews — Non-existent product → 404', async () => {
  const res = await request(app)
    .post('/api/products/999999/reviews')
    .set('Authorization', `Bearer ${customer2Token}`)
    .send({ rating: 3, comment: 'No product' });

  assert.equal(res.status, 404);
});

test('GET /api/products/:id/reviews — Public, returns reviews', async () => {
  // Add a second review from customer2 for pagination test
  await request(app)
    .post(`/api/products/${testProductId}/reviews`)
    .set('Authorization', `Bearer ${customer2Token}`)
    .send({ rating: 4, comment: 'Good card' });

  const res = await request(app)
    .get(`/api/products/${testProductId}/reviews`);

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.reviews));
  assert.equal(res.body.reviews.length, 2);
  assert.ok(res.body.reviews[0].rating);
  assert.ok(res.body.reviews[0].user_name);
  assert.equal(res.body.total, 2);
});

test('GET /api/products/:id/reviews — Pagination works', async () => {
  const res = await request(app)
    .get(`/api/products/${testProductId}/reviews?limit=1&offset=0`);

  assert.equal(res.status, 200);
  assert.equal(res.body.reviews.length, 1);
  assert.equal(res.body.total, 2);
});

test('GET /api/products/:id — includes average_rating', async () => {
  const res = await request(app)
    .get(`/api/products/${testProductId}`);

  assert.equal(res.status, 200);
  // (5 + 4) / 2 = 4.5
  assert.equal(Number(res.body.average_rating), 4.5);
  assert.equal(res.body.review_count, 2);
});

test('DELETE /api/reviews/:id — Non-owner (customer2 deletes customer1 review) → 403', async () => {
  const res = await request(app)
    .delete(`/api/reviews/${createdReviewId}`)
    .set('Authorization', `Bearer ${customer2Token}`);

  assert.equal(res.status, 403);
});

test('DELETE /api/reviews/:id — Owner deletes own review → 204', async () => {
  const res = await request(app)
    .delete(`/api/reviews/${createdReviewId}`)
    .set('Authorization', `Bearer ${customer1Token}`);

  assert.equal(res.status, 204);
});

test('DELETE /api/reviews/:id — Admin can delete any review', async () => {
  // Get customer2's review id
  const listRes = await request(app).get(`/api/products/${testProductId}/reviews`);
  const c2Review = listRes.body.reviews[0];

  const res = await request(app)
    .delete(`/api/reviews/${c2Review.id}`)
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 204);
});
