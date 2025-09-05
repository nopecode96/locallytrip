'use client'

import React, { useEffect } from 'react'
import { useAdminAuth } from '@/contexts/AdminContext'
import { useRouter } from 'next/navigation'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const { user, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
