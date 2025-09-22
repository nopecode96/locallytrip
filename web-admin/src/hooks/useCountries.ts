import { useState, useEffect } from 'react';
import { Country, CountryFormData } from '@/types/masterData';

interface UseCountriesResult {
  countries: Country[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createCountry: (data: CountryFormData) => Promise<void>;
  updateCountry: (id: number, data: Partial<CountryFormData>) => Promise<void>;
  deleteCountry: (id: number) => Promise<void>;
}

export const useCountries = (): UseCountriesResult => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/countries');
      const data = await response.json();
      
      if (data.success) {
        setCountries(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch countries');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching countries:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCountry = async (countryData: CountryFormData) => {
    try {
      setError(null);
      
      const response = await fetch('/api/countries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(countryData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchCountries();
      } else {
        throw new Error(data.error || 'Failed to create country');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateCountry = async (id: number, countryData: Partial<CountryFormData>) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/countries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(countryData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchCountries();
      } else {
        throw new Error(data.error || 'Failed to update country');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteCountry = async (id: number) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/countries/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchCountries();
      } else {
        throw new Error(data.error || 'Failed to delete country');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return {
    countries,
    loading,
    error,
    refetch: fetchCountries,
    createCountry,
    updateCountry,
    deleteCountry,
  };
};