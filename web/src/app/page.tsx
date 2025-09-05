'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StoryCard from '@/components/StoryCard';
import TestimonialCard from '@/components/TestimonialCard';
import ExperienceCard from '@/components/ExperienceCard';
import ExperienceSkeleton from '@/components/ExperienceSkeleton';
import TravelStoriesSection from '@/components/HomeTravelStoriesSection';
import NewsletterSubscription from '@/components/NewsletterSubscription';
// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useFeaturedExperiences } from '@/hooks/useExperiences';
import { useFavoriteCities } from '@/hooks/useCities';
import { useFeaturedStories } from '@/hooks/useStories';
import { useFeaturedTestimonials } from '@/hooks/useFeaturedTestimonials';
import CityCard from '@/components/CityCard';
import FeaturedHostCard from '@/components/FeaturedHostCard';
import FeaturedTestimonialCard from '@/components/FeaturedTestimonialCard';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { Experience } from '@/services/experienceAPI';
import SimpleImage from '@/components/SimpleImage';

// Type definitions
interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category: 'photography' | 'guide' | 'trip-planner' | 'combo';
  hostId: string;
}

interface Host {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  responseRate: number;
  responseTime: number;
  categories: { id: string; name: string; }[];
  toursCount: number;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  tourTitle: string;
}

const HomePage: React.FC = () => {
  // Use API hooks for experiences, cities, stories, featured hosts, testimonials
  const router = useRouter();

  // Handler for service category navigation
  const handleServiceCategoryClick = (categorySlug: string, categoryName: string) => {
    // Store the selected category in sessionStorage
    sessionStorage.setItem('selectedCategory', JSON.stringify({
      slug: categorySlug,
      name: categoryName
    }));
    
    // Navigate to explore page without URL parameters
    router.push('/explore');
  };

  
  const { experiences: featuredExperiences, loading: experiencesLoading, error: experiencesError } = useFeaturedExperiences(8);
  const { cities: favoriteCities, loading: citiesLoading, error: citiesError } = useFavoriteCities(6);
  
  // Remove problematic stories hooks temporarily for debugging
  const storiesLoading = false;
  const storiesError = null;
  
  const { testimonials: featuredTestimonials, loading: testimonialsLoading, error: testimonialsError } = useFeaturedTestimonials(3);
  
  // Direct implementation for featured hosts instead of hook
  const [featuredHosts, setFeaturedHosts] = useState<any[]>([]);
  const [hostsLoading, setHostsLoading] = useState(true);
  const [hostsError, setHostsError] = useState<string | null>(null);
  
  // Featured hosts fetch effect
  useEffect(() => {
    
    const loadFeaturedHosts = async () => {
      try {
        const response = await fetch('/api/featured-hosts/?limit=4');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setFeaturedHosts(data.data);
        } else {
          throw new Error('Invalid response');
        }
      } catch (error) {
        setHostsError('Failed to load featured hosts');
      } finally {
        setHostsLoading(false);
      }
    };
    
    loadFeaturedHosts();
  }, []);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [testimonials] = useState<Testimonial[]>([]);

  // All data loading is handled by hooks, no need for custom fetchData

  // Safe string rendering function to prevent object rendering errors
  const renderSafeString = (value: any, fallback: string = ''): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return String(value);
    if (value === null || value === undefined) return fallback;
    // For objects, return fallback to prevent React Error #31
    if (typeof value === 'object') {
      return fallback;
    }
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero + Search Section */}
      <section 
        className="relative min-h-[70vh] md:min-h-[60vh] flex flex-col justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-0"></div>
        <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 py-8 md:py-14 px-6 md:px-8 h-full">
          <div className="w-full md:w-1/2 flex flex-col justify-center h-full order-2 md:order-1 pr-0 md:pr-4">
            <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-5xl mb-4 md:mb-4 drop-shadow-2xl leading-tight text-center md:text-left">
              You Travel<br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">We Make It Epic ✨</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mb-6 md:mb-9 leading-relaxed text-center md:text-left drop-shadow-lg">
              Skip the basic tourist traps. Connect with local creators who actually know what's good 🔥
              <br className="hidden md:block" /><br className="hidden md:block" />
              <span className="hidden md:inline">📸 Need that perfect shot? Our photographers got you<br />
              🗺️ Want hidden gems? Our guides know the spots<br />
              ✈️ Too busy to plan? We'll handle everything<br /><br />
              Real locals. Real experiences. Zero cringe. �</span>
            </p>
            
            <SearchAutocomplete 
              className="mb-6 md:mb-8 max-w-full md:max-w-lg"
              placeholder="Where are you going? ✈️"
            />
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2 mb-4 md:mb-0 px-4 md:px-6">
            {/* Mobile: 2x2 Grid - Standard Layout */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto md:hidden">
              <SimpleImage
                imagePath="banners/europe.png"
                alt="Europe Travel"
                className="rounded-xl object-cover w-full h-32 shadow-md"
                category="banners"
              />
              <SimpleImage
                imagePath="banners/culture.png"
                alt="Cultural Experience"
                className="rounded-xl object-cover w-full h-32 shadow-md"
                category="banners"
              />
              <SimpleImage
                imagePath="banners/couple-traveller.png"
                alt="Couple Travellers"
                className="rounded-xl object-cover w-full h-32 shadow-md"
                category="banners"
              />
              <SimpleImage
                imagePath="banners/batucave.jpg"
                alt="Batu Cave Adventure"
                className="rounded-xl object-cover w-full h-32 shadow-md"
                category="banners"
              />
            </div>
            {/* Desktop: Pinterest-style Grid Layout */}
            <div className="hidden md:grid grid-cols-2 gap-4 max-w-xl mx-auto">
              {/* Kiri Atas - Landscape Rectangle */}
              <div className="relative group">
                <SimpleImage
                  imagePath="banners/europe.png"
                  alt="Europe Travel"
                  className="rounded-2xl object-cover w-full h-44 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105"
                  category="banners"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
              </div>
              
              {/* Kanan Atas - Landscape Rectangle */}
              <div className="relative group">
                <SimpleImage
                  imagePath="banners/culture.png"
                  alt="Cultural Experience"
                  className="rounded-2xl object-cover w-full h-44 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105"
                  category="banners"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
              </div>
              
              {/* Kiri Bawah - Landscape Rectangle */}
              <div className="relative group">
                <SimpleImage
                  imagePath="banners/couple-traveller.png"
                  alt="Couple Travellers"
                  className="rounded-2xl object-cover w-full h-44 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105"
                  category="banners"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
              </div>
              
              {/* Kanan Bawah - Landscape Rectangle */}
              <div className="relative group">
                <SimpleImage
                  imagePath="banners/batucave.jpg"
                  alt="Batu Cave Adventure"
                  className="rounded-2xl object-cover w-full h-44 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105"
                  category="banners"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Why we're different 💫</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border-2 border-purple-100">
              <span className="text-2xl md:text-3xl mb-2 animate-bounce">🌟</span>
              <h3 className="font-semibold text-base md:text-lg mb-2 md:mb-3 text-purple-600">Real Locals Only</h3>
              <p className="text-gray-600 text-sm md:text-base">Verified creators, not random tourists. Real reviews from real people ✅</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border-2 border-green-100">
              <span className="text-2xl md:text-3xl mb-2 animate-bounce" style={{animationDelay: '0.1s'}}>🔒</span>
              <h3 className="font-semibold text-base md:text-lg mb-2 md:mb-3 text-green-600">Secure & Simple</h3>
              <p className="text-gray-600 text-sm md:text-base">Pay safely online. Get refunded if things go wrong. No stress 💳</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border-2 border-pink-100">
              <span className="text-2xl md:text-3xl mb-2 animate-bounce" style={{animationDelay: '0.2s'}}>💬</span>
              <h3 className="font-semibold text-base md:text-lg mb-2 md:mb-3 text-pink-600">Always Connected</h3>
              <p className="text-gray-600 text-sm md:text-base">Chat with your host before and during your trip. 24/7 support when you need it 💬</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">Choose Your Service ✨</h2>
            <p className="text-lg md:text-xl text-gray-600 px-4">Explore our specialized local services tailored to your travel needs 🌟</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
            {/* Photographer */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-pink-100 transform hover:-translate-y-3">
              <div className="p-6 md:p-8 text-center h-full flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl md:text-3xl animate-bounce">📸</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-pink-600 mb-2 md:mb-3">Photographer</h3>
                <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base flex-grow">Get that perfect shot for your feed. Pro photographers who know the angles 📱✨</p>
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
                  <p>• Portrait & Lifestyle Photography</p>
                  <p>• Landmark & Street Photography</p>
                  <p>• Digital Photo Package Included</p>
                </div>
                <button onClick={() => handleServiceCategoryClick('photography', 'Photographer')} className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm md:text-base mt-auto text-center inline-block">
                  Find Photographers 📸
                </button>
              </div>
            </div>

            {/* Tour Guide */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-blue-100 transform hover:-translate-y-3">
              <div className="p-6 md:p-8 text-center h-full flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl md:text-3xl animate-bounce" style={{animationDelay: '0.1s'}}>🧑‍💼</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-2 md:mb-3">Tour Guide</h3>
                <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base flex-grow">Skip the tourist crowds. Local guides who know the actual cool spots 🔥</p>
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
                  <p>• Cultural & Historical Tours</p>
                  <p>• Hidden Gems & Local Spots</p>
                  <p>• Authentic Local Experiences</p>
                </div>
                <button onClick={() => handleServiceCategoryClick('tour-guide', 'Tour Guide')} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm md:text-base mt-auto text-center inline-block">
                  Find Tour Guides 🧭
                </button>
              </div>
            </div>

            {/* Combo */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-yellow-100 relative transform hover:-translate-y-3">
              <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 md:px-4 py-1 rounded-full text-xs font-bold animate-pulse">POPULAR ⭐</span>
              </div>
              <div className="p-6 md:p-8 text-center h-full flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl md:text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>🎁</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-yellow-600 mb-2 md:mb-3">Guide + Photography</h3>
                <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base flex-grow">Get the best of both worlds with guided tours and professional photography in one package 🌟</p>
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
                  <p>• Guided Tour + Photography</p>
                  <p>• Best Value Package Deal</p>
                  <p>• Complete Travel Experience</p>
                </div>
                <button onClick={() => handleServiceCategoryClick('combo-tour', 'Guide + Photography')} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm md:text-base mt-auto text-center inline-block">
                  Get Both 🎉
                </button>
              </div>
            </div>

            {/* Trip Planner */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-green-100 transform hover:-translate-y-3">
              <div className="p-6 md:p-8 text-center h-full flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl md:text-3xl animate-bounce" style={{animationDelay: '0.3s'}}>📝</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-green-600 mb-2 md:mb-3">Trip Planner</h3>
                <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base flex-grow">Plan your perfect multi-day adventure with custom itineraries tailored to your interests and budget 🗺️</p>
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
                  <p>• Custom Itinerary Planning</p>
                  <p>• Multi-day Trip Coordination</p>
                  <p>• Budget & Time Optimization</p>
                </div>
                <button onClick={() => handleServiceCategoryClick('trip-planner', 'Trip Planner')} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm md:text-base mt-auto text-center inline-block">
                  Find Planners 🎯
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Featured Experiences ⭐
            </h2>
            <p className="text-lg md:text-xl text-gray-600 px-4">
              Handpicked experiences from our top-rated local hosts
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 auto-rows-fr">
            {experiencesLoading ? (
              <ExperienceSkeleton count={8} />
            ) : experiencesError ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-500">Failed to load featured experiences: {experiencesError}</p>
              </div>
            ) : featuredExperiences.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No featured experiences available at the moment.</p>
              </div>
            ) : (
              featuredExperiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))
            )}
          </div>
          
          <div className="text-center mt-8 md:mt-12">
            <button 
              onClick={() => router.push('/explore')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              View All Experiences
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Favorite Cities */}
      <section className="py-12 md:py-14 bg-white border-t border-b">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-8">Favorite Cities</h2>
          <p className="text-center text-gray-500 mb-6 md:mb-8 text-sm md:text-base px-4">Explore the most popular destinations based on traveler choices</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {citiesLoading ? (
              <ExperienceSkeleton count={6} />
            ) : citiesError ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-500">Failed to load cities: {citiesError}</p>
              </div>
            ) : favoriteCities.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No cities available at the moment.</p>
              </div>
            ) : (
              favoriteCities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Expert Hosts Section */}
      <section id="expert-hosts" className="py-12 md:py-14 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">Meet Our Expert Hosts ✨</h2>
            <p className="text-white/90 text-base md:text-lg mb-6 md:mb-8 px-4">Connect with passionate locals who love sharing their culture and expertise 🌍</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {hostsLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="bg-white/10 backdrop-blur-md rounded-xl p-4 animate-pulse">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-1/2 mx-auto mb-3"></div>
                  <div className="h-3 bg-white/20 rounded w-full mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-2/3"></div>
                </div>
              ))
            ) : hostsError ? (
              <div className="col-span-full text-center text-white/80">
                <p>Unable to load featured hosts at the moment.</p>
              </div>
            ) : featuredHosts && featuredHosts.length > 0 ? (
              featuredHosts.map((host) => (
                <FeaturedHostCard key={host.id} host={host} />
              ))
            ) : (
              <div className="col-span-full text-center text-white/80">
                <p>No featured hosts available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How LocallyTrip Works */}
      <section className="py-12 md:py-14 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${process.env.NEXT_PUBLIC_IMAGES || 'http://localhost:3001/images'}/banners/europe.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 text-white drop-shadow">How LocallyTrip Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white bg-opacity-90 p-4 md:p-6 rounded-xl shadow flex flex-col items-center text-center">
              <span className="text-3xl md:text-4xl mb-2 md:mb-3">🔎</span>
              <h3 className="font-semibold mb-2 text-gray-900 text-base md:text-lg">Explore & Discover</h3>
              <p className="text-center text-gray-600 text-sm md:text-base">Find amazing hosts and services in cities you want to visit</p>
            </div>
            <div className="bg-white bg-opacity-90 p-4 md:p-6 rounded-xl shadow flex flex-col items-center text-center">
              <span className="text-3xl md:text-4xl mb-2 md:mb-3">🗓️</span>
              <h3 className="font-semibold mb-2 text-gray-900 text-base md:text-lg">Book & Pay</h3>
              <p className="text-center text-gray-600 text-sm md:text-base">Choose your dates, service type, and pay securely online</p>
            </div>
            <div className="bg-white bg-opacity-90 p-4 md:p-6 rounded-xl shadow flex flex-col items-center text-center">
              <span className="text-3xl md:text-4xl mb-2 md:mb-3">🚀</span>
              <h3 className="font-semibold mb-2 text-gray-900 text-base md:text-lg">Enjoy & Review</h3>
              <p className="text-center text-gray-600 text-sm md:text-base">Meet up, have the experience, and leave a review for others</p>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Stories */}
      <TravelStoriesSection />

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Travelers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from real travelers who've booked with LocallyTrip.com
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsLoading ? (
              // Loading skeleton for testimonials
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-3xl border-2 border-pink-100 shadow-xl overflow-hidden animate-pulse">
                  <div className="p-6">
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <div key={starIndex} className="w-5 h-5 bg-gray-300 rounded mr-1"></div>
                      ))}
                    </div>
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-20 bg-gray-300 rounded mb-6"></div>
                    <div className="h-12 bg-gray-300 rounded mb-4"></div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : testimonialsError ? (
              <div className="col-span-full text-center py-12">
                <div className="bg-red-50 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Testimonials</h3>
                  <p className="text-red-600">{testimonialsError}</p>
                </div>
              </div>
            ) : featuredTestimonials.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-50 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Testimonials Coming Soon</h3>
                  <p className="text-gray-600">We're collecting amazing reviews from our travelers. Check back soon!</p>
                </div>
              </div>
            ) : (
              featuredTestimonials.map((testimonial) => (
                <FeaturedTestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter & CTA */}
      <section id="newsletter" className="py-12 md:py-14 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">
            {/* Newsletter Subscription */}
            <div className="h-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  📬 Never Miss a Local Adventure
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                  Get weekly stories, new experiences, and exclusive offers delivered straight to your inbox.
                </p>
              </div>
              
              <NewsletterSubscription
                source="homepage"
                size="medium"
                showCategories={true}
                className="bg-white/80 backdrop-blur-sm"
                onSuccess={(requiresVerification) => {
                  // Toast notification is already handled in the component
                }}
                onError={(error) => {
                  // Toast notification is already handled in the component
                  console.error('Newsletter subscription error:', error);
                }}
              />
            </div>

            {/* Host CTA */}
            <div className="h-full flex items-center">
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 rounded-3xl p-6 md:p-8 w-full border-2 border-pink-200 shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl mb-4 font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Find your own local ✨</h3>
                  <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
                    Connect with local hosts for a truly unique experience. Book private tours, photography sessions, or custom trips — tailored just for you. 🌟
                  </p>
                </div>
                
                {/* Host Photos Grid */}
                <div className="grid grid-cols-4 gap-3 mb-6 max-w-sm mx-auto">
                  <SimpleImage
                    imagePath="admin-1.jpg"
                    alt="Host 1"
                    className="rounded-2xl object-cover w-full h-16 md:h-20 aspect-square border-2 border-pink-200 hover:border-purple-300 transition-colors"
                    category="users/avatars"
                  />
                  <SimpleImage
                    imagePath="admin-2.jpg"
                    alt="Host 2"
                    className="rounded-2xl object-cover w-full h-16 md:h-20 aspect-square border-2 border-pink-200 hover:border-purple-300 transition-colors"
                    category="users/avatars"
                  />
                  <SimpleImage
                    imagePath="admin-3.jpg"
                    alt="Host 3"
                    className="rounded-2xl object-cover w-full h-16 md:h-20 aspect-square border-2 border-pink-200 hover:border-purple-300 transition-colors"
                    category="users/avatars"
                  />
                  <SimpleImage
                    imagePath="admin-4.jpg"
                    alt="Host 4"
                    className="rounded-2xl object-cover w-full h-16 md:h-20 aspect-square border-2 border-pink-200 hover:border-purple-300 transition-colors"
                    category="users/avatars"
                  />
                </div>
                
                {/* CTA Button */}
                <div className="text-center">
                  <button 
                    onClick={() => router.push('/explore')}
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-2xl font-bold hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 inline-block text-sm md:text-base"
                  >
                    Explore Hosts 🚀
                  </button>
                </div>
                
                {/* Stats */}
                <div className="flex justify-center items-center mt-6 space-x-6 text-center">
                  <div>
                    <div className="text-lg md:text-xl font-bold text-purple-600">500+</div>
                    <div className="text-xs md:text-sm text-gray-600">Verified Hosts</div>
                  </div>
                  <div className="w-px h-8 bg-pink-300"></div>
                  <div>
                    <div className="text-lg md:text-xl font-bold text-pink-600">4.9★</div>
                    <div className="text-xs md:text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="w-px h-8 bg-pink-300"></div>
                  <div>
                    <div className="text-lg md:text-xl font-bold text-orange-600">50+</div>
                    <div className="text-xs md:text-sm text-gray-600">Cities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
