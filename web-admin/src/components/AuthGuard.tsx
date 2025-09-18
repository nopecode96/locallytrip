'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/login' 
}) => {
  const { user, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If user is not authenticated, redirect to login
      if (!user) {
        router.push(fallbackPath);
        return;
      }

      // If specific roles are required, check user role
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, loading, router, requiredRoles, fallbackPath]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Check role authorization
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized, render children
  return <>{children}</>;
};

export default AuthGuard;
