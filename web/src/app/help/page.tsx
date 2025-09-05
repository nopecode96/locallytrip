'use client';

import React, { useState } from 'react';
import { useFAQs } from '@/hooks/useFAQs';
import { FAQ } from '@/types/faq';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  faqCount: number;
  href: string;
}

const HelpCenterPage: React.FC = () => {
  const { faqs, loading, error } = useFAQs({ limit: 100 });
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Help Categories
  const helpCategories: HelpCategory[] = [
    {
      id: 'travelers',
      title: 'For Travelers',
      description: 'Everything you need to know about booking and enjoying experiences',
      icon: '🧳',
      faqCount: 0,
      href: '#travelers'
    },
    {
      id: 'hosts',
      title: 'For Hosts',
      description: 'Guide for hosts to manage experiences and serve travelers',
      icon: '🏠',
      faqCount: 0,
      href: '#hosts'
    },
    {
      id: 'payments',
      title: 'Payments & Billing',
      description: 'Information about payments, refunds, and billing',
      icon: '💳',
      faqCount: 0,
      href: '#payments'
    },
    {
      id: 'safety',
      title: 'Safety & Trust',
      description: 'Learn about our safety measures and community guidelines',
      icon: '🛡️',
      faqCount: 0,
      href: '#safety'
    }
  ];

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Help Center
            </h1>
            <p className="text-xl text-gray-600">Loading help articles...</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl border-2 border-pink-100 shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Help Center
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Need Some Help? 💡
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Got questions about LocallyTrip.com? We've got all the answers! From booking epic experiences to becoming a host - we got you covered ✨
          </p>
          
          {/* Search Bar */}
          <div className="flex items-center max-w-2xl mx-auto bg-white rounded-full overflow-hidden shadow-xl">
            <div className="px-6 py-3 text-gray-400">
              🔍
            </div>
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-1 px-2 py-3 text-gray-700 outline-none text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find help articles organized by topic
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {helpCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-white rounded-2xl border-2 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  selectedCategory === category.id 
                    ? 'border-purple-300 bg-purple-50' 
                    : 'border-pink-100 hover:border-purple-200'
                }`}
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              All Articles
            </button>
            {helpCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'
                }`}
              >
                {category.icon} {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Help Articles */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  {searchQuery ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No articles found for "{searchQuery}"
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Try searching with different keywords or browse our categories above.
                      </p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Articles Found</h3>
                      <p className="text-gray-600">Check back soon for helpful articles!</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <p className="text-gray-600">
                    {searchQuery && (
                      <span>Showing {filteredFaqs.length} results for "{searchQuery}"</span>
                    )}
                    {!searchQuery && selectedCategory !== 'all' && (
                      <span>Showing {filteredFaqs.length} articles in {helpCategories.find(c => c.id === selectedCategory)?.title}</span>
                    )}
                    {!searchQuery && selectedCategory === 'all' && (
                      <span>Showing all {filteredFaqs.length} help articles</span>
                    )}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-white rounded-2xl border-2 border-pink-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-purple-50 transition-colors group"
                      >
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-purple-700 transition-colors pr-4">
                          {faq.question}
                        </h3>
                        <div className={`transform transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180' : 'rotate-0'}`}>
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      <div className={`transition-all duration-300 ease-in-out ${openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                        <div className="px-6 pb-6 pt-0">
                          <div className="border-t border-pink-100 pt-4">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {faq.answer}
                            </p>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>👀 {faq.viewCount || 0} views</span>
                                <span>👍 {faq.helpfulCount || 0} helpful</span>
                              </div>
                              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                Was this helpful? 👍
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Still Stuck? No Worries! 🤗
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our team is always ready to help! Hit us up anytime about LocallyTrip.com - we're here for you 24/7 💪
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              📧 Contact Support
            </a>
                        <a 
              href="mailto:support@locallytrip.com"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              ✉️ Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenterPage;
