import React from 'react';
import Image from 'next/image';
import { FormattedUserContact, CommunicationApp } from '@/types/communication';
import { CommunicationService } from '@/services/communicationService';

interface CommunicationContactItemProps {
  contact: FormattedUserContact;
  showContactValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (contact: FormattedUserContact) => void;
}

export const CommunicationContactItem: React.FC<CommunicationContactItemProps> = ({
  contact,
  showContactValue = false,
  size = 'md',
  onClick
}) => {
  const iconSize = size === 'sm' ? 24 : size === 'md' ? 32 : 40;
  
  const handleClick = () => {
    if (onClick) {
      onClick(contact);
    } else if (contact.contactLink) {
      window.open(contact.contactLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className={`
        flex items-center gap-2 p-2 rounded-lg border cursor-pointer 
        hover:bg-gray-50 transition-colors
        ${contact.isPreferred ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
        ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}
      `}
      onClick={handleClick}
      title={`Contact via ${contact.app.displayName}${contact.isPreferred ? ' (Preferred)' : ''}`}
    >
      <div className="relative flex-shrink-0">
        <Image
          src={CommunicationService.getAppIconUrl(contact.app)}
          alt={contact.app.displayName}
          width={iconSize}
          height={iconSize}
          className="rounded"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            // Fallback to text if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {contact.isPreferred && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900">
          {contact.app.displayName}
        </div>
        {showContactValue && (
          <div className="text-gray-600 truncate">
            {contact.contactValue}
          </div>
        )}
      </div>
      
      {contact.contactLink && (
        <div className="text-gray-400">
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
            />
          </svg>
        </div>
      )}
    </div>
  );
};

interface CommunicationContactListProps {
  contacts: FormattedUserContact[];
  title?: string;
  showContactValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
  maxDisplay?: number;
  onContactClick?: (contact: FormattedUserContact) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export const CommunicationContactList: React.FC<CommunicationContactListProps> = ({
  contacts,
  title = "Communication",
  showContactValues = false,
  size = 'md',
  maxDisplay,
  onContactClick,
  loading = false,
  emptyMessage = "No communication contacts available"
}) => {
  const displayContacts = maxDisplay ? contacts.slice(0, maxDisplay) : contacts;
  const hasMore = maxDisplay && contacts.length > maxDisplay;

  if (loading) {
    return (
      <div className="space-y-2">
        {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 p-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-4">
        {title && <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>}
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {title && (
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          {title}
          <span className="text-sm font-normal text-gray-500">
            ({contacts.length})
          </span>
        </h3>
      )}
      
      <div className="space-y-2">
        {displayContacts.map((contact) => (
          <CommunicationContactItem
            key={contact.id}
            contact={contact}
            showContactValue={showContactValues}
            size={size}
            onClick={onContactClick}
          />
        ))}
        
        {hasMore && (
          <div className="text-center py-2">
            <span className="text-sm text-gray-500">
              +{contacts.length - maxDisplay!} more
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface CommunicationAppIconProps {
  app: CommunicationApp;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CommunicationAppIcon: React.FC<CommunicationAppIconProps> = ({
  app,
  size = 'md',
  className = ''
}) => {
  const iconSize = size === 'sm' ? 20 : size === 'md' ? 24 : 32;
  
  return (
    <div className={`relative ${className}`}>
      <Image
        src={CommunicationService.getAppIconUrl(app)}
        alt={app.displayName}
        width={iconSize}
        height={iconSize}
        className="rounded"
        title={app.displayName}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          // Fallback to first letter if image fails
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
};

interface QuickContactButtonsProps {
  contacts: FormattedUserContact[];
  maxButtons?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const QuickContactButtons: React.FC<QuickContactButtonsProps> = ({
  contacts,
  maxButtons = 3,
  size = 'md',
  showLabels = false
}) => {
  const displayContacts = contacts.slice(0, maxButtons);
  const buttonSize = size === 'sm' ? 'p-2' : size === 'md' ? 'p-3' : 'p-4';
  
  return (
    <div className="flex gap-2">
      {displayContacts.map((contact) => (
        <button
          key={contact.id}
          onClick={() => {
            if (contact.contactLink) {
              window.open(contact.contactLink, '_blank', 'noopener,noreferrer');
            }
          }}
          className={`
            ${buttonSize} rounded-full border border-gray-300 
            hover:border-gray-400 hover:bg-gray-50 
            transition-colors group relative
            ${contact.isPreferred ? 'border-blue-500 bg-blue-50' : ''}
          `}
          title={`Contact via ${contact.app.displayName}`}
          disabled={!contact.contactLink}
        >
          <CommunicationAppIcon app={contact.app} size={size} />
          
          {showLabels && (
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
              {contact.app.name}
            </span>
          )}
          
          {contact.isPreferred && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
          )}
        </button>
      ))}
      
      {contacts.length > maxButtons && (
        <div className={`
          ${buttonSize} rounded-full border border-gray-300 
          bg-gray-100 flex items-center justify-center
          text-gray-600 text-sm font-medium
        `}>
          +{contacts.length - maxButtons}
        </div>
      )}
    </div>
  );
};
