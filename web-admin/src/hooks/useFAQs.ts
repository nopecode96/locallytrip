import { useState, useEffect } from 'react';
import { FAQ, FAQFormData } from '@/types/masterData';

interface UseFAQsResult {
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createFAQ: (data: FAQFormData) => Promise<void>;
  updateFAQ: (id: number, data: Partial<FAQFormData>) => Promise<void>;
  deleteFAQ: (id: number) => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
  toggleFeatured: (id: number) => Promise<void>;
}

export const useFAQs = (): UseFAQsResult => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/faqs');
      const data = await response.json();
      
      if (data.success) {
        setFaqs(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch FAQs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createFAQ = async (faqData: FAQFormData) => {
    try {
      setError(null);
      
      const response = await fetch('/api/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchFAQs();
      } else {
        throw new Error(data.error || 'Failed to create FAQ');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateFAQ = async (id: number, faqData: Partial<FAQFormData>) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchFAQs();
      } else {
        throw new Error(data.error || 'Failed to update FAQ');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteFAQ = async (id: number) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchFAQs();
      } else {
        throw new Error(data.error || 'Failed to delete FAQ');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      setError(null);
      
      const faq = faqs.find(f => f.id === id);
      if (!faq) {
        throw new Error('FAQ not found');
      }

      await updateFAQ(id, { is_active: !faq.is_active });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const toggleFeatured = async (id: number) => {
    try {
      setError(null);
      
      const faq = faqs.find(f => f.id === id);
      if (!faq) {
        throw new Error('FAQ not found');
      }

      await updateFAQ(id, { is_featured: !faq.is_featured });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return {
    faqs,
    loading,
    error,
    refetch: fetchFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    toggleStatus,
    toggleFeatured,
  };
};