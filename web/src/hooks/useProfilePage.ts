// Hook untuk profile page dengan real-time updates
'use client';

import { useState, useEffect } from 'react';
import { User, authAPI } from '@/services/authAPI';

interface UseProfilePageReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: any) => Promise<{ success: boolean; message?: string }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; message?: string }>;
  removeAvatar: () => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
}

export const useProfilePage = (): UseProfilePageReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from API
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = authAPI.getToken();
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Use frontend API routes (recommended pattern for LocallyTrip)
      const response = await fetch('/api/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Backend returns data directly in data field
        const userData = data.data || data.user;
        
        // Transform avatar URLs if they're relative paths
        if (userData && userData.avatarUrl && !userData.avatarUrl.startsWith('http')) {
          const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGES || 'http://localhost:3001/images';
          userData.avatarUrl = `${imageBaseUrl}/users/avatars/${userData.avatarUrl}`;
        }
        
        // Add userLanguages if available
        if (data.userLanguages) {
          userData.userLanguages = data.userLanguages;
        }
        
        setUser(userData);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('💥 fetchUser error:', err);
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (profileData: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = authAPI.getToken();
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${backendUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh user data from API immediately after update
        await fetchUser();
        return { success: true, message: 'Profile updated successfully' };
      } else {
        return { success: false, message: data.message || 'Update failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  // Upload avatar
  const uploadAvatar = async (file: File): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = authAPI.getToken();
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${backendUrl}/auth/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh user data to get new avatar URL
        await fetchUser();
        return { success: true, message: 'Avatar uploaded successfully' };
      } else {
        return { success: false, message: data.message || 'Upload failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  // Remove avatar
  const removeAvatar = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = authAPI.getToken();
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${backendUrl}/auth/remove-avatar`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh user data
        await fetchUser();
        return { success: true, message: 'Avatar removed successfully' };
      } else {
        return { success: false, message: data.message || 'Remove failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = authAPI.getToken();
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${backendUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: 'Password changed successfully' };
      } else {
        return { success: false, message: data.message || 'Password change failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    changePassword,
    refreshUser: fetchUser,
  };
};
