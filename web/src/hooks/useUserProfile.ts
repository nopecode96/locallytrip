// Custom hook untuk mendapatkan data user dari API
'use client';

import { useState, useEffect } from 'react';
import { User } from '@/services/authAPI';

interface UseUserProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage (minimal session usage)
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setUser(null);
        return;
      }

      // Always fetch fresh data from API
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache', // Force fresh data
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data);
      } else {
        setError(data.message || 'Failed to fetch profile');
        // Clear invalid token
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          setUser(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchUserProfile();
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    user,
    loading,
    error,
    refresh
  };
};
