import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceRequestWizard } from '../components/requests/ServiceRequestWizard';
import * as servicesApi from '../services/service-api';
import * as serviceRequestApi from '../services/service-request-api';
import * as locationApi from '../services/location-api';
import { Service } from '../types/api';

// Mock APIs
jest.mock('../services/service-api');
jest.mock('../services/service-request-api');
jest.mock('../services/location-api');

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
  }),
  usePathname: () => '/customer/requests/new',
}));

describe('ServiceRequestWizard Intake Workflow', () => {
  let queryClient: QueryClient;

  const mockServicesList: Service[] = [
    {
      id: 1,
      name: 'Plumbing Services',
      slug: 'plumbing',
      description: 'Expert residential plumbing and drainage.',
      status: 'active',
    },
    {
      id: 2,
      name: 'Electrical Works',
      slug: 'electrical',
      description: 'Licensed switchboard and wiring.',
      status: 'active',
    },
  ];

  const mockPlumbingDetail: Service = {
    id: 1,
    name: 'Plumbing Services',
    slug: 'plumbing',
    description: 'Expert residential plumbing and drainage.',
    status: 'active',
    questions: [
      {
        id: 10,
        service_id: 1,
        question_text: 'What property type?',
        question_type: 'single_choice',
        required: true,
        sort_order: 1,
        conditional_rule: null,
        options: [
          { id: 101, question_id: 10, label: 'House', value: 'house', sort_order: 1 },
          { id: 102, question_id: 10, label: 'Apartment', value: 'apartment', sort_order: 2 },
        ],
      },
      {
        id: 11,
        service_id: 1,
        question_text: 'What floor is the apartment on?',
        question_type: 'text',
        required: true,
        sort_order: 2,
        conditional_rule: {
          depends_on_question_id: 10,
          selected_option_id: 102, // Only when Apartment (102) is selected
        },
      },
      {
        id: 12,
        service_id: 1,
        question_text: 'Which plumbing fixtures need attention?',
        question_type: 'multiple_choice',
        required: false,
        sort_order: 3,
        conditional_rule: null,
        options: [
          { id: 201, question_id: 12, label: 'Toilet', value: 'toilet', sort_order: 1 },
          { id: 202, question_id: 12, label: 'Kitchen Sink', value: 'sink', sort_order: 2 },
        ],
      },
      {
        id: 13,
        service_id: 1,
        question_text: 'Photos of the leak',
        question_type: 'file_upload',
        required: false,
        sort_order: 4,
        conditional_rule: null,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    (servicesApi.getServices as jest.Mock).mockResolvedValue(mockServicesList);
    (servicesApi.getService as jest.Mock).mockResolvedValue(mockPlumbingDetail);
    (locationApi.getLocations as jest.Mock).mockResolvedValue([
      { id: 77, name: 'Bondi', postcode: '2026', type: 'suburb', status: 'active', parent_id: null, code: null },
    ]);
  });

  const renderWizard = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ServiceRequestWizard />
      </QueryClientProvider>
    );
  };

  it('renders Step 1 with service catalog and enforces service selection', async () => {
    renderWizard();

    await waitFor(() => {
      expect(screen.getByText('Plumbing Services')).toBeInTheDocument();
      expect(screen.getByText('Electrical Works')).toBeInTheDocument();
    });

    // Try to click continue without selecting a service
    fireEvent.click(screen.getByTestId('wizard-continue-button'));
    expect(screen.getByText('Please select a trade service to continue.')).toBeInTheDocument();

    // Select Plumbing Services
    fireEvent.click(screen.getByTestId('select-service-1'));

    // Now click continue -> should proceed to Step 2
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    await waitFor(() => {
      expect(screen.getByTestId('step-2-questions')).toBeInTheDocument();
      expect(screen.getByText('What property type?')).toBeInTheDocument();
    });
  });

  it('renders question types properly and enforces required questions in Step 2', async () => {
    renderWizard();

    // Move to Step 2
    await waitFor(() => screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    await waitFor(() => {
      expect(screen.getByText('What property type?')).toBeInTheDocument();
    });

    // Verify multiple choice checkboxes render
    expect(screen.getByTestId('checkbox-option-201')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-option-202')).toBeInTheDocument();

    // Try to continue without answering required question 10
    fireEvent.click(screen.getByTestId('wizard-continue-button'));
    expect(screen.getByText(/"What property type\?" is required\./i)).toBeInTheDocument();
  });

  it('evaluates dynamic conditional visibility rules correctly', async () => {
    renderWizard();

    // Select Plumbing and proceed to questions
    await waitFor(() => screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    await waitFor(() => {
      expect(screen.getByText('What property type?')).toBeInTheDocument();
    });

    // Child question "What floor is the apartment on?" should initially NOT be visible
    expect(screen.queryByText('What floor is the apartment on?')).not.toBeInTheDocument();

    // Select "House" (Option 101) -> Condition is NOT met
    fireEvent.click(screen.getByTestId('option-101'));
    expect(screen.queryByText('What floor is the apartment on?')).not.toBeInTheDocument();

    // Switch selection to "Apartment" (Option 102) -> Condition is met!
    fireEvent.click(screen.getByTestId('option-102'));

    await waitFor(() => {
      expect(screen.getByText('What floor is the apartment on?')).toBeInTheDocument();
    });

    // Switch back to "House" -> Question hides again
    fireEvent.click(screen.getByTestId('option-101'));
    expect(screen.queryByText('What floor is the apartment on?')).not.toBeInTheDocument();
  });

  it('handles location search, selection, and postcode validation in Step 3', async () => {
    renderWizard();

    // Step 1: Select Plumbing
    await waitFor(() => screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    // Step 2: Answer required question
    await waitFor(() => screen.getByTestId('option-101'));
    fireEvent.click(screen.getByTestId('option-101')); // House
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    // Step 3: Location
    await waitFor(() => {
      expect(screen.getByTestId('step-3-location')).toBeInTheDocument();
    });

    // Attempt to continue with empty postcode
    fireEvent.click(screen.getByTestId('wizard-continue-button'));
    expect(screen.getByText('Postcode is required.')).toBeInTheDocument();

    // Type a postcode
    fireEvent.change(screen.getByTestId('postcode-input'), { target: { value: '2026' } });
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    // Should successfully proceed to Step 4
    await waitFor(() => {
      expect(screen.getByTestId('step-4-details')).toBeInTheDocument();
    });
  });

  it('validates file attachment sizes and limits in Step 4', async () => {
    renderWizard();

    // Navigate to Step 4
    await waitFor(() => screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    await waitFor(() => screen.getByTestId('option-101'));
    fireEvent.click(screen.getByTestId('option-101'));
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    await waitFor(() => screen.getByTestId('postcode-input'));
    fireEvent.change(screen.getByTestId('postcode-input'), { target: { value: '2000' } });
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    await waitFor(() => screen.getByTestId('step-4-details'));

    // Try to upload an oversized file (>10MB)
    const fileInput = screen.getByTestId('file-input');
    const largeFile = new File(['x'.repeat(100)], 'huge-file.pdf', { type: 'application/pdf' });
    Object.defineProperty(largeFile, 'size', { value: 15 * 1024 * 1024 }); // 15MB

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(screen.getByText(/exceeds the maximum 10MB file size limit/i)).toBeInTheDocument();

    // Upload a valid file (<10MB)
    const validFile = new File(['sample content'], 'photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(validFile, 'size', { value: 1024 * 500 }); // 500KB

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(screen.getByText('photo.jpg')).toBeInTheDocument();
    });

    // Remove the file
    fireEvent.click(screen.getByTestId('remove-attachment-0'));
    expect(screen.queryByText('photo.jpg')).not.toBeInTheDocument();
  });

  it('renders Step 5 Review Summary and successfully submits request', async () => {
    const mockCreatedRequest = {
      id: 99,
      customer_id: 1,
      service_id: 1,
      postcode: '2026',
      title: 'Fix Burst Pipe',
      status: 'submitted',
      submitted_at: '2026-10-15T12:00:00Z',
      service: { id: 1, name: 'Plumbing Services' },
      location: { id: 77, name: 'Bondi', postcode: '2026' },
    };

    (serviceRequestApi.createServiceRequest as jest.Mock).mockResolvedValueOnce(mockCreatedRequest);

    renderWizard();

    // Step 1
    await waitFor(() => screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    // Step 2
    await waitFor(() => screen.getByTestId('option-101'));
    fireEvent.click(screen.getByTestId('option-101')); // House
    fireEvent.click(screen.getByTestId('checkbox-option-201')); // Toilet
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    // Step 3
    await waitFor(() => screen.getByTestId('postcode-input'));
    fireEvent.change(screen.getByTestId('postcode-input'), { target: { value: '2026' } });
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    // Step 4
    await waitFor(() => screen.getByTestId('request-title-input'));
    fireEvent.change(screen.getByTestId('request-title-input'), { target: { value: 'Fix Burst Pipe' } });
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    // Step 5: Review
    await waitFor(() => {
      expect(screen.getByTestId('step-5-review')).toBeInTheDocument();
      expect(screen.getByText('Fix Burst Pipe')).toBeInTheDocument();
      expect(screen.getAllByText('Plumbing Services').length).toBeGreaterThanOrEqual(1);
    });

    // Submit Request
    fireEvent.click(screen.getByTestId('wizard-submit-button'));

    await waitFor(() => {
      expect(serviceRequestApi.createServiceRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          service_id: 1,
          postcode: '2026',
          title: 'Fix Burst Pipe',
        })
      );
      expect(screen.getByTestId('success-confirmation')).toBeInTheDocument();
      expect(screen.getByText(/Request #99 Submitted/i)).toBeInTheDocument();
      expect(screen.getByTestId('view-requests-button')).toBeInTheDocument();
    });
  });

  it('maps API 422 errors and prevents duplicate submissions while pending', async () => {
    // Make createServiceRequest hang temporarily to check duplicate-submit prevention
    let rejectApi: (val: unknown) => void;
    const apiPromise = new Promise((_, reject) => {
      rejectApi = reject;
    });

    (serviceRequestApi.createServiceRequest as jest.Mock).mockReturnValueOnce(apiPromise);

    renderWizard();

    // Fast-forward to Step 5
    await waitFor(() => screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('select-service-1'));
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    await waitFor(() => screen.getByTestId('option-101'));
    fireEvent.click(screen.getByTestId('option-101'));
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    await waitFor(() => screen.getByTestId('postcode-input'));
    fireEvent.change(screen.getByTestId('postcode-input'), { target: { value: '2000' } });
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    await waitFor(() => screen.getByTestId('step-4-details'));
    fireEvent.click(screen.getByTestId('wizard-continue-button'));

    await waitFor(() => screen.getByTestId('step-5-review'));

    const submitBtn = screen.getByTestId('wizard-submit-button');
    fireEvent.click(submitBtn);

    // Button should be disabled and show loading state
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/SUBMITTING REQUEST\.\.\./i)).toBeInTheDocument();

    // Reject with 422 error
    rejectApi!({
      status: 422,
      data: {
        message: 'The given data was invalid.',
        errors: {
          postcode: ['The submitted postcode does not match the selected location.'],
        },
      },
    });

    // Wait for error banner
    await waitFor(() => {
      expect(screen.getByTestId('api-error-alert')).toBeInTheDocument();
      expect(screen.getByText('The given data was invalid.')).toBeInTheDocument();
    });
  });
});
