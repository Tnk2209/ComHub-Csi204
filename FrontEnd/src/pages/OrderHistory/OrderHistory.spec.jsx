import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import OrderHistory from './OrderHistory';

const mockNavigate = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const mockOrders = [
  {
    id: 101,
    created_at: '2026-07-21T01:00:00Z',
    cancelled_at: null,
    total_price: '549.99',
    order_status: 'paid',
    items: [
      { product_name: 'Ryzen 9', quantity: 1 }
    ]
  },
  {
    id: 102,
    created_at: '2026-07-20T12:00:00Z',
    cancelled_at: '2026-07-20T14:30:00Z',
    total_price: '1599.00',
    order_status: 'cancelled',
    items: [
      { product_name: 'RTX 4090', quantity: 1 }
    ]
  }
];

vi.mock('../../services/orderService', () => ({
  list: vi.fn(),
}));

import * as orderService from '../../services/orderService';

describe('OrderHistory Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    orderService.list.mockImplementation(() => new Promise(() => {}));
    render(<OrderHistory onNavigate={mockNavigate} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders empty state when there are no orders', async () => {
    orderService.list.mockResolvedValue([]);
    render(<OrderHistory onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    expect(screen.getByText('order_history.empty')).toBeInTheDocument();
    
    // Browse products navigates to catalog
    fireEvent.click(screen.getByText('order_history.browse_now'));
    expect(mockNavigate).toHaveBeenCalledWith('catalog');
  });

  it('renders orders list table and cards when orders are loaded', async () => {
    orderService.list.mockResolvedValue(mockOrders);
    render(<OrderHistory onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Check order numbers (rendered both in desktop table and mobile cards)
    expect(screen.getAllByText('#101').length).toBeGreaterThan(0);
    expect(screen.getAllByText('#102').length).toBeGreaterThan(0);

    // Check item names
    expect(screen.getAllByText('Ryzen 9 (x1)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('RTX 4090 (x1)').length).toBeGreaterThan(0);

    // Check total prices formatted with locale
    expect(screen.getAllByText(/549\.99/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/1,599|1599/).length).toBeGreaterThan(0);

    // Click track button for order #101
    const trackBtns = screen.getAllByText('order_history.track_btn');
    fireEvent.click(trackBtns[0]);
    expect(mockNavigate).toHaveBeenCalledWith('order-tracking', { orderId: 101 });
  });

  it('navigates back to landing when back to home is clicked', async () => {
    orderService.list.mockResolvedValue([]);
    render(<OrderHistory onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    fireEvent.click(screen.getByText('order_history.back_to_home'));
    expect(mockNavigate).toHaveBeenCalledWith('landing');
  });
});
