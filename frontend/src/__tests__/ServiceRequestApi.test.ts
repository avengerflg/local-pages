import { 
  createServiceRequest, 
  getServiceRequests, 
  getServiceRequest, 
  cancelServiceRequest 
} from '../services/service-request-api';
import { api } from '../lib/api-client';

jest.mock('../lib/api-client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('ServiceRequest API Contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createServiceRequest', () => {
    it('sends JSON payload when no attachments are present', async () => {
      const mockResponse = {
        data: {
          id: 1,
          customer_id: 5,
          service_id: 2,
          postcode: '2000',
          title: 'Fix Pipe',
          status: 'submitted',
          submitted_at: '2026-10-15T10:00:00Z',
        },
      };

      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await createServiceRequest({
        service_id: 2,
        postcode: '2000',
        title: 'Fix Pipe',
        description: 'Leaking bathroom tap',
        location_id: 10,
        answers: [
          { question_id: 1, selected_option_id: 101 },
          { question_id: 2, answer_text: 'Urgent' },
        ],
      });

      expect(api.post).toHaveBeenCalledWith('/service-requests', {
        service_id: 2,
        postcode: '2000',
        title: 'Fix Pipe',
        description: 'Leaking bathroom tap',
        location_id: 10,
        answers: [
          { question_id: 1, selected_option_id: 101 },
          { question_id: 2, answer_text: 'Urgent' },
        ],
      });
      expect(result.id).toBe(1);
      expect(result.status).toBe('submitted');
    });

    it('sends multipart FormData when attachments are provided', async () => {
      const mockResponse = {
        data: {
          id: 2,
          customer_id: 5,
          service_id: 3,
          postcode: '3000',
          status: 'submitted',
          attachments: [
            { id: 101, original_name: 'photo.jpg', mime_type: 'image/jpeg', file_size: 1024 },
          ],
        },
      };

      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const mockFile = new File(['fake content'], 'photo.jpg', { type: 'image/jpeg' });

      const result = await createServiceRequest({
        service_id: 3,
        postcode: '3000',
        title: 'With Photo',
        attachments: [mockFile],
        answers: [{ question_id: 5, answer_text: 'See attached' }],
      });

      expect(api.post).toHaveBeenCalledTimes(1);
      const [endpoint, formDataArg] = (api.post as jest.Mock).mock.calls[0];
      expect(endpoint).toBe('/service-requests');
      expect(formDataArg).toBeInstanceOf(FormData);
      expect(result.id).toBe(2);
    });
  });

  describe('getServiceRequests and getServiceRequest', () => {
    it('fetches paginated service requests list', async () => {
      const mockPaginated = {
        data: [{ id: 1, title: 'Request 1', status: 'submitted' }],
        links: { first: '', last: '', prev: null, next: null },
        meta: { current_page: 1, from: 1, last_page: 1, path: '', per_page: 15, to: 1, total: 1 },
      };

      (api.get as jest.Mock).mockResolvedValueOnce(mockPaginated);

      const res = await getServiceRequests(1, 15);
      expect(api.get).toHaveBeenCalledWith('/service-requests?page=1&per_page=15');
      expect(res.data).toHaveLength(1);
    });

    it('fetches single service request by ID', async () => {
      const mockSingle = {
        data: {
          id: 42,
          title: 'My Request',
          status: 'submitted',
          service: { id: 1, name: 'Plumbing' },
        },
      };

      (api.get as jest.Mock).mockResolvedValueOnce(mockSingle);

      const res = await getServiceRequest(42);
      expect(api.get).toHaveBeenCalledWith('/service-requests/42');
      expect(res.id).toBe(42);
      expect(res.service?.name).toBe('Plumbing');
    });
  });

  describe('cancelServiceRequest', () => {
    it('calls cancel endpoint', async () => {
      const mockCancelled = {
        data: { id: 42, status: 'cancelled' },
      };

      (api.post as jest.Mock).mockResolvedValueOnce(mockCancelled);

      const res = await cancelServiceRequest(42);
      expect(api.post).toHaveBeenCalledWith('/service-requests/42/cancel');
      expect(res.status).toBe('cancelled');
    });
  });
});
