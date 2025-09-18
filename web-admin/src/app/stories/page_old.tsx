'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminContext';
import AdminNavbar from '@/components/AdminNavbar';
import { useStories, useStoryActions, Story } from '@/hooks/useStories';

const StoriesPage = () => {
  const { user } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStories, setSelectedStories] = useState<number[]>([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedStoryForAction, setSelectedStoryForAction] = useState<Story | null>(null);
  const [actionReason, setActionReason] = useState('');

  // Custom hooks for data fetching and actions
  const { stories, pagination, stats, loading, error, refetch } = useStories({
    page: currentPage,
    limit: 12,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    search: searchTerm,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });

  const { approveStory, rejectStory, draftStory, loading: actionLoading } = useStoryActions();

  // Check if user has permission to manage stories
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

  const handleApproveStory = async (story: Story, reason?: string) => {
    try {
      await approveStory(story.id, reason);
      refetch();
      setShowApprovalModal(false);
      setSelectedStoryForAction(null);
      setActionReason('');
    } catch (err) {
      console.error('Failed to approve story:', err);
    }
  };

  const handleRejectStory = async (story: Story, reason?: string) => {
    try {
      await rejectStory(story.id, reason);
      refetch();
      setShowApprovalModal(false);
      setSelectedStoryForAction(null);
      setActionReason('');
    } catch (err) {
      console.error('Failed to reject story:', err);
    }
  };

  const handleDraftStory = async (story: Story, reason?: string) => {
    try {
      await draftStory(story.id, reason);
      refetch();
    } catch (err) {
      console.error('Failed to move story to draft:', err);
    }
  };

  const openApprovalModal = (story: Story, action: 'approve' | 'reject') => {
    setSelectedStoryForAction(story);
    setShowApprovalModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        <div className="flex-1 lg:ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stories...</p>
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
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavbar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Stories Management</h1>
              <p className="text-gray-600 mt-1">Moderate and manage travel stories</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Stories</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <span className="text-blue-600 text-xl">📖</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Draft</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <span className="text-yellow-600 text-xl">📝</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Archived</p>
                    <p className="text-2xl font-bold text-red-600">{stats.archived}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <span className="text-red-600 text-xl">🗃️</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Featured</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.featured}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <span className="text-purple-600 text-xl">⭐</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Stories
                </label>
                <input
                  type="text"
                  placeholder="Search by title, content, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Quick Actions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Actions
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={refetch}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories?.map((story) => (
              <div key={story.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Story Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{story.title}</h3>
                      <p className="text-sm text-gray-600">
                        by {story.author?.name}
                      </p>
                      {story.City && (
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {story.City.name}, {story.City.country?.name}
                        </p>
                      )}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(story.status)}`}>
                      {story.status}
                    </span>
                  </div>

                  {/* Excerpt */}
                  {story.excerpt && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{story.excerpt}</p>
                  )}

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>👀 {story.viewCount}</span>
                    <span>❤️ {story.likeCount}</span>
                    <span>💬 {story.commentCount}</span>
                    <span>⏱️ {story.readingTime || 0}min</span>
                  </div>

                  {story.isFeatured && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        ⭐ Featured
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View
                    </button>
                    
                    {story.status === 'draft' && (
                      <button 
                        onClick={() => handleApproveStory(story)}
                        disabled={actionLoading}
                        className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                      >
                        Publish
                      </button>
                    )}
                    
                    {story.status === 'published' && (
                      <button 
                        onClick={() => handleDraftStory(story)}
                        disabled={actionLoading}
                        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium disabled:opacity-50"
                      >
                        Unpublish
                      </button>
                    )}
                    
                    <button 
                      onClick={() => openApprovalModal(story, 'reject')}
                      disabled={actionLoading}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      Archive
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Created: {new Date(story.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Updated: {new Date(story.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {stories?.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📖</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No stories found</h3>
              <p className="text-gray-500">No stories match your search criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedStoryForAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Action
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to archive "{selectedStoryForAction.title}"?
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Provide a reason for this action..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedStoryForAction(null);
                  setActionReason('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectStory(selectedStoryForAction, actionReason)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesPage;

  // Check if user has permission to manage stories
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

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || story.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (storyId: number, newStatus: string) => {
    setStories(stories.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            status: newStatus,
            publishDate: newStatus === 'published' ? new Date().toISOString().split('T')[0] : null
          }
        : story
    ));
  };

  const handleFeatureToggle = (storyId: number) => {
    setStories(stories.map(story => 
      story.id === storyId 
        ? { ...story, featured: !story.featured }
        : story
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavbar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Stories Management</h1>
              <p className="text-gray-600 mt-1">Moderate and manage travel stories</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Bulk Approve
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Create Story
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Stories</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stories.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xl">📖</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stories.filter(s => s.status === 'published').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xl">✅</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stories.filter(s => s.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center">
                  <span className="text-white text-xl">⏳</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stories.filter(s => s.featured).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                  <span className="text-white text-xl">⭐</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Stories</label>
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="pending">Pending Review</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div key={story.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Story Image */}
                <div className="h-48 bg-gray-200 relative">
                  {story.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      ⭐ Featured
                    </div>
                  )}
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-4xl">📖</span>
                  </div>
                </div>

                {/* Story Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{story.title}</h3>
                    <p className="text-sm text-gray-600">by {story.author}</p>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      story.status === 'published' ? 'bg-green-100 text-green-800' :
                      story.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {story.status}
                    </span>
                  </div>

                  {/* Stats */}
                  {story.status === 'published' && (
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>👀 {story.views}</span>
                      <span>❤️ {story.likes}</span>
                      <span>💬 {story.comments}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                      Edit
                    </button>
                    
                    {story.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(story.id, 'published')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Approve
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Reject
                        </button>
                      </>
                    )}
                    
                    {story.status === 'published' && (
                      <button 
                        onClick={() => handleFeatureToggle(story.id)}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        {story.featured ? 'Unfeature' : 'Feature'}
                      </button>
                    )}
                  </div>

                  {story.publishDate && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Published: {new Date(story.publishDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {filteredStories.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📖</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No stories found</h3>
              <p className="text-gray-500">No stories match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoriesPage;
