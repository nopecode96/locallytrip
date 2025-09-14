'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface SEOMetadataProps {
  title: string;
  content: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  keywordInput: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onKeywordInputChange: (value: string) => void;
  onAddKeyword: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveKeyword: (keyword: string) => void;
  onSetKeywords?: (keywords: string[]) => void; // New direct method
}

const SEOMetadata: React.FC<SEOMetadataProps> = ({
  title,
  content,
  tags,
  metaTitle,
  metaDescription,
  keywords,
  keywordInput,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onKeywordInputChange,
  onAddKeyword,
  onRemoveKeyword,
  onSetKeywords
}) => {
  const [autoGenerate, setAutoGenerate] = useState(true);

  // Auto-generate meta title and description when title/content changes
  useEffect(() => {
    if (autoGenerate) {
      // Generate meta title from title
      if (title && !metaTitle) {
        const generatedMetaTitle = title.length > 60 
          ? title.substring(0, 57) + '...'
          : title;
        onMetaTitleChange(generatedMetaTitle);
      }

      // Generate meta description from content
      if (content && !metaDescription) {
        // Clean content: remove markdown formatting, HTML tags, and images
        let textContent = content
          // Remove image markdown syntax
          .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '')
          // Remove link markdown syntax but keep text
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
          // Remove bold and italic markdown
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          // Remove headers markdown
          .replace(/^#{1,6}\s+/gm, '')
          // Remove HTML tags
          .replace(/<[^>]*>/g, '')
          // Clean up extra whitespace and newlines
          .replace(/\n\s*\n/g, ' ')
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
          
        const generatedMetaDescription = textContent.length > 160
          ? textContent.substring(0, 157) + '...'
          : textContent;
        onMetaDescriptionChange(generatedMetaDescription);
      }
    }
  }, [title, content, autoGenerate, metaTitle, metaDescription, onMetaTitleChange, onMetaDescriptionChange]);

  // Auto-generate meta keywords from tags when tags change  
  useEffect(() => {
    if (autoGenerate && tags.length > 0) {
      // Generate keywords from tags
      const baseKeywords = [...tags];
      
      // Add contextual keywords based on tags
      const contextualKeywords: string[] = [];
      
      if (tags.some(tag => ['travel', 'trip', 'vacation', 'destination', 'tourism'].includes(tag.toLowerCase()))) {
        contextualKeywords.push('travel guide', 'vacation', 'tourism');
      }
      
      if (tags.some(tag => ['city', 'location', 'place', 'destination'].includes(tag.toLowerCase()))) {
        contextualKeywords.push('destination guide', 'things to do');
      }
      
      if (tags.some(tag => ['food', 'culture', 'adventure', 'experience'].includes(tag.toLowerCase()))) {
        contextualKeywords.push('local experience', 'travel tips');
      }
      
      // Combine and limit to 15 keywords
      const allKeywords = [...baseKeywords, ...contextualKeywords]
        .filter((keyword, index, arr) => arr.indexOf(keyword) === index)
        .slice(0, 15);
      
      // Only update if keywords are different
      const keywordsString = keywords.join(',');
      const newKeywordsString = allKeywords.join(',');
      
      if (keywordsString !== newKeywordsString) {
        if (onSetKeywords) {
          // Use direct method if available (cleaner approach)
          onSetKeywords(allKeywords);
        } else {
          // Fallback to simulation method
          // Clear existing keywords first
          keywords.forEach(keyword => onRemoveKeyword(keyword));
          
          // Add new keywords one by one with small delays
          allKeywords.forEach((keyword, index) => {
            setTimeout(() => {
              onKeywordInputChange(keyword);
              
              setTimeout(() => {
                const mockEvent = {
                  key: 'Enter',
                  preventDefault: () => {}
                } as React.KeyboardEvent<HTMLInputElement>;
                onAddKeyword(mockEvent);
                
                if (index === allKeywords.length - 1) {
                  setTimeout(() => onKeywordInputChange(''), 50);
                }
              }, 10);
            }, index * 50);
          });
        }
      }
    }
  }, [tags, autoGenerate]); // Removed keywords and functions to prevent infinite loop

  const handleAutoGenerateToggle = () => {
    setAutoGenerate(!autoGenerate);
    
    if (!autoGenerate) {
      // Re-generate when turning auto-generate back on
      if (title) {
        const generatedMetaTitle = title.length > 60 
          ? title.substring(0, 57) + '...'
          : title;
        onMetaTitleChange(generatedMetaTitle);
      }
      
      if (content) {
        // Clean content: remove markdown formatting, HTML tags, and images  
        let textContent = content
          // Remove image markdown syntax
          .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '')
          // Remove link markdown syntax but keep text
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
          // Remove bold and italic markdown
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          // Remove headers markdown
          .replace(/^#{1,6}\s+/gm, '')
          // Remove HTML tags
          .replace(/<[^>]*>/g, '')
          // Clean up extra whitespace and newlines
          .replace(/\n\s*\n/g, ' ')
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
          
        const generatedMetaDescription = textContent.length > 160
          ? textContent.substring(0, 157) + '...'
          : textContent;
        onMetaDescriptionChange(generatedMetaDescription);
      }
      
      // Re-generate keywords from tags when turning auto-generate back on
      if (tags.length > 0) {
        const baseKeywords = [...tags];
        const contextualKeywords: string[] = [];
        
        if (tags.some(tag => ['travel', 'trip', 'vacation', 'destination', 'tourism'].includes(tag.toLowerCase()))) {
          contextualKeywords.push('travel guide', 'vacation', 'tourism');
        }
        
        if (tags.some(tag => ['city', 'location', 'place', 'destination'].includes(tag.toLowerCase()))) {
          contextualKeywords.push('destination guide', 'things to do');
        }
        
        if (tags.some(tag => ['food', 'culture', 'adventure', 'experience'].includes(tag.toLowerCase()))) {
          contextualKeywords.push('local experience', 'travel tips');
        }
        
        const allKeywords = [...baseKeywords, ...contextualKeywords]
          .filter((keyword, index, arr) => arr.indexOf(keyword) === index)
          .slice(0, 15);
        
        // Clear existing keywords first
        keywords.forEach(keyword => onRemoveKeyword(keyword));
        
        // Add new keywords directly
        allKeywords.forEach(keyword => {
          onKeywordInputChange(keyword);
          const mockEvent = {
            key: 'Enter',
            preventDefault: () => {}
          } as React.KeyboardEvent<HTMLInputElement>;
          onAddKeyword(mockEvent);
        });
        
        onKeywordInputChange('');
      }
    }
  };



  return (
    <div className="space-y-6 bg-blue-50 p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">SEO Metadata</h3>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoGenerate"
            checked={autoGenerate}
            onChange={handleAutoGenerateToggle}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="autoGenerate" className="text-sm text-gray-700">
            Auto-generate
          </label>
        </div>
      </div>

      {/* Meta Title */}
      <div>
        <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
          Meta Title
          <span className="text-gray-500 font-normal ml-1">(for search engines)</span>
        </label>
        <input
          type="text"
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          placeholder="SEO optimized title for search engines..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={60}
          disabled={autoGenerate}
        />
        <div className="flex justify-between mt-1">
          <p className="text-sm text-gray-500">
            This appears in search engine results and browser tabs.
          </p>
          <span className={`text-sm ${metaTitle.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
            {metaTitle.length}/60
          </span>
        </div>
      </div>

      {/* Meta Description */}
      <div>
        <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
          Meta Description
          <span className="text-gray-500 font-normal ml-1">(for search engines)</span>
        </label>
        <textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder="Brief description that appears in search engine results..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={160}
          disabled={autoGenerate}
        />
        <div className="flex justify-between mt-1">
          <p className="text-sm text-gray-500">
            This appears as the description snippet in search results.
          </p>
          <span className={`text-sm ${metaDescription.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
            {metaDescription.length}/160
          </span>
        </div>
      </div>

      {/* Meta Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Keywords
          <span className="text-gray-500 font-normal ml-1">(for search engines)</span>
        </label>
        <div className="space-y-3">
          {/* Keyword Input */}
          <div className="relative">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => onKeywordInputChange(e.target.value)}
              onKeyDown={onAddKeyword}
              placeholder="Type meta keywords and press Enter or comma (e.g., travel guide, indonesia, vacation)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={50}
              disabled={autoGenerate}
            />
            <div className="absolute right-3 top-2 text-xs text-gray-400">
              {keywords.length}/15 keywords
            </div>
          </div>
          
          {/* Selected Keywords Display */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => onRemoveKeyword(keyword)}
                    className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
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
            Add meta keywords to improve search visibility. These are different from tags - focus on search terms people might use. Maximum 15 keywords.
          </p>
          
          {/* Common keyword suggestions */}
          <div className="text-xs text-gray-400">
            <span className="font-medium">Meta keywords examples:</span> travel guide, vacation, tourism, local experience, destination guide, things to do, travel tips
          </div>
        </div>
      </div>

      {/* SEO Preview */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Search Engine Preview</h4>
        <div className="bg-white p-4 rounded border border-gray-200">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
            {metaTitle || title || 'Your Story Title'}
          </div>
          <div className="text-green-600 text-sm mt-1">
            https://locallytrip.com/stories/{title ? title.toLowerCase().replace(/\s+/g, '-') : 'story-title'}
          </div>
          <div className="text-gray-600 text-sm mt-1 line-clamp-2">
            {metaDescription || 'Your story description will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOMetadata;
