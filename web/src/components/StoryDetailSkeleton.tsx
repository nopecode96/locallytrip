import React from 'react';

const StoryDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 animate-pulse">
      {/* Hero Image Skeleton */}
      <section className="relative">
        <div className="container mx-auto px-4 md:px-6 pt-0 pb-8">
          <div className="h-[400px] md:h-[500px] lg:h-[600px] bg-gray-300 rounded-3xl"></div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-3">
            {/* Article Skeleton */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2 border-pink-100 mb-8">
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-4/5"></div>
              </div>
            </div>

            {/* Gallery Skeleton */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-100 mb-8">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-300 rounded-2xl"></div>
                ))}
              </div>
            </div>

            {/* Host Info Skeleton */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl p-8 border-2 border-purple-100 mb-8">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            {/* Author Skeleton */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-pink-100 mb-6">
              <div className="h-5 bg-gray-300 rounded w-2/3 mb-4"></div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            {/* Related Stories Skeleton */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-pink-100">
              <div className="h-5 bg-gray-300 rounded w-2/3 mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailSkeleton;
