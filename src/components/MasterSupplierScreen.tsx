import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, Edit, ArrowLeft, Search, Building2, Phone, CheckCircle2 } from 'lucide-react';
import { Supplier } from '../types';

export const MasterSupplierScreen: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, setRole, setActiveScreen } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [bankName, setBankName] = useState<string>('BCA');
  const [bankAcc, setBankAcc] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [status, setStatus] = useState<'AKTIF' | 'NONAKTIF'>('AKTIF');

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.bank_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setName('');
    setBankName('BCA');
    setBankAcc('');
    setPhone('');
    setAddress('');
    setStatus('AKTIF');
    setShowModal(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setName(sup.name);
    setBankName(sup.bank_name);
    setBankAcc(sup.bank_account_number);
    setPhone(sup.phone);
    setAddress(sup.address || '');
    setStatus(sup.status);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSupplier) {
      updateSupplier({
        ...editingSupplier,
        name,
        bank_name: bankName,
        bank_account_number: bankAcc,
        phone,
        address,
        status
      });
    } else {
      addSupplier({
        name,
        bank_name: bankName,
        bank_account_number: bankAcc,
        phone,
        address,
        status
      });
    }

    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-[#0f3e2e] text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }} className="p-2 bg-[#08251b] rounded-xl hover:bg-emerald-900 transition text-emerald-300">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">MASTER DATA OPERASIONAL</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Master Data Suplier Pembelian Beras
            </h1>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-3 bg-[#10b981] hover:bg-emerald-400 text-[#0f3e2e] font-extrabold text-sm rounded-xl transition shadow-md flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Suplier Baru</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama suplier, bank, atau no telp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 outline-none"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">{filtered.length} Suplier Terdaftar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(sup => (
            <div key={sup.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-[#10b981] transition">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-extrabold text-slate-900">{sup.name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  sup.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {sup.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sup.bank_name} - <span className="font-mono font-bold text-slate-900">{sup.bank_account_number}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sup.phone}</span>
                </div>
                {sup.address && (
                  <p className="text-slate-500 pt-1 text-[11px]">{sup.address}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => handleOpenEdit(sup)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition flex items-center space-x-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Data</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
              {editingSupplier ? 'Edit Suplier' : 'Tambah Suplier Baru'}
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Suplier / Pemilik:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-bold text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bank Transfer:</label>
                <select value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm">
                  <option value="BCA">BCA</option>
                  <option value="BRI">BRI</option>
                  <option value="Mandiri">Mandiri</option>
                  <option value="BNI">BNI</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No Rekening:</label>
                <input type="text" required value={bankAcc} onChange={(e) => setBankAcc(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm font-mono" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">No HP / WhatsApp:</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Kota / Wilayah:</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs font-bold" />
            </div>

            <div className="flex space-x-2 pt-3">
              <button type="submit" className="flex-1 py-3 bg-[#0f3e2e] text-white font-extrabold text-xs rounded-xl shadow">Simpan Suplier</button>
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-3 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">Batal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
