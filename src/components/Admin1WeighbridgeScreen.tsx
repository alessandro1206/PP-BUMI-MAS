import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scale, 
  Printer, 
  Plus, 
  RefreshCw, 
  Truck, 
  ArrowLeft, 
  Cpu, 
  FileText, 
  Layers, 
  Trash2, 
  Camera, 
  Search, 
  RotateCcw, 
  Clock, 
  History, 
  X,
  Check
} from 'lucide-react';
import { StapelAllocationItem } from '../types';

export const Admin1WeighbridgeScreen: React.FC = () => {
  const { 
    weighbridgeInList, 
    addWeighbridgeIn, 
    updateTareAndFinishWeighbridge, 
    deleteWeighbridgeIn,
    suppliers, 
    customers,
    addCustomer,
    deleteCustomer,
    stapelPiles, 
    addStapelPile, 
    setRole, 
    setActiveScreen
  } = useApp();

  // -------------------------------------------------------------
  // Live Clock State
  // -------------------------------------------------------------
  const [currentClock, setCurrentClock] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentClock(now.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) + ' • ' + now.toLocaleTimeString('id-ID') + ' WIB');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // -------------------------------------------------------------
  // COM Port RS232 & Live Weight State
  // -------------------------------------------------------------
  const [comPortConnected, setComPortConnected] = useState<boolean>(false);
  const [isSimulatedCom, setIsSimulatedCom] = useState<boolean>(false);
  const [liveComWeight, setLiveComWeight] = useState<number>(0);
  const [serialPortObj, setSerialPortObj] = useState<any | null>(null);
  const [baudRate, setBaudRate] = useState<number>(9600);
  const [isScaleStable, setIsScaleStable] = useState<boolean>(true);
  const [simWeightInput, setSimWeightInput] = useState<string>('15450.0');

  // CCTV OCR Scanner State
  const [isScanningCctv, setIsScanningCctv] = useState<boolean>(false);
  const [cctvError, setCctvError] = useState<string | null>(null);

  // -------------------------------------------------------------
  // Form State (Same as Desktop App)
  // -------------------------------------------------------------
  const [nopol, setNopol] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [goods, setGoods] = useState<string>('Beras Medium');
  const [sacks, setSacks] = useState<string>('');
  const [supplierId, setSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [selectedTruckForTare, setSelectedTruckForTare] = useState<any | null>(null);
  
  // Optional warehouse stapel allocation (for ERP compatibility)
  const [showStapelAlloc, setShowStapelAlloc] = useState<boolean>(false);
  const [allocations, setAllocations] = useState<StapelAllocationItem[]>([
    { stapel_id: stapelPiles[0]?.id, stapel_name: stapelPiles[0]?.name || 'Stapel 1', is_direct_cor: false, allocated_kg: 0 }
  ]);

  // Customer Panel State (Search & Add)
  const [custFilter, setCustFilter] = useState<string>('');
  const [newCustInput, setNewCustInput] = useState<string>('');

  // Queue Panel State (Search)
  const [plateFilter, setPlateFilter] = useState<string>('');

  // Ticket History Modal & Print Slip State
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historySearch, setHistorySearch] = useState<string>('');
  const [printTicket, setPrintTicket] = useState<any | null>(null);
  const [isReprint, setIsReprint] = useState<boolean>(false);

  // Activity Log Messages
  const [activityLogs, setActivityLogs] = useState<Array<{ time: string; msg: string; type: 'info' | 'success' | 'warn' }>>([
    { time: new Date().toLocaleTimeString('id-ID'), msg: 'Sistem Timbangan Digital PT. BUMI MAS siap.', type: 'info' }
  ]);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' = 'info') => {
    const time = new Date().toLocaleTimeString('id-ID');
    setActivityLogs(prev => [{ time, msg, type }, ...prev.slice(0, 30)]);
  };

  // -------------------------------------------------------------
  // Web Serial & COM Communication
  // -------------------------------------------------------------
  const handleConnectComPort = async () => {
    if (comPortConnected) {
      if (serialPortObj) {
        try { await serialPortObj.close(); } catch (e) { console.warn(e); }
      }
      setSerialPortObj(null);
      setComPortConnected(false);
      setIsSimulatedCom(false);
      setLiveComWeight(0);
      addLog('Koneksi port serial terputus.', 'warn');
      return;
    }

    if ('serial' in navigator) {
      try {
        const port = await (navigator as any).serial.requestPort();
        await port.open({ baudRate });
        setSerialPortObj(port);
        setComPortConnected(true);
        setIsSimulatedCom(false);
        addLog(`Serial RS232 Terhubung (${baudRate} Bps)`, 'success');
        readSerialDataStream(port);
        return;
      } catch (err) {
        console.warn('Serial port connection cancelled or failed:', err);
      }
    }

    // Fallback: prompt for trial simulation mode
    const enableSim = window.confirm(
      'Kabel Hardware RS232 belum terhubung ke komputer ini.\n\nAktifkan [Mode Simulasi] untuk uji coba timbangan digital?'
    );
    if (enableSim) {
      setComPortConnected(true);
      setIsSimulatedCom(true);
      const simVal = parseFloat(simWeightInput) || 15450.0;
      setLiveComWeight(simVal);
      addLog(`Mode Simulasi Aktif: ${simVal} KG`, 'info');
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
          if (value.includes('ST')) {
            setIsScaleStable(true);
          } else if (value.includes('US')) {
            setIsScaleStable(false);
          }

          const matches = value.match(/[-+]?\s*\d*\.\d+|[-+]?\s*\d+/g);
          if (matches && matches.length > 0) {
            const raw = parseFloat(matches[0].trim());
            if (!isNaN(raw) && raw >= 0 && raw < 120000) {
              setLiveComWeight(raw);
            }
          }
        }
      }
    } catch (err) {
      console.error('Serial stream reader error:', err);
    }
  };

  const handleSetSimWeight = () => {
    const val = parseFloat(simWeightInput);
    if (!isNaN(val)) {
      setLiveComWeight(val);
      setIsScaleStable(true);
      addLog(`Berat simulasi diset: ${val.toLocaleString('id-ID')} KG`, 'info');
    }
  };

  // CCTV OCR Scanner
  const handleScanNopolCctv = async () => {
    setIsScanningCctv(true);
    setCctvError(null);
    try {
      const response = await fetch('http://localhost:5000/scan-nopol', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.nopol) {
        const detected = data.nopol.toUpperCase().trim();
        setNopol(detected);
        handleLookupPlate(detected);
        addLog(`CCTV OCR Berhasil Mendeteksi Plat: ${detected}`, 'success');
      } else {
        const err = data.message || 'Teks plat tidak terdeteksi dari CCTV.';
        setCctvError(err);
        addLog(`Gagal Scan CCTV: ${err}`, 'warn');
      }
    } catch (err: any) {
      const msg = 'CCTV Server offline (localhost:5000). Jalankan jalankan_server_cctv.bat.';
      setCctvError(msg);
      addLog(msg, 'warn');
    } finally {
      setIsScanningCctv(false);
    }
  };

  // -------------------------------------------------------------
  // Data Filtering (Queue & Customers)
  // -------------------------------------------------------------
  // Trucks currently inside waiting for 2nd weigh-out
  const inboundTrucks = weighbridgeInList.filter(w => !w.status || w.status === 'MASUK');
  
  const filteredInboundTrucks = inboundTrucks.filter(t => {
    if (!plateFilter.trim()) return true;
    const q = plateFilter.toLowerCase();
    return t.nopol.toLowerCase().includes(q) || 
           (t.customer_name || '').toLowerCase().includes(q) ||
           (t.supplier_name || '').toLowerCase().includes(q);
  });

  const filteredCustomers = customers.filter(c => {
    if (!custFilter.trim()) return true;
    return c.name.toLowerCase().includes(custFilter.toLowerCase());
  });

  // Completed tickets for history
  const completedTickets = weighbridgeInList.filter(w => w.status === 'SELESAI');
  const filteredHistory = completedTickets.filter(t => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return t.nopol.toLowerCase().includes(q) || 
           t.ticket_number.toLowerCase().includes(q) ||
           (t.customer_name || '').toLowerCase().includes(q);
  });

  // -------------------------------------------------------------
  // Plate Selection & 1-Click Operations (Same as Desktop App)
  // -------------------------------------------------------------
  const handleSelectTruckForTare = (truck: any) => {
    setSelectedTruckForTare(truck);
    setNopol(truck.nopol);
    setCustomerName(truck.customer_name || truck.supplier_name || '');
    setGoods(truck.goods || 'Beras Medium');
    setSacks(truck.sacks ? String(truck.sacks) : '');
    addLog(`PILIH TRUK: ${truck.nopol} (${truck.customer_name || truck.supplier_name}) | Berat 1: ${truck.gross_weight.toLocaleString('id-ID')} KG`, 'success');
  };

  const handleLookupPlate = (plateInput: string) => {
    const cleanPlate = plateInput.toUpperCase().trim();
    if (!cleanPlate) return;

    // Check if truck is already inside
    const inside = inboundTrucks.find(t => t.nopol.toUpperCase() === cleanPlate);
    if (inside) {
      handleSelectTruckForTare(inside);
      return;
    }

    // Otherwise check history to suggest customer & goods
    const prev = completedTickets.find(t => t.nopol.toUpperCase() === cleanPlate);
    if (prev) {
      if (!customerName) setCustomerName(prev.customer_name || prev.supplier_name || '');
      if (prev.goods) setGoods(prev.goods);
      addLog(`Plat ${cleanPlate} pernah masuk sebelumnya (${prev.customer_name || prev.supplier_name}).`, 'info');
    } else {
      addLog(`Plat Baru: ${cleanPlate}`, 'info');
    }
    setSelectedTruckForTare(null);
  };

  const handleCustomerClick = (name: string, focusNext = false) => {
    setCustomerName(name);
    addLog(`Customer dipilih: ${name}`, 'info');
    if (focusNext) {
      const goodsInput = document.getElementById('weigh-goods-input');
      if (goodsInput) goodsInput.focus();
    }
  };

  const handleAddNewCustomer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newCustInput.trim();
    if (!name) return;
    
    // Check if exists
    if (customers.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      alert(`Customer '${name}' sudah ada di database.`);
      return;
    }

    addCustomer({
      name,
      credit_limit: 100000000,
      payment_terms_days: 14,
      phone: ''
    });
    setNewCustInput('');
    setCustomerName(name);
    addLog(`Customer baru didaftarkan: ${name}`, 'success');
  };

  const handleDeleteCustomer = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus customer '${name}' dari database?`)) {
      deleteCustomer(id);
      if (customerName === name) setCustomerName('');
      addLog(`Customer '${name}' dihapus dari database.`, 'warn');
    }
  };

  const handleCancelInboundTruck = (id: string, plate: string) => {
    if (window.confirm(`Yakin ingin membatalkan antrean truk '${plate}'?`)) {
      deleteWeighbridgeIn(id);
      if (selectedTruckForTare?.id === id) {
        handleResetForm();
      }
      addLog(`Truk ${plate} dikeluarkan dari antrean.`, 'warn');
    }
  };

  // -------------------------------------------------------------
  // Weighing Submissions
  // -------------------------------------------------------------
  // 1st Weigh (MASUK - Bruto)
  const handleSaveFirstWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPlate = nopol.toUpperCase().trim();
    if (!cleanPlate) {
      alert('Mohon masukkan Nomor Polisi (Plat) Truk!');
      return;
    }

    if (liveComWeight <= 0) {
      if (!window.confirm('Nilai timbangan saat ini 0 KG. Tetap simpan?')) return;
    }

    const custVal = customerName.trim() || 'UMUM';

    // Auto save customer if new
    if (custVal && !customers.some(c => c.name.toLowerCase() === custVal.toLowerCase())) {
      addCustomer({
        name: custVal,
        credit_limit: 50000000,
        payment_terms_days: 14,
        phone: ''
      });
    }

    const sup = suppliers.find(s => s.id === supplierId) || suppliers[0];

    const newTicket = addWeighbridgeIn({
      datetime_in: new Date().toISOString().replace('T', ' ').substring(0, 16),
      nopol: cleanPlate,
      supplier_id: sup?.id || 'sup-1',
      supplier_name: sup?.name || custVal,
      customer_name: custVal,
      goods: goods.trim() || 'Beras Medium',
      sacks: sacks || 0,
      gross_weight: liveComWeight,
      tare_weight: 0,
      bag_deduction: 0,
      net_weight: liveComWeight,
      allocations: allocations
    });

    addLog(`SUKSES 1st WEIGH (MASUK) ${cleanPlate}: ${liveComWeight.toLocaleString('id-ID')} KG`, 'success');
    handleResetForm();
  };

  // 2nd Weigh (KELUAR - Tara & Print)
  const handleSaveSecondWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTruckForTare) {
      alert('Pilih truk di panel antrean terlebih dahulu untuk timbang ke-2!');
      return;
    }

    const w1 = selectedTruckForTare.gross_weight;
    const w2 = liveComWeight;
    const netto = Math.abs(w1 - w2);

    updateTareAndFinishWeighbridge(selectedTruckForTare.id, w2, sacks || selectedTruckForTare.sacks, goods);

    const ticketData = {
      ...selectedTruckForTare,
      customer_name: customerName || selectedTruckForTare.customer_name,
      goods: goods || selectedTruckForTare.goods || 'Beras Medium',
      sacks: sacks || selectedTruckForTare.sacks || 0,
      tare_weight: w2,
      net_weight: netto,
      datetime_out: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'SELESAI'
    };

    addLog(`SUKSES 2nd WEIGH: ${selectedTruckForTare.nopol} | Netto: ${netto.toLocaleString('id-ID')} KG`, 'success');
    setIsReprint(false);
    setPrintTicket(ticketData);
    handleResetForm();
  };

  const handleResetForm = () => {
    setSelectedTruckForTare(null);
    setNopol('');
    setCustomerName('');
    setGoods('Beras Medium');
    setSacks('');
  };

  // -------------------------------------------------------------
  // Allocation rows helper
  // -------------------------------------------------------------
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
            return { ...item, stapel_id: undefined, stapel_name: 'Langsung Di-COR (Reprocessing)', is_direct_cor: true };
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

  return (
    <div className="max-w-[1400px] mx-auto px-3 py-4 space-y-4 font-sans text-slate-800">
      
      {/* =========================================================
          HEADER BAR: BRANDING, LIVE CLOCK & CONNECTION STATUS
      ========================================================= */}
      <div className="bg-[#0f172a] text-white px-5 py-3.5 rounded-2xl shadow-md border border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => { setRole('PORTAL'); setActiveScreen('SCREEN_5'); }}
            className="p-2 bg-[#1e293b] hover:bg-slate-700 rounded-xl transition text-slate-300"
            title="Kembali ke Portal Menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-extrabold text-white tracking-wide">PT. BUMI MAS</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                WEIGHBRIDGE v2.0 PRO
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentClock || 'Memuat waktu...'}</span>
            </div>
          </div>
        </div>

        {/* Right Header Controls: Riwayat, Port, Connect, Status */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-3 py-1.5 bg-[#1e293b] hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-slate-600"
          >
            <History className="w-3.5 h-3.5 text-sky-400" />
            <span>📄 Riwayat Tiket ({completedTickets.length})</span>
          </button>

          <div className="flex items-center space-x-2 bg-[#1e293b] px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400">Baud:</span>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(parseInt(e.target.value, 10))}
              disabled={comPortConnected}
              className="bg-[#0f172a] text-slate-200 font-bold px-2 py-0.5 rounded outline-none border border-slate-600"
            >
              <option value={9600}>9600</option>
              <option value={4800}>4800</option>
              <option value={2400}>2400</option>
              <option value={19200}>19200</option>
              <option value={115200}>115200</option>
            </select>
          </div>

          <button
            onClick={handleConnectComPort}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              comPortConnected
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{comPortConnected ? 'Putuskan RS232' : 'Hubungkan RS232'}</span>
          </button>

          {/* Status Badge */}
          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 ${
            comPortConnected
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${comPortConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span>{comPortConnected ? (isSimulatedCom ? '● COM SIMULASI' : '● RS232 CONNECTED') : '● TERPUTUS'}</span>
          </span>
        </div>
      </div>

      {/* =========================================================
          DIGITAL WEIGH HUD (CENTER STAGE)
      ========================================================= */}
      <div className="bg-[#020617] rounded-2xl border-2 border-emerald-500 shadow-xl p-4 text-white">
        {/* Top bar inside HUD: Stability, Zero, Simulation & CCTV */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-lg text-xs font-extrabold tracking-wider ${
              isScaleStable 
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' 
                : 'bg-amber-950 text-amber-400 border border-amber-700 animate-pulse'
            }`}>
              {isScaleStable ? '● STABIL' : '● BERGERAK (UNSTABLE)'}
            </span>

            <button
              onClick={() => { setLiveComWeight(0); setIsScaleStable(true); }}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-extrabold rounded-lg border border-slate-700 transition"
              title="Set tampilan timbangan ke 0.0 KG"
            >
              ZERO [ 0.0 ]
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* CCTV Scan Button */}
            <button
              type="button"
              onClick={handleScanNopolCctv}
              disabled={isScanningCctv}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition flex items-center space-x-1.5 shadow ${
                isScanningCctv
                  ? 'bg-amber-950 text-amber-300 cursor-wait animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
              }`}
              title="Baca Nopol otomatis dari kamera CCTV via OCR"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isScanningCctv ? 'SCANNING CCTV...' : '📷 SCAN NOPOL CCTV'}</span>
            </button>

            {/* Simulation controls */}
            <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-500">Tes:</span>
              <input
                type="number"
                value={simWeightInput}
                onChange={(e) => setSimWeightInput(e.target.value)}
                className="w-20 bg-slate-950 text-sky-400 px-2 py-0.5 rounded text-right font-mono font-bold outline-none border border-slate-700"
              />
              <button
                onClick={handleSetSimWeight}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold transition"
              >
                Set
              </button>
            </div>
          </div>
        </div>

        {/* Large Glowing Readout */}
        <div className="py-4 flex items-center justify-between px-6">
          <div className="flex-1 text-center">
            <span className="font-mono text-6xl md:text-7xl lg:text-8xl font-black text-[#22c55e] tracking-tight select-all">
              {liveComWeight.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-3xl md:text-4xl text-[#22c55e]">
              KG
            </span>
            <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
              {selectedTruckForTare ? 'TIMBANG KE-2 (TARA)' : 'TIMBANG KE-1 (BRUTO)'}
            </div>
          </div>
        </div>

        {cctvError && (
          <div className="text-xs text-amber-400 bg-amber-950/60 p-2 rounded-xl border border-amber-800 mt-1">
            ⚠️ {cctvError}
          </div>
        )}
      </div>

      {/* =========================================================
          MAIN 3-COLUMN INTEGRATED WORKSPACE (SAME AS DESKTOP APP)
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* -------------------------------------------------------
            PANEL 1: FORM PENIMBANGAN (5 COLS)
        ------------------------------------------------------- */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                FORM PENIMBANGAN
              </h2>
            </div>
            {selectedTruckForTare && (
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                Mode: Timbang Keluar
              </span>
            )}
          </div>

          <form onSubmit={selectedTruckForTare ? handleSaveSecondWeight : handleSaveFirstWeight} className="space-y-3.5 text-xs">
            {/* No Polisi Input */}
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                No Polisi (Plat Truk):
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: B 1234 ABC"
                value={nopol}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setNopol(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLookupPlate(nopol);
                  }
                }}
                className="w-full px-3 py-2 text-base font-extrabold bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-sky-500 outline-none uppercase text-slate-900"
              />
            </div>

            {/* Customer Input & Quick Chips */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-extrabold">Customer / Rekanan:</label>
                <span className="text-[10px] text-slate-400 italic">Bisa klik dari panel tengah</span>
              </div>
              <input
                type="text"
                required
                placeholder="Pilih dari daftar atau ketik nama..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 font-bold bg-slate-50 border border-slate-300 rounded-xl focus:border-sky-500 outline-none text-slate-900"
              />

              {/* Quick Customer Chips */}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {customers.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCustomerClick(c.name)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-slate-700 rounded-lg text-[10px] font-bold transition border border-slate-200"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Jenis Muatan */}
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">Jenis Muatan:</label>
              <input
                id="weigh-goods-input"
                type="text"
                required
                placeholder="Contoh: Beras Medium / Gabah / Pasir"
                value={goods}
                onChange={(e) => setGoods(e.target.value)}
                className="w-full px-3 py-2 font-bold bg-slate-50 border border-slate-300 rounded-xl focus:border-sky-500 outline-none text-slate-900"
              />
              <div className="flex gap-1.5 mt-1">
                {['Beras Medium', 'Gabah Basah', 'Beras Super', 'Katul / Dedak', 'Pasir'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGoods(item)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-medium"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Jumlah Sak */}
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">Jumlah Sak (Opsional):</label>
              <input
                type="number"
                placeholder="0"
                value={sacks}
                onChange={(e) => setSacks(e.target.value)}
                className="w-32 px-3 py-2 font-bold bg-slate-50 border border-slate-300 rounded-xl focus:border-sky-500 outline-none text-slate-900"
              />
            </div>

            {/* Optional Stapel Allocation (Kept for ERP Stapel inventory tracking) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowStapelAlloc(!showStapelAlloc)}
                className="text-[11px] font-bold text-sky-600 hover:underline flex items-center space-x-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{showStapelAlloc ? '▼ Tutup Alokasi Gudang (Stapel)' : '► Opsi Alokasi Gudang / Direct Cor'}</span>
              </button>

              {showStapelAlloc && (
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Tumpukan Stapel:</span>
                    <button
                      type="button"
                      onClick={handleAddAllocationRow}
                      className="text-[10px] text-emerald-700 font-bold hover:underline"
                    >
                      + Tambah Pecah Tumpukan
                    </button>
                  </div>
                  {allocations.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={item.is_direct_cor ? 'DIRECT_COR' : item.stapel_id}
                        onChange={(e) => handleAllocationChange(idx, 'stapel_id', e.target.value)}
                        className="flex-1 p-1.5 text-xs font-bold bg-white border rounded-lg"
                      >
                        <option value="DIRECT_COR">⚡ LANGSUNG DI-COR</option>
                        {stapelPiles.map((st) => (
                          <option key={st.id} value={st.id}>
                            📦 {st.name} ({st.stock_kg.toLocaleString('id-ID')} KG)
                          </option>
                        ))}
                      </select>
                      {allocations.length > 1 && (
                        <button type="button" onClick={() => handleRemoveAllocationRow(idx)} className="text-rose-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Truck Tare Info Banner (When in 2nd Weigh Mode) */}
            {selectedTruckForTare && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Berat Masuk (1st Weigh):</span>
                  <span className="font-mono font-extrabold text-slate-900">
                    {selectedTruckForTare.gross_weight.toLocaleString('id-ID')} KG
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Berat Keluar (Saat Ini):</span>
                  <span className="font-mono font-extrabold text-slate-900">
                    {liveComWeight.toLocaleString('id-ID')} KG
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-extrabold text-emerald-800 pt-1 border-t border-emerald-200">
                  <span>ESTIMASI NETTO:</span>
                  <span className="font-mono text-sm">
                    {Math.max(0, selectedTruckForTare.gross_weight - liveComWeight).toLocaleString('id-ID')} KG
                  </span>
                </div>
              </div>
            )}

            {/* Dual Action Buttons (Same as Desktop App) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                disabled={!!selectedTruckForTare}
                onClick={handleSaveFirstWeight}
                className={`py-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm ${
                  selectedTruckForTare
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-sky-600 hover:bg-sky-700 text-white active:scale-98'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>📥 1st WEIGH (MASUK)</span>
              </button>

              <button
                type="button"
                disabled={!selectedTruckForTare}
                onClick={handleSaveSecondWeight}
                className={`py-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm ${
                  !selectedTruckForTare
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse active:scale-98'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>🖨️ 2nd WEIGH & PRINT</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetForm}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs flex items-center justify-center space-x-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Form Input</span>
            </button>
          </form>

          {/* Activity Log Terminal */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Terminal Log Aktivitas:
            </span>
            <div className="bg-[#0f172a] text-slate-300 p-2.5 rounded-xl font-mono text-[11px] max-h-28 overflow-y-auto space-y-1">
              {activityLogs.map((log, i) => (
                <div key={i} className="flex space-x-2">
                  <span className="text-slate-500">[{log.time}]</span>
                  <span className={log.type === 'success' ? 'text-emerald-400' : log.type === 'warn' ? 'text-amber-400' : 'text-slate-300'}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------
            PANEL 2: DATABASE CUSTOMER (3 COLS) - KLIK LANGSUNG
        ------------------------------------------------------- */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3 flex flex-col">
          <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              👥 DATABASE CUSTOMER
            </h2>
            <span className="text-[11px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
              {customers.length} Cust
            </span>
          </div>

          <div className="text-[11px] text-sky-700 italic">
            *Klik nama untuk langsung memilih ke formulir:
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari customer..."
              value={custFilter}
              onChange={(e) => setCustFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-sky-500 outline-none"
            />
          </div>

          {/* Customer Listbox */}
          <div className="flex-1 overflow-y-auto max-h-[360px] border border-slate-200 rounded-xl divide-y divide-slate-100">
            {filteredCustomers.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs italic">
                {customers.length === 0 ? 'Belum ada customer di database.' : 'Tidak ada customer yang cocok.'}
              </div>
            ) : (
              filteredCustomers.map((c) => {
                const isSelected = customerName.toLowerCase() === c.name.toLowerCase();
                return (
                  <div
                    key={c.id}
                    onClick={() => handleCustomerClick(c.name)}
                    onDoubleClick={() => handleCustomerClick(c.name, true)}
                    className={`p-2.5 flex items-center justify-between cursor-pointer transition text-xs ${
                      isSelected
                        ? 'bg-sky-100 text-sky-900 font-extrabold'
                        : 'hover:bg-slate-50 text-slate-800 font-bold'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />}
                      <span className="truncate">{c.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomer(c.id, c.name);
                      }}
                      className="text-slate-300 hover:text-rose-500 p-1"
                      title="Hapus customer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Add New Customer Bar */}
          <form onSubmit={handleAddNewCustomer} className="pt-2 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Nama customer baru..."
              value={newCustInput}
              onChange={(e) => setNewCustInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:border-sky-500 outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold rounded-xl transition"
            >
              + Tambah
            </button>
          </form>
        </div>

        {/* -------------------------------------------------------
            PANEL 3: TRUK DI DALAM / MENUNGGU TIMBANG 2 (4 COLS)
        ------------------------------------------------------- */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3 flex flex-col">
          <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              🚛 TRUK DI DALAM (TIMBANG 2)
            </h2>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {inboundTrucks.length} Truk
            </span>
          </div>

          {/* Quick-Click Number Plate Badges (TNKB Style, Same as App) */}
          <div>
            <div className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider mb-1.5">
              KLIK PLAT CEPAT (TIMBANG 2):
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center p-2 bg-slate-50 rounded-xl border border-slate-200">
              {inboundTrucks.length === 0 ? (
                <span className="text-[11px] text-slate-400 italic">Belum ada antrean truk di dalam</span>
              ) : (
                inboundTrucks.slice(0, 8).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTruckForTare(t)}
                    className="px-2.5 py-1 bg-[#1e293b] hover:bg-slate-700 active:scale-95 text-white font-mono text-xs font-black rounded-lg border border-slate-600 shadow-sm transition"
                    title={`Pilih ${t.nopol} untuk Timbang 2`}
                  >
                    {t.nopol}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Search queue input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari plat atau customer..."
              value={plateFilter}
              onChange={(e) => setPlateFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-sky-500 outline-none"
            />
          </div>

          {/* Inbound Trucks Table */}
          <div className="flex-1 overflow-y-auto max-h-[330px] border border-slate-200 rounded-xl divide-y divide-slate-100">
            {filteredInboundTrucks.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs italic">
                {inboundTrucks.length === 0 ? 'Semua truk telah selesai timbang keluar.' : 'Tidak ada antrean yang cocok.'}
              </div>
            ) : (
              filteredInboundTrucks.map((t) => {
                const isSelected = selectedTruckForTare?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTruckForTare(t)}
                    className={`p-3 cursor-pointer transition text-xs space-y-1 ${
                      isSelected
                        ? 'bg-emerald-50 border-l-4 border-emerald-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {t.nopol}
                      </span>
                      <span className="font-mono text-xs font-extrabold text-[#0f3e2e]">
                        {t.gross_weight.toLocaleString('id-ID')} KG
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 font-medium">
                      <span className="truncate">{t.customer_name || t.supplier_name}</span>
                      <span className="text-[10px] text-slate-400">{t.datetime_in.split(' ')[1] || t.datetime_in}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 italic">
                        Muatan: {t.goods || 'Beras'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelInboundTruck(t.id, t.nopol);
                        }}
                        className="text-[10px] text-rose-500 hover:underline"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* =========================================================
          MODAL RIWAYAT TIKET & REPRINT
      ========================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl border-4 border-[#0f172a]">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Riwayat Tiket Penimbangan Selesai ({completedTickets.length})
                </h3>
              </div>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari berdasarkan No Polisi, No Tiket, atau Customer..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-bold bg-slate-50 border rounded-xl outline-none"
              />
            </div>

            {/* History Table */}
            <div className="max-h-[380px] overflow-y-auto border rounded-xl divide-y divide-slate-100 text-xs">
              {filteredHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-400">Belum ada riwayat transaksi tiket selesai.</div>
              ) : (
                filteredHistory.map((ticket) => (
                  <div key={ticket.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded">
                          {ticket.ticket_number}
                        </span>
                        <span className="font-mono text-sm font-extrabold text-slate-900">
                          {ticket.nopol}
                        </span>
                        <span className="text-slate-600 font-bold">
                          • {ticket.customer_name || ticket.supplier_name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Timbang 1: {ticket.gross_weight.toLocaleString('id-ID')} KG | Timbang 2: {ticket.tare_weight.toLocaleString('id-ID')} KG | Waktu: {ticket.datetime_out}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold">NETTO:</span>
                        <span className="font-mono font-black text-sm text-emerald-700">
                          {ticket.net_weight.toLocaleString('id-ID')} KG
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setIsReprint(true);
                          setPrintTicket(ticket);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Ulang</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PRINT SLIP TIKET (EXACT PT. BUMI MAS APP FORMAT)
      ========================================================= */}
      {printTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border-4 border-[#0f172a] shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center space-x-2">
                <Printer className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900">
                  {isReprint ? 'CETAK ULANG TIKET TIMBANGAN' : 'SLIP TIKET PENIMBANGAN RESMI'}
                </h3>
              </div>
              <button onClick={() => setPrintTicket(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ticket Printable Body matching Desktop App layout */}
            <div id="printable-stt-slip" className="border border-slate-300 p-6 rounded-2xl font-mono text-xs bg-slate-50 space-y-3 leading-relaxed">
              <div className="text-center font-bold text-base tracking-widest border-b pb-2">
                PT. BUMI MAS
                {isReprint && <span className="block text-xs text-rose-600 font-bold">(CETAK ULANG)</span>}
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between">
                  <span>No Polisi</span>
                  <span>: <strong>{printTicket.nopol}</strong></span>
                </div>
                <div className="flex justify-between">
                  <span>Customers</span>
                  <span>: <strong>{printTicket.customer_name || printTicket.supplier_name || 'PT. BUMI MAS'}</strong></span>
                </div>
                <div className="flex justify-between">
                  <span>Jenis Muatan</span>
                  <span>: {printTicket.goods || 'Beras Medium'}</span>
                </div>
                <div className="flex justify-between">
                  <span>1st Weighing</span>
                  <span>: {printTicket.datetime_in}   {printTicket.gross_weight?.toLocaleString('id-ID', { minimumFractionDigits: 2 })} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>2nd Weighing</span>
                  <span>: {printTicket.datetime_out || '-'}   {printTicket.tare_weight?.toLocaleString('id-ID', { minimumFractionDigits: 2 })} kg</span>
                </div>
                
                <div className="border-t border-b border-dashed my-2 py-2 flex justify-between font-extrabold text-sm text-[#0f172a]">
                  <span>Netto</span>
                  <span>: {printTicket.net_weight?.toLocaleString('id-ID', { minimumFractionDigits: 2 })} kg</span>
                </div>

                <div className="flex justify-between">
                  <span>Jumlah Sak</span>
                  <span>: {printTicket.sacks || 0}</span>
                </div>
              </div>

              <div className="border-t border-slate-300 pt-4 flex justify-between text-center text-[10px] text-slate-500">
                <div>
                  Sopir Truk<br /><br /><br />
                  (.....................)
                </div>
                <div>
                  Petugas Timbangan<br /><br /><br />
                  ( Admin 1 )
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setPrintTicket(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Tiket (Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
