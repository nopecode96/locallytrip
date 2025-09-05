'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { newsletterAPI } from '../../../../services/newsletterAPI';

const UnsubscribeNewsletterPage: React.FC = () => {
  const params = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = async () => {
      // Renamed dynamic parameter to avoid conflict
      const token = params?.token as string;

      if (!token) {
        setStatus('invalid');
        setMessage('Invalid unsubscribe link');
        return;
      }

      try {
        const response = await newsletterAPI.unsubscribe(token);

        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'Successfully unsubscribed from newsletter');
        } else {
          setStatus('error');
          setMessage(response.error || response.message || 'Unsubscribe failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to process unsubscribe request. Please try again.');
      }
    };

    unsubscribe();
  }, [params.token]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Processing Unsubscribe
            </h1>
            <p className="text-gray-600">
              Please wait while we process your request...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              👋 Successfully Unsubscribed
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-gray-600 mb-8">
              You will no longer receive marketing emails from LocallyTrip. We're sorry to see you go!
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">
                💡 What you'll still receive:
              </h3>
              <ul className="text-left text-amber-700 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">✅</span>
                  Important account notifications (if you have an account)
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✅</span>
                  Booking confirmations and travel updates
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✅</span>
                  Essential service announcements
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Changed your mind? You can resubscribe anytime:
              </p>
              <Link
                href="/newsletter/subscribe"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                📧 Resubscribe to Newsletter
              </Link>
              <div>
                <Link
                  href="/explore"
                  className="inline-block bg-gray-100 text-gray-700 font-semibold py-3 px-8 rounded-xl hover:bg-gray-200 transition-all duration-200 mr-4"
                >
                  🔍 Explore Experiences
                </Link>
                <Link
                  href="/"
                  className="inline-block text-purple-600 hover:text-purple-800 font-semibold"
                >
                  🏠 Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Unsubscribe Failed
            </h1>
            <p className="text-red-600 mb-6">
              {message}
            </p>
            <p className="text-gray-600 mb-8">
              The unsubscribe link may have expired or been used already. You can contact us directly for assistance.
            </p>
            
            <div className="space-y-4">
              <Link
                href="/contact"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                📞 Contact Support
              </Link>
              <div>
                <Link
                  href="/"
                  className="inline-block text-purple-600 hover:text-purple-800 font-semibold"
                >
                  🏠 Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Unsubscribe Link
            </h1>
            <p className="text-gray-600 mb-8">
              The unsubscribe link appears to be invalid or malformed. Please check your email for the correct link or contact support.
            </p>
            
            <div className="space-y-4">
              <Link
                href="/contact"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                📞 Contact Support
              </Link>
              <div>
                <Link
                  href="/"
                  className="inline-block text-purple-600 hover:text-purple-800 font-semibold"
                >
                  🏠 Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LocallyTrip
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto pt-20 pb-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderContent()}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2025 LocallyTrip. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnsubscribeNewsletterPage;
