'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, AdminAuthState } from '../types/admin';

interface AdminContextType extends AdminAuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    token: null,
    loading: true,
  });

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        // Also set cookie if missing
        document.cookie = `admin_token=${token}; path=/; max-age=86400`;
        
        setState({
          user,
          token,
          loading: false,
        });
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { user, token } = data.data;
        
        // Store in localStorage
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(user));
        
        // Store token in cookie for middleware
        document.cookie = `admin_token=${token}; path=/; max-age=86400`; // 24 hours
        
        setState({
          user,
          token,
          loading: false,
        });

        return { success: true };
      } else {
        setState(prev => ({ ...prev, loading: false }));
        return { 
          success: false, 
          message: data.message || 'Login failed' 
        };
      }
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      console.error('Admin login error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    
    // Remove cookie
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    setState({
      user: null,
      token: null,
      loading: false,
    });
    
    // Redirect to login page
    window.location.href = '/login';
  };

  const value: AdminContextType = {
    ...state,
    login,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
