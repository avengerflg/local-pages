import { api } from '@/lib/api-client';
import { Location, PaginatedResponse } from '@/types/api';

export const getLocations = async (search?: string, type?: string, perPage: number = 100): Promise<Location[]> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (type) params.append('type', type);
  params.append('per_page', perPage.toString());

  const res = await api.get<PaginatedResponse<Location>>(`/locations?${params.toString()}`);
  return res.data;
};
