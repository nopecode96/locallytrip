import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  autoClose = true,
  duration = 4000,
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-400' : 'text-red-400';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-from-right">
      <div className={`max-w-sm w-full ${bgColor} border rounded-xl shadow-lg p-4`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${textColor}`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className={`rounded-md inline-flex ${textColor} hover:bg-opacity-20 hover:bg-current focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current`}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="mt-2 w-full bg-white bg-opacity-40 rounded-full h-1">
            <div 
              className={`h-1 rounded-full ${type === 'success' ? 'bg-green-400' : 'bg-red-400'} animate-progress`}
              style={{ animationDuration: `${duration}ms` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;
