'use client';

import React, { useState } from 'react';
import { X, Copy } from 'lucide-react';
import SimpleImage from './SimpleImage';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: {
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, story }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/stories/${story.slug}` : '';
  const shareText = `Check out this amazing travel story: "${story.title}" 🌟`;
  const hashtags = '#LocallyTrip #TravelStory #LocalExperience #TravelBlog';

  const shareToInstagram = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${currentUrl}\n\n${hashtags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const twitterText = encodeURIComponent(`${shareText} ${hashtags}`);
    window.open(`https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const whatsappText = encodeURIComponent(`${shareText}\n\n${currentUrl}`);
    window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareToTelegram = () => {
    const telegramText = encodeURIComponent(`${shareText}\n\n${currentUrl}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${telegramText}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-200">
        {/* Header with Gradient */}
        <div className="relative p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Share the Vibe ✨
              </h3>
              <p className="text-sm text-gray-600 mt-1">Spread the story love with your crew! 📖</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/80 transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 pb-6">
          {/* Story Preview Card */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/50 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-purple-200">
                <SimpleImage
                  imagePath={story.coverImage || 'placeholder-story.jpg'}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  placeholderType="story"
                  category="stories"
                  name={story.title}
                  width={64}
                  height={64}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{story.title}</h4>
                <p className="text-gray-600 text-xs line-clamp-2">{story.excerpt || 'An amazing travel story to inspire your next adventure'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-medium rounded-full">
                    📖 Travel Story
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Share Options - GenZ Grid Layout */}
          <div className="space-y-4">
            <p className="text-center text-sm font-medium text-gray-700">Choose your platform bestie! 💫</p>
            
            {/* Main Social Platforms */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={shareToInstagram}
                className="group flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-yellow-500 text-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="w-8 h-8 mb-2 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.004 5.367 18.635.001 12.017.001zM8.449 20.25c-3.489 0-6.32-2.831-6.32-6.32s2.831-6.32 6.32-6.32 6.32 2.831 6.32 6.32-2.831 6.32-6.32 6.32zm7.718-10.4c-.718 0-1.3-.582-1.3-1.3s.582-1.3 1.3-1.3 1.3.582 1.3 1.3-.582 1.3-1.3 1.3z"/>
                  </svg>
                </div>
                <span className="text-xs font-bold">Insta</span>
                <span className="text-xs opacity-90">Story</span>
              </button>
              
              <button
                onClick={shareToTwitter}
                className="group flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-gray-800 to-black text-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="w-8 h-8 mb-2 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <span className="text-xs font-bold">X</span>
                <span className="text-xs opacity-90">Tweet</span>
              </button>
              
              <button
                onClick={shareToWhatsApp}
                className="group flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="w-8 h-8 mb-2 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <span className="text-xs font-bold">WhatsApp</span>
                <span className="text-xs opacity-90">Chat</span>
              </button>
            </div>

            {/* Secondary Platforms */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={shareToFacebook}
                className="group flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:scale-105 transform transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <div className="w-6 h-6 mb-1">
                  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-xs font-medium">Facebook</span>
              </button>
              
              <button
                onClick={shareToTelegram}
                className="group flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:scale-105 transform transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <div className="w-6 h-6 mb-1">
                  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.78 12.78l.435-4.114L21.75 2.25l-9.43 9.43h-2.54zm11.22-7.72L5.25 21.75 3.75 12l16.5-6.94zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"/>
                  </svg>
                </div>
                <span className="text-xs font-medium">Telegram</span>
              </button>
              
              <button
                onClick={shareToLinkedIn}
                className="group flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white hover:scale-105 transform transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <div className="w-6 h-6 mb-1">
                  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <span className="text-xs font-medium">LinkedIn</span>
              </button>
            </div>
            
            {/* Copy Link with Fun Design */}
            <div className="relative mt-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl blur opacity-75"></div>
              <button
                onClick={copyToClipboard}
                className="relative w-full flex items-center justify-center gap-3 p-4 bg-white rounded-2xl border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all duration-300 group hover:scale-[1.02] transform"
              >
                <Copy className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                <div className="text-center">
                  <span className="text-sm font-semibold text-purple-700 block">
                    {copied ? 'Copied! 🎉' : 'Copy Link 🔗'}
                  </span>
                  <span className="text-xs text-purple-600">Share anywhere you want!</span>
                </div>
              </button>
            </div>

            {/* Fun Footer Message */}
            <div className="text-center mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
              <p className="text-xs text-purple-700 font-medium">
                🌟 Thanks for spreading the LocallyTrip love! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
