import { useState, useEffect, useCallback } from 'react';
import { Story, StoriesResponse, isValidStory } from '../types/story';

interface UseStoriesWithPaginationResult {
  stories: Story[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  totalStories: number;
  currentPage: number;
}

export interface UseStoriesWithPaginationOptions {
  featured?: boolean;
  search?: string;
  category?: string;
  authorId?: string;
  cityId?: string;
  limit?: number;
  initialPage?: number;
}

export const useStoriesWithPagination = (
  options?: UseStoriesWithPaginationOptions
): UseStoriesWithPaginationResult => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(options?.initialPage || 1);
  const [hasMore, setHasMore] = useState(true);
  const [totalStories, setTotalStories] = useState(0);
  
  const limit = options?.limit || 12;

  const fetchStories = useCallback(async (page: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const params = new URLSearchParams();
      if (options?.featured) params.append('featured', 'true');
      if (options?.search) params.append('search', options.search);
      if (options?.category) params.append('category', options.category);
      if (options?.authorId) params.append('authorId', options.authorId);
      if (options?.cityId) params.append('cityId', options.cityId);
      params.append('limit', limit.toString());
      params.append('page', page.toString());
      
      const response = await fetch(`/api/stories/?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StoriesResponse = await response.json();
      
      if (data.success) {
        // Handle both response formats: data.stories or data.data
        const storiesArray = data.stories || (data as any).data || [];
        const pagination = data.pagination || (data as any).pagination || {};
        
        // Transform API data
        const transformedStories = storiesArray.map((story: any) => ({
          ...story,
          id: String(story.id),
          imageUrl: story.image || story.coverImage || story.cover_image,
          author: story.author ? {
            id: String(story.author.id),
            name: story.author.name || 'Anonymous',
            avatar: story.author.avatar || 'default-avatar.jpg',
            location: story.author.location || 'Unknown'
          } : {
            id: String(story.id),
            name: story.authorName || 'Anonymous', 
            avatar: story.authorImage || 'default-avatar.jpg',
            location: 'Unknown'
          },
          category: story.category || 'Travel',
          featured: story.featured || story.isFeatured || false,
          createdAt: story.publishedAt || story.createdAt || new Date().toISOString(),
          likeCount: story.likeCount || 0,
          commentCount: story.commentCount || 0,
          location: story.location || (story.City ? `${story.City.name}${story.City.country ? `, ${story.City.country.name}` : ''}` : null)
        }));
        
        const validStories = Array.isArray(transformedStories) 
          ? transformedStories.filter(isValidStory)
          : [];
        
        if (append) {
          setStories(prevStories => [...prevStories, ...validStories]);
        } else {
          setStories(validStories);
        }
        
        // Update pagination info
        setTotalStories(pagination.total || validStories.length);
        setHasMore(pagination.hasMore || (page * limit < (pagination.total || validStories.length)));
        
      } else {
        throw new Error('Failed to fetch stories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [options?.featured, options?.search, options?.category, options?.authorId, options?.cityId, limit]);

  // Initial load
  useEffect(() => {
    setCurrentPage(1);
    setStories([]);
    fetchStories(1, false);
  }, [fetchStories]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchStories(nextPage, true);
    }
  }, [currentPage, loadingMore, hasMore, fetchStories]);

  return {
    stories,
    loading,
    error,
    hasMore,
    loadMore,
    totalStories,
    currentPage
  };
};
