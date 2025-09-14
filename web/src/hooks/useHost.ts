import { useState, useEffect } from 'react';
import { Experience as APIExperience } from '@/services/experienceAPI';
import { FormattedUserContact } from '@/types/communication';

export interface Host {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  responseRate: number;
  responseTime: number;
  instagramId: string;
  memberSince: string;
  categories: {
    id: string;
    name: string;
    icon: string;
    description: string;
  }[];
  toursCount: number;
  languages: {
    id: number;
    name: string;
    code: string;
    nativeName: string | null;
    proficiency: string;
  }[];
  communicationContacts?: FormattedUserContact[];
}

export interface Experience extends Omit<APIExperience, 'coverImage' | 'images'> {
  uuid: string;
  pricePerPackage: number;
  reviewCount: number;
  maxParticipants: number;
  coverImage: string | null;
  imageUrl: string | null;
  images: string[];
  location: string;
  meetingPoint: string;
  createdAt: string;
}

export const useHost = (hostId?: string | null) => {
  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hostId) {
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    
    const fetchHost = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/hosts/${hostId}`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setHost(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch host');
        }
      } catch (err: any) {
        if (!abortController.signal.aborted) {
          setError(err.message || 'Failed to fetch host');
          setHost(null);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchHost();

    return () => {
      abortController.abort();
    };
  }, [hostId]);

  return { host, loading, error };
};

export const useHostExperiences = (hostId?: string | null) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hostId) {
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/hosts/${hostId}/experiences`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setExperiences(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch experiences');
        }
      } catch (err: any) {
        if (!abortController.signal.aborted) {
          setError(err.message || 'Failed to fetch experiences');
          setExperiences([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchExperiences();

    return () => {
      abortController.abort();
    };
  }, [hostId]);

  return { experiences, loading, error };
};

export const useHostReviews = (hostId: string) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hostId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/hosts/${hostId}/reviews`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setReviews(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch reviews');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [hostId]);

  return { reviews, loading, error };
};

export const useHostStories = (hostId: string) => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hostId) return;

    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/hosts/${hostId}/stories`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match frontend interface
          const transformedStories = data.data.map((story: any) => ({
            id: story.id,
            title: story.title,
            excerpt: story.excerpt,
            image: story.image,
            publishedAt: new Date(story.publishedAt).toLocaleDateString(),
            readTime: `${story.readingTime || 5} min`,
            slug: story.slug
          }));
          setStories(transformedStories);
        } else {
          throw new Error(data.message || 'Failed to fetch stories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [hostId]);

  return { stories, loading, error };
};