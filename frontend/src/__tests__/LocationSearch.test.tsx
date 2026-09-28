import { render, screen } from '@testing-library/react';
import { LocationSearch } from '../components/locations/LocationSearch';
import { useLocations } from '../hooks/use-locations';


jest.mock('../hooks/use-locations');
jest.mock('../hooks/use-debounce', () => ({
  useDebounce: (value: string) => value,
}));

describe('LocationSearch', () => {
  it('renders correctly', () => {
    (useLocations as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
    render(<LocationSearch />);
    expect(screen.getByTestId('location-search-input')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useLocations as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    render(<LocationSearch />);
    expect(screen.getByTestId('location-loading')).toBeInTheDocument();
  });

  it('renders locations', () => {
    (useLocations as jest.Mock).mockReturnValue({
      data: [{ id: 1, name: 'Sydney', type: 'suburb', postcode: '2000' }],
      isLoading: false,
      error: null,
    });
    render(<LocationSearch />);
    expect(screen.getByText(/Sydney/)).toBeInTheDocument();
  });
});
