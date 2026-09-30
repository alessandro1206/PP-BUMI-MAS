import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, DollarSign, CheckCircle2, Clock, Truck } from 'lucide-react';

export const OwnerFakturJualScreen: React.FC = () => {
  const { deliveryOrders, setInvoicePrice } = useApp();
  const [priceInputs, setPriceInputs] = useState<{ [id: string]: string }>({});
  const [selectedDO, setSelectedDO] = useState<string | null>(null);

  const sortedDOs = [...deliveryOrders].sort((a, b) =>
    new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
  );

  const handleSetPrice = (doId: string) => {
    const priceStr = priceInputs[doId] || '';
    const price = parseFloat(priceStr);
    if (!price || price <= 0) {
      alert('Masukkan harga jual per KG yang valid!');
      return;
    }
    setInvoicePrice(doId, price);
    alert('Harga invoice berhasil diset!');
  };

  const formatRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const getStatusIcon = (status: string) => {
    if ((status as string) === 'TERKIRIM') return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    if (status === 'DI_MUAT_TRUK') return <Truck className="w-4 h-4 text-amber-500" />;
    return <Clock className="w-4 h-4 text-blue-500" />;
  };

  const getStatusClass = (status: string) => {
    if ((status as string) === 'TERKIRIM') return 'bg-emerald-100 text-emerald-800';
    if (status === 'DI_MUAT_TRUK') return 'bg-amber-100 text-amber-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#0f3e2e] text-white p-6 rounded-2xl shadow-lg border border-emerald-800">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-amber-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-300">Owner - Pemilik</div>
            <h1 className="text-xl font-extrabold">Faktur Jual & Daftar Pengiriman</h1>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Total DO', val: deliveryOrders.length, color: 'text-white' },
            { label: 'Rencana Kirim', val: deliveryOrders.filter(d => !d.status || d.status === 'RENCANA_JADWAL').length, color: 'text-blue-300' },
            { label: 'Terkirim', val: deliveryOrders.filter(d => (d.status as string) === 'TERKIRIM').length, color: 'text-emerald-300' },
            { label: 'Invoice Terbuka', val: deliveryOrders.filter(d => d.payment_status === 'TEMPO').length, color: 'text-amber-300' },
          ].map(s => (
            <div key={s.label} className="bg-[#08251b] rounded-xl p-3 text-center">
              <div className={`text-xl font-extrabold ${s.color}`}>{s.val}</div>
              <div className="text-[10px] text-emerald-400 font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DO List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedDOs.map(doItem => (
          <div key={doItem.id}
            className={`bg-white rounded-2xl p-5 border-2 shadow-sm space-y-3 cursor-pointer transition ${
              selectedDO === doItem.id ? 'border-[#0f3e2e] shadow-md' : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedDO(selectedDO === doItem.id ? null : doItem.id)}
          >
            {/* Header Row */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900 text-sm">{doItem.customer_name}</span>
                  {doItem.brand_aka && (
                    <span className="text-[10px] font-extrabold bg-amber-400 text-[#0f3e2e] px-1.5 py-0.5 rounded">{doItem.brand_aka}</span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-[#10b981]">{doItem.do_number}</span>
                <span className="text-[10px] text-slate-400 ml-2">{doItem.delivery_date}</span>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusClass(doItem.status || 'RENCANA_JADWAL')}`}>
                {getStatusIcon(doItem.status || 'RENCANA_JADWAL')}
                <span>{(doItem.status as string) === 'TERKIRIM' ? 'TERKIRIM' : doItem.status || 'RENCANA'}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold">Total Berat:</span>
              <span className="font-extrabold text-[#0f3e2e] text-sm">{doItem.total_kg?.toLocaleString('id-ID')} KG</span>
            </div>

            {/* Items summary */}
            {doItem.items && doItem.items.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] space-y-1 border border-slate-100">
                {doItem.items.slice(0, 3).map((it, i) => (
                  <div key={i} className="flex justify-between text-slate-700">
                    <span className="truncate mr-2">{it.product_name}</span>
                    <span className="font-bold shrink-0">{it.qty} ZAK ({it.total_kg?.toLocaleString('id-ID')} KG)</span>
                  </div>
                ))}
                {doItem.items.length > 3 && (
                  <div className="text-slate-400 text-center">... +{doItem.items.length - 3} item lagi</div>
                )}
              </div>
            )}

            {/* Invoice Section */}
            {doItem.total_invoice_amount ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold">Invoice No.:</span>
                  <span className="font-extrabold text-[#0f3e2e]">{doItem.invoice_number}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold">Harga/KG:</span>
                  <span className="font-bold">Rp {doItem.selling_price_per_kg?.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500 font-bold">Total Invoice:</span>
                  <span className="text-base font-extrabold text-[#0f3e2e]">{formatRp(doItem.total_invoice_amount)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-emerald-200">
                  <span className={`font-extrabold ${doItem.payment_status === 'LUNAS' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {doItem.payment_status === 'LUNAS' ? 'LUNAS' : `SISA: ${formatRp(doItem.remaining_balance || doItem.total_invoice_amount)}`}
                  </span>
                </div>
              </div>
            ) : (
              /* Set Price Panel */
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
                <span className="text-[11px] font-bold text-amber-800 block">Set Harga Jual per KG:</span>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
                    <input
                      type="number"
                      placeholder="Harga per KG..."
                      value={priceInputs[doItem.id] || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        setPriceInputs(prev => ({ ...prev, [doItem.id]: e.target.value }));
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleSetPrice(doItem.id); }}
                    className="px-4 py-2 bg-[#0f3e2e] text-white font-extrabold rounded-xl text-xs shrink-0 flex items-center space-x-1"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Set Invoice</span>
                  </button>
                </div>
                {priceInputs[doItem.id] && parseFloat(priceInputs[doItem.id]) > 0 && (
                  <div className="text-[11px] text-amber-700 font-bold">
                    Estimasi Invoice: {formatRp(doItem.total_kg * parseFloat(priceInputs[doItem.id]))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {deliveryOrders.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-sm font-bold">Belum ada Surat Jalan / DO yang dibuat.</p>
          <p className="text-xs mt-1">Admin 1 akan menambahkan DO dari menu Surat Jalan.</p>
        </div>
      )}
    </div>
  );
};

