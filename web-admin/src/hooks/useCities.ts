import { useState, useEffect } from 'react';
import { City, CityFormData } from '@/types/masterData';

interface UseCitiesResult {
  cities: City[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createCity: (data: CityFormData) => Promise<void>;
  updateCity: (id: number, data: Partial<CityFormData>) => Promise<void>;
  deleteCity: (id: number) => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
}

export const useCities = (): UseCitiesResult => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cities');
      const data = await response.json();
      
      if (data.success) {
        setCities(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch cities');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCity = async (cityData: CityFormData) => {
    try {
      setError(null);
      
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cityData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchCities();
      } else {
        throw new Error(data.error || 'Failed to create city');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateCity = async (id: number, cityData: Partial<CityFormData>) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/cities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cityData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchCities();
      } else {
        throw new Error(data.error || 'Failed to update city');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteCity = async (id: number) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/cities/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchCities();
      } else {
        throw new Error(data.error || 'Failed to delete city');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      setError(null);
      
      const city = cities.find(c => c.id === id);
      if (!city) {
        throw new Error('City not found');
      }

      await updateCity(id, { is_active: !city.is_active });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return {
    cities,
    loading,
    error,
    refetch: fetchCities,
    createCity,
    updateCity,
    deleteCity,
    toggleStatus,
  };
};