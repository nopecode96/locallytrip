import React from 'react';
import { SimpleImage } from './SimpleImage';

interface ProfileImageProps {
  imagePath?: string;
  alt: string;
  size?: number | string;
  className?: string;
  name?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  imagePath,
  alt,
  size = 48,
  className = '',
  name
}) => {
  const sizeStyles = typeof size === 'number' ? 
    { width: `${size}px`, height: `${size}px` } : 
    { width: size, height: size };

  return (
    <div 
      className={`relative rounded-full overflow-hidden ${className}`}
      style={sizeStyles}
    >
      <SimpleImage
        imagePath={imagePath || ''}
        alt={alt}
        category="users/avatars"
        placeholderType="profile"
        className="w-full h-full object-cover"
        name={name}
      />
    </div>
  );
};
