'use client';

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';
import CoverSlide from './slides/CoverSlide';
import ProblemSlide from './slides/ProblemSlide';
import SolutionSlide from './slides/SolutionSlide';
import MarketOpportunitySlide from './slides/MarketOpportunitySlide';
import PlatformOverviewSlide from './slides/PlatformOverviewSlide';
import LocalExpertSlide from './slides/LocalExpertSlide';
import RevenueModelSlide from './slides/RevenueModelSlide';
import CompetitiveAdvantageSlide from './slides/CompetitiveAdvantageSlide';
import TractionSlide from './slides/TractionSlide';
import RoadmapSlide from './slides/RoadmapSlide';
import FinancialProjectionsSlide from './slides/FinancialProjectionsSlide';
import ClosingSlide from './slides/ClosingSlide';

const slides = [
  CoverSlide,
  ProblemSlide,
  SolutionSlide,
  MarketOpportunitySlide,
  PlatformOverviewSlide,
  LocalExpertSlide,
  RevenueModelSlide,
  TractionSlide,
  RoadmapSlide,
  FinancialProjectionsSlide,
  CompetitiveAdvantageSlide,
  ClosingSlide,
];

const PitchDeckContent: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div 
      id="pitch-deck-container"
      className={`relative w-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-x-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen overflow-hidden flex flex-col' : 'min-h-screen flex flex-col'
      }`}
    >
      {/* Header Controls - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="flex-shrink-0 p-2 md:p-4 z-50 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-4">
            <img 
              src="/favicon.svg" 
              alt="LocallyTrip" 
              className="h-6 w-6 md:h-8 md:w-8"
            />
            <h1 className="text-white font-bold text-sm md:text-lg hidden sm:block">
              LocallyTrip Business Pitch
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors flex items-center gap-2"
              title={`Switch to ${language === 'en' ? 'Indonesian' : 'English'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="text-sm font-medium">
                {language === 'en' ? 'ID' : 'EN'}
              </span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              title="Toggle Fullscreen (F)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area with Side Navigation */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Side Navigation Arrows - Vertically Centered */}
        <div className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-50">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2 sm:p-3 md:p-4 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full text-white transition-all duration-200 hover:scale-110"
            title="Previous Slide (←)"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-50">
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-2 sm:p-3 md:p-4 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full text-white transition-all duration-200 hover:scale-110"
            title="Next Slide (→)"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide Content */}
        <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
          <CurrentSlideComponent />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex-shrink-0 p-4 sm:p-6 md:p-8 z-50">
        {/* Slide Counter and Instructions */}
        <div className="flex justify-center items-center mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-white/10 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full backdrop-blur-sm">
            <span className="text-white text-xs sm:text-sm md:text-sm font-medium">
              {currentSlide + 1} / {slides.length}
            </span>
            <div className="text-white text-xs opacity-75 hidden lg:block">
              Press ← → or Space to navigate • F for fullscreen
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 flex-wrap">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                currentSlide === index 
                  ? 'bg-white scale-110' 
                  : 'bg-white/30 hover:bg-white/50 hover:scale-105'
              }`}
              title={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Slide transition overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
    </div>
  );
};

const PitchDeck: React.FC = () => {
  return (
    <LanguageProvider>
      <PitchDeckContent />
    </LanguageProvider>
  );
};

export default PitchDeck;