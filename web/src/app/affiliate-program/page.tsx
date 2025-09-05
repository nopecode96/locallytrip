import React from 'react';
import { ImageService } from '@/services/imageService';

const AffiliateProgramPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${ImageService.getImageUrl('banners/europe.png')}')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Affiliate Program</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Earn money by becoming a LocallyTrip.com affiliate and promote the best travel experiences!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Program Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">About Our Affiliate Program</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-lg text-gray-700 mb-6 text-center">
              LocallyTrip.com Affiliate Program is a golden opportunity for content creators, travel bloggers, influencers, 
              and anyone passionate about travel to earn income by promoting authentic travel experiences in Southeast Asia.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Commission Target</h3>
                <p className="text-blue-600 font-bold text-2xl">5-15%</p>
                <p className="text-sm text-gray-600">Per successful transaction</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⏰</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Payment</h3>
                <p className="text-green-600 font-bold text-2xl">Monthly</p>
                <p className="text-sm text-gray-600">Every 15th of the month</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔗</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tracking</h3>
                <p className="text-purple-600 font-bold text-2xl">Real-time</p>
                <p className="text-sm text-gray-600">Complete dashboard</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How The Program Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Sign Up Free</h3>
              <p className="text-sm text-gray-600">Fill out the registration form and wait for approval from our team</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Get Your Link</h3>
              <p className="text-sm text-gray-600">Access dashboard and get your unique affiliate link</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Share & Promote</h3>
              <p className="text-sm text-gray-600">Share your link on social media, blog, or your website</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold mb-2">Earn Money</h3>
              <p className="text-sm text-gray-600">Get commission from every successful booking through your link</p>
            </div>
          </div>
        </section>

        {/* Commission Structure */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Commission Structure</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Percentage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance Bonus</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tour Guide</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+2% (&gt;10 bookings/month)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Photography</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+3% (&gt;8 bookings/month)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Trip Planner</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+3% (&gt;12 bookings/month)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Combo (Tour Guide + Photography)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+5% (&gt;5 bookings/month)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Terms & Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-green-600 mb-4">✅ What's Required</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Active website/blog or social media with min. 1K followers
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Quality content relevant to travel/lifestyle
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Good engagement rate with your audience
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Commitment to promote the brand positively
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Valid bank account for commission transfers
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-red-600 mb-4">❌ What's Not Allowed</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Spam or excessive promotion on social media
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Using paid ads without written approval
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Misleading content or inaccurate information
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Using LocallyTrip trademark without permission
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Self-booking to earn commission
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Join Now!</h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Platform</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Instagram</option>
                    <option>YouTube</option>
                    <option>TikTok</option>
                    <option>Blog/Website</option>
                    <option>Facebook</option>
                    <option>Twitter</option>
                    <option>Others</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Media/Website URL</label>
                <input type="url" placeholder="https://" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Followers/Monthly Visitors</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>1K - 5K</option>
                  <option>5K - 10K</option>
                  <option>10K - 50K</option>
                  <option>50K - 100K</option>
                  <option>100K+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tell us about your Content Strategy</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="How do you plan to promote LocallyTrip on your platform?"></textarea>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">
                  I agree to the <a href="/terms-conditions" className="text-blue-600 hover:underline">terms and conditions</a> of the affiliate program
                </label>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Join Affiliate Program
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AffiliateProgramPage;
