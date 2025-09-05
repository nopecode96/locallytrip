'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login',
  allowedRoles = ['traveller', 'host'] 
}: AuthGuardProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        // Not authenticated, redirect to login
        router.push(redirectTo);
        return;
      }

      if (requireAuth && isAuthenticated && user && allowedRoles.length > 0) {
        // Check if user has allowed role
        if (!allowedRoles.includes(user.role)) {
          // User doesn't have permission, redirect to appropriate dashboard
          if (user.role === 'host') {
            router.push('/host/dashboard');
          } else {
            router.push('/dashboard');
          }
          return;
        }
      }
    }
  }, [isAuthenticated, user, loading, requireAuth, allowedRoles, redirectTo, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If user doesn't have permission, don't render children
  if (requireAuth && isAuthenticated && user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
