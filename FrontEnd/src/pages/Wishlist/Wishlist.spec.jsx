import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const store = {};
const mockLocalStorage = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
};
Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage, writable: true });

let mockIsAuthenticated = false;

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, isAuthenticated: mockIsAuthenticated }),
}));

vi.mock('../../contexts/CartContext', () => ({
  useCart: () => ({ addItem: vi.fn() }),
}));

vi.mock('../../services/wishlistService', () => ({
  list: vi.fn(() => Promise.resolve([])),
  remove: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

import Wishlist from './Wishlist';

describe('Wishlist — Auth guard', () => {
  beforeEach(() => {
    mockIsAuthenticated = false;
  });

  it('shows login prompt when user is not authenticated', async () => {
    render(<Wishlist onNavigate={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('wishlist.login_required')).toBeInTheDocument();
    });
  });

  it('shows wishlist content when user is authenticated', async () => {
    mockIsAuthenticated = true;
    render(<Wishlist onNavigate={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('wishlist.title')).toBeInTheDocument();
    });
  });
});
