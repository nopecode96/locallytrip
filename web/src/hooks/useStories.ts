import { useState, useEffect, useMemo } from 'react';
import { Story, StoriesResponse, isValidStory } from '../types/story';
import { useDebounce } from './useDebounce';

interface UseStoriesResult {
  stories: Story[];
  loading: boolean;
  error: string | null;
}

export const useFeaturedStories = (limit: number = 6): UseStoriesResult => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use frontend API proxy instead of direct backend call
        const response = await fetch(`/api/stories/?limit=${limit}&page=1`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: StoriesResponse = await response.json();
        
        if (data.success) {
          // Handle both response formats: data.stories or data.data
          const storiesArray = data.stories || (data as any).data || [];
          
          // Transform API data to match StoriesContent expectations
          const transformedStories = storiesArray.map((story: any) => {
            console.log('🔄 useStories TRANSFORMATION:', {
              originalTitle: story.title,
              originalAuthorName: story.author?.name,
              originalAuthorLocation: story.author?.location,
              originalAuthorObject: story.author
            });
            
            const transformed = {
              id: String(story.id),
              title: story.title,
              slug: story.slug,
              excerpt: story.excerpt,
              content: story.content || story.excerpt,
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
            };
            
            console.log('✅ useStories TRANSFORMED:', {
              transformedTitle: transformed.title,
              transformedAuthorName: transformed.author?.name,
              transformedAuthorLocation: transformed.author?.location
            });
            
            return transformed;
          });
          
          setStories(transformedStories);
        } else {
          throw new Error('Failed to fetch stories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [limit]);

  return { stories, loading, error };
};

export interface UseStoriesOptions {
  featured?: boolean;
  search?: string;
  category?: string;
  authorId?: string;
  limit?: number;
  page?: number;
}

export const useStories = (options?: UseStoriesOptions): UseStoriesResult => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use direct search instead of debounced for immediate response
  const searchTerm = options?.search || '';

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (options?.featured) params.append('featured', 'true');
        
        // Add search parameter if provided (no minimum length requirement)
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        if (options?.category) params.append('category', options.category);
        if (options?.authorId) params.append('authorId', options.authorId);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.page) params.append('page', options.page.toString());
        
        const response = await fetch(`/api/stories/?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: StoriesResponse = await response.json();
        
        if (data.success) {
          // Handle both response formats: data.stories or data.data
          const storiesArray = data.stories || (data as any).data || [];
          
          // Transform API data to include counts
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
          
          setStories(validStories);
        } else {
          throw new Error('Failed to fetch stories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [
    options?.featured, 
    searchTerm, // Use direct search instead of debounced
    options?.category, 
    options?.authorId, 
    options?.limit, 
    options?.page
  ]);

  return { stories, loading, error };
};
