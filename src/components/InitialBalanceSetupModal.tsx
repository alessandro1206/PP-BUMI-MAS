import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InitialPayableItem, InitialReceivableItem } from '../types';
import { Wallet, Building2, Plus, Trash2, CheckCircle2, AlertCircle, X, Shield, Scale, ArrowRight, DollarSign } from 'lucide-react';

interface InitialBalanceSetupModalProps {
  onClose: () => void;
}

export const InitialBalanceSetupModal: React.FC<InitialBalanceSetupModalProps> = ({ onClose }) => {
  const { saveAllInitialSetup, bankBalance, cashBalance, suppliers, customers } = useApp();

  // Financial Balances State
  const [kasBalanceInput, setKasBalanceInput] = useState<number>(cashBalance || 20000000);
  const [bankBalanceInput, setBankBalanceInput] = useState<number>(bankBalance || 1450000000);

  // Stock Initial State
  const [stapelStockKg, setStapelStockKg] = useState<number>(30000);
  const [sakStockPcs, setSakStockPcs] = useState<number>(2500);

  // Payables (Utang Suplier Bawaan)
  const [payables, setPayables] = useState<InitialPayableItem[]>([
    { id: '1', supplier_name: 'Suplier H. Ahmad (Gabah Jombang)', bank_name: 'BCA', bank_account_number: '0129384751', invoice_no: 'NOTA-GABAH-08', amount: 45000000, notes: 'Utang transaksi gabah sebelum ERP' }
  ]);

  // Receivables (Piutang Pelanggan Bawaan)
  const [receivables, setReceivables] = useState<InitialReceivableItem[]>([
    { id: '1', customer_name: 'BUMI SUBUR SURABAYA', brand_aka: 'DM', invoice_no: 'SJ-DM-088', amount: 85000000, notes: 'Piutang penjualan nota DM sebelum ERP' },
    { id: '2', customer_name: 'BUMI SUBUR SURABAYA', brand_aka: 'BCAMP', invoice_no: 'SJ-BCAMP-04', amount: 62000000, notes: 'Piutang penjualan nota BCAMP sebelum ERP' }
  ]);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAddPayableRow = () => {
    setPayables(prev => [
      ...prev,
      { id: Date.now().toString(), supplier_name: '', bank_name: 'BCA', bank_account_number: '', invoice_no: '', amount: 0 }
    ]);
  };

  const handleRemovePayableRow = (id: string) => {
    setPayables(prev => prev.filter(p => p.id !== id));
  };

  const handlePayableChange = (id: string, field: keyof InitialPayableItem, val: any) => {
    setPayables(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  const handleAddReceivableRow = () => {
    setReceivables(prev => [
      ...prev,
      { id: Date.now().toString(), customer_name: 'BUMI SUBUR SURABAYA', brand_aka: 'DM', invoice_no: '', amount: 0 }
    ]);
  };

  const handleRemoveReceivableRow = (id: string) => {
    setReceivables(prev => prev.filter(r => r.id !== id));
  };

  const handleReceivableChange = (id: string, field: keyof InitialReceivableItem, val: any) => {
    setReceivables(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty rows
    const validPayables = payables.filter(p => p.supplier_name.trim() !== '' && p.amount > 0);
    const validReceivables = receivables.filter(r => r.customer_name.trim() !== '' && r.amount > 0);

    saveAllInitialSetup({
      kas_balance: kasBalanceInput,
      bank_balance: bankBalanceInput,
      payables: validPayables,
      receivables: validReceivables,
      stapel_stock_kg: stapelStockKg,
      sak_stock_pcs: sakStockPcs
    });

    setSuccessMsg('Seluruh Saldo Awal Keuangan, Utang, Piutang & Stok Bawaan Berhasil Disimpan!');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-7 space-y-6 shadow-2xl border-4 border-[#0f3e2e] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-[#0f3e2e] flex items-center justify-center font-black shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#10b981] tracking-wider">SINGLE-ITEM INITIAL BALANCE SETUP</span>
              <h2 className="text-xl font-black text-slate-900">Form Setting Saldo Awal Transaksi & Pembukuan Bawaan</h2>
              <p className="text-xs text-slate-500">Input sekaligus Saldo Kas/Bank, Utang Suplier Lama, Piutang Pelanggan Lama, & Stok Awal.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* SECTION 1: SALDO KEUANGAN KAS & BANK */}
          <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-3">
            <h3 className="font-extrabold text-sm text-[#0f3e2e] flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>1. Saldo Awal Kas &amp; Bank BCA</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Saldo Awal Kas Brankas Kantor (Rp):
                </label>
                <input
                  type="number"
                  required
                  value={kasBalanceInput}
                  onChange={e => setKasBalanceInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Saldo Awal Bank BCA Utama (Rp):
                </label>
                <input
                  type="number"
                  required
                  value={bankBalanceInput}
                  onChange={e => setBankBalanceInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: UTANG SUPLIER BAWAAN */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-amber-950 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>2. Saldo Awal Utang Suplier (Transaksi Lama Sebelum ERP)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddPayableRow}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Baris Utang Suplier</span>
              </button>
            </div>

            <div className="space-y-2">
              {payables.length === 0 ? (
                <div className="p-3 text-center text-slate-400 text-xs italic">Tidak ada utang bawaan terdaftar. Klik tombol di atas untuk menambah.</div>
              ) : (
                payables.map((p, idx) => (
                  <div key={p.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-white p-3 rounded-xl border border-amber-200 items-center">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Nama Suplier (e.g. Suplier H. Ahmad)"
                        value={p.supplier_name}
                        onChange={e => handlePayableChange(p.id, 'supplier_name', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded-lg text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="No. Nota / Faktur (e.g. NOTA-08)"
                        value={p.invoice_no}
                        onChange={e => handlePayableChange(p.id, 'invoice_no', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="number"
                        placeholder="Nominal Utang (Rp)"
                        value={p.amount}
                        onChange={e => handlePayableChange(p.id, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded-lg text-xs font-mono font-bold text-amber-900"
                      />
                    </div>
                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemovePayableRow(p.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECTION 3: PIUTANG PELANGGAN BAWAAN */}
          <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-blue-950 flex items-center space-x-2">
                <Scale className="w-4 h-4 text-blue-700" />
                <span>3. Saldo Awal Piutang Pelanggan (Transaksi Lama Sebelum ERP)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddReceivableRow}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Baris Piutang Pelanggan</span>
              </button>
            </div>

            <div className="space-y-2">
              {receivables.length === 0 ? (
                <div className="p-3 text-center text-slate-400 text-xs italic">Tidak ada piutang bawaan terdaftar. Klik tombol di atas untuk menambah.</div>
              ) : (
                receivables.map((r, idx) => (
                  <div key={r.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-white p-3 rounded-xl border border-blue-200 items-center">
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="Nama Pelanggan (e.g. BUMI SUBUR)"
                        value={r.customer_name}
                        onChange={e => handleReceivableChange(r.id, 'customer_name', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded-lg text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Merek (e.g. DM / BCAMP)"
                        value={r.brand_aka}
                        onChange={e => handleReceivableChange(r.id, 'brand_aka', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded-lg text-xs font-bold text-amber-800"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="No. Nota / SJ (e.g. SJ-DM-088)"
                        value={r.invoice_no}
                        onChange={e => handleReceivableChange(r.id, 'invoice_no', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="number"
                        placeholder="Nominal Piutang (Rp)"
                        value={r.amount}
                        onChange={e => handleReceivableChange(r.id, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded-lg text-xs font-mono font-bold text-blue-900"
                      />
                    </div>
                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveReceivableRow(r.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECTION 4: STOK FISIK AWAL */}
          <div className="bg-slate-100 p-5 rounded-2xl border border-slate-300 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">4. Stok Fisik Awal Beras Gudang &amp; Karung Sak</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Stok Beras Gudang Awal (KG):
                </label>
                <input
                  type="number"
                  required
                  value={stapelStockKg}
                  onChange={e => setStapelStockKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Stok Karung Sak Kemasan Awal (PCS):
                </label>
                <input
                  type="number"
                  required
                  value={sakStockPcs}
                  onChange={e => setSakStockPcs(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#10b981] hover:bg-emerald-600 text-[#0f3e2e] font-extrabold rounded-xl shadow-lg transition flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Semua Saldo Awal Transaksi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
