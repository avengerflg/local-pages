import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomerProfile, updateCustomerProfile } from '@/services/customer-api';

export const useCustomerProfile = () => {
  return useQuery({
    queryKey: ['customerProfile'],
    queryFn: getCustomerProfile,
    retry: false,
  });
};

export const useUpdateCustomerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerProfile'] });
    },
  });
};
