import React from 'react';
import { ImageService } from '@/services/imageService';

const BisnisKolaboratifPage: React.FC = () => {
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
            <h1 className="text-5xl font-bold mb-4">Bisnis Kolaboratif</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Bergabunglah dengan ekosistem bisnis travel LocallyTrip.com dan kembangkan bisnis Anda bersama kami
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Partnership Opportunities */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Peluang Kemitraan</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tour Operator Partnership</h3>
              <p className="text-gray-600">
                Kemitraan strategis dengan tour operator lokal untuk menyediakan pengalaman autentik dan berkualitas tinggi kepada traveler.
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
                Jaringan kemitraan dengan hotel, homestay, dan akomodasi unik untuk memberikan pengalaman menginap yang berkesan.
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
                Integrasi dengan bisnis lokal seperti restoran, toko souvenir, dan layanan transportasi untuk ekosistem yang lengkap.
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
                Kemitraan teknologi untuk pengembangan platform, integrasi sistem pembayaran, dan solusi digital inovatif.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Keuntungan Bermitra</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">💰</span>
                </div>
                <h3 className="font-semibold mb-2">Revenue Sharing</h3>
                <p className="text-sm text-gray-600">Sistem bagi hasil yang adil dan transparan untuk semua mitra</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">📈</span>
                </div>
                <h3 className="font-semibold mb-2">Market Expansion</h3>
                <p className="text-sm text-gray-600">Akses ke pasar traveler yang lebih luas melalui platform kami</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">🤝</span>
                </div>
                <h3 className="font-semibold mb-2">Mutual Support</h3>
                <p className="text-sm text-gray-600">Dukungan marketing, training, dan operasional dari tim ahli</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Tertarik Bermitra?</h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Perusahaan</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Bisnis</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Tour Operator</option>
                    <option>Hotel/Akomodasi</option>
                    <option>Restoran/F&B</option>
                    <option>Transportasi</option>
                    <option>Teknologi</option>
                    <option>Lainnya</option>
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                  <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Proposal Kemitraan</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ceritakan tentang bisnis Anda dan bagaimana kita bisa berkolaborasi..."></textarea>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Kirim Proposal Kemitraan
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BisnisKolaboratifPage;
