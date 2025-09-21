import { useState, useEffect } from 'react';

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
  story: {
    id: number;
    title: string;
    slug: string;
  };
  parentId?: number;
  replies?: StoryComment[];
}

export interface CommentsResponse {
  comments: StoryComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    total: number;
    approved: number;
    pending: number;
    replies: number;
  };
}

interface UseCommentsParams {
  page?: number;
  limit?: number;
  status?: 'all' | 'approved' | 'pending';
  storyId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const useComments = (params: UseCommentsParams = {}) => {
  const [data, setData] = useState<CommentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params.storyId) queryParams.append('storyId', params.storyId.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await fetch(`/api/comments?${queryParams}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [
    params.page,
    params.limit,
    params.status,
    params.storyId,
    params.search,
    params.sortBy,
    params.sortOrder,
  ]);

  const refetch = () => {
    fetchComments();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export const useCommentActions = () => {
  const [loading, setLoading] = useState(false);

  const approveComment = async (commentId: number): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'approve' }),
      });

      if (!response.ok) {
        throw new Error(`Failed to approve comment: ${response.status}`);
      }
    } catch (error) {
      console.error('Error approving comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectComment = async (commentId: number): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'reject' }),
      });

      if (!response.ok) {
        throw new Error(`Failed to reject comment: ${response.status}`);
      }
    } catch (error) {
      console.error('Error rejecting comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const viewComment = async (commentId: number): Promise<StoryComment> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch comment: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: number): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    approveComment,
    rejectComment,
    viewComment,
    deleteComment,
    loading,
  };
};