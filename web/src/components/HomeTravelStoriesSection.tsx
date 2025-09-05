'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SimpleImage from './SimpleImage';
import { Heart, MessageCircle, Bookmark, Zap, Sparkles } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  excerpt: string;
  imageUrl?: string;
  image?: string;
  coverImage?: string;
  category?: string;
  publishedAt: string;
  authorName?: string;
  authorImage?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  slug: string;
  likes?: number;
  views?: number;
  location?: string;
  readingTime?: number;
  commentsCount?: number;
}

interface StoriesResponse {
  success: boolean;
  stories: Story[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalStories: number;
  };
}

export default function HomeTravelStoriesSection() {
  const [storiesData, setStoriesData] = useState<Story[]>([]);
  const [storiesLoaded, setStoriesLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedStories, setLikedStories] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await fetch('/api/stories/?limit=3&page=1');
        const data: StoriesResponse = await response.json();
        
        if (data.success && data.stories) {
          setStoriesData(data.stories);
        } else {
          throw new Error('Failed to fetch stories');
        }
      } catch (err) {
        
        setError(err instanceof Error ? err.message : 'Failed to load stories');
      } finally {
        setStoriesLoaded(true);
      }
    }

    fetchStories();
  }, []);

  const toggleLike = (storyId: number) => {
    const newLikedStories = new Set(likedStories);
    if (likedStories.has(storyId)) {
      newLikedStories.delete(storyId);
    } else {
      newLikedStories.add(storyId);
    }
    setLikedStories(newLikedStories);
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-pink-200/40 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-orange-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - GenZ Style */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <span className="text-4xl animate-bounce">📖</span>
            <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Travel Stories
            </h2>
            <span className="text-4xl animate-bounce delay-150">✨</span>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 font-medium mb-4">
            Real adventures, zero filters 📸
          </p>
          <div className="flex justify-center gap-2 text-2xl">
            <span className="animate-bounce">🌍</span>
            <span className="animate-bounce delay-100">🎒</span>
            <span className="animate-bounce delay-200">🚀</span>
            <span className="animate-bounce delay-300">💫</span>
          </div>
        </div>

        {/* Stories Layout - Modern Card Style */}
        <div className="space-y-6 lg:space-y-8">
          {!storiesLoaded ? (
            // Loading state - Modern Style
            [...Array(3)].map((_, i) => (
              <div key={i} className="group">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-[2px] animate-pulse">
                  <div className="bg-white rounded-2xl overflow-hidden min-h-[280px] lg:min-h-[320px]">
                    <div className="flex flex-col lg:flex-row h-full">
                      <div className="lg:w-2/5 w-full flex-shrink-0">
                        <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg lg:rounded-l-2xl lg:rounded-r-none"></div>
                      </div>
                      <div className="lg:w-3/5 w-full p-8 flex-1">
                        <div className="space-y-4 h-full flex flex-col justify-between">
                          <div>
                            <div className="h-8 bg-gray-300 rounded-full w-4/5 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded-full w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                          </div>
                          <div className="pt-6 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                                <div className="space-y-2">
                                  <div className="h-4 bg-gray-200 rounded-full w-24"></div>
                                  <div className="h-3 bg-gray-200 rounded-full w-20"></div>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
                                <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
                                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state - GenZ Style
            <div className="col-span-full text-center py-16">
              <div className="text-8xl mb-6">😵‍💫</div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Oops! Stories taking a break
              </h3>
              <p className="text-gray-600 text-lg">
                They'll be back with more fire content! 🔥
              </p>
            </div>
          ) : storiesData.length > 0 ? (
            // Stories data - Modern Card Layout
            storiesData.map((story, index) => (
              <Link 
                key={story.id} 
                href={`/stories/${story.slug}`}
                className="group cursor-pointer transform hover:scale-[1.01] transition-all duration-500 hover:-translate-y-1 block"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Modern Card with subtle gradient border */}
                <div className="bg-gradient-to-r from-purple-200/30 via-pink-200/30 to-orange-200/30 rounded-2xl p-[2px] shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                  <div className="bg-white rounded-2xl overflow-hidden h-full min-h-[280px] lg:min-h-[320px]">
                    <div className="flex flex-col lg:flex-row h-full">
                      {/* Story Image - Left side on desktop */}
                      <div className="lg:w-2/5 w-full flex-shrink-0">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:rounded-l-2xl lg:rounded-r-none bg-gray-100">
                          {(story.imageUrl || story.image || story.coverImage) ? (
                            <img
                              src={`http://localhost:3001/images/stories/${story.imageUrl || story.image || story.coverImage || 'placeholder-story.jpg'}`}
                              alt={story.title}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                              onError={(e) => {
                                e.currentTarget.src = 'http://localhost:3001/images/placeholder-story.jpg';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                              <span className="text-6xl">📸</span>
                            </div>
                          )}
                          
                          {/* Reading time badge */}
                          <div className="absolute top-3 left-3">
                            <span className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                              ⏱️ {story.readingTime || '5'} min read
                            </span>
                          </div>

                          {/* Category badge */}
                          {story.category && (
                            <div className="absolute top-3 right-3">
                              <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-white/20">
                                {story.category} ✨
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Content - Right side on desktop */}
                      <div className="lg:w-3/5 w-full p-6 lg:p-8 flex flex-col justify-between flex-1">
                        <div className="flex-1">
                          {/* Story Title */}
                          <h3 className="font-black text-xl lg:text-2xl xl:text-3xl text-gray-900 mb-3 lg:mb-4 line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-orange-600 group-hover:bg-clip-text transition-all duration-300">
                            {story.title}
                          </h3>
                          
                          {/* Story Excerpt */}
                          <p className="text-gray-600 text-sm lg:text-base xl:text-lg line-clamp-3 mb-4 lg:mb-6 leading-relaxed">
                            {story.excerpt}
                          </p>
                        </div>
                        
                        {/* Author Info & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 lg:pt-6 border-t border-gray-100 gap-3 sm:gap-4 mt-auto">
                          <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
                            <SimpleImage
                              imagePath={story.author?.avatar || story.authorImage || 'default-avatar.jpg'}
                              alt={story.author?.name || story.authorName || 'Author'}
                              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover ring-2 ring-purple-100 flex-shrink-0"
                              category="users/avatars"
                              placeholderType="profile"
                              name={story.author?.name || story.authorName}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-sm lg:text-base text-gray-900 truncate">
                                {story.author?.name || story.authorName || 'Anonymous'}
                              </p>
                              <p className="text-xs lg:text-sm text-gray-500">
                                {(() => {
                                  try {
                                    const date = new Date(story.publishedAt);
                                    return date.toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    });
                                  } catch {
                                    return 'Recently published';
                                  }
                                })()}
                              </p>
                            </div>
                          </div>
                          
                          {/* Interactive buttons */}
                          <div className="flex flex-wrap items-center gap-2 lg:gap-3 flex-shrink-0">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleLike(story.id);
                              }}
                              className="flex items-center gap-1.5 lg:gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-full transition-colors duration-200 text-xs lg:text-sm"
                            >
                              <Heart 
                                className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${
                                  likedStories.has(story.id) ? 'text-red-500 fill-current' : ''
                                }`} 
                              />
                              <span className="font-medium hidden xs:inline">
                                {(story.likes || 0) + (likedStories.has(story.id) ? 1 : 0)}
                              </span>
                            </button>
                            
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Add comment functionality here if needed
                              }}
                              className="flex items-center gap-1.5 lg:gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-full transition-colors duration-200 text-xs lg:text-sm"
                            >
                              <MessageCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                              <span className="font-medium hidden xs:inline">
                                {story.commentsCount || 0}
                              </span>
                            </button>
                            
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Add bookmark functionality here if needed
                              }}
                              className="bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-purple-600 p-1.5 lg:p-2 rounded-full transition-colors duration-200"
                            >
                              <Bookmark className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // Empty state - GenZ Style
            <div className="col-span-full text-center py-16">
              <div className="text-8xl mb-6 animate-bounce">📝</div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
                No Stories Yet!
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Be the first to drop some travel wisdom! Your adventure deserves to be shared ✨
              </p>
            </div>
          )}
        </div>

        {/* CTA Button - GenZ Style */}
        <div className="text-center mt-16">
          <Link 
            href="/stories/"
            className="relative inline-block group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            <button className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-12 py-4 rounded-full font-black text-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl group-hover:shadow-purple-500/25">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <span>Read More Stories</span>
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
              </div>
              {/* Animated underline */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white/50 group-hover:w-24 transition-all duration-300"></div>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
