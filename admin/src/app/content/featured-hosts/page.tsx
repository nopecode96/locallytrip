'use client';

import React from 'react';

const FeaturedHostsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Hosts Management
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Featured hosts management page is under development.
          </p>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-semibold mb-2">Available Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• View current featured hosts</li>
              <li>• Add new featured hosts from available hosts</li>
              <li>• Remove featured hosts</li>
              <li>• Manage display order</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedHostsPage;