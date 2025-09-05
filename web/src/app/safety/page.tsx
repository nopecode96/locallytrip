'use client';

import React from 'react';

const SafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Safety & Security 🛡️
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Your safety is everything to us! Here's how LocallyTrip.com keeps you protected while you're out there living your best travel life ✨
          </p>
          <div className="text-sm text-white/80">
            Updated: August 13, 2025
          </div>
        </div>
      </section>

      {/* Quick Safety Tips */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Safety First, Always! 🛡️
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick safety tips to keep you protected on every LocallyTrip.com adventure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">Check Your Host</h3>
              <p className="text-green-600 text-sm">Always verify host identity and read reviews before booking - trust but verify!</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Share Your Plans</h3>
              <p className="text-blue-600 text-sm">Tell someone where you're going and when you'll be back - it's just smart!</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Trust Your Gut</h3>
              <p className="text-orange-600 text-sm">If something feels off, get out of there - your instincts are usually right!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            {/* Our Safety Commitment */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                🛡️ How We Keep You Safe
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                At LocallyTrip.com, we've got your back! We've built a comprehensive safety system with background checks, user verification, safety guidelines, and 24/7 support because your wellbeing is non-negotiable.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-700 mb-2">🔍 We Vet Every Host</h4>
                  <p className="text-sm text-gray-600">Thorough background checks and identity verification - no sketchy people allowed!</p>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-700 mb-2">📞 24/7 Support Squad</h4>
                  <p className="text-sm text-gray-600">Round-the-clock support team ready to help - we never sleep so you can travel worry-free</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-700 mb-2">💳 Secure Payment Magic</h4>
                  <p className="text-sm text-gray-600">Bank-level security for all payments - your money is safer than in a vault</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-700 mb-2">⭐ Real Reviews System</h4>
                  <p className="text-sm text-gray-600">Honest reviews from real travelers - no fake 5-star nonsense here</p>
                </div>
              </div>
            </div>

            {/* For Travelers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                🧳 Safety Tips for Travelers (Your Survival Guide!)
              </h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Before You Book 📱</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Stalk their profile (in a good way!) - read reviews and check their vibe</li>
                <li>Look for those verification badges - they're like trust signals</li>
                <li>Make sure they have multiple positive reviews from real people</li>
                <li>Check that the meeting spot is public and well-lit</li>
                <li>Keep all conversations on LocallyTrip.com messaging - no sketchy external chats</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">During Your Adventure 🌟</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Meet in busy public places first - coffee shops, hotels, popular landmarks</li>
                <li>Keep your phone charged and bring a portable charger</li>
                <li>Share your live location with friends or family</li>
                <li>Stay alert and aware - put down the phone occasionally!</li>
                <li>Don't overshare personal details like your hotel room number</li>
                <li>Respect local laws and customs (when in Rome...)</li>
                <li>Always carry ID and have emergency contacts saved</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">If Things Go Wrong 🚨</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 font-semibold mb-2">If you feel unsafe or something's not right:</p>
                <ul className="list-disc list-inside text-red-600 space-y-1 ml-4">
                  <li>Trust your gut and leave immediately - no second-guessing!</li>
                  <li>Call local emergency services (911, 112, etc.) if you're in danger</li>
                  <li>Contact our safety hotline: +1 (555) 911-SAFE</li>
                  <li>Report what happened through our platform so we can help others</li>
                </ul>
              </div>
            </div>

            {/* For Hosts */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                🏠 Safety Guidelines for Hosts (The Real Ones)
              </h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Our Host Verification Process 🔍</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We don't mess around when it comes to vetting our hosts. Here's what everyone goes through:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Government ID verification (we check it's real, not a fake!)</li>
                <li>Background check that actually means something</li>
                <li>Professional certifications (where applicable - photographers need portfolios, guides need licenses)</li>
                <li>Reference checks from previous clients</li>
                <li>Insurance verification (because accidents happen)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">Host Responsibilities (The Real Talk) 💪</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Keep all your licenses and certifications current (no expired stuff!)</li>
                <li>Maintain proper insurance coverage - protect yourself and your clients</li>
                <li>Give safety briefings for any activities (even if it seems obvious)</li>
                <li>Get first aid certified (seriously recommended - be a hero!)</li>
                <li>Have emergency plans ready - hope you never need them</li>
                <li>Report any incidents immediately - we're here to help</li>
                <li>Follow all local safety rules and regulations</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">Equipment & Venue Safety ⚙️</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Check and maintain your equipment regularly - broken gear = bad experience</li>
                <li>Make sure venues meet safety standards</li>
                <li>Provide safety equipment when needed (helmets, life jackets, etc.)</li>
                <li>Check weather conditions before outdoor activities</li>
                <li>Always have backup plans for when Mother Nature doesn't cooperate</li>
              </ul>
            </div>

            {/* Safety Features */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                🔒 Our Platform Safety Features (The Tech That Protects You)
              </h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🆔 Identity Verification (No Catfishing Allowed!)</h4>
                  <p className="text-gray-600 text-sm">
                    Everyone must verify with real government ID. See that blue checkmark? That person is legit verified - no fake profiles here!
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">💬 Secure Messaging (NSA-Level Security)</h4>
                  <p className="text-gray-600 text-sm">
                    All chats happen through our secure platform. We keep records to protect everyone and catch any bad actors.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🏪 Trusted Payment System (Fort Knox for Your Money)</h4>
                  <p className="text-gray-600 text-sm">
                    Payments go through our secure system. Hosts only get paid after you're happy with the service - incentives aligned!
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">⭐ Community Reviews (The Real Tea)</h4>
                  <p className="text-gray-600 text-sm">
                    Both hosts and travelers leave honest reviews. Multiple bad reviews? That account gets the boot - we don't play!
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🚨 Incident Reporting (Speak Up!)</h4>
                  <p className="text-gray-600 text-sm">
                    Super easy reporting system for anything that feels off. We investigate everything and take action fast.
                  </p>
                </div>
              </div>
            </div>

            {/* Insurance Coverage */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                🛡️ Insurance Coverage (We Got You Covered!)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                LocallyTrip.com provides extra protection through our insurance partnerships because life happens and we want you covered:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li><strong>General Liability:</strong> If someone gets hurt or something gets damaged (not your fault!)</li>
                <li><strong>Professional Liability:</strong> Protection for the services our hosts provide</li>
                <li><strong>Equipment Coverage:</strong> If host equipment breaks during your experience</li>
                <li><strong>Travel Protection:</strong> Basic coverage for travelers during booked experiences</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700 text-sm">
                  <strong>Quick heads up:</strong> Insurance details vary by service type and location. Check your booking confirmation for the specifics - we don't want any surprises! 📋
                </p>
              </div>
            </div>

            {/* COVID-19 Safety */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                😷 Health & Hygiene Guidelines (Stay Healthy Out There!)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We follow current health guidelines to keep everyone safe and healthy during experiences:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Follow whatever health guidelines are current in your area</li>
                <li>Keep up good hygiene practices (basic human decency!)</li>
                <li>Respect everyone's personal space and comfort levels</li>
                <li>If you're feeling sick, please cancel or reschedule - don't be that person</li>
                <li>Use hand sanitizer when it makes sense</li>
              </ul>
            </div>

            {/* Reporting and Support */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                📞 Emergency Support & Reporting (We're Here When You Need Us!)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Our Emergency Contacts 🚨</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Safety Hotline:</strong> +1 (555) 911-SAFE</li>
                    <li><strong>24/7 Support:</strong> support@locallytrip.com</li>
                    <li><strong>Incident Reports:</strong> safety@locallytrip.com</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Local Emergency Numbers 🌍</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>USA/Canada:</strong> 911</li>
                    <li><strong>Europe:</strong> 112</li>
                    <li><strong>Australia:</strong> 000</li>
                    <li><strong>UK:</strong> 999</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🆘 Need Help? We're Just a Click Away!
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Safety concerns? Weird situation? Just need someone to talk to? Don't hesitate to reach out - we're here 24/7:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Safety Team:</strong> safety@locallytrip.com</p>
                <p><strong>Emergency Hotline:</strong> +1 (555) 911-SAFE</p>
                <p><strong>General Support:</strong> <a href="/contact" className="text-purple-600 hover:text-purple-700 font-medium">Contact Us</a></p>
                <p><strong>Report Something:</strong> <a href="/help" className="text-purple-600 hover:text-purple-700 font-medium">Help Center</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafetyPage;
