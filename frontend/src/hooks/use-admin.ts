import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '@/services/admin-api';
import {
  AdminUserStatus,
  TradieVerificationStatus,
  TradieDocumentStatus,
} from '@/types/admin';

// 1. Dashboard
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminApi.getAdminDashboard,
  });
}

// 2. Users
export function useAdminUsers(params?: adminApi.GetAdminUsersParams) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.getAdminUsers(params),
  });
}

export function useAdminUser(id: number) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminApi.getAdminUser(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AdminUserStatus }) =>
      adminApi.updateAdminUserStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

// 3. Tradies
export function useAdminTradies(params?: adminApi.GetAdminTradiesParams) {
  return useQuery({
    queryKey: ['admin', 'tradies', params],
    queryFn: () => adminApi.getAdminTradies(params),
  });
}

export function useAdminTradie(id: number) {
  return useQuery({
    queryKey: ['admin', 'tradies', id],
    queryFn: () => adminApi.getAdminTradie(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useUpdateAdminTradieVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      verification_status,
    }: {
      id: number;
      verification_status: TradieVerificationStatus;
    }) => adminApi.updateAdminTradieVerification(id, verification_status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tradies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tradies', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useAdminTradieDocuments(tradieId: number) {
  return useQuery({
    queryKey: ['admin', 'tradies', tradieId, 'documents'],
    queryFn: () => adminApi.getAdminTradieDocuments(tradieId),
    enabled: !!tradieId && !isNaN(tradieId),
  });
}

export function useUpdateAdminTradieDocumentStatus(tradieId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      documentId,
      status,
    }: {
      documentId: number;
      status: TradieDocumentStatus;
    }) => adminApi.updateAdminTradieDocumentStatus(documentId, status),
    onSuccess: () => {
      if (tradieId) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'tradies', tradieId, 'documents'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'tradies', tradieId] });
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'tradies'] });
    },
  });
}

// 4. Services
export function useAdminServices(params?: adminApi.GetAdminServicesParams) {
  return useQuery({
    queryKey: ['admin', 'services', params],
    queryFn: () => adminApi.getAdminServices(params),
  });
}

export function useAdminService(id: number) {
  return useQuery({
    queryKey: ['admin', 'services', id],
    queryFn: () => adminApi.getAdminService(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateAdminService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: adminApi.CreateAdminServicePayload) => adminApi.createAdminService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useUpdateAdminService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: adminApi.UpdateAdminServicePayload }) =>
      adminApi.updateAdminService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'services', variables.id] });
    },
  });
}

export function useUpdateAdminServiceStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' }) =>
      adminApi.updateAdminServiceStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'services', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

// 5. Questions & Options
export function useAdminServiceQuestions(serviceId: number) {
  return useQuery({
    queryKey: ['admin', 'services', serviceId, 'questions'],
    queryFn: () => adminApi.getAdminServiceQuestions(serviceId),
    enabled: !!serviceId && !isNaN(serviceId),
  });
}

export function useCreateAdminServiceQuestion(serviceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: adminApi.CreateAdminQuestionPayload) =>
      adminApi.createAdminServiceQuestion(serviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services', serviceId, 'questions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'services', serviceId] });
    },
  });
}

export function useUpdateAdminServiceQuestion(serviceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: number;
      data: adminApi.UpdateAdminQuestionPayload;
    }) => adminApi.updateAdminServiceQuestion(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services', serviceId, 'questions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'services', serviceId] });
    },
  });
}

export function useCreateAdminQuestionOption(serviceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: number;
      data: adminApi.CreateAdminQuestionOptionPayload;
    }) => adminApi.createAdminQuestionOption(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services', serviceId, 'questions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'services', serviceId] });
    },
  });
}

export function useUpdateAdminQuestionOption(serviceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      optionId,
      data,
    }: {
      optionId: number;
      data: adminApi.UpdateAdminQuestionOptionPayload;
    }) => adminApi.updateAdminQuestionOption(optionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services', serviceId, 'questions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'services', serviceId] });
    },
  });
}

// 6. Locations
export function useAdminLocations(params?: adminApi.GetAdminLocationsParams) {
  return useQuery({
    queryKey: ['admin', 'locations', params],
    queryFn: () => adminApi.getAdminLocations(params),
  });
}

export function useAdminLocation(id: number) {
  return useQuery({
    queryKey: ['admin', 'locations', id],
    queryFn: () => adminApi.getAdminLocation(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateAdminLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: adminApi.CreateAdminLocationPayload) => adminApi.createAdminLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'locations'] });
    },
  });
}

export function useUpdateAdminLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: adminApi.UpdateAdminLocationPayload }) =>
      adminApi.updateAdminLocation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'locations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'locations', variables.id] });
    },
  });
}

export function useUpdateAdminLocationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' }) =>
      adminApi.updateAdminLocationStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'locations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'locations', variables.id] });
    },
  });
}

// 7. Reviews
export function useAdminPendingReviews(params?: adminApi.GetAdminReviewsParams) {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: () => adminApi.getAdminPendingReviews(params),
  });
}

export function useApproveAdminReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.approveAdminReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useRejectAdminReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.rejectAdminReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

// 8. Review Reports
export function useAdminReviewReports(params?: adminApi.GetAdminReviewReportsParams) {
  return useQuery({
    queryKey: ['admin', 'review-reports', params],
    queryFn: () => adminApi.getAdminReviewReports(params),
  });
}

export function useResolveAdminReviewReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolution }: { id: number; resolution: 'dismiss' | 'uphold' }) =>
      adminApi.resolveAdminReviewReport(id, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'review-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}
