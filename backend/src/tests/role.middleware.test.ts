import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

before(cleanupTestUsers);
after(async () => {
  await cleanupTestUsers();
  await closePool();
});

async function registerCustomer(): Promise<string> {
  const email = uniqueEmail('customer');
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'password123', first_name: 'C', last_name: 'U' });
  assert.equal(res.status, 201);
  return res.body.token as string;
}

async function createAdminToken(): Promise<string> {
  // Seed a fresh Admin directly via SQL (no register endpoint for Admin in MVP)
  const email = uniqueEmail('admin');
  const result = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'A', 'D', 'Admin', 'native') RETURNING id`,
    [email]
  );
  return signToken(result.rows[0]!.id, 'Admin');
}

test('Admin-guarded route — Customer token receives 403', async () => {
  const customerToken = await registerCustomer();

  const res = await request(app)
    .get('/api/_test/admin-only')
    .set('Authorization', `Bearer ${customerToken}`);

  assert.equal(res.status, 403, `expected 403, got ${res.status}: ${res.text}`);
  assert.ok(res.body.error);
});

test('Admin-guarded route — Admin token receives 200', async () => {
  const adminToken = await createAdminToken();

  const res = await request(app)
    .get('/api/_test/admin-only')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  assert.equal(res.body.ok, true);
});

test('Admin-guarded route — no token receives 401 (before role check)', async () => {
  const res = await request(app).get('/api/_test/admin-only');
  assert.equal(res.status, 401);
});
