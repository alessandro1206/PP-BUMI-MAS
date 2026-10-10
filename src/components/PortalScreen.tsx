import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scale, Package, Shield, FileSpreadsheet, MapPin, Clock, Building2, UserCheck, ShieldCheck, Truck } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { RoleType } from '../types';

export const PortalScreen: React.FC = () => {
  const { setRole, setActiveScreen, currentUser } = useApp();
  const [loginTargetRole, setLoginTargetRole] = useState<RoleType | null>(null);

  const handleOpenWorkstation = (targetRole: RoleType, defaultScreen: string) => {
    if (currentUser && currentUser.role === targetRole) {
      setRole(targetRole);
      setActiveScreen(defaultScreen);
    } else {
      setLoginTargetRole(targetRole);
    }
  };

  return (
    <div className="w-full space-y-8 text-slate-100 py-2 sm:py-6 animate-in fade-in">
      {/* 1. Header & Identity Section */}
      <div className="surface-card p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/60">
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700 tracking-wider uppercase">
              PP BUMI MAS • SISTEM OPERASIONAL PABRIK
            </span>
            {currentUser ? (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Operator Aktif: {currentUser.name} ({currentUser.role})</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                Akses Tamu / Portal Stasiun
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Pabrik Penggilingan &amp; Reprocessing Beras
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-mono">
              Wonosobo, Srono, Banyuwangi (Jawa Timur)
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
            Pusat kendali operasional terpadu penggilingan padi, jembatan timbang digital serial RS-232, manajemen persediaan beras dan karung kemasan, serta pembukuan keuangan pabrik.
          </p>

          {!currentUser && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setLoginTargetRole('ADMIN1')}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Workstation Sistem</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Operational Workstations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Stasiun Kerja Operasional</h2>
            <p className="text-xs text-slate-400">Pilih stasiun kerja internal untuk mengakses instrumen kerja dan pencatatan.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Workstation 1: Pos Timbangan (Admin 1) */}
          <div className="surface-card p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Pos Jembatan Timbang &amp; Kasir</h3>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold block mt-0.5">Admin 1 Workstation</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Penimbangan armada truk gabah dan beras masuk/keluar, penerbitan tiket timbangan, surat jalan DO pengiriman, serta kasir toko.
              </p>
              <div className="text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 space-y-1">
                <div>Protokol: CAS CI-200i / Yaohua</div>
                <div>Output: Thermal POS &amp; Dot Matrix</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenWorkstation('ADMIN1', 'SCREEN_16')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1.5"
            >
              <span>Buka Pos Timbangan</span>
            </button>
          </div>

          {/* Workstation 2: Lantai Gudang & Karung (Admin 2) */}
          <div className="surface-card p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Gudang, Beras &amp; Karung</h3>
                <span className="text-[11px] font-mono text-amber-400 font-semibold block mt-0.5">Admin 2 Workstation</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pencatatan tally tier muatan truk, opname stok beras jadi, formulasi racikan cor milling, dan stok karung kemasan Cap Putri Thailand.
              </p>
              <div className="text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 space-y-1">
                <div>Kemasan: 5kg, 10kg, 20kg, 25kg, 50kg</div>
                <div>Produksi: Cor Beras &amp; Byproduct</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenWorkstation('ADMIN2', 'SCREEN_42')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1.5"
            >
              <span>Buka Konsol Gudang</span>
            </button>
          </div>

          {/* Workstation 3: Keuangan & Pemilik (Owner) */}
          <div className="surface-card p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Konsol Pemilik &amp; Keuangan</h3>
                <span className="text-[11px] font-mono text-sky-400 font-semibold block mt-0.5">Owner Workstation</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Penetapan harga harian gabah kering giling (GKG), approval transfer m-banking suplier, verifikasi hutang toko, dan rekap saldo kas/bank.
              </p>
              <div className="text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 space-y-1">
                <div>Otoritas: Approval Transfer BCA</div>
                <div>Monitoring: Kas Brankas &amp; Hutang H-1</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenWorkstation('OWNER', 'SCREEN_13')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1.5"
            >
              <span>Buka Konsol Owner</span>
            </button>
          </div>

          {/* Workstation 4: Pembukuan SAK EMKM (Super Admin) */}
          <div className="surface-card p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Akuntansi &amp; Laporan Pajak</h3>
                <span className="text-[11px] font-mono text-purple-400 font-semibold block mt-0.5">Super Admin Workstation</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Jurnal umum berpasangan otomatis, neraca saldo terverifikasi, neraca keuangan SAK EMKM, dan riwayat audit aktivitas pengguna.
              </p>
              <div className="text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 space-y-1">
                <div>Standar: SAK EMKM Indonesia</div>
                <div>Keseimbangan: Aktiva = Pasiva (Rp 0)</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenWorkstation('SUPER_ADMIN', 'SCREEN_SUPER_ADMIN_ACCOUNTING')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1.5"
            >
              <span>Buka Konsol Akuntansi</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Real Factory & Plant Specifications */}
      <div className="surface-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Informasi Operasional Fasilitas Pabrik</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="text-slate-400 font-semibold flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lokasi Kilang &amp; Gudang</span>
            </div>
            <p className="text-slate-200 font-medium">
              Desa Wonosobo, Kec. Srono, Kab. Banyuwangi, Jawa Timur, Indonesia.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="text-slate-400 font-semibold flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Jam Operasional Pos Timbang</span>
            </div>
            <p className="text-slate-200 font-medium">
              Senin s/d Sabtu: 07.00 - 17.00 WIB (Armada Truk Gabah &amp; Beras).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="text-slate-400 font-semibold flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              <span>Armada &amp; Ekspedisi Pengiriman</span>
            </div>
            <p className="text-slate-200 font-medium">
              Koordinasi ekspedisi pelabuhan &amp; depo: Surabaya, Bali, dan pasar regional.
            </p>
          </div>
        </div>
      </div>

      {/* Password Authentication Modal */}
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
