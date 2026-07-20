// Read Vite env var in browser, or fallback to localhost for Node test runner.
const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  process.env.VITE_API_BASE_URL ||
  'http://localhost:3000';

let _token = null;

export function setAuthToken(token) {
  _token = token;
}

export function getAuthToken() {
  return _token;
}

export class ApiError extends Error {
  constructor(status, body, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function parseBody(res) {
  const ct = res.headers.get('content-type') ?? '';
  return ct.includes('application/json') ? res.json() : res.text();
}

function authHeader() {
  return _token ? { Authorization: `Bearer ${_token}` } : {};
}

async function request(method, path, body) {
  const init = {
    method,
    headers: { ...authHeader() },
  };
  if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + path, init);
  const parsed = await parseBody(res);
  if (!res.ok) throw new ApiError(res.status, parsed, parsed?.message ?? `HTTP ${res.status}`);
  return parsed;
}

export function apiGet(path) {
  return request('GET', path);
}

export function apiPost(path, body) {
  return request('POST', path, body);
}

export function apiPut(path, body) {
  return request('PUT', path, body);
}

export function apiPatch(path, body) {
  return request('PATCH', path, body);
}

export function apiDelete(path) {
  return request('DELETE', path);
}
