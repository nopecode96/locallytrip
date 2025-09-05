'use client';

import DashboardLayout from '../../../components/DashboardLayout';

export default function SettingsPage() {
  return (
    <DashboardLayout allowedRoles={['traveller']}>
      <div className="bg-white min-h-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account preferences and security settings</p>
          </div>

          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                      <option>English</option>
                      <option>Bahasa Indonesia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Password & Security */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Password & Security</h2>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Enable two-factor authentication
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive booking confirmations and updates</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Get important updates via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium">
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
