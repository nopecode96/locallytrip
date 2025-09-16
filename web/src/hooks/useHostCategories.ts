import { useState, useEffect } from 'react';
import { authAPI, type HostCategory, type ApiResponse } from '../services/authAPI';

interface UseHostCategoriesReturn {
  categories: HostCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useHostCategories = (): UseHostCategoriesReturn => {
  const [categories, setCategories] = useState<HostCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.getHostCategories();
      
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.error || 'Failed to load host categories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load host categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};
