import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, Plus, ArrowLeft, Filter, Tag, Building, DollarSign, ArrowDownRight } from 'lucide-react';
import { ExpenseCategory } from '../types';

export const ExpenseBookScreen: React.FC = () => {
  const { expenses, addExpense, cashBalance, bankBalance, currentUser, setRole, setActiveScreen } = useApp();

  const [category, setCategory] = useState<ExpenseCategory>('UPAH_BURUH');
  const [amount, setAmount] = useState<string>('');
  const [paymentSource, setPaymentSource] = useState<'KAS_BRANKAS' | 'BANK_BCA'>('KAS_BRANKAS');
  const [recipientName, setRecipientName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [filterCat, setFilterCat] = useState<string>('ALL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      alert('Masukkan nominal pengeluaran yang valid!');
      return;
    }
    if (!recipientName.trim()) {
      alert('Masukkan nama penerima pembayaran!');
      return;
    }

    addExpense({
      category,
      amount: val,
      payment_source: paymentSource,
      recipient_name: recipientName,
      description: description || `Biaya ${category}`,
      logged_by: currentUser?.username || 'admin1'
    });

    setAmount('');
    setRecipientName('');
    setDescription('');
  };

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredExpenses = filterCat === 'ALL'
    ? expenses
    : expenses.filter(e => e.category === filterCat);

  const totalExpenseAmount = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-[#0f3e2e] text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }} className="p-2 bg-[#08251b] rounded-xl hover:bg-emerald-900 transition text-emerald-300">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">BUKU KEUANGAN & BIAYA PABRIK</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Buku Biaya Operasional Pabrik
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-[#08251b] px-6 py-3 rounded-xl border border-emerald-700/60">
          <div>
            <div className="text-xs text-slate-300">Total Pengeluaran Biaya:</div>
            <div className="text-2xl font-extrabold text-red-400">{formatRp(totalExpenseAmount)}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Catat Biaya Operasional Baru
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Biaya Operasional:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl font-bold text-sm text-slate-900"
                >
                  <option value="UPAH_BURUH">1. Upah Buruh Panggul & Jahit</option>
                  <option value="BBM_SOLAR">2. BBM Solar Forklift & Mesin Kiby</option>
                  <option value="LISTRIK_PLN">3. Tagihan Listrik PLN & Air Pabrik</option>
                  <option value="PERAWATAN_MESIN">4. Perawatan & Sparepart Mesin</option>
                  <option value="BON_MAKAN">5. Bon Makan & Lembur Pekerja</option>
                  <option value="OPERASIONAL_KANTOR">6. Operasional & Biaya Kantor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nominal Biaya (Rp):</label>
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sumber Pembayaran:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentSource('KAS_BRANKAS')}
                    className={`py-2.5 rounded-xl font-bold text-xs border ${
                      paymentSource === 'KAS_BRANKAS' ? 'bg-[#0f3e2e] text-white border-[#0f3e2e]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Kas Brankas ({formatRp(cashBalance)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentSource('BANK_BCA')}
                    className={`py-2.5 rounded-xl font-bold text-xs border ${
                      paymentSource === 'BANK_BCA' ? 'bg-[#0f3e2e] text-white border-[#0f3e2e]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Bank BCA ({formatRp(bankBalance)})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penerima / Vendor:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cak Dul / Bengkel Teknik"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl font-bold text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Rincian:</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan transaksi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium text-slate-800"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2"
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Simpan Pengeluaran Biaya</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Expense History Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Riwayat Pengeluaran Biaya Operasional</h3>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-700 outline-none"
              >
                <option value="ALL">Semua Kategori Biaya</option>
                <option value="UPAH_BURUH">Upah Buruh</option>
                <option value="BBM_SOLAR">BBM Solar</option>
                <option value="LISTRIK_PLN">Listrik PLN</option>
                <option value="PERAWATAN_MESIN">Perawatan Mesin</option>
                <option value="BON_MAKAN">Bon Makan</option>
                <option value="OPERASIONAL_KANTOR">Operasional Kantor</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredExpenses.map(exp => (
                <div key={exp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-sm">{exp.recipient_name}</span>
                      <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        {exp.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{exp.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{exp.expense_date} • Logged by: {exp.logged_by}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-extrabold text-red-600">-{formatRp(exp.amount)}</div>
                    <span className="text-[10px] text-slate-400 font-medium">{exp.payment_source.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
