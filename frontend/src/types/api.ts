export type UserStatus = 'active' | 'suspended' | 'pending';
export type UserRole = 'customer' | 'tradie' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: number;
  user_id: number;
  phone: string | null;
  address: string | null;
}

export interface TradieProfile {
  id: number;
  user_id: number;
  business_name: string;
  abn: string | null;
  business_address: string | null;
  phone: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
}

export interface ServiceQuestionOption {
  id: number;
  question_id: number;
  option_text: string;
  sort_order: number;
}

export interface ServiceQuestion {
  id: number;
  service_id: number;
  question_text: string;
  question_type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select';
  required: boolean;
  sort_order: number;
  conditional_rule: string | null;
  options?: ServiceQuestionOption[];
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: 'active' | 'inactive';
  questions?: ServiceQuestion[];
}

export interface Location {
  id: number;
  parent_id: number | null;
  type: 'state' | 'region' | 'council' | 'suburb';
  name: string;
  code: string | null;
  postcode: string | null;
  status: 'active' | 'inactive';
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
