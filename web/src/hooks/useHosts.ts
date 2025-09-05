import { useState, useEffect } from 'react';

export interface Host {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  avatar: string;
  location: string;
  cityId: string;
  city?: {
    name: string;
    country: {
      name: string;
    };
  };
  rating: number;
  reviewCount: number;
  specialties: string[];
  bio: string;
  isFeatured: boolean;
  category: string;
  experienceCount: number;
  startFromPrice?: number | null;
  currency: string;
  languages: {
    id: number;
    name: string;
    code: string;
    nativeName: string | null;
    proficiency: string;
  }[];
}

export interface City {
  id: string;
  name: string;
  country: {
    name: string;
  };
}

export const useHosts = () => {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/hosts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Transform data dari backend ke format yang diharapkan frontend
          const transformedHosts = (data.hosts || []).map((host: any) => {
            const slugName = host.name.toLowerCase().replace(/\s+/g, '-');
            const transformedHost = {
              id: host.id.toString(),
              uuid: host.uuid,
              name: host.name,
              slug: `${slugName}-${host.uuid}`,
              avatar: host.avatar,
              location: host.location,
              cityId: host.id.toString(),
              rating: host.rating,
              reviewCount: host.reviewCount,
              specialties: host.categories || [],
              bio: host.bio,
              // Only show as featured if both verified AND has high rating and experience
              isFeatured: host.verified && host.rating >= 4.7 && (host.experienceCount || 0) >= 2,
              category: host.categories?.[0] || 'Guide',
              experienceCount: host.experienceCount || 0,
              startFromPrice: host.startFromPrice,
              currency: host.currency || 'USD',
              languages: host.languages || []
            };
            return transformedHost;
          });
          
          setHosts(transformedHosts);
        } else {
          throw new Error(data.message || 'Failed to load hosts');
        }
      } catch (err) {
        
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setHosts([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchCities = async () => {
      try {
        const response = await fetch('/api/cities', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCities(data.data || []);
          }
        }
      } catch (err) {
        
        setCities([]);
      }
    };

    fetchHosts();
    fetchCities();
  }, []);

  return { hosts, cities, loading, error };
};
