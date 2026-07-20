import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

let adminToken: string;
let adminUserId: number;
let customerToken: string;
let targetUserId: number;

before(async () => {
  await cleanupTestUsers();

  // Create admin
  const adminEmail = uniqueEmail('admin-users');
  const adminResult = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'Admin', 'User', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminUserId = adminResult.rows[0]!.id;
  adminToken = signToken(adminUserId, 'Admin');

  // Create customer (target for role/status changes)
  const custRes = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('target-user'), password: 'pass123', first_name: 'Target', last_name: 'Customer' });
  customerToken = custRes.body.token;
  targetUserId = custRes.body.user.id;

  // Create a few more users for list/search testing
  await request(app).post('/api/auth/register')
    .send({ email: uniqueEmail('search-alice'), password: 'pass123', first_name: 'Alice', last_name: 'Smith' });
  await request(app).post('/api/auth/register')
    .send({ email: uniqueEmail('search-bob'), password: 'pass123', first_name: 'Bob', last_name: 'Jones' });
});

after(async () => {
  await cleanupTestUsers();
  await closePool();
});

// --- GET /api/admin/users ---

test('GET /api/admin/users — Admin lists all users', async () => {
  const res = await request(app)
    .get('/api/admin/users')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.users));
  assert.ok(res.body.users.length >= 4);
  assert.ok(res.body.total >= 4);
  // Should not include password_hash
  assert.equal(res.body.users[0].password_hash, undefined);
});

test('GET /api/admin/users — Pagination works', async () => {
  const res = await request(app)
    .get('/api/admin/users?limit=2&offset=0')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.users.length, 2);
  assert.ok(res.body.total >= 4);
});

test('GET /api/admin/users — Search by name', async () => {
  const res = await request(app)
    .get('/api/admin/users?search=Alice')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.ok(res.body.users.length >= 1);
  assert.ok(res.body.users.some((u: any) => u.first_name === 'Alice'));
});

test('GET /api/admin/users — Customer cannot access → 403', async () => {
  const res = await request(app)
    .get('/api/admin/users')
    .set('Authorization', `Bearer ${customerToken}`);

  assert.equal(res.status, 403);
});

// --- GET /api/admin/users/:id ---

test('GET /api/admin/users/:id — Admin views user detail', async () => {
  const res = await request(app)
    .get(`/api/admin/users/${targetUserId}`)
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.id, targetUserId);
  assert.equal(res.body.first_name, 'Target');
  assert.equal(res.body.password_hash, undefined);
});

test('GET /api/admin/users/999999 — Not found → 404', async () => {
  const res = await request(app)
    .get('/api/admin/users/999999')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 404);
});

// --- PATCH /api/admin/users/:id/role ---

test('PATCH /api/admin/users/:id/role — Change Customer to Admin', async () => {
  const res = await request(app)
    .patch(`/api/admin/users/${targetUserId}/role`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ role: 'Admin' });

  assert.equal(res.status, 200);
  assert.equal(res.body.role, 'Admin');
});

test('PATCH /api/admin/users/:id/role — Change back to Customer', async () => {
  const res = await request(app)
    .patch(`/api/admin/users/${targetUserId}/role`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ role: 'Customer' });

  assert.equal(res.status, 200);
  assert.equal(res.body.role, 'Customer');
});

test('PATCH /api/admin/users/:id/role — Invalid role → 400', async () => {
  const res = await request(app)
    .patch(`/api/admin/users/${targetUserId}/role`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ role: 'SuperAdmin' });

  assert.equal(res.status, 400);
});

test('PATCH /api/admin/users/:id/role — Admin changes own role → 400', async () => {
  const res = await request(app)
    .patch(`/api/admin/users/${adminUserId}/role`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ role: 'Customer' });

  assert.equal(res.status, 400);
});

// --- PATCH /api/admin/users/:id/status ---

test('PATCH /api/admin/users/:id/status — Disable user', async () => {
  const res = await request(app)
    .patch(`/api/admin/users/${targetUserId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ is_active: false });

  assert.equal(res.status, 200);
  assert.equal(res.body.is_active, false);
});

test('PATCH /api/admin/users/:id/status — Re-enable user', async () => {
  const res = await request(app)
    .patch(`/api/admin/users/${targetUserId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ is_active: true });

  assert.equal(res.status, 200);
  assert.equal(res.body.is_active, true);
});

test('PATCH /api/admin/users/:id/status — Admin disables self → 400', async () => {
  const res = await request(app)
    .patch(`/api/admin/users/${adminUserId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ is_active: false });

  assert.equal(res.status, 400);
});
