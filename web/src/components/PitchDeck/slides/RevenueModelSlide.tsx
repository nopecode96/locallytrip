import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const RevenueModelSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-6 sm:py-8 md:py-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-xs sm:max-w-2xl md:max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent">
          Revenue Model & Unit Economics
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Revenue Streams */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-200 mb-3 sm:mb-4 md:mb-6">Primary Revenue Streams</h2>
            
            {/* Commission */}
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-green-400/20">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-500/30 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl md:text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-green-200">Commission</h3>
                  <p className="text-green-300 text-xs sm:text-sm">15-20% per booking</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-green-100 mb-1 sm:mb-2">
                Platform fee from each successful booking transaction
              </p>
              <p className="text-xs sm:text-sm text-green-200">
                ✅ Industry standard rate<br/>
                ✅ Competitive with Airbnb Experiences (18-20%)
              </p>
            </div>

            {/* Premium Subscriptions */}
            <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-400/20">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl md:text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-purple-200">Premium Host Subscriptions</h3>
                  <p className="text-purple-300 text-xs sm:text-sm">Rp 299K/month</p>
                </div>
              </div>
              <ul className="text-xs sm:text-sm text-purple-100 space-y-1">
                <li>• Priority listing placement</li>
                <li>• Advanced analytics dashboard</li>
                <li>• Direct messaging with travelers</li>
                <li>• Profile verification badge</li>
              </ul>
            </div>

            {/* Service Fees */}
            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-400/20">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-500/30 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl md:text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-200">Service Fees</h3>
                  <p className="text-blue-300 text-xs sm:text-sm">3-5% from travelers</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-blue-100">
                Processing fees for payment, booking management, and customer support
              </p>
            </div>
          </div>

          {/* Right Column - Unit Economics */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-200 mb-3 sm:mb-4 md:mb-6">Unit Economics</h2>
            
            {/* Average Transaction */}
            <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-cyan-400/20">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-cyan-200 mb-2 sm:mb-3 md:mb-4">Average Booking Value</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-center">
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-300">$150</div>
                  <div className="text-cyan-200 text-xs sm:text-sm">USD per booking</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-300">Rp 2.3M</div>
                  <div className="text-cyan-200 text-xs sm:text-sm">IDR equivalent</div>
                </div>
              </div>
            </div>

            {/* Platform Economics */}
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-indigo-400/20">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-indigo-200 mb-2 sm:mb-3 md:mb-4">Platform Revenue per Booking</h3>
              <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm md:text-base">
                  <span className="text-indigo-100">Gross Booking Value:</span>
                  <span className="text-indigo-300 font-semibold">$150</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm md:text-base">
                  <span className="text-indigo-100">Platform Fee (15%):</span>
                  <span className="text-indigo-300 font-semibold">$22.5</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm md:text-base">
                  <span className="text-indigo-100">Host Earnings (85%):</span>
                  <span className="text-indigo-300 font-semibold">$127.5</span>
                </div>
                <hr className="border-indigo-400/30" />
                <div className="flex justify-between text-xs sm:text-sm md:text-base text-indigo-200">
                  <span>Monthly Revenue (100 bookings):</span>
                  <span className="font-bold">$2,250</span>
                </div>
              </div>
            </div>

            {/* Host Earnings */}
            <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-emerald-400/20">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-emerald-200 mb-2 sm:mb-3 md:mb-4">Host Monthly Earning Potential</h3>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm md:text-base">
                  <span className="text-emerald-100">Conservative (10 bookings):</span>
                  <span className="text-emerald-300 font-semibold">Rp 3.2M</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm md:text-base">
                  <span className="text-emerald-100">Active (20 bookings):</span>
                  <span className="text-emerald-300 font-semibold">Rp 6.4M</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm md:text-base">
                  <span className="text-emerald-100">Top Performer (30 bookings):</span>
                  <span className="text-emerald-300 font-semibold">Rp 9.6M</span>
                </div>
              </div>
              <p className="text-emerald-200 text-xs sm:text-sm mt-2 sm:mt-3">
                💡 Additional income on top of existing work
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="mt-6 sm:mt-8 md:mt-12">
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-yellow-400/20">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-200 mb-3 sm:mb-4 md:mb-6 text-center">
              📊 Scalable Business Model
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-center">
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300">85%</div>
                <div className="text-xs sm:text-sm text-yellow-200">Host Take Rate</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300">15%</div>
                <div className="text-xs sm:text-sm text-yellow-200">Platform Fee</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300">$22.5</div>
                <div className="text-xs sm:text-sm text-yellow-200">Revenue per Booking</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300">$2.25K</div>
                <div className="text-xs sm:text-sm text-yellow-200">Monthly Revenue Target</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueModelSlide;