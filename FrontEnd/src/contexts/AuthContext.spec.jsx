import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const store = {};
const mockLocalStorage = {
  getItem: vi.fn((key) => store[key] ?? null),
  setItem: vi.fn((key, value) => { store[key] = String(value); }),
  removeItem: vi.fn((key) => { delete store[key]; }),
};
vi.stubGlobal('localStorage', mockLocalStorage);

vi.mock('../services/apiClient.js', () => ({
  setAuthToken: vi.fn(),
}));

vi.mock('../services/authService.js', () => ({
  login: vi.fn(),
  register: vi.fn(),
  me: vi.fn(),
}));

import { AuthProvider, useAuth } from './AuthContext';

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    vi.clearAllMocks();
  });

  it('exposes isAuthenticated as false when no user is logged in', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await vi.waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('exposes isAuthenticated as true after login', async () => {
    const { login: loginFn } = await import('../services/authService.js');
    loginFn.mockResolvedValue({ token: 'fake-token', user: { id: 1, email: 'a@b.com', role: 'Customer', first_name: 'Test' } });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await vi.waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login({ email: 'a@b.com', password: 'pass' });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user.first_name).toBe('Test');
  });
});
