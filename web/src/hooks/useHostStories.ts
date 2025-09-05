import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/authAPI';

export interface Story {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: 'draft' | 'published';
  readingTime: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    avatar_url?: string;
  };
  city?: {
    id: number;
    name: string;
  };
  comments?: any[];
  likes?: any[];
}

export const useHostStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const getAuthHeaders = (): Record<string, string> => {
    const token = authAPI.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  const getAuthHeadersForUpload = (): Record<string, string> => {
    const token = authAPI.getToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  const fetchMyStories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use API proxy route instead of hitting backend directly
      const response = await fetch('/api/stories/my-stories', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setStories(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch stories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching host stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const createStory = async (storyData: FormData): Promise<Story> => {
    // Use API proxy route instead of hitting backend directly
    const response = await fetch('/api/stories', {
      method: 'POST',
      headers: getAuthHeadersForUpload(),
      body: storyData, // FormData for file upload
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to create story');
    }

    // Refresh stories list
    await fetchMyStories();
    
    return data.data;
  };

  const updateStory = async (id: number, storyData: FormData): Promise<Story> => {
    // Use API proxy route instead of hitting backend directly
    const response = await fetch(`/api/stories/${id}`, {
      method: 'PUT',
      headers: getAuthHeadersForUpload(),
      body: storyData,
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to update story');
    }

    // Refresh stories list
    await fetchMyStories();
    
    return data.data;
  };

  const deleteStory = async (id: number): Promise<void> => {
    // Use API proxy route instead of hitting backend directly
    const response = await fetch(`/api/stories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete story');
    }

    // Refresh stories list
    await fetchMyStories();
  };

  const getStoryById = async (id: number): Promise<Story> => {
    // Use API proxy route instead of hitting backend directly
    const response = await fetch(`/api/stories/${id}`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch story');
    }

    return data.data;
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyStories();
    }
  }, [isAuthenticated]);

  return {
    stories,
    loading,
    error,
    fetchMyStories,
    createStory,
    updateStory,
    deleteStory,
    getStoryById,
  };
};
