import { apiGet, apiGetWithHeaders } from './apiClient.js';

function buildQueryString(params = {}) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      search.set(k, String(v));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function list(params = {}) {
  return apiGet(`/api/products${buildQueryString(params)}`);
}

/**
 * Fetches products with total count from X-Total-Count header.
 * Returns { data: Product[], total: number }
 */
export async function listWithCount(params = {}) {
  return apiGetWithHeaders(`/api/products${buildQueryString(params)}`);
}

export function get(id) {
  return apiGet(`/api/products/${id}`);
}

export function getByCategory(category) {
  return apiGet(`/api/products/by-category/${encodeURIComponent(category)}`);
}
