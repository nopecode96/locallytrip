export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'finance' | 'marketing' | 'moderator';
  role_id: number;
  phone?: string;
  avatar_url?: string;
  is_verified: boolean;
  is_active: boolean;
  permissions: {
    can_book?: boolean;
    can_review?: boolean;
    can_comment?: boolean;
    can_like?: boolean;
    can_create_experience?: boolean;
    can_manage_bookings?: boolean;
    can_moderate?: boolean;
    can_manage_users?: boolean;
    can_view_analytics?: boolean;
    can_manage_system?: boolean;
    can_manage_roles?: boolean;
    can_manage_finance?: boolean;
    can_view_payments?: boolean;
    can_export_reports?: boolean;
    can_manage_content?: boolean;
    can_manage_promotions?: boolean;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}
