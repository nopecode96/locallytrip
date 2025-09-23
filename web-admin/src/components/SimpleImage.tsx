'use client';

import React, { useState, useEffect } from 'react';
import { ImageService } from '@/services/imageService';

interface SimpleImageProps {
  imagePath: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  category?: string;
}

export const SimpleImage: React.FC<SimpleImageProps> = ({
  imagePath,
  alt,
  className = '',
  width,
  height,
  category
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = ImageService.getImageUrl(imagePath, category);

  // Generate default placeholder for avatars
  const getPlaceholder = () => {
    if (category === 'users/avatars') {
      return `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="50" fill="#f3f4f6"/>
          <circle cx="50" cy="35" r="18" fill="#9ca3af"/>
          <ellipse cx="50" cy="85" rx="25" ry="20" fill="#9ca3af"/>
        </svg>
      `)}`;
    }
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" fill="#f3f4f6"/>
        <text x="50" y="50" text-anchor="middle" dy=".3em" fill="#9ca3af" font-size="12">No Image</text>
      </svg>
    `)}`;
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Reset states when imageUrl changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [imageUrl]);

  // Fallback timeout to prevent infinite loading states
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [imageUrl]);

  if (hasError) {
    return (
      <div
        className={`${className} bg-center bg-no-repeat bg-cover flex items-center justify-center`}
        style={{ 
          width, 
          height,
          backgroundImage: `url(${getPlaceholder()})`
        }}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center ${
            className.includes('rounded-full') ? 'rounded-full' : ''
          }`}
        >
          <span className="text-gray-400 text-xs">●●●</span>
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ width, height }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default SimpleImage;