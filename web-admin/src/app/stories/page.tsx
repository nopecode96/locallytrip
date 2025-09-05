'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminContext';
import AdminNavbar from '@/components/AdminNavbar';

// Sample data for demonstration
const sampleStories = [
  {
    id: 1,
    title: 'Hidden Gems of Bali',
    author: 'Maria Garcia',
    status: 'published',
    publishDate: '2024-01-15',
    views: 1250,
    likes: 89,
    comments: 23,
    featured: true,
    image: '/images/stories/bali-story.jpg'
  },
  {
    id: 2,
    title: 'Street Food Adventure in Bangkok',
    author: 'John Smith',
    status: 'pending',
    publishDate: null,
    views: 0,
    likes: 0,
    comments: 0,
    featured: false,
    image: '/images/stories/bangkok-story.jpg'
  },
  {
    id: 3,
    title: 'Mountain Hiking in Nepal',
    author: 'David Wilson',
    status: 'draft',
    publishDate: null,
    views: 0,
    likes: 0,
    comments: 0,
    featured: false,
    image: '/images/stories/nepal-story.jpg'
  }
];

const StoriesPage = () => {
  const { user } = useAdminAuth();
  const [stories, setStories] = useState(sampleStories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

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
