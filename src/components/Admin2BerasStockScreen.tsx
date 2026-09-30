import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layers, ArrowLeft, TrendingUp, TrendingDown, Package } from 'lucide-react';

export const Admin2BerasStockScreen: React.FC = () => {
  const { stapelPiles, products, byproductOpnames, setActiveScreen } = useApp();
  const [activeTab, setActiveTab] = useState<'BAHAN' | 'JADI' | 'LIMBAH'>('BAHAN');

  // Bahan Beras = stok di tumpukan (stapelPiles)
  const totalBahan = stapelPiles.reduce((acc, s) => acc + s.stock_kg, 0);

  // Beras Jadi = per produk dari master
  const totalJadi = products.reduce((acc, p) => acc + (p.finished_goods_stock_kg || 0), 0);

  // Beras Limbah = latest opname per type
  const latestOpname = byproductOpnames.length > 0 ? byproductOpnames[0] : null;
  const limbahTypes = [
    { name: 'Beras Broken A', kg: latestOpname?.broken_a_kg || latestOpname?.katul_kg || 0, color: 'bg-amber-100 border-amber-300 text-amber-900' },
    { name: 'Menir Beras', kg: latestOpname?.menir_kg || 0, color: 'bg-orange-100 border-orange-300 text-orange-900' },
    { name: 'Beras Rijek', kg: latestOpname?.rijek_kg || 0, color: 'bg-red-100 border-red-300 text-red-900' },
  ];
  const totalLimbah = limbahTypes.reduce((acc, l) => acc + l.kg, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-[#0f3e2e] text-white p-5 rounded-2xl shadow-lg border border-emerald-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => setActiveScreen('SCREEN_16')} className="p-2 bg-[#08251b] rounded-xl text-emerald-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] uppercase font-bold text-emerald-300">Admin 1 - Kasir Kantor</span>
            </div>
            <h1 className="text-lg font-extrabold text-white">Buku Stok Beras</h1>
          </div>
        </div>
        {/* Summary 3 kategori */}
        <div className="hidden md:flex space-x-3">
          <div className="text-center bg-[#08251b] px-3 py-1.5 rounded-xl">
            <div className="text-[10px] text-emerald-300 font-bold">BAHAN</div>
            <div className="text-sm font-extrabold text-white">{(totalBahan/1000).toFixed(1)} Ton</div>
          </div>
          <div className="text-center bg-[#08251b] px-3 py-1.5 rounded-xl">
            <div className="text-[10px] text-amber-400 font-bold">JADI</div>
            <div className="text-sm font-extrabold text-white">{(totalJadi/1000).toFixed(1)} Ton</div>
          </div>
          <div className="text-center bg-[#08251b] px-3 py-1.5 rounded-xl">
            <div className="text-[10px] text-red-400 font-bold">LIMBAH</div>
            <div className="text-sm font-extrabold text-white">{(totalLimbah/1000).toFixed(1)} Ton</div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="grid grid-cols-3 gap-1 p-1.5 bg-slate-200 rounded-xl font-bold text-xs text-center">
        {(['BAHAN', 'JADI', 'LIMBAH'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`py-2.5 rounded-lg transition font-extrabold ${activeTab === tab ? 'bg-[#0f3e2e] text-white shadow' : 'bg-white text-slate-700'}`}>
            {tab === 'BAHAN' ? '🌾 Bahan Beras' : tab === 'JADI' ? '📦 Beras Jadi' : '♻️ Limbah Giling'}
          </button>
        ))}
      </div>

      {/* BAHAN TAB — Tumpukan Beras */}
      {activeTab === 'BAHAN' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-700">Stok Bahan Beras (Per Tumpukan)</h2>
            <span className="text-xs font-bold text-slate-500">Total: {totalBahan.toLocaleString('id-ID')} KG</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stapelPiles.map(pile => {
              const isLow = pile.stock_kg < 5000;
              const pct = Math.min(100, (pile.stock_kg / 100000) * 100);
              return (
                <div key={pile.id} className={`p-4 rounded-2xl border-2 space-y-3 ${isLow ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">{pile.name}</div>
                  {pile.quality_grade && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pile.quality_grade === 'A' ? 'bg-emerald-100 text-emerald-800' : pile.quality_grade === 'B' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                      Grade {pile.quality_grade}
                    </span>
                  )}
                  <div>
                    <div className={`text-2xl font-extrabold ${isLow ? 'text-red-600' : 'text-[#0f3e2e]'}`}>
                      {pile.stock_kg.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold">KG</div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${isLow ? 'bg-red-400' : 'bg-emerald-500'}`} style={{ width: pct + '%' }}></div>
                  </div>
                  {isLow && <div className="text-[10px] text-red-500 font-bold">Stok Menipis!</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* JADI TAB — Beras Jadi per Produk */}
      {activeTab === 'JADI' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-700">Stok Beras Jadi (Per Produk)</h2>
            <span className="text-xs font-bold text-slate-500">Total: {totalJadi.toLocaleString('id-ID')} KG</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => {
              const gradeColor = p.quality_grade === 'A' ? 'bg-emerald-500 text-white' : p.quality_grade === 'B' ? 'bg-amber-400 text-[#0f3e2e]' : 'bg-slate-400 text-white';
              const stock = p.finished_goods_stock_kg || 0;
              return (
                <div key={p.id} className="p-4 rounded-2xl border-2 bg-white border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-[#0f3e2e] text-white px-2 py-0.5 rounded">{p.code}</span>
                    {p.quality_grade && <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${gradeColor}`}>Grade {p.quality_grade}</span>}
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 leading-tight">{p.name}</div>
                  <div className="flex items-center space-x-2">
                    {p.packaging_config && <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">{p.packaging_config}</span>}
                    <span className="text-[10px] text-slate-400">{p.weight_per_unit} KG/ZAK</span>
                  </div>
                  <div className="pt-1 flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-extrabold text-[#0f3e2e]">{stock.toLocaleString('id-ID')}</div>
                      <div className="text-[10px] text-slate-500 font-bold">KG</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-700">{p.weight_per_unit > 0 ? Math.floor(stock / p.weight_per_unit).toLocaleString('id-ID') : '-'} ZAK</div>
                      <div className="text-[10px] text-slate-400">estimasi karung</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIMBAH TAB — Katul, Menir, Rijek */}
      {activeTab === 'LIMBAH' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-700">Stok Beras Limbah Giling</h2>
            <span className="text-xs font-bold text-slate-500">
              Opname terakhir: {latestOpname?.opname_date || 'Belum ada'}
            </span>
          </div>

          {latestOpname ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {limbahTypes.map(lt => (
                <div key={lt.name} className={`p-5 rounded-2xl border-2 ${lt.color} space-y-2`}>
                  <div className="text-xs font-extrabold">{lt.name}</div>
                  <div className="text-3xl font-extrabold">{lt.kg.toLocaleString('id-ID')}</div>
                  <div className="text-[10px] font-bold">KG</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Belum ada data opname limbah. Admin 2 belum input opname sore.
            </div>
          )}

          {byproductOpnames.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
              <h3 className="text-xs font-extrabold text-slate-700">Riwayat Opname (7 Terakhir)</h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {byproductOpnames.slice(0, 7).map((op, i) => (
                  <div key={i} className="flex justify-between text-[11px] py-1.5 border-b border-slate-100">
                    <span className="font-bold text-slate-600">{op.opname_date}</span>
                    <span className="text-slate-700">Broken A: {op.broken_a_kg || op.katul_kg || 0} · Menir: {op.menir_kg} · Rijek: {op.rijek_kg} KG</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

