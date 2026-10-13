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
          LUMINOUS AMBIENT GLOW BACKDROP (Essential for Glassmorphism Refraction)
          ========================================================================= */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" 
        aria-hidden="true"
      >
        {/* Top Header Ambient Light */}
        <div className="absolute -top-16 left-1/4 w-[480px] h-[320px] bg-emerald-500/20 rounded-full blur-[110px]" />
        <div className="absolute -top-16 right-1/4 w-[480px] h-[320px] bg-indigo-500/20 rounded-full blur-[110px]" />

        {/* Workstation Card 1 (Emerald Glow) */}
        <div className="absolute top-[280px] left-[-40px] w-[340px] h-[380px] bg-emerald-500/20 rounded-full blur-[100px]" />
        
        {/* Workstation Card 2 (Amber / Gold Glow) */}
        <div className="absolute top-[320px] left-[26%] w-[340px] h-[380px] bg-amber-500/20 rounded-full blur-[100px]" />
        
        {/* Workstation Card 3 (Indigo / Violet Glow) */}
        <div className="absolute top-[320px] right-[26%] w-[340px] h-[380px] bg-indigo-500/20 rounded-full blur-[100px]" />
        
        {/* Workstation Card 4 (Cyan / Blue Glow) */}
        <div className="absolute top-[280px] right-[-40px] w-[340px] h-[380px] bg-cyan-500/20 rounded-full blur-[100px]" />

        {/* Bottom Utility Glow */}
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[220px] bg-emerald-600/15 rounded-full blur-[100px]" />
      </div>

      {/* =========================================================================
          TOP BANNER: FROSTED GLASS SESSION HUB
          ========================================================================= */}
      <section className="relative z-10 backdrop-blur-2xl bg-white/[0.04] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.2)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-mono uppercase tracking-wider shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Konsol Terpadu Online</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md bg-white/[0.06] border border-white/10 text-slate-300 text-[11px] font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{currentDateFormatted}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-sm">
              Pusat Stasiun Kerja Staf Pabrik PP Bumi Mas
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Antarmuka operasional kilang dan reprocessing beras Banyuwangi. Pilih stasiun kerja tugas Anda di bawah untuk membuka modul operasional.
            </p>
          </div>

          {/* User Session Glass Capsule */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 backdrop-blur-xl bg-white/[0.06] p-3.5 rounded-2xl border border-white/15 shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]">
            <div className="space-y-1 px-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Sesi Terverifikasi
              </div>
              <div className="text-sm font-semibold text-white flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <span>{currentUser ? currentUser.name : 'Staf Internal'}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-emerald-300 font-bold">
                  {currentUser?.role || 'OPERATOR'}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/15 hidden sm:block"></div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }}
                className="px-3.5 py-2 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition flex items-center space-x-1.5 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                title="Buka Website Landing Page Publik"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                <span>Web Publik</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-2 backdrop-blur-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold rounded-xl border border-rose-400/30 transition flex items-center space-x-1.5 shadow-sm focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                title="Keluar dari sesi staf"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-300" />
                <span>Keluar</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          GRID: 4 FROSTED GLASS WORKSTATION CONSOLES
          ========================================================================= */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* =========================================================================
            Workstation 1: Pos Timbangan & Kasir (Admin 1) - Frosted Emerald Glass
            ========================================================================= */}
        <div className={`p-6 rounded-3xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between space-y-6 ${
          isAdmin1 
            ? 'bg-gradient-to-b from-white/[0.08] to-emerald-950/20 border border-emerald-400/30 hover:border-emerald-300/60 shadow-[0_12px_36px_0_rgba(0,0,0,0.4),inset_0_1px_2px_0_rgba(255,255,255,0.25)] hover:scale-[1.01]' 
            : 'bg-white/[0.03] border border-white/10 opacity-60'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl backdrop-blur-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
                <Scale className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-3 py-1 rounded-full backdrop-blur-md bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 font-bold tracking-wider">
                ADMIN 1
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-lg tracking-tight">
                Pos Timbangan &amp; Kasir
              </h3>
              <p className="text-xs font-mono text-emerald-300 mt-0.5">
                Operasional Penimbangan &amp; DO
              </p>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              Pencatatan penimbangan truk gabah dan beras jadi (Bruto, Tara, Netto), penerbitan tiket timbang resmi (STT), surat jalan (DO), dan kasir pelunasan toko.
            </p>

            {/* Frosted Glass Module Shortcuts */}
            <div className="pt-3 border-t border-white/15 space-y-2">
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_16')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Tiket Timbang (STT)"
                >
                  • Tiket Timbang (STT)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_31')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Kasir Tunai Toko"
                >
                  • Kasir Tunai Toko
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_15')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Surat Jalan (DO)"
                >
                  • Surat Jalan (DO)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_RECEIVABLES')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Piutang Toko"
                >
                  • Piutang Toko
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_CALENDAR')}
                  className="col-span-2 px-2.5 py-2 backdrop-blur-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-xl text-left transition truncate border border-emerald-400/40 font-semibold shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
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
            className="w-full py-3 px-4 backdrop-blur-xl bg-emerald-500/85 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl transition flex items-center justify-between border border-emerald-400/50 shadow-[0_4px_16px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none group"
          >
            <span>Buka Pos Timbangan &amp; DO</span>
            <ChevronRight className="w-4 h-4 text-emerald-100 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* =========================================================================
            Workstation 2: Gudang, Beras & Karung (Admin 2) - Frosted Amber Glass
            ========================================================================= */}
        <div className={`p-6 rounded-3xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between space-y-6 ${
          isAdmin2 
            ? 'bg-gradient-to-b from-white/[0.08] to-amber-950/20 border border-amber-400/30 hover:border-amber-300/60 shadow-[0_12px_36px_0_rgba(0,0,0,0.4),inset_0_1px_2px_0_rgba(255,255,255,0.25)] hover:scale-[1.01]' 
            : 'bg-white/[0.03] border border-white/10 opacity-60'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl backdrop-blur-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_4px_16px_rgba(245,158,11,0.3)]">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-3 py-1 rounded-full backdrop-blur-md bg-amber-500/20 text-amber-200 border border-amber-400/40 font-bold tracking-wider">
                ADMIN 2
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-lg tracking-tight">
                Gudang, Beras &amp; Karung
              </h3>
              <p className="text-xs font-mono text-amber-300 mt-0.5">
                Produksi Milling &amp; Logistik
              </p>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              Tally tier susunan muatan truk, stok opname beras jadi di gudang stapel, perencanaan racikan cor milling, dan pengelolaan sak karung Cap Putri Thailand.
            </p>

            {/* Frosted Glass Module Shortcuts */}
            <div className="pt-3 border-t border-white/15 space-y-2">
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_42')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Rencana Cor Kiby"
                >
                  • Rencana Cor Kiby
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_8')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Permintaan Sak Karung"
                >
                  • Permintaan Sak
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_SAK_STOCK')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Stok Sak Karung"
                >
                  • Stok Sak Karung
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_BERAS_STOCK')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Stok Beras Stapel"
                >
                  • Stok Beras Jadi
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_24')}
                  className="col-span-2 px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
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
            className="w-full py-3 px-4 backdrop-blur-xl bg-amber-500/85 hover:bg-amber-500 text-white text-xs font-bold rounded-2xl transition flex items-center justify-between border border-amber-400/50 shadow-[0_4px_16px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none group"
          >
            <span>Buka Konsol Gudang &amp; Cor</span>
            <ChevronRight className="w-4 h-4 text-amber-100 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* =========================================================================
            Workstation 3: Konsol Pemilik & Keuangan (Owner) - Frosted Indigo Glass
            ========================================================================= */}
        <div className={`p-6 rounded-3xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between space-y-6 ${
          isOwner 
            ? 'bg-gradient-to-b from-white/[0.08] to-indigo-950/20 border border-indigo-400/30 hover:border-indigo-300/60 shadow-[0_12px_36px_0_rgba(0,0,0,0.4),inset_0_1px_2px_0_rgba(255,255,255,0.25)] hover:scale-[1.01]' 
            : 'bg-white/[0.03] border border-white/10 opacity-60'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl backdrop-blur-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-[0_4px_16px_rgba(99,102,241,0.3)]">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-1.5">
                {pendingTransferCount > 0 && (
                  <span className="px-2.5 py-1 rounded-full backdrop-blur-md bg-rose-500/25 text-rose-200 border border-rose-400/40 text-[10px] font-mono font-bold shadow-xs">
                    {pendingTransferCount} antri
                  </span>
                )}
                <span className="text-[10px] font-mono px-3 py-1 rounded-full backdrop-blur-md bg-indigo-500/20 text-indigo-200 border border-indigo-400/40 font-bold tracking-wider">
                  OWNER
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white text-lg tracking-tight">
                Konsol Pemilik &amp; Keuangan
              </h3>
              <p className="text-xs font-mono text-indigo-300 mt-0.5">
                Penetapan Harga &amp; Transfer Bank
              </p>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              Penetapan harga harian gabah kering giling (GKG), approval transfer m-banking suplier, verifikasi hutang toko, serta kontrol saldo kas dan rekening pabrik.
            </p>

            {/* Frosted Glass Module Shortcuts */}
            <div className="pt-3 border-t border-white/15 space-y-2">
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_13')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Harga Gabah & Jadwal"
                >
                  • Harga &amp; Jadwal
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_38')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Hutang Suplier (H-1)"
                >
                  • Hutang Suplier H-1
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_4')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Eksekusi Transfer Bank"
                >
                  • Transfer Hari H
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_FAKTUR_JUAL')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Faktur Penjualan & Piutang"
                >
                  • Faktur Penjualan
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_REPORTS')}
                  className="col-span-2 px-2.5 py-2 backdrop-blur-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 rounded-xl text-left transition truncate border border-indigo-400/40 font-semibold shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
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
            className="w-full py-3 px-4 backdrop-blur-xl bg-indigo-500/85 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl transition flex items-center justify-between border border-indigo-400/50 shadow-[0_4px_16px_rgba(99,102,241,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none group"
          >
            <span>Buka Konsol Owner</span>
            <ChevronRight className="w-4 h-4 text-indigo-100 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* =========================================================================
            Workstation 4: Akuntansi & Pajak SAK EMKM (Super Admin) - Frosted Cyan Glass
            ========================================================================= */}
        <div className={`p-6 rounded-3xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between space-y-6 ${
          isSuperAdmin 
            ? 'bg-gradient-to-b from-white/[0.08] to-cyan-950/20 border border-cyan-400/30 hover:border-cyan-300/60 shadow-[0_12px_36px_0_rgba(0,0,0,0.4),inset_0_1px_2px_0_rgba(255,255,255,0.25)] hover:scale-[1.01]' 
            : 'bg-white/[0.03] border border-white/10 opacity-60'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl backdrop-blur-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_4px_16px_rgba(6,182,212,0.3)]">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-3 py-1 rounded-full backdrop-blur-md bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-bold tracking-wider">
                SUPER ADMIN
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-lg tracking-tight">
                Akuntansi &amp; Pajak SAK EMKM
              </h3>
              <p className="text-xs font-mono text-cyan-300 mt-0.5">
                Double-Entry &amp; Audit Log
              </p>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              Jurnal umum otomatis, neraca saldo terpasang, neraca keuangan seimbang Aktiva = Pasiva Rp 0, laporan laba rugi, dan catatan audit transaksi pabrik.
            </p>

            {/* Frosted Glass Module Shortcuts */}
            <div className="pt-3 border-t border-white/15 space-y-2">
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_SUPER_ADMIN_ACCOUNTING')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  title="Jurnal SAK EMKM"
                >
                  • Jurnal SAK EMKM
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_EXPENSE_BOOK')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  title="Buku Kas & Biaya"
                >
                  • Buku Kas &amp; Biaya
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuditModal(true)}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  title="Log Audit Sistem"
                >
                  • Log Audit Sistem
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_USER_MGMT')}
                  className="px-2.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 rounded-xl text-left transition truncate border border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  title="Hak Akses Pengguna"
                >
                  • Hak Akses User
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_REPORTS')}
                  className="col-span-2 px-2.5 py-2 backdrop-blur-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 rounded-xl text-left transition truncate border border-cyan-400/40 font-semibold shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
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
            className="w-full py-3 px-4 backdrop-blur-xl bg-cyan-500/85 hover:bg-cyan-500 text-white text-xs font-bold rounded-2xl transition flex items-center justify-between border border-cyan-400/50 shadow-[0_4px_16px_rgba(6,182,212,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none group"
          >
            <span>Buka Konsol Akuntansi</span>
            <ChevronRight className="w-4 h-4 text-cyan-100 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </section>

      {/* =========================================================================
          OPERATIONAL MASTER DATA QUICK ACCESS TRAY (Frosted Glass Tray)
          ========================================================================= */}
      <section className="relative z-10 backdrop-blur-2xl bg-white/[0.04] border border-white/15 rounded-3xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl backdrop-blur-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-sm shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm tracking-tight">
              Data Master Pabrik &amp; Layanan Operasional
            </h4>
            <p className="text-xs text-slate-300 leading-normal">
              Akses cepat data suplier gabah, mitra customer toko, spesifikasi stapel beras, dan kalender pengiriman.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_SUPPLIER')}
            className="px-3.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 text-xs font-semibold rounded-xl border border-white/15 transition shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Master Suplier
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_CUSTOMER')}
            className="px-3.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 text-xs font-semibold rounded-xl border border-white/15 transition shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Master Customer
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_ITEM')}
            className="px-3.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 text-xs font-semibold rounded-xl border border-white/15 transition shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Master Item &amp; Stapel
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_REPORTS')}
            className="px-3.5 py-2 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.14] text-slate-100 text-xs font-semibold rounded-xl border border-white/15 transition shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Laporan Keuangan
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_CALENDAR')}
            className="px-3.5 py-2 backdrop-blur-md bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-200 text-xs font-bold rounded-xl border border-emerald-400/40 transition flex items-center space-x-1.5 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
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
