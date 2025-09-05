import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  if (!isVisible) return null;

  const baseClasses = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl max-w-sm";
  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white", 
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-black"
  };

  const icons = {
    success: "✅",
    error: "❌", 
    info: "ℹ️",
    warning: "⚠️"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} animate-slide-in-from-right`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2 text-lg">{icons[type]}</span>
          <span className="text-sm font-medium whitespace-pre-line">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-xl hover:opacity-75 transition-opacity"
        >
          ×
        </button>
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-black/20 animate-progress"></div>
    </div>
  );
};

export default Toast;
