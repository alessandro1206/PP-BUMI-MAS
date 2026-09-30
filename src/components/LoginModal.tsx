import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, Key, LogIn, X, Shield, Scale, Smartphone, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-7 space-y-6 shadow-2xl border-4 border-[#0f3e2e] relative overflow-hidden">
        {/* Top Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#0f3e2e]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981]">PP BUMI MAS SECURITY</span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {selectedRole ? 'Autentikasi Kata Sandi' : 'Pilih Peran Staff Internal'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Pilih 3 Icon Peran Staff (Owner, Admin 1, Admin 2) */}
        {!selectedRole ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 text-center font-medium">
              Silakan pilih 1 dari 3 peran di bawah untuk melanjutkan ke pengisian kata sandi:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {/* Icon 0: SUPER ADMIN */}
              <button
                type="button"
                onClick={() => handleSelectRole('SUPER_ADMIN')}
                className="group bg-[#08251b] hover:bg-[#0f3e2e] p-4 rounded-2xl border-2 border-amber-400/60 transition flex items-center justify-between text-left shadow-md text-white"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 text-[#0f3e2e] flex items-center justify-center font-black">
                    ★
                  </div>
                  <div>
                    <h4 className="font-extrabold text-amber-400 text-sm">Super Admin (Akses Penuh + Pajak)</h4>
                    <p className="text-[11px] text-emerald-200">Akses seluruh konsol + Laporan Keuangan Pajak SAK EMKM</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition" />
              </button>

              {/* Icon 1: OWNER */}
              <button
                type="button"
                onClick={() => handleSelectRole('OWNER')}
                className="group bg-slate-50 hover:bg-emerald-50 p-4 rounded-2xl border-2 border-slate-200 hover:border-[#10b981] transition flex items-center justify-between text-left shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#0f3e2e]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-[#0f3e2e]">1. Konsol Owner (Pemilik)</h4>
                    <p className="text-[11px] text-slate-500">Penetapan harga beras, approval hutang & transfer bank</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#10b981] group-hover:translate-x-1 transition" />
              </button>

              {/* Icon 2: ADMIN 1 */}
              <button
                type="button"
                onClick={() => handleSelectRole('ADMIN1')}
                className="group bg-slate-50 hover:bg-emerald-50 p-4 rounded-2xl border-2 border-slate-200 hover:border-[#10b981] transition flex items-center justify-between text-left shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#0f3e2e] flex items-center justify-center">
                    <Scale className="w-6 h-6 text-emerald-800" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-[#0f3e2e]">2. Admin 1 (Kantor & Timbangan)</h4>
                    <p className="text-[11px] text-slate-500">Pos timbangan digital RS232, kasir, DO & invoice</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#10b981] group-hover:translate-x-1 transition" />
              </button>

              {/* Icon 3: ADMIN 2 */}
              <button
                type="button"
                onClick={() => handleSelectRole('ADMIN2')}
                className="group bg-slate-50 hover:bg-amber-50 p-4 rounded-2xl border-2 border-slate-200 hover:border-[#f59e0b] transition flex items-center justify-between text-left shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-[#0f3e2e]">3. Admin 2 (HP Field Checker)</h4>
                    <p className="text-[11px] text-slate-500">Perencanaan cor kiby, permohonan sak, opname sore</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#f59e0b] group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: Input Password & Username setelah Icon Peran Diklik */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <div className="flex items-center space-x-2">
                {selectedRole === 'OWNER' && <Shield className="w-5 h-5 text-[#f59e0b]" />}
                {selectedRole === 'ADMIN1' && <Scale className="w-5 h-5 text-[#10b981]" />}
                {selectedRole === 'ADMIN2' && <Smartphone className="w-5 h-5 text-amber-600" />}
                <span className="font-extrabold text-xs text-[#0f3e2e]">
                  Peran Terpilih: {selectedRole === 'OWNER' ? 'Owner (Pemilik)' : selectedRole === 'ADMIN1' ? 'Admin 1 (Kantor)' : 'Admin 2 (HP Field)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ganti Peran</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Username Pengguna:</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Masukkan username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl font-bold text-sm text-slate-900 outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password Kunci Akses:</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl font-bold text-sm text-slate-900 outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            {/* Quick Auto-Fill Credentials */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] space-y-1 text-slate-600">
              <span className="font-bold text-slate-700 block">Kredensial Pengujian:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedRole === 'OWNER' && (
                  <button
                    type="button"
                    onClick={() => handleQuickFill('OWNER')}
                    className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded"
                  >
                    Auto-Fill (owner / owner123)
                  </button>
                )}
                {selectedRole === 'ADMIN1' && (
                  <button
                    type="button"
                    onClick={() => handleQuickFill('ADMIN1')}
                    className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded"
                  >
                    Auto-Fill (admin1 / admin123)
                  </button>
                )}
                {selectedRole === 'ADMIN2' && (
                  <button
                    type="button"
                    onClick={() => handleQuickFill('ADMIN2')}
                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded"
                  >
                    Auto-Fill (admin2 / admin234)
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0f3e2e] hover:bg-emerald-900 text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>MASUK KONSOL SEKARANG</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
