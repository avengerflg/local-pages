import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomerProfilePage from '../app/(customer)/customer/profile/page';
import { AuthContext } from '../providers/auth-provider';
import { useCustomerProfile, useUpdateCustomerProfile } from '../hooks/use-customer';

jest.mock('../hooks/use-customer', () => ({
  useCustomerProfile: jest.fn(),
  useUpdateCustomerProfile: jest.fn(),
}));

describe('Customer Profile', () => {
  const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer' as import('../types/api').UserRole, status: 'active' as import('../types/api').UserStatus, email_verified_at: null, created_at: '', updated_at: '' };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders customer profile', () => {
    (useCustomerProfile as jest.Mock).mockReturnValue({
      data: { postcode: '2000', address: '123 Fake St' },
      isLoading: false
    });
    
    const mutate = jest.fn();
    (useUpdateCustomerProfile as jest.Mock).mockReturnValue({
      mutate,
      isPending: false,
      isError: false
    });

    render(
      <AuthContext.Provider value={{ user: mockUser, isLoading: false, login: jest.fn(), logout: jest.fn() }}>
        <CustomerProfilePage />
      </AuthContext.Provider>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
  });

  it('profile update success', async () => {
    (useCustomerProfile as jest.Mock).mockReturnValue({
      data: { postcode: '2000', address: '123 Fake St' },
      isLoading: false
    });
    
    const mutate = jest.fn((data, options) => {
      options.onSuccess();
    });
    
    (useUpdateCustomerProfile as jest.Mock).mockReturnValue({
      mutate,
      isPending: false,
      isError: false
    });

    render(
      <AuthContext.Provider value={{ user: mockUser, isLoading: false, login: jest.fn(), logout: jest.fn() }}>
        <CustomerProfilePage />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Postcode/i), { target: { value: '2001' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({ postcode: '2001', address: '123 Fake St' }, expect.any(Object));
      expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
    });
  });
});
