import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  createServiceRequest, 
  getServiceRequest, 
  getServiceRequests, 
  cancelServiceRequest 
} from '@/services/service-request-api';
import { CreateServiceRequestPayload } from '@/types/api';

export const useServiceRequests = (page = 1, perPage = 15) => {
  return useQuery({
    queryKey: ['service-requests', page, perPage],
    queryFn: () => getServiceRequests(page, perPage),
  });
};

export const useServiceRequest = (id: number) => {
  return useQuery({
    queryKey: ['service-request', id],
    queryFn: () => getServiceRequest(id),
    enabled: !!id,
  });
};

export const useCreateServiceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServiceRequestPayload) => createServiceRequest(payload),
    onSuccess: () => {
      // Invalidate relevant queries so the customer dashboard and jobs list update immediately
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['customer-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['customer-appointments'] });
    },
  });
};

export const useCancelServiceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cancelServiceRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['service-request', id] });
      queryClient.invalidateQueries({ queryKey: ['customer-jobs'] });
    },
  });
};
