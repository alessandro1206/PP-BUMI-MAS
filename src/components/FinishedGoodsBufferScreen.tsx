import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Warehouse, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ArrowLeft, 
  Flame, 
  ShieldCheck, 
  Plus, 
  RefreshCw,
  Clock,
  History
} from 'lucide-react';
import { FinishedGoodsCorPlanItem } from '../types';

export const FinishedGoodsBufferScreen: React.FC = () => {
  const { 
    deliveryOrders, 
    products, 
    stapelPiles, 
    finishedGoodsPlans, 
    saveFinishedGoodsPlan, 
    executeFinishedGoodsCorPlan,
    setActiveScreen, 
    setRole 
  } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [activeTab, setActiveTab] = useState<'KALKULATOR' | 'RIWAYAT'>('KALKULATOR');

  // Filter DO untuk tanggal yang dipilih (atau yang belum ada tanggalnya / open order)
  const targetDOs = useMemo(() => {
    return deliveryOrders.filter(d => d.delivery_date === selectedDate || !d.delivery_date);
  }, [deliveryOrders, selectedDate]);

  // Agregasi kebutuhan DO per Produk
  const aggregatedDOItems = useMemo(() => {
    const map: Record<string, { totalKg: number; doList: string[] }> = {};
    targetDOs.forEach(d => {
      (d.items || []).forEach(item => {
        // Cari matching produk
        const prod = products.find(p => 
          item.product_name.toLowerCase().includes(p.name.toLowerCase().substring(0, 6)) ||
          p.name.toLowerCase().includes(item.product_name.toLowerCase().substring(0, 6))
        );
        const prodId = prod?.id || item.id || item.product_name;
        if (!map[prodId]) {
          map[prodId] = { totalKg: 0, doList: [] };
        }
        map[prodId].totalKg += (item.total_kg || 0);
        if (d.do_number && !map[prodId].doList.includes(d.do_number)) {
          map[prodId].doList.push(d.do_number);
        }
      });
    });
    return map;
  }, [targetDOs, products]);

  // Form State untuk setiap baris produk
  // Key = product_id
  const [rowInputs, setRowInputs] = useState<Record<string, {
    estYieldPct: number;
    actualAsalanKg: number;
    selectedStapelId: string;
  }>>({});

  // Hitung data tabel kalkulator
  const planRows = useMemo(() => {
    return products.map(prod => {
      const doData = aggregatedDOItems[prod.id] || { totalKg: 0, doList: [] };
      const targetDoKg = doData.totalKg;
      const stockFgKg = prod.finished_goods_stock_kg || 0;
      const deficitKg = Math.max(0, targetDoKg - stockFgKg);

      const customInput = rowInputs[prod.id];
      const estYieldPct = customInput?.estYieldPct || 67; // Default 67% rendemen poles
      const minAsalanCorKg = deficitKg > 0 ? Math.ceil(deficitKg / (estYieldPct / 100)) : 0;
      
      // Default actual: jika belum diinput, defaultkan ke minAsalanCorKg
      const actualAsalanKg = customInput?.actualAsalanKg !== undefined 
        ? customInput.actualAsalanKg 
        : minAsalanCorKg;

      const selectedStapelId = customInput?.selectedStapelId || stapelPiles[0]?.id || '';
      const selectedStapel = stapelPiles.find(s => s.id === selectedStapelId);

      const isDeficit = deficitKg > 0;
      const isActualBelowMin = actualAsalanKg < minAsalanCorKg;
      const surplusFgAfterCor = Math.max(0, (stockFgKg + Math.round(actualAsalanKg * (estYieldPct / 100))) - targetDoKg);

      return {
        product: prod,
        targetDoKg,
        stockFgKg,
        deficitKg,
        estYieldPct,
        minAsalanCorKg,
        actualAsalanKg,
        selectedStapelId,
        selectedStapelName: selectedStapel?.name || 'Stapel 1',
        isDeficit,
        isActualBelowMin,
        surplusFgAfterCor,
        doCount: doData.doList.length
      };
    });
  }, [products, aggregatedDOItems, rowInputs, stapelPiles]);

  // Total Ringkasan
  const summary = useMemo(() => {
    let totalTargetDO = 0;
    let totalStockFG = 0;
    let totalDeficit = 0;
    let totalMinCor = 0;
    let totalActualCor = 0;
    let hasValidationViolation = false;

    planRows.forEach(r => {
      totalTargetDO += r.targetDoKg;
      totalStockFG += r.stockFgKg;
      totalDeficit += r.deficitKg;
      totalMinCor += r.minAsalanCorKg;
      totalActualCor += r.actualAsalanKg;
      if (r.isActualBelowMin) {
        hasValidationViolation = true;
      }
    });

    return {
      totalTargetDO,
      totalStockFG,
      totalDeficit,
      totalMinCor,
      totalActualCor,
      hasValidationViolation
    };
  }, [planRows]);

  const handleUpdateRow = (prodId: string, field: 'estYieldPct' | 'actualAsalanKg' | 'selectedStapelId', value: any) => {
    setRowInputs(prev => {
      const current = prev[prodId] || {
        estYieldPct: 67,
        actualAsalanKg: 0,
        selectedStapelId: stapelPiles[0]?.id || ''
      };
      return {
        ...prev,
        [prodId]: {
          ...current,
          [field]: value
        }
      };
    });
  };

  const handleSaveAndDispatch = () => {
    if (summary.hasValidationViolation) {
      alert('⚠️ PERINGATAN: Realisasi Cor tidak boleh lebih kecil dari Rencana Cor Minimal! Silakan periksa baris yang bertanda merah.');
      return;
    }

    const itemsToSave: FinishedGoodsCorPlanItem[] = planRows
      .filter(r => r.targetDoKg > 0 || r.actualAsalanKg > 0)
      .map(r => ({
        product_id: r.product.id,
        product_code: r.product.code,
        product_name: r.product.name,
        quality_grade: r.product.quality_grade,
        target_do_kg: r.targetDoKg,
        stock_fg_kg: r.stockFgKg,
        deficit_kg: r.deficitKg,
        est_yield_pct: r.estYieldPct,
        min_asalan_cor_kg: r.minAsalanCorKg,
        actual_asalan_cor_kg: r.actualAsalanKg,
        selected_stapel_id: r.selectedStapelId,
        selected_stapel_name: r.selectedStapelName
      }));

    if (itemsToSave.length === 0) {
      alert('Tidak ada permintaan kirim DO atau rencana cor yang perlu diterbitkan.');
      return;
    }

    const saved = saveFinishedGoodsPlan({
      plan_date: selectedDate,
      status: 'APPROVED',
      items: itemsToSave,
      total_target_do_kg: summary.totalTargetDO,
      total_stock_fg_kg: summary.totalStockFG,
      total_deficit_kg: summary.totalDeficit,
      total_min_cor_kg: summary.totalMinCor,
      total_actual_cor_kg: summary.totalActualCor,
      notes: `Rencana Cor & Pemenuhan DO tgl ${selectedDate}. Diterbitkan dari Gudang Barang Jadi.`
    });

    alert(`✅ BERHASIL! Rencana Cor Minimal & Perintah Produksi sebesar ${summary.totalActualCor.toLocaleString('id-ID')} KG Asalan telah diterbitkan ke bagian Cor (Admin 2).`);
    setActiveTab('RIWAYAT');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#0f3e2e] text-white p-6 rounded-3xl shadow-xl border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_WORKSTATIONS'); }}
            className="p-2.5 bg-[#08251b] rounded-2xl hover:bg-emerald-900 transition text-emerald-300"
            title="Kembali ke Stasiun Kerja"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <Warehouse className="w-5 h-5 text-amber-400" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">POS GUDANG BARANG JADI (BUFFER STOCK)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Kalkulator Pemenuhan DO &amp; Rencana Cor Minimal
            </h1>
            <p className="text-xs text-emerald-200/80 mt-1">
              Jembatan antara Rencana Kiriman (DO) dengan Mesin Cor: Mengecek stok siap kirim, menghitung kekurangan, dan menentukan batas minimal cor asalan.
            </p>
          </div>
        </div>

        {/* Date Selector & Action */}
        <div className="flex items-center space-x-3 bg-[#08251b] p-3 rounded-2xl border border-emerald-700/60">
          <Clock className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-300 font-bold uppercase">Tanggal Operasional:</div>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-extrabold text-white outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 bg-[#1e1e2a] p-1.5 rounded-2xl border border-[#70707d]/20">
        <button
          onClick={() => setActiveTab('KALKULATOR')}
          className={`flex-1 py-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-2 ${
            activeTab === 'KALKULATOR'
              ? 'bg-[#10b981] text-[#0f3e2e] shadow-md'
              : 'text-[#c3c3cc] hover:text-white hover:bg-[#272735]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. KALKULATOR PEMENUHAN DO &amp; RENCANA COR</span>
        </button>

        <button
          onClick={() => setActiveTab('RIWAYAT')}
          className={`flex-1 py-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-2 ${
            activeTab === 'RIWAYAT'
              ? 'bg-[#10b981] text-[#0f3e2e] shadow-md'
              : 'text-[#c3c3cc] hover:text-white hover:bg-[#272735]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>2. RIWAYAT PERINTAH COR ({finishedGoodsPlans.length} Rencana)</span>
        </button>
      </div>

      {activeTab === 'KALKULATOR' ? (
        <>
          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Permintaan DO */}
            <div className="bg-[#1e1e2a] border border-[#70707d]/20 rounded-2xl p-5 space-y-1">
              <div className="flex items-center justify-between text-xs text-[#c3c3cc] font-bold">
                <span>1. PERMINTAAN KIRIM (DO)</span>
                <Truck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold text-blue-400">
                {(summary.totalTargetDO / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-300">Ton</span>
              </div>
              <div className="text-[11px] text-[#c3c3cc]">
                Total: {summary.totalTargetDO.toLocaleString('id-ID')} KG ({targetDOs.length} Dokumen DO)
              </div>
            </div>

            {/* Card 2: Stok Beras Jadi Tersedia */}
            <div className="bg-[#1e1e2a] border border-[#70707d]/20 rounded-2xl p-5 space-y-1">
              <div className="flex items-center justify-between text-xs text-[#c3c3cc] font-bold">
                <span>2. STOK JADI DI GUDANG</span>
                <Warehouse className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400">
                {(summary.totalStockFG / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-300">Ton</span>
              </div>
              <div className="text-[11px] text-[#c3c3cc]">
                Buffer siap kirim di lantai gudang
              </div>
            </div>

            {/* Card 3: Rencana Cor Minimal (Floor Limit) */}
            <div className="bg-[#1e1e2a] border-2 border-amber-500/40 rounded-2xl p-5 space-y-1 bg-amber-500/5">
              <div className="flex items-center justify-between text-xs text-amber-300 font-extrabold">
                <span>3. BATAS MINIMAL COR ASALAN</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-amber-400">
                {(summary.totalMinCor / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-300">Ton</span>
              </div>
              <div className="text-[11px] text-amber-300/80 font-bold">
                🔒 TIDAK BISA DIKURANGI (Wajib Kejar DO)
              </div>
            </div>

            {/* Card 4: Realisasi Cor Lapangan */}
            <div className="bg-[#1e1e2a] border-2 border-purple-500/40 rounded-2xl p-5 space-y-1 bg-purple-500/5">
              <div className="flex items-center justify-between text-xs text-purple-300 font-extrabold">
                <span>4. REALISASI COR LAPANGAN</span>
                <Flame className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-purple-300">
                {(summary.totalActualCor / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-300">Ton</span>
              </div>
              <div className="text-[11px] text-purple-300/80 font-bold">
                ⚡ BEBAS DINAIKKAN (Sisa Jadi Stok)
              </div>
            </div>
          </div>

          {/* Validation Warning Notice if actual < min */}
          {summary.hasValidationViolation && (
            <div className="bg-rose-950/80 border-2 border-rose-500 p-4 rounded-2xl flex items-center space-x-3 text-rose-200">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold text-sm block text-rose-300">PERINGATAN VALIDASI ATURAN PABRIK:</span>
                Ada produk yang Realisasi Cor-nya diisi <strong>di bawah batas minimal cor</strong>. Truk kiriman tidak akan cukup muatan jika cor dikurangi. Silakan naikkan angka Realisasi Cor minimal sama dengan batas minimal!
              </div>
            </div>
          )}

          {/* Main Calculation Table */}
          <div className="bg-[#1e1e2a] border border-[#70707d]/20 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#70707d]/20 pb-4">
              <div>
                <h3 className="font-extrabold text-white text-lg flex items-center space-x-2">
                  <span>Matriks Alokasi &amp; Penentuan Cor Minimal per Varian Beras</span>
                </h3>
                <p className="text-xs text-[#c3c3cc]">
                  Sistem otomatis menghitung Kekurangan = DO - Stok Jadi. Batas Minimal Cor dihitung dari (Kekurangan / Rendemen).
                </p>
              </div>
              <div className="text-xs font-mono bg-[#272735] px-3 py-1.5 rounded-xl border border-[#70707d]/30 text-emerald-400 font-bold">
                Estimasi Rendemen Poles Standar: 67%
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#272735] text-[#c3c3cc] font-mono text-[11px] border-b border-[#70707d]/30">
                    <th className="p-3">PRODUK &amp; KEMASAN</th>
                    <th className="p-3 text-right">TARGET DO</th>
                    <th className="p-3 text-right">STOK GUDANG JADI</th>
                    <th className="p-3 text-right">KEKURANGAN BERAS</th>
                    <th className="p-3 text-center">RENDEMEN</th>
                    <th className="p-3 text-right bg-amber-950/40 text-amber-300 font-bold border-x border-amber-800/40">
                      MINIMAL COR ASALAN
                    </th>
                    <th className="p-3 text-center bg-purple-950/40 text-purple-300 font-bold border-r border-purple-800/40">
                      REALISASI COR MANDOR
                    </th>
                    <th className="p-3">SUMBER STAPEL ASALAN</th>
                    <th className="p-3 text-right">SISA BUFFER SETELAH KIRIM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#70707d]/20 font-medium">
                  {planRows.map(row => {
                    return (
                      <tr key={row.product.id} className="hover:bg-[#252535] transition">
                        {/* Produk & Kemasan */}
                        <td className="p-3">
                          <div className="font-extrabold text-white text-sm">{row.product.name}</div>
                          <div className="text-[10px] text-[#c3c3cc] flex items-center space-x-2 mt-0.5">
                            <span className="font-mono bg-[#272735] px-1.5 py-0.5 rounded text-amber-300">{row.product.code}</span>
                            <span>Kemasan: {row.product.packaging_config || '@50kg'}</span>
                            {row.doCount > 0 && (
                              <span className="bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded font-bold font-mono">
                                {row.doCount} Pesanan DO
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Target DO */}
                        <td className="p-3 text-right font-extrabold text-blue-400 text-sm">
                          {row.targetDoKg.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-400">KG</span>
                        </td>

                        {/* Stok Barang Jadi */}
                        <td className="p-3 text-right font-extrabold text-emerald-400 text-sm">
                          {row.stockFgKg.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-400">KG</span>
                        </td>

                        {/* Kekurangan Bersih */}
                        <td className="p-3 text-right font-extrabold text-sm">
                          {row.deficitKg > 0 ? (
                            <span className="text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/50">
                              Kurang {row.deficitKg.toLocaleString('id-ID')} KG
                            </span>
                          ) : (
                            <span className="text-emerald-400 flex items-center justify-end space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Stok Cukup</span>
                            </span>
                          )}
                        </td>

                        {/* Rendemen Input */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <input 
                              type="number"
                              min={50}
                              max={90}
                              value={row.estYieldPct}
                              onChange={(e) => handleUpdateRow(row.product.id, 'estYieldPct', Number(e.target.value) || 67)}
                              className="w-14 p-1.5 rounded-lg bg-[#272735] border border-[#70707d]/40 text-center font-bold text-white outline-none focus:border-emerald-500"
                            />
                            <span className="text-slate-400 text-[11px]">%</span>
                          </div>
                        </td>

                        {/* Minimal Cor Asalan (Kunci Batas Bawah) */}
                        <td className="p-3 text-right font-extrabold text-amber-300 text-sm bg-amber-950/20 border-x border-amber-800/30">
                          {row.minAsalanCorKg.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-amber-400/70">KG</span>
                        </td>

                        {/* Realisasi Cor Mandor (Bisa Dinaikkan) */}
                        <td className={`p-3 text-center bg-purple-950/20 border-r border-purple-800/30 ${row.isActualBelowMin ? 'bg-rose-950/40 ring-2 ring-rose-500' : ''}`}>
                          <div className="space-y-1">
                            <input 
                              type="number"
                              min={row.minAsalanCorKg}
                              step={500}
                              value={row.actualAsalanKg}
                              onChange={(e) => handleUpdateRow(row.product.id, 'actualAsalanKg', Number(e.target.value) || 0)}
                              className={`w-28 p-2 rounded-xl text-center font-extrabold text-sm outline-none transition ${
                                row.isActualBelowMin 
                                  ? 'bg-rose-900 text-white border-2 border-rose-400' 
                                  : 'bg-[#272735] text-purple-200 border border-purple-500/50 focus:border-purple-400'
                              }`}
                            />
                            <div className="text-[10px] font-bold">
                              {row.isActualBelowMin ? (
                                <span className="text-rose-400 font-extrabold block">Kurang {row.minAsalanCorKg - row.actualAsalanKg} KG!</span>
                              ) : row.actualAsalanKg > row.minAsalanCorKg ? (
                                <span className="text-emerald-400 font-bold block">+{(row.actualAsalanKg - row.minAsalanCorKg).toLocaleString('id-ID')} KG Surplus Cor</span>
                              ) : (
                                <span className="text-slate-400 block">Pas Target Minimal</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Sumber Stapel Asalan */}
                        <td className="p-3">
                          <select
                            value={row.selectedStapelId}
                            onChange={(e) => handleUpdateRow(row.product.id, 'selectedStapelId', e.target.value)}
                            className="w-full p-2 rounded-xl bg-[#272735] border border-[#70707d]/40 text-xs font-bold text-white outline-none focus:border-emerald-500"
                          >
                            {stapelPiles.map(stapel => (
                              <option key={stapel.id} value={stapel.id}>
                                {stapel.name} (Sisa: {stapel.stock_kg.toLocaleString('id-ID')} KG)
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Sisa Buffer Setelah Kirim */}
                        <td className="p-3 text-right font-extrabold text-sm text-emerald-300">
                          +{row.surplusFgAfterCor.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-400">KG</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Execution Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#70707d]/20 bg-[#272735] p-5 rounded-2xl">
              <div className="space-y-1">
                <div className="text-xs text-[#c3c3cc]">
                  Total Asalan yang Dikeluarkan untuk Dicor Hari Ini:
                </div>
                <div className="text-2xl font-extrabold text-white flex items-center space-x-2">
                  <Flame className="w-6 h-6 text-amber-400" />
                  <span>{summary.totalActualCor.toLocaleString('id-ID')} KG Beras Asalan</span>
                  <span className="text-xs text-emerald-400 font-normal">
                    (Menghasilkan estimasi ~{Math.round(summary.totalActualCor * 0.67).toLocaleString('id-ID')} KG Beras Jadi)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSaveAndDispatch}
                  disabled={summary.hasValidationViolation || summary.totalActualCor <= 0}
                  className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-xl transition flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>TERBITKAN RENCANA COR KE MANDOR (ADMIN 2)</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Tab Riwayat */
        <div className="bg-[#1e1e2a] border border-[#70707d]/20 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#70707d]/20 pb-3">
            <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
              <History className="w-5 h-5 text-emerald-400" />
              <span>Daftar Perintah &amp; Rencana Cor yang Pernah Diterbitkan</span>
            </h3>
            <span className="text-xs font-mono text-[#c3c3cc]">
              Total {finishedGoodsPlans.length} Rencana
            </span>
          </div>

          <div className="space-y-3">
            {finishedGoodsPlans.length === 0 ? (
              <div className="p-8 text-center text-[#70707d] text-xs">
                Belum ada rencana cor yang diterbitkan dari modul Gudang Barang Jadi.
              </div>
            ) : (
              finishedGoodsPlans.map(plan => (
                <div 
                  key={plan.id}
                  className="bg-[#272735] p-5 rounded-2xl border border-[#70707d]/30 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#70707d]/20 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-white text-base">Plan: {plan.plan_date}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          plan.status === 'PROCESSED' 
                            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' 
                            : 'bg-amber-900/60 text-amber-300 border border-amber-500/40'
                        }`}>
                          {plan.status === 'PROCESSED' ? 'SUDAH DICOR & MASUK STOK' : 'MENUNGGU PROSES COR'}
                        </span>
                      </div>
                      <p className="text-xs text-[#c3c3cc] mt-0.5">{plan.notes}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {plan.status !== 'PROCESSED' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Konfirmasi eksekusi cor selesai untuk tanggal ${plan.plan_date}? Stok bahan asalan akan dipotong dan stok beras jadi akan bertambah.`)) {
                              executeFinishedGoodsCorPlan(plan.id);
                            }
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Konfirmasi Cor Selesai (Update Stok)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-[#1e1e2a] p-2.5 rounded-xl border border-[#70707d]/20">
                      <span className="text-[10px] text-slate-400 block font-mono">TARGET DO</span>
                      <span className="font-extrabold text-blue-400 text-sm">{(plan.total_target_do_kg || 0).toLocaleString('id-ID')} KG</span>
                    </div>

                    <div className="bg-[#1e1e2a] p-2.5 rounded-xl border border-[#70707d]/20">
                      <span className="text-[10px] text-slate-400 block font-mono">KEKURANGAN</span>
                      <span className="font-extrabold text-rose-400 text-sm">{(plan.total_deficit_kg || 0).toLocaleString('id-ID')} KG</span>
                    </div>

                    <div className="bg-[#1e1e2a] p-2.5 rounded-xl border border-[#70707d]/20">
                      <span className="text-[10px] text-slate-400 block font-mono">MINIMAL COR</span>
                      <span className="font-extrabold text-amber-400 text-sm">{(plan.total_min_cor_kg || 0).toLocaleString('id-ID')} KG</span>
                    </div>

                    <div className="bg-[#1e1e2a] p-2.5 rounded-xl border border-[#70707d]/20">
                      <span className="text-[10px] text-slate-400 block font-mono">REALISASI COR ASALAN</span>
                      <span className="font-extrabold text-purple-300 text-sm">{(plan.total_actual_cor_kg || 0).toLocaleString('id-ID')} KG</span>
                    </div>
                  </div>

                  {/* Rincian Items */}
                  <div className="space-y-1.5 pt-2">
                    <div className="text-[11px] font-bold text-slate-300">Rincian per Varian:</div>
                    {plan.items.map((it, idx) => (
                      <div key={idx} className="bg-[#1e1e2a] p-2.5 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#ededf3]">
                        <div>
                          <strong>{it.product_name}</strong>
                          <span className="text-slate-400 ml-2">Sumber: {it.selected_stapel_name}</span>
                        </div>
                        <div className="font-mono text-right">
                          <span className="text-blue-400 mr-3">DO: {it.target_do_kg.toLocaleString('id-ID')} KG</span>
                          <span className="text-amber-400 mr-3">Min Cor: {it.min_asalan_cor_kg.toLocaleString('id-ID')} KG</span>
                          <span className="text-purple-300 font-bold">Cor: {it.actual_asalan_cor_kg.toLocaleString('id-ID')} KG</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
