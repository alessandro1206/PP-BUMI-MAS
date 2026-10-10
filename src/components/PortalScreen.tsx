import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scale, Package, Mail, Award, CheckCircle2, 
  ChevronRight, Sprout, Factory, ShieldCheck, 
  Layers, Truck, Check, Droplets, Sun, Sparkles
} from 'lucide-react';

/* =========================================================================
   MERCURY STYLE TOKENS & SUBTLE TRADITIONAL BANYUWANGI DIVIDER
   ========================================================================= */

// Whisper-light traditional Gajah Oling pattern watermark (restrained 0.02 opacity)
const BatikGajahOlingPattern: React.FC<{ opacity?: number }> = ({ opacity = 0.02 }) => (
  <div 
    className="pointer-events-none absolute inset-0"
    style={{
      opacity,
      backgroundImage: `radial-gradient(#e2e3ed 0.75px, transparent 0.75px)`,
      backgroundSize: '40px 40px',
      backgroundPosition: '0 0, 20px 20px'
    }}
  >
    <svg 
      className="w-full h-full opacity-40" 
      xmlns="http://www.w3.org/2000/svg"
      patternUnits="userSpaceOnUse"
    >
      <defs>
        <pattern id="batik-subtle-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 40,40 m -20,0 a 20,20 0 1,1 40,0 a 20,20 0 1,1 -40,0" fill="none" stroke="#e2e3ed" strokeWidth="0.6" opacity="0.6" />
          <path d="M 40,20 C 50,20 60,30 60,40 C 60,50 50,60 40,60 C 30,60 25,50 28,42" fill="none" stroke="#e2e3ed" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M 20,20 Q 30,30 40,20 Q 50,30 60,20 Q 50,10 40,20 Q 30,10 20,20 Z" fill="none" stroke="#e2e3ed" strokeWidth="0.6" opacity="0.5" />
          <circle cx="40" cy="40" r="2" fill="#e2e3ed" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#batik-subtle-pattern)" />
    </svg>
  </div>
);

// Minimal hairline section divider
const SectionDivider: React.FC = () => (
  <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
    <div className="w-full border-t border-[#70707d]/20"></div>
  </div>
);

export const PortalScreen: React.FC = () => {
  const { setRole, setActiveScreen, currentUser } = useApp();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [selectedGrainPreset, setSelectedGrainPreset] = useState<string>('Cap Putri Thailand (Premium)');
  
  // Hero inline capture input state
  const [heroCaptureInput, setHeroCaptureInput] = useState('');

  const handleHeroCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroCaptureInput.trim()) return;
    setQuoteModalOpen(true);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setQuoteModalOpen(false);
      setHeroCaptureInput('');
    }, 2200);
  };

  const openQuoteWithGrain = (grainName: string) => {
    setSelectedGrainPreset(grainName);
    setQuoteModalOpen(true);
  };

  return (
    <div className="w-full bg-[#171721] text-[#ededf3] font-sans overflow-hidden selection:bg-[#5266eb] selection:text-white">
      
      {/* =========================================================================
          1. FULL-BLEED HERO SECTION (100vw × ~100vh)
          ========================================================================= */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-[#171721]">
        {/* Full-bleed photographic background with blue-hour alpine / volcanic sawah mist */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2400&q=85')`,
          }}
        >
          {/* Mercury dark overlay base ensuring perfect text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#171721]/75 via-[#171721]/85 to-[#171721]"></div>
        </div>

        <BatikGajahOlingPattern opacity={0.03} />

        {/* Centered Content Stack */}
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 flex-1 flex flex-col justify-center items-center text-center">
          
          <div className="max-w-[760px] space-y-6">
            
            {/* Category / Location Marker */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1e1e2a]/80 border border-[#70707d]/30 text-xs text-[#c3c3cc]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5266eb]"></span>
              <span className="font-mono uppercase tracking-[0.12em] text-[11px]">PP BUMI MAS • BANYUWANGI, JAWA TIMUR</span>
            </div>

            {/* Display Headline in intermediate weight 480 */}
            <h1 className="text-4xl sm:text-6xl lg:text-[65px] font-normal leading-[1.1] tracking-[-0.015em] text-[#ededf3]">
              Nurtured by nature, milled for perfection.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg font-normal leading-[1.4] text-[#c3c3cc] max-w-[580px] mx-auto">
              Premium-grade Indonesian rice, grown in the fertile volcanic soils of Mount Ijen and processed with state-of-the-art optical milling by PP BUMI MAS.
            </p>

            {/* Mercury Inline Email / Inquiry Capture (Pill Left-Half Input + Cobalt Button) */}
            <form onSubmit={handleHeroCaptureSubmit} className="pt-4 max-w-[520px] mx-auto">
              <div className="flex flex-col sm:flex-row items-stretch rounded-full border border-[#e2e3ed]/40 p-1 bg-[#171721]/60 backdrop-blur-md focus-within:border-[#5266eb] transition">
                <input
                  type="text"
                  value={heroCaptureInput}
                  onChange={(e) => setHeroCaptureInput(e.target.value)}
                  placeholder="Masukkan nama usaha atau nomor WhatsApp..."
                  className="flex-1 bg-transparent px-5 py-3 text-sm text-[#ededf3] placeholder-[#c3c3cc] outline-none rounded-full"
                />
                <button
                  type="submit"
                  className="mercury-btn-cobalt px-6 py-3 text-sm font-normal text-white shrink-0 mt-1 sm:mt-0"
                >
                  Request a Quote
                </button>
              </div>
            </form>

            {/* Ghost Secondary Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#our-grains"
                className="mercury-btn-ghost text-xs px-5 py-2.5 font-normal"
              >
                Explore Our Grains
              </a>
              <a
                href="#factory-process"
                className="mercury-btn-ghost text-xs px-5 py-2.5 font-normal"
              >
                Tour Our Factory
              </a>
            </div>

          </div>

        </div>

        {/* =========================================================================
            2. TRUST ELEMENTS (Legal Standards Footnote Strip)
            ========================================================================= */}
        <div className="relative z-10 w-full border-t border-b border-[#70707d]/20 bg-[#171721] py-4">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#c3c3cc]">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5266eb]"></span>
                <span className="font-normal">HACCP Standard Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5266eb]"></span>
                <span className="font-normal">ISO 22000 Food Safety</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5266eb]"></span>
                <span className="font-normal">100% Natural Grain (Tanpa Pemutih)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5266eb]"></span>
                <span className="font-normal">Sustainably Sourced Volcanic Soil</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5266eb]"></span>
                <span className="font-normal">Tera Metrologi Legal Presisi</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          3. SECTION: TERROIR & VOLCANIC HERITAGE (Text + Graphite Card Split)
          ========================================================================= */}
      <section id="heritage" className="py-20 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c3c3cc]">
              Volcanic Soil &amp; Generational Farming
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#ededf3] leading-tight">
              The Volcanic Terroir of Mount Ijen
            </h2>
            <p className="text-base text-[#c3c3cc] leading-relaxed pt-2">
              Terletak di kaki Gunung Ijen, Banyuwangi, lahan persawahan PP BUMI MAS dialiri air mineral pegunungan alami dan tanah vulkanik kaya fosfor serta kalium. Kombinasi iklim tropis lembap dan ketinggian optimal menghasilkan gabah dengan kepadatan bulir unggul, aroma harum alami, serta kadar amilosa seimbang.
            </p>
            <p className="text-base text-[#c3c3cc] leading-relaxed">
              Kami bermitra langsung dengan kelompok tani lokal Banyuwangi sejak generasi pertama, memastikan pasokan gabah kering giling (GKG) dengan transparansi harga dan penimbangan berstandar legal.
            </p>
          </div>

          <div className="lg:col-span-5">
            {/* Mercury Graphite Card: Flat, 12px radius, 32px padding, no shadow */}
            <div className="mercury-card space-y-6 border border-[#70707d]/20">
              <h3 className="text-lg font-normal text-[#ededf3]">Karakteristik Mutu Beras Bumi Mas</h3>
              
              <div className="space-y-4 text-sm">
                <div className="border-b border-[#70707d]/20 pb-3">
                  <div className="text-2xl font-normal text-[#ededf3]">1982</div>
                  <div className="text-xs text-[#c3c3cc] mt-0.5">Tahun kemitraan petani berakar di Banyuwangi</div>
                </div>

                <div className="border-b border-[#70707d]/20 pb-3">
                  <div className="text-2xl font-normal text-[#ededf3]">0%</div>
                  <div className="text-xs text-[#c3c3cc] mt-0.5">Tanpa zat pemutih, pewangi sintetis, atau pengawet kimia</div>
                </div>

                <div>
                  <div className="text-2xl font-normal text-[#ededf3]">14.0%</div>
                  <div className="text-xs text-[#c3c3cc] mt-0.5">Standar maksimum kadar air gabah teruji presisi</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(true)}
                  className="mercury-btn-ghost w-full py-2.5 text-xs text-center"
                >
                  Konsultasi Spesifikasi Pasokan
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      <SectionDivider />

      {/* =========================================================================
          4. SECTION: OUR GRAINS (3-Column Graphite Card Grid)
          ========================================================================= */}
      <section id="our-grains" className="py-20 px-4 sm:px-6 max-w-[1200px] mx-auto space-y-12">
        
        <div className="max-w-[640px] space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#c3c3cc]">
            Koleksi Beras Unggulan
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#ededf3]">
            The Grains Collection
          </h2>
          <p className="text-base text-[#c3c3cc] leading-relaxed">
            Tiga lini beras premium yang diproses khusus untuk memenuhi standar restoran, hotel, katering, serta jaringan distributor grosir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Grain 1: Cap Putri Thailand */}
          <div className="mercury-card flex flex-col justify-between space-y-6 border border-[#70707d]/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#c3c3cc] uppercase tracking-wider">Super Premium</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#272735] text-[#ededf3]">
                  Sosoh 95%
                </span>
              </div>
              <div>
                <h3 className="text-xl font-normal text-[#ededf3]">Cap Putri Thailand</h3>
                <p className="text-xs text-[#c3c3cc] mt-1">Beras kristal bening dengan tekstur pulen lembut istimewa.</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#70707d]/20 text-xs text-[#c3c3cc]">
                <div className="flex justify-between">
                  <span>Butir Patah (Broken):</span>
                  <span className="text-[#ededf3]">Maks 5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Kadar Air:</span>
                  <span className="text-[#ededf3]">13.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Derajat Sosoh:</span>
                  <span className="text-[#ededf3]">95% Bening Kristal</span>
                </div>
                <div className="flex justify-between">
                  <span>Ukuran Sak:</span>
                  <span className="text-[#ededf3]">5kg, 10kg, 20kg, 25kg, 50kg</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openQuoteWithGrain('Cap Putri Thailand (Premium)')}
              className="mercury-btn-ghost w-full py-2.5 text-xs text-center"
            >
              Minta Penawaran Putri
            </button>
          </div>

          {/* Grain 2: Cap Betet */}
          <div className="mercury-card flex flex-col justify-between space-y-6 border border-[#70707d]/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#c3c3cc] uppercase tracking-wider">Super Kepala</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#272735] text-[#ededf3]">
                  Sosoh 90%
                </span>
              </div>
              <div>
                <h3 className="text-xl font-normal text-[#ededf3]">Cap Betet</h3>
                <p className="text-xs text-[#c3c3cc] mt-1">Pilihan utama jaringan katering dan rumah makan berkebutuhan tinggi.</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#70707d]/20 text-xs text-[#c3c3cc]">
                <div className="flex justify-between">
                  <span>Butir Patah (Broken):</span>
                  <span className="text-[#ededf3]">Maks 10%</span>
                </div>
                <div className="flex justify-between">
                  <span>Kadar Air:</span>
                  <span className="text-[#ededf3]">14.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Derajat Sosoh:</span>
                  <span className="text-[#ededf3]">90% Standar Kepala</span>
                </div>
                <div className="flex justify-between">
                  <span>Ukuran Sak:</span>
                  <span className="text-[#ededf3]">10kg, 25kg, 50kg</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openQuoteWithGrain('Cap Betet (Super Kepala)')}
              className="mercury-btn-ghost w-full py-2.5 text-xs text-center"
            >
              Minta Penawaran Betet
            </button>
          </div>

          {/* Grain 3: Cap Pandan Wangi */}
          <div className="mercury-card flex flex-col justify-between space-y-6 border border-[#70707d]/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#c3c3cc] uppercase tracking-wider">Aromatic Grain</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#272735] text-[#ededf3]">
                  Wangi Alami
                </span>
              </div>
              <div>
                <h3 className="text-xl font-normal text-[#ededf3]">Cap Pandan Wangi</h3>
                <p className="text-xs text-[#c3c3cc] mt-1">Aroma pandan alami khas tanah vulkanik tanpa esens parfum sintetis.</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#70707d]/20 text-xs text-[#c3c3cc]">
                <div className="flex justify-between">
                  <span>Butir Patah (Broken):</span>
                  <span className="text-[#ededf3]">Maks 8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Kadar Air:</span>
                  <span className="text-[#ededf3]">13.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Karakteristik:</span>
                  <span className="text-[#ededf3]">Aroma Pandan Alami</span>
                </div>
                <div className="flex justify-between">
                  <span>Ukuran Sak:</span>
                  <span className="text-[#ededf3]">5kg, 25kg</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openQuoteWithGrain('Cap Pandan (Wangi Alami)')}
              className="mercury-btn-ghost w-full py-2.5 text-xs text-center"
            >
              Minta Penawaran Pandan
            </button>
          </div>

        </div>

      </section>

      <SectionDivider />

      {/* =========================================================================
          5. SECTION: FACTORY & MILLING ARCHITECTURE (5 Stage Process)
          ========================================================================= */}
      <section id="factory-process" className="py-20 px-4 sm:px-6 max-w-[1200px] mx-auto space-y-12">
        
        <div className="max-w-[640px] space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#c3c3cc]">
            Pabrik &amp; Teknologi Pengolahan
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#ededf3]">
            Precision Milling Architecture
          </h2>
          <p className="text-base text-[#c3c3cc] leading-relaxed">
            Penggilingan beras modern multi-tahap menggabungkan teknologi pembersihan getar, optical color sorting, dan pengemasan higienis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="mercury-card p-5 space-y-3 border border-[#70707d]/20">
            <div className="text-xs font-mono text-[#c3c3cc]">STAGE 01</div>
            <h4 className="font-normal text-[#ededf3] text-sm">Penerimaan &amp; Uji Mutu</h4>
            <p className="text-xs text-[#c3c3cc] leading-relaxed">
              Gabah kering giling diuji kadar air dan ditimbang dengan standar tera metrologi presisi sebelum masuk silo penyimpanan.
            </p>
          </div>

          <div className="mercury-card p-5 space-y-3 border border-[#70707d]/20">
            <div className="text-xs font-mono text-[#c3c3cc]">STAGE 02</div>
            <h4 className="font-normal text-[#ededf3] text-sm">De-stoner &amp; Husker</h4>
            <p className="text-xs text-[#c3c3cc] leading-relaxed">
              Pemisahan batu, pasir, dan sekam secara bertahap dengan vibrating screen dan rubber roll husker presisi tanpa merusak bulir.
            </p>
          </div>

          <div className="mercury-card p-5 space-y-3 border border-[#70707d]/20">
            <div className="text-xs font-mono text-[#c3c3cc]">STAGE 03</div>
            <h4 className="font-normal text-[#ededf3] text-sm">Optical Color Sorter</h4>
            <p className="text-xs text-[#c3c3cc] leading-relaxed">
              Sensor kamera optik CCD mendeteksi dan mengeliminasi bulir kuning, bintik hitam, dan kapur secara pneumatik berkecepatan tinggi.
            </p>
          </div>

          <div className="mercury-card p-5 space-y-3 border border-[#70707d]/20">
            <div className="text-xs font-mono text-[#c3c3cc]">STAGE 04</div>
            <h4 className="font-normal text-[#ededf3] text-sm">Mist Polishing &amp; Cor</h4>
            <p className="text-xs text-[#c3c3cc] leading-relaxed">
              Pengilapan kabut alami menghasilkan beras kristal bening, dilanjutkan pencampuran formulasi cor milling seragam dan stabil.
            </p>
          </div>

          <div className="mercury-card p-5 space-y-3 border border-[#70707d]/20">
            <div className="text-xs font-mono text-[#c3c3cc]">STAGE 05</div>
            <h4 className="font-normal text-[#ededf3] text-sm">Sealed Bagging &amp; DO</h4>
            <p className="text-xs text-[#c3c3cc] leading-relaxed">
              Pengemasan karung jahit higienis serta pemuatan armada truk ekspedisi untuk pengiriman ke Surabaya, Bali, dan pasar regional.
            </p>
          </div>

        </div>

      </section>

      <SectionDivider />

      {/* =========================================================================
          6. SECTION: DIRECT B2B WHOLESALE QUOTE REQUEST
          ========================================================================= */}
      <section id="quote" className="py-20 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="mercury-card border border-[#70707d]/20 p-8 sm:p-12 space-y-8">
          
          <div className="max-w-[600px] space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c3c3cc]">
              Wholesale &amp; Distribution Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal text-[#ededf3]">
              Request a Commercial Quote
            </h2>
            <p className="text-sm text-[#c3c3cc] leading-relaxed">
              Dapatkan penawaran harga beras grosir resmi langsung dari kantor pabrik PP BUMI MAS untuk pengiriman partai besar (truk/kontainer).
            </p>
          </div>

          <form onSubmit={handleQuoteSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-[#c3c3cc]">Nama Perusahaan / Toko / Pembeli:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: UD Sumber Pangan Surabaya"
                  className="w-full px-4 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full text-sm text-[#ededf3] placeholder-[#70707d] outline-none focus:border-[#5266eb]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-normal text-[#c3c3cc]">Nomor WhatsApp / Telepon:</label>
                <input
                  type="tel"
                  required
                  placeholder="08123456789"
                  className="w-full px-4 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full text-sm text-[#ededf3] placeholder-[#70707d] outline-none focus:border-[#5266eb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-[#c3c3cc]">Kota Tujuan Pengiriman:</label>
                <input
                  type="text"
                  required
                  placeholder="Surabaya / Bali / Jakarta"
                  className="w-full px-4 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full text-sm text-[#ededf3] placeholder-[#70707d] outline-none focus:border-[#5266eb]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-normal text-[#c3c3cc]">Pilihan Merek Beras:</label>
                <select
                  value={selectedGrainPreset}
                  onChange={(e) => setSelectedGrainPreset(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full text-sm text-[#ededf3] outline-none focus:border-[#5266eb]"
                >
                  <option value="Cap Putri Thailand (Premium)">Cap Putri Thailand (Premium)</option>
                  <option value="Cap Betet (Super Kepala)">Cap Betet (Super Kepala)</option>
                  <option value="Cap Pandan (Wangi Alami)">Cap Pandan (Wangi Alami)</option>
                  <option value="Beras Curah / Cor Custom">Beras Curah / Cor Custom</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-normal text-[#c3c3cc]">Estimasi Kebutuhan (Ton):</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 15 Ton"
                  className="w-full px-4 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full text-sm text-[#ededf3] placeholder-[#70707d] outline-none focus:border-[#5266eb]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal text-[#c3c3cc]">Catatan Spesifikasi Pengiriman:</label>
              <textarea
                rows={2}
                placeholder="Tuliskan ukuran kemasan sak yang diinginkan atau jadwal rencana muat armada..."
                className="w-full px-4 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-2xl text-sm text-[#ededf3] placeholder-[#70707d] outline-none focus:border-[#5266eb]"
              ></textarea>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#c3c3cc]">
                Tim penjualan PP BUMI MAS akan menghubungi Anda melalui WhatsApp dalam waktu 1x24 jam kerja.
              </p>
              <button
                type="submit"
                className="mercury-btn-cobalt px-8 py-3 text-sm font-normal text-white shrink-0"
              >
                Kirim Permintaan Penawaran
              </button>
            </div>
          </form>

        </div>
      </section>

      {/* =========================================================================
          7. FOOTER: PLANT CONTACT & REGIONAL HEADQUARTERS
          ========================================================================= */}
      <footer id="contact" className="border-t border-[#70707d]/20 bg-[#171721] py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-[#c3c3cc]">
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1e1e2a] border border-[#70707d]/30 flex items-center justify-center text-[#ededf3]">
                  <svg className="w-4 h-4 text-[#ededf3]" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
                    <circle cx="16" cy="16" r="8.5" stroke="currentColor" strokeWidth="1.4" opacity="0.75" />
                    <circle cx="16" cy="16" r="4" fill="currentColor" />
                  </svg>
                </div>
                <span className="font-normal text-base text-[#ededf3]">PP BUMI MAS</span>
              </div>
              <p className="leading-relaxed">
                Kilang penggilingan padi dan reprocessing beras premium modern di Banyuwangi, Jawa Timur. Melayani pasokan komersial skala regional.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-normal text-[#ededf3] text-sm">Alamat Kilang &amp; Gudang</h4>
              <div className="space-y-1">
                <p>Desa Wonosobo, Kec. Srono</p>
                <p>Kab. Banyuwangi, Jawa Timur 68471</p>
                <p className="font-mono text-[#c3c3cc] pt-1">Koordinat: -8.3970, 114.2650</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-normal text-[#ededf3] text-sm">Jam Operasional Layanan</h4>
              <div className="space-y-1">
                <p>Senin - Sabtu: 07.00 - 17.00 WIB</p>
                <p>Minggu: Penjadwalan Khusus Ekspedisi</p>
                <p className="text-[#c3c3cc] pt-1">Penerimaan Gabah &amp; DO Beras Jadi</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-normal text-[#ededf3] text-sm">Kontak Resmi Kantor</h4>
              <p className="leading-relaxed">
                Hubungi kantor pemasaran untuk kontrak pasokan rutin atau kemitraan suplier gabah:
              </p>
              <button
                type="button"
                onClick={() => setQuoteModalOpen(true)}
                className="mercury-btn-ghost px-4 py-2 text-xs font-normal"
              >
                Hubungi Kantor Penjualan
              </button>
            </div>

          </div>

          <div className="pt-8 border-t border-[#70707d]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#c3c3cc]">
            <p>&copy; {new Date().getFullYear()} PP BUMI MAS Wonosobo, Srono, Banyuwangi. All rights reserved.</p>
            <p className="font-mono text-[11px] text-[#70707d]">Standar Industri Pangan Alami &amp; Reprocessing Beras Indonesia</p>
          </div>

        </div>
      </footer>

      {/* =========================================================================
          8. B2B WHOLESALE QUOTE MODAL (Graphite Card / Obsidian Style)
          ========================================================================= */}
      {quoteModalOpen && (
        <div className="fixed inset-0 bg-[#171721]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e2a] border border-[#70707d]/30 rounded-[12px] max-w-lg w-full p-7 space-y-5 text-[#ededf3] relative">
            <div className="flex justify-between items-start border-b border-[#70707d]/20 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#c3c3cc] uppercase tracking-wider">
                  B2B Wholesale &amp; Supply Inquiry
                </span>
                <h3 className="text-xl font-normal text-[#ededf3]">Permintaan Penawaran Beras Bumi Mas</h3>
              </div>
              <button 
                onClick={() => setQuoteModalOpen(false)} 
                className="p-1 rounded-full text-[#c3c3cc] hover:text-[#ededf3] hover:bg-[#272735] transition"
              >
                ✕
              </button>
            </div>

            {quoteSubmitted ? (
              <div className="p-6 bg-[#272735] border border-[#5266eb]/50 rounded-[12px] text-center space-y-3">
                <div className="w-10 h-10 bg-[#5266eb] text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <h4 className="font-normal text-[#ededf3] text-base">Permintaan Penawaran Terkirim</h4>
                <p className="text-xs text-[#c3c3cc]">
                  Tim pemasaran PP BUMI MAS akan menghubungi Anda melalui nomor WhatsApp dalam waktu 1x24 jam kerja.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-normal text-[#c3c3cc]">Nama Perusahaan / Toko / Pembeli:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Toko Beras Sumber Rejeki Surabaya"
                    className="w-full px-3.5 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full text-[#ededf3] outline-none focus:border-[#5266eb] placeholder-[#70707d]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-normal text-[#c3c3cc]">Nomor WhatsApp / Telepon:</label>
                    <input
                      type="tel"
                      required
                      placeholder="08123456789"
                      className="w-full px-3.5 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full text-[#ededf3] outline-none focus:border-[#5266eb] placeholder-[#70707d]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-normal text-[#c3c3cc]">Kota Tujuan Pengiriman:</label>
                    <input
                      type="text"
                      required
                      placeholder="Surabaya / Bali / Jakarta"
                      className="w-full px-3.5 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full text-[#ededf3] outline-none focus:border-[#5266eb] placeholder-[#70707d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-normal text-[#c3c3cc]">Pilihan Merek Beras:</label>
                    <select 
                      value={selectedGrainPreset}
                      onChange={(e) => setSelectedGrainPreset(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full text-[#ededf3] outline-none focus:border-[#5266eb]"
                    >
                      <option value="Cap Putri Thailand (Premium)">Cap Putri Thailand (Premium)</option>
                      <option value="Cap Betet (Super Kepala)">Cap Betet (Super Kepala)</option>
                      <option value="Cap Pandan (Wangi Alami)">Cap Pandan (Wangi Alami)</option>
                      <option value="Beras Curah / Cor Custom">Beras Curah / Cor Custom</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-normal text-[#c3c3cc]">Estimasi Kebutuhan (Ton):</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 15 Ton"
                      className="w-full px-3.5 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full text-[#ededf3] outline-none focus:border-[#5266eb] placeholder-[#70707d]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-normal text-[#c3c3cc]">Catatan Tambahan:</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan spesifikasi kemasan sak, jadwal pengiriman, atau pertanyaan lainnya..."
                    className="w-full px-3.5 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-2xl text-[#ededf3] outline-none focus:border-[#5266eb] placeholder-[#70707d]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="mercury-btn-cobalt w-full py-3 text-xs font-normal text-white rounded-full mt-2"
                >
                  Kirim Permintaan Penawaran Resmi
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
