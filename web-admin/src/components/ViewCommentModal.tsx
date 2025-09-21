'use client';

import React from 'react';
import { StoryComment } from '@/hooks/useComments';

interface ViewCommentModalProps {
  comment: StoryComment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewCommentModal({ comment, isOpen, onClose }: ViewCommentModalProps) {
  if (!isOpen || !comment) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (isApproved: boolean) => {
    return isApproved ? (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Approved
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
        Pending
      </span>
    );
  };

  const openStoryInNewTab = () => {
    const frontendUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';
    window.open(`${frontendUrl}/stories/${comment.story.slug}/`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Comment Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Comment Info */}
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Status</h3>
              {getStatusBadge(comment.isApproved)}
            </div>

            {/* Content */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Comment Content</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>

            {/* User Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Author Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{comment.user.name}</p>
                    <p className="text-sm text-gray-600">{comment.user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Story Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Story Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{comment.story.title}</p>
                    <p className="text-sm text-gray-600">Slug: {comment.story.slug}</p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={openStoryInNewTab}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Story
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reply Info */}
            {comment.parentId && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Reply Information</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    This is a reply to comment ID: {comment.parentId}
                  </p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Created At</h3>
                <p className="text-sm text-gray-600">{formatDate(comment.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Updated At</h3>
                <p className="text-sm text-gray-600">{formatDate(comment.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between">
              <button
                onClick={openStoryInNewTab}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Full Story
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}