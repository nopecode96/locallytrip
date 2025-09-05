'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CookiePolicy() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies (The Must-Haves!) 🔧',
      description: 'These are like the foundation of our website - we literally can\'t turn them off because everything would break!',
      examples: [
        'Keeping you logged in so you don\'t have to sign in every 5 minutes',
        'Remembering what\'s in your cart while you browse around',
        'Security stuff to keep the bad guys out',
        'Making sure the website loads properly for everyone'
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies (The Data Nerds) 📊',
      description: 'These help us understand what you love about our site and what makes you want to leave. It\'s like having a crystal ball!',
      examples: [
        'Google Analytics to see which pages are hits or misses',
        'Tracking how you navigate around (in a non-creepy way)',
        'Checking if our website loads fast enough',
        'Testing different versions to see what works better'
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies (The Matchmakers) 💕',
      description: 'These cookies help us show you travel experiences you\'ll actually want to book instead of random stuff you don\'t care about.',
      examples: [
        'Facebook Pixel so we can show you cool experiences on social media',
        'Google Ads to track if our ads actually work',
        'Retargeting cookies to remind you about that amazing photographer you looked at',
        'Social media cookies for sharing your epic travel moments'
      ]
    },
    {
      id: 'functional',
      title: 'Functional Cookies (The Personal Assistants) 🎯',
      description: 'These cookies remember your preferences so you don\'t have to tell us the same stuff over and over again.',
      examples: [
        'Remembering if you prefer English or another language',
        'Saving your location so we show experiences near you',
        'Chat widget cookies so our support team can help you better',
        'Keeping your settings exactly how you like them'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Cookie Policy 🍪
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            The lowdown on how LocallyTrip.com uses cookies to make your experience awesome! 
          </p>
          <div className="text-sm opacity-90">
            <p>Last Updated: August 13, 2025</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">What Are Cookies? 🤔</h2>
            <p className="text-gray-600 mb-4">
              Okay, so cookies aren't the chocolate chip kind (sorry!). They're tiny text files that websites store on your phone or computer when you visit. Think of them as little digital sticky notes that help websites remember stuff about you! 📝
            </p>
            <p className="text-gray-600">
              LocallyTrip.com uses cookies to make your experience way better - like remembering your login, showing you relevant travel experiences, and helping us understand what features you love most. Pretty neat, right? ✨
            </p>
          </div>

          {/* Cookie Types */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">The Different Types of Cookies We Use 🍪</h2>
            
            <div className="space-y-4">
              {cookieTypes.map((cookie) => (
                <div key={cookie.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleSection(cookie.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">{cookie.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{cookie.description}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        activeSection === cookie.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {activeSection === cookie.id && (
                    <div className="px-6 pb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Examples:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {cookie.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Third-Party Cookies (The Squad) 👥</h2>
            <p className="text-gray-600 mb-4">
              We team up with some other cool companies to make LocallyTrip.com even better. They might also drop some cookies on your device:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Google Services 🔍</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Google Analytics to see what's working</li>
                  <li>• Google Ads to find travelers like you</li>
                  <li>• Google Maps so you don't get lost</li>
                  <li>• reCAPTCHA to keep out the robots</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Social Media 📱</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Facebook Pixel for targeted ads that don't suck</li>
                  <li>• Instagram integration for your epic travel pics</li>
                  <li>• Twitter for sharing your adventures</li>
                  <li>• WhatsApp for quick business chats</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Payment & Communication 💳</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Stripe for super secure payments</li>
                  <li>• PayPal for when you prefer PayPal</li>
                  <li>• Live chat so you can get help instantly</li>
                  <li>• Email tools to send you cool travel inspo</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Performance 🚀</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• CDN to make our site load super fast</li>
                  <li>• Error tracking to fix bugs before they annoy you</li>
                  <li>• A/B testing to see what works better</li>
                  <li>• Performance monitoring to keep things smooth</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cookie Management */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Taking Control of Your Cookies 🎛️</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Browser Settings (The DIY Approach)</h3>
                <p className="text-gray-600 mb-3">
                  Want to manage cookies yourself? You can totally do that through your browser! Here's where to find the controls:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Chrome 🟢</h4>
                    <p className="text-sm text-gray-600">Settings → Privacy and Security → Cookies and other site data</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Firefox 🦊</h4>
                    <p className="text-sm text-gray-600">Options → Privacy & Security → Cookies and Site Data</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Safari 🧭</h4>
                    <p className="text-sm text-gray-600">Preferences → Privacy → Manage Website Data</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Edge ⚡</h4>
                    <p className="text-sm text-gray-600">Settings → Site permissions → Cookies and site data</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Our Cookie Consent Popup (The Easy Way)</h3>
                <p className="text-gray-600 mb-3">
                  Remember that popup that appeared when you first visited? You can use that to control your cookie preferences easily:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Accept all cookies for the full LocallyTrip.com experience</li>
                  <li>Accept only essential cookies (the bare minimum)</li>
                  <li>Pick and choose which types you want</li>
                  <li>Change your mind anytime by clicking the cookie icon 🍪</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How Long Do Cookies Stick Around? ⏰</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Session Cookies (The Short-Lived Ones) 💨</h3>
                <p className="text-gray-600">
                  These cookies are like Snapchat stories - they disappear when you close your browser! They're super important for basic stuff to work properly.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Persistent Cookies (The Clingy Ones) 🤗</h3>
                <p className="text-gray-600">
                  These cookies hang around on your device until they expire or you manually delete them. They can last anywhere from 30 days to 2 years, depending on what they do.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-yellow-800">
                <strong>Quick heads up:</strong> Some features might get a bit wonky if you disable certain cookies. Essential cookies are like the foundation of our website - we literally can't turn them off or everything breaks! 🏗️
              </p>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cookie Rights (You're the Boss!) 👑</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Right to Know Everything 🤓</h3>
                  <p className="text-gray-600">You deserve to know exactly what cookies we use and why we use them - no secrets!</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Right to Take Control 🎮</h3>
                  <p className="text-gray-600">You can accept all, reject some, or customize exactly which cookies you want. It's your choice!</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Right to Change Your Mind 🔄</h3>
                  <p className="text-gray-600">Said yes to cookies but now want to say no? No problem - you can change your preferences anytime!</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Right to Complain 📢</h3>
                  <p className="text-gray-600">If we're not doing something right, you can file a complaint with data protection authorities. We hope it never comes to that though!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Questions About Cookies? We Got Answers! 🙋‍♀️</h2>
            <p className="mb-6">
              Confused about our cookie policy or want to exercise your rights? Hit us up - we're here to help and we actually respond!
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Contact Our Team</h3>
                <ul className="space-y-2">
                  <li>📧 Email: privacy@locallytrip.com</li>
                  <li>📞 Phone: +62 811-1234-5678</li>
                  <li>📍 Address: Jakarta, Indonesia</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy-policy" className="text-white hover:text-yellow-200 underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions" className="text-white hover:text-yellow-200 underline">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-white hover:text-yellow-200 underline">
                      Contact Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Updates Notice */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">When We Update This Policy 📝</h2>
            <p className="text-gray-600 mb-4">
              Just like how apps get updates, we might need to update this cookie policy sometimes. Maybe we'll add new features, change how we do things, or there might be new laws to follow.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-blue-800">
                <strong>We'll let you know:</strong> If we make any big changes, we'll post the updated policy right here and change the "Last Updated" date at the top. We recommend checking back once in a while - or just bookmark this page! 🔖
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
