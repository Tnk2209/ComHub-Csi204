import { describe, it, expect } from 'vitest';
import { canTransitionTo, requiresTrackingNumber, isCancellable } from './orderStatusUtils';

describe('canTransitionTo', () => {
  it('processing → shipped is allowed', () => {
    expect(canTransitionTo('processing', 'shipped')).toBe(true);
  });

  it('shipped → delivered is allowed', () => {
    expect(canTransitionTo('shipped', 'delivered')).toBe(true);
  });

  it('processing → delivered is NOT allowed (must go through shipped)', () => {
    expect(canTransitionTo('processing', 'delivered')).toBe(false);
  });

  it('delivered → processing is NOT allowed (backwards)', () => {
    expect(canTransitionTo('delivered', 'processing')).toBe(false);
  });

  it('pending_payment → processing is NOT allowed (handled by payment approval)', () => {
    expect(canTransitionTo('pending_payment', 'processing')).toBe(false);
  });

  it('shipped → processing is NOT allowed (backwards)', () => {
    expect(canTransitionTo('shipped', 'processing')).toBe(false);
  });

  it('cancelled status has no allowed transitions', () => {
    expect(canTransitionTo('cancelled', 'processing')).toBe(false);
    expect(canTransitionTo('cancelled', 'shipped')).toBe(false);
  });
});

describe('requiresTrackingNumber', () => {
  it('shipped requires tracking number', () => {
    expect(requiresTrackingNumber('shipped')).toBe(true);
  });

  it('delivered does NOT require tracking number', () => {
    expect(requiresTrackingNumber('delivered')).toBe(false);
  });

  it('processing does NOT require tracking number', () => {
    expect(requiresTrackingNumber('processing')).toBe(false);
  });
});

describe('isCancellable', () => {
  it('pending_payment order is cancellable', () => {
    expect(isCancellable('pending_payment')).toBe(true);
  });

  it('processing order is cancellable', () => {
    expect(isCancellable('processing')).toBe(true);
  });

  it('shipped order is NOT cancellable', () => {
    expect(isCancellable('shipped')).toBe(false);
  });

  it('delivered order is NOT cancellable', () => {
    expect(isCancellable('delivered')).toBe(false);
  });

  it('already cancelled order is NOT cancellable', () => {
    expect(isCancellable('cancelled')).toBe(false);
  });
});
