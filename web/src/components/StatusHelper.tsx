'use client';

import { useState } from 'react';
import StatusModal from './StatusModal';

interface StatusInfo {
  title: string;
  description: string;
  nextSteps?: string;
  emoji: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

const statusInfoMap: Record<string, StatusInfo> = {
  draft: {
    title: 'Draft - Work in Progress',
    description: 'Your experience is still in draft mode. You can edit and complete the information before submitting for review.',
    nextSteps: 'Click "Submit for Review" to send to admin for review and publication.',
    emoji: '📝',
    color: 'blue'
  },
  pending_review: {
    title: 'Pending Review - Under Admin Review',
    description: 'Your experience has been submitted and is currently being reviewed by our admin team. Review process typically takes 1-3 business days.',
    nextSteps: 'Please wait for admin confirmation. You will receive notification when your experience is approved or needs revision.',
    emoji: '⏳',
    color: 'yellow'
  },
  published: {
    title: 'Published - Live & Bookable',
    description: 'Congratulations! Your experience has been approved and published. Visitors can now view and book your experience.',
    nextSteps: 'Your experience is active and bookable. You can pause temporarily if maintenance is needed.',
    emoji: '✅',
    color: 'green'
  },
  rejected: {
    title: 'Rejected - Needs Revision',
    description: 'Your experience requires revision based on admin feedback. Please review the feedback notes and make necessary improvements.',
    nextSteps: 'Make revisions according to feedback, then click "Resubmit for Review" to resubmit.',
    emoji: '❌',
    color: 'red'
  },
  paused: {
    title: 'Paused - Temporarily Inactive',
    description: 'Your experience is temporarily paused and cannot be booked. This status is useful for maintenance or updates.',
    nextSteps: 'Click "Resume" to reactivate your experience.',
    emoji: '⏸️',
    color: 'gray'
  },
  suspended: {
    title: 'Suspended - Administrative Hold',
    description: 'Your experience has been suspended by admin due to policy violations or issues that need to be resolved.',
    nextSteps: 'Contact customer service for more information about resolving the issue.',
    emoji: '🚫',
    color: 'red'
  },
  deleted: {
    title: 'Deleted - Permanently Removed',
    description: 'Your experience has been permanently deleted and is no longer available to visitors.',
    nextSteps: 'This experience cannot be recovered. Create a new experience if needed.',
    emoji: '🗑️',
    color: 'gray'
  }
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-600'
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-600'
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-600'
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-800',
    icon: 'text-gray-600'
  }
};

interface StatusHelperProps {
  status: string;
  rejectionReason?: string;
  className?: string;
}

export default function StatusHelper({ status, rejectionReason, className = '' }: StatusHelperProps) {
  const [showModal, setShowModal] = useState(false);
  
  const statusInfo = statusInfoMap[status];
  if (!statusInfo) return null;

  const colors = colorClasses[statusInfo.color];

  return (
    <>
      <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 ${className}`}>
        <div className="flex items-start space-x-3">
          <span className="text-xl">{statusInfo.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${colors.text}`}>
                {statusInfo.title}
              </h3>
              <button
                onClick={() => setShowModal(true)}
                className={`text-xs ${colors.text} hover:underline flex-shrink-0`}
              >
                More Info
              </button>
            </div>
            
           

            {/* Show rejection reason if status is rejected */}
            {status === 'rejected' && rejectionReason && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-md">
                <h4 className="text-sm font-medium text-red-800 mb-1">Admin Feedback:</h4>
                <p className="text-sm text-red-700">{rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Modal */}
      <StatusModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        status={status}
        rejectionReason={rejectionReason}
        statusInfo={statusInfo}
      />
    </>
  );
}

// Quick status indicator component for cards
interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  showDescription?: boolean;
}

export function StatusBadge({ status, size = 'sm', showDescription = false }: StatusBadgeProps) {
  const statusInfo = statusInfoMap[status];
  if (!statusInfo) return null;

  const colors = colorClasses[statusInfo.color];
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';

  return (
    <div className="flex items-center space-x-2">
      <span className={`inline-flex items-center ${sizeClasses} rounded-full font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
        <span className="mr-1">{statusInfo.emoji}</span>
        <span className="capitalize">
          {status.replace('_', ' ')}
        </span>
      </span>
      
      {showDescription && size === 'md' && (
        <span className={`text-xs ${colors.text} opacity-75`}>
          {statusInfo.title.split(' - ')[1]}
        </span>
      )}
    </div>
  );
}
