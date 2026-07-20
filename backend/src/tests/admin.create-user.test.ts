import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';
import { signToken } from '../services/auth';
import { cleanupTestUsers, closePool, uniqueEmail } from './helpers';

let adminToken: string;
let customerToken: string;

before(async () => {
  await cleanupTestUsers();

  // Create admin
  const adminEmail = uniqueEmail('admin-creator');
  const adminResult = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'Admin', 'Creator', 'Admin', 'native') RETURNING id`,
    [adminEmail]
  );
  adminToken = signToken(adminResult.rows[0]!.id, 'Admin');

  // Create customer
  const custEmail = uniqueEmail('cust-creator');
  const custResult = await pool.query<{ id: number }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, auth_provider)
     VALUES ($1, 'noop', 'Cust', 'Creator', 'Customer', 'native') RETURNING id`,
    [custEmail]
  );
  customerToken = signToken(custResult.rows[0]!.id, 'Customer');
});

after(async () => {
  await cleanupTestUsers();
  await closePool();
});

test('POST /api/admin/users — Admin creates another Admin successfully', async () => {
  const newAdminEmail = uniqueEmail('new-admin');
  const res = await request(app)
    .post('/api/admin/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      email: newAdminEmail,
      password: 'securePassword123',
      first_name: 'Created',
      last_name: 'Admin'
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.email, newAdminEmail);
  assert.equal(res.body.role, 'Admin');
  assert.equal(res.body.first_name, 'Created');
  assert.equal(res.body.last_name, 'Admin');
  assert.equal(res.body.password_hash, undefined);

  // Check in database that the user exists and role is Admin
  const dbCheck = await pool.query('SELECT role, password_hash FROM users WHERE email = $1', [newAdminEmail]);
  assert.equal(dbCheck.rows[0]!.role, 'Admin');
  assert.notEqual(dbCheck.rows[0]!.password_hash, 'securePassword123'); // should be hashed
});

test('POST /api/admin/users — Customer cannot create admin → 403', async () => {
  const res = await request(app)
    .post('/api/admin/users')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({
      email: uniqueEmail('fail-admin'),
      password: 'password123',
      first_name: 'Failing',
      last_name: 'Admin'
    });

  assert.equal(res.status, 403);
});

test('POST /api/admin/users — Validation error on short password → 400', async () => {
  const res = await request(app)
    .post('/api/admin/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      email: uniqueEmail('valid-err'),
      password: '123',
      first_name: 'Failing',
      last_name: 'Admin'
    });

  assert.equal(res.status, 400);
  assert.match(res.body.message, /password/);
});

test('POST /api/admin/users — Duplicate email returns 409', async () => {
  // Try to create with existing email
  const existingEmail = uniqueEmail('duplicate-admin');
  
  // Register once
  await request(app)
    .post('/api/admin/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      email: existingEmail,
      password: 'password123',
      first_name: 'Unique',
      last_name: 'One'
    });

  // Try duplicate
  const res = await request(app)
    .post('/api/admin/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      email: existingEmail,
      password: 'password123',
      first_name: 'Duplicate',
      last_name: 'Two'
    });

  assert.equal(res.status, 409);
});
