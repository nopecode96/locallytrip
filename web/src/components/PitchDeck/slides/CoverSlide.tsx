import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const CoverSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="mb-8 sm:mb-10 md:mb-12">
        <img 
          src="/favicon.svg" 
          alt="LocallyTrip" 
          className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 mx-auto mb-4 sm:mb-6 md:mb-8"
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
          {t('cover.title')}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-3 sm:mb-4 text-blue-100">
          {t('cover.tagline')}
        </p>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-200 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
          {t('cover.subtitle')}
        </p>
      </div>
      
      {/* Key Stats Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto mt-8 sm:mt-12 md:mt-16">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 hover:bg-white/20 transition-colors">
          <div className="text-2xl sm:text-3xl font-bold text-cyan-300">$19B</div>
          <div className="text-xs sm:text-sm text-blue-200 mt-2">
            {t('cover.market_size')}
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 hover:bg-white/20 transition-colors">
          <div className="text-2xl sm:text-3xl font-bold text-cyan-300">16M+</div>
          <div className="text-xs sm:text-sm text-blue-200 mt-2">
            {t('cover.visitors')}
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 hover:bg-white/20 transition-colors sm:col-span-2 lg:col-span-1">
          <div className="text-2xl sm:text-3xl font-bold text-cyan-300">3</div>
          <div className="text-xs sm:text-sm text-blue-200 mt-2">
            {t('cover.expert_categories')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverSlide;