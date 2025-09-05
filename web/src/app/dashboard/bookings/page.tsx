'use client';

import DashboardLayout from '../../../components/DashboardLayout';

export default function BookingsPage() {
  return (
    <DashboardLayout allowedRoles={['traveller']}>
      <div className="bg-white min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">Manage all your experience bookings in one place</p>
          </div>

          {/* Booking Status Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button className="border-purple-500 text-purple-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                Upcoming
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                Completed
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                Cancelled
              </button>
            </nav>
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start exploring experiences to make your first booking!
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explore Experiences
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
