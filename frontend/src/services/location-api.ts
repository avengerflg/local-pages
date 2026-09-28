import { api } from '@/lib/api-client';
import { Location, PaginatedResponse } from '@/types/api';

export const getLocations = async (search?: string): Promise<Location[]> => {
  const url = search ? `/locations?search=${encodeURIComponent(search)}` : '/locations';
  const res = await api.get<PaginatedResponse<Location>>(url);
  return res.data;
};
