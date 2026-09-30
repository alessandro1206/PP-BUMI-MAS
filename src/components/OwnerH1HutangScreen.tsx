import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Truck, Calendar, ArrowLeft, ArrowRight, DollarSign, Building, CheckCircle2, CreditCard, Eye, Layers, FileText } from 'lucide-react';
import { SalesDeliveryOrder, WeighbridgeIn } from '../types';

export const OwnerH1HutangScreen: React.FC = () => {
  const { weighbridgeInList, deliveryOrders, setRole, setActiveScreen } = useApp();

  const [activeTab, setActiveTab] = useState<'PIUTANG' | 'HUTANG'>('PIUTANG');

  // Detail Modal State
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<SalesDeliveryOrder | null>(null);
  const [selectedSTTDetail, setSelectedSTTDetail] = useState<WeighbridgeIn | null>(null);

  // Supplier Payables
  const scheduledHutangList = weighbridgeInList.filter(w => w.transfer_status === 'SCHEDULED_H1' || w.transfer_status === 'PENDING_PRICE');
  const totalHutangSuplier = scheduledHutangList.reduce((acc, curr) => acc + (curr.total_payment || (curr.net_weight * 12800)), 0);

  // Customer Receivables
  const invoicedOrders = deliveryOrders.filter(d => d.total_invoice_amount && d.total_invoice_amount > 0);
  const totalPiutangCustomer = invoicedOrders.reduce((acc, d) => {
    const remaining = d.remaining_balance !== undefined ? d.remaining_balance : d.total_invoice_amount || 0;
    return acc + remaining;
  }, 0);

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#0f3e2e] text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_13'); }}
            className="p-2 bg-[#08251b] rounded-xl hover:bg-emerald-900 transition text-emerald-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-[#f59e0b]" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">KONSOL OWNER - DASHBOARD REKAP HUTANG & PIUTANG</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Pengawasan Posisi Rekap Hutang & Piutang Pabrik
            </h1>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="flex items-center space-x-6 bg-[#08251b] px-6 py-3 rounded-xl border border-emerald-700/60">
          <div>
            <div className="text-xs text-slate-300">Total Piutang Customer:</div>
            <div className="text-xl font-extrabold text-amber-400">{formatRp(totalPiutangCustomer)}</div>
          </div>
          <div className="h-8 w-[1px] bg-emerald-800"></div>
          <div>
            <div className="text-xs text-slate-300">Total Hutang Pembelian Beras:</div>
            <div className="text-xl font-extrabold text-red-400">{formatRp(totalHutangSuplier)}</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveTab('PIUTANG')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center space-x-2 ${
              activeTab === 'PIUTANG' ? 'bg-[#0f3e2e] text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>1. Rekap Piutang Penjualan Customer ({invoicedOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('HUTANG')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center space-x-2 ${
              activeTab === 'HUTANG' ? 'bg-[#0f3e2e] text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>2. Rekap Hutang Pembelian Beras Suplier ({scheduledHutangList.length})</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-bold hidden sm:inline">
          💡 Klik baris manapun untuk melihat rincian barang & harga
        </span>
      </div>

      {/* TAB 1: PIUTANG CUSTOMER */}
      {activeTab === 'PIUTANG' && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-base">
              Daftar Tagihan Piutang Customer (Klik Baris Untuk Rincian Items & Harga)
            </h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Sisa Piutang: {formatRp(totalPiutangCustomer)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-extrabold">
                  <th className="py-3 px-4">Tgl Nota</th>
                  <th className="py-3 px-4">No Invoice</th>
                  <th className="py-3 px-4">Merek / Customer</th>
                  <th className="py-3 px-4 text-right">Total Nota</th>
                  <th className="py-3 px-4 text-right">Sudah Dibayar</th>
                  <th className="py-3 px-4 text-right">Sisa Piutang</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-medium cursor-pointer">
                {invoicedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">Belum ada data piutang customer</td>
                  </tr>
                ) : (
                  invoicedOrders.map((doItem) => {
                    const remaining = doItem.remaining_balance !== undefined ? doItem.remaining_balance : doItem.total_invoice_amount || 0;
                    const paid = doItem.paid_amount || 0;

                    return (
                      <tr 
                        key={doItem.id} 
                        onClick={() => setSelectedInvoiceDetail(doItem)}
                        className="hover:bg-amber-50/70 transition"
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-600">{doItem.delivery_date || doItem.created_at.split(' ')[0]}</td>
                        <td className="py-3.5 px-4 font-extrabold text-[#0f3e2e]">{doItem.invoice_number}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-slate-900">{doItem.customer_name}</span>
                            {doItem.brand_aka && (
                              <span className="text-[10px] font-extrabold bg-amber-400 text-[#0f3e2e] px-1.5 py-0.2 rounded font-mono">
                                {doItem.brand_aka}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">{formatRp(doItem.total_invoice_amount || 0)}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-700">{formatRp(paid)}</td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-red-600">{formatRp(remaining)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            remaining <= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {remaining <= 0 ? 'PAID' : doItem.payment_status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: HUTANG SUPPLIER BERAS */}
      {activeTab === 'HUTANG' && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-base">
              Daftar Tagihan Hutang Pembelian Beras Suplier (Klik Baris Untuk Rincian Netto & Harga)
            </h3>
            <span className="text-xs font-bold text-red-800 bg-red-100 px-3 py-1 rounded-full">
              Total Obligasi: {formatRp(totalHutangSuplier)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledHutangList.map((truck) => (
              <div 
                key={truck.id} 
                onClick={() => setSelectedSTTDetail(truck)}
                className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200 hover:border-[#10b981] transition space-y-3 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-white text-slate-800 px-2.5 py-1 rounded border">
                    {truck.nopol}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    No STT: {truck.ticket_number}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900">{truck.supplier_name}</h4>
                  <p className="text-xs text-slate-500">Tgl Masuk: {truck.datetime_in}</p>
                </div>

                <div className="bg-white p-3 rounded-xl text-xs space-y-1 border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Berat Netto Beras:</span>
                    <span className="font-extrabold text-slate-900">{truck.net_weight.toLocaleString('id-ID')} KG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Harga Beli per KG:</span>
                    <span className="font-bold text-slate-900">{truck.price_per_kg ? `Rp ${truck.price_per_kg.toLocaleString('id-ID')}` : 'Belum Ditentukan'}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t font-extrabold text-sm">
                  <span className="text-xs text-slate-500 font-bold">Total Pembayaran:</span>
                  <span className="text-[#0f3e2e]">{formatRp(truck.total_payment || (truck.net_weight * 12800))}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Item Modal Piutang Customer */}
      {selectedInvoiceDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border-4 border-[#0f3e2e]">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="font-extrabold text-[#0f3e2e] text-lg">RINCIAN NOTA PIUTANG PENJUALAN</h3>
                <span className="text-xs text-slate-500 font-mono">Invoice: {selectedInvoiceDetail.invoice_number}</span>
              </div>
              <button onClick={() => setSelectedInvoiceDetail(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs space-y-1">
              <div>Customer: <strong className="text-slate-900">{selectedInvoiceDetail.customer_name} ({selectedInvoiceDetail.brand_aka})</strong></div>
              <div>Telp / Alamat: <span>{selectedInvoiceDetail.customer_phone || '-'}</span></div>
              <div>Nopol Truk: <strong className="font-mono">{selectedInvoiceDetail.nopol || 'S 9302 UN'}</strong></div>
              <div>Ekspedisi: <span>{selectedInvoiceDetail.expedition_info?.split('\n')[0]}</span></div>
            </div>

            {/* Item Breakdown Table */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-800 block">Rincian Barang Jadi, Qty & Harga per KG:</span>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-extrabold border-b">
                    <th className="py-2 px-2">Nama Barang</th>
                    <th className="py-2 px-2 text-right">Qty</th>
                    <th className="py-2 px-2 text-right">Total KG</th>
                    <th className="py-2 px-2 text-right">Harga/KG</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceDetail.items.map((it, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 px-2 font-bold">{it.product_name}</td>
                      <td className="py-2 px-2 text-right">{it.qty} {it.unit}</td>
                      <td className="py-2 px-2 text-right font-bold">{it.total_kg?.toLocaleString('id-ID')} KG</td>
                      <td className="py-2 px-2 text-right font-extrabold text-[#0f3e2e]">{formatRp(selectedInvoiceDetail.selling_price_per_kg || 14500)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Log History */}
            <div className="bg-slate-50 p-3 rounded-2xl border text-xs space-y-2">
              <div className="flex justify-between font-extrabold text-sm">
                <span>Total Tagihan:</span>
                <span className="text-[#0f3e2e]">{formatRp(selectedInvoiceDetail.total_invoice_amount || 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-xs text-emerald-700">
                <span>Sudah Dibayar/Dicicil:</span>
                <span>{formatRp(selectedInvoiceDetail.paid_amount || 0)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-xs text-red-600 border-t pt-1">
                <span>Sisa Piutang:</span>
                <span>{formatRp(selectedInvoiceDetail.remaining_balance !== undefined ? selectedInvoiceDetail.remaining_balance : selectedInvoiceDetail.total_invoice_amount || 0)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedInvoiceDetail(null)}
                className="px-5 py-2.5 bg-[#0f3e2e] text-white font-extrabold rounded-xl text-xs"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Item Modal Hutang Suplier */}
      {selectedSTTDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border-4 border-[#0f3e2e]">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="font-extrabold text-[#0f3e2e] text-lg">RINCIAN NOTA TIMBANGAN PEMBELIAN BERAS</h3>
                <span className="text-xs text-slate-500 font-mono">No STT: {selectedSTTDetail.ticket_number}</span>
              </div>
              <button onClick={() => setSelectedSTTDetail(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border text-xs space-y-1">
              <div>Suplier Pembelian Beras: <strong className="text-slate-900">{selectedSTTDetail.supplier_name}</strong></div>
              <div>Nopol Kendaraan Truk: <strong className="font-mono">{selectedSTTDetail.nopol}</strong></div>
              <div>Tanggal Masuk Timbangan: <span>{selectedSTTDetail.datetime_in}</span></div>
            </div>

            <div className="space-y-2 text-xs bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <div className="flex justify-between">
                <span>Berat Masuk (Bruto):</span>
                <span className="font-bold">{selectedSTTDetail.gross_weight.toLocaleString('id-ID')} KG</span>
              </div>
              <div className="flex justify-between">
                <span>Berat Keluar (Tara):</span>
                <span className="font-bold">{selectedSTTDetail.tare_weight.toLocaleString('id-ID')} KG</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#0f3e2e] border-t border-emerald-300 pt-1">
                <span>Berat Bersih (Netto Beras):</span>
                <span>{selectedSTTDetail.net_weight.toLocaleString('id-ID')} KG</span>
              </div>
            </div>

            <div className="flex justify-between font-extrabold text-base bg-amber-50 p-3 rounded-xl border border-amber-300">
              <span>Total Obligasi Transfer:</span>
              <span className="text-[#0f3e2e]">{formatRp(selectedSTTDetail.total_payment || (selectedSTTDetail.net_weight * 12800))}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSTTDetail(null)}
                className="px-5 py-2.5 bg-[#0f3e2e] text-white font-extrabold rounded-xl text-xs"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
