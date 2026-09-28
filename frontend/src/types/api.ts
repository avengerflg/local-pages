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

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
