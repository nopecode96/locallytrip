'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { useHostExperiencesStats, useHostExperiences } from '../../../hooks/useHostExperiences';
import { ImageService } from '../../../services/imageService';
import SimpleImage from '../../../components/SimpleImage';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Helper function to format currency
function formatCurrency(amount: string | number, currency: string = 'IDR') {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(numAmount);
}

// Helper function to format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function HostExperiencesPage() {
  const { user, loading: authLoading } = useAuth();
  const [experiencesData, setExperiencesData] = useState<any>(null);
  const [experiencesLoading, setExperiencesLoading] = useState(false); // Changed to false by default
  const [experiencesError, setExperiencesError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  
  // Get hostId from user context
  const hostId = user?.id || user?.uuid;
  
  // Manual fetch function - since useEffect isn't working in dev environment
  const fetchExperiences = async () => {
    if (!hostId) {
      return;
    }
    
    try {
      setExperiencesLoading(true);
      setExperiencesError(null);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('❌ No token found');
        setExperiencesError('Authentication required');
        return;
      }

      // Updated: Use correct frontend API route (no /api/v1 prefix)
      const response = await fetch(`/api/hosts/${hostId}/experiences/?page=1&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          const transformedData = {
            experiences: result.data || [],
            pagination: result.pagination || { page: 1, limit: 10, total: result.data?.length || 0, totalPages: 1 }
          };
          setExperiencesData(transformedData);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ API error:', response.status, errorText);
        setExperiencesError(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Manual fetch error:', error);
      setExperiencesError(error instanceof Error ? error.message : 'Failed to fetch experiences');
    } finally {
      setExperiencesLoading(false);
    }
  };
  
  // Auto-fetch immediately when hostId is available
  if (hostId && !experiencesData && !hasAttemptedFetch && !authLoading) {
    setHasAttemptedFetch(true);
    fetchExperiences();
  }
  
  // Memoize filters to prevent unnecessary re-renders
  const filters = useMemo(() => ({
    status: activeTab === 'all' ? undefined : activeTab,
    page: currentPage,
    limit: 10
  }), [activeTab, currentPage]);
  
  // Fetch experiences stats and list - only when we have valid hostId
  const { data: stats, loading: statsLoading, error: statsError } = useHostExperiencesStats(hostId || '');

  // Show loading only while data is loading (ignore auth loading for now)
  if (experiencesLoading && !experiencesData) {
    return (
      <DashboardLayout allowedRoles={['host']}>
        <div className="bg-white min-h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
              <p className="ml-4 text-gray-600">Loading experiences...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (statsError || experiencesError) {
    return (
      <DashboardLayout allowedRoles={['host']}>
        <div className="bg-white min-h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading experiences
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{statsError || experiencesError}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const experiences = experiencesData?.experiences || [];
  const pagination = experiencesData?.pagination;
  
  return (
    <DashboardLayout allowedRoles={['host']}>
      <div className="bg-white min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Experiences</h1>
              <p className="text-gray-600 mt-2">Manage and track all your hosted experiences</p>
            </div>
            <Link 
              href="/host/experiences/create"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Experience
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.active || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.pending || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Views</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.totalViews || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.totalBookings || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Experiences', count: stats?.total || 0 },
                { key: 'active', label: 'Active', count: stats?.active || 0 },
                { key: 'pending', label: 'Pending Approval', count: stats?.pending || 0 },
                { key: 'draft', label: 'Draft', count: stats?.draft || 0 }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab.key
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Experiences List or Empty State */}
          {experiences.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6">
                {experiences.map((experience: any) => (
                  <div key={experience.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      {/* Experience Image */}
                      <div className="flex-shrink-0 w-48">
                        <SimpleImage
                          imagePath={experience.images?.[0] || experience.coverImage || '/images/placeholders/experience-placeholder.jpg'}
                          alt={experience.title}
                          width={192}
                          height={200}
                          className="w-full h-full object-cover rounded-l-lg"
                          placeholderType="experience"
                          category="experiences"
                        />
                      </div>
                      
                      {/* Experience Details */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                {experience.title}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                experience.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {experience.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {experience.shortDescription || experience.description}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {experience.duration}h
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Max {experience.maxGuests} guests
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {experience.viewCount} views
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {experience.bookingCount} bookings
                              </span>
                            </div>
                          </div>
                          
                          {/* Price and Actions */}
                          <div className="text-right ml-6">
                            <div className="mb-4">
                              <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(experience.pricePerPackage, experience.currency)}
                              </p>
                              <p className="text-sm text-gray-500">per experience</p>
                            </div>
                            
                            <div className="space-y-2">
                              <Link
                                href={`/host/experiences/${experience.id}/edit`}
                                className="w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                Edit
                              </Link>
                              <Link
                                href={`/explore/${experience.slug}`}
                                target="_blank"
                                className="w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                Preview
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total experiences)
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-sm font-medium text-gray-700">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                      disabled={currentPage === pagination.totalPages}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {activeTab === 'all' ? 'No experiences yet' : `No ${activeTab} experiences`}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'all' 
                  ? 'Get started by creating your first experience for travelers to discover.'
                  : `You don't have any ${activeTab} experiences at the moment.`
                }
              </p>
              {activeTab === 'all' && (
                <div className="mt-6">
                  <Link
                    href="/host/experiences/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Your First Experience
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
