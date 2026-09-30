import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, ArrowLeft, CheckSquare, DollarSign, Calendar, Search, Filter, History, CheckCircle2, AlertCircle } from 'lucide-react';
import { SalesDeliveryOrder } from '../types';

export const Admin1ReceivablesScreen: React.FC = () => {
  const { deliveryOrders, addInvoicePayment, setRole, setActiveScreen, cashBalance, bankBalance } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Payment Modal State
  const [payTargetDO, setPayTargetDO] = useState<SalesDeliveryOrder | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'TUNAI' | 'TRANSFER_BCA'>('TRANSFER_BCA');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentNotes, setPaymentNotes] = useState<string>('Pelunasan / Transfer piutang toko');

  // Filter DOs that have invoices (total_invoice_amount != null)
  const invoicedOrders = deliveryOrders.filter(d => d.total_invoice_amount && d.total_invoice_amount > 0);

  const filtered = invoicedOrders.filter(d => {
    const matchSearch = d.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.brand_aka && d.brand_aka.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.invoice_number && d.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchSearch) return false;

    if (filterStatus === 'UNPAID') return d.payment_status === 'UNPAID' || d.payment_status === 'TEMPO';
    if (filterStatus === 'CICILAN') return d.payment_status === 'CICILAN';
    if (filterStatus === 'PAID') return d.payment_status === 'PAID';
    return true;
  });

  const totalOutstanding = invoicedOrders.reduce((acc, d) => {
    const remaining = d.remaining_balance !== undefined ? d.remaining_balance : d.total_invoice_amount || 0;
    return acc + remaining;
  }, 0);

  const totalCollected = invoicedOrders.reduce((acc, d) => {
    return acc + (d.paid_amount || 0);
  }, 0);

  const handleOpenPayModal = (doItem: SalesDeliveryOrder) => {
    setPayTargetDO(doItem);
    const rem = doItem.remaining_balance !== undefined ? doItem.remaining_balance : doItem.total_invoice_amount || 0;
    setPaymentAmount(rem.toString());
    setPaymentMethod('TRANSFER_BCA');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentNotes(`Pelunasan / Cicilan Invoice ${doItem.invoice_number}`);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTargetDO) return;
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      alert('Masukkan nominal pembayaran / transfer yang valid!');
      return;
    }

    addInvoicePayment(payTargetDO.id, amount, paymentMethod, paymentDate, paymentNotes);
    setPayTargetDO(null);
    alert(`Pembayaran Rp ${amount.toLocaleString('id-ID')} via ${paymentMethod} berhasil dicatat!`);
  };

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

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
              <CreditCard className="w-6 h-6 text-amber-400" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">KONSOL ADMIN 1 - KASIR PELUNASAN PIUTANG</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Kasir Pelunasan & Cicilan Piutang Toko Pembeli Beras
            </h1>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="flex items-center space-x-6 bg-[#08251b] px-6 py-3 rounded-xl border border-emerald-700/60">
          <div>
            <div className="text-xs text-slate-300">Total Piutang Belum Lunas:</div>
            <div className="text-2xl font-extrabold text-[#f59e0b]">{formatRp(totalOutstanding)}</div>
          </div>
          <div className="h-8 w-[1px] bg-emerald-800"></div>
          <div>
            <div className="text-xs text-slate-300">Total Piutang Terbayar:</div>
            <div className="text-xl font-extrabold text-emerald-400">{formatRp(totalCollected)}</div>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari no nota INV, customer, Merek (DM)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="ALL">Semua Status Tagihan</option>
              <option value="UNPAID">Belum Dibayar (Tempo)</option>
              <option value="CICILAN">Dalam Cicilan</option>
              <option value="PAID">Lunas (Paid)</option>
            </select>
          </div>
        </div>

        {/* Piutang Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f3e2e] text-white text-xs uppercase font-extrabold tracking-wider">
                <th className="py-3 px-4 rounded-tl-xl">Pelunasan</th>
                <th className="py-3 px-4">Tgl Nota</th>
                <th className="py-3 px-4">No Nota (INV)</th>
                <th className="py-3 px-4">Merek / Customer</th>
                <th className="py-3 px-4 text-right">Total Tagihan</th>
                <th className="py-3 px-4 text-right">Sudah Dibayar</th>
                <th className="py-3 px-4 text-right">Sisa Piutang</th>
                <th className="py-3 px-4 text-center rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 font-medium">
                    Belum ada tagihan invoice piutang yang tercatat
                  </td>
                </tr>
              ) : (
                filtered.map((doItem) => {
                  const remaining = doItem.remaining_balance !== undefined ? doItem.remaining_balance : doItem.total_invoice_amount || 0;
                  const paid = doItem.paid_amount || 0;
                  const isPaid = remaining <= 0 || doItem.payment_status === 'PAID';

                  return (
                    <tr key={doItem.id} className="hover:bg-emerald-50/50 transition">
                      <td className="py-3 px-4">
                        {isPaid ? (
                          <span className="flex items-center space-x-1 text-emerald-700 font-extrabold text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Lunas</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenPayModal(doItem)}
                            className="px-3 py-1.5 bg-[#f59e0b] hover:bg-amber-600 text-[#0f3e2e] font-extrabold rounded-lg text-xs flex items-center space-x-1 shadow-sm shrink-0"
                          >
                            <CheckSquare className="w-4 h-4" />
                            <span>Bayar / Cicil</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-600">
                        {doItem.delivery_date || doItem.created_at.split(' ')[0]}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#0f3e2e]">
                        {doItem.invoice_number || doItem.do_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-extrabold text-slate-900">{doItem.customer_name}</span>
                          {doItem.brand_aka && (
                            <span className="text-[10px] font-extrabold bg-amber-400 text-[#0f3e2e] px-1.5 py-0.2 rounded">
                              {doItem.brand_aka}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatRp(doItem.total_invoice_amount || 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">
                        {formatRp(paid)}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-red-600">
                        {formatRp(remaining)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : doItem.payment_status === 'CICILAN'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doItem.payment_status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment / Pelunasan Modal */}
      {payTargetDO && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmitPayment} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-4 border-[#0f3e2e]">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-[#0f3e2e] text-lg flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-amber-500" />
                <span>Input Pelunasan / Cicilan Piutang</span>
              </h3>
              <button type="button" onClick={() => setPayTargetDO(null)} className="text-slate-400">✕</button>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border text-xs space-y-1">
              <div>No Invoice: <strong className="text-[#0f3e2e]">{payTargetDO.invoice_number}</strong></div>
              <div>Customer: <strong>{payTargetDO.customer_name} ({payTargetDO.brand_aka})</strong></div>
              <div>Total Tagihan: <strong>{formatRp(payTargetDO.total_invoice_amount || 0)}</strong></div>
              <div>Sisa Piutang Saat Ini: <strong className="text-red-600 text-sm">{formatRp(payTargetDO.remaining_balance !== undefined ? payTargetDO.remaining_balance : payTargetDO.total_invoice_amount || 0)}</strong></div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Metode Pembayaran:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('TRANSFER_BCA')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition ${
                      paymentMethod === 'TRANSFER_BCA' ? 'bg-[#0f3e2e] text-white shadow' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Transfer Bank BCA
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('TUNAI')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition ${
                      paymentMethod === 'TUNAI' ? 'bg-[#0f3e2e] text-white shadow' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Tunai (Kas Brankas)
                  </button>
                </div>
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Transfer / Pelunasan:</label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>

              {/* Amount Paid */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">Nominal Transfer / Bayar (Rp):</label>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount((payTargetDO.remaining_balance !== undefined ? payTargetDO.remaining_balance : payTargetDO.total_invoice_amount || 0).toString())}
                    className="text-[10px] text-[#10b981] font-bold hover:underline"
                  >
                    Pelunasan Penuh
                  </button>
                </div>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl font-extrabold text-lg text-[#0f3e2e]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Pelunasan / Cicilan:</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Contoh: Cicilan ke-1 via Transfer BCA..."
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3.5 bg-gradient-to-r from-[#0f3e2e] to-[#10b981] text-white font-extrabold text-xs rounded-xl shadow"
              >
                Simpan Transaksi Pelunasan
              </button>
              <button
                type="button"
                onClick={() => setPayTargetDO(null)}
                className="px-4 py-3.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
