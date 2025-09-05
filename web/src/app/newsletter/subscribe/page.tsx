'use client';

import React from 'react';
import Link from 'next/link';
import NewsletterSubscription from '../../../components/NewsletterSubscription';

const NewsletterSubscribePage: React.FC = () => {
  const handleSuccess = (requiresVerification: boolean) => {
    // Show success message is handled by the component itself
    if (requiresVerification) {
    } else {
    }
  };

  const handleError = (error: string) => {
    console.error('Subscription error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LocallyTrip
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/explore" className="text-gray-600 hover:text-purple-600 transition-colors">
                Explore
              </Link>
              <Link href="/stories" className="text-gray-600 hover:text-purple-600 transition-colors">
                Stories
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-purple-600 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              📬 Join Our Travel Community
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get exclusive access to hidden gems, local insights, and authentic travel experiences 
              from real travelers and local hosts around Indonesia and beyond.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Inspiring Stories
              </h3>
              <p className="text-gray-600">
                Weekly travel tales from local experts and authentic experiences you won't find in guidebooks.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                New Experiences
              </h3>
              <p className="text-gray-600">
                Be the first to know about unique local experiences and activities added to our platform.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Exclusive Offers
              </h3>
              <p className="text-gray-600">
                Special deals and early access to experiences, available only to newsletter subscribers.
              </p>
            </div>
          </div>

          {/* Newsletter Subscription Form */}
          <div className="max-w-lg mx-auto">
            <NewsletterSubscription
              source="manual"
              size="large"
              showName={true}
              showFrequency={true}
              showCategories={true}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-6">
              Join thousands of travelers who trust LocallyTrip for authentic experiences
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="flex items-center">
                <span className="text-2xl mr-2">👥</span>
                <span className="text-gray-600">5,000+ Subscribers</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">⭐</span>
                <span className="text-gray-600">4.9 Rating</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">🌍</span>
                <span className="text-gray-600">50+ Destinations</span>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  📅 How often will I receive emails?
                </h3>
                <p className="text-gray-600">
                  You can choose your preferred frequency: weekly (recommended), bi-weekly, or monthly. 
                  You can change this anytime in your preferences.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🔒 Is my email address safe?
                </h3>
                <p className="text-gray-600">
                  Absolutely! We never share your email with third parties and you can unsubscribe 
                  at any time with one click.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🎯 Can I customize what I receive?
                </h3>
                <p className="text-gray-600">
                  Yes! You can select specific categories that interest you (experiences, stories, food, culture, etc.) 
                  and update your preferences anytime.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  💸 Is the newsletter free?
                </h3>
                <p className="text-gray-600">
                  Yes, our newsletter is completely free! We believe in sharing amazing travel 
                  experiences with everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  LocallyTrip
                </span>
              </Link>
              <p className="text-gray-600 mb-4">
                Discover authentic local experiences and connect with passionate hosts 
                for unforgettable travel memories.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>
              <div className="space-y-2">
                <Link href="/explore" className="block text-gray-600 hover:text-purple-600 transition-colors">
                  All Experiences
                </Link>
                <Link href="/stories" className="block text-gray-600 hover:text-purple-600 transition-colors">
                  Travel Stories
                </Link>
                <Link href="/hosts" className="block text-gray-600 hover:text-purple-600 transition-colors">
                  Meet Our Hosts
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <div className="space-y-2">
                <Link href="/contact" className="block text-gray-600 hover:text-purple-600 transition-colors">
                  Contact Us
                </Link>
                <Link href="/privacy-policy" className="block text-gray-600 hover:text-purple-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-conditions" className="block text-gray-600 hover:text-purple-600 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-gray-500 text-sm">
              © 2025 LocallyTrip. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsletterSubscribePage;
