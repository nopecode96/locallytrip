import React from 'react';
import SimpleImage from './SimpleImage';
import {
  FeaturedTestimonial,
  FeaturedTestimonialCardProps,
  TestimonialRating,
  RenderableString,
  isValidTestimonial,
  renderSafeContent
} from '@/types/testimonial';

const FeaturedTestimonialCard: React.FC<FeaturedTestimonialCardProps> = ({ 
  testimonial, 
  className = '' 
}) => {
  // Compile-time type validation - TypeScript will catch type mismatches here
  const validatedTestimonial: FeaturedTestimonial = testimonial;
  
  // Runtime validation for additional safety
  if (!isValidTestimonial(testimonial)) {
    return (
      <div className="bg-white rounded-3xl border-2 border-red-100 shadow-xl p-6 md:p-8">
        <p className="text-red-600">Error: Invalid testimonial data structure</p>
        <p className="text-xs text-gray-500 mt-2">
          Data must conform to FeaturedTestimonial interface
        </p>
      </div>
    );
  }

  // Type-safe star rating renderer with compile-time validation
  const renderStars = (rating: TestimonialRating): React.ReactElement[] => {
    // TypeScript ensures rating is 1-5, preventing runtime errors
    const validRating: number = rating;
    
    return Array.from({ length: 5 }, (_, index): React.ReactElement => (
      <span
        key={index}
        className={`text-lg ${index < validRating ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={`bg-white rounded-3xl border-2 border-purple-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6 md:p-8 h-full flex flex-col ${className}`}>
      {/* Rating Stars - Type-safe with compile-time validation */}
      <div className="flex items-center mb-4">
        <div className="flex">{renderStars(validatedTestimonial.rating)}</div>
        <span className="ml-2 text-sm text-gray-500">
          ({renderSafeContent(validatedTestimonial.rating, '0')}/5)
        </span>
      </div>

      {/* Testimonial Title - Guaranteed string at compile-time */}
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 line-clamp-2">
        {renderSafeContent(validatedTestimonial.title, 'No Title')}
      </h3>

      {/* Testimonial Content - Type-safe string rendering */}
      <blockquote className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 flex-grow line-clamp-4">
        "{renderSafeContent(validatedTestimonial.content, 'No content available')}"
      </blockquote>

      {/* Experience Info - Compile-time validated properties */}
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
        <p className="text-sm font-medium text-purple-700 mb-1">
          📸 {renderSafeContent(validatedTestimonial.experience.title, 'Experience')}
        </p>
        <p className="text-xs text-purple-600">
          LocallyTrip Experience
        </p>
      </div>

      {/* Reviewer Info - Type-safe nested object access */}
      <div className="flex items-center">
        <div className="w-12 h-12 flex-shrink-0">
          <SimpleImage
            imagePath={renderSafeContent(validatedTestimonial.reviewer.avatar, '')}
            alt={renderSafeContent(validatedTestimonial.reviewer.name, 'Reviewer')}
            className="w-12 h-12 object-cover border-2 border-pink-200 shadow-sm rounded-full"
            category="users/avatars"
            placeholderType="profile"
            name={validatedTestimonial.reviewer.name}
          />
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm truncate">
            {renderSafeContent(validatedTestimonial.reviewer.name, 'Anonymous')}
          </h4>
          <p className="text-xs text-gray-500 truncate">
            📍 {renderSafeContent(validatedTestimonial.reviewer.location, 'Unknown Location')}
          </p>
        </div>
        
        {/* Verified Badge */}
        <div className="ml-auto flex-shrink-0">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
            ✓ Verified
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTestimonialCard;
