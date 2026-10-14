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
  ShoppingBag,
  CheckCircle2,
  Filter,
  Layers,
  Cpu,
  Droplets
} from 'lucide-react';
import { 
  RiceVariantSettingsModal, 
  DEFAULT_RICE_VARIANTS, 
  RiceVariant 
} from './RiceVariantSettingsModal';

// Logo Resmi Kementerian Pertanian (Padi dan Kapas)
export const KementanLogo: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    role="img"
    aria-label="Logo Kementerian Pertanian RI (Padi dan Kapas)"
  >
    {/* Lingkaran Luar Hijau Kementan & Lis Emas */}
    <circle cx="50" cy="50" r="48" fill="#1b4332" stroke="#d4af37" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="44" fill="#0f291e" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2.5 2" />

    {/* Tangkai Padi Kiri (Kuning Keemasan) */}
    <path d="M 50,82 C 38,76 28,64 27,48 C 26,35 34,24 45,18" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Butir-Butir Bulir Padi Kiri */}
    <ellipse cx="44" cy="20" rx="3.2" ry="5.5" transform="rotate(-30 44 20)" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
    <ellipse cx="38" cy="26" rx="3.2" ry="5.8" transform="rotate(-42 38 26)" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
    <ellipse cx="32" cy="33" rx="3.2" ry="6" transform="rotate(-54 32 33)" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
    <ellipse cx="28" cy="42" rx="3.2" ry="6" transform="rotate(-68 28 42)" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
    <ellipse cx="27" cy="51" rx="3.2" ry="6" transform="rotate(-82 27 51)" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
    <ellipse cx="29" cy="60" rx="3.2" ry="5.8" transform="rotate(-98 29 60)" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
    <ellipse cx="34" cy="69" rx="3.2" ry="5.5" transform="rotate(-114 34 69)" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
    <ellipse cx="42" cy="76" rx="3.2" ry="5" transform="rotate(-130 42 76)" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />

    {/* Tangkai Kapas Kanan (Hijau & Bunga Kapas Putih) */}
    <path d="M 50,82 C 62,76 72,64 73,48 C 74,35 66,24 55,18" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Kuntum Bunga Kapas Kanan */}
    <circle cx="56" cy="20" r="4.2" fill="#ffffff" stroke="#15803d" strokeWidth="1" />
    <path d="M 52.5,22 Q 56,25.5 59.5,22" fill="#15803d" />
    <circle cx="63" cy="27" r="4.6" fill="#ffffff" stroke="#15803d" strokeWidth="1" />
    <path d="M 59.5,29.5 Q 63,33.5 66.5,29.5" fill="#15803d" />
    <circle cx="70" cy="37" r="5" fill="#ffffff" stroke="#15803d" strokeWidth="1" />
    <path d="M 66,40.5 Q 70,44.5 74,40.5" fill="#15803d" />
    <circle cx="72" cy="49" r="5" fill="#ffffff" stroke="#15803d" strokeWidth="1" />
    <path d="M 68,52.5 Q 72,56.5 76,52.5" fill="#15803d" />
    <circle cx="69" cy="61" r="4.8" fill="#ffffff" stroke="#15803d" strokeWidth="1" />
    <path d="M 65,64 Q 69,67.5 73,64" fill="#15803d" />
    <circle cx="60" cy="71" r="4.4" fill="#ffffff" stroke="#15803d" strokeWidth="1" />
    <path d="M 56.5,73.5 Q 60,77 63.5,73.5" fill="#15803d" />

    {/* Pita Pengikat Merah Emas di Bawah */}
    <path d="M 41,80 Q 50,86 59,80 Q 50,84 41,80 Z" fill="#dc2626" stroke="#fbbf24" strokeWidth="0.8" />
    <circle cx="50" cy="82" r="2.8" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
    <path d="M 43,83 L 38,89 L 44,87 Z" fill="#dc2626" />
    <path d="M 57,83 L 62,89 L 56,87 Z" fill="#dc2626" />

    {/* Bintang Emas di Puncak Logo */}
    <polygon points="50,20 51.8,24.8 56.8,24.8 52.8,27.8 54.4,32.4 50,29.5 45.6,32.4 47.2,27.8 43.2,24.8 48.2,24.8" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />

    {/* Lambang Daun Tunas Pertanian Hijau Emas di Bagian Tengah */}
    <path d="M 50,33 C 44,42 42,54 50,68 C 58,54 56,42 50,33 Z" fill="#22c55e" stroke="#fbbf24" strokeWidth="1" />
    <path d="M 50,37 L 50,66" stroke="#fbbf24" strokeWidth="1" />
    <path d="M 45,49 Q 50,46 55,49" stroke="#fbbf24" strokeWidth="0.9" fill="none" />
    <path d="M 44,56 Q 50,53 56,56" stroke="#fbbf24" strokeWidth="0.9" fill="none" />
  </svg>
);

export const PortalScreen: React.FC = () => {
  const { currentUser, setShowLoginModal, setActiveScreen } = useApp();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [showVariantSettings, setShowVariantSettings] = useState(false);
  const [selectedGrainPreset, setSelectedGrainPreset] = useState<string>('Cap Putri Thailand (Premium 5kg/10kg/25kg)');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

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
            sizes: item.sizes ? item.sizes.replace(/,?\s*50\s*kg/gi, '').trim() : item.sizes,
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

  // Interactive B2B Wholesale Calculator state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientVolume, setClientVolume] = useState('5 Ton (Truk Engkel)');
  const [selectedPackaging, setSelectedPackaging] = useState('25kg');
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
      `• Produk Pilihan: ${selectedGrainPreset}\n` +
      `• Ukuran Kemasan: ${selectedPackaging}\n` +
      `• Volume Kebutuhan: ${clientVolume}\n` +
      `• Catatan Khusus: ${clientNotes || '-'}\n\nTerima kasih.`
    );

    setTimeout(() => {
      window.open(`https://wa.me/62818334998?text=${waMsg}`, '_blank');
      setQuoteSubmitted(false);
      setQuoteModalOpen(false);
      setClientName('');
      setClientPhone('');
      setClientCity('');
      setClientNotes('');
    }, 1000);
  };

  // Filtered variants
  const filteredVariants = variants.filter(v => {
    if (activeCategoryFilter === 'ALL') return true;
    if (activeCategoryFilter === 'PULEN') return v.subBadge.toLowerCase().includes('punel') || v.subBadge.toLowerCase().includes('pulen') || v.name.toLowerCase().includes('putri');
    if (activeCategoryFilter === 'WANGI') return v.description.toLowerCase().includes('wangi') || v.name.toLowerCase().includes('arum') || v.name.toLowerCase().includes('pandan');
    if (activeCategoryFilter === 'SUPER') return v.subBadge.toLowerCase().includes('super') || v.categoryBadge.toLowerCase().includes('super');
    return true;
  });

  return (
    <div className="w-full bg-[#faf8f5] text-[#18181b] font-sans-editorial selection:bg-[#2d5a43] selection:text-white pb-24">
      
      {/* 1240px Centered Canvas */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-20 sm:space-y-28 pt-4">

        {/* =========================================================================
            1. HERO SECTION (Magazine Editorial Minimalist)
            ========================================================================= */}
        <section className="relative pt-6 sm:pt-10">
          <div className="rice-card p-6 sm:p-12 lg:p-16 bg-[#ffffff] relative overflow-hidden">
            
            {/* Top Micro-Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-8 border-b border-[#18181b]/8">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#2d5a43] animate-pulse"></span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#52525b]">
                  KILANG PADI MODERN BANYUWANGI • SEJAK 1988
                </span>
              </div>
              <div className="rice-badge-sage text-[10px]">
                Bulir Alami Lereng Gunung Ijen
              </div>
            </div>

            {/* Editorial Headline & Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-8 sm:pt-12">
              
              {/* Left Column: Editorial Manifesto */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                <div className="space-y-3">
                  <div className="text-xs uppercase font-mono tracking-[0.2em] text-[#2d5a43] font-semibold">
                    The Artisanal Rice Mill Atelier
                  </div>
                  <h1 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#18181b] leading-[1.08]">
                    <span className="italic font-normal text-[#2d5a43]">Seni Mengolah Bulir,</span><br />
                    Kemurnian Beras dari Kaki Gunung Ijen.
                  </h1>
                </div>

                <p className="text-sm sm:text-base text-[#52525b] leading-relaxed max-w-xl font-normal">
                  Diolah dari gabah varietas unggul petani lokal Banyuwangi dengan kilang suhu dingin terkontrol dan sensor optik multi-kanal. Menghasilkan beras kristal pulen alami tanpa pemutih, tanpa pengawet, dan tanpa pewangi sintetis.
                </p>

                {/* Key Technical Purity Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 text-center">
                    <div className="font-bold text-[#2d5a43] text-sm sm:text-base">95%</div>
                    <div className="text-[10px] text-[#52525b] uppercase mt-0.5">Derajat Sosoh</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 text-center">
                    <div className="font-bold text-[#2d5a43] text-sm sm:text-base">&lt; 14%</div>
                    <div className="text-[10px] text-[#52525b] uppercase mt-0.5">Kadar Air SNI</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 text-center">
                    <div className="font-bold text-[#2d5a43] text-sm sm:text-base">&lt; 5%</div>
                    <div className="text-[10px] text-[#52525b] uppercase mt-0.5">Broken Grain</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 text-center">
                    <div className="font-bold text-[#2d5a43] text-sm sm:text-base">0%</div>
                    <div className="text-[10px] text-[#52525b] uppercase mt-0.5">Zat Kimia</div>
                  </div>
                </div>

                {/* Dual Call To Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <a
                    href="#koleksi-beras"
                    className="rice-pill-btn text-xs sm:text-sm py-3 px-6 shadow-xs"
                  >
                    <span>Jelajahi Koleksi Beras</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#kalkulator-b2b"
                    className="rice-pill-outline text-xs sm:text-sm py-3 px-6 shadow-xs"
                  >
                    <Scale className="w-4 h-4 text-[#2d5a43]" />
                    <span>Kalkulator Grosir &amp; Sampel B2B</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-[#18181b]/10 bg-[#f3efea] shadow-md group">
                  <img 
                    src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=85" 
                    alt="Bulir Beras Putih Pilihan Banyuwangi"
                    className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18181b]/80 via-transparent to-transparent"></div>
                  
                  {/* Floating Certified Compliance Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#ffffff]/95 backdrop-blur-md border border-[#18181b]/10 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#eaf2ec] border border-[#2d5a43]/20 flex items-center justify-center shrink-0">
                        <KementanLogo className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#18181b] tracking-tight">
                          Standar Mutu Beras Kementan No. 22 / 2025
                        </div>
                        <div className="text-[11px] text-[#52525b] mt-0.5">
                          Tersertifikasi Mutu Premium &amp; Uji Laboratorium Terakreditasi
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            2. METRICS & TRUST ELEMENTS STRIP (Artisanal Precision Data)
            ========================================================================= */}
        <section className="rice-card p-6 sm:p-10 bg-[#ffffff]">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#18181b]/8">
            
            <div className="space-y-1 text-center pt-3 md:pt-0">
              <div className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#2d5a43]">0%</div>
              <div className="text-xs font-bold text-[#18181b]">Tanpa Zat Pemutih</div>
              <div className="text-[11px] text-[#52525b]">Warna kristal putih alami</div>
            </div>

            <div className="space-y-1 text-center pt-3 md:pt-0 md:pl-6">
              <div className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#2d5a43]">95%</div>
              <div className="text-xs font-bold text-[#18181b]">Derajat Sosoh Ekstra</div>
              <div className="text-[11px] text-[#52525b]">Kulit ari terkelupas bersih</div>
            </div>

            <div className="space-y-1 text-center pt-3 md:pt-0 md:pl-6">
              <div className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#2d5a43]">&lt; 5%</div>
              <div className="text-xs font-bold text-[#18181b]">Butir Patah (Broken)</div>
              <div className="text-[11px] text-[#52525b]">Sortir sensor optik kamera</div>
            </div>

            <div className="space-y-1 text-center pt-3 md:pt-0 md:pl-6">
              <div className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#2d5a43]">100%</div>
              <div className="text-xs font-bold text-[#18181b]">Padi Asli Banyuwangi</div>
              <div className="text-[11px] text-[#52525b]">Tanah vulkanik subur Ijen</div>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-1 text-center pt-3 md:pt-0 md:pl-6">
              <div className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#2d5a43]">450+</div>
              <div className="text-xs font-bold text-[#18181b]">Kelompok Tani Mitra</div>
              <div className="text-[11px] text-[#52525b]">Kemitraan panen terpercaya</div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            3. TERROIR & CRAFTSMANSHIP (Asymmetric Bento Grid)
            ========================================================================= */}
        <section id="terroir-proses" className="space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="rice-badge-sage text-[10px]">
              Terroir &amp; Kilang Presisi
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#18181b] tracking-tight">
              Kisah Kesuburan Tanah &amp; Presisi Mesin
            </h2>
            <p className="text-xs sm:text-sm text-[#52525b]">
              Perpaduan kebaikan alam lereng Ijen dan teknologi penggilingan modern untuk menjaga cita rasa asli padi nusantara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento 1 (Large 8 cols): Volcanic Soil & Mountain Water */}
            <div className="md:col-span-8 rice-card p-6 sm:p-10 relative overflow-hidden bg-[#ffffff] flex flex-col justify-between min-h-[340px]">
              <div className="space-y-3 z-10 max-w-lg">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#2d5a43] font-bold">
                  BANYUWANGI VOLCANIC TERROIR
                </span>
                <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#18181b]">
                  Tanah Vulkanik Subur &amp; Mata Air Alami
                </h3>
                <p className="text-xs sm:text-sm text-[#52525b] leading-relaxed">
                  Lahan persawahan di kaki Gunung Ijen (Rogojampi, Blimbingsari, Srono) kaya mineral hara vulkanik alami dan dialiri mata air pegunungan yang jernih. Memberikan nutrisi murni bagi tanaman padi sehingga menghasilkan bulir yang pulen, beraroma manis alami, dan kaya gizi.
                </p>
              </div>

              <div className="pt-6 flex flex-wrap items-center gap-3 z-10 text-xs font-semibold text-[#18181b]">
                <div className="px-3 py-1.5 rounded-full bg-[#faf8f5] border border-[#18181b]/10 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2d5a43]" />
                  <span>Srono &amp; Rogojampi, Banyuwangi</span>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-[#faf8f5] border border-[#18181b]/10 flex items-center space-x-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#2d5a43]" />
                  <span>Irigasi Mata Air Pegunungan Bebas Polutan</span>
                </div>
              </div>
            </div>

            {/* Bento 2 (4 cols): Cold Temperature Milling */}
            <div className="md:col-span-4 rice-card p-6 sm:p-8 bg-[#ffffff] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaf2ec] text-[#2d5a43] flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="font-serif-editorial text-xl font-normal text-[#18181b]">
                  Penggilingan Dingin 3-Tahap
                </h4>
                <p className="text-xs text-[#52525b] leading-relaxed">
                  Suhu mesin dipantau stabil di bawah 38°C selama proses pengupasan dan pemolesan agar struktur pati tidak rusak dan aroma alami tidak hilang.
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#2d5a43] font-semibold border-t border-[#18181b]/8 pt-3">
                Mencegah Butir Retak &amp; Menjaga Nutrisi
              </div>
            </div>

            {/* Bento 3 (4 cols): High-End Optical Color Sorter */}
            <div className="md:col-span-4 rice-card p-6 sm:p-8 bg-[#ffffff] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaf2ec] text-[#2d5a43] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-serif-editorial text-xl font-normal text-[#18181b]">
                  Optical Color Sorter 64-Channel
                </h4>
                <p className="text-xs text-[#52525b] leading-relaxed">
                  Sensor optik berkecepatan tinggi menembakkan katup udara mikro untuk menyingkirkan bulir kuning, bintik hitam, dan bulir kapur dalam hitungan milidetik.
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#2d5a43] font-semibold border-t border-[#18181b]/8 pt-3">
                Toleransi Broken &lt; 5% Standar Ekspor
              </div>
            </div>

            {/* Bento 4 (4 cols): De-stoner & Pre-cleaner */}
            <div className="md:col-span-4 rice-card p-6 sm:p-8 bg-[#ffffff] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaf2ec] text-[#2d5a43] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-serif-editorial text-xl font-normal text-[#18181b]">
                  De-Stoner Pemisah Kerikil
                </h4>
                <p className="text-xs text-[#52525b] leading-relaxed">
                  Menggunakan sistem getar densitas massa jenis dan hisap udara ganda sehingga beras 100% bebas dari kerikil, gabah kosong, dan benda asing.
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#2d5a43] font-semibold border-t border-[#18181b]/8 pt-3">
                Higienis &amp; Aman untuk Rice Cooker
              </div>
            </div>

            {/* Bento 5 (4 cols): Jaminan Mutu Kementan */}
            <div className="md:col-span-4 rice-card p-6 sm:p-8 bg-[#2d5a43] text-white flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <KementanLogo className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-serif-editorial text-xl font-normal text-white">
                  Kementan No. 22 / 2025
                </h4>
                <p className="text-xs text-white/90 leading-relaxed">
                  Semua lini produk Beras Busur telah memenuhi parameter kualitas beras konsumsi Kementerian Pertanian RI tanpa kompromi.
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#d4af37] font-semibold border-t border-white/15 pt-3">
                Lolos Uji Kimiawi &amp; Sertifikat Halal
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            4. THE GRAIN ATELIER (Koleksi Beras Busur & Filter Kategori)
            ========================================================================= */}
        <section id="koleksi-beras" className="space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="rice-badge-sage text-[10px]">
                Koleksi Pilihan Kilang
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#18181b] tracking-tight">
                Koleksi Bulir Beras Busur
              </h2>
              <p className="text-xs sm:text-sm text-[#52525b]">
                Pilihan beras bermutu tinggi untuk kebutuhan rumah tangga, rumah makan istimewa, katering, dan distribusi grosir.
              </p>
            </div>

            {/* Filter Tabs & Customizer Modal Trigger */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <div className="flex items-center space-x-1.5 p-1 rounded-full bg-[#ffffff] border border-[#18181b]/10 shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('ALL')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    activeCategoryFilter === 'ALL'
                      ? 'bg-[#2d5a43] text-white'
                      : 'text-[#52525b] hover:text-[#18181b]'
                  }`}
                >
                  Semua ({variants.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('PULEN')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    activeCategoryFilter === 'PULEN'
                      ? 'bg-[#2d5a43] text-white'
                      : 'text-[#52525b] hover:text-[#18181b]'
                  }`}
                >
                  Pulen Alami
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('WANGI')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    activeCategoryFilter === 'WANGI'
                      ? 'bg-[#2d5a43] text-white'
                      : 'text-[#52525b] hover:text-[#18181b]'
                  }`}
                >
                  Wangi Pandan
                </button>
              </div>

              <button
                onClick={() => setShowVariantSettings(true)}
                className="rice-pill-outline text-xs py-1.5 px-3 shadow-xs"
                title="Atur teks nama, gambar, ukuran kemasan, dan harga varian beras"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#2d5a43]" />
                <span className="hidden sm:inline">Kelola Varian</span>
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVariants.map((v) => (
              <div 
                key={v.id}
                className="rice-card p-5 flex flex-col justify-between space-y-4 bg-[#ffffff] group"
              >
                <div className="space-y-3.5">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="rice-badge-sage text-[10px]">{v.categoryBadge || 'Beras Pilihan'}</span>
                    <span className="text-[11px] font-mono font-semibold text-[#2d5a43]">{v.subBadge}</span>
                  </div>

                  {/* Product Image Frame */}
                  <div className="h-44 rounded-xl overflow-hidden bg-[#faf8f5] border border-[#18181b]/6 flex items-center justify-center p-2 relative">
                    <img 
                      src={v.image} 
                      alt={v.name} 
                      className={`w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 ${
                        v.image.includes('pulau-pandan') ? 'object-contain' : 'object-cover'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif-editorial text-lg font-normal text-[#18181b] tracking-tight">{v.name}</h3>
                    <p className="text-xs text-[#52525b] mt-1 line-clamp-2 leading-relaxed">
                      {v.description}
                    </p>
                  </div>

                  {/* Spec Strip */}
                  <div className="space-y-1.5 text-xs border-t border-[#18181b]/8 pt-2.5 text-[#52525b] font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] uppercase">Kemasan:</span>
                      <strong className="text-[#18181b] font-semibold">{v.sizes}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] uppercase">Mutu:</span>
                      <strong className="text-[#2d5a43] font-semibold">{v.millingGrade}</strong>
                    </div>
                  </div>

                  {/* Marketplace availability tag */}
                  {v.availableOnMarketplace && (
                    <div className="bg-[#eaf2ec]/70 text-[#2d5a43] border border-[#2d5a43]/15 px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 text-[11px] font-semibold">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#2d5a43] shrink-0" />
                      <span>Ready di Shopee &amp; Tokopedia</span>
                    </div>
                  )}
                </div>

                {/* Direct Order Actions */}
                <div className="pt-2 border-t border-[#18181b]/8 space-y-2">
                  <a
                    href={`https://wa.me/62818334998?text=${encodeURIComponent(
                      `Halo Admin PP Bumi Mas / Beras Busur, saya ingin menanyakan harga terbaru untuk Beras ${v.name} (${v.sizes}). Mohon info penawaran harga grosir dan ketersediaan stok hari ini.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rice-pill-btn text-xs py-2.5 px-3 text-center flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Pesan via WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenQuote(v.name)}
                    className="w-full text-center text-[11px] font-semibold text-[#52525b] hover:text-[#2d5a43] transition py-0.5"
                  >
                    Minta Penawaran Resmi &amp; Sampel
                  </button>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* =========================================================================
            5. STANDAR MUTU RESMI KEMENTAN (Permentan No. 22 Tahun 2025)
            ========================================================================= */}
        <section id="standar-mutu" className="rice-card p-6 sm:p-12 bg-[#ffffff] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-[#faf8f5] border border-[#d4af37]/40 flex items-center justify-center p-2 shadow-xs">
                <KementanLogo className="w-16 h-16" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#2d5a43] font-bold">
                  REGULASI RESMI
                </div>
                <h3 className="font-serif-editorial text-2xl font-normal text-[#18181b]">
                  Standar Mutu Beras Kementan No. 22 Tahun 2025
                </h3>
                <p className="text-xs text-[#52525b] leading-relaxed">
                  Peraturan Menteri Pertanian RI tentang Standar Mutu Beras Konsumsi untuk menjamin kesehatan, keamanan pangan, dan keaslian varietas padi nasional.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#18181b]">
                  <CheckCircle2 className="w-4 h-4 text-[#2d5a43]" />
                  <span>Derajat Sosoh Minimum 95%</span>
                </div>
                <p className="text-[11px] text-[#52525b] leading-relaxed">
                  Seluruh lapisan bekatul terkupas bersih, menghasilkan butir beras kristal bening alami tanpa bantuan pemutih kimia.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#18181b]">
                  <CheckCircle2 className="w-4 h-4 text-[#2d5a43]" />
                  <span>Kadar Air Maksimal 14%</span>
                </div>
                <p className="text-[11px] text-[#52525b] leading-relaxed">
                  Pengeringan gabah terkontrol di bawah 14% mencegah jamur, apek, dan perkembangbiakan kutu selama penyimpanan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#18181b]">
                  <CheckCircle2 className="w-4 h-4 text-[#2d5a43]" />
                  <span>Bebas Residu Pestisida &amp; Logam Berat</span>
                </div>
                <p className="text-[11px] text-[#52525b] leading-relaxed">
                  Lolos uji laboratorium keamanan pangan pangan segar asal tumbuhan (PSAT) terakreditasi resmi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#18181b]">
                  <CheckCircle2 className="w-4 h-4 text-[#2d5a43]" />
                  <span>0% Pewangi Sintetis &amp; Pelicin Kimia</span>
                </div>
                <p className="text-[11px] text-[#52525b] leading-relaxed">
                  Aroma wangi murni berasal dari genetik varietas padi (seperti Pandan Wangi &amp; Mentik), bukan semprotan esens kimia.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            6. 5-STAGE PRECISION MILLING PROCESS (Step-by-step Architecture)
            ========================================================================= */}
        <section className="space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="rice-badge-sage text-[10px]">
              Kilang Padi PP Bumi Mas
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#18181b] tracking-tight">
              5 Tahapan Pengolahan Kilang Modern
            </h2>
            <p className="text-xs sm:text-sm text-[#52525b]">
              Alur pemrosesan gabah basah hingga menjadi beras siap saji berstandar higienis tinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            <div className="rice-card p-5 bg-[#ffffff] space-y-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#2d5a43] bg-[#eaf2ec] px-2 py-0.5 rounded-full">
                01. SELEKSI GABAH
              </span>
              <h4 className="font-serif-editorial text-base font-normal text-[#18181b]">
                QC Timbangan STT
              </h4>
              <p className="text-xs text-[#52525b] leading-relaxed">
                Uji kadar air digital dan penimbangan legal di jembatan timbang terkalibrasi metrologi resmi.
              </p>
            </div>

            <div className="rice-card p-5 bg-[#ffffff] space-y-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#2d5a43] bg-[#eaf2ec] px-2 py-0.5 rounded-full">
                02. PEMBERSIHAN
              </span>
              <h4 className="font-serif-editorial text-base font-normal text-[#18181b]">
                De-Stoner Pemisah Batu
              </h4>
              <p className="text-xs text-[#52525b] leading-relaxed">
                Penyaringan debu, jerami, dan kerikil dengan pemisah gravitasi densitas massa jenis.
              </p>
            </div>

            <div className="rice-card p-5 bg-[#ffffff] space-y-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#2d5a43] bg-[#eaf2ec] px-2 py-0.5 rounded-full">
                03. HUSK &amp; POLISH
              </span>
              <h4 className="font-serif-editorial text-base font-normal text-[#18181b]">
                Pemolesan Suhu Dingin
              </h4>
              <p className="text-xs text-[#52525b] leading-relaxed">
                Pengupasan sekam dengan rol karet sintetis dan pemolesan bertingkat agar butir tidak retak.
              </p>
            </div>

            <div className="rice-card p-5 bg-[#ffffff] space-y-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#2d5a43] bg-[#eaf2ec] px-2 py-0.5 rounded-full">
                04. COLOR SORTING
              </span>
              <h4 className="font-serif-editorial text-base font-normal text-[#18181b]">
                Sensor Optik Kamera
              </h4>
              <p className="text-xs text-[#52525b] leading-relaxed">
                Penyortiran 12.000 butir per detik mendeteksi dan meniup butir hitam, kuning, dan bercak.
              </p>
            </div>

            <div className="rice-card p-5 bg-[#ffffff] space-y-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#2d5a43] bg-[#eaf2ec] px-2 py-0.5 rounded-full">
                05. PACKAGING
              </span>
              <h4 className="font-serif-editorial text-base font-normal text-[#18181b]">
                Pengemasan Karung
              </h4>
              <p className="text-xs text-[#52525b] leading-relaxed">
                Pengemasan higienis ukuran 5kg, 10kg, dan 25kg siap muat ke armada truk distribusi Jawa-Bali.
              </p>
            </div>

          </div>
        </section>

        {/* =========================================================================
            7. INTERACTIVE B2B WHOLESALE CALCULATOR & QUOTE (#kalkulator-b2b)
            ========================================================================= */}
        <section id="kalkulator-b2b" className="rice-card p-6 sm:p-12 bg-[#ffffff]">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <div className="text-center space-y-2">
              <span className="rice-badge-sage text-[10px]">
                Kalkulator Pemesanan Distributor &amp; B2B
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#18181b] tracking-tight">
                Simulasi Kebutuhan &amp; Permintaan Penawaran
              </h2>
              <p className="text-xs sm:text-sm text-[#52525b] max-w-xl mx-auto">
                Layanan pasokan langsung dari kilang untuk distributor beras, supermarket, hotel, restoran, dan katering dengan harga tangan pertama.
              </p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-6">
              
              {/* Product and Packaging Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#18181b] uppercase tracking-wider font-mono">
                    Pilihan Jenis Beras:
                  </label>
                  <select
                    value={selectedGrainPreset}
                    onChange={(e) => setSelectedGrainPreset(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#18181b]/15 bg-[#faf8f5] text-xs font-semibold text-[#18181b] outline-none focus:border-[#2d5a43]"
                  >
                    {variants.map(v => (
                      <option key={v.id} value={`${v.name} (${v.sizes})`}>
                        {v.name} • {v.subBadge} ({v.sizes})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#18181b] uppercase tracking-wider font-mono">
                    Pilihan Ukuran Karung:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['5kg', '10kg', '25kg'].map(size => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => setSelectedPackaging(size)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold border transition ${
                          selectedPackaging === size
                            ? 'bg-[#2d5a43] text-white border-[#2d5a43]'
                            : 'bg-[#faf8f5] text-[#18181b] border-[#18181b]/12 hover:border-[#2d5a43]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Volume Tonnage Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#18181b] uppercase tracking-wider font-mono">
                  Volume Kebutuhan Armada:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: '1 Ton (Pickup)', sub: '± 40 Karung 25kg' },
                    { label: '5 Ton (Engkel)', sub: '± 200 Karung 25kg' },
                    { label: '10 Ton (Fuso)', sub: '± 400 Karung 25kg' },
                    { label: '25 Ton (Tronton)', sub: '± 1.000 Karung 25kg' }
                  ].map(item => (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => setClientVolume(item.label)}
                      className={`p-3 rounded-xl text-left border transition ${
                        clientVolume === item.label
                          ? 'bg-[#2d5a43] text-white border-[#2d5a43] shadow-xs'
                          : 'bg-[#faf8f5] text-[#18181b] border-[#18181b]/12 hover:border-[#2d5a43]'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${clientVolume === item.label ? 'text-white/80' : 'text-[#52525b]'}`}>
                        {item.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Data Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#18181b]">Nama Lengkap / Badan Usaha:</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Contoh: Pak Darmawan (UD Beras Barokah)"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#18181b]/15 bg-[#faf8f5] text-xs font-normal text-[#18181b] outline-none focus:border-[#2d5a43]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#18181b]">Nomor WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#18181b]/15 bg-[#faf8f5] text-xs font-normal text-[#18181b] outline-none focus:border-[#2d5a43]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#18181b]">Kota / Wilayah Tujuan:</label>
                  <input
                    type="text"
                    required
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    placeholder="Contoh: Surabaya / Denpasar / Malang"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#18181b]/15 bg-[#faf8f5] text-xs font-normal text-[#18181b] outline-none focus:border-[#2d5a43]"
                  />
                </div>
              </div>

              {/* Special Note */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#18181b]">Catatan Khusus (Opsional):</label>
                <input
                  type="text"
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Contoh: Jadwal kirim rutin mingguan, mohon sampel beras dikirimkan ke alamat"
                  className="w-full px-4 py-2 rounded-xl border border-[#18181b]/15 bg-[#faf8f5] text-xs font-normal text-[#18181b] outline-none focus:border-[#2d5a43]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#18181b]/8">
                <div className="text-xs text-[#52525b] text-center sm:text-left">
                  Truk pabrik siap kirim ke seluruh kota di Jawa Timur, Bali, Lombok, &amp; Pulau Jawa.
                </div>
                <button
                  type="submit"
                  disabled={quoteSubmitted}
                  className="rice-pill-btn text-xs sm:text-sm py-3 px-8 shadow-xs w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{quoteSubmitted ? 'Menghubungkan...' : 'Kirim Permintaan ke WhatsApp Sales'}</span>
                </button>
              </div>

            </form>

          </div>
        </section>

        {/* =========================================================================
            8. CULINARY INSPIRATION & COMMUNITY (@berasbusur.id)
            ========================================================================= */}
        <section id="inspirasi-dapur" className="rice-card p-6 sm:p-12 bg-[#ffffff]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="rice-badge-sage text-[10px]">
                Cerita Dapur Nusantara
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#18181b]">
                Inspirasi Menu Harian Keluarga &amp; Rumah Makan
              </h2>
              <p className="text-xs sm:text-sm text-[#52525b] leading-relaxed">
                Nasi pulen hangat adalah inti dari setiap hidangan istimewa Indonesia. Ikuti akun Instagram resmi kami <strong>@berasbusur.id</strong> untuk panduan takaran air menanak beras, tips simpan beras awet alami, dan inspirasi kreasi resep nusantara.
              </p>

              <div className="pt-2">
                <a
                  href="https://www.instagram.com/berasbusur.id?rpxt=MW10dWI3aTFvMjZ2cA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rice-pill-btn text-xs py-2.5 px-5 shadow-xs"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Kunjungi Instagram @berasbusur.id</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-3.5">
              
              <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 space-y-2 group">
                <div className="h-28 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=500&q=80" 
                    alt="Nasi Liwet Gurih" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-xs font-semibold text-[#18181b]">Nasi Liwet Gurih</div>
                <div className="text-[10px] text-[#52525b]">Pulen lembut harum daun salam</div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 space-y-2 group">
                <div className="h-28 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80" 
                    alt="Nasi Kuning Tumpeng" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-xs font-semibold text-[#18181b]">Nasi Kuning Tumpeng</div>
                <div className="text-[10px] text-[#52525b]">Kilau kristal alami bumbu kunyit</div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 space-y-2 group">
                <div className="h-28 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80" 
                    alt="Nasi Uduk Daun Pandan" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-xs font-semibold text-[#18181b]">Nasi Uduk Pandan</div>
                <div className="text-[10px] text-[#52525b]">Aroma pandan alami menggugah selera</div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#18181b]/6 space-y-2 group">
                <div className="h-28 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80" 
                    alt="Nasi Goreng Spesial Resto" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-xs font-semibold text-[#18181b]">Nasi Goreng Spesial</div>
                <div className="text-[10px] text-[#52525b]">Butir terpisah pas untuk resto &amp; cafe</div>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            9. BOUTIQUE EDITORIAL FOOTER
            ========================================================================= */}
        <footer className="rice-card p-6 sm:p-12 bg-[#ffffff] space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Col 1: Brand & Certification */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2d5a43] flex items-center justify-center text-white font-serif-editorial text-sm font-bold">
                  B
                </div>
                <div>
                  <span className="font-serif-editorial text-lg font-bold text-[#18181b]">BERAS BUSUR</span>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#52525b]">PP BUMI MAS • BANYUWANGI</div>
                </div>
              </div>

              <p className="text-xs text-[#52525b] leading-relaxed max-w-sm font-normal">
                Kilang padi modern dan pemrosesan beras presisi di Banyuwangi, Jawa Timur. Menghadirkan beras pulen berkualitas tinggi bebas bahan kimia untuk seluruh keluarga dan mitra bisnis Anda.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <div className="rice-badge-sage text-[10px]">
                  <KementanLogo className="w-3.5 h-3.5" />
                  <span>Izin Edar Kementan RI</span>
                </div>
                <span className="rice-badge-sage text-[10px]">
                  Permentan 22/2025
                </span>
                <span className="rice-badge-sage text-[10px]">
                  Sertifikat Halal
                </span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="md:col-span-3 space-y-2.5 text-xs">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#18181b]">
                Navigasi Koleksi
              </div>
              <ul className="space-y-1.5 text-[#52525b]">
                <li><a href="#koleksi-beras" className="hover:text-[#2d5a43] transition">Koleksi Bulir Beras</a></li>
                <li><a href="#standar-mutu" className="hover:text-[#2d5a43] transition">Standar Mutu 2025</a></li>
                <li><a href="#terroir-proses" className="hover:text-[#2d5a43] transition">Terroir Kaki Ijen</a></li>
                <li><a href="#inspirasi-dapur" className="hover:text-[#2d5a43] transition">Cerita Dapur</a></li>
                <li><a href="#kalkulator-b2b" className="hover:text-[#2d5a43] transition">Kalkulator B2B</a></li>
                <li className="pt-2 border-t border-[#18181b]/8">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser) {
                        setActiveScreen('SCREEN_WORKSTATIONS');
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className="text-[#2d5a43] font-semibold hover:underline flex items-center space-x-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#2d5a43]" />
                    <span>{currentUser ? 'Buka Stasiun Kerja ERP' : 'Login Staf Pabrik'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Address & Contact */}
            <div className="md:col-span-4 space-y-2.5 text-xs">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#18181b]">
                Lokasi Pabrik &amp; Layanan
              </div>
              <p className="text-[#52525b] leading-relaxed">
                Wonosobo, Kec. Srono, Kabupaten Banyuwangi, Jawa Timur 68471
              </p>
              <p className="text-[#52525b] font-mono">
                WhatsApp: +62 818-334-998
              </p>
              <p className="text-[#52525b]">
                Jam Operasional: Senin - Sabtu 07:00 - 17:00 WIB
              </p>
              <div className="pt-1">
                <a
                  href="https://www.instagram.com/berasbusur.id?rpxt=MW10dWI3aTFvMjZ2cA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#2d5a43] hover:underline"
                >
                  <Instagram className="w-4 h-4 text-[#2d5a43]" />
                  <span>Instagram Resmi: @berasbusur.id</span>
                </a>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-[#18181b]/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#71717a] font-mono text-center sm:text-left">
            <div>
              &copy; {new Date().getFullYear()} PP BUMI MAS • BERAS BUSUR. Seluruh Hak Cipta Dilindungi.
            </div>
            <div>
              Wonosobo, Srono, Banyuwangi • Jawa Timur, Indonesia
            </div>
          </div>
        </footer>

      </div>

      {/* =========================================================================
          QUOTE MODAL (Accessible if triggered directly via buttons)
          ========================================================================= */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#18181b]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="rice-card max-w-lg w-full p-6 sm:p-8 space-y-5 bg-[#ffffff] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#18181b]/8 pb-3">
              <div>
                <span className="rice-badge-sage text-[10px]">BERAS BUSUR B2B</span>
                <h3 className="font-serif-editorial text-xl font-normal text-[#18181b] mt-1">
                  Minta Penawaran Resmi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuoteModalOpen(false)}
                className="w-8 h-8 rounded-full border border-[#18181b]/15 flex items-center justify-center text-sm font-bold hover:bg-[#faf8f5]"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#18181b]">Nama Lengkap / Perusahaan:</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Contoh: Pak Anton (UD Pangan Makmur)"
                  className="w-full px-4 py-2 rounded-xl border border-[#18181b]/15 bg-[#faf8f5] text-xs font-normal text-[#18181b] outline-none focus:border-[#2d5a43]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#18181b]">Nomor WhatsApp Aktif:</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-4 py-2 rounded-xl border border-[#18181b]/15 bg-[#faf8f5] text-xs font-normal text-[#18181b] outline-none focus:border-[#2d5a43]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#18181b]">Kota Tujuan Kirim:</label>
                <input
                  type="text"
                  required
                  value={clientCity}
                  onChange={(e) => setClientCity(e.target.value)}
                  placeholder="Contoh: Surabaya / Denpasar / Malang"
                  className="w-full px-4 py-2 rounded-xl border border-[#18181b]/15 bg-[#faf8f5] text-xs font-normal text-[#18181b] outline-none focus:border-[#2d5a43]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#18181b]">Produk Pilihan:</label>
                <input
                  type="text"
                  readOnly
                  value={selectedGrainPreset}
                  className="w-full px-4 py-2 rounded-xl border border-[#18181b]/15 bg-[#f3efea] text-xs font-semibold text-[#18181b]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="rice-pill-outline py-2 px-4 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={quoteSubmitted}
                  className="rice-pill-btn py-2 px-6 text-xs font-semibold shadow-xs"
                >
                  {quoteSubmitted ? 'Menghubungkan...' : 'Kirim ke WhatsApp Sales'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          VARIANT SETTINGS MODAL
          ========================================================================= */}
      {showVariantSettings && (
        <RiceVariantSettingsModal
          isOpen={showVariantSettings}
          variants={variants}
          onSave={handleSaveVariants}
          onReset={handleResetVariants}
          onClose={() => setShowVariantSettings(false)}
        />
      )}

    </div>
  );
};
