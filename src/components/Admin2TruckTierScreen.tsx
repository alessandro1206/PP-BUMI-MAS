import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, ArrowLeft, Smartphone, CheckCircle2, Layers, Plus, Trash2, AlertTriangle } from 'lucide-react';

interface RowInput {
  row_number: number;
  sak_count: number;
}

export const Admin2TruckTierScreen: React.FC = () => {
  const { truckTiers, saveTruckTier, setRole, setActiveScreen, deliveryOrders, updateDOItemLoadedQty } = useApp();

  // Active DO Selection
  const activeDOs = deliveryOrders.filter(d => d.status !== 'TERKIRIM');
  const [selectedDOId, setSelectedDOId] = useState<string>(activeDOs[0]?.id || '');
  const selectedDO = deliveryOrders.find(d => d.id === selectedDOId);

  // Form Fields
  const [nopol, setNopol] = useState<string>('B 9912 KFX');
  const [weightPerSak, setWeightPerSak] = useState<number>(50); // 50KG, 25KG, 20KG, 10KG
  const [destination, setDestination] = useState<string>('GD. DIPO JAPFA SURABAYA');
  const [targetSakSJ, setTargetSakSJ] = useState<number>(400);

  // Tier/Row Inputs Mode (Mode 1: Jumlah tier kebelakang, Mode 2: Tambah baris manual)
  const [tierCountInput, setTierCountInput] = useState<number>(5);
  const [rows, setRows] = useState<RowInput[]>([
    { row_number: 1, sak_count: 80 },
    { row_number: 2, sak_count: 80 },
    { row_number: 3, sak_count: 80 },
    { row_number: 4, sak_count: 80 },
    { row_number: 5, sak_count: 80 },
  ]);

  // When selected DO changes, auto-fill values
  useEffect(() => {
    if (selectedDO) {
      if (selectedDO.nopol) setNopol(selectedDO.nopol);
      if (selectedDO.expedition_info) {
        setDestination(selectedDO.expedition_info.split('\n')[0] || selectedDO.customer_name);
      } else {
        setDestination(selectedDO.customer_name);
      }
      // Calculate target sak from DO items
      const totalSakTarget = (selectedDO.items || []).reduce((acc, it) => acc + (it.qty || 0), 0);
      setTargetSakSJ(totalSakTarget > 0 ? totalSakTarget : Math.ceil(selectedDO.total_kg / 50));
    }
  }, [selectedDOId]);

  // Handler when tierCountInput is changed
  const handleTierCountInputChange = (count: number) => {
    const validCount = Math.max(1, count);
    setTierCountInput(validCount);
    
    // Adjust rows length to match validCount
    setRows(prev => {
      const newRows: RowInput[] = [];
      const defaultPerTier = validCount > 0 && targetSakSJ > 0 ? Math.round(targetSakSJ / validCount) : 50;
      for (let i = 1; i <= validCount; i++) {
        const existing = prev.find(r => r.row_number === i);
        newRows.push({
          row_number: i,
          sak_count: existing ? existing.sak_count : defaultPerTier
        });
      }
      return newRows;
    });
  };

  const handleRowSakChange = (index: number, count: number) => {
    const validCount = Math.max(0, count);
    setRows(prev => prev.map((r, idx) => idx === index ? { ...r, sak_count: validCount } : r));
  };

  const handleAddRow = () => {
    setRows(prev => {
      const nextNum = prev.length + 1;
      const lastSak = prev.length > 0 ? prev[prev.length - 1].sak_count : 50;
      const updated = [...prev, { row_number: nextNum, sak_count: lastSak }];
      setTierCountInput(updated.length);
      return updated;
    });
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows(prev => {
      const filtered = prev.filter((_, idx) => idx !== index);
      const renumbered = filtered.map((r, i) => ({ ...r, row_number: i + 1 }));
      setTierCountInput(renumbered.length);
      return renumbered;
    });
  };

  const totalSakActual = rows.reduce((acc, r) => acc + (r.sak_count || 0), 0);
  const totalKgActual = totalSakActual * weightPerSak;
  const sakDiff = totalSakActual - targetSakSJ;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nopol.trim() || totalSakActual <= 0) return;

    saveTruckTier({
      load_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      nopol: nopol.toUpperCase(),
      do_id: selectedDO?.id,
      do_number: selectedDO?.do_number,
      customer_name: selectedDO?.customer_name,
      target_sak_surat_jalan: targetSakSJ,
      tier_count: rows.length,
      row_inputs: rows,
      total_sak: totalSakActual,
      total_kg: totalKgActual,
      destination
    });

    // Update actual loaded kg on DO item if selected
    if (selectedDO && selectedDO.items && selectedDO.items.length > 0) {
      updateDOItemLoadedQty(selectedDO.id, selectedDO.items[0].id, totalKgActual);
    }

    alert(`✅ Data Tally Muat Truk ${nopol} Berhasil Disimpan!\nTotal Tally: ${totalSakActual} Sak (${totalKgActual.toLocaleString('id-ID')} KG)\nTarget Surat Jalan: ${targetSakSJ} Sak (${sakDiff === 0 ? 'SESUAI' : `Selisih ${sakDiff > 0 ? '+' : ''}${sakDiff} Sak`})`);
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
            <h1 className="text-lg font-extrabold text-white">
              Tally Tier & Muat Truk
            </h1>
          </div>
        </div>
      </div>

      {/* Admin 2 Mobile Tabs Bar */}
      <div className="grid grid-cols-4 gap-1 p-1.5 bg-slate-200 rounded-xl font-bold text-[10px] text-center">
        <button onClick={() => setActiveScreen('SCREEN_42')} className="py-2 bg-white text-slate-700 rounded-lg">Cor Beras</button>
        <button onClick={() => setActiveScreen('SCREEN_8')} className="py-2 bg-white text-slate-700 rounded-lg">Minta Sak</button>
        <button onClick={() => setActiveScreen('SCREEN_36')} className="py-2 bg-white text-slate-700 rounded-lg">Opname Sore</button>
        <button onClick={() => setActiveScreen('SCREEN_24')} className="py-2 bg-[#0f3e2e] text-white rounded-lg shadow">Tally Truk</button>
      </div>

      {/* Tally Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-md border-2 border-slate-200 space-y-5">
        
        {/* 1. Pilih Surat Jalan / DO */}
        <div>
          <label className="block text-xs font-extrabold text-[#0f3e2e] mb-1">1. Pilih Surat Jalan / DO Tujuan:</label>
          <select
            value={selectedDOId}
            onChange={(e) => setSelectedDOId(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-xs font-bold text-[#0f3e2e]"
          >
            <option value="">[ Input Truk Manual / Tanpa DO ]</option>
            {activeDOs.map(d => (
              <option key={d.id} value={d.id}>
                {d.do_number} — {d.customer_name} ({d.nopol || 'Tanpa Nopol'})
              </option>
            ))}
          </select>
        </div>

        {/* Nopol & Target Surat Jalan Summary Box */}
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-bold">Nopol Truk:</span>
            <input
              type="text"
              required
              value={nopol}
              onChange={(e) => setNopol(e.target.value)}
              className="w-36 px-2 py-1 bg-white border border-slate-300 rounded font-extrabold text-center uppercase text-sm text-[#0f3e2e]"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-bold">Target Sak di Surat Jalan:</span>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                value={targetSakSJ}
                onChange={(e) => setTargetSakSJ(parseInt(e.target.value) || 0)}
                className="w-24 px-2 py-1 bg-white border border-slate-300 rounded font-extrabold text-center text-sm text-[#0f3e2e]"
              />
              <span className="font-bold text-slate-700">Sak</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-bold">Ukuran Karung/Sak:</span>
            <select
              value={weightPerSak}
              onChange={(e) => setWeightPerSak(parseInt(e.target.value) || 50)}
              className="px-2 py-1 bg-white border border-slate-300 rounded font-bold text-xs text-[#0f3e2e]"
            >
              <option value={50}>@50 KG / Sak</option>
              <option value={25}>@25 KG / Sak</option>
              <option value={20}>@20 KG / Sak</option>
              <option value={10}>@10 KG / Sak</option>
            </select>
          </div>
        </div>

        {/* 2. Hitung Baris / Tier Muatan (Dynamic Rows) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-800">
              2. Isi Berapa Tier/Baris Kebelakang:
            </label>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                min="1"
                max="30"
                value={tierCountInput}
                onChange={(e) => handleTierCountInputChange(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 bg-slate-50 border-2 border-[#0f3e2e] rounded-lg text-center font-extrabold text-sm text-[#0f3e2e]"
              />
              <span className="text-xs font-bold text-slate-600">Baris</span>
            </div>
          </div>

          {/* List Dynamic Baris Inputs */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {rows.map((row, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#0f3e2e] w-20">Baris ke-{row.row_number}:</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleRowSakChange(idx, row.sak_count - 5)}
                    className="w-8 h-8 bg-white border border-slate-300 rounded-lg text-slate-700 font-extrabold text-lg active:bg-slate-200 flex items-center justify-center shadow-sm"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={row.sak_count}
                    onChange={(e) => handleRowSakChange(idx, parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1.5 bg-white border-2 border-slate-300 rounded-lg text-center font-extrabold text-base text-[#0f3e2e]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRowSakChange(idx, row.sak_count + 5)}
                    className="w-8 h-8 bg-[#0f3e2e] text-white rounded-lg font-extrabold text-lg active:bg-emerald-900 flex items-center justify-center shadow-sm"
                  >
                    +
                  </button>
                  <span className="font-bold text-slate-500 w-8">Sak</span>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Plus (+) Tambah Baris Manual */}
          <button
            type="button"
            onClick={handleAddRow}
            className="w-full py-2.5 bg-emerald-100 hover:bg-emerald-200 text-[#0f3e2e] font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 border border-emerald-300 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Baris ke-{rows.length + 1} (+)</span>
          </button>
        </div>

        {/* Real-time Match Indicator Banner */}
        <div className={`p-4 rounded-xl border-2 space-y-1 ${
          sakDiff === 0
            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
            : 'bg-amber-50 border-amber-400 text-amber-900'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold">TOTAL REALISASI TALLY:</span>
            <span className="text-xl font-extrabold text-[#0f3e2e]">{totalSakActual} Sak ({totalKgActual.toLocaleString('id-ID')} KG)</span>
          </div>

          <div className="flex items-center space-x-1 text-xs font-extrabold pt-1 border-t border-slate-200">
            {sakDiff === 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700">✓ SESUAI DENGAN SURAT JALAN ({targetSakSJ} Sak)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-amber-800">
                  ⚠️ SELISIH: {sakDiff > 0 ? `+${sakDiff}` : sakDiff} Sak dari Surat Jalan (Tally: {totalSakActual} / SJ: {targetSakSJ} Sak)
                </span>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-800 mb-1">Tujuan / Catatan Pengiriman:</label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl font-bold text-xs text-slate-900"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-[#0f3e2e] to-[#10b981] text-white font-extrabold text-base rounded-xl shadow-lg flex items-center justify-center space-x-2"
        >
          <Truck className="w-5 h-5 text-amber-400" />
          <span>KIRIM DATA TALLY KE KANTOR ADMIN 1</span>
        </button>
      </form>
    </div>
  );
};
