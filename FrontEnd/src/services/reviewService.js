import { apiGet, apiPost, apiDelete } from './apiClient.js';

export function list(productId, params = {}) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') search.set(k, String(v));
  }
  const qs = search.toString();
  return apiGet(`/api/products/${productId}/reviews${qs ? `?${qs}` : ''}`);
}

export function create(productId, { rating, comment }) {
  return apiPost(`/api/products/${productId}/reviews`, { rating, comment });
}

export function remove(reviewId) {
  return apiDelete(`/api/reviews/${reviewId}`);
}
