'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useHostStoryDetail, useStoryCommentsActions } from '@/hooks/useHostStoryDetail';
import { useToast } from '@/contexts/ToastContext';
import SimpleImage from '@/components/SimpleImage';
import { format } from 'date-fns';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function HostStoryCommentsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const storyId = params.id as string;
  const { story, loading, error, refetch } = useHostStoryDetail(storyId);
  const { deleteComment, loading: actionLoading } = useStoryCommentsActions();

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Story</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Story not found
  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Story Not Found</h1>
          <p className="text-gray-600 mb-4">The story you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => router.push('/host/stories')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  // Handle delete comment
  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      showToast('Comment deleted successfully!', 'success');
      setShowDeleteConfirm(null);
      refetch();
    } catch (error) {
      showToast('Failed to delete comment', 'error');
    }
  };

  // Removed checkbox functionality since no bulk actions needed
  // const handleSelectComment = ... (removed)
  // const handleSelectAll = ... (removed)

  const getStatusBadge = (isApproved: boolean) => {
    // Status badge removed - no approval system needed
    return null;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/host/comments')}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Comments
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Story ID: {story.id}</span>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            {story.image && (
              <SimpleImage
                imagePath={story.image}
                alt={story.title}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{story.title}</h1>
              <p className="text-gray-600 mb-4">{story.excerpt}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>👁️ {story.viewCount} views</span>
                <span>💬 {story.commentsCount} comments</span>
                <span>📅 {formatDate(story.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Management */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Comments Management</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {story.comments.length} total comments
                </span>
              </div>
            </div>
          </div>

          {story.comments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Comments Yet</h3>
              <p className="text-gray-600">Your story hasn't received any comments yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {story.comments.map((comment) => (
                <div key={comment.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <SimpleImage
                      imagePath={comment.user.avatarUrl || '/images/users/default.jpg'}
                      alt={comment.user.name}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                      placeholderType="profile"
                      category="users/avatars"
                      name={comment.user.name}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{comment.user.name}</h4>
                          <span className="text-sm text-gray-500">{comment.user.email}</span>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{comment.content}</p>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setShowDeleteConfirm(comment.id)}
                          disabled={actionLoading}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Comment</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this comment? This action cannot be undone.
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    onClick={() => handleDeleteComment(showDeleteConfirm)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                  >
                    {actionLoading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}