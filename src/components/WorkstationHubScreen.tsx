import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scale, 
  Package, 
  Shield, 
  FileSpreadsheet, 
  ChevronRight, 
  UserCheck, 
  LogOut, 
  ExternalLink, 
  BookOpen, 
  Clock,
  Sparkles
} from 'lucide-react';
import { RoleType } from '../types';
import { AuditLogModal } from './AuditLogModal';

export const WorkstationHubScreen: React.FC = () => {
  const { setRole, setActiveScreen, currentUser, logout, weighbridgeInList } = useApp();
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);

  const pendingTransferCount = weighbridgeInList.filter(w => w.transfer_status === 'PENDING_PRICE').length;

  const handleEnterWorkstation = (targetRole: RoleType, targetScreen: string) => {
    setRole(targetRole);
    setActiveScreen(targetScreen);
  };

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isOwner = currentUser?.role === 'OWNER' || isSuperAdmin;
  const isAdmin1 = currentUser?.role === 'ADMIN1' || isSuperAdmin;
  const isAdmin2 = currentUser?.role === 'ADMIN2' || isSuperAdmin;

  const currentDateFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="relative min-h-[calc(100vh-140px)] py-6 space-y-8">
      
      {/* =========================================================================
          VIBRANT LUMINOUS AMBIENT GLOW BACKDROP (Brightened for vivid refraction)
          ========================================================================= */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" 
        aria-hidden="true"
      >
        {/* Top Header Ambient Aurora Light */}
        <div className="absolute -top-16 left-1/6 w-[560px] h-[360px] bg-emerald-400/35 rounded-full blur-[100px]" />
        <div className="absolute -top-16 right-1/6 w-[560px] h-[360px] bg-indigo-400/35 rounded-full blur-[100px]" />

        {/* Workstation Card 1: Vibrant Emerald Glow */}
        <div className="absolute top-[260px] left-[-30px] w-[380px] h-[440px] bg-emerald-400/40 rounded-full blur-[90px]" />
        
        {/* Workstation Card 2: Vibrant Amber / Gold Glow */}
        <div className="absolute top-[290px] left-[25%] w-[380px] h-[440px] bg-amber-400/40 rounded-full blur-[90px]" />
        
        {/* Workstation Card 3: Vibrant Royal Indigo / Violet Glow */}
        <div className="absolute top-[290px] right-[25%] w-[380px] h-[440px] bg-indigo-400/45 rounded-full blur-[90px]" />
        
        {/* Workstation Card 4: Vibrant Electric Cyan / Blue Glow */}
        <div className="absolute top-[260px] right-[-30px] w-[380px] h-[440px] bg-cyan-400/45 rounded-full blur-[90px]" />

        {/* Bottom Utility Aurora Glow */}
        <div className="absolute bottom-[-20px] left-1/4 w-[600px] h-[260px] bg-gradient-to-r from-emerald-400/30 via-teal-400/30 to-indigo-400/30 rounded-full blur-[95px]" />
      </div>

      {/* =========================================================================
          TOP BANNER: LUMINOUS FROSTED GLASS SESSION HUB
          ========================================================================= */}
      <section className="relative z-10 backdrop-blur-2xl bg-gradient-to-r from-white/[0.12] via-white/[0.08] to-white/[0.12] border border-white/25 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_0_rgba(0,0,0,0.35),inset_0_1.5px_1.5px_0_rgba(255,255,255,0.4)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full backdrop-blur-md bg-emerald-400/25 border border-emerald-300/50 text-emerald-100 text-[11px] font-mono uppercase tracking-wider shadow-[0_0_14px_rgba(52,211,153,0.35)] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>Sistem Operasional Online</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full backdrop-blur-md bg-white/[0.12] border border-white/20 text-slate-100 text-[11px] font-mono font-medium shadow-xs">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                <span>{currentDateFormatted}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              Pusat Stasiun Kerja Staf Pabrik PP Bumi Mas
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed max-w-xl font-normal">
              Antarmuka operasional kilang dan reprocessing beras Banyuwangi. Pilih stasiun kerja tugas Anda di bawah untuk membuka modul operasional.
            </p>
          </div>

          {/* User Session Glass Capsule with Bright Accents */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 backdrop-blur-xl bg-white/[0.1] p-3.5 rounded-2xl border border-white/25 shrink-0 shadow-[0_6px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <div className="space-y-1 px-2">
              <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider font-semibold">
                Sesi Terverifikasi
              </div>
              <div className="text-sm font-bold text-white flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-emerald-400/30 border border-emerald-300/60 flex items-center justify-center shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                  <UserCheck className="w-4 h-4 text-emerald-200" />
                </div>
                <span>{currentUser ? currentUser.name : 'Staf Internal'}</span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full backdrop-blur-md bg-emerald-500/30 border border-emerald-300/50 text-emerald-100 font-extrabold shadow-xs">
                  {currentUser?.role || 'OPERATOR'}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/25 hidden sm:block"></div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }}
                className="px-4 py-2 backdrop-blur-md bg-white/[0.15] hover:bg-white/[0.25] text-white text-xs font-bold rounded-xl border border-white/30 transition flex items-center space-x-1.5 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                title="Buka Website Landing Page Publik"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
                <span>Web Publik</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 backdrop-blur-md bg-rose-500/30 hover:bg-rose-500/45 text-rose-100 text-xs font-bold rounded-xl border border-rose-300/40 transition flex items-center space-x-1.5 shadow-[0_0_12px_rgba(244,63,94,0.3)] focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                title="Keluar dari sesi staf"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-200" />
                <span>Keluar</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          GRID: 4 VIBRANT FROSTED GLASS WORKSTATION CONSOLES
          ========================================================================= */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* =========================================================================
            Workstation 1: Pos Timbangan & Kasir (Admin 1) - Vivid Emerald Glass
            ========================================================================= */}
        <div className={`p-6 rounded-3xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between space-y-6 ${
          isAdmin1 
            ? 'bg-gradient-to-b from-emerald-500/[0.22] via-white/[0.1] to-emerald-950/[0.35] border border-emerald-400/60 hover:border-emerald-300 shadow-[0_16px_40px_0_rgba(16,185,129,0.3),inset_0_1.5px_2px_0_rgba(255,255,255,0.45)] hover:scale-[1.01]' 
            : 'bg-white/[0.05] border border-white/15 opacity-60'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl backdrop-blur-xl bg-emerald-400/30 border border-emerald-300/60 flex items-center justify-center text-emerald-100 shadow-[0_0_24px_rgba(52,211,153,0.55)]">
                <Scale className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full backdrop-blur-md bg-emerald-400/30 text-emerald-100 border border-emerald-300/60 font-extrabold tracking-wider shadow-[0_0_14px_rgba(52,211,153,0.4)]">
                ADMIN 1
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-xl tracking-tight drop-shadow-sm">
                Pos Timbangan &amp; Kasir
              </h3>
              <p className="text-xs font-mono text-emerald-200 mt-0.5 font-bold">
                Operasional Penimbangan &amp; DO
              </p>
            </div>

            <p className="text-xs text-slate-100 leading-relaxed font-normal">
              Pencatatan penimbangan truk gabah dan beras jadi (Bruto, Tara, Netto), penerbitan tiket timbang resmi (STT), surat jalan (DO), dan kasir pelunasan toko.
            </p>

            {/* Frosted Glass Module Shortcuts */}
            <div className="pt-3 border-t border-white/20 space-y-2">
              <span className="text-[10px] font-mono text-emerald-200 uppercase tracking-wider block font-bold">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_16')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-emerald-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Tiket Timbang (STT)"
                >
                  • Tiket Timbang (STT)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_31')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-emerald-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Kasir Tunai Toko"
                >
                  • Kasir Tunai Toko
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_15')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-emerald-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Surat Jalan (DO)"
                >
                  • Surat Jalan (DO)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_RECEIVABLES')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-emerald-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Piutang Toko"
                >
                  • Piutang Toko
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_CALENDAR')}
                  className="col-span-2 px-2.5 py-2 backdrop-blur-md bg-emerald-400/30 hover:bg-emerald-400/45 text-emerald-50 rounded-xl text-left transition truncate border border-emerald-300/60 font-bold shadow-[0_0_14px_rgba(52,211,153,0.3)] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Kalender Juwita (Jadwal Pengiriman DO)"
                >
                  📅 Kalender Juwita (Jadwal DO)
                </button>
              </div>
            </div>

          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_16')}
            className="w-full py-3.5 px-4 backdrop-blur-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-extrabold rounded-2xl transition flex items-center justify-between border border-emerald-300/60 shadow-[0_6px_24px_rgba(16,185,129,0.55),inset_0_1px_0_rgba(255,255,255,0.45)] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none group"
          >
            <span>Buka Pos Timbangan &amp; DO</span>
            <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* =========================================================================
            Workstation 2: Gudang, Beras & Karung (Admin 2) - Vivid Amber / Gold Glass
            ========================================================================= */}
        <div className={`p-6 rounded-3xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between space-y-6 ${
          isAdmin2 
            ? 'bg-gradient-to-b from-amber-500/[0.22] via-white/[0.1] to-amber-950/[0.35] border border-amber-400/60 hover:border-amber-300 shadow-[0_16px_40px_0_rgba(245,158,11,0.3),inset_0_1.5px_2px_0_rgba(255,255,255,0.45)] hover:scale-[1.01]' 
            : 'bg-white/[0.05] border border-white/15 opacity-60'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl backdrop-blur-xl bg-amber-400/30 border border-amber-300/60 flex items-center justify-center text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.55)]">
                <Package className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full backdrop-blur-md bg-amber-400/30 text-amber-100 border border-amber-300/60 font-extrabold tracking-wider shadow-[0_0_14px_rgba(251,191,36,0.4)]">
                ADMIN 2
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-xl tracking-tight drop-shadow-sm">
                Gudang, Beras &amp; Karung
              </h3>
              <p className="text-xs font-mono text-amber-200 mt-0.5 font-bold">
                Produksi Milling &amp; Logistik
              </p>
            </div>

            <p className="text-xs text-slate-100 leading-relaxed font-normal">
              Tally tier susunan muatan truk, stok opname beras jadi di gudang stapel, perencanaan racikan cor milling, dan pengelolaan sak karung Cap Putri Thailand.
            </p>

            {/* Frosted Glass Module Shortcuts */}
            <div className="pt-3 border-t border-white/20 space-y-2">
              <span className="text-[10px] font-mono text-amber-200 uppercase tracking-wider block font-bold">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_42')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-amber-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Rencana Cor Kiby"
                >
                  • Rencana Cor Kiby
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_8')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-amber-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Permintaan Sak Karung"
                >
                  • Permintaan Sak
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_SAK_STOCK')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-amber-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Stok Sak Karung"
                >
                  • Stok Sak Karung
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_BERAS_STOCK')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-amber-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Stok Beras Stapel"
                >
                  • Stok Beras Jadi
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_24')}
                  className="col-span-2 px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-amber-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Tally Tier Muatan Truk"
                >
                  • Tally Tier Truk
                </button>
              </div>
            </div>

          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_42')}
            className="w-full py-3.5 px-4 backdrop-blur-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-2xl transition flex items-center justify-between border border-amber-300/60 shadow-[0_6px_24px_rgba(245,158,11,0.55),inset_0_1px_0_rgba(255,255,255,0.45)] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none group"
          >
            <span>Buka Konsol Gudang &amp; Cor</span>
            <ChevronRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* =========================================================================
            Workstation 3: Konsol Pemilik & Keuangan (Owner) - Vivid Royal Indigo Glass
            ========================================================================= */}
        <div className={`p-6 rounded-3xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between space-y-6 ${
          isOwner 
            ? 'bg-gradient-to-b from-indigo-500/[0.25] via-white/[0.1] to-purple-950/[0.35] border border-indigo-400/60 hover:border-indigo-300 shadow-[0_16px_40px_0_rgba(99,102,241,0.3),inset_0_1.5px_2px_0_rgba(255,255,255,0.45)] hover:scale-[1.01]' 
            : 'bg-white/[0.05] border border-white/15 opacity-60'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl backdrop-blur-xl bg-indigo-400/30 border border-indigo-300/60 flex items-center justify-center text-indigo-100 shadow-[0_0_24px_rgba(129,140,248,0.55)]">
                <Shield className="w-7 h-7" />
              </div>
              <div className="flex items-center space-x-1.5">
                {pendingTransferCount > 0 && (
                  <span className="px-2.5 py-1 rounded-full backdrop-blur-md bg-rose-500/35 text-rose-100 border border-rose-300/60 text-[10px] font-mono font-extrabold shadow-[0_0_14px_rgba(244,63,94,0.4)]">
                    {pendingTransferCount} antri
                  </span>
                )}
                <span className="text-[11px] font-mono px-3 py-1 rounded-full backdrop-blur-md bg-indigo-400/30 text-indigo-100 border border-indigo-300/60 font-extrabold tracking-wider shadow-[0_0_14px_rgba(129,140,248,0.4)]">
                  OWNER
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-xl tracking-tight drop-shadow-sm">
                Konsol Pemilik &amp; Keuangan
              </h3>
              <p className="text-xs font-mono text-indigo-200 mt-0.5 font-bold">
                Penetapan Harga &amp; Transfer Bank
              </p>
            </div>

            <p className="text-xs text-slate-100 leading-relaxed font-normal">
              Penetapan harga harian gabah kering giling (GKG), approval transfer m-banking suplier, verifikasi hutang toko, serta kontrol saldo kas dan rekening pabrik.
            </p>

            {/* Frosted Glass Module Shortcuts */}
            <div className="pt-3 border-t border-white/20 space-y-2">
              <span className="text-[10px] font-mono text-indigo-200 uppercase tracking-wider block font-bold">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_13')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-indigo-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Harga Gabah & Jadwal"
                >
                  • Harga &amp; Jadwal
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_38')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-indigo-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Hutang Suplier (H-1)"
                >
                  • Hutang Suplier H-1
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_4')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-indigo-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Eksekusi Transfer Bank"
                >
                  • Transfer Hari H
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_FAKTUR_JUAL')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-indigo-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Faktur Penjualan & Piutang"
                >
                  • Faktur Penjualan
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_REPORTS')}
                  className="col-span-2 px-2.5 py-2 backdrop-blur-md bg-indigo-400/30 hover:bg-indigo-400/45 text-indigo-50 rounded-xl text-left transition truncate border border-indigo-300/60 font-bold shadow-[0_0_14px_rgba(129,140,248,0.3)] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Laporan Keuangan Eksekutif"
                >
                  • Laporan Keuangan Owner
                </button>
              </div>
            </div>

          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_13')}
            className="w-full py-3.5 px-4 backdrop-blur-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-extrabold rounded-2xl transition flex items-center justify-between border border-indigo-300/60 shadow-[0_6px_24px_rgba(99,102,241,0.55),inset_0_1px_0_rgba(255,255,255,0.45)] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none group"
          >
            <span>Buka Konsol Owner</span>
            <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* =========================================================================
            Workstation 4: Akuntansi & Pajak SAK EMKM (Super Admin) - Vivid Cyan Glass
            ========================================================================= */}
        <div className={`p-6 rounded-3xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between space-y-6 ${
          isSuperAdmin 
            ? 'bg-gradient-to-b from-cyan-500/[0.25] via-white/[0.1] to-blue-950/[0.35] border border-cyan-400/60 hover:border-cyan-300 shadow-[0_16px_40px_0_rgba(6,182,212,0.3),inset_0_1.5px_2px_0_rgba(255,255,255,0.45)] hover:scale-[1.01]' 
            : 'bg-white/[0.05] border border-white/15 opacity-60'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl backdrop-blur-xl bg-cyan-400/30 border border-cyan-300/60 flex items-center justify-center text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.55)]">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full backdrop-blur-md bg-cyan-400/30 text-cyan-100 border border-cyan-300/60 font-extrabold tracking-wider shadow-[0_0_14px_rgba(34,211,238,0.4)]">
                SUPER ADMIN
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-xl tracking-tight drop-shadow-sm">
                Akuntansi &amp; Pajak SAK EMKM
              </h3>
              <p className="text-xs font-mono text-cyan-200 mt-0.5 font-bold">
                Double-Entry &amp; Audit Log
              </p>
            </div>

            <p className="text-xs text-slate-100 leading-relaxed font-normal">
              Jurnal umum otomatis, neraca saldo terpasang, neraca keuangan seimbang Aktiva = Pasiva Rp 0, laporan laba rugi, dan catatan audit transaksi pabrik.
            </p>

            {/* Frosted Glass Module Shortcuts */}
            <div className="pt-3 border-t border-white/20 space-y-2">
              <span className="text-[10px] font-mono text-cyan-200 uppercase tracking-wider block font-bold">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_SUPER_ADMIN_ACCOUNTING')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-cyan-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  title="Jurnal SAK EMKM"
                >
                  • Jurnal SAK EMKM
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_EXPENSE_BOOK')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-cyan-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  title="Buku Kas & Biaya"
                >
                  • Buku Kas &amp; Biaya
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuditModal(true)}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-cyan-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  title="Log Audit Sistem"
                >
                  • Log Audit Sistem
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_USER_MGMT')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.12] hover:bg-white/[0.22] text-white rounded-xl text-left transition truncate border border-white/20 font-medium hover:border-cyan-300/60 shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  title="Hak Akses Pengguna"
                >
                  • Hak Akses User
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_REPORTS')}
                  className="col-span-2 px-2.5 py-2 backdrop-blur-md bg-cyan-400/30 hover:bg-cyan-400/45 text-cyan-50 rounded-xl text-left transition truncate border border-cyan-300/60 font-bold shadow-[0_0_14px_rgba(34,211,238,0.3)] focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  title="Laporan Neraca & Laba Rugi"
                >
                  • Laporan Keuangan SAK
                </button>
              </div>
            </div>

          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_SUPER_ADMIN_ACCOUNTING')}
            className="w-full py-3.5 px-4 backdrop-blur-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold rounded-2xl transition flex items-center justify-between border border-cyan-300/60 shadow-[0_6px_24px_rgba(6,182,212,0.55),inset_0_1px_0_rgba(255,255,255,0.45)] focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none group"
          >
            <span>Buka Konsol Akuntansi</span>
            <ChevronRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </section>

      {/* =========================================================================
          OPERATIONAL MASTER DATA QUICK ACCESS TRAY (Vivid Frosted Glass Tray)
          ========================================================================= */}
      <section className="relative z-10 backdrop-blur-2xl bg-gradient-to-r from-white/[0.12] via-white/[0.08] to-white/[0.12] border border-white/25 rounded-3xl p-5 shadow-[0_12px_40px_0_rgba(0,0,0,0.35),inset_0_1.5px_1.5px_0_rgba(255,255,255,0.4)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl backdrop-blur-xl bg-emerald-400/30 border border-emerald-300/60 flex items-center justify-center text-emerald-100 shadow-[0_0_16px_rgba(52,211,153,0.4)] shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-sm tracking-tight drop-shadow-xs">
              Data Master Pabrik &amp; Layanan Operasional
            </h4>
            <p className="text-xs text-slate-200 leading-normal font-normal">
              Akses cepat data suplier gabah, mitra customer toko, spesifikasi stapel beras, dan kalender pengiriman.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_SUPPLIER')}
            className="px-3.5 py-2 backdrop-blur-md bg-white/[0.14] hover:bg-white/[0.24] text-white text-xs font-bold rounded-xl border border-white/25 transition shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Master Suplier
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_CUSTOMER')}
            className="px-3.5 py-2 backdrop-blur-md bg-white/[0.14] hover:bg-white/[0.24] text-white text-xs font-bold rounded-xl border border-white/25 transition shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Master Customer
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_ITEM')}
            className="px-3.5 py-2 backdrop-blur-md bg-white/[0.14] hover:bg-white/[0.24] text-white text-xs font-bold rounded-xl border border-white/25 transition shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Master Item &amp; Stapel
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_REPORTS')}
            className="px-3.5 py-2 backdrop-blur-md bg-white/[0.14] hover:bg-white/[0.24] text-white text-xs font-bold rounded-xl border border-white/25 transition shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Laporan Keuangan
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_CALENDAR')}
            className="px-3.5 py-2 backdrop-blur-md bg-emerald-400/35 hover:bg-emerald-400/50 text-emerald-100 text-xs font-extrabold rounded-xl border border-emerald-300/60 transition flex items-center space-x-1.5 shadow-[0_0_16px_rgba(52,211,153,0.35)] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            <span>📅 Kalender Juwita</span>
          </button>
        </div>

      </section>

      {/* Audit Log Modal */}
      {showAuditModal && (
        <AuditLogModal onClose={() => setShowAuditModal(false)} />
      )}
    </div>
  );
};
