import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, Key, LogIn, X, Shield, ShieldCheck, Scale, Smartphone, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { RoleType } from '../types';

interface LoginModalProps {
  targetRole?: RoleType | null;
  onClose: () => void;
  onSuccess: (role: RoleType) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ targetRole: initialRole, onClose, onSuccess }) => {
  const { login } = useApp();

  const [selectedRole, setSelectedRole] = useState<RoleType | null>(initialRole || null);

  const getDefaultUsername = (role: RoleType | null) => {
    if (role === 'SUPER_ADMIN') return 'superadmin';
    if (role === 'OWNER') return 'owner';
    if (role === 'ADMIN1') return 'admin1';
    if (role === 'ADMIN2') return 'admin2';
    return '';
  };

  const getDefaultPassword = (role: RoleType | null) => {
    if (role === 'SUPER_ADMIN') return 'super123';
    if (role === 'OWNER') return 'owner123';
    if (role === 'ADMIN1') return 'admin123';
    if (role === 'ADMIN2') return 'admin234';
    return '';
  };

  const [username, setUsername] = useState<string>(getDefaultUsername(initialRole || null));
  const [password, setPassword] = useState<string>(getDefaultPassword(initialRole || null));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    setUsername(getDefaultUsername(role));
    setPassword(getDefaultPassword(role));
    setErrorMsg(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedRole) {
      setErrorMsg('Silakan pilih peran staff terlebih dahulu.');
      return;
    }

    const success = login(username, password, selectedRole);
    if (success) {
      onSuccess(selectedRole);
    } else {
      setErrorMsg('Username atau Password salah untuk peran ini!');
    }
  };

  const handleQuickFill = (role: RoleType) => {
    if (role === 'OWNER') {
      setUsername('owner');
      setPassword('owner123');
    } else if (role === 'ADMIN1') {
      setUsername('admin1');
      setPassword('admin123');
    } else if (role === 'ADMIN2') {
      setUsername('admin2');
      setPassword('admin234');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#171721]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e2a] rounded-[12px] max-w-md w-full p-7 space-y-6 border border-[#70707d]/30 relative text-[#ededf3]">
        {/* Top Header */}
        <div className="flex justify-between items-start border-b border-[#70707d]/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#272735] border border-[#70707d]/30 flex items-center justify-center text-[#ededf3]">
              <Lock className="w-5 h-5 text-[#ededf3]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c3c3cc]">PP BUMI MAS SECURITY</span>
              <h3 className="text-lg font-normal text-[#ededf3]">
                {selectedRole ? 'Autentikasi Sandi' : 'Pilih Peran Staf Internal'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-[#c3c3cc] hover:text-[#ededf3] hover:bg-[#272735] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#272735] border border-rose-500/40 text-rose-300 text-xs rounded-[12px] flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Pilih Icon Peran Staff */}
        {!selectedRole ? (
          <div className="space-y-3">
            <p className="text-xs text-[#c3c3cc] text-center font-normal">
              Pilih peran operasional di bawah untuk melanjutkan ke pengisian sandi:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Icon 0: SUPER ADMIN */}
              <button
                type="button"
                onClick={() => handleSelectRole('SUPER_ADMIN')}
                className="group bg-[#272735] hover:bg-[#323244] p-3.5 rounded-[12px] border border-[#70707d]/30 hover:border-[#ededf3]/50 transition flex items-center justify-between text-left text-[#ededf3]"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e1e2a] text-[#ededf3] border border-[#70707d]/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#5266eb]" />
                  </div>
                  <div>
                    <h4 className="font-normal text-[#ededf3] text-sm">Super Admin (Akses Penuh + Pajak)</h4>
                    <p className="text-[11px] text-[#c3c3cc]">Seluruh konsol dan laporan keuangan SAK EMKM</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#c3c3cc] group-hover:text-white transition" />
              </button>

              {/* Icon 1: OWNER */}
              <button
                type="button"
                onClick={() => handleSelectRole('OWNER')}
                className="group bg-[#272735] hover:bg-[#323244] p-3.5 rounded-[12px] border border-[#70707d]/30 hover:border-[#ededf3]/50 transition flex items-center justify-between text-left text-[#ededf3]"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e1e2a] text-[#ededf3] border border-[#70707d]/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#ededf3]" />
                  </div>
                  <div>
                    <h4 className="font-normal text-[#ededf3] text-sm">1. Konsol Owner (Pemilik)</h4>
                    <p className="text-[11px] text-[#c3c3cc]">Penetapan harga beras, approval hutang, dan transfer</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#c3c3cc] group-hover:text-white transition" />
              </button>

              {/* Icon 2: ADMIN 1 */}
              <button
                type="button"
                onClick={() => handleSelectRole('ADMIN1')}
                className="group bg-[#272735] hover:bg-[#323244] p-3.5 rounded-[12px] border border-[#70707d]/30 hover:border-[#ededf3]/50 transition flex items-center justify-between text-left text-[#ededf3]"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e1e2a] text-[#ededf3] border border-[#70707d]/30 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-[#ededf3]" />
                  </div>
                  <div>
                    <h4 className="font-normal text-[#ededf3] text-sm">2. Admin 1 (Kantor &amp; Timbangan)</h4>
                    <p className="text-[11px] text-[#c3c3cc]">Pos timbangan digital RS-232, kasir, DO, dan faktur</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#c3c3cc] group-hover:text-white transition" />
              </button>

              {/* Icon 3: ADMIN 2 */}
              <button
                type="button"
                onClick={() => handleSelectRole('ADMIN2')}
                className="group bg-[#272735] hover:bg-[#323244] p-3.5 rounded-[12px] border border-[#70707d]/30 hover:border-[#ededf3]/50 transition flex items-center justify-between text-left text-[#ededf3]"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e1e2a] text-[#ededf3] border border-[#70707d]/30 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#ededf3]" />
                  </div>
                  <div>
                    <h4 className="font-normal text-[#ededf3] text-sm">3. Admin 2 (HP Field Checker)</h4>
                    <p className="text-[11px] text-[#c3c3cc]">Perencanaan cor kiby, permohonan sak, opname gudang</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#c3c3cc] group-hover:text-white transition" />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: Input Password & Username setelah Icon Peran Diklik */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center justify-between bg-[#272735] p-3 rounded-[12px] border border-[#70707d]/30">
              <div className="flex items-center space-x-2">
                {selectedRole === 'SUPER_ADMIN' && <ShieldCheck className="w-4 h-4 text-[#5266eb]" />}
                {selectedRole === 'OWNER' && <Shield className="w-4 h-4 text-[#ededf3]" />}
                {selectedRole === 'ADMIN1' && <Scale className="w-4 h-4 text-[#ededf3]" />}
                {selectedRole === 'ADMIN2' && <Smartphone className="w-4 h-4 text-[#ededf3]" />}
                <span className="font-normal text-xs text-[#ededf3]">
                  Peran: {selectedRole === 'SUPER_ADMIN' ? 'Super Admin' : selectedRole === 'OWNER' ? 'Owner (Pemilik)' : selectedRole === 'ADMIN1' ? 'Admin 1 (Kantor)' : 'Admin 2 (HP Field)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-[11px] font-normal text-[#c3c3cc] hover:text-white hover:underline flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ganti Peran</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-normal text-[#c3c3cc] mb-1">Username Pengguna:</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#70707d]" />
                <input
                  type="text"
                  required
                  placeholder="Masukkan username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full font-normal text-sm text-[#ededf3] outline-none focus:border-[#5266eb] placeholder-[#70707d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-normal text-[#c3c3cc] mb-1">Password Kunci Akses:</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3 w-4 h-4 text-[#70707d]" />
                <input
                  type="password"
                  required
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#272735] border border-[#70707d]/30 rounded-full font-normal text-sm text-[#ededf3] outline-none focus:border-[#5266eb] placeholder-[#70707d]"
                />
              </div>
            </div>

            {/* Quick Auto-Fill Credentials */}
            <div className="bg-[#272735] p-3 rounded-[12px] border border-[#70707d]/20 text-[11px] space-y-1 text-[#c3c3cc]">
              <span className="font-normal text-[#ededf3] block">Kredensial Pengujian:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedRole === 'SUPER_ADMIN' && (
                  <button
                    type="button"
                    onClick={() => { setUsername('superadmin'); setPassword('super123'); }}
                    className="px-2.5 py-1 bg-[#1e1e2a] hover:bg-[#323244] text-[#ededf3] rounded-full border border-[#70707d]/30"
                  >
                    Auto-Fill (superadmin / super123)
                  </button>
                )}
                {selectedRole === 'OWNER' && (
                  <button
                    type="button"
                    onClick={() => handleQuickFill('OWNER')}
                    className="px-2.5 py-1 bg-[#1e1e2a] hover:bg-[#323244] text-[#ededf3] rounded-full border border-[#70707d]/30"
                  >
                    Auto-Fill (owner / owner123)
                  </button>
                )}
                {selectedRole === 'ADMIN1' && (
                  <button
                    type="button"
                    onClick={() => handleQuickFill('ADMIN1')}
                    className="px-2.5 py-1 bg-[#1e1e2a] hover:bg-[#323244] text-[#ededf3] rounded-full border border-[#70707d]/30"
                  >
                    Auto-Fill (admin1 / admin123)
                  </button>
                )}
                {selectedRole === 'ADMIN2' && (
                  <button
                    type="button"
                    onClick={() => handleQuickFill('ADMIN2')}
                    className="px-2.5 py-1 bg-[#1e1e2a] hover:bg-[#323244] text-[#ededf3] rounded-full border border-[#70707d]/30"
                  >
                    Auto-Fill (admin2 / admin234)
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#5266eb] hover:bg-[#4355d6] text-white font-normal text-sm rounded-full transition flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Konsol Stasiun</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
