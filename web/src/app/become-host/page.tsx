import React from 'react';
import { Metadata } from 'next';
import { ImageService } from '@/services/imageService';

export const metadata: Metadata = {
  title: 'Become a Host - LocallyTrip.com',
  description: 'Share your passion and earn as a local host. Join LocallyTrip.com to connect with travelers and showcase your city through photography, tours, or trip planning.',
  keywords: 'become host, local host, travel guide, photographer, trip planner, earn money, LocallyTrip host',
};

const BecomeHostPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero Section */}
      <section className="pt-0 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <section 
            className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 h-[380px] md:h-[440px] lg:h-[500px] flex py-12 items-center justify-center text-white rounded-3xl mb-12 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl"></div>
            <div className="relative z-10 text-center px-6 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
                Share Your Passion. Earn as a Host. ✨
              </h1>
              <p className="text-sm md:text-base text-white/90 drop-shadow-md">
                Love your city? Know secret spots or love meeting people? Whether you're a photographer 📸, a guide 🧭, or just full of tips — turn your knowledge into income and create amazing moments for travelers. 🌟
              </p>
            </div>
          </section>
        </div>
      </section>

      {/* Who Can Become a Host */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Who Can Become a Host? 🚀
          </h2>
          <p className="text-gray-700 text-lg">
            LocallyTrip.com empowers locals from all walks of life to share their passion and earn through meaningful travel experiences. 💫
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Local Student */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 p-6 text-center border-2 border-purple-100">
            <img 
              src={ImageService.getImageUrl("become/student.png")}
              alt="Student Host" 
              className="w-full h-48 object-cover rounded-2xl mb-4 border-2 border-purple-200"
            />
            <h3 className="text-xl font-bold text-purple-600 mb-2">Local Student 🎓</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Students know the pulse of the city — from secret cafes to weekend markets. Perfect for young travelers seeking vibrant local vibes. ☕📚
            </p>
          </div>

          {/* Online Taxi Driver */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 p-6 text-center border-2 border-blue-100">
            <img 
              src={ImageService.getImageUrl("become/driver.png")}
              alt="Driver Host" 
              className="w-full h-48 object-cover rounded-2xl mb-4 border-2 border-blue-200"
            />
            <h3 className="text-xl font-bold text-blue-600 mb-2">Online Driver 🚗</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Drivers know every street and story. From hidden shortcuts to local legends, they're your gateway to authentic city exploration. 🗺️✨
            </p>
          </div>

          {/* Digital Nomad */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 p-6 text-center border-2 border-green-100">
            <img 
              src={ImageService.getImageUrl("become/digital-nomad.png")}
              alt="Digital Nomad Host" 
              className="w-full h-48 object-cover rounded-2xl mb-4 border-2 border-green-200"
            />
            <h3 className="text-xl font-bold text-green-600 mb-2">Digital Nomad 💻</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Remote workers with local insights. Perfect for showcasing work-friendly cafes, co-working spaces, and productivity spots. 🌐📍
            </p>
          </div>

          {/* Trip Planner */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 p-6 text-center border-2 border-orange-100">
            <img 
              src={ImageService.getImageUrl("become/trip-planner.png")}
              alt="Trip Planner Host" 
              className="w-full h-48 object-cover rounded-2xl mb-4 border-2 border-orange-200"
            />
            <h3 className="text-xl font-bold text-orange-600 mb-2">Trip Planner 🗓️</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Organizational masters who create perfect itineraries. From logistics to hidden gems, they design unforgettable journeys. ✈️📋
            </p>
          </div>

          {/* Local Guide */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 p-6 text-center border-2 border-pink-100">
            <img 
              src={ImageService.getImageUrl("become/local.png")}
              alt="Local Guide Host" 
              className="w-full h-48 object-cover rounded-2xl mb-4 border-2 border-pink-200"
            />
            <h3 className="text-xl font-bold text-pink-600 mb-2">Local Guide 🏛️</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Born and raised locals with deep cultural knowledge. Share heritage, traditions, and stories that only insiders know. 🏺📖
            </p>
          </div>

          {/* Photographer */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 p-6 text-center border-2 border-indigo-100">
            <img 
              src={ImageService.getImageUrl("become/photographer.png")}
              alt="Photographer Host" 
              className="w-full h-48 object-cover rounded-2xl mb-4 border-2 border-indigo-200"
            />
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Photographer 📸</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Capture moments with a local photographer who knows scenic spots, perfect lighting, and the art of storytelling through pictures. ✨📷
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action: Become a Host */}
      <section className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white py-16 mt-12 mx-4 md:mx-6 rounded-3xl shadow-2xl">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
            Ready to Share Your World? 🌍
          </h2>
          <p className="text-lg mb-8 text-white/90 leading-relaxed">
            Whether you're a local expert, storyteller, or just love meeting travelers, LocallyTrip.com is your platform to connect, earn, and inspire. Start hosting today and make a difference in someone's journey! ✨
          </p>
          <a 
            href="/register" 
            className="inline-block bg-white text-purple-600 font-bold px-8 py-4 rounded-full shadow-2xl hover:bg-yellow-300 hover:text-purple-700 hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 text-lg"
          >
            Join as a Host 🚀
          </a>
          <div className="mt-8 flex justify-center space-x-4">
            <span className="text-2xl animate-bounce">💼</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.1s'}}>💰</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>🤝</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.3s'}}>🎉</span>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 py-16 mt-12 mx-4 md:mx-6 rounded-3xl border-2 border-pink-200">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Host Spotlight: A Journey from Hobby to Income ⭐
          </h2>
          <div className="relative inline-block mb-6">
            <img 
              src={ImageService.getImageUrl("hosts/host6.jpg")}
              alt="Success Host" 
              className="w-32 h-32 mx-auto rounded-full object-cover shadow-2xl border-4 border-pink-300"
            />
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg animate-pulse">
              ⭐
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-pink-100">
            <p className="text-gray-700 text-lg mb-6 leading-relaxed italic">
              "Meet Lina, a university student in Yogyakarta who started offering weekend photo walks in her neighborhood. What began as a fun side project turned into a thriving income stream, thanks to LocallyTrip.com. Today, she's hosted travelers from 12+ countries and even started her own photography blog inspired by their stories. 📸✨"
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-2xl">
              <p className="text-sm text-purple-700 font-medium">
                💬 "I never imagined I could meet so many amazing people and earn by simply sharing what I love." – Lina, Local Host & Photographer 🌟
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center mt-8 gap-8 text-center">
            <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-purple-100">
              <div className="text-2xl font-bold text-purple-600">150+</div>
              <div className="text-sm text-gray-600">Active Hosts</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-pink-100">
              <div className="text-2xl font-bold text-pink-600">$500+</div>
              <div className="text-sm text-gray-600">Avg Monthly Earnings</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-orange-100">
              <div className="text-2xl font-bold text-orange-600">25+</div>
              <div className="text-sm text-gray-600">Cities Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Why Host with LocallyTrip.com? 💎
          </h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl shadow-lg border-2 border-purple-100 text-center">
            <div className="text-4xl mb-4 animate-bounce">💰</div>
            <h3 className="text-xl font-bold text-purple-600 mb-2">Flexible Earnings</h3>
            <p className="text-gray-600 text-sm">Set your own prices and schedule. Earn money doing what you love, when you want.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-3xl shadow-lg border-2 border-green-100 text-center">
            <div className="text-4xl mb-4 animate-bounce" style={{animationDelay: '0.1s'}}>🌍</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Meet Global Travelers</h3>
            <p className="text-gray-600 text-sm">Connect with amazing people from around the world and share cultural experiences.</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-3xl shadow-lg border-2 border-yellow-100 text-center">
            <div className="text-4xl mb-4 animate-bounce" style={{animationDelay: '0.2s'}}>🛡️</div>
            <h3 className="text-xl font-bold text-yellow-600 mb-2">Safe & Secure</h3>
            <p className="text-gray-600 text-sm">Verified travelers, secure payments, and 24/7 support for peace of mind.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BecomeHostPage;
