'use client';

import React from 'react';
import { SimpleImage } from './SimpleImage';

interface ExperienceImageProps {
  imagePath: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  category?: 'users/avatars' | 'stories' | 'experiences' | 'cities' | 'hosts';
}

export const ExperienceImage: React.FC<ExperienceImageProps> = ({
  imagePath,
  alt,
  className = '',
  width,
  height,
  category
}) => {
  return (
    <SimpleImage
      imagePath={imagePath}
      alt={alt}
      className={className}
      width={width}
      height={height}
      placeholderType="experience"
      category={category}
    />
  );
};

export default ExperienceImage;
