'use client';

import { useHostStories } from '@/hooks/useHostStories';
import Link from 'next/link';
import { format } from 'date-fns';

export default function HostStoriesSection() {
  const { stories, loading, error } = useHostStories();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Stories</h2>
          <Link href="/host/stories/create" className="text-sm text-blue-600 hover:text-blue-700">
            Create New
          </Link>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Stories</h2>
          <Link href="/host/stories/create" className="text-sm text-blue-600 hover:text-blue-700">
            Create New
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading stories: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const recentStories = stories.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">My Stories</h2>
        <div className="flex space-x-3">
          <Link 
            href="/host/stories" 
            className="text-sm text-gray-600 hover:text-gray-700"
          >
            View All ({stories.length})
          </Link>
          <Link 
            href="/host/stories/create" 
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Create New
          </Link>
        </div>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">You haven't created any stories yet.</p>
          <Link 
            href="/host/stories/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
            </svg>
            Create Your First Story
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recentStories.map((story) => (
            <div key={story.id} className="border-l-4 border-blue-500 pl-4 hover:bg-gray-50 p-3 rounded-r">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    <Link href={`/host/stories/edit/${story.id}`} className="hover:text-blue-600">
                      {story.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {story.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded ${
                      story.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {story.status}
                    </span>
                    <span>{story.viewCount} views</span>
                    <span>{format(new Date(story.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Link 
                    href={`/host/stories/edit/${story.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
