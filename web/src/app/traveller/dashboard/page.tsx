'use client';

import React from 'react';
import Link from 'next/link';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useRouter } from 'next/navigation';

export default function TravellerDashboard() {
  const { user, loading, error } = useUserProfile();
  const router = useRouter();

  // Redirect if not authenticated or if host
  React.useEffect(() => {
    if (!loading && (!user || user.role === 'host')) {
      if (!user) {
        router.push('/login');
      } else {
        router.push('/host/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !user || user.role === 'host') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center">
                <span className="mr-2">←</span>
                Back to Home
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Traveller Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
              <span className="text-sm text-gray-600">✈️</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl text-white p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}! ✈️</h2>
          <p className="text-green-100 text-lg">Ready for your next adventure?</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/traveller/profile"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👤</span>
              <div>
                <h3 className="font-semibold text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-600">Manage your profile information</p>
              </div>
            </div>
          </Link>

          <Link
            href="/traveller/bookings"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-semibold text-gray-900">My Bookings</h3>
                <p className="text-sm text-gray-600">View and manage your trips</p>
              </div>
            </div>
          </Link>

          <Link
            href="/explore"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌍</span>
              <div>
                <h3 className="font-semibold text-gray-900">Explore</h3>
                <p className="text-sm text-gray-600">Discover new experiences</p>
              </div>
            </div>
          </Link>

          <Link
            href="/traveller/settings"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Account preferences</p>
              </div>
            </div>
          </Link>

          <Link
            href="/become-host"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🏠</span>
              <div>
                <h3 className="font-semibold text-gray-900">Become a Host</h3>
                <p className="text-sm text-gray-600">Start hosting experiences</p>
              </div>
            </div>
          </Link>

          <Link
            href="/help"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">❓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Help & Support</h3>
                <p className="text-sm text-gray-600">Get assistance</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl">📱</span>
            <p className="mt-2">No recent activity yet</p>
            <p className="text-sm">Start exploring experiences to see your activity here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
