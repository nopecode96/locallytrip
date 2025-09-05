import { useState, useEffect } from 'react';
import { authAPI } from '../services/authAPI';

export interface HostDashboardData {
  overview: {
    totalExperiences: number;
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    completedBookings: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
  };
  recentBookings: Array<{
    id: number;
    uuid: string;
    status: string;
    totalAmount: number;
    currency: string;
    experienceDate: string;
    guestCount: number;
    createdAt: string;
    experience: {
      id: number;
      title: string;
      coverImage: string | null;
    };
    guest: {
      id: number;
      name: string;
      avatar: string | null;
      email: string;
    };
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
}

export function useHostDashboard(hostId: number | string) {
  const [data, setData] = useState<HostDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!hostId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const token = authAPI.getToken();
        if (!token) {
          throw new Error('No authentication token available');
        }

      const response = await fetch(`/api/hosts/${hostId}/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [hostId]);

  return { data, loading, error, refetch: () => setLoading(true) };
}
