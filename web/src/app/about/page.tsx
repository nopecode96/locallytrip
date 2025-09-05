import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - LocallyTrip.com',
  description: 'Learn about LocallyTrip.com - connecting travelers with passionate local creators for authentic photography tours, cultural experiences, and personalized trip planning across Southeast Asia.',
  keywords: 'about locallytrip, local travel, authentic experiences, local creators, travel platform',
};

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Real Travel. Real Locals. Zero BS ✨
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            LocallyTrip.com connects you with local creators who actually live where you want to go. No fake reviews, no tourist traps — just real people sharing what they love about their home 🌍💫
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            How We Started 🚀
          </h2>
          <div className="text-gray-700 leading-relaxed text-justify space-y-4">
            <p className="text-lg">
              <strong className="text-purple-600">LocallyTrip.com</strong> started because we were tired of cringe tourist experiences. You know the ones — overpriced tours with fake "local guides" who don't even live there 🙄
            </p>
            <p>
              We traveled everywhere — from Tokyo's hidden ramen spots 🍜 to Bali's secret beaches 🏖️, Marrakech's actual cool neighborhoods �️ to the Philippines' untouched islands �️. 
            </p>
            <p>
              Every trip, we heard the same complaints from fellow travelers:
            </p>
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-2xl border-l-4 border-pink-400 italic text-gray-700 space-y-3 my-6">
              <p className="flex items-center gap-2">� "These tourist spots are so basic..."</p>
              <p className="flex items-center gap-2">📱 "Where do locals actually hang out?"</p>
              <p className="flex items-center gap-2">� "Why is everything so expensive and fake?"</p>
            </div>
            <p>
              We realized Google reviews are mostly fake, travel blogs are sponsored content, and "local guides" from big companies don't actually know the good spots. The real insider knowledge? It's with actual locals who live there daily 💯
            </p>
            <p className="text-lg font-medium text-purple-600">
              So we said: let's fix this. 🔥
            </p>
            <p>
              We built <strong className="text-pink-600">LocallyTrip.com</strong> to connect travelers with real local creators — <strong className="text-orange-500">photographers who know the perfect angles</strong> �, <strong className="text-green-500">guides who skip the tourist traps</strong> 🗺️, and <strong className="text-blue-500">planners who design trips that don't suck</strong> ✈️.
            </p>
            <p>
              No agencies. No middlemen. Just real people sharing what they actually love about their city �
            </p>
            <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-8 rounded-3xl my-8 border-2 border-dashed border-pink-300">
              <p className="font-bold text-gray-800 text-lg mb-4">Our vibe: ✨</p>
              <div className="space-y-3 text-left">
                <p className="flex items-center gap-3 text-lg">� Skip the tourist stuff, find the actual cool spots</p>
                <p className="flex items-center gap-3 text-lg">� Get shots that'll make your feed fire</p>
                <p className="flex items-center gap-3 text-lg">💯 Connect with locals who genuinely want to share their city</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 md:px-6 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-4">What We're About 🎯</h2>
          <p className="text-gray-700 leading-relaxed text-lg bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200">
            We connect travelers with local creators who are passionate about sharing their city. Get real recommendations from people who actually live there — not just work there 📸🗺️✨
          </p>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 border-t border-b border-pink-200 py-16">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-pink-100">
            <div className="text-5xl mb-6 animate-bounce">📸</div>
            <h3 className="font-bold mb-3 text-xl text-pink-600">Local Photographers</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Get shots that'll make your feed pop. Our photographers know all the secret spots and perfect lighting ✨
            </p>
          </div>
          <div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-blue-100">
            <div className="text-5xl mb-6 animate-bounce" style={{animationDelay: '0.1s'}}>🧭</div>
            <h3 className="font-bold mb-3 text-xl text-blue-600">Skip Tourist Traps</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Discover where locals actually hang out. Hidden gems, cool neighborhoods, authentic experiences 🌟
            </p>
          </div>
          <div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-green-100">
            <div className="text-5xl mb-6 animate-bounce" style={{animationDelay: '0.2s'}}>🗺️</div>
            <h3 className="font-bold mb-3 text-xl text-green-600">Custom Trip Plans</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Get personalized itineraries that actually make sense for your time and budget. No fluff 🎯
            </p>
          </div>
          <div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-purple-100">
            <div className="text-5xl mb-6 animate-bounce" style={{animationDelay: '0.3s'}}>❤️</div>
            <h3 className="font-bold mb-3 text-xl text-purple-600">Safe & Verified</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              All creators verified with real reviews. Secure payments. Zero sketchy vibes 🛡️
            </p>
          </div>
        </div>
      </section>

      {/* Join Our Mission */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 text-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 rounded-3xl mx-4 md:mx-6 my-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-6">
          Want to Join Us? 🚀✨
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
          Are you a local creator who knows your city inside out? 🌍 Join our community and start sharing what you love with travelers who actually want the real experience! 💫
        </p>
        <a 
          href="/become-host" 
          className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold px-10 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 text-lg"
        >
          Become a Creator 🎉
        </a>
        <div className="mt-8 flex justify-center space-x-4">
          <span className="text-2xl animate-bounce">🌟</span>
          <span className="text-2xl animate-bounce" style={{animationDelay: '0.1s'}}>💫</span>
          <span className="text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>✨</span>
          <span className="text-2xl animate-bounce" style={{animationDelay: '0.3s'}}>🎊</span>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
