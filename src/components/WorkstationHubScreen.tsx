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
  ArrowRight, 
  CheckCircle2,
  Lock, 
  BookOpen, 
  BarChart3, 
  Users, 
  Receipt, 
  FileText, 
  Smartphone,
  Calendar,
  Layers,
  Activity,
  Building2,
  Key,
  Clock
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
    <div className="relative min-h-[calc(100vh-140px)] py-6 space-y-6">
      
      {/* Ambient Depth Background Layers */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Top Banner: Enterprise Session Control Strip */}
      <section className="relative z-10 bg-[#1b1b26] border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Sistem Operasional Online</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{currentDateFormatted}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
              Pusat Stasiun Kerja Terpadu PP Bumi Mas
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Konsol manajemen kilang dan reprocessing beras Banyuwangi. Pilih stasiun kerja yang sesuai dengan wewenang tugas operasional Anda.
            </p>
          </div>

          {/* User Session Profile & Actions */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 bg-[#14141f] p-3.5 rounded-2xl border border-slate-700/50 shrink-0 shadow-inner">
            <div className="space-y-1 px-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Pengguna Terverifikasi
              </div>
              <div className="text-sm font-medium text-slate-100 flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span>{currentUser ? currentUser.name : 'Staf Internal'}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                  {currentUser?.role || 'OPERATOR'}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-700/60 hidden sm:block"></div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }}
                className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 text-xs font-medium rounded-xl border border-slate-600/40 transition flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                title="Buka Website Landing Page Publik"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Web Publik</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium rounded-xl border border-rose-500/30 transition flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                title="Keluar dari sesi saat ini"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Keluar</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Grid: 4 Dedicated Workstation Consoles */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* =========================================================================
            Workstation 1: Pos Timbangan & Kasir (Admin 1) - Emerald Theme
            ========================================================================= */}
        <div className={`p-6 rounded-2xl bg-[#1b1b26] border transition-all duration-200 flex flex-col justify-between space-y-6 ${
          isAdmin1 
            ? 'border-emerald-500/30 hover:border-emerald-400/60 shadow-[inset_0_1px_0_rgba(16,185,129,0.12)]' 
            : 'border-slate-800 opacity-70'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                <Scale className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold tracking-wide">
                ADMIN 1
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-slate-100 text-lg">
                Pos Jembatan Timbang &amp; Kasir
              </h3>
              <p className="text-xs font-mono text-emerald-400/90 mt-0.5">
                Operasional Penimbangan &amp; DO
              </p>
            </div>

            <p className="text-xs text-slate-300/90 leading-relaxed font-normal">
              Pencatatan penimbangan truk gabah dan beras jadi (Bruto, Tara, Netto), penerbitan tiket timbang resmi (STT), surat jalan pengiriman (DO), dan kasir pelunasan toko.
            </p>

            <div className="pt-3 border-t border-slate-700/50 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_16')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Tiket Timbang (STT)"
                >
                  • Tiket Timbang (STT)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_31')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Kasir Tunai Toko"
                >
                  • Kasir Tunai Toko
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_15')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Surat Jalan (DO)"
                >
                  • Surat Jalan (DO)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_RECEIVABLES')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Piutang Toko"
                >
                  • Piutang Toko
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_CALENDAR')}
                  className="col-span-2 px-2.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-lg text-left transition truncate border border-emerald-500/30 font-medium focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
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
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition flex items-center justify-between shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none group"
          >
            <span>Buka Pos Timbangan &amp; DO</span>
            <ChevronRight className="w-4 h-4 text-emerald-100 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* =========================================================================
            Workstation 2: Gudang, Beras & Karung (Admin 2) - Amber Theme
            ========================================================================= */}
        <div className={`p-6 rounded-2xl bg-[#1b1b26] border transition-all duration-200 flex flex-col justify-between space-y-6 ${
          isAdmin2 
            ? 'border-amber-500/30 hover:border-amber-400/60 shadow-[inset_0_1px_0_rgba(245,158,11,0.12)]' 
            : 'border-slate-800 opacity-70'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold tracking-wide">
                ADMIN 2
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-slate-100 text-lg">
                Gudang, Beras &amp; Karung
              </h3>
              <p className="text-xs font-mono text-amber-400/90 mt-0.5">
                Produksi Milling &amp; Logistik
              </p>
            </div>

            <p className="text-xs text-slate-300/90 leading-relaxed font-normal">
              Tally tier susunan muatan truk, stok opname beras jadi di gudang stapel, perencanaan racikan cor milling, dan pengelolaan sak karung Cap Putri Thailand.
            </p>

            <div className="pt-3 border-t border-slate-700/50 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_42')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Rencana Cor Kiby"
                >
                  • Rencana Cor Kiby
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_8')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Permintaan Sak Karung"
                >
                  • Permintaan Sak
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_SAK_STOCK')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Stok Sak Karung"
                >
                  • Stok Sak Karung
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_BERAS_STOCK')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  title="Stok Beras Stapel"
                >
                  • Stok Beras Jadi
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_24')}
                  className="col-span-2 px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
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
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition flex items-center justify-between shadow-sm focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none group"
          >
            <span>Buka Konsol Gudang &amp; Cor</span>
            <ChevronRight className="w-4 h-4 text-amber-100 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* =========================================================================
            Workstation 3: Konsol Pemilik & Keuangan (Owner) - Purple Theme
            ========================================================================= */}
        <div className={`p-6 rounded-2xl bg-[#1b1b26] border transition-all duration-200 flex flex-col justify-between space-y-6 ${
          isOwner 
            ? 'border-indigo-500/30 hover:border-indigo-400/60 shadow-[inset_0_1px_0_rgba(99,102,241,0.12)]' 
            : 'border-slate-800 opacity-70'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-1.5">
                {pendingTransferCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-semibold">
                    {pendingTransferCount} pending
                  </span>
                )}
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold tracking-wide">
                  OWNER
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-100 text-lg">
                Konsol Pemilik &amp; Keuangan
              </h3>
              <p className="text-xs font-mono text-indigo-400/90 mt-0.5">
                Penetapan Harga &amp; Transfer Bank
              </p>
            </div>

            <p className="text-xs text-slate-300/90 leading-relaxed font-normal">
              Penetapan harga harian gabah kering giling (GKG), approval transfer m-banking suplier, verifikasi hutang toko, serta kontrol saldo kas dan rekening pabrik.
            </p>

            <div className="pt-3 border-t border-slate-700/50 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_13')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Harga Gabah & Jadwal"
                >
                  • Harga &amp; Jadwal
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_38')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Hutang Suplier (H-1)"
                >
                  • Hutang Suplier H-1
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_4')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Eksekusi Transfer Bank"
                >
                  • Transfer Hari H
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_FAKTUR_JUAL')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Faktur Penjualan & Piutang"
                >
                  • Faktur Penjualan
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_REPORTS')}
                  className="col-span-2 px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
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
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center justify-between shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none group"
          >
            <span>Buka Konsol Owner</span>
            <ChevronRight className="w-4 h-4 text-indigo-100 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* =========================================================================
            Workstation 4: Akuntansi & Pajak SAK EMKM (Super Admin) - Blue Theme
            ========================================================================= */}
        <div className={`p-6 rounded-2xl bg-[#1b1b26] border transition-all duration-200 flex flex-col justify-between space-y-6 ${
          isSuperAdmin 
            ? 'border-blue-500/30 hover:border-blue-400/60 shadow-[inset_0_1px_0_rgba(59,130,246,0.12)]' 
            : 'border-slate-800 opacity-70'
        }`}>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold tracking-wide">
                SUPER ADMIN
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-slate-100 text-lg">
                Akuntansi &amp; Pajak SAK EMKM
              </h3>
              <p className="text-xs font-mono text-blue-400/90 mt-0.5">
                Double-Entry &amp; Audit Log
              </p>
            </div>

            <p className="text-xs text-slate-300/90 leading-relaxed font-normal">
              Jurnal umum otomatis, neraca saldo terpasang, neraca keuangan seimbang Aktiva = Pasiva Rp 0, laporan laba rugi, dan catatan audit transaksi pabrik.
            </p>

            <div className="pt-3 border-t border-slate-700/50 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Pintasan Cepat Modul:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_SUPER_ADMIN_ACCOUNTING')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                  title="Jurnal SAK EMKM"
                >
                  • Jurnal SAK EMKM
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_EXPENSE_BOOK')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                  title="Buku Kas & Biaya"
                >
                  • Buku Kas &amp; Biaya
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuditModal(true)}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                  title="Log Audit Sistem"
                >
                  • Log Audit Sistem
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_USER_MGMT')}
                  className="px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                  title="Hak Akses Pengguna"
                >
                  • Hak Akses User
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_REPORTS')}
                  className="col-span-2 px-2.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 rounded-lg text-left transition truncate border border-slate-700/60 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
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
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition flex items-center justify-between shadow-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none group"
          >
            <span>Buka Konsol Akuntansi</span>
            <ChevronRight className="w-4 h-4 text-blue-100 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </section>

      {/* Operational Master Data Quick Access Bar */}
      <section className="relative z-10 bg-[#1b1b26] border border-slate-700/50 rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-sm">
              Data Master Pabrik &amp; Layanan Operasional
            </h4>
            <p className="text-xs text-slate-400 leading-normal">
              Akses cepat data suplier gabah, mitra customer toko, spesifikasi stapel beras, dan kalender pengiriman.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_SUPPLIER')}
            className="px-3.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/60 transition focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Master Suplier
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_CUSTOMER')}
            className="px-3.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/60 transition focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Master Customer
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_ITEM')}
            className="px-3.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/60 transition focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Master Item &amp; Stapel
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_REPORTS')}
            className="px-3.5 py-2 bg-[#14141f] hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/60 transition focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Laporan Keuangan
          </button>
          
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_CALENDAR')}
            className="px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-500/40 transition flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
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
