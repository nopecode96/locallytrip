import { useState, useEffect } from 'react';
import { FAQ, FAQResponse, UseFAQsReturn, isValidFAQ, renderFAQSafeContent } from '@/types/faq';

interface UseFAQsOptions {
  category?: string;
  featured?: boolean;
  limit?: number;
}

export const useFAQs = (options: UseFAQsOptions = {}): UseFAQsReturn => {
  const { category, featured, limit = 6 } = options;
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (featured !== undefined) params.append('featured', featured.toString());
        if (limit) params.append('limit', limit.toString());

        const response = await fetch(`/api/faqs/?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: FAQResponse = await response.json();
        
        if (data.success && Array.isArray(data.faqs)) {
          // Validate and filter FAQs at runtime
          const validFaqs = data.faqs.filter((item: unknown) => {
            return isValidFAQ(item);
          }) as FAQ[];
          
          setFaqs(validFaqs);
        } else {
          throw new Error(data.message || 'Failed to fetch FAQs');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setFaqs([]);
      } finally {
        // Ensure loading is set to false regardless of success or error
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [category, featured, limit]);

  return { faqs, loading, error };
};
