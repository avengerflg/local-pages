import { api } from '@/lib/api-client';
import { User } from '@/types/api';

export const login = async (credentials: Record<string, unknown>) => {
  const res = await api.post<{data: {token: string, user: User}}>('/auth/login', credentials);
  return res.data;
};

export const registerCustomer = async (data: Record<string, unknown>) => {
  const res = await api.post<{data: {token: string, user: User}}>('/auth/register/customer', data);
  return res.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  const res = await api.get<{data: User}>('/auth/me');
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await api.post<{message: string}>('/auth/forgot-password', { email });
  return res;
};

export const resetPassword = async (data: Record<string, unknown>) => {
  const res = await api.post<{message: string}>('/auth/reset-password', data);
  return res;
};

export const resendVerification = async () => {
  const res = await api.post<{message: string}>('/auth/email/verification-notification');
  return res;
};

export const verifyEmail = async (id: string, hash: string, queryParams: string) => {
  const res = await api.get<{message: string}>(`/auth/email/verify/${id}/${hash}?${queryParams}`);
  return res;
};
