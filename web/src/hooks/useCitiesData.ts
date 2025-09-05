import { useState, useEffect } from 'react';

export interface CityData {
  id: number;  // API returns number, not string
  name: string;
  slug?: string;  // Optional since backend doesn't provide this
  country: string;  // API returns string, not object
  description?: string;
  totalExperiences?: number;
  totalOrders?: number;
  averagePrice?: number;
  popularCategories?: string[];
  image?: string;
  emoji?: string;
  timezone?: string;
  popular?: boolean;        // ⭐ Flag for popular destinations
  searchCount?: number;     // 📊 Number of times searched
}

interface CitiesResponse {
  success: boolean;
  data: CityData[];
  message?: string;
}

export const useCitiesData = () => {
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/cities`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: CitiesResponse = await response.json();
        
        if (data.success) {
          setCities(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch cities');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch cities');
        
        // Fallback data to match actual API structure
        setCities([
          { 
            id: 1, 
            name: 'Jakarta', 
            slug: 'jakarta',
            country: 'Indonesia',
            totalExperiences: 0,
            totalOrders: 0,
            averagePrice: 0,
            popularCategories: [],
            image: 'placeholder.jpg',
            emoji: '�️',
            popular: true,
            searchCount: 1200
          },
          { 
            id: 2, 
            name: 'Bali', 
            slug: 'bali',
            country: 'Indonesia',
            totalExperiences: 0,
            totalOrders: 0,
            averagePrice: 0,
            popularCategories: [],
            image: 'placeholder.jpg',
            emoji: '🏝️',
            popular: true,
            searchCount: 1450
          },
          { 
            id: 3, 
            name: 'Singapore', 
            slug: 'singapore',
            country: 'Singapore',
            totalExperiences: 0,
            totalOrders: 0,
            averagePrice: 0,
            popularCategories: [],
            image: 'placeholder.jpg',
            emoji: '🦁',
            popular: true,
            searchCount: 890
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Helper functions
  const getCityBySlug = (slug: string) => 
    cities.find(city => city.slug === slug);

  const getCityById = (id: string | number) => 
    cities.find(city => city.id.toString() === id.toString());

  const getCityByName = (name: string) => 
    cities.find(city => city.name.toLowerCase() === name.toLowerCase());

  const searchCities = (searchTerm: string) => {
    const term = searchTerm.toLowerCase().trim();
    return cities.filter(city => 
      city.name.toLowerCase().includes(term) ||
      (city.slug && city.slug.toLowerCase().includes(term)) ||
      city.country.toLowerCase().includes(term)
    );
  };

  const getCityUuidFromSearch = (searchTerm: string): string | null => {
    const term = searchTerm.toLowerCase().trim();
    
    // Direct slug match
    let city = getCityBySlug(term);
    if (city) return city.id.toString();
    
    // Direct name match
    city = getCityByName(term);
    if (city) return city.id.toString();
    
    // Partial search
    const results = searchCities(term);
    return results.length > 0 ? results[0].id.toString() : null;
  };

  return {
    cities,
    loading,
    error,
    getCityBySlug,
    getCityById,
    getCityByName,
    searchCities,
    getCityUuidFromSearch
  };
};
