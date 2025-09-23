'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { useHostStories } from '@/hooks/useHostStories';
import { useToast } from '@/contexts/ToastContext';
import SimpleImage from '@/components/SimpleImage';
import ConfirmDialog from '@/components/ConfirmDialog';
import ErrorDialog from '@/components/ErrorDialog';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface DeleteDialogState {
  isOpen: boolean;
  storyId: number | null;
  storyTitle: string;
}

interface ErrorDialogState {
  isOpen: boolean;
  message: string;
}

export default function HostStoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const { stories, loading, error, deleteStory } = useHostStories();
  const [activeTab, setActiveTab] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    storyId: null,
    storyTitle: ''
  });
  const [errorDialog, setErrorDialog] = useState<ErrorDialogState>({
    isOpen: false,
    message: ''
  });
  const { showToast } = useToast();

  // Calculate stats from stories
  const stats = useMemo(() => {
    const total = stories.length;
    const published = stories.filter(story => story.status === 'published').length;
    const pending = stories.filter(story => story.status === 'pending_review').length;
    const draft = stories.filter(story => story.status === 'draft').length;
    const archived = stories.filter(story => story.status === 'archived').length;
    const scheduled = stories.filter(story => story.status === 'scheduled').length;
    
    return { total, published, pending, draft, archived, scheduled };
  }, [stories]);

  // Filter stories based on active tab
  const filteredStories = useMemo(() => {
    if (activeTab === 'all') return stories;
    return stories.filter(story => story.status === activeTab);
  }, [stories, activeTab]);

  // Get hostId from user context
  const hostId = user?.id || user?.uuid;

  const handleDeleteClick = (storyId: number, storyTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      storyId,
      storyTitle
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.storyId) return;

    try {
      setDeleteLoading(deleteDialog.storyId);
      await deleteStory(deleteDialog.storyId);
      showToast('Story deleted successfully! ✨', 'success');
      setDeleteDialog({ isOpen: false, storyId: null, storyTitle: '' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete story';
      
      // Close delete dialog first
      setDeleteDialog({ isOpen: false, storyId: null, storyTitle: '' });
      
      // Show detailed error in modal
      setErrorDialog({
        isOpen: true,
        message: errorMessage
      });
      
      console.error('Error deleting story:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, storyId: null, storyTitle: '' });
  };

  const handleErrorClose = () => {
    setErrorDialog({ isOpen: false, message: '' });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'published': { 
        bg: 'bg-green-100 text-green-800', 
        icon: '✅',
        label: 'Published'
      },
      'pending_review': { 
        bg: 'bg-orange-100 text-orange-800', 
        icon: '👀',
        label: 'Under Review'
      },
      'draft': { 
        bg: 'bg-yellow-100 text-yellow-800', 
        icon: '📝',
        label: 'Draft'
      },
      'archived': { 
        bg: 'bg-gray-100 text-gray-800', 
        icon: '📦',
        label: 'Archived'
      },
      'scheduled': { 
        bg: 'bg-blue-100 text-blue-800', 
        icon: '⏰',
        label: 'Scheduled'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  // Helper function to format date
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Show loading while auth is loading OR data is being fetched
  if (authLoading || loading) {
    return (
      <div className="bg-white min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            <p className="ml-4 text-gray-600">Loading stories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading stories
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Refresh page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging - simplified
  if (user) {
    console.log('✅ User authenticated:', user.name, 'ID:', user.id);
  } else {
    console.log('❌ No user found');
  }
  
  return (
    <>
      <div className="bg-white min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Stories</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage and track all your published stories</p>
            </div>
            <Link 
              href="/host/stories/create"
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center sm:w-auto"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Create New Story</span>
              <span className="sm:hidden">Create New</span>
            </Link>
          </div>

          {/* Workflow Information Banner */}
          <div className="mb-6 sm:mb-8 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <span className="text-xl sm:text-2xl">📚</span>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-800 mb-1">Story Publishing Workflow</h3>
                <p className="text-xs sm:text-sm text-blue-700 mb-2">
                  New stories start as <strong>Draft</strong>. Once complete, submit for review. Our admin team will review within 1-3 business days and either publish or provide feedback for improvement.
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-2 text-xs">
                  <span className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    📝 Draft → ⏳ Under Review → ✅ Published
                  </span>
                  <span className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    ❌ If rejected, revise and resubmit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.total || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Stories</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{stats?.published || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Published</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Under Review</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-xl sm:text-2xl font-bold text-gray-600">{stats?.draft || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Drafts</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6 sm:mb-8">
            <nav className="-mb-px flex flex-wrap sm:space-x-8 space-x-2 sm:space-x-8">
              {[
                { key: 'all', label: 'All Stories', count: stats?.total || 0 },
                { key: 'published', label: 'Published', count: stats?.published || 0 },
                { key: 'pending_review', label: 'Pending Approval', count: stats?.pending || 0 },
                { key: 'draft', label: 'Draft', count: stats?.draft || 0 }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
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

          {/* Stories List or Empty State */}
          {filteredStories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {filteredStories.map((story) => (
                  <div key={story.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:h-64 md:h-72 lg:h-64">
                      {/* Story Cover Image */}
                      <div className="w-full sm:w-48 md:w-56 lg:w-48 h-56 sm:h-full flex-shrink-0">
                        <SimpleImage
                          imagePath={story.image || story.coverImage || '/images/placeholders/story-placeholder.jpg'}
                          alt={story.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover object-center rounded-t-lg sm:rounded-t-none sm:rounded-l-lg display-block"
                          placeholderType="story"
                          category="stories"
                        />
                      </div>
                      
                      {/* Story Details */}
                      <div className="flex-1 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                <Link 
                                  href={`/host/stories/edit/${story.uuid || story.id}`}
                                  className="hover:text-purple-600"
                                >
                                  {story.title}
                                </Link>
                              </h3>
                              {getStatusBadge(story.status)}
                            </div>
                            
                            {/* Updated Date and Reading Time */}
                            <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
                              <span className="flex items-center text-gray-500">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Updated {formatDate(story.updatedAt)}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {story.excerpt}
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:flex lg:items-center lg:space-x-4 gap-2 lg:gap-0 text-sm text-gray-500 mb-3 sm:mb-0">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {story.readingTime} min read
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {story.viewCount} views
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Created {formatDate(story.createdAt)}
                              </span>
                            </div>

                            {/* Show admin reason if exists and status is not published */}
                            {story.adminReason && story.status !== 'published' && (
                              <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-3">
                                <div className="flex items-start space-x-2">
                                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  <div>
                                    <p className="text-xs font-medium text-blue-700">Admin Feedback:</p>
                                    <p className="text-xs text-blue-600">{story.adminReason}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="sm:text-right sm:ml-6 mt-4 sm:mt-0">
                            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-2">
                              <Link
                                href={`/host/stories/edit/${story.uuid || story.id}`}
                                className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                Edit
                              </Link>
                              
                              {/* Comments button */}
                              <Link
                                href="/host/comments"
                                className="inline-flex justify-center items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Comments
                              </Link>
                              
                              {story.status === 'published' && story.slug && (
                                <Link
                                  href={`/stories/${story.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                  Preview
                                </Link>
                              )}
                              
                              {/* Delete button - only show for draft and pending_review status */}
                              {(story.status === 'draft' || story.status === 'pending_review') && (
                                <button
                                  onClick={() => handleDeleteClick(story.id, story.title)}
                                  disabled={deleteLoading === story.id}
                                  className="col-span-2 sm:col-span-1 inline-flex justify-center items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                  {deleteLoading === story.id ? (
                                    <>
                                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      <span>Deleting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      <span>Delete</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
                {activeTab === 'all' ? 'No stories yet' : `No ${activeTab.replace('_', ' ')} stories`}
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                {activeTab === 'all' 
                  ? 'Get started by creating your first story to share your experiences and local insights with travelers.'
                  : `You don't have any ${activeTab.replace('_', ' ')} stories at the moment.`
                }
              </p>
              {activeTab === 'all' && (
                <div className="mt-6">
                  <Link
                    href="/host/stories/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="hidden sm:inline">Create Your First Story</span>
                    <span className="sm:hidden">Create Story</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Story"
        message={`Are you sure you want to delete "${deleteDialog.storyTitle}"? This action cannot be undone.`}
        confirmText="Delete Story"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
        loading={deleteLoading === deleteDialog.storyId}
      />

      {/* Error Dialog */}
      <ErrorDialog
        isOpen={errorDialog.isOpen}
        title="Delete Failed"
        message={errorDialog.message}
        onClose={handleErrorClose}
      />
    </>
  );
}