import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RoleGuard } from '../components/ui/RoleGuard';
import { useAuth } from '../providers/auth-provider';
import { useRouter } from 'next/navigation';

jest.mock('../providers/auth-provider');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('RoleGuard & Unauthenticated Access Protection', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  it('redirects unauthenticated users to /login and preserves intended_url', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(
      <RoleGuard allowedRoles={['customer']}>
        <div>Protected Customer Content</div>
      </RoleGuard>
    );

    expect(screen.queryByText('Protected Customer Content')).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('intended_url', expect.any(String));
  });

  it('allows authenticated customer to view customer-protected content', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, role: 'customer', name: 'John Doe' },
      isLoading: false,
    });

    render(
      <RoleGuard allowedRoles={['customer']}>
        <div>Protected Customer Content</div>
      </RoleGuard>
    );

    expect(screen.getByText('Protected Customer Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects unauthorized roles (e.g. tradie) to /unauthorized', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 2, role: 'tradie', name: 'Bob Tradie' },
      isLoading: false,
    });

    render(
      <RoleGuard allowedRoles={['customer']}>
        <div>Protected Customer Content</div>
      </RoleGuard>
    );

    expect(screen.queryByText('Protected Customer Content')).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/unauthorized');
  });
});
