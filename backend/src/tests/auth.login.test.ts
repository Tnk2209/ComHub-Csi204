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

async function registerFixture(password = 'password123') {
  const email = uniqueEmail('login');
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password, first_name: 'A', last_name: 'B' });
  assert.equal(res.status, 201);
  return { email, password };
}

test('POST /api/auth/login — valid credentials return token + user', async () => {
  const { email, password } = await registerFixture();

  const res = await request(app).post('/api/auth/login').send({ email, password });

  assert.equal(res.status, 200, `expected 200, got ${res.status}: ${res.text}`);
  assert.ok(res.body.token, 'response should include token');
  assert.equal(res.body.user.email, email);
  assert.equal(res.body.user.role, 'Customer');
  assert.equal(res.body.user.password_hash, undefined);
});

test('POST /api/auth/login — wrong password returns 401', async () => {
  const { email } = await registerFixture();

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password: 'wrong-password' });

  assert.equal(res.status, 401, `expected 401, got ${res.status}: ${res.text}`);
  assert.ok(res.body.error);
});

test('POST /api/auth/login — unknown email returns 401 (not 404 — avoid user enumeration)', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: uniqueEmail('unknown'), password: 'password123' });

  assert.equal(res.status, 401, `expected 401, got ${res.status}: ${res.text}`);
});
