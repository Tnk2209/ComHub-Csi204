import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './apiClient.js';

// --- Products ---
export function listProducts() {
  return apiGet('/api/admin/products');
}

export function createProduct(data) {
  return apiPost('/api/products', data);
}

export function updateProduct(id, data) {
  return apiPut(`/api/products/${id}`, data);
}

export function toggleProductStatus(id, is_active) {
  return apiPatch(`/api/products/${id}/status`, { is_active });
}

export function deleteProduct(id) {
  return apiDelete(`/api/products/${id}`);
}

// --- Orders ---
export function listOrders(params = {}) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') search.set(k, String(v));
  }
  const qs = search.toString();
  return apiGet(`/api/admin/orders${qs ? `?${qs}` : ''}`);
}

export function approvePayment(orderId) {
  return apiPatch(`/api/admin/orders/${orderId}/approve-payment`);
}

export function rejectPayment(orderId, reason) {
  return apiPatch(`/api/admin/orders/${orderId}/reject-payment`, { reason });
}

export function updateOrderStatus(orderId, order_status, tracking_number) {
  const body = { order_status };
  if (tracking_number) body.tracking_number = tracking_number;
  return apiPatch(`/api/admin/orders/${orderId}/status`, body);
}

export function cancelOrder(orderId) {
  return apiPatch(`/api/admin/orders/${orderId}/cancel`);
}

// --- Users ---
export function listUsers(params = {}) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') search.set(k, String(v));
  }
  const qs = search.toString();
  return apiGet(`/api/admin/users${qs ? `?${qs}` : ''}`);
}

export function getUser(id) {
  return apiGet(`/api/admin/users/${id}`);
}

export function changeUserRole(id, role) {
  return apiPatch(`/api/admin/users/${id}/role`, { role });
}

export function changeUserStatus(id, is_active) {
  return apiPatch(`/api/admin/users/${id}/status`, { is_active });
}

export function createAdminUser(data) {
  return apiPost('/api/admin/users', data);
}

// --- Dashboard ---
export function getDashboard() {
  return apiGet('/api/admin/dashboard');
}
