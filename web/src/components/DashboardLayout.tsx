'use client';

import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import AuthGuard from './AuthGuard';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  allowedRoles = ['traveller', 'host'],
  requireAuth = true 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthGuard requireAuth={requireAuth} allowedRoles={allowedRoles}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar - Fixed position below navbar */}
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border-r border-gray-200 z-40 hidden md:block">
          <DashboardSidebar isOpen={true} onToggle={toggleSidebar} />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={toggleSidebar} />
        )}
        
        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg z-50 md:hidden">
            <DashboardSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
          </div>
        )}
        
        {/* Main Content - Offset by sidebar width on desktop */}
        <div className="flex-1 md:ml-64 pt-16">
          {/* Mobile Header */}
          <div className="md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              <div className="w-10" /> {/* Spacer */}
            </div>
          </div>

          {/* Main Content Area */}
          <main className="px-6 pb-6 min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;
