import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const TractionSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-6 sm:py-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-xs sm:max-w-2xl md:max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
          Market Validation & Progress
        </h1>
        
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-sm sm:text-base md:text-xl text-green-100 max-w-3xl mx-auto">
            Strong market research foundation with active development progress toward Q4 2025 community launch
          </p>
        </div>

        {/* Market Research Findings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-green-400/20 text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-300 mb-1 sm:mb-2">$12B</div>
            <div className="text-green-200 text-xs sm:text-sm mb-1 sm:mb-2">Indonesia Travel Market</div>
            <div className="text-green-100 text-xs leading-tight">Serviceable addressable market</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-400/20 text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-300 mb-1 sm:mb-2">73%</div>
            <div className="text-blue-200 text-xs sm:text-sm mb-1 sm:mb-2">Want Authentic Experiences</div>
            <div className="text-blue-100 text-xs leading-tight">International travelers surveyed</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-400/20 text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-300 mb-1 sm:mb-2">85%</div>
            <div className="text-purple-200 text-xs sm:text-sm mb-1 sm:mb-2">Locals Want to Host</div>
            <div className="text-purple-100 text-xs leading-tight">Interest in becoming local experts</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-orange-400/20 text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-300 mb-1 sm:mb-2">68%</div>
            <div className="text-orange-200 text-xs sm:text-sm mb-1 sm:mb-2">Pay Premium for Local</div>
            <div className="text-orange-100 text-xs leading-tight">Willing to pay 20-30% more</div>
          </div>
        </div>

        {/* Development Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
          <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-cyan-400/20">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-200 mb-3 sm:mb-4 md:mb-6">🚀 Platform Development</h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 text-xs sm:text-sm">Core Platform (Web + Mobile)</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 sm:w-20 md:w-24 bg-gray-700 rounded-full h-2">
                    <div className="w-4/5 bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full"></div>
                  </div>
                  <span className="text-cyan-200 text-xs sm:text-sm font-semibold">80%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 text-xs sm:text-sm">Expert Matching Algorithm</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 sm:w-20 md:w-24 bg-gray-700 rounded-full h-2">
                    <div className="w-3/4 bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full"></div>
                  </div>
                  <span className="text-cyan-200 text-xs sm:text-sm font-semibold">75%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 text-xs sm:text-sm">Payment & Booking System</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 sm:w-20 md:w-24 bg-gray-700 rounded-full h-2">
                    <div className="w-3/5 bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full"></div>
                  </div>
                  <span className="text-cyan-200 text-xs sm:text-sm font-semibold">60%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 text-xs sm:text-sm">Vibes Community Platform</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 sm:w-20 md:w-24 bg-gray-700 rounded-full h-2">
                    <div className="w-1/2 bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"></div>
                  </div>
                  <span className="text-purple-200 text-xs sm:text-sm font-semibold">50%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-400/20">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-200 mb-3 sm:mb-4 md:mb-6">📊 Pre-Launch Metrics</h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white/10 rounded-lg p-2 sm:p-3 md:p-4">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className="text-purple-300 text-xs sm:text-sm">Market Research</span>
                  <span className="text-purple-200 font-bold text-sm sm:text-base">500+</span>
                </div>
                <p className="text-purple-100 text-xs leading-tight">Travelers & locals interviewed</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-2 sm:p-3 md:p-4">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className="text-purple-300 text-xs sm:text-sm">Focus Groups</span>
                  <span className="text-purple-200 font-bold text-sm sm:text-base">12</span>
                </div>
                <p className="text-purple-100 text-xs leading-tight">In major Indonesian cities</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-2 sm:p-3 md:p-4">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className="text-purple-300 text-xs sm:text-sm">Potential Hosts</span>
                  <span className="text-purple-200 font-bold text-sm sm:text-base">200+</span>
                </div>
                <p className="text-purple-100 text-xs leading-tight">Pre-registered local experts</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-2 sm:p-3 md:p-4">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className="text-purple-300 text-xs sm:text-sm">Vibes Waitlist</span>
                  <span className="text-purple-200 font-bold text-sm sm:text-base">Growing</span>
                </div>
                <p className="text-purple-100 text-xs leading-tight">Community platform early adopters</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Validation Points */}
        <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-green-400/20">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-green-200 mb-4 sm:mb-6">
            ✅ Strong Market Validation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-center">
            <div className="p-3 sm:p-4 bg-green-500/10 rounded-lg">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2">🎯</div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-green-300 mb-1 sm:mb-2">Proven Demand</h3>
              <p className="text-green-100 text-xs leading-relaxed">Clear gap in authentic local experiences market</p>
            </div>
            
            <div className="p-3 sm:p-4 bg-emerald-500/10 rounded-lg">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2">💼</div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-emerald-300 mb-1 sm:mb-2">Supply Ready</h3>
              <p className="text-emerald-100 text-xs leading-relaxed">High interest from potential local hosts</p>
            </div>
            
            <div className="p-3 sm:p-4 bg-teal-500/10 rounded-lg">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2">🚀</div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-teal-300 mb-1 sm:mb-2">Tech Ready</h3>
              <p className="text-teal-100 text-xs leading-relaxed">Platform 80% complete, ready for launch</p>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 text-center">
            <div className="inline-block bg-green-500/20 rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <span className="text-green-200 font-semibold text-sm sm:text-base">
                🎯 Ready for January 2026 Market Entry
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TractionSlide;