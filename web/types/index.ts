// LocallyTrip.com TypeScript interfaces

// Re-export testimonial types for centralized access
export * from '../src/types/testimonial';

export interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category: 'photography' | 'guide' | 'trip-planner' | 'combo';
  description: string;
  highlights: string[];
  includes: string[];
  hostId: string;
}

export interface Host {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  bio: string;
  location: string;
  verified: boolean;
  responseTime: string;
  languages: string[];
  toursCount: number;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  authorImage: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  content?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  tourTitle: string;
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
