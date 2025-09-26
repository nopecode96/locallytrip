import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const PlatformOverviewSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-6 sm:py-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-xs sm:max-w-2xl md:max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
          Technology Platform Overview
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
          {/* Web Platform */}
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-blue-400/20">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-500/30 rounded-full flex items-center justify-center">
                <span className="text-xl sm:text-2xl md:text-3xl">🌐</span>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-200">Web Platform</h3>
                <p className="text-blue-300 text-xs sm:text-sm md:text-base">Next.js 14 App Router</p>
              </div>
            </div>
            <ul className="space-y-1 sm:space-y-2 md:space-y-3 text-blue-100">
              <li className="flex items-start gap-2">
                <span className="text-blue-300">•</span>
                <span className="text-xs sm:text-sm md:text-base">Discovery & booking for desktop users</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300">•</span>
                <span className="text-xs sm:text-sm md:text-base">Responsive design (desktop, tablet, mobile)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300">•</span>
                <span className="text-xs sm:text-sm md:text-base">SEO optimized for organic discovery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300">•</span>
                <span className="text-xs sm:text-sm md:text-base">Multi-language support (EN/ID)</span>
              </li>
            </ul>
          </div>

          {/* Mobile App */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-purple-400/20">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-500/30 rounded-full flex items-center justify-center">
                <span className="text-xl sm:text-2xl md:text-3xl">📱</span>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-200">Mobile App</h3>
                <p className="text-purple-300 text-xs sm:text-sm md:text-base">Flutter Cross-platform</p>
              </div>
            </div>
            <ul className="space-y-1 sm:space-y-2 md:space-y-3 text-purple-100">
              <li className="flex items-start gap-2">
                <span className="text-purple-300">•</span>
                <span className="text-xs sm:text-sm md:text-base">On-the-go booking & host management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-300">•</span>
                <span className="text-xs sm:text-sm md:text-base">Real-time chat & notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-300">•</span>
                <span className="text-xs sm:text-sm md:text-base">GPS integration for local discovery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-300">•</span>
                <span className="text-xs sm:text-sm md:text-base">Offline mode for itinerary access</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-indigo-400/20">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-200 mb-3 sm:mb-4 md:mb-6 text-center">
            🏗️ Scalable Architecture
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-center">
            <div className="bg-white/10 rounded-xl p-2 sm:p-3 md:p-4">
              <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">⚛️</div>
              <div className="font-semibold text-indigo-200 text-xs sm:text-sm md:text-base">Frontend</div>
              <div className="text-xs sm:text-sm text-indigo-300">Next.js 14 + Flutter</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2 sm:p-3 md:p-4">
              <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">🔧</div>
              <div className="font-semibold text-indigo-200 text-xs sm:text-sm md:text-base">Backend</div>
              <div className="text-xs sm:text-sm text-indigo-300">Node.js + Express</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2 sm:p-3 md:p-4">
              <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">🗄️</div>
              <div className="font-semibold text-indigo-200 text-xs sm:text-sm md:text-base">Database</div>
              <div className="text-xs sm:text-sm text-indigo-300">PostgreSQL + Sequelize</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2 sm:p-3 md:p-4">
              <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">🐳</div>
              <div className="font-semibold text-indigo-200 text-xs sm:text-sm md:text-base">Infrastructure</div>
              <div className="text-xs sm:text-sm text-indigo-300">Docker + Cloud-ready</div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 text-center">
            <div className="text-2xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 md:mb-4">🔍</div>
            <div className="font-semibold mb-1 sm:mb-2 text-cyan-200 text-sm sm:text-base">Smart Matching</div>
            <div className="text-xs sm:text-sm text-blue-200 leading-relaxed">Algorithm-based host-traveler compatibility</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 text-center">
            <div className="text-2xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 md:mb-4">💳</div>
            <div className="font-semibold mb-1 sm:mb-2 text-cyan-200 text-sm sm:text-base">Secure Payments</div>
            <div className="text-xs sm:text-sm text-blue-200 leading-relaxed">Integrated escrow & multi-currency support</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 text-center">
            <div className="text-2xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 md:mb-4">⭐</div>
            <div className="font-semibold mb-1 sm:mb-2 text-cyan-200 text-sm sm:text-base">Quality Assurance</div>
            <div className="text-xs sm:text-sm text-blue-200 leading-relaxed">Verified hosts & comprehensive review system</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformOverviewSlide;