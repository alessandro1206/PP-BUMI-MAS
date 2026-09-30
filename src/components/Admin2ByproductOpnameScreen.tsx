import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ArrowLeft, Smartphone, Plus, Trash2, Package } from 'lucide-react';
import { FinishedGoodOpnameItem } from '../types';

export const Admin2ByproductOpnameScreen: React.FC = () => {
  const { byproductOpnames, saveByproductOpname, products, setRole, setActiveScreen } = useApp();

  // 1. Beras Jadi Multi-Item State
  const [fgItems, setFgItems] = useState<FinishedGoodOpnameItem[]>([
    { product_name: products[0]?.name || 'Cap Putri Thailand 50KG', qty_zak: 300, total_kg: 15000 },
    { product_name: products[1]?.name || 'Cap Putri Thailand 25KG', qty_zak: 200, total_kg: 5000 },
    { product_name: products[6]?.name || 'Cap Pandan 25KG', qty_zak: 180, total_kg: 4500 },
  ]);

  const [selectedProdId, setSelectedProdId] = useState<string>(products[0]?.id || '');
  const [newQtyZak, setNewQtyZak] = useState<number>(100);

  // 2. By-Product State (Broken A, Menir, Rijek - Katul Removed)
  const [brokenAKg, setBrokenAKg] = useState<number>(1250);
  const [menirKg, setMenirKg] = useState<number>(680);
  const [rijekKg, setRijekKg] = useState<number>(310);

  const [checkerName, setCheckerName] = useState<string>('Mat Tally');

  const totalBerasJadiKg = fgItems.reduce((acc, item) => acc + (item.total_kg || 0), 0);
  const totalBerasJadiZak = fgItems.reduce((acc, item) => acc + (item.qty_zak || 0), 0);

  const handleAddFgItem = () => {
    const prod = products.find(p => p.id === selectedProdId);
    if (!prod || newQtyZak <= 0) return;
    const totalKg = newQtyZak * (prod.weight_per_unit || 50);

    // Check if already in list
    const existingIndex = fgItems.findIndex(it => it.product_name === prod.name);
    if (existingIndex >= 0) {
      setFgItems(prev => prev.map((it, idx) =>
        idx === existingIndex
          ? { ...it, qty_zak: it.qty_zak + newQtyZak, total_kg: it.total_kg + totalKg }
          : it
      ));
    } else {
      setFgItems(prev => [
        ...prev,
        { product_id: prod.id, product_name: prod.name, qty_zak: newQtyZak, total_kg: totalKg }
      ]);
    }
  };

  const handleRemoveFgItem = (index: number) => {
    setFgItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveByproductOpname({
      opname_date: new Date().toISOString().split('T')[0],
      broken_a_kg: brokenAKg,
      menir_kg: menirKg,
      rijek_kg: rijekKg,
      beras_jadi_kg: totalBerasJadiKg,
      finished_goods_items: fgItems,
      checker_name: checkerName
    });

    alert(`Opname Sore Hasil Giling Berhasil Disimpan!\nTotal Beras Jadi: ${totalBerasJadiZak} ZAK (${totalBerasJadiKg.toLocaleString('id-ID')} KG)\nBroken A: ${brokenAKg} KG | Menir: ${menirKg} KG | Rijek: ${rijekKg} KG`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Mobile Top Header */}
      <div className="bg-[#0f3e2e] text-white p-5 rounded-2xl shadow-lg border border-emerald-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }} className="p-2 bg-[#08251b] rounded-xl text-emerald-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] uppercase font-bold text-emerald-300">ADMIN 2 - HP CHECKER</span>
            </div>
            <h1 className="text-lg font-extrabold text-white">Opname Sore Beras & Limbah</h1>
          </div>
        </div>
      </div>

      {/* Admin 2 Mobile Tabs Bar */}
      <div className="grid grid-cols-4 gap-1 p-1.5 bg-slate-200 rounded-xl font-bold text-[10px] text-center">
        <button onClick={() => setActiveScreen('SCREEN_42')} className="py-2 bg-white text-slate-700 rounded-lg">Cor Beras</button>
        <button onClick={() => setActiveScreen('SCREEN_8')} className="py-2 bg-white text-slate-700 rounded-lg">Minta Sak</button>
        <button onClick={() => setActiveScreen('SCREEN_36')} className="py-2 bg-[#0f3e2e] text-white rounded-lg shadow">Opname Sore</button>
        <button onClick={() => setActiveScreen('SCREEN_24')} className="py-2 bg-white text-slate-700 rounded-lg">Tally Truk</button>
      </div>

      {/* Opname Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-md border-2 border-slate-200 space-y-6">

        {/* SECTION 1: Beras Jadi (Multi-Jenis / Multi-Produk) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold text-[#0f3e2e] flex items-center space-x-1">
              <Package className="w-4 h-4 text-[#0f3e2e]" />
              <span>1. Opname Beras Jadi (Per Jenis Produk)</span>
            </span>
          </div>

          {/* Form Tambah Jenis Beras Jadi */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-600 block">Tambah Jenis Beras Jadi Hasil Giling:</span>
            <div className="space-y-2">
              <select
                value={selectedProdId}
                onChange={(e) => setSelectedProdId(e.target.value)}
                className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-[#0f3e2e]"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.weight_per_unit} KG/ZAK)
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    type="number"
                    min="1"
                    placeholder="Jumlah ZAK..."
                    value={newQtyZak}
                    onChange={(e) => setNewQtyZak(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-extrabold text-center text-[#0f3e2e]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddFgItem}
                  className="px-4 py-2 bg-[#0f3e2e] hover:bg-emerald-900 text-white font-extrabold text-xs rounded-lg flex items-center space-x-1 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
          </div>

          {/* Daftar Hasil Opname Beras Jadi */}
          <div className="space-y-2">
            {fgItems.map((item, idx) => (
              <div key={idx} className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-slate-900">{item.product_name}</div>
                  <div className="text-[10px] text-emerald-700 font-bold">
                    {item.qty_zak} ZAK = {item.total_kg?.toLocaleString('id-ID')} KG
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFgItem(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Total Summary Beras Jadi */}
          <div className="bg-[#0f3e2e] text-white p-3 rounded-xl flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-200">TOTAL BERAS JADI SORE:</span>
            <span className="font-extrabold text-amber-400 text-sm">
              {totalBerasJadiZak} ZAK ({totalBerasJadiKg.toLocaleString('id-ID')} KG)
            </span>
          </div>
        </div>

        {/* SECTION 2: Hasil Sampingan / By-Product Giling (Broken A, Menir, Reject - Katul Removed) */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <span className="text-xs font-extrabold text-slate-800 block">2. Hasil Sampingan (By-Product Giling):</span>

          {/* 1. Beras Broken A */}
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-amber-900 block">Beras Broken A (KG):</span>
              <span className="text-[10px] text-amber-700">Pecahan beras kualitas A</span>
            </div>
            <input
              type="number"
              value={brokenAKg}
              onChange={(e) => setBrokenAKg(parseFloat(e.target.value) || 0)}
              className="w-32 px-2 py-1.5 bg-white border border-amber-300 rounded-lg text-lg font-extrabold text-[#0f3e2e] text-right outline-none"
            />
          </div>

          {/* 2. Menir Beras */}
          <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-orange-900 block">Menir Beras (KG):</span>
              <span className="text-[10px] text-orange-700">Menir pecahan halus</span>
            </div>
            <input
              type="number"
              value={menirKg}
              onChange={(e) => setMenirKg(parseFloat(e.target.value) || 0)}
              className="w-32 px-2 py-1.5 bg-white border border-orange-300 rounded-lg text-lg font-extrabold text-[#0f3e2e] text-right outline-none"
            />
          </div>

          {/* 3. Beras Rijek / Reject */}
          <div className="bg-red-50 p-3 rounded-xl border border-red-200 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-red-900 block">Beras Reject / Rijek (KG):</span>
              <span className="text-[10px] text-red-700">Beras afkir / sortir warna</span>
            </div>
            <input
              type="number"
              value={rijekKg}
              onChange={(e) => setRijekKg(parseFloat(e.target.value) || 0)}
              className="w-32 px-2 py-1.5 bg-white border border-red-300 rounded-lg text-lg font-extrabold text-red-600 text-right outline-none"
            />
          </div>
        </div>

        {/* Petugas Checker */}
        <div>
          <label className="block text-xs font-extrabold text-slate-800 mb-1">Nama Petugas Checker Opname:</label>
          <input
            type="text"
            required
            value={checkerName}
            onChange={(e) => setCheckerName(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl font-bold text-sm text-slate-900"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#0f3e2e] hover:bg-emerald-900 text-white font-extrabold text-base rounded-xl shadow-lg flex items-center justify-center space-x-2"
        >
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span>SIMPAN OPNAME HASIL SORE</span>
        </button>
      </form>
    </div>
  );
};
