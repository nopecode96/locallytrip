'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Clock, Calendar, Users, Check, AlertCircle, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Share2, Copy } from 'lucide-react';
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
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentModalImageIndex, setCurrentModalImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Image modal functions
  const openImageModal = (index: number) => {
    setCurrentModalImageIndex(index);
    setShowImageModal(true);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    document.body.style.overflow = 'unset'; // Restore scroll
  };

  const nextImage = () => {
    if (experience && allImages.length > 0) {
      setCurrentModalImageIndex((prev) => (prev + 1) % allImages.length);
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const prevImage = () => {
    if (experience && allImages.length > 0) {
      setCurrentModalImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showImageModal) {
        switch (e.key) {
          case 'Escape':
            closeImageModal();
            break;
          case 'ArrowLeft':
            prevImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          case '+':
          case '=':
            e.preventDefault();
            zoomIn();
            break;
          case '-':
            e.preventDefault();
            zoomOut();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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

  // 🎯 Meta SEO Management - Update meta tags dynamically when experience data loads
  useEffect(() => {
    if (experience) {
      // Generate Meta Title: Title + " | LocallyTriip"
      const metaTitle = `${experience.title} | LocallyTrip`;
      
      // Generate Meta Description from shortDescription
      const metaDescription = experience.shortDescription || 
        (experience.description ? experience.description.substring(0, 160) : '') || 
        'Discover authentic local experiences with verified hosts';
      
      // Generate Meta Keywords from Experience Type and Location
      const keywords = [];
      if (experience.experienceType?.name) {
        keywords.push(experience.experienceType.name);
      }
      if (experience.category?.name) {
        keywords.push(experience.category.name);
      }
      if (experience.city?.name) {
        keywords.push(experience.city.name);
      }
      if (experience.city?.country?.name) {
        keywords.push(experience.city.country.name);
      }
      keywords.push('LocallyTrip', 'local experience', 'travel', 'authentic experience', 'verified host');
      const metaKeywords = keywords.join(', ');

      // Update document title
      document.title = metaTitle;
      
      // Helper function to update or create meta tag
      const updateMetaTag = (name: string, content: string) => {
        let metaTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.name = name;
          document.head.appendChild(metaTag);
        }
        metaTag.content = content;
      };

      // Helper function to update or create Open Graph tag
      const updateOGTag = (property: string, content: string) => {
        let ogTag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!ogTag) {
          ogTag = document.createElement('meta');
          ogTag.setAttribute('property', property);
          document.head.appendChild(ogTag);
        }
        ogTag.content = content;
      };

      // Update basic meta tags
      updateMetaTag('description', metaDescription);
      updateMetaTag('keywords', metaKeywords);
      
      // Generate image URL for social sharing
      const ogImage = experience.coverImage 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${experience.coverImage}`
        : `${window.location.origin}/favicon.svg`;

      // Update Open Graph tags
      updateOGTag('og:title', metaTitle);
      updateOGTag('og:description', metaDescription);
      updateOGTag('og:image', ogImage);
      updateOGTag('og:url', window.location.href);
      updateOGTag('og:type', 'website');
      updateOGTag('og:site_name', 'LocallyTrip');

      // Update Twitter Card tags
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:title', metaTitle);
      updateMetaTag('twitter:description', metaDescription);
      updateMetaTag('twitter:image', ogImage);
      updateMetaTag('twitter:creator', '@locallytrip');

      // Add or update structured data (JSON-LD)
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": experience.title,
        "description": experience.shortDescription || experience.description,
        "image": ogImage,
        "brand": {
          "@type": "Organization",
          "name": "LocallyTrip"
        },
        "provider": {
          "@type": "Person",
          "name": experience.host?.name || 'Local Host',
          "image": experience.host?.avatar || experience.host?.avatarUrl
        },
        "offers": {
          "@type": "Offer",
          "price": experience.price || 0,
          "priceCurrency": experience.currency || "USD",
          "availability": experience.status === 'active' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": window.location.href
        },
        "aggregateRating": experience.rating ? {
          "@type": "AggregateRating",
          "ratingValue": experience.rating,
          "reviewCount": experience.totalReviews || 0,
          "bestRating": 5,
          "worstRating": 1
        } : undefined,
        "category": experience.category?.name,
        "duration": `PT${experience.duration || 1}H`,
        "location": {
          "@type": "Place",
          "name": experience.city?.name,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": experience.city?.country?.name,
            "addressLocality": experience.city?.name
          }
        }
      };

      // Update or create structured data script
      let structuredDataScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script') as HTMLScriptElement;
        structuredDataScript.type = 'application/ld+json';
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(structuredData);
    }
  }, [experience]);
  
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

  const shareToInstagram = () => {
    // Instagram doesn't support direct URL sharing, copy to clipboard
    const text = `Check out this amazing experience: ${experience?.title}\n\n${getShareUrl()}\n\n#LocallyTrip #TravelExperience #LocalGuide`;
    navigator.clipboard.writeText(text);
    showSuccess('Content copied! Paste it in your Instagram story or post.');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Check out this amazing experience: ${experience?.title}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
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

  // Status access control - check for restricted statuses
  const restrictedStatuses = ['deleted', 'rejected', 'suspended'];
  if (restrictedStatuses.includes(experience.status)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            {experience.status === 'deleted' && 'This experience has been deleted and is no longer available.'}
            {experience.status === 'rejected' && 'This experience is currently under revision and not available for viewing.'}
            {experience.status === 'suspended' && 'This experience has been temporarily suspended and is not available.'}
          </p>
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

  // Function to get status badge configuration
  const getStatusBadge = () => {
    switch (experience.status) {
      case 'draft':
        return {
          text: 'Draft',
          emoji: '📝',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'pending_review':
        return {
          text: 'Under Review',
          emoji: '⏳',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'paused':
        return {
          text: 'Paused',
          emoji: '⏸️',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return null; // No badge for published status
    }
  };

  const statusBadge = getStatusBadge();

  const allImages = [experience.coverImage, ...(experience.images || [])].filter(Boolean) as string[];
  
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'Price on request';
    
    // Format currency based on experience currency
    const currency = experience.currency || 'IDR';
    if (currency === 'IDR') {
      return `Rp ${numPrice.toLocaleString('id-ID')}`;
    } else if (currency === 'USD') {
      return `$${numPrice.toLocaleString()}`;
    }
    return `${currency} ${numPrice.toLocaleString()}`;
  };

  // Use pricePerPackage from database instead of price
  const formattedPrice = formatPrice((experience as any).pricePerPackage || experience.price || 0);

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

  const getExperienceTypeColor = (experienceTypeName: string): string => {
    switch (experienceTypeName?.toLowerCase()) {
      case 'budget planning': return 'bg-green-100 text-green-800';
      case 'portrait session': return 'bg-blue-100 text-blue-800';
      case 'couple tour': return 'bg-pink-100 text-pink-800';
      case 'family tour': return 'bg-purple-100 text-purple-800';
      case 'cultural experience': return 'bg-amber-100 text-amber-800';
      case 'adventure tour': return 'bg-red-100 text-red-800';
      case 'food experience': return 'bg-orange-100 text-orange-800';
      case 'nature tour': return 'bg-emerald-100 text-emerald-800';
      case 'city exploration': return 'bg-indigo-100 text-indigo-800';
      case 'photography workshop': return 'bg-teal-100 text-teal-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const renderCategorySpecificInfo = () => {
    const categorySlug = experience.category.slug;
    const categoryName = experience.category.name;
    
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
              <p className="font-semibold text-gray-900">
                {((experience as any).hostSpecificData?.revisionRoundsIncluded) || 'Revisions'}
              </p>
              <p className="text-sm text-gray-600">Included</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">📁</div>
              <p className="font-semibold text-gray-900">PDF Format</p>
              <p className="text-sm text-gray-600">Final Delivery</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">💬</div>
              <p className="font-semibold text-gray-900">
                {((experience as any).hostSpecificData?.consultationMethod) || 'Online Chat'}
              </p>
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
              <p className="font-semibold text-gray-900">
                {((experience as any).deliverables?.editedPhotosCount) || '20-40'} Photos
              </p>
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

      case 'combo-tour':
      case 'combo':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🚶‍♂️</div>
              <p className="font-semibold text-gray-900">{formatDuration(experience.duration)}</p>
              <p className="text-sm text-gray-600">Tour Duration</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">📸</div>
              <p className="font-semibold text-gray-900">
                {((experience as any).deliverables?.photosIncluded) || 'Photos'} 
              </p>
              <p className="text-sm text-gray-600">Photos Included</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🎯</div>
              <p className="font-semibold text-gray-900">Best Value</p>
              <p className="text-sm text-gray-600">2-in-1 Service</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">📱</div>
              <p className="font-semibold text-gray-900">Instant Share</p>
              <p className="text-sm text-gray-600">Digital Delivery</p>
            </div>
          </div>
        );
        
      default: // Local Tour Guide or other categories
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">⏱️</div>
              <p className="font-semibold text-gray-900">{formatDuration(experience.duration)}</p>
              <p className="text-sm text-gray-600">Duration</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">👥</div>
              <p className="font-semibold text-gray-900">
                {experience.minGuests && experience.maxGuests 
                  ? `${experience.minGuests}-${experience.maxGuests} people`
                  : experience.maxGuests 
                    ? `Up to ${experience.maxGuests}`
                    : 'Group size TBD'
                }
              </p>
              <p className="text-sm text-gray-600">Participants</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🎯</div>
              <p className="font-semibold text-gray-900">
                {experience.difficulty || 'TBD'}
              </p>
              <p className="text-sm text-gray-600">Difficulty Level</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">💪</div>
              <p className="font-semibold text-gray-900">
                {experience.fitnessLevel || 'TBD'}
              </p>
              <p className="text-sm text-gray-600">Fitness Level</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🚶‍♂️</div>
              <p className="font-semibold text-gray-900">
                {experience.walkingDistance && parseFloat(experience.walkingDistance.toString()) > 0 
                  ? `${experience.walkingDistance} km`
                  : 'TBD'
                }
              </p>
              <p className="text-sm text-gray-600">Walking Distance</p>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
              <div className="text-2xl mb-2">📍</div>
              <p className="font-semibold text-gray-900">Location</p>
              <div className="text-xs text-gray-600 leading-tight">
                {experience.meetingPoint && (
                  <div className="mb-1">
                    <span className="font-medium">Start:</span> {experience.meetingPoint}
                  </div>
                )}
                {(experience as any).endingPoint && (experience as any).endingPoint !== experience.meetingPoint && (
                  <div>
                    <span className="font-medium">End:</span> {(experience as any).endingPoint}
                  </div>
                )}
                {!experience.meetingPoint && !(experience as any).endingPoint && 'TBD'}
              </div>
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
                    {experience.rating ? formatRating(experience.rating) : 'New'}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({experience.totalReviews || 0} reviews)
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
            <p className="text-center text-gray-600 mt-3">
              Digital service • PDF delivery • {((experience as any).hostSpecificData?.revisionRoundsIncluded) || 'revisions'} included
            </p>
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
                    {experience.rating ? formatRating(experience.rating) : 'New'}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({experience.totalReviews || 0} reviews)
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
            <p className="text-center text-sm text-gray-600 mt-3">
              {((experience as any).deliverables?.editedPhotosCount) || '20-40'} edited photos • Digital gallery included
            </p>
          </div>
        );

      case 'combo-tour':
      case 'combo':
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Starting from</p>
                <p className="text-3xl font-bold text-gray-900 leading-none">{formattedPrice}</p>
                <p className="text-sm text-gray-600 mt-1">per combo package</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span className="font-medium">
                    {experience.rating ? formatRating(experience.rating) : 'New'}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({experience.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tour date</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-2" />
                    Select date
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Guests</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Users className="w-4 h-4 mr-2" />
                    {(experience as any).minGuests || 1} guest{((experience as any).minGuests || 1) > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-4 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg">
              Book Combo Experience
            </button>
            <p className="text-center text-sm text-gray-600 mt-3">
              Tour + {((experience as any).deliverables?.photosIncluded) || 'photos'} • Best value package
            </p>
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
                    {experience.rating ? formatRating(experience.rating) : 'New'}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({experience.totalReviews || 0} reviews)
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
            <div className="flex-1 mr-4">
              <div className="flex items-start gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  {experience.title}
                </h1>
                {/* Status Badge */}
                {statusBadge && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusBadge.className} flex-shrink-0`}>
                    <span className="mr-1.5">{statusBadge.emoji}</span>
                    {statusBadge.text}
                  </span>
                )}
              </div>
              {/* Quick Hook (Short Description) */}
              {experience.shortDescription && (
                <p className="text-lg text-gray-700 font-medium mb-3">
                  {experience.shortDescription}
                </p>
              )}
            </div>
            
            {/* Share Button - Positioned at top right */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 bg-white border border-gray-300 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {experience.experienceType && (
              <>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getExperienceTypeColor(experience.experienceType.name)}`}>
                  {experience.experienceType.name}
                </span>
                <span className="text-gray-400">•</span>
              </>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">
                {experience.city?.name || 'Location TBD'}{experience.city?.country?.name ? `, ${experience.city.country.name}` : ''}
              </span>
            </div>
            {(experience.fitnessLevel || experience.difficulty) && (
              <>
                <span className="text-gray-400">•</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(experience.fitnessLevel || experience.difficulty)}`}>
                  {experience.fitnessLevel || experience.difficulty}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Photo Gallery Section - Airbnb Style dengan Presisi Lebih Baik */}
        <div className="relative mb-8">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-xl overflow-hidden">
            {/* Main large image - takes left half */}
            <div 
              className="col-span-2 row-span-2 relative group overflow-hidden cursor-pointer"
              onClick={() => openImageModal(0)}
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
              {/* Zoom indicator */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>

            {/* Top right images */}
            <div 
              className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer"
              onClick={() => openImageModal(1)}
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
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3 h-3" />
              </div>
            </div>
            <div 
              className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer"
              onClick={() => openImageModal(2)}
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
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3 h-3" />
              </div>
            </div>

            {/* Bottom right images */}
            <div 
              className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer"
              onClick={() => openImageModal(3)}
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
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3 h-3" />
              </div>
            </div>
            <div 
              className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer"
              onClick={() => openImageModal(4)}
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
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3 h-3" />
              </div>
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
            {['overview', 'itinerary', 'inclusions', 'reviews']
              .filter(tab => {
                // Hide itinerary tab for Photographer category (ID 2)
                if (tab === 'itinerary' && experience.category?.id === 2) {
                  return false;
                }
                return true;
              })
              .map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'inclusions' ? 'What\'s Included' : 
                 tab === 'itinerary' && experience.category?.id === 4 ? 'Design Steps' :
                 tab}
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
                        {/* Host Languages */}
                        {experience.host.languages && experience.host.languages.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="text-sm text-gray-600">Speaks:</span>
                            <span className="text-sm text-gray-700">
                              {experience.host.languages.map(lang => lang.name).join(', ')}
                            </span>
                          </div>
                        )}
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
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {/* Experience Type */}
                  {experience.experienceType && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Experience Type
                      </h3>
                      <p className="font-medium text-blue-900">{experience.experienceType.name}</p>
                      <p className="text-sm text-blue-700 mt-1">{experience.experienceType.description}</p>
                    </div>
                  )}

                  {/* Equipment Used */}
                  {experience.equipmentUsed && experience.equipmentUsed.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        Equipment Provided
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {experience.equipmentUsed.map((item: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span className="text-sm text-purple-900">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deliverables */}
                  {experience.deliverables && experience.deliverables.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        What You'll Get
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {experience.deliverables.map((item: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-green-900">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Host Information & Specialties */}
                {experience.hostSpecificData && (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                      Host Specialties & Experience Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Languages (from hostSpecificData - backup) */}
                      {experience.hostSpecificData.languages && (
                        <div>
                          <p className="font-medium text-gray-900">Languages (Host Info)</p>
                          <p className="text-sm text-gray-700">{experience.hostSpecificData.languages}</p>
                        </div>
                      )}
                      
                      {/* Transportation Included */}
                      {typeof experience.hostSpecificData.transportationIncluded !== 'undefined' && (
                        <div>
                          <p className="font-medium text-gray-900">Transportation</p>
                          <p className="text-sm text-gray-700">
                            {experience.hostSpecificData.transportationIncluded ? '✅ Transportation included' : '❌ Transportation not included'}
                          </p>
                        </div>
                      )}
                      
                      {/* Specialty Areas */}
                      {experience.hostSpecificData.specialtyAreas && (
                        <div>
                          <p className="font-medium text-gray-900">Specialty Areas</p>
                          <p className="text-sm text-gray-700">
                            {Array.isArray(experience.hostSpecificData.specialtyAreas) 
                              ? experience.hostSpecificData.specialtyAreas.join(', ')
                              : experience.hostSpecificData.specialtyAreas
                            }
                          </p>
                        </div>
                      )}
                      
                      {/* Vehicle Type */}
                      {experience.hostSpecificData.vehicleType && (
                        <div>
                          <p className="font-medium text-gray-900">Vehicle Type</p>
                          <p className="text-sm text-gray-700">{experience.hostSpecificData.vehicleType}</p>
                        </div>
                      )}
                      
                      {/* Group Size Preference */}
                      {experience.hostSpecificData.groupSizePreference && (
                        <div>
                          <p className="font-medium text-gray-900">Group Size Preference</p>
                          <p className="text-sm text-gray-700">{experience.hostSpecificData.groupSizePreference}</p>
                        </div>
                      )}
                      
                      {/* Schedule Flexibility */}
                      {typeof experience.hostSpecificData.flexibleTiming !== 'undefined' && (
                        <div>
                          <p className="font-medium text-gray-900">Schedule Flexibility</p>
                          <p className="text-sm text-gray-700">
                            {experience.hostSpecificData.flexibleTiming ? '✅ Flexible timing available' : '⏰ Fixed schedule only'}
                          </p>
                        </div>
                      )}
                      
                      {/* Camera Equipment for Photography */}
                      {experience.hostSpecificData.cameraEquipment && (
                        <div className="md:col-span-2">
                          <p className="font-medium text-gray-900">Photography Equipment</p>
                          <p className="text-sm text-gray-700">{experience.hostSpecificData.cameraEquipment}</p>
                        </div>
                      )}
                      
                      {/* Editing Software */}
                      {experience.hostSpecificData.editingSoftware && (
                        <div>
                          <p className="font-medium text-gray-900">Editing Software</p>
                          <p className="text-sm text-gray-700">{experience.hostSpecificData.editingSoftware}</p>
                        </div>
                      )}
                      
                      {/* Photography Style */}
                      {experience.hostSpecificData.photoshootStyle && (
                        <div>
                          <p className="font-medium text-gray-900">Photography Style</p>
                          <p className="text-sm text-gray-700">{experience.hostSpecificData.photoshootStyle}</p>
                        </div>
                      )}
                      
                      {/* Consultation Method */}
                      {experience.hostSpecificData.consultationMethod && (
                        <div>
                          <p className="font-medium text-gray-900">Consultation Method</p>
                          <p className="text-sm text-gray-700">{experience.hostSpecificData.consultationMethod}</p>
                        </div>
                      )}
                      
                      {/* Revision Rounds */}
                      {experience.hostSpecificData.revisionRoundsIncluded && (
                        <div>
                          <p className="font-medium text-gray-900">Revisions Included</p>
                          <p className="text-sm text-gray-700">{experience.hostSpecificData.revisionRoundsIncluded} rounds</p>
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
                  {experience.category?.id === 4 ? 'Design Steps' : 'Experience Itinerary'}
                </h2>
                
                {/* Itinerary Content */}
                {experience.itinerary && experience.itinerary.length > 0 ? (
                  <div className="space-y-6">
                    {experience.itinerary.map((item: any, index: number) => (
                      <div key={item.id || index} className="border rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {item.stepNumber || index + 1}
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-700 mb-3">{item.description}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm">
                              {item.timeSchedule && (
                                <p className="text-purple-600 font-medium">
                                  🕒 {item.timeSchedule}
                                </p>
                              )}
                              {item.durationMinutes && (
                                <p className="text-purple-600 font-medium">
                                  ⏱️ {item.durationMinutes >= 60 
                                    ? `${Math.floor(item.durationMinutes / 60)} hour${Math.floor(item.durationMinutes / 60) > 1 ? 's' : ''}${item.durationMinutes % 60 > 0 ? ` ${item.durationMinutes % 60} min` : ''}`
                                    : `${item.durationMinutes} minutes`
                                  }
                                </p>
                              )}
                            </div>
                            
                            {item.location && (
                              <p className="text-sm text-gray-600 mt-2">
                                📍 {item.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Detailed itinerary will be provided after booking confirmation.</p>
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
                  {experience.deliverables && Object.keys(experience.deliverables).some(key => experience.deliverables[key] === true) && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Deliverables</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(experience.deliverables).map(([key, value]) => {
                          if (value === true) {
                            // Convert camelCase to readable format
                            const displayName = key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, str => str.toUpperCase())
                              .replace(/Pdf/g, 'PDF')
                              .replace(/Hd/g, 'HD')
                              .replace(/4K/g, '4K');
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

                  {/* Deliverables with quantities */}
                  {experience.deliverables && (
                    <div className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {experience.deliverables.photosIncluded && (
                          <div className="flex items-start space-x-3">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{experience.deliverables.photosIncluded} Photos Included</span>
                          </div>
                        )}
                        {experience.deliverables.videosIncluded && (
                          <div className="flex items-start space-x-3">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{experience.deliverables.videosIncluded} Videos Included</span>
                          </div>
                        )}
                        {experience.deliverables.deliveryTimeframe && (
                          <div className="flex items-start space-x-3">
                            <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Delivered within {experience.deliverables.deliveryTimeframe}</span>
                          </div>
                        )}
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
                        {experience.rating ? formatRating(experience.rating) : 'New'}
                      </div>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        {experience.rating ? renderStars(experience.rating) : (
                          <span className="text-gray-400 text-sm">No ratings yet</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {experience.totalReviews || experience.reviews?.length || 0} reviews
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
      
      {/* Image Modal */}
      {showImageModal && allImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          {/* Modal Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">
                {currentModalImageIndex + 1} / {allImages.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 1}
                className="p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-white text-sm px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
                className="p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="transition-transform duration-200 select-none"
              style={{
                transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
            >
              <SimpleImage
                imagePath={allImages[currentModalImageIndex]}
                alt={`${experience?.title} ${currentModalImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                placeholderType="experience"
                category="experiences"
                name={experience?.title || ''}
                width={1200}
                height={800}
              />
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentModalImageIndex(index);
                    setZoomLevel(1);
                    setImagePosition({ x: 0, y: 0 });
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentModalImageIndex
                      ? 'border-white'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <SimpleImage
                    imagePath={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    placeholderType="experience"
                    category="experiences"
                    name={experience?.title || ''}
                    width={64}
                    height={64}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Help Text */}
          <div className="absolute bottom-4 left-4 text-white text-xs bg-black bg-opacity-50 px-3 py-2 rounded">
            <div>← → Navigate • + - Zoom • ESC Close</div>
            {zoomLevel > 1 && <div>Drag to pan</div>}
          </div>
        </div>
      )}
      
      {/* Share Modal - GenZ Friendly Design */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-200">
            {/* Header with Gradient */}
            <div className="relative p-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Share the Vibe ✨
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Spread the good vibes with your crew! 🚀</p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/80 transition-all duration-200 backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="px-6 pb-6">
              {/* Experience Preview Card */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/50 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-purple-200">
                    <SimpleImage
                      imagePath={allImages[0] || 'placeholder-experience.jpg'}
                      alt={experience.title}
                      className="w-full h-full object-cover"
                      placeholderType="experience"
                      category="experiences"
                      name={experience.title}
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{experience.title}</h4>
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {experience.city?.name}{experience.city?.country?.name ? `, ${experience.city.country.name}` : ''}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-medium rounded-full">
                        ✨ LocallyTrip
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Share Options - GenZ Grid Layout */}
              <div className="space-y-4">
                <p className="text-center text-sm font-medium text-gray-700">Choose your platform bestie! 💫</p>
                
                {/* Main Social Platforms */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={shareToInstagram}
                    className="group flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-yellow-500 text-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.004 5.367 18.635.001 12.017.001zM8.449 20.25c-3.489 0-6.32-2.831-6.32-6.32s2.831-6.32 6.32-6.32 6.32 2.831 6.32 6.32-2.831 6.32-6.32 6.32zm7.718-10.4c-.718 0-1.3-.582-1.3-1.3s.582-1.3 1.3-1.3 1.3.582 1.3 1.3-.582 1.3-1.3 1.3z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold">Insta</span>
                    <span className="text-xs opacity-90">Story</span>
                  </button>
                  
                  <button
                    onClick={shareToTwitter}
                    className="group flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-gray-800 to-black text-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold">X</span>
                    <span className="text-xs opacity-90">Tweet</span>
                  </button>
                  
                  <button
                    onClick={shareToWhatsApp}
                    className="group flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold">WhatsApp</span>
                    <span className="text-xs opacity-90">Chat</span>
                  </button>
                </div>

                {/* Secondary Platforms */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={shareToFacebook}
                    className="group flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:scale-105 transform transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <div className="w-6 h-6 mb-1">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-medium">Facebook</span>
                  </button>
                  
                  <button
                    onClick={shareToTelegram}
                    className="group flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:scale-105 transform transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <div className="w-6 h-6 mb-1">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.78 12.78l.435-4.114L21.75 2.25l-9.43 9.43h-2.54zm11.22-7.72L5.25 21.75 3.75 12l16.5-6.94zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-medium">Telegram</span>
                  </button>
                  
                  <button
                    onClick={shareToLinkedIn}
                    className="group flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white hover:scale-105 transform transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <div className="w-6 h-6 mb-1">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-medium">LinkedIn</span>
                  </button>
                </div>
                
                {/* Copy Link with Fun Design */}
                <div className="relative mt-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl blur opacity-75"></div>
                  <button
                    onClick={copyToClipboard}
                    className="relative w-full flex items-center justify-center gap-3 p-4 bg-white rounded-2xl border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all duration-300 group hover:scale-[1.02] transform"
                  >
                    <Copy className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                    <div className="text-center">
                      <span className="text-sm font-semibold text-purple-700 block">Copy Link 🔗</span>
                      <span className="text-xs text-purple-600">Share anywhere you want!</span>
                    </div>
                  </button>
                </div>

                {/* Fun Footer Message */}
                <div className="text-center mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                  <p className="text-xs text-purple-700 font-medium">
                    🌟 Thanks for spreading the LocallyTrip love! 🌟
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
