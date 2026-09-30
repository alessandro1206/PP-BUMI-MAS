import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Download, FileSpreadsheet, ArrowLeft, Truck, DollarSign, TrendingUp, Calendar } from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const { weighbridgeInList, deliveryOrders, expenses, pettyCash, exportToCSV, setRole, setActiveScreen } = useApp();

  const [reportType, setReportType] = useState<'PURCHASES' | 'SALES' | 'EXPENSES'>('PURCHASES');

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Computations
  const totalNettoBuy = weighbridgeInList.reduce((acc, w) => acc + w.net_weight, 0);
  const totalBuyPayment = weighbridgeInList.reduce((acc, w) => acc + (w.total_payment || 0), 0);

  const totalKgSold = deliveryOrders.reduce((acc, d) => acc + d.total_kg, 0);
  const totalSalesRevenue = deliveryOrders.reduce((acc, d) => acc + (d.total_invoice_amount || 0), 0);

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const grossProfit = totalSalesRevenue - totalBuyPayment - totalExpenses;

  const handleExportPurchases = () => {
    const rows = weighbridgeInList.map(w => ({
      No_STT: w.ticket_number,
      Tanggal: w.datetime_in,
      Nopol: w.nopol,
      Suplier: w.supplier_name,
      Bruto_KG: w.gross_weight,
      Potongan_Sak_KG: w.bag_deduction,
      Netto_Beras_KG: w.net_weight,
      Harga_Per_KG: w.price_per_kg || 0,
      Total_Bayar_Rp: w.total_payment || 0,
      Status: w.transfer_status
    }));
    exportToCSV('Laporan_Pembelian_Gabah_BumiMas', rows);
  };

  const handleExportSales = () => {
    const rows = deliveryOrders.map(d => ({
      No_DO: d.do_number,
      No_Invoice: d.invoice_number || '-',
      Tanggal: d.created_at,
      Customer: d.customer_name,
      Produk: d.product_name,
      Total_KG: d.total_kg,
      Harga_Per_KG: d.selling_price_per_kg || 0,
      Total_Faktur_Rp: d.total_invoice_amount || 0,
      Status: d.payment_status
    }));
    exportToCSV('Laporan_Penjualan_Beras_BumiMas', rows);
  };

  const handleExportExpenses = () => {
    const rows = expenses.map(e => ({
      Tanggal: e.expense_date,
      Kategori: e.category,
      Penerima: e.recipient_name,
      Deskripsi: e.description,
      Sumber_Bayar: e.payment_source,
      Nominal_Rp: e.amount,
      Dicatat_Oleh: e.logged_by
    }));
    exportToCSV('Laporan_Biaya_Operasional_BumiMas', rows);
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
            <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">EKSEKUTIF ANALYTICS & REKAPITULASI</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Laporan Analisis & Ekspor Data Excel
            </h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-[#08251b] p-1.5 rounded-xl border border-emerald-800">
          <button
            onClick={() => setReportType('PURCHASES')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
              reportType === 'PURCHASES' ? 'bg-[#10b981] text-[#0f3e2e]' : 'text-emerald-200'
            }`}
          >
            Pembelian Gabah
          </button>
          <button
            onClick={() => setReportType('SALES')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
              reportType === 'SALES' ? 'bg-[#10b981] text-[#0f3e2e]' : 'text-emerald-200'
            }`}
          >
            Penjualan Beras
          </button>
          <button
            onClick={() => setReportType('EXPENSES')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
              reportType === 'EXPENSES' ? 'bg-[#10b981] text-[#0f3e2e]' : 'text-emerald-200'
            }`}
          >
            Biaya Operasional
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Netto Gabah Masuk</span>
          <div className="text-2xl font-extrabold text-[#0f3e2e]">{totalNettoBuy.toLocaleString('id-ID')} KG</div>
          <span className="text-[11px] text-slate-500 block">Total Nilai: {formatRp(totalBuyPayment)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Penjualan Beras</span>
          <div className="text-2xl font-extrabold text-emerald-600">{totalKgSold.toLocaleString('id-ID')} KG</div>
          <span className="text-[11px] text-slate-500 block">Omzet Penjualan: {formatRp(totalSalesRevenue)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Biaya Operasional</span>
          <div className="text-2xl font-extrabold text-red-600">{formatRp(totalExpenses)}</div>
          <span className="text-[11px] text-slate-500 block">Pengeluaran Pabrik</span>
        </div>

        <div className="bg-[#0f3e2e] text-white p-5 rounded-2xl shadow-md space-y-2">
          <span className="text-xs font-bold text-emerald-300 uppercase">Estimasi Keuntungan Bersih</span>
          <div className="text-2xl font-extrabold text-[#f59e0b]">{formatRp(grossProfit)}</div>
          <span className="text-[11px] text-emerald-200 block">Omzet Penjualan - Modal - Biaya</span>
        </div>
      </div>

      {/* Report Table View */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {reportType === 'PURCHASES' ? 'Rekapitulasi Pembelian Gabah/Beras Suplier' :
               reportType === 'SALES' ? 'Rekapitulasi Penjualan Beras & Faktur Invoice' :
               'Rekapitulasi Pengeluaran Biaya Operasional Pabrik'}
            </h3>
            <p className="text-xs text-slate-500">Ekspor data lengkap ke format Excel (.csv)</p>
          </div>

          {reportType === 'PURCHASES' && (
            <button onClick={handleExportPurchases} className="px-4 py-2.5 bg-[#10b981] hover:bg-emerald-400 text-[#0f3e2e] font-extrabold text-xs rounded-xl flex items-center space-x-2 shadow">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Pembelian Ke Excel (.CSV)</span>
            </button>
          )}

          {reportType === 'SALES' && (
            <button onClick={handleExportSales} className="px-4 py-2.5 bg-[#10b981] hover:bg-emerald-400 text-[#0f3e2e] font-extrabold text-xs rounded-xl flex items-center space-x-2 shadow">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Penjualan Ke Excel (.CSV)</span>
            </button>
          )}

          {reportType === 'EXPENSES' && (
            <button onClick={handleExportExpenses} className="px-4 py-2.5 bg-[#10b981] hover:bg-emerald-400 text-[#0f3e2e] font-extrabold text-xs rounded-xl flex items-center space-x-2 shadow">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Biaya Ke Excel (.CSV)</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          {reportType === 'PURCHASES' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-extrabold">
                  <th className="p-3">No STT</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Nopol</th>
                  <th className="p-3">Suplier</th>
                  <th className="p-3 text-right">Netto (KG)</th>
                  <th className="p-3 text-right">Harga (Rp/KG)</th>
                  <th className="p-3 text-right">Total (Rp)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {weighbridgeInList.map(w => (
                  <tr key={w.id}>
                    <td className="p-3 font-mono font-bold">{w.ticket_number}</td>
                    <td className="p-3">{w.datetime_in}</td>
                    <td className="p-3 font-bold">{w.nopol}</td>
                    <td className="p-3">{w.supplier_name}</td>
                    <td className="p-3 text-right font-bold">{w.net_weight.toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right">{w.price_per_kg ? `Rp ${w.price_per_kg.toLocaleString('id-ID')}` : '-'}</td>
                    <td className="p-3 text-right font-extrabold text-[#0f3e2e]">{w.total_payment ? formatRp(w.total_payment) : '-'}</td>
                    <td className="p-3 text-center font-bold">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        w.transfer_status === 'PAID_H_DAY' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {w.transfer_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'SALES' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-extrabold">
                  <th className="p-3">No DO</th>
                  <th className="p-3">No Invoice</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Produk</th>
                  <th className="p-3 text-right">Total KG</th>
                  <th className="p-3 text-right">Harga Jual</th>
                  <th className="p-3 text-right">Total Faktur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {deliveryOrders.map(d => (
                  <tr key={d.id}>
                    <td className="p-3 font-mono font-bold">{d.do_number}</td>
                    <td className="p-3 font-mono">{d.invoice_number || '-'}</td>
                    <td className="p-3">{d.created_at}</td>
                    <td className="p-3 font-bold">{d.customer_name}</td>
                    <td className="p-3">{d.product_name}</td>
                    <td className="p-3 text-right font-bold">{d.total_kg.toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right">{d.selling_price_per_kg ? `Rp ${d.selling_price_per_kg.toLocaleString('id-ID')}` : '-'}</td>
                    <td className="p-3 text-right font-extrabold text-[#0f3e2e]">{d.total_invoice_amount ? formatRp(d.total_invoice_amount) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'EXPENSES' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-extrabold">
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Penerima / Vendor</th>
                  <th className="p-3">Keterangan</th>
                  <th className="p-3">Sumber Pembayaran</th>
                  <th className="p-3 text-right">Nominal (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {expenses.map(e => (
                  <tr key={e.id}>
                    <td className="p-3">{e.expense_date}</td>
                    <td className="p-3 font-bold text-red-700">{e.category}</td>
                    <td className="p-3 font-bold">{e.recipient_name}</td>
                    <td className="p-3">{e.description}</td>
                    <td className="p-3">{e.payment_source.replace('_', ' ')}</td>
                    <td className="p-3 text-right font-extrabold text-red-600">-{formatRp(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
