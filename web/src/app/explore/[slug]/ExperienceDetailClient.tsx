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

interface Props {
  slug: string;
}

export default function ExperienceDetailClient({ slug }: Props) {
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
          response = await experienceAPI.getExperienceBySlug(slug);
        } catch (err) {
          response = await experienceAPI.getExperienceById(slug);
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

    if (slug) {
      fetchExperience();
    }
  }, [slug]);

  // Redirect from itinerary tab if category is Photographer (ID 2)
  useEffect(() => {
    if (experience && activeTab === 'itinerary' && experience.category?.id === 2) {
      setActiveTab('overview');
    }
  }, [experience, activeTab]);

  // Share functions
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://locallytrip.com/explore/${slug}`;
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Check out this amazing experience: ${experience?.title}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Check out this amazing experience: ${experience?.title} #LocallyTrip #Travel`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Check out this amazing experience: ${experience?.title}`);
    window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      showSuccess('Link copied to clipboard!');
    } catch (err) {
      showError('Failed to copy link');
    }
  };

  // Handle booking form submission
  const handleBookingSubmit = async (bookingData: any) => {
    try {
      // Here you would typically send the booking data to your API
      console.log('Booking submitted:', bookingData);
      
      // For now, we'll just show a success message
      setBookingSuccess('Your booking has been submitted successfully!');
      setConfirmedBookingData(bookingData);
      
      // Scroll to confirmation
      setTimeout(() => {
        const confirmationElement = document.getElementById('booking-confirmation');
        if (confirmationElement) {
          confirmationElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (error) {
      console.error('Booking error:', error);
      showError('Failed to submit booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Experience Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The experience you are looking for could not be found.'}</p>
          <Link
            href="/explore"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const hostSlug = generateHostSlug(experience.host?.name || experience.hostName || '', experience.host?.id?.toString() || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/explore"
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Explore
              </Link>
              
              {/* Breadcrumb */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <Link href="/explore" className="hover:text-purple-600">
                  Explore
                </Link>
                <span>/</span>
                <a 
                  href="#"
                  onClick={handleCityClick}
                  className="hover:text-purple-600 cursor-pointer"
                >
                  {experience.city?.name}
                </a>
                <span>/</span>
                <span className="text-gray-900 truncate max-w-xs">
                  {experience.title}
                </span>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={shareToFacebook}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                title="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              
              <button
                onClick={shareToTwitter}
                className="p-2 text-gray-600 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50"
                title="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              
              <button
                onClick={shareToWhatsApp}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
                title="Share on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </button>
              
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                title="Copy link"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v4l3-3-3-3m8-5h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m0 0h-2m2 0V9l-3 3 3 3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Experience Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gray-200">
                  <SimpleImage
                    imagePath={experience.images?.[selectedImageIndex] || experience.coverImage || ''}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                    placeholderType="experience"
                    category={experience.category?.name}
                  />
                </div>
                
                {/* Image navigation dots */}
                {experience.images && experience.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {experience.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === selectedImageIndex
                            ? 'bg-white'
                            : 'bg-white/50 hover:bg-white/75'
                        } transition-colors`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnail strip */}
              {experience.images && experience.images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex space-x-2 overflow-x-auto">
                    {experience.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                          index === selectedImageIndex
                            ? 'border-purple-500'
                            : 'border-gray-200 hover:border-gray-300'
                        } transition-colors`}
                      >
                        <SimpleImage
                          imagePath={image}
                          alt={`${experience.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          placeholderType="experience"
                          category={experience.category?.name}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Experience Info */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {experience.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {experience.city?.name}, {experience.city?.country?.name}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {experience.rating ? (
                        <>
                          <span className="font-medium">{experience.rating.toFixed(1)}</span>
                          <span className="ml-1">({experience.totalReviews} reviews)</span>
                        </>
                      ) : (
                        <span>No reviews yet</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">
                    ${experience.price}
                  </div>
                  <div className="text-sm text-gray-600">per person</div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{experience.duration} hours</div>
                  <div className="text-xs text-gray-600">Duration</div>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Up to {experience.maxGuests}</div>
                  <div className="text-xs text-gray-600">Guests</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Available daily</div>
                  <div className="text-xs text-gray-600">Schedule</div>
                </div>
                <div className="text-center">
                  <Check className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{experience.difficulty}</div>
                  <div className="text-xs text-gray-600">Difficulty</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {['overview', 'itinerary', 'host', 'reviews'].map((tab) => {
                    // Skip itinerary tab for Photographer category (ID 2)
                    if (tab === 'itinerary' && experience.category?.id === 2) {
                      return null;
                    }
                    
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                          activeTab === tab
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About this experience</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {experience.description}
                    </p>
                  </div>

                  {experience.included && experience.included.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">What's included</h3>
                      <ul className="space-y-2">
                        {experience.included.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {experience.excluded && experience.excluded.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">What's not included</h3>
                      <ul className="space-y-2">
                        {experience.excluded.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0">
                              <div className="w-1 h-3 bg-red-500 mx-auto"></div>
                            </div>
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {experience.requirements && experience.requirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {experience.requirements.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'itinerary' && experience.category?.id !== 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Itinerary</h3>
                  {experience.itinerary && experience.itinerary.length > 0 ? (
                    <div className="space-y-6">
                      {experience.itinerary.map((step, index) => (
                        <div key={step.id || index} className="flex">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {step.stepNumber || index + 1}
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-base font-medium text-gray-900 mb-1">
                              {step.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {step.description}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {step.durationMinutes} minutes
                              {step.location && (
                                <>
                                  <MapPin className="w-3 h-3 ml-3 mr-1" />
                                  {step.location}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No detailed itinerary available.</p>
                  )}
                </div>
              )}

              {activeTab === 'host' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Meet your host</h3>
                  {experience.host ? (
                    <div className="flex items-start space-x-4">
                      <SimpleImage
                        imagePath={experience.host.avatar || experience.host.avatarUrl || ''}
                        alt={experience.host.name}
                        className="w-16 h-16 rounded-full object-cover"
                        placeholderType="profile"
                        name={experience.host.name}
                      />
                      <div className="flex-1">
                        <Link
                          href={`/hosts/${hostSlug}`}
                          className="text-lg font-semibold text-purple-600 hover:text-purple-700"
                        >
                          {experience.host.name}
                        </Link>
                        {experience.host.rating && (
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm text-gray-600">
                              {experience.host.rating.toFixed(1)} ({experience.host.totalReviews} reviews)
                            </span>
                          </div>
                        )}
                        {experience.host.bio && (
                          <p className="text-gray-600 mt-2 leading-relaxed">
                            {experience.host.bio}
                          </p>
                        )}
                        {experience.host.languages && experience.host.languages.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm font-medium text-gray-900">Languages: </span>
                            <span className="text-sm text-gray-600">
                              {experience.host.languages.map(lang => lang.name).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Host information not available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
                  {experience.reviews && experience.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {experience.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <SimpleImage
                              imagePath={review.reviewer.avatar}
                              alt={`${review.reviewer.firstName} ${review.reviewer.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                              placeholderType="profile"
                              name={`${review.reviewer.firstName} ${review.reviewer.lastName}`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  {review.reviewer.firstName} {review.reviewer.lastName}
                                </h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                                      }`}
                                      fill="currentColor"
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-600 mt-1 text-sm">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-gray-700 mt-2">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No reviews yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {bookingSuccess && confirmedBookingData ? (
                <div id="booking-confirmation">
                  <BookingConfirmation
                    bookingReference="TEMP_REF_12345"
                    experience={experience}
                    bookingDetails={confirmedBookingData}
                    onNewBooking={() => {
                      setBookingSuccess(null);
                      setConfirmedBookingData(null);
                    }}
                  />
                </div>
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

      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
