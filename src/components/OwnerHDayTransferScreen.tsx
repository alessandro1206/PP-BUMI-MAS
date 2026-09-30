import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, ArrowLeft, CheckCircle2, Upload, FileText, DollarSign, Building, AlertCircle, Eye } from 'lucide-react';

export const OwnerHDayTransferScreen: React.FC = () => {
  const { weighbridgeInList, confirmOwnerTransfer, bankBalance, setRole, setActiveScreen, suppliers } = useApp();

  const scheduledTrucks = weighbridgeInList.filter(w => w.transfer_status === 'SCHEDULED_H1');
  const paidTrucks = weighbridgeInList.filter(w => w.transfer_status === 'PAID_H_DAY');

  const [selectedProof, setSelectedProof] = useState<{ [id: string]: string }>({});
  const [viewingProof, setViewingProof] = useState<string | null>(null);

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleFileChange = (id: string, fileUrl: string) => {
    setSelectedProof(prev => ({ ...prev, [id]: fileUrl }));
  };

  const handleConfirm = (id: string) => {
    const proof = selectedProof[id] || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400';
    confirmOwnerTransfer(id, proof);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#0f3e2e] text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setRole('OWNER'); setActiveScreen('SCREEN_38'); }}
            className="p-2 bg-[#08251b] rounded-xl hover:bg-emerald-900 transition text-emerald-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-[#f59e0b]" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">KONSOL OWNER - EKSEKUSI TRANSFER BANK HARI H</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Dashboard Transfer & Bukti Pembayaran Hari H <span className="text-xs bg-[#f59e0b] text-[#0f3e2e] px-2 py-1 rounded font-mono">SCREEN_4</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-[#08251b] px-6 py-3 rounded-xl border border-emerald-700/60">
          <Building className="w-8 h-8 text-[#10b981]" />
          <div>
            <div className="text-xs text-slate-300">Saldo Bank BCA Operasional:</div>
            <div className="text-xl font-extrabold text-[#10b981]">{formatRp(bankBalance)}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Scheduled Payments vs Paid Proof History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Scheduled Pending Transfer */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center justify-between">
            <span>Transfer Bank Siap Dieksekusi Hari Ini</span>
            <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">
              {scheduledTrucks.length} Menunggu Verifikasi Transfer
            </span>
          </h2>

          {scheduledTrucks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
              <CheckCircle2 className="w-16 h-16 text-[#10b981] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-slate-800">Semua Transfer Hari Ini Telah Lunas</h3>
              <p className="text-sm text-slate-500">Bukti transfer telah dikirimkan ke suplier.</p>
            </div>
          ) : (
            scheduledTrucks.map((truck) => {
              const supInfo = suppliers.find(s => s.id === truck.supplier_id);
              const customProof = selectedProof[truck.id];

              return (
                <div key={truck.id} className="bg-white rounded-2xl p-6 shadow-md border-2 border-emerald-200 hover:border-[#10b981] transition space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {truck.ticket_number} • {truck.nopol}
                      </span>
                      <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                        {truck.supplier_name}
                      </h3>
                    </div>

                    <div className="bg-emerald-50 px-4 py-2 rounded-xl text-right">
                      <span className="text-xs text-slate-500 font-bold">Total Nilai Transfer</span>
                      <div className="text-2xl font-extrabold text-[#0f3e2e]">
                        {formatRp(truck.total_payment || 0)}
                      </div>
                    </div>
                  </div>

                  {/* Bank Account Info Box */}
                  <div className="bg-[#faf8ff] p-4 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Bank Suplier:</span>
                      <div className="text-sm font-bold text-slate-900">{supInfo?.bank_name || 'BCA'}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Nomor Rekening:</span>
                      <div className="text-sm font-bold text-[#0f3e2e] font-mono">{supInfo?.bank_account_number || '0182391201'}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Nomor Telepon:</span>
                      <div className="text-sm font-bold text-slate-900">{supInfo?.phone || '081234567890'}</div>
                    </div>
                  </div>

                  {/* Upload / Confirm Proof UI */}
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">
                      Lampirkan Bukti Transfer Bank (URL / Foto Struk M-Banking):
                    </label>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Tempel URL Foto Struk Transfer (atau gunakan default)"
                        value={customProof || ''}
                        onChange={(e) => handleFileChange(truck.id, e.target.value)}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#10b981]"
                      />
                      <button
                        onClick={() => handleFileChange(truck.id, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400')}
                        className="px-3 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Contoh Struk</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleConfirm(truck.id)}
                      className="w-full py-4 bg-[#0f3e2e] hover:bg-emerald-900 text-white text-base font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                      <span>KONFIRMASI TRANSFER LUNAS & POTONG SALDO BANK BCA</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Verified Paid Transfers Log */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
              <span>Riwayat Transfer Lunas Hari Ini</span>
            </h3>

            {paidTrucks.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">Belum ada transaksi lunas hari ini</div>
            ) : (
              <div className="space-y-3">
                {paidTrucks.map((pt) => (
                  <div key={pt.id} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-800">{pt.supplier_name}</span>
                      <span className="text-emerald-700 font-bold">LUNAS Hari H</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Nopol: {pt.nopol}</span>
                      <span className="font-extrabold text-[#0f3e2e]">{formatRp(pt.total_payment || 0)}</span>
                    </div>
                    {pt.transfer_proof_file && (
                      <button
                        onClick={() => setViewingProof(pt.transfer_proof_file)}
                        className="text-[11px] text-[#10b981] font-bold hover:underline flex items-center space-x-1 pt-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Struk Transfer</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal View Struk */}
      {viewingProof && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Bukti Transfer M-Banking</h3>
              <button onClick={() => setViewingProof(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>
            <img src={viewingProof} alt="Bukti Transfer" className="w-full h-64 object-cover rounded-xl border border-slate-200" />
            <button onClick={() => setViewingProof(null)} className="w-full py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl">
              Tutup Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
