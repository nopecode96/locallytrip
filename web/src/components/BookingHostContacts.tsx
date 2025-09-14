import React from 'react';
import { useHostContactsForBooking } from '@/hooks/useCommunication';
import { CommunicationAppIcon } from './CommunicationContacts';

interface BookingHostContactsProps {
  bookingId: string;
  className?: string;
}

export const BookingHostContacts: React.FC<BookingHostContactsProps> = ({
  bookingId,
  className = ''
}) => {
  const { hostData, loading, error } = useHostContactsForBooking(bookingId);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-600 text-sm ${className}`}>
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!hostData || hostData.contacts.length === 0) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        <p>No communication contacts available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="font-semibold text-gray-900">
        Contact {hostData.hostName}
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {hostData.contacts.map((contact) => (
          <a
            key={contact.id}
            href={contact.contactLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center space-x-2 p-2 rounded-lg border transition-all
              hover:border-blue-300 hover:bg-blue-50
              ${contact.isPreferred ? 'border-blue-400 bg-blue-25' : 'border-gray-200'}
            `}
          >
            <CommunicationAppIcon 
              app={contact.app} 
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900">
                {contact.app.displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {contact.contactValue}
              </p>
            </div>
            {contact.isPreferred && (
              <span className="text-xs text-blue-600 font-medium">
                Preferred
              </span>
            )}
          </a>
        ))}
      </div>

      <div className="text-xs text-gray-500 mt-2">
        💡 These contacts are available because your booking payment was successful
      </div>
    </div>
  );
};

interface QuickContactActionsProps {
  bookingId: string;
  className?: string;
}

export const QuickContactActions: React.FC<QuickContactActionsProps> = ({
  bookingId,
  className = ''
}) => {
  const { hostData, loading, error } = useHostContactsForBooking(bookingId);

  if (loading || error || !hostData) {
    return null;
  }

  // Get the preferred contact or first available
  const preferredContact = hostData.contacts.find(c => c.isPreferred) || hostData.contacts[0];
  
  if (!preferredContact) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <a
        href={preferredContact.contactLink || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <CommunicationAppIcon 
          app={preferredContact.app} 
          size="sm"
        />
        <span>Contact Host</span>
      </a>
    </div>
  );
};
