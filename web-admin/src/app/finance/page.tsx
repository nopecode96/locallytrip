'use client';

import AuthGuard from '@/components/AuthGuard';
import AdminNavbar from '@/components/AdminNavbar';
import { useAdminAuth } from '@/contexts/AdminContext';

const FinancePage = () => {
  const { user } = useAdminAuth();

  if (!user) return null;

  return (
    <AuthGuard requiredRoles={['super_admin', 'admin', 'finance']}>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        
        <div className="flex-1 lg:ml-0">
          <div className="bg-white shadow-sm border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
                <p className="text-gray-600 mt-1">Revenue, bookings, and financial analytics</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Logged in as</p>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-green-600 text-xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">$125,430</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 text-xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="text-2xl font-bold text-gray-800">$18,750</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-purple-600 text-xl">📈</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Growth</p>
                    <p className="text-2xl font-bold text-gray-800">+12.5%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <span className="text-orange-600 text-xl">🎯</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Bookings</p>
                    <p className="text-2xl font-bold text-gray-800">1,847</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">City Tour Booking #1234</p>
                    <p className="text-sm text-gray-500">User: john.doe@example.com</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+$85.00</p>
                    <p className="text-sm text-gray-500">Today, 2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">Cultural Experience #1235</p>
                    <p className="text-sm text-gray-500">User: sarah.smith@example.com</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+$120.00</p>
                    <p className="text-sm text-gray-500">Today, 1:15 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default FinancePage;
