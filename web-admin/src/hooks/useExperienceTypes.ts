import { useState, useEffect } from 'react';
import { ExperienceType } from '@/types/experienceType';

interface UseExperienceTypesResult {
  experienceTypes: ExperienceType[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createExperienceType: (data: Partial<ExperienceType>) => Promise<void>;
  updateExperienceType: (id: number, data: Partial<ExperienceType>) => Promise<void>;
  deleteExperienceType: (id: number) => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
}

export const useExperienceTypes = (): UseExperienceTypesResult => {
  const [experienceTypes, setExperienceTypes] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperienceTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/experience-types');
      const data = await response.json();
      
      if (data.success) {
        setExperienceTypes(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch experience types');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching experience types:', err);
    } finally {
      setLoading(false);
    }
  };

  const createExperienceType = async (data: Partial<ExperienceType>) => {
    try {
      setError(null);
      
      const response = await fetch('/api/experience-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchExperienceTypes(); // Refresh list
      } else {
        throw new Error(result.error || 'Failed to create experience type');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateExperienceType = async (id: number, data: Partial<ExperienceType>) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/experience-types/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchExperienceTypes(); // Refresh list
      } else {
        throw new Error(result.error || 'Failed to update experience type');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteExperienceType = async (id: number) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/experience-types/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchExperienceTypes(); // Refresh list
      } else {
        throw new Error(result.error || 'Failed to delete experience type');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/experience-types/${id}/toggle-status`, {
        method: 'PATCH',
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchExperienceTypes(); // Refresh list
      } else {
        throw new Error(result.error || 'Failed to toggle status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchExperienceTypes();
  }, []);

  return {
    experienceTypes,
    loading,
    error,
    refetch: fetchExperienceTypes,
    createExperienceType,
    updateExperienceType,
    deleteExperienceType,
    toggleStatus,
  };
};