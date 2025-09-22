'use client';

import { useAdminAuth } from '@/contexts/AdminContext';
import AdminNavbar from '@/components/AdminNavbar';
import AuthGuard from '@/components/AuthGuard';

const DashboardPage = () => {
  const { user } = useAdminAuth();

  // AuthGuard ensures user is not null, but TypeScript doesn't know this
  if (!user) return null;

  const getRoleDashboardContent = () => {
    switch (user.role) {
      case 'super_admin':
        return {
          title: 'Super Admin Dashboard',
          description: 'Complete system overview and management',
          stats: [
            { label: 'Total Users', value: '1,248', icon: '👥', color: 'bg-blue-500' },
            { label: 'Active Admins', value: '8', icon: '👑', color: 'bg-purple-500' },
            { label: 'System Health', value: '98.5%', icon: '⚡', color: 'bg-green-500' },
            { label: 'Total Revenue', value: '$45,230', icon: '💰', color: 'bg-yellow-500' }
          ]
        };

      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'User and content management overview',
          stats: [
            { label: 'Total Users', value: '1,248', icon: '👥', color: 'bg-blue-500' },
            { label: 'New Registrations', value: '24', icon: '📝', color: 'bg-green-500' },
            { label: 'Published Stories', value: '156', icon: '📖', color: 'bg-purple-500' },
            { label: 'Active Experiences', value: '89', icon: '🎯', color: 'bg-orange-500' }
          ]
        };

      case 'moderator':
        return {
          title: 'Moderator Dashboard',
          description: 'Story management and comments moderation',
          stats: [
            { label: 'Pending Reviews', value: '12', icon: '⏳', color: 'bg-yellow-500' },
            { label: 'Published Stories', value: '156', icon: '✅', color: 'bg-green-500' },
            { label: 'Flagged Content', value: '3', icon: '🚩', color: 'bg-red-500' },
            { label: 'Comments Moderated', value: '45', icon: '💬', color: 'bg-blue-500' }
          ]
        };

      case 'finance':
        return {
          title: 'Finance Dashboard',
          description: 'Financial overview and payment management',
          stats: [
            { label: 'Revenue Today', value: '$2,456', icon: '💰', color: 'bg-green-500' },
            { label: 'Pending Payments', value: '8', icon: '⏳', color: 'bg-yellow-500' },
            { label: 'Refunds', value: '3', icon: '↩️', color: 'bg-red-500' },
            { label: 'Monthly Growth', value: '+12%', icon: '📈', color: 'bg-blue-500' }
          ]
        };

      case 'marketing':
        return {
          title: 'Marketing Dashboard',
          description: 'Campaign performance and engagement metrics',
          stats: [
            { label: 'Campaign Reach', value: '15.2K', icon: '📢', color: 'bg-purple-500' },
            { label: 'Engagement Rate', value: '8.4%', icon: '👍', color: 'bg-green-500' },
            { label: 'New Subscribers', value: '127', icon: '📧', color: 'bg-blue-500' },
            { label: 'Partnership Leads', value: '5', icon: '🤝', color: 'bg-yellow-500' }
          ]
        };

      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to LocallyTrip Admin',
          stats: []
        };
    }
  };

  const dashboardContent = getRoleDashboardContent();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{dashboardContent.title}</h1>
              <p className="text-gray-600 mt-1">{dashboardContent.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{user.name.charAt(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardContent.stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <span className="text-white text-xl">{stat.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📝</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">New story published</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">💳</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Payment processed</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">👤</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">New user registered</p>
                    <p className="text-xs text-gray-500">12 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {user.role === 'super_admin' && (
                  <>
                    <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <div className="text-blue-600 text-lg mb-1">👥</div>
                      <p className="text-sm font-medium text-gray-800">Add User</p>
                    </button>
                    <button className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                      <div className="text-purple-600 text-lg mb-1">⚙️</div>
                      <p className="text-sm font-medium text-gray-800">Settings</p>
                    </button>
                  </>
                )}
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <>
                    <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <div className="text-green-600 text-lg mb-1">📖</div>
                      <p className="text-sm font-medium text-gray-800">Manage Stories</p>
                    </button>
                    <button className="p-4 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                      <div className="text-yellow-600 text-lg mb-1">🎯</div>
                      <p className="text-sm font-medium text-gray-800">Experiences</p>
                    </button>
                  </>
                )}
                {(user.role === 'finance' || user.role === 'admin' || user.role === 'super_admin') && (
                  <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <div className="text-green-600 text-lg mb-1">💰</div>
                    <p className="text-sm font-medium text-gray-800">View Reports</p>
                  </button>
                )}
                {(user.role === 'marketing' || user.role === 'super_admin') && (
                  <button className="p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                    <div className="text-orange-600 text-lg mb-1">📢</div>
                    <p className="text-sm font-medium text-gray-800">New Campaign</p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default DashboardPage;
