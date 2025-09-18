import { ImageService } from '@/services/imageService';
'use client';

import React, { useState, useEffect } from 'react';
import SimpleImage from './SimpleImage';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Story {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  status: 'draft' | 'pending_review' | 'published' | 'scheduled' | 'archived';
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

interface HostStoriesSectionProps {
  className?: string;
}

const HostStoriesSection: React.FC<HostStoriesSectionProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalStories: 0,
    publishedStories: 0,
    pendingStories: 0,
    draftStories: 0,
    totalViews: 0,
    totalLikes: 0
  });

  useEffect(() => {
    fetchHostStories();
  }, []);

  const fetchHostStories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from authAPI
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/stories/host', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch host stories');
      }

      const data = await response.json();
      
      if (data.success) {
        // Transform backend data to match frontend interface
        const transformedStories = (data.data || []).map((story: any) => ({
          id: story.id,
          title: story.title,
          content: story.content,
          imageUrl: story.coverImage ? `/images/stories/${story.coverImage}` : undefined,
          status: story.status,
          views: story.viewCount || 0,
          likes: story.likeCount || (story.likes ? story.likes.length : 0),
          comments: story.commentCount || (story.comments ? story.comments.length : 0),
          createdAt: story.createdAt,
          updatedAt: story.updatedAt
        }));
        
        setStories(transformedStories);
        
        // Calculate stats
        const totalStories = transformedStories.length;
        const publishedStories = transformedStories.filter((story: any) => story.status === 'published').length;
        const pendingStories = transformedStories.filter((story: any) => story.status === 'pending_review').length;
        const draftStories = transformedStories.filter((story: any) => story.status === 'draft').length;
        const totalViews = transformedStories.reduce((sum: number, story: any) => sum + story.views, 0);
        const totalLikes = transformedStories.reduce((sum: number, story: any) => sum + story.likes, 0);
        
        setStats({
          totalStories,
          publishedStories,
          pendingStories,
          draftStories,
          totalViews,
          totalLikes
        });
      } else {
        throw new Error(data.message || 'Failed to fetch stories');
      }
    } catch (err) {
      console.error('Error fetching host stories:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending_review':
        return 'bg-orange-100 text-orange-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Host Stories</h3>
              <p className="text-sm text-gray-500">Share your hosting experiences</p>
            </div>
          </div>
          <Link
            href="/host/stories/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Story
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.totalStories}</div>
            <div className="text-xs text-gray-500">Total Stories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.publishedStories}</div>
            <div className="text-xs text-gray-500">Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pendingStories}</div>
            <div className="text-xs text-gray-500">Pending Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.draftStories}</div>
            <div className="text-xs text-gray-500">Drafts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
            <div className="text-xs text-gray-500">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.totalLikes}</div>
            <div className="text-xs text-gray-500">Total Likes</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {stories.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stories yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first story.</p>
            <div className="mt-6">
              <Link
                href="/host/stories/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create your first story
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.slice(0, 3).map((story) => (
              <div key={story.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                {story.imageUrl && (
                  <div className="flex-shrink-0">
                    <SimpleImage
                      imagePath={story.imageUrl ? ImageService.getImageUrl(story.imageUrl, 'stories') : ''}
                      alt={story.title}
                      className="h-12 w-12 rounded-lg object-cover"
                      placeholderType="story"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{story.title}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
                      {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
                    <span>{formatDate(story.createdAt)}</span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {story.views}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {story.likes}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {story.comments}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/host/stories/${story.id}/edit`}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {stories.length > 3 && (
          <div className="mt-6 text-center">
            <Link 
              href="/host/stories"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              View all stories ({stories.length}) →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostStoriesSection;
