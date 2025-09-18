'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import RichTextEditor from '@/components/RichTextEditor';
import SEOMetadata from '@/components/SEOMetadata';
import SearchableLocationSelect from '@/components/SearchableLocationSelect';
import { useHostStories } from '@/hooks/useHostStories';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateStoryPage() {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft' as 'draft' | 'pending_review' | 'published',
    readingTime: 5,
    coverImage: null as File | null,
    tags: [] as string[],
    keywords: [] as string[],
    cityId: '' as string
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const { createStory } = useHostStories();
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'readingTime' ? parseInt(value) || 1 : value
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleMetaTitleChange = (metaTitle: string) => {
    setFormData(prev => ({ ...prev, metaTitle }));
  };

  const handleMetaDescriptionChange = (metaDescription: string) => {
    setFormData(prev => ({ ...prev, metaDescription }));
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

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const keyword = keywordInput.trim().toLowerCase();
      if (keyword && !formData.keywords.includes(keyword) && formData.keywords.length < 15) {
        setFormData(prev => ({
          ...prev,
          keywords: [...prev.keywords, keyword]
        }));
        setKeywordInput('');
      }
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const handleSetKeywords = (keywords: string[]) => {
    setFormData(prev => ({
      ...prev,
      keywords: keywords
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || formData.tags.length === 0) {
      showToast('Please fill in all required fields including at least one tag', 'error');
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
      
      if (formData.metaTitle) {
        submitFormData.append('metaTitle', formData.metaTitle);
      }
      
      if (formData.metaDescription) {
        submitFormData.append('metaDescription', formData.metaDescription);
      }
      
      if (formData.coverImage) {
        submitFormData.append('coverImage', formData.coverImage);
      }
      
      if (formData.tags.length > 0) {
        submitFormData.append('tags', JSON.stringify(formData.tags));
      }
      
      if (formData.keywords.length > 0) {
        submitFormData.append('keywords', JSON.stringify(formData.keywords));
      }
      
      if (formData.cityId) {
        submitFormData.append('cityId', formData.cityId);
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
    <>
      <Head>
        <title>Create New Story - LocallyTrip Host Dashboard</title>
        <meta name="description" content="Share your local insights and experiences with travelers. Create engaging stories to attract more bookings." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Story</h1>
              <p className="text-gray-600 mt-2">Share your local insights and experiences with travelers to build trust and attract bookings.</p>
            </div>
            <Link
              href="/host/stories"
              className="text-gray-600 hover:text-gray-900 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Stories
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6 space-y-6">
                
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter an engaging title for your story..."
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Make it catchy and descriptive to attract readers.
                  </p>
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                    Story Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Write a compelling preview of your story (optional but recommended)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be shown as a preview on story listings to entice readers.
                  </p>
                </div>

                {/* Location/City - Modern Searchable Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Story Location
                  </label>
                  <SearchableLocationSelect
                    value={formData.cityId}
                    onChange={(cityId, city) => {
                      setFormData(prev => ({ ...prev, cityId }));
                    }}
                    placeholder="Search for a location... 🌍"
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Choose the main location your story is about. This helps travelers find relevant content and makes your story discoverable. ✨
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
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                      </svg>
                      <div className="text-sm text-gray-600">
                        <label htmlFor="coverImage" className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                          Upload a cover image
                        </label>
                        <p className="mt-2">PNG, JPG, GIF up to 10MB</p>
                        <p className="text-xs text-gray-500 mt-1">Recommended: 1200x630px for best social media sharing</p>
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

                {/* Content with Rich Text Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Content *
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Tell your story... Share your local insights, hidden gems, cultural tips, and personal experiences that would be valuable to travelers."
                    height="500px"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Use formatting, add images, and make your story engaging. Rich content performs better!
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags *
                  </label>
                  <div className="space-y-3">
                    {/* Tag Input */}
                    <div className="relative">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Type a tag and press Enter or comma to add (e.g., travel, culture, food)"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          formData.tags.length === 0 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        maxLength={30}
                      />
                      <div className="absolute right-3 top-2 text-xs text-gray-400">
                        {formData.tags.length}/10 tags
                      </div>
                    </div>
                    
                    {/* Selected Tags Display */}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      <span className="text-red-500 font-medium">Required:</span> Add relevant tags to help travelers find your story. Use topics like destinations, activities, culture, or travel tips. Maximum 10 tags. Press Enter or comma to add each tag.
                    </p>
                    
                    {/* Common tag suggestions */}
                    <div className="text-xs text-gray-400">
                      <span className="font-medium">Popular tags:</span> travel, culture, food, adventure, hidden-gems, local-tips, backpacking, luxury, budget, solo-travel, family-travel, photography
                    </div>
                  </div>
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
                    <p className="text-sm text-gray-500 mt-1">
                      Estimated time to read your story.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Publication Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Save as Draft</option>
                      <option value="published">
                        {user?.isTrusted ? 'Publish Now' : 'Submit for Review'}
                      </option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      {user?.isTrusted 
                        ? 'As a trusted user, your story will be published immediately.' 
                        : 'Your story will be reviewed by our team before being published.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Metadata Section */}
            <SEOMetadata
              title={formData.title}
              content={formData.content}
              tags={formData.tags}
              metaTitle={formData.metaTitle}
              metaDescription={formData.metaDescription}
              keywords={formData.keywords}
              keywordInput={keywordInput}
              onMetaTitleChange={handleMetaTitleChange}
              onMetaDescriptionChange={handleMetaDescriptionChange}
              onKeywordInputChange={setKeywordInput}
              onAddKeyword={handleAddKeyword}
              onRemoveKeyword={removeKeyword}
              onSetKeywords={handleSetKeywords}
            />

            {/* Form Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  * Required fields. All changes are saved automatically as draft.
                </div>
                
                <div className="flex space-x-3">
                  <Link
                    href="/host/stories"
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {formData.status === 'published' ? 'Publishing...' : 'Saving...'}
                      </span>
                    ) : (
                      formData.status === 'published' ? 'Publish Story' : 'Save as Draft'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      
    </>
  );
}
