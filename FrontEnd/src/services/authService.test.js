import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { setAuthToken } from './apiClient.js';
import { register, login, me } from './authService.js';

afterEach(() => setAuthToken(null));

function uniqueEmail(label) {
  return `svc-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

test('authService.register — creates user and returns {token, user}', async () => {
  const email = uniqueEmail('register');
  const result = await register({ email, password: 'password123', first_name: 'A', last_name: 'B' });

  assert.ok(result.token);
  assert.equal(result.user.email, email);
  assert.equal(result.user.role, 'Customer');
});

test('authService.login — returns {token, user} for valid credentials', async () => {
  const email = uniqueEmail('login');
  const password = 'password123';
  await register({ email, password, first_name: 'L', last_name: 'I' });

  const result = await login({ email, password });

  assert.ok(result.token);
  assert.equal(result.user.email, email);
});

test('authService.me — returns current user with token set', async () => {
  const email = uniqueEmail('me');
  const { token } = await register({ email, password: 'password123', first_name: 'M', last_name: 'E' });

  setAuthToken(token);
  const user = await me();

  assert.equal(user.email, email);
  assert.equal(user.role, 'Customer');
  assert.equal(user.password_hash, undefined);
});
