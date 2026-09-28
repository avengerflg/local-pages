import { useQuery } from '@tanstack/react-query';
import { getLocations } from '@/services/location-api';

export const useLocations = (search?: string, type?: string) => {
  return useQuery({
    queryKey: ['locations', search, type],
    queryFn: () => getLocations(search, type),
  });
};
