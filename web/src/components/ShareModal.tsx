'use client';

import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { 
  FaInstagram, 
  FaTiktok, 
  FaTwitter, 
  FaFacebook, 
  FaWhatsapp, 
  FaTelegram, 
  FaDiscord, 
  FaSnapchat, 
  FaPinterest
} from 'react-icons/fa';
import { SiBereal } from 'react-icons/si';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: {
    title: string;
    slug: string;
    excerpt?: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, story }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/stories/${story.slug}` : '';
  const shareText = `Check out this amazing travel story: "${story.title}" 🌟`;
  const hashtags = '#LocallyTrip #TravelStory #LocalExperience #TravelBlog';

  const shareButtons = [
    {
      name: 'Instagram Stories',
      icon: <FaInstagram size={20} />,
      color: 'from-purple-500 to-pink-500',
      onClick: () => {
        // Instagram doesn't have direct URL sharing, so copy text for users to paste
        navigator.clipboard.writeText(`${shareText}\n\n${currentUrl}\n\n${hashtags}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    {
      name: 'TikTok',
      icon: <FaTiktok size={20} />,
      color: 'from-black to-gray-800',
      onClick: () => {
        const tiktokText = encodeURIComponent(`${shareText} ${hashtags}`);
        window.open(`https://www.tiktok.com/share?text=${tiktokText}&url=${encodeURIComponent(currentUrl)}`, '_blank');
      }
    },
    {
      name: 'BeReal',
      icon: <SiBereal size={20} />,
      color: 'from-yellow-400 to-orange-500',
      onClick: () => {
        // BeReal doesn't have direct sharing, copy for manual posting
        navigator.clipboard.writeText(`${shareText}\n\n${currentUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    {
      name: 'Twitter (X)',
      icon: <FaTwitter size={20} />,
      color: 'from-black to-gray-700',
      onClick: () => {
        const twitterText = encodeURIComponent(`${shareText} ${hashtags}`);
        window.open(`https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(currentUrl)}`, '_blank');
      }
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp size={20} />,
      color: 'from-green-500 to-green-600',
      onClick: () => {
        const whatsappText = encodeURIComponent(`${shareText}\n\n${currentUrl}`);
        window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
      }
    },
    {
      name: 'Snapchat',
      icon: <FaSnapchat size={20} />,
      color: 'from-yellow-400 to-yellow-500',
      onClick: () => {
        // Snapchat doesn't have direct URL sharing, copy for stories
        navigator.clipboard.writeText(`${shareText}\n\n${currentUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    {
      name: 'Discord',
      icon: <FaDiscord size={20} />,
      color: 'from-indigo-500 to-purple-600',
      onClick: () => {
        // Discord doesn't have direct URL sharing, copy for users to paste
        navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    {
      name: 'Telegram',
      icon: <FaTelegram size={20} />,
      color: 'from-blue-500 to-blue-600',
      onClick: () => {
        const telegramText = encodeURIComponent(`${shareText}\n\n${currentUrl}`);
        window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${telegramText}`, '_blank');
      }
    },
    {
      name: 'Pinterest',
      icon: <FaPinterest size={20} />,
      color: 'from-red-500 to-pink-500',
      onClick: () => {
        const description = encodeURIComponent(story.excerpt || shareText);
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${description}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: <FaFacebook size={20} />,
      color: 'from-blue-600 to-blue-700',
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
      }
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Share This Story ✨
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Spread the travel vibes! 🌟
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors hover:rotate-90 transform duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Story Preview */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
            {story.title}
          </h3>
          {story.excerpt && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {story.excerpt}
            </p>
          )}
        </div>

        {/* Share Buttons */}
        <div className="p-6">
          <h4 className="font-bold text-gray-800 mb-4 text-sm">
            Choose your platform:
          </h4>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {shareButtons.map((button) => (
              <button
                key={button.name}
                onClick={button.onClick}
                className={`flex items-center gap-3 p-3 bg-gradient-to-r ${button.color} text-white rounded-xl font-medium hover:scale-105 transform transition-all duration-200 shadow-md hover:shadow-lg`}
              >
                <span className="flex-shrink-0">{button.icon}</span>
                <span className="text-sm font-semibold truncate">{button.name}</span>
              </button>
            ))}
          </div>

          {/* Copy Link Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-800 mb-3 text-sm">
              Or copy the link:
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  copied
                    ? 'bg-green-100 text-green-600'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm font-semibold">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Fun Message */}
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <p className="text-center text-sm text-gray-700">
              <span className="font-semibold">Thanks for sharing! 💝</span>
              <br />
              Help others discover amazing local experiences ✨
              <br />
              <span className="text-xs text-gray-500 mt-1 block">
                {copied && "Link copied to clipboard! Ready to paste 🔥"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
