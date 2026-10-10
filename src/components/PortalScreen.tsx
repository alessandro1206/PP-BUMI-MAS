import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scale, Package, Shield, FileSpreadsheet, MapPin, Clock, Phone, Mail, 
  Award, CheckCircle2, ChevronRight, Leaf, Sprout, Factory, 
  ShieldCheck, ArrowRight, Layers, Truck, Check, Sparkles
} from 'lucide-react';
import { LoginModal } from './LoginModal';
import { RoleType } from '../types';

export const PortalScreen: React.FC = () => {
  const { setRole, setActiveScreen, currentUser } = useApp();
  const [loginTargetRole, setLoginTargetRole] = useState<RoleType | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [activeGrainTab, setActiveGrainTab] = useState<'PUTRI' | 'BETET' | 'PANDAN'>('PUTRI');

  const handleOpenWorkstation = (targetRole: RoleType, defaultScreen: string) => {
    if (currentUser && currentUser.role === targetRole) {
      setRole(targetRole);
      setActiveScreen(defaultScreen);
    } else {
      setLoginTargetRole(targetRole);
    }
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setQuoteModalOpen(false);
    }, 2000);
  };

  return (
    <div className="w-full text-slate-100 font-sans -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
      
      {/* =========================================================================
          1. HERO SECTION: MAJESTIC BANYUWANGI LANDSCAPE + MODERN MILLING
          ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0a120e]">
        {/* Cinematic Backdrop Image with Mount Ijen & Terraced Sawah */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=85')`,
          }}
        >
          {/* Dual Overlay Gradients: Rich Volcanic Dark base + Warm Golden Morning Mist */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07130d]/95 via-[#0c1f16]/80 to-[#07130d]/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a120e] via-transparent to-black/30"></div>
          {/* Subtle Warm Sunrise Ambient Bloom */}
          <div className="absolute -top-24 left-1/4 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>

        {/* Traditional Banyuwangi Gajah Oling Batik Divider Bar (Top) */}
        <div className="relative z-20 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent"></div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-14 pt-12 sm:pt-20 pb-16 w-full flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Elegant Typography & Brand Narrative */}
            <div className="lg:col-span-7 space-y-6 max-w-2xl">
              
              {/* Origin & Certification Badge */}
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-[#d4af37]/40 backdrop-blur-md shadow-lg">
                {/* Mount Ijen & Rice Grain Silhouette Icon */}
                <svg className="w-4 h-4 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L2 19h20L12 3zm0 4.5l6.5 10.5h-13L12 7.5zM12 11c-.83 0-1.5.67-1.5 1.5S11.17 14 12 14s1.5-.67 1.5-1.5S12.83 11 12 11z"/>
                </svg>
                <span className="text-[11px] font-mono tracking-widest text-amber-200 uppercase font-semibold">
                  Banyuwangi, East Java • Est. 1982
                </span>
                <span className="text-emerald-500">•</span>
                <span className="text-[11px] font-mono tracking-wider text-emerald-300">
                  Volcanic Soil Rice
                </span>
              </div>

              {/* Large Master Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.1] uppercase">
                  NURTURED BY <span className="text-amber-300 font-serif-display lowercase italic font-normal tracking-normal text-4xl sm:text-6xl xl:text-7xl">nature,</span> <br />
                  MILLED FOR <span className="text-emerald-400">PERFECTION.</span>
                </h1>
              </div>

              {/* Refined Authentic Subheader */}
              <p className="text-sm sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-xl">
                Premium-grade Indonesian rice, grown in the fertile volcanic soils of Banyuwangi and processed with state-of-the-art milling by <strong className="text-white font-semibold">PP BUMI MAS</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#our-grains"
                  className="px-7 py-3.5 rounded-xl bg-[#0f3e2e] hover:bg-[#15533e] text-amber-200 border border-[#d4af37]/50 font-bold text-sm tracking-wide shadow-xl hover:shadow-emerald-950/50 transition duration-200 flex items-center space-x-2.5"
                >
                  <Leaf className="w-4 h-4 text-[#d4af37]" />
                  <span>Explore Our Grains</span>
                </a>

                <a
                  href="#factory-process"
                  className="px-7 py-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 text-slate-200 border border-slate-700/80 hover:border-slate-500 font-semibold text-sm backdrop-blur-md transition duration-200 flex items-center space-x-2"
                >
                  <Factory className="w-4 h-4 text-emerald-400" />
                  <span>Tour Our Factory</span>
                </a>

                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5be42] text-[#07130d] font-black text-sm tracking-wide shadow-lg transition duration-200 flex items-center space-x-2"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Jump for Staff */}
              <div className="pt-2 flex items-center space-x-3 text-xs text-slate-400">
                <span className="font-mono text-[11px] text-emerald-400/90">Akses Staf Internal:</span>
                <button
                  onClick={() => setLoginTargetRole('ADMIN1')}
                  className="text-slate-300 hover:text-amber-300 underline font-semibold transition"
                >
                  Masuk ke Workstation Timbangan / ERP &rarr;
                </button>
              </div>
            </div>

            {/* Right Column: Merging Agriculture & Modern Factory (Overlay Journey Cards) */}
            <div className="lg:col-span-5 relative space-y-4 lg:pl-6">
              
              {/* Card 1: Our Heritage */}
              <div className="relative group bg-slate-900/60 hover:bg-slate-900/85 backdrop-blur-xl p-5 rounded-2xl border border-emerald-500/20 hover:border-[#d4af37]/50 transition-all duration-300 shadow-2xl">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Sprout className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base tracking-tight">Our Heritage</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                        Volcanic Soil
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Lahan sawah terasering vulkanik lereng Gunung Ijen yang diairi air mineral alami pegunungan, menghasilkan bulir padi bernutrisi tinggi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Modern Milling */}
              <div className="relative group bg-slate-900/60 hover:bg-slate-900/85 backdrop-blur-xl p-5 rounded-2xl border border-emerald-500/20 hover:border-[#d4af37]/50 transition-all duration-300 shadow-2xl lg:translate-x-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Factory className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base tracking-tight">Modern Milling &amp; Sorting</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                        High-Tech SCADA
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Mesin pemroses beras modern, optical color sorter pemilah butir kapur, konveyor otomatis, serta jembatan timbang digital serial RS-232 berstandar CAS CI-200i.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Premium Packaging */}
              <div className="relative group bg-slate-900/60 hover:bg-slate-900/85 backdrop-blur-xl p-5 rounded-2xl border border-emerald-500/20 hover:border-[#d4af37]/50 transition-all duration-300 shadow-2xl lg:translate-x-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base tracking-tight">Premium Packaging</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                        Cap Putri Thailand
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Kemasan karung beras higienis (@5kg, @10kg, @20kg, @25kg, @50kg) kedap lembap untuk menjaga aroma alami dan kesegaran beras sampai ke konsumen.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* =========================================================================
            2. TRUST & QUALITY BOTTOM RIBBON (Natural Cream / Earthy Strip)
            ========================================================================= */}
        <div className="relative z-20 w-full bg-[#f8f5ed] text-[#1c2c22] border-t-2 border-[#d4af37]/70 py-4 shadow-xl">
          <div className="max-w-[1560px] mx-auto px-6 sm:px-10 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center space-x-2 font-serif-display font-bold text-sm tracking-wide text-[#0f3e2e]">
              <Award className="w-5 h-5 text-[#967823]" />
              <span className="uppercase text-xs font-mono font-bold tracking-widest text-[#5d4d1e]">
                Standar Mutu &amp; Kualitas
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-xs font-semibold text-[#2c3d31]">
              
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-black">✓</div>
                <span>HACCP Certified Standard</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-black">✓</div>
                <span>ISO 22000 Food Safety</span>
              </div>

              <div className="flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-emerald-700" />
                <span>100% Beras Alami Tanpa Pemutih</span>
              </div>

              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Sustainably Sourced (Petani Banyuwangi)</span>
              </div>

              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>Timbangan Tera Metrologi Legal</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Subtle Gajah Oling Traditional Motif Ribbon */}
      <div className="w-full bg-[#0d1813] py-2 px-6 border-b border-slate-800/80 flex items-center justify-center space-x-3 text-[11px] font-mono text-amber-300/70">
        <span>❖</span>
        <span>KERAJINAN DAN MUTU BERAS BANYUWANGI • TRADISI GAJAH OLING • SEJAK 1982</span>
        <span>❖</span>
      </div>

      {/* =========================================================================
          3. SECTION: OUR GRAINS (VARIETAS BERAS UNGGULAN PP BUMI MAS)
          ========================================================================= */}
      <section id="our-grains" className="py-20 px-6 sm:px-10 lg:px-14 bg-[#0a110d] border-b border-slate-800/80">
        <div className="max-w-[1560px] mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">
                Produk &amp; Varietas Beras
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Koleksi Beras Unggulan Hasil Olahan Pabrik
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Diproduksi dari padi pilihan petani Banyuwangi, diproses dengan mesin pembersih de-stoner, polisher kabut, dan optical sorter untuk menjamin kebersihan, kepulenan, dan bulir utuh.
              </p>
            </div>

            {/* Grain Variety Filter Switcher */}
            <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveGrainTab('PUTRI')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeGrainTab === 'PUTRI' ? 'bg-[#0f3e2e] text-amber-300 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cap Putri Thailand
              </button>
              <button
                onClick={() => setActiveGrainTab('BETET')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeGrainTab === 'BETET' ? 'bg-[#0f3e2e] text-amber-300 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cap Betet Super
              </button>
              <button
                onClick={() => setActiveGrainTab('PANDAN')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeGrainTab === 'PANDAN' ? 'bg-[#0f3e2e] text-amber-300 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cap Pandan Wangi
              </button>
            </div>
          </div>

          {/* Grain Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Variety 1: Cap Putri Thailand */}
            <div className={`p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${
              activeGrainTab === 'PUTRI' 
                ? 'bg-gradient-to-b from-[#0f2e21] to-[#0a1912] border-[#d4af37]/60 shadow-2xl scale-[1.02]' 
                : 'bg-slate-900/50 border-slate-800 opacity-90'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-950 uppercase">
                    Flagship Grade
                  </span>
                  <span className="text-xs font-mono text-emerald-400">Pulen &amp; Kristal</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Beras Cap Putri Thailand</h3>
                  <p className="text-xs text-amber-200/80 font-mono mt-0.5">Kemasan: @5 KG, @10 KG, @25 KG, @50 KG</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Beras kualitas premium berderajat sosoh 95%+, disortir menggunakan sensor multi-CCD optical untuk memisahkan butir kapur dan kuning. Hasil nasi pulen, lembut, dan putih alami tanpa pemutih kimia.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Kadar Air (Moisture):</span>
                    <strong className="font-mono text-white">Max. 14.0%</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Butir Patah (Broken):</span>
                    <strong className="font-mono text-white">&lt; 5%</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Derajat Sosoh:</span>
                    <strong className="font-mono text-white">&gt; 95%</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setQuoteModalOpen(true)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <span>Minta Penawaran Partai Besar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Variety 2: Cap Betet Super */}
            <div className={`p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${
              activeGrainTab === 'BETET' 
                ? 'bg-gradient-to-b from-[#0f2e21] to-[#0a1912] border-[#d4af37]/60 shadow-2xl scale-[1.02]' 
                : 'bg-slate-900/50 border-slate-800 opacity-90'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 uppercase">
                    Beras Kepala Super
                  </span>
                  <span className="text-xs font-mono text-emerald-400">Tekstur Mantap</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Beras Cap Betet</h3>
                  <p className="text-xs text-amber-200/80 font-mono mt-0.5">Kemasan: @10 KG, @20 KG, @25 KG</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Beras kepala pilihan dengan butir utuh panjang dan kekerasan seimbang. Sangat diminati oleh restoran, katering, serta rumah makan karena mekarnya nasi yang pas dan tidak mudah basi.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Kadar Air (Moisture):</span>
                    <strong className="font-mono text-white">Max. 14.5%</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Butir Patah (Broken):</span>
                    <strong className="font-mono text-white">&lt; 10%</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Daya Serap Air:</span>
                    <strong className="font-mono text-white">Optimal &amp; Mekar</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setQuoteModalOpen(true)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center space-x-2 border border-slate-700"
              >
                <span>Minta Penawaran Partai Besar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Variety 3: Cap Pandan Wangi */}
            <div className={`p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${
              activeGrainTab === 'PANDAN' 
                ? 'bg-gradient-to-b from-[#0f2e21] to-[#0a1912] border-[#d4af37]/60 shadow-2xl scale-[1.02]' 
                : 'bg-slate-900/50 border-slate-800 opacity-90'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#d4af37] text-slate-950 uppercase">
                    Aroma Alami
                  </span>
                  <span className="text-xs font-mono text-emerald-400">Wangi Pandan Segar</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Beras Cap Pandan</h3>
                  <p className="text-xs text-amber-200/80 font-mono mt-0.5">Kemasan: @(5x10) KG, @50 KG Sak</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Beras dengan wangi alami khas pandan yang keluar saat dimasak. Berbulir agak bulat dan bening mengilat, menghadirkan aroma selera makan premium untuk hidangan keluarga Indonesia.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Kadar Air (Moisture):</span>
                    <strong className="font-mono text-white">Max. 13.8%</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Aroma:</span>
                    <strong className="font-mono text-white">Pandan Asli Alami</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Tekstur Nasi:</span>
                    <strong className="font-mono text-white">Pulen Lembut</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setQuoteModalOpen(true)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center space-x-2 border border-slate-700"
              >
                <span>Minta Penawaran Partai Besar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SECTION: FACTORY & MODERN MILLING PROCESS
          ========================================================================= */}
      <section id="factory-process" className="py-20 px-6 sm:px-10 lg:px-14 bg-[#080e0a] border-b border-slate-800/80">
        <div className="max-w-[1560px] mx-auto space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Modern Milling Machinery
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Alur Pengolahan Presisi dari Gabah Petani Menjadi Beras Kristal
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Infrastruktur terintegrasi menggabungkan ketelitian sensor digital, penyaringan optik, dan pengawasan mutu pada setiap tahapan pabrik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
                01
              </div>
              <h4 className="font-bold text-white text-base">Pos Timbang Digital</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Armada truk gabah ditimbang otomatis via serial RS-232 CAS CI-200i dengan pembacaan bruto, tara, dan netto terkomputasi presisi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
                02
              </div>
              <h4 className="font-bold text-white text-base">Pembersih &amp; Husker</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pemisahan batu, jerami, dan sekam menggunakan vibrating screen dan rubber roll husker modern dengan meminimalisir butir patah.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
                03
              </div>
              <h4 className="font-bold text-white text-base">Optical Color Sorter</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sensor kamera multi-CCD berkecepatan tinggi menyortir butir kuning, bintik hitam, dan kapur secara pneumatik dalam hitungan milidetik.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
                04
              </div>
              <h4 className="font-bold text-white text-base">Formulasi Cor Stapel</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pencampuran homogen terkontrol untuk menjaga kestabilan rasa, kepulenan, dan kadar air sesuai standar merek pesanan pelanggan.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
                05
              </div>
              <h4 className="font-bold text-white text-base">Packaging &amp; Tier Truk</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pengemasan karung jahit presisi serta tally tier armada truk ekspedisi untuk pengiriman ke Surabaya, Bali, dan pasar regional.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SECTION: INTERNAL WORKSTATION ACCESS (STASIUN OPERASIONAL PABRIK)
          ========================================================================= */}
      <section id="workstations" className="py-20 px-6 sm:px-10 lg:px-14 bg-[#0a110d] border-b border-slate-800/80">
        <div className="max-w-[1560px] mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">
                Internal ERP Consoles
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Pintu Masuk Stasiun Kerja Staf Pabrik
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pilih peran operasional untuk membuka konsol kerja masing-masing stasiun pabrik secara aman.
              </p>
            </div>

            {currentUser && (
              <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-xs font-mono text-emerald-300 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Masuk Sebagai: <strong>{currentUser.name} ({currentUser.role})</strong></span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Station 1: Pos Timbangan & Kasir */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Pos Jembatan Timbang &amp; Kasir</h3>
                  <span className="text-xs font-mono text-emerald-400 font-semibold block mt-0.5">Admin 1 Console</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Penimbangan truk gabah/beras (Bruto, Tara, Netto), cetak tiket timbang, penerbitan surat jalan DO, dan kasir pelunasan toko.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenWorkstation('ADMIN1', 'SCREEN_16')}
                className="w-full py-3 bg-[#0f3e2e] hover:bg-[#15533e] text-emerald-200 font-bold text-xs rounded-xl border border-emerald-600/40 transition flex items-center justify-center space-x-2"
              >
                <span>Buka Pos Timbangan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Station 2: Lantai Gudang & Karung */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Gudang, Beras &amp; Karung</h3>
                  <span className="text-xs font-mono text-amber-400 font-semibold block mt-0.5">Admin 2 Console</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tally tier muatan armada truk, stok opname beras jadi, racikan cor milling, dan pencatatan karung Cap Putri Thailand.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenWorkstation('ADMIN2', 'SCREEN_42')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-200 font-bold text-xs rounded-xl border border-amber-500/30 transition flex items-center justify-center space-x-2"
              >
                <span>Buka Konsol Gudang</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Station 3: Keuangan & Pemilik */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 transition flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Konsol Pemilik &amp; Keuangan</h3>
                  <span className="text-xs font-mono text-sky-400 font-semibold block mt-0.5">Owner Console</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Penetapan harga harian gabah kering giling (GKG), approval transfer bank BCA suplier, verifikasi hutang toko, dan kas pabrik.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenWorkstation('OWNER', 'SCREEN_13')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-sky-200 font-bold text-xs rounded-xl border border-sky-500/30 transition flex items-center justify-center space-x-2"
              >
                <span>Buka Konsol Owner</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Station 4: Pembukuan SAK EMKM */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Akuntansi &amp; Pajak SAK EMKM</h3>
                  <span className="text-xs font-mono text-purple-400 font-semibold block mt-0.5">Super Admin Console</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Jurnal umum berpasangan otomatis, neraca saldo, neraca keuangan seimbang Aktiva = Pasiva Rp 0, dan buku log audit aktivitas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenWorkstation('SUPER_ADMIN', 'SCREEN_SUPER_ADMIN_ACCOUNTING')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-purple-200 font-bold text-xs rounded-xl border border-purple-500/30 transition flex items-center justify-center space-x-2"
              >
                <span>Buka Konsol Akuntansi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FOOTER: PLANT CONTACT & REGIONAL HEADQUARTERS
          ========================================================================= */}
      <footer className="py-14 px-6 sm:px-10 lg:px-14 bg-[#060b08] border-t border-slate-800 text-slate-400 text-xs">
        <div className="max-w-[1560px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black font-mono">
                BM
              </div>
              <span className="font-bold text-white text-base">PP BUMI MAS</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Pabrik penggilingan padi dan reprocessing beras premium modern di Banyuwangi, Jawa Timur. Melayani pasokan beras grosir dan kemitraan petani padi lokal.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Alamat Kilang &amp; Gudang</h4>
            <div className="space-y-1 text-slate-300">
              <p>Desa Wonosobo, Kec. Srono</p>
              <p>Kab. Banyuwangi, Jawa Timur 68471</p>
              <p className="font-mono text-emerald-400 pt-1">Koordinat Pos: -8.3970, 114.2650</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Jam Operasional Pos Timbangan</h4>
            <div className="space-y-1 text-slate-300">
              <p>Senin – Sabtu: 07.00 – 17.00 WIB</p>
              <p>Minggu: Penimbangan Khusus Ekspedisi</p>
              <p className="text-amber-300/80 text-[11px] pt-1">Layanan Truk Gabah &amp; DO Pengiriman Beras</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Permintaan Penawaran</h4>
            <p className="text-xs text-slate-400">
              Hubungi kantor pabrik untuk pesanan partai besar (truk/kontainer) atau kemitraan suplier gabah:
            </p>
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0f3e2e] hover:bg-[#15533e] text-amber-200 border border-[#d4af37]/40 font-bold text-xs transition flex items-center space-x-2"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Hubungi Kantor Penjualan</span>
            </button>
          </div>

        </div>

        <div className="max-w-[1560px] mx-auto mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>&copy; {new Date().getFullYear()} PP BUMI MAS Wonosobo, Srono, Banyuwangi. All rights reserved.</p>
          <p className="font-mono text-[11px] text-emerald-500">Standar Penggilingan Beras Industri &amp; RS-232 Weighbridge</p>
        </div>
      </footer>

      {/* =========================================================================
          7. MODALS: REQUEST A QUOTE MODAL & PASSWORD AUTH MODAL
          ========================================================================= */}
      
      {/* Quote / Partnership Request Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1712] border border-[#d4af37]/50 rounded-2xl max-w-lg w-full p-7 space-y-5 shadow-2xl text-slate-100 relative">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  B2B Wholesale &amp; Supply Inquiry
                </span>
                <h3 className="text-xl font-bold text-white">Permintaan Penawaran Beras PP BUMI MAS</h3>
              </div>
              <button 
                onClick={() => setQuoteModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {quoteSubmitted ? (
              <div className="p-6 bg-emerald-950/80 border border-emerald-500 rounded-xl text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto font-black text-xl">
                  ✓
                </div>
                <h4 className="font-bold text-white text-base">Permintaan Penawaran Terkirim!</h4>
                <p className="text-xs text-emerald-200">
                  Tim pemasaran PP BUMI MAS akan menghubungi Anda melalui nomor WhatsApp / Telepon dalam waktu 1x24 jam.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Nama Perusahaan / Toko / Pembeli:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Toko Beras Sumber Rejeki Surabaya"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Nomor WhatsApp / Telepon:</label>
                    <input
                      type="tel"
                      required
                      placeholder="08123456789"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Kota Tujuan Pengiriman:</label>
                    <input
                      type="text"
                      required
                      placeholder="Surabaya / Bali / Jakarta"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Pilihan Merek Beras:</label>
                    <select className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium outline-none focus:border-amber-400">
                      <option>Cap Putri Thailand (Premium)</option>
                      <option>Cap Betet (Super Kepala)</option>
                      <option>Cap Pandan (Wangi Alami)</option>
                      <option>Beras Curah / Cor Custom</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Estimasi Kebutuhan (Ton):</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 15 Ton (1 Truk)"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Catatan Tambahan:</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan spesifikasi kemasan sak, jadwal pengiriman, atau pertanyaan lainnya..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium outline-none focus:border-amber-400"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#d4af37] hover:bg-[#e5be42] text-[#07130d] font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg mt-2"
                >
                  Kirim Permintaan Penawaran Resmi
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Internal Staff Password Authentication Modal */}
      {loginTargetRole && (
        <LoginModal
          targetRole={loginTargetRole}
          onClose={() => setLoginTargetRole(null)}
          onSuccess={(roleToSet) => {
            setLoginTargetRole(null);
            setRole(roleToSet);
            if (roleToSet === 'OWNER') setActiveScreen('SCREEN_13');
            if (roleToSet === 'ADMIN1') setActiveScreen('SCREEN_16');
            if (roleToSet === 'ADMIN2') setActiveScreen('SCREEN_42');
            if (roleToSet === 'SUPER_ADMIN') setActiveScreen('SCREEN_SUPER_ADMIN_ACCOUNTING');
          }}
        />
      )}

    </div>
  );
};
