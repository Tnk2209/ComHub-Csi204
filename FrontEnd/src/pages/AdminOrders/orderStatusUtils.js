export const ALLOWED_TRANSITIONS = {
  paid: ['processing'],
  processing: ['shipped'],
  shipped: ['delivered'],
};

export const CANCELLABLE_STATUSES = ['pending_payment', 'paid', 'processing'];

export function canTransitionTo(currentStatus, newStatus) {
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  return Array.isArray(allowed) && allowed.includes(newStatus);
}

export function requiresTrackingNumber(newStatus) {
  return newStatus === 'shipped';
}

export function isCancellable(status) {
  return CANCELLABLE_STATUSES.includes(status);
}
