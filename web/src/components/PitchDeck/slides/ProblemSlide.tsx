import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const ProblemSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-6 sm:py-8 md:py-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
          {t('problem.title')}
        </h1>
        
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Problem 1 */}
          <div className="flex flex-col md:flex-row items-start gap-3 sm:gap-4 md:gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 hover:bg-white/20 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-xl md:text-2xl">😔</span>
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-red-300">For International Travelers</h3>
              <p className="text-sm sm:text-base md:text-lg text-blue-100">
                {t('problem.travelers')}
              </p>
            </div>
          </div>

          {/* Problem 2 */}
          <div className="flex flex-col md:flex-row items-start gap-3 sm:gap-4 md:gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 hover:bg-white/20 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-xl md:text-2xl">📦</span>
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-orange-300">Generic Tourism Packages</h3>
              <p className="text-sm sm:text-base md:text-lg text-blue-100">
                {t('problem.generic')}
              </p>
            </div>
          </div>

          {/* Problem 3 */}
          <div className="flex flex-col md:flex-row items-start gap-3 sm:gap-4 md:gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 hover:bg-white/20 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-xl md:text-2xl">🚫</span>
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-yellow-300">For Indonesian Local Experts</h3>
              <p className="text-sm sm:text-base md:text-lg text-blue-100">
                {t('problem.experts')}
              </p>
            </div>
          </div>

          {/* Problem 4 */}
          <div className="flex flex-col md:flex-row items-start gap-3 sm:gap-4 md:gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 hover:bg-white/20 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-xl md:text-2xl">🗣️</span>
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-purple-300">Language Barriers</h3>
              <p className="text-sm sm:text-base md:text-lg text-blue-100">
                {t('problem.barrier')}
              </p>
            </div>
          </div>
        </div>

        {/* Market Gap Highlight */}
        <div className="mt-6 sm:mt-8 md:mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full">
            <span className="font-bold text-sm sm:text-base md:text-lg">Market Gap: $500M+ authentic experience market underserved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSlide;