import { useState, useEffect } from 'react';
import { authAPI } from '@/services/authAPI';

export interface HostStoryComment {
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
  replies?: HostStoryComment[];
}

export interface HostCommentsStats {
  total: number;
  approved: number;
  pending: number;
  recent: number;
}

interface UseHostCommentsReturn {
  comments: HostStoryComment[];
  stats: HostCommentsStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  approveComment: (commentId: number) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
}

export const useHostComments = (): UseHostCommentsReturn => {
  const [comments, setComments] = useState<HostStoryComment[]>([]);
  const [stats, setStats] = useState<HostCommentsStats>({
    total: 0,
    approved: 0,
    pending: 0,
    recent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authAPI.getToken()}`
      };

      const response = await fetch('/api/host/comments', {
        headers,
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch comments');
      }

      if (data.success && data.data) {
        setComments(data.data.comments || []);
        setStats(data.data.stats || {
          total: 0,
          approved: 0,
          pending: 0,
          recent: 0
        });
      }
    } catch (err) {
      console.error('Error fetching host comments:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (commentId: number) => {
    try {
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

      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, isApproved: true }
          : comment
      ));

      setStats(prev => ({
        ...prev,
        approved: prev.approved + 1,
        pending: prev.pending - 1
      }));
    } catch (err) {
      console.error('Error approving comment:', err);
      throw err;
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
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

      const deletedComment = comments.find(c => c.id === commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));

      if (deletedComment) {
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          approved: deletedComment.isApproved ? prev.approved - 1 : prev.approved,
          pending: !deletedComment.isApproved ? prev.pending - 1 : prev.pending
        }));
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      throw err;
    }
  };

  const refetch = () => {
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return {
    comments,
    stats,
    loading,
    error,
    refetch,
    approveComment,
    deleteComment
  };
};
