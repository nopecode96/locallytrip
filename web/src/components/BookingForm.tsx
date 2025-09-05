import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Camera, FileText, Star } from 'lucide-react';

interface BookingFormProps {
  experience: any;
  onBookingSubmit: (bookingData: any) => void;
}

interface BookingFormData {
  selectedDate: string;
  selectedTime: string;
  participantCount: number;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  categorySpecific: Record<string, any>;
  specialRequests: string;
}

export default function BookingForm({ experience, onBookingSubmit }: BookingFormProps) {
  const [bookingData, setBookingData] = useState<BookingFormData>({
    selectedDate: '',
    selectedTime: '',
    participantCount: 1,
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    },
    categorySpecific: {},
    specialRequests: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format price based on category and selections
  const calculateTotalPrice = () => {
    const basePrice = parseFloat(experience.pricePerPackage || experience.price);
    const category = experience.category?.name?.toLowerCase() || '';
    
    switch (category) {
      case 'local guide':
        return basePrice * bookingData.participantCount;
      case 'photographer':
        const packageMultiplier: { [key: string]: number } = {
          'basic': 1.0,
          'standard': 1.5,
          'premium': 2.0
        };
        return basePrice * (packageMultiplier[bookingData.categorySpecific.packageType] || 1.0);
      case 'trip planner':
        return basePrice; // Fixed price
      case 'combo guide':
        let comboPrice = basePrice;
        const services = bookingData.categorySpecific.selectedServices || [];
        if (services.includes('photography')) {
          comboPrice += basePrice * 0.8;
        }
        return comboPrice;
      default:
        return basePrice * bookingData.participantCount;
    }
  };

  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  // Category-specific form fields
  const renderCategorySpecificFields = () => {
    const category = experience.category?.name?.toLowerCase() || '';
    
    switch (category) {
      case 'local guide':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Tour Details
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Languages
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Indonesian', 'English', 'Mandarin', 'Japanese'].map((lang) => (
                  <label key={lang} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 mr-2"
                      checked={(bookingData.categorySpecific.languages || []).includes(lang)}
                      onChange={(e) => {
                        const languages = bookingData.categorySpecific.languages || [];
                        const newLanguages = e.target.checked
                          ? [...languages, lang]
                          : languages.filter((l: string) => l !== lang);
                        setBookingData({
                          ...bookingData,
                          categorySpecific: {
                            ...bookingData.categorySpecific,
                            languages: newLanguages
                          }
                        });
                      }}
                    />
                    <span className="text-sm">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Interests (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., street food, history, photography spots"
                value={bookingData.categorySpecific.specialInterests || ''}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  categorySpecific: {
                    ...bookingData.categorySpecific,
                    specialInterests: e.target.value
                  }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Restrictions (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., vegetarian, no pork, allergies"
                value={bookingData.categorySpecific.dietaryRestrictions || ''}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  categorySpecific: {
                    ...bookingData.categorySpecific,
                    dietaryRestrictions: e.target.value
                  }
                })}
              />
            </div>
          </div>
        );

      case 'photographer':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Photography Package
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Type *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                value={bookingData.categorySpecific.packageType || 'standard'}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  categorySpecific: {
                    ...bookingData.categorySpecific,
                    packageType: e.target.value
                  }
                })}
                required
              >
                <option value="basic">Basic Package (1x multiplier)</option>
                <option value="standard">Standard Package (1.5x multiplier)</option>
                <option value="premium">Premium Package (2x multiplier)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photography Style
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                value={bookingData.categorySpecific.photographyStyle || 'lifestyle'}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  categorySpecific: {
                    ...bookingData.categorySpecific,
                    photographyStyle: e.target.value
                  }
                })}
              >
                <option value="lifestyle">Lifestyle</option>
                <option value="portrait">Portrait</option>
                <option value="documentary">Documentary</option>
                <option value="artistic">Artistic</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Duration (min)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={bookingData.categorySpecific.sessionDuration || 120}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    categorySpecific: {
                      ...bookingData.categorySpecific,
                      sessionDuration: parseInt(e.target.value)
                    }
                  })}
                  min="60"
                  max="480"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outfit Changes
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={bookingData.categorySpecific.outfitChanges || 1}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    categorySpecific: {
                      ...bookingData.categorySpecific,
                      outfitChanges: parseInt(e.target.value)
                    }
                  })}
                  min="1"
                  max="5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Locations (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., beach, urban, garden, studio"
                value={bookingData.categorySpecific.preferredLocations || ''}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  categorySpecific: {
                    ...bookingData.categorySpecific,
                    preferredLocations: e.target.value
                  }
                })}
              />
            </div>
          </div>
        );

      case 'trip planner':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Trip Planning Details
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., Bali, Java, Indonesia"
                value={bookingData.categorySpecific.destination || ''}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  categorySpecific: {
                    ...bookingData.categorySpecific,
                    destination: e.target.value
                  }
                })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={bookingData.categorySpecific.startDate || ''}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      categorySpecific: {
                        ...bookingData.categorySpecific,
                        startDate: e.target.value
                      }
                    })}
                    placeholder="Start date"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {bookingData.categorySpecific.startDate && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="text-xs text-gray-500">
                        {new Date(bookingData.categorySpecific.startDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={bookingData.categorySpecific.endDate || ''}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      categorySpecific: {
                        ...bookingData.categorySpecific,
                        endDate: e.target.value
                      }
                    })}
                    placeholder="End date"
                    min={bookingData.categorySpecific.startDate || new Date().toISOString().split('T')[0]}
                  />
                  {bookingData.categorySpecific.endDate && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="text-xs text-gray-500">
                        {new Date(bookingData.categorySpecific.endDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range (IDR)
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                value={bookingData.categorySpecific.budgetRange || 'moderate'}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  categorySpecific: {
                    ...bookingData.categorySpecific,
                    budgetRange: e.target.value
                  }
                })}
              >
                <option value="budget">Budget (&lt; 5M IDR)</option>
                <option value="moderate">Moderate (5M - 15M IDR)</option>
                <option value="luxury">Luxury (15M+ IDR)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Style & Interests
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Adventure', 'Cultural', 'Relaxation', 'Food', 'Nature', 'Photography'].map((interest) => (
                  <label key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 mr-2"
                      checked={(bookingData.categorySpecific.interests || []).includes(interest)}
                      onChange={(e) => {
                        const interests = bookingData.categorySpecific.interests || [];
                        const newInterests = e.target.checked
                          ? [...interests, interest]
                          : interests.filter((i: string) => i !== interest);
                        setBookingData({
                          ...bookingData,
                          categorySpecific: {
                            ...bookingData.categorySpecific,
                            interests: newInterests
                          }
                        });
                      }}
                    />
                    <span className="text-sm">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planning Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                rows={3}
                placeholder="Any specific requirements or preferences..."
                value={bookingData.categorySpecific.planningNotes || ''}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  categorySpecific: {
                    ...bookingData.categorySpecific,
                    planningNotes: e.target.value
                  }
                })}
              />
            </div>
          </div>
        );

      case 'combo guide':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Combo Services
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Services *
              </label>
              <div className="space-y-2">
                {['guide', 'photography', 'planning'].map((service) => (
                  <label key={service} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 mr-2"
                      checked={(bookingData.categorySpecific.selectedServices || []).includes(service)}
                      onChange={(e) => {
                        const services = bookingData.categorySpecific.selectedServices || [];
                        const newServices = e.target.checked
                          ? [...services, service]
                          : services.filter((s: string) => s !== service);
                        setBookingData({
                          ...bookingData,
                          categorySpecific: {
                            ...bookingData.categorySpecific,
                            selectedServices: newServices
                          }
                        });
                      }}
                    />
                    <span className="text-sm capitalize">{service} Service</span>
                    {service === 'photography' && (
                      <span className="text-xs text-gray-500 ml-2">(+80% price)</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guide Duration (hours)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={bookingData.categorySpecific.guideDuration || 4}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    categorySpecific: {
                      ...bookingData.categorySpecific,
                      guideDuration: parseInt(e.target.value)
                    }
                  })}
                  min="2"
                  max="12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo Duration (hours)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={bookingData.categorySpecific.photographyDuration || 2}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    categorySpecific: {
                      ...bookingData.categorySpecific,
                      photographyDuration: parseInt(e.target.value)
                    }
                  })}
                  min="1"
                  max="8"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Coordination Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                rows={3}
                placeholder="How would you like the services coordinated..."
                value={bookingData.categorySpecific.teamCoordinationNotes || ''}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  categorySpecific: {
                    ...bookingData.categorySpecific,
                    teamCoordinationNotes: e.target.value
                  }
                })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const finalBookingData = {
      category: experience.category?.name?.toLowerCase()?.replace(' ', '') || 'guide',
      experience: {
        id: experience.id,
        title: experience.title,
        pricePerPackage: experience.pricePerPackage || experience.price
      },
      contactInfo: bookingData.contactInfo,
      bookingDetails: {
        selectedDate: bookingData.selectedDate,
        selectedTime: bookingData.selectedTime,
        participantCount: bookingData.participantCount,
        specialRequests: bookingData.specialRequests,
        ...bookingData.categorySpecific
      },
      paymentMethod: 'pending'
    };

    try {
      await onBookingSubmit(finalBookingData);
    } catch (error) {
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(bookingData.selectedDate && bookingData.participantCount > 0);
      case 2:
        return Boolean(bookingData.contactInfo.name && bookingData.contactInfo.email && bookingData.contactInfo.phone);
      case 3:
        // Category-specific validation would go here
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-8">
      {/* Price Display */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">
            {experience.category?.name === 'Trip Planner' ? 'Service fee' : 
             experience.category?.name === 'Photographer' ? 'Starting from' : 'Package price'}
          </p>
          <p className="text-3xl font-bold text-gray-900 leading-none">
            {formatPrice(calculateTotalPrice())}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {experience.category?.name === 'Photographer' ? 'per session' : 
             experience.category?.name === 'Trip Planner' ? 'complete service' : 'per package'}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">
              {experience.rating ? `${experience.rating}` : '4.9'}
            </span>
            <span className="text-gray-600 text-sm">
              ({experience.totalReviews || '12'} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === step 
                ? 'bg-purple-600 text-white' 
                : isStepComplete(step)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                isStepComplete(step) ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Select Date & Details</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={bookingData.selectedDate}
                  onChange={(e) => setBookingData({ ...bookingData, selectedDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  placeholder="Select date"
                  required
                />
                {bookingData.selectedDate && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="text-xs text-gray-500">
                      {new Date(bookingData.selectedDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="time"
                  className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={bookingData.selectedTime}
                  onChange={(e) => setBookingData({ ...bookingData, selectedTime: e.target.value })}
                  placeholder="Select time"
                />
                {bookingData.selectedTime && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="text-xs text-gray-500">
                      {new Date(`2000-01-01T${bookingData.selectedTime}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {experience.category?.name !== 'Trip Planner' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {experience.category?.name === 'Photographer' ? 'People in session' : 'Participants'} *
              </label>
              <div className="border border-gray-300 rounded-lg p-3">
                <Users className="w-4 h-4 mr-2 inline" />
                <input
                  type="number"
                  className="text-sm text-gray-900 border-none p-0 focus:ring-0 w-full"
                  value={bookingData.participantCount}
                  onChange={(e) => setBookingData({ ...bookingData, participantCount: parseInt(e.target.value) || 1 })}
                  min="1"
                  max={experience.maxGuests || 10}
                  required
                />
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Contact Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={bookingData.contactInfo.name}
              onChange={(e) => setBookingData({
                ...bookingData,
                contactInfo: { ...bookingData.contactInfo, name: e.target.value }
              })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={bookingData.contactInfo.email}
              onChange={(e) => setBookingData({
                ...bookingData,
                contactInfo: { ...bookingData.contactInfo, email: e.target.value }
              })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={bookingData.contactInfo.phone}
              onChange={(e) => setBookingData({
                ...bookingData,
                contactInfo: { ...bookingData.contactInfo, phone: e.target.value }
              })}
              placeholder="+62 xxx xxxx xxxx"
              required
            />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          {renderCategorySpecificFields()}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              rows={3}
              placeholder="Any special requirements or requests..."
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 space-y-3">
        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!isStepComplete(currentStep)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to {currentStep === 1 ? 'Contact Info' : 'Service Details'}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Complete Booking'}
          </button>
        )}
        
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        )}
      </div>

      <p className="text-center text-sm text-gray-600 mt-3">
        {currentStep < 3 ? "You won't be charged yet" : "Final step - complete your booking!"}
      </p>
    </div>
  );
}
