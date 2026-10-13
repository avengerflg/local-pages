import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatusBadge } from '../components/admin/StatusBadge';
import { ConfirmActionDialog } from '../components/admin/ConfirmActionDialog';
import { AdminStatCard } from '../components/admin/AdminStatCard';
import { AdminSearch } from '../components/admin/AdminSearch';
import { AdminPagination } from '../components/admin/AdminPagination';
import { LoadingState } from '../components/admin/LoadingState';
import { EmptyState } from '../components/admin/EmptyState';
import { ErrorState } from '../components/admin/ErrorState';
import { Users } from 'lucide-react';

describe('Admin Shared UI Components', () => {
  describe('StatusBadge', () => {
    it('renders label and appropriate styles for verified status', () => {
      render(<StatusBadge status="verified" />);
      const badge = screen.getByText('Verified');
      expect(badge).toBeInTheDocument();
    });

    it('renders label and styles for suspended status', () => {
      render(<StatusBadge status="suspended" />);
      const badge = screen.getByText('Suspended');
      expect(badge).toBeInTheDocument();
    });

    it('returns null if status is null or undefined', () => {
      const { container } = render(<StatusBadge status={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('ConfirmActionDialog', () => {
    it('does not render when isOpen is false', () => {
      render(
        <ConfirmActionDialog
          isOpen={false}
          onClose={jest.fn()}
          onConfirm={jest.fn()}
          title="Confirm Action"
          description="Are you sure?"
        />
      );
      expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
    });

    it('renders title, description and triggers onConfirm', () => {
      const handleConfirm = jest.fn();
      const handleClose = jest.fn();

      render(
        <ConfirmActionDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Suspend User?"
          description="This will lock their account."
          confirmText="Yes, Suspend"
          intent="danger"
        />
      );

      expect(screen.getByText('Suspend User?')).toBeInTheDocument();
      expect(screen.getByText('This will lock their account.')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Yes, Suspend' }));
      expect(handleConfirm).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('AdminStatCard', () => {
    it('renders title, value, icon, and subStats correctly', () => {
      render(
        <AdminStatCard
          title="Total Users"
          value={124}
          icon={Users}
          subStats={[
            { label: 'Active', value: 120 },
            { label: 'Suspended', value: 4 },
          ]}
        />
      );

      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('124')).toBeInTheDocument();
      expect(screen.getByText('Active:')).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument();
      expect(screen.getByText('Suspended:')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  describe('AdminSearch', () => {
    it('handles typing and submission', () => {
      const handleChange = jest.fn();
      render(<AdminSearch value="" onChange={handleChange} placeholder="Search test..." />);

      const input = screen.getByPlaceholderText('Search test...');
      fireEvent.change(input, { target: { value: 'Plumbing' } });
      fireEvent.submit(input);

      expect(handleChange).toHaveBeenCalledWith('Plumbing');
    });

    it('clears input when clear button is clicked', () => {
      const handleChange = jest.fn();
      render(<AdminSearch value="Solar" onChange={handleChange} />);

      const clearBtn = screen.getByLabelText('Clear search');
      fireEvent.click(clearBtn);

      expect(handleChange).toHaveBeenCalledWith('');
    });
  });

  describe('AdminPagination', () => {
    it('renders page info and navigation triggers', () => {
      const handlePageChange = jest.fn();
      render(
        <AdminPagination
          currentPage={2}
          lastPage={5}
          total={50}
          perPage={10}
          onPageChange={handlePageChange}
        />
      );

      expect(screen.getByText(/Showing/)).toBeInTheDocument();
      expect(screen.getByText('2 / 5')).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText('Previous page'));
      expect(handlePageChange).toHaveBeenCalledWith(1);

      fireEvent.click(screen.getByLabelText('Next page'));
      expect(handlePageChange).toHaveBeenCalledWith(3);
    });
  });

  describe('States: Loading, Empty, and Error', () => {
    it('renders LoadingState', () => {
      render(<LoadingState message="Fetching records..." />);
      expect(screen.getByText('Fetching records...')).toBeInTheDocument();
    });

    it('renders EmptyState with custom title', () => {
      render(<EmptyState title="Nothing here" description="Check back later." />);
      expect(screen.getByText('Nothing here')).toBeInTheDocument();
      expect(screen.getByText('Check back later.')).toBeInTheDocument();
    });

    it('renders ErrorState and triggers onRetry', () => {
      const handleRetry = jest.fn();
      render(<ErrorState title="Load Error" onRetry={handleRetry} />);

      expect(screen.getByText('Load Error')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Try Again'));
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });
});
