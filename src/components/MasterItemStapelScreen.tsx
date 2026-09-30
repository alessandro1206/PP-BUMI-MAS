import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layers, Package, Plus, Edit, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ProductItem, StapelPile } from '../types';

export const MasterItemStapelScreen: React.FC = () => {
  const { products, stapelPiles, addProduct, updateProduct, adjustStapelStock, setRole, setActiveScreen } = useApp();

  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'STAPELS'>('STAPELS');

  // Modal Adjustment Stapel
  const [adjustModalStapel, setAdjustModalStapel] = useState<StapelPile | null>(null);
  const [newStockKg, setNewStockKg] = useState<number>(0);
  const [reason, setReason] = useState<string>('Stock Opname Rutin Mingguan');

  // Modal Add Product
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [weightPerUnit, setWeightPerUnit] = useState<number>(50);
  const [emptyBagStock, setEmptyBagStock] = useState<number>(1000);
  const [basePrice, setBasePrice] = useState<number>(14500);
  const [qualityGrade, setQualityGrade] = useState<'A' | 'B' | 'C'>('A');
  const [packagingConfig, setPackagingConfig] = useState<string>('@(1x50)');
  const [innerQty, setInnerQty] = useState<number>(1);
  const [innerWeightKg, setInnerWeightKg] = useState<number>(50);


  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleOpenAdjust = (stapel: StapelPile) => {
    setAdjustModalStapel(stapel);
    setNewStockKg(stapel.stock_kg);
    setReason('Stock Opname Rutin Mingguan');
  };

  const handleSaveAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalStapel) return;
    adjustStapelStock(adjustModalStapel.id, newStockKg, reason);
    setAdjustModalStapel(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProduct({
      code: code || `PROD-${Date.now()}`,
      name,
      unit: 'SAK',
      weight_per_unit: weightPerUnit,
      empty_bag_stock: emptyBagStock,
      finished_goods_stock_kg: 0,
      base_price_per_kg: basePrice,
      quality_grade: qualityGrade,
      packaging_config: packagingConfig,
      inner_qty: innerQty,
      inner_weight_kg: innerWeightKg
    });
    setShowProductModal(false);
    setCode(''); setName(''); setWeightPerUnit(50); setEmptyBagStock(1000); setBasePrice(14500);
    setQualityGrade('A'); setPackagingConfig('@(1x50)'); setInnerQty(1); setInnerWeightKg(50);
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
            <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">MANAJEMEN INVENTORY & STOK</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Master Barang, Sak Kemasan & Stok Stapelan
            </h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-[#08251b] p-1.5 rounded-xl border border-emerald-800">
          <button
            onClick={() => setActiveTab('STAPELS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'STAPELS' ? 'bg-[#10b981] text-[#0f3e2e] shadow' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Tumpukan Stapelan Curah
          </button>
          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'PRODUCTS' ? 'bg-[#10b981] text-[#0f3e2e] shadow' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Beras Kemasan & Sak Karung
          </button>
        </div>
      </div>

      {/* Stapel View */}
      {activeTab === 'STAPELS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-6 h-6 text-[#0f3e2e]" />
              <span>Daftar Stok Tumpukan Beras Curah Lapangan (Stapel)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stapelPiles.map(st => (
              <div key={st.id} className="bg-white rounded-2xl p-6 shadow-md border-2 border-emerald-100 space-y-4 hover:border-[#10b981] transition flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    Grade: {st.quality_grade}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">{st.name}</h3>
                  <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-200">
                    <span className="text-xs text-slate-500 font-bold block">Sisa Stok Beras Curah:</span>
                    <span className="text-2xl font-extrabold text-[#0f3e2e]">{st.stock_kg.toLocaleString('id-ID')} KG</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAdjust(st)}
                  className="w-full mt-4 py-2.5 bg-[#0f3e2e] hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Stock Opname Adjustment</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products View */}
      {activeTab === 'PRODUCTS' && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900">Daftar Produk Merek Beras & Sak Kemasan</h3>
            <button onClick={() => setShowProductModal(true)} className="px-4 py-2 bg-[#0f3e2e] text-white text-xs font-bold rounded-xl flex items-center space-x-1">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => {
              const gradeColor = p.quality_grade === 'A' ? 'bg-emerald-500 text-white' : p.quality_grade === 'B' ? 'bg-amber-400 text-[#0f3e2e]' : p.quality_grade === 'C' ? 'bg-slate-400 text-white' : 'bg-slate-200 text-slate-700';
              return (
                <div key={p.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-[#0f3e2e] text-white px-2 py-0.5 rounded">{p.code}</span>
                    {p.quality_grade && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${gradeColor}`}>Grade {p.quality_grade}</span>
                    )}
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">{p.name}</h4>
                  {p.packaging_config && (
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{p.packaging_config}</span>
                      {p.inner_qty && p.inner_qty > 1 && (
                        <span className="text-[10px] text-slate-400">{p.inner_qty} kantong x {p.inner_weight_kg}kg</span>
                      )}
                    </div>
                  )}
                  <div className="text-xs space-y-1 text-slate-600">
                    <div className="flex justify-between"><span>Berat/ZAK:</span><span className="font-bold">{p.weight_per_unit} KG</span></div>
                    <div className="flex justify-between"><span>Stok Karung Sak:</span><span className="font-bold text-emerald-700">{p.empty_bag_stock.toLocaleString('id-ID')} Sak</span></div>
                    <div className="flex justify-between"><span>Stok Beras Jadi:</span><span className="font-bold text-slate-900">{p.finished_goods_stock_kg.toLocaleString('id-ID')} KG</span></div>
                    <div className="flex justify-between"><span>Harga Acuan / KG:</span><span className="font-bold text-[#0f3e2e]">Rp {p.base_price_per_kg.toLocaleString('id-ID')}</span></div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Modal Adjust Stock */}
      {adjustModalStapel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveAdjust} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Stock Opname Adjustment (Penyesuaian Stok)</h3>
            <div className="text-xs font-bold text-emerald-800">{adjustModalStapel.name}</div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stok Hasil Timbang Ulang (KG):</label>
              <input type="number" required value={newStockKg} onChange={(e) => setNewStockKg(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-xl font-extrabold text-xl text-[#0f3e2e]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Penyesuaian Stok:</label>
              <input type="text" required value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold text-xs" />
            </div>
            <div className="flex space-x-2 pt-2">
              <button type="submit" className="flex-1 py-3 bg-[#0f3e2e] text-white font-extrabold text-xs rounded-xl">Simpan Adjustment</button>
              <button type="button" onClick={() => setAdjustModalStapel(null)} className="px-4 py-3 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Add Product */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Tambah Produk Beras Baru</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kode Produk:</label>
                <input type="text" placeholder="Contoh: PT-50" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kualitas (Grade):</label>
                <select value={qualityGrade} onChange={(e) => setQualityGrade(e.target.value as 'A'|'B'|'C')} className="w-full px-3 py-2 border rounded-xl font-bold text-sm">
                  <option value="A">Grade A — Kualitas Premium</option>
                  <option value="B">Grade B — Kualitas Medium</option>
                  <option value="C">Grade C — Curah / Lokal</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Merek Beras:</label>
              <input type="text" required placeholder="Contoh: Cap Putri Thailand @(5x10)KG" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kemasan (Packaging):</label>
                <select value={packagingConfig} onChange={(e) => {
                  const val = e.target.value;
                  setPackagingConfig(val);
                  if (val === '@(25x1)') { setInnerQty(25); setInnerWeightKg(1); setWeightPerUnit(25); }
                  else if (val === '@(5x10)') { setInnerQty(5); setInnerWeightKg(10); setWeightPerUnit(50); }
                  else if (val === '@(5x5)') { setInnerQty(5); setInnerWeightKg(5); setWeightPerUnit(25); }
                  else if (val === '@(1x50)') { setInnerQty(1); setInnerWeightKg(50); setWeightPerUnit(50); }
                  else if (val === '@(1x25)') { setInnerQty(1); setInnerWeightKg(25); setWeightPerUnit(25); }
                  else if (val === '@(1x20)') { setInnerQty(1); setInnerWeightKg(20); setWeightPerUnit(20); }
                }} className="w-full px-3 py-2 border rounded-xl font-bold text-sm">
                  <option value="@(25x1)">@(25x1) — 25 pcs x 1kg = 25kg/sak</option>
                  <option value="@(5x10)">@(5x10) — 5 pcs x 10kg = 50kg/sak</option>
                  <option value="@(5x5)">@(5x5) — 5 pcs x 5kg = 25kg/sak</option>
                  <option value="@(1x50)">@(1x50) — Karung 50kg biasa</option>
                  <option value="@(1x25)">@(1x25) — Karung 25kg biasa</option>
                  <option value="@(1x20)">@(1x20) — Karung 20kg biasa</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Berat per ZAK (KG):</label>
                <input type="number" value={weightPerUnit} onChange={(e) => setWeightPerUnit(parseFloat(e.target.value) || 1)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
              <div>
                <label className="block text-xs font-bold text-blue-700 mb-1">Inner Bag Qty (pcs/ZAK):</label>
                <input type="number" value={innerQty} onChange={(e) => setInnerQty(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-blue-700 mb-1">Berat Inner Bag (KG):</label>
                <input type="number" value={innerWeightKg} onChange={(e) => setInnerWeightKg(parseFloat(e.target.value) || 1)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Stok Awal Sak:</label>
                <input type="number" value={emptyBagStock} onChange={(e) => setEmptyBagStock(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Harga Acuan / KG:</label>
                <input type="number" value={basePrice} onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-xl font-bold text-sm" />
              </div>
            </div>
            <div className="flex space-x-2 pt-2">
              <button type="submit" className="flex-1 py-3 bg-[#0f3e2e] text-white font-extrabold text-xs rounded-xl">Simpan Produk</button>
              <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-3 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">Batal</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
