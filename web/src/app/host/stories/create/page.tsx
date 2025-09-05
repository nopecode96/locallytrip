'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useHostStories } from '@/hooks/useHostStories';
import { useToast } from '@/contexts/ToastContext';

export default function CreateStoryPage() {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'draft' as 'draft' | 'published',
    readingTime: 5,
    coverImage: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { createStory } = useHostStories();
  const router = useRouter();
  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'readingTime' ? parseInt(value) || 1 : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, coverImage: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for API request
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('content', formData.content);
      submitFormData.append('status', formData.status);
      submitFormData.append('readingTime', formData.readingTime.toString());
      
      if (formData.excerpt) {
        submitFormData.append('excerpt', formData.excerpt);
      }
      
      if (formData.coverImage) {
        submitFormData.append('coverImage', formData.coverImage);
      }
      
      await createStory(submitFormData);
      showToast('Story created successfully!', 'success');
      router.push('/host/stories');
    } catch (error) {
      showToast('Failed to create story', 'error');
      console.error('Error creating story:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Story</h1>
            <p className="text-gray-600 mt-1">Share your local insights and experiences with travelers.</p>
          </div>
          <Link
            href="/host/stories"
            className="text-gray-600 hover:text-gray-900 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Stories
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-6">
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter your story title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief description of your story (optional)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be shown as a preview on story listings.
              </p>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <label htmlFor="coverImage" className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                      Upload a cover image
                    </label>
                    <p className="mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    id="coverImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                placeholder="Tell your story... Share your local insights, tips, and experiences that would be valuable to travelers."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="readingTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Reading Time (minutes)
                </label>
                <input
                  type="number"
                  id="readingTime"
                  name="readingTime"
                  value={formData.readingTime}
                  onChange={handleInputChange}
                  min="1"
                  max="60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between items-center">
            <div className="text-sm text-gray-500">
              * Required fields
            </div>
            
            <div className="flex space-x-3">
              <Link
                href="/host/stories"
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Story'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
