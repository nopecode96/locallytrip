'use client';

import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const ClosingSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto text-center">
        
        {/* Main Title */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            {t('closing.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            {t('closing.subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
          
          {/* Left: Vision Statement */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 border border-blue-400/20">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">🌟</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-200 mb-3 sm:mb-4">
              {t('closing.vision_title')}
            </h3>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              {t('closing.vision_desc')}
            </p>
            
            {/* Key Numbers */}
            <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300">$19B</div>
                <div className="text-xs sm:text-sm text-blue-300">{t('closing.market_size')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300">20M+</div>
                <div className="text-xs sm:text-sm text-blue-300">{t('closing.annual_visitors')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300">2026</div>
                <div className="text-xs sm:text-sm text-blue-300">{t('closing.launch_year')}</div>
              </div>
            </div>
          </div>

          {/* Right: Next Steps */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 border border-purple-400/20">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">🚀</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-200 mb-3 sm:mb-4">
              {t('closing.next_steps_title')}
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 text-left">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-xs sm:text-sm">1</span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-semibold text-purple-200">{t('closing.step1_title')}</div>
                  <div className="text-xs sm:text-sm text-purple-100">{t('closing.step1_desc')}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-left">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-xs sm:text-sm">2</span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-semibold text-purple-200">{t('closing.step2_title')}</div>
                  <div className="text-xs sm:text-sm text-purple-100">{t('closing.step2_desc')}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-left">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-xs sm:text-sm">3</span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-semibold text-purple-200">{t('closing.step3_title')}</div>
                  <div className="text-xs sm:text-sm text-purple-100">{t('closing.step3_desc')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 border border-green-400/20 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-200 mb-4 sm:mb-6">
            {t('closing.contact_title')}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-green-100">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-2">📧</div>
              <div className="text-sm sm:text-base font-semibold">{t('closing.email_label')}</div>
              <div className="text-xs sm:text-sm">team@locallytrip.com</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-2">🌐</div>
              <div className="text-sm sm:text-base font-semibold">{t('closing.website_label')}</div>
              <div className="text-xs sm:text-sm">www.locallytrip.com</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-2">📱</div>
              <div className="text-sm sm:text-base font-semibold">{t('closing.demo_label')}</div>
              <div className="text-xs sm:text-sm">{t('closing.demo_desc')}</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-yellow-500 to-orange-500 px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-full text-white font-bold text-base sm:text-lg md:text-xl shadow-2xl hover:scale-105 transition-transform duration-200">
            <span>{t('closing.cta_text')}</span>
            <div className="text-xl sm:text-2xl">🤝</div>
          </div>
          
          <div className="mt-4 sm:mt-6 text-sm sm:text-base text-blue-200 opacity-75">
            {t('closing.cta_subtitle')}
          </div>
          
          {/* Download Section */}
          <div className="mt-6 sm:mt-8">
            <div className="mb-3 sm:mb-4 text-center">
              <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
                {t('closing.download_title')}
              </h4>
              <p className="text-sm text-blue-200 opacity-75">
                {t('closing.download_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-8 sm:mt-12 border-t border-white/10 pt-6 sm:pt-8">
          <blockquote className="text-base sm:text-lg md:text-xl italic text-blue-200 max-w-3xl mx-auto">
            "{t('closing.quote')}"
          </blockquote>
          <div className="mt-3 sm:mt-4 text-sm sm:text-base text-blue-300">
            — {t('closing.quote_author')}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClosingSlide;