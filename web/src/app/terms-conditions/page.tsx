'use client';

import React from 'react';

const TermsConditionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Terms & Conditions 📋
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            The ground rules for using LocallyTrip.com - we keep it fair and simple for everyone! 🤝
          </p>
          <div className="text-sm text-white/80">
            Last updated: August 13, 2025
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            {/* Acceptance */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                1. The Deal 🤝
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By using LocallyTrip.com, you're agreeing to play by our rules. These Terms & Conditions apply to everyone who uses our platform - whether you're booking experiences, hosting travelers, or just browsing around.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you're not cool with these terms, that's totally fine - but you won't be able to use our services. No hard feelings! 😊
              </p>
            </div>

            {/* Platform Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                2. What We're All About 🌟
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                LocallyTrip.com is like the ultimate matchmaker for travelers and awesome local hosts. Our platform connects you with:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-700 mb-2">📸 Photography Magic</h4>
                  <p className="text-sm text-gray-600">Pro photographers who'll make you look amazing</p>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-700 mb-2">🗺️ Local Guide Experiences</h4>
                  <p className="text-sm text-gray-600">Insider tours and authentic cultural vibes</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-700 mb-2">📋 Epic Trip Planning</h4>
                  <p className="text-sm text-gray-600">Custom itineraries that'll blow your mind</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-700 mb-2">🎁 All-in-One Packages</h4>
                  <p className="text-sm text-gray-600">Complete experiences that cover everything</p>
                </div>
              </div>
            </div>

            {/* Use License */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                3. How You Can Use Our Platform 💻
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can use LocallyTrip.com for personal, non-commercial stuff like booking experiences and browsing around. But here's what you can't do:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Copy or mess with our content (that's our hard work!)</li>
                <li>Use our platform for commercial purposes without permission</li>
                <li>Try to hack or reverse engineer our tech</li>
                <li>Remove our copyrights or branding (we worked hard on that!)</li>
              </ul>
            </div>

            {/* User Conduct */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                4. Be Cool to Each Other 😎
              </h2>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.1 The Good Vibes Only Rule</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We want LocallyTrip.com to be an awesome place for everyone. So please don't:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Post anything illegal, harmful, or just plain mean</li>
                <li>Pretend to be someone you're not (be authentic!)</li>
                <li>Send viruses or try to break our platform</li>
                <li>Spam or annoy other users</li>
                <li>Collect people's info without asking</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.2 What You Post Is On You</h3>
              <p className="text-gray-700 leading-relaxed">
                Whatever you share on LocallyTrip.com - photos, reviews, messages - that's all yours! But by posting it, you're letting us use it to make our platform awesome. Just make sure it's something you're proud to share! ✨
              </p>
            </div>

            {/* Service Availability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                5. When Things Go Down 🔧
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We try our best to keep LocallyTrip.com running 24/7, but sometimes tech stuff happens. The site might be down for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Scheduled updates (we'll let you know ahead of time)</li>
                <li>Technical hiccups (we fix these ASAP)</li>
                <li>Emergency fixes</li>
                <li>Stuff totally out of our control (like internet outages)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We'll always try to give you a heads up when we can! 📢
              </p>
            </div>

            {/* Third Party Services */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                6. Other Cool Services We Use 🤝
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                LocallyTrip.com works with some awesome third-party services to make everything smooth:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Payment processors (Stripe, PayPal - the money handlers)</li>
                <li>Maps and location services (so you don't get lost!)</li>
                <li>Communication tools (to keep everyone connected)</li>
                <li>Analytics services (to make our platform better)</li>
                <li>Social media platforms (for all the sharing)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Each of these services has their own rules. We can't control them, but we pick the best ones we can find! 👍
              </p>
            </div>

            {/* Age Requirements */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                7. You Gotta Be 18+ 🎂
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Adults Only:</strong> You need to be at least 18 to create an account and book experiences on LocallyTrip.com.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you're under 18, no worries! Just get your parents or guardians to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Book experiences for you</li>
                <li>Come along during your experience</li>
                <li>Check if there are any special rules for younger travelers</li>
              </ul>
            </div>

            {/* Disclaimers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                8. The Fine Print (But We'll Keep It Real) 📋
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 font-semibold mb-2">Real Talk:</p>
                <p className="text-gray-700 leading-relaxed">
                  LocallyTrip.com is the platform that connects you with hosts - we don't actually provide the travel services ourselves. Think of us as the awesome matchmaker! 💕
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                We show you everything "as is" and try our best, but legally we gotta say:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>We can't guarantee everything will be perfect (hosts are humans too!)</li>
                <li>We're not responsible if something goes wrong during your experience</li>
                <li>Host services may vary from what's described (but we pick the best!)</li>
              </ul>
            </div>

            {/* Indemnification */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                9. If Something Goes Wrong 🚨
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you break our rules or cause problems for other users, you agree to take responsibility and help cover any costs or legal issues that might come up. Basically: play nice, and we'll all have a good time! 😊
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                10. Legal Stuff ⚖️
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These terms follow the laws where LocallyTrip.com is based. If there's ever a dispute, we'll handle it through proper legal channels.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We prefer to sort things out through friendly arbitration rather than lengthy court battles. Let's keep it civil! 🤝
              </p>
            </div>

            {/* Severability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                11. If Part of This Breaks 🔧
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If any part of these terms turns out to be invalid or unenforceable, don't worry - the rest still applies. We'll just remove the problematic bit and keep going! 💪
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                12. Questions? We're Here! 💬
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Got questions about these Terms & Conditions? Hit us up:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> legal@locallytrip.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> LocallyTrip.com Legal Department</p>
                <p><strong>Support:</strong> <a href="/contact" className="text-purple-600 hover:text-purple-700 font-medium">Contact Us</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditionsPage;
