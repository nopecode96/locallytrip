import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const LocalExpertSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-6 sm:py-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-xs sm:max-w-2xl md:max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
          Local Expert Categories & Impact
        </h1>
        
        {/* Three Expert Categories - Detailed */}
        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          
          {/* Local Tour Guides */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-blue-400/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-500/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl md:text-4xl">🗺️</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-200">Local Tour Guides</h2>
                    <p className="text-blue-300 text-xs sm:text-sm md:text-base">Authentic storytelling & hidden gems discovery</p>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3 text-blue-100">
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                    Professional local guides who know the real stories behind Indonesian destinations, 
                    beyond what's written in guidebooks.
                  </p>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-300">•</span>
                      <span><strong>Cultural Insights:</strong> Local customs, traditions, and etiquette</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-300">•</span>
                      <span><strong>Historical Knowledge:</strong> Real stories from locals who lived it</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-300">•</span>
                      <span><strong>Hidden Gems:</strong> Off-the-beaten-path locations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-300">•</span>
                      <span><strong>Language Support:</strong> Bridge communication gaps</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-blue-200 mb-1 sm:mb-2 text-sm sm:text-base">Economic Impact</h4>
                  <p className="text-blue-100 text-xs sm:text-sm">
                    Average additional income: <span className="font-bold text-blue-300">Rp 4-8M/month</span>
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-blue-200 mb-1 sm:mb-2 text-sm sm:text-base">Service Examples</h4>
                  <ul className="text-blue-100 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                    <li>• Jakarta street food tours with history</li>
                    <li>• Yogyakarta royal palace storytelling</li>
                    <li>• Bali temple ceremony explanations</li>
                    <li>• Traditional market navigation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Local Photographers */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-purple-400/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-500/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl md:text-4xl">📸</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-200">Local Photographers</h2>
                    <p className="text-purple-300 text-xs sm:text-sm md:text-base">Professional travel photography services</p>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3 text-purple-100">
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                    Skilled local photographers who know the best angles, timing, and locations 
                    to capture Indonesia's beauty through a local lens.
                  </p>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-300">•</span>
                      <span><strong>Instagram-worthy Content:</strong> Social media ready photos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-300">•</span>
                      <span><strong>Local Perspective:</strong> Unique angles locals know</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-300">•</span>
                      <span><strong>Professional Equipment:</strong> High-quality gear and editing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-300">•</span>
                      <span><strong>Cultural Sensitivity:</strong> Appropriate photography ethics</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-purple-200 mb-1 sm:mb-2 text-sm sm:text-base">Economic Impact</h4>
                  <p className="text-purple-100 text-xs sm:text-sm">
                    Average additional income: <span className="font-bold text-purple-300">Rp 3-10M/month</span>
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-purple-200 mb-1 sm:mb-2 text-sm sm:text-base">Service Examples</h4>
                  <ul className="text-purple-100 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                    <li>• Sunrise shoot at Borobudur temple</li>
                    <li>• Fashion photography in Ubud rice fields</li>
                    <li>• Couple portraits at hidden beaches</li>
                    <li>• Street photography with locals</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Planners */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-green-400/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-500/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl md:text-4xl">📋</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-200">Trip Planners</h2>
                    <p className="text-green-300 text-xs sm:text-sm md:text-base">Customized itinerary planning with local insights</p>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3 text-green-100">
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                    Local travel experts who design personalized itineraries based on deep knowledge 
                    of timing, logistics, and cultural nuances that only locals understand.
                  </p>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-300">•</span>
                      <span><strong>Cultural Nuances:</strong> Timing for festivals, ceremonies, local events</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-300">•</span>
                      <span><strong>End-to-end Coordination:</strong> Complete trip management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-300">•</span>
                      <span><strong>Local Optimization:</strong> Routes, transportation, accommodation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-300">•</span>
                      <span><strong>Budget Efficiency:</strong> Local pricing and negotiations</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-green-200 mb-1 sm:mb-2 text-sm sm:text-base">Economic Impact</h4>
                  <p className="text-green-100 text-xs sm:text-sm">
                    Average additional income: <span className="font-bold text-green-300">Rp 5-12M/month</span>
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-green-200 mb-1 sm:mb-2 text-sm sm:text-base">Service Examples</h4>
                  <ul className="text-green-100 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                    <li>• 2-week Java cultural immersion</li>
                    <li>• Adventure trip across Sumatra</li>
                    <li>• Luxury Bali wellness retreat planning</li>
                    <li>• Multi-island hopping logistics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="mt-6 sm:mt-8 md:mt-12">
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-indigo-400/20">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-200 mb-3 sm:mb-4 md:mb-6 text-center">
              🎯 Collective Impact
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-center">
              <div className="p-2 sm:p-3">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-300">3,000+</div>
                <div className="text-indigo-200 text-xs sm:text-sm leading-tight">Local experts empowered by 2026</div>
              </div>
              <div className="p-2 sm:p-3">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-300">Rp 3-12M</div>
                <div className="text-indigo-200 text-xs sm:text-sm leading-tight">Additional monthly income range</div>
              </div>
              <div className="p-2 sm:p-3">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-300">50+</div>
                <div className="text-indigo-200 text-xs sm:text-sm leading-tight">Cities covered across Indonesia</div>
              </div>
              <div className="p-2 sm:p-3">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-300">$5M+</div>
                <div className="text-indigo-200 text-xs sm:text-sm leading-tight">Direct USD income to Indonesian hosts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalExpertSlide;