'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
}

interface ToastContextValue {
  toast: ToastState;
  showToast: (message: string, type: ToastState['type']) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ message, type, isVisible: true });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      hideToast();
    }, 5000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const value: ToastContextValue = {
    toast,
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
