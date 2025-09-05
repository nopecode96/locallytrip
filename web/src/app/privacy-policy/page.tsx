'use client';

import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Privacy Policy 🔒
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Your privacy matters to us! Here's the lowdown on how we handle your data - no confusing legal speak, just the real deal ✨
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
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                1. The Real Talk 💬
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                LocallyTrip.com ("we," "our," or "us") is all about protecting your privacy. This Privacy Policy breaks down exactly how we collect, use, and keep your info safe when you're using our platform and services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using LocallyTrip.com, you're cool with how we handle your data according to this policy. We promise to keep it transparent and straightforward! 🤝
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                2. What Info We Need From You 📋
              </h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1 The Basics About You</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We only collect the personal stuff you choose to share with us when you:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Sign up for an account (name, email, phone number)</li>
                <li>Book amazing experiences (travel dates, what you're into, special requests)</li>
                <li>Become an awesome host (business info, certifications, payment details)</li>
                <li>Hit up our support team</li>
                <li>Join surveys or cool promotions</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Payment Stuff 💳</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We need payment info to process your bookings. Don't worry - your credit card details are super secure with our payment processors. We don't even store that sensitive stuff on our servers!
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.3 Tech Data (The Automatic Stuff) 🤖</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Device info (IP address, browser type, operating system)</li>
                <li>How you use our site (pages you visit, time spent, what you click)</li>
                <li>Location data (only if you let us know where you are)</li>
                <li>Cookies and tracking tech (to make your experience better)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.4 Your Content 📸</h3>
              <p className="text-gray-700 leading-relaxed">
                All the cool stuff you create on LocallyTrip.com - reviews, photos, messages, and your profile. This helps other travelers discover amazing experiences!
              </p>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                3. How We Use Your Info 🚀
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Here's exactly what we do with your data (spoiler: it's all about making your experience awesome):
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Keep LocallyTrip.com running smooth and awesome</li>
                <li>Process your bookings and handle payments</li>
                <li>Make sure you're really you (fraud prevention is real)</li>
                <li>Send you updates about your account and bookings</li>
                <li>Help you out when you need support</li>
                <li>Make our platform even better with new features</li>
                <li>Send you cool updates and offers (only if you want them!)</li>
                <li>Stay legal and follow the rules</li>
                <li>Sort out any issues and keep our community safe</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                4. When We Share Your Data 🤝
              </h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.1 With Hosts and Travelers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We connect you with hosts and other travelers by sharing the essentials - contact info, booking details, and your preferences. It's all about making those connections happen!
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.2 With Our Trusted Partners</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We work with some awesome third-party services to keep everything running smoothly:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Payment processors (to handle your transactions safely)</li>
                <li>Email services (to send you updates)</li>
                <li>Analytics tools (to make our platform better)</li>
                <li>Support platforms (to help you faster)</li>
                <li>Background check services (to keep our community safe)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.3 When the Law Says So 👮‍♀️</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sometimes we have to share info for legal reasons or to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Follow legal requirements</li>
                <li>Protect our platform and community</li>
                <li>Stop fraud and security threats</li>
                <li>Keep everyone safe</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.4 Business Changes</h3>
              <p className="text-gray-700 leading-relaxed">
                If LocallyTrip.com ever gets acquired or merges with another company, your data might transfer as part of that deal. Don't worry - we'll let you know!
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                5. Keeping Your Data Safe 🛡️
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We take security seriously! Here's how we protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>SSL encryption (that little lock icon in your browser)</li>
                <li>Encrypted data storage (your info is locked up tight)</li>
                <li>Regular security checkups and monitoring</li>
                <li>Access controls and staff training (our team knows their stuff)</li>
                <li>PCI DSS compliance (industry-standard payment security)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Real talk: Nothing on the internet is 100% hack-proof. We do our absolute best, but we can't guarantee perfect security. That's just being honest with you! 💯
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                6. How Long We Keep Your Data ⏰
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We hold onto your info only as long as we need to for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Keeping LocallyTrip.com running for you</li>
                <li>Following legal requirements</li>
                <li>Sorting out any issues that might come up</li>
                <li>Making sure everyone follows our rules</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                When you delete your account, we'll delete or anonymize your personal info (except what we legally have to keep). It's like you were never here! 👻
              </p>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                7. Your Data Rights (You're in Control!) 💪
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                It's your data, so you get to decide what happens with it:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li><strong>Access:</strong> See what data we have about you</li>
                <li><strong>Fix It:</strong> Update or correct anything that's wrong</li>
                <li><strong>Delete:</strong> Ask us to remove your personal info</li>
                <li><strong>Download:</strong> Get your data in a format you can use elsewhere</li>
                <li><strong>Unsubscribe:</strong> Stop getting marketing emails (but you'll miss our cool updates!)</li>
                <li><strong>Limit:</strong> Restrict how we use certain information</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Want to exercise any of these rights? Just hit us up at privacy@locallytrip.com or check your account settings. We're here to help! ✨
              </p>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                8. Cookies & Tracking Stuff 🍪
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tech to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Remember your preferences (so you don't have to set them every time)</li>
                <li>See how people use our site (to make it better)</li>
                <li>Show you relevant content and ads</li>
                <li>Keep improving your experience</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You can manage cookies in your browser settings. Just heads up - turning them off might make some features wonky! 🤷‍♀️
              </p>
            </div>

            {/* Third-Party Links */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                9. Other Websites & Services 🔗
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Sometimes we link to other websites or use external services. We can't control what they do with your data, so check out their privacy policies before sharing anything personal. Better safe than sorry! 🛡️
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                10. Kids Under 18 👶
              </h2>
              <p className="text-gray-700 leading-relaxed">
                LocallyTrip.com is for adults only (18+). We don't knowingly collect info from anyone under 18. If you think we accidentally got data from a minor, let us know ASAP and we'll fix it!
              </p>
            </div>

            {/* International Users */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                11. Global Data Transfers 🌍
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your data might travel to different countries for processing. Don't worry - we make sure it's protected wherever it goes, following all the data protection rules. Your info is safe with us globally! ✈️
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                12. When We Update This Policy 📝
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Sometimes we need to update this policy. When we do, we'll post the new version here and update the date at the top. We'll let you know about big changes. Pro tip: check back once in a while! 😉
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                13. Questions? Hit Us Up! 💬
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Got questions about this Privacy Policy or how we handle your data? We're here to help:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@locallytrip.com</p>
                <p><strong>Data Protection Officer:</strong> dpo@locallytrip.com</p>
                <p><strong>Address:</strong> LocallyTrip.com Privacy Department</p>
                <p><strong>Support:</strong> <a href="/contact" className="text-purple-600 hover:text-purple-700 font-medium">Contact Us</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
