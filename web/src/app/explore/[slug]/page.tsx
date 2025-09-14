'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Clock, Calendar, Users, Check, AlertCircle } from 'lucide-react';
import { SimpleImage } from '@/components/SimpleImage';
import BookingForm from '@/components/BookingForm';
import BookingConfirmation from '@/components/BookingConfirmation';
import { ImageService } from '@/services/imageService';
import { experienceAPI, type Experience } from '@/services/experienceAPI';
import { generateHostSlug } from '@/utils/slugUtils';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/ui/Toast';

export default function ExperienceDetail() {
  const params = useParams();
  const experienceSlug = params?.slug as string;
  const router = useRouter();  
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);
  const { toast, showSuccess, showError, hideToast } = useToast();

  // 🎯 Handle city click for breadcrumb navigation
  const handleCityClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (experience?.city) {
      
      // Store city selection in sessionStorage for immediate pickup
      const cityData = {
        name: experience.city.name,
        slug: experience.city.slug || experience.city.name.toLowerCase().replace(/\s+/g, "-")
      };
      
      sessionStorage.setItem("selectedCity", JSON.stringify(cityData));
      
      // Navigate to explore page without URL parameters
      router.push("/explore");
    }
  };
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        
        // Try getExperienceBySlug first, if it fails try getExperienceById
        let response;
        try {
          response = await experienceAPI.getExperienceBySlug(experienceSlug);
        } catch (err) {
          response = await experienceAPI.getExperienceById(experienceSlug);
        }
        
        if (response.success) {
          setExperience(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch experience');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (experienceSlug) {
      fetchExperience();
    }
  }, [experienceSlug]);

  // Share functions
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://locallytrip.com/explore/${experienceSlug}`;
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Check out this amazing experience: ${experience?.title}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Check out this amazing experience: ${experience?.title} #LocallyTrip #Travel`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Check out this amazing experience: ${experience?.title}\n\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToTelegram = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Check out this amazing experience: ${experience?.title}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      showSuccess('Link copied to clipboard!');
    } catch (err) {
    }
  };

  // Handle booking submission
  const handleBookingSubmit = async (bookingData: any) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        setBookingSuccess(result.data.booking.bookingReference);
        setConfirmedBookingData(bookingData);
        // Optionally redirect to booking confirmation page
        // router.push(`/booking/confirmation/${result.data.booking.bookingReference}`);
      } else {
        throw new Error(result.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      showError(error instanceof Error ? error.message : 'Booking failed. Please try again.');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Experience Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/explore" 
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [experience.coverImage, ...(experience.images || [])].filter(Boolean) as string[];
  
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'Price on request';
    return `$${numPrice.toLocaleString()}`;
  };

  const formattedPrice = formatPrice(experience.price);

  const formatDuration = (duration: string | number): string => {
    if (!duration) return '';
    const hours = typeof duration === 'string' ? parseFloat(duration) : duration;
    if (isNaN(hours) || hours === 0) return '';
    
    if (hours === 1) return '1 hour';
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours === Math.floor(hours)) return `${hours} hours`;
    
    // Handle decimal hours (e.g., 2.5 hours = 2h 30min)
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) return `${wholeHours} hours`;
    return `${wholeHours}h ${minutes}min`;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCategorySpecificInfo = () => {
    const categorySlug = experience.category.slug;
    
    switch (categorySlug) {
      case 'trip-planner':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">⏱️</div>
              <p className="font-semibold text-gray-900">{formatDuration(experience.duration)}</p>
              <p className="text-sm text-gray-600">Delivery Time</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🔄</div>
              <p className="font-semibold text-gray-900">Up to 3</p>
              <p className="text-sm text-gray-600">Revisions</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">📁</div>
              <p className="font-semibold text-gray-900">PDF Format</p>
              <p className="text-sm text-gray-600">Final Delivery</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">💬</div>
              <p className="font-semibold text-gray-900">Online Chat</p>
              <p className="text-sm text-gray-600">Consultation</p>
            </div>
          </div>
        );
        
      case 'photographer':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">📷</div>
              <p className="font-semibold text-gray-900">{formatDuration(experience.duration)}</p>
              <p className="text-sm text-gray-600">Session Time</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">📸</div>
              <p className="font-semibold text-gray-900">20-40 Photos</p>
              <p className="text-sm text-gray-600">Edited Photos</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🎨</div>
              <p className="font-semibold text-gray-900">Professional Edit</p>
              <p className="text-sm text-gray-600">Color Grading</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">💾</div>
              <p className="font-semibold text-gray-900">Digital Gallery</p>
              <p className="text-sm text-gray-600">Online Access</p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">⏱️</div>
              <p className="font-semibold text-gray-900">{formatDuration(experience.duration)}</p>
              <p className="text-sm text-gray-600">Duration</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">👥</div>
              <p className="font-semibold text-gray-900">
                {experience.maxGuests ? `Up to ${experience.maxGuests}` : 'Small group'}
              </p>
              <p className="text-sm text-gray-600">Guests</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🎂</div>
              <p className="font-semibold text-gray-900">
                {experience.minAge && experience.minAge > 0 ? `${experience.minAge}+ years` : 'All ages'}
              </p>
              <p className="text-sm text-gray-600">Min Age</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">📍</div>
              <p className="font-semibold text-gray-900">Meet at</p>
              <p className="text-xs text-gray-600 leading-tight">{experience.meetingPoint || 'Details provided after booking'}</p>
            </div>
          </div>
        );
    }
  };

  const renderCTA = () => {
    const categorySlug = experience.category.slug;
    
    switch (categorySlug) {
      case 'trip-planner':
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Starting from</p>
                <p className="text-3xl font-bold text-gray-900 leading-none">{formattedPrice}</p>
                <p className="text-sm text-gray-600 mt-1">per custom itinerary</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span className="font-medium">
                    {experience.rating ? `${experience.rating}` : '4.9'}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({experience.totalReviews || '12'} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Travel dates</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-2" />
                    Select dates
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Travelers</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Users className="w-4 h-4 mr-2" />
                    1 traveler
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg">
              Start Planning
            </button>
            <p className="text-center text-sm text-gray-600 mt-3">Digital service • PDF delivery • 3 revisions included</p>
          </div>
        );
        
      case 'photographer':
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Starting from</p>
                <p className="text-3xl font-bold text-gray-900 leading-none">{formattedPrice}</p>
                <p className="text-sm text-gray-600 mt-1">per photoshoot</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span className="font-medium">
                    {experience.rating ? `${experience.rating}` : '4.9'}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({experience.totalReviews || '12'} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Session date</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-2" />
                    Select date
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">People</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Users className="w-4 h-4 mr-2" />
                    1 person
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg">
              Book Photoshoot
            </button>
            <p className="text-center text-sm text-gray-600 mt-3">20-40 edited photos • Digital gallery included</p>
          </div>
        );
        
      default:
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Starting from</p>
                <p className="text-3xl font-bold text-gray-900 leading-none">{formattedPrice}</p>
                <p className="text-sm text-gray-600 mt-1">per person</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span className="font-medium">
                    {experience.rating ? `${experience.rating}` : '4.9'}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({experience.totalReviews || '12'} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Check-in</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-2" />
                    Add dates
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Guests</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Users className="w-4 h-4 mr-2" />
                    1 guest
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg">
              Reserve
            </button>
            <p className="text-center text-sm text-gray-600 mt-3">You won't be charged yet</p>
            
            <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
              <div className="flex items-center text-sm">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                <span>Free cancellation for 48 hours</span>
              </div>
              <div className="flex items-center text-sm">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                <span>Instant confirmation</span>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderStars = (rating?: number | string) => {
    if (!rating) return null;
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (isNaN(numRating)) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(numRating) ? 'text-yellow-500' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const formatRating = (rating?: number | string) => {
    if (!rating) return 'New';
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (isNaN(numRating)) return 'New';
    return numRating.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Airbnb-Style Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm py-4 border-b border-gray-100">
          <Link href="/" className="text-purple-600 hover:text-purple-800 font-medium">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/explore" className="text-purple-600 hover:text-purple-800 font-medium">
            Explore
          </Link>
          <span className="text-gray-400">/</span>
          <a 
            href="/explore"
            onClick={handleCityClick}
            className="text-purple-600 hover:text-purple-800 font-medium cursor-pointer"
          >
            {experience.city?.name || 'City'}
          </a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 truncate">{experience.title}</span>
        </nav>
        
        {/* Title Section - Matches Airbnb */}
        <div className="pt-6 pb-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 flex-1 mr-4">
              {experience.title}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-black text-black" />
              <span className="font-medium">
                {experience.rating ? formatRating(experience.rating) : '4.9'}
              </span>
              <span className="text-gray-600">
                ({experience.totalReviews ? `${experience.totalReviews} reviews` : '12 reviews'})
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">
                {experience.city?.name || 'Location TBD'}{experience.city?.country?.name ? `, ${experience.city.country.name}` : ''}
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(experience.difficulty)}`}>
              {experience.difficulty}
            </span>
          </div>
        </div>

        {/* Photo Gallery Section - Airbnb Style dengan Presisi Lebih Baik */}
        <div className="relative mb-8">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-xl overflow-hidden">
            {/* Main large image - takes left half */}
            <div 
              className="col-span-2 row-span-2 relative group overflow-hidden cursor-pointer"
              onClick={() => setSelectedImageIndex(0)}
            >
              <SimpleImage
                imagePath={allImages[0] || 'placeholder-experience.jpg'}
                alt={experience.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                placeholderType="experience"
                category="experiences"
                name={experience.title}
                width={800}
                height={400}
              />
              {selectedImageIndex === 0 && (
                <div className="absolute inset-0 ring-4 ring-purple-600"></div>
              )}
            </div>

            {/* Top right images */}
            <div 
              className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer"
              onClick={() => setSelectedImageIndex(1)}
            >
              <SimpleImage
                imagePath={allImages[1] || 'placeholder-experience.jpg'}
                alt={`${experience.title} 2`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                placeholderType="experience"
                category="experiences"
                name={experience.title}
                width={400}
                height={200}
              />
              {selectedImageIndex === 1 && (
                <div className="absolute inset-0 ring-4 ring-purple-600"></div>
              )}
            </div>
            <div 
              className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer"
              onClick={() => setSelectedImageIndex(2)}
            >
              <SimpleImage
                imagePath={allImages[2] || 'placeholder-experience.jpg'}
                alt={`${experience.title} 3`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                placeholderType="experience"
                category="experiences"
                name={experience.title}
                width={400}
                height={200}
              />
              {selectedImageIndex === 2 && (
                <div className="absolute inset-0 ring-4 ring-purple-600"></div>
              )}
            </div>

            {/* Bottom right images */}
            <div 
              className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer"
              onClick={() => setSelectedImageIndex(3)}
            >
              <SimpleImage
                imagePath={allImages[3] || 'placeholder-experience.jpg'}
                alt={`${experience.title} 4`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                placeholderType="experience"
                category="experiences"
                name={experience.title}
                width={400}
                height={200}
              />
              {selectedImageIndex === 3 && (
                <div className="absolute inset-0 ring-4 ring-purple-600"></div>
              )}
            </div>
            <div 
              className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer"
              onClick={() => setSelectedImageIndex(4)}
            >
              <SimpleImage
                imagePath={allImages[4] || 'placeholder-experience.jpg'}
                alt={`${experience.title} 5`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                placeholderType="experience"
                category="experiences"
                name={experience.title}
                width={400}
                height={200}
              />
              {selectedImageIndex === 4 && (
                <div className="absolute inset-0 ring-4 ring-purple-600"></div>
              )}
              {allImages.length > 5 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white font-semibold">+{allImages.length - 5} more</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'itinerary', 'inclusions', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'inclusions' ? 'What\'s Included' : tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content - Left Right Split dengan Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Content - 2 columns dengan Tab Content */}
          <div className="lg:col-span-2">
            
            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Host Section */}
                <div className="flex items-center space-x-4 pb-8 border-b border-gray-200">
                  {experience.host ? (
                    <Link 
                      href={`/hosts/${generateHostSlug(experience.host.name, experience.host.id.toString())}`}
                      className="block w-14 h-14 rounded-full overflow-hidden hover:scale-105 transition-transform duration-200 border-2 border-gray-200"
                    >
                      <SimpleImage
                        imagePath={experience.host.avatar || 'default-avatar.jpg'}
                        alt={experience.host.name || 'Host'}
                        className="w-full h-full object-cover object-center transform scale-125 cursor-pointer"
                        placeholderType="profile"
                        category="users/avatars"
                        name={experience.host.name || 'Host'}
                        width={56}
                        height={56}
                      />
                    </Link>
                  ) : (
                    <SimpleImage
                      imagePath={'default-avatar.jpg'}
                      alt={'Unknown Host'}
                      className="w-14 h-14 rounded-full object-cover cursor-pointer"
                      placeholderType="profile"
                      category="users/avatars"
                      name={'Unknown Host'}
                      width={56}
                      height={56}
                    />
                  )}
                  <div className="flex-1">
                    {experience.host ? (
                      <>
                        <Link 
                          href={`/hosts/${generateHostSlug(experience.host.name, experience.host.id.toString())}`}
                          className="hover:text-purple-600 transition-colors duration-200"
                        >
                          <p className="text-lg font-semibold text-gray-900 hover:text-purple-600 cursor-pointer">
                            Hosted by {experience.host.name}
                          </p>
                        </Link>
                        {experience.host.bio && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {experience.host.bio}
                          </p>
                        )}
                        <div className="flex items-center space-x-1 mt-2">
                          {experience.host?.rating && renderStars(experience.host.rating)}
                          {experience.host?.rating && (
                            <span className="text-sm text-gray-600 ml-2">
                              {formatRating(experience.host.rating)} • {experience.host?.totalReviews || 0} reviews
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">
                        Hosted by Unknown
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">About this experience</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {experience.description || experience.shortDescription}
                  </p>
                </div>

                {/* Category-specific info */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Experience details</h2>
                  {renderCategorySpecificInfo()}
                </div>

                {/* Additional Experience Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Experience Type */}
                  {(experience as any).experienceType && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Experience Type
                      </h3>
                      <p className="font-medium text-blue-900">{(experience as any).experienceType.name}</p>
                      <p className="text-sm text-blue-700 mt-1">{(experience as any).experienceType.description}</p>
                    </div>
                  )}

                  {/* Fitness & Activity Level */}
                  {(experience as any).fitnessLevel && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Fitness Level
                      </h3>
                      <p className="font-medium text-green-900">{(experience as any).fitnessLevel}</p>
                      {(experience as any).walkingDistance && parseFloat((experience as any).walkingDistance) > 0 && (
                        <p className="text-sm text-green-700 mt-1">
                          Walking distance: {(experience as any).walkingDistance} km
                        </p>
                      )}
                    </div>
                  )}

                  {/* Equipment Used */}
                  {(experience as any).equipmentUsed && (experience as any).equipmentUsed.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        Equipment Provided
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(experience as any).equipmentUsed.map((item: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span className="text-sm text-purple-900">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ending Point */}
                  {(experience as any).endingPoint && (experience as any).endingPoint !== 'Original departure point' && (
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 border md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <MapPin className="w-5 h-5 text-orange-600 mr-3" />
                        Ending Point
                      </h3>
                      <p className="text-orange-900">{(experience as any).endingPoint}</p>
                    </div>
                  )}
                </div>

                {/* Host Information & Specialties */}
                {(experience as any).hostSpecificData && (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                      Host Specialties & Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(experience as any).hostSpecificData.languagesSpoken && (
                        <div>
                          <p className="font-medium text-gray-900">Languages Spoken</p>
                          <p className="text-sm text-gray-700">{(experience as any).hostSpecificData.languagesSpoken.join(', ')}</p>
                        </div>
                      )}
                      {(experience as any).hostSpecificData.specialtyAreas && (
                        <div>
                          <p className="font-medium text-gray-900">Specialty Areas</p>
                          <p className="text-sm text-gray-700">{(experience as any).hostSpecificData.specialtyAreas.join(', ')}</p>
                        </div>
                      )}
                      {(experience as any).hostSpecificData.vehicleType && (
                        <div>
                          <p className="font-medium text-gray-900">Transportation</p>
                          <p className="text-sm text-gray-700">{(experience as any).hostSpecificData.vehicleType}</p>
                        </div>
                      )}
                      {(experience as any).hostSpecificData.groupSizePreference && (
                        <div>
                          <p className="font-medium text-gray-900">Group Size</p>
                          <p className="text-sm text-gray-700">{(experience as any).hostSpecificData.groupSizePreference} groups preferred</p>
                        </div>
                      )}
                      {typeof (experience as any).hostSpecificData.flexibleTiming !== 'undefined' && (
                        <div>
                          <p className="font-medium text-gray-900">Schedule Flexibility</p>
                          <p className="text-sm text-gray-700">
                            {(experience as any).hostSpecificData.flexibleTiming ? '✅ Flexible timing available' : '⏰ Fixed schedule only'}
                          </p>
                        </div>
                      )}
                      {typeof (experience as any).hostSpecificData.transportationIncluded !== 'undefined' && (
                        <div>
                          <p className="font-medium text-gray-900">Transportation</p>
                          <p className="text-sm text-gray-700">
                            {(experience as any).hostSpecificData.transportationIncluded ? '✅ Transportation included' : '❌ Transportation not included'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {experience.category.slug === 'trip-planner' ? 'Service Process' : 'Experience Itinerary'}
                </h2>
                {/* Itinerary Content */}
                {(experience as any).itinerary && (experience as any).itinerary.length > 0 ? (
                  <div className="space-y-6">
                    {(experience as any).itinerary.map((item: any, index: number) => (
                      <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {item.stepNumber || index + 1}
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-700 mb-3">{item.description}</p>
                            {item.durationMinutes && (
                              <p className="text-sm text-purple-600 font-medium">
                                ⏱️ {item.durationMinutes > 60 
                                  ? `${Math.floor(item.durationMinutes / 60)}h ${item.durationMinutes % 60}min`
                                  : `${item.durationMinutes} minutes`
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="border rounded-lg p-6 bg-white shadow-sm">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          1
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Meet & Greet</h3>
                          <p className="text-gray-700 mb-3">Welcome and introduction to the experience</p>
                          <p className="text-sm text-purple-600 font-medium">⏱️ 15 minutes</p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-6 bg-white shadow-sm">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          2
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Main Activity</h3>
                          <p className="text-gray-700 mb-3">{experience.description || experience.shortDescription}</p>
                          <p className="text-sm text-purple-600 font-medium">⏱️ {formatDuration(experience.duration)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'inclusions' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">What's Included & Not Included</h2>
                
                {/* What's Included */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 text-green-700">✓ What's Included</h3>
                  {experience.included && experience.included.length > 0 ? (
                    <div className="space-y-2">
                      {experience.included.map((item: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Professional guidance and instruction</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">All necessary equipment provided</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Small group experience</span>
                      </div>
                    </div>
                  )}

                  {/* Additional Deliverables from Backend */}
                  {(experience as any).deliverables && Object.keys((experience as any).deliverables).some(key => (experience as any).deliverables[key] === true) && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Deliverables</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries((experience as any).deliverables).map(([key, value]) => {
                          if (value === true) {
                            const displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            return (
                              <div key={key} className="flex items-start space-x-3">
                                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{displayName}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* What's Not Included */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 text-red-700">✗ What's Not Included</h3>
                  {experience.excluded && experience.excluded.length > 0 ? (
                    <div className="space-y-2">
                      {experience.excluded.map((item: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Transportation to meeting point</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Personal expenses</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Gratuities (optional)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Requirements if any */}
                {(experience as any).requirements && (experience as any).requirements.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Requirements & Important Notes</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="ml-3">
                          <ul className="list-disc list-inside space-y-1 text-yellow-800">
                            {(experience as any).requirements.map((req: string, index: number) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
                
                {/* Overall Rating */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">
                        {experience.rating ? formatRating(experience.rating) : '4.9'}
                      </div>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        {renderStars(experience.rating || 4.9)}
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {experience.totalReviews || experience.reviews?.length || '12'} reviews
                      </p>
                      <p className="text-gray-600">Based on verified bookings</p>
                    </div>
                  </div>
                </div>

                {/* Reviews from Database */}
                <div className="space-y-6">
                  {experience.reviews && experience.reviews.length > 0 ? (
                    experience.reviews.map((review: any) => (
                      <div key={review.id} className="border rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {review.reviewer?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{review.reviewer?.name || 'Anonymous'}</h4>
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-500">
                                • {new Date(review.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            {review.title && (
                              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                            )}
                            {review.comment && (
                              <p className="text-gray-700">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // No reviews available - Database only, no static fallback
                    <div className="text-center py-12">
                      <div className="text-gray-500 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                            d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                      <p className="text-gray-600">Be the first to review this experience!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Content - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {bookingSuccess && confirmedBookingData ? (
                <BookingConfirmation
                  bookingReference={bookingSuccess}
                  experience={experience}
                  bookingDetails={confirmedBookingData.bookingDetails}
                  onNewBooking={() => {
                    setBookingSuccess(null);
                    setConfirmedBookingData(null);
                  }}
                />
              ) : (
                <BookingForm 
                  experience={experience} 
                  onBookingSubmit={handleBookingSubmit}
                />
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Margin bottom sebelum footer */}
      <div className="mb-16"></div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
