import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminProducts from './AdminProducts';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: false })) },
}));

vi.mock('../../services/adminService', () => ({
  listProducts: vi.fn(() => Promise.resolve([])),
  createProduct: vi.fn((p) => Promise.resolve({ id: 99, ...p, is_active: true })),
  updateProduct: vi.fn((id, p) => Promise.resolve({ id, ...p })),
  deleteProduct: vi.fn(() => Promise.resolve()),
  toggleProductStatus: vi.fn(() => Promise.resolve()),
}));

describe('AdminProducts spec fields per category', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows CPU spec fields when category is CPU', async () => {
    render(<AdminProducts onNavigate={vi.fn()} />);

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

    // Click add product
    fireEvent.click(screen.getByText('admin_products.add_product'));

    // CPU is default category — should show CPU-specific fields
    expect(screen.getByLabelText('Socket')).toBeInTheDocument();
    expect(screen.getByLabelText('Cores')).toBeInTheDocument();
    expect(screen.getByLabelText('TDP (W)')).toBeInTheDocument();
  });

  it('switches to GPU fields when category changes', async () => {
    render(<AdminProducts onNavigate={vi.fn()} />);
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

    fireEvent.click(screen.getByText('admin_products.add_product'));

    // Change to GPU
    fireEvent.change(screen.getByDisplayValue('CPU'), { target: { value: 'GPU' } });

    expect(screen.getByLabelText('VRAM (GB)')).toBeInTheDocument();
    expect(screen.getByLabelText('Length (mm)')).toBeInTheDocument();
    expect(screen.queryByLabelText('Socket')).toBeNull();
    expect(screen.queryByLabelText('Cores')).toBeNull();
  });
});
