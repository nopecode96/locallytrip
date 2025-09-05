import { useState, useEffect } from 'react';
import { FeaturedTestimonial, isValidTestimonial } from '@/types/testimonial';

export const useFeaturedTestimonials = (limit: number = 6) => {
  const [testimonials, setTestimonials] = useState<FeaturedTestimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/featured-testimonials/?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          // Simple validation - just check if it's an array with objects that have basic properties
          const testimonials = data.data.filter((item: any) => 
            item && 
            typeof item === 'object' && 
            item.id && 
            item.title && 
            item.content &&
            item.reviewer &&
            item.experience
          );
          
          setTestimonials(testimonials);
        } else {
          throw new Error(data.message || 'Failed to fetch featured testimonials');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTestimonials();
  }, [limit]);

  return { testimonials, loading, error };
};

export default useFeaturedTestimonials;
