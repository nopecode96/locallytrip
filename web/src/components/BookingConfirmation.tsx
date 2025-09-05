import React from 'react';
import Link from 'next/link';
import { CheckCircle, Calendar, MapPin, Users, Camera, FileText, Star } from 'lucide-react';

interface BookingConfirmationProps {
  bookingReference: string;
  experience: any;
  bookingDetails: any;
  onNewBooking: () => void;
}

export default function BookingConfirmation({
  bookingReference,
  experience,
  bookingDetails,
  onNewBooking
}: BookingConfirmationProps) {
  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'photographer':
        return <Camera className="w-5 h-5" />;
      case 'trip planner':
        return <FileText className="w-5 h-5" />;
      case 'combo guide':
        return <Star className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-green-200 rounded-xl p-6 shadow-lg">
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">Your booking has been successfully submitted</p>
      </div>

      {/* Booking Reference */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-green-700 mb-1">Booking Reference</p>
          <p className="text-xl font-bold text-green-800 font-mono tracking-wider">
            {bookingReference}
          </p>
          <p className="text-xs text-green-600 mt-2">
            Please save this reference number for your records
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          {getCategoryIcon(experience.category?.name)}
          Booking Details
        </h3>

        {/* Experience Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <img
              src={experience.images?.[0] || '/images/placeholder-experience.jpg'}
              alt={experience.title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-grow">
              <h4 className="font-medium text-gray-900 mb-1">{experience.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{experience.category?.name}</p>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {experience.city?.name || 'Location TBD'}
              </div>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        {bookingDetails.selectedDate && (
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Date & Time</p>
              <p className="text-sm text-gray-600">
                {formatDate(bookingDetails.selectedDate)}
                {bookingDetails.selectedTime && ` at ${bookingDetails.selectedTime}`}
              </p>
            </div>
          </div>
        )}

        {/* Participants */}
        {bookingDetails.participantCount && (
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">
                {experience.category?.name === 'Photographer' ? 'People in Session' : 'Participants'}
              </p>
              <p className="text-sm text-gray-600">
                {bookingDetails.participantCount} {bookingDetails.participantCount === 1 ? 'person' : 'people'}
              </p>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-xs font-medium text-purple-600">@</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">Contact Information</p>
            <p className="text-sm text-gray-600">{bookingDetails.contactInfo?.name}</p>
            <p className="text-sm text-gray-600">{bookingDetails.contactInfo?.email}</p>
            <p className="text-sm text-gray-600">{bookingDetails.contactInfo?.phone}</p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h3 className="font-semibold text-gray-900">What happens next?</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <p className="text-sm text-gray-700">
              You'll receive a confirmation email with all the details shortly
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">2</span>
            </div>
            <p className="text-sm text-gray-700">
              Your host will contact you within 24 hours to confirm the booking
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">3</span>
            </div>
            <p className="text-sm text-gray-700">
              Payment will be processed after confirmation by the host
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 space-y-3">
        <button
          onClick={onNewBooking}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        >
          Book Another Experience
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/explore"
            className="block text-center border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Browse More
          </Link>
          <Link
            href={`/booking/status/${bookingReference}`}
            className="block text-center border border-purple-300 text-purple-700 font-medium py-3 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Track Booking
          </Link>
        </div>
      </div>

      {/* Support Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Need help? Contact us at{' '}
          <a href="mailto:support@locallytrip.com" className="text-purple-600 hover:underline">
            support@locallytrip.com
          </a>{' '}
          or WhatsApp +62 812 3456 7890
        </p>
      </div>
    </div>
  );
}
