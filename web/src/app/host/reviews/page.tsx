'use client';

import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useHostReviews } from '@/hooks/useHostReviews';
import { useToast } from '@/contexts/ToastContext';
import SimpleImage from '@/components/SimpleImage';
import ConfirmDialog from '@/components/ConfirmDialog';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface ReplyDialogState {
  isOpen: boolean;
  reviewId: number | null;
  mode: 'create' | 'edit';
  existingReply?: string;
}

export default function HostReviewsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { reviews, loading, replyToReview, updateReply, deleteReply } = useHostReviews();
  
  const [activeTab, setActiveTab] = useState<'all' | 'replied' | 'pending' | 'recent'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [replyDialog, setReplyDialog] = useState<ReplyDialogState>({
    isOpen: false,
    reviewId: null,
    mode: 'create'
  });
  const [replyMessage, setReplyMessage] = useState('');

  // Filter reviews based on active tab
  const filteredReviews = useMemo(() => {
    if (activeTab === 'all') return reviews;
    if (activeTab === 'replied') return reviews.filter(review => review.hostReply);
    if (activeTab === 'pending') return reviews.filter(review => !review.hostReply);
    if (activeTab === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return reviews.filter(review => new Date(review.createdAt) >= thirtyDaysAgo);
    }
    return reviews;
  }, [reviews, activeTab]);

  // Pagination logic
  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    const total = reviews.length;
    const replied = reviews.filter(review => review.hostReply).length;
    const pending = reviews.filter(review => !review.hostReply).length;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = reviews.filter(review => new Date(review.createdAt) >= thirtyDaysAgo).length;
    
    return { total, replied, pending, recent };
  }, [reviews]);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const handleReplyClick = (reviewId: number) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    setReplyDialog({
      isOpen: true,
      reviewId,
      mode: review.hostReply ? 'edit' : 'create',
      existingReply: review.hostReply?.message || ''
    });
    setReplyMessage(review.hostReply?.message || '');
  };

  const handleReplyCancel = () => {
    setReplyDialog({ isOpen: false, reviewId: null, mode: 'create' });
    setReplyMessage('');
  };

  const handleReplySubmit = async () => {
    if (!replyDialog.reviewId || !replyMessage.trim()) return;

    try {
      if (replyDialog.mode === 'create') {
        await replyToReview(replyDialog.reviewId, replyMessage.trim());
        showToast('Reply posted successfully! 📝', 'success');
      } else {
        await updateReply(replyDialog.reviewId, replyMessage.trim());
        showToast('Reply updated successfully! ✏️', 'success');
      }
      
      setReplyDialog({ isOpen: false, reviewId: null, mode: 'create' });
      setReplyMessage('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to post reply';
      showToast(errorMessage, 'error');
      console.error('Error handling reply:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ));
  };

  const tabs = [
    { key: 'all', label: 'All Reviews', count: tabCounts.total },
    { key: 'replied', label: 'Replied', count: tabCounts.replied },
    { key: 'pending', label: 'Pending Reply', count: tabCounts.pending },
    { key: 'recent', label: 'Recent', count: tabCounts.recent }
  ];

  return (
    <>
      <div className="bg-white min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reviews Management</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Manage and respond to guest reviews for your experiences
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/host/dashboard"
                className="inline-flex items-center px-3 py-2 sm:px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.label}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab.key
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Reviews List or Empty State */}
          {paginatedReviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {paginatedReviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      {/* Reviewer Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                          {review.reviewer.avatar_url ? (
                            <SimpleImage
                              imagePath={review.reviewer.avatar_url}
                              alt={`${review.reviewer.firstName} ${review.reviewer.lastName}`}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                              placeholderType="profile"
                              category="users/avatars"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-sm font-medium text-gray-900">
                                {review.reviewer.firstName} {review.reviewer.lastName}
                              </h3>
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>

                            <p className="text-sm text-gray-700 mb-3">
                              {review.comment}
                            </p>

                            {/* Experience Details */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                Experience: {review.experience?.title || 'N/A'}
                              </span>
                            </div>

                            {/* Host Reply */}
                            {review.hostReply ? (
                              <div className="bg-gray-50 rounded-lg p-3 mt-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-gray-700">Your Reply</span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(review.hostReply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">
                                  {review.hostReply.message}
                                </p>
                                <button
                                  onClick={() => handleReplyClick(review.id)}
                                  className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                                >
                                  Edit Reply
                                </button>
                              </div>
                            ) : (
                              <div className="mt-3">
                                <button
                                  onClick={() => handleReplyClick(review.id)}
                                  className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                                >
                                  Reply to this review
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                  {/* Desktop Pagination */}
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
                        <span className="font-medium">{totalItems}</span> reviews
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              page === currentPage
                                ? 'z-10 bg-purple-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>

                  {/* Mobile Pagination */}
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
                {activeTab === 'all' ? 'No reviews yet' : `No ${activeTab} reviews`}
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                {activeTab === 'all' 
                  ? 'When guests book and complete your experiences, their reviews will appear here.'
                  : `You don't have any ${activeTab} reviews at the moment.`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      {replyDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {replyDialog.mode === 'create' ? 'Reply to Review' : 'Edit Reply'}
              </h3>
              
              <div className="mb-4">
                <label htmlFor="reply-message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply
                </label>
                <textarea
                  id="reply-message"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Write a thoughtful response to this review..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be professional and helpful. Your reply will be visible to all guests.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleReplyCancel}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplySubmit}
                  disabled={!replyMessage.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {replyDialog.mode === 'create' ? 'Post Reply' : 'Update Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
