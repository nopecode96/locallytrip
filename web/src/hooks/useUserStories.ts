import { useState, useEffect } from 'react';
import { authAPI } from '../services/authAPI';

export interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  published: boolean;
  status?: 'draft' | 'pending_review' | 'published' | 'scheduled' | 'archived';
  viewCount?: number;
  commentCount?: number;
  likeCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface UseUserStoriesReturn {
  stories: Story[];
  loading: boolean;
  error: string | null;
  stats: {
    totalStories: number;
    totalViews: number;
    totalComments: number;
    totalLikes: number;
  };
  refetch: () => void;
}

export const useUserStories = (): UseUserStoriesReturn => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalStories: 0,
    totalViews: 0,
    totalComments: 0,
    totalLikes: 0,
  });

  const fetchUserStories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from authAPI (consistent with other parts of the app)
      const token = authAPI.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/stories/my-stories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStories(data.data || []);
        
        // Use backend statistics if available, otherwise calculate from stories
        if (data.statistics) {
          setStats(data.statistics);
        } else {
          // Fallback: Calculate stats from stories
          const userStories = data.data || [];
          const calculatedStats = {
            totalStories: userStories.length,
            totalViews: userStories.reduce((sum: number, story: Story) => sum + (story.viewCount || 0), 0),
            totalComments: userStories.reduce((sum: number, story: Story) => sum + (story.commentCount || 0), 0),
            totalLikes: userStories.reduce((sum: number, story: Story) => sum + (story.likeCount || 0), 0),
          };
          setStats(calculatedStats);
        }
      } else {
        throw new Error(data.message || 'Failed to fetch stories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStories([]);
      setStats({
        totalStories: 0,
        totalViews: 0,
        totalComments: 0,
        totalLikes: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStories();
  }, []);

  return {
    stories,
    loading,
    error,
    stats,
    refetch: fetchUserStories,
  };
};
