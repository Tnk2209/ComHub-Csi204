import { apiGet, apiPost, apiPatch } from './apiClient.js';

export function create({ items, shipping_address }) {
  return apiPost('/api/orders', { items, shipping_address });
}

export function list() {
  return apiGet('/api/orders');
}

export function get(id) {
  return apiGet(`/api/orders/${id}`);
}

export function uploadSlip(id, payment_slip) {
  return apiPatch(`/api/orders/${id}/payment`, { payment_slip });
}
