'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, type User } from '../services/authAPI';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token: string, rememberMe?: boolean) => void;
  logout: () => void;
  checkAuthStatus: () => void;
  updateUser: (userData: User) => void;
  refreshFromBackend: () => Promise<User | null>;
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
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force update trigger

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for user updates from profile page
    const handleUserUpdate = () => {
      checkAuthStatus();
    };
    
    // Listen for storage changes (e.g., logout from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'user_data') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('user-updated', handleUserUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('user-updated', handleUserUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // User state changed
  }, [user]);

  const checkAuthStatus = () => {
    try {
      const token = authAPI.getToken();
      const userData = authAPI.getUser();
      
      
      if (token && userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User, token: string, rememberMe: boolean = false) => {
    authAPI.setToken(token, rememberMe);
    authAPI.setUser(userData, rememberMe);
    setUser(userData);
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (userData: User) => {
    // Check if remember me was enabled
    const rememberMe = typeof window !== 'undefined' && localStorage.getItem('remember_me') === 'true';
    authAPI.setUser(userData, rememberMe);
    
    // Force React to recognize the change by using functional setState
    setUser(prevUser => {
      return { ...userData }; // Create new object reference
    });
    
    // Trigger additional re-render
    setUpdateTrigger(prev => prev + 1);
  };

  const refreshFromBackend = async (): Promise<User | null> => {
    try {
      const token = authAPI.getToken();
      if (!token) return null;

      // Use frontend API route instead of direct backend
      const response = await fetch('/api/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('AuthContext refreshFromBackend:', {
          oldAvatarUrl: user?.avatarUrl,
          newAvatarUrl: data.data.avatarUrl,
          fullUserData: data.data,
          timestamp: new Date().toISOString()
        });
        
        // Update both localStorage and state with forced re-render
        const rememberMe = typeof window !== 'undefined' && localStorage.getItem('remember_me') === 'true';
        authAPI.setUser(data.data, rememberMe);
        setUser({ ...data.data, _lastUpdated: Date.now() }); // Add timestamp to force re-render
        setUpdateTrigger(prev => prev + 1);
        return data.data;
      } else {
        console.error('Failed to refresh from backend:', data);
      }
    } catch (error) {
      console.error('Error in refreshFromBackend:', error);
    }
    return null;
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuthStatus,
    updateUser,
    refreshFromBackend
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
