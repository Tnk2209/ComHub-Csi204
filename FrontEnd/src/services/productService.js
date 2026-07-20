import { apiGet } from './apiClient.js';

export function list(params = {}) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') search.set(k, String(v));
  }
  const qs = search.toString();
  return apiGet(`/api/products${qs ? `?${qs}` : ''}`);
}

export function get(id) {
  return apiGet(`/api/products/${id}`);
}

export function getByCategory(category) {
  return apiGet(`/api/products/by-category/${encodeURIComponent(category)}`);
}
