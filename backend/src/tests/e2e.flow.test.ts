import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { uniqueEmail, cleanupTestUsers, closePool } from './helpers';

after(async () => {
  await cleanupTestUsers();
  await closePool();
});

test('E2E: Register → Login → List Products — full vertical slice', async () => {
  const email = uniqueEmail('e2e');
  const password = 'securepass123';

  // 1. Register
  const regRes = await request(app)
    .post('/api/auth/register')
    .send({ email, password, first_name: 'E2E', last_name: 'User' });

  assert.equal(regRes.status, 201);
  assert.ok(regRes.body.token);
  assert.equal(regRes.body.user.email, email);
  assert.equal(regRes.body.user.role, 'Customer');

  // 2. Login with same credentials
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  assert.equal(loginRes.status, 200);
  const token = loginRes.body.token;
  assert.ok(token);

  // 3. GET /api/auth/me with token
  const meRes = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(meRes.status, 200);
  assert.equal(meRes.body.email, email);
  assert.equal(meRes.body.password_hash, undefined);

  // 4. List Products (public, no auth needed)
  const productsRes = await request(app)
    .get('/api/products');

  assert.equal(productsRes.status, 200);
  assert.ok(Array.isArray(productsRes.body));
  assert.ok(productsRes.body.length >= 7, 'seeded products should be available');
  assert.ok(productsRes.body[0].specifications, 'should include JSONB specs');
});

test('E2E: RBAC — Customer cannot create product', async () => {
  const email = uniqueEmail('e2e-rbac');
  const password = 'securepass123';

  const regRes = await request(app)
    .post('/api/auth/register')
    .send({ email, password, first_name: 'Cust', last_name: 'Only' });

  const token = regRes.body.token;

  const createRes = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Hacked Product',
      category: 'CPU',
      price: 9.99,
      stock_quantity: 1,
      specifications: { socket: 'AM5', tdp: 65 }
    });

  assert.equal(createRes.status, 403);
});

test('E2E: Health endpoint responds ok', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
});
