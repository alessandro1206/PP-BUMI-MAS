import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Smartphone, Truck, Package, CheckCircle2, ClipboardList, AlertTriangle } from 'lucide-react';

function parsePackagingForSak(config: string): { innerWeightKg: number; outerWeightKg: number; hasInner: boolean } {
  if (config === '@(25x1)') return { innerWeightKg: 1, outerWeightKg: 25, hasInner: true };
  if (config === '@(5x5)')  return { innerWeightKg: 5, outerWeightKg: 25, hasInner: true };
  if (config === '@(5x10)') return { innerWeightKg: 10, outerWeightKg: 50, hasInner: true };
  const m = config.match(/@\(1x(\d+)\)/);
  if (m) return { innerWeightKg: parseInt(m[1]), outerWeightKg: parseInt(m[1]), hasInner: false };
  return { innerWeightKg: 50, outerWeightKg: 50, hasInner: false };
}

export const Admin2CorPlanScreen: React.FC = () => {
  const { deliveryOrders, products, sakItems, stapelPiles, setActiveScreen } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const todayDOs = deliveryOrders.filter(d => d.delivery_date === today || !d.delivery_date);

  // Cross-check input (optional)
  const [actualZak, setActualZak] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);

  // Target cor per grade
  const targets = useMemo(() => {
    const g: Record<string, number> = { A: 0, B: 0, C: 0 };
    let totalKg = 0;
    todayDOs.forEach(d => {
      (d.items || []).forEach(item => {
        const prod = products.find(p =>
          item.product_name.toLowerCase().includes(p.name.toLowerCase().substring(0, 6))
        );
        const grade = prod?.quality_grade || 'B';
        const kg = item.total_kg || 0;
        g[grade] = (g[grade] || 0) + kg;
        totalKg += kg;
      });
    });
    return { ...g, total: totalKg };
  }, [todayDOs, products]);

  // Kebutuhan sak auto-calculated
  const sakNeeds = useMemo(() => {
    const innerMap: Record<string, { name: string; count: number; weightEach: number }> = {};
    let blongsong25 = 0, blongsong50 = 0;
    todayDOs.forEach(d => {
      (d.items || []).forEach(item => {
        const kg = item.total_kg || 0;
        const prod = products.find(p =>
          item.product_name.toLowerCase().includes(p.name.toLowerCase().substring(0, 6))
        );
        const config = prod?.packaging_config || '';
        const parsed = parsePackagingForSak(config);
        if (parsed.outerWeightKg === 25) blongsong25 += Math.ceil(kg / 25);
        else blongsong50 += Math.ceil(kg / 50);
        if (parsed.hasInner) {
          const key = config;
          if (!innerMap[key]) {
            innerMap[key] = { name: item.product_name.split(' ').slice(0, 3).join(' ') + ' @' + parsed.innerWeightKg + 'kg', count: 0, weightEach: parsed.innerWeightKg };
          }
          innerMap[key].count += Math.ceil(kg / parsed.innerWeightKg);
        }
      });
    });
    return { blongsong25, blongsong50, innerItems: Object.values(innerMap) };
  }, [todayDOs, products]);

  const totalAktual = actualZak ? parseInt(actualZak) : 0;
  const targetZak = targets.total > 0 ? Math.ceil(targets.total / (products[0]?.weight_per_unit || 50)) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="bg-[#0f3e2e] text-white p-5 rounded-2xl shadow-lg border border-emerald-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => setActiveScreen('SCREEN_5')} className="p-2 bg-[#08251b] rounded-xl text-emerald-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] uppercase font-bold text-emerald-300">Admin 2 - HP Checker</span>
            </div>
            <h1 className="text-lg font-extrabold text-white">Dashboard Cor Beras</h1>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-emerald-300 font-bold">{today}</div>
          <div className="text-xs font-extrabold text-amber-400">{todayDOs.length} DO Hari Ini</div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="grid grid-cols-5 gap-1 p-1.5 bg-slate-200 rounded-xl font-bold text-[10px] text-center">
        <button onClick={() => setActiveScreen('SCREEN_42')} className="py-2 bg-[#0f3e2e] text-white rounded-lg shadow">Cor Beras</button>
        <button onClick={() => setActiveScreen('SCREEN_8')} className="py-2 bg-white text-slate-700 rounded-lg">Minta Sak</button>
        <button onClick={() => setActiveScreen('SCREEN_SAK_STOCK')} className="py-2 bg-white text-slate-700 rounded-lg">Stok Sak</button>
        <button onClick={() => setActiveScreen('SCREEN_36')} className="py-2 bg-white text-slate-700 rounded-lg">Opname</button>
        <button onClick={() => setActiveScreen('SCREEN_24')} className="py-2 bg-white text-slate-700 rounded-lg">Tally</button>
      </div>

      {todayDOs.length === 0 ? (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center space-y-2">
          <Truck className="w-10 h-10 mx-auto text-blue-300" />
          <p className="text-sm font-bold text-blue-700">Belum ada DO untuk hari ini</p>
          <p className="text-[11px] text-blue-500">Tunggu Admin 1 membuat Surat Jalan/DO dari kantor.</p>
        </div>
      ) : (
        <>
          {/* CARD 1: Target Produksi Hari Ini */}
          <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-[#0f3e2e] space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <ClipboardList className="w-4 h-4 text-[#0f3e2e]" />
              <h2 className="text-sm font-extrabold text-[#0f3e2e]">Target Produksi Beras Hari Ini</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {targets.A > 0 && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 text-center">
                  <div className="text-[10px] font-extrabold text-emerald-700 uppercase">Beras Grade A</div>
                  <div className="text-2xl font-extrabold text-emerald-800">{(targets.A / 1000).toFixed(1)}</div>
                  <div className="text-[10px] font-bold text-emerald-600">Ton ({targets.A.toLocaleString('id-ID')} KG)</div>
                </div>
              )}
              {targets.B > 0 && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-center">
                  <div className="text-[10px] font-extrabold text-amber-700 uppercase">Beras Grade B</div>
                  <div className="text-2xl font-extrabold text-amber-800">{(targets.B / 1000).toFixed(1)}</div>
                  <div className="text-[10px] font-bold text-amber-600">Ton ({targets.B.toLocaleString('id-ID')} KG)</div>
                </div>
              )}
              {targets.C > 0 && (
                <div className="bg-slate-100 border-2 border-slate-300 rounded-2xl p-3 text-center">
                  <div className="text-[10px] font-extrabold text-slate-600 uppercase">Beras Grade C</div>
                  <div className="text-2xl font-extrabold text-slate-700">{(targets.C / 1000).toFixed(1)}</div>
                  <div className="text-[10px] font-bold text-slate-500">Ton ({targets.C.toLocaleString('id-ID')} KG)</div>
                </div>
              )}
            </div>
            <div className="bg-[#0f3e2e] text-white rounded-xl p-3 flex justify-between items-center">
              <span className="text-xs font-extrabold">TOTAL TARGET COR:</span>
              <span className="text-lg font-extrabold text-amber-400">{targets.total.toLocaleString('id-ID')} KG</span>
            </div>
          </div>

          {/* CARD 2: Rencana Kiriman Per Item */}
          <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-blue-200 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-blue-100">
              <Truck className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-extrabold text-blue-900">Rencana Kiriman Per Item</h2>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {todayDOs.map(doItem => (
                <div key={doItem.id} className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-extrabold text-slate-900">{doItem.do_number} — {doItem.customer_name}</div>
                    <div className="text-sm font-extrabold text-[#0f3e2e]">{doItem.total_kg?.toLocaleString('id-ID')} KG</div>
                  </div>
                  <div className="space-y-1">
                    {(doItem.items || []).map((item, i) => {
                      const prod = products.find(p =>
                        item.product_name.toLowerCase().includes(p.name.toLowerCase().substring(0, 6))
                      );
                      const grade = prod?.quality_grade || '?';
                      const gradeColor = grade === 'A' ? 'bg-emerald-500 text-white' : grade === 'B' ? 'bg-amber-400 text-[#0f3e2e]' : 'bg-slate-400 text-white';
                      return (
                        <div key={i} className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1.5 border border-blue-100 text-[11px]">
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className={`shrink-0 text-[10px] font-extrabold px-1.5 py-0.5 rounded ${gradeColor}`}>{grade}</span>
                            <span className="truncate text-slate-800 font-bold">{item.product_name}</span>
                          </div>
                          <div className="text-right shrink-0 ml-2 space-y-0.5">
                            <div className="font-extrabold text-[#0f3e2e]">{item.qty} ZAK</div>
                            <div className="text-slate-500">{item.total_kg?.toLocaleString('id-ID')} KG</div>
                            {prod?.packaging_config && <div className="text-[10px] text-blue-600 font-bold">{prod.packaging_config}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: Kebutuhan Sak (Info saja) */}
          <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-purple-200 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-purple-100">
              <Package className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-extrabold text-purple-900">Kebutuhan Sak Hari Ini</h2>
              <span className="ml-auto text-[10px] text-purple-500 italic">Otomatis dari DO</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 text-center">
                <div className="text-[10px] font-extrabold text-emerald-700 uppercase mb-1">Blongsong @25 KG</div>
                <div className="text-3xl font-extrabold text-[#0f3e2e]">{sakNeeds.blongsong25.toLocaleString('id-ID')}</div>
                <div className="text-[10px] text-slate-500 font-bold">lembar</div>
                <div className="text-[10px] text-slate-400 mt-1">untuk @25x1 + @5x5</div>
              </div>
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center">
                <div className="text-[10px] font-extrabold text-amber-700 uppercase mb-1">Blongsong @50 KG</div>
                <div className="text-3xl font-extrabold text-amber-800">{sakNeeds.blongsong50.toLocaleString('id-ID')}</div>
                <div className="text-[10px] text-slate-500 font-bold">lembar</div>
                <div className="text-[10px] text-slate-400 mt-1">untuk @5x10</div>
              </div>
            </div>
            {sakNeeds.innerItems.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-slate-600 uppercase">Kantong Kecil (Inner Bag):</div>
                {sakNeeds.innerItems.map((it, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700">{it.name}</span>
                    <span className="font-extrabold text-[#0f3e2e]">{it.count.toLocaleString('id-ID')} lbr</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CARD 4: Cross-Check Aktual (Opsional) */}
          <div className={`bg-white rounded-2xl p-5 shadow-md border-2 space-y-3 ${confirmed ? 'border-emerald-400' : 'border-slate-200'}`}>
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <CheckCircle2 className={`w-4 h-4 ${confirmed ? 'text-emerald-500' : 'text-slate-400'}`} />
              <h2 className="text-sm font-extrabold text-slate-700">Cross-Check Aktual (Opsional)</h2>
            </div>
            <div className="text-[11px] text-slate-500">Isi hanya untuk crosscek. Bisa dikosongkan.</div>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Jumlah ZAK Aktual Selesai Cor:</label>
                <input
                  type="number"
                  value={actualZak}
                  onChange={e => setActualZak(e.target.value)}
                  placeholder="Contoh: 850"
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-xl text-xl font-extrabold text-[#0f3e2e] text-center"
                />
              </div>
              {actualZak && (
                <div className={`text-center px-3 py-2 rounded-xl border-2 ${totalAktual >= targetZak ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                  <div className="text-[10px] font-bold">{totalAktual >= targetZak ? 'Target' : 'Kurang'}</div>
                  <div className="text-lg font-extrabold">{totalAktual >= targetZak ? 'Tercapai' : (targetZak - totalAktual) + ' ZAK'}</div>
                </div>
              )}
            </div>
            <button
              onClick={() => setConfirmed(true)}
              disabled={confirmed}
              className={`w-full py-3 font-extrabold text-sm rounded-xl flex items-center justify-center space-x-2 ${confirmed ? 'bg-emerald-500 text-white' : 'bg-[#0f3e2e] text-white hover:bg-emerald-900'}`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{confirmed ? 'Cor Hari Ini Sudah Dikonfirmasi' : 'Konfirmasi Cor Selesai'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
