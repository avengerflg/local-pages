import { api } from '@/lib/api-client';

export interface CustomerProfileData {
  id: number;
  user_id: number;
  postcode: string | null;
  address: string | null;
}

export const getCustomerProfile = async () => {
  const res = await api.get<{ data: CustomerProfileData }>('/customer/profile');
  return res.data;
};

export const updateCustomerProfile = async (data: Partial<CustomerProfileData>) => {
  const res = await api.put<{ data: CustomerProfileData }>('/customer/profile', data);
  return res.data;
};

export interface ServiceSummary {
  id: number;
  name: string;
}

export interface LocationSummary {
  id: number;
  name: string;
  postcode: string;
}

export interface ServiceRequestSummary {
  id: number;
  title: string;
  status: string;
  postcode: string;
  service?: ServiceSummary | null;
  location?: LocationSummary | null;
}

export interface TradieSummary {
  id: number;
  business_name: string;
  abn: string;
  verification_status: string;
}

export interface JobAppointmentSummary {
  id: number;
  starts_at?: string | null;
  ends_at?: string | null;
  status: string;
}

export interface JobData {
  id: number;
  request_id: number;
  appointment_id: number | null;
  service_request?: ServiceRequestSummary | null;
  appointment?: JobAppointmentSummary | null;
  tradie?: TradieSummary | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | string;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AppointmentData {
  id: number;
  request_id: number;
  quote_id: number;
  service_request?: ServiceRequestSummary | null;
  quote?: {
    id: number;
    amount: string;
    description: string;
    status: string;
  } | null;
  customer?: {
    id: number;
    name: string;
  } | null;
  tradie?: TradieSummary | null;
  starts_at: string | null;
  ends_at: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | string;
  notes?: string | null;
  job?: {
    id: number;
    status: string;
    started_at?: string | null;
    completed_at?: string | null;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export const getCustomerJobs = async () => {
  const res = await api.get<{ data: JobData[] }>('/customer/jobs');
  return res.data;
};

export const getCustomerAppointments = async () => {
  const res = await api.get<{ data: AppointmentData[] }>('/customer/appointments');
  return res.data;
};
