import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import productService from '../../services/productService';

const store = {};
const mockLocalStorage = {
  getItem: vi.fn((key) => store[key] ?? null),
  setItem: vi.fn((key, value) => { store[key] = String(value); }),
  removeItem: vi.fn((key) => { delete store[key]; }),
};
vi.stubGlobal('localStorage', mockLocalStorage);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

const { mockGetByCategory } = vi.hoisted(() => ({
  mockGetByCategory: vi.fn(() => Promise.resolve([])),
}));
vi.mock('../../services/productService', () => ({
  getByCategory: mockGetByCategory,
  default: {
    getByCategory: mockGetByCategory,
  }
}));

const mockAddItem = vi.fn();
vi.mock('../../contexts/CartContext', () => ({
  useCart: () => ({ addItem: mockAddItem }),
}));

import PCBuilder from './PCBuilder';

describe('PCBuilder — localStorage integration', () => {
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    vi.clearAllMocks();
  });

  it('displays restored part name from localStorage on mount', () => {
    const savedParts = {
      cpu: { id: 1, name: 'AMD Ryzen 7 7700X', price: 299, tdp: 105, socket: 'AM5' },
      gpu: null, motherboard: null, ram: null, storage: null, case: null, psu: null,
    };
    store['comhub_builder'] = JSON.stringify(savedParts);

    render(<PCBuilder />);
    expect(screen.getByText('AMD Ryzen 7 7700X')).toBeInTheDocument();
  });

  it('persists state to localStorage after mount', () => {
    render(<PCBuilder />);
    const stored = JSON.parse(store['comhub_builder']);
    expect(stored).toEqual({
      cpu: null, gpu: null, motherboard: null,
      ram: null, storage: null, case: null, psu: null,
    });
  });

  it('clears localStorage when reset button is clicked', () => {
    const savedParts = {
      cpu: { id: 1, name: 'AMD Ryzen 7 7700X', price: 299, tdp: 105, socket: 'AM5' },
      gpu: null, motherboard: null, ram: null, storage: null, case: null, psu: null,
    };
    store['comhub_builder'] = JSON.stringify(savedParts);

    render(<PCBuilder />);
    expect(screen.getByText('AMD Ryzen 7 7700X')).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /builder\.reset_btn/i });
    fireEvent.click(resetBtn);

    expect(screen.queryByText('AMD Ryzen 7 7700X')).not.toBeInTheDocument();
    const stored = JSON.parse(store['comhub_builder']);
    expect(stored.cpu).toBeNull();
  });
});

describe('PCBuilder — checkout adds items to cart', () => {
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    vi.clearAllMocks();
  });

  it('calls addItem for each selected part when checkout is clicked', () => {
    const savedParts = {
      cpu: { id: 1, name: 'AMD Ryzen 7 7700X', price: 299, tdp: 105, socket: 'AM5' },
      gpu: { id: 2, name: 'RTX 4070', price: 599, tdp: 200, socket: null },
      motherboard: null, ram: null, storage: null, case: null, psu: null,
    };
    store['comhub_builder'] = JSON.stringify(savedParts);

    const onNavigate = vi.fn();
    render(<PCBuilder onNavigate={onNavigate} />);

    const checkoutBtn = screen.getByRole('button', { name: /builder\.checkout_btn/i });
    fireEvent.click(checkoutBtn);

    expect(mockAddItem).toHaveBeenCalledTimes(2);
    expect(mockAddItem).toHaveBeenCalledWith(expect.objectContaining({ id: 1, name: 'AMD Ryzen 7 7700X' }));
    expect(mockAddItem).toHaveBeenCalledWith(expect.objectContaining({ id: 2, name: 'RTX 4070' }));
    expect(onNavigate).toHaveBeenCalledWith('cart');
  });
});

describe('PCBuilder — PSU recommendation and filtering', () => {
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    vi.clearAllMocks();
  });

  it('filters PSU options by 20% safety margin and displays override options', async () => {
    const savedParts = {
      cpu: { id: 1, name: 'HighPower CPU', price: 300, tdp: 200, socket: 'AM5' },
      gpu: { id: 2, name: 'HighPower GPU', price: 600, tdp: 300, socket: null },
      motherboard: null, ram: null, storage: null, case: null, psu: null,
    };
    store['comhub_builder'] = JSON.stringify(savedParts);

    const mockPSUs = [
      { id: 10, name: 'Budget PSU 500W', price: 50, specifications: { wattage: 500, efficiency: '80+ White' } },
      { id: 11, name: 'Gold PSU 750W', price: 100, specifications: { wattage: 750, efficiency: '80+ Gold' } },
      { id: 12, name: 'Titanium PSU 1000W', price: 200, specifications: { wattage: 1000, efficiency: '80+ Titanium' } },
    ];
    mockGetByCategory.mockResolvedValue(mockPSUs);

    render(<PCBuilder />);

    const psuSection = screen.getByText('builder.categories.psu').closest('.rounded-lg');
    const psuBtn = psuSection.querySelector('button');
    fireEvent.click(psuBtn);

    // Wait for mock items to load and check if filter checkbox exists
    await screen.findByText('Gold PSU 750W');

    // 1. By default, recommended check is enabled, so Budget PSU 500W is filtered out
    expect(screen.getByLabelText(/builder.psu_filter_label/i)).toBeInTheDocument();
    expect(screen.queryByText('Budget PSU 500W')).toBeNull();
    expect(screen.getByText('Gold PSU 750W')).toBeInTheDocument();
    expect(screen.getByText('Titanium PSU 1000W')).toBeInTheDocument();

    // 2. Uncheck the checkbox to disable recommendation filter (override)
    const checkbox = screen.getByLabelText(/builder.psu_filter_label/i);
    fireEvent.click(checkbox);

    // 3. Now the 500W PSU should be visible
    expect(screen.getByText('Budget PSU 500W')).toBeInTheDocument();
  });
});
