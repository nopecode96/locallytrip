'use client';

import React, { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'guide' | 'photographer' | 'tripplanner' | 'combo';
  experienceTitle: string;
  hostName: string;
  price: number;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  category,
  experienceTitle,
  hostName,
  price
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { showToast } = useToast();

  if (!isOpen) return null;

  const getStepContent = () => {
    switch (category) {
      case 'guide':
        return renderGuideBooking();
      case 'photographer':
        return renderPhotographyBooking();
      case 'tripplanner':
        return renderTripPlannerBooking();
      case 'combo':
        return renderComboBooking();
      default:
        return null;
    }
  };

  const renderGuideBooking = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Select Date & Time</h3>
            
            {/* Calendar Mock */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                <div className="font-bold p-2">Sun</div>
                <div className="font-bold p-2">Mon</div>
                <div className="font-bold p-2">Tue</div>
                <div className="font-bold p-2">Wed</div>
                <div className="font-bold p-2">Thu</div>
                <div className="font-bold p-2">Fri</div>
                <div className="font-bold p-2">Sat</div>
                
                {[...Array(35)].map((_, i) => (
                  <button
                    key={i}
                    className={`p-2 rounded-lg transition-colors ${
                      i === 15 
                        ? 'bg-blue-500 text-white' 
                        : i > 5 && i < 30 
                        ? 'hover:bg-blue-100 text-gray-700' 
                        : 'text-gray-300'
                    }`}
                  >
                    {i > 5 && i < 30 ? i - 5 : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block font-medium text-gray-700 mb-3">Available Time Slots</label>
              <div className="grid grid-cols-3 gap-3">
                {['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'].map((time) => (
                  <button
                    key={time}
                    className="p-3 border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors"
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
                <label className="block font-medium text-gray-700 mb-2">Number of Adults</label>
                <select className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none">
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>3 Adults</option>
                  <option>4 Adults</option>
                </select>
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">Number of Children</label>
                <select className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none">
                  <option>0 Children</option>
                  <option>1 Child</option>
                  <option>2 Children</option>
                  <option>3 Children</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Special Requests</label>
              <textarea 
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none h-24"
                placeholder="Any dietary restrictions, accessibility needs, or special requests..."
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Payment & Confirmation</h3>
            
            {/* Booking Summary */}
            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-bold text-blue-800 mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Tour:</span>
                  <span>{experienceTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guide:</span>
                  <span>{hostName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>Aug 16, 2025 at 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Group:</span>
                  <span>2 Adults</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>Rp 1,060,000</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="+62 123 456 7890"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderPhotographyBooking = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Select Photography Package</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Essential', duration: '1 hour', photos: '25 photos', price: 'Rp 420,000' },
                { name: 'Premium', duration: '2 hours', photos: '50 photos', price: 'Rp 750,000' },
                { name: 'Ultimate', duration: '3 hours', photos: '100 photos', price: 'Rp 1,200,000' }
              ].map((pkg) => (
                <button
                  key={pkg.name}
                  className="p-4 border-2 border-pink-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-colors text-left"
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
                    className="p-3 border-2 border-pink-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-colors"
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Step {currentStep} content for photography booking...</p>
          </div>
        );
    }
  };

  const renderTripPlannerBooking = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">Trip Planning Requirements</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Destination</label>
            <input 
              type="text"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              placeholder="Tokyo, Japan"
            />
          </div>
          
          <div>
            <label className="block font-medium text-gray-700 mb-2">Trip Duration</label>
            <select className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none">
              <option>3 Days</option>
              <option>5 Days</option>
              <option>7 Days</option>
              <option>10+ Days</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">Budget Range (per person)</label>
          <div className="grid grid-cols-2 gap-3">
            {['< $50/day', '$50-100/day', '$100-200/day', '$200+/day'].map((budget) => (
              <button
                key={budget}
                className="p-3 border-2 border-green-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                {budget}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">Travel Interests</label>
          <div className="grid grid-cols-3 gap-2">
            {['Food', 'Culture', 'Shopping', 'Photography', 'History', 'Adventure'].map((interest) => (
              <label key={interest} className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-green-300 text-green-500" />
                <span className="text-sm">{interest}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderComboBooking = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">Select Combo Services</h3>
        
        <div className="space-y-4">
          {[
            { service: 'Guide Service', emoji: '🧑‍💼', included: true },
            { service: 'Photography', emoji: '📸', included: true },
            { service: 'Trip Planning', emoji: '📝', included: false },
            { service: 'Transportation', emoji: '🚗', included: false }
          ].map((item) => (
            <label key={item.service} className="flex items-center space-x-4 p-4 border-2 border-purple-200 rounded-xl">
              <input 
                type="checkbox" 
                defaultChecked={item.included}
                className="rounded border-purple-300 text-purple-500 w-5 h-5" 
              />
              <span className="text-2xl">{item.emoji}</span>
              <span className="font-medium text-gray-700">{item.service}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const getStepsCount = () => {
    switch (category) {
      case 'guide': return 3;
      case 'photographer': return 4;
      case 'tripplanner': return 4;
      case 'combo': return 5;
      default: return 3;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'guide': return 'from-blue-500 to-blue-600';
      case 'photographer': return 'from-pink-500 to-pink-600';
      case 'tripplanner': return 'from-green-500 to-green-600';
      case 'combo': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Book Experience</h2>
              <p className="text-gray-600">{experienceTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {getStepsCount()}</span>
              <span>{Math.round((currentStep / getStepsCount()) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${getCategoryColor()} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${(currentStep / getStepsCount()) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {getStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            ← Previous
          </button>
          
          {currentStep < getStepsCount() ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className={`px-6 py-3 bg-gradient-to-r ${getCategoryColor()} text-white rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={() => {
                showToast('Booking completed! (Demo)', 'success');
                onClose();
              }}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Complete Booking! ✅
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
