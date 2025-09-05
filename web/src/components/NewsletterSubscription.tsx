'use client';

import React, { useState } from 'react';
import { useNewsletterSubscription } from '../hooks/useNewsletter';
import { useToast } from '../contexts/ToastContext';
import { NewsletterSubscription as NewsletterSubscriptionType } from '../services/newsletterAPI';

interface NewsletterSubscriptionProps {
  source?: 'homepage' | 'register' | 'story_detail' | 'experience_detail' | 'manual';
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  showFrequency?: boolean;
  showCategories?: boolean;
  initialEmail?: string;
  initialName?: string;
  onSuccess?: (requiresVerification: boolean) => void;
  onError?: (error: string) => void;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  source = 'homepage',
  className = '',
  size = 'medium',
  showName = false,
  showFrequency = false,
  showCategories = false,
  initialEmail = '',
  initialName = '',
  onSuccess,
  onError,
}) => {
  const { subscribe, isSubmitting, clearMessages } = useNewsletterSubscription();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    email: initialEmail,
    name: initialName,
    frequency: 'weekly' as 'weekly' | 'monthly' | 'bi-weekly',
    categories: [] as string[],
  });

  const categoryOptions = [
    { value: 'experiences', label: '🎯 New Experiences' },
    { value: 'stories', label: '📚 Travel Stories' },
    { value: 'food', label: '🍜 Food & Dining' },
    { value: 'culture', label: '🏛️ Culture & History' },
    { value: 'adventure', label: '🏔️ Adventure & Outdoor' },
    { value: 'photography', label: '📸 Photography' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();


    // Basic email validation
    const email = formData.email.trim();
    if (!email) {
      showToast('Please enter your email address', 'error');
      onError?.('Please enter your email address');
      return;
    }

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      onError?.('Please enter a valid email address');
      return;
    }

    const subscriptionData = {
      email: formData.email.trim(),
      name: formData.name.trim() || undefined,
      frequency: formData.frequency,
      categories: formData.categories.length > 0 ? formData.categories : undefined,
      source,
    };

    // Clean up undefined values to avoid backend issues
    const cleanData: NewsletterSubscriptionType = {
      email: formData.email.trim(),
      frequency: formData.frequency,
      source,
    };

    // Only add optional fields if they have valid values
    if (formData.name && formData.name.trim()) {
      cleanData.name = formData.name.trim();
    }
    
    // Always send categories as array, even if empty
    cleanData.categories = Array.isArray(formData.categories) ? formData.categories : [];


    // Final safety check before API call
    if (!cleanData.email || !isValidEmail(cleanData.email)) {
      console.error('Newsletter form: Invalid email data being sent:', cleanData.email);
      showToast('Please enter a valid email address', 'error');
      onError?.('Please enter a valid email address');
      return;
    }

    const result = await subscribe(cleanData);

    if (result.success) {
      if (result.requiresVerification) {
        showToast('Please check your email to confirm your subscription!', 'success');
      } else {
        showToast('Successfully subscribed to newsletter!', 'success');
      }
      onSuccess?.(result.requiresVerification || false);
      // Reset form on success
      setFormData({
        email: '',
        name: '',
        frequency: 'weekly',
        categories: [],
      });
    } else {
      const errorMsg = result.message || 'Subscription failed';
      showToast(errorMsg, 'error');
      onError?.(errorMsg);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-4',
          title: 'text-lg font-semibold',
          input: 'px-3 py-2 text-sm',
          button: 'px-4 py-2 text-sm',
          text: 'text-sm',
        };
      case 'large':
        return {
          container: 'p-8',
          title: 'text-2xl font-bold',
          input: 'px-6 py-4 text-lg',
          button: 'px-8 py-4 text-lg',
          text: 'text-base',
        };
      default:
        return {
          container: 'p-6',
          title: 'text-xl font-semibold',
          input: 'px-4 py-3 text-base',
          button: 'px-6 py-3 text-base',
          text: 'text-sm',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() && emailRegex.test(email.trim());
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg ${sizeClasses.container} ${className}`}>
      <div className="text-center mb-6">
        <h3 className={`${sizeClasses.title} text-gray-900 mb-2`}>
          📬 Stay in the Loop!
        </h3>
        <p className={`${sizeClasses.text} text-gray-600`}>
          Get the latest travel stories, hidden gems, and exclusive experiences delivered to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className={`block ${sizeClasses.text} font-medium text-gray-700 mb-2`}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full ${sizeClasses.input} border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors`}
            placeholder="your.email@example.com"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Name Field */}
        {showName && (
          <div>
            <label className={`block ${sizeClasses.text} font-medium text-gray-700 mb-2`}>
              Name (Optional)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full ${sizeClasses.input} border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors`}
              placeholder="Your name"
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* Frequency Selection */}
        {showFrequency && (
          <div>
            <label className={`block ${sizeClasses.text} font-medium text-gray-700 mb-2`}>
              Email Frequency
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              className={`w-full ${sizeClasses.input} border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors`}
              disabled={isSubmitting}
            >
              <option value="weekly">📅 Weekly (Recommended)</option>
              <option value="bi-weekly">📅 Every 2 Weeks</option>
              <option value="monthly">📅 Monthly</option>
            </select>
          </div>
        )}

        {/* Categories */}
        {showCategories && (
          <div>
            <label className={`block ${sizeClasses.text} font-medium text-gray-700 mb-3`}>
              What interests you? (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map((category) => (
                <label
                  key={category.value}
                  className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.categories.includes(category.value)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={formData.categories.includes(category.value)}
                    onChange={() => handleCategoryChange(category.value)}
                    disabled={isSubmitting}
                  />
                  <span className="text-sm font-medium">{category.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isValidEmail(formData.email)}
          className={`w-full ${sizeClasses.button} bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Subscribing...
            </div>
          ) : (
            '📧 Subscribe to Newsletter'
          )}
        </button>

        {/* Privacy Notice */}
        <p className={`${sizeClasses.text} text-gray-500 text-center`}>
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSubscription;
