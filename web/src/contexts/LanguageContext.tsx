'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation data
const translations = {
  // Cover Slide
  'cover.title': {
    en: 'LocallyTrip.com',
    id: 'LocallyTrip.com'
  },
  'cover.tagline': {
    en: 'Authentic Indonesia Through Local Eyes',
    id: 'Indonesia Autentik Melalui Mata Lokal'
  },
  'cover.subtitle': {
    en: 'Connecting International Travelers with Indonesian Local Experts',
    id: 'Menghubungkan Wisatawan Mancanegara dengan Para Ahli Lokal Indonesia'
  },
  'cover.market_size': {
    en: 'Indonesia Tourism Market',
    id: 'Pasar Pariwisata Indonesia'
  },
  'cover.visitors': {
    en: 'International Visitors',
    id: 'Wisatawan Mancanegara'
  },
  'cover.expert_categories': {
    en: 'Expert Categories',
    id: 'Kategori Ahli'
  },
  
  // Problem Slide
  'problem.title': {
    en: 'The Problem We Solve',
    id: 'Masalah yang Kami Selesaikan'
  },
  'problem.travelers': {
    en: 'International travelers struggle to find authentic Indonesian experiences',
    id: 'Wisatawan mancanegara kesulitan menemukan pengalaman Indonesia yang autentik'
  },
  'problem.generic': {
    en: 'Most tourism packages are generic, not personalized',
    id: 'Sebagian besar paket wisata bersifat umum, tidak personal'
  },
  'problem.experts': {
    en: 'Local experts (tour guides, photographers, trip planners) have limited access to international market',
    id: 'Para ahli lokal (pemandu wisata, fotografer, perencana perjalanan) memiliki akses terbatas ke pasar internasional'
  },
  'problem.barrier': {
    en: 'Language barrier between international travelers and local service providers',
    id: 'Hambatan bahasa antara wisatawan internasional dan penyedia layanan lokal'
  },

  // Solution Slide
  'solution.title': {
    en: 'Our Solution: Verified Local Expert Marketplace',
    id: 'Solusi Kami: Marketplace Ahli Lokal Terverifikasi'
  },
  'solution.description': {
    en: 'Digital platform connecting international travelers with 3 categories of Indonesian experts:',
    id: 'Platform digital yang menghubungkan wisatawan internasional dengan 3 kategori ahli Indonesia:'
  },
  'solution.guides': {
    en: 'Local Tour Guides: Authentic storytelling & hidden gems discovery',
    id: 'Pemandu Wisata Lokal: Bercerita autentik & menemukan permata tersembunyi'
  },
  'solution.photographers': {
    en: 'Local Photographers: Professional travel photography services',
    id: 'Fotografer Lokal: Layanan fotografi perjalanan profesional'
  },
  'solution.planners': {
    en: 'Trip Planners: Customized itinerary planning with local insights',
    id: 'Perencana Perjalanan: Perencanaan itinerary yang disesuaikan dengan wawasan lokal'
  },

  // Navigation
  'nav.previous': {
    en: 'Previous Slide',
    id: 'Slide Sebelumnya'
  },
  'nav.next': {
    en: 'Next Slide',
    id: 'Slide Selanjutnya'
  },
  'nav.fullscreen': {
    en: 'Toggle Fullscreen',
    id: 'Toggle Layar Penuh'
  },
  'nav.keyboard_hint': {
    en: 'Press ← → or Space to navigate • F for fullscreen',
    id: 'Tekan ← → atau Spasi untuk navigasi • F untuk layar penuh'
  },

  // Market Opportunity
  'market.title': {
    en: 'Market Opportunity',
    id: 'Peluang Pasar'
  },
  'market.total_market': {
    en: 'Total Market: Indonesia tourism industry $19B annually',
    id: 'Total Pasar: Industri pariwisata Indonesia $19M per tahun'
  },
  'market.target_segment': {
    en: 'Target Segment: Authentic experiences & local services $500M+',
    id: 'Segmen Target: Pengalaman autentik & layanan lokal $500M+'
  },
  'market.visitors': {
    en: 'International Visitors: 16M+ pre-pandemic, recovering to 20M+ by 2025',
    id: 'Pengunjung Internasional: 16M+ pra-pandemi, pulih ke 20M+ pada 2025'
  },
  'market.spend': {
    en: 'Average Spend: $1,200-1,800 per trip, 20-30% on experiences/activities',
    id: 'Rata-rata Pengeluaran: $1,200-1,800 per perjalanan, 20-30% untuk pengalaman/aktivitas'
  },

  // Market Research & Validation (TractionSlide)
  'traction.title': {
    en: 'Market Research & Validation',
    id: 'Riset Pasar & Validasi'
  },
  'traction.subtitle': {
    en: 'Comprehensive market research and user validation supporting our development strategy',
    id: 'Riset pasar komprehensif dan validasi pengguna yang mendukung strategi pengembangan kami'
  },
  'traction.market_size': {
    en: 'Indonesia Tourism Market',
    id: 'Pasar Pariwisata Indonesia'
  },
  'traction.sam_desc': {
    en: 'Serviceable Addressable Market',
    id: 'Pasar yang Dapat Dilayani'
  },
  'traction.authentic_demand': {
    en: 'Seek Authentic Experiences',
    id: 'Mencari Pengalaman Autentik'
  },
  'traction.survey_desc': {
    en: 'International travelers survey',
    id: 'Survey wisatawan internasional'
  },
  'traction.willing_premium': {
    en: 'Willing to Pay Premium',
    id: 'Bersedia Bayar Premium'
  },
  'traction.premium_desc': {
    en: 'For local expert guidance',
    id: 'Untuk panduan ahli lokal'
  },
  'traction.locals_interested': {
    en: 'Locals Interested',
    id: 'Warga Lokal Tertarik'
  },
  'traction.hosting_desc': {
    en: 'In hosting travelers',
    id: 'Untuk menjamu wisatawan'
  },
  'traction.user_interviews': {
    en: 'User Interviews',
    id: 'Wawancara Pengguna'
  },
  'traction.interviews_desc': {
    en: 'Across target segments',
    id: 'Lintas segmen target'
  },
  'traction.focus_groups': {
    en: 'Focus Groups',
    id: 'Kelompok Fokus'
  },
  'traction.focus_desc': {
    en: 'Target cities research',
    id: 'Riset kota target'
  },
  'traction.research_duration': {
    en: 'Market Research',
    id: 'Riset Pasar'
  },
  'traction.research_desc': {
    en: 'Comprehensive analysis',
    id: 'Analisis komprehensif'
  },
  'traction.findings_title': {
    en: 'Key Research Findings',
    id: 'Temuan Riset Utama'
  },
  'traction.demand_title': {
    en: 'Market Demand',
    id: 'Permintaan Pasar'
  },
  'traction.demand_1': {
    en: '89% of international visitors want authentic local experiences',
    id: '89% wisatawan internasional menginginkan pengalaman lokal yang autentik'
  },
  'traction.demand_2': {
    en: 'Average willing spend: $150-200 per experience',
    id: 'Rata-rata kesediaan bayar: $150-200 per pengalaman'
  },
  'traction.demand_3': {
    en: '76% prefer local guides over traditional tours',
    id: '76% lebih suka pemandu lokal daripada tur tradisional'
  },
  'traction.demand_4': {
    en: 'Growing dissatisfaction with generic tourism offerings',
    id: 'Meningkatnya ketidakpuasan terhadap penawaran wisata generik'
  },
  'traction.supply_title': {
    en: 'Supply Interest',
    id: 'Minat Penawaran'
  },
  'traction.supply_1': {
    en: '85% of locals interested in hosting travelers',
    id: '85% warga lokal tertarik menjamu wisatawan'
  },
  'traction.supply_2': {
    en: 'Potential to earn Rp 2-5M monthly as local expert',
    id: 'Potensi penghasilan Rp 2-5M per bulan sebagai ahli lokal'
  },
  'traction.supply_3': {
    en: 'Strong cultural pride drives participation motivation',
    id: 'Kebanggan budaya yang kuat mendorong motivasi partisipasi'
  },
  'traction.supply_4': {
    en: 'Existing informal networks ready to be formalized',
    id: 'Jaringan informal yang ada siap diformalkan'
  },
  'traction.competitive_title': {
    en: 'Competitive Landscape Analysis',
    id: 'Analisis Lanskap Kompetitif'
  },
  'traction.traditional_tours': {
    en: 'Traditional Tours',
    id: 'Tur Tradisional'
  },
  'traction.traditional_1': {
    en: 'Generic experiences',
    id: 'Pengalaman generik'
  },
  'traction.traditional_2': {
    en: 'Limited local interaction',
    id: 'Interaksi lokal terbatas'
  },
  'traction.traditional_3': {
    en: 'High prices, low value',
    id: 'Harga tinggi, nilai rendah'
  },
  'traction.online_platforms': {
    en: 'Online Platforms',
    id: 'Platform Online'
  },
  'traction.online_1': {
    en: 'Focus on accommodation',
    id: 'Fokus pada akomodasi'
  },
  'traction.online_2': {
    en: 'Limited experience curation',
    id: 'Kurasi pengalaman terbatas'
  },
  'traction.online_3': {
    en: 'No local expert matching',
    id: 'Tanpa pencocokan ahli lokal'
  },
  'traction.locallytrip_1': {
    en: 'Authentic local experiences',
    id: 'Pengalaman lokal autentik'
  },
  'traction.locallytrip_2': {
    en: 'Expert-guided adventures',
    id: 'Petualangan dipandu ahli'
  },
  'traction.locallytrip_3': {
    en: 'Cultural immersion focus',
    id: 'Fokus imersi budaya'
  },
  'traction.gap_identified': {
    en: 'Clear market gap identified with validated demand',
    id: 'Celah pasar yang jelas teridentifikasi dengan permintaan yang tervalidasi'
  },

  // Scalability Slide
  'scalability.title': {
    en: 'Scalability & Growth Strategy',
    id: 'Strategi Skalabilitas & Pertumbuhan'
  },
  'scalability.subtitle': {
    en: 'Three-phase approach to scale across Indonesian tourism market',
    id: 'Pendekatan tiga fase untuk berkembang di pasar pariwisata Indonesia'
  },
  'scalability.phase1.title': {
    en: 'Foundation Phase',
    id: 'Fase Fondasi'
  },
  'scalability.phase1.timeline': {
    en: '2026 - Launch Year',
    id: '2026 - Tahun Peluncuran'
  },
  'scalability.phase1.focus1.title': {
    en: 'Core City Launch',
    id: 'Peluncuran Kota Inti'
  },
  'scalability.phase1.focus1.desc': {
    en: 'Jakarta, Bali, Yogyakarta - proven tourism destinations',
    id: 'Jakarta, Bali, Yogyakarta - destinasi wisata terbukti'
  },
  'scalability.phase1.focus2.title': {
    en: 'Expert Onboarding',
    id: 'Onboarding Ahli'
  },
  'scalability.phase1.focus2.desc': {
    en: '500+ verified local experts across 3 categories',
    id: '500+ ahli lokal terverifikasi di 3 kategori'
  },
  'scalability.phase1.focus3.title': {
    en: 'Platform Optimization',
    id: 'Optimisasi Platform'
  },
  'scalability.phase1.focus3.desc': {
    en: 'User experience refinement & payment integration',
    id: 'Penyempurnaan pengalaman pengguna & integrasi pembayaran'
  },
  'scalability.phase1.targets': {
    en: 'Phase 1 Targets',
    id: 'Target Fase 1'
  },
  'scalability.phase1.target_experts': {
    en: 'Local Experts',
    id: 'Ahli Lokal'
  },
  'scalability.phase1.target_cities': {
    en: 'Core Cities',
    id: 'Kota Inti'
  },
  'scalability.phase1.target': {
    en: 'Target: 2K travelers, 500 experts',
    id: 'Target: 2K wisatawan, 500 ahli'
  },
  'scalability.phase2.title': {
    en: 'Expansion Phase',
    id: 'Fase Ekspansi'
  },
  'scalability.phase2.timeline': {
    en: '2027 - National Coverage',
    id: '2027 - Cakupan Nasional'
  },
  'scalability.phase2.focus1.title': {
    en: 'Geographic Expansion',
    id: 'Ekspansi Geografis'
  },
  'scalability.phase2.focus1.desc': {
    en: '10 major cities: Bandung, Surabaya, Medan, Makassar',
    id: '10 kota besar: Bandung, Surabaya, Medan, Makassar'
  },
  'scalability.phase2.focus2.title': {
    en: 'Partnership Network',
    id: 'Jaringan Kemitraan'
  },
  'scalability.phase2.focus2.desc': {
    en: 'Tourism boards, hotels, airlines for customer acquisition',
    id: 'Dinas pariwisata, hotel, maskapai untuk akuisisi pelanggan'
  },
  'scalability.phase2.focus3.title': {
    en: 'Service Diversification',
    id: 'Diversifikasi Layanan'
  },
  'scalability.phase2.focus3.desc': {
    en: 'Group tours, corporate retreats, educational programs',
    id: 'Tur grup, retreat perusahaan, program pendidikan'
  },
  'scalability.phase2.targets': {
    en: 'Phase 2 Targets',
    id: 'Target Fase 2'
  },
  'scalability.phase2.target_experts': {
    en: 'Local Experts',
    id: 'Ahli Lokal'
  },
  'scalability.phase2.target_cities': {
    en: 'Major Cities',
    id: 'Kota Besar'
  },
  'scalability.phase2.target': {
    en: 'Target: 15K travelers, 1.5K experts',
    id: 'Target: 15K wisatawan, 1.5K ahli'
  },
  'scalability.phase3.title': {
    en: 'Maturity Phase',
    id: 'Fase Kematangan'
  },
  'scalability.phase3.timeline': {
    en: '2028 - Market Leadership',
    id: '2028 - Kepemimpinan Pasar'
  },
  'scalability.phase3.focus1.title': {
    en: 'Market Domination',
    id: 'Dominasi Pasar'
  },
  'scalability.phase3.focus1.desc': {
    en: '25+ cities nationwide, rural tourism integration',
    id: '25+ kota nasional, integrasi wisata pedesaan'
  },
  'scalability.phase3.focus2.title': {
    en: 'Technology Innovation',
    id: 'Inovasi Teknologi'
  },
  'scalability.phase3.focus2.desc': {
    en: 'AI matching, mobile app, AR/VR experiences',
    id: 'Pencocokan AI, aplikasi mobile, pengalaman AR/VR'
  },
  'scalability.phase3.focus3.title': {
    en: 'International Expansion',
    id: 'Ekspansi Internasional'
  },
  'scalability.phase3.focus3.desc': {
    en: 'Southeast Asia markets: Thailand, Malaysia, Vietnam',
    id: 'Pasar Asia Tenggara: Thailand, Malaysia, Vietnam'
  },
  'scalability.phase3.targets': {
    en: 'Phase 3 Targets',
    id: 'Target Fase 3'
  },
  'scalability.phase3.target_experts': {
    en: 'Local Experts',
    id: 'Ahli Lokal'
  },
  'scalability.phase3.target_cities': {
    en: 'National Cities',
    id: 'Kota Nasional'
  },
  'scalability.phase3.target': {
    en: 'Target: 50K travelers, 3K experts',
    id: 'Target: 50K wisatawan, 3K ahli'
  },
  'scalability.metrics_title': {
    en: 'Key Success Metrics',
    id: 'Metrik Kesuksesan Utama'
  },
  'scalability.market_penetration': {
    en: 'Market Penetration',
    id: 'Penetrasi Pasar'
  },
  'scalability.penetration_desc': {
    en: '0.1% of international visitors by 2028',
    id: '0.1% dari pengunjung internasional pada 2028'
  },
  'scalability.revenue_growth': {
    en: 'Revenue Growth',
    id: 'Pertumbuhan Pendapatan'
  },
  'scalability.revenue_desc': {
    en: '$500K → $8M over 3 years',
    id: '$500K → $8M selama 3 tahun'
  },
  'scalability.expert_network': {
    en: 'Expert Network',
    id: 'Jaringan Ahli'
  },
  'scalability.network_desc': {
    en: '500 → 3,000 verified experts',
    id: '500 → 3.000 ahli terverifikasi'
  },
  'scalability.competitive_advantage': {
    en: 'Sustainable Competitive Advantages',
    id: 'Keunggulan Kompetitif Berkelanjutan'
  },
  'scalability.advantage_1': {
    en: 'First-mover advantage in Indonesian local expert marketplace',
    id: 'Keunggulan first-mover di marketplace ahli lokal Indonesia'
  },
  'scalability.advantage_2': {
    en: 'Strong network effects: more experts attract more travelers',
    id: 'Efek jaringan yang kuat: lebih banyak ahli menarik lebih banyak wisatawan'
  },
  'scalability.advantage_3': {
    en: 'Cultural authenticity barriers for international competitors',
    id: 'Hambatan keaslian budaya untuk kompetitor internasional'
  },
  'scalability.advantage_4': {
    en: 'Government support for local tourism empowerment',
    id: 'Dukungan pemerintah untuk pemberdayaan wisata lokal'
  },

  // Value Proposition Slide
  'value_prop.title': {
    en: 'Value Proposition for Investors',
    id: 'Proposisi Nilai untuk Investor'
  },
  'value_prop.subtitle': {
    en: 'Multiple stakeholder benefits creating sustainable ecosystem value',
    id: 'Manfaat multi-stakeholder menciptakan nilai ekosistem berkelanjutan'
  },
  'value_prop.individual.title': {
    en: 'Individual Investors',
    id: 'Investor Individu'
  },
  'value_prop.individual.subtitle': {
    en: 'High-growth tourism technology investment',
    id: 'Investasi teknologi pariwisata pertumbuhan tinggi'
  },
  'value_prop.individual.benefit1.title': {
    en: 'Attractive Returns',
    id: 'Return Menarik'
  },
  'value_prop.individual.benefit1.desc': {
    en: 'Projected 25-40% IRR with proven market demand',
    id: 'Proyeksi IRR 25-40% dengan permintaan pasar terbukti'
  },
  'value_prop.individual.benefit2.title': {
    en: 'Market Leadership',
    id: 'Kepemimpinan Pasar'
  },
  'value_prop.individual.benefit2.desc': {
    en: 'First-mover advantage in $2.8B addressable market',
    id: 'Keunggulan first-mover di pasar $2.8B yang dapat dialamatkan'
  },
  'value_prop.individual.benefit3.title': {
    en: 'Impact Investment',
    id: 'Investasi Berdampak'
  },
  'value_prop.individual.benefit3.desc': {
    en: 'Supporting local communities and sustainable tourism',
    id: 'Mendukung komunitas lokal dan pariwisata berkelanjutan'
  },
  'value_prop.individual.benefit4.title': {
    en: 'Scalable Platform',
    id: 'Platform Scalable'
  },
  'value_prop.individual.benefit4.desc': {
    en: 'Technology-driven model with network effects',
    id: 'Model berbasis teknologi dengan efek jaringan'
  },
  'value_prop.individual.roi_title': {
    en: 'Projected ROI',
    id: 'ROI Proyeksi'
  },
  'value_prop.individual.roi_desc': {
    en: 'Annual return potential',
    id: 'Potensi return tahunan'
  },
  'value_prop.corporate.title': {
    en: 'Corporate Partners',
    id: 'Mitra Korporat'
  },
  'value_prop.corporate.subtitle': {
    en: 'Strategic tourism ecosystem partnerships',
    id: 'Kemitraan ekosistem pariwisata strategis'
  },
  'value_prop.corporate.benefit1.title': {
    en: 'Customer Acquisition',
    id: 'Akuisisi Pelanggan'
  },
  'value_prop.corporate.benefit1.desc': {
    en: 'Access to 50K+ international travelers by 2028',
    id: 'Akses ke 50K+ wisatawan internasional pada 2028'
  },
  'value_prop.corporate.benefit2.title': {
    en: 'Brand Association',
    id: 'Asosiasi Merek'
  },
  'value_prop.corporate.benefit2.desc': {
    en: 'Partnership with authentic Indonesia experiences',
    id: 'Kemitraan dengan pengalaman Indonesia yang autentik'
  },
  'value_prop.corporate.benefit3.title': {
    en: 'Revenue Sharing',
    id: 'Bagi Hasil'
  },
  'value_prop.corporate.benefit3.desc': {
    en: 'Commission from referrals and joint packages',
    id: 'Komisi dari referral dan paket bersama'
  },
  'value_prop.corporate.benefit4.title': {
    en: 'Market Intelligence',
    id: 'Intelijen Pasar'
  },
  'value_prop.corporate.benefit4.desc': {
    en: 'Access to travel behavior data and trends',
    id: 'Akses ke data perilaku perjalanan dan tren'
  },
  'value_prop.corporate.partnership_title': {
    en: 'Partnership Value',
    id: 'Nilai Kemitraan'
  },
  'value_prop.corporate.partnership_desc': {
    en: 'Annual collaboration revenue',
    id: 'Pendapatan kolaborasi tahunan'
  },
  'value_prop.government.title': {
    en: 'Government Stakeholders',
    id: 'Pemangku Kepentingan Pemerintah'
  },
  'value_prop.government.subtitle': {
    en: 'Supporting national tourism development goals',
    id: 'Mendukung tujuan pengembangan pariwisata nasional'
  },
  'value_prop.government.benefit1.title': {
    en: 'Economic Empowerment',
    id: 'Pemberdayaan Ekonomi'
  },
  'value_prop.government.benefit1.desc': {
    en: '3K+ local experts earning sustainable income',
    id: '3K+ ahli lokal memperoleh pendapatan berkelanjutan'
  },
  'value_prop.government.benefit2.title': {
    en: 'Cultural Preservation',
    id: 'Pelestarian Budaya'
  },
  'value_prop.government.benefit2.desc': {
    en: 'Promoting authentic Indonesian heritage globally',
    id: 'Mempromosikan warisan Indonesia yang autentik secara global'
  },
  'value_prop.government.benefit3.title': {
    en: 'Tourism Growth',
    id: 'Pertumbuhan Pariwisata'
  },
  'value_prop.government.benefit3.desc': {
    en: 'Increasing international visitor satisfaction and retention',
    id: 'Meningkatkan kepuasan dan retensi pengunjung internasional'
  },
  'value_prop.government.benefit4.title': {
    en: 'Tax Revenue',
    id: 'Pendapatan Pajak'
  },
  'value_prop.government.benefit4.desc': {
    en: 'Platform transactions generate VAT and income tax',
    id: 'Transaksi platform menghasilkan PPN dan pajak penghasilan'
  },
  'value_prop.government.impact_title': {
    en: 'Economic Impact',
    id: 'Dampak Ekonomi'
  },
  'value_prop.government.impact_desc': {
    en: 'Job creation potential',
    id: 'Potensi penciptaan lapangan kerja'
  },

  // Additional Value Proposition Keys
  'value_prop.corporate.partnership_types': {
    en: 'Partnership Types',
    id: 'Jenis Kemitraan'
  },
  'value_prop.corporate.partnership1': {
    en: 'Hotels & Accommodations: Joint booking packages',
    id: 'Hotel & Akomodasi: Paket booking bersama'
  },
  'value_prop.corporate.partnership2': {
    en: 'Airlines: Travel experience add-ons',
    id: 'Maskapai: Add-on pengalaman perjalanan'
  },
  'value_prop.corporate.partnership3': {
    en: 'Tourism Boards: Destination marketing',
    id: 'Dinas Pariwisata: Pemasaran destinasi'
  },
  'value_prop.government.jobs_created': {
    en: 'Jobs Created',
    id: 'Lapangan Kerja'
  },
  'value_prop.government.economic_impact': {
    en: 'Economic Impact',
    id: 'Dampak Ekonomi'
  },
  'value_prop.win_win_title': {
    en: 'Win-Win Ecosystem',
    id: 'Ekosistem Win-Win'
  },
  'value_prop.win1_title': {
    en: 'Investor Returns',
    id: 'Return Investor'
  },
  'value_prop.win1_desc': {
    en: 'Strong financial returns with positive social impact',
    id: 'Return keuangan kuat dengan dampak sosial positif'
  },
  'value_prop.win2_title': {
    en: 'Market Growth',
    id: 'Pertumbuhan Pasar'
  },
  'value_prop.win2_desc': {
    en: 'Expanding Indonesia tourism market through authentic experiences',
    id: 'Memperluas pasar pariwisata Indonesia melalui pengalaman autentik'
  },
  'value_prop.win3_title': {
    en: 'Local Empowerment',
    id: 'Pemberdayaan Lokal'
  },
  'value_prop.win3_desc': {
    en: 'Creating sustainable income for local communities',
    id: 'Menciptakan pendapatan berkelanjutan untuk komunitas lokal'
  },

  // Financial Projections Slide
  'financials.title': {
    en: 'Financial Projections',
    id: 'Proyeksi Keuangan'
  },
  'financials.subtitle': {
    en: 'Conservative projections based on market research & realistic growth trajectory',
    id: 'Proyeksi konservatif berdasarkan riset pasar & lintasan pertumbuhan yang realistis'
  },
  'financials.revenue_title': {
    en: 'Revenue Growth (Post-Launch)',
    id: 'Pertumbuhan Pendapatan (Pasca-Peluncuran)'
  },
  'financials.year1_2026': {
    en: 'Year 1 (2026)',
    id: 'Tahun 1 (2026)'
  },
  'financials.year1_desc': {
    en: 'Platform launch & market entry',
    id: 'Peluncuran platform & masuk pasar'
  },
  'financials.year2_2027': {
    en: 'Year 2 (2027)',
    id: 'Tahun 2 (2027)'
  },
  'financials.year2_desc': {
    en: 'Geographic expansion & partnerships',
    id: 'Ekspansi geografis & kemitraan'
  },
  'financials.year3_2028': {
    en: 'Year 3 (2028)',
    id: 'Tahun 3 (2028)'
  },
  'financials.year3_desc': {
    en: 'National coverage & platform maturity',
    id: 'Cakupan nasional & kematangan platform'
  },
  'financials.user_growth': {
    en: 'Projected User Growth',
    id: 'Proyeksi Pertumbuhan Pengguna'
  },
  'financials.travelers_title': {
    en: 'International Travelers',
    id: 'Wisatawan Internasional'
  },
  'financials.experts_title': {
    en: 'Local Experts',
    id: 'Ahli Lokal'
  },
  'financials.unit_economics': {
    en: 'Unit Economics',
    id: 'Unit Economics'
  },
  'financials.avg_booking': {
    en: 'Avg. Booking Value',
    id: 'Nilai Booking Rata-rata'
  },
  'financials.platform_fee': {
    en: 'Platform Fee',
    id: 'Biaya Platform'
  },
  'financials.revenue_per_booking': {
    en: 'Revenue per Booking',
    id: 'Pendapatan per Booking'
  },
  'financials.gross_margin': {
    en: 'Gross Margin',
    id: 'Margin Kotor'
  },
  'financials.profitability': {
    en: 'Profitability',
    id: 'Profitabilitas'
  },
  'financials.breakeven': {
    en: 'Break-even',
    id: 'Break-even'
  },
  'financials.year': {
    en: 'Year',
    id: 'Tahun'
  },
  'financials.ebitda_margin_y3': {
    en: 'EBITDA Margin (Y3)',
    id: 'Margin EBITDA (T3)'
  },
  'financials.net_margin_y4': {
    en: 'Net Margin (Y4)',
    id: 'Margin Bersih (T4)'
  },
  'financials.roi_projection': {
    en: 'ROI Projection',
    id: 'Proyeksi ROI'
  },
  'financials.market_size': {
    en: 'Market Size',
    id: 'Ukuran Pasar'
  },
  'financials.sam_size': {
    en: 'SAM Size',
    id: 'Ukuran SAM'
  },
  'financials.market_share_y4': {
    en: 'Market Share (Y4)',
    id: 'Pangsa Pasar (T4)'
  },
  'financials.addressable_market': {
    en: 'Addressable Market',
    id: 'Pasar yang Dapat Dialamatkan'
  },
  'financials.tam_size': {
    en: 'TAM Size',
    id: 'Ukuran TAM'
  },
  'financials.use_of_funds': {
    en: 'Use of Funds',
    id: 'Penggunaan Dana'
  },
  'financials.marketing': {
    en: 'Marketing & Sales',
    id: 'Pemasaran & Penjualan'
  },
  'financials.technology': {
    en: 'Technology Development',
    id: 'Pengembangan Teknologi'
  },
  'financials.operations': {
    en: 'Operations & Staff',
    id: 'Operasi & Staf'
  },
  'financials.working_capital': {
    en: 'Working Capital',
    id: 'Modal Kerja'
  },

  // Additional Financial Projections Keys
  'financials.funding_requirements': {
    en: 'Funding Requirements',
    id: 'Kebutuhan Pendanaan'
  },
  'financials.series_a': {
    en: 'Series A',
    id: 'Series A'
  },
  'financials.amount': {
    en: 'Amount',
    id: 'Jumlah'
  },
  'financials.timeline': {
    en: 'Timeline',
    id: 'Timeline'
  },
  'financials.runway': {
    en: 'Runway',
    id: 'Runway'
  },
  'financials.months': {
    en: 'months',
    id: 'bulan'
  },
  'financials.growth_potential': {
    en: 'Growth Potential',
    id: 'Potensi Pertumbuhan'
  },
  'financials.high': {
    en: 'High',
    id: 'Tinggi'
  },
  'financials.key_metrics': {
    en: 'Key Metrics',
    id: 'Metrik Utama'
  },
  'financials.arpu': {
    en: 'ARPU',
    id: 'ARPU'
  },
  'financials.commission': {
    en: 'Commission',
    id: 'Komisi'
  },
  'financials.cac': {
    en: 'CAC',
    id: 'CAC'
  },
  'financials.payback': {
    en: 'Payback Period',
    id: 'Periode Payback'
  },
  'financials.ltv_cac': {
    en: 'LTV/CAC Ratio',
    id: 'Rasio LTV/CAC'
  },

  // Risk Management Slide
  'risks.title': {
    en: 'Risk Management',
    id: 'Manajemen Risiko'
  },
  'risks.market_risks': {
    en: 'Market Risks',
    id: 'Risiko Pasar'
  },
  'risks.operational_risks': {
    en: 'Operational Risks',
    id: 'Risiko Operasional'
  },
  'risks.regulatory_risks': {
    en: 'Regulatory & Legal Risks',
    id: 'Risiko Regulasi & Hukum'
  },
  'risks.financial_risks': {
    en: 'Financial Risks',
    id: 'Risiko Keuangan'
  },
  'risks.high': {
    en: 'High',
    id: 'Tinggi'
  },
  'risks.medium': {
    en: 'Medium',
    id: 'Sedang'
  },
  'risks.low': {
    en: 'Low',
    id: 'Rendah'
  },
  'risks.mitigation': {
    en: 'Mitigation',
    id: 'Mitigasi'
  },
  'risks.market.competition': {
    en: 'Market Competition',
    id: 'Kompetisi Pasar'
  },
  'risks.market.competition_desc': {
    en: 'Large platforms like Airbnb or Booking.com entering local experience market',
    id: 'Platform besar seperti Airbnb atau Booking.com masuk pasar pengalaman lokal'
  },
  'risks.market.competition_solution': {
    en: 'Focus on cultural authenticity, local expert curation, and government partnerships',
    id: 'Fokus pada keaslian budaya, kurasi ahli lokal, dan kemitraan pemerintah'
  },
  'risks.market.economic_downturn': {
    en: 'Economic Downturn',
    id: 'Penurunan Ekonomi'
  },
  'risks.market.economic_desc': {
    en: 'Global recession reducing international travel demand',
    id: 'Resesi global mengurangi permintaan perjalanan internasional'
  },
  'risks.market.economic_solution': {
    en: 'Diversify to domestic tourism and corporate retreat market',
    id: 'Diversifikasi ke wisata domestik dan pasar retreat perusahaan'
  },
  'risks.market.consumer_behavior': {
    en: 'Consumer Behavior Change',
    id: 'Perubahan Perilaku Konsumen'
  },
  'risks.market.consumer_desc': {
    en: 'Shift away from authentic experiences to virtual or different travel preferences',
    id: 'Beralih dari pengalaman autentik ke virtual atau preferensi perjalanan berbeda'
  },
  'risks.market.consumer_solution': {
    en: 'Continuous market research and platform adaptation to emerging trends',
    id: 'Riset pasar berkelanjutan dan adaptasi platform untuk tren yang muncul'
  },
  'risks.operational.quality_control': {
    en: 'Quality Control',
    id: 'Kontrol Kualitas'
  },
  'risks.operational.quality_desc': {
    en: 'Ensuring consistent service quality across diverse local experts',
    id: 'Memastikan kualitas layanan konsisten di seluruh ahli lokal yang beragam'
  },
  'risks.operational.quality_solution': {
    en: 'Rigorous vetting process, rating system, training programs, and regular audits',
    id: 'Proses vetting ketat, sistem rating, program pelatihan, dan audit rutin'
  },
  'risks.operational.expert_retention': {
    en: 'Expert Retention',
    id: 'Retensi Ahli'
  },
  'risks.operational.retention_desc': {
    en: 'Local experts leaving for competing platforms or other opportunities',
    id: 'Ahli lokal pindah ke platform pesaing atau peluang lain'
  },
  'risks.operational.retention_solution': {
    en: 'Competitive commission structure, exclusive benefits, community building',
    id: 'Struktur komisi kompetitif, manfaat eksklusif, membangun komunitas'
  },
  'risks.operational.technology': {
    en: 'Technology Scalability',
    id: 'Skalabilitas Teknologi'
  },
  'risks.operational.tech_desc': {
    en: 'Platform performance issues during rapid user growth',
    id: 'Masalah performa platform selama pertumbuhan pengguna yang cepat'
  },
  'risks.operational.tech_solution': {
    en: 'Cloud-based infrastructure, load testing, gradual rollout strategy',
    id: 'Infrastruktur berbasis cloud, uji beban, strategi peluncuran bertahap'
  },
  'risks.regulatory.tourism_regulations': {
    en: 'Tourism Regulations',
    id: 'Regulasi Pariwisata'
  },
  'risks.regulatory.tourism_desc': {
    en: 'Changes in government policies affecting tourism or platform operations',
    id: 'Perubahan kebijakan pemerintah yang mempengaruhi pariwisata atau operasi platform'
  },
  'risks.regulatory.tourism_solution': {
    en: 'Active government engagement, compliance monitoring, flexible business model',
    id: 'Keterlibatan pemerintah aktif, pemantauan kepatuhan, model bisnis fleksibel'
  },
  'risks.regulatory.data_privacy': {
    en: 'Data Privacy',
    id: 'Privasi Data'
  },
  'risks.regulatory.privacy_desc': {
    en: 'Compliance with Indonesian and international data protection laws',
    id: 'Kepatuhan terhadap hukum perlindungan data Indonesia dan internasional'
  },
  'risks.regulatory.privacy_solution': {
    en: 'GDPR-compliant systems, local data storage, regular privacy audits',
    id: 'Sistem sesuai GDPR, penyimpanan data lokal, audit privasi reguler'
  },
  'risks.financial.cash_flow': {
    en: 'Cash Flow Management',
    id: 'Manajemen Arus Kas'
  },
  'risks.financial.cashflow_desc': {
    en: 'Seasonal tourism patterns affecting revenue consistency',
    id: 'Pola musiman pariwisata mempengaruhi konsistensi pendapatan'
  },
  'risks.financial.cashflow_solution': {
    en: 'Diverse revenue streams, working capital reserves, flexible cost structure',
    id: 'Aliran pendapatan beragam, cadangan modal kerja, struktur biaya fleksibel'
  },
  'risks.financial.currency_fluctuation': {
    en: 'Currency Fluctuation',
    id: 'Fluktuasi Mata Uang'
  },
  'risks.financial.currency_desc': {
    en: 'Exchange rate volatility affecting international transactions',
    id: 'Volatilitas nilai tukar mempengaruhi transaksi internasional'
  },
  'risks.financial.currency_solution': {
    en: 'Multi-currency pricing, hedging strategies, local payment methods',
    id: 'Penetapan harga multi-mata uang, strategi hedging, metode pembayaran lokal'
  },
  'risks.overall_assessment': {
    en: 'Overall Risk Assessment',
    id: 'Penilaian Risiko Keseluruhan'
  },
  'risks.high_level': {
    en: 'High Risk',
    id: 'Risiko Tinggi'
  },
  'risks.high_desc': {
    en: 'Requires active management',
    id: 'Memerlukan manajemen aktif'
  },
  'risks.medium_level': {
    en: 'Medium Risk',
    id: 'Risiko Sedang'
  },
  'risks.medium_desc': {
    en: 'Manageable with proper controls',
    id: 'Dapat dikelola dengan kontrol yang tepat'
  },
  'risks.low_level': {
    en: 'Low Risk',
    id: 'Risiko Rendah'
  },
  'risks.low_desc': {
    en: 'Minimal impact on operations',
    id: 'Dampak minimal pada operasi'
  },

  // Investment Opportunity Slide
  'investment.title': {
    en: 'Investment Opportunity',
    id: 'Peluang Investasi'
  },
  'investment.series_a_overview': {
    en: 'Series A Overview',
    id: 'Gambaran Series A'
  },
  'investment.funding_goal': {
    en: 'Funding Goal',
    id: 'Target Pendanaan'
  },
  'investment.series_a_round': {
    en: 'Series A Round',
    id: 'Putaran Series A'
  },
  'investment.months_runway': {
    en: 'Months Runway',
    id: 'Bulan Runway'
  },
  'investment.equity_offered': {
    en: 'Equity Offered',
    id: 'Ekuitas Ditawarkan'
  },
  'investment.key_milestones': {
    en: 'Key Milestones',
    id: 'Milestone Kunci'
  },
  'investment.milestone1': {
    en: 'Platform launch in 3 core cities',
    id: 'Peluncuran platform di 3 kota inti'
  },
  'investment.milestone2': {
    en: '500+ verified local experts onboarded',
    id: '500+ ahli lokal terverifikasi bergabung'
  },
  'investment.milestone3': {
    en: '2,000+ international travelers served',
    id: '2.000+ wisatawan internasional dilayani'
  },
  'investment.milestone4': {
    en: 'Break-even achieved by month 18',
    id: 'Break-even tercapai di bulan ke-18'
  },
  'investment.use_of_funds': {
    en: 'Use of Funds',
    id: 'Penggunaan Dana'
  },
  'investment.marketing_sales': {
    en: 'Marketing & Sales',
    id: 'Pemasaran & Penjualan'
  },
  'investment.marketing_desc': {
    en: 'Customer acquisition & brand building',
    id: 'Akuisisi pelanggan & pembangunan merek'
  },
  'investment.technology_dev': {
    en: 'Technology Development',
    id: 'Pengembangan Teknologi'
  },
  'investment.tech_desc': {
    en: 'Platform enhancement & mobile app',
    id: 'Peningkatan platform & aplikasi mobile'
  },
  'investment.operations': {
    en: 'Operations & Staff',
    id: 'Operasi & Staf'
  },
  'investment.ops_desc': {
    en: 'Team expansion & operational setup',
    id: 'Ekspansi tim & pengaturan operasional'
  },
  'investment.working_capital': {
    en: 'Working Capital',
    id: 'Modal Kerja'
  },
  'investment.capital_desc': {
    en: 'Cash reserves & contingency',
    id: 'Cadangan kas & kontingensi'
  },
  'investment.financial_returns': {
    en: 'Financial Returns',
    id: 'Return Keuangan'
  },
  'investment.projected_irr': {
    en: 'Projected IRR',
    id: 'IRR Proyeksi'
  },
  'investment.exit_timeline': {
    en: 'Exit Timeline',
    id: 'Timeline Exit'
  },
  'investment.years': {
    en: 'years',
    id: 'tahun'
  },
  'investment.target_multiple': {
    en: 'Target Multiple',
    id: 'Target Multiple'
  },
  'investment.strategic_value': {
    en: 'Strategic Value',
    id: 'Nilai Strategis'
  },
  'investment.market_leadership': {
    en: 'Market leadership in Indonesian authentic tourism',
    id: 'Kepemimpinan pasar di wisata autentik Indonesia'
  },
  'investment.brand_recognition': {
    en: 'Strong brand recognition among international travelers',
    id: 'Pengakuan merek yang kuat di kalangan wisatawan internasional'
  },
  'investment.data_insights': {
    en: 'Valuable travel behavior and preference data',
    id: 'Data perilaku perjalanan dan preferensi yang berharga'
  },
  'investment.network_effects': {
    en: 'Network effects creating competitive moat',
    id: 'Efek jaringan menciptakan parit kompetitif'
  },
  'investment.impact_opportunity': {
    en: 'Impact Opportunity',
    id: 'Peluang Dampak'
  },
  'investment.community_empowerment': {
    en: 'Empowering local communities through tourism',
    id: 'Memberdayakan komunitas lokal melalui pariwisata'
  },
  'investment.cultural_preservation': {
    en: 'Preserving and promoting Indonesian culture',
    id: 'Melestarikan dan mempromosikan budaya Indonesia'
  },
  'investment.sustainable_tourism': {
    en: 'Supporting sustainable tourism practices',
    id: 'Mendukung praktik pariwisata berkelanjutan'
  },
  'investment.economic_development': {
    en: 'Contributing to local economic development',
    id: 'Berkontribusi pada pengembangan ekonomi lokal'
  },
  'investment.investment_timeline': {
    en: 'Investment Timeline',
    id: 'Timeline Investasi'
  },
  'investment.phase1_title': {
    en: 'Initial Contact',
    id: 'Kontak Awal'
  },
  'investment.phase1_desc': {
    en: 'Pitch presentation & preliminary discussions',
    id: 'Presentasi pitch & diskusi awal'
  },
  'investment.phase1_duration': {
    en: '2-3 weeks',
    id: '2-3 minggu'
  },
  'investment.phase2_title': {
    en: 'Due Diligence',
    id: 'Due Diligence'
  },
  'investment.phase2_desc': {
    en: 'Financial review, market validation, team assessment',
    id: 'Review keuangan, validasi pasar, penilaian tim'
  },
  'investment.phase2_duration': {
    en: '4-6 weeks',
    id: '4-6 minggu'
  },
  'investment.phase3_title': {
    en: 'Term Sheet',
    id: 'Term Sheet'
  },
  'investment.phase3_desc': {
    en: 'Negotiation & legal documentation',
    id: 'Negosiasi & dokumentasi hukum'
  },
  'investment.phase3_duration': {
    en: '2-4 weeks',
    id: '2-4 minggu'
  },
  'investment.phase4_title': {
    en: 'Closing',
    id: 'Penutupan'
  },
  'investment.phase4_desc': {
    en: 'Final agreements & fund transfer',
    id: 'Perjanjian final & transfer dana'
  },
  'investment.phase4_duration': {
    en: '1-2 weeks',
    id: '1-2 minggu'
  },

  'investment.target_completion': {
    en: 'Target Completion: Q2 2024',
    id: 'Target Penyelesaian: Q2 2024'
  },
  'risks.conclusion': {
    en: 'Overall, our comprehensive risk management strategy ensures business continuity and sustainable growth.',
    id: 'Secara keseluruhan, strategi manajemen risiko komprehensif kami memastikan kontinuitas bisnis dan pertumbuhan berkelanjutan.'
  },
  'risks.risk_manageable': {
    en: 'Risks are well-managed with proactive strategies',
    id: 'Risiko dikelola dengan baik melalui strategi proaktif'
  },

  // Call to Action Slide
  'cta.title': {
    en: 'Ready to Transform Indonesian Tourism?',
    id: 'Siap Mentransformasi Pariwisata Indonesia?'
  },
  'cta.subtitle': {
    en: 'Join us in building the future of authentic travel experiences',
    id: 'Bergabunglah dengan kami membangun masa depan pengalaman perjalanan autentik'
  },
  'cta.investors.title': {
    en: 'For Investors',
    id: 'Untuk Investor'
  },
  'cta.investors.desc': {
    en: 'High-growth opportunity in Southeast Asia\'s largest tourism market',
    id: 'Peluang pertumbuhan tinggi di pasar pariwisata terbesar Asia Tenggara'
  },
  'cta.investors.min_investment': {
    en: 'Min. Investment',
    id: 'Investasi Min.'
  },
  'cta.investors.expected_irr': {
    en: 'Expected IRR',
    id: 'IRR yang Diharapkan'
  },
  'cta.investors.investment_type': {
    en: 'Investment Type',
    id: 'Jenis Investasi'
  },
  'cta.investors.equity': {
    en: 'Equity',
    id: 'Ekuitas'
  },
  'cta.investors.button': {
    en: 'Schedule Investment Meeting',
    id: 'Jadwalkan Pertemuan Investasi'
  },
  'cta.corporates.title': {
    en: 'For Corporates',
    id: 'Untuk Korporat'
  },
  'cta.corporates.desc': {
    en: 'Strategic partnerships to enhance customer experience and expand market reach',
    id: 'Kemitraan strategis untuk meningkatkan pengalaman pelanggan dan memperluas jangkauan pasar'
  },
  'cta.corporates.benefit1': {
    en: 'Access to 50K+ international travelers',
    id: 'Akses ke 50K+ wisatawan internasional'
  },
  'cta.corporates.benefit2': {
    en: 'Co-branded experience packages',
    id: 'Paket pengalaman co-branded'
  },
  'cta.corporates.benefit3': {
    en: 'Revenue sharing opportunities',
    id: 'Peluang bagi hasil'
  },
  'cta.corporates.benefit4': {
    en: 'Market intelligence & insights',
    id: 'Intelijen & wawasan pasar'
  },
  'cta.corporates.button': {
    en: 'Explore Partnership',
    id: 'Jelajahi Kemitraan'
  },
  'cta.government.title': {
    en: 'For Government',
    id: 'Untuk Pemerintah'
  },
  'cta.government.desc': {
    en: 'Supporting national tourism development and local community empowerment',
    id: 'Mendukung pengembangan pariwisata nasional dan pemberdayaan komunitas lokal'
  },
  'cta.government.benefit1': {
    en: '3K+ local jobs creation',
    id: 'Penciptaan 3K+ lapangan kerja lokal'
  },
  'cta.government.benefit2': {
    en: 'Cultural heritage promotion',
    id: 'Promosi warisan budaya'
  },
  'cta.government.benefit3': {
    en: 'Tourism revenue growth',
    id: 'Pertumbuhan pendapatan pariwisata'
  },
  'cta.government.benefit4': {
    en: 'Tax revenue generation',
    id: 'Generasi pendapatan pajak'
  },
  'cta.government.button': {
    en: 'Discuss Government Partnership',
    id: 'Diskusikan Kemitraan Pemerintah'
  },
  'cta.contact_title': {
    en: 'Get in Touch',
    id: 'Hubungi Kami'
  },
  'cta.contact.email': {
    en: 'Email',
    id: 'Email'
  },
  'cta.contact.website': {
    en: 'Website',
    id: 'Website'
  },
  'cta.contact.phone': {
    en: 'Phone',
    id: 'Telepon'
  },
  'cta.contact.location': {
    en: 'Location',
    id: 'Lokasi'
  },
  'cta.next_steps_title': {
    en: 'Next Steps',
    id: 'Langkah Selanjutnya'
  },
  'cta.step1.title': {
    en: 'Initial Discussion',
    id: 'Diskusi Awal'
  },
  'cta.step1.desc': {
    en: 'Schedule a meeting to discuss your specific interests and questions',
    id: 'Jadwalkan pertemuan untuk membahas minat dan pertanyaan spesifik Anda'
  },
  'cta.step2.title': {
    en: 'Detailed Review',
    id: 'Review Mendetail'
  },
  'cta.step2.desc': {
    en: 'Deep dive into business model, financials, and partnership opportunities',
    id: 'Menyelami model bisnis, keuangan, dan peluang kemitraan'
  },
  'cta.step3.title': {
    en: 'Partnership Agreement',
    id: 'Perjanjian Kemitraan'
  },
  'cta.step3.desc': {
    en: 'Finalize terms and begin our journey together',
    id: 'Finalisasi persyaratan dan mulai perjalanan bersama'
  },
  'cta.final_message': {
    en: 'Let\'s Build the Future of Indonesian Tourism Together',
    id: 'Mari Membangun Masa Depan Pariwisata Indonesia Bersama'
  },
  'cta.final_subtitle': {
    en: 'The opportunity is here. The time is now.',
    id: 'Peluang ada di sini. Waktunya adalah sekarang.'
  },
  'cta.schedule_meeting': {
    en: 'Schedule Meeting',
    id: 'Jadwalkan Pertemuan'
  },
  'cta.download_deck': {
    en: 'Download Full Deck',
    id: 'Unduh Deck Lengkap'
  },
  'cta.ready_to_start': {
    en: 'Ready to start this journey?',
    id: 'Siap memulai perjalanan ini?'
  },

  // Download Options
  'download.current_language': {
    en: 'Current Language',
    id: 'Bahasa Saat Ini'
  },
  'download.english_version': {
    en: 'English Version',
    id: 'Versi Bahasa Inggris'
  },
  'download.indonesian_version': {
    en: 'Indonesian Version', 
    id: 'Versi Bahasa Indonesia'
  },
  'download.both_languages': {
    en: 'Both Languages',
    id: 'Kedua Bahasa'
  },
  'download.preparing': {
    en: 'Preparing...',
    id: 'Menyiapkan...'
  },
  'download.info_text': {
    en: 'High-quality PDF format with professional layout',
    id: 'Format PDF berkualitas tinggi dengan tata letak profesional'
  },

  // Roadmap & Milestones
  'roadmap.title': {
    en: 'Roadmap & Milestones',
    id: 'Roadmap & Tonggak Pencapaian'
  },
  'roadmap.subtitle': {
    en: 'Strategic development phases from community launch to market expansion',
    id: 'Fase pengembangan strategis dari peluncuran komunitas hingga ekspansi pasar'
  },
  'roadmap.q4_2025.title': {
    en: 'Q4 2025: Core Platform Development',
    id: 'Q4 2025: Pengembangan Platform Inti'
  },
  'roadmap.q4_2025.vibes_platform': {
    en: 'Local Tour Guide marketplace',
    id: 'Marketplace Pemandu Wisata Lokal'
  },
  'roadmap.q4_2025.community_building': {
    en: 'Photographer booking system',
    id: 'Sistem booking Fotografer'
  },
  'roadmap.q4_2025.local_network': {
    en: 'Trip Planner matching platform',
    id: 'Platform pencocokan Trip Planner'
  },
  'roadmap.q4_2025.user_feedback': {
    en: 'Basic booking & payment system',
    id: 'Sistem booking & pembayaran dasar'
  },
  'roadmap.jan_2026.title': {
    en: 'Q1 2026: Vibes Community Launch',
    id: 'Q1 2026: Peluncuran Komunitas Vibes'
  },
  'roadmap.jan_2026.full_platform': {
    en: 'Travel forum & discussion platform',
    id: 'Platform forum & diskusi travel'
  },
  'roadmap.jan_2026.booking_system': {
    en: 'Trip companion matching system',
    id: 'Sistem pencocokan travel companion'
  },
  'roadmap.jan_2026.mobile_app': {
    en: 'Mobile app release (iOS & Android)',
    id: 'Rilis aplikasi mobile (iOS & Android)'
  },
  'roadmap.jan_2026.initial_marketing': {
    en: 'Initial marketing & user acquisition',
    id: 'Marketing awal & akuisisi pengguna'
  },
  'roadmap.q2_q4_2026.title': {
    en: 'Q2-Q4 2026: Scale & Growth',
    id: 'Q2-Q4 2026: Skala & Pertumbuhan'
  },
  'roadmap.q2_q4_2026.expand_cities': {
    en: 'Expand to 8-10 major Indonesian cities',
    id: 'Ekspansi ke 8-10 kota besar Indonesia'
  },
  'roadmap.q2_q4_2026.expert_network': {
    en: 'Build 1,000+ verified local expert network',
    id: 'Membangun jaringan 1,000+ ahli lokal terverifikasi'
  },
  'roadmap.q2_q4_2026.partnerships': {
    en: 'Strategic partnerships with tourism boards',
    id: 'Kemitraan strategis dengan dinas pariwisata'
  },
  'roadmap.q2_q4_2026.series_a': {
    en: 'Prepare for Series A funding round',
    id: 'Persiapan putaran pendanaan Series A'
  },
  'roadmap.2027_beyond.title': {
    en: '2027 & Beyond: Regional Expansion',
    id: '2027 & Seterusnya: Ekspansi Regional'
  },
  'roadmap.2027_beyond.southeast_asia': {
    en: 'Expand to Southeast Asian markets',
    id: 'Ekspansi ke pasar Asia Tenggara'
  },
  'roadmap.2027_beyond.advanced_features': {
    en: 'AI-powered experience recommendations',
    id: 'Rekomendasi pengalaman bertenaga AI'
  },
  'roadmap.2027_beyond.b2b_services': {
    en: 'Enterprise & B2B travel services',
    id: 'Layanan travel Enterprise & B2B'
  },
  'roadmap.2027_beyond.market_leader': {
    en: 'Establish as regional market leader',
    id: 'Menjadi pemimpin pasar regional'
  },

  // Financial Projections
  'financial.title': {
    en: 'Financial Projections',
    id: 'Proyeksi Keuangan'
  },
  'financial.subtitle': {
    en: '3-year revenue forecast with conservative growth assumptions',
    id: 'Ramalan pendapatan 3 tahun dengan asumsi pertumbuhan konservatif'
  },
  'financial.revenue_growth.title': {
    en: 'Revenue Growth Projection',
    id: 'Proyeksi Pertumbuhan Pendapatan'
  },
  'financial.year1.label': {
    en: 'Year 1 (2026)',
    id: 'Tahun 1 (2026)'
  },
  'financial.year2.label': {
    en: 'Year 2 (2027)',
    id: 'Tahun 2 (2027)'
  },
  'financial.year3.label': {
    en: 'Year 3 (2028)',
    id: 'Tahun 3 (2028)'
  },
  'financial.key_metrics.title': {
    en: 'Key Business Metrics',
    id: 'Metrik Bisnis Utama'
  },
  'financial.active_travelers': {
    en: 'Active Travelers',
    id: 'Wisatawan Aktif'
  },
  'financial.local_experts': {
    en: 'Local Experts',
    id: 'Ahli Lokal'
  },
  'financial.avg_booking_value': {
    en: 'Avg Booking Value',
    id: 'Nilai Booking Rata-rata'
  },
  'financial.commission_rate': {
    en: 'Commission Rate',
    id: 'Tingkat Komisi'
  },
  'financial.unit_economics.title': {
    en: 'Unit Economics',
    id: 'Unit Ekonomi'
  },
  'financial.customer_acquisition_cost': {
    en: 'Customer Acquisition Cost',
    id: 'Biaya Akuisisi Pelanggan'
  },
  'financial.lifetime_value': {
    en: 'Customer Lifetime Value',
    id: 'Nilai Seumur Hidup Pelanggan'
  },
  'financial.ltv_cac_ratio': {
    en: 'LTV:CAC Ratio',
    id: 'Rasio LTV:CAC'
  },
  'financial.monthly_retention': {
    en: 'Monthly Retention Rate',
    id: 'Tingkat Retensi Bulanan'
  },
  'financial.path_profitability.title': {
    en: 'Path to Profitability',
    id: 'Jalur Menuju Profitabilitas'
  },
  'financial.break_even': {
    en: 'Break-even: Month 18 (Mid-2027)',
    id: 'Break-even: Bulan 18 (Pertengahan 2027)'
  },
  'financial.positive_cash_flow': {
    en: 'Positive cash flow by Q3 2027',
    id: 'Arus kas positif pada Q3 2027'
  },
  'financial.gross_margin': {
    en: 'Target gross margin: 25-30% by Year 3',
    id: 'Target margin kotor: 25-30% pada Tahun 3'
  },
  'financial.market_assumptions.title': {
    en: 'Market Size & Assumptions',
    id: 'Asumsi Ukuran Pasar'
  },
  'financial.total_addressable_market': {
    en: 'Total Addressable Market',
    id: 'Total Pasar yang Dapat Ditangani'
  },
  'financial.serviceable_market': {
    en: 'Serviceable Market',
    id: 'Pasar yang Dapat Dilayani'
  },
  'financial.market_penetration': {
    en: 'Target Market Penetration',
    id: 'Penetrasi Pasar Target'
  },
  'financial.conservative_assumptions': {
    en: 'Based on conservative growth assumptions and validated market research',
    id: 'Berdasarkan asumsi pertumbuhan konservatif dan riset pasar yang tervalidasi'
  },

  // Closing Slide
  'closing.title': {
    en: 'Thank You',
    id: 'Terima Kasih'
  },
  'closing.subtitle': {
    en: 'Ready to transform Indonesia\'s travel experience together?',
    id: 'Siap mentransformasi pengalaman travel Indonesia bersama?'
  },
  'closing.vision_title': {
    en: 'Our Vision',
    id: 'Visi Kami'
  },
  'closing.vision_desc': {
    en: 'Making authentic Indonesian travel experiences accessible to every visitor while empowering local communities.',
    id: 'Membuat pengalaman travel Indonesia yang autentik dapat diakses setiap pengunjung sambil memberdayakan komunitas lokal.'
  },
  'closing.market_size': {
    en: 'Market',
    id: 'Pasar'
  },
  'closing.annual_visitors': {
    en: 'Visitors',
    id: 'Pengunjung'
  },
  'closing.launch_year': {
    en: 'Launch',
    id: 'Peluncuran'
  },
  'closing.next_steps_title': {
    en: 'Next Steps',
    id: 'Langkah Selanjutnya'
  },
  'closing.step1_title': {
    en: 'Partnership Discussion',
    id: 'Diskusi Kemitraan'
  },
  'closing.step1_desc': {
    en: 'Explore investment & collaboration opportunities',
    id: 'Jelajahi peluang investasi & kolaborasi'
  },
  'closing.step2_title': {
    en: 'Platform Demo',
    id: 'Demo Platform'
  },
  'closing.step2_desc': {
    en: 'Experience our MVP & development progress',
    id: 'Rasakan MVP & progress pengembangan kami'
  },
  'closing.step3_title': {
    en: 'Strategic Planning',
    id: 'Perencanaan Strategis'
  },
  'closing.step3_desc': {
    en: 'Define roadmap & investment structure',
    id: 'Tentukan roadmap & struktur investasi'
  },
  'closing.contact_title': {
    en: 'Get In Touch',
    id: 'Hubungi Kami'
  },
  'closing.email_label': {
    en: 'Email',
    id: 'Email'
  },
  'closing.website_label': {
    en: 'Website',
    id: 'Website'
  },
  'closing.demo_label': {
    en: 'Live Demo',
    id: 'Demo Langsung'
  },
  'closing.demo_desc': {
    en: 'Available on request',
    id: 'Tersedia atas permintaan'
  },
  'closing.cta_text': {
    en: 'Let\'s Build the Future of Travel',
    id: 'Mari Bangun Masa Depan Travel'
  },
  'closing.cta_subtitle': {
    en: 'Together, we can redefine how the world experiences Indonesia',
    id: 'Bersama, kita bisa redefinisi bagaimana dunia merasakan Indonesia'
  },
  'closing.download_title': {
    en: 'Take This Pitch Deck With You',
    id: 'Bawa Pitch Deck Ini Bersamamu'
  },
  'closing.download_desc': {
    en: 'Download in English, Indonesian, or both languages',
    id: 'Download dalam bahasa Inggris, Indonesia, atau kedua bahasa'
  },
  'closing.quote': {
    en: 'The best way to predict the future is to create it',
    id: 'Cara terbaik memprediksi masa depan adalah menciptakannya'
  },
  'closing.quote_author': {
    en: 'LocallyTrip Team',
    id: 'Tim LocallyTrip'
  },

  // Add more translations as needed...
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en');
  };

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};