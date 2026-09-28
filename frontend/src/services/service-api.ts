import { api } from '@/lib/api-client';
import { Service } from '@/types/api';

export const getServices = async (): Promise<Service[]> => {
  const res = await api.get<{ data: Service[] }>('/services');
  return res.data;
};

export const getService = async (slug: string): Promise<Service> => {
  const res = await api.get<{ data: Service }>(`/services/${slug}`);
  return res.data;
};
