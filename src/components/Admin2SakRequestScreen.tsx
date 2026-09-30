import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PackageCheck, ArrowLeft, Smartphone, Package, Calculator } from 'lucide-react';

// Helper: parse packaging config to get inner weight and outer weight
function parsePackaging(config: string): { innerWeightKg: number; outerWeightKg: number; hasInner: boolean } {
  if (config === '@(25x1)') return { innerWeightKg: 1, outerWeightKg: 25, hasInner: true };
  if (config === '@(5x5)') return { innerWeightKg: 5, outerWeightKg: 25, hasInner: true };
  if (config === '@(5x10)') return { innerWeightKg: 10, outerWeightKg: 50, hasInner: true };
  if (config === '@(1x25)' || config === '@(1x20)') return { innerWeightKg: parseFloat(config.replace('@(1x','').replace(')','')) || 25, outerWeightKg: parseFloat(config.replace('@(1x','').replace(')','')) || 25, hasInner: false };
  if (config === '@(1x50)') return { innerWeightKg: 50, outerWeightKg: 50, hasInner: false };
  return { innerWeightKg: 50, outerWeightKg: 50, hasInner: false };
}

export const Admin2SakRequestScreen: React.FC = () => {
  const { deliveryOrders, products, setActiveScreen } = useApp();

  const today = new Date().toISOString().split('T')[0];

  // Filter DOs for today
  const todayDOs = deliveryOrders.filter(d =>
    d.delivery_date === today || !d.delivery_date
  );

  // Calculate sak needs from all today's DOs
  const sakNeeds = useMemo(() => {
    const innerMap: Record<string, { name: string; kg: number; count: number; weightEach: number }> = {};
    let blongsong25 = 0;
    let blongsong50 = 0;

    todayDOs.forEach(doItem => {
      if (!doItem.items) return;
      doItem.items.forEach(item => {
        const totalKg = item.total_kg || (item.qty * item.weight_per_unit_kg);
        // Find matching product for packaging config
        const product = products.find(p =>
          item.product_name.toLowerCase().includes(p.name.toLowerCase().substring(0, 8)) ||
          (p.packaging_config && item.product_name.includes(p.packaging_config.replace('(','').replace(')','').replace('@','')))
        );
        const pkgConfig = product?.packaging_config || '';
        const parsed = parsePackaging(pkgConfig);

        // Outer sak (blongsong)
        if (parsed.outerWeightKg === 25) {
          blongsong25 += Math.ceil(totalKg / 25);
        } else {
          blongsong50 += Math.ceil(totalKg / 50);
        }

        // Inner bag
        if (parsed.hasInner && parsed.innerWeightKg > 0) {
          const innerKey = pkgConfig + '_' + parsed.innerWeightKg;
          if (!innerMap[innerKey]) {
            innerMap[innerKey] = { name: item.product_name.split(' ').slice(0,4).join(' ') + ' @' + parsed.innerWeightKg + 'kg', kg: 0, count: 0, weightEach: parsed.innerWeightKg };
          }
          innerMap[innerKey].kg += totalKg;
          innerMap[innerKey].count += Math.ceil(totalKg / parsed.innerWeightKg);
        }
      });
    });

    return { innerMap, blongsong25, blongsong50 };
  }, [todayDOs, products]);

  const totalSak25 = sakNeeds.blongsong25;
  const totalSak50 = sakNeeds.blongsong50;
  const innerItems = Object.values(sakNeeds.innerMap);

  return (
    <div className='max-w-lg mx-auto px-4 py-6 space-y-5'>
      {/* Mobile Top Header */}
      <div className='bg-[#0f3e2e] text-white p-5 rounded-2xl shadow-lg border border-emerald-800'>
        <div className='flex items-center space-x-3'>
          <button onClick={() => setActiveScreen('SCREEN_42')} className='p-2 bg-[#08251b] rounded-xl text-emerald-300'>
            <ArrowLeft className='w-5 h-5' />
          </button>
          <div>
            <div className='flex items-center space-x-1.5'>
              <Smartphone className='w-4 h-4 text-amber-400' />
              <span className='text-[10px] uppercase font-bold text-emerald-300'>Admin 2 - HP Checker</span>
            </div>
            <h1 className='text-lg font-extrabold text-white'>Kebutuhan Sak Hari Ini</h1>
          </div>
        </div>
      </div>

      {/* Admin 2 Mobile Tabs Bar */}
      <div className='grid grid-cols-5 gap-1 p-1.5 bg-slate-200 rounded-xl font-bold text-[10px] text-center'>
        <button onClick={() => setActiveScreen('SCREEN_42')} className='py-2 bg-white text-slate-700 rounded-lg'>Cor Beras</button>
        <button onClick={() => setActiveScreen('SCREEN_8')} className='py-2 bg-[#0f3e2e] text-white rounded-lg shadow'>Minta Sak</button>
        <button onClick={() => setActiveScreen('SCREEN_SAK_STOCK')} className='py-2 bg-white text-slate-700 rounded-lg'>Stok Sak</button>
        <button onClick={() => setActiveScreen('SCREEN_36')} className='py-2 bg-white text-slate-700 rounded-lg'>Opname</button>
        <button onClick={() => setActiveScreen('SCREEN_24')} className='py-2 bg-white text-slate-700 rounded-lg'>Tally</button>
      </div>

      {/* Auto-Kalkulasi dari DO Hari Ini */}
      <div className='bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 space-y-2'>
        <div className='flex items-center space-x-2'>
          <Calculator className='w-4 h-4 text-blue-600' />
          <span className='text-xs font-extrabold text-blue-800'>Kebutuhan Sak Otomatis dari DO Hari Ini ({today})</span>
        </div>
        {todayDOs.length === 0 ? (
          <p className='text-xs text-blue-600 italic'>Belum ada DO untuk hari ini. Tanggal pengiriman DO mungkin berbeda.</p>
        ) : (
          <p className='text-[10px] text-blue-600'>{todayDOs.length} DO aktif hari ini, dihitung otomatis.</p>
        )}
      </div>

      {/* Sak Blongsong / Karung Luar */}
      <div className='bg-white rounded-2xl p-5 border-2 border-slate-200 space-y-3'>
        <h2 className='text-sm font-extrabold text-slate-800 flex items-center space-x-2'>
          <Package className='w-4 h-4 text-[#0f3e2e]' />
          <span>Karung Blongsong (Outer Sak)</span>
        </h2>
        <p className='text-[10px] text-slate-500'>Hanya 2 jenis: @25KG dan @50KG</p>

        <div className='grid grid-cols-2 gap-3'>
          <div className='bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-center'>
            <div className='text-[10px] font-bold text-emerald-700 uppercase mb-1'>Blongsong @25 KG</div>
            <div className='text-4xl font-extrabold text-[#0f3e2e]'>{totalSak25.toLocaleString('id-ID')}</div>
            <div className='text-[10px] text-slate-500 font-bold mt-1'>lembar</div>
            <div className='text-[10px] text-slate-400 mt-1'>Untuk @(25x1) + @(5x5)</div>
          </div>
          <div className='bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center'>
            <div className='text-[10px] font-bold text-amber-700 uppercase mb-1'>Blongsong @50 KG</div>
            <div className='text-4xl font-extrabold text-amber-800'>{totalSak50.toLocaleString('id-ID')}</div>
            <div className='text-[10px] text-slate-500 font-bold mt-1'>lembar</div>
            <div className='text-[10px] text-slate-400 mt-1'>Untuk @(5x10)</div>
          </div>
        </div>
      </div>

      {/* Inner Bags */}
      {innerItems.length > 0 && (
        <div className='bg-white rounded-2xl p-5 border-2 border-slate-200 space-y-3'>
          <h2 className='text-sm font-extrabold text-slate-800'>Kantong Kecil (Inner Bag)</h2>
          <div className='space-y-2'>
            {innerItems.map((it, i) => (
              <div key={i} className='bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center'>
                <div>
                  <div className='text-xs font-extrabold text-slate-900'>{it.name}</div>
                  <div className='text-[10px] text-slate-500'>Total berat: {it.kg.toLocaleString('id-ID')} KG</div>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-extrabold text-[#0f3e2e]'>{it.count.toLocaleString('id-ID')}</div>
                  <div className='text-[10px] text-slate-500'>lembar</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail per DO */}
      {todayDOs.length > 0 && (
        <div className='bg-white rounded-2xl p-4 border border-slate-200 space-y-3'>
          <h3 className='text-xs font-extrabold text-slate-700'>Detail DO Hari Ini</h3>
          {todayDOs.map(d => (
            <div key={d.id} className='bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] space-y-1'>
              <div className='font-extrabold text-slate-900'>{d.do_number} - {d.customer_name}</div>
              {d.items && d.items.map((it, i) => (
                <div key={i} className='text-slate-600 pl-2'>
                  {it.product_name} — {it.qty} ZAK ({it.total_kg?.toLocaleString('id-ID')} KG)
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


