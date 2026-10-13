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
const BatikGajahOlingPattern: React.FC<{ opacity?: number }> = ({ opacity = 0.02 }) => (
  <div 
    className="pointer-events-none absolute inset-0"
    style={{
      opacity,
      backgroundImage: `radial-gradient(#c3c3cc 0.6px, transparent 0.6px)`,
      backgroundSize: '36px 36px',
      backgroundPosition: '0 0'
    }}
  >
    <svg 
      className="w-full h-full opacity-40" 
      xmlns="http://www.w3.org/2000/svg"
      patternUnits="userSpaceOnUse"
    >
      <defs>
        <pattern id="batik-hub-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 40,40 m -20,0 a 20,20 0 1,1 40,0 a 20,20 0 1,1 -40,0 M 40,40 m -10,0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0" fill="none" stroke="#70707d" strokeWidth="0.8" opacity="0.5" />
          <path d="M 40,20 C 50,20 60,30 60,40 C 60,50 50,60 40,60 C 30,60 25,50 28,42 C 30,35 37,34 40,38" fill="none" stroke="#ededf3" strokeWidth="1.0" strokeLinecap="round" opacity="0.4" />
          <path d="M 20,20 Q 30,30 40,20 Q 50,30 60,20 Q 50,10 40,20 Q 30,10 20,20 Z" fill="none" stroke="#70707d" strokeWidth="0.8" opacity="0.3" />
          <path d="M 20,60 Q 30,50 40,60 Q 50,50 60,60 Q 50,70 40,60 Q 30,70 20,60 Z" fill="none" stroke="#70707d" strokeWidth="0.8" opacity="0.3" />
          <circle cx="40" cy="40" r="2.5" fill="#ededf3" opacity="0.4" />
          <circle cx="10" cy="10" r="1.5" fill="#70707d" opacity="0.3" />
          <circle cx="70" cy="10" r="1.5" fill="#70707d" opacity="0.3" />
          <circle cx="10" cy="70" r="1.5" fill="#70707d" opacity="0.3" />
          <circle cx="70" cy="70" r="1.5" fill="#70707d" opacity="0.3" />
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
      <BatikGajahOlingPattern opacity={0.02} />

      {/* Top Banner: Authenticated Session Info */}
      <div className="relative z-10 bg-[#1e1e2a] border border-[#70707d]/20 rounded-[12px] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#5266eb]"></span>
              <span className="text-xs font-mono uppercase tracking-widest text-[#c3c3cc]">
                Internal ERP Consoles • PP BUMI MAS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#ededf3] tracking-tight">
              Pintu Masuk Stasiun Kerja Staf Pabrik
            </h1>
            <p className="text-xs sm:text-sm text-[#c3c3cc] max-w-2xl leading-relaxed">
              Selamat datang di konsol operasional terpadu kilang dan reprocessing beras. Silakan pilih stasiun kerja sesuai penugasan Anda untuk mengelola operasional pabrik.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 bg-[#272735] p-3.5 rounded-2xl sm:rounded-full border border-[#70707d]/30 shrink-0">
            <div className="space-y-0.5 px-2">
              <div className="text-[10px] font-mono text-[#c3c3cc] uppercase tracking-wider">
                Sesi Terverifikasi
              </div>
              <div className="text-sm font-normal text-[#ededf3] flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-[#5266eb]" />
                <span>{currentUser ? currentUser.name : 'Staf Internal'}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#1e1e2a] border border-[#70707d]/30 text-[#c3c3cc]">
                  {currentUser?.role || 'OPERATOR'}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-[#70707d]/30 hidden sm:block"></div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }}
                className="px-3.5 py-1.5 bg-[#1e1e2a] hover:bg-[#323244] text-[#ededf3] text-xs font-normal rounded-full border border-[#70707d]/30 transition flex items-center space-x-1.5"
                title="Buka Website Landing Page Publik"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#c3c3cc]" />
                <span>Web Publik</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-1.5 bg-[#1e1e2a] hover:bg-rose-950/40 text-rose-300 text-xs font-normal rounded-full border border-rose-500/30 transition flex items-center space-x-1.5"
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
        <div className={`p-6 rounded-[12px] bg-[#1e1e2a] border transition flex flex-col justify-between space-y-6 ${
          isAdmin1 ? 'border-[#70707d]/30 hover:border-[#ededf3]/50' : 'border-[#70707d]/15 opacity-75'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[12px] bg-[#272735] border border-[#70707d]/30 flex items-center justify-center text-[#ededf3]">
                <Scale className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#272735] text-[#c3c3cc] border border-[#70707d]/30 font-medium">
                ADMIN 1
              </span>
            </div>

            <div>
              <h3 className="font-medium text-[#ededf3] text-lg">Pos Jembatan Timbang &amp; Kasir</h3>
              <p className="text-xs font-mono text-[#c3c3cc] mt-0.5">Operasional Penimbangan &amp; DO</p>
            </div>

            <p className="text-xs text-[#c3c3cc] leading-relaxed">
              Pencatatan penimbangan truk gabah dan beras jadi (Bruto, Tara, Netto), penerbitan tiket timbang resmi, surat jalan pengiriman (DO), dan kasir pelunasan toko.
            </p>

            <div className="pt-2 border-t border-[#70707d]/20 space-y-1.5">
              <span className="text-[10px] font-mono text-[#c3c3cc] uppercase tracking-wider block">Pintasan Cepat Modul:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_16')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Tiket Timbang (STT)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_31')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Kasir Tunai Toko
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_15')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Surat Jalan (DO)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_RECEIVABLES')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Piutang Toko
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_CALENDAR')}
                  className="col-span-2 px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-amber-300 rounded-full text-left transition truncate border border-amber-500/30 font-semibold"
                >
                  • Kalender Juwita (Jadwal DO)
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('ADMIN1', 'SCREEN_16')}
            className="w-full py-2.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] text-xs font-medium rounded-full border border-[#70707d]/30 transition flex items-center justify-center space-x-2"
          >
            <span>Buka Pos Timbangan</span>
            <ChevronRight className="w-4 h-4 text-[#c3c3cc]" />
          </button>
        </div>

        {/* Workstation 2: Gudang, Beras & Karung (Admin 2) */}
        <div className={`p-6 rounded-[12px] bg-[#1e1e2a] border transition flex flex-col justify-between space-y-6 ${
          isAdmin2 ? 'border-[#70707d]/30 hover:border-[#ededf3]/50' : 'border-[#70707d]/15 opacity-75'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[12px] bg-[#272735] border border-[#70707d]/30 flex items-center justify-center text-[#ededf3]">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#272735] text-[#c3c3cc] border border-[#70707d]/30 font-medium">
                ADMIN 2
              </span>
            </div>

            <div>
              <h3 className="font-medium text-[#ededf3] text-lg">Gudang, Beras &amp; Karung</h3>
              <p className="text-xs font-mono text-[#c3c3cc] mt-0.5">Produksi Milling &amp; Logistik</p>
            </div>

            <p className="text-xs text-[#c3c3cc] leading-relaxed">
              Tally tier susunan muatan truk, stok opname beras jadi di gudang stapel, perencanaan racikan cor milling, dan pengelolaan sak karung Cap Putri Thailand.
            </p>

            <div className="pt-2 border-t border-[#70707d]/20 space-y-1.5">
              <span className="text-[10px] font-mono text-[#c3c3cc] uppercase tracking-wider block">Pintasan Cepat Modul:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_42')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Rencana Cor Kiby
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_8')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Permintaan Sak
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_SAK_STOCK')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Stok Sak Karung
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_24')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Tally Tier Truk
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('ADMIN2', 'SCREEN_42')}
            className="w-full py-2.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] text-xs font-medium rounded-full border border-[#70707d]/30 transition flex items-center justify-center space-x-2"
          >
            <span>Buka Konsol Gudang</span>
            <ChevronRight className="w-4 h-4 text-[#c3c3cc]" />
          </button>
        </div>

        {/* Workstation 3: Konsol Pemilik & Keuangan (Owner) */}
        <div className={`p-6 rounded-[12px] bg-[#1e1e2a] border transition flex flex-col justify-between space-y-6 ${
          isOwner ? 'border-[#70707d]/30 hover:border-[#ededf3]/50' : 'border-[#70707d]/15 opacity-75'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[12px] bg-[#272735] border border-[#70707d]/30 flex items-center justify-center text-[#ededf3]">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-1.5">
                {pendingTransferCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/40 text-[10px] font-mono font-medium">
                    {pendingTransferCount} antri
                  </span>
                )}
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#272735] text-[#c3c3cc] border border-[#70707d]/30 font-medium">
                  OWNER
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-[#ededf3] text-lg">Konsol Pemilik &amp; Keuangan</h3>
              <p className="text-xs font-mono text-[#c3c3cc] mt-0.5">Penetapan Harga &amp; Transfer Bank</p>
            </div>

            <p className="text-xs text-[#c3c3cc] leading-relaxed">
              Penetapan harga harian gabah kering giling (GKG), approval transfer m-banking suplier, verifikasi hutang toko, serta kontrol saldo kas dan rekening pabrik.
            </p>

            <div className="pt-2 border-t border-[#70707d]/20 space-y-1.5">
              <span className="text-[10px] font-mono text-[#c3c3cc] uppercase tracking-wider block">Pintasan Cepat Modul:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_13')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Harga &amp; Jadwal
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_38')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Hutang Suplier (H-1)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_4')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Approval Transfer H
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_FAKTUR_JUAL')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Faktur Penjualan
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('OWNER', 'SCREEN_13')}
            className="w-full py-2.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] text-xs font-medium rounded-full border border-[#70707d]/30 transition flex items-center justify-center space-x-2"
          >
            <span>Buka Konsol Owner</span>
            <ChevronRight className="w-4 h-4 text-[#c3c3cc]" />
          </button>
        </div>

        {/* Workstation 4: Akuntansi & Pajak SAK EMKM (Super Admin) */}
        <div className={`p-6 rounded-[12px] bg-[#1e1e2a] border transition flex flex-col justify-between space-y-6 ${
          isSuperAdmin ? 'border-[#70707d]/30 hover:border-[#ededf3]/50' : 'border-[#70707d]/15 opacity-75'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[12px] bg-[#272735] border border-[#70707d]/30 flex items-center justify-center text-[#ededf3]">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#272735] text-[#c3c3cc] border border-[#70707d]/30 font-medium">
                SUPER ADMIN
              </span>
            </div>

            <div>
              <h3 className="font-medium text-[#ededf3] text-lg">Akuntansi &amp; Pajak SAK EMKM</h3>
              <p className="text-xs font-mono text-[#c3c3cc] mt-0.5">Double-Entry &amp; Audit Log</p>
            </div>

            <p className="text-xs text-[#c3c3cc] leading-relaxed">
              Jurnal umum otomatis, neraca saldo terpasang, neraca keuangan seimbang Aktiva = Pasiva Rp 0, laporan laba rugi, dan catatan audit transaksi pabrik.
            </p>

            <div className="pt-2 border-t border-[#70707d]/20 space-y-1.5">
              <span className="text-[10px] font-mono text-[#c3c3cc] uppercase tracking-wider block">Pintasan Cepat Modul:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_SUPER_ADMIN_ACCOUNTING')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Jurnal SAK EMKM
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_EXPENSE_BOOK')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Buku Kas &amp; Biaya
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuditModal(true)}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Log Audit Sistem
                </button>
                <button
                  type="button"
                  onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_USER_MGMT')}
                  className="px-2.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-left transition truncate border border-[#70707d]/20"
                >
                  • Hak Akses User
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleEnterWorkstation('SUPER_ADMIN', 'SCREEN_SUPER_ADMIN_ACCOUNTING')}
            className="w-full py-2.5 bg-[#5266eb] hover:bg-[#4355d6] text-white text-xs font-medium rounded-full transition flex items-center justify-center space-x-2"
          >
            <span>Buka Konsol Akuntansi</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>

      {/* Operational Master Data Quick Access Bar */}
      <div className="relative z-10 bg-[#1e1e2a] border border-[#70707d]/20 rounded-[12px] p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-[10px] bg-[#272735] border border-[#70707d]/30 flex items-center justify-center text-[#ededf3]">
            <BookOpen className="w-5 h-5 text-[#c3c3cc]" />
          </div>
          <div>
            <h4 className="font-medium text-[#ededf3] text-sm">Master Data Pabrik</h4>
            <p className="text-[11px] text-[#c3c3cc]">Data suplier gabah, pelanggan toko, dan spesifikasi stapel beras.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_SUPPLIER')}
            className="px-3.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] text-xs font-normal rounded-full border border-[#70707d]/30 transition"
          >
            Master Suplier
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_CUSTOMER')}
            className="px-3.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] text-xs font-normal rounded-full border border-[#70707d]/30 transition"
          >
            Master Customer
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_MASTER_ITEM')}
            className="px-3.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] text-xs font-normal rounded-full border border-[#70707d]/30 transition"
          >
            Master Item &amp; Stapel
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_REPORTS')}
            className="px-3.5 py-1.5 bg-[#272735] hover:bg-[#323244] text-[#ededf3] text-xs font-normal rounded-full border border-[#70707d]/30 transition"
          >
            Laporan Keuangan
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('SCREEN_CALENDAR')}
            className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/40 transition flex items-center space-x-1.5"
          >
            <span>📅 Kalender Juwita</span>
          </button>
        </div>
      </div>

      {showAuditModal && (
        <AuditLogModal onClose={() => setShowAuditModal(false)} />
      )}
    </div>
  );
};
