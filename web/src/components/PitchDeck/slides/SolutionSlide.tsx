import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const SolutionSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-6 sm:py-8 md:py-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-xs sm:max-w-2xl md:max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-gradient-to-r from-green-300 to-cyan-300 bg-clip-text text-transparent">
          {t('solution.title')}
        </h1>
        
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-blue-100 max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto">
            {t('solution.description')}
          </p>
        </div>

        {/* Three Expert Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-12">
          {/* Local Tour Guides */}
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-8 hover:scale-105 transition-all duration-300 border border-blue-400/20">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                <span className="text-2xl sm:text-3xl md:text-4xl">🗺️</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-blue-200">Local Tour Guides</h3>
              <p className="text-xs sm:text-sm md:text-base text-blue-100 mb-2 sm:mb-3 md:mb-4">
                Authentic storytelling & hidden gems discovery
              </p>
              <ul className="text-xs sm:text-sm text-blue-200 space-y-1 sm:space-y-1.5 md:space-y-2">
                <li>• Cultural insights</li>
                <li>• Historical knowledge</li>
                <li>• Off-the-beaten-path experiences</li>
              </ul>
            </div>
          </div>

          {/* Local Photographers */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-8 hover:scale-105 transition-all duration-300 border border-purple-400/20">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                <span className="text-2xl sm:text-3xl md:text-4xl">📸</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-purple-200">Local Photographers</h3>
              <p className="text-xs sm:text-sm md:text-base text-purple-100 mb-2 sm:mb-3 md:mb-4">
                Professional travel photography services
              </p>
              <ul className="text-xs sm:text-sm text-purple-200 space-y-1 sm:space-y-1.5 md:space-y-2">
                <li>• Instagram-worthy content</li>
                <li>• Local perspective photography</li>
                <li>• Professional equipment</li>
              </ul>
            </div>
          </div>

          {/* Trip Planners */}
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-8 hover:scale-105 transition-all duration-300 border border-green-400/20">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-green-500/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                <span className="text-2xl sm:text-3xl md:text-4xl">📋</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-green-200">Trip Planners</h3>
              <p className="text-xs sm:text-sm md:text-base text-green-100 mb-2 sm:mb-3 md:mb-4">
                Customized itinerary planning with local insights
              </p>
              <ul className="text-xs sm:text-sm text-green-200 space-y-1 sm:space-y-1.5 md:space-y-2">
                <li>• Cultural nuances knowledge</li>
                <li>• End-to-end coordination</li>
                <li>• Local timing optimization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Platform Connection Visualization */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 text-center">
              <div className="text-2xl sm:text-2.5xl md:text-3xl mb-1 sm:mb-1.5 md:mb-2">🌍</div>
              <div className="font-semibold text-sm sm:text-base">International Travelers</div>
              <div className="text-xs sm:text-sm text-blue-200">Seeking authentic experiences</div>
            </div>
            
            <div className="flex items-center">
              <div className="hidden md:block w-6 lg:w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400"></div>
              <div className="mx-2 sm:mx-3 md:mx-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full p-2 sm:p-2.5 md:p-3">
                <span className="text-white font-bold text-xs sm:text-sm md:text-base">LocallyTrip</span>
              </div>
              <div className="hidden md:block w-6 lg:w-8 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 text-center">
              <div className="text-2xl sm:text-2.5xl md:text-3xl mb-1 sm:mb-1.5 md:mb-2">🇮🇩</div>
              <div className="font-semibold text-sm sm:text-base">Indonesian Local Experts</div>
              <div className="text-xs sm:text-sm text-blue-200">Ready to share their expertise</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionSlide;