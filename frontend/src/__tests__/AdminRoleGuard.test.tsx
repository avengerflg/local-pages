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

describe('Admin Route Protection & RoleGuard', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  it('redirects unauthenticated users attempting to access admin to /login', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(
      <RoleGuard allowedRoles={['admin']}>
        <div>Secret Admin Portal</div>
      </RoleGuard>
    );

    expect(screen.queryByText('Secret Admin Portal')).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('redirects non-admin customers attempting to access admin to /unauthorized', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, role: 'customer', name: 'Alice Customer' },
      isLoading: false,
    });

    render(
      <RoleGuard allowedRoles={['admin']}>
        <div>Secret Admin Portal</div>
      </RoleGuard>
    );

    expect(screen.queryByText('Secret Admin Portal')).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/unauthorized');
  });

  it('redirects non-admin tradies attempting to access admin to /unauthorized', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 2, role: 'tradie', name: 'Bob Tradie' },
      isLoading: false,
    });

    render(
      <RoleGuard allowedRoles={['admin']}>
        <div>Secret Admin Portal</div>
      </RoleGuard>
    );

    expect(screen.queryByText('Secret Admin Portal')).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/unauthorized');
  });

  it('allows authenticated administrator to view protected admin content', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 99, role: 'admin', name: 'Super Admin' },
      isLoading: false,
    });

    render(
      <RoleGuard allowedRoles={['admin']}>
        <div>Secret Admin Portal</div>
      </RoleGuard>
    );

    expect(screen.getByText('Secret Admin Portal')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
