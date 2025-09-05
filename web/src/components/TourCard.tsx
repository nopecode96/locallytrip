'use client';

import React from 'react';
import Image from 'next/image';

interface TourCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category: string;
}

const TourCard: React.FC<TourCardProps> = ({
  title,
  location,
  price,
  duration,
  rating,
  reviewCount,
  imageUrl,
  category
}) => {
  const getCategoryBadge = (category: string) => {
    const badges = {
      photography: 'bg-purple-100 text-purple-800',
      guide: 'bg-blue-100 text-blue-800',
      'trip-planner': 'bg-green-100 text-green-800',
      combo: 'bg-orange-100 text-orange-800'
    };
    return badges[category as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(category)}`}>
            {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1">
          <span className="text-sm font-bold text-gray-900">${price}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">{location}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <span className="text-sm font-medium text-gray-900">{rating}</span>
            <span className="text-sm text-gray-500">({reviewCount})</span>
          </div>
          <span className="text-sm text-gray-500">{duration}</span>
        </div>
        
        <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TourCard;
