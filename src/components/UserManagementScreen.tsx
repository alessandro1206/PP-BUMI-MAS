import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAccount, RoleType } from '../types';
import { Shield, Scale, Smartphone, UserPlus, Key, Eye, EyeOff, Edit3, Trash2, CheckCircle, AlertCircle, X, Search, Lock, UserCheck } from 'lucide-react';

export const UserManagementScreen: React.FC = () => {
  const { userAccounts, addUserAccount, updateUserAccount, deleteUserAccount, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Form State
  const [role, setRole] = useState<RoleType>('ADMIN1');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);

  // Table show password toggles per user id
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Error & Success Feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setRole('ADMIN1');
    setUsername('');
    setName('');
    setPassword('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setRole(user.role);
    setUsername(user.username);
    setName(user.name);
    setPassword(user.password || '');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanName || !cleanPassword) {
      setErrorMsg('Semua kolom (Role, Username, Nama, Password) wajib diisi!');
      return;
    }

    if (editingUser) {
      // Check duplicate username if username changed
      const exists = userAccounts.some(u => u.id !== editingUser.id && u.username.toLowerCase() === cleanUsername);
      if (exists) {
        setErrorMsg(`Username '${cleanUsername}' sudah digunakan oleh pengguna lain!`);
        return;
      }

      updateUserAccount({
        ...editingUser,
        role,
        username: cleanUsername,
        name: cleanName,
        password: cleanPassword
      });

      setSuccessMsg(`Akun user '${cleanUsername}' berhasil diperbarui.`);
    } else {
      // Check duplicate username
      const exists = userAccounts.some(u => u.username.toLowerCase() === cleanUsername);
      if (exists) {
        setErrorMsg(`Username '${cleanUsername}' sudah terdaftar! Gunakan username lain.`);
        return;
      }

      addUserAccount({
        role,
        username: cleanUsername,
        name: cleanName,
        password: cleanPassword
      });

      setSuccessMsg(`Akun user baru '${cleanUsername}' berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDelete = (user: UserAccount) => {
    if (currentUser?.id === user.id) {
      alert('Anda tidak dapat menghapus akun yang sedang Anda gunakan saat ini!');
      return;
    }

    // Safety check: Don't allow deleting the last Owner
    if (user.role === 'OWNER') {
      const ownerCount = userAccounts.filter(u => u.role === 'OWNER').length;
      if (ownerCount <= 1) {
        alert('Sistem harus memiliki setidaknya 1 akun Owner!');
        return;
      }
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus akun user '${user.username}' (${user.name})?`)) {
      deleteUserAccount(user.id);
      setSuccessMsg(`Akun '${user.username}' telah dihapus.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const filteredAccounts = userAccounts.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (r: RoleType) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#08251b] text-amber-400 border border-amber-400/50 flex items-center space-x-1 inline-flex">
            <span>★ SUPER ADMIN (Akses Penuh & Pajak)</span>
          </span>
        );
      case 'OWNER':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0f3e2e] text-[#f59e0b] border border-[#f59e0b]/40 flex items-center space-x-1 inline-flex">
            <Shield className="w-3 h-3 text-[#f59e0b]" />
            <span>OWNER (Pemilik)</span>
          </span>
        );
      case 'ADMIN1':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1 inline-flex">
            <Scale className="w-3 h-3 text-emerald-700" />
            <span>ADMIN 1 (Kasir & Kantor)</span>
          </span>
        );
      case 'ADMIN2':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1 inline-flex">
            <Smartphone className="w-3 h-3 text-amber-700" />
            <span>ADMIN 2 (Checker Lapangan)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0f3e2e] via-[#165640] to-[#08251b] text-white p-6 rounded-3xl shadow-xl border border-emerald-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
            <Key className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PENGATURAN HAK AKSES
              </span>
              <span className="text-xs text-amber-400 font-semibold">• Fixed 3 Roles</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-0.5">Kelola User & Password Staff</h1>
            <p className="text-xs text-emerald-100/80">
              Tambah, perbarui nama/password, atau kelola akun login untuk Owner, Admin Kantor (Admin 1), & Checker Lapangan (Admin 2).
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-[#f59e0b] hover:bg-amber-600 text-[#0f3e2e] font-extrabold rounded-2xl shadow-lg transition flex items-center space-x-2 shrink-0 transform active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          <span>+ Tambah Akun User</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-sm font-bold flex items-center space-x-3 shadow-sm animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Akun User</div>
            <div className="text-2xl font-black text-slate-900">{userAccounts.length} User</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0f3e2e]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Akun OWNER (Pemilik)</div>
            <div className="text-2xl font-black text-[#0f3e2e]">
              {userAccounts.filter(u => u.role === 'OWNER').length} User
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-700">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Akun ADMIN 1 (Kantor)</div>
            <div className="text-2xl font-black text-emerald-800">
              {userAccounts.filter(u => u.role === 'ADMIN1').length} User
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Akun ADMIN 2 (Checker)</div>
            <div className="text-2xl font-black text-amber-700">
              {userAccounts.filter(u => u.role === 'ADMIN2').length} User
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Cari username / nama user..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10b981]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0">Filter Role:</span>
          {['ALL', 'SUPER_ADMIN', 'OWNER', 'ADMIN1', 'ADMIN2'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                roleFilter === r
                  ? 'bg-[#0f3e2e] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'ALL' ? 'Semua Role' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nama User</th>
                <th className="px-6 py-4">Username Login</th>
                <th className="px-6 py-4">Role / Hak Akses</th>
                <th className="px-6 py-4">Password</th>
                <th className="px-6 py-4 text-center">Aksi / Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    Tidak ada data pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-extrabold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900">{user.name}</div>
                          {currentUser?.id === user.id && (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              (Akun Anda Saat Ini)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        {user.username}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-bold text-slate-800 min-w-[90px]">
                          {visiblePasswords[user.id] ? (user.password || '••••••') : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          title="Lihat Password"
                        >
                          {visiblePasswords[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl border border-emerald-200 flex items-center space-x-1 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={currentUser?.id === user.id}
                          className={`px-3 py-1.5 rounded-xl border font-bold flex items-center space-x-1 transition ${
                            currentUser?.id === user.id
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              : 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT USER */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border-4 border-[#0f3e2e]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#0f3e2e]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingUser ? 'Edit Akun User & Password' : 'Tambah Akun User Baru'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {editingUser ? `Mengubah data untuk username '${editingUser.username}'` : 'Pilih dari 3 role internal & tentukan kredensial'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Select Fixed Role */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Role Staff Internal (Fixed 3 Roles) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('OWNER')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                      role === 'OWNER'
                        ? 'bg-[#0f3e2e] text-white border-[#0f3e2e] font-extrabold shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Shield className="w-5 h-5 text-amber-400" />
                    <span className="text-[11px] font-bold">OWNER</span>
                    <span className="text-[9px] opacity-80">(Pemilik)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('ADMIN1')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                      role === 'ADMIN1'
                        ? 'bg-[#0f3e2e] text-white border-[#0f3e2e] font-extrabold shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Scale className="w-5 h-5 text-emerald-400" />
                    <span className="text-[11px] font-bold">ADMIN 1</span>
                    <span className="text-[9px] opacity-80">(Kantor & Kasir)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('ADMIN2')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                      role === 'ADMIN2'
                        ? 'bg-[#0f3e2e] text-white border-[#0f3e2e] font-extrabold shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-amber-400" />
                    <span className="text-[11px] font-bold">ADMIN 2</span>
                    <span className="text-[9px] opacity-80">(Checker Lapangan)</span>
                  </button>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Username Login <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. rina_kasir"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
                <p className="text-[10px] text-slate-400 mt-1">Username digunakan untuk proses login staff (huruf kecil/bebas spasi).</p>
              </div>

              {/* Nama Pengguna */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Nama Lengkap / Tampilan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mbak Rina (Admin Office)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Kata Sandi (Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswordInModal ? 'text' : 'password'}
                    required
                    placeholder="e.g. admin123"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswordInModal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#10b981] hover:bg-emerald-600 text-[#0f3e2e] font-extrabold rounded-xl shadow-md transition"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Simpan User Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
