import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { apiGet, apiPost, setAuthToken } from './apiClient.js';

afterEach(() => setAuthToken(null));

test('apiGet — returns parsed JSON body on 2xx response', async () => {
  const body = await apiGet('/health');

  assert.equal(typeof body, 'object');
  assert.equal(body.ok, true);
  assert.equal(body.service, 'comhub-backend');
});

test('apiGet — throws ApiError with status + payload on 4xx response', async () => {
  await assert.rejects(
    () => apiGet('/api/products/9999999'),
    (err) => {
      assert.equal(err.name, 'ApiError');
      assert.equal(err.status, 404);
      assert.ok(err.body, 'error should carry parsed body');
      assert.equal(err.body.error, 'not_found');
      return true;
    }
  );
});

test('apiGet — without token, /api/auth/me returns 401', async () => {
  await assert.rejects(
    () => apiGet('/api/auth/me'),
    (err) => {
      assert.equal(err.status, 401);
      return true;
    }
  );
});

test('setAuthToken + apiGet — with valid token, /api/auth/me returns 200', async () => {
  // Register a fresh user via apiPost, then use token to hit /me
  const email = `apiclient-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  const { token, user } = await apiPost('/api/auth/register', {
    email,
    password: 'password123',
    first_name: 'A',
    last_name: 'C',
  });

  assert.ok(token, 'register should return a token');
  setAuthToken(token);

  const me = await apiGet('/api/auth/me');
  assert.equal(me.email, user.email);
  assert.equal(me.role, 'Customer');
});
