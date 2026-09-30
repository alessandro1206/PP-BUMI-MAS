import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, DollarSign, Calendar, CheckCircle2, Truck, AlertCircle, ArrowLeft } from 'lucide-react';

export const OwnerPriceScheduleScreen: React.FC = () => {
  const { weighbridgeInList, setOwnerPriceAndSchedule, setRole, setActiveScreen } = useApp();

  const pendingTrucks = weighbridgeInList.filter(w => w.transfer_status === 'PENDING_PRICE');
  const scheduledTrucks = weighbridgeInList.filter(w => w.transfer_status === 'SCHEDULED_H1');

  const [editingPrices, setEditingPrices] = useState<{ [id: string]: { price: string; date: string } }>({});

  const handlePriceChange = (id: string, val: string) => {
    setEditingPrices(prev => ({
      ...prev,
      [id]: { ...prev[id], price: val, date: prev[id]?.date || tomorrowDateStr() }
    }));
  };

  const handleDateChange = (id: string, val: string) => {
    setEditingPrices(prev => ({
      ...prev,
      [id]: { ...prev[id], price: prev[id]?.price || '', date: val }
    }));
  };

  const tomorrowDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const handleSave = (id: string, netWeight: number) => {
    const data = editingPrices[id];
    const priceNum = parseFloat(data?.price || '0');
    if (!priceNum || priceNum <= 0) {
      alert('Mohon masukkan harga per KG yang valid! (Contoh: 12800)');
      return;
    }
    const targetDate = data?.date || tomorrowDateStr();
    setOwnerPriceAndSchedule(id, priceNum, targetDate);
  };

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header bar for Owner */}
      <div className="bg-[#0f3e2e] text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }}
            className="p-2 bg-[#08251b] rounded-xl hover:bg-emerald-900 transition text-emerald-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-[#f59e0b]" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">MODE KONSOL DIREKTUR / OWNER</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Penetapan Harga & Jadwal Transfer Pembelian Beras H-1 <span className="text-xs bg-[#f59e0b] text-[#0f3e2e] px-2 py-1 rounded font-mono">SCREEN_13</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-[#08251b] px-5 py-3 rounded-xl border border-emerald-700/60">
          <AlertCircle className="w-8 h-8 text-[#f59e0b]" />
          <div>
            <div className="text-xs text-emerald-200">Perlu Penetapan Harga:</div>
            <div className="text-xl font-extrabold text-amber-400">{pendingTrucks.length} Truk Antre</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Pending Trucks Form Cards */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Truck className="w-6 h-6 text-[#0f3e2e]" />
              <span>Daftar Truk Baru Masuk (Timbangan Selesai)</span>
            </span>
            <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
              {pendingTrucks.length} Belum Diberi Harga
            </span>
          </h2>

          {pendingTrucks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-300 space-y-3">
              <CheckCircle2 className="w-16 h-16 text-[#10b981] mx-auto" />
              <h3 className="text-xl font-bold text-slate-800">Semua Truk Sudah Ditetapkan Harganya</h3>
              <p className="text-sm text-slate-500">Tidak ada antrean penetapan harga gabah/beras saat ini.</p>
            </div>
          ) : (
            pendingTrucks.map((truck) => {
              const currentPrice = editingPrices[truck.id]?.price || '';
              const currentDate = editingPrices[truck.id]?.date || tomorrowDateStr();
              const priceNum = parseFloat(currentPrice || '0');
              const totalEst = priceNum ? truck.net_weight * priceNum : 0;

              return (
                <div key={truck.id} className="bg-white rounded-2xl p-6 shadow-md border-2 border-amber-300 hover:border-[#10b981] transition space-y-6">
                  {/* Truck Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                          {truck.ticket_number}
                        </span>
                        <span className="text-xs font-bold text-slate-500">{truck.datetime_in}</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                        {truck.supplier_name}
                      </h3>
                    </div>

                    <div className="text-right bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                      <div className="text-xs text-slate-500">Berat Netto Masuk:</div>
                      <div className="text-2xl font-extrabold text-[#0f3e2e]">
                        {truck.net_weight.toLocaleString('id-ID')} <span className="text-sm">KG</span>
                      </div>
                    </div>
                  </div>

                  {/* Weight Info Summary */}
                  <div className="grid grid-cols-3 gap-4 text-center bg-slate-50 p-3 rounded-xl text-xs font-medium text-slate-600">
                    <div>
                      <div>Nopol Truk</div>
                      <div className="text-base font-bold text-slate-900">{truck.nopol}</div>
                    </div>
                    <div>
                      <div>Bruto Timbang</div>
                      <div className="text-base font-bold text-slate-900">{truck.gross_weight.toLocaleString('id-ID')} KG</div>
                    </div>
                    <div>
                      <div>Potongan Sak</div>
                      <div className="text-base font-bold text-slate-900">{truck.bag_deduction} KG</div>
                    </div>
                  </div>

                  {/* Owner Controls */}
                  <div className="bg-[#faf8ff] p-5 rounded-xl border border-emerald-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Price Input */}
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-1">
                          Tetapkan Harga per KG (Rp):
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-3.5 font-bold text-slate-500 text-lg">Rp</span>
                          <input
                            type="number"
                            placeholder="Contoh: 12800"
                            value={currentPrice}
                            onChange={(e) => handlePriceChange(truck.id, e.target.value)}
                            className="w-full pl-12 pr-4 py-3 text-2xl font-extrabold bg-white border-2 border-slate-300 rounded-xl focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 outline-none text-[#0f3e2e]"
                          />
                        </div>
                      </div>

                      {/* Date Input */}
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-1">
                          Rencana Tanggal Transfer (H-1):
                        </label>
                        <input
                          type="date"
                          value={currentDate}
                          onChange={(e) => handleDateChange(truck.id, e.target.value)}
                          className="w-full px-4 py-3 text-lg font-bold bg-white border-2 border-slate-300 rounded-xl focus:border-[#10b981] outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Total Estimated Calculation Box */}
                    {totalEst > 0 && (
                      <div className="bg-[#0f3e2e] text-white p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs text-emerald-300 font-medium">Total Pembayaran Gabah Suplier:</span>
                          <div className="text-2xl font-extrabold text-[#f59e0b]">
                            {formatRp(totalEst)}
                          </div>
                        </div>
                        <span className="text-xs bg-emerald-700/80 px-3 py-1 rounded-full font-mono">
                          {truck.net_weight.toLocaleString('id-ID')} KG × Rp {parseFloat(currentPrice).toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}

                    {/* Submit Action Button */}
                    <button
                      onClick={() => handleSave(truck.id, truck.net_weight)}
                      className="w-full py-4 bg-gradient-to-r from-[#0f3e2e] to-[#10b981] text-white text-lg font-extrabold rounded-xl hover:opacity-9 shadow-lg transition flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-6 h-6 text-[#f59e0b]" />
                      <span>SETUJU & PROSES KE JADWAL TRANSFER H-1</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Scheduled H-1 Overview */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#10b981]" />
              <span>Jadwal Transfer Terkonfirmasi (H-1)</span>
            </h3>
            <p className="text-xs text-slate-500">Truk yang sudah ditetapkan harganya dan siap ditransfer Owner pada Hari H.</p>

            {scheduledTrucks.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">Belum ada truk jadwal transfer H-1</div>
            ) : (
              <div className="space-y-3">
                {scheduledTrucks.map((st) => (
                  <div key={st.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{st.supplier_name}</span>
                      <span className="text-[#10b981] font-mono">{st.transfer_plan_date}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Nopol: {st.nopol}</span>
                      <span>Netto: {st.net_weight.toLocaleString('id-ID')} KG</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                      <span className="text-xs text-slate-500">Rp {st.price_per_kg?.toLocaleString('id-ID')}/KG</span>
                      <span className="font-extrabold text-[#0f3e2e]">{formatRp(st.total_payment || 0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setActiveScreen('SCREEN_38')}
              className="w-full py-2.5 bg-slate-100 text-[#0f3e2e] font-bold text-xs rounded-xl hover:bg-slate-200 transition text-center block"
            >
              Lihat Dashboard Bayar Hutang H-1 (SCREEN_38) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
