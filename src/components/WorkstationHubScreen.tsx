import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scale, Package, Shield, FileSpreadsheet, ChevronRight, 
  UserCheck, LogOut, ExternalLink, ArrowRight, CheckCircle2,
  Lock, BookOpen, BarChart3, Users, Receipt, FileText, Smartphone
} from 'lucide-react';
import { RoleType } from '../types';
import { AuditLogModal } from './AuditLogModal';

// Subtle Banyuwangi Batik Gajah Oling Background Pattern
const BatikGajahOlingPattern: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <div 
    className="pointer-events-none absolute inset-0"
    style={{
      opacity,
      backgroundImage: `radial-gradient(#d4af37 0.75px, transparent 0.75px), radial-gradient(#10b981 0.75px, transparent 0.75px)`,
      backgroundSize: '36px 36px',
      backgroundPosition: '0 0, 18px 18px'
    }}
  >
    <svg 
      className="w-full h-full opacity-60" 
      xmlns="http://www.w3.org/2000/svg"
      patternUnits="userSpaceOnUse"
    >
      <defs>
        <pattern id="batik-hub-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 40,40 m -20,0 a 20,20 0 1,1 40,0 a 20,20 0 1,1 -40,0 M 40,40 m -10,0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0" fill="none" stroke="#d4af37" strokeWidth="0.8" opacity="0.7" />
          <path d="M 40,20 C 50,20 60,30 60,40 C 60,50 50,60 40,60 C 30,60 25,50 28,42 C 30,35 37,34 40,38" fill="none" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 20,20 Q 30,30 40,20 Q 50,30 60,20 Q 50,10 40,20 Q 30,10 20,20 Z" fill="none" stroke="#10b981" strokeWidth="0.8" opacity="0.6" />
          <path d="M 20,60 Q 30,50 40,60 Q 50,50 60,60 Q 50,70 40,60 Q 30,70 20,60 Z" fill="none" stroke="#10b981" strokeWidth="0.8" opacity="0.6" />
          <circle cx="40" cy="40" r="3" fill="#d4af37" opacity="0.8" />
          <circle cx="10" cy="10" r="1.5" fill="#d4af37" opacity="0.5" />
          <circle cx="70" cy="10" r="1.5" fill="#d4af37" opacity="0.5" />
          <circle cx="10" cy="70" r="1.5" fill="#d4af37" opacity="0.5" />
          <circle cx="70" cy="70" r="1.5" fill="#d4af37" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#batik-hub-pattern)" />
    </svg>
  </div>
);

export const WorkstationHubScreen: React.FC = () => {
  const { setRole, setActiveScreen, currentUser, logout, weighbridgeInList } = useApp();
  const [showAuditModal, setShowAuditModal] = useState(false);

  const pendingTransferCount = weighbridgeInList.filter(w => w.transfer_status === 'PENDING_PRICE').length;

  const handleEnterWorkstation = (targetRole: RoleType, targetScreen: string) => {
    setRole(targetRole);
    setActiveScreen(targetScreen);
  };

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isOwner = currentUser?.role === 'OWNER' || isSuperAdmin;
  const isAdmin1 = currentUser?.role === 'ADMIN1' || isSuperAdmin;
  const isAdmin2 = currentUser?.role === 'ADMIN2' || isSuperAdmin;

  return (
    <div className="relative min-h-[calc(100vh-140px)] py-6 space-y-8">
      <BatikGajahOlingPattern opacity={0.04} />

      {/* Top Banner: Authenticated Session Info */}
      <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] font-bold">
                Internal ERP Consoles • PP BUMI MAS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pintu Masuk Stasiun Kerja Staf Pabrik
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Selamat datang di konsol operasional terpadu kilang dan reprocessing beras. Silakan pilih stasiun kerja sesuai penugasan Anda untuk mengelola operasional pabrik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Sesi Login Terverifikasi
              </div>
              <div className="text-sm font-bold text-white flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>{currentUser ? currentUser.name : 'Staf Internal'}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-300">
                  {currentUser?.role || 'OPERATOR'}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center space-x-1.5"
                title="Buka Website Landing Page Publik"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Website Publik</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-3 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold rounded-lg border border-rose-500/30 transition flex items-center space-x-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 4 Dedicated Workstation Consoles */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Workstation 1: Pos Timbangan & Kasir (Admin 1) */}
        <div className={`p-6 rounded-2xl bg-slate-900/80 border transition flex flex-col justify-between space-y-6 shadow-xl ${
          isAdmin1 ? 'border-emerald-500/40 hover:border-emerald-400' : 'border-slate-800 opacity-75'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                <Scale className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-semibold">
                ADMIN 1
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg">Pos Jembatan Timbang &amp; Kasir</h3>
              <p className="text-xs font-mono text-emerald-400 font-medium mt-0.5">Operasional Penimbangan &amp; DO</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Pencatatan penimbangan truk gabah dan beras jadi (Bruto, Tara, Netto), penerbitan tiket timbang resmi, surat jalan pengiriman (DO), dan kasir pelunasan toko.
            </p>

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Pintasan Cepat Modul:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_16')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Tiket Timbang (STT)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_31')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Kasir Tunai Toko
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_15')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Surat Jalan (DO)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_RECEIVABLES')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Piutang Toko
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_16')}
            className="w-full py-3 bg-[#0f3e2e] hover:bg-[#15533e] text-emerald-200 font-bold text-xs rounded-xl border border-emerald-600/40 transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Buka Pos Timbangan</span>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Workstation 2: Gudang, Beras & Karung (Admin 2) */}
        <div className={`p-6 rounded-2xl bg-slate-900/80 border transition flex flex-col justify-between space-y-6 shadow-xl ${
          isAdmin2 ? 'border-amber-500/40 hover:border-amber-400' : 'border-slate-800 opacity-75'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 font-semibold">
                ADMIN 2
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg">Gudang, Beras &amp; Karung</h3>
              <p className="text-xs font-mono text-amber-400 font-medium mt-0.5">Produksi Milling &amp; Logistik</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tally tier susunan muatan truk, stok opname beras jadi di gudang stapel, perencanaan racikan cor milling, dan pengelolaan sak karung Cap Putri Thailand.
            </p>

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Pintasan Cepat Modul:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_42')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Rencana Cor Kiby
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_8')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Permintaan Sak
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_SAK_STOCK')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Stok Sak Karung
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_24')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Tally Tier Truk
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_42')}
            className="w-full py-3 bg-[#38260f] hover:bg-[#4a3314] text-amber-200 font-bold text-xs rounded-xl border border-amber-600/40 transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Buka Konsol Gudang</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Workstation 3: Konsol Pemilik & Keuangan (Owner) */}
        <div className={`p-6 rounded-2xl bg-slate-900/80 border transition flex flex-col justify-between space-y-6 shadow-xl ${
          isOwner ? 'border-sky-500/40 hover:border-sky-400' : 'border-slate-800 opacity-75'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-md">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-1.5">
                {pendingTransferCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold">
                    {pendingTransferCount} antri
                  </span>
                )}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800 font-semibold">
                  OWNER
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg">Konsol Pemilik &amp; Keuangan</h3>
              <p className="text-xs font-mono text-sky-400 font-medium mt-0.5">Penetapan Harga &amp; Transfer Bank</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Penetapan harga harian gabah kering giling (GKG), approval transfer m-banking suplier, verifikasi hutang toko, serta kontrol saldo kas dan rekening pabrik.
            </p>

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Pintasan Cepat Modul:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_13')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Harga &amp; Jadwal
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_38')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Hutang Suplier (H-1)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_4')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Approval Transfer H
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_FAKTUR_JUAL')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Faktur Penjualan
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_13')}
            className="w-full py-3 bg-[#113247] hover:bg-[#17435f] text-sky-200 font-bold text-xs rounded-xl border border-sky-600/40 transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Buka Konsol Owner</span>
            <ChevronRight className="w-4 h-4 text-sky-400" />
          </button>
        </div>

        {/* Workstation 4: Akuntansi & Pajak SAK EMKM (Super Admin) */}
        <div className={`p-6 rounded-2xl bg-slate-900/80 border transition flex flex-col justify-between space-y-6 shadow-xl ${
          isSuperAdmin ? 'border-purple-500/40 hover:border-purple-400' : 'border-slate-800 opacity-75'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800 font-semibold">
                SUPER ADMIN
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg">Akuntansi &amp; Pajak SAK EMKM</h3>
              <p className="text-xs font-mono text-purple-400 font-medium mt-0.5">Double-Entry &amp; Audit Log</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Jurnal umum otomatis, neraca saldo terpasang, neraca keuangan seimbang Aktiva = Pasiva Rp 0, laporan laba rugi, dan catatan audit transaksi pabrik.
            </p>

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Pintasan Cepat Modul:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_SUPER_ADMIN_ACCOUNTING')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Jurnal SAK EMKM
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_EXPENSE_BOOK')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Buku Kas &amp; Biaya
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuditModal(true)}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Log Audit Sistem
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_USER_MGMT')}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-left transition truncate"
                >
                  • Hak Akses User
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_SUPER_ADMIN_ACCOUNTING')}
            className="w-full py-3 bg-[#2d1b46] hover:bg-[#3d245e] text-purple-200 font-bold text-xs rounded-xl border border-purple-600/40 transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Buka Konsol Akuntansi</span>
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </button>
        </div>

      </div>

      {/* Operational Master Data Quick Access Bar */}
      <div className="relative z-10 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Master Data Pabrik</h4>
            <p className="text-[11px] text-slate-400">Data suplier gabah, pelanggan toko, dan spesifikasi stapel beras.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_SUPPLIER')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition"
          >
            Master Suplier
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_CUSTOMER')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition"
          >
            Master Customer
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_ITEM')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition"
          >
            Master Item &amp; Stapel
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_REPORTS')}
            className="px-3 py-1.5 bg-[#0f3e2e] hover:bg-[#15533e] text-emerald-200 font-semibold text-xs rounded-lg border border-emerald-600/40 transition"
          >
            Laporan Keuangan
          </button>
        </div>
      </div>

      {showAuditModal && (
        <AuditLogModal onClose={() => setShowAuditModal(false)} />
      )}
    </div>
  );
};
