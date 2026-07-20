import { apiGet, apiPost } from './apiClient.js';

export function register(body) {
  return apiPost('/api/auth/register', body);
}

export function login(body) {
  return apiPost('/api/auth/login', body);
}

export function me() {
  return apiGet('/api/auth/me');
}
