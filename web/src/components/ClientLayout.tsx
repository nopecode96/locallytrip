'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider, useToast } from '../contexts/ToastContext';
import { BrowserExtensionSuppressor } from './BrowserExtensionSuppressor';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from './ui/Toast';

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayoutInner: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { toast, hideToast } = useToast();
  
  // Show navbar on all pages including dashboard, hide footer on dashboard and all host pages
  const isDashboardPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/host');

  return (
    <>
      <Navbar />
      <main className={isDashboardPage ? '' : ''}>
        {children}
      </main>
      {!isDashboardPage && <Footer />}
      
      {/* Global Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <BrowserExtensionSuppressor>
      <AuthProvider>
        <ToastProvider>
          <ClientLayoutInner>
            {children}
          </ClientLayoutInner>
        </ToastProvider>
      </AuthProvider>
    </BrowserExtensionSuppressor>
  );
}
