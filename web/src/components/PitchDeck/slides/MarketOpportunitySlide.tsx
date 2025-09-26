import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const MarketOpportunitySlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-6 sm:py-8 md:py-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-xs sm:max-w-2xl md:max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
          {t('market.title')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Market Size */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-yellow-400/20">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-500/30 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl md:text-2xl">🏛️</span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-yellow-200">Total Market</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-yellow-100">
                Indonesia tourism industry <span className="font-bold text-lg sm:text-xl md:text-2xl text-yellow-300">$19B</span> annually
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-orange-400/20">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-500/30 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl md:text-2xl">🎯</span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-orange-200">Target Segment</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-orange-100">
                Authentic experiences & local services <span className="font-bold text-lg sm:text-xl md:text-2xl text-orange-300">$500M+</span>
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-red-400/20">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-500/30 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl md:text-2xl">✈️</span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-red-200">International Visitors</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-red-100">
                <span className="font-bold text-lg sm:text-xl md:text-2xl text-red-300">16M+</span> pre-pandemic, recovering to <span className="font-bold text-base sm:text-lg md:text-xl text-red-300">20M+</span> by 2025
              </p>
            </div>
          </div>

          {/* Right Column - Opportunity Details */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-emerald-400/20">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-500/30 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl md:text-2xl">💰</span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-emerald-200">Average Spend</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-emerald-100 mb-1 sm:mb-2">
                <span className="font-bold text-base sm:text-lg md:text-xl text-emerald-300">$1,200-1,800</span> per trip
              </p>
              <p className="text-xs sm:text-sm text-emerald-200">
                20-30% on experiences/activities = <span className="font-bold">$240-540</span> per traveler
              </p>
            </div>

            {/* Market Trends */}
            <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-cyan-400/20">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-cyan-200 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                <span className="text-lg sm:text-xl md:text-2xl">📈</span> Market Trends
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 text-xs sm:text-sm md:text-base text-cyan-100">
                <li className="flex items-start gap-1 sm:gap-1.5 md:gap-2">
                  <span className="text-cyan-300">•</span>
                  <span>Post-pandemic recovery driving authentic travel demand</span>
                </li>
                <li className="flex items-start gap-1 sm:gap-1.5 md:gap-2">
                  <span className="text-cyan-300">•</span>
                  <span>Rise of experiential over material tourism</span>
                </li>
                <li className="flex items-start gap-1 sm:gap-1.5 md:gap-2">
                  <span className="text-cyan-300">•</span>
                  <span>Digital platform adoption in tourism accelerated</span>
                </li>
                <li className="flex items-start gap-1 sm:gap-1.5 md:gap-2">
                  <span className="text-cyan-300">•</span>
                  <span>Growing middle class in source markets (China, India, ASEAN)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="mt-6 sm:mt-8 md:mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-purple-400/20">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-200 mb-3 sm:mb-4">
              🎯 Our Addressable Market
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-center">
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-300">$500M+</div>
                <div className="text-xs sm:text-sm md:text-base text-purple-200">Total Addressable Market</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-300">$100M+</div>
                <div className="text-xs sm:text-sm md:text-base text-purple-200">Serviceable Available Market</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-300">$10M+</div>
                <div className="text-xs sm:text-sm md:text-base text-purple-200">Serviceable Obtainable Market</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOpportunitySlide;