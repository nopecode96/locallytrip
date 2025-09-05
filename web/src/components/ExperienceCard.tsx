import React from 'react';
import ExperienceImage from './ExperienceImage';
import { SimpleImage } from './SimpleImage';
import { ImageService } from '@/services/imageService';
import Link from 'next/link';
import { Experience } from '@/services/experienceAPI';

// Helper function for safe number handling
const safeNumber = (value: any): number | null => {
  if (value === null || value === undefined) return null;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return typeof num === 'number' && !isNaN(num) ? num : null;
};

interface ExperienceCardProps {
  experience: Experience;
  className?: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, className = '' }) => {
  // Safe destructuring with fallbacks
  if (!experience) {
    return null;
  }

  const {
    id,
    title,
    slug,
    shortDescription,
    price,
    pricePerPackage, // From API
    currency,
    duration,
    difficulty,
    rating,
    totalReviews,
    bookingCount, // From API
    viewCount,
    maxGuests, // From API  
    minGuests, // From API
    host,
    coverImage,
    imageUrl,
    images, // From API
    category = null, // From API
    city = null, // From API
    location, // From API
    // Map hosts API fields to component expected fields
    reviewCount: hostReviewCount,
    description: hostDescription,
    location: hostLocation // Map location from hosts API
  } = experience as any; // Use any to handle different API response structures

  // Use pricePerPackage as fallback if price is not available
  const finalPrice = price || pricePerPackage || 0;

  // Safe number handling for ratings
  const safeRating = safeNumber(rating);
  const safeHostRating = safeNumber(host?.rating);

  // Get raw image path for ExperienceImage component (no URL processing)
  const imagePath = coverImage || (images && images[0]) || imageUrl || '';
  
  // Handle description from different sources
  const experienceDescription = shortDescription || hostDescription || 'No description available';
  
  // Handle review count from different sources  
  const reviewCount = totalReviews || hostReviewCount || 0;
  
  // Format price with proper IDR formatting
  const formatPrice = (price: string | number, currency: string = 'IDR'): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (currency === 'IDR') {
      return `Rp ${numPrice.toLocaleString('id-ID')}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(numPrice);
  };

  const formattedPrice = formatPrice(finalPrice, currency);

  // Format host name - pure database data only
  const displayHostName = host?.name || experience.hostName;

  // Get category-specific styling and icons
  const getCategoryStyle = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'local guide':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          icon: '🗺️',
          border: 'border-blue-100',
          hover: 'hover:border-blue-200'
        };
      case 'tour guide':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          icon: '🗺️',
          border: 'border-blue-100',
          hover: 'hover:border-blue-200'
        };
      case 'photographer':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
          icon: '📸',
          border: 'border-purple-100',
          hover: 'hover:border-purple-200'
        };
      case 'trip planner':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          icon: '📋',
          border: 'border-green-100',
          hover: 'hover:border-green-200'
        };
      case 'combo tour':
        return {
          bg: 'bg-gradient-to-r from-orange-500 to-red-500',
          icon: '🎭',
          border: 'border-orange-100',
          hover: 'hover:border-orange-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          icon: '⭐',
          border: 'border-gray-100',
          hover: 'hover:border-gray-200'
        };
    }
  };

  // Safe category handling to prevent runtime errors
  const categoryName = category?.name || 'Other';
  const categorySlug = category?.slug || 'other';
  const categoryStyle = getCategoryStyle(categoryName);
  
  // Safe city and location handling - pure database data only
  const locationText = location || 
    (city?.name ? 
      (city.country?.name ? `${city.name}, ${city.country.name}` : city.name) : 
      hostLocation);
  const durationText = duration ? `${duration}h` : null;

  return (
    <Link href={`/explore/${slug || id}`} className="group h-full">
      <div className={`bg-white rounded-3xl border-2 ${categoryStyle.border} ${categoryStyle.hover} shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col`}>
        <div className="relative">
          <ExperienceImage
            imagePath={imagePath}
            alt={title}
            className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-300"
            category="experiences"
          />
          <span className={`absolute top-3 left-3 ${categoryStyle.bg} text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg`}>
            {categoryStyle.icon} {categoryName}
          </span>
          {/* Difficulty badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              difficulty === 'easy' 
                ? 'bg-green-100 text-green-800' 
                : difficulty === 'moderate' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {difficulty}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {title}
          </h3>
          
          <div className="flex items-start gap-2 mb-3">
            <div className="w-8 h-8 flex-shrink-0 mt-0.5 rounded-full overflow-hidden border border-purple-200 bg-gray-100 flex items-center justify-center">
              <SimpleImage
                imagePath={host?.avatar ? ImageService.getUserAvatar(host.avatar) : ImageService.getUserAvatar('placeholder.jpg')}
                alt={displayHostName}
                className="w-10 h-10 object-cover object-center"
                placeholderType="profile"
                name={displayHostName}
              />
            </div>
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium hover:text-purple-600 transition-colors leading-tight block">
                with {displayHostName}
              </span>
              <span className="text-xs text-gray-500 flex items-center">
                📍 {locationText} • {durationText}
              </span>
            </div>
          </div>
          
          {/* Category-specific highlights */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {(categoryName.toLowerCase() === 'local guide' || categoryName.toLowerCase() === 'tour guide') && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">🚶‍♂️ Local Experience</span>
              )}
              {categoryName.toLowerCase() === 'photographer' && (
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">📷 Photo Session</span>
              )}
              {categoryName.toLowerCase() === 'trip planner' && (
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">🗓️ Custom Itinerary</span>
              )}
              {categoryName.toLowerCase() === 'combo tour' && (
                <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded">🎯 Tour + Photos</span>
              )}
            </div>
          </div>
          
          {experienceDescription && (
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {experienceDescription}
            </p>
          )}
          
          <div className="flex flex-col gap-3 mt-auto">
            {/* Rating and Booking Count */}
            <div className="flex justify-between items-center">
              <div className="text-yellow-500 text-sm flex items-center">
                {safeRating !== null ? (
                  <>
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="text-gray-600 font-medium">{safeRating.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs ml-1">({reviewCount})</span>
                  </>
                ) : (
                  <span className="text-gray-400 text-xs">No reviews yet</span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {bookingCount ? `${bookingCount} bookings` : (viewCount ? `${viewCount} views` : 'New experience')}
              </span>
            </div>
            
            {/* Price and Guest Info */}
            <div className="flex justify-between items-end">
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formattedPrice}
                </span>
                <span className="text-xs text-gray-500 block">
                  per package
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
                  👥 {minGuests ? `${minGuests}-${maxGuests}` : `Max ${maxGuests}`} guests
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExperienceCard;
