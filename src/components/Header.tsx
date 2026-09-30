import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Scale, Smartphone, Sparkles, UserCheck, LogOut, FileText, BarChart3, Users, Package, Wallet, Receipt, Layers, Key, BookOpen } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { AuditLogModal } from './AuditLogModal';
import { InitialBalanceSetupModal } from './InitialBalanceSetupModal';
import { RoleType } from '../types';

export const Header: React.FC = () => {
  const { role, setRole, activeScreen, setActiveScreen, cashBalance, bankBalance, weighbridgeInList, currentUser, logout } = useApp();

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [showInitialSetupModal, setShowInitialSetupModal] = useState<boolean>(false);

  const pendingCount = weighbridgeInList.filter(w => w.transfer_status === 'PENDING_PRICE').length;

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleRoleClick = (targetRole: RoleType, defaultScreen: string) => {
    if (targetRole === 'PORTAL') {
      setRole('PORTAL');
      setActiveScreen('SCREEN_5');
      return;
    }
    if (currentUser && currentUser.role === targetRole) {
      setRole(targetRole);
      setActiveScreen(defaultScreen);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <header className="bg-[#0f3e2e] text-white shadow-lg sticky top-0 z-50 border-b border-[#10b981]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Mill Title */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f59e0b] to-[#10b981] flex items-center justify-center text-[#0f3e2e] font-extrabold text-2xl shadow-md">
                BM
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xl tracking-tight text-white">PP BUMI MAS</span>
                  <span className="text-xs bg-[#f59e0b]/20 text-[#f59e0b] px-2 py-0.5 rounded-full font-semibold border border-[#f59e0b]/40">
                    PENGGILINGAN BERAS
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 font-medium">Reprocessing & Milling Operational ERP System</p>
              </div>
            </div>

            {/* Balance & Stats Bar (OWNER ONLY — hidden for Admin 1, Admin 2, and Portal) */}
            {currentUser?.role === 'OWNER' ? (
              <div className="hidden xl:flex items-center space-x-4 bg-[#08251b] px-4 py-2 rounded-xl border border-emerald-800/60 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Kas Brankas:</div>
                  <div className="font-bold text-amber-400 text-sm">{formatRp(cashBalance)}</div>
                </div>
                <div className="h-7 w-[1px] bg-emerald-800"></div>
                <div>
                  <div className="text-slate-400 font-medium">Bank BCA:</div>
                  <div className="font-bold text-emerald-400 text-sm">{formatRp(bankBalance)}</div>
                </div>
                <div className="h-7 w-[1px] bg-emerald-800"></div>
                
                <button
                  onClick={() => setShowInitialSetupModal(true)}
                  className="px-2.5 py-1.5 bg-amber-400 text-[#0f3e2e] font-extrabold hover:bg-amber-300 rounded-lg text-xs flex items-center space-x-1 shadow-sm"
                  title="Form Terpadu Input Saldo Awal Kas, Bank, Utang Bawaan, Piutang Bawaan & Stok Awal"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Setting Saldo Awal</span>
                </button>

                <button
                  onClick={() => setActiveScreen('SCREEN_REPORTS')}
                  className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold rounded-lg text-xs flex items-center space-x-1"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Laporan</span>
                </button>

                <button
                  onClick={() => setActiveScreen('SCREEN_USER_MGMT')}
                  className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg text-xs flex items-center space-x-1 border border-amber-500/30"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>User &amp; Password</span>
                </button>

                <button
                  onClick={() => setShowAuditModal(true)}
                  className="px-2.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-bold rounded-lg text-xs flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Log Audit</span>
                </button>
              </div>
            ) : role !== 'PORTAL' && currentUser ? (
              <div className="hidden xl:flex items-center space-x-2 bg-[#08251b] px-4 py-2 rounded-xl border border-emerald-800/60 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-200 font-medium">{currentUser.name} ({currentUser.role})</span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3 bg-[#08251b] px-4 py-2 rounded-xl border border-emerald-800/60 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-200 font-medium">
                  {currentUser ? `Pengguna Aktif: ${currentUser.name} (${currentUser.role})` : 'Status: Tamu (Belum Login)'}
                </span>
              </div>
            )}


            {/* Role Switcher & Discreet Authentication Button */}
            <div className="flex items-center space-x-2 bg-[#08251b] p-1.5 rounded-xl border border-emerald-900">
              <button
                onClick={() => handleRoleClick('PORTAL', 'SCREEN_5')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  role === 'PORTAL'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Website Utama</span>
              </button>

              {currentUser ? (
                <>
                  {currentUser.role === 'SUPER_ADMIN' && (
                    <button
                      onClick={() => { setRole('SUPER_ADMIN'); setActiveScreen('SCREEN_SUPER_ADMIN_ACCOUNTING'); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                        role === 'SUPER_ADMIN' || activeScreen === 'SCREEN_SUPER_ADMIN_ACCOUNTING'
                          ? 'bg-amber-400 text-[#0f3e2e] shadow-md font-black'
                          : 'text-amber-300 hover:text-white hover:bg-emerald-900/50'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#0f3e2e]" />
                      <span>Super Admin (Akuntansi &amp; Pajak)</span>
                    </button>
                  )}

                  {(currentUser.role === 'OWNER' || currentUser.role === 'SUPER_ADMIN') && (
                    <button
                      onClick={() => handleRoleClick('OWNER', 'SCREEN_13')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                        role === 'OWNER'
                          ? 'bg-[#10b981] text-[#0f3e2e] shadow-md'
                          : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Konsol Owner</span>
                      {pendingCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px]">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  )}

                  {(currentUser.role === 'ADMIN1' || currentUser.role === 'SUPER_ADMIN') && (
                    <button
                      onClick={() => handleRoleClick('ADMIN1', 'SCREEN_16')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                        role === 'ADMIN1'
                          ? 'bg-[#10b981] text-[#0f3e2e] shadow-md'
                          : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Konsol Admin 1</span>
                    </button>
                  )}

                  {(currentUser.role === 'ADMIN2' || currentUser.role === 'SUPER_ADMIN') && (
                    <button
                      onClick={() => handleRoleClick('ADMIN2', 'SCREEN_42')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                        role === 'ADMIN2'
                          ? 'bg-amber-400 text-[#0f3e2e] shadow-md'
                          : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Konsol Admin 2</span>
                    </button>
                  )}

                  <button
                    onClick={logout}
                    title={`Logged in as ${currentUser.name}`}
                    className="p-1.5 bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white rounded-lg transition ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-3.5 py-1.5 bg-[#f59e0b] hover:bg-amber-600 text-[#0f3e2e] font-extrabold rounded-lg text-xs transition flex items-center space-x-1.5 shadow-sm"
                >
                  <Shield className="w-3.5 h-3.5 text-[#0f3e2e]" />
                  <span>Login Staff Internal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* OWNER Dedicated Duty Sub-Navigation Menu Bar */}
      {(role === 'OWNER' || currentUser?.role === 'OWNER') && (
        <div className="bg-[#08251b] border-b border-emerald-800 text-xs py-2 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1 font-bold overflow-x-auto py-1">
              <span className="text-amber-400 font-extrabold uppercase mr-2 flex items-center space-x-1 shrink-0">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Navigasi Konsol Owner:</span>
              </span>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_13'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_13' ? 'bg-[#10b981] text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>1. Harga Beras & Jadwal Transfer</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_38'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_38' ? 'bg-[#10b981] text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>2. Rekap Hutang Suplier H-1</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_4'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_4' ? 'bg-[#10b981] text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>3. Eksekusi Transfer H-Day</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_EXPENSE_BOOK'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_EXPENSE_BOOK' ? 'bg-amber-500 text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>4. Buku Kas & Biaya Pabrik (Kas Masuk & Keluar)</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_FAKTUR_JUAL'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_FAKTUR_JUAL' ? 'bg-amber-500 text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>5. Faktur Jual &amp; Piutang</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_REPORTS'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_REPORTS' ? 'bg-[#10b981] text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                <span>6. Laporan Keuangan & Laba/Rugi</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_USER_MGMT'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_USER_MGMT' ? 'bg-[#10b981] text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>7. Kelola User &amp; Password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin 1 Dedicated Duty Sub-Navigation Menu Bar */}
      {(role === 'ADMIN1' || currentUser?.role === 'ADMIN1') && (
        <div className="bg-[#08251b] border-b border-emerald-800 text-xs py-2 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1 font-bold overflow-x-auto py-1">
              <span className="text-amber-400 font-extrabold uppercase mr-2 flex items-center space-x-1 shrink-0">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Navigasi Tugas Admin 1:</span>
              </span>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_16'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_16' ? 'bg-[#10b981] text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>1. Timbangan Digital (STT)</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_31'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_31' ? 'bg-[#10b981] text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>2. Kasir Kas Kecil</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_15'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_15' ? 'bg-[#10b981] text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>3. Surat Jalan & DO Penjualan</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_RECEIVABLES'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_RECEIVABLES' ? 'bg-[#10b981] text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>4. Kasir Pelunasan Piutang</span>
              </button>

              <div className="h-4 w-[1px] bg-emerald-800 mx-1 shrink-0"></div>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_SAK_STOCK'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_SAK_STOCK' ? 'bg-amber-500 text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Stok Sak (ZAK)</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_BERAS_STOCK'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_BERAS_STOCK' ? 'bg-amber-500 text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Stok Beras</span>
              </button>

              <div className="h-4 w-[1px] bg-emerald-800 mx-1 shrink-0"></div>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_MASTER_SUPPLIER'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_MASTER_SUPPLIER' ? 'bg-amber-500 text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Master Supplier</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_MASTER_CUSTOMER'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_MASTER_CUSTOMER' ? 'bg-amber-500 text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Master Customer</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_MASTER_ITEM'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_MASTER_ITEM' ? 'bg-amber-500 text-[#0f3e2e] font-extrabold shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Master Item &amp; Stapel</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {showLoginModal && (
        <LoginModal
          targetRole={null}
          onClose={() => setShowLoginModal(false)}
          onSuccess={(roleToSet) => {
            setShowLoginModal(false);
            setRole(roleToSet);
            if (roleToSet === 'OWNER') setActiveScreen('SCREEN_13');
            if (roleToSet === 'ADMIN1') setActiveScreen('SCREEN_16');
            if (roleToSet === 'ADMIN2') setActiveScreen('SCREEN_42');
          }}
        />
      )}

      {showAuditModal && (
        <AuditLogModal onClose={() => setShowAuditModal(false)} />
      )}

      {showInitialSetupModal && (
        <InitialBalanceSetupModal onClose={() => setShowInitialSetupModal(false)} />
      )}
    </>
  );
};
