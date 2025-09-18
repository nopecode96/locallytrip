import React from 'react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
  rejectionReason?: string;
  statusInfo: {
    title: string;
    description: string;
    nextSteps?: string;
    emoji: string;
    color: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  };
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-600',
    button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-800',
    icon: 'text-gray-600',
    button: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
  }
};

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  status,
  rejectionReason,
  statusInfo,
}) => {
  if (!isOpen) return null;

  const colors = colorClasses[statusInfo.color];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
          {/* Header with emoji and close button */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{statusInfo.emoji}</span>
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                {statusInfo.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 mb-4`}>
            <div className="space-y-4">
              {/* Description */}
              <div>
                <h4 className={`text-sm font-medium ${colors.text} mb-2`}>Description</h4>
                <p className={`text-sm ${colors.text} opacity-90`}>
                  {statusInfo.description}
                </p>
              </div>

              {/* Show rejection reason if status is rejected */}
              {status === 'rejected' && rejectionReason && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                  <h4 className="text-sm font-medium text-red-800 mb-1">Admin Feedback:</h4>
                  <p className="text-sm text-red-700">{rejectionReason}</p>
                </div>
              )}

              {/* Next Steps */}
              {statusInfo.nextSteps && (
                <div className="p-3 bg-white bg-opacity-50 rounded-md">
                  <h4 className={`text-sm font-medium ${colors.text} mb-2`}>Next Steps:</h4>
                  <p className={`text-sm ${colors.text} opacity-90`}>{statusInfo.nextSteps}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
