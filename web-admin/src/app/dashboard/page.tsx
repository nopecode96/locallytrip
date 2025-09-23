'use client';

import { useAdminAuth } from '@/contexts/AdminContext';
import AdminNavbar from '@/components/AdminNavbar';

const DashboardPage = () => {
  const { user } = useAdminAuth();

  // Check if user has permission to access dashboard
  if (!user || !['super_admin', 'admin', 'moderator', 'finance', 'marketing'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        <div className="flex-1 lg:ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavbar />
      
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user.name}. Here's your overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <span className="text-blue-600 font-semibold">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">1,248</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <span className="text-green-600 font-semibold">🎯</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Experiences</p>
              <p className="text-2xl font-bold text-green-600">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">📅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Bookings</p>
              <p className="text-2xl font-bold text-yellow-600">23</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <span className="text-purple-600 font-semibold">⭐</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured Hosts</p>
              <p className="text-2xl font-bold text-purple-600">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-600 mt-1">Frequently used management tools</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/content/featured-hosts" className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors block group">
              <div className="text-purple-600 text-xl mb-2 group-hover:scale-110 transition-transform">✨</div>
              <p className="text-sm font-medium text-gray-800">Manage Featured Hosts</p>
              <p className="text-xs text-gray-500 mt-1">Add or remove featured hosts</p>
            </a>
            <a href="/users" className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors block group">
              <div className="text-blue-600 text-xl mb-2 group-hover:scale-110 transition-transform">👥</div>
              <p className="text-sm font-medium text-gray-800">Manage Users</p>
              <p className="text-xs text-gray-500 mt-1">User accounts and roles</p>
            </a>
            <a href="/stories/comments" className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors block group">
              <div className="text-green-600 text-xl mb-2 group-hover:scale-110 transition-transform">📖</div>
              <p className="text-sm font-medium text-gray-800">Manage Stories</p>
              <p className="text-xs text-gray-500 mt-1">Stories and comments</p>
            </a>
            <a href="/experiences" className="p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors block group">
              <div className="text-orange-600 text-xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
              <p className="text-sm font-medium text-gray-800">Manage Experiences</p>
              <p className="text-xs text-gray-500 mt-1">Experience listings</p>
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-600 mt-1">Latest system activities</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New user registered: John Doe</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Experience approved: Bali Cultural Tour</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New booking received</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Featured host updated</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <a href="/activity" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all activity →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <p className="text-sm text-gray-600 mt-1">Current system health</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">API Status</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">Database</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">File Storage</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Available</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">Email Service</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-yellow-600 font-medium">Limited</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <a href="/system" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View system details →
              </a>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;