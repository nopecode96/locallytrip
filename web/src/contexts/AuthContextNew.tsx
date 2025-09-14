// Updated AuthContext yang menggunakan pure API approach
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, type User } from '../services/authAPI';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from API (always fresh)
  const fetchUserFromAPI = async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return null;
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data);
        setLoading(false);
        return data.data;
      } else {
        // Invalid token, clear auth
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
        setUser(null);
        setLoading(false);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setLoading(false);
      return null;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store only token, get user data from API
        localStorage.setItem('auth_token', data.data.token);
        
        // Fetch fresh user data immediately
        await fetchUserFromAPI();
        
        return { success: true };
      } else {
        setLoading(false);
        return { 
          success: false, 
          message: data.message || 'Login failed' 
        };
      }
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data'); // Clean up any legacy data
    setUser(null);
    window.location.href = '/';
  };

  // Refresh user data
  const refreshUser = async () => {
    await fetchUserFromAPI();
  };

  // Initial auth check
  useEffect(() => {
    fetchUserFromAPI();
  }, []);

  // Listen for storage changes (logout from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' && !e.newValue) {
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
