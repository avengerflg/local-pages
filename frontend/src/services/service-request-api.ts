import { api } from '@/lib/api-client';
import { 
  CreateServiceRequestPayload, 
  ServiceRequest, 
  PaginatedResponse 
} from '@/types/api';

/**
 * Submit a new customer service request.
 * Supports multipart FormData when file attachments are present.
 */
export const createServiceRequest = async (payload: CreateServiceRequestPayload): Promise<ServiceRequest> => {
  if (payload.attachments && payload.attachments.length > 0) {
    const formData = new FormData();
    formData.append('service_id', String(payload.service_id));
    formData.append('postcode', payload.postcode.trim());

    if (payload.location_id) {
      formData.append('location_id', String(payload.location_id));
    }
    if (payload.title?.trim()) {
      formData.append('title', payload.title.trim());
    }
    if (payload.description?.trim()) {
      formData.append('description', payload.description.trim());
    }
    if (payload.answers && payload.answers.length > 0) {
      formData.append('answers', JSON.stringify(payload.answers));
    }
    payload.attachments.forEach((file) => {
      formData.append('attachments[]', file);
    });

    const res = await api.post<{ data: ServiceRequest }>('/service-requests', formData);
    return res.data;
  }

  const jsonPayload: Record<string, unknown> = {
    service_id: payload.service_id,
    postcode: payload.postcode.trim(),
  };
  if (payload.location_id) {
    jsonPayload.location_id = payload.location_id;
  }
  if (payload.title?.trim()) {
    jsonPayload.title = payload.title.trim();
  }
  if (payload.description?.trim()) {
    jsonPayload.description = payload.description.trim();
  }
  if (payload.answers && payload.answers.length > 0) {
    jsonPayload.answers = payload.answers;
  }

  const res = await api.post<{ data: ServiceRequest }>('/service-requests', jsonPayload);
  return res.data;
};

/**
 * Fetch paginated list of service requests for the authenticated customer.
 */
export const getServiceRequests = async (page = 1, perPage = 15): Promise<PaginatedResponse<ServiceRequest>> => {
  return await api.get<PaginatedResponse<ServiceRequest>>(`/service-requests?page=${page}&per_page=${perPage}`);
};

/**
 * Fetch details of a single service request.
 */
export const getServiceRequest = async (id: number): Promise<ServiceRequest> => {
  const res = await api.get<{ data: ServiceRequest }>(`/service-requests/${id}`);
  return res.data;
};

/**
 * Cancel an existing service request.
 */
export const cancelServiceRequest = async (id: number): Promise<ServiceRequest> => {
  const res = await api.post<{ data: ServiceRequest }>(`/service-requests/${id}/cancel`);
  return res.data;
};
