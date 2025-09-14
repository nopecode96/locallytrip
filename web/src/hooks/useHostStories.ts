import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/authAPI';

export interface Story {
  id: number;
  uuid: string; // Add UUID field for secure edit URLs
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;  // Keep for backward compatibility
  image?: string;       // New field from backend API
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
    try {
      console.log('Creating story with FormData:', Array.from(storyData.keys()));
      
      // Use API proxy route instead of hitting backend directly
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: getAuthHeadersForUpload(),
        body: storyData, // FormData for file upload
      });

      console.log('Create story response status:', response.status);
      const data = await response.json();
      console.log('Create story response data:', data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create story');
      }

      // Refresh stories list
      await fetchMyStories();
      
      return data.data;
    } catch (error) {
      console.error('Create story error:', error);
      throw error;
    }
  };

  const updateStory = async (id: number | string, storyData: FormData): Promise<Story> => {
    // Use host-specific API proxy route for authenticated access
    const response = await fetch(`/api/stories/host/${id}/`, {
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
    try {
      console.log(`Deleting story with ID: ${id}`);
      
      // Use API proxy route instead of hitting backend directly
      const response = await fetch(`/api/stories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      console.log(`Delete story response status: ${response.status}`);
      
      const data = await response.json();
      console.log('Delete story response data:', data);
      
      if (!response.ok) {
        // Handle specific HTTP status codes
        switch (response.status) {
          case 401:
            throw new Error('You need to be logged in to delete stories');
          case 403:
            throw new Error('You can only delete your own stories');
          case 404:
            throw new Error('Story not found or already deleted');
          default:
            throw new Error(data.message || `Server error (${response.status})`);
        }
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Delete operation failed');
      }

      console.log('Story deleted successfully, refreshing list...');
      
      // Refresh stories list
      await fetchMyStories();
    } catch (error) {
      console.error('Delete story error:', error);
      // Re-throw to let the UI handle it
      throw error;
    }
  };

  const getStoryById = async (id: number | string): Promise<Story> => {
    // Use host-specific API proxy route for authenticated access
    const response = await fetch(`/api/stories/host/${id}`, {
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
