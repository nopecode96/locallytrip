// Authentication API service
import { getBackendUrl } from '@/utils/backend';
import deviceDetection from '@/utils/deviceDetection';

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
  rememberMe?: boolean;
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
  bio?: string;
  avatar?: string;
  avatarUrl?: string; // Field from backend database
  isActive: boolean;
  isVerified: boolean;
  isTrusted?: boolean; // Add trusted status field
  cityId?: string;
  createdAt?: string; // Timestamp when user was created
  userLanguages?: UserLanguage[]; // Add userLanguages field
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

export interface UserLanguage {
  id: string;
  languageId: number;
  proficiency: string;
  isActive: boolean;
  Language: {
    id: number;
    name: string;
    nativeName?: string;
    code: string;
  };
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
      // Get device headers for audit trail
      const deviceHeaders = deviceDetection.getDeviceHeaders();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...deviceHeaders, // Add device detection headers
          ...options.headers,
        },
        ...options,
      });

      // Parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        return {
          success: false,
          error: `Server returned invalid response (${response.status}): ${response.statusText}`
        };
      }
      
      if (!response.ok) {
        // Return the exact error from backend instead of throwing
        return {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}: ${response.statusText}`,
          message: data.message || data.error
        };
      }

      return data;
    } catch (error) {
      // Handle different types of network errors
      if (error instanceof TypeError) {
        if (error.message.includes('fetch')) {
          return {
            success: false,
            error: 'Cannot connect to server. Please check your internet connection and try again.'
          };
        }
        if (error.message.includes('NetworkError')) {
          return {
            success: false,
            error: 'Network error occurred. Please check your connection.'
          };
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
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
  setToken(token: string, rememberMe: boolean = false): void {
    if (typeof window !== 'undefined') {
      if (rememberMe) {
        // Use localStorage for persistent storage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('remember_me', 'true');
      } else {
        // Use sessionStorage for session-only storage
        sessionStorage.setItem('auth_token', token);
        localStorage.removeItem('remember_me');
      }
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      // Check localStorage first (remember me), then sessionStorage
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      localStorage.removeItem('remember_me');
    }
  }

  // User management
  setUser(user: User, rememberMe: boolean = false): void {
    if (typeof window !== 'undefined') {
      if (rememberMe) {
        // Use localStorage for persistent storage
        localStorage.setItem('user_data', JSON.stringify(user));
      } else {
        // Use sessionStorage for session-only storage
        sessionStorage.setItem('user_data', JSON.stringify(user));
      }
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      // Check localStorage first (remember me), then sessionStorage
      const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_data');
      sessionStorage.removeItem('user_data');
    }
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
  }
}

export const authAPI = new AuthAPI();
