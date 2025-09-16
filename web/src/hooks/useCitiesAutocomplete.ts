import { useState, useEffect } from 'react';

interface City {
  id: number;
  name: string;
  country: string;
  displayName?: string;
}

interface UseCitiesAutocompleteReturn {
  cities: City[];
  loading: boolean;
  error: string | null;
  searchCities: (query: string) => Promise<void>;
}

export const useCitiesAutocomplete = (): UseCitiesAutocompleteReturn => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCities = async (query: string) => {
    if (!query || query.length < 2) {
      setCities([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/cities/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setCities(data.data || []);
      } else {
        setError(data.message || 'Failed to search cities');
        setCities([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    cities,
    loading,
    error,
    searchCities
  };
};
