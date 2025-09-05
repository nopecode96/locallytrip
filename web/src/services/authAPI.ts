// Authentication API service
import { getBackendUrl } from '@/utils/backend';

const API_BASE_URL = getBackendUrl();

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  userType: 'traveller' | 'host';
  phone?: string;
  cityId?: string;
  hostCategories?: number[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any[];
}

export interface User {
  id: string;
  uuid?: string;
  name: string;
  email: string;
  role: 'traveller' | 'host';
  phone?: string;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  cityId?: string;
  City?: {
    id: string;
    name: string;
    slug: string;
  };
  hostCategories?: {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    UserHostCategory?: {
      isPrimary: boolean;
      isActive: boolean;
    };
  }[];
}

export interface HostCategory {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
}

class AuthAPI {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Request failed'
      };
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginData): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getHostCategories(): Promise<ApiResponse<HostCategory[]>> {
    return this.makeRequest('/host-categories');
  }

  async getProfile(token: string): Promise<ApiResponse<User>> {
    return this.makeRequest('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse<{ user: User; welcomeEmailSent: boolean }>> {
    return this.makeRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Token management
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // User management
  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_data');
    }
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
  }
}

export const authAPI = new AuthAPI();
