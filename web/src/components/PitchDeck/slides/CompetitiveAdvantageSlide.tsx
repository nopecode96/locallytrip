import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const CompetitiveAdvantageSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-6 sm:py-8 md:py-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-xs sm:max-w-2xl md:max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
          Competitive Advantage & Moats
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
          {/* Our Advantages */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-200 mb-3 sm:mb-4 md:mb-6">🏆 Our Unique Advantages</h2>
            
            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-red-400/20">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-red-200 mb-2 sm:mb-3">🇮🇩 Indonesia-First Focus</h3>
              <p className="text-xs sm:text-sm md:text-base text-red-100 mb-2 sm:mb-3">Deep local market understanding & relationships</p>
              <ul className="text-xs sm:text-sm text-red-200 space-y-0.5 sm:space-y-1">
                <li>• Native Indonesian team understanding local culture</li>
                <li>• Established government connections for compliance</li>
                <li>• Local payment method integrations</li>
                <li>• Indonesian language optimization</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-orange-400/20">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-orange-200 mb-2 sm:mb-3">✅ Verified Expert Network</h3>
              <p className="text-xs sm:text-sm md:text-base text-orange-100 mb-2 sm:mb-3">Rigorous vetting process ensures quality</p>
              <ul className="text-xs sm:text-sm text-orange-200 space-y-0.5 sm:space-y-1">
                <li>• Background checks & skill validation</li>
                <li>• Portfolio review & testing</li>
                <li>• Customer feedback monitoring</li>
                <li>• Continuous quality assurance</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-yellow-600/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-yellow-400/20">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-yellow-200 mb-2 sm:mb-3">🤖 Proprietary Matching</h3>
              <p className="text-xs sm:text-sm md:text-base text-yellow-100 mb-2 sm:mb-3">AI-powered host-traveler compatibility</p>
              <ul className="text-xs sm:text-sm text-yellow-200 space-y-0.5 sm:space-y-1">
                <li>• Interest & personality matching</li>
                <li>• Language preference optimization</li>
                <li>• Experience level compatibility</li>
                <li>• Cultural sensitivity alignment</li>
              </ul>
            </div>
          </div>

          {/* Competitive Comparison */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-200 mb-3 sm:mb-4 md:mb-6">📊 vs. Competition</h2>
            
            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-400/20">
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-blue-400/30">
                      <th className="text-left p-1 sm:p-2 text-blue-200">Feature</th>
                      <th className="text-center p-1 sm:p-2 text-cyan-300">LocallyTrip</th>
                      <th className="text-center p-1 sm:p-2 text-blue-300 hidden sm:table-cell">Airbnb Exp.</th>
                      <th className="text-center p-1 sm:p-2 text-blue-300 hidden md:table-cell">Klook</th>
                    </tr>
                  </thead>
                  <tbody className="text-blue-100">
                    <tr className="border-b border-blue-400/20">
                      <td className="p-1 sm:p-2">Indonesia Focus</td>
                      <td className="text-center p-1 sm:p-2 text-green-400">✅</td>
                      <td className="text-center p-1 sm:p-2 text-red-400 hidden sm:table-cell">❌</td>
                      <td className="text-center p-1 sm:p-2 text-yellow-400 hidden md:table-cell">⚠️</td>
                    </tr>
                    <tr className="border-b border-blue-400/20">
                      <td className="p-1 sm:p-2">Local Language</td>
                      <td className="text-center p-1 sm:p-2 text-green-400">✅</td>
                      <td className="text-center p-1 sm:p-2 text-yellow-400 hidden sm:table-cell">⚠️</td>
                      <td className="text-center p-1 sm:p-2 text-green-400 hidden md:table-cell">✅</td>
                    </tr>
                    <tr className="border-b border-blue-400/20">
                      <td className="p-1 sm:p-2">Expert Categories</td>
                      <td className="text-center p-1 sm:p-2 text-green-400">3 Focused</td>
                      <td className="text-center p-1 sm:p-2 text-blue-400 hidden sm:table-cell">General</td>
                      <td className="text-center p-1 sm:p-2 text-blue-400 hidden md:table-cell">Activities</td>
                    </tr>
                    <tr className="border-b border-blue-400/20">
                      <td className="p-1 sm:p-2">Commission Rate</td>
                      <td className="text-center p-1 sm:p-2 text-green-400">15-20%</td>
                      <td className="text-center p-1 sm:p-2 text-red-400 hidden sm:table-cell">20-25%</td>
                      <td className="text-center p-1 sm:p-2 text-yellow-400 hidden md:table-cell">18-22%</td>
                    </tr>
                    <tr>
                      <td className="p-1 sm:p-2">Host Support</td>
                      <td className="text-center p-1 sm:p-2 text-green-400">Dedicated</td>
                      <td className="text-center p-1 sm:p-2 text-yellow-400 hidden sm:table-cell">Limited</td>
                      <td className="text-center p-1 sm:p-2 text-yellow-400 hidden md:table-cell">Standard</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Defensible Moats */}
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-purple-400/20">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-200 mb-3 sm:mb-4 md:mb-6 text-center">
            🏰 Defensible Business Moats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4">🌐</div>
              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-purple-200 mb-1 sm:mb-2">Network Effects</h4>
              <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
                More hosts attract more travelers, creating a virtuous cycle that becomes harder to replicate
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4">🏛️</div>
              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-purple-200 mb-1 sm:mb-2">Government Relations</h4>
              <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
                Early partnerships with tourism boards create regulatory advantages for new entrants
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4">🧠</div>
              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-purple-200 mb-1 sm:mb-2">Local Knowledge</h4>
              <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
                Deep cultural understanding and relationships that take years for international competitors to build
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TractionSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
          {t('traction.title')}
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            {t('traction.subtitle')}
          </p>
        </div>

        {/* Market Research Findings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/20 text-center">
            <div className="text-4xl font-bold text-green-300 mb-2">$2.8B</div>
            <div className="text-green-200 text-sm mb-2">{t('traction.market_size')}</div>
            <div className="text-green-100 text-xs">{t('traction.sam_desc')}</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20 text-center">
            <div className="text-4xl font-bold text-blue-300 mb-2">73%</div>
            <div className="text-blue-200 text-sm mb-2">{t('traction.authentic_demand')}</div>
            <div className="text-blue-100 text-xs">{t('traction.survey_desc')}</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 text-center">
            <div className="text-4xl font-bold text-purple-300 mb-2">68%</div>
            <div className="text-purple-200 text-sm mb-2">{t('traction.willing_premium')}</div>
            <div className="text-purple-100 text-xs">{t('traction.premium_desc')}</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/20 text-center">
            <div className="text-4xl font-bold text-orange-300 mb-2">85%</div>
            <div className="text-orange-200 text-sm mb-2">{t('traction.locals_interested')}</div>
            <div className="text-orange-100 text-xs">{t('traction.hosting_desc')}</div>
          </div>
        </div>

        {/* Validation Evidence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/20 text-center">
            <div className="text-5xl mb-4">📋</div>
            <div className="text-3xl font-bold text-yellow-300 mb-2">500+</div>
            <div className="text-yellow-200 text-sm mb-2">User Interviews</div>
            <div className="text-yellow-100 text-xs">Across target segments</div>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <div className="text-3xl font-bold text-cyan-300 mb-2">12</div>
            <div className="text-cyan-200 text-sm mb-2">Focus Groups</div>
            <div className="text-cyan-100 text-xs">Target cities research</div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/20 text-center">
            <div className="text-5xl mb-4">�</div>
            <div className="text-3xl font-bold text-indigo-300 mb-2">6 Mo</div>
            <div className="text-indigo-200 text-sm mb-2">{t('traction.research_duration')}</div>
            <div className="text-indigo-100 text-xs">{t('traction.research_desc')}</div>
          </div>
        </div>

        {/* Research Findings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-pink-200 mb-8">{t('traction.findings_title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/20">
              <h3 className="text-xl font-bold text-emerald-200 mb-4">✅ Market Demand</h3>
              <ul className="space-y-2 text-emerald-100 text-sm">
                <li>• 89% of international visitors want authentic local experiences</li>
                <li>• Average willing spend: $150-200 per experience</li>
                <li>• 76% prefer local guides over traditional tours</li>
                <li>• Growing dissatisfaction with generic tourism offerings</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
              <h3 className="text-xl font-bold text-blue-200 mb-4">✅ Supply Interest</h3>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• 85% of locals interested in hosting travelers</li>
                <li>• Potential to earn Rp 2-5M monthly as local expert</li>
                <li>• Strong cultural pride drives participation motivation</li>
                <li>• Existing informal networks ready to be formalized</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Competitive Analysis */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-pink-400/20">
            <h3 className="text-2xl font-bold text-pink-200 mb-6 text-center">
              📊 Competitive Landscape Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-pink-500/10 rounded-lg">
                <div className="text-lg font-semibold text-pink-300 mb-2">Traditional Tours</div>
                <div className="text-pink-100 text-sm">Generic experiences</div>
                <div className="text-pink-100 text-sm">Limited local interaction</div>
                <div className="text-pink-100 text-sm">High prices, low value</div>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg">
                <div className="text-lg font-semibold text-purple-300 mb-2">Online Platforms</div>
                <div className="text-purple-100 text-sm">Focus on accommodation</div>
                <div className="text-purple-100 text-sm">Limited experience curation</div>
                <div className="text-purple-100 text-sm">No local expert matching</div>
              </div>
              <div className="p-4 bg-indigo-500/10 rounded-lg">
                <div className="text-lg font-semibold text-indigo-300 mb-2">LocallyTrip</div>
                <div className="text-indigo-100 text-sm">Authentic local experiences</div>
                <div className="text-indigo-100 text-sm">Expert-guided adventures</div>
                <div className="text-indigo-100 text-sm">Cultural immersion focus</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-block bg-pink-500/20 rounded-full px-6 py-3">
                <span className="text-pink-200 font-semibold">
                  🎯 Clear market gap identified with validated demand
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScalabilitySlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
          {t('scalability.title')}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Phase 1 - Foundation */}
          <div className="bg-gradient-to-b from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h2 className="text-2xl font-bold text-cyan-200 mb-2">{t('scalability.phase1.title')}</h2>
              <p className="text-sm text-cyan-300">{t('scalability.phase1.timeline')}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-lg">🏛️</span>
                <div>
                  <h3 className="font-semibold text-cyan-100">{t('scalability.phase1.focus1.title')}</h3>
                  <p className="text-sm text-cyan-200">{t('scalability.phase1.focus1.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-lg">👥</span>
                <div>
                  <h3 className="font-semibold text-cyan-100">{t('scalability.phase1.focus2.title')}</h3>
                  <p className="text-sm text-cyan-200">{t('scalability.phase1.focus2.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-lg">🔧</span>
                <div>
                  <h3 className="font-semibold text-cyan-100">{t('scalability.phase1.focus3.title')}</h3>
                  <p className="text-sm text-cyan-200">{t('scalability.phase1.focus3.desc')}</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-cyan-500/10 rounded-lg">
                <h4 className="font-semibold text-cyan-200 mb-2">{t('scalability.phase1.targets')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold text-cyan-300">500+</div>
                    <div className="text-cyan-400">{t('scalability.phase1.target_experts')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-cyan-300">5</div>
                    <div className="text-cyan-400">{t('scalability.phase1.target_cities')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 - Growth */}
          <div className="bg-gradient-to-b from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h2 className="text-2xl font-bold text-blue-200 mb-2">{t('scalability.phase2.title')}</h2>
              <p className="text-sm text-blue-300">{t('scalability.phase2.timeline')}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg">🚀</span>
                <div>
                  <h3 className="font-semibold text-blue-100">{t('scalability.phase2.focus1.title')}</h3>
                  <p className="text-sm text-blue-200">{t('scalability.phase2.focus1.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg">🤖</span>
                <div>
                  <h3 className="font-semibold text-blue-100">{t('scalability.phase2.focus2.title')}</h3>
                  <p className="text-sm text-blue-200">{t('scalability.phase2.focus2.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg">🏢</span>
                <div>
                  <h3 className="font-semibold text-blue-100">{t('scalability.phase2.focus3.title')}</h3>
                  <p className="text-sm text-blue-200">{t('scalability.phase2.focus3.desc')}</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 rounded-lg">
                <h4 className="font-semibold text-blue-200 mb-2">{t('scalability.phase2.targets')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-300">2,000+</div>
                    <div className="text-blue-400">{t('scalability.phase2.target_experts')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-300">25</div>
                    <div className="text-blue-400">{t('scalability.phase2.target_cities')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3 - Expansion */}
          <div className="bg-gradient-to-b from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h2 className="text-2xl font-bold text-indigo-200 mb-2">{t('scalability.phase3.title')}</h2>
              <p className="text-sm text-indigo-300">{t('scalability.phase3.timeline')}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-indigo-400 text-lg">🌏</span>
                <div>
                  <h3 className="font-semibold text-indigo-100">{t('scalability.phase3.focus1.title')}</h3>
                  <p className="text-sm text-indigo-200">{t('scalability.phase3.focus1.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-indigo-400 text-lg">🏭</span>
                <div>
                  <h3 className="font-semibold text-indigo-100">{t('scalability.phase3.focus2.title')}</h3>
                  <p className="text-sm text-indigo-200">{t('scalability.phase3.focus2.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-indigo-400 text-lg">💼</span>
                <div>
                  <h3 className="font-semibold text-indigo-100">{t('scalability.phase3.focus3.title')}</h3>
                  <p className="text-sm text-indigo-200">{t('scalability.phase3.focus3.desc')}</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-indigo-500/10 rounded-lg">
                <h4 className="font-semibold text-indigo-200 mb-2">{t('scalability.phase3.targets')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold text-indigo-300">10,000+</div>
                    <div className="text-indigo-400">{t('scalability.phase3.target_experts')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-indigo-300">100+</div>
                    <div className="text-indigo-400">{t('scalability.phase3.target_cities')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Growth Projection */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-cyan-400/20">
          <h2 className="text-2xl font-bold text-center text-cyan-200 mb-8">3-Year Revenue Projection</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-cyan-300 mb-3">$500K</div>
              <div className="text-cyan-400 font-medium mb-2">Year 1 (2026)</div>
              <div className="text-sm text-cyan-500 leading-relaxed">Launch year - establishing market presence</div>
            </div>
            
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-blue-300 mb-3">$2.5M</div>
              <div className="text-blue-400 font-medium mb-2">Year 2 (2027)</div>
              <div className="text-sm text-blue-500 leading-relaxed">Geographic expansion & B2B partnerships</div>
            </div>
            
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-indigo-300 mb-3">$8M</div>
              <div className="text-indigo-400 font-medium mb-2">Year 3 (2028)</div>
              <div className="text-sm text-indigo-500 leading-relaxed">National coverage & platform maturity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ValuePropositionSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
          {t('value_prop.title')}
        </h1>
        <p className="text-xl text-green-100 text-center max-w-3xl mx-auto mb-12">
          {t('value_prop.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Individual Investors */}
          <div className="bg-gradient-to-b from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-green-200 mb-2">{t('value_prop.individual.title')}</h2>
              <p className="text-sm text-green-300">{t('value_prop.individual.subtitle')}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-lg">💰</span>
                <div>
                  <h3 className="font-semibold text-green-100">{t('value_prop.individual.benefit1.title')}</h3>
                  <p className="text-sm text-green-200">{t('value_prop.individual.benefit1.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-lg">📈</span>
                <div>
                  <h3 className="font-semibold text-green-100">{t('value_prop.individual.benefit2.title')}</h3>
                  <p className="text-sm text-green-200">{t('value_prop.individual.benefit2.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-lg">🌏</span>
                <div>
                  <h3 className="font-semibold text-green-100">{t('value_prop.individual.benefit3.title')}</h3>
                  <p className="text-sm text-green-200">{t('value_prop.individual.benefit3.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-lg">🔒</span>
                <div>
                  <h3 className="font-semibold text-green-100">{t('value_prop.individual.benefit4.title')}</h3>
                  <p className="text-sm text-green-200">{t('value_prop.individual.benefit4.desc')}</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-500/10 rounded-lg">
                <h4 className="font-semibold text-green-200 mb-2">{t('value_prop.individual.roi_title')}</h4>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">25-40%</div>
                  <div className="text-green-400 text-sm">{t('value_prop.individual.roi_desc')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Corporate Partners */}
          <div className="bg-gradient-to-b from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h2 className="text-2xl font-bold text-blue-200 mb-2">{t('value_prop.corporate.title')}</h2>
              <p className="text-sm text-blue-300">{t('value_prop.corporate.subtitle')}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg">🤝</span>
                <div>
                  <h3 className="font-semibold text-blue-100">{t('value_prop.corporate.benefit1.title')}</h3>
                  <p className="text-sm text-blue-200">{t('value_prop.corporate.benefit1.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg">🎯</span>
                <div>
                  <h3 className="font-semibold text-blue-100">{t('value_prop.corporate.benefit2.title')}</h3>
                  <p className="text-sm text-blue-200">{t('value_prop.corporate.benefit2.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg">🌟</span>
                <div>
                  <h3 className="font-semibold text-blue-100">{t('value_prop.corporate.benefit3.title')}</h3>
                  <p className="text-sm text-blue-200">{t('value_prop.corporate.benefit3.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg">📊</span>
                <div>
                  <h3 className="font-semibold text-blue-100">{t('value_prop.corporate.benefit4.title')}</h3>
                  <p className="text-sm text-blue-200">{t('value_prop.corporate.benefit4.desc')}</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 rounded-lg">
                <h4 className="font-semibold text-blue-200 mb-2">{t('value_prop.corporate.partnership_types')}</h4>
                <div className="text-sm text-blue-300 space-y-1">
                  <div>• {t('value_prop.corporate.partnership1')}</div>
                  <div>• {t('value_prop.corporate.partnership2')}</div>
                  <div>• {t('value_prop.corporate.partnership3')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Government Stakeholders */}
          <div className="bg-gradient-to-b from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏛️</span>
              </div>
              <h2 className="text-2xl font-bold text-purple-200 mb-2">{t('value_prop.government.title')}</h2>
              <p className="text-sm text-purple-300">{t('value_prop.government.subtitle')}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-lg">💼</span>
                <div>
                  <h3 className="font-semibold text-purple-100">{t('value_prop.government.benefit1.title')}</h3>
                  <p className="text-sm text-purple-200">{t('value_prop.government.benefit1.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-lg">🌍</span>
                <div>
                  <h3 className="font-semibold text-purple-100">{t('value_prop.government.benefit2.title')}</h3>
                  <p className="text-sm text-purple-200">{t('value_prop.government.benefit2.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-lg">🏘️</span>
                <div>
                  <h3 className="font-semibold text-purple-100">{t('value_prop.government.benefit3.title')}</h3>
                  <p className="text-sm text-purple-200">{t('value_prop.government.benefit3.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-lg">📈</span>
                <div>
                  <h3 className="font-semibold text-purple-100">{t('value_prop.government.benefit4.title')}</h3>
                  <p className="text-sm text-purple-200">{t('value_prop.government.benefit4.desc')}</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-purple-500/10 rounded-lg">
                <h4 className="font-semibold text-purple-200 mb-2">{t('value_prop.government.impact_title')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-300">10,000+</div>
                    <div className="text-purple-400">{t('value_prop.government.jobs_created')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-300">$50M+</div>
                    <div className="text-purple-400">{t('value_prop.government.economic_impact')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Win-Win-Win Summary */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20">
          <h2 className="text-2xl font-bold text-center text-green-200 mb-6">{t('value_prop.win_win_title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl mb-2">💰</div>
              <h3 className="text-lg font-semibold text-green-300 mb-2">{t('value_prop.win1_title')}</h3>
              <p className="text-sm text-green-400">{t('value_prop.win1_desc')}</p>
            </div>
            
            <div>
              <div className="text-4xl mb-2">🚀</div>
              <h3 className="text-lg font-semibold text-blue-300 mb-2">{t('value_prop.win2_title')}</h3>
              <p className="text-sm text-blue-400">{t('value_prop.win2_desc')}</p>
            </div>
            
            <div>
              <div className="text-4xl mb-2">🌏</div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">{t('value_prop.win3_title')}</h3>
              <p className="text-sm text-purple-400">{t('value_prop.win3_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancialProjectionsSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
          {t('financials.title')}
        </h1>
        <p className="text-xl text-orange-100 text-center max-w-3xl mx-auto mb-12">
          Conservative projections based on market research & realistic growth trajectory
        </p>
        
        {/* Revenue Projections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-b from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/20">
            <h2 className="text-2xl font-bold text-yellow-200 mb-6 text-center">Revenue Growth (Post-Launch)</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-yellow-500/10 rounded-lg min-h-[80px]">
                <div className="flex-1 mb-3 sm:mb-0">
                  <div className="font-semibold text-yellow-300 text-lg">Year 1 (2026)</div>
                  <div className="text-sm text-yellow-400 mt-1">Platform launch & market entry</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-yellow-300">$500K</div>
                  <div className="text-sm text-yellow-400">Revenue</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-yellow-500/10 rounded-lg min-h-[80px]">
                <div className="flex-1 mb-3 sm:mb-0">
                  <div className="font-semibold text-yellow-300 text-lg">Year 2 (2027)</div>
                  <div className="text-sm text-yellow-400 mt-1">Geographic expansion & partnerships</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-yellow-300">$2.5M</div>
                  <div className="text-sm text-yellow-400">+400% Growth</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-orange-500/10 rounded-lg min-h-[80px]">
                <div className="flex-1 mb-3 sm:mb-0">
                  <div className="font-semibold text-orange-300 text-lg">Year 3 (2028)</div>
                  <div className="text-sm text-orange-400 mt-1">National coverage & platform maturity</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-orange-300">$8M</div>
                  <div className="text-sm text-orange-400">+220% Growth</div>
                </div>
              </div>
            </div>
          </div>

          {/* User Growth Metrics */}
          <div className="bg-gradient-to-b from-green-600/20 to-teal-600/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20">
            <h2 className="text-2xl font-bold text-green-200 mb-8 text-center">Projected User Growth</h2>
            
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-300 mb-6">International Travelers</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-300">2K</div>
                    <div className="text-sm text-green-400 mt-2">2026</div>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-300">15K</div>
                    <div className="text-sm text-green-400 mt-2">2027</div>
                  </div>
                  <div className="p-4 bg-teal-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-teal-300">50K</div>
                    <div className="text-sm text-teal-400 mt-2">2028</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-300 mb-6">Local Experts</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-300">500</div>
                    <div className="text-sm text-green-400 mt-2">2026</div>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-300">1.5K</div>
                    <div className="text-sm text-green-400 mt-2">2027</div>
                  </div>
                  <div className="p-4 bg-teal-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-teal-300">3K</div>
                    <div className="text-sm text-teal-400 mt-2">2028</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-b from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20">
            <h3 className="text-xl font-bold text-blue-200 mb-6 text-center">{t('financials.unit_economics')}</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-blue-300">{t('financials.avg_booking')}</span>
                <span className="font-semibold text-blue-200">$185</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-blue-300">{t('financials.platform_fee')}</span>
                <span className="font-semibold text-blue-200">15%</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-blue-300">{t('financials.revenue_per_booking')}</span>
                <span className="font-semibold text-blue-200">$28</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-blue-400/20 pt-4 mt-4">
                <span className="text-blue-200 font-semibold">{t('financials.gross_margin')}</span>
                <span className="font-bold text-blue-100">85%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/20">
            <h3 className="text-xl font-bold text-purple-200 mb-6 text-center">{t('financials.profitability')}</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-purple-300">{t('financials.breakeven')}</span>
                <span className="font-semibold text-purple-200">{t('financials.year')} 2</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-purple-300">{t('financials.ebitda_margin_y3')}</span>
                <span className="font-semibold text-purple-200">35%</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-purple-300">{t('financials.net_margin_y4')}</span>
                <span className="font-semibold text-purple-200">28%</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-purple-400/20 pt-4 mt-4">
                <span className="text-purple-200 font-semibold">{t('financials.roi_projection')}</span>
                <span className="font-bold text-purple-100">35%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-400/20">
            <h3 className="text-xl font-bold text-cyan-200 mb-6 text-center">{t('financials.market_size')}</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-cyan-300">{t('financials.sam_size')}</span>
                <span className="font-semibold text-cyan-200">$12B</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-cyan-300">{t('financials.market_share_y4')}</span>
                <span className="font-semibold text-cyan-200">0.17%</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-cyan-300">{t('financials.addressable_market')}</span>
                <span className="font-semibold text-cyan-200">$2.8B</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-cyan-300">{t('financials.tam_size')}</span>
                <span className="font-semibold text-cyan-200">$45B</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-cyan-300">{t('financials.market_share_y4')}</span>
                <span className="font-semibold text-cyan-200">0.05%</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-cyan-400/20 pt-4 mt-4">
                <span className="text-cyan-200 font-semibold">{t('financials.growth_potential')}</span>
                <span className="font-bold text-cyan-100">High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Requirements */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-red-600/10 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/20">
          <h2 className="text-2xl font-bold text-center text-yellow-200 mb-8">{t('financials.funding_requirements')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-yellow-300 mb-4">{t('financials.series_a')}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-yellow-400">{t('financials.amount')}</span>
                  <span className="font-semibold text-yellow-200">$2.5M</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-yellow-400">{t('financials.timeline')}</span>
                  <span className="font-semibold text-yellow-200">{t('investment.target_completion')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-yellow-400">{t('financials.runway')}</span>
                  <span className="font-semibold text-yellow-200">18 {t('financials.months')}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-orange-300 mb-4">{t('financials.use_of_funds')}</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-400">{t('financials.marketing')}</span>
                  <span className="text-orange-200">40%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-orange-400">{t('financials.technology')}</span>
                  <span className="text-orange-200">30%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-orange-400">{t('financials.operations')}</span>
                  <span className="text-orange-200">20%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-orange-400">{t('financials.working_capital')}</span>
                  <span className="text-orange-200">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RiskManagementSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text text-transparent">
          {t('risks.title')}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Market Risks */}
          <div className="bg-gradient-to-b from-red-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-8 border border-red-400/20">
            <h2 className="text-2xl font-bold text-red-200 mb-8 text-center">{t('risks.market_risks')}</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-red-500/10 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                  <h3 className="font-semibold text-red-200 flex-1">{t('risks.market.competition')}</h3>
                  <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300 shrink-0">{t('risks.medium')}</span>
                </div>
                <p className="text-sm text-red-300 mb-4 leading-relaxed">{t('risks.market.competition_desc')}</p>
                <div className="text-sm">
                  <strong className="text-red-200">{t('risks.mitigation')}:</strong>
                  <p className="text-red-300 mt-2 leading-relaxed">{t('risks.market.competition_solution')}</p>
                </div>
              </div>
              
              <div className="p-6 bg-red-500/10 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                  <h3 className="font-semibold text-red-200 flex-1">{t('risks.market.economic_downturn')}</h3>
                  <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-xs text-yellow-300 shrink-0">{t('risks.low')}</span>
                </div>
                <p className="text-sm text-red-300 mb-4 leading-relaxed">{t('risks.market.economic_desc')}</p>
                <div className="text-sm">
                  <strong className="text-red-200">{t('risks.mitigation')}:</strong>
                  <p className="text-red-300 mt-2 leading-relaxed">{t('risks.market.economic_solution')}</p>
                </div>
              </div>
              
              <div className="p-6 bg-red-500/10 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                  <h3 className="font-semibold text-red-200 flex-1">{t('risks.market.consumer_behavior')}</h3>
                  <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300 shrink-0">{t('risks.medium')}</span>
                </div>
                <p className="text-sm text-red-300 mb-4 leading-relaxed">{t('risks.market.consumer_desc')}</p>
                <div className="text-sm">
                  <strong className="text-red-200">{t('risks.mitigation')}:</strong>
                  <p className="text-red-300 mt-2 leading-relaxed">{t('risks.market.consumer_solution')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Risks */}
          <div className="bg-gradient-to-b from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/20">
            <h2 className="text-2xl font-bold text-purple-200 mb-8 text-center">{t('risks.operational_risks')}</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-purple-500/10 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                  <h3 className="font-semibold text-purple-200 flex-1">{t('risks.operational.quality_control')}</h3>
                  <span className="px-3 py-1 bg-red-500/20 rounded-full text-xs text-red-300 shrink-0">{t('risks.high')}</span>
                </div>
                <p className="text-sm text-purple-300 mb-4 leading-relaxed">{t('risks.operational.quality_desc')}</p>
                <div className="text-sm">
                  <strong className="text-purple-200">{t('risks.mitigation')}:</strong>
                  <p className="text-purple-300 mt-2 leading-relaxed">{t('risks.operational.quality_solution')}</p>
                </div>
              </div>
              
              <div className="p-6 bg-purple-500/10 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                  <h3 className="font-semibold text-purple-200 flex-1">{t('risks.operational.expert_retention')}</h3>
                  <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300 shrink-0">{t('risks.medium')}</span>
                </div>
                <p className="text-sm text-purple-300 mb-4 leading-relaxed">{t('risks.operational.retention_desc')}</p>
                <div className="text-sm">
                  <strong className="text-purple-200">{t('risks.mitigation')}:</strong>
                  <p className="text-purple-300 mt-2 leading-relaxed">{t('risks.operational.retention_solution')}</p>
                </div>
              </div>
              
              <div className="p-6 bg-purple-500/10 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                  <h3 className="font-semibold text-purple-200 flex-1">{t('risks.operational.technology')}</h3>
                  <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-xs text-yellow-300 shrink-0">{t('risks.low')}</span>
                </div>
                <p className="text-sm text-purple-300 mb-4 leading-relaxed">{t('risks.operational.tech_desc')}</p>
                <div className="text-sm">
                  <strong className="text-purple-200">{t('risks.mitigation')}:</strong>
                  <p className="text-purple-300 mt-2 leading-relaxed">{t('risks.operational.tech_solution')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory & Legal Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-b from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20">
            <h2 className="text-2xl font-bold text-blue-200 mb-8 text-center">{t('risks.regulatory_risks')}</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-blue-500/10 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                  <h3 className="font-semibold text-blue-200 flex-1">{t('risks.regulatory.tourism_regulations')}</h3>
                  <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300 shrink-0">{t('risks.medium')}</span>
                </div>
                <p className="text-sm text-blue-300 mb-4 leading-relaxed">{t('risks.regulatory.tourism_desc')}</p>
                <div className="text-sm">
                  <strong className="text-blue-200">{t('risks.mitigation')}:</strong>
                  <p className="text-blue-300 mt-2 leading-relaxed">{t('risks.regulatory.tourism_solution')}</p>
                </div>
              </div>
              
              <div className="p-6 bg-blue-500/10 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                  <h3 className="font-semibold text-blue-200 flex-1">{t('risks.regulatory.data_privacy')}</h3>
                  <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-xs text-yellow-300 shrink-0">{t('risks.low')}</span>
                </div>
                <p className="text-sm text-blue-300 mb-4 leading-relaxed">{t('risks.regulatory.privacy_desc')}</p>
                <div className="text-sm">
                  <strong className="text-blue-200">{t('risks.mitigation')}:</strong>
                  <p className="text-blue-300 mt-2 leading-relaxed">{t('risks.regulatory.privacy_solution')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Risks */}
          <div className="bg-gradient-to-b from-green-600/20 to-teal-600/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20">
            <h2 className="text-2xl font-bold text-green-200 mb-8 text-center">{t('risks.financial_risks')}</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-green-500/10 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                  <h3 className="font-semibold text-green-200 flex-1">{t('risks.financial.cash_flow')}</h3>
                  <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300 shrink-0">{t('risks.medium')}</span>
                </div>
                <p className="text-sm text-green-300 mb-4 leading-relaxed">{t('risks.financial.cashflow_desc')}</p>
                <div className="text-sm">
                  <strong className="text-green-200">{t('risks.mitigation')}:</strong>
                  <p className="text-green-300">{t('risks.financial.cashflow_solution')}</p>
                </div>
              </div>
              
              <div className="p-4 bg-green-500/10 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-green-200">{t('risks.financial.currency_fluctuation')}</h3>
                  <span className="px-2 py-1 bg-yellow-500/20 rounded text-xs text-yellow-300">{t('risks.low')}</span>
                </div>
                <p className="text-sm text-green-300 mb-3">{t('risks.financial.currency_desc')}</p>
                <div className="text-sm">
                  <strong className="text-green-200">{t('risks.mitigation')}:</strong>
                  <p className="text-green-300">{t('risks.financial.currency_solution')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Matrix Summary */}
        <div className="bg-gradient-to-r from-red-600/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-8 border border-red-400/20">
          <h2 className="text-2xl font-bold text-center text-red-200 mb-8">{t('risks.overall_assessment')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-red-300 mb-2">{t('risks.high_level')}</h3>
              <p className="text-sm text-red-400">{t('risks.high_desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">5</span>
              </div>
              <h3 className="text-lg font-semibold text-orange-300 mb-2">{t('risks.medium_level')}</h3>
              <p className="text-sm text-orange-400">{t('risks.medium_desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-semibold text-green-300 mb-2">{t('risks.low_level')}</h3>
              <p className="text-sm text-green-400">{t('risks.low_desc')}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-white mb-4">{t('risks.conclusion')}</p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 rounded-full border border-green-400/30">
              <span className="text-2xl">✅</span>
              <span className="text-green-200 font-semibold">{t('risks.risk_manageable')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvestmentOpportunitySlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
          {t('investment.title')}
        </h1>
        
        {/* Investment Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-b from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/20">
            <h2 className="text-2xl font-bold text-yellow-200 mb-6 text-center">{t('investment.series_a_overview')}</h2>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-300 mb-2">$2.5M</div>
                <div className="text-yellow-400 text-lg">{t('investment.funding_goal')}</div>
                <div className="text-yellow-500 text-sm">{t('investment.series_a_round')}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-300">18</div>
                  <div className="text-yellow-400 text-sm">{t('investment.months_runway')}</div>
                </div>
                
                <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-orange-300">25%</div>
                  <div className="text-orange-400 text-sm">{t('investment.equity_offered')}</div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg">
                <h3 className="font-semibold text-yellow-200 mb-3">{t('investment.key_milestones')}</h3>
                <ul className="text-sm text-yellow-300 space-y-2">
                  <li>• {t('investment.milestone1')}</li>
                  <li>• {t('investment.milestone2')}</li>
                  <li>• {t('investment.milestone3')}</li>
                  <li>• {t('investment.milestone4')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use of Funds */}
          <div className="bg-gradient-to-b from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20">
            <h2 className="text-2xl font-bold text-blue-200 mb-6 text-center">{t('investment.use_of_funds')}</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-blue-200">{t('investment.marketing_sales')}</div>
                    <div className="text-sm text-blue-300">{t('investment.marketing_desc')}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-300">40%</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-indigo-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-indigo-400 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-indigo-200">{t('investment.technology_dev')}</div>
                    <div className="text-sm text-indigo-300">{t('investment.tech_desc')}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-indigo-300">30%</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-purple-200">{t('investment.operations')}</div>
                    <div className="text-sm text-purple-300">{t('investment.ops_desc')}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-300">20%</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-pink-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-pink-200">{t('investment.working_capital')}</div>
                    <div className="text-sm text-pink-300">{t('investment.capital_desc')}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-pink-300">10%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Investor Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-b from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/20">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-green-200">{t('investment.financial_returns')}</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-green-300">{t('investment.projected_irr')}</span>
                <span className="font-semibold text-green-200">35-45%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-green-300">{t('investment.exit_timeline')}</span>
                <span className="font-semibold text-green-200">5-6 years</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-green-300">{t('investment.target_multiple')}</span>
                <span className="font-semibold text-green-200">8-12x</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-blue-200">{t('investment.strategic_value')}</h3>
            </div>
            
            <div className="space-y-3 text-sm text-blue-300">
              <div>• {t('investment.market_leadership')}</div>
              <div>• {t('investment.brand_recognition')}</div>
              <div>• {t('investment.data_insights')}</div>
              <div>• {t('investment.network_effects')}</div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-purple-200">{t('investment.impact_opportunity')}</h3>
            </div>
            
            <div className="space-y-3 text-sm text-purple-300">
              <div>• {t('investment.community_empowerment')}</div>
              <div>• {t('investment.cultural_preservation')}</div>
              <div>• {t('investment.sustainable_tourism')}</div>
              <div>• {t('investment.economic_development')}</div>
            </div>
          </div>
        </div>

        {/* Timeline & Next Steps */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/20">
          <h2 className="text-2xl font-bold text-center text-yellow-200 mb-8">{t('investment.investment_timeline')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="font-semibold text-yellow-300 mb-2">{t('investment.phase1_title')}</h3>
              <p className="text-sm text-yellow-400">{t('investment.phase1_desc')}</p>
              <div className="text-xs text-yellow-500 mt-2">{t('investment.phase1_duration')}</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="font-semibold text-orange-300 mb-2">{t('investment.phase2_title')}</h3>
              <p className="text-sm text-orange-400">{t('investment.phase2_desc')}</p>
              <div className="text-xs text-orange-500 mt-2">{t('investment.phase2_duration')}</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="font-semibold text-red-300 mb-2">{t('investment.phase3_title')}</h3>
              <p className="text-sm text-red-400">{t('investment.phase3_desc')}</p>
              <div className="text-xs text-red-500 mt-2">{t('investment.phase3_duration')}</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">4</span>
              </div>
              <h3 className="font-semibold text-pink-300 mb-2">{t('investment.phase4_title')}</h3>
              <p className="text-sm text-pink-400">{t('investment.phase4_desc')}</p>
              <div className="text-xs text-pink-500 mt-2">{t('investment.phase4_duration')}</div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/20 rounded-full border border-yellow-400/30">
              <span className="text-2xl">🎯</span>
              <span className="text-yellow-200 font-semibold">{t('investment.target_completion')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CallToActionSlide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
            {t('cta.title')}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            {t('cta.subtitle')}
          </p>
        </div>

        {/* Partnership Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-b from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💰</span>
            </div>
            <h2 className="text-2xl font-bold text-green-200 mb-6">{t('cta.investors.title')}</h2>
            <p className="text-green-300 mb-6 leading-relaxed min-h-[48px]">{t('cta.investors.desc')}</p>
            
            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between py-2">
                <span className="text-green-400">{t('cta.investors.min_investment')}</span>
                <span className="font-semibold text-green-200">$50K</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-green-400">{t('cta.investors.expected_irr')}</span>
                <span className="font-semibold text-green-200">35-45%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-green-400">{t('cta.investors.investment_type')}</span>
                <span className="font-semibold text-green-200">{t('cta.investors.equity')}</span>
              </div>
            </div>
            
            <button className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200">
              {t('cta.investors.button')}
            </button>
          </div>

          <div className="bg-gradient-to-b from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🏢</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-200 mb-6">{t('cta.corporates.title')}</h2>
            <p className="text-blue-300 mb-6 leading-relaxed min-h-[48px]">{t('cta.corporates.desc')}</p>
            
            <div className="space-y-3 text-sm text-blue-300 mb-8 min-h-[120px]">
              <div>• {t('cta.corporates.benefit1')}</div>
              <div>• {t('cta.corporates.benefit2')}</div>
              <div>• {t('cta.corporates.benefit3')}</div>
              <div>• {t('cta.corporates.benefit4')}</div>
            </div>
            
            <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200">
              {t('cta.corporates.button')}
            </button>
          </div>

          <div className="bg-gradient-to-b from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/20 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🏛️</span>
            </div>
            <h2 className="text-2xl font-bold text-purple-200 mb-6">{t('cta.government.title')}</h2>
            <p className="text-purple-300 mb-6 leading-relaxed min-h-[48px]">{t('cta.government.desc')}</p>
            
            <div className="space-y-3 text-sm text-purple-300 mb-8 min-h-[120px]">
              <div>• {t('cta.government.benefit1')}</div>
              <div>• {t('cta.government.benefit2')}</div>
              <div>• {t('cta.government.benefit3')}</div>
              <div>• {t('cta.government.benefit4')}</div>
            </div>
            
            <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
              {t('cta.government.button')}
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-cyan-400/20 text-center mb-12">
          <h2 className="text-3xl font-bold text-cyan-200 mb-8">{t('cta.contact_title')}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-cyan-500/10 rounded-lg">
              <div className="text-3xl mb-4">📧</div>
              <div className="font-semibold text-cyan-200 mb-3">{t('cta.contact.email')}</div>
              <div className="text-cyan-300 text-sm break-all">business@locallytrip.com</div>
            </div>
            
            <div className="p-6 bg-blue-500/10 rounded-lg">
              <div className="text-3xl mb-4">🌐</div>
              <div className="font-semibold text-blue-200 mb-3">{t('cta.contact.website')}</div>
              <div className="text-blue-300 text-sm">www.locallytrip.com</div>
            </div>
            
            <div className="p-6 bg-indigo-500/10 rounded-lg">
              <div className="text-3xl mb-4">📱</div>
              <div className="font-semibold text-indigo-200 mb-3">{t('cta.contact.phone')}</div>
              <div className="text-indigo-300 text-sm">+62 819 1972 9696</div>
            </div>
            
            <div className="p-6 bg-purple-500/10 rounded-lg">
              <div className="text-3xl mb-4">📍</div>
              <div className="font-semibold text-purple-200 mb-3">{t('cta.contact.location')}</div>
              <div className="text-purple-300 text-sm">Bandung, Indonesia</div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/20">
          <h2 className="text-2xl font-bold text-center text-yellow-200 mb-8">{t('cta.next_steps_title')}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-semibold text-yellow-300 mb-4 text-lg">{t('cta.step1.title')}</h3>
              <p className="text-yellow-400 leading-relaxed">{t('cta.step1.desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-semibold text-orange-300 mb-4 text-lg">{t('cta.step2.title')}</h3>
              <p className="text-orange-400 leading-relaxed">{t('cta.step2.desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-semibold text-red-300 mb-4 text-lg">{t('cta.step3.title')}</h3>
              <p className="text-red-400 leading-relaxed">{t('cta.step3.desc')}</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text mb-4">
              {t('cta.final_message')}
            </h2>
            <p className="text-xl text-blue-200">{t('cta.final_subtitle')}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-white text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105">
              {t('cta.schedule_meeting')}
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-cyan-300">
            <span className="text-2xl">🚀</span>
            <span className="font-semibold text-lg">{t('cta.ready_to_start')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveAdvantageSlide;
export { TractionSlide, ScalabilitySlide, ValuePropositionSlide, FinancialProjectionsSlide, RiskManagementSlide, InvestmentOpportunitySlide, CallToActionSlide };