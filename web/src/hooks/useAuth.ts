import { useState, useEffect } from 'react';
import { authAPI, type User } from '../services/authAPI';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for user updates from profile page
    const handleUserUpdate = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('user-updated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = authAPI.getToken();
      const userData = authAPI.getUser();
      
      if (token && userData) {
        setUser(userData);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User, token: string) => {
    authAPI.setToken(token);
    authAPI.setUser(userData);
    setUser(userData);
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    window.location.href = '/';
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuthStatus
  };
};
