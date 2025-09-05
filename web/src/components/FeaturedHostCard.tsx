import React from 'react';
import SimpleImage from './SimpleImage';
import Link from 'next/link';
import { generateHostSlug } from '@/utils/slugUtils';

interface FeaturedHostCardProps {
  host: {
    id: string;
    hostId: string;
    name: string;
    title: string;
    description: string;
    badge: string;
    profilePicture: string;
    location: string;
    rating: number;
    totalReviews: number;
    isVerified: boolean;
  };
  className?: string;
}

const FeaturedHostCard: React.FC<FeaturedHostCardProps> = ({ host, className = '' }) => {
  // Generate SEO-friendly slug with name and UUID
  const hostSlug = generateHostSlug(host.name, host.hostId);

  return (
    <Link href={`/hosts/${hostSlug}`} className="group h-full">
      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full flex flex-col border-2 border-purple-100 group-hover:border-purple-300">
        {/* Host Profile Picture */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <SimpleImage
              imagePath={host.profilePicture}
              alt={host.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-purple-200 group-hover:border-purple-400 transition-colors"
              category="users/avatars"
              placeholderType="profile"
              name={host.name}
            />
            {host.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </div>
        </div>

        {/* Host Info */}
        <div className="text-center flex-grow">
          {/* Badge */}
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
            {host.badge}
          </div>

          {/* Name */}
          <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
            {host.name}
          </h3>

          {/* Title */}
          <p className="text-sm font-medium text-purple-600 mb-2">
            {host.title}
          </p>

          {/* Location */}
          <p className="text-xs text-gray-500 mb-3">
            📍 {host.location}
          </p>

          {/* Description */}
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
            {host.description}
          </p>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-center space-x-4 text-xs md:text-sm">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">⭐</span>
            <span className="font-semibold text-gray-700">{host.rating.toFixed(1)}</span>
          </div>
          <div className="text-gray-500">
            ({host.totalReviews} reviews)
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 px-4 rounded-full text-sm font-semibold group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-200">
            View Profile ✨
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedHostCard;
