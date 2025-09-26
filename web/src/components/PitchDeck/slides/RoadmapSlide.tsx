import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const RoadmapSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-6 sm:py-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-xs sm:max-w-2xl md:max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
          Development Roadmap & Milestones
        </h1>
        
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-sm sm:text-base md:text-xl text-blue-100 max-w-3xl mx-auto">
            Strategic launch timeline from Q4 2025 community platform to Q1 2026 full marketplace
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mb-8 sm:mb-12">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-green-400 h-full"></div>
          
          {/* Phase 1: Q4 2025 */}
          <div className="relative flex flex-col md:flex-row items-center mb-8 sm:mb-12">
            <div className="md:w-1/2 md:pr-8 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-400/20">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">1</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-200">Q4 2025</h3>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-blue-300 mb-2 sm:mb-3">Core Platform Development 🚀</h4>
                <ul className="text-xs sm:text-sm text-blue-100 space-y-1">
                  <li>• Local Tour Guide marketplace</li>
                  <li>• Photographer booking system</li>
                  <li>• Trip Planner matching platform</li>
                  <li>• Basic booking & payment system</li>
                  <li>• Host onboarding & verification</li>
                </ul>
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                  <span className="text-blue-300 text-xs sm:text-sm font-semibold">Goal: Launch core marketplace for 3 main categories</span>
                </div>
              </div>
            </div>
            
            {/* Timeline marker */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
            
            <div className="md:w-1/2 md:pl-8">
              <div className="text-center md:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-300">Oct - Dec 2025</div>
                <div className="text-blue-400 text-xs sm:text-sm mt-1">Core Development Phase</div>
              </div>
            </div>
          </div>

          {/* Phase 2: Q1 2026 */}
          <div className="relative flex flex-col md:flex-row-reverse items-center mb-8 sm:mb-12">
            <div className="md:w-1/2 md:pl-8 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-400/20">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">2</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-200">Q1 2026</h3>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-purple-300 mb-2 sm:mb-3">Vibes Community Launch 🌍</h4>
                <ul className="text-xs sm:text-sm text-purple-100 space-y-1">
                  <li>• Travel forum & discussion platform</li>
                  <li>• Trip companion matching system</li>
                  <li>• Group trip creation & management</li>
                  <li>• Community moderation tools</li>
                  <li>• Mobile app (iOS & Android)</li>
                </ul>
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-purple-500/10 rounded-lg">
                  <span className="text-purple-300 text-xs sm:text-sm font-semibold">Goal: Build travel community foundation</span>
                </div>
              </div>
            </div>
            
            {/* Timeline marker */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-purple-500 rounded-full border-4 border-white shadow-lg z-10"></div>
            
            <div className="md:w-1/2 md:pr-8">
              <div className="text-center md:text-right">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-300">Jan - Mar 2026</div>
                <div className="text-purple-400 text-xs sm:text-sm mt-1">Community Building Phase</div>
              </div>
            </div>
          </div>

          {/* Phase 3: Q2-Q3 2026 */}
          <div className="relative flex flex-col md:flex-row items-center mb-8 sm:mb-12">
            <div className="md:w-1/2 md:pr-8 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-green-400/20">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">3</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-200">Q2-Q3 2026</h3>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-green-300 mb-2 sm:mb-3">Scale & Expand 📈</h4>
                <ul className="text-xs sm:text-sm text-green-100 space-y-1">
                  <li>• Geographic expansion (25+ cities)</li>
                  <li>• Partnership integrations</li>
                  <li>• Advanced analytics & insights</li>
                  <li>• Corporate travel packages</li>
                  <li>• Government collaboration framework</li>
                </ul>
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-500/10 rounded-lg">
                  <span className="text-green-300 text-xs sm:text-sm font-semibold">Goal: Market leadership position</span>
                </div>
              </div>
            </div>
            
            {/* Timeline marker */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>
            
            <div className="md:w-1/2 md:pl-8">
              <div className="text-center md:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-300">Apr - Sep 2026</div>
                <div className="text-green-400 text-xs sm:text-sm mt-1">Growth & Expansion Phase</div>
              </div>
            </div>
          </div>

          {/* Phase 4: Q4 2026+ */}
          <div className="relative flex flex-col md:flex-row-reverse items-center">
            <div className="md:w-1/2 md:pl-8 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-yellow-400/20">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">4</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-200">Q4 2026+</h3>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-yellow-300 mb-2 sm:mb-3">Innovation & Leadership 🏆</h4>
                <ul className="text-xs sm:text-sm text-yellow-100 space-y-1">
                  <li>• AI-powered personalization</li>
                  <li>• International expansion</li>
                  <li>• Advanced trip planning tools</li>
                  <li>• Sustainability initiatives</li>
                  <li>• Platform ecosystem development</li>
                </ul>
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-yellow-500/10 rounded-lg">
                  <span className="text-yellow-300 text-xs sm:text-sm font-semibold">Goal: Regional market dominance</span>
                </div>
              </div>
            </div>
            
            {/* Timeline marker */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-500 rounded-full border-4 border-white shadow-lg z-10"></div>
            
            <div className="md:w-1/2 md:pr-8">
              <div className="text-center md:text-right">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300">Oct 2026+</div>
                <div className="text-yellow-400 text-xs sm:text-sm mt-1">Innovation & Expansion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Success Metrics */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-blue-400/20">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-blue-200 mb-4 sm:mb-6">
            🎯 Key Milestones & Success Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-300 mb-1 sm:mb-2">Q4 2025</div>
              <div className="text-blue-400 font-medium text-xs sm:text-sm mb-1 sm:mb-2">Vibes Launch</div>
              <div className="text-xs text-blue-500 leading-tight">1,000+ community members</div>
            </div>
            
            <div className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-300 mb-1 sm:mb-2">Q1 2026</div>
              <div className="text-purple-400 font-medium text-xs sm:text-sm mb-1 sm:mb-2">Platform Launch</div>
              <div className="text-xs text-purple-500 leading-tight">500+ local experts</div>
            </div>
            
            <div className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-300 mb-1 sm:mb-2">Q3 2026</div>
              <div className="text-green-400 font-medium text-xs sm:text-sm mb-1 sm:mb-2">Scale Phase</div>
              <div className="text-xs text-green-500 leading-tight">10,000+ bookings</div>
            </div>
            
            <div className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-1 sm:mb-2">2027</div>
              <div className="text-yellow-400 font-medium text-xs sm:text-sm mb-1 sm:mb-2">Market Leader</div>
              <div className="text-xs text-yellow-500 leading-tight">$2.5M+ revenue</div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <span className="text-white font-semibold text-sm sm:text-base">
                🚀 Strategic phased approach to market domination
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapSlide;