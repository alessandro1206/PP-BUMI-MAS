import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, ArrowLeft, Plus, Smartphone, TrendingUp, TrendingDown, Archive } from 'lucide-react';

export const Admin2SakStockScreen: React.FC = () => {
  const { sakItems, sakTransactions, addSakMasuk, role, setActiveScreen, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'SALDO' | 'MASUK' | 'KELUAR'>('SALDO');
  const [showMasukModal, setShowMasukModal] = useState<boolean>(false);
  const [selectedSakId, setSelectedSakId] = useState<string>(sakItems[0]?.id || '');
  const [masukQty, setMasukQty] = useState<number>(0);
  const [masukNotes, setMasukNotes] = useState<string>('');

  const isAdmin1 = currentUser?.role === 'ADMIN1';

  const filteredTx = sakTransactions.filter(tx => {
    if (activeTab === 'MASUK') return tx.type === 'MASUK';
    if (activeTab === 'KELUAR') return tx.type === 'KELUAR';
    return true;
  });

  const handleSaveMasuk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSakId || masukQty <= 0) return;
    addSakMasuk(selectedSakId, masukQty, masukNotes);
    setShowMasukModal(false);
    setMasukQty(0);
    setMasukNotes('');
    alert('Sak masuk berhasil dicatat! +' + masukQty.toLocaleString('id-ID') + ' pcs');
  };


  const outerSaks = sakItems.filter(s => s.sak_type === 'OUTER');
  const innerSaks = sakItems.filter(s => s.sak_type === 'INNER');

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-[#0f3e2e] text-white p-5 rounded-2xl shadow-lg border border-emerald-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => setActiveScreen(isAdmin1 ? 'SCREEN_16' : 'SCREEN_42')}
            className="p-2 bg-[#08251b] rounded-xl text-emerald-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-1.5">
              <Package className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] uppercase font-bold text-emerald-300">
                {isAdmin1 ? 'ADMIN 1 - KASIR KANTOR' : 'ADMIN 2 - HP CHECKER'}
              </span>
            </div>
            <h1 className="text-lg font-extrabold text-white">Buku Stok Sak (ZAK Digital)</h1>
          </div>
        </div>
        {isAdmin1 && (
          <button onClick={() => setShowMasukModal(true)}
            className="px-4 py-2 bg-amber-400 text-[#0f3e2e] font-extrabold text-xs rounded-xl flex items-center space-x-1.5 shadow">
            <Plus className="w-4 h-4" />
            <span>Input Sak Masuk</span>
          </button>
        )}
      </div>

      {/* Admin 2 Tab Bar (hanya jika admin2) */}
      {!isAdmin1 && (
        <div className="grid grid-cols-5 gap-1 p-1.5 bg-slate-200 rounded-xl font-bold text-[10px] text-center">
          <button onClick={() => setActiveScreen('SCREEN_42')} className="py-2 bg-white text-slate-700 rounded-lg">Cor Beras</button>
          <button onClick={() => setActiveScreen('SCREEN_8')} className="py-2 bg-white text-slate-700 rounded-lg">Minta Sak</button>
          <button onClick={() => setActiveScreen('SCREEN_SAK_STOCK')} className="py-2 bg-[#0f3e2e] text-white rounded-lg shadow">Stok Sak</button>
          <button onClick={() => setActiveScreen('SCREEN_36')} className="py-2 bg-white text-slate-700 rounded-lg">Opname</button>
          <button onClick={() => setActiveScreen('SCREEN_24')} className="py-2 bg-white text-slate-700 rounded-lg">Tally</button>
        </div>
      )}

      {/* Saldo Stok Sak */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-slate-700 flex items-center space-x-2">
          <Archive className="w-4 h-4 text-[#0f3e2e]" />
          <span>Saldo Stok Sak Saat Ini</span>
        </h2>

        {/* Outer Sak */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase mb-2"> Karung Besar (Outer Sak)</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {outerSaks.map(sak => {
              const isLow = sak.stock_current < 500;
              return (
                <div key={sak.id} className={`p-4 rounded-xl border-2 ${isLow ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'} space-y-1`}>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{sak.product_code}</div>
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">{sak.name}</div>
                  <div className={`text-xl font-extrabold ${isLow ? 'text-red-600' : 'text-[#0f3e2e]'}`}>
                    {sak.stock_current.toLocaleString('id-ID')}
                    <span className="text-xs font-bold text-slate-400 ml-1">pcs</span>
                  </div>
                  {isLow && <div className="text-[10px] text-red-500 font-bold">âš ï¸ Stok Menipis!</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Inner Bag */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase mb-2"> Kantong Kecil (Inner Bag)</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {innerSaks.map(sak => {
              const isLow = sak.stock_current < 2000;
              return (
                <div key={sak.id} className={`p-4 rounded-xl border-2 ${isLow ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'} space-y-1`}>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{sak.product_code}</div>
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">{sak.name}</div>
                  <div className={`text-xl font-extrabold ${isLow ? 'text-red-600' : 'text-[#0f3e2e]'}`}>
                    {sak.stock_current.toLocaleString('id-ID')}
                    <span className="text-xs font-bold text-slate-400 ml-1">pcs</span>
                  </div>
                  {isLow && <div className="text-[10px] text-red-500 font-bold">âš ï¸ Stok Menipis!</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Riwayat Transaksi */}
      <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800">Riwayat Transaksi Sak</h3>
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['SALDO', 'MASUK', 'KELUAR'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition ${activeTab === tab ? 'bg-[#0f3e2e] text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>
                {tab === 'MASUK' ? ' Masuk' : tab === 'KELUAR' ? ' Keluar' : ' Semua'}
              </button>
            ))}
          </div>
        </div>

        {filteredTx.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            Belum ada transaksi sak.{isAdmin1 ? ' Klik "Input Sak Masuk" untuk menambah.' : ''}
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredTx.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-3">
                  {tx.type === 'MASUK'
                    ? <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    : <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0" />
                  }
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{tx.sak_name}</div>
                    <div className="text-[10px] text-slate-500">{tx.transaction_date} Â· {tx.source} Â· {tx.logged_by}</div>
                    {tx.notes && <div className="text-[10px] text-slate-400 italic">{tx.notes}</div>}
                  </div>
                </div>
                <div className={`text-base font-extrabold ${tx.type === 'MASUK' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {tx.type === 'MASUK' ? '+' : '-'}{tx.qty.toLocaleString('id-ID')} pcs
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Input Sak Masuk (Admin 1 only) */}
      {showMasukModal && isAdmin1 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveMasuk} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2"> Input Sak Masuk (Pembelian)</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Sak:</label>
              <select
                value={selectedSakId}
                onChange={(e) => setSelectedSakId(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-bold text-sm text-slate-800"
              >
                <optgroup label="Karung Besar (Outer Sak)">
                  {outerSaks.map(s => <option key={s.id} value={s.id}>{s.name} (Saldo: {s.stock_current.toLocaleString('id-ID')} pcs)</option>)}
                </optgroup>
                <optgroup label="Kantong Kecil (Inner Bag)">
                  {innerSaks.map(s => <option key={s.id} value={s.id}>{s.name} (Saldo: {s.stock_current.toLocaleString('id-ID')} pcs)</option>)}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah (pcs):</label>
              <input
                type="number"
                required
                min={1}
                value={masukQty}
                onChange={(e) => setMasukQty(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-xl font-extrabold text-xl text-[#0f3e2e] text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Catatan (opsional):</label>
              <input
                type="text"
                value={masukNotes}
                onChange={(e) => setMasukNotes(e.target.value)}
                placeholder="Contoh: Beli dari Toko Packing Jaya"
                className="w-full px-3 py-2 border rounded-xl font-bold text-xs"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button type="submit" className="flex-1 py-3 bg-[#0f3e2e] text-white font-extrabold text-sm rounded-xl">Simpan Sak Masuk</button>
              <button type="button" onClick={() => setShowMasukModal(false)} className="px-4 py-3 bg-slate-200 text-slate-700 font-bold text-sm rounded-xl">Batal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

