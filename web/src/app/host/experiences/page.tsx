'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { useHostExperiencesStats, useHostExperiences } from '../../../hooks/useHostExperiences';
import { ImageService } from '../../../services/imageService';
import SimpleImage from '../../../components/SimpleImage';
import StatusHelper, { StatusBadge } from '../../../components/StatusHelper';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

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
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get hostId from user context
  const hostId = user?.id || user?.uuid;
  
  // Memoize filters to prevent unnecessary re-renders
  const filters = useMemo(() => ({
    status: activeTab === 'all' ? undefined : activeTab,
    page: currentPage,
    limit: 10
  }), [activeTab, currentPage]);
  
  // Fetch experiences using hook - AuthGuard ensures authentication
  const { data: experiencesData, loading: experiencesLoading, error: experiencesError } = useHostExperiences(hostId || '', filters);
  const { data: stats, loading: statsLoading, error: statsError } = useHostExperiencesStats(hostId || '');

  // Show loading while auth is loading OR data is being fetched
  if (authLoading || experiencesLoading) {
    return (
      <div className="bg-white min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            <p className="ml-4 text-gray-600">Loading experiences...</p>
          </div>
        </div>
      </div>
    );
  }

  if (statsError || experiencesError) {
    return (
      <div className="bg-white min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading experiences
                </h3>
                <p className="text-sm text-red-700 mt-1">{statsError || experiencesError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Refresh page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const experiences = experiencesData?.experiences || [];
  const pagination = experiencesData?.pagination;
  
  // Debug logging - simplified
  if (user) {
    console.log('✅ User authenticated:', user.name, 'ID:', user.id);
  } else {
    console.log('❌ No user found');
  }
  
  if (experiencesData) {
    console.log('✅ Experiences loaded:', experiencesData.experiences?.length || 0);
  } else if (experiencesError) {
    console.log('❌ Experiences error:', experiencesError);
  } else if (experiencesLoading) {
    console.log('⏳ Loading experiences...');
  }
  
  return (
    <>
      <div className="bg-white min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Experiences</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage and track all your hosted experiences</p>
            </div>
            <Link 
              href="/host/experiences/create"
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center sm:w-auto"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Create New Experience</span>
              <span className="sm:hidden">Create New</span>
            </Link>
          </div>

          {/* Workflow Information Banner */}
          <div className="mb-6 sm:mb-8 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <span className="text-xl sm:text-2xl">ℹ️</span>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-800 mb-1">Experience Publishing Workflow</h3>
                <p className="text-xs sm:text-sm text-blue-700 mb-2">
                  New experiences start as <strong>Draft</strong>. Once complete, submit for review. Our admin team will review within 1-3 business days and either publish or provide feedback for improvement.
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-2 text-xs">
                  <span className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    📝 Draft → ⏳ Under Review → ✅ Published
                  </span>
                  <span className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    ❌ If rejected, revise and resubmit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.total || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Experiences</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{stats?.published || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Published</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Under Review</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-xl sm:text-2xl font-bold text-gray-600">{stats?.draft || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Drafts</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6 sm:mb-8">
            <nav className="-mb-px flex flex-wrap sm:space-x-8 space-x-2 sm:space-x-8">
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
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {experiences.map((experience: any) => (
                  <div key={experience.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div key={experience.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:h-64 md:h-72 lg:h-64">
                      {/* Experience Image */}
                      <div className="w-full sm:w-48 md:w-56 lg:w-48 h-56 sm:h-full flex-shrink-0">
                        <SimpleImage
                          imagePath={experience.images?.[0] || experience.coverImage || '/images/placeholders/experience-placeholder.jpg'}
                          alt={experience.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover object-center rounded-t-lg sm:rounded-t-none sm:rounded-l-lg display-block"
                          placeholderType="experience"
                          category="experiences"
                        />
                      </div>
                      
                      {/* Experience Details */}
                      <div className="flex-1 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                {experience.title}
                              </h3>
                              <StatusBadge status={experience.status} size="sm" />
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {experience.shortDescription || experience.description}
                            </p>
                            
                            <div className="grid grid-cols-2 sm:flex sm:items-center sm:space-x-4 gap-2 sm:gap-0 text-sm text-gray-500 mb-3 sm:mb-0">
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
                            
                            {/* Status Helper - Show detailed status information */}
                            <StatusHelper 
                              status={experience.status} 
                              rejectionReason={experience.rejectionReason}
                              className="mt-3"
                            />
                          </div>
                          
                          {/* Price and Actions */}
                          <div className="sm:text-right sm:ml-6 mt-4 sm:mt-0">
                            <div className="mb-4">
                              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                {formatCurrency(experience.pricePerPackage, experience.currency)}
                              </p>
                              <p className="text-sm text-gray-500">per experience</p>
                            </div>
                            
                            <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                              <Link
                                href={`/host/experiences/${experience.id}/edit`}
                                className="flex-1 sm:w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                Edit
                              </Link>
                              <Link
                                href={`/explore/${experience.slug}`}
                                target="_blank"
                                className="flex-1 sm:w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                Preview
                              </Link>
                            </div>
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
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                    Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total experiences)
                  </div>
                  <div className="flex justify-center sm:justify-end space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>
                    <span className="px-3 py-2 text-sm font-medium text-gray-700">
                      <span className="hidden sm:inline">Page {currentPage} of {pagination.totalPages}</span>
                      <span className="sm:hidden">{currentPage}/{pagination.totalPages}</span>
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
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
                {activeTab === 'all' ? 'No experiences yet' : `No ${activeTab} experiences`}
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
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
                    <span className="hidden sm:inline">Create Your First Experience</span>
                    <span className="sm:hidden">Create Experience</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
