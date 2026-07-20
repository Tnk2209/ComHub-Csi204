import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProductDetail from './ProductDetail';

const store = {};
const mockLocalStorage = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
};
Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage, writable: true });

const mockProduct = {
  id: 42,
  name: 'Test CPU',
  category: 'CPU',
  price: 9999,
  stock_quantity: 10,
  image_url: null,
  average_rating: 4.5,
  specifications: { socket: 'AM5' },
};

const mockReviews = {
  reviews: [
    { id: 1, user_id: 99, user_name: 'Other User', rating: 4, comment: 'Great product', created_at: '2025-01-01' },
  ],
  total: 1,
};

vi.mock('../../services/productService', () => ({
  get: vi.fn(() => Promise.resolve(mockProduct)),
}));

const mockCreate = vi.fn(() => Promise.resolve({ id: 2, rating: 5, comment: 'Awesome!' }));
const mockList = vi.fn(() => Promise.resolve(mockReviews));
const mockRemove = vi.fn(() => Promise.resolve());

vi.mock('../../services/reviewService', () => ({
  list: (...args) => mockList(...args),
  create: (...args) => mockCreate(...args),
  remove: (...args) => mockRemove(...args),
}));

vi.mock('../../services/wishlistService', () => ({
  add: vi.fn(),
  remove: vi.fn(),
  list: vi.fn(() => Promise.resolve([])),
}));

const mockAddItem = vi.fn();

vi.mock('../../contexts/CartContext', () => ({
  useCart: () => ({ addItem: mockAddItem }),
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 5, email: 'test@test.com' }, isAuthenticated: true }),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: true })) },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key,
    i18n: { language: 'th' },
  }),
}));

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ state: null }),
}));

describe('ProductDetail — Review Form', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    mockCreate.mockClear();
    mockList.mockClear();
    mockRemove.mockClear();
  });

  it('shows review form with star selector and textarea in reviews tab', async () => {
    render(<ProductDetail onNavigate={() => {}} productId={42} />);

    await waitFor(() => expect(screen.getByText('Test CPU')).toBeInTheDocument());

    fireEvent.click(screen.getByText('product_detail.tab_reviews'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/write.*review/i)).toBeInTheDocument();
    });
  });

  it('submits a review and refreshes the list', async () => {
    mockList.mockResolvedValueOnce(mockReviews).mockResolvedValueOnce({
      reviews: [...mockReviews.reviews, { id: 2, user_id: 5, user_name: 'Me', rating: 5, comment: 'Awesome!', created_at: '2025-06-01' }],
      total: 2,
    });

    render(<ProductDetail onNavigate={() => {}} productId={42} />);
    await waitFor(() => expect(screen.getByText('Test CPU')).toBeInTheDocument());

    fireEvent.click(screen.getByText('product_detail.tab_reviews'));
    await waitFor(() => expect(screen.getByPlaceholderText(/write.*review/i)).toBeInTheDocument());

    // Select 5 stars
    const stars = screen.getAllByTestId('review-star');
    fireEvent.click(stars[4]);

    // Type comment
    fireEvent.change(screen.getByPlaceholderText(/write.*review/i), { target: { value: 'Awesome!' } });

    // Submit
    fireEvent.click(screen.getByTestId('submit-review'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(42, { rating: 5, comment: 'Awesome!' });
    });
  });

  it('shows error on duplicate review (409)', async () => {
    mockCreate.mockRejectedValueOnce({ status: 409, body: { message: 'Already reviewed' } });

    render(<ProductDetail onNavigate={() => {}} productId={42} />);
    await waitFor(() => expect(screen.getByText('Test CPU')).toBeInTheDocument());

    fireEvent.click(screen.getByText('product_detail.tab_reviews'));
    await waitFor(() => expect(screen.getByPlaceholderText(/write.*review/i)).toBeInTheDocument());

    const stars = screen.getAllByTestId('review-star');
    fireEvent.click(stars[2]);
    fireEvent.change(screen.getByPlaceholderText(/write.*review/i), { target: { value: 'Dup' } });
    fireEvent.click(screen.getByTestId('submit-review'));

    await waitFor(() => {
      expect(screen.getByText(/already reviewed|รีวิวแล้ว/i)).toBeInTheDocument();
    });
  });
});

describe('ProductDetail — Add to Cart with Quantity', () => {
  beforeEach(() => {
    mockAddItem.mockClear();
  });

  it('passes quantity to addItem when clicking Add to Cart', async () => {
    render(<ProductDetail onNavigate={() => {}} productId={42} />);
    await waitFor(() => expect(screen.getByText('Test CPU')).toBeInTheDocument());

    // Increase quantity to 3
    const plusButton = screen.getByText('+');
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);

    // Click Add to Cart
    fireEvent.click(screen.getByText('product_detail.add_to_cart'));

    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 42, name: 'Test CPU' }),
      3
    );
  });
});

describe('ProductDetail — Wishlist status on mount', () => {
  it('fetches wishlist status and shows wishlisted state', async () => {
    const { list } = await import('../../services/wishlistService');
    list.mockResolvedValue([{ product_id: 42 }]);

    render(<ProductDetail onNavigate={() => {}} productId={42} />);
    await waitFor(() => expect(screen.getByText('Test CPU')).toBeInTheDocument());

    await waitFor(() => {
      expect(screen.getByText('product_detail.wishlisted')).toBeInTheDocument();
    });
  });
});
