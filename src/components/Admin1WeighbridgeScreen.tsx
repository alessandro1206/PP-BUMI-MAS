import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scale, Printer, Plus, RefreshCw, CheckCircle2, Truck, ArrowLeft, Cpu, FileText, Layers, Trash2, ArrowRight, Camera } from 'lucide-react';
import { StapelAllocationItem } from '../types';

export const Admin1WeighbridgeScreen: React.FC = () => {
  const { 
    weighbridgeInList, 
    addWeighbridgeIn, 
    updateTareAndFinishWeighbridge, 
    suppliers, 
    addSupplier, 
    stapelPiles, 
    addStapelPile, 
    setRole, 
    setActiveScreen,
    loadSampleMasterData
  } = useApp();

  // COM Port RS232 State (Default DISCONNECTED)
  const [comPortConnected, setComPortConnected] = useState<boolean>(false);
  const [isSimulatedCom, setIsSimulatedCom] = useState<boolean>(false);
  const [liveComWeight, setLiveComWeight] = useState<number>(0);
  const [serialPortObj, setSerialPortObj] = useState<any | null>(null);

  // CCTV OCR Scanner State
  const [isScanningCctv, setIsScanningCctv] = useState<boolean>(false);
  const [cctvError, setCctvError] = useState<string | null>(null);

  const handleScanNopolCctv = async () => {
    setIsScanningCctv(true);
    setCctvError(null);
    try {
      const response = await fetch('http://localhost:5000/scan-nopol', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.nopol) {
        setNopol(data.nopol.toUpperCase());
        setCctvError(null);
      } else if (data.nopol) {
        setNopol(data.nopol.toUpperCase());
        setCctvError(null);
      } else {
        const errorText = data.message || 'Teks Nopol tidak terdeteksi dari stream foto CCTV.';
        setCctvError(errorText);
        alert(`Gagal Scan CCTV: ${errorText}`);
      }
    } catch (err: any) {
      console.error('CCTV Scan Error:', err);
      const msg = 'Gagal terhubung ke CCTV server lokal di http://localhost:5000/scan-nopol. Pastikan skrip server_cctv.py sudah dijalankan.';
      setCctvError(msg);
      alert(msg);
    } finally {
      setIsScanningCctv(false);
    }
  };

  // Weighing Mode: 'MASUK' (Bruto) or 'KELUAR' (Tara)
  const [weighMode, setWeighMode] = useState<'MASUK' | 'KELUAR'>('MASUK');
  const [selectedTruckForTare, setSelectedTruckForTare] = useState<any | null>(null);

  // Form State - Truk Masuk (Bruto)
  const [nopol, setNopol] = useState<string>('');
  const [supplierId, setSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [grossWeight, setGrossWeight] = useState<number>(0);

  // Form State - Truk Keluar (Tara)
  const [tareWeightInput, setTareWeightInput] = useState<number>(0);

  // Auto select first supplier if suppliers loaded dynamically
  React.useEffect(() => {
    if (!supplierId && suppliers.length > 0) {
      setSupplierId(suppliers[0].id);
    }
  }, [suppliers, supplierId]);

  // Unloading Allocation State (Multi-Stapel / Direct Cor)
  const [allocations, setAllocations] = useState<StapelAllocationItem[]>([
    { stapel_id: stapelPiles[0]?.id, stapel_name: stapelPiles[0]?.name || 'Stapel 1', is_direct_cor: false, allocated_kg: 0 }
  ]);

  // Modal State: Tambah Supplier Baru & Tambah Stapel Baru
  const [showAddSupplier, setShowAddSupplier] = useState<boolean>(false);
  const [newSupName, setNewSupName] = useState<string>('');
  const [newSupBank, setNewSupBank] = useState<string>('BCA');
  const [newSupAcc, setNewSupAcc] = useState<string>('');
  const [newSupPhone, setNewSupPhone] = useState<string>('');

  const [showAddStapel, setShowAddStapel] = useState<boolean>(false);
  const [newStapelName, setNewStapelName] = useState<string>('');
  const [newStapelGrade, setNewStapelGrade] = useState<string>('Standar Pabrik');

  // STT Print Preview Modal
  const [printTicket, setPrintTicket] = useState<any | null>(null);

  const handleConnectComPort = async () => {
    if (comPortConnected) {
      if (serialPortObj) {
        try { await serialPortObj.close(); } catch (e) { console.warn(e); }
      }
      setSerialPortObj(null);
      setComPortConnected(false);
      setIsSimulatedCom(false);
      setLiveComWeight(0);
      return;
    }

    // Try Web Serial API if supported by browser
    if ('serial' in navigator) {
      try {
        const port = await (navigator as any).serial.requestPort();
        await port.open({ baudRate: 9600 });
        setSerialPortObj(port);
        setComPortConnected(true);
        setIsSimulatedCom(false);
        alert('✅ Port Serial RS232 Timbangan Berhasil Terhubung! (BaudRate: 9600 Bps)');
        
        // Read serial data stream in background
        readSerialDataStream(port);
        return;
      } catch (err) {
        console.warn('Serial port connection cancelled or failed:', err);
      }
    }

    // Fallback prompt for trial simulation mode
    const enableSim = window.confirm(
      'Kabel Hardware Timbangan RS232 belum terhubung ke komputer/browser ini.\n\nApakah Anda ingin mengaktifkan [Mode Simulasi Uji Coba]?'
    );
    if (enableSim) {
      setComPortConnected(true);
      setIsSimulatedCom(true);
      if (grossWeight === 0) setGrossWeight(24500);
      if (tareWeightInput === 0) setTareWeightInput(8200);
    }
  };

  const readSerialDataStream = async (port: any) => {
    try {
      const textDecoder = new TextDecoderStream();
      port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        if (value) {
          // Extract continuous weight digits (e.g. ST,GS,+024500kg -> 24500)
          const matches = value.match(/\d+/g);
          if (matches && matches.length > 0) {
            const raw = parseInt(matches.join(''), 10);
            if (!isNaN(raw) && raw > 0 && raw < 100000) {
              setLiveComWeight(raw);
            }
          }
        }
      }
    } catch (err) {
      console.error('Serial stream reader error:', err);
    }
  };

  const simulateComRead = (isGross: boolean) => {
    if (!comPortConnected) {
      const opt = window.confirm(
        '⚠️ Kabel Timbangan RS232 Belum Terhubung!\n\n' +
        '• Jika ada kabel hardware timbangan: Klik tombol [Connect RS232] di kanan atas.\n' +
        '• Tanpa hardware: Anda bisa mengetik berat BRUTO/TARA langsung di kotak angka secara manual.\n\n' +
        'Apakah Anda ingin mengaktifkan Mode Simulasi Uji Coba sekarang?'
      );
      if (opt) {
        setComPortConnected(true);
        setIsSimulatedCom(true);
        if (isGross) {
          const val = grossWeight > 0 ? grossWeight : 24500;
          setGrossWeight(val);
          setLiveComWeight(val);
        } else {
          const val = tareWeightInput > 0 ? tareWeightInput : 8200;
          setTareWeightInput(val);
          setLiveComWeight(val);
        }
      }
      return;
    }

    if (!isSimulatedCom && liveComWeight > 0) {
      // Hardware Serial Mode: pull current live scale weight
      if (isGross) {
        setGrossWeight(liveComWeight);
      } else {
        setTareWeightInput(liveComWeight);
      }
    } else if (isSimulatedCom) {
      // Simulation Mode: set clean standard weight if empty, avoid randomizing on every click
      if (isGross) {
        const val = grossWeight > 0 ? grossWeight : 24500;
        setGrossWeight(val);
        setLiveComWeight(val);
      } else {
        const val = tareWeightInput > 0 ? tareWeightInput : 8200;
        setTareWeightInput(val);
        setLiveComWeight(val);
      }
    }
  };

  // Add allocation row (Multi-stapel / Direct Cor)
  const handleAddAllocationRow = () => {
    setAllocations(prev => [
      ...prev,
      { stapel_id: stapelPiles[0]?.id, stapel_name: stapelPiles[0]?.name || 'Stapel 1', is_direct_cor: false, allocated_kg: 0 }
    ]);
  };

  const handleRemoveAllocationRow = (index: number) => {
    if (allocations.length <= 1) return;
    setAllocations(prev => prev.filter((_, i) => i !== index));
  };

  const handleAllocationChange = (index: number, field: string, value: any) => {
    setAllocations(prev => prev.map((item, i) => {
      if (i === index) {
        if (field === 'stapel_id') {
          if (value === 'DIRECT_COR') {
            return { ...item, stapel_id: undefined, stapel_name: 'Langsung Di-COR (Mesin Reprocessing)', is_direct_cor: true };
          }
          const found = stapelPiles.find(s => s.id === value);
          return { ...item, stapel_id: found?.id, stapel_name: found?.name || 'Stapel', is_direct_cor: false };
        }
        if (field === 'allocated_kg') {
          return { ...item, allocated_kg: parseFloat(value) || 0 };
        }
      }
      return item;
    }));
  };

  // Submit Timbang Masuk (Bruto)
  const handleSubmitGross = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nopol.trim()) {
      alert('Mohon isi Nomor Polisi Truk (Nopol)!');
      return;
    }
    const sup = suppliers.find(s => s.id === supplierId);
    if (!sup) return;

    const newTicket = addWeighbridgeIn({
      datetime_in: new Date().toISOString().replace('T', ' ').substring(0, 16),
      nopol: nopol.toUpperCase(),
      supplier_id: sup.id,
      supplier_name: sup.name,
      gross_weight: grossWeight,
      tare_weight: 0,
      bag_deduction: 0,
      net_weight: grossWeight,
      allocations: allocations
    });

    setPrintTicket(newTicket);
    setNopol('');
    setGrossWeight(0);
    setLiveComWeight(0);
  };

  // Submit Timbang Keluar (Tara)
  const handleSubmitTare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTruckForTare) return;

    updateTareAndFinishWeighbridge(selectedTruckForTare.id, tareWeightInput);

    const updated = {
      ...selectedTruckForTare,
      tare_weight: tareWeightInput,
      net_weight: Math.max(0, selectedTruckForTare.gross_weight - tareWeightInput),
      datetime_out: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'SELESAI'
    };

    setPrintTicket(updated);
    setSelectedTruckForTare(null);
    setTareWeightInput(0);
    setLiveComWeight(0);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) return;
    const added = addSupplier({
      name: newSupName,
      bank_name: newSupBank,
      bank_account_number: newSupAcc,
      phone: newSupPhone
    });
    setSupplierId(added.id);
    setShowAddSupplier(false);
    setNewSupName('');
    setNewSupAcc('');
    setNewSupPhone('');
  };

  const handleSaveStapel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStapelName.trim()) return;
    const added = addStapelPile(newStapelName, newStapelGrade);
    setAllocations(prev => [
      ...prev.slice(0, -1),
      { stapel_id: added.id, stapel_name: added.name, is_direct_cor: false, allocated_kg: 0 }
    ]);
    setShowAddStapel(false);
    setNewStapelName('');
  };

  const pendingTareTrucks = weighbridgeInList.filter(w => !w.status || w.status === 'MASUK');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0f3e2e] text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }}
            className="p-2 bg-[#08251b] rounded-xl hover:bg-emerald-900 transition text-emerald-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <Scale className="w-6 h-6 text-amber-400" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">KONSOL ADMIN 1 - KANTOR & TIMBANGAN</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Pos Timbangan Digital RS232 (2-Step Bruto / Tara)
            </h1>
          </div>
        </div>

        {/* COM Port Status Indicator */}
        <div className="flex items-center space-x-3 bg-[#08251b] px-4 py-3 rounded-xl border border-emerald-700/60">
          <Cpu className={`w-6 h-6 ${comPortConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <div>
            <div className="text-[11px] text-slate-300 font-medium">Port Serial RS232 (Timbangan Digital):</div>
            <div className="text-xs font-bold flex items-center space-x-2">
              <span className={comPortConnected ? 'text-emerald-400' : 'text-slate-400'}>
                {comPortConnected
                  ? (isSimulatedCom ? 'COM SIMULATED (9600 Bps)' : 'COM RS232: CONNECTED')
                  : 'DISCONNECTED'}
              </span>
              <button
                onClick={handleConnectComPort}
                className="px-2 py-0.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded font-bold text-[11px] transition border border-amber-400/40"
              >
                {comPortConnected ? 'Disconnect' : 'Connect RS232 / Simulasi'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher: Timbang Masuk (Bruto) vs Timbang Keluar (Tara) */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => { setWeighMode('MASUK'); setSelectedTruckForTare(null); }}
            className={`px-5 py-3 rounded-xl font-extrabold text-sm transition flex items-center space-x-2 ${
              weighMode === 'MASUK'
                ? 'bg-[#0f3e2e] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>1. TIMBANG MASUK (BRUTO)</span>
          </button>

          <button
            onClick={() => setWeighMode('KELUAR')}
            className={`px-5 py-3 rounded-xl font-extrabold text-sm transition flex items-center space-x-2 ${
              weighMode === 'KELUAR'
                ? 'bg-[#10b981] text-[#0f3e2e] shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Scale className="w-4 h-4 text-[#0f3e2e]" />
            <span>2. TIMBANG KELUAR (TARA KOSONG)</span>
            {pendingTareTrucks.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingTareTrucks.length} Truk
              </span>
            )}
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500">
          *Format Baku Pabrik: Berat Netto = Bruto (Berat Masuk) - Tara (Berat Keluar)
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Timbangan */}
        <div className="lg:col-span-2 space-y-6">
          {weighMode === 'MASUK' ? (
            /* ================= FORM TIMBANG MASUK (BRUTO) ================= */
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Input Timbang Masuk Armada Truk (Bruto)</span>
                <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">
                  Step 1: Gross Weight
                </span>
              </h2>

              <form onSubmit={handleSubmitGross} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nopol Truk */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-bold text-slate-800">
                        Nomor Polisi Armada (Nopol):
                      </label>
                      <button
                        type="button"
                        onClick={handleScanNopolCctv}
                        disabled={isScanningCctv}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition flex items-center space-x-1.5 shadow-sm ${
                          isScanningCctv
                            ? 'bg-amber-100 text-amber-800 cursor-wait animate-pulse'
                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0f3e2e] active:scale-95'
                        }`}
                        title="Ambil snapshot foto dari CCTV TP-Link dan baca Nopol otomatis via PaddleOCR"
                      >
                        <Camera className={`w-3.5 h-3.5 ${isScanningCctv ? 'animate-spin' : ''}`} />
                        <span>{isScanningCctv ? 'SCANNING CCTV...' : '[ SCAN NOPOL CCTV ]'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Contoh: L 9482 UB"
                        value={nopol}
                        onChange={(e) => setNopol(e.target.value)}
                        className="w-full px-4 py-3 text-xl font-extrabold uppercase bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-[#10b981] outline-none text-[#0f3e2e]"
                      />
                      {isScanningCctv && (
                        <span className="absolute right-3 top-3 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 animate-pulse">
                          Reading RTSP TP-Link...
                        </span>
                      )}
                    </div>
                    {cctvError && (
                      <p className="text-xs text-red-600 font-bold mt-1.5 bg-red-50 p-2 rounded-lg border border-red-200">
                        ⚠️ {cctvError}
                      </p>
                    )}
                  </div>

                  {/* Supplier Dropdown */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-bold text-slate-800">
                        Suplier Beras / Gabah:
                      </label>
                      <div className="flex items-center space-x-2">
                        {suppliers.length === 0 && (
                          <button
                            type="button"
                            onClick={loadSampleMasterData}
                            className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-lg transition border border-amber-300"
                            title="Isi sampel data Suplier, Customer & Produk Pabrik"
                          >
                            🚀 Isi Data Awal Pabrik
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowAddSupplier(true)}
                          className="text-xs text-[#10b981] font-bold hover:underline flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Suplier</span>
                        </button>
                      </div>
                    </div>
                    <select
                      value={supplierId}
                      onChange={(e) => setSupplierId(e.target.value)}
                      className="w-full px-4 py-3 text-base font-bold bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-[#10b981] outline-none text-slate-900"
                    >
                      {suppliers.length === 0 ? (
                        <option value="">-- Master Suplier Masih Kosong (Klik [🚀 Isi Data Awal Pabrik] di atas) --</option>
                      ) : (
                        suppliers.map((sup) => (
                          <option key={sup.id} value={sup.id}>
                            {sup.name} ({sup.bank_name} - {sup.bank_account_number})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Timbangan Gross Weight Box */}
                <div className="bg-[#faf8ff] p-5 rounded-2xl border-2 border-emerald-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-800">BERAT MASUK (BRUTO TRUK + ISI):</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => { setGrossWeight(0); setLiveComWeight(0); }}
                        className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition"
                        title="Set berat timbangan ke 0 KG"
                      >
                        Zero (0 KG)
                      </button>
                      <button
                        type="button"
                        onClick={() => simulateComRead(true)}
                        className="text-xs bg-[#0f3e2e] hover:bg-emerald-900 text-white font-extrabold px-3 py-1.5 rounded-lg transition flex items-center space-x-1 shadow-sm"
                        title="Tarik nilai dari timbangan digital RS232 atau aktifkan simulasi"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Tarik Nilai Timbangan (COM)</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center max-w-sm mx-auto">
                    <div className="text-xs text-slate-500 font-bold mb-1">BRUTO (KG)</div>
                    <input
                      type="number"
                      value={grossWeight}
                      onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
                      className="w-full text-center text-4xl font-extrabold text-[#0f3e2e] outline-none"
                    />
                  </div>
                </div>

                {/* Alokasi Pembongkaran (Multi-Stapel / Direct Cor / Up to 20 Stapel) */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-5 h-5 text-[#10b981]" />
                      <span className="text-sm font-extrabold text-slate-900">
                        ALOKASI PEMBONGKARAN GUDANG (Pecah Tumpukan / Direct Cor):
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowAddStapel(true)}
                        className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded-lg transition flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Tambah Stapel/Tumpukan Baru</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {allocations.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-500 w-6">#{idx + 1}</span>

                        <select
                          value={item.is_direct_cor ? 'DIRECT_COR' : item.stapel_id}
                          onChange={(e) => handleAllocationChange(idx, 'stapel_id', e.target.value)}
                          className="flex-1 px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg outline-none text-slate-900"
                        >
                          <option value="DIRECT_COR">⚡ LANGSUNG DI-COR (Direct Reprocessing)</option>
                          {stapelPiles.map((st) => (
                            <option key={st.id} value={st.id}>
                              📦 {st.name} ({st.quality_grade}) — Stok: {st.stock_kg.toLocaleString('id-ID')} KG
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            placeholder="Alokasi KG (opsional)..."
                            value={item.allocated_kg || ''}
                            onChange={(e) => handleAllocationChange(idx, 'allocated_kg', e.target.value)}
                            className="w-36 px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg text-right outline-none"
                          />
                          <span className="text-xs font-bold text-slate-500">KG</span>
                        </div>

                        {allocations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAllocationRow(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddAllocationRow}
                    className="text-xs text-[#10b981] font-bold hover:underline flex items-center space-x-1 pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pecah Alokasi Ke Tumpukan Tambahan</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#0f3e2e] hover:bg-emerald-900 text-white font-extrabold text-base rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <Printer className="w-5 h-5 text-amber-400" />
                  <span>SIMPAN BRUTO & CETAK STT MASUK</span>
                </button>
              </form>
            </div>
          ) : (
            /* ================= FORM TIMBANG KELUAR (TARA) ================= */
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Input Timbang Keluar Truk Kosong (Tara)</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                  Step 2: Tare Weight & Netto Final
                </span>
              </h2>

              {!selectedTruckForTare ? (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-600">
                    Silakan pilih armada truk di antrean yang sudah selesai bongkar muatan:
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {pendingTareTrucks.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-xl border border-dashed">
                        Belum ada armada truk yang mengantre timbang keluar.
                      </div>
                    ) : (
                      pendingTareTrucks.map((truck) => (
                        <div
                          key={truck.id}
                          onClick={() => setSelectedTruckForTare(truck)}
                          className="bg-slate-50 hover:bg-emerald-50 p-4 rounded-xl border-2 border-slate-200 hover:border-[#10b981] cursor-pointer transition flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-base text-[#0f3e2e]">{truck.nopol}</span>
                              <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">{truck.ticket_number}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Suplier: {truck.supplier_name} • Masuk: {truck.datetime_in}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-400 font-bold block">BRUTO MASUK:</span>
                            <span className="font-extrabold text-sm text-[#0f3e2e]">{truck.gross_weight.toLocaleString('id-ID')} KG</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitTare} className="space-y-6">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-500 font-bold">TRUK TERPILIH:</span>
                      <h3 className="text-xl font-extrabold text-[#0f3e2e]">{selectedTruckForTare.nopol} ({selectedTruckForTare.ticket_number})</h3>
                      <p className="text-xs text-slate-600">Suplier: {selectedTruckForTare.supplier_name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTruckForTare(null)}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Ganti Truk
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 font-bold block">1. BRUTO (MASUK)</span>
                      <span className="text-2xl font-extrabold text-slate-800">{selectedTruckForTare.gross_weight.toLocaleString('id-ID')} KG</span>
                    </div>

                    <div className="bg-emerald-100 p-4 rounded-xl border-2 border-emerald-400">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-emerald-900 font-bold">2. TARA (KELUAR)</span>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => { setTareWeightInput(0); setLiveComWeight(0); }}
                            className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-1.5 py-0.5 rounded font-bold"
                          >
                            0 KG
                          </button>
                          <button
                            type="button"
                            onClick={() => simulateComRead(false)}
                            className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded"
                          >
                            COM Read
                          </button>
                        </div>
                      </div>
                      <input
                        type="number"
                        required
                        value={tareWeightInput}
                        onChange={(e) => setTareWeightInput(parseFloat(e.target.value) || 0)}
                        className="w-full text-center text-3xl font-extrabold text-[#0f3e2e] outline-none bg-white rounded-lg p-1 border"
                      />
                    </div>

                    <div className="bg-[#0f3e2e] text-white p-4 rounded-xl border border-emerald-800">
                      <span className="text-xs text-amber-300 font-bold block">3. NETTO FINAL (BERAS)</span>
                      <span className="text-2xl font-extrabold text-amber-400">
                        {Math.max(0, selectedTruckForTare.gross_weight - tareWeightInput).toLocaleString('id-ID')} KG
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#10b981] hover:bg-emerald-600 text-[#0f3e2e] font-extrabold text-base rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
                  >
                    <Printer className="w-5 h-5 text-[#0f3e2e]" />
                    <span>SIMPAN TARA & CETAK SLIP STT FINAL</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Antrean & Riwayat STT */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex justify-between items-center">
              <span>Riwayat Timbangan Hari Ini</span>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-600">
                {weighbridgeInList.length} STT
              </span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {weighbridgeInList.map((ticket) => (
                <div key={ticket.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-slate-900">{ticket.ticket_number}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                      {ticket.net_weight.toLocaleString('id-ID')} KG
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Nopol: <strong>{ticket.nopol}</strong></span>
                    <span>Suplier: {ticket.supplier_name}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Bruto: {ticket.gross_weight.toLocaleString('id-ID')} KG | Tara: {ticket.tare_weight.toLocaleString('id-ID')} KG
                    </span>
                    <button
                      onClick={() => setPrintTicket(ticket)}
                      className="text-xs text-[#10b981] font-bold hover:underline flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak STT</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Supplier Baru */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-4 border-[#0f3e2e]">
            <h3 className="text-lg font-extrabold text-slate-900 border-b pb-2">Tambah Suplier Baru</h3>
            <form onSubmit={handleSaveSupplier} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">Nama Suplier:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: H. Ahmad (Jombang)"
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Bank:</label>
                  <select
                    value={newSupBank}
                    onChange={(e) => setNewSupBank(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option value="BCA">BCA</option>
                    <option value="BRI">BRI</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BNI">BNI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">No Rekening:</label>
                  <input
                    type="text"
                    required
                    placeholder="0182xxxx"
                    value={newSupAcc}
                    onChange={(e) => setNewSupAcc(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">No Telepon/HP:</label>
                <input
                  type="text"
                  placeholder="0812xxxx"
                  value={newSupPhone}
                  onChange={(e) => setNewSupPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplier(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f3e2e] text-white rounded-xl font-extrabold"
                >
                  Simpan Suplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Stapel / Tumpukan Baru (Up to 20 Stapel) */}
      {showAddStapel && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-4 border-[#0f3e2e]">
            <h3 className="text-lg font-extrabold text-slate-900 border-b pb-2">Tambah Tumpukan / Stapel Gudang Baru</h3>
            <form onSubmit={handleSaveStapel} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">Nama Tumpukan / Stapel:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Stapel 9 (Gudang Timur)"
                  value={newStapelName}
                  onChange={(e) => setNewStapelName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Kualitas / Grade Padi/Beras:</label>
                <input
                  type="text"
                  placeholder="Contoh: Gabah Wet / Medium / Kiby"
                  value={newStapelGrade}
                  onChange={(e) => setNewStapelGrade(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStapel(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f3e2e] text-white rounded-xl font-extrabold"
                >
                  Simpan Stapel Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print STT Modal */}
      {printTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border-4 border-[#0f3e2e]">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-[#0f3e2e]">SLIP TIMBANG TRUK (STT) - RESMI</h3>
              <button onClick={() => setPrintTicket(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div id="printable-stt-slip" className="border border-slate-300 p-5 rounded-2xl font-mono text-xs space-y-3 bg-slate-50">
              <div className="text-center font-bold text-sm border-b pb-2">
                PP BUMI MAS WONOSOBO
                <div className="text-[10px] font-normal text-slate-600">Reprocessing & Penggilingan Beras</div>
              </div>

              <div className="flex justify-between">
                <span>NO STT: <strong>{printTicket.ticket_number}</strong></span>
                <span>NOPOL: <strong>{printTicket.nopol}</strong></span>
              </div>
              <div className="flex justify-between">
                <span>SUPLIER: <strong>{printTicket.supplier_name}</strong></span>
                <span>TGL MASUK: {printTicket.datetime_in}</span>
              </div>

              <div className="border-t border-b border-dashed py-2 space-y-1 font-bold">
                <div className="flex justify-between"><span>BERAT MASUK (BRUTO):</span><span>{printTicket.gross_weight?.toLocaleString('id-ID')} KG</span></div>
                <div className="flex justify-between"><span>BERAT KELUAR (TARA):</span><span>{(printTicket.tare_weight || 0).toLocaleString('id-ID')} KG</span></div>
                <div className="flex justify-between text-base text-[#0f3e2e] pt-1 border-t"><span>NETTO FINAL:</span><span>{printTicket.net_weight?.toLocaleString('id-ID')} KG</span></div>
              </div>

              <div className="text-[11px]">
                <span className="font-bold">ALOKASI BONGKARAN:</span>
                <ul className="list-disc pl-4 pt-1">
                  {printTicket.allocations && printTicket.allocations.length > 0 ? (
                    printTicket.allocations.map((a: any, i: number) => (
                      <li key={i}>{a.stapel_name} {a.allocated_kg > 0 ? `(${a.allocated_kg.toLocaleString('id-ID')} KG)` : ''}</li>
                    ))
                  ) : (
                    <li>{printTicket.assigned_stapel_name || 'Stapel 1'}</li>
                  )}
                </ul>
              </div>

              <div className="flex justify-between pt-4 text-center text-[10px]">
                <div>Sopir Truk<br /><br /><br />(.....................)</div>
                <div>Timbangan RS232<br /><br /><br />( Admin 1 )</div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setPrintTicket(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#0f3e2e] text-white font-extrabold rounded-xl text-xs flex items-center space-x-1"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Cetak Slip STT (Printer)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
