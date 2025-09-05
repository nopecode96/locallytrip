import { useState, useEffect } from 'react';
import { newsletterAPI, NewsletterSubscription, NewsletterPreferences } from '../services/newsletterAPI';

export interface UseNewsletterReturn {
  // Subscription state
  isSubscribed: boolean | null;
  preferences: NewsletterPreferences | null;
  subscribedAt: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  subscribe: (data: NewsletterSubscription) => Promise<{
    success: boolean;
    requiresVerification?: boolean;
    message?: string;
  }>;
  updatePreferences: (preferences: NewsletterPreferences, isSubscribed?: boolean) => Promise<boolean>;
  refreshSubscription: () => void;

  // UI states
  isSubmitting: boolean;
}

export function useNewsletter(): UseNewsletterReturn {
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<NewsletterPreferences | null>(null);
  const [subscribedAt, setSubscribedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUserSubscription = async () => {
    // Only fetch if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      setIsSubscribed(null);
      setPreferences(null);
      setSubscribedAt(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await newsletterAPI.getUserSubscription();
      
      if (response.success && response.data) {
        setIsSubscribed(response.data.isSubscribed);
        setPreferences(response.data.preferences);
        setSubscribedAt(response.data.subscribedAt || null);
      } else {
        // User not found or no subscription - this is normal
        setIsSubscribed(false);
        setPreferences(null);
        setSubscribedAt(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
      setIsSubscribed(null);
      setPreferences(null);
      setSubscribedAt(null);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (data: NewsletterSubscription) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await newsletterAPI.subscribe(data);
      
      if (response.success) {
        // If user is authenticated, refresh their subscription status
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token) {
          await fetchUserSubscription();
        }

        return {
          success: true,
          requiresVerification: response.data?.requiresVerification,
          message: response.message,
        };
      } else {
        setError(response.error || response.message || 'Subscription failed');
        return {
          success: false,
          message: response.error || response.message || 'Subscription failed',
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePreferences = async (
    newPreferences: NewsletterPreferences, 
    newIsSubscribed?: boolean
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await newsletterAPI.updatePreferences({
        preferences: newPreferences,
        isSubscribed: newIsSubscribed,
      });
      
      if (response.success) {
        setPreferences(newPreferences);
        if (newIsSubscribed !== undefined) {
          setIsSubscribed(newIsSubscribed);
        }
        return true;
      } else {
        setError(response.error || response.message || 'Failed to update preferences');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshSubscription = () => {
    fetchUserSubscription();
  };

  // Fetch user subscription on mount and when auth state changes
  useEffect(() => {
    fetchUserSubscription();
    
    // Listen for auth state changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        fetchUserSubscription();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    isSubscribed,
    preferences,
    subscribedAt,
    loading,
    error,
    subscribe,
    updatePreferences,
    refreshSubscription,
    isSubmitting,
  };
}

// Hook for newsletter subscription form (guest users)
export function useNewsletterSubscription() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const subscribe = async (data: NewsletterSubscription) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Final validation before API call
      if (!data.email || !data.email.trim()) {
        throw new Error('Email is required');
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        throw new Error('Please provide a valid email address');
      }

      const response = await newsletterAPI.subscribe(data);
      
      if (response.success) {
        setSuccess(response.message || 'Successfully subscribed to newsletter!');
        return {
          success: true,
          requiresVerification: response.data?.requiresVerification,
          message: response.message,
        };
      } else {
        setError(response.error || response.message || 'Subscription failed');
        return {
          success: false,
          message: response.error || response.message || 'Subscription failed',
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    subscribe,
    isSubmitting,
    error,
    success,
    clearMessages,
  };
}
