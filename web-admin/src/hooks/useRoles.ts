import { useState, useEffect } from 'react';

export interface Role {
  id: number;
  name: string;
  description: string;
}

// Custom hook for managing roles
export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/roles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; data: Role[]; error?: string } = await response.json();
      
      if (data.success) {
        setRoles(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch roles');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
  };
};

export default useRoles;