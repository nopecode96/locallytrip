'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageService } from '@/services/imageService';
import SimpleImage from '@/components/SimpleImage';
import { useStoriesWithPagination, UseStoriesWithPaginationOptions } from '@/hooks/useStoriesWithPagination';
import { useStoriesURL } from '@/hooks/useStoriesURL';
import { useAuth } from '@/contexts/AuthContext';
import StoriesFilters from './StoriesFilters';
import type { StoriesFilters as FiltersType } from './StoriesFilters';
import { Eye, Heart, Clock, MessageCircle, Loader2, X } from 'lucide-react';

const StoriesContent: React.FC = () => {
  const router = useRouter();
  const { currentParams, updateURL } = useStoriesURL();
  const { isAuthenticated } = useAuth();
  const [appliedFilters, setAppliedFilters] = useState<FiltersType>({
    search: '',
    cityId: '',
    featured: false
  });
  
  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showAuthModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAuthModal]);

  // Initialize filters from URL - use useEffect with proper dependencies
  useEffect(() => {
    const newFilters = {
      search: currentParams.search || '',
      cityId: currentParams.cityId || '',
      featured: currentParams.featured === 'true'
    };
    
    // Only update if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(appliedFilters)) {
      setAppliedFilters(newFilters);
    }
  }, [currentParams.search, currentParams.cityId, currentParams.featured, appliedFilters]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FiltersType) => {
    setAppliedFilters(newFilters);
    
    // Update URL - convert boolean to string for URL
    updateURL({
      search: newFilters.search,
      cityId: newFilters.cityId,
      featured: newFilters.featured ? 'true' : undefined
    });
  };

  // Create options for useStoriesWithPagination hook
  const storiesOptions: UseStoriesWithPaginationOptions = {
    search: appliedFilters.search,
    cityId: appliedFilters.cityId || undefined,
    featured: appliedFilters.featured || undefined,
    limit: 12
  };

  const { stories, loading, error, hasMore, loadMore, totalStories } = useStoriesWithPagination(storiesOptions);

  // Handle story click navigation using slug
  const handleStoryClick = (story: any, event?: React.MouseEvent) => {
    console.log('Story clicked:', story.title); // Debug log
    
    // Prevent double navigation and ensure clean navigation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Generate slug from story title or use existing slug
    const slug = story.slug || story.title
      ?.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '') 
      || `story-${story.id}`;
    
    console.log('Navigating to:', `/stories/${slug}`); // Debug log
    
    try {
      // Use router.push for client-side navigation
      router.push(`/stories/${slug}`);
    } catch (error) {
      // Fallback to window.location if router fails
      console.warn('Router navigation failed, using window.location:', error);
      window.location.href = `/stories/${slug}`;
    }
  };

  // Handle create story button click
  const handleCreateStoryClick = () => {
    if (isAuthenticated) {
      // User is logged in, redirect to create story page
      router.push('/host/stories/create');
    } else {
      // User is not logged in, show auth modal
      setShowAuthModal(true);
    }
  };

  // Handle auth modal actions
  const handleLogin = () => {
    router.push('/login?redirect=/host/stories/create');
  };

  const handleRegister = () => {
    router.push('/register?redirect=/host/stories/create');
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowAuthModal(false);
    }
  };

  if (loading && stories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <StoriesFilters 
          initialFilters={appliedFilters} 
          onFiltersChange={handleFilterChange} 
        />
        
        {/* GenZ Loading with fun skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="group flex">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-1 animate-pulse w-full">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-full flex flex-col min-h-[420px]">
                  <div className="story-card-landscape bg-gradient-to-br from-gray-200 to-gray-300 relative aspect-[16/7]">
                    <div className="absolute inset-4 bg-gray-300/50 rounded-2xl"></div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-300 rounded-full w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-1/2 mt-2"></div>
                    </div>
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-3 bg-gray-300 rounded-full w-20"></div>
                          <div className="h-2 bg-gray-200 rounded-full w-16"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full w-16"></div>
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
            {appliedFilters.cityId && ` in selected city`}
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
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {stories.map((story: any, index: number) => (
              <div 
                key={story.id} 
                className="group flex"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient border wrapper */}
                <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-3xl p-1 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 w-full">
                  <div 
                    className="bg-white rounded-3xl overflow-hidden h-full flex flex-col min-h-[420px] cursor-pointer transform hover:scale-[1.02] transition-all duration-300 hover:-translate-y-1 story-card-clickable"
                    onClick={(e) => {
                      console.log('Card clicked!'); // Debug
                      e.preventDefault();
                      e.stopPropagation();
                      handleStoryClick(story, e);
                    }}
                    onMouseDown={(e) => {
                      console.log('Mouse down on card'); // Debug
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStoryClick(story, e as any);
                      }
                    }}
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
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
                          {story.category || 'Travel'}
                        </span>
                      </div>
                      
                      {/* Featured badge */}
                      {story.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                            ⭐ Featured
                          </span>
                        </div>
                      )}
                      
                      {/* Status badge for pending review */}
                      {story.status === 'pending_review' && (
                        <div className={`absolute ${story.featured ? 'top-12' : 'top-3'} left-3`}>
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                            Under Review
                          </span>
                        </div>
                      )}
                      
                      {/* Draft status badge */}
                      {story.status === 'draft' && (
                        <div className={`absolute ${story.featured ? 'top-12' : 'top-3'} left-3`}>
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                            Draft
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      {/* Top content */}
                      <div className="flex-1">
                        {/* Title and location */}
                        <div className="mb-3">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors min-h-[3.5rem]">
                            {story.title}
                          </h3>
                          {/* Location from city data */}
                          {story.City && (
                            <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                              <span className="text-xs">📍</span>
                              <span>{story.City.name}</span>
                              {story.City.country && (
                                <span className="text-gray-400">• {story.City.country.name}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed min-h-[4.5rem]">
                          {story.excerpt}
                        </p>
                      </div>
                      
                      {/* Bottom content - always at bottom */}
                      <div className="space-y-4">
                        {/* Author info */}
                        <div className="flex items-center gap-3">
                          <SimpleImage
                            imagePath={story.author?.avatar || 'default-avatar.jpg'}
                            alt={story.author?.name || 'Author'}
                            className="w-8 h-8 rounded-full object-cover"
                            category="users/avatars"
                            placeholderType="profile"
                            name={story.author?.name || 'Author'}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {story.author?.name || 'Anonymous'}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {new Date(story.publishedAt || story.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between text-gray-500 text-xs">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span className="text-xs font-medium">{story.views || story.viewCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span className="text-xs font-medium">{story.likeCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
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
        </div>
      ) : (
        /* Empty state dengan GenZ vibes */
        <div className="text-center py-16">
          <div className="text-8xl mb-4">📖</div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            No Stories Yet! 
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Be the first to share your amazing travel adventure! ✨
          </p>
          <button 
            onClick={handleCreateStoryClick}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
          >
            🚀 Start Your Story
          </button>
        </div>
      )}
      
      {/* Floating action button for creating stories - Enhanced */}
      <div className="fixed bottom-8 right-8 z-40 group">
        <button 
          onClick={handleCreateStoryClick}
          className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full shadow-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 flex items-center justify-center hover:shadow-purple-500/25"
        >
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

      {/* Auth Modal */}
      {showAuthModal && (
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4" 
          style={{
            position: 'fixed', 
            width: '100vw', 
            height: '100vh',
            top: 0,
            left: 0,
            margin: 0,
            padding: '1rem'
          }}
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Join LocallyTrip! ✨
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-gray-600 leading-relaxed">
                Ready to share your amazing travel experiences? Join our community of storytellers and inspire others with your adventures!
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🔑 Login to Continue
              </button>
              
              <button
                onClick={handleRegister}
                className="w-full border-2 border-purple-200 text-purple-600 py-3 px-6 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105"
              >
                ✨ Create New Account
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesContent;
