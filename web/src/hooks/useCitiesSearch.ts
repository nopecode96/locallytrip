import { useState, useEffect, useCallback } from 'react';

export interface City {
  id: number;
  name: string;
  country: string;
  displayName: string;
}

export interface UseCitiesSearchResult {
  cities: City[];
  loading: boolean;
  error: string | null;
  searchCities: (query: string) => Promise<void>;
}

export const useCitiesSearch = (): UseCitiesSearchResult => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCities = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setCities([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('q', query);
      params.append('limit', '10');
      
      const response = await fetch(`/api/cities/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCities(data.data || []);
      } else {
        throw new Error('Failed to search cities');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cities,
    loading,
    error,
    searchCities
  };
};
