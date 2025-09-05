'use client';

import { useParams } from 'next/navigation';

export default function HostPage() {
  const params = useParams();
  const hostId = params?.hostId as string;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Host Profile
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Host ID: {hostId}
          </p>
          <p className="mt-4 text-gray-500">
            Host profile page under development...
          </p>
        </div>
      </div>
    </div>
  );
}