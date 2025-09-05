/**
 * TypeScript types for FeaturedTestimonialCard component
 * These types prevent object rendering errors at compile time
 */

// Base types that ensure only renderable primitives can be used in JSX
export type RenderableString = string;
export type RenderableNumber = number;
export type RenderableContent = RenderableString | RenderableNumber;

// Strict type for rating that must be a valid number between 1-5
export type TestimonialRating = 1 | 2 | 3 | 4 | 5;

// Reviewer interface with strict typing - all properties must be renderable strings
export interface TestimonialReviewer {
  readonly id: RenderableString;
  readonly name: RenderableString;
  readonly location: RenderableString;
  readonly avatar: RenderableString;
}

// Experience interface with strict typing
export interface TestimonialExperience {
  readonly id: RenderableString;
  readonly title: RenderableString;
  readonly categoryId: RenderableString | null;
}

// Main testimonial interface with readonly properties to prevent mutations
// All properties are typed to prevent object rendering in JSX
export interface FeaturedTestimonial {
  readonly id: RenderableString;
  readonly title: RenderableString;
  readonly content: RenderableString;
  readonly rating: TestimonialRating;
  readonly reviewer: TestimonialReviewer;
  readonly experience: TestimonialExperience;
  readonly displayOrder: RenderableNumber;
}

// Props interface with strict validation
export interface FeaturedTestimonialCardProps {
  readonly testimonial: FeaturedTestimonial;
  readonly className?: RenderableString;
}

// Type guard function to validate data at runtime
export const isValidTestimonial = (data: unknown): data is FeaturedTestimonial => {
  if (!data || typeof data !== 'object') return false;
  
  const testimonial = data as Record<string, unknown>;
  
  return (
    typeof testimonial.id === 'string' &&
    typeof testimonial.title === 'string' &&
    typeof testimonial.content === 'string' &&
    typeof testimonial.rating === 'number' &&
    testimonial.rating >= 1 &&
    testimonial.rating <= 5 &&
    typeof testimonial.reviewer === 'object' &&
    testimonial.reviewer !== null &&
    typeof (testimonial.reviewer as any).id === 'string' &&
    typeof (testimonial.reviewer as any).name === 'string' &&
    typeof (testimonial.reviewer as any).location === 'string' &&
    typeof (testimonial.reviewer as any).avatar === 'string' &&
    typeof testimonial.experience === 'object' &&
    testimonial.experience !== null &&
    typeof (testimonial.experience as any).id === 'string' &&
    typeof (testimonial.experience as any).title === 'string' &&
    typeof testimonial.displayOrder === 'number'
  );
};

// Safe rendering utility with compile-time type checking
// This function ensures only renderable content is passed to JSX
export const renderSafeContent = <T extends RenderableContent | null | undefined>(
  value: T,
  fallback: RenderableString
): RenderableString => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return fallback;
};

// Utility type to extract renderable properties from any object
export type RenderableProperties<T> = {
  [K in keyof T]: T[K] extends RenderableContent ? T[K] : never;
};

// Type for ensuring all JSX interpolations are safe
export type SafeJSXContent = RenderableString | RenderableNumber | React.ReactElement | null | undefined;
