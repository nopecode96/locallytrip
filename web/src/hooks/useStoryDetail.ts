import { useState, useEffect } from 'react';

export interface StoryDetailData {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  images?: string[];
  readingTime?: number;
  views?: number;
  likesCount?: number;
  commentsCount?: number;
  comments?: Array<{
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
      avatar: string;
    };
  }>;
  tags?: string[];
  keywords?: string[];
  language?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    avatar: string;
    bio?: string;
  };
  location?: {
    id: number;
    name: string;
    country?: string;
  } | null;
  meta?: {
    title?: string;
    description?: string;
  };
  relatedStories?: Array<{
    id: number;
    slug: string;
    title: string;
    image: string;
    authorName: string;
    location: string;
  }>;
}

interface UseStoryDetailReturn {
  story: StoryDetailData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStoryDetail = (slug: string): UseStoryDetailReturn => {
  const [story, setStory] = useState<StoryDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = async () => {
    if (!slug) {
      setError('Story slug is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      
      const response = await fetch(`/api/stories/${encodeURIComponent(slug)}`);
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
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the story');
      setStory(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStory();
  }, [slug]);

  const refetch = () => {
    fetchStory();
  };

  return {
    story,
    loading,
    error,
    refetch
  };
};
