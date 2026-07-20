import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const store = {};
const mockLocalStorage = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
};
Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage, writable: true });

const mockAddItem = vi.fn();

vi.mock('../../contexts/CartContext', () => ({
  useCart: () => ({ addItem: mockAddItem }),
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1, role: 'Customer' }, isAuthenticated: true }),
}));

vi.mock('../../contexts/CompareContext', () => ({
  useCompare: () => ({ compareItems: [], addToCompare: vi.fn(), removeFromCompare: vi.fn() }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

const mockProducts = [
  { id: 10, name: 'RTX 4090', category: 'GPU', price: 1599, stock_quantity: 5, image_url: null },
  { id: 20, name: 'Ryzen 9', category: 'CPU', price: 549, stock_quantity: 12, image_url: null },
];

vi.mock('../../services/productService.js', () => ({
  list: vi.fn(() => Promise.resolve(mockProducts)),
}));

vi.mock('../../services/wishlistService.js', () => ({
  list: vi.fn(() => Promise.resolve([])),
  add: vi.fn(() => Promise.resolve()),
  remove: vi.fn(() => Promise.resolve()),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn() },
}));

import * as wishlistService from '../../services/wishlistService.js';

describe('Catalog — Add to Cart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls addItem with product data when clicking Add to Cart', async () => {
    render(<Catalog onNavigate={() => {}} />);

    await waitFor(() => expect(screen.getByText('RTX 4090')).toBeInTheDocument());

    const addButtons = screen.getAllByText('catalog.add_to_cart');
    fireEvent.click(addButtons[0]);

    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 10, name: 'RTX 4090', price: 1599 })
    );
  });
});

describe('Catalog — Wishlist API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls wishlistService.add when clicking heart on a non-wishlisted product', async () => {
    render(<Catalog onNavigate={() => {}} />);
    await waitFor(() => expect(screen.getByText('RTX 4090')).toBeInTheDocument());

    const heartButtons = screen.getAllByRole('button').filter(
      (btn) => btn.querySelector('svg.lucide-heart')
    );
    fireEvent.click(heartButtons[0]);

    await waitFor(() => {
      expect(wishlistService.add).toHaveBeenCalledWith(10);
    });
  });
});

import Catalog from './Catalog';
