'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '../../../../../components/DashboardLayout';
import { useAuth } from '../../../../../contexts/AuthContext';

interface StoryFormData {
  title: string;
  content: string;
  status: 'draft' | 'published';
  tags: string[];
}

const EditStoryPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    content: '',
    status: 'draft',
    tags: []
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const storyId = params.id as string;

  useEffect(() => {
    if (storyId) {
      fetchStoryData();
    }
  }, [storyId]);

  const fetchStoryData = async () => {
    try {
      setInitialLoading(true);
      setError(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      if (!token) {
        setError('Authentication required');
        setInitialLoading(false);
        return;
      }

      const response = await fetch(`/api/stories/${storyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch story data');
      }

      const data = await response.json();
      
      if (data.success) {
        const story = data.data;
        setFormData({
          title: story.title || '',
          content: story.content || '',
          status: story.status || 'draft',
          tags: story.tags || []
        });
        
        if (story.coverImage) {
          setCurrentImageUrl(`/images/stories/${story.coverImage}`);
        }
      } else {
        throw new Error(data.message || 'Failed to fetch story');
      }
    } catch (err) {
      console.error('Error fetching story:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setCurrentImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      // Create FormData for multipart upload
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('content', formData.content);
      submitFormData.append('status', formData.status);
      
      // Add tags as JSON string
      if (formData.tags.length > 0) {
        submitFormData.append('tags', JSON.stringify(formData.tags));
      }

      // Add image if selected
      if (selectedImage) {
        submitFormData.append('coverImage', selectedImage);
      }

      // Update the story
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitFormData
      });

      const data = await response.json();

      if (data.success) {
        router.push('/host/stories');
      } else {
        throw new Error(data.message || 'Failed to update story');
      }
    } catch (err) {
      console.error('Error updating story:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <DashboardLayout allowedRoles={['host']}>
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 min-h-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['host']}>
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 min-h-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Story</h1>
                <p className="mt-2 text-gray-600">Update your hosting experience story</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a compelling title for your story..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {(imagePreview || currentImageUrl) ? (
                      <div className="relative">
                        <img
                          src={imagePreview || currentImageUrl || ''}
                          alt="Preview"
                          className="mx-auto h-32 w-auto rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                            <span>Upload a file</span>
                            <input
                              ref={fileInputRef}
                              id="image"
                              name="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageSelect}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Story Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  placeholder="Share your hosting experience, tips, memorable moments, or insights that could help other hosts or inspire travelers..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Tell your story in detail. Share experiences, tips, and insights that could be valuable to the community.
                </p>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2">
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-purple-600 hover:text-purple-800"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type a tag and press Enter (e.g., hosting-tips, cultural-exchange, food)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500">
                    Add relevant tags to help others discover your story. Press Enter or comma to add a tag.
                  </p>
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish Now</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  {formData.status === 'draft' 
                    ? 'Your story will be saved but not visible to others yet.'
                    : 'Your story will be published and visible to the community immediately.'
                  }
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Story'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditStoryPage;
