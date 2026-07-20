import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ProductComparison from './ProductComparison';
import { CompareProvider } from '../../contexts/CompareContext';

const store = {};
const mockLocalStorage = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
};
Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage, writable: true });

vi.mock('../../services/productService.js', () => ({
  get: vi.fn((id) => Promise.resolve({
    id,
    name: id === 1 ? 'Intel i9-14900K' : 'AMD Ryzen 9 7950X',
    category: 'CPU',
    price: id === 1 ? 22990 : 21490,
    specifications: id === 1
      ? { socket: 'LGA1700', tdp: 253, cores: 24 }
      : { socket: 'AM5', tdp: 170, cores: 16 },
  })),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

function renderWithProviders() {
  return render(
    <CompareProvider>
      <ProductComparison onNavigate={() => {}} />
    </CompareProvider>
  );
}

describe('ProductComparison', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('shows empty state when no products to compare', () => {
    renderWithProviders();
    expect(screen.getByText(/compare\.empty/i)).toBeInTheDocument();
  });

  it('fetches products and renders comparison table', async () => {
    mockLocalStorage.setItem('comhub_compare', JSON.stringify([
      { id: 1, name: 'Intel i9-14900K', category: 'CPU' },
      { id: 2, name: 'AMD Ryzen 9 7950X', category: 'CPU' },
    ]));

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Intel i9-14900K')).toBeInTheDocument();
      expect(screen.getByText('AMD Ryzen 9 7950X')).toBeInTheDocument();
    });

    expect(screen.getByText('LGA1700')).toBeInTheDocument();
    expect(screen.getByText('AM5')).toBeInTheDocument();
    expect(screen.getByText('253')).toBeInTheDocument();
    expect(screen.getByText('170')).toBeInTheDocument();
  });

  it('shows spec row labels from product specifications keys', async () => {
    mockLocalStorage.setItem('comhub_compare', JSON.stringify([
      { id: 1, name: 'Intel i9-14900K', category: 'CPU' },
    ]));

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('socket')).toBeInTheDocument();
      expect(screen.getByText('tdp')).toBeInTheDocument();
      expect(screen.getByText('cores')).toBeInTheDocument();
    });
  });
});
