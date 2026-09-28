import { api } from '@/lib/api-client';

export interface CustomerProfileData {
  id: number;
  user_id: number;
  postcode: string | null;
  address: string | null;
}

export const getCustomerProfile = async () => {
  const res = await api.get<{data: CustomerProfileData}>('/customer/profile');
  return res.data;
};

export const updateCustomerProfile = async (data: Partial<CustomerProfileData>) => {
  const res = await api.put<{data: CustomerProfileData}>('/customer/profile', data);
  return res.data;
};
