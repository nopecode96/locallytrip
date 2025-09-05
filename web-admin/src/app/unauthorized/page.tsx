'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Go Back
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
