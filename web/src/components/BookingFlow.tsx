'use client';

import React, { useState } from 'react';
import bookingAPI, { type BookingData } from '@/services/bookingAPI';
import { BookingAPI } from '@/services/bookingAPI';
import { useToast } from '@/contexts/ToastContext';

interface BookingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'guide' | 'photographer' | 'tripplanner' | 'combo';
  experience: {
    id: number;
    title: string;
    hostName: string;
    price: number;
    location: string;
    duration: string;
    groupSize: string;
  };
}

interface FormData {
  // Common fields
  fullName: string;
  email: string;
  phone: string;
  
  // Guide booking
  selectedDate?: string;
  selectedTime?: string;
  adults?: number;
  children?: number;
  specialRequests?: string;
  
  // Photography booking
  packageType?: string;
  photographyStyle?: string;
  preferredDates?: string[];
  locations?: string[];
  outfitChanges?: number;
  
  // Trip planner booking
  destination?: string;
  tripDuration?: string;
  budget?: string;
  travelStyle?: string;
  interests?: string[];
  groupSize?: string;
  startDate?: string;
  endDate?: string;
  
  // Combo booking
  selectedServices?: string[];
  coordinationNotes?: string;
}

const BookingFlow: React.FC<BookingFlowProps> = ({
  isOpen,
  onClose,
  category,
  experience
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    adults: 2,
    children: 0,
    specialRequests: '',
    interests: [],
    selectedServices: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const getStepConfiguration = () => {
    switch (category) {
      case 'guide':
        return {
          totalSteps: 3,
          color: 'from-blue-500 to-blue-600',
          emoji: '🧑‍💼',
          title: 'Book Tour Guide'
        };
      case 'photographer':
        return {
          totalSteps: 4,
          color: 'from-pink-500 to-pink-600',
          emoji: '📸',
          title: 'Book Photography Session'
        };
      case 'tripplanner':
        return {
          totalSteps: 4,
          color: 'from-green-500 to-green-600',
          emoji: '📝',
          title: 'Request Trip Planning'
        };
      case 'combo':
        return {
          totalSteps: 5,
          color: 'from-purple-500 to-purple-600',
          emoji: '🎁',
          title: 'Book Combo Services'
        };
      default:
        return {
          totalSteps: 3,
          color: 'from-gray-500 to-gray-600',
          emoji: '✨',
          title: 'Book Experience'
        };
    }
  };

  const config = getStepConfiguration();

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayUpdate = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = (prev[field] as string[]) || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const renderGuideBookingStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Select Date & Time</h3>
            
            {/* Date Selection */}
            <div>
              <label className="block font-medium text-gray-700 mb-3">Tour Date</label>
              <input
                type="date"
                value={formData.selectedDate || ''}
                onChange={(e) => updateFormData('selectedDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block font-medium text-gray-700 mb-3">Preferred Start Time</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['09:00', '11:00', '14:00', '16:00'].map((time) => (
                  <button
                    key={time}
                    onClick={() => updateFormData('selectedTime', time)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.selectedTime === time
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-blue-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Group Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">Adults</label>
                <select
                  value={formData.adults || 2}
                  onChange={(e) => updateFormData('adults', parseInt(e.target.value))}
                  className="w-full p-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">Children</label>
                <select
                  value={formData.children || 0}
                  onChange={(e) => updateFormData('children', parseInt(e.target.value))}
                  className="w-full p-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  {[0, 1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Child{num > 1 ? 'ren' : num === 1 ? '' : 'ren'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Special Requests</label>
              <textarea
                value={formData.specialRequests || ''}
                onChange={(e) => updateFormData('specialRequests', e.target.value)}
                placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                className="w-full p-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none h-24 resize-none"
              />
            </div>
          </div>
        );

      case 3:
        return renderContactAndPayment();

      default:
        return null;
    }
  };

  const renderPhotographyBookingStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Select Photography Package</h3>
            
            <div className="space-y-4">
              {[
                { id: 'essential', name: 'Essential', duration: '1 hour', photos: '25 edited photos', price: 'Rp 420,000' },
                { id: 'premium', name: 'Premium', duration: '2 hours', photos: '50 edited photos', price: 'Rp 750,000' },
                { id: 'ultimate', name: 'Ultimate', duration: '3 hours', photos: '100 edited photos', price: 'Rp 1,200,000' }
              ].map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => updateFormData('packageType', pkg.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    formData.packageType === pkg.id
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-pink-700">{pkg.name} Package</h4>
                      <p className="text-sm text-gray-600">{pkg.duration} • {pkg.photos}</p>
                    </div>
                    <span className="font-bold text-pink-600">{pkg.price}</span>
                  </div>
                </button>
              ))}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-3">Photography Style</label>
              <div className="grid grid-cols-2 gap-3">
                {['Romantic', 'Candid', 'Fashion', 'Artistic'].map((style) => (
                  <button
                    key={style}
                    onClick={() => updateFormData('photographyStyle', style)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.photographyStyle === style
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Date & Location Preferences</h3>
            
            <div>
              <label className="block font-medium text-gray-700 mb-3">Preferred Date</label>
              <input
                type="date"
                value={formData.selectedDate || ''}
                onChange={(e) => updateFormData('selectedDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-3">Preferred Locations</label>
              <div className="space-y-2">
                {['Beach', 'Rice Terraces', 'Urban Street', 'Traditional Buildings', 'Waterfall', 'Mountain View'].map((location) => (
                  <label key={location} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={(formData.locations || []).includes(location)}
                      onChange={(e) => handleArrayUpdate('locations', location, e.target.checked)}
                      className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Session Details</h3>
            
            <div>
              <label className="block font-medium text-gray-700 mb-3">Number of Outfit Changes</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => updateFormData('outfitChanges', num)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.outfitChanges === num
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    {num} Outfit{num > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Special Vision or Requests</label>
              <textarea
                value={formData.specialRequests || ''}
                onChange={(e) => updateFormData('specialRequests', e.target.value)}
                placeholder="Describe your vision, mood, or any special requirements..."
                className="w-full p-3 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none h-24 resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return renderContactAndPayment();

      default:
        return null;
    }
  };

  const renderTripPlannerBookingStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Trip Requirements</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">Destination</label>
                <input
                  type="text"
                  value={formData.destination || ''}
                  onChange={(e) => updateFormData('destination', e.target.value)}
                  placeholder="e.g., Tokyo, Japan"
                  className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">Trip Duration</label>
                <select
                  value={formData.tripDuration || ''}
                  onChange={(e) => updateFormData('tripDuration', e.target.value)}
                  className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                >
                  <option value="">Select duration</option>
                  <option value="3-days">3 Days</option>
                  <option value="5-days">5 Days</option>
                  <option value="7-days">7 Days</option>
                  <option value="10-days">10 Days</option>
                  <option value="14-days">14+ Days</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => updateFormData('endDate', e.target.value)}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-3">Budget Range (per person)</label>
              <div className="grid grid-cols-2 gap-3">
                {['< $50/day', '$50-100/day', '$100-200/day', '$200+/day'].map((budget) => (
                  <button
                    key={budget}
                    onClick={() => updateFormData('budget', budget)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.budget === budget
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-green-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Travel Preferences</h3>
            
            <div>
              <label className="block font-medium text-gray-700 mb-3">Travel Style</label>
              <div className="grid grid-cols-2 gap-3">
                {['Budget Backpacker', 'Comfortable Mid-range', 'Luxury Travel', 'Mix of Both'].map((style) => (
                  <button
                    key={style}
                    onClick={() => updateFormData('travelStyle', style)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.travelStyle === style
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-green-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-3">Interests (select all that apply)</label>
              <div className="grid grid-cols-3 gap-2">
                {['Food & Dining', 'Culture & History', 'Shopping', 'Photography', 'Nightlife', 'Adventure', 'Nature', 'Art & Museums', 'Local Experiences'].map((interest) => (
                  <label key={interest} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(formData.interests || []).includes(interest)}
                      onChange={(e) => handleArrayUpdate('interests', interest, e.target.checked)}
                      className="w-4 h-4 text-green-500 border-green-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Group Size</label>
              <select
                value={formData.groupSize || ''}
                onChange={(e) => updateFormData('groupSize', e.target.value)}
                className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
              >
                <option value="">Select group size</option>
                <option value="solo">Solo Traveler</option>
                <option value="couple">Couple (2 people)</option>
                <option value="small-group">Small Group (3-5 people)</option>
                <option value="large-group">Large Group (6+ people)</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Additional Details</h3>
            
            <div>
              <label className="block font-medium text-gray-700 mb-2">Special Requirements</label>
              <textarea
                value={formData.specialRequests || ''}
                onChange={(e) => updateFormData('specialRequests', e.target.value)}
                placeholder="Any dietary restrictions, accessibility needs, cultural considerations, or specific requests..."
                className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none h-32 resize-none"
              />
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <h4 className="font-bold text-green-800 mb-2">📋 What Happens Next?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• You'll receive a consultation call within 24 hours</li>
                <li>• We'll discuss your preferences in detail</li>
                <li>• Draft itinerary delivered within 3-5 days</li>
                <li>• Unlimited revisions until you're satisfied</li>
                <li>• Payment only after final approval</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return renderContactAndPayment();

      default:
        return null;
    }
  };

  const renderComboBookingStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Select Services</h3>
            
            <div className="space-y-4">
              {[
                { id: 'guide', name: 'Tour Guide Service', emoji: '🧑‍💼', description: 'Professional local guide', included: true },
                { id: 'photography', name: 'Photography Session', emoji: '📸', description: 'Professional photos during tour', included: true },
                { id: 'planning', name: 'Trip Planning', emoji: '📝', description: 'Custom itinerary creation', included: false },
                { id: 'transport', name: 'Transportation', emoji: '🚗', description: 'Private vehicle with driver', included: false }
              ].map((service) => (
                <label key={service.id} className="flex items-center space-x-4 p-4 border-2 border-purple-200 rounded-xl hover:bg-purple-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.selectedServices || []).includes(service.id)}
                    onChange={(e) => handleArrayUpdate('selectedServices', service.id, e.target.checked)}
                    className="w-5 h-5 text-purple-500 border-purple-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-2xl">{service.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{service.name}</div>
                    <div className="text-sm text-gray-600">{service.description}</div>
                  </div>
                  {service.included && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Included</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Coordination Details</h3>
            
            <div>
              <label className="block font-medium text-gray-700 mb-2">Preferred Date</label>
              <input
                type="date"
                value={formData.selectedDate || ''}
                onChange={(e) => updateFormData('selectedDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Coordination Notes</label>
              <textarea
                value={formData.coordinationNotes || ''}
                onChange={(e) => updateFormData('coordinationNotes', e.target.value)}
                placeholder="How would you like the services coordinated? Any specific timing or logistics requirements..."
                className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none h-24 resize-none"
              />
            </div>

            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-2">🎯 Service Coordination</h4>
              <p className="text-sm text-purple-700">
                Our team will coordinate between all selected services to ensure a seamless experience. 
                You'll have a single point of contact managing all aspects of your booking.
              </p>
            </div>
          </div>
        );

      case 3:
      case 4:
      case 5:
        return renderContactAndPayment();

      default:
        return null;
    }
  };

  const renderContactAndPayment = () => {
    const totalPrice = calculateTotalPrice();
    
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">Contact & Payment</h3>
        
        {/* Booking Summary */}
        <div className={`bg-gradient-to-r ${config.color} bg-opacity-10 p-4 rounded-xl border border-opacity-30`}>
          <h4 className="font-bold text-gray-800 mb-2">📋 Booking Summary</h4>
          <div className="space-y-1 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Experience:</span>
              <span>{experience.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Host:</span>
              <span>{experience.hostName}</span>
            </div>
            {formData.selectedDate && (
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(formData.selectedDate).toLocaleDateString()}</span>
              </div>
            )}
            {formData.selectedTime && (
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{formData.selectedTime}</span>
              </div>
            )}
            {(formData.adults || formData.children) && (
              <div className="flex justify-between">
                <span>Group:</span>
                <span>{formData.adults || 0} Adults{formData.children ? `, ${formData.children} Children` : ''}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Total:</span>
              <span>{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => updateFormData('fullName', e.target.value)}
              placeholder="Your full name"
              className={`w-full p-3 border-2 rounded-xl focus:outline-none border-gray-200 focus:border-${config.color.split('-')[1]}-500`}
              required
            />
          </div>
          
          <div>
            <label className="block font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              placeholder="+62 123 456 7890"
              className={`w-full p-3 border-2 rounded-xl focus:outline-none border-gray-200 focus:border-${config.color.split('-')[1]}-500`}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="your@email.com"
            className={`w-full p-3 border-2 rounded-xl focus:outline-none border-gray-200 focus:border-${config.color.split('-')[1]}-500`}
            required
          />
        </div>

        {/* Payment Method (Mock) */}
        <div>
          <label className="block font-medium text-gray-700 mb-3">Payment Method</label>
          <div className="space-y-3">
            {['Credit/Debit Card', 'Bank Transfer', 'Digital Wallet', 'Pay at Location'].map((method) => (
              <label key={method} className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="payment" className="w-4 h-4" />
                <span className="text-gray-700">{method}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const calculateTotalPrice = () => {
    let basePrice = experience.price;
    let total = basePrice;

    // Calculate based on category and selections
    if (category === 'guide') {
      total = basePrice * (formData.adults || 1);
    } else if (category === 'photographer') {
      if (formData.packageType === 'premium') total = 750000;
      else if (formData.packageType === 'ultimate') total = 1200000;
      else total = 420000;
    } else if (category === 'combo') {
      // Add extra services cost
      const extraServices = (formData.selectedServices || []).filter(s => !['guide', 'photography'].includes(s));
      total += extraServices.length * 200000;
    }

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(total);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare booking data for API
      const bookingData: BookingData = {
        category,
        experience: {
          id: experience.id,
          title: experience.title,
          hostId: 1, // This would be dynamic in real implementation
          price: experience.price,
          location: experience.location,
          duration: experience.duration
        },
        contactInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        bookingDetails: {
          selectedDate: formData.selectedDate,
          selectedTime: formData.selectedTime,
          adults: formData.adults,
          children: formData.children,
          groupSize: formData.groupSize,
          specialRequests: formData.specialRequests,
          coordinationNotes: formData.coordinationNotes,
          
          // Category-specific fields
          ...(category === 'photographer' && {
            packageType: formData.packageType,
            photographyStyle: formData.photographyStyle,
            outfitChanges: formData.outfitChanges,
            preferredLocations: formData.locations
          }),
          
          ...(category === 'tripplanner' && {
            destination: formData.destination,
            tripDuration: formData.tripDuration,
            startDate: formData.startDate,
            endDate: formData.endDate,
            budgetRange: formData.budget,
            travelStyle: formData.travelStyle,
            interests: formData.interests
          }),
          
          ...(category === 'combo' && {
            selectedServices: formData.selectedServices
          })
        },
        paymentMethod: 'Credit/Debit Card' // This would be from form selection
      };

      const response = await bookingAPI.createBooking(bookingData);
      
      if (response.success) {
        const bookingRef = response.data!.booking.bookingReference;
        showToast(`🎉 Booking Successful!\n\nBooking Reference: ${BookingAPI.formatBookingReference(bookingRef)}\nTotal: ${BookingAPI.formatCurrency(response.data!.booking.totalPrice)}\n\nYou will receive a confirmation email shortly.`, 'success');
        onClose();
        
        // Optionally redirect to home or experiences page
        setTimeout(() => {
          window.location.href = '/explore';
        }, 3000);
      } else {
        throw new Error(response.message || 'Booking failed');
      }
      
    } catch (error) {
      showToast(`❌ Booking Failed\n\n${error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    // Basic validation for each step
    if (currentStep === config.totalSteps) {
      return formData.fullName && formData.email && formData.phone;
    }
    return true; // For demo purposes, other steps are considered valid
  };

  const renderStepContent = () => {
    switch (category) {
      case 'guide':
        return renderGuideBookingStep();
      case 'photographer':
        return renderPhotographyBookingStep();
      case 'tripplanner':
        return renderTripPlannerBookingStep();
      case 'combo':
        return renderComboBookingStep();
      default:
        return <div>Step content not available</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{config.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{config.title}</h2>
                <p className="text-gray-600">{experience.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {config.totalSteps}</span>
              <span>{Math.round((currentStep / config.totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${config.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${(currentStep / config.totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </button>
          
          {currentStep < config.totalSteps ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!isStepValid()}
              className={`px-6 py-3 bg-gradient-to-r ${config.color} text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {isSubmitting ? 'Processing... ⏳' : 'Complete Booking! ✅'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
