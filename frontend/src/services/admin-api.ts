import { api } from '@/lib/api-client';
import {
  AdminDashboardData,
  AdminPaginatedResponse,
  AdminUser,
  AdminUserStatus,
  AdminTradie,
  TradieVerificationStatus,
  AdminTradieDocument,
  TradieDocumentStatus,
  AdminService,
  AdminServiceQuestion,
  AdminQuestionOption,
  AdminLocation,
  AdminReview,
  AdminReviewReport,
} from '@/types/admin';

// Helper to construct query string
function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      searchParams.set(key, String(val));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

// 1. Dashboard
export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
  const res = await api.get<{ data: AdminDashboardData }>('/admin/dashboard');
  return res.data;
};

// 2. Users
export interface GetAdminUsersParams {
  page?: number;
  per_page?: number;
  role?: string;
  status?: string;
  search?: string;
}

export const getAdminUsers = async (
  params?: GetAdminUsersParams
): Promise<AdminPaginatedResponse<AdminUser>> => {
  return await api.get<AdminPaginatedResponse<AdminUser>>(
    `/admin/users${buildQueryString(params as Record<string, unknown>)}`
  );
};

export const getAdminUser = async (id: number): Promise<AdminUser> => {
  const res = await api.get<{ data: AdminUser }>(`/admin/users/${id}`);
  return res.data;
};

export const updateAdminUserStatus = async (
  id: number,
  status: AdminUserStatus
): Promise<AdminUser> => {
  const res = await api.patch<{ data: AdminUser }>(`/admin/users/${id}/status`, { status });
  return res.data;
};

// 3. Tradies
export interface GetAdminTradiesParams {
  page?: number;
  per_page?: number;
  verification_status?: string;
  status?: string;
  search?: string;
}

export const getAdminTradies = async (
  params?: GetAdminTradiesParams
): Promise<AdminPaginatedResponse<AdminTradie>> => {
  return await api.get<AdminPaginatedResponse<AdminTradie>>(
    `/admin/tradies${buildQueryString(params as Record<string, unknown>)}`
  );
};

export const getAdminTradie = async (id: number): Promise<AdminTradie> => {
  const res = await api.get<{ data: AdminTradie }>(`/admin/tradies/${id}`);
  return res.data;
};

export const updateAdminTradieVerification = async (
  id: number,
  verification_status: TradieVerificationStatus
): Promise<AdminTradie> => {
  const res = await api.patch<{ data: AdminTradie }>(`/admin/tradies/${id}/verification`, {
    verification_status,
  });
  return res.data;
};

export const getAdminTradieDocuments = async (
  tradieId: number
): Promise<AdminTradieDocument[]> => {
  const res = await api.get<{ data: AdminTradieDocument[] }>(
    `/admin/tradies/${tradieId}/documents`
  );
  return res.data;
};

export const updateAdminTradieDocumentStatus = async (
  documentId: number,
  status: TradieDocumentStatus
): Promise<AdminTradieDocument> => {
  const res = await api.patch<{ data: AdminTradieDocument }>(
    `/admin/tradie-documents/${documentId}/status`,
    { status }
  );
  return res.data;
};

// 4. Services
export interface GetAdminServicesParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

export const getAdminServices = async (
  params?: GetAdminServicesParams
): Promise<AdminPaginatedResponse<AdminService>> => {
  return await api.get<AdminPaginatedResponse<AdminService>>(
    `/admin/services${buildQueryString(params as Record<string, unknown>)}`
  );
};

export interface CreateAdminServicePayload {
  name: string;
  slug?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export const createAdminService = async (
  data: CreateAdminServicePayload
): Promise<AdminService> => {
  const res = await api.post<{ data: AdminService }>('/admin/services', data);
  return res.data;
};

export const getAdminService = async (id: number): Promise<AdminService> => {
  const res = await api.get<{ data: AdminService }>(`/admin/services/${id}`);
  return res.data;
};

export interface UpdateAdminServicePayload {
  name?: string;
  slug?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export const updateAdminService = async (
  id: number,
  data: UpdateAdminServicePayload
): Promise<AdminService> => {
  const res = await api.patch<{ data: AdminService }>(`/admin/services/${id}`, data);
  return res.data;
};

export const updateAdminServiceStatus = async (
  id: number,
  status: 'active' | 'inactive'
): Promise<AdminService> => {
  const res = await api.patch<{ data: AdminService }>(`/admin/services/${id}/status`, { status });
  return res.data;
};

// 5. Service Questions & Options
export const getAdminServiceQuestions = async (
  serviceId: number
): Promise<AdminServiceQuestion[]> => {
  const res = await api.get<{ data: AdminServiceQuestion[] }>(
    `/admin/services/${serviceId}/questions`
  );
  return res.data;
};

export interface CreateAdminQuestionPayload {
  question_text: string;
  question_type: string;
  required?: boolean;
  sort_order?: number;
  conditional_rule?: Record<string, unknown> | null;
  status?: string;
}

export const createAdminServiceQuestion = async (
  serviceId: number,
  data: CreateAdminQuestionPayload
): Promise<AdminServiceQuestion> => {
  const res = await api.post<{ data: AdminServiceQuestion }>(
    `/admin/services/${serviceId}/questions`,
    data
  );
  return res.data;
};

export const getAdminServiceQuestion = async (id: number): Promise<AdminServiceQuestion> => {
  const res = await api.get<{ data: AdminServiceQuestion }>(`/admin/service-questions/${id}`);
  return res.data;
};

export interface UpdateAdminQuestionPayload {
  question_text?: string;
  question_type?: string;
  required?: boolean;
  sort_order?: number;
  conditional_rule?: Record<string, unknown> | null;
  status?: string;
}

export const updateAdminServiceQuestion = async (
  id: number,
  data: UpdateAdminQuestionPayload
): Promise<AdminServiceQuestion> => {
  const res = await api.patch<{ data: AdminServiceQuestion }>(
    `/admin/service-questions/${id}`,
    data
  );
  return res.data;
};

export interface CreateAdminQuestionOptionPayload {
  label: string;
  value: string;
  sort_order?: number;
}

export const createAdminQuestionOption = async (
  questionId: number,
  data: CreateAdminQuestionOptionPayload
): Promise<AdminQuestionOption> => {
  const res = await api.post<{ data: AdminQuestionOption }>(
    `/admin/service-questions/${questionId}/options`,
    data
  );
  return res.data;
};

export interface UpdateAdminQuestionOptionPayload {
  label?: string;
  value?: string;
  sort_order?: number;
}

export const updateAdminQuestionOption = async (
  optionId: number,
  data: UpdateAdminQuestionOptionPayload
): Promise<AdminQuestionOption> => {
  const res = await api.patch<{ data: AdminQuestionOption }>(
    `/admin/service-question-options/${optionId}`,
    data
  );
  return res.data;
};

// 6. Locations
export interface GetAdminLocationsParams {
  page?: number;
  per_page?: number;
  type?: string;
  parent_id?: number;
  status?: string;
  search?: string;
}

export const getAdminLocations = async (
  params?: GetAdminLocationsParams
): Promise<AdminPaginatedResponse<AdminLocation>> => {
  return await api.get<AdminPaginatedResponse<AdminLocation>>(
    `/admin/locations${buildQueryString(params as Record<string, unknown>)}`
  );
};

export interface CreateAdminLocationPayload {
  type: string;
  name: string;
  parent_id?: number | null;
  code?: string | null;
  postcode?: string | null;
  status?: string;
}

export const createAdminLocation = async (
  data: CreateAdminLocationPayload
): Promise<AdminLocation> => {
  const res = await api.post<{ data: AdminLocation }>('/admin/locations', data);
  return res.data;
};

export const getAdminLocation = async (id: number): Promise<AdminLocation> => {
  const res = await api.get<{ data: AdminLocation }>(`/admin/locations/${id}`);
  return res.data;
};

export interface UpdateAdminLocationPayload {
  type?: string;
  name?: string;
  parent_id?: number | null;
  code?: string | null;
  postcode?: string | null;
  status?: string;
}

export const updateAdminLocation = async (
  id: number,
  data: UpdateAdminLocationPayload
): Promise<AdminLocation> => {
  const res = await api.patch<{ data: AdminLocation }>(`/admin/locations/${id}`, data);
  return res.data;
};

export const updateAdminLocationStatus = async (
  id: number,
  status: 'active' | 'inactive'
): Promise<AdminLocation> => {
  const res = await api.patch<{ data: AdminLocation }>(`/admin/locations/${id}/status`, { status });
  return res.data;
};

// 7. Reviews
export interface GetAdminReviewsParams {
  page?: number;
  per_page?: number;
}

export const getAdminPendingReviews = async (
  params?: GetAdminReviewsParams
): Promise<AdminPaginatedResponse<AdminReview>> => {
  return await api.get<AdminPaginatedResponse<AdminReview>>(
    `/admin/reviews${buildQueryString(params as Record<string, unknown>)}`
  );
};

export const approveAdminReview = async (id: number): Promise<AdminReview> => {
  const res = await api.post<{ data: AdminReview }>(`/admin/reviews/${id}/approve`);
  return res.data;
};

export const rejectAdminReview = async (id: number): Promise<AdminReview> => {
  const res = await api.post<{ data: AdminReview }>(`/admin/reviews/${id}/reject`);
  return res.data;
};

// 8. Review Reports
export interface GetAdminReviewReportsParams {
  page?: number;
  per_page?: number;
  status?: string;
}

export const getAdminReviewReports = async (
  params?: GetAdminReviewReportsParams
): Promise<AdminPaginatedResponse<AdminReviewReport>> => {
  return await api.get<AdminPaginatedResponse<AdminReviewReport>>(
    `/admin/review-reports${buildQueryString(params as Record<string, unknown>)}`
  );
};

export const resolveAdminReviewReport = async (
  id: number,
  resolution: 'dismiss' | 'uphold'
): Promise<AdminReviewReport> => {
  const res = await api.post<{ data: AdminReviewReport }>(`/admin/review-reports/${id}/resolve`, {
    resolution,
  });
  return res.data;
};
