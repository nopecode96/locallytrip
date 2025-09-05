'use client';

import React from 'react';
import Link from 'next/link';
import { ImageService } from '@/services/imageService';

const PromotionsPage: React.FC = () => {
  const highlights = [
    {
      id: 1,
      title: 'Summer Photo Session - 20% OFF',
      description: 'Capture your summer vacation with a local photographer. Valid for all bookings in August.',
      image: ImageService.getImageUrl('promotions/highlight1.png'),
      discount: '20% OFF',
      validUntil: 'August 31, 2025',
      category: 'Photography'
    },
    {
      id: 2,
      title: 'Free Itinerary Planning for Tokyo!',
      description: 'Book a custom trip plan with our verified planners and get your Tokyo route for free this month.',
      image: ImageService.getImageUrl('promotions/highlight2.png'),
      discount: 'FREE',
      validUntil: 'August 25, 2025',
      category: 'Trip Planning'
    }
  ];

  const categories = [
    { name: 'Photographer Deals', icon: '📸', count: 15 },
    { name: 'Tour Guide Discounts', icon: '🗺️', count: 8 },
    { name: 'Trip Planner Promo', icon: '📝', count: 12 },
    { name: 'Limited-Time Offers', icon: '🔥', count: 6 }
  ];

  const promotions = [
    {
      id: 1,
      title: 'Bali Sunrise Tour - 15% OFF',
      description: 'Enjoy guided hiking and photography included. Valid until September 10.',
      image: ImageService.getImageUrl('promotions/promotion1.jpg'),
      discount: '15% OFF',
      originalPrice: 100,
      discountedPrice: 85,
      location: 'Bali, Indonesia',
      validUntil: 'September 10, 2025',
      category: 'Photography',
      rating: 4.9,
      reviews: 127
    },
    {
      id: 2,
      title: 'Kuala Lumpur City Shots',
      description: 'Hire a local photographer and get 1 hour free! Valid for weekend bookings only.',
      image: ImageService.getImageUrl('promotions/promotion2.jpg'),
      discount: '+1 Hour FREE',
      originalPrice: 80,
      discountedPrice: 80,
      location: 'Kuala Lumpur, Malaysia',
      validUntil: 'September 30, 2025',
      category: 'Photography',
      rating: 4.8,
      reviews: 89
    },
    {
      id: 3,
      title: 'Vietnam Route Planning - Free!',
      description: 'Request a personalized travel plan for anywhere in Vietnam — this week only.',
      image: ImageService.getImageUrl('promotions/promotion3.jpg'),
      discount: 'FREE',
      originalPrice: 50,
      discountedPrice: 0,
      location: 'Vietnam',
      validUntil: 'August 15, 2025',
      category: 'Trip Planning',
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      title: 'Bangkok Street Food Tour',
      description: 'Discover hidden food gems with local foodie guide. 25% off for first-time bookers!',
      image: ImageService.getImageUrl('promotions/promotion1.jpg'),
      discount: '25% OFF',
      originalPrice: 60,
      discountedPrice: 45,
      location: 'Bangkok, Thailand',
      validUntil: 'August 20, 2025',
      category: 'Food Tour',
      rating: 4.9,
      reviews: 203
    },
    {
      id: 5,
      title: 'Kyoto Cultural Experience',
      description: 'Tea ceremony, temple visit, and traditional crafts. Early bird special!',
      image: ImageService.getImageUrl('promotions/promotion2.jpg'),
      discount: '30% OFF',
      originalPrice: 120,
      discountedPrice: 84,
      location: 'Kyoto, Japan',
      validUntil: 'September 5, 2025',
      category: 'Cultural',
      rating: 5.0,
      reviews: 74
    },
    {
      id: 6,
      title: 'Cappadocia Hot Air Balloon',
      description: 'Sunrise balloon ride with professional photography. Limited slots available!',
      image: ImageService.getImageUrl('promotions/promotion3.jpg'),
      discount: '10% OFF',
      originalPrice: 200,
      discountedPrice: 180,
      location: 'Cappadocia, Turkey',
      validUntil: 'August 25, 2025',
      category: 'Adventure',
      rating: 4.8,
      reviews: 312
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Photography': return 'bg-pink-100 text-pink-600 border-pink-200';
      case 'Trip Planning': return 'bg-green-100 text-green-600 border-green-200';
      case 'Food Tour': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Cultural': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Adventure': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero Section */}
      <section className="pt-0 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <section 
            className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 h-[380px] md:h-[440px] lg:h-[500px] flex py-12 items-center justify-center text-white rounded-3xl mb-12 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl"></div>
            <div className="relative z-10 text-center px-6 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
                Unlock Local Adventures with Exclusive Promotions 🎉
              </h1>
              <p className="text-sm md:text-base text-white/90 drop-shadow-md">
                From authentic photo sessions 📸 to guided cultural journeys 🏛️ and custom trip planning 📝 — explore our limited-time deals curated by trusted local hosts. Book smarter, travel deeper, and save more! ✨
              </p>
            </div>
          </section>
        </div>
      </section>

      {/* Promo Highlights */}
      <section className="container mx-auto px-4 md:px-6 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🔥 Promo Highlights
        </h2>
        <div className="space-y-8">
          {highlights.map((highlight) => (
            <div 
              key={highlight.id}
              className="flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden border-2 border-pink-100 hover:shadow-3xl transition-all duration-300 group"
            >
              <div className="relative md:w-1/3">
                <img 
                  src={highlight.image} 
                  alt={highlight.title}
                  className="w-full h-56 md:h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    {highlight.discount}
                  </span>
                </div>
              </div>
              <div className="p-8 md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border-2 ${getCategoryColor(highlight.category)}`}>
                      {highlight.category}
                    </span>
                    <span className="text-sm text-gray-500">⏰ Valid until {highlight.validUntil}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Hurry, limited time offer! 🏃‍♂️💨</span>
                  </div>
                  <Link 
                    href={`/promotions/${highlight.id}`}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Claim Promo 🚀
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Categories */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16 mx-4 md:mx-6 rounded-3xl border-2 border-purple-100 mb-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
            Browse by Category 📂
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center border-2 border-purple-100 group cursor-pointer transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                  {category.icon}
                </div>
                <h4 className="font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                  {category.name}
                </h4>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {category.count} deals
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Promotions Grid */}
      <section className="container mx-auto px-4 md:px-6 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🎯 All Active Promotions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promotion) => (
            <div 
              key={promotion.id}
              className="bg-white shadow-xl rounded-3xl overflow-hidden border-2 border-pink-100 hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 group"
            >
              <div className="relative">
                <img 
                  src={promotion.image} 
                  alt={promotion.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {promotion.discount}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getCategoryColor(promotion.category)}`}>
                    {promotion.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                  {promotion.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {promotion.description}
                </p>
                
                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    📍 {promotion.location}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-medium">{promotion.rating}</span>
                    <span className="text-gray-500">({promotion.reviews})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {promotion.discountedPrice > 0 ? (
                      <>
                        <span className="text-lg font-bold text-purple-600">${promotion.discountedPrice}</span>
                        <span className="text-sm text-gray-500 line-through">${promotion.originalPrice}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-green-600">FREE</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">⏰ Until {promotion.validUntil}</span>
                </div>
                
                <Link 
                  href={`/promotions/${promotion.id}`}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 block text-center"
                >
                  Claim Promo 🎉
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to Use Promo */}
      <section className="bg-white py-16 mx-4 md:mx-6 rounded-3xl shadow-xl border-2 border-pink-100 mb-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
            How to Use a Promotion 📋
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-purple-200">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-bold text-purple-600 mb-2">1. Browse</h3>
              <p className="text-sm text-gray-600">Browse and select a promo that suits your experience.</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-100 to-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-pink-200">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-bold text-pink-600 mb-2">2. Claim</h3>
              <p className="text-sm text-gray-600">Click "Claim Promo" to view details and terms.</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-200">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-bold text-orange-600 mb-2">3. Book</h3>
              <p className="text-sm text-gray-600">Book the service and apply the promo code if required.</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="font-bold text-green-600 mb-2">4. Enjoy</h3>
              <p className="text-sm text-gray-600">Get confirmation and enjoy your discounted experience!</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-50 py-16 mx-4 md:mx-6 rounded-3xl border-2 border-yellow-200 mb-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent text-center">
            FAQ: Promotions 🤔
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100">
                <h3 className="font-bold text-orange-700 mb-2">How do I apply a promo code? 🔑</h3>
                <p className="text-sm text-gray-700">Enter your promo code at checkout before completing payment.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100">
                <h3 className="font-bold text-orange-700 mb-2">Can I use multiple promos at once? 🤹‍♀️</h3>
                <p className="text-sm text-gray-700">Only one promo can be applied per booking, unless stated otherwise.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100">
                <h3 className="font-bold text-orange-700 mb-2">Do promos work for all locations? 🌍</h3>
                <p className="text-sm text-gray-700">Most promos are location-specific — check the details on each promotion card.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100">
                <h3 className="font-bold text-orange-700 mb-2">Are promos available for all hosts? 🏠</h3>
                <p className="text-sm text-gray-700">Only verified hosts participating in promo campaigns will appear on this page.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100">
                <h3 className="font-bold text-orange-700 mb-2">What happens after I claim a promo? ⚡</h3>
                <p className="text-sm text-gray-700">You'll be redirected to the experience page to complete booking using the offer.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100">
                <h3 className="font-bold text-orange-700 mb-2">How long are promos valid? ⏳</h3>
                <p className="text-sm text-gray-700">Each promo has a listed expiration date. Act fast before they expire!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white py-16 mx-4 md:mx-6 rounded-3xl shadow-2xl">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
            Get the Best of Local Experiences 🌟
          </h2>
          <p className="text-lg mb-8 text-white/90 leading-relaxed">
            Sign up today and receive exclusive offers from trusted local guides, photographers, and planners. Don't miss out on amazing deals! ✨
          </p>
          <Link 
            href="/register" 
            className="inline-block bg-white text-purple-600 font-bold px-8 py-4 rounded-full shadow-2xl hover:bg-yellow-300 hover:text-purple-700 hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 text-lg"
          >
            Register Now 🚀
          </Link>
          <div className="mt-8 flex justify-center space-x-4">
            <span className="text-2xl animate-bounce">💰</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.1s'}}>🎉</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>📸</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.3s'}}>🌍</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Promotion Statistics 📊
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl shadow-lg border-2 border-purple-100 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Active Promotions</div>
            <div className="text-2xl mt-2">🎯</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-3xl shadow-lg border-2 border-pink-100 text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">30%</div>
            <div className="text-sm text-gray-600">Average Savings</div>
            <div className="text-2xl mt-2">💰</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-3xl shadow-lg border-2 border-orange-100 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">1000+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
            <div className="text-2xl mt-2">😊</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-3xl shadow-lg border-2 border-green-100 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">25</div>
            <div className="text-sm text-gray-600">Cities Available</div>
            <div className="text-2xl mt-2">🌍</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PromotionsPage;
