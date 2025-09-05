'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStoryDetail } from '@/hooks/useStoryDetail';
import { useStories } from '@/hooks/useStories';
import { ImageService } from '@/services/imageService';
import SimpleImage from './SimpleImage';
import ShareModal from './ShareModal';
import { Clock, Eye, Heart, Share2, User, MapPin, Tag, Calendar, MessageCircle, ChevronRight, Home } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  slug: string;
}

const StoryDetail: React.FC<Props> = ({ slug }) => {
  const { story, loading, error } = useStoryDetail(slug);
  // Get general stories - we'll filter in getRelatedStories function
  const { stories: allStories } = useStories({ limit: 20 });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="text-xl text-gray-700 animate-pulse font-medium">Loading epic story... ✨</p>
          <div className="flex justify-center gap-2">
            <span className="text-3xl animate-bounce">📚</span>
            <span className="text-3xl animate-bounce delay-100">✨</span>
            <span className="text-3xl animate-bounce delay-200">🌟</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-8xl mb-4">😢</div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Story Not Found
          </h1>
          <p className="text-gray-600 text-lg">
            {error || "We couldn't find the story you're looking for, but don't worry - there are tons of other amazing stories waiting for you! ✨"}
          </p>
          <Link 
            href="/stories"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            📚 Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const formatContent = (content: string) => {
    if (!content) return '';
    
    return content
      .split('\n')
      .map(paragraph => {
        if (paragraph.trim() === '') return '';
        
        let processedParagraph = paragraph;
        
        // Handle markdown images first
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        processedParagraph = processedParagraph.replace(imageRegex, (match, alt, src) => {
          const filename = src.split('/').pop() || src;
          const imageUrl = ImageService.getImageUrl(`/images/stories/content/${filename}`);
          return `<div class="my-8 rounded-2xl overflow-hidden shadow-lg">
            <img src="${imageUrl}" alt="${alt}" class="w-full h-auto object-cover" loading="lazy" />
            ${alt ? `<div class="bg-gray-50 px-4 py-2 text-sm text-gray-600 text-center italic">${alt}</div>` : ''}
          </div>`;
        });
        
        // If paragraph contains an image, return it as is
        if (imageRegex.test(paragraph)) {
          return processedParagraph;
        }
        
        // Handle headers
        if (processedParagraph.startsWith('### ')) {
          const headerText = processedParagraph.substring(4);
          return `<h3 class="text-xl font-bold text-gray-800 mt-8 mb-4">${headerText}</h3>`;
        }
        if (processedParagraph.startsWith('## ')) {
          const headerText = processedParagraph.substring(3);
          return `<h2 class="text-2xl font-bold text-gray-800 mt-8 mb-4">${headerText}</h2>`;
        }
        if (processedParagraph.startsWith('# ')) {
          const headerText = processedParagraph.substring(2);
          return `<h1 class="text-3xl font-bold text-gray-800 mt-8 mb-4">${headerText}</h1>`;
        }
        
        // Handle bold text with **text**
        processedParagraph = processedParagraph.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
        
        // Handle italic text with *text*
        processedParagraph = processedParagraph.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700">$1</em>');
        
        // Handle links [text](url)
        processedParagraph = processedParagraph.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-600 hover:text-purple-800 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Handle inline code `code`
        processedParagraph = processedParagraph.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-purple-700 px-2 py-1 rounded text-sm font-mono">$1</code>');
        
        // Handle strikethrough ~~text~~
        processedParagraph = processedParagraph.replace(/~~([^~]+)~~/g, '<del class="line-through text-gray-500">$1</del>');
        
        // Handle unordered lists
        if (processedParagraph.startsWith('- ') || processedParagraph.startsWith('* ')) {
          const listItem = processedParagraph.substring(2);
          return `<li class="ml-6 mb-2 text-gray-700 leading-relaxed list-disc">${listItem}</li>`;
        }
        
        // Handle ordered lists
        if (/^\d+\.\s/.test(processedParagraph)) {
          const listItem = processedParagraph.replace(/^\d+\.\s/, '');
          return `<li class="ml-6 mb-2 text-gray-700 leading-relaxed list-decimal">${listItem}</li>`;
        }
        
        // Handle blockquotes
        if (processedParagraph.startsWith('> ')) {
          const quoteText = processedParagraph.substring(2);
          return `<blockquote class="border-l-4 border-purple-300 pl-4 py-2 my-6 bg-purple-50/50 italic text-gray-700 rounded-r-lg">${quoteText}</blockquote>`;
        }
        
        // Handle horizontal rule
        if (processedParagraph.trim() === '---' || processedParagraph.trim() === '***') {
          return `<hr class="border-t-2 border-gray-200 my-8">`;
        }
        
        // Regular paragraph
        return `<p class="mb-6 text-gray-700 leading-relaxed text-lg">${processedParagraph}</p>`;
      })
      .join('');
  };

  const getRelatedStories = () => {
    if (story?.relatedStories && story.relatedStories.length > 0) {
      return story.relatedStories.slice(0, 3);
    }
    // Use allStories and filter by current story ID
    return allStories
      .filter(relatedStory => relatedStory.id !== story?.id)
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
              <Link 
                href="/" 
                className="flex items-center hover:text-purple-600 transition-colors"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link 
                href="/stories" 
                className="hover:text-purple-600 transition-colors"
              >
                Stories
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium truncate max-w-xs">
                {story.title}
              </span>
            </nav>

            {/* Featured Image - Always show with fallback */}
            <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl group">
              <div className="relative story-detail-hero overflow-hidden">
                <SimpleImage
                  imagePath={story.coverImage || 'default-story-cover.jpg'}
                  alt={story.title}
                  className="story-cover-image w-full h-full group-hover:scale-105 transition-transform duration-500"
                  category="stories"
                  placeholderType="story"
                  name={story.title}
                />
                {!story.coverImage && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Tag className="w-16 h-16 mx-auto mb-4 opacity-40" />
                      <p className="text-lg font-semibold opacity-60">{story.title}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                <Tag className="w-4 h-4" />
                {story.tags && story.tags.length > 0 ? story.tags[0] : 'Travel'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-6 leading-tight">
              {story.title}
            </h1>

            {/* Author & Meta Information */}
            <div className="flex flex-wrap gap-6 mb-8 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">
                  {story.author?.firstName} {story.author?.lastName}
                </span>
              </div>
              
              {story.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {story.location.name}{story.location.country && `, ${story.location.country}`}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {story.createdAt 
                    ? `${formatDistanceToNow(new Date(story.createdAt))} ago`
                    : 'Recently published'
                  }
                </span>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm mb-8">
              <div className="flex items-center gap-6">
                {story.views && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">{story.views.toLocaleString()} views</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{story.likesCount || 0} likes</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{story.commentsCount || 0} comments</span>
                </div>
              </div>

              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                Share Story ✨
              </button>
            </div>

            {/* Story Content */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: formatContent(story.content || story.excerpt || '') 
                }}
              />
            </div>

            {/* Comments Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
                <MessageCircle className="w-7 h-7 text-purple-600" />
                Comments ({story.commentsCount || 0})
              </h3>
              
              {story.comments && story.comments.length > 0 ? (
                <div className="space-y-6 mb-8">
                  {story.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 bg-gray-50/80 rounded-2xl hover:bg-gray-50 transition-colors">
                      <SimpleImage
                        imagePath={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md flex-shrink-0"
                        category="users/avatars"
                        placeholderType="profile"
                        name={comment.user.name}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-800 text-sm">
                            {comment.user.name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-lg font-medium">No comments yet</p>
                  <p className="text-sm">Be the first to share your thoughts! ✨</p>
                </div>
              )}

              {/* Comment Form */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Leave a Comment</h4>
                <form className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="Share your thoughts about this story... ✨"
                        rows={4}
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none resize-none text-gray-700 placeholder-gray-400 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span>💝</span>
                      Please keep comments respectful and constructive
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Post Comment ✨
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Author Card */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-black text-gray-800 mb-6">About the Author ✨</h3>
              <div className="flex items-start gap-4">
                {story.author?.avatar && (
                  <SimpleImage
                    imagePath={story.author.avatar}
                    alt={`${story.author.firstName} ${story.author.lastName}`}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-xl"
                    category="users/avatars"
                    placeholderType="profile"
                    name={`${story.author.firstName} ${story.author.lastName}`}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-gray-800 text-lg mb-2">
                    {story.author?.firstName} {story.author?.lastName}
                  </h4>
                  {story.location && (
                    <p className="text-gray-600 mb-2 font-medium text-sm">
                      📍 {story.location.name}{story.location.country && `, ${story.location.country}`}
                    </p>
                  )}
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {story.author?.bio || 'Travel enthusiast sharing authentic experiences and local insights from around the world! ✈️🌍'}
                  </p>
                </div>
              </div>
            </div>

            {/* Related Stories */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                Related Stories
              </h3>
              
              <div className="space-y-4">
                {getRelatedStories().map((relatedStory) => (
                  <Link 
                    key={relatedStory.id}
                    href={`/stories/${relatedStory.slug}`}
                    className="block group hover:bg-purple-50 rounded-2xl p-4 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex gap-4">
                      <SimpleImage
                        imagePath={relatedStory.image || (relatedStory as any).imageUrl || 'default-story.jpg'}
                        alt={relatedStory.title}
                        className="w-20 h-14 rounded-xl story-thumbnail group-hover:scale-105 transition-transform duration-300"
                        category="stories"
                        placeholderType="story"
                        name={relatedStory.title}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {relatedStory.title}
                        </h4>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <User className="w-3 h-3 text-gray-400" />
                            {relatedStory.authorName || (relatedStory as any).author?.name || 'Anonymous'}
                          </p>
                          {relatedStory.location && relatedStory.location !== 'Unknown' && (
                            <p className="text-xs text-purple-600 flex items-center gap-1 font-medium">
                              <MapPin className="w-3 h-3" />
                              {relatedStory.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Link 
                href="/stories"
                className="block mt-6 text-center py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                View All Stories 📚
              </Link>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-black mb-3">
                Never Miss a Story! ✨
              </h3>
              <p className="text-sm mb-4 opacity-90">
                Get the latest travel stories and local insights delivered straight to your inbox.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button className="w-full py-3 bg-white text-orange-500 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                  Subscribe Now 🚀
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-3xl p-8 text-white">
          <h3 className="text-3xl font-black mb-4">Inspired by this story? ✨</h3>
          <p className="text-xl mb-8 opacity-90">
            Discover amazing local experiences and create your own unforgettable memories!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/explore"
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-black hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105 shadow-lg"
            >
              🔍 Explore Experiences
            </Link>
            <Link 
              href="/stories"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-black hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              📚 Read More Stories
            </Link>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        story={{
          title: story.title,
          slug: story.slug,
          excerpt: story.excerpt
        }}
      />
    </div>
  );
};

export default StoryDetail;
