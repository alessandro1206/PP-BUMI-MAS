import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, Edit, ArrowLeft, Search, Building, Phone, DollarSign, ShieldAlert } from 'lucide-react';
import { Customer } from '../types';

export const MasterCustomerScreen: React.FC = () => {
  const { customers, addCustomer, updateCustomer, setRole, setActiveScreen } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCust, setEditingCust] = useState<Customer | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [brandAka, setBrandAka] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [expeditionDestination, setExpeditionDestination] = useState<string>('');
  const [creditLimit, setCreditLimit] = useState<number>(100000000);
  const [paymentTerm, setPaymentTerm] = useState<string>('TEMPO_7_HARI');
  const [status, setStatus] = useState<'AKTIF' | 'NONAKTIF'>('AKTIF');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.brand_aka && c.brand_aka.toLowerCase().includes(searchTerm.toLowerCase())) ||
    c.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleOpenAdd = () => {
    setEditingCust(null);
    setName('');
    setBrandAka('');
    setContactPerson('');
    setPhone('');
    setAddress('');
    setExpeditionDestination('');
    setCreditLimit(100000000);
    setPaymentTerm('TEMPO_7_HARI');
    setStatus('AKTIF');
    setShowModal(true);
  };

  const handleOpenEdit = (cust: Customer) => {
    setEditingCust(cust);
    setName(cust.name);
    setBrandAka(cust.brand_aka || '');
    setContactPerson(cust.contact_person);
    setPhone(cust.phone);
    setAddress(cust.address);
    setExpeditionDestination(cust.expedition_destination || '');
    setCreditLimit(cust.credit_limit);
    setPaymentTerm(cust.payment_term);
    setStatus(cust.status);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCust) {
      updateCustomer({
        ...editingCust,
        name,
        brand_aka: brandAka.toUpperCase(),
        contact_person: contactPerson,
        phone,
        address,
        expedition_destination: expeditionDestination,
        credit_limit: creditLimit,
        payment_term: paymentTerm,
        status
      });
    } else {
      addCustomer({
        name,
        brand_aka: brandAka.toUpperCase(),
        contact_person: contactPerson,
        phone,
        address,
        expedition_destination: expeditionDestination,
        credit_limit: creditLimit,
        payment_term: paymentTerm,
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
            <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">MASTER DATA PENJUALAN</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Master Data Pelanggan & Merek (AKA Toko)
            </h1>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-3 bg-[#10b981] hover:bg-emerald-400 text-[#0f3e2e] font-extrabold text-sm rounded-xl transition shadow-md flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama pelanggan, Merek (DM), kontak, atau no telp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 outline-none"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">{filtered.length} Customer Terdaftar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(cust => (
            <div key={cust.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-[#10b981] transition">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold bg-[#0f3e2e] text-white px-2 py-0.5 rounded">
                      {cust.payment_term.replace('_', ' ')}
                    </span>
                    {cust.brand_aka && (
                      <span className="text-[10px] font-extrabold bg-[#f59e0b] text-[#0f3e2e] px-2 py-0.5 rounded">
                        MEREK / AKA: {cust.brand_aka}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">{cust.name}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  cust.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {cust.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <div>PIC: <span className="font-bold text-slate-900">{cust.contact_person}</span></div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{cust.phone}</span>
                </div>
                <p className="text-slate-500 text-[11px]">{cust.address}</p>
                {cust.expedition_destination && (
                  <div className="bg-amber-50 p-2 rounded-lg text-[10px] font-mono text-amber-900 border border-amber-200 mt-1">
                    <strong>Ekspedisi:</strong> {cust.expedition_destination}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Limit Kredit:</span>
                  <span className="font-extrabold text-[#0f3e2e] text-sm">{formatRp(cust.credit_limit)}</span>
                </div>

                <button
                  onClick={() => handleOpenEdit(cust)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition flex items-center space-x-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
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
              {editingCust ? 'Edit Customer' : 'Tambah Customer Baru'}
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan / Toko:</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: BUMI SUBUR SURABAYA" className="w-full px-3 py-2 border rounded-xl font-bold text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Merek / AKA:</label>
                <input type="text" value={brandAka} onChange={(e) => setBrandAka(e.target.value)} placeholder="Contoh: DM" className="w-full px-3 py-2 border border-amber-400 bg-amber-50 rounded-xl font-extrabold text-sm text-[#0f3e2e] uppercase text-center" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penanggung Jawab:</label>
                <input type="text" required value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No Telepon / WA:</label>
                <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Toko / Kota:</label>
              <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs font-medium"></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Informasi Depo / Ekspedisi Tujuan (Optional):</label>
              <textarea rows={2} value={expeditionDestination} onChange={(e) => setExpeditionDestination(e.target.value)} placeholder="Contoh: EXP. CARAVAN (P.MATHIAS), GD.DIPO CARAVAN JL.KALIANAK 55 BLOK QQ NO.9 SURABAYA" className="w-full px-3 py-2 border rounded-xl text-xs font-mono"></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Limit Kredit (Rp):</label>
                <input type="number" value={creditLimit} onChange={(e) => setCreditLimit(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm text-[#0f3e2e]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Syarat Pembayaran:</label>
                <select value={paymentTerm} onChange={(e) => setPaymentTerm(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold text-xs">
                  <option value="CASH">CASH</option>
                  <option value="TEMPO_7_HARI">TEMPO 7 HARI</option>
                  <option value="TEMPO_14_HARI">TEMPO 14 HARI</option>
                  <option value="TEMPO_30_HARI">TEMPO 30 HARI</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2 pt-3">
              <button type="submit" className="flex-1 py-3 bg-[#0f3e2e] text-white font-extrabold text-xs rounded-xl shadow">Simpan Customer</button>
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-3 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">Batal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
