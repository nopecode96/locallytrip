import React from 'react';

interface ExperienceSkeletonProps {
  count?: number;
}

const ExperienceSkeleton: React.FC<ExperienceSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
          {/* Image skeleton */}
          <div className="aspect-[4/3] bg-gray-200"></div>
          
          {/* Content skeleton */}
          <div className="p-5">
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            
            {/* Description skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
            
            {/* Location and duration skeleton */}
            <div className="flex space-x-4 mb-3">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            
            {/* Host info skeleton */}
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            
            {/* Rating skeleton */}
            <div className="flex items-center mb-3">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 rounded w-20 ml-2"></div>
            </div>
            
            {/* Price and button skeleton */}
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ExperienceSkeleton;
