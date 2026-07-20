import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

before(cleanupTestUsers);
after(async () => {
  await cleanupTestUsers();
  await closePool();
});

async function registerAndGetToken(): Promise<{ token: string; email: string }> {
  const email = uniqueEmail('me');
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'password123', first_name: 'M', last_name: 'E' });
  assert.equal(res.status, 201);
  return { token: res.body.token, email };
}

test('GET /api/auth/me — valid JWT returns current user profile', async () => {
  const { token, email } = await registerAndGetToken();

  const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  assert.equal(res.body.email, email);
  assert.equal(res.body.role, 'Customer');
  assert.equal(res.body.password_hash, undefined);
  assert.equal(typeof res.body.id, 'number');
});

test('GET /api/auth/me — no Authorization header returns 401', async () => {
  const res = await request(app).get('/api/auth/me');

  assert.equal(res.status, 401, `expected 401, got ${res.status}: ${res.text}`);
  assert.ok(res.body.error);
});

test('GET /api/auth/me — malformed token returns 401', async () => {
  const res = await request(app)
    .get('/api/auth/me')
    .set('Authorization', 'Bearer not-a-real-jwt');

  assert.equal(res.status, 401, `expected 401, got ${res.status}: ${res.text}`);
});

test('GET /api/auth/me — token signed with wrong secret returns 401', async () => {
  // Payload valid but signature bogus:
  const bogus =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJDdXN0b21lciIsImlhdCI6MTAwMH0.wrong-signature';
  const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${bogus}`);

  assert.equal(res.status, 401, `expected 401, got ${res.status}: ${res.text}`);
});
