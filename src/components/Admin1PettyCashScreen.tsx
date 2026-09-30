import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, ArrowDownRight, ArrowUpRight, Plus, ArrowLeft, Filter, Tag, Building } from 'lucide-react';
import { PettyCashType, QuickTag } from '../types';

export const Admin1PettyCashScreen: React.FC = () => {
  const { pettyCash, addPettyCash, cashBalance, bankBalance, setRole, setActiveScreen, pettyCashCategories, addPettyCashCategory } = useApp();

  const [type, setType] = useState<PettyCashType>('KAS_KELUAR');
  const [amount, setAmount] = useState<string>('');
  const [quickTag, setQuickTag] = useState<QuickTag>('UPAH_BURUH');
  const [recipientPayer, setRecipientPayer] = useState<string>('');
  const [sourceDest, setSourceDest] = useState<string>('Brankas Kantor');
  const [description, setDescription] = useState<string>('');

  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [showAddCategoryInput, setShowAddCategoryInput] = useState<boolean>(false);
  const [newCatInput, setNewCatInput] = useState<string>('');

  const handleCreateCategory = () => {
    if (!newCatInput.trim()) return;
    const catName = newCatInput.trim().toUpperCase().replace(/\s+/g, '_');
    addPettyCashCategory(catName);
    setQuickTag(catName);
    setNewCatInput('');
    setShowAddCategoryInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      alert('Masukkan jumlah nominal kas yang valid!');
      return;
    }
    if (!recipientPayer.trim()) {
      alert('Masukkan penerima / pembayar!');
      return;
    }

    addPettyCash({
      type,
      amount: val,
      quick_tag: quickTag,
      source_destination: sourceDest,
      recipient_payer: recipientPayer,
      description: description || `Transaksi ${type} (${quickTag})`
    });

    setAmount('');
    setRecipientPayer('');
    setDescription('');
  };

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredPettyCash = filterTag === 'ALL'
    ? pettyCash
    : pettyCash.filter(p => p.quick_tag === filterTag);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-[#0f3e2e] text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_16'); }}
            className="p-2 bg-[#08251b] rounded-xl hover:bg-emerald-900 transition text-emerald-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="w-6 h-6 text-[#f59e0b]" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">KONSOL KASIR KANTOR - PENGELOLAAN DANA HARIAN</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Buku Kas Simpel Harian Pabrik <span className="text-xs bg-[#f59e0b] text-[#0f3e2e] px-2 py-1 rounded font-mono">SCREEN_31</span>
            </h1>
          </div>
        </div>

        {/* Balance Stat Card */}
        <div className="flex items-center space-x-6 bg-[#08251b] px-6 py-3 rounded-xl border border-emerald-700/60">
          <div>
            <div className="text-xs text-slate-300">Saldo Kas Brankas:</div>
            <div className="text-2xl font-extrabold text-[#f59e0b]">{formatRp(cashBalance)}</div>
          </div>
          <div className="h-8 w-[1px] bg-emerald-800"></div>
          <div>
            <div className="text-xs text-slate-300">Bank BCA Operasional:</div>
            <div className="text-xl font-extrabold text-emerald-400">{formatRp(bankBalance)}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Entry vs Cash Log Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Input Transaction */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Catat Transaksi Kas Baru
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setType('KAS_KELUAR'); setQuickTag('UPAH_BURUH'); setSourceDest('Brankas Kantor'); }}
                  className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    type === 'KAS_KELUAR' ? 'bg-red-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>KAS KELUAR</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setType('KAS_MASUK'); setQuickTag('TARIK_BCA'); setSourceDest('Tarik Bank BCA'); }}
                  className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    type === 'KAS_MASUK' ? 'bg-[#10b981] text-[#0f3e2e] shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>KAS MASUK</span>
                </button>
              </div>

              {/* Tag Quick Select */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Kategori / Tag Transaksi:</label>
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
                    className="text-[11px] text-[#10b981] font-bold hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Kategori Baru</span>
                  </button>
                </div>

                {showAddCategoryInput && (
                  <div className="flex items-center space-x-2 mb-2 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <input
                      type="text"
                      placeholder="Nama Kategori Baru..."
                      value={newCatInput}
                      onChange={(e) => setNewCatInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border text-xs font-bold rounded-lg text-slate-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="px-3 py-1.5 bg-[#0f3e2e] text-white text-xs font-extrabold rounded-lg shadow"
                    >
                      Simpan
                    </button>
                  </div>
                )}

                <select
                  value={quickTag}
                  onChange={(e) => setQuickTag(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl font-bold text-sm text-slate-900"
                >
                  {pettyCashCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nominal (Rp):</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-sm">Rp</span>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 1500000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 font-extrabold text-lg bg-slate-50 border rounded-xl outline-none focus:border-[#10b981] text-[#0f3e2e]"
                  />
                </div>
              </div>

              {/* Recipient / Payer */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Penerima / Pembayar:</label>
                <input
                  type="text"
                  required
                  placeholder={type === 'KAS_KELUAR' ? 'Contoh: Cak Dul Regu Bongkar' : 'Contoh: Kasir Utama Kantor'}
                  value={recipientPayer}
                  onChange={(e) => setRecipientPayer(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl font-bold text-sm text-slate-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Tambahan:</label>
                <textarea
                  rows={2}
                  placeholder="Catatan rincian..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium text-slate-800"
                ></textarea>
              </div>

              <button
                type="submit"
                className={`w-full py-3 text-[#0f3e2e] font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2 ${
                  type === 'KAS_KELUAR' ? 'bg-amber-400 hover:bg-amber-500' : 'bg-[#10b981] hover:bg-emerald-400'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Simpan Transaksi Kas</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Cash Logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Tag className="w-5 h-5 text-[#10b981]" />
                <span>Buku Catatan Transaksi Kas Masuk & Keluar</span>
              </h3>

              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="ALL">Semua Tag Kategori</option>
                  {pettyCashCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredPettyCash.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">Belum ada transaksi kas tercatat</div>
            ) : (
              <div className="space-y-3">
                {filteredPettyCash.map((tx) => (
                  <div key={tx.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'KAS_MASUK' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.type === 'KAS_MASUK' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-slate-900 text-sm">{tx.recipient_payer}</span>
                          <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                            {tx.quick_tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{tx.description}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{tx.transaction_time}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-extrabold ${
                        tx.type === 'KAS_MASUK' ? 'text-emerald-700' : 'text-red-600'
                      }`}>
                        {tx.type === 'KAS_MASUK' ? '+' : '-'}{formatRp(tx.amount)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{tx.source_destination}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
