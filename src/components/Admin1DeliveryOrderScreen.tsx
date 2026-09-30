import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Printer, Plus, ArrowLeft, DollarSign, CheckCircle2, Building, Eye, Trash2, Calendar, Layers, Check, Share2, Split, Download, ExternalLink } from 'lucide-react';
import { SalesDeliveryOrderItem, SalesDeliveryOrder, Customer } from '../types';

export const Admin1DeliveryOrderScreen: React.FC = () => {
  const { deliveryOrders, createDeliveryOrder, setInvoicePrice, confirmDOShipped, customers, role, setRole, setActiveScreen, addAuditLog } = useApp();

  // Form State
  const [selectedCustId, setSelectedCustId] = useState<string>('cust-1');
  const [customerName, setCustomerName] = useState<string>('BUMI SUBUR SURABAYA');
  const [brandAka, setBrandAka] = useState<string>('DM');
  const [customerPhone, setCustomerPhone] = useState<string>('081 833 4998');
  const [nopol, setNopol] = useState<string>('PT. MU S 9302 UN');
  const [originCity, setOriginCity] = useState<string>('Banyuwangi');
  const [expeditionInfo, setExpeditionInfo] = useState<string>(
    'EXP. CARAVAN (P. MATHIAS)\nGD. DIPO CARAVAN\nJL. KALIANAK 55 BLOK QQ NO. 9 SURABAYA'
  );
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('Kirim via Exp. Caravan (P. Mathias) Dipo Kalianak');

  // Ship Confirmation Modal
  const [showShipModal, setShowShipModal] = useState<boolean>(false);
  const [shipTargetDO, setShipTargetDO] = useState<SalesDeliveryOrder | null>(null);
  const [actualShipDate, setActualShipDate] = useState<string>(new Date().toISOString().split('T')[0]);



  // Multi-Item Rows State (Matching Excel Sample)
  const [items, setItems] = useState<SalesDeliveryOrderItem[]>([
    { id: 'it-1', product_name: 'BERAS PREMIUM CAP PUTRI THAILAND @(5X10) KG', unit: 'ZAK', qty: 20, weight_per_unit_kg: 50, total_kg: 1000 },
    { id: 'it-2', product_name: 'BERAS PREMIUM CAP PUTRI THAILAND @25 KG', unit: 'ZAK', qty: 150, weight_per_unit_kg: 25, total_kg: 3750 },
    { id: 'it-3', product_name: 'BERAS PREMIUM CAP KAKAK TUA @(5X10) KG', unit: 'ZAK', qty: 15, weight_per_unit_kg: 50, total_kg: 750 },
    { id: 'it-4', product_name: 'BERAS PREMIUM CAP KAKAK TUA @25 KG', unit: 'ZAK', qty: 20, weight_per_unit_kg: 25, total_kg: 500 },
    { id: 'it-5', product_name: 'BERAS PREMIUM CAP PANDAN @(5X5) KG', unit: 'ZAK', qty: 50, weight_per_unit_kg: 25, total_kg: 1250 },
    { id: 'it-6', product_name: 'BERAS PREMIUM CAP PANDAN @(5X10) KG', unit: 'ZAK', qty: 25, weight_per_unit_kg: 50, total_kg: 1250 },
    { id: 'it-7', product_name: 'BERAS PREMIUM CAP PANDAN @20 KG', unit: 'ZAK', qty: 75, weight_per_unit_kg: 20, total_kg: 1500 }
  ]);

  // Owner Selling Price Input
  const [ownerPriceInput, setOwnerPriceInput] = useState<{ [id: string]: string }>({});

  // DO Print Preview Modal
  const [viewDOModal, setViewDOModal] = useState<SalesDeliveryOrder | null>(null);
  const [printTab, setPrintTab] = useState<'SURAT_JALAN' | 'FAKTUR'>('SURAT_JALAN');

  // Split PO Modal State
  const [showSplitModal, setShowSplitModal] = useState<boolean>(false);
  const [splitTargetDO, setSplitTargetDO] = useState<SalesDeliveryOrder | null>(null);
  const [truk1Nopol, setTruk1Nopol] = useState<string>('S 9302 UN');
  const [truk1CapTon, setTruk1CapTon] = useState<number>(13);
  const [truk2Nopol, setTruk2Nopol] = useState<string>('L 8129 UY');
  const [truk2CapTon, setTruk2CapTon] = useState<number>(12);

  // Google Calendar Sync Modal State
  const [showGCalModal, setShowGCalModal] = useState<boolean>(false);
  const [gcalInputText, setGcalInputText] = useState<string>(
    'ORDER DM - 08/09/2026\nCustomer: BUMI SUBUR SURABAYA\nExpedisi: EXP. CARAVAN (P. MATHIAS) GD DIPO KALIANAK\nItems: 20 Zak Putri Thailand 50kg, 150 Zak Putri Thailand 25kg, 75 Zak Pandan 20kg'
  );

  const handleSelectCustomer = (custId: string) => {
    setSelectedCustId(custId);
    const found = customers.find(c => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setBrandAka(found.brand_aka || '');
      setCustomerPhone(found.phone || '');
      if (found.expedition_destination) {
        setExpeditionInfo(found.expedition_destination);
      }
    }
  };

  const handleAddItemRow = () => {
    setItems(prev => [
      ...prev,
      { id: `it-${Date.now()}`, product_name: 'BERAS PREMIUM CAP PUTRI THAILAND @50 KG', unit: 'ZAK', qty: 50, weight_per_unit_kg: 50, total_kg: 2500 }
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: value };
        if (field === 'qty' || field === 'unit' || field === 'weight_per_unit_kg') {
          const q = parseFloat(field === 'qty' ? value : item.qty) || 0;
          const w = parseFloat(field === 'weight_per_unit_kg' ? value : item.weight_per_unit_kg) || 1;
          const unitType = field === 'unit' ? value : item.unit;
          
          if (unitType === 'TON') {
            updated.total_kg = q * 1000;
          } else if (unitType === 'SAK' || unitType === 'ZAK') {
            updated.total_kg = q * w;
          } else {
            updated.total_kg = q;
          }
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateGrandTotalKg = () => {
    return items.reduce((acc, it) => acc + (it.total_kg || 0), 0);
  };

  const handleSubmitDO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || items.length === 0) {
      alert('Mohon isi nama customer dan minimal 1 item barang!');
      return;
    }

    const totalKgSum = calculateGrandTotalKg();
    const productSummary = items.map(it => `${it.product_name} (${it.qty} ${it.unit})`).join(', ');

    const created = createDeliveryOrder({
      customer_name: customerName,
      brand_aka: brandAka.toUpperCase(),
      customer_phone: customerPhone,
      nopol: nopol.toUpperCase(),
      origin_city: originCity,
      expedition_info: expeditionInfo,
      delivery_date: deliveryDate,
      notes: notes,
      items: items,
      product_name: productSummary,
      total_kg: totalKgSum,
      status: 'RENCANA_JADWAL'
    });

    setViewDOModal(created);
  };

  const handleSetSellingPrice = (id: string) => {
    const valStr = ownerPriceInput[id];
    const price = parseFloat(valStr || '0');
    if (!price || price <= 0) {
      alert('Masukkan harga jual per KG yang valid!');
      return;
    }
    setInvoicePrice(id, price);
  };

  const handleConfirmShip = () => {
    if (!shipTargetDO) return;
    confirmDOShipped(shipTargetDO.id, actualShipDate);
    setShowShipModal(false);
    setShipTargetDO(null);
    alert('DO berhasil dikonfirmasi TERKIRIM!');
  };

  const handleExecuteSplitPO = () => {
    if (!splitTargetDO) return;
    const totalOriginalKg = splitTargetDO.total_kg;
    const truk1Kg = truk1CapTon * 1000;
    const truk2Kg = totalOriginalKg - truk1Kg;

    if (truk1Kg <= 0 || truk2Kg <= 0) {
      alert('Kapasitas Truk 1 melebihi atau sama dengan total PO! Mohon masukkan angka yang valid.');
      return;
    }

    // Split DO 1
    createDeliveryOrder({
      customer_name: splitTargetDO.customer_name,
      brand_aka: splitTargetDO.brand_aka,
      customer_phone: splitTargetDO.customer_phone,
      nopol: truk1Nopol.toUpperCase(),
      origin_city: splitTargetDO.origin_city || 'Banyuwangi',
      expedition_info: splitTargetDO.expedition_info,
      delivery_date: splitTargetDO.delivery_date,
      notes: `[TRUK A - ${truk1CapTon} TON] Split dari ${splitTargetDO.do_number}`,
      items: splitTargetDO.items.map(it => ({ ...it, qty: Math.round(it.qty * (truk1Kg / totalOriginalKg)), total_kg: Math.round(it.total_kg * (truk1Kg / totalOriginalKg)) })),
      product_name: `${splitTargetDO.product_name} (Truk A - ${truk1CapTon}T)`,
      total_kg: truk1Kg,
      status: 'DI_MUAT_TRUK'
    });

    // Split DO 2
    createDeliveryOrder({
      customer_name: splitTargetDO.customer_name,
      brand_aka: splitTargetDO.brand_aka,
      customer_phone: splitTargetDO.customer_phone,
      nopol: truk2Nopol.toUpperCase(),
      origin_city: splitTargetDO.origin_city || 'Banyuwangi',
      expedition_info: splitTargetDO.expedition_info,
      delivery_date: splitTargetDO.delivery_date,
      notes: `[TRUK B - ${(truk2Kg / 1000).toFixed(1)} TON] Split dari ${splitTargetDO.do_number}`,
      items: splitTargetDO.items.map(it => ({ ...it, qty: Math.round(it.qty * (truk2Kg / totalOriginalKg)), total_kg: Math.round(it.total_kg * (truk2Kg / totalOriginalKg)) })),
      product_name: `${splitTargetDO.product_name} (Truk B - ${(truk2Kg / 1000).toFixed(1)}T)`,
      total_kg: truk2Kg,
      status: 'RENCANA_JADWAL'
    });

    setShowSplitModal(false);
    alert(`Berhasil memecah PO ${splitTargetDO.do_number} (${(totalOriginalKg / 1000).toFixed(1)} Ton) menjadi 2 Truk (${truk1CapTon} Ton + ${(truk2Kg / 1000).toFixed(1)} Ton)!`);
  };

  const handleImportPresetGCal = (preset: any) => {
    // Populate form fields for viewing
    setCustomerName(preset.customer_name);
    setBrandAka(preset.brand_aka || '');
    setCustomerPhone(preset.phone || '');
    setExpeditionInfo(preset.expedition_info || '');
    setDeliveryDate(preset.date || new Date().toISOString().split('T')[0]);
    setNotes(preset.notes || '');
    if (preset.items && preset.items.length > 0) {
      setItems(preset.items);
    }

    // Direct creation of Delivery Order -> IMMEDIATELY appears in right panel "Daftar Surat Jalan & Invoice"!
    const presetItems = preset.items || items;
    const totalKgSum = presetItems.reduce((acc: number, it: any) => acc + (it.total_kg || 0), 0);
    const summaryProd = presetItems.map((it: any) => `${it.product_name} (${it.qty} ${it.unit})`).join(', ');

    const newDO = createDeliveryOrder({
      customer_name: preset.customer_name,
      brand_aka: preset.brand_aka || '',
      customer_phone: preset.phone || '081 833 4998',
      nopol: nopol || 'S 9302 UN',
      origin_city: originCity || 'Banyuwangi',
      expedition_info: preset.expedition_info || expeditionInfo,
      delivery_date: preset.date || deliveryDate,
      notes: preset.notes || `Order ${preset.brand_aka || ''} via Google Calendar`,
      items: presetItems,
      product_name: summaryProd,
      total_kg: totalKgSum,
      status: 'RENCANA_JADWAL'
    });

    setShowGCalModal(false);
    alert(`✅ BERHASIL TERBIT! Surat Jalan ${newDO.do_number} untuk "${preset.customer_name} (${preset.brand_aka || ''})" (Total: ${(totalKgSum/1000).toFixed(1)} Ton) LANGSUNG MASUK ke Daftar Surat Jalan & Invoice di panel kanan!`);
  };

  const handleParseGCalText = () => {
    if (!gcalInputText.trim()) return;
    const txt = gcalInputText;

    let cName = customerName;
    let bAka = brandAka;
    let exp = expeditionInfo;

    const custMatch = txt.match(/Customer:\s*(.*)/i);
    if (custMatch && custMatch[1]) cName = custMatch[1].trim();

    const expMatch = txt.match(/Expedisi:\s*(.*)/i);
    if (expMatch && expMatch[1]) exp = expMatch[1].trim();

    const brandMatch = txt.match(/ORDER\s+([A-Z0-9]+)/i);
    if (brandMatch && brandMatch[1]) bAka = brandMatch[1].trim();

    // Smart Parser for Juwita's Item syntax: "betet@10 5 ton", "betet@20 100 sak", "p.thai@5 3 ton"
    const parsedItems: SalesDeliveryOrderItem[] = [];
    const lines = txt.split('\n');

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      const match = trimmed.match(/([a-zA-Z0-9.]+)\s*@\s*(\d+)\s+(\d+(?:\.\d+)?)\s*(ton|sak|kg|zak)/i);
      if (match) {
        const rawBrand = match[1].toLowerCase();
        const weightPerUnit = parseInt(match[2]);
        const qtyNum = parseFloat(match[3]);
        const unitType = match[4].toLowerCase();

        let brandName = rawBrand.includes('betet') ? 'BERAS PREMIUM CAP BETET' : rawBrand.includes('thai') || rawBrand.includes('p.thai') ? 'BERAS PREMIUM CAP PUTRI THAILAND' : rawBrand.includes('pandan') ? 'BERAS PREMIUM CAP PANDAN' : `BERAS PREMIUM CAP ${rawBrand.toUpperCase()}`;
        let qtyZak = 0;
        let totalKg = 0;
        let formattedProdName = '';
        let outerWeight = weightPerUnit;

        if (unitType === 'ton') {
          totalKg = qtyNum * 1000;
        } else if (unitType === 'sak' || unitType === 'zak') {
          totalKg = qtyNum * weightPerUnit;
        } else {
          totalKg = qtyNum;
        }

        if (weightPerUnit === 10) {
          formattedProdName = `${brandName} @(5X10) KG`;
          outerWeight = 50;
          qtyZak = Math.round(totalKg / 50); // 5 x 10kg in 50kg outer sak (colly)
        } else if (weightPerUnit === 5) {
          formattedProdName = `${brandName} @(5X5) KG`;
          outerWeight = 25;
          qtyZak = Math.round(totalKg / 25); // 5 x 5kg in 25kg outer sak (colly)
        } else if (weightPerUnit === 1) {
          formattedProdName = `${brandName} @(25X1) KG`;
          outerWeight = 25;
          qtyZak = Math.round(totalKg / 25); // 25 x 1kg in 25kg outer sak (colly)
        } else {
          formattedProdName = `${brandName} @${weightPerUnit} KG`;
          outerWeight = weightPerUnit;
          qtyZak = Math.round(totalKg / weightPerUnit);
        }

        parsedItems.push({
          id: `gcal-it-${idx}-${Date.now()}`,
          product_name: formattedProdName,
          unit: 'ZAK',
          qty: qtyZak,
          weight_per_unit_kg: outerWeight,
          total_kg: totalKg
        });
      }
    });

    const activeItems = parsedItems.length > 0 ? parsedItems : items;
    setItems(activeItems);

    const totalKgSum = activeItems.reduce((acc, it) => acc + (it.total_kg || 0), 0);
    const summaryProd = activeItems.map(it => `${it.product_name} (${it.qty} ${it.unit})`).join(', ');

    const newDO = createDeliveryOrder({
      customer_name: cName,
      brand_aka: bAka,
      customer_phone: customerPhone,
      nopol: nopol || 'S 9302 UN',
      origin_city: originCity || 'Banyuwangi',
      expedition_info: exp,
      delivery_date: deliveryDate,
      notes: `Import Text Google Calendar: ${txt.split('\n')[0]}`,
      items: activeItems,
      product_name: summaryProd,
      total_kg: totalKgSum,
      status: 'RENCANA_JADWAL'
    });

    setShowGCalModal(false);
    alert(`✅ BERHASIL TERBIT! Surat Jalan ${newDO.do_number} untuk "${cName} (${bAka})" (Parsed ${activeItems.length} barang = ${(totalKgSum/1000).toFixed(1)} Ton) LANGSUNG MASUK ke Daftar Surat Jalan & Invoice di panel kanan!`);
  };




  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0f3e2e] text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setRole('ADMIN1'); setActiveScreen('SCREEN_16'); }}
            className="p-2 bg-[#08251b] rounded-xl hover:bg-emerald-900 transition text-emerald-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-emerald-400" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">KONSOL ADMIN 1 - SURAT JALAN & INVOICE PENJUALAN</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Surat Jalan Multi-Item & Sync Kalender Rencana Kerja
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowGCalModal(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-[#0f3e2e] font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow"
          >
            <Calendar className="w-4 h-4 text-[#0f3e2e]" />
            <span>Sync Google Calendar</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Input Multi-Item DO vs List Surat Jalan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Input Surat Jalan Multi-Item */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Buat Surat Jalan (DO Multi-Item) & Jadwal Kirim</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                Format Presisi Excel
              </span>
            </h2>

            <form onSubmit={handleSubmitDO} className="space-y-6">
              {/* Select Customer Master */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Master Customer (Otomatis Isi Merek & Ekspedisi):</label>
                <select
                  value={selectedCustId}
                  onChange={(e) => handleSelectCustomer(e.target.value)}
                  className="w-full px-4 py-2.5 bg-amber-50/60 border-2 border-amber-300 rounded-xl font-extrabold text-sm text-[#0f3e2e]"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Nama Customer */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Toko Pembeli / Customer:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BUMI SUBUR SURABAYA"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl font-bold text-sm text-slate-900 outline-none focus:border-[#10b981]"
                  />
                </div>

                {/* Brand / Merek AKA */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">UNTUK / MEREK (AKA):</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: DM"
                    value={brandAka}
                    onChange={(e) => setBrandAka(e.target.value)}
                    className="w-full px-4 py-2.5 bg-amber-50 border-2 border-amber-400 rounded-xl font-extrabold text-sm text-[#0f3e2e] uppercase text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Kota Asal / Header */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kota Asal Surat Jalan:</label>
                  <select
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
                  >
                    <option value="Banyuwangi">Banyuwangi</option>
                    <option value="Wonosobo">Wonosobo</option>
                  </select>
                </div>

                {/* Nopol Kendaraan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nopol Kendaraan Truk:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT. MU S 9302 UN"
                    value={nopol}
                    onChange={(e) => setNopol(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-xs text-[#0f3e2e] uppercase"
                  />
                </div>

                {/* Telp Customer */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">TELP Customer:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081 833 4998"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Information Ekspedisi / Depo Tujuan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">KEPADA YTH / Alamat Ekspedisi:</label>
                  <textarea
                    rows={3}
                    placeholder="EXP. CARAVAN (P. MATHIAS)..."
                    value={expeditionInfo}
                    onChange={(e) => setExpeditionInfo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  ></textarea>
                </div>

                {/* Tanggal & Notes */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Pengiriman (Kalender):</label>
                    <input
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Rencana muat pagi jam 09.00..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Rincian Multi-Item Surat Jalan (Rencana Barang Jadi) */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-[#10b981]" />
                    <span className="text-sm font-extrabold text-slate-900">
                      Rincian Barang Jadi Surat Jalan (Bisa Banyak Item):
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    Total: {calculateGrandTotalKg().toLocaleString('id-ID')} KG
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-400 w-6">#{idx + 1}</span>

                      {/* Nama Produk */}
                      <input
                        type="text"
                        required
                        placeholder="Merek & Jenis Beras (misal: CAP PUTRI THAILAND @(5X10) KG)..."
                        value={item.product_name}
                        onChange={(e) => handleItemChange(idx, 'product_name', e.target.value)}
                        className="flex-1 px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />

                      {/* Qty & Satuan */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          required
                          step="any"
                          placeholder="Jumlah Qty..."
                          value={item.qty || ''}
                          onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                          className="w-24 px-2.5 py-2 text-xs font-extrabold text-right border border-slate-300 rounded-lg"
                        />

                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="px-2 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg"
                        >
                          <option value="ZAK">ZAK</option>
                          <option value="SAK">SAK</option>
                          <option value="KG">KG</option>
                          <option value="TON">TON</option>
                        </select>

                        {(item.unit === 'SAK' || item.unit === 'ZAK') && (
                          <input
                            type="number"
                            placeholder="KG/Sak"
                            value={item.weight_per_unit_kg || 50}
                            onChange={(e) => handleItemChange(idx, 'weight_per_unit_kg', e.target.value)}
                            className="w-20 px-2 py-2 text-xs font-bold border border-slate-300 rounded-lg text-center"
                            title="Berat per Sak (KG)"
                          />
                        )}
                      </div>

                      <div className="w-28 text-right font-extrabold text-xs text-[#0f3e2e]">
                        {item.total_kg?.toLocaleString('id-ID')} KG
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
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
                  onClick={handleAddItemRow}
                  className="text-xs text-[#10b981] font-bold hover:underline flex items-center space-x-1 pt-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Baris Barang Jadi</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#0f3e2e] hover:bg-emerald-900 text-white font-extrabold text-base rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
              >
                <Printer className="w-5 h-5 text-amber-400" />
                <span>SIMPAN SURAT JALAN & SYNC RENCANA KERJA</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: List Surat Jalan & Tagihan Invoice */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex justify-between items-center">
              <span>Daftar Surat Jalan & Invoice</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                {deliveryOrders.length} DO
              </span>
            </h3>

            <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
              {deliveryOrders.map((doItem) => (
                <div key={doItem.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-slate-900 text-sm">{doItem.customer_name}</span>
                        {doItem.brand_aka && (
                          <span className="text-[10px] font-extrabold bg-amber-400 text-[#0f3e2e] px-1.5 py-0.2 rounded font-mono">
                            {doItem.brand_aka}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-[#10b981]">{doItem.do_number}</span>
                    </div>

                    {/* Status Badge — Clickable for RENCANA_JADWAL */}
                    {(doItem.status === 'RENCANA_JADWAL' || !doItem.status) ? (
                      <button
                        type="button"
                        onClick={() => {
                          setShipTargetDO(doItem);
                          setActualShipDate(new Date().toISOString().split('T')[0]);
                          setShowShipModal(true);
                        }}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 hover:bg-blue-200 active:bg-blue-300 transition border border-blue-200 cursor-pointer"
                        title="Klik untuk konfirmasi pengiriman"
                      >
                        RENCANA_JADWAL ✎
                      </button>
                    ) : (doItem.status as string) === 'TERKIRIM' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                        ✓ TERKIRIM {(doItem as any).actual_ship_date ? `(${(doItem as any).actual_ship_date})` : ''}
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        doItem.status === 'DI_MUAT_TRUK' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {doItem.status}
                      </span>
                    )}
                  </div>

                  {/* Nopol & Ekspedisi & Catatan Penerima Akhir Summary */}
                  <div className="text-[11px] text-slate-600 font-medium space-y-0.5 bg-white p-2 rounded-lg border border-slate-200">
                    <div><strong>Nopol:</strong> {doItem.nopol || 'S 9302 UN'}</div>
                    <div className="truncate"><strong>Expedisi:</strong> {doItem.expedition_info?.split('\n')[0] || '-'}</div>
                    {doItem.notes && (
                      <div className="text-[10px] text-emerald-900 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200 mt-1">
                        <strong>Catatan Kirim / Receiver:</strong> {doItem.notes}
                      </div>
                    )}
                  </div>

                  {/* Item List Summary */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1">
                    <span className="font-bold text-slate-700 block">Rincian Barang Terkirim:</span>
                    {doItem.items && doItem.items.length > 0 ? (
                      <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                        {doItem.items.map((it, i) => (
                          <li key={i}>{it.product_name} — <strong>{it.qty} {it.unit}</strong> ({it.total_kg?.toLocaleString('id-ID')} KG)</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-600">{doItem.product_name}</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold pt-1">
                    <span className="text-slate-500">Total Berat:</span>
                    <span className="text-[#0f3e2e] font-extrabold text-sm">{doItem.total_kg?.toLocaleString('id-ID')} KG</span>
                  </div>

                  {/* Invoice Status & Price setting — hidden if TERKIRIM */}
                  {(doItem.status as string) === 'TERKIRIM' ? (
                    <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex justify-between items-center text-xs">
                      <span className="text-emerald-800 font-bold text-[11px]">✓ Sudah Terkirim — Invoice di Owner</span>
                      <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded font-bold">{(doItem as any).actual_ship_date || '-'}</span>
                    </div>
                  ) : doItem.total_invoice_amount ? (
                    <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">INVOICE: {doItem.invoice_number}</span>
                        <span className="font-extrabold text-[#0f3e2e]">{formatRp(doItem.total_invoice_amount)}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded font-bold">LUNAS/TEMPO</span>
                    </div>
                  ) : (
                    role === 'OWNER' && (
                      <div className="pt-2 border-t space-y-2">
                        <span className="text-[11px] font-bold text-amber-800 block">Owner Penetapan Harga Jual / Invoice:</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            placeholder="Harga per KG..."
                            value={ownerPriceInput[doItem.id] || ''}
                            onChange={(e) => setOwnerPriceInput({ ...ownerPriceInput, [doItem.id]: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-xs font-bold outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSetSellingPrice(doItem.id)}
                            className="px-3 py-1.5 bg-[#f59e0b] hover:bg-amber-600 text-[#0f3e2e] font-extrabold rounded text-xs shrink-0"
                          >
                            Set Invoice
                          </button>
                        </div>
                      </div>
                    )
                  )}

                  <div className="flex items-center justify-between pt-1 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setSplitTargetDO(doItem);
                        setShowSplitModal(true);
                      }}
                      className="text-[11px] text-amber-700 font-extrabold hover:underline flex items-center space-x-1"
                    >
                      <Split className="w-3.5 h-3.5" />
                      <span>Split PO ke 2 Truk</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setViewDOModal(doItem);
                        setPrintTab('SURAT_JALAN');
                      }}
                      className="text-xs text-[#10b981] font-bold hover:underline flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Format Excel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ship Confirmation Modal */}
      {showShipModal && shipTargetDO && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border-4 border-emerald-600">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-[#0f3e2e] text-base flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Konfirmasi Pengiriman</span>
              </h3>
              <button onClick={() => setShowShipModal(false)} className="text-slate-400 text-xl">✕</button>
            </div>

            <div className="text-sm text-slate-600 space-y-1">
              <p>DO: <strong className="text-[#0f3e2e]">{shipTargetDO.do_number}</strong></p>
              <p>Customer: <strong>{shipTargetDO.customer_name}</strong></p>
              <p>Total: <strong>{shipTargetDO.total_kg?.toLocaleString('id-ID')} KG</strong></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Pengiriman Real:</label>
              <input
                type="date"
                value={actualShipDate}
                onChange={(e) => setActualShipDate(e.target.value)}
                className="w-full px-3 py-2 border-2 border-emerald-300 rounded-xl font-bold text-sm text-[#0f3e2e]"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmShip}
                className="flex-1 py-3 bg-emerald-600 text-white font-extrabold text-sm rounded-xl shadow"
              >
                ✓ Konfirmasi TERKIRIM
              </button>
              <button
                type="button"
                onClick={() => setShowShipModal(false)}
                className="px-4 py-3 bg-slate-200 text-slate-700 font-bold text-sm rounded-xl"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Split PO to Multi-Truck Modal */}
      {showSplitModal && splitTargetDO && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-4 border-[#0f3e2e]">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-[#0f3e2e] text-base flex items-center space-x-2">
                <Split className="w-5 h-5 text-amber-500" />
                <span>Pecah PO 1 Order ke 2 Truk Berbeda</span>
              </h3>
              <button onClick={() => setShowSplitModal(false)} className="text-slate-400">✕</button>
            </div>

            <p className="text-xs text-slate-600">
              Order PO <strong>{splitTargetDO.customer_name}</strong> berkapasitas <strong>{(splitTargetDO.total_kg / 1000).toFixed(1)} Ton</strong> dapat dipecah menjadi 2 Surat Jalan armada truk berbeda:
            </p>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0f3e2e]">Truk 1 (Armada A):</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nopol Truk 1"
                    value={truk1Nopol}
                    onChange={(e) => setTruk1Nopol(e.target.value)}
                    className="px-3 py-1.5 bg-white border rounded-lg font-bold uppercase"
                  />
                  <input
                    type="number"
                    placeholder="Kapasitas (Ton)"
                    value={truk1CapTon}
                    onChange={(e) => setTruk1CapTon(parseFloat(e.target.value) || 0)}
                    className="px-3 py-1.5 bg-white border rounded-lg font-bold text-right"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0f3e2e]">Truk 2 (Armada B - Sisa):</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nopol Truk 2"
                    value={truk2Nopol}
                    onChange={(e) => setTruk2Nopol(e.target.value)}
                    className="px-3 py-1.5 bg-white border rounded-lg font-bold uppercase"
                  />
                  <div className="px-3 py-1.5 bg-slate-200 border rounded-lg font-extrabold text-right text-slate-700">
                    {Math.max(0, (splitTargetDO.total_kg / 1000) - truk1CapTon).toFixed(1)} Ton
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={handleExecuteSplitPO}
                className="flex-1 py-3 bg-[#0f3e2e] text-white font-extrabold text-xs rounded-xl shadow"
              >
                Eksekusi Split Surat Jalan
              </button>
              <button
                type="button"
                onClick={() => setShowSplitModal(false)}
                className="px-4 py-3 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Calendar Sync Modal */}
      {showGCalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 border-4 border-[#0f3e2e] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="font-extrabold text-[#0f3e2e] text-base flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <span>Sync Google Calendar Order Konsumen</span>
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                  Akun: juwitasriwulandari@gmail.com
                </span>
              </div>
              <button onClick={() => setShowGCalModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* Event List Selector matching Juwita's Google Calendar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-extrabold text-slate-800">
                  Daftar Event Kalender Juwita (Format: [Waktu] [Merek] [Ton] BM):
                </label>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  September &amp; Oktober 2026
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {/* Event: 21 Sep 2026 - bcamp 25 BM */}
                <div className="bg-emerald-50 border-2 border-emerald-400 p-3.5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-extrabold text-[#0f3e2e] block">
                        9am bcamp 25 BM (Rencana Kirim BCAMP)
                      </span>
                      <span className="text-[10px] font-bold bg-amber-400 text-[#0f3e2e] px-1.5 py-0.2 rounded font-mono">
                        Merek: BCAMP / DM — Total: 25 Ton (25.000 KG)
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded">
                      21 Sep 2026 (Hari Ini)
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-emerald-200">
                    <div><strong>Customer:</strong> BUMI SUBUR SURABAYA</div>
                    <div><strong>Expedisi:</strong> EXP. CARAVAN (P. MATHIAS) GD DIPO KALIANAK</div>
                    <div><strong>Rincian Real Juwita (25 Ton):</strong> Betet @10 (5t), Betet @20 (100sak), Betet @25 (400sak), P.Thai @5 (3t), P.Thai @10 (5t)</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleImportPresetGCal({
                      title: 'bcamp 25 BM',
                      customer_name: 'BUMI SUBUR SURABAYA',
                      brand_aka: 'BCAMP',
                      phone: '081 833 4998',
                      date: '2026-09-21',
                      expedition_info: 'EXP. CARAVAN (P. MATHIAS)\nGD. DIPO CARAVAN\nJL. KALIANAK 55 BLOK QQ NO. 9 SURABAYA',
                      notes: 'Kalender Juwita: 9am bcamp 25 BM (21 Sep 2026)',
                      items: [
                        { id: 'it-1', product_name: 'Beras Cap Betet @10 KG', unit: 'ZAK', qty: 500, weight_per_unit_kg: 10, total_kg: 5000 },
                        { id: 'it-2', product_name: 'Beras Cap Betet @20 KG', unit: 'ZAK', qty: 100, weight_per_unit_kg: 20, total_kg: 2000 },
                        { id: 'it-3', product_name: 'Beras Cap Betet @25 KG', unit: 'ZAK', qty: 400, weight_per_unit_kg: 25, total_kg: 10000 },
                        { id: 'it-4', product_name: 'Beras Cap Putri Thailand @5 KG', unit: 'ZAK', qty: 600, weight_per_unit_kg: 5, total_kg: 3000 },
                        { id: 'it-5', product_name: 'Beras Cap Putri Thailand @10 KG', unit: 'ZAK', qty: 500, weight_per_unit_kg: 10, total_kg: 5000 }
                      ]
                    })}
                    className="w-full py-2.5 bg-[#0f3e2e] hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow flex items-center justify-center space-x-1.5"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>📥 Klik 1-Kali: Auto-Fill &amp; Terbitkan Surat Jalan Ini</span>
                  </button>
                </div>

                {/* Event: 22 Sep 2026 - RBN 25 BM */}
                <div className="bg-slate-50 border border-slate-300 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">
                        9am RBN 25 BM
                      </span>
                      <span className="text-[10px] font-bold bg-amber-400 text-[#0f3e2e] px-1.5 py-0.2 rounded font-mono">
                        Merek: RBN — Total: 25 Ton (25.000 KG)
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                      22 Sep 2026
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border">
                    <div><strong>Customer:</strong> TOKO RBN SEMBAKO SURABAYA</div>
                    <div><strong>Items:</strong> Cap Pandan @(5x10) KG (500 Sak = 25.000 KG)</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleImportPresetGCal({
                      title: 'RBN 25 BM',
                      customer_name: 'TOKO RBN SEMBAKO SURABAYA',
                      brand_aka: 'RBN',
                      phone: '081399887766',
                      date: '2026-09-22',
                      expedition_info: 'EXP. DIPO OSOWILANGUN SURABAYA',
                      notes: 'Sync dari Kalender Juwita: 9am RBN 25 BM (22 Sep 2026)',
                      items: [
                        { id: 'it-1', product_name: 'BERAS PREMIUM CAP PANDAN @(5X10) KG', unit: 'ZAK', qty: 500, weight_per_unit_kg: 50, total_kg: 25000 }
                      ]
                    })}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow flex items-center justify-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>📥 Klik 1-Kali: Auto-Fill Form Surat Jalan Ini</span>
                  </button>
                </div>

                {/* Event: 24 Sep 2026 - FNB 25 BM */}
                <div className="bg-slate-50 border border-slate-300 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">
                        9am FNB 25 BM
                      </span>
                      <span className="text-[10px] font-bold bg-amber-400 text-[#0f3e2e] px-1.5 py-0.2 rounded font-mono">
                        Merek: FNB — Total: 25 Ton (25.000 KG)
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                      24 Sep 2026
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border">
                    <div><strong>Customer:</strong> FNB DISTRIBUTOR SEMBAKO</div>
                    <div><strong>Items:</strong> Cap Putri Thailand 50KG (500 Sak = 25.000 KG)</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleImportPresetGCal({
                      title: 'FNB 25 BM',
                      customer_name: 'FNB DISTRIBUTOR SEMBAKO',
                      brand_aka: 'FNB',
                      phone: '085211223344',
                      date: '2026-09-24',
                      expedition_info: 'EXP. KALIANAK BLOK BB NO. 12 SURABAYA',
                      notes: 'Sync dari Kalender Juwita: 9am FNB 25 BM (24 Sep 2026)',
                      items: [
                        { id: 'it-1', product_name: 'BERAS PREMIUM CAP PUTRI THAILAND @50 KG', unit: 'ZAK', qty: 500, weight_per_unit_kg: 50, total_kg: 25000 }
                      ]
                    })}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow flex items-center justify-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>📥 Klik 1-Kali: Auto-Fill Form Surat Jalan Ini</span>
                  </button>
                </div>

                {/* Event: 16 Sep 2026 - win 15 BM */}
                <div className="bg-slate-50 border border-slate-300 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">
                        9am win 15 BM
                      </span>
                      <span className="text-[10px] font-bold bg-amber-400 text-[#0f3e2e] px-1.5 py-0.2 rounded font-mono">
                        Merek: WIN 15 — Total: 15 Ton (15.000 KG)
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                      16 Sep 2026
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border">
                    <div><strong>Customer:</strong> UD TERUS JAYA SURABAYA</div>
                    <div><strong>Items:</strong> Cap Putri Thailand 50KG (300 Sak = 15.000 KG)</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleImportPresetGCal({
                      title: 'win 15 BM',
                      customer_name: 'UD TERUS JAYA SURABAYA',
                      brand_aka: 'WIN 15',
                      phone: '081233445566',
                      date: '2026-09-16',
                      expedition_info: 'EXP. DIPO OSOWILANGUN BLOK B3 SURABAYA',
                      notes: 'Sync dari Kalender Juwita: 9am win 15 BM (16 Sep 2026)',
                      items: [
                        { id: 'it-1', product_name: 'BERAS PREMIUM CAP PUTRI THAILAND @50 KG', unit: 'ZAK', qty: 300, weight_per_unit_kg: 50, total_kg: 15000 }
                      ]
                    })}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow flex items-center justify-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>📥 Klik 1-Kali: Auto-Fill Form Surat Jalan Ini</span>
                  </button>
                </div>
              </div>
            </div>


            {/* Custom Text Paste & Auto-Parse */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="block text-xs font-extrabold text-slate-700">
                Atau Paste Catatan Event / Deskripsi Kalender:
              </label>
              <textarea
                rows={4}
                value={gcalInputText}
                onChange={(e) => setGcalInputText(e.target.value)}
                placeholder="Paste deskripsi event dari Google Calendar di sini..."
                className="w-full px-3 py-2 bg-amber-50/50 border border-amber-300 rounded-xl font-mono text-xs font-bold text-slate-800"
              ></textarea>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleParseGCalText}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-[#0f3e2e] font-extrabold text-xs rounded-xl shadow flex items-center justify-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>🪄 Auto-Parse &amp; Import Text ke Form</span>
                </button>

                <a
                  href="https://calendar.google.com/calendar"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Buka Calendar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Print Surat Jalan & Faktur Penjualan (Exact Excel Match) Modal */}
      {viewDOModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 border-4 border-[#0f3e2e] max-h-[90vh] overflow-y-auto">
            {/* Modal Header Tabs */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPrintTab('SURAT_JALAN')}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition ${
                    printTab === 'SURAT_JALAN' ? 'bg-[#0f3e2e] text-white shadow' : 'text-slate-600'
                  }`}
                >
                  FORMAT SURAT JALAN
                </button>
                <button
                  type="button"
                  onClick={() => setPrintTab('FAKTUR')}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition ${
                    printTab === 'FAKTUR' ? 'bg-[#0f3e2e] text-white shadow' : 'text-slate-600'
                  }`}
                >
                  FORMAT FAKTUR PENJUALAN
                </button>
              </div>
              <button onClick={() => setViewDOModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* TAB 1: EXACT MATCH SURAT JALAN EXCEL (Tujuan Ekspedisi + Merek Konsumen) */}
            {printTab === 'SURAT_JALAN' && (
              <div className="border-2 border-slate-400 p-6 rounded-2xl font-mono text-xs space-y-4 bg-white shadow-inner">
                {/* Header Row: City Date vs KEPADA YTH (NAMA EKSPEDISI) */}
                <div className="flex justify-between items-start border-b-2 border-black pb-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-wider">SURAT JALAN</h2>
                    <div className="text-xs font-bold text-slate-700 mt-1">No. {viewDOModal.do_number}</div>
                  </div>

                  <div className="text-right text-[11px] font-bold">
                    <div className="mb-1">{viewDOModal.origin_city || 'Banyuwangi'}, {viewDOModal.delivery_date || '08/09/2026'}</div>
                    <div className="text-slate-900 uppercase font-extrabold text-xs">KEPADA YTH (EKSPEDISI PENERIMA):</div>
                    <div className="whitespace-pre-line font-extrabold text-slate-900 text-xs bg-slate-100 p-1.5 rounded border border-slate-300 mt-0.5">
                      {viewDOModal.expedition_info || 'EXP. CARAVAN (P. MATHIAS)\nGD. DIPO CARAVAN\nJL. KALIANAK 55 BLOK QQ NO. 9 SURABAYA'}
                    </div>
                  </div>
                </div>

                {/* Subheader Vehicle Row */}
                <div className="text-xs font-bold text-slate-800 py-1 border-b border-slate-300 flex justify-between">
                  <span>Bersama ini kendaraan <span className="underline font-extrabold text-slate-900">{viewDOModal.nopol || 'PT.MU S 9302 UN'}</span> Kami ada kiriman barang2 tersebut di bawah ini.</span>
                </div>

                {/* Table Items */}
                <table className="w-full text-left border-collapse my-2">
                  <thead>
                    <tr className="border-t-2 border-b-2 border-black text-xs font-extrabold">
                      <th className="py-2 w-28">Banyaknya</th>
                      <th className="py-2">NAMA BARANG</th>
                      <th className="py-2 text-right">TOTAL (KG)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewDOModal.items && viewDOModal.items.length > 0 ? (
                      viewDOModal.items.map((it, idx) => (
                        <tr key={idx} className="border-b border-slate-200 text-xs">
                          <td className="py-1.5 font-bold">{it.qty} {it.unit}</td>
                          <td className="py-1.5 font-bold uppercase">{it.product_name} =</td>
                          <td className="py-1.5 text-right font-extrabold">{it.total_kg?.toLocaleString('id-ID')} KG</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-slate-200 text-xs">
                        <td className="py-1.5 font-bold">1 BATCH</td>
                        <td className="py-1.5 font-bold uppercase">{viewDOModal.product_name} =</td>
                        <td className="py-1.5 text-right font-extrabold">{viewDOModal.total_kg?.toLocaleString('id-ID')} KG</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Footer Brand AKA & Pembayar */}
                <div className="pt-2 border-t-2 border-black flex justify-between items-center text-xs font-bold">
                  <div>
                    <div>UNTUK / MEREK : <span className="font-extrabold text-slate-900 text-sm bg-amber-200 px-1 rounded">{viewDOModal.brand_aka || 'DM'}</span></div>
                    <div>KONSUMEN PEMBAYAR : <span className="font-bold text-slate-700">{viewDOModal.customer_name}</span></div>
                    <div>TELP : <span>{viewDOModal.customer_phone || '081 833 4998'}</span></div>
                  </div>
                  <div className="text-right font-extrabold text-sm text-[#0f3e2e]">
                    TOTAL NETTO: {viewDOModal.total_kg?.toLocaleString('id-ID')} KG
                  </div>
                </div>

                {/* Signature Blocks */}
                <div className="flex justify-between pt-6 text-center text-xs font-bold">
                  <div className="w-40">
                    Tanda tangan sipenerima
                    <div className="h-14"></div>
                    (.......................................)
                  </div>
                  <div className="w-40">
                    Hormat kami,
                    <div className="h-14"></div>
                    ( PP BUMI MAS )
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EXACT MATCH FAKTUR PENJUALAN EXCEL (Nama Pembayar Utama + Note Penerima/Merek) */}
            {printTab === 'FAKTUR' && (
              <div className="border-2 border-slate-400 p-6 rounded-2xl font-mono text-xs space-y-4 bg-white shadow-inner">
                {/* Header Row */}
                <div className="flex justify-between items-start border-b-2 border-black pb-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-wider">FAKTUR PENJUALAN</h2>
                    <div className="text-sm font-extrabold text-[#0f3e2e]">BUMI MAS WONOSOBO</div>
                  </div>

                  <div className="text-right text-[11px] font-bold">
                    <div>WONOSOBO, {viewDOModal.delivery_date || '08/09/2026'}</div>
                    <div>Kepada Yth / Pembayar: <span className="font-extrabold text-slate-900 text-sm">{viewDOModal.customer_name}</span></div>
                    <div className="text-amber-800 font-extrabold mt-1">NOTA MEREK: {viewDOModal.brand_aka || 'DM'} ({viewDOModal.invoice_number || 'INV-2026-088'})</div>
                  </div>
                </div>

                {/* Table Items with Prices */}
                <table className="w-full text-left border-collapse my-2">
                  <thead>
                    <tr className="border-t-2 border-b-2 border-black text-xs font-extrabold">
                      <th className="py-2 w-24">Banyaknya</th>
                      <th className="py-2">NAMA BARANG</th>
                      <th className="py-2 text-right">Harga</th>
                      <th className="py-2 text-right">JUMLAH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewDOModal.items && viewDOModal.items.length > 0 ? (
                      viewDOModal.items.map((it, idx) => {
                        const price = viewDOModal.selling_price_per_kg || 14500;
                        const subtotal = (it.total_kg || 0) * price;
                        return (
                          <tr key={idx} className="border-b border-slate-200 text-xs">
                            <td className="py-1.5 font-bold">{it.qty} {it.unit}</td>
                            <td className="py-1.5 font-bold uppercase">{it.product_name} = {it.total_kg?.toLocaleString('id-ID')} KG</td>
                            <td className="py-1.5 text-right">{formatRp(price)}</td>
                            <td className="py-1.5 text-right font-extrabold">{formatRp(subtotal)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="border-b border-slate-200 text-xs">
                        <td className="py-1.5 font-bold">1 BATCH</td>
                        <td className="py-1.5 font-bold uppercase">{viewDOModal.product_name}</td>
                        <td className="py-1.5 text-right">{formatRp(viewDOModal.selling_price_per_kg || 14500)}</td>
                        <td className="py-1.5 text-right font-extrabold">{formatRp(viewDOModal.total_invoice_amount || 145000000)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Note Khusus Pengiriman Luar Pulau / Penerima Akhir */}
                <div className="pt-2 border-t border-slate-300 text-[11px] space-y-1">
                  <div className="font-extrabold text-slate-800">CATATAN PENGIRIMAN &amp; PENERIMA AKHIR:</div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-800 leading-relaxed font-mono">
                    <div>• Merek / Nota Pembeli: <strong className="text-slate-900 font-extrabold bg-amber-200 px-1 rounded">{viewDOModal.brand_aka || 'DM'}</strong></div>
                    <div>• Alamat Ekspedisi Tujuan: <strong>{viewDOModal.expedition_info?.replace(/\n/g, ' - ')}</strong></div>
                    {viewDOModal.notes && <div>• Catatan Tambahan: {viewDOModal.notes}</div>}
                  </div>
                </div>

                {/* Total Summary */}
                <div className="pt-2 border-t-2 border-black flex justify-between items-center text-sm font-extrabold">
                  <div className="text-slate-600">TERIMA KASIH</div>
                  <div className="text-right text-lg text-[#0f3e2e]">
                    TOTAL INVOICE: {formatRp(viewDOModal.total_invoice_amount || (viewDOModal.total_kg * 14500))}
                  </div>
                </div>
              </div>
            )}

            {/* Print Modal Footer Buttons */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setViewDOModal(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-[#0f3e2e] text-white font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Cetak PDF / Printer (100% Excel Presisi)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
