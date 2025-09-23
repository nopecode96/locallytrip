import { useState, useEffect } from 'react';

interface UseAuthReturn {
  isAuthenticated: boolean;
  error: string;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (password: string): Promise<void> => {
    if (password === 'password123') {
      setIsAuthenticated(true);
      setError('');
      localStorage.setItem('admin_auth', 'true');
    } else {
      setError('Invalid password. Please try again.');
      throw new Error('Invalid password');
    }
  };

  const logout = (): void => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  return {
    isAuthenticated,
    error,
    login,
    logout,
  };
};

export default useAuth;