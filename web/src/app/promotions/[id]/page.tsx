'use client';

import React, { useState } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Mock data for demonstration - in real app, this would come from API
const promotions = {
  '1': {
    id: 1,
    title: 'Bali Sunrise Tour - 15% OFF',
    description: 'Enjoy guided hiking and photography included. Valid until September 10.',
    fullDescription: `
      Experience the magic of Bali at sunrise with our exclusive guided tour! This amazing promotion gives you 15% off our most popular morning adventure.
      
      What's included:
      • Professional local guide
      • Early morning pickup from your hotel
      • Hiking equipment and safety gear
      • Professional photography session
      • Traditional breakfast with local coffee
      • Small group experience (max 8 people)
      
      Our experienced guide Made will take you to the best sunrise viewpoint on Mount Batur, where you'll witness one of the most spectacular sunrises in Indonesia. The hike takes about 2 hours, suitable for beginners, and you'll be rewarded with breathtaking views and incredible photo opportunities.
      
      This promotion is valid for bookings made before September 10, 2025, and can be used for tours until December 31, 2025.
    `,
    image: 'promotions/promotion1.jpg',
    gallery: [
      'promotions/promotion1.jpg',
      'promotions/promotion2.jpg',
      'promotions/promotion3.jpg',
      'promotions/promotion4.jpg'
    ],
    discount: '15% OFF',
    originalPrice: 100,
    discountedPrice: 85,
    savings: 15,
    location: 'Bali, Indonesia',
    validUntil: 'September 10, 2025',
    category: 'Photography',
    rating: 4.9,
    reviews: 127,
    promoCode: 'BALISUNRISE15',
    hostName: 'Made Wirawan',
    hostImage: 'hosts/host1.jpg',
    hostRating: 4.9,
    hostExperiences: 156,
    duration: '4 hours',
    groupSize: '8 people max',
    difficulty: 'Beginner',
    includes: [
      'Professional local guide',
      'Hotel pickup and drop-off',
      'Hiking equipment',
      'Photography session',
      'Traditional breakfast',
      'Coffee and refreshments'
    ],
    highlights: [
      'Watch spectacular sunrise from Mount Batur',
      'Professional photography with stunning backdrops',
      'Learn about Balinese culture and traditions',
      'Small group for personalized experience',
      'Traditional breakfast with local coffee',
      'Safe and well-maintained hiking trails'
    ]
  }
};

interface PageProps {
  params: {
    id: string;
  };
}

const PromotionDetailPage: React.FC<PageProps> = ({ params }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const promotion = promotions[params.id as keyof typeof promotions];

  if (!promotion) {
    notFound();
  }

  const copyPromoCode = async () => {
    try {
      await navigator.clipboard.writeText(promotion.promoCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Photography': return 'bg-pink-100 text-pink-600 border-pink-200';
      case 'Cultural': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Trip Planning': return 'bg-green-100 text-green-600 border-green-200';
      case 'Food Tour': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Adventure': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero Image */}
      <section className="relative">
        <div className="container mx-auto px-4 md:px-6 pt-0 pb-8">
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={promotion.gallery[selectedImage]} 
              alt={promotion.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Discount Badge */}
            <div className="absolute top-6 left-6">
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-2xl animate-pulse">
                {promotion.discount}
              </span>
            </div>

            {/* Category Badge */}
            <div className="absolute top-6 right-6">
              <span className={`px-4 py-2 text-sm font-bold rounded-full border-2 bg-white/20 backdrop-blur-sm text-white border-white/30`}>
                {promotion.category} 📸
              </span>
            </div>
            
            {/* Promotion Meta Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                {promotion.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                <span className="flex items-center gap-1">
                  📍 {promotion.location}
                </span>
                <span className="flex items-center gap-1">
                  ⏰ Valid until {promotion.validUntil}
                </span>
                <span className="flex items-center gap-1">
                  ⭐ {promotion.rating} ({promotion.reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
            {promotion.gallery.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-3 transition-all duration-200 ${
                  selectedImage === index 
                    ? 'border-purple-500 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Promo Code Section */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl shadow-xl p-8 border-2 border-red-100 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  🎉 Exclusive Promo Code
                </h2>
                <p className="text-gray-700 mb-6">
                  Use this code at checkout to get your discount! Copy the code below:
                </p>
                
                <div className="bg-white rounded-2xl p-6 border-2 border-red-200 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">Promo Code:</span>
                    <span className="text-xs text-gray-500">Click to copy 👆</span>
                  </div>
                  
                  <button
                    onClick={copyPromoCode}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold text-2xl py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {promotion.promoCode}
                  </button>
                  
                  {copiedCode && (
                    <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-xl text-center font-medium animate-pulse">
                      ✅ Code copied to clipboard!
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white p-4 rounded-2xl border-2 border-red-100">
                    <div className="text-2xl font-bold text-red-600">${promotion.savings}</div>
                    <div className="text-sm text-gray-600">You Save</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border-2 border-red-100">
                    <div className="text-2xl font-bold text-green-600">${promotion.discountedPrice}</div>
                    <div className="text-sm text-gray-600">Final Price</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <article className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2 border-pink-100 mb-8">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                About This Experience 📋
              </h2>
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: promotion.fullDescription }}
                />
              </div>
            </article>

            {/* What's Included */}
            <section className="bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-100 mb-8">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                What's Included ✨
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promotion.includes.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200"
                  >
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights */}
            <section className="bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-100 mb-8">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Experience Highlights 🌟
              </h2>
              <div className="space-y-4">
                {promotion.highlights.map((highlight, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200"
                  >
                    <span className="text-yellow-500 text-xl mt-0.5">🌟</span>
                    <span className="text-gray-700 leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Terms & Conditions */}
            <section className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-xl p-8 border-2 border-gray-200">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">
                Terms & Conditions 📜
              </h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Promotion valid until {promotion.validUntil}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Promo code must be applied at checkout</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Cannot be combined with other offers</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Booking must be confirmed within 24 hours</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Cancellation policy applies as per standard terms</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Subject to availability and weather conditions</span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-pink-100 mb-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-purple-600">${promotion.discountedPrice}</span>
                  <span className="text-lg text-gray-500 line-through">${promotion.originalPrice}</span>
                </div>
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Save ${promotion.savings}!
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{promotion.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Group Size:</span>
                  <span className="font-medium">{promotion.groupSize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium">{promotion.difficulty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium">⭐ {promotion.rating} ({promotion.reviews} reviews)</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mb-4">
                Book Now with Promo 🎉
              </button>
              
              <div className="text-center text-xs text-gray-500">
                ⏰ Promo expires in 15 days!
              </div>
            </div>

            {/* Host Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl p-6 border-2 border-purple-100">
              <h3 className="font-bold text-gray-800 mb-4">Your Host 🌟</h3>
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={promotion.hostImage} 
                  alt={promotion.hostName}
                  className="w-16 h-16 rounded-full object-cover border-3 border-purple-200 shadow-lg"
                />
                <div>
                  <h4 className="font-bold text-purple-700">{promotion.hostName}</h4>
                  <div className="text-sm text-gray-600">
                    ⭐ {promotion.hostRating} • {promotion.hostExperiences} experiences
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Professional local guide specializing in sunrise tours and photography. Made has been sharing the beauty of Bali with travelers for over 5 years.
              </p>
              <button className="w-full border-2 border-purple-300 text-purple-600 py-2 rounded-full font-medium hover:bg-purple-50 transition-colors">
                View Host Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailPage;
