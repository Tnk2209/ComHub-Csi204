import { test, after, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

before(cleanupTestUsers);
after(async () => {
  await cleanupTestUsers();
  await closePool();
});

test('POST /api/auth/register — creates user and returns token + user payload', async () => {
  const email = uniqueEmail('register-happy');

  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email,
      password: 'password123',
      first_name: 'Somchai',
      last_name: 'Testuser',
    });

  assert.equal(res.status, 201, `expected 201, got ${res.status}: ${res.text}`);
  assert.ok(res.body.token, 'response should include a token');
  assert.equal(typeof res.body.token, 'string');

  const { user } = res.body;
  assert.ok(user, 'response should include user object');
  assert.equal(typeof user.id, 'number');
  assert.equal(user.email, email);
  assert.equal(user.first_name, 'Somchai');
  assert.equal(user.last_name, 'Testuser');
  assert.equal(user.role, 'Customer');
  assert.equal(user.auth_provider, 'native');
  assert.equal(user.password_hash, undefined, 'password_hash must never leak to client');
});

test('POST /api/auth/register — duplicate email returns 409', async () => {
  const email = uniqueEmail('duplicate');
  const body = { email, password: 'password123', first_name: 'A', last_name: 'B' };

  const first = await request(app).post('/api/auth/register').send(body);
  assert.equal(first.status, 201);

  const second = await request(app).post('/api/auth/register').send(body);
  assert.equal(second.status, 409, `expected 409, got ${second.status}: ${second.text}`);
  assert.ok(second.body.error, 'response should include error code');
});

test('POST /api/auth/register — missing password returns 400', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('missing-pw'), first_name: 'A', last_name: 'B' });

  assert.equal(res.status, 400, `expected 400, got ${res.status}: ${res.text}`);
  assert.ok(res.body.error);
});

test('POST /api/auth/register — invalid email returns 400', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: 'not-an-email', password: 'password123', first_name: 'A', last_name: 'B' });

  assert.equal(res.status, 400, `expected 400, got ${res.status}: ${res.text}`);
});

test('POST /api/auth/register — password shorter than 6 chars returns 400', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: uniqueEmail('short-pw'), password: '12345', first_name: 'A', last_name: 'B' });

  assert.equal(res.status, 400, `expected 400, got ${res.status}: ${res.text}`);
});
