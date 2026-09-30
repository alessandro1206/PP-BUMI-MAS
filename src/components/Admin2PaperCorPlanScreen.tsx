import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, ArrowLeft, Smartphone, CheckCircle2 } from 'lucide-react';

export const Admin2PaperCorPlanScreen: React.FC = () => {
  const { createCorBatch, stapelPiles, setRole, setActiveScreen } = useApp();

  const [paperNoteText, setPaperNoteText] = useState<string>(
    'Pagi ini cor beras super:\n- Tumpukan A = 3 Bagian (15.000 KG)\n- Tumpukan V.P = 1 Bagian (5.000 KG)\nCatatan Mandor: Giling untuk Cap Putri Thailand @50'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCorBatch({
      batch_date: new Date().toISOString().split('T')[0],
      target_product_name: 'Cap Putri Thailand 50KG',
      total_target_kg: 20000,
      notes: paperNoteText,
      items: [
        { id: 'p-1', stapel_pile_name: 'Tumpukan A (Beras Super)', ratio_parts: 3, required_kg: 15000, remaining_stock_kg: 30000 },
        { id: 'p-2', stapel_pile_name: 'Tumpukan V.P (Medium Plus)', ratio_parts: 1, required_kg: 5000, remaining_stock_kg: 27000 }
      ]
    });

    alert('Catatan Kertas Cor Lapangan Berhasil Disimpan!');
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
              Catatan Kertas Cor Lapangan <span className="text-[10px] bg-amber-400 text-[#0f3e2e] px-1.5 py-0.5 rounded font-mono">SCREEN_39</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-md border-2 border-slate-200 space-y-5">
        <div>
          <label className="block text-xs font-extrabold text-slate-800 mb-1">
            Salin Catatan Kertas Cor Mandor:
          </label>
          <textarea
            rows={6}
            value={paperNoteText}
            onChange={(e) => setPaperNoteText(e.target.value)}
            className="w-full px-3 py-3 bg-amber-50/50 border-2 border-amber-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#10b981]"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#0f3e2e] hover:bg-emerald-900 text-white font-extrabold text-base rounded-xl shadow-lg flex items-center justify-center space-x-2"
        >
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span>SIMPAN DARI CATATAN KERTAS</span>
        </button>
      </form>
    </div>
  );
};
