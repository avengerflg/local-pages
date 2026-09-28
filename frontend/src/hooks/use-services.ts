import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/services/service-api';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });
};
