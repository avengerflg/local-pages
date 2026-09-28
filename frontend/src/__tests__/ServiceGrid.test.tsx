import { render, screen } from '@testing-library/react';
import { ServiceGrid } from '../components/services/ServiceGrid';
import { Service } from '../types/api';
import '@testing-library/jest-dom';

describe('ServiceGrid', () => {
  it('renders service results correctly', () => {
    const services: Service[] = [
      { id: 1, name: 'Plumbing', slug: 'plumbing', description: 'Fix pipes', status: 'active' },
      { id: 2, name: 'Electrical', slug: 'electrical', description: null, status: 'active' },
    ];
    render(<ServiceGrid services={services} />);
    expect(screen.getByText('Plumbing')).toBeInTheDocument();
    expect(screen.getByText('Fix pipes')).toBeInTheDocument();
    expect(screen.getByText('Electrical')).toBeInTheDocument();
  });

  it('handles empty results', () => {
    render(<ServiceGrid services={[]} />);
    expect(screen.getByText('No services found.')).toBeInTheDocument();
  });
});
