import { apiGet, apiPost, apiPatch, apiDelete } from './apiClient.js';

export function list() {
  return apiGet('/api/wishlist');
}

export function add(productId) {
  return apiPost('/api/wishlist', { product_id: productId });
}

export function remove(productId) {
  return apiDelete(`/api/wishlist/${productId}`);
}

export function toggleAlert(productId, isAlertEnabled) {
  return apiPatch(`/api/wishlist/${productId}/alert`, { is_alert_enabled: isAlertEnabled });
}
