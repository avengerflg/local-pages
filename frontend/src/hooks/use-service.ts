import { useQuery } from '@tanstack/react-query';
import { getService } from '@/services/service-api';

export const useService = (slug: string) => {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: () => getService(slug),
    enabled: !!slug,
  });
};
