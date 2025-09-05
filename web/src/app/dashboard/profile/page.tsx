'use client';

import DashboardLayout from '../../../components/DashboardLayout';

export default function ProfilePage() {
  return (
    <DashboardLayout allowedRoles={['traveller']}>
      <div className="bg-white min-h-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  U
                </div>
                <div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="+62 xxx xxx xxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
