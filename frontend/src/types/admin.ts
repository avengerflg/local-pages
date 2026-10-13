import { PaginatedResponse } from './api';

export interface AdminDashboardData {
  users: {
    total: number;
    customers: number;
    tradies: number;
    admins: number;
    active: number;
    suspended: number;
    pending: number;
  };
  tradies: {
    total: number;
    verified: number;
    pending: number;
    under_review: number;
    rejected: number;
  };
  service_requests: {
    total: number;
    draft: number;
    submitted: number;
    matching: number;
    quoting: number;
    quote_accepted: number;
    scheduled: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  quotes: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
  appointments: {
    total: number;
    scheduled: number;
    completed: number;
  };
  jobs: {
    total: number;
    scheduled: number;
    in_progress: number;
    completed: number;
  };
  reviews: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  services: {
    total: number;
    active: number;
    inactive: number;
  };
}

export type AdminUserRole = 'customer' | 'tradie' | 'admin';
export type AdminUserStatus = 'active' | 'suspended' | 'pending';

export interface AdminUserCustomerProfile {
  id: number;
  postcode: string | null;
  address: string | null;
}

export interface AdminUserTradieProfile {
  id: number;
  business_name: string;
  abn: string | null;
  phone: string | null;
  email: string | null;
  verification_status: 'pending' | 'verified' | 'rejected' | 'under_review';
  verified_at: string | null;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  mobile: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  customer_profile?: AdminUserCustomerProfile | null;
  tradie_profile?: AdminUserTradieProfile | null;
}

export type TradieVerificationStatus = 'pending' | 'verified' | 'rejected' | 'under_review';

export interface AdminTradieService {
  id: number;
  name: string;
  slug: string;
  status: string;
}

export interface AdminTradieServiceArea {
  id: number;
  type: string;
  name: string;
  postcode: string | null;
}

export interface AdminTradieAvailability {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  specific_date: string | null;
  is_available: boolean;
  notes: string | null;
}

export interface AdminTradie {
  id: number;
  user_id: number;
  business_name: string;
  abn: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  verification_status: TradieVerificationStatus;
  verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  user?: {
    id: number;
    name: string;
    email: string;
    status: string;
    mobile: string | null;
  } | null;
  services?: AdminTradieService[];
  service_areas?: AdminTradieServiceArea[];
  availability?: AdminTradieAvailability[];
  documents_count?: number;
}

export type TradieDocumentStatus = 'pending' | 'approved' | 'rejected';

export interface AdminTradieDocument {
  id: number;
  tradie_id: number;
  document_type: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  status: TradieDocumentStatus;
  download_url: string;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  reviewer?: {
    id: number;
    name: string;
  } | null;
}

export interface AdminService {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: 'active' | 'inactive';
  created_at: string | null;
  updated_at: string | null;
  questions_count?: number;
  questions?: AdminServiceQuestion[];
}

export type AdminQuestionType =
  | 'multiple_choice'
  | 'single_choice'
  | 'text'
  | 'file_upload'
  | 'image_upload';

export interface AdminQuestionOption {
  id: number;
  question_id: number;
  label: string;
  value: string;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminServiceQuestion {
  id: number;
  service_id: number;
  question_text: string;
  question_type: AdminQuestionType;
  required: boolean;
  sort_order: number;
  conditional_rule: {
    depends_on_question_id?: number;
    parent_question_id?: number;
    selected_option_id?: number;
    parent_option_id?: number;
    value?: string;
    [key: string]: unknown;
  } | null;
  status: 'active' | 'inactive' | string;
  created_at: string | null;
  updated_at: string | null;
  options?: AdminQuestionOption[];
}

export type AdminLocationType = 'state' | 'council' | 'suburb' | 'postcode';

export interface AdminLocation {
  id: number;
  parent_id: number | null;
  type: AdminLocationType;
  name: string;
  code: string | null;
  postcode: string | null;
  status: 'active' | 'inactive';
  created_at: string | null;
  updated_at: string | null;
  parent?: {
    id: number;
    name: string;
    type: string;
  } | null;
  children_count?: number;
}

export interface AdminReview {
  id: number;
  job_id: number;
  rating: number;
  review_text: string;
  moderation_status: 'pending' | 'approved' | 'rejected';
  published_at: string | null;
  removed_at: string | null;
  customer?: {
    id: number;
    name: string;
    email: string;
  } | null;
  tradie?: {
    id: number;
    business_name: string;
  } | null;
  response?: {
    id: number;
    response_text: string;
    created_at: string;
  } | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminReviewReport {
  id: number;
  review_id: number;
  reporter_id: number;
  reason: string;
  status: 'pending' | 'resolved';
  resolved_by: number | null;
  resolved_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  review?: {
    id: number;
    rating: number;
    review_text: string;
    moderation_status: string;
    customer?: {
      id: number;
      name: string;
    } | null;
    tradieProfile?: {
      id: number;
      business_name: string;
    } | null;
  } | null;
  reporter?: AdminUser | null;
  resolver?: AdminUser | null;
}

export type AdminPaginatedResponse<T> = PaginatedResponse<T>;
