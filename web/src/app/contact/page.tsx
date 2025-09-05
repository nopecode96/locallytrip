'use client';

import React, { useState } from 'react';

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: '',
        priority: 'normal'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Need Help? We Got You 💬
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Hit us up anytime! Our team is here to help with anything LocallyTrip.com related 🚀
          </p>
          <div className="text-sm text-white/80">
            Quick responses, real humans, zero robots 🤖❌
          </div>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Choose Your Way to Reach Us �
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pick whatever works best for you — we're flexible like that
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Slide into our DMs</h3>
              <p className="text-blue-600 text-sm mb-4">Get instant help — we're always online and ready to chat</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">Call Us</h3>
              <p className="text-green-600 text-sm mb-4">Talk to a real human who actually knows their stuff</p>
              <a href="tel:+15551234567" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors inline-block">
                +1 (555) 123-4567
              </a>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Email Us</h3>
              <p className="text-orange-600 text-sm mb-4">Send us the deets if it's something complex</p>
              <a href="mailto:support@locallytrip.com" className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors inline-block">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Drop Us a Message 📝
                </h2>
                
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <div className="text-green-500 mr-2">✅</div>
                      <p className="text-green-700 font-medium">Message sent! We'll hit you back soon ✨</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <div className="text-red-500 mr-2">❌</div>
                      <p className="text-red-700 font-medium">Oops! Something went wrong. Try again?</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                        placeholder="What should we call you?"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                        placeholder="your.email@gmail.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                      >
                        <option value="">Select a category</option>
                        <option value="booking">Booking Support</option>
                        <option value="payment">Payment Issues</option>
                        <option value="technical">Technical Problems</option>
                        <option value="host">Host Questions</option>
                        <option value="safety">Safety Concerns</option>
                        <option value="general">General Inquiry</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      How Urgent? 🚨
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                    >
                      <option value="low">Chill - Just wondering something</option>
                      <option value="normal">Normal - Regular help needed</option>
                      <option value="high">Urgent - Need help ASAP</option>
                      <option value="critical">SOS - It's an emergency!</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                      placeholder="Spill the tea! What do you need help with? The more details, the better we can help you out..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'Sending...' : 'Send It! 🚀'}
                  </button>
                </form>
              </div>

              {/* Contact Information & FAQ */}
              <div className="space-y-8">
                
                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    More Ways to Connect �
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">🏢</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Headquarters</h3>
                        <p className="text-gray-600">
                          LocallyTrip.com Inc.<br/>
                          123 Travel Street, Suite 456<br/>
                          San Francisco, CA 94102<br/>
                          United States
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">📞</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Phone Support</h3>
                        <p className="text-gray-600">
                          General: +1 (555) 123-4567<br/>
                          Emergency: +1 (555) 911-SAFE<br/>
                          Available 24/7
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">📧</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Email Support</h3>
                        <p className="text-gray-600">
                          General: support@locallytrip.com<br/>
                          Safety: safety@locallytrip.com<br/>
                          Privacy: privacy@locallytrip.com<br/>
                          Business: business@locallytrip.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">⚡</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">How Fast We Reply</h3>
                        <p className="text-gray-600">
                          Live Chat: Instantly ⚡<br/>
                          Phone: Right away 📞<br/>
                          Email: Within 24 hours 📧<br/>
                          Complex stuff: 2-3 days max 🔧
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Find Us Online 🌐
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <a href="#" className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="text-blue-600 text-xl">📘</div>
                      <span className="text-blue-700 font-medium">Facebook</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="text-blue-600 text-xl">🐦</div>
                      <span className="text-blue-700 font-medium">Twitter</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                      <div className="text-pink-600 text-xl">📷</div>
                      <span className="text-pink-700 font-medium">Instagram</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="text-blue-600 text-xl">💼</div>
                      <span className="text-blue-700 font-medium">LinkedIn</span>
                    </a>
                  </div>
                </div>

                {/* Quick Help */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Need Quick Answers? �
                  </h2>
                  
                  <div className="space-y-3">
                    <a href="/help" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <div className="font-medium text-purple-700">📚 Help Center</div>
                      <div className="text-sm text-purple-600">All the answers you need</div>
                    </a>
                    <a href="/safety" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="font-medium text-green-700">🛡️ Safety Info</div>
                      <div className="text-sm text-green-600">How we keep you safe</div>
                    </a>
                    <a href="/cancellation-policy" className="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                      <div className="font-medium text-orange-700">📋 Cancellation Policy</div>
                      <div className="text-sm text-orange-600">What happens if plans change</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
              Where to Find Us 🏢
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-4 h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">🗺️</div>
                <p>Interactive map coming soon!</p>
                <p className="text-sm">123 Travel Street, San Francisco, CA 94102</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
