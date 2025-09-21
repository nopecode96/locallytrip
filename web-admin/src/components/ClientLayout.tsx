'use client';

import React from 'react';
import { ToastProvider, useToast } from '../contexts/ToastContext';
import Toast from './ui/Toast';

// Toast renderer component 
function ToastRenderer() {
  const { toast, hideToast } = useToast();
  
  return (
    <Toast
      message={toast.message}
      type={toast.type}
      isVisible={toast.isVisible}
      onClose={hideToast}
    />
  );
}

// Main client layout wrapper
function ClientLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastRenderer />
    </>
  );
}

// Exported client layout with providers
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ClientLayoutInner>
        {children}
      </ClientLayoutInner>
    </ToastProvider>
  );
}