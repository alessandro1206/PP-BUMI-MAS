import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, UserCheck, Calendar, MapPin, Building2, CheckCircle2, Award, Truck, ArrowRight, Phone, Mail } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { RoleType } from '../types';

export const PortalScreen: React.FC = () => {
  const { setRole, setActiveScreen, currentUser } = useApp();
  const [loginTargetRole, setLoginTargetRole] = useState<RoleType | null>(null);

  return (
    <div className="w-full space-y-0 text-slate-800">
      {/* 1. HERO SECTION - 100% Edge-to-Edge Company Landing Page */}
      <section className="w-full bg-gradient-to-br from-[#0f3e2e] via-[#08251b] to-[#0f3e2e] text-white py-12 sm:py-20 relative overflow-hidden border-b border-emerald-800">
        {/* Background glow accents */}
        <div className="absolute -right-12 -bottom-12 w-[500px] h-[500px] bg-[#10b981]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -top-12 w-[400px] h-[400px] bg-[#f59e0b]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-400/30 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>REPROCESSING & PENGGILINGAN BERAS SKALA INDUSTRI</span>
              </span>

              {currentUser ? (
                <span className="bg-[#f59e0b] text-[#0f3e2e] px-3.5 py-1 rounded-full text-xs font-extrabold flex items-center space-x-1.5 shadow-sm">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Pengguna Aktif: {currentUser.name} ({currentUser.role})</span>
                </span>
              ) : (
                <span className="bg-slate-700/80 text-slate-200 px-3.5 py-1 rounded-full text-xs font-medium">
                  Status: Tamu Publik
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              PP BUMI MAS <br />
              <span className="text-[#f59e0b] font-serif italic text-2xl sm:text-4xl block mt-2">
                Wonosobo, Srono, Banyuwangi
              </span>
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Perusahaan reprocessing dan penggilingan beras berskala industri yang berdedikasi menjaga ketersediaan dan ketahanan mutu pangan nasional secara konsisten sejak tahun <strong>1982</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-emerald-200 pt-1">
              <div className="flex items-center space-x-2 bg-[#08251b] px-3.5 py-2 rounded-xl border border-emerald-700/50">
                <Calendar className="w-4 h-4 text-[#f59e0b]" />
                <span>Berdiri Sejak 1982 (40+ Tahun Pengalaman)</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#08251b] px-3.5 py-2 rounded-xl border border-emerald-700/50">
                <MapPin className="w-4 h-4 text-[#10b981]" />
                <span>Wonosobo, Srono, Banyuwangi</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#profil-pabrik"
                className="inline-flex items-center space-x-2 bg-[#f59e0b] hover:bg-amber-600 text-[#0f3e2e] font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition duration-200 text-sm sm:text-base"
              >
                <span>Pelajari Profil Perusahaan</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              {!currentUser && (
                <button
                  onClick={() => setLoginTargetRole('ADMIN1')}
                  className="inline-flex items-center space-x-2 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 font-bold px-5 py-3.5 rounded-xl border border-emerald-700 transition text-sm"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Login Staff Internal</span>
                </button>
              )}
            </div>
          </div>

          {/* Warehouse Visual Photo */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#f59e0b] to-[#10b981] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-700 bg-emerald-950">
              <img
                src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80"
                alt="Gudang & Mesin Pemrosesan Beras PP BUMI MAS"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#08251b] via-[#08251b]/80 to-transparent p-5 text-white">
                <div className="flex items-center space-x-2 text-[#f59e0b] font-bold text-xs uppercase tracking-wider mb-1">
                  <Award className="w-4 h-4" />
                  <span>Kapasitas Skala Industri Real & Terpercaya</span>
                </div>
                <p className="text-xs text-slate-200">
                  Area penggilingan padi & reprocessing modern, jalur konveyor, serta penataan tumpukan karung beras siap distribusikan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK UTAMA (TRUST METRICS) - Full Width Section */}
      <section className="w-full bg-[#08251b] py-10 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-[#0f3e2e] p-7 rounded-2xl border border-emerald-800 space-y-2 hover:border-[#10b981] transition shadow-md">
            <div className="inline-flex p-3 rounded-xl bg-emerald-900/60 text-[#f59e0b] mb-1">
              <Award className="w-7 h-7 text-[#f59e0b]" />
            </div>
            <h3 className="text-3xl font-extrabold text-white">40+ Tahun</h3>
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wide">Pengalaman Menjaga Mutu Pangan</p>
            <p className="text-xs text-emerald-200/70">Berdiri sejak 1982 di Wonosobo, Srono, Banyuwangi.</p>
          </div>

          <div className="bg-[#0f3e2e] p-7 rounded-2xl border border-emerald-800 space-y-2 hover:border-[#10b981] transition shadow-md">
            <div className="inline-flex p-3 rounded-xl bg-emerald-900/60 text-[#10b981] mb-1">
              <Building2 className="w-7 h-7 text-[#10b981]" />
            </div>
            <h3 className="text-3xl font-extrabold text-[#10b981]">Skala Industri</h3>
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wide">Fasilitas Penggilingan Modern</p>
            <p className="text-xs text-emerald-200/70">Kapasitas pengolahan & reprocessing terpercaya.</p>
          </div>

          <div className="bg-[#0f3e2e] p-7 rounded-2xl border border-emerald-800 space-y-2 hover:border-[#f59e0b] transition shadow-md">
            <div className="inline-flex p-3 rounded-xl bg-emerald-900/60 text-[#f59e0b] mb-1">
              <Truck className="w-7 h-7 text-[#f59e0b]" />
            </div>
            <h3 className="text-3xl font-extrabold text-[#f59e0b]">Jaringan Mutu</h3>
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wide">Reprocessing & Distribusi Beras</p>
            <p className="text-xs text-emerald-200/70">Menjangkau mitra toko, agen, & pasar distributor.</p>
          </div>
        </div>
      </section>

      {/* 3. PROFIL PERUSAHAAN (COMPANY PROFILE PP BUMI MAS) */}
      <section id="profil-pabrik" className="w-full bg-white py-14 sm:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-extrabold text-[#10b981] bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full uppercase tracking-wider">
              Tentang Perusahaan
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Company Profile <br />
              <span className="text-[#0f3e2e]">PP BUMI MAS Wonosobo</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>PP BUMI MAS</strong> adalah perusahaan reprocessing dan penggilingan beras berskala industri yang berlokasi di <strong>Wonosobo, Srono, Banyuwangi</strong>. Berdiri sejak tahun <strong>1982</strong>, kami telah berdedikasi menjaga ketersediaan dan mutu beras berkualitas tinggi selama lebih dari 4 dekade.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fasilitas penggilingan kami dilengkapi dengan mesin pemrosesan beras modern, sistem konveyor otomatis, serta pos timbangan digital terintegrasi untuk menjamin presisi dan kualitas mutu pangan regional.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-bold text-slate-700">
              <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span>Penggilingan Padi Modern</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span>Reprocessing Beras Super</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span>Standar Mutu Terjaga</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span>Manajemen Terstruktur</span>
              </div>
            </div>
          </div>

          {/* Company Identity Summary Box */}
          <div className="bg-gradient-to-br from-slate-900 to-[#08251b] text-white p-8 rounded-3xl shadow-xl space-y-4 font-sans border border-emerald-800">
            <h3 className="text-lg font-bold text-[#f59e0b] border-b border-emerald-800 pb-3 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-[#10b981]" />
              <span>Identitas Resmi Pabrik</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-emerald-900/60 pb-2">
                <span className="text-slate-400">Nama Usaha:</span>
                <span className="font-extrabold text-white">PP BUMI MAS</span>
              </div>
              <div className="flex justify-between border-b border-emerald-900/60 pb-2">
                <span className="text-slate-400">Bidang Industri:</span>
                <span className="font-extrabold text-white">Penggilingan & Reprocessing Beras</span>
              </div>
              <div className="flex justify-between border-b border-emerald-900/60 pb-2">
                <span className="text-slate-400">Lokasi Kilang & Gudang:</span>
                <span className="font-extrabold text-emerald-300">Wonosobo, Srono, Banyuwangi</span>
              </div>
              <div className="flex justify-between border-b border-emerald-900/60 pb-2">
                <span className="text-slate-400">Tahun Berdiri:</span>
                <span className="font-extrabold text-[#f59e0b]">1982 (40+ Tahun Pengalaman)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Sistem Keamanan Akses:</span>
                <span className="font-bold text-[#10b981]">Terproteksi Auth Operator</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GALERI FASILITAS GUDANG SKALA INDUSTRI (TRUST BUILDER) */}
      <section className="w-full bg-slate-50 py-14 sm:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Galeri Fasilitas Penggilingan & Gudang</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Fasilitas fisik lantai gudang modern penunjang operasional industri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80"
                alt="Pos Timbangan Digital RS232"
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="p-5 space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">Pos Timbangan Digital RS232</h4>
                <p className="text-xs text-slate-500">Penerimaan armada truk gabah suplier dengan pencatatan komputasi presisi.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
              <img
                src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=600&q=80"
                alt="Mesin Milling & Reprocessing"
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="p-5 space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">Mesin Milling & Reprocessing</h4>
                <p className="text-xs text-slate-500">Formulasi cor racikan stapelan beras curah untuk hasil mutu mutu terjamin.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                alt="Armada Pengiriman & Tally Tier Truk"
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="p-5 space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">Pengiriman & Penataan Tier Truk</h4>
                <p className="text-xs text-slate-500">Penghitungan baris tier muatan sak karung kemasan Cap Putri Thailand.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Password Login Modal */}
      {loginTargetRole && (
        <LoginModal
          targetRole={loginTargetRole}
          onClose={() => setLoginTargetRole(null)}
          onSuccess={() => {
            const roleToSet = loginTargetRole;
            setLoginTargetRole(null);
            setRole(roleToSet);
            if (roleToSet === 'OWNER') setActiveScreen('SCREEN_13');
            if (roleToSet === 'ADMIN1') setActiveScreen('SCREEN_16');
            if (roleToSet === 'ADMIN2') setActiveScreen('SCREEN_42');
          }}
        />
      )}
    </div>
  );
};
