'use client';

import { useState, useEffect } from 'react';export interface FeaturedHost {  id: string;  hostId: string;  name: string;  title: string;  description: string;  badge: string;  profilePicture: string;  location: string;  rating: number;  totalReviews: number;  isVerified: boolean;  joinedDate: string;
  displayOrder: number;
}

export const useFeaturedHosts = (limit: number = 4) => {
  
  const [hosts, setHosts] = useState<FeaturedHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    // Create AbortController for cleanup
    const controller = new AbortController();
    
    const loadHosts = async () => {
      try {
        
        const response = await fetch(`/api/featured-hosts/?limit=${limit}`, {
          signal: controller.signal
        });
        
        
        if (!response.ok) {
          throw new Error(`Failed to load: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setHosts(data.data);
          setError(null);
        } else {
          setError('Invalid response from server');
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }
        setError('Failed to load featured hosts');
        setHosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Start the async operation
    loadHosts();
    
    // Cleanup function
    return () => {
      controller.abort();
    };
  }, [limit]);

  return { hosts, loading, error };
};