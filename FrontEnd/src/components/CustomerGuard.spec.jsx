import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CustomerGuard from './CustomerGuard';

let mockUser = null;
let mockLoading = false;

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, loading: mockLoading }),
}));

describe('CustomerGuard', () => {
  beforeEach(() => {
    mockUser = null;
    mockLoading = false;
  });

  it('redirects Admin to /admin-dashboard', () => {
    mockUser = { role: 'Admin', email: 'admin@test.com' };

    const { container } = render(
      <MemoryRouter initialEntries={['/catalog']}>
        <CustomerGuard><div>Customer Page</div></CustomerGuard>
      </MemoryRouter>
    );

    expect(screen.queryByText('Customer Page')).toBeNull();
  });

  it('allows Customer through', () => {
    mockUser = { role: 'Customer', email: 'user@test.com' };

    render(
      <MemoryRouter>
        <CustomerGuard><div>Customer Page</div></CustomerGuard>
      </MemoryRouter>
    );

    expect(screen.getByText('Customer Page')).toBeInTheDocument();
  });

  it('allows Guest (not logged in) through', () => {
    mockUser = null;

    render(
      <MemoryRouter>
        <CustomerGuard><div>Customer Page</div></CustomerGuard>
      </MemoryRouter>
    );

    expect(screen.getByText('Customer Page')).toBeInTheDocument();
  });
});
