import { useState, useEffect, useMemo } from 'react';
import { authAPI } from '@/services/authAPI';

export interface HostExperiencesStats {
  active: number;
  pending: number;
  draft: number;
  total: number;
  totalViews: number;
  totalBookings: number;
}

export interface Experience {
  id: number;
  uuid: string;
  title: string;
  description: string;
  shortDescription: string;
  slug: string;
  price: string;
  pricePerPackage: string;
  currency: string;
  duration: number;
  difficulty: string;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  totalReviews: number;
  reviewCount: number;
  viewCount: number;
  bookingCount: number;
  maxGuests: number;
  minGuests: number;
  hostName: string;
  host: {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    totalReviews: number;
    bio: string;
  };
  coverImage: string;
  imageUrl: string;
  images: string[];
  included: string[];
  excluded: string[];
  requirements: string[];
  cancellationPolicy: string | null;
  meetingPoint: string;
  latitude: number | null;
  longitude: number | null;
  location: string;
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    description: string;
  };
  city: any;
  createdAt: string;
}

export interface HostExperiencesData {
  experiences: Experience[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useHostExperiencesStats(hostId: number | string) {
  const [data, setData] = useState<HostExperiencesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!hostId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const token = authAPI.getToken();
        if (!token) {
          throw new Error('No authentication token available');
        }

        const response = await fetch(`/api/hosts/${hostId}/experiences/stats/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch experiences stats: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
          setData(result.data.stats);
        } else {
          throw new Error(result.message || 'Failed to fetch experiences stats');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Experiences stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [hostId]);

  return { data, loading, error, refetch: () => setLoading(true) };
}

export function useHostExperiences(hostId: number | string, filters?: { 
  status?: string; 
  page?: number; 
  limit?: number 
}) {
  
  const [data, setData] = useState<HostExperiencesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Extract primitive values to avoid object dependency issues
  const filterStatus = filters?.status;
  const filterPage = filters?.page || 1;
  const filterLimit = filters?.limit || 10;

  useEffect(() => {
    
    if (!hostId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = authAPI.getToken();
        if (!token) {
          throw new Error('No authentication token');
        }

        const params = new URLSearchParams();
        if (filterStatus) params.append('status', filterStatus);
        params.append('page', filterPage.toString());
        params.append('limit', filterLimit.toString());
        
        const queryString = params.toString();
        const url = `/api/hosts/${hostId}/experiences/${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          // Backend returns: { data: { experiences: [...], pagination: {...} } }
          const experiencesData = {
            experiences: result.data.experiences || [],
            pagination: result.data.pagination
          };
          setData(experiencesData);
        } else {
          throw new Error(result.message || 'API returned success: false');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hostId, filterStatus, filterPage, filterLimit]);

  return { data, loading, error, refetch: () => setLoading(true) };
}
