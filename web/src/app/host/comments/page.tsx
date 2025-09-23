'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { useHostComments } from '@/hooks/useHostComments';
import { useToast } from '@/contexts/ToastContext';
import SimpleImage from '@/components/SimpleImage';
import ConfirmDialog from '@/components/ConfirmDialog';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface DeleteDialogState {
  isOpen: boolean;
  commentId: number | null;
  commentText: string;
}

export default function HostCommentsPage() {
  const { user } = useAuth();
  const { comments, stats, deleteComment, refetch } = useHostComments();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    commentId: null,
    commentText: ''
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const { showToast } = useToast();

  // Filter comments based on active tab
  const filteredComments = useMemo(() => {
    if (activeTab === 'all') return comments;
    if (activeTab === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return comments.filter(comment => new Date(comment.createdAt) >= thirtyDaysAgo);
    }
    return comments;
  }, [comments, activeTab]);

  // Pagination logic
  const totalItems = filteredComments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedComments = filteredComments.slice(startIndex, endIndex);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    const total = comments.length;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = comments.filter(comment => new Date(comment.createdAt) >= thirtyDaysAgo).length;

    return { total, recent };
  }, [comments]);

  // Handle approve comment - removed since approval not needed
  // const handleApproveComment = async (commentId: number) => { ... }

  // Handle delete comment
  const handleDeleteClick = (commentId: number, commentText: string) => {
    setDeleteDialog({
      isOpen: true,
      commentId,
      commentText: commentText.substring(0, 100) + (commentText.length > 100 ? '...' : '')
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.commentId) return;

    try {
      setActionLoading(deleteDialog.commentId);
      await deleteComment(deleteDialog.commentId);
      showToast('Comment deleted successfully!', 'success');
      setDeleteDialog({ isOpen: false, commentId: null, commentText: '' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToast('Failed to delete comment', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, commentId: null, commentText: '' });
  };

  const getStatusBadge = (isApproved: boolean) => {
    // Status badge removed - no approval system needed
    return null;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Story Comments</h1>
          <p className="mt-2 text-gray-600">
            View and manage comments on your stories. Respond to feedback and moderate discussions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-lg">💬</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Comments</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-lg">🕒</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Recent (30d)</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.recent}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'all', label: 'All Comments', count: tabCounts.total },
                { key: 'recent', label: 'Recent', count: tabCounts.recent }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setCurrentPage(1); // Reset to first page when changing tabs
                  }}
                  className={`${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`${
                      activeTab === tab.key
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-900'
                    } py-0.5 px-2.5 rounded-full text-xs font-medium`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {paginatedComments.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {activeTab === 'all' ? 'No comments yet' : `No ${activeTab} comments`}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'all' 
                  ? 'Comments on your stories will appear here.'
                  : `You don't have any ${activeTab} comments at the moment.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {paginatedComments.map((comment) => (
                <div key={comment.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <SimpleImage
                      imagePath={comment.user.avatarUrl || '/images/users/default.jpg'}
                      alt={comment.user.name}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                      placeholderType="profile"
                      category="users/avatars"
                      name={comment.user.name}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">{comment.user.name}</h4>
                          <span className="text-sm text-gray-500">{comment.user.email}</span>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">
                          Commented on: 
                          <Link 
                            href={`/host/stories/${comment.story.id}/comments`}
                            className="text-blue-600 hover:text-blue-800 font-medium ml-1"
                          >
                            {comment.story.title}
                          </Link>
                        </p>
                        <p className="text-gray-900">{comment.content}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleDeleteClick(comment.id, comment.content)}
                          disabled={actionLoading === comment.id}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          🗑️ Delete
                        </button>

                        <Link
                          href={`/host/stories/${comment.story.id}/comments`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          👁️ View Story
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow-sm">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
                  <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Delete Comment"
          message={`Are you sure you want to delete this comment? This action cannot be undone.\n\n"${deleteDialog.commentText}"`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          loading={actionLoading === deleteDialog.commentId}
        />
      </div>
    </div>
  );
}