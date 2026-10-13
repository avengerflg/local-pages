import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomerProfile, updateCustomerProfile, getCustomerJobs, getCustomerAppointments } from '@/services/customer-api';

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

export const useCustomerJobs = () => {
  return useQuery({
    queryKey: ['customerJobs'],
    queryFn: getCustomerJobs,
  });
};

export const useCustomerAppointments = () => {
  return useQuery({
    queryKey: ['customerAppointments'],
    queryFn: getCustomerAppointments,
  });
};
