export interface AdminUser {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'finance' | 'marketing' | 'host';
  role_id: number | null;
  phone: string | null;
  city_id: number | null;
}

export interface AdminAuthState {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
}

export interface NavbarItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  roles: AdminUser['role'][];
  children?: NavbarItem[];
  badge?: string;
}
