'use client';

import React, { useState, useEffect } from 'react';
import { ImageService } from '@/services/imageService';
import { PlaceholderService } from '@/utils/placeholder';

interface SimpleImageProps {
  imagePath: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  // Placeholder type hints
  placeholderType?: 'experience' | 'profile' | 'city' | 'story';
  category?: string; // For experience categories
  name?: string; // For profile placeholders
}

export const SimpleImage: React.FC<SimpleImageProps> = ({
  imagePath,
  alt,
  className = '',
  width,
  height,
  placeholderType,
  category,
  name
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = ImageService.getImageUrl(imagePath, category);

  // Generate appropriate placeholder based on type
  const getPlaceholder = () => {
    switch (placeholderType) {
      case 'experience':
        return PlaceholderService.getExperiencePlaceholder(category);
      case 'profile':
        return PlaceholderService.getProfilePlaceholder(name || alt);
      case 'city':
        return PlaceholderService.getCityPlaceholder(name || alt);
      case 'story':
        return PlaceholderService.getStoryPlaceholder(name || alt);
      default:
        return PlaceholderService.getSVGPlaceholder(width || 800, height || 600, 'Image not found');
    }
  };

  // Check if image is already loaded when ref is set
  const handleImgRef = (img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoading(false);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
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
    }, 1000); // 1 second timeout

    return () => clearTimeout(timer);
  }, [imageUrl]); // Remove isLoading dependency

  if (hasError) {
    return (
      <img
        src={getPlaceholder()}
        alt={alt}
        className={className}
        style={{ width, height }}
      />
    );
  }

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center`}
        >
          <span className="text-gray-400 text-xs">●●●</span>
        </div>
      )}
      <img
        ref={handleImgRef}
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
