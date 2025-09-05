'use client';

import React, { useState } from 'react';

const VibesPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send to your backend
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="absolute top-40 right-40 w-16 h-16 bg-pink-300 rounded-full animate-ping"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            Travel Vibes Community 🌍
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Join discussions, share experiences, and find your perfect travel companions. 
            Where every traveler and local host connects authentically. 🌟
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-6 py-3 bg-white/20 rounded-full text-lg font-medium hover:bg-white/30 transition-all duration-200 cursor-pointer">
              💬 Open Discussions
            </span>
            <span className="px-6 py-3 bg-white/20 rounded-full text-lg font-medium hover:bg-white/30 transition-all duration-200 cursor-pointer">
              🤝 Smart Matching
            </span>
            <span className="px-6 py-3 bg-white/20 rounded-full text-lg font-medium hover:bg-white/30 transition-all duration-200 cursor-pointer">
              � Group Adventures
            </span>
            <span className="px-6 py-3 bg-white/20 rounded-full text-lg font-medium hover:bg-white/30 transition-all duration-200 cursor-pointer">
              🎯 Equal Access
            </span>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">All Users</div>
              <div className="text-sm opacity-90">Equal Participation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">200+</div>
              <div className="text-sm opacity-90">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">Free</div>
              <div className="text-sm opacity-90">First Group Trip</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Community Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-12 border border-purple-100">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  Travel Vibes Community 🌍
                </h1>
                
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Connect with fellow travelers and locals. Share stories, ask questions, 
                  and find your perfect travel buddies.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-100">
                  <div className="text-3xl mb-3">💬</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Open Discussions
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Start threads, reply to conversations, and get real insights from 
                    travelers and locals. No barriers - everyone's voice matters.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
                  <div className="text-3xl mb-3">🤝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Smart Trip Matching
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Find companions based on destination, interests, and budget. 
                    Create your first group trip absolutely free!
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-100">
                  <div className="text-3xl mb-3">👥</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Group Adventures
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Invite fellow travelers to join your trip. Split costs, share memories, 
                    and explore together safely.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl max-w-2xl mx-auto">
                  <div className="text-2xl mb-2">🚀</div>
                  <h3 className="text-lg font-semibold mb-2">Coming Very Soon!</h3>
                  <p className="text-blue-100 text-sm">
                    We're building Indonesia's most vibrant travel community platform. 
                    Get ready for meaningful connections and unforgettable adventures.
                  </p>
                </div>
                
                <div className="flex justify-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Equal access for all users
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Admin-moderated discussions
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    First group trip free
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Preview Section */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 py-16 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">🌟 What Makes Vibes Special</h2>
            <p className="text-xl opacity-90">A platform designed for meaningful travel connections</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🗣️</span>
                <span className="bg-green-500 text-xs px-3 py-1 rounded-full font-bold">CORE</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Forum Discussions</h3>
              <p className="text-sm opacity-90 mb-4">Start threads, share travel tips, ask locals for advice, and engage in meaningful conversations with the community.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">�</span>
                <span className="bg-blue-500 text-xs px-3 py-1 rounded-full font-bold">SMART</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Trip Companion Matching</h3>
              <p className="text-sm opacity-90 mb-4">Find travel buddies based on destination, interests, budget, and travel dates. AI-powered compatibility scoring.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">�</span>
                <span className="bg-purple-500 text-xs px-3 py-1 rounded-full font-bold">SOCIAL</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Group Trip Creation</h3>
              <p className="text-sm opacity-90 mb-4">Create and manage group trips, invite participants, coordinate itineraries, and split expenses seamlessly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How Vibes Will Work 🚀
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform that brings travelers and locals together through meaningful interactions and smart connections.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Features */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">💬</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Thread-Based Discussions</h3>
                  <p className="text-gray-600">Start conversations, ask questions, share experiences. Reply to threads and build meaningful discussions with travelers and hosts alike.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🤝</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Trip Matching</h3>
                  <p className="text-gray-600">Match with compatible travel companions based on location preferences, interests, budget range, and travel dates. Find your perfect travel buddy!</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Group Trip Management</h3>
                  <p className="text-gray-600">Create group trips, invite members, coordinate plans, and manage group activities. Your first group trip creation is completely free!</p>
                </div>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-3xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🌟</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Coming Q4 2025</h3>
                  <p className="text-gray-600">Be part of Indonesia's travel revolution!</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-2xl">✨</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-xl">💫</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Preview */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">�️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Forum Threads</h3>
              <p className="text-gray-600 text-sm">Start discussions and get community responses</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Matching</h3>
              <p className="text-gray-600 text-sm">Find compatible travel companions</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Group Creation</h3>
              <p className="text-gray-600 text-sm">Create and manage group adventures</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Admin Moderation</h3>
              <p className="text-gray-600 text-sm">Safe and quality community discussions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">🌟</div>
          <div className="absolute top-20 right-20 text-4xl animate-pulse">✨</div>
          <div className="absolute bottom-10 left-1/4 text-5xl animate-ping">🚀</div>
          <div className="absolute bottom-20 right-10 text-3xl animate-bounce">💫</div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Connect & Explore? �
          </h2>
          <p className="text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join the waitlist for Indonesia's most vibrant travel community!
          </p>
          
          <div className="mb-12 p-8 bg-white/10 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Be the First to Experience Vibes! 🎉</h3>
            <p className="mb-6 text-lg">Get early access and be part of the travel community revolution</p>
            
            {isSubmitted ? (
              <div className="flex items-center justify-center space-x-2 text-yellow-300 text-xl font-bold">
                <span>🎊</span>
                <span>You're on the list! Get ready for something amazing!</span>
                <span>🎊</span>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                  className="flex-1 px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30 font-medium"
                />
                <button 
                  type="submit"
                  className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:bg-yellow-300 hover:text-purple-700 transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                >
                  Join Waitlist 🔥
                </button>
              </form>
            )}
            
            <p className="mt-4 text-sm opacity-90">
              💜 Free first group trip for all early members
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold">Free</div>
              <div className="text-sm opacity-80">First Group Trip</div>
            </div>
            <div>
              <div className="text-3xl font-bold">All Users</div>
              <div className="text-sm opacity-80">Equal Access</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Safe</div>
              <div className="text-sm opacity-80">Moderated Platform</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Indonesia</div>
              <div className="text-sm opacity-80">Focused Community</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibesPage;
