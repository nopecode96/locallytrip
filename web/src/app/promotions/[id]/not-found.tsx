import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-pink-100 max-w-2xl mx-auto">
          <div className="text-8xl mb-6 animate-bounce">🎁</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Promotion Not Found
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Oops! The promotion you're looking for doesn't exist or may have expired. Let's find you another amazing deal! 🛍️✨
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/promotions"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Browse All Promotions 🎯
            </Link>
            <Link 
              href="/"
              className="border-2 border-purple-300 text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-purple-50 transition-colors"
            >
              Back to Home 🏠
            </Link>
          </div>
          
          {/* Suggested Actions */}
          <div className="mt-12 pt-8 border-t-2 border-pink-100">
            <h3 className="font-bold text-gray-800 mb-4">What would you like to do? 🤔</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/promotions"
                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition-shadow border border-purple-100"
              >
                <div className="text-2xl mb-2">🎁</div>
                <div className="font-medium text-purple-600">View Promotions</div>
                <div className="text-sm text-gray-600">Discover current deals</div>
              </Link>
              <Link 
                href="/explore"
                className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl hover:shadow-lg transition-shadow border border-green-100"
              >
                <div className="text-2xl mb-2">🗺️</div>
                <div className="font-medium text-green-600">Explore Experiences</div>
                <div className="text-sm text-gray-600">Find local adventures</div>
              </Link>
              <Link 
                href="/stories"
                className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl hover:shadow-lg transition-shadow border border-orange-100"
              >
                <div className="text-2xl mb-2">📖</div>
                <div className="font-medium text-orange-600">Read Stories</div>
                <div className="text-sm text-gray-600">Get travel inspiration</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
