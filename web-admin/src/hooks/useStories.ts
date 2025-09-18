import { useState, useEffect } from 'react';

export interface Story {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  status: 'draft' | 'pending_review' | 'published' | 'pending' | 'archived';
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  readingTime?: number;
  language: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
    fullName: string;
  } | null;
  city: {
    id: number;
    name: string;
    country: {
      id: number;
      name: string;
      code: string;
    } | null;
  } | null;
}

export interface StoryStats {
  total: number;
  published: number;
  pending: number;
  pending_review: number;
  draft: number;
  archived: number;
  featured: number;
}

export interface StoriesResponse {
  stories: Story[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: StoryStats;
}

interface UseStoriesOptions {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  author?: string;
  featured?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const useStories = (options: UseStoriesOptions = {}) => {
  const [data, setData] = useState<StoriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.status) params.append('status', options.status);
      if (options.search) params.append('search', options.search);
      if (options.author) params.append('author', options.author);
      if (options.featured) params.append('featured', options.featured);
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);

      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/stories?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch stories');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Stories fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [options.page, options.limit, options.status, options.search, options.author, options.featured, options.sortBy, options.sortOrder]);

  return {
    data,
    loading,
    error,
    refetch: fetchStories,
  };
};

export const useStoryActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStoryStatus = async (storyId: number, status: string, reason?: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/stories/${storyId}?action=status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, reason }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update story status');
      }

      return await response.json();
    } catch (err) {
      console.error('Update story status error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update story status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (storyId: number, featured: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/stories/${storyId}?action=featured`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update featured status');
      }

      return await response.json();
    } catch (err) {
      console.error('Toggle featured error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update featured status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkAction = async (action: string, storyIds: number[], data?: any) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, storyIds, data }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to perform bulk action');
      }

      return await response.json();
    } catch (err) {
      console.error('Bulk action error:', err);
      setError(err instanceof Error ? err.message : 'Failed to perform bulk action');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (storyId: number) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete story');
      }

      return await response.json();
    } catch (err) {
      console.error('Delete story error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete story');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateStoryStatus,
    toggleFeatured,
    bulkAction,
    deleteStory,
    loading,
    error,
  };
};
