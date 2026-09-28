import { useQuery } from '@tanstack/react-query';
import { getLocations } from '@/services/location-api';

export const useLocations = (search?: string) => {
  return useQuery({
    queryKey: ['locations', search],
    queryFn: () => getLocations(search),
  });
};
