import React from 'react';
import { ImageService } from '@/services/imageService';

const BusinessCollaborationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative py-20 flex items-center justify-center min-h-[50vh]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${ImageService.getImageUrl('banners/europe.png')}')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Business Collaboration</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Join LocallyTrip.com's business ecosystem and grow your business with us
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Partnership Opportunities */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Partnership Opportunities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tour Operator Partnership</h3>
              <p className="text-gray-600">
                Strategic partnerships with local tour operators to provide authentic and high-quality experiences to travelers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-green-600 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 6a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Hotel & Accommodation</h3>
              <p className="text-gray-600">
                Partnership network with hotels, homestays, and unique accommodations to provide memorable stay experiences.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-purple-600 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Business Integration</h3>
              <p className="text-gray-600">
                Integration with local businesses such as restaurants, souvenir shops, and transportation services for a complete ecosystem.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-orange-600 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Technology Partnership</h3>
              <p className="text-gray-600">
                Technology partnerships for platform development, payment system integration, and innovative digital solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Partnership Benefits</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">💰</span>
                </div>
                <h3 className="font-semibold mb-2">Revenue Sharing</h3>
                <p className="text-sm text-gray-600">Fair and transparent revenue sharing system for all partners</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">📈</span>
                </div>
                <h3 className="font-semibold mb-2">Market Expansion</h3>
                <p className="text-sm text-gray-600">Access to wider traveler markets through our platform</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">🤝</span>
                </div>
                <h3 className="font-semibold mb-2">Mutual Support</h3>
                <p className="text-sm text-gray-600">Marketing, training, and operational support from expert team</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Interested in Partnership?</h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Tour Operator</option>
                    <option>Hotel/Accommodation</option>
                    <option>Restaurant/F&B</option>
                    <option>Transportation</option>
                    <option>Technology</option>
                    <option>Others</option>
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Proposal Description</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Tell us about your business and how we can collaborate..."></textarea>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Submit Partnership Proposal
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BusinessCollaborationPage;
