import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

const mockLogout = vi.fn();
let mockUser = null;
let mockIsAuthenticated = false;

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: mockIsAuthenticated,
    logout: mockLogout,
  }),
}));

vi.mock('../../contexts/CartContext', () => ({
  useCart: () => ({ totalItems: 2 }),
}));

vi.mock('sweetalert2', () => {
  const mockFire = vi.fn(() => Promise.resolve({ isConfirmed: true }));
  return {
    default: {
      fire: mockFire,
      mixin: vi.fn(() => ({ fire: mockFire })),
    },
  };
});

vi.mock('./ThemeToggle', () => ({ default: () => <div data-testid="theme-toggle" /> }));
vi.mock('./LanguagePicker', () => ({ default: () => <div data-testid="lang-picker" /> }));

describe('Header — Admin vs Customer', () => {
  const onNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
    mockIsAuthenticated = false;
  });

  it('hides center nav for Admin', () => {
    mockUser = { role: 'Admin', email: 'admin@test.com' };
    mockIsAuthenticated = true;

    render(<Header currentPage="admin" onNavigate={onNavigate} />);

    expect(screen.queryByText('nav.home')).toBeNull();
    expect(screen.queryByText('nav.builder')).toBeNull();
    expect(screen.queryByText('nav.shop')).toBeNull();
  });

  it('shows center nav for Customer', () => {
    mockUser = { role: 'Customer', first_name: 'John', email: 'john@test.com' };
    mockIsAuthenticated = true;

    render(<Header currentPage="landing" onNavigate={onNavigate} />);

    expect(screen.getAllByText('nav.home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('nav.shop').length).toBeGreaterThan(0);
  });

  it('shows nav.order_history and nav.order_tracking labels in nav group', () => {
    mockUser = { role: 'Customer', first_name: 'John', email: 'john@test.com' };
    mockIsAuthenticated = true;

    render(<Header currentPage="order-tracking" onNavigate={onNavigate} />);

    expect(screen.getAllByText('nav.order_history').length).toBeGreaterThan(0);
    expect(screen.getAllByText('nav.order_tracking').length).toBeGreaterThan(0);
    expect(screen.queryByText('nav.account')).toBeNull();
  });

  it('shows Order History/Order Tracking/Wishlist/Cart in profile dropdown for Customer', () => {
    mockUser = { role: 'Customer', first_name: 'John', email: 'john@test.com' };
    mockIsAuthenticated = true;

    render(<Header currentPage="landing" onNavigate={onNavigate} />);

    // Open profile dropdown
    fireEvent.click(screen.getByText('John'));

    expect(screen.getAllByText('nav.order_history').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('nav.order_tracking').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('nav.wishlist')).toBeInTheDocument();
    expect(screen.getByText('nav.cart')).toBeInTheDocument();
  });

  it('shows Admin Panel in dropdown for Admin, not customer links', () => {
    mockUser = { role: 'Admin', first_name: 'Boss', email: 'boss@test.com' };
    mockIsAuthenticated = true;

    render(<Header currentPage="admin" onNavigate={onNavigate} />);

    fireEvent.click(screen.getByText('Boss'));

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.queryByText('nav.order_history')).toBeNull();
    expect(screen.queryByText('nav.order_tracking')).toBeNull();
    expect(screen.queryByText('nav.wishlist')).toBeNull();
  });
});
