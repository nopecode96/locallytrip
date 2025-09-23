'use client';

import { useState, useEffect } from 'react';

interface FeaturedItem {
  id: number;
  title: string;
  description?: string;
  badge?: string;
  displayOrder: number;
  isActive: boolean;
  type: string;
  itemId: string | number;
  imageUrl?: string;
  reviewerName?: string;
}

interface FeaturedContentData {
  experiences: FeaturedItem[];
  cities: FeaturedItem[];
  stories: FeaturedItem[];
  hosts: FeaturedItem[];
  testimonials: FeaturedItem[];
}

const FeaturedContentManager = () => {
  const [contentData, setContentData] = useState<FeaturedContentData>({
    experiences: [],
    cities: [],
    stories: [],
    hosts: [],
    testimonials: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch featured content from API
  const fetchFeaturedContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/admin/featured-content');
      const result = await response.json();
      
      if (result.success) {
        setContentData(result.data);
      } else {
        setError(result.message || 'Failed to fetch featured content');
      }
    } catch (error) {
      setError('Error fetching featured content: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  // Remove item from featured list
  const removeFromFeatured = async (type: string, id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/featured-content/${type}/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh data
        fetchFeaturedContent();
      } else {
        setError(result.message || 'Failed to remove item');
      }
    } catch (error) {
      setError('Error removing item: ' + (error as Error).message);
    }
  };

  // Update display order
  const updateDisplayOrder = async (type: string, items: Array<{id: number; displayOrder: number}>) => {
    try {
      const response = await fetch('http://localhost:3001/admin/featured-content/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, items })
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchFeaturedContent();
      } else {
        setError(result.message || 'Failed to update order');
      }
    } catch (error) {
      setError('Error updating order: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Featured Content Management</h1>
        <button 
          onClick={fetchFeaturedContent}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Featured Experiences */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">⭐ Featured Experiences</h2>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {contentData.experiences.length} items
          </span>
        </div>
        <div className="grid gap-4">
          {contentData.experiences.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
              <div className="flex items-center space-x-4">
                <img 
                  src={`http://localhost:3001/images/${item.imageUrl || 'placeholder.jpg'}`}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'http://localhost:3001/images/placeholder.jpg';
                  }}
                />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm">{item.description.substring(0, 100)}...</p>
                  )}
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {item.badge}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Order: {item.displayOrder}</span>
                <button
                  onClick={() => removeFromFeatured('experience', item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {contentData.experiences.length === 0 && (
            <p className="text-gray-500 text-center py-8">No featured experiences found</p>
          )}
        </div>
      </section>

      {/* Featured Cities */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">🏙️ Favorite Cities</h2>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
            {contentData.cities.length} items
          </span>
        </div>
        <div className="grid gap-4">
          {contentData.cities.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
              <div className="flex items-center space-x-4">
                <img 
                  src={`http://localhost:3001/images/${item.imageUrl || 'placeholder.jpg'}`}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'http://localhost:3001/images/placeholder.jpg';
                  }}
                />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm">{item.description.substring(0, 100)}...</p>
                  )}
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {item.badge}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Order: {item.displayOrder}</span>
                <button
                  onClick={() => removeFromFeatured('city', item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {contentData.cities.length === 0 && (
            <p className="text-gray-500 text-center py-8">No featured cities found</p>
          )}
        </div>
      </section>

      {/* Featured Hosts */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">✨ Expert Hosts</h2>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
            {contentData.hosts.length} items
          </span>
        </div>
        <div className="grid gap-4">
          {contentData.hosts.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
              <div className="flex items-center space-x-4">
                <img 
                  src={`http://localhost:3001/images/${item.imageUrl || 'placeholder.jpg'}`}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'http://localhost:3001/images/placeholder.jpg';
                  }}
                />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm">{item.description.substring(0, 100)}...</p>
                  )}
                  <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                    {item.badge}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Order: {item.displayOrder}</span>
                <button
                  onClick={() => removeFromFeatured('host', item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {contentData.hosts.length === 0 && (
            <p className="text-gray-500 text-center py-8">No featured hosts found</p>
          )}
        </div>
      </section>

      {/* Featured Stories */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">📖 Travel Stories</h2>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
            {contentData.stories.length} items
          </span>
        </div>
        <div className="grid gap-4">
          {contentData.stories.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
              <div className="flex items-center space-x-4">
                <img 
                  src={`http://localhost:3001/images/${item.imageUrl || 'placeholder.jpg'}`}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'http://localhost:3001/images/placeholder.jpg';
                  }}
                />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm">{item.description.substring(0, 100)}...</p>
                  )}
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                    {item.badge}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Order: {item.displayOrder}</span>
                <button
                  onClick={() => removeFromFeatured('story', item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {contentData.stories.length === 0 && (
            <p className="text-gray-500 text-center py-8">No featured stories found</p>
          )}
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">💬 Testimonials</h2>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
            {contentData.testimonials.length} items
          </span>
        </div>
        <div className="grid gap-4">
          {contentData.testimonials.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-xl">💬</span>
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm">{item.description.substring(0, 100)}...</p>
                  )}
                  {item.reviewerName && (
                    <p className="text-gray-500 text-xs">By: {item.reviewerName}</p>
                  )}
                  <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                    {item.badge}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Order: {item.displayOrder}</span>
                <button
                  onClick={() => removeFromFeatured('testimonial', item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {contentData.testimonials.length === 0 && (
            <p className="text-gray-500 text-center py-8">No featured testimonials found</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default FeaturedContentManager;