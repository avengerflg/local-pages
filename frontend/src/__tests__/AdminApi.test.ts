import * as adminApi from '../services/admin-api';
import { api } from '../lib/api-client';

jest.mock('../lib/api-client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Admin API Service Layer & Endpoint Contracts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Dashboard', () => {
    it('calls GET /admin/dashboard and returns stats', async () => {
      const mockStats = {
        users: { total: 10, customers: 5, tradies: 4, admins: 1, active: 9, suspended: 1, pending: 0 },
        tradies: { total: 4, verified: 2, pending: 1, under_review: 1, rejected: 0 },
        service_requests: { total: 20, draft: 1, submitted: 5, matching: 2, quoting: 3, quote_accepted: 4, scheduled: 2, in_progress: 1, completed: 2, cancelled: 0 },
        quotes: { total: 12, pending: 6, accepted: 4, rejected: 2 },
        appointments: { total: 5, scheduled: 3, completed: 2 },
        jobs: { total: 6, scheduled: 2, in_progress: 1, completed: 3 },
        reviews: { total: 8, pending: 2, approved: 5, rejected: 1 },
        services: { total: 15, active: 12, inactive: 3 },
      };

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockStats });

      const result = await adminApi.getAdminDashboard();

      expect(api.get).toHaveBeenCalledWith('/admin/dashboard');
      expect(result.users.total).toBe(10);
      expect(result.tradies.pending).toBe(1);
    });
  });

  describe('Users', () => {
    it('calls GET /admin/users with query params', async () => {
      const mockUsers = {
        data: [{ id: 1, name: 'Alice', email: 'alice@test.com', role: 'customer', status: 'active' }],
        meta: { current_page: 1, last_page: 1, total: 1, per_page: 15 },
      };

      (api.get as jest.Mock).mockResolvedValueOnce(mockUsers);

      const result = await adminApi.getAdminUsers({ page: 1, per_page: 15, role: 'customer', search: 'Alice' });

      expect(api.get).toHaveBeenCalledWith('/admin/users?page=1&per_page=15&role=customer&search=Alice');
      expect(result.data).toHaveLength(1);
    });

    it('calls GET /admin/users/{id} for user details', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: { id: 5, name: 'Bob' } });

      const result = await adminApi.getAdminUser(5);

      expect(api.get).toHaveBeenCalledWith('/admin/users/5');
      expect(result.id).toBe(5);
    });

    it('calls PATCH /admin/users/{id}/status to update user status', async () => {
      (api.patch as jest.Mock).mockResolvedValueOnce({ data: { id: 5, status: 'suspended' } });

      const result = await adminApi.updateAdminUserStatus(5, 'suspended');

      expect(api.patch).toHaveBeenCalledWith('/admin/users/5/status', { status: 'suspended' });
      expect(result.status).toBe('suspended');
    });
  });

  describe('Tradies and Documents', () => {
    it('calls GET /admin/tradies with filters', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [], meta: { current_page: 1, last_page: 1, total: 0 } });

      await adminApi.getAdminTradies({ verification_status: 'pending' });

      expect(api.get).toHaveBeenCalledWith('/admin/tradies?verification_status=pending');
    });

    it('calls PATCH /admin/tradies/{id}/verification to update verification status', async () => {
      (api.patch as jest.Mock).mockResolvedValueOnce({ data: { id: 3, verification_status: 'verified' } });

      const res = await adminApi.updateAdminTradieVerification(3, 'verified');

      expect(api.patch).toHaveBeenCalledWith('/admin/tradies/3/verification', { verification_status: 'verified' });
      expect(res.verification_status).toBe('verified');
    });

    it('calls GET /admin/tradies/{id}/documents to fetch tradie documents', async () => {
      const mockDocs = [
        { id: 1, original_name: 'license.pdf', download_url: 'http://localhost/download/1', status: 'pending' },
      ];
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockDocs });

      const res = await adminApi.getAdminTradieDocuments(3);

      expect(api.get).toHaveBeenCalledWith('/admin/tradies/3/documents');
      expect(res[0].download_url).toBe('http://localhost/download/1');
    });

    it('calls PATCH /admin/tradie-documents/{id}/status to approve or reject document', async () => {
      (api.patch as jest.Mock).mockResolvedValueOnce({ data: { id: 1, status: 'approved' } });

      const res = await adminApi.updateAdminTradieDocumentStatus(1, 'approved');

      expect(api.patch).toHaveBeenCalledWith('/admin/tradie-documents/1/status', { status: 'approved' });
      expect(res.status).toBe('approved');
    });
  });

  describe('Services & Questions', () => {
    it('calls POST /admin/services to create a new service', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 10, name: 'Electrical' } });

      const res = await adminApi.createAdminService({ name: 'Electrical', slug: 'electrical', status: 'active' });

      expect(api.post).toHaveBeenCalledWith('/admin/services', { name: 'Electrical', slug: 'electrical', status: 'active' });
      expect(res.id).toBe(10);
    });

    it('calls PATCH /admin/services/{id}/status to toggle status', async () => {
      (api.patch as jest.Mock).mockResolvedValueOnce({ data: { id: 10, status: 'inactive' } });

      const res = await adminApi.updateAdminServiceStatus(10, 'inactive');

      expect(api.patch).toHaveBeenCalledWith('/admin/services/10/status', { status: 'inactive' });
      expect(res.status).toBe('inactive');
    });

    it('calls POST /admin/services/{id}/questions to create service question', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 101, question_text: 'Phase required?' } });

      const res = await adminApi.createAdminServiceQuestion(10, {
        question_text: 'Phase required?',
        question_type: 'single_choice',
        required: true,
      });

      expect(api.post).toHaveBeenCalledWith('/admin/services/10/questions', {
        question_text: 'Phase required?',
        question_type: 'single_choice',
        required: true,
      });
      expect(res.id).toBe(101);
    });

    it('calls POST /admin/service-questions/{id}/options to create choice option', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 501, label: 'Single Phase', value: 'single' } });

      const res = await adminApi.createAdminQuestionOption(101, {
        label: 'Single Phase',
        value: 'single',
        sort_order: 10,
      });

      expect(api.post).toHaveBeenCalledWith('/admin/service-questions/101/options', {
        label: 'Single Phase',
        value: 'single',
        sort_order: 10,
      });
      expect(res.id).toBe(501);
    });
  });

  describe('Locations', () => {
    it('calls POST /admin/locations to create hierarchy node', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 50, name: 'Victoria', type: 'state' } });

      const res = await adminApi.createAdminLocation({
        type: 'state',
        name: 'Victoria',
        code: 'VIC',
        status: 'active',
      });

      expect(api.post).toHaveBeenCalledWith('/admin/locations', {
        type: 'state',
        name: 'Victoria',
        code: 'VIC',
        status: 'active',
      });
      expect(res.id).toBe(50);
    });

    it('calls PATCH /admin/locations/{id}/status to toggle status', async () => {
      (api.patch as jest.Mock).mockResolvedValueOnce({ data: { id: 50, status: 'inactive' } });

      const res = await adminApi.updateAdminLocationStatus(50, 'inactive');

      expect(api.patch).toHaveBeenCalledWith('/admin/locations/50/status', { status: 'inactive' });
      expect(res.status).toBe('inactive');
    });
  });

  describe('Reviews Moderation', () => {
    it('calls GET /admin/reviews to list pending reviews', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [], meta: { current_page: 1, last_page: 1, total: 0 } });

      await adminApi.getAdminPendingReviews({ per_page: 20 });

      expect(api.get).toHaveBeenCalledWith('/admin/reviews?per_page=20');
    });

    it('calls POST /admin/reviews/{id}/approve to approve review', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 7, moderation_status: 'approved' } });

      const res = await adminApi.approveAdminReview(7);

      expect(api.post).toHaveBeenCalledWith('/admin/reviews/7/approve');
      expect(res.moderation_status).toBe('approved');
    });

    it('calls POST /admin/reviews/{id}/reject to reject review', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 7, moderation_status: 'rejected' } });

      const res = await adminApi.rejectAdminReview(7);

      expect(api.post).toHaveBeenCalledWith('/admin/reviews/7/reject');
      expect(res.moderation_status).toBe('rejected');
    });
  });

  describe('Review Reports', () => {
    it('calls GET /admin/review-reports with status filter', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [], meta: { current_page: 1, last_page: 1, total: 0 } });

      await adminApi.getAdminReviewReports({ status: 'pending' });

      expect(api.get).toHaveBeenCalledWith('/admin/review-reports?status=pending');
    });

    it('calls POST /admin/review-reports/{id}/resolve with dismiss resolution', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 2, status: 'resolved' } });

      const res = await adminApi.resolveAdminReviewReport(2, 'dismiss');

      expect(api.post).toHaveBeenCalledWith('/admin/review-reports/2/resolve', { resolution: 'dismiss' });
      expect(res.status).toBe('resolved');
    });

    it('calls POST /admin/review-reports/{id}/resolve with uphold resolution', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 2, status: 'resolved' } });

      const res = await adminApi.resolveAdminReviewReport(2, 'uphold');

      expect(api.post).toHaveBeenCalledWith('/admin/review-reports/2/resolve', { resolution: 'uphold' });
      expect(res.status).toBe('resolved');
    });
  });
});
