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

export interface ConditionalRule {
  depends_on_question_id?: number;
  parent_question_id?: number;
  selected_option_id?: number;
  parent_option_id?: number;
  value?: string;
}

export interface ServiceQuestionOption {
  id: number;
  question_id: number;
  label?: string;
  value?: string;
  option_text?: string;
  sort_order: number;
}

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'text'
  | 'file_upload'
  | 'image_upload'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | string;

export interface ServiceQuestion {
  id: number;
  service_id: number;
  question_text: string;
  question_type: QuestionType;
  required: boolean;
  sort_order: number;
  conditional_rule: ConditionalRule | string | null;
  options?: ServiceQuestionOption[];
}

export interface ServiceRequestAnswerPayload {
  question_id: number;
  selected_option_id?: number | null;
  answer_text?: string | null;
  structured_value?: (string | number)[] | null;
}

export interface CreateServiceRequestPayload {
  service_id: number;
  location_id?: number | null;
  postcode: string;
  title?: string | null;
  description?: string | null;
  answers?: ServiceRequestAnswerPayload[];
  attachments?: File[];
}

export interface ServiceRequestAttachment {
  id: number;
  request_id: number;
  original_name: string;
  mime_type: string;
  file_size: number;
  download_url?: string;
  created_at?: string;
}

export interface RequestAnswer {
  id: number;
  request_id: number;
  question_id: number;
  question_text?: string;
  question_type?: string;
  answer_text?: string | null;
  selected_option_id?: number | null;
  selected_option?: ServiceQuestionOption | null;
  structured_value?: (string | number)[] | null;
}

export interface ServiceRequest {
  id: number;
  customer_id: number;
  service_id: number;
  service?: Service | null;
  location_id: number | null;
  location?: Location | null;
  postcode: string;
  title: string | null;
  description: string | null;
  status: 'draft' | 'submitted' | 'quote_accepted' | 'completed' | 'cancelled' | string;
  submitted_at: string | null;
  answers?: RequestAnswer[];
  attachments?: ServiceRequestAttachment[];
  created_at?: string;
  updated_at?: string;
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
