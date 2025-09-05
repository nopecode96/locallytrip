'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHostStories } from '@/hooks/useHostStories';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/contexts/ToastContext';
import SimpleImage from '@/components/SimpleImage';

export default function HostStoriesPage() {
  const { stories, loading, error, deleteStory } = useHostStories();
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const handleDelete = async (storyId: number, storyTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${storyTitle}"?`)) {
      return;
    }

    try {
      setDeleteLoading(storyId);
      await deleteStory(storyId);
      showToast('Story deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete story', 'error');
      console.error('Error deleting story:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'published' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Stories</h1>
            <Link
              href="/host/stories/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create New Story
            </Link>
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Stories</h1>
            <Link
              href="/host/stories/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create New Story
            </Link>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">Error loading stories: {error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Stories</h1>
          <Link
            href="/host/stories/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
            </svg>
            Create New Story
          </Link>
        </div>

        {stories.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12">
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-4">No stories yet</h3>
              <p className="text-gray-600 mb-8">Start sharing your experiences and local insights with travelers.</p>
              <Link
                href="/host/stories/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                </svg>
                Create Your First Story
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {stories.length} {stories.length === 1 ? 'Story' : 'Stories'}
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {stories.map((story) => (
                <div key={story.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    {/* Story Cover Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                        {story.coverImage ? (
                          <SimpleImage
                            imagePath={story.coverImage}
                            alt={story.title}
                            className="h-12 w-12 rounded-lg object-cover"
                            placeholderType="story"
                          />
                        
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Story Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            <Link 
                              href={`/host/stories/edit/${story.id}`}
                              className="hover:text-blue-600"
                            >
                              {story.title}{story.coverImage ? '' : ' (No Cover Image)'}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {story.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {getStatusBadge(story.status)}
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              {story.viewCount} views
                            </span>
                            <span>{format(new Date(story.createdAt), 'MMM d, yyyy')}</span>
                            <span>{story.readingTime} min read</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            href={`/host/stories/edit/${story.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(story.id, story.title)}
                            disabled={deleteLoading === story.id}
                            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                          >
                            {deleteLoading === story.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
