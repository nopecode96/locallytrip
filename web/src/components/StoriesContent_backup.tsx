'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageService } from '@/services/imageService';
import SimpleImage from '@/components/SimpleImage';
import { useStoriesWithPagination, UseStoriesWithPaginationOptions } from '@/hooks/useStoriesWithPagination';
import { useStoriesURL } from '@/hooks/useStoriesURL';
import StoriesFilters from './StoriesFilters';
import type { StoriesFilters as FiltersType } from './StoriesFilters';
import { Eye, Heart, Clock, MessageCircle, Loader2 } from 'lucide-react';

const StoriesContent: React.FC = () => {
  const router = useRouter();
  const { currentParams, updateURL } = useStoriesURL();
  const [appliedFilters, setAppliedFilters] = useState<FiltersType>({
    search: '',
    category: '',
    featured: false
  });

  // Initialize filters from URL - use useEffect with proper dependencies
  useEffect(() => {
    const newFilters = {
      search: currentParams.search || '',
      category: currentParams.category || '',
      featured: currentParams.featured === 'true'
    };
    
    // Only update if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(appliedFilters)) {
      setAppliedFilters(newFilters);
    }
  }, [currentParams.search, currentParams.category, currentParams.featured, appliedFilters]); // Include appliedFilters in deps

  // Handle filter changes
  const handleFilterChange = (newFilters: FiltersType) => {
    setAppliedFilters(newFilters);
    
    // Update URL - convert boolean to string for URL
    updateURL({
      search: newFilters.search,
      category: newFilters.category,
      featured: newFilters.featured ? 'true' : undefined
    });
  };

  // Create options for useStoriesWithPagination hook
  const storiesOptions: UseStoriesWithPaginationOptions = {
    search: appliedFilters.search,
    category: appliedFilters.category || undefined,
    featured: appliedFilters.featured || undefined,
    limit: 12
  };

  const { stories, loading, error, hasMore, loadMore, totalStories } = useStoriesWithPagination(storiesOptions);

  // Debug logging for stories received
  console.log('📋 StoriesContent RECEIVED STORIES:', stories?.map(story => ({
    title: story.title,
    authorName: story.author?.name,
    authorLocation: story.author?.location,
    id: story.id
  })));

  // Handle story click navigation using slug
  const handleStoryClick = (story: any) => {
    // Generate slug from story title or use existing slug
    const slug = story.slug || story.title
      ?.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '') 
      || `story-${story.id}`;
    
    router.push(`/stories/${slug}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <StoriesFilters 
          initialFilters={appliedFilters} 
          onFiltersChange={handleFilterChange} 
        />
        
        {/* GenZ Loading with fun skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="group">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-1 animate-pulse">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <div className="story-card-landscape bg-gradient-to-br from-gray-200 to-gray-300 relative">
                    <div className="absolute inset-4 bg-gray-300/50 rounded-2xl"></div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded-full w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-8 space-y-8">
        <StoriesFilters 
          initialFilters={appliedFilters} 
          onFiltersChange={handleFilterChange} 
        />
        
        {/* GenZ Error State */}
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😵‍💫</div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Our stories are taking a little break. Let's try again! 🔄
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ✨ Retry Magic ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8 space-y-8">
      {/* Filters with GenZ styling */}
      <StoriesFilters 
        initialFilters={appliedFilters} 
        onFiltersChange={handleFilterChange} 
      />

      {/* Results count with emoji vibes */}
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">📚</span>
          <p className="font-medium text-gray-700">
            {stories.length > 0 
              ? `${stories.length}${totalStories > stories.length ? ` of ${totalStories}` : ''} epic ${stories.length === 1 ? 'story' : 'stories'} found!`
              : 'No stories found yet 😢'
            }
            {appliedFilters.search && ` for "${appliedFilters.search}"`}
            {appliedFilters.category && ` in ${appliedFilters.category}`}
            {appliedFilters.featured && ' ⭐'}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
          <span>Sort by</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">Latest ✨</span>
        </div>
      </div>

      {/* Stories grid - Landscape cards */}
      {stories.length > 0 ? (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <div 
              key={story.id} 
              className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-300 hover:-translate-y-1"
              onClick={() => handleStoryClick(story)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border wrapper */}
              <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-3xl p-1 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                <div className="bg-white rounded-3xl overflow-hidden h-full flex flex-col">
                  {/* Image with overlay - Landscape format */}
                  <div className="relative aspect-[16/7] overflow-hidden">
                    <SimpleImage
                      imagePath={story.imageUrl || story.image || 'default.jpg'}
                      alt={story.title}
                      className="story-cover-image w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      category="stories"
                      placeholderType="story"
                      name={story.title}
                    />
                    
                    {/* Category badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        {story.category || 'Travel'} ✨
                      </span>
                    </div>
                    
                    {/* Featured badge */}
                    {story.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                          🔥 HOT
                        </span>
                      </div>
                    )}
                    
                    {/* Gradient overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-20"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 text-xs line-clamp-3 mb-4 leading-relaxed">
                      {story.excerpt}
                    </p>
                    
                    {/* Author and stats */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <SimpleImage
                          imagePath={story.author?.avatar || story.authorImage || 'default-avatar.jpg'}
                          alt={story.author?.name || story.authorName || 'Author'}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-100"
                          category="users/avatars"
                          placeholderType="profile"
                          name={story.author?.name || story.authorName}
                        />
                        <div>
                          <p className="font-semibold text-xs text-gray-900">
                            {story.author?.name || story.authorName}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span>�</span>
                            {new Date(story.publishedAt || story.createdAt || new Date()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Engagement stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-pink-500">
                          <Heart className="w-4 h-4" fill={(story.likeCount || 0) > 0 ? 'currentColor' : 'none'} />
                          <span className="text-xs font-medium">{story.likeCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-purple-500">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">{story.commentCount || 0}</span>
                        </div>
                      </div>
                      
                      {/* Read time or date */}
                      <div className="text-xs text-gray-400">
                        {story.readingTime ? `${story.readingTime} min read` : 'Quick read'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center pt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading more stories...
                </>
              ) : (
                <>
                  <span className="text-xl">✨</span>
                  Load More Epic Stories
                  <span className="text-xl">🚀</span>
                </>
              )}
            </button>
          </div>
        )}
        </>
      ) : (
        {/* Empty state dengan GenZ vibes */}
        <div className="text-center py-16">
          <div className="text-8xl mb-4">📖</div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            No Stories Yet! 
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Be the first to share your amazing travel adventure! ✨
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
            🚀 Start Your Story
          </button>
        </div>
      )}
      
      {/* Floating action button for creating stories - Enhanced */}
      <div className="fixed bottom-8 right-8 z-40 group">
        <button className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full shadow-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 flex items-center justify-center hover:shadow-purple-500/25">
          <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">✍️</span>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xs">✨</span>
          </div>
        </button>
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            Share your story! 📖
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesContent;
