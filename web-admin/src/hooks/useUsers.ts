import { useState, useEffect } from 'react';

export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: 'traveller' | 'host' | 'admin' | 'super_admin' | 'finance' | 'marketing' | 'moderator';
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  isTrusted: boolean;
  joinDate: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  City?: {
    id: number;
    name: string;
    slug: string;
  };
  userRole?: {
    id: number;
    name: string;
    permissions: string[];
  };
  _count?: {
    hostedExperiences: number;
    bookings: number;
    reviews: number;
  };
}

export interface UsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Custom hook for managing users
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UsersResponse['pagination'] | null>(null);

  const fetchUsers = async (filters: UserFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; data: UsersResponse; error?: string } = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id: number): Promise<User | null> => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; data: User; error?: string } = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to fetch user');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      return null;
    }
  };

  const updateUser = async (id: number, userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; error?: string } = await response.json();
      
      if (data.success) {
        // Refresh users list
        await fetchUsers();
        return true;
      } else {
        throw new Error(data.error || 'Failed to update user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating user:', err);
      return false;
    }
  };

  const deleteUser = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; error?: string } = await response.json();
      
      if (data.success) {
        // Refresh users list
        await fetchUsers();
        return true;
      } else {
        throw new Error(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting user:', err);
      return false;
    }
  };

  const resetPassword = async (id: number, newPassword: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; error?: string } = await response.json();
      
      if (data.success) {
        return true;
      } else {
        throw new Error(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error resetting password:', err);
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    getUserById,
    updateUser,
    deleteUser,
    resetPassword,
  };
};

export default useUsers;