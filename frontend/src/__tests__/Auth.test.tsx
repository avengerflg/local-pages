import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../providers/auth-provider';
import * as authApi from '../services/auth-api';
import LoginPage from '../app/login/page';
import RegisterPage from '../app/register/page';
import ForgotPasswordPage from '../app/forgot-password/page';
import ResetPasswordPage from '../app/reset-password/page';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../services/auth-api', () => ({
  login: jest.fn(),
  registerCustomer: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn()
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const mockPush = jest.fn();

describe('Auth Workflows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  describe('Login', () => {
    it('handles login success', async () => {
      (authApi.login as jest.Mock).mockResolvedValueOnce({
        token: 'test-token', user: { id: 1, role: 'customer' }
      });

      render(
        <QueryClientProvider client={new QueryClient()}>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </QueryClientProvider>
      );

      fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
      fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password', device_name: 'web' });
        expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token');
        expect(mockPush).toHaveBeenCalledWith('/customer');
      });
    });

    it('handles login validation/API failure', async () => {
      (authApi.login as jest.Mock).mockRejectedValueOnce({
        data: { errors: { email: ['Invalid email'] } }
      });

      render(
        <QueryClientProvider client={new QueryClient()}>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </QueryClientProvider>
      );

      fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
      fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
      });
    });
  });

  describe('Registration', () => {
    it('handles registration success', async () => {
      (authApi.registerCustomer as jest.Mock).mockResolvedValueOnce({
        token: 'test-token', user: { id: 1, role: 'customer' }
      });

      render(
        <QueryClientProvider client={new QueryClient()}>
          <AuthProvider>
            <RegisterPage />
          </AuthProvider>
        </QueryClientProvider>
      );

      fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } });
      fireEvent.change(screen.getByLabelText('Confirm Password *'), { target: { value: 'password' } });
      fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } });
      fireEvent.change(screen.getByLabelText('Confirm Password *'), { target: { value: 'password' } });
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));

      await waitFor(() => {
        expect(authApi.registerCustomer).toHaveBeenCalled();
      });
    });

    it('handles registration validation failure', async () => {
      (authApi.registerCustomer as jest.Mock).mockRejectedValueOnce({
        data: { errors: { name: ['Name is required'] } }
      });

      render(
        <QueryClientProvider client={new QueryClient()}>
          <AuthProvider>
            <RegisterPage />
          </AuthProvider>
        </QueryClientProvider>
      );

      fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } });
      fireEvent.change(screen.getByLabelText('Confirm Password *'), { target: { value: 'password' } });
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });
  });

  describe('Password', () => {
    it('forgot password success', async () => {
      (authApi.forgotPassword as jest.Mock).mockResolvedValueOnce({ message: 'Sent' });

      render(<ForgotPasswordPage />);
      fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'test@test.com' } });
      fireEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }));

      await waitFor(() => {
        expect(screen.getByText(/If an account exists with that email/i)).toBeInTheDocument();
      });
    });

    it('reset password success', async () => {
      (authApi.resetPassword as jest.Mock).mockResolvedValueOnce({ message: 'Reset' });
      // Mock window.location.search
      window.history.pushState({}, 'Test', '/reset-password?token=abc&email=test@test.com');

      render(<ResetPasswordPage />);
      await waitFor(() => expect(screen.getByRole('button', { name: /Reset Password/i })).not.toBeDisabled());
      fireEvent.change(screen.getByLabelText(/^New Password$/i), { target: { value: 'newpass' } });
      fireEvent.change(screen.getByLabelText(/Confirm New Password/i), { target: { value: 'newpass' } });
      fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

      await waitFor(() => {
        expect(screen.getByText(/Your password has been successfully reset/i)).toBeInTheDocument();
      });
    });
  });
});
