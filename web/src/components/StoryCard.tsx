'use client';

import React from 'react';
import Link from 'next/link';
import SimpleImage from './SimpleImage';
import { Story, safeStoryTitle, safeStoryExcerpt, safeAuthorName } from '../types/story';

interface StoryCardProps {
  story: Story;
  className?: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, className = '' }) => {
  // Use safe extractors to prevent object rendering
  const title = safeStoryTitle(story);
  const excerpt = safeStoryExcerpt(story);
  const authorName = safeAuthorName(story);
  
  // Safe property access with fallbacks using new Story interface fields
  const imageUrl = story?.image || '/images/stories/placeholder-story.jpg';
  const authorAvatar = story?.authorImage || '/images/users/placeholder-avatar.jpg';
  const publishedAt = story?.publishedAt || new Date().toISOString();
  const category = story?.category || 'Travel';
  const location = story?.location || 'Unknown Location';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/stories/${story?.id || '#'}`} className={`block group h-full ${className}`}>
      <article className="bg-white rounded-3xl border-2 border-pink-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <SimpleImage
            imagePath={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            category="stories"
            placeholderType="story"
          />
          <div className="absolute top-3 left-3 bg-purple-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg">
            📖 {category}
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
            {excerpt}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 flex-shrink-0">
              <SimpleImage
                imagePath={authorAvatar}
                alt="Author"
                className="w-6 h-6 rounded-full object-cover border border-purple-200"
                category="users/avatars"
                placeholderType="profile"
                name={authorName}
              />
            </div>
            <span className="text-sm text-gray-700 font-medium hover:text-purple-600 transition-colors leading-tight">
              by {authorName}
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-auto text-xs text-gray-500">
            <span>{formatDate(publishedAt)}</span>
            <span>📍 {category}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default StoryCard;
