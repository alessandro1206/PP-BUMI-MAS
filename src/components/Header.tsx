import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Scale, Smartphone, Building2, UserCheck, LogOut, FileText, BarChart3, Users, Package, Wallet, Receipt, Layers, Key, BookOpen, Instagram, Menu, X, Calendar } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { AuditLogModal } from './AuditLogModal';
import { InitialBalanceSetupModal } from './InitialBalanceSetupModal';
import { RoleType } from '../types';

export const Header: React.FC = () => {
  const { role, setRole, activeScreen, setActiveScreen, cashBalance, bankBalance, weighbridgeInList, currentUser, logout, showLoginModal, setShowLoginModal } = useApp();

  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [showInitialSetupModal, setShowInitialSetupModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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
    if (currentUser && (currentUser.role === targetRole || currentUser.role === 'SUPER_ADMIN')) {
      setRole(targetRole);
      setActiveScreen(defaultScreen);
    } else {
      setShowLoginModal(true);
    }
  };

  if (activeScreen === 'SCREEN_5') {
    return (
      <>
        <div className="pt-2 sm:pt-4 px-2 sm:px-6 max-w-[1200px] mx-auto w-full sticky top-0 z-50">
          <header className="bg-[#ffffff]/95 backdrop-blur-md rounded-[12px] border border-[#18181b]/10 h-16 sm:h-20 px-2.5 sm:px-5 lg:px-6 flex items-center justify-between transition-all shadow-xs">
            {/* Brand Mark (Left) */}
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group shrink-0 min-w-0"
              onClick={() => {
                if (currentUser) {
                  setActiveScreen('SCREEN_WORKSTATIONS');
                } else {
                  setActiveScreen('SCREEN_5');
                }
              }}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2d5a43] flex items-center justify-center text-[#faf8f5] font-bold text-xs tracking-tight-bella shrink-0 shadow-xs">
                BM
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="text-sm sm:text-base lg:text-lg font-bold tracking-tight-bella text-[#18181b] whitespace-nowrap">
                    PP BUMI MAS
                  </span>
                  <span className="hidden sm:inline-block text-[9px] sm:text-[10px] font-bold uppercase bg-[#eaf2ec] text-[#2d5a43] px-1.5 sm:px-2 py-0.5 rounded-full border border-[#2d5a43]/20 tracking-wider whitespace-nowrap shrink-0">
                    BERAS BUSUR
                  </span>
                </div>
                <p className="hidden md:block text-[10px] sm:text-[11px] text-[#52525b] font-normal tracking-tight-bella whitespace-nowrap">
                  Pabrik &amp; Reprocessing Beras Banyuwangi
                </p>
              </div>
            </div>

            {/* Navigation Category Links (Desktop XL only to prevent collision) */}
            <nav className="hidden xl:flex items-center space-x-6 text-sm font-normal text-[#18181b] tracking-tight-bella whitespace-nowrap">
              <a href="#koleksi-beras" className="hover:text-[#2d5a43] transition">Koleksi Beras</a>
              <a href="#tentang-busur" className="hover:text-[#2d5a43] transition">Tentang Kami</a>
              <a href="#kilang-proses" className="hover:text-[#2d5a43] transition">Kilang &amp; Presisi</a>
              <a href="#inspirasi-dapur" className="hover:text-[#2d5a43] transition">Inspirasi Dapur</a>
              <a href="#pesan-grosir" className="hover:text-[#2d5a43] transition">Penawaran B2B</a>
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              <a
                href="https://www.instagram.com/berasbusur.id?rpxt=MW10dWI3aTFvMjZ2cA=="
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-[#2d5a43]/20 hover:border-[#2d5a43] text-xs font-bold tracking-tight-bella text-[#18181b] transition bg-[#eaf2ec]/70 hover:bg-[#eaf2ec] whitespace-nowrap"
                title="Instagram Resmi @berasbusur.id"
              >
                <Instagram className="w-3.5 h-3.5 text-[#2d5a43]" />
                <span>@berasbusur.id</span>
              </a>

              {currentUser ? (
                <>
                  <button
                    onClick={() => setActiveScreen('SCREEN_WORKSTATIONS')}
                    className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold tracking-tight-bella bg-[#2d5a43] text-white hover:bg-[#234735] transition flex items-center space-x-1 sm:space-x-1.5 whitespace-nowrap shrink-0 shadow-xs"
                    title="Buka Stasiun Kerja ERP"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Stasiun Kerja</span>
                  </button>
                  <button
                    onClick={logout}
                    title={`Logout (${currentUser.name})`}
                    className="p-1.5 sm:p-2 rounded-full border border-rose-500/30 text-rose-600 hover:bg-rose-50 transition shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="xl:hidden p-2 rounded-full border border-[#18181b]/15 text-[#18181b] hover:bg-[#f3efea] transition flex items-center justify-center shrink-0 w-8 h-8 sm:w-9 sm:h-9"
                    aria-label="Buka Menu Navigasi"
                  >
                    {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </button>
                </>
              ) : (
                <>
                  {/* TOMBOL LOGIN STAF */}
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#18181b]/20 bg-[#ffffff] hover:bg-[#f3efea] text-xs font-bold tracking-tight-bella text-[#18181b] transition flex items-center space-x-1 sm:space-x-1.5 whitespace-nowrap shrink-0 shadow-xs"
                    title="Login Akses Staf Pabrik"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#2d5a43] shrink-0" />
                    <span>Login Staf</span>
                  </button>

                  <a
                    href="#pesan-grosir"
                    className="hidden sm:inline-flex bella-btn-green text-xs py-2 px-3 sm:px-5 font-bold tracking-tight-bella items-center space-x-1 whitespace-nowrap shrink-0 shadow-xs"
                  >
                    <span>Minta Penawaran</span>
                  </a>

                  {/* Hamburger Menu Toggle (Below XL) */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="xl:hidden p-2 rounded-full border border-[#1b4332]/25 text-[#142217] hover:bg-[#e8f1eb] transition flex items-center justify-center shrink-0 w-8 h-8 sm:w-9 sm:h-9"
                    aria-label="Buka Menu Navigasi"
                  >
                    {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </button>
                </>
              )}
            </div>
          </header>

          {/* Collapsible Mobile / Tablet Navigation Card */}
          {mobileMenuOpen && (
            <div className="xl:hidden mt-2 bg-[#ffffff] rounded-[12px] border border-[#1b4332]/15 p-4 space-y-3 shadow-xl">
              {/* Quick Action: Login Staf & Penawaran in Mobile Menu */}
              <div className="pb-3 border-b border-[#1b4332]/10 flex flex-col gap-2">
                {!currentUser ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#1b4332] text-white text-xs font-bold tracking-tight-bella flex items-center justify-center space-x-2 hover:bg-[#245741] transition shadow-sm"
                    >
                      <Shield className="w-4 h-4 text-white" />
                      <span>Masuk ke Konsol Staf Pabrik (Login)</span>
                    </button>
                    <a
                      href="#pesan-grosir"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full px-3 py-2 rounded-lg border border-[#1b4332]/30 text-xs font-bold text-[#142217] text-center hover:bg-[#e8f1eb] transition"
                    >
                      Minta Penawaran B2B (Grosir)
                    </a>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#e8f1eb]">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-[#1b4332]" />
                      <div className="text-xs">
                        <div className="font-bold text-[#142217]">{currentUser.name}</div>
                        <div className="text-[#142217]/70 text-[10px] font-mono">{currentUser.role}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setActiveScreen('SCREEN_WORKSTATIONS');
                      }}
                      className="px-3 py-1 bg-[#1b4332] text-white rounded-full text-xs font-bold"
                    >
                      Buka Hub
                    </button>
                  </div>
                )}
              </div>

              <nav className="flex flex-col space-y-1 text-sm font-bold text-[#142217] tracking-tight-bella">
                <a 
                  href="#koleksi-beras" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[#e8f1eb] transition"
                >
                  Koleksi Beras
                </a>
                <a 
                  href="#tentang-busur" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[#e8f1eb] transition"
                >
                  Tentang Kami
                </a>
                <a 
                  href="#kilang-proses" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[#e8f1eb] transition"
                >
                  Kilang &amp; Presisi
                </a>
                <a 
                  href="#inspirasi-dapur" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[#e8f1eb] transition"
                >
                  Inspirasi Dapur
                </a>
                <a 
                  href="#pesan-grosir" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[#e8f1eb] transition"
                >
                  Penawaran B2B
                </a>
              </nav>

              <div className="pt-2 border-t border-[#1b4332]/10 flex flex-col space-y-2">
                <a
                  href="https://www.instagram.com/berasbusur.id?rpxt=MW10dWI3aTFvMjZ2cA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg border border-[#1b4332]/20 text-xs font-bold text-[#142217] flex items-center space-x-2 bg-[#e8f1eb]/60"
                >
                  <Instagram className="w-4 h-4 text-[#2d6a4f]" />
                  <span>Instagram @berasbusur.id</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {showLoginModal && (
          <LoginModal
            targetRole={null}
            onClose={() => setShowLoginModal(false)}
            onSuccess={(roleToSet) => {
              setShowLoginModal(false);
              setRole(roleToSet);
              setActiveScreen('SCREEN_WORKSTATIONS');
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <header className="bg-[#12121a]/70 backdrop-blur-2xl text-[#ededf3] sticky top-0 z-50 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mercury Concentric Ring Logo & Brand Mark */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => { 
                if (currentUser) {
                  setActiveScreen('SCREEN_WORKSTATIONS');
                } else {
                  setRole('PORTAL'); 
                  setActiveScreen('SCREEN_5'); 
                }
              }}
            >
              <div className="w-9 h-9 rounded-full bg-[#1e1e2a] border border-[#70707d]/30 flex items-center justify-center text-[#ededf3] group-hover:border-[#ededf3]/60 transition">
                <svg className="w-5 h-5 text-[#ededf3]" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
                  <circle cx="16" cy="16" r="8.5" stroke="currentColor" strokeWidth="1.4" opacity="0.75" />
                  <circle cx="16" cy="16" r="4" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg font-normal tracking-[0.02em] text-[#ededf3] group-hover:text-white transition">
                    PP BUMI MAS
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-[#1e1e2a] text-[#c3c3cc] px-2 py-0.5 rounded-full border border-[#70707d]/30 tracking-widest">
                    BANYUWANGI
                  </span>
                </div>
                <p className="text-[11px] text-[#c3c3cc] font-normal">Pabrik &amp; Reprocessing Beras Modern</p>
              </div>
            </div>

            {/* Balance & Stats Bar (OWNER ONLY - hidden for Admin 1, Admin 2, and Portal) */}
            {currentUser?.role === 'OWNER' ? (
              <div className="hidden xl:flex items-center space-x-3 bg-[#1e1e2a] px-3.5 py-1.5 rounded-full border border-[#70707d]/30 text-xs">
                <div className="px-2 py-0.5">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#c3c3cc]">Kas Brankas</div>
                  <div className="font-mono font-medium text-[#ededf3] text-xs">{formatRp(cashBalance)}</div>
                </div>
                <div className="h-6 w-[1px] bg-[#70707d]/30"></div>
                <div className="px-2 py-0.5">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#c3c3cc]">Bank BCA</div>
                  <div className="font-mono font-medium text-[#ededf3] text-xs">{formatRp(bankBalance)}</div>
                </div>
                <div className="h-6 w-[1px] bg-[#70707d]/30"></div>
                
                <button
                  onClick={() => setShowInitialSetupModal(true)}
                  className="px-3 py-1 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-xs flex items-center space-x-1.5 transition"
                  title="Form Terpadu Input Saldo Awal"
                >
                  <Wallet className="w-3.5 h-3.5 text-[#ededf3]" />
                  <span>Saldo Awal</span>
                </button>

                <button
                  onClick={() => setActiveScreen('SCREEN_REPORTS')}
                  className="px-3 py-1 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-xs flex items-center space-x-1.5 transition"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#ededf3]" />
                  <span>Laporan</span>
                </button>

                <button
                  onClick={() => setActiveScreen('SCREEN_USER_MGMT')}
                  className="px-3 py-1 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-xs flex items-center space-x-1.5 transition"
                >
                  <Key className="w-3.5 h-3.5 text-[#ededf3]" />
                  <span>User</span>
                </button>

                <button
                  onClick={() => setShowAuditModal(true)}
                  className="px-3 py-1 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-xs flex items-center space-x-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-[#ededf3]" />
                  <span>Audit</span>
                </button>

                <button
                  onClick={() => setActiveScreen('SCREEN_CALENDAR')}
                  className="px-3 py-1 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-xs flex items-center space-x-1.5 transition"
                  title="Kalender Jadwal Kirim & DO Juwita"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kalender</span>
                </button>
              </div>
            ) : role === 'PORTAL' && !currentUser ? (
              /* Centered Navigation Pill Links */
              <nav className="hidden lg:flex items-center space-x-1 text-sm font-normal text-[#ededf3]">
                <a href="#our-grains" className="px-4 py-2 rounded-full hover:bg-[#272735] transition text-[#ededf3]">Our Grains</a>
                <a href="#factory-process" className="px-4 py-2 rounded-full hover:bg-[#272735] transition text-[#ededf3]">Factory &amp; Process</a>
                <a href="#heritage" className="px-4 py-2 rounded-full hover:bg-[#272735] transition text-[#ededf3]">Heritage</a>
                <a href="#contact" className="px-4 py-2 rounded-full hover:bg-[#272735] transition text-[#ededf3]">Contact</a>
              </nav>
            ) : (
              <div className="hidden lg:flex items-center space-x-2 bg-[#1e1e2a] px-3.5 py-1.5 rounded-full border border-[#70707d]/30 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5266eb] animate-pulse"></span>
                <span className="text-[#c3c3cc]">
                  {currentUser ? `${currentUser.name} (${currentUser.role})` : 'Akses Publik'}
                </span>
              </div>
            )}

            {/* Right Side: Primary Actions & User Controls */}
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setActiveScreen('SCREEN_WORKSTATIONS')}
                    className={`px-4 py-1.5 rounded-full text-xs font-normal transition flex items-center space-x-1.5 ${
                      activeScreen === 'SCREEN_WORKSTATIONS'
                        ? 'bg-[#5266eb] text-white shadow-none'
                        : 'bg-[#272735] text-[#ededf3] hover:bg-[#323244]'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Stasiun Kerja</span>
                  </button>

                  <button
                    onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-normal border transition flex items-center space-x-1.5 ${
                      activeScreen === 'SCREEN_5'
                        ? 'border-[#ededf3] text-white bg-[#272735]'
                        : 'border-[#70707d]/40 text-[#c3c3cc] hover:text-[#ededf3] hover:border-[#ededf3]/60'
                    }`}
                  >
                    <span className="hidden md:inline">Web Publik</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="mercury-btn-ghost text-xs px-4 py-2 font-normal"
                  >
                    Login Staff
                  </button>

                  <a
                    href="#pesan-grosir"
                    className="mercury-btn-cobalt text-xs px-5 py-2 font-normal flex items-center space-x-1.5"
                  >
                    <span>Minta Penawaran</span>
                  </a>
                </>
              )}

              {currentUser && (
                <>
                  <div className="hidden lg:flex items-center space-x-1.5">
                    {currentUser.role === 'SUPER_ADMIN' && (
                      <button
                        onClick={() => { setRole('SUPER_ADMIN'); setActiveScreen('SCREEN_SUPER_ADMIN_ACCOUNTING'); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                          role === 'SUPER_ADMIN' || activeScreen === 'SCREEN_SUPER_ADMIN_ACCOUNTING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                            : 'text-amber-400/80 hover:text-amber-300 hover:bg-slate-800/50'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>Akuntansi SAK EMKM</span>
                      </button>
                    )}

                    {(currentUser.role === 'OWNER' || currentUser.role === 'SUPER_ADMIN') && (
                      <button
                        onClick={() => handleRoleClick('OWNER', 'SCREEN_13')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                          role === 'OWNER'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Owner</span>
                        {pendingCount > 0 && (
                          <span className="ml-1 px-1.5 py-0.2 bg-rose-500/90 text-white rounded-full text-[10px] font-mono">
                            {pendingCount}
                          </span>
                        )}
                      </button>
                    )}

                    {(currentUser.role === 'ADMIN1' || currentUser.role === 'SUPER_ADMIN') && (
                      <button
                        onClick={() => handleRoleClick('ADMIN1', 'SCREEN_16')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                          role === 'ADMIN1'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Admin 1 (Timbangan)</span>
                      </button>
                    )}

                    {(currentUser.role === 'ADMIN2' || currentUser.role === 'SUPER_ADMIN') && (
                      <button
                        onClick={() => handleRoleClick('ADMIN2', 'SCREEN_42')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                          role === 'ADMIN2'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                        <span>Admin 2</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={logout}
                    title={`Logout (${currentUser.name})`}
                    className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 rounded-lg transition ml-1 border border-rose-500/20 shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* OWNER Dedicated Duty Sub-Navigation Menu Bar */}
      {(role === 'OWNER' || currentUser?.role === 'OWNER') && (
        <div className="bg-[#12121a]/75 backdrop-blur-xl border-b border-white/10 text-xs py-1.5 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 font-medium overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-amber-400 font-bold uppercase text-[11px] mr-2 flex items-center space-x-1 shrink-0 font-mono">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Navigasi Owner:</span>
              </span>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_13'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_13' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>1. Harga &amp; Transfer</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_38'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_38' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Rekap Hutang Suplier</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_4'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_4' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Eksekusi Transfer H-Day</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_EXPENSE_BOOK'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_EXPENSE_BOOK' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Buku Kas &amp; Biaya</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_FAKTUR_JUAL'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_FAKTUR_JUAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>5. Faktur Jual &amp; Piutang</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_REPORTS'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_REPORTS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>6. Laporan Keuangan</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_USER_MGMT'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_USER_MGMT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>7. Akses User</span>
              </button>

              <button
                onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_CALENDAR'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_CALENDAR' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>8. Kalender Jadwal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin 1 Dedicated Duty Sub-Navigation Menu Bar */}
      {(role === 'ADMIN1' || currentUser?.role === 'ADMIN1') && (
        <div className="bg-[#12121a]/75 backdrop-blur-xl border-b border-white/10 text-xs py-1.5 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1 font-medium overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-emerald-400 font-bold uppercase text-[11px] mr-2 flex items-center space-x-1 shrink-0 font-mono">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tugas Admin 1:</span>
              </span>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_16'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_16' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>1. Timbangan STT</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_31'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_31' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Kas Kecil</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_15'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_15' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. DO &amp; Surat Jalan</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_RECEIVABLES'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_RECEIVABLES' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                <span>4. Kasir Piutang</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_CALENDAR'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_CALENDAR' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                title="Kalender Jadwal Kirim & DO Juwita"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>5. Kalender Juwita</span>
              </button>

              <div className="h-4 w-[1px] bg-slate-800 mx-1 shrink-0"></div>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_SAK_STOCK'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_SAK_STOCK' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>Stok Sak</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_BERAS_STOCK'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_BERAS_STOCK' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Stok Beras</span>
              </button>

              <div className="h-4 w-[1px] bg-slate-800 mx-1 shrink-0"></div>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_MASTER_SUPPLIER'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_MASTER_SUPPLIER' ? 'bg-slate-800 text-slate-300 border border-slate-700 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-slate-300" />
                <span>Master Supplier</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_MASTER_CUSTOMER'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_MASTER_CUSTOMER' ? 'bg-slate-800 text-slate-300 border border-slate-700 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-300" />
                <span>Master Customer</span>
              </button>

              <button
                onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_MASTER_ITEM'); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                  activeScreen === 'SCREEN_MASTER_ITEM' ? 'bg-slate-800 text-slate-300 border border-slate-700 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-slate-300" />
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
            setActiveScreen('SCREEN_WORKSTATIONS');
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
