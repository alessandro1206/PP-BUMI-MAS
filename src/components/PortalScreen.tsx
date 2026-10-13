import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Check, 
  ExternalLink, 
  Instagram, 
  MessageCircle, 
  ShieldCheck, 
  Shield,
  Sparkles, 
  Truck, 
  Award, 
  ChevronRight,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Mail,
  Scale,
  SlidersHorizontal,
  ShoppingBag
} from 'lucide-react';
import { 
  RiceVariantSettingsModal, 
  DEFAULT_RICE_VARIANTS, 
  RiceVariant 
} from './RiceVariantSettingsModal';

export const PortalScreen: React.FC = () => {
  const { setRole, setActiveScreen, currentUser, setShowLoginModal } = useApp();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [showVariantSettings, setShowVariantSettings] = useState(false);
  const [selectedGrainPreset, setSelectedGrainPreset] = useState<string>('Cap Putri Thailand (Premium 5kg/10kg/25kg)');

  // Rice variants state loaded from localStorage with default fallbacks
  const [variants, setVariants] = useState<RiceVariant[]>(() => {
    try {
      const saved = localStorage.getItem('beras_busur_variants_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: RiceVariant) => ({
            ...item,
            categoryBadge: (!item.categoryBadge || item.categoryBadge === 'Bestseller') ? 'Beras Pilihan' : item.categoryBadge,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load variants from localStorage', err);
    }
    return DEFAULT_RICE_VARIANTS;
  });

  const handleSaveVariants = (updated: RiceVariant[]) => {
    setVariants(updated);
    try {
      localStorage.setItem('beras_busur_variants_settings', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save variants', err);
    }
    setShowVariantSettings(false);
  };

  const handleResetVariants = () => {
    setVariants(DEFAULT_RICE_VARIANTS);
    try {
      localStorage.removeItem('beras_busur_variants_settings');
    } catch (err) {
      console.error('Failed to reset variants', err);
    }
  };
  
  // Quote form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientVolume, setClientVolume] = useState('5 Ton (Truk Engkel)');
  const [clientNotes, setClientNotes] = useState('');

  const handleOpenQuote = (grainName?: string) => {
    if (grainName) setSelectedGrainPreset(grainName);
    setQuoteModalOpen(true);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);

    const waMsg = encodeURIComponent(
      `Halo Tim Sales PP BUMI MAS / Beras Busur,\n\nSaya ingin meminta penawaran harga grosir beras:\n` +
      `• Nama: ${clientName || '-'}\n` +
      `• Kota/Alamat: ${clientCity || '-'}\n` +
      `• Produk: ${selectedGrainPreset}\n` +
      `• Volume Kebutuhan: ${clientVolume}\n` +
      `• Catatan: ${clientNotes || '-'}\n\nTerima kasih.`
    );

    setTimeout(() => {
      window.open(`https://wa.me/62818334998?text=${waMsg}`, '_blank');
      setQuoteSubmitted(false);
      setQuoteModalOpen(false);
      setClientName('');
      setClientPhone('');
      setClientCity('');
      setClientNotes('');
    }, 1200);
  };

  return (
    <div className="w-full bg-[#f4f0e6] text-[#142217] font-sans selection:bg-[#1b4332] selection:text-white pb-20">
      
      {/* Container 1200px Max-Width */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20 pt-6">

        {/* =========================================================================
            1. HERO BANNER (Split Layout ~65% / ~35% with 12px radius, Green & Cream Connected)
            ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left ~65% (lg:col-span-8): Sunlit Harvest Sawah & Brand Intro */}
          <div className="lg:col-span-8 relative rounded-[12px] overflow-hidden min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-6 sm:p-10 bg-[#dfd9cb]">
            {/* Background Photographic Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1600&q=85')`,
              }}
            >
              {/* Sunlit warm overlay ensuring crisp black and white typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f14]/90 via-[#0d1f14]/45 to-transparent"></div>
            </div>

            {/* Top Brand Pill Badges */}
            <div className="relative z-10 flex flex-wrap items-center gap-2">
              <span className="bella-badge-white">
                PP BUMI MAS x BERAS BUSUR
              </span>
              <span className="bella-badge-sage">
                Banyuwangi • Jawa Timur
              </span>
            </div>

            {/* Bottom Hero Typography & CTAs */}
            <div className="relative z-10 space-y-4 max-w-xl text-white">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight-bella leading-[1.1] text-white">
                Beras Alami Banyuwangi. Pulen, Bersih, Tanpa Pengawet.
              </h1>
              
              <p className="text-sm sm:text-base font-normal tracking-tight-bella text-white/90 leading-relaxed max-w-lg">
                Dipetik dari tanah vulkanik subur kaki Gunung Ijen dan diproses langsung di kilang modern PP Bumi Mas. Menghadirkan sajian nasi hangat dan harum alami untuk meja makan keluarga Anda.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="#koleksi-beras"
                  className="bella-btn-pill inline-flex items-center justify-center space-x-2 text-xs sm:text-sm py-3 px-6 hover:bg-[#e8f1eb]"
                >
                  <span>Jelajahi Koleksi Beras</span>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href="https://www.instagram.com/berasbusur.id?rpxt=MW10dWI3aTFvMjZ2cA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bella-btn-green inline-flex items-center justify-center space-x-2 text-xs sm:text-sm py-3 px-6"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram @berasbusur.id</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right ~35% (lg:col-span-4): Featured Product Card (Deep Forest Green #1b4332) */}
          <div className="lg:col-span-4 bg-[#1b4332] text-white rounded-[12px] p-6 sm:p-8 flex flex-col justify-between space-y-6 border border-[#2d6a4f]/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="bella-badge-white text-[11px] text-[#1b4332]">
                  Varian Pilihan • Cap Putri
                </span>
                <span className="text-xs font-bold tracking-tight-bella text-[#e8f1eb] uppercase">
                  Sosoh 95%
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight-bella text-white leading-tight">
                  Cap Putri Thailand
                </h2>
                <p className="text-xs sm:text-sm font-normal tracking-tight-bella text-[#e8f1eb]/90 mt-1 leading-snug">
                  Beras kristal putih alami dengan aroma harum pandan dan tekstur pulen istimewa.
                </p>
              </div>

              {/* Product Visual Presentation */}
              <div className="relative rounded-[12px] overflow-hidden bg-white/10 p-4 border border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80" 
                  alt="Nasi Pulen Cap Putri Thailand" 
                  className="w-full h-44 object-cover rounded-[8px]"
                />
                <div className="mt-3 flex items-center justify-between text-xs font-bold tracking-tight-bella">
                  <span>Pilihan Kemasan:</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full">5kg • 10kg • 25kg • 50kg</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/20">
              <a
                href={`https://wa.me/62818334998?text=${encodeURIComponent(
                  'Halo Admin PP Bumi Mas / Beras Busur, saya ingin menanyakan harga terbaru untuk Beras Cap Putri Thailand (Kemasan 5kg, 10kg, 25kg, 50kg). Mohon info penawarannya.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full py-3 px-4 text-center font-bold text-xs sm:text-sm tracking-tight-bella transition flex items-center justify-center space-x-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Tanya Harga via WhatsApp</span>
              </a>
            </div>
          </div>

        </section>

        {/* =========================================================================
            2. PURITY & TRUST ELEMENTS STRIP (Sand Beige & Sage Green Connected)
            ========================================================================= */}
        <section className="bg-[#ffffff] rounded-[12px] p-6 sm:p-8 border border-[#1b4332]/10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            
            <div className="space-y-1">
              <div className="text-lg sm:text-xl font-bold tracking-tight-bella text-[#1b4332]">0%</div>
              <div className="text-xs font-bold tracking-tight-bella text-[#142217]">Tanpa Pemutih</div>
              <div className="text-[11px] font-normal tracking-tight-bella text-[#142217]/70">Warna putih kristal alami</div>
            </div>

            <div className="space-y-1">
              <div className="text-lg sm:text-xl font-bold tracking-tight-bella text-[#1b4332]">100%</div>
              <div className="text-xs font-bold tracking-tight-bella text-[#142217]">Padi Banyuwangi</div>
              <div className="text-[11px] font-normal tracking-tight-bella text-[#142217]/70">Tanah vulkanik kaki Ijen</div>
            </div>

            <div className="space-y-1">
              <div className="text-lg sm:text-xl font-bold tracking-tight-bella text-[#1b4332]">CCD Optik</div>
              <div className="text-xs font-bold tracking-tight-bella text-[#142217]">Optical Color Sorter</div>
              <div className="text-[11px] font-normal tracking-tight-bella text-[#142217]/70">Sortir bulir kuning &amp; rijek</div>
            </div>

            <div className="space-y-1">
              <div className="text-lg sm:text-xl font-bold tracking-tight-bella text-[#1b4332]">Maks 14%</div>
              <div className="text-xs font-bold tracking-tight-bella text-[#142217]">Kadar Air SNI</div>
              <div className="text-[11px] font-normal tracking-tight-bella text-[#142217]/70">Tahan simpan &amp; segar</div>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-1">
              <div className="text-lg sm:text-xl font-bold tracking-tight-bella text-[#1b4332]">Legal Tera</div>
              <div className="text-xs font-bold tracking-tight-bella text-[#142217]">Metrologi Presisi</div>
              <div className="text-[11px] font-normal tracking-tight-bella text-[#142217]/70">Bobot timbangan akurat</div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            3. LIFESTYLE SCENE SECTION (Warm Kitchen / Dining Counter Overlay)
            ========================================================================= */}
        <section id="tentang-busur" className="relative rounded-[12px] overflow-hidden min-h-[440px] sm:min-h-[500px] flex items-center justify-center p-6 bg-[#dfd9cb]">
          {/* Photographic Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80')`,
            }}
          >
            <div className="absolute inset-0 bg-[#0d1f14]/35 backdrop-brightness-95"></div>
          </div>

          {/* Overlaid White Card (12px radius, 24px padding, 0 shadow, max-w-xl) */}
          <div className="relative z-10 max-w-xl w-full bg-[#ffffff] rounded-[12px] p-6 sm:p-8 text-center space-y-4 border border-[#1b4332]/10">
            <span className="bella-badge-sage text-[11px]">
              Dapur Hangat Keluarga
            </span>
            
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight-bella text-[#142217] leading-tight">
              Dari Sawah Vulkanik Banyuwangi ke Meja Makan Anda
            </h2>
            
            <p className="text-xs sm:text-sm font-normal tracking-tight-bella text-[#142217]/80 leading-relaxed">
              Keluarga kami di PP Bumi Mas telah bermitra dengan kelompok tani lokal Banyuwangi selama puluhan tahun. Kami merawat setiap butir beras mulai dari penjemuran gabah kering giling hingga pengemasan higienis, agar setiap suapan nasi di rumah Anda terasa pulen, harum, dan bergizi.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a 
                href="#koleksi-beras"
                className="bella-btn-pill text-xs py-2.5 px-5 font-bold hover:bg-[#e8f1eb]"
              >
                Pilih Beras Pilihan Anda
              </a>
              <button
                type="button"
                onClick={() => handleOpenQuote()}
                className="bella-btn-green text-xs py-2.5 px-5 font-bold"
              >
                Konsultasi Pasokan Toko
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. PRODUCT GRID SECTION (Koleksi Beras Unggulan & Pengaturan Varian)
            ========================================================================= */}
        <section id="koleksi-beras" className="space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="bella-badge-sage text-[11px]">
                Katalog Produk Resmi
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight-bella text-[#142217]">
                Koleksi Beras Unggulan
              </h2>
              <p className="text-xs sm:text-sm font-normal tracking-tight-bella text-[#142217]/80">
                Diproduksi langsung di kilang modern PP Bumi Mas Banyuwangi dengan standar beras pulen alami, higienis, dan tanpa bahan pengawet.
              </p>
            </div>

            <button
              onClick={() => setShowVariantSettings(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-[#1b4332]/25 bg-[#ffffff] hover:bg-[#e8f1eb] text-xs font-bold text-[#142217] transition shadow-sm shrink-0 self-start md:self-auto"
              title="Atur teks nama, gambar, ukuran kemasan, dan harga varian beras"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1b4332]" />
              <span>Pengaturan Varian Beras</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {variants.map((v) => (
              <div 
                key={v.id}
                className="bella-card flex flex-col justify-between space-y-5 border border-[#1b4332]/10 hover:border-[#1b4332]/40 transition group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bella-badge-sage text-[10px]">{v.categoryBadge || 'Beras Pilihan'}</span>
                    <span className="text-[11px] font-bold tracking-tight-bella text-[#1b4332]/80">{v.subBadge}</span>
                  </div>

                  <div className="h-48 rounded-[8px] overflow-hidden bg-[#f4f0e6] flex items-center justify-center p-1">
                    <img 
                      src={v.image} 
                      alt={v.name} 
                      className={`w-full h-full hover:scale-105 transition duration-500 rounded-[6px] ${
                        v.image.includes('pulau-pandan') ? 'object-contain' : 'object-cover'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-bold tracking-tight-bella text-[#142217]">{v.name}</h3>
                    <p className="text-xs font-normal tracking-tight-bella text-[#142217]/70 mt-1 line-clamp-3">
                      {v.description}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs font-normal tracking-tight-bella border-t border-[#1b4332]/10 pt-2 text-[#142217]/80">
                    <div className="flex justify-between">
                      <span>Kemasan:</span>
                      <strong className="text-[#142217]">{v.sizes}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Karakteristik:</span>
                      <strong className="text-[#142217]">{v.millingGrade}</strong>
                    </div>
                  </div>

                  {/* Tersedia di Shopee dan Tokopedia */}
                  {v.availableOnMarketplace && (
                    <div className="bg-[#e8f1eb] text-[#1b4332] border border-[#1b4332]/15 px-3 py-2 rounded-[8px] flex items-center space-x-2 text-xs font-bold tracking-tight-bella">
                      <ShoppingBag className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                      <span>Tersedia di Shopee dan Tokopedia</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/62818334998?text=${encodeURIComponent(
                      `Halo Admin PP Bumi Mas / Beras Busur, saya ingin menanyakan harga terbaru untuk Beras ${v.name} (${v.sizes}). Mohon info penawaran harga grosir dan stok hari ini.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-3 rounded-full text-xs font-bold tracking-tight-bella flex items-center justify-center space-x-2 transition shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 text-white shrink-0" />
                    <span>Tanya Harga via WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* =========================================================================
            5. INSPIRATION FEATURE CARD (Instagram @berasbusur.id & Dapur Nusantara)
            ========================================================================= */}
        <section id="inspirasi-dapur" className="bg-[#dfd9cb] rounded-[12px] p-6 sm:p-10 border border-[#1b4332]/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="bella-badge-white text-[11px] text-[#1b4332]">
                Instagram @berasbusur.id
              </span>
              
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight-bella text-[#142217] leading-tight">
                Inspirasi Menu Harian &amp; Cerita Dapur Nusantara
              </h2>
              
              <p className="text-xs sm:text-sm font-normal tracking-tight-bella text-[#142217]/80 leading-relaxed">
                Nasi pulen adalah kunci kenikmatan setiap hidangan Indonesia. Ikuti akun resmi <strong>@berasbusur.id</strong> untuk mendapatkan update stok harian, tips menanak nasi harum, dan resep kreasi dapur keluarga dari seluruh pelosok negeri.
              </p>

              <div className="pt-2">
                <a
                  href="https://www.instagram.com/berasbusur.id?rpxt=MW10dWI3aTFvMjZ2cA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bella-btn-green inline-flex items-center space-x-2 text-xs sm:text-sm"
                >
                  <Instagram className="w-4 h-4 text-[#e8f1eb]" />
                  <span>Kunjungi Instagram @berasbusur.id</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#ffffff] rounded-[12px] p-3 border border-[#1b4332]/10 space-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=400&q=80" 
                  alt="Nasi Liwet Gurih" 
                  className="w-full h-28 object-cover rounded-[8px]"
                />
                <div className="text-xs font-bold tracking-tight-bella text-[#142217]">Nasi Liwet Gurih</div>
                <div className="text-[11px] text-[#142217]/70">Pulen alami dengan santan &amp; serai</div>
              </div>

              <div className="bg-[#ffffff] rounded-[12px] p-3 border border-[#1b4332]/10 space-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" 
                  alt="Nasi Kuning Tumpeng" 
                  className="w-full h-28 object-cover rounded-[8px]"
                />
                <div className="text-xs font-bold tracking-tight-bella text-[#142217]">Nasi Kuning Tumpeng</div>
                <div className="text-[11px] text-[#142217]/70">Warna kuning kunyit meresap sempurna</div>
              </div>

              <div className="bg-[#ffffff] rounded-[12px] p-3 border border-[#1b4332]/10 space-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80" 
                  alt="Nasi Uduk Betawi" 
                  className="w-full h-28 object-cover rounded-[8px]"
                />
                <div className="text-xs font-bold tracking-tight-bella text-[#142217]">Nasi Uduk Daun Pandan</div>
                <div className="text-[11px] text-[#142217]/70">Aroma pandan alami menggugah nafsu makan</div>
              </div>

              <div className="bg-[#ffffff] rounded-[12px] p-3 border border-[#1b4332]/10 space-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80" 
                  alt="Nasi Goreng Spesial" 
                  className="w-full h-28 object-cover rounded-[8px]"
                />
                <div className="text-xs font-bold tracking-tight-bella text-[#142217]">Nasi Goreng Spesial</div>
                <div className="text-[11px] text-[#142217]/70">Butir tidak menggumpal, pas untuk resto</div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            6. PRECISION MILLING ARCHITECTURE (Modern Milling 5-Stage Architecture)
            ========================================================================= */}
        <section id="kilang-proses" className="space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="bella-badge-sage text-[11px]">
              Kilang Padi Modern PP Bumi Mas
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight-bella text-[#142217]">
              Tahapan Pengolahan Beras Presisi
            </h2>
            <p className="text-xs sm:text-sm font-normal tracking-tight-bella text-[#142217]/80">
              Penggilingan padi terintegrasi berkapasitas puluhan ton per hari dengan standar higienis dan mesin sortir optik terkini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            <div className="bella-card p-5 space-y-2 border border-[#1b4332]/10">
              <span className="text-[11px] font-bold tracking-tight-bella text-[#2d6a4f]">TAHAP 01</span>
              <h4 className="font-bold text-[#142217] text-sm tracking-tight-bella">Uji Mutu Gabah</h4>
              <p className="text-xs text-[#142217]/70 leading-relaxed font-normal">
                Uji kadar air gabah kering giling (GKG) presisi dan penimbangan legal di jembatan timbang pabrik.
              </p>
            </div>

            <div className="bella-card p-5 space-y-2 border border-[#1b4332]/10">
              <span className="text-[11px] font-bold tracking-tight-bella text-[#2d6a4f]">TAHAP 02</span>
              <h4 className="font-bold text-[#142217] text-sm tracking-tight-bella">De-Stoner &amp; Husker</h4>
              <p className="text-xs text-[#142217]/70 leading-relaxed font-normal">
                Pemisahan batu, kerikil, dan sekam secara bertahap tanpa mematahkan bulir beras utama.
              </p>
            </div>

            <div className="bella-card p-5 space-y-2 border border-[#1b4332]/10">
              <span className="text-[11px] font-bold tracking-tight-bella text-[#2d6a4f]">TAHAP 03</span>
              <h4 className="font-bold text-[#142217] text-sm tracking-tight-bella">Optical Color Sorter</h4>
              <p className="text-xs text-[#142217]/70 leading-relaxed font-normal">
                Kamera optik kecepatan tinggi mendeteksi dan meniup bulir kuning, bintik hitam, dan kapur.
              </p>
            </div>

            <div className="bella-card p-5 space-y-2 border border-[#1b4332]/10">
              <span className="text-[11px] font-bold tracking-tight-bella text-[#2d6a4f]">TAHAP 04</span>
              <h4 className="font-bold text-[#142217] text-sm tracking-tight-bella">Mist Polishing</h4>
              <p className="text-xs text-[#142217]/70 leading-relaxed font-normal">
                Pengilapan kabut alami menghasilkan permukaan beras kristal bening tanpa zat pemutih sintetis.
              </p>
            </div>

            <div className="bella-card p-5 space-y-2 border border-[#1b4332]/10">
              <span className="text-[11px] font-bold tracking-tight-bella text-[#2d6a4f]">TAHAP 05</span>
              <h4 className="font-bold text-[#142217] text-sm tracking-tight-bella">Sealed Bagging</h4>
              <p className="text-xs text-[#142217]/70 leading-relaxed font-normal">
                Pengemasan karung jahit higienis dan pemuatan armada truk ekspedisi ke Surabaya, Bali, dan kota Anda.
              </p>
            </div>

          </div>

        </section>

        {/* =========================================================================
            7. DIRECT COMMERCIAL B2B QUOTE SECTION (#pesan-grosir)
            ========================================================================= */}
        <section id="pesan-grosir" className="bg-[#ffffff] rounded-[12px] p-6 sm:p-10 border border-[#1b4332]/10">
          <div className="max-w-3xl mx-auto space-y-6">
            
            <div className="text-center space-y-2">
              <span className="bella-badge-sage text-[11px]">
                Layanan B2B &amp; Grosir Resmi
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight-bella text-[#142217]">
                Minta Penawaran Harga Beras Grosir
              </h2>
              <p className="text-xs sm:text-sm font-normal tracking-tight-bella text-[#142217]/80">
                Hubungi kantor pemasaran PP Bumi Mas langsung untuk kebutuhan restoran, jaringan katering, toko sembako, dan distributor dengan harga tangan pertama.
              </p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-tight-bella text-[#142217]">Nama Anda / Nama Usaha:</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Contoh: Bu Hendra / RM Sederhana"
                    className="w-full px-4 py-2.5 rounded-full border border-[#1b4332]/20 bg-[#f4f0e6] text-xs font-normal text-[#142217] placeholder-[#142217]/40 outline-none focus:border-[#1b4332]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-tight-bella text-[#142217]">Nomor WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full px-4 py-2.5 rounded-full border border-[#1b4332]/20 bg-[#f4f0e6] text-xs font-normal text-[#142217] placeholder-[#142217]/40 outline-none focus:border-[#1b4332]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-tight-bella text-[#142217]">Kota Tujuan Kirim:</label>
                  <input
                    type="text"
                    required
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    placeholder="Contoh: Surabaya / Denpasar / Banyuwangi"
                    className="w-full px-4 py-2.5 rounded-full border border-[#1b4332]/20 bg-[#f4f0e6] text-xs font-normal text-[#142217] placeholder-[#142217]/40 outline-none focus:border-[#1b4332]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-tight-bella text-[#142217]">Pilihan Jenis Beras:</label>
                  <select
                    value={selectedGrainPreset}
                    onChange={(e) => setSelectedGrainPreset(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-[#1b4332]/20 bg-[#f4f0e6] text-xs font-normal text-[#142217] outline-none focus:border-[#1b4332]"
                  >
                    <option value="Cap Putri Thailand (Premium 5kg/10kg/25kg)">Cap Putri Thailand (Premium 5kg/10kg/25kg)</option>
                    <option value="Pulau Pandan (Beras Punel Mutu Pilihan)">Pulau Pandan (Beras Punel Mutu Pilihan)</option>
                    <option value="Sri Arum (Beras Wangi & Pulen)">Sri Arum (Beras Wangi & Pulen)</option>
                    <option value="Cap Betet Super Kepala (10kg/20kg/25kg)">Cap Betet Super Kepala (10kg/20kg/25kg)</option>
                  </select>
                </div>

              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold tracking-tight-bella text-[#142217]">Estimasi Volume Kebutuhan:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['1 Ton (Pickup)', '5 Ton (Engkel)', '12 Ton (CDD Long)', '25 Ton (Tronton)'].map((vol) => (
                    <button
                      type="button"
                      key={vol}
                      onClick={() => setClientVolume(vol)}
                      className={`py-2 px-3 rounded-full text-xs font-bold tracking-tight-bella border transition ${
                        clientVolume === vol 
                          ? 'bg-[#1b4332] text-white border-[#1b4332]' 
                          : 'bg-[#f4f0e6] text-[#142217] border-[#1b4332]/20 hover:border-[#1b4332]'
                      }`}
                    >
                      {vol}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={quoteSubmitted}
                  className="bella-btn-green py-3 px-8 text-xs sm:text-sm font-bold inline-flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{quoteSubmitted ? 'Menghubungkan ke WhatsApp...' : 'Kirim Permintaan ke WhatsApp Sales'}</span>
                </button>
              </div>
            </form>

          </div>
        </section>

        {/* =========================================================================
            8. FOOTER (Minimal Sand Beige & White Surface)
            ========================================================================= */}
        <footer className="bg-[#ffffff] rounded-[12px] p-6 sm:p-10 border border-[#1b4332]/10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight-bella text-[#142217]">PP BUMI MAS</span>
                <span className="bella-badge-sage text-[10px]">BERAS BUSUR</span>
              </div>
              <p className="text-xs font-normal tracking-tight-bella text-[#142217]/70 max-w-sm leading-relaxed">
                Pabrik penggilingan dan pemrosesan beras modern di Banyuwangi, Jawa Timur. Menghasilkan beras pulen bermutu tinggi tanpa zat kimia untuk keluarga dan mitra bisnis Anda.
              </p>
              <div className="pt-1">
                <a
                  href="https://www.instagram.com/berasbusur.id?rpxt=MW10dWI3aTFvMjZ2cA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs font-bold tracking-tight-bella text-[#2d6a4f] hover:text-[#1b4332] hover:underline"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Ikuti Akun Resmi @berasbusur.id</span>
                </a>
              </div>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold bg-[#e8f1eb] text-[#1b4332] px-2 py-0.5 rounded-full border border-[#1b4332]/20">
                  Standar Mutu SNI
                </span>
                <span className="text-[10px] font-bold bg-[#e8f1eb] text-[#1b4332] px-2 py-0.5 rounded-full border border-[#1b4332]/20">
                  Sertifikat Halal
                </span>
                <span className="text-[10px] font-bold bg-[#e8f1eb] text-[#1b4332] px-2 py-0.5 rounded-full border border-[#1b4332]/20">
                  Izin Edar Kementan
                </span>
                <span className="text-[10px] font-bold bg-[#e8f1eb] text-[#1b4332] px-2 py-0.5 rounded-full border border-[#1b4332]/20">
                  Merek Terdaftar
                </span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs tracking-tight-bella">
              <div className="font-bold text-[#142217] uppercase text-[11px]">Navigasi Utama</div>
              <ul className="space-y-1.5 font-normal text-[#142217]/80">
                <li><a href="#koleksi-beras" className="hover:text-[#1b4332]">Koleksi Beras</a></li>
                <li><a href="#tentang-busur" className="hover:text-[#1b4332]">Tentang Kami</a></li>
                <li><a href="#kilang-proses" className="hover:text-[#1b4332]">Kilang &amp; Proses</a></li>
                <li><a href="#inspirasi-dapur" className="hover:text-[#1b4332]">Inspirasi Dapur</a></li>
                <li><a href="#pesan-grosir" className="hover:text-[#1b4332]">Penawaran Grosir</a></li>
                <li className="pt-2 border-t border-[#1b4332]/10">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser) {
                        setActiveScreen('SCREEN_WORKSTATIONS');
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className="text-[#1b4332] font-bold hover:underline flex items-center space-x-1.5 py-1 text-xs"
                    title="Akses Konsol Staf Pabrik & ERP"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#1b4332]" />
                    <span>{currentUser ? 'Buka Stasiun Kerja ERP' : 'Login Staf Pabrik'}</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-2 text-xs tracking-tight-bella">
              <div className="font-bold text-[#142217] uppercase text-[11px]">Lokasi Pabrik &amp; Kontak</div>
              <p className="font-normal text-[#142217]/80 leading-relaxed">
                Wonosobo, Kec. Srono, Kabupaten Banyuwangi, Jawa Timur 68471
              </p>
              <p className="font-normal text-[#142217]/80">
                WhatsApp: +62 818-334-998
              </p>
              <p className="font-normal text-[#142217]/80">
                Instagram: @berasbusur.id
              </p>
            </div>

          </div>

          <div className="pt-6 border-t border-[#1b4332]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-normal tracking-tight-bella text-[#142217]/60 text-center sm:text-left">
            <div>
              &copy; {new Date().getFullYear()} PP BUMI MAS • Beras Busur. Hak Cipta Dilindungi Undang-Undang.
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1">
              <span>Banyuwangi, Jawa Timur</span>
              <span>•</span>
              <span>Standar Mutu SNI</span>
              <span>•</span>
              <span>Sertifikat Halal</span>
              <span>•</span>
              <span>Izin Edar Kementan</span>
              <span>•</span>
              <span>Merek Terdaftar</span>
            </div>
          </div>
        </footer>

      </div>

      {/* =========================================================================
          QUOTE MODAL (Accessible if triggered directly via buttons)
          ========================================================================= */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0d1f14]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-[12px] max-w-lg w-full p-6 sm:p-8 space-y-6 border border-[#1b4332]/20">
            <div className="flex items-center justify-between border-b border-[#1b4332]/10 pb-3">
              <div>
                <span className="bella-badge-sage text-[10px]">Beras Busur</span>
                <h3 className="text-xl font-bold tracking-tight-bella text-[#142217] mt-1">
                  Minta Penawaran Resmi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuoteModalOpen(false)}
                className="w-8 h-8 rounded-full border border-[#1b4332]/20 flex items-center justify-center text-sm font-bold hover:bg-[#e8f1eb]"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold tracking-tight-bella text-[#142217]">Nama Lengkap / Perusahaan:</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Contoh: Pak Anton (UD Pangan Makmur)"
                  className="w-full px-4 py-2.5 rounded-full border border-[#1b4332]/20 bg-[#f4f0e6] text-xs font-normal text-[#142217] outline-none focus:border-[#1b4332]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold tracking-tight-bella text-[#142217]">Nomor WhatsApp Aktif:</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-4 py-2.5 rounded-full border border-[#1b4332]/20 bg-[#f4f0e6] text-xs font-normal text-[#142217] outline-none focus:border-[#1b4332]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold tracking-tight-bella text-[#142217]">Kota Tujuan Kirim:</label>
                <input
                  type="text"
                  required
                  value={clientCity}
                  onChange={(e) => setClientCity(e.target.value)}
                  placeholder="Contoh: Surabaya / Denpasar / Malang"
                  className="w-full px-4 py-2.5 rounded-full border border-[#1b4332]/20 bg-[#f4f0e6] text-xs font-normal text-[#142217] outline-none focus:border-[#1b4332]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold tracking-tight-bella text-[#142217]">Produk Pilihan:</label>
                <input
                  type="text"
                  readOnly
                  value={selectedGrainPreset}
                  className="w-full px-4 py-2.5 rounded-full border border-[#1b4332]/20 bg-[#dfd9cb] text-xs font-bold text-[#142217]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="bella-btn-pill py-2 px-4 text-xs font-bold hover:bg-[#e8f1eb]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={quoteSubmitted}
                  className="bella-btn-green py-2 px-6 text-xs font-bold"
                >
                  {quoteSubmitted ? 'Menghubungkan...' : 'Lanjutkan ke WhatsApp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rice Variant Settings Modal */}
      <RiceVariantSettingsModal
        isOpen={showVariantSettings}
        onClose={() => setShowVariantSettings(false)}
        variants={variants}
        onSave={handleSaveVariants}
        onReset={handleResetVariants}
      />

    </div>
  );
};
