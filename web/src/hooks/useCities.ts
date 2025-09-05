import { useState, useEffect } from 'react';

interface City {
  id: string;
  name: string;
  country: string;
  description?: string;
  totalExperiences: number;
  totalOrders: number;
  averagePrice: number;
  popularCategories: string[];
  image: string;
}

interface ApiCity {
  id: number;
  name: string;
  slug: string;
  description?: string;
  totalExperiences?: number;
  totalOrders?: number;
  averagePrice?: number;
  popularCategories?: string[];
  image?: string;
  country: string | { name: string };
  // Frontend-specific fields
  emoji?: string;
  popular?: boolean;
  searchCount?: number;
  experienceCount?: number;
}

interface CitiesResponse {
  success: boolean;
  data: ApiCity[];
  pagination?: {
    total: number;
    hasMore: boolean;
  };
}

export const useFavoriteCities = (limit: number = 6) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use frontend API proxy instead of direct backend call
        const response = await fetch(`/api/cities/?featured=true&limit=${limit}`);
        const data: CitiesResponse = await response.json();
        
        if (data.success) {
          // Transform API data to expected format
          const transformedCities: City[] = data.data.map(apiCity => ({
            id: String(apiCity.id),
            name: apiCity.name,
            country: typeof apiCity.country === 'string' ? apiCity.country : apiCity.country?.name || 'Unknown',
            description: apiCity.description || `Discover authentic local experiences in ${apiCity.name}`,
            totalExperiences: apiCity.totalExperiences || 0,
            totalOrders: apiCity.totalOrders || 0,
            averagePrice: apiCity.averagePrice || 0,
            popularCategories: apiCity.popularCategories || [],
            image: apiCity.image || 'placeholder.jpg'
          }));
          
          setCities(transformedCities);
        } else {
          setError('Failed to fetch cities');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [limit]);

  return { cities, loading, error };
};

export default useFavoriteCities;
