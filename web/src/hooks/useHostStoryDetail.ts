import { useState, useEffect } from 'react';
import { authAPI } from '@/services/authAPI';

export interface StoryComment {
  id: number;
  content: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  parentId?: number;
  replies?: StoryComment[];
}

export interface HostStoryDetail {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  status: 'draft' | 'pending_review' | 'published' | 'scheduled' | 'archived';
  adminReason?: string;
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
  comments: StoryComment[];
  commentsCount: number;
  likes?: any[];
  likesCount: number;
}

interface UseHostStoryDetailReturn {
  story: HostStoryDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useHostStoryDetail = (storyId: string | number): UseHostStoryDetailReturn => {
  const [story, setStory] = useState<HostStoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = async () => {
    if (!storyId) {
      setError('Story ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authAPI.getToken()}`
      };

      const response = await fetch(`/api/host/stories/${storyId}`, {
        headers,
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success && data.data) {
        setStory(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch story');
      }
    } catch (err) {
      console.error('Error fetching host story detail:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchStory();
  };

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  return {
    story,
    loading,
    error,
    refetch
  };
};

// Hook untuk comments actions
export interface UseStoryCommentsActionsReturn {
  approveComment: (commentId: number) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  loading: boolean;
}

export const useStoryCommentsActions = (): UseStoryCommentsActionsReturn => {
  const [loading, setLoading] = useState(false);

  const approveComment = async (commentId: number) => {
    try {
      setLoading(true);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authAPI.getToken()}`
      };

      const response = await fetch(`/api/host/comments/${commentId}/approve`, {
        method: 'PUT',
        headers,
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve comment');
      }
    } catch (err) {
      console.error('Error approving comment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      setLoading(true);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authAPI.getToken()}`
      };

      const response = await fetch(`/api/host/comments/${commentId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete comment');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    approveComment,
    deleteComment,
    loading
  };
};