import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderTracking from './OrderTracking';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

const { mockList, mockGet } = vi.hoisted(() => ({
  mockList: vi.fn(() => Promise.resolve([])),
  mockGet: vi.fn(() => Promise.resolve(null)),
}));

vi.mock('../../services/orderService', () => ({
  list: mockList,
  get: mockGet,
  default: {
    list: mockList,
    get: mockGet,
  }
}));

describe('OrderTracking empty state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows styled empty state with icon, description, and CTA', async () => {
    mockList.mockResolvedValue([]);
    mockGet.mockResolvedValue(null);

    render(<OrderTracking onNavigate={vi.fn()} />);

    const heading = await screen.findByText('order_tracking.no_orders');
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('order_tracking.no_orders_desc')).toBeInTheDocument();
    expect(screen.getByText('cart.browse_products')).toBeInTheDocument();
  });
});

describe('OrderTracking timeline rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a 5-step timeline containing the Paid step with its log date', async () => {
    const mockOrder = {
      id: 100,
      total_price: '5000',
      order_status: 'paid',
      created_at: '2026-07-21T00:00:00Z',
      items: [{ product_id: 1, quantity: 1, price_per_unit: '5000' }],
      logs: [
        { id: 1, status: 'Order Created', created_at: '2026-07-21T01:00:00Z' },
        { id: 2, status: 'Payment Approved', created_at: '2026-07-21T02:00:00Z' },
      ],
    };

    mockGet.mockResolvedValue(mockOrder);

    render(<OrderTracking onNavigate={vi.fn()} orderData={{ orderId: 100 }} />);

    expect(await screen.findByText(/Order #100/i)).toBeInTheDocument();

    // Verify 5 timeline steps are rendered
    expect(screen.getAllByText('order_tracking.status_pending_payment').length).toBeGreaterThan(0);
    expect(screen.getAllByText('order_tracking.status_paid').length).toBeGreaterThan(0);
    expect(screen.getAllByText('order_tracking.status_processing').length).toBeGreaterThan(0);
    expect(screen.getAllByText('order_tracking.status_shipped').length).toBeGreaterThan(0);
    expect(screen.getAllByText('order_tracking.status_delivered').length).toBeGreaterThan(0);

    // Verify Paid log date is displayed
    const paidLogDate = new Date('2026-07-21T02:00:00Z').toLocaleString();
    expect(screen.getAllByText(paidLogDate).length).toBeGreaterThan(0);
  });
});

describe('OrderTracking order list view', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOrders = [
    { id: 21, total_price: '22900', order_status: 'pending_payment', created_at: '2026-07-21T00:00:00Z', items: [{}, {}] },
    { id: 20, total_price: '15000', order_status: 'paid', created_at: '2026-07-19T00:00:00Z', items: [{}] },
    { id: 19, total_price: '8500', order_status: 'shipped', created_at: '2026-07-18T00:00:00Z', items: [{}, {}, {}] },
  ];

  it('renders a list of all orders with ID and total', async () => {
    mockList.mockResolvedValue(mockOrders);

    render(<OrderTracking onNavigate={vi.fn()} />);

    // Should show all 3 order IDs
    expect(await screen.findByText(/#21/)).toBeInTheDocument();
    expect(screen.getByText(/#20/)).toBeInTheDocument();
    expect(screen.getByText(/#19/)).toBeInTheDocument();

    // Should show totals
    expect(screen.getByText(/22,900/)).toBeInTheDocument();
    expect(screen.getByText(/15,000/)).toBeInTheDocument();
    expect(screen.getByText(/8,500/)).toBeInTheDocument();
  });

  it('clicking an order card navigates to detail view with timeline', async () => {
    mockList.mockResolvedValue(mockOrders);

    const fullOrder = {
      id: 21,
      total_price: '22900',
      order_status: 'pending_payment',
      created_at: '2026-07-21T00:00:00Z',
      items: [{ product_id: 1, quantity: 1, price_per_unit: '12000' }, { product_id: 2, quantity: 1, price_per_unit: '10900' }],
      logs: [{ id: 1, status: 'Order Created', created_at: '2026-07-21T01:00:00Z' }],
    };
    mockGet.mockResolvedValue(fullOrder);

    render(<OrderTracking onNavigate={vi.fn()} />);

    // Wait for list, then click order #21
    const card = await screen.findByText(/#21/);
    fireEvent.click(card.closest('[data-testid="order-card"]') || card.closest('button') || card);

    // Should now show the timeline detail view
    expect(await screen.findByText('order_tracking.timeline_title')).toBeInTheDocument();
    expect(mockGet).toHaveBeenCalledWith(21);
  });

  it('detail view has a back button that returns to the order list', async () => {
    mockList.mockResolvedValue(mockOrders);

    const fullOrder = {
      id: 21,
      total_price: '22900',
      order_status: 'pending_payment',
      created_at: '2026-07-21T00:00:00Z',
      items: [{ product_id: 1, quantity: 1, price_per_unit: '22900' }],
      logs: [{ id: 1, status: 'Order Created', created_at: '2026-07-21T01:00:00Z' }],
    };
    mockGet.mockResolvedValue(fullOrder);

    render(<OrderTracking onNavigate={vi.fn()} />);

    // Navigate to detail
    const card = await screen.findByText(/#21/);
    fireEvent.click(card.closest('[data-testid="order-card"]') || card.closest('button') || card);
    await screen.findByText('order_tracking.timeline_title');

    // Click back
    const backBtn = screen.getByText('order_tracking.back_to_list');
    fireEvent.click(backBtn);

    // Should be back on the list
    expect(await screen.findByText(/#21/)).toBeInTheDocument();
    expect(screen.getByText(/#20/)).toBeInTheDocument();
  });

  it('deep link via orderData.orderId skips list and shows detail directly', async () => {
    const fullOrder = {
      id: 21,
      total_price: '22900',
      order_status: 'pending_payment',
      created_at: '2026-07-21T00:00:00Z',
      items: [{ product_id: 1, quantity: 1, price_per_unit: '22900' }],
      logs: [{ id: 1, status: 'Order Created', created_at: '2026-07-21T01:00:00Z' }],
    };
    mockGet.mockResolvedValue(fullOrder);

    render(<OrderTracking onNavigate={vi.fn()} orderData={{ orderId: 21 }} />);

    // Should go straight to detail, not list
    expect(await screen.findByText('order_tracking.timeline_title')).toBeInTheDocument();
    expect(mockList).not.toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith(21);
  });
});

describe('OrderTracking product names', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('detail view shows product_name instead of Product #id', async () => {
    const mockOrder = {
      id: 50,
      total_price: '35000',
      order_status: 'processing',
      created_at: '2026-07-21T00:00:00Z',
      items: [
        { product_id: 1, quantity: 1, price_per_unit: '20000', product_name: 'RTX 4070 Super' },
        { product_id: 2, quantity: 2, price_per_unit: '7500', product_name: 'Kingston Fury 16GB DDR5' },
      ],
      logs: [{ id: 1, status: 'Order Created', created_at: '2026-07-21T01:00:00Z' }],
    };
    mockGet.mockResolvedValue(mockOrder);

    render(<OrderTracking onNavigate={vi.fn()} orderData={{ orderId: 50 }} />);

    // Should show product names
    expect(await screen.findByText('RTX 4070 Super')).toBeInTheDocument();
    expect(screen.getByText('Kingston Fury 16GB DDR5')).toBeInTheDocument();

    // Should NOT show "Product #1" or "Product #2"
    expect(screen.queryByText('Product #1')).not.toBeInTheDocument();
    expect(screen.queryByText('Product #2')).not.toBeInTheDocument();
  });

  it('detail view falls back to Product #id when product_name is missing', async () => {
    const mockOrder = {
      id: 51,
      total_price: '5000',
      order_status: 'paid',
      created_at: '2026-07-21T00:00:00Z',
      items: [
        { product_id: 7, quantity: 1, price_per_unit: '5000' },
      ],
      logs: [{ id: 1, status: 'Order Created', created_at: '2026-07-21T01:00:00Z' }],
    };
    mockGet.mockResolvedValue(mockOrder);

    render(<OrderTracking onNavigate={vi.fn()} orderData={{ orderId: 51 }} />);

    expect(await screen.findByText('Product #7')).toBeInTheDocument();
  });

  it('list card shows product names as summary text', async () => {
    const mockOrders = [
      {
        id: 30,
        total_price: '45000',
        order_status: 'paid',
        created_at: '2026-07-20T00:00:00Z',
        items: [
          { product_id: 1, product_name: 'RTX 4080' },
          { product_id: 2, product_name: 'Ryzen 7 7800X3D' },
          { product_id: 3, product_name: 'MSI B650 Tomahawk' },
        ],
      },
    ];
    mockList.mockResolvedValue(mockOrders);

    render(<OrderTracking onNavigate={vi.fn()} />);

    // Should show at least the first product name in the card
    expect(await screen.findByText(/RTX 4080/)).toBeInTheDocument();
  });
});
