import React from 'react';
import { Metadata } from 'next';
import StoriesContent from '@/components/StoriesContent';

export const metadata: Metadata = {
  title: 'Travel Stories - LocallyTrip.com',
  description: 'Get inspired by real travel stories from travelers and hosts around the world.',
  keywords: 'travel stories, travel experiences, local stories',
};

const StoriesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative pt-8 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4 leading-tight">
            Travel Stories
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">✨</span>
            <p className="text-lg md:text-xl text-gray-600 font-medium">
              Real adventures, Real vibes, Real people
            </p>
            <span className="text-2xl">🌍</span>
          </div>
          
          <div className="flex justify-center gap-4 text-3xl mb-8 animate-bounce">
            <span>🚀</span>
            <span>💫</span>
            <span>🎒</span>
            <span>🌺</span>
            <span>📸</span>
          </div>
        </div>
      </div>
      
      {/* Stories Content with API Data */}
      <StoriesContent />
    </div>
  );
};

export default StoriesPage;
