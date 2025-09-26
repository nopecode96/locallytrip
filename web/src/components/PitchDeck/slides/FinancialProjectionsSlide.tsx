import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const FinancialProjectionsSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-6 sm:py-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-xs sm:max-w-2xl md:max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
          Financial Projections & Growth
        </h1>
        
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-sm sm:text-base md:text-xl text-orange-100 max-w-3xl mx-auto">
            Conservative 3-year revenue projections based on market research & realistic growth trajectory
          </p>
        </div>

        {/* Revenue Growth Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
          <div className="bg-gradient-to-b from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-yellow-400/20">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-200 mb-4 sm:mb-6 text-center">Revenue Growth Trajectory</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 md:p-6 bg-yellow-500/10 rounded-lg min-h-[60px] sm:min-h-[80px]">
                <div className="flex-1 mb-2 sm:mb-0">
                  <div className="font-semibold text-yellow-300 text-base sm:text-lg">2026 (Launch Year)</div>
                  <div className="text-yellow-400 text-xs sm:text-sm mt-1">Platform launch & market entry</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-300">$500K</div>
                  <div className="text-yellow-400 text-xs sm:text-sm">Annual Revenue</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 md:p-6 bg-orange-500/10 rounded-lg min-h-[60px] sm:min-h-[80px]">
                <div className="flex-1 mb-2 sm:mb-0">
                  <div className="font-semibold text-orange-300 text-base sm:text-lg">2027 (Growth Year)</div>
                  <div className="text-orange-400 text-xs sm:text-sm mt-1">Geographic expansion & partnerships</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl sm:text-2xl font-bold text-orange-300">$2.5M</div>
                  <div className="text-orange-400 text-xs sm:text-sm">+400% Growth</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 md:p-6 bg-red-500/10 rounded-lg min-h-[60px] sm:min-h-[80px]">
                <div className="flex-1 mb-2 sm:mb-0">
                  <div className="font-semibold text-red-300 text-base sm:text-lg">2028 (Scale Year)</div>
                  <div className="text-red-400 text-xs sm:text-sm mt-1">National coverage & platform maturity</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl sm:text-2xl font-bold text-red-300">$8M</div>
                  <div className="text-red-400 text-xs sm:text-sm">+220% Growth</div>
                </div>
              </div>
            </div>
          </div>

          {/* User Growth Metrics */}
          <div className="bg-gradient-to-b from-green-600/20 to-teal-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-green-400/20">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-200 mb-4 sm:mb-6 text-center">User Growth Projections</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-green-300 mb-3 sm:mb-4 text-center">International Travelers</h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="p-2 sm:p-3 md:p-4 bg-green-500/10 rounded-lg text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-300">2K</div>
                    <div className="text-green-400 text-xs sm:text-sm mt-1">2026</div>
                  </div>
                  <div className="p-2 sm:p-3 md:p-4 bg-green-500/10 rounded-lg text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-300">15K</div>
                    <div className="text-green-400 text-xs sm:text-sm mt-1">2027</div>
                  </div>
                  <div className="p-2 sm:p-3 md:p-4 bg-teal-500/10 rounded-lg text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-teal-300">50K</div>
                    <div className="text-teal-400 text-xs sm:text-sm mt-1">2028</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-green-300 mb-3 sm:mb-4 text-center">Local Experts</h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="p-2 sm:p-3 md:p-4 bg-green-500/10 rounded-lg text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-300">500</div>
                    <div className="text-green-400 text-xs sm:text-sm mt-1">2026</div>
                  </div>
                  <div className="p-2 sm:p-3 md:p-4 bg-green-500/10 rounded-lg text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-300">2K</div>
                    <div className="text-green-400 text-xs sm:text-sm mt-1">2027</div>
                  </div>
                  <div className="p-2 sm:p-3 md:p-4 bg-teal-500/10 rounded-lg text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-teal-300">5K</div>
                    <div className="text-teal-400 text-xs sm:text-sm mt-1">2028</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
          <div className="bg-gradient-to-b from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-400/20">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-200 mb-3 sm:mb-4 md:mb-6 text-center">Unit Economics</h3>
            
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-blue-300 text-xs sm:text-sm">Average Booking Value</span>
                <span className="font-semibold text-blue-200 text-sm sm:text-base">$185</span>
              </div>
              
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-blue-300 text-xs sm:text-sm">Platform Commission</span>
                <span className="font-semibold text-blue-200 text-sm sm:text-base">15-18%</span>
              </div>
              
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-blue-300 text-xs sm:text-sm">Revenue per Booking</span>
                <span className="font-semibold text-blue-200 text-sm sm:text-base">$28-33</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-blue-400/20 pt-2 sm:pt-3 md:pt-4 mt-2 sm:mt-3 md:mt-4">
                <span className="text-blue-200 font-semibold text-xs sm:text-sm">Gross Margin</span>
                <span className="font-bold text-blue-100 text-sm sm:text-base">85%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-400/20">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-purple-200 mb-3 sm:mb-4 md:mb-6 text-center">Profitability Timeline</h3>
            
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-purple-300 text-xs sm:text-sm">Breakeven Point</span>
                <span className="font-semibold text-purple-200 text-sm sm:text-base">Q3 2027</span>
              </div>
              
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-purple-300 text-xs sm:text-sm">EBITDA Margin (2028)</span>
                <span className="font-semibold text-purple-200 text-sm sm:text-base">35%</span>
              </div>
              
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-purple-300 text-xs sm:text-sm">Net Margin (2029)</span>
                <span className="font-semibold text-purple-200 text-sm sm:text-base">28%</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-purple-400/20 pt-2 sm:pt-3 md:pt-4 mt-2 sm:mt-3 md:mt-4">
                <span className="text-purple-200 font-semibold text-xs sm:text-sm">3-Year IRR</span>
                <span className="font-bold text-purple-100 text-sm sm:text-base">35-45%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-cyan-400/20">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-cyan-200 mb-3 sm:mb-4 md:mb-6 text-center">Market Penetration</h3>
            
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-cyan-300 text-xs sm:text-sm">Addressable Market</span>
                <span className="font-semibold text-cyan-200 text-sm sm:text-base">$2.8B</span>
              </div>
              
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-cyan-300 text-xs sm:text-sm">Market Share (2028)</span>
                <span className="font-semibold text-cyan-200 text-sm sm:text-base">0.29%</span>
              </div>
              
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-cyan-300 text-xs sm:text-sm">Total Market Size</span>
                <span className="font-semibold text-cyan-200 text-sm sm:text-base">$12B</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-cyan-400/20 pt-2 sm:pt-3 md:pt-4 mt-2 sm:mt-3 md:mt-4">
                <span className="text-cyan-200 font-semibold text-xs sm:text-sm">Growth Potential</span>
                <span className="font-bold text-cyan-100 text-sm sm:text-base">Massive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Acquisition Strategy */}
        <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-green-400/20">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-green-200 mb-4 sm:mb-6">
            📊 Customer Acquisition & Retention Model
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-green-300 mb-3 sm:mb-4">Acquisition Channels</h3>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-green-400">Vibes Community (Organic)</span>
                  <span className="text-green-200">40%</span>
                </div>
                
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-green-400">Social Media Marketing</span>
                  <span className="text-green-200">25%</span>
                </div>
                
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-green-400">Influencer Partnerships</span>
                  <span className="text-green-200">15%</span>
                </div>
                
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-green-400">SEO & Content Marketing</span>
                  <span className="text-green-200">10%</span>
                </div>
                
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-green-400">Referral Program</span>
                  <span className="text-green-200">10%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-300 mb-3 sm:mb-4">Key Metrics</h3>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-center">
                <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-300">$75</div>
                  <div className="text-blue-400 text-xs leading-tight">Customer Acquisition Cost</div>
                </div>
                
                <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-300">$450</div>
                  <div className="text-blue-400 text-xs leading-tight">Customer Lifetime Value</div>
                </div>
                
                <div className="p-2 sm:p-3 bg-cyan-500/10 rounded-lg">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300">6:1</div>
                  <div className="text-cyan-400 text-xs leading-tight">LTV:CAC Ratio</div>
                </div>
                
                <div className="p-2 sm:p-3 bg-cyan-500/10 rounded-lg">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300">18mo</div>
                  <div className="text-cyan-400 text-xs leading-tight">Payback Period</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 text-center">
            <div className="inline-block bg-green-500/20 rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <span className="text-green-200 font-semibold text-sm sm:text-base">
                💰 Strong unit economics with sustainable growth model
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialProjectionsSlide;