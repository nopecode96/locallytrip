import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/authAPI';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  experienceId: number;
  userId: number;
  experience: {
    id: number;
    title: string;
    slug: string;
    coverImage?: string;
  };
  reviewer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar_url?: string | null;
  };
  hostReply?: {
    id: number;
    message: string;
    createdAt: string;
  } | null;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recentReviews: number; // Reviews in last 30 days
  responseRate: number; // Percentage of reviews with host replies
}

export const useHostReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Helper function to calculate stats from current reviews
  const calculateStats = (reviewsList: Review[]): ReviewStats => {
    const totalReviews = reviewsList.length;
    const averageRating = totalReviews > 0 
      ? Math.round((reviewsList.reduce((acc, review) => acc + review.rating, 0) / totalReviews) * 10) / 10
      : 0;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      }
    });

    const recentReviews = reviewsList.filter(review => {
      const reviewDate = new Date(review.createdAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return reviewDate > weekAgo;
    }).length;

    const reviewsWithReplies = reviewsList.filter(review => review.hostReply).length;
    const responseRate = totalReviews > 0 
      ? Math.round((reviewsWithReplies / totalReviews) * 100 * 10) / 10
      : 0;

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      recentReviews,
      responseRate
    };
  };

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

  const fetchHostReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use API proxy route instead of hitting backend directly
      const response = await fetch('/api/reviews/host-reviews/', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data.reviews || []);
        setStats(data.data.stats || null);
      } else {
        throw new Error(data.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching host reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const replyToReview = async (reviewId: number, message: string): Promise<void> => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/reply/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to reply to review');
      }

      // Update local state immediately to show the new reply
      const updatedReviews = reviews.map(review => 
        review.id === reviewId 
          ? {
              ...review,
              hostReply: {
                id: data.data?.id || Date.now(),
                message: message.trim(),
                createdAt: data.data?.createdAt || new Date().toISOString()
              }
            }
          : review
      );
      
      setReviews(updatedReviews);
      setStats(calculateStats(updatedReviews));
      
      // Also refresh from server to ensure consistency
      await fetchHostReviews();
    } catch (error) {
      console.error('Reply to review error:', error);
      throw error;
    }
  };

  const updateReply = async (reviewId: number, message: string): Promise<void> => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/reply/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update reply');
      }

      // Update local state immediately to show the updated reply
      const updatedReviews = reviews.map(review => 
        review.id === reviewId 
          ? {
              ...review,
              hostReply: review.hostReply ? {
                ...review.hostReply,
                message: message.trim(),
                createdAt: data.data?.updatedAt || new Date().toISOString()
              } : null
            }
          : review
      );
      
      setReviews(updatedReviews);
      setStats(calculateStats(updatedReviews));
      
      // Also refresh from server to ensure consistency
      await fetchHostReviews();
    } catch (error) {
      console.error('Update reply error:', error);
      throw error;
    }
  };

  const deleteReply = async (reviewId: number): Promise<void> => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/reply/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete reply');
      }

      // Update local state immediately to remove the reply
      const updatedReviews = reviews.map(review => 
        review.id === reviewId 
          ? {
              ...review,
              hostReply: null
            }
          : review
      );
      
      setReviews(updatedReviews);
      setStats(calculateStats(updatedReviews));
      
      // Also refresh from server to ensure consistency
      await fetchHostReviews();
    } catch (error) {
      console.error('Delete reply error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHostReviews();
    }
  }, [isAuthenticated]);

  return {
    reviews,
    stats,
    loading,
    error,
    fetchHostReviews,
    replyToReview,
    updateReply,
    deleteReply,
  };
};