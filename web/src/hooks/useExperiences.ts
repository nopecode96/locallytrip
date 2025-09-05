import { useState, useEffect } from 'react';
import { experienceAPI, Experience, ExperienceFilters, ExperiencesResponse } from '@/services/experienceAPI';

export const useExperiences = (filters: ExperienceFilters = {}) => {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a small delay to prevent rapid API calls
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await experienceAPI.getAllExperiences(filters);
      
      if (response.success) {
        setData(response.data.experiences);
        setPagination(response.data.pagination);
      } else {
        // Don't show errors for empty results, just show empty state
        if (response.message?.includes('500') || response.message?.includes('error')) {
          setData([]);
          setPagination({
            total: 0,
            pages: 0,
            currentPage: 1,
            hasNext: false,
            hasPrev: false,
          });
        } else {
          setError(response.message || 'No results found');
        }
      }
    } catch (err) {
      // Handle network errors gracefully
      setData([]);
      setPagination({
        total: 0,
        pages: 0,
        currentPage: 1,
        hasNext: false,
        hasPrev: false,
      });
      // Only set error for serious issues, not for filter mismatches
      if (err instanceof Error && !err.message.includes('404')) {
        setError('Unable to load experiences. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [JSON.stringify(filters)]);

  return {
    experiences: data,
    loading,
    error,
    pagination,
    refetch: fetchExperiences,
  };
};

export const useFeaturedExperiences = (limit: number = 6) => {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await experienceAPI.getFeaturedExperiences(limit);
        
        if (response.success) {
          setData(response.data.experiences);
        } else {
          setError(response.message || 'Failed to fetch featured experiences');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { experiences: data, loading, error };
};

export const usePopularExperiences = (limit: number = 8) => {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await experienceAPI.getPopularExperiences(limit);
        
        if (response.success) {
          setData(response.data.experiences);
        } else {
          setError(response.message || 'Failed to fetch popular experiences');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, [limit]);

  return { experiences: data, loading, error };
};

export const useExperience = (id: string) => {
  const [data, setData] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await experienceAPI.getExperienceById(id);
        
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.message || 'Failed to fetch experience');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  return { experience: data, loading, error };
};
