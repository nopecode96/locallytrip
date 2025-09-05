'use client';

import React from 'react';
import SimpleImage from './SimpleImage';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  tourTitle: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  location,
  rating,
  comment,
  avatar,
  tourTitle
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < rating ? 'text-yellow-400' : 'text-gray-300'
            } fill-current`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        ))}
      </div>
      
      <blockquote className="text-gray-700 mb-4 italic">
        "{comment}"
      </blockquote>
      
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 flex-shrink-0 relative overflow-hidden rounded-full">
          <SimpleImage
            imagePath={avatar}
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{location}</p>
          <p className="text-xs text-blue-600 font-medium mt-1">{tourTitle}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
