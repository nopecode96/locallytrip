'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminContext';
import { useToast } from '@/contexts/ToastContext';
import AdminNavbar from '@/components/AdminNavbar';
import ViewCommentModal from '@/components/ViewCommentModal';
import { useComments, useCommentActions, StoryComment } from '@/hooks/useComments';

const CommentsPage = () => {
  const { user } = useAdminAuth();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<StoryComment | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [commentToView, setCommentToView] = useState<StoryComment | null>(null);

  // Custom hooks for data fetching and actions
  const { data, loading, error, refetch } = useComments({
    page: currentPage,
    limit: 20,
    status: selectedStatus === 'all' ? undefined : selectedStatus as 'approved' | 'pending',
    search: searchTerm,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });

  const { approveComment, rejectComment, deleteComment, viewComment, loading: actionLoading } = useCommentActions();

  // Check if user has permission to manage comments
  if (!user || !['super_admin', 'admin', 'moderator'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        <div className="flex-1 lg:ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleViewComment = async (comment: StoryComment) => {
    try {
      const detailedComment = await viewComment(comment.id);
      setCommentToView(detailedComment);
      setViewModal(true);
    } catch (error) {
      showToast('Failed to fetch comment details', 'error');
    }
  };

  const handleApproveComment = async (comment: StoryComment) => {
    try {
      await approveComment(comment.id);
      refetch();
      showToast(`Comment approved successfully!`, 'success');
    } catch (err) {
      console.error('Failed to approve comment:', err);
      showToast(`Failed to approve comment: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
  };

  const handleRejectComment = async (comment: StoryComment) => {
    try {
      await rejectComment(comment.id);
      refetch();
      showToast(`Comment rejected successfully!`, 'info');
    } catch (err) {
      console.error('Failed to reject comment:', err);
      showToast(`Failed to reject comment: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
  };

  const handleDeleteComment = async (comment: StoryComment) => {
    setCommentToDelete(comment);
    setDeleteConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    try {
      await deleteComment(commentToDelete.id);
      refetch();
      showToast(`Comment deleted successfully!`, 'success');
      setDeleteConfirmModal(false);
      setCommentToDelete(null);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      showToast(`Failed to delete comment: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
  };

  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✅ Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        ⏳ Pending
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        <div className="flex-1 lg:ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading comments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        <div className="flex-1 lg:ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Comments</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || { total: 0, approved: 0, pending: 0, replies: 0 };
  const comments = data?.comments || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavbar />
      
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Story Comments Management</h1>
            <p className="mt-2 text-gray-600">Manage and moderate user comments on stories</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">💬</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="text-green-600 font-semibold">✅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <span className="text-yellow-600 font-semibold">⏳</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">↩️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Replies</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.replies}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Comments
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by content, user, or story..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Comments</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Reset Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('all');
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedStatus !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'No comments have been posted yet'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Story
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comments.map((comment) => (
                      <tr key={comment.id} className="hover:bg-gray-50">
                        {/* Comment Content */}
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-900">
                              {truncateText(comment.content, 80)}
                            </p>
                            {comment.parentId && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                ↩️ Reply
                              </span>
                            )}
                          </div>
                        </td>

                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              {comment.user.avatarUrl ? (
                                <img 
                                  className="h-8 w-8 rounded-full" 
                                  src={comment.user.avatarUrl} 
                                  alt={comment.user.name}
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-gray-600 text-xs font-medium">
                                    {comment.user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{comment.user.name}</p>
                              <p className="text-sm text-gray-500">{comment.user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Story */}
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-sm font-medium text-gray-900">
                              {truncateText(comment.story.title, 40)}
                            </p>
                            <p className="text-sm text-gray-500">
                              /{comment.story.slug}
                            </p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {getStatusBadge(comment.isApproved)}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewComment(comment)}
                              disabled={actionLoading}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                            >
                              👁️ View
                            </button>
                            
                            {!comment.isApproved && (
                              <button
                                onClick={() => handleApproveComment(comment)}
                                disabled={actionLoading}
                                className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                              >
                                ✅ Approve
                              </button>
                            )}
                            
                            {comment.isApproved && (
                              <button
                                onClick={() => handleRejectComment(comment)}
                                disabled={actionLoading}
                                className="text-yellow-600 hover:text-yellow-800 text-sm font-medium disabled:opacity-50"
                              >
                                ⏳ Reject
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteComment(comment)}
                              disabled={actionLoading}
                              className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center text-sm text-gray-700">
                <p>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} comments
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && commentToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <span className="text-red-600 text-xl">🗑️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Comment</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this comment? This action cannot be undone.
                </p>
                <div className="mt-3 p-3 bg-gray-50 rounded border text-left">
                  <p className="text-sm text-gray-700">
                    "{truncateText(commentToDelete.content, 60)}"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    by {commentToDelete.user.name}
                  </p>
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                >
                  {actionLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirmModal(false);
                    setCommentToDelete(null);
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Comment Modal */}
      <ViewCommentModal
        comment={commentToView}
        isOpen={viewModal}
        onClose={() => {
          setViewModal(false);
          setCommentToView(null);
        }}
      />
    </div>
  );
};

export default CommentsPage;