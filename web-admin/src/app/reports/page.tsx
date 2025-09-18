'use client';

import { withFinanceAccess } from '@/components/withAuthGuard';
import AdminNavbar from '@/components/AdminNavbar';
import { useAdminAuth } from '@/contexts/AdminContext';

const ReportsPage = () => {
  const { user } = useAdminAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavbar />
      
      <div className="flex-1 lg:ml-0">
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
              <p className="text-gray-600 mt-1">Generate and download financial reports</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Finance Access</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-800">Monthly Revenue Report</h3>
                <p className="text-sm text-gray-600 mt-1">Detailed breakdown of monthly earnings</p>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Generate Report
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-800">Transaction History</h3>
                <p className="text-sm text-gray-600 mt-1">Complete transaction logs and details</p>
                <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Menggunakan HOC untuk proteksi role-based
export default withFinanceAccess(ReportsPage);
