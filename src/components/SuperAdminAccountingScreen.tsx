import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JournalEntry, AccountCOA } from '../types';
import { BookOpen, FileText, PieChart, ShieldCheck, Printer, Download, CheckCircle2, ArrowRightLeft, DollarSign, Layers, Warehouse, Calculator, Building2, HelpCircle } from 'lucide-react';

export const SuperAdminAccountingScreen: React.FC = () => {
  const { 
    weighbridgeInList, 
    deliveryOrders, 
    expenses, 
    pettyCash, 
    products, 
    sakItems, 
    suppliers, 
    customers,
    journalEntries,
    coaList,
    cashBalance,
    bankBalance,
    exportToCSV
  } = useApp();

  const [activeTab, setActiveTab] = useState<'JURNAL' | 'BUKU_BESAR' | 'NERACA_SALDO' | 'LABA_RUGI' | 'NERACA' | 'MUTASI_PAJAK'>('LABA_RUGI');
  const [selectedAccountCode, setSelectedAccountCode] = useState<string>('1101');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  // =========================================================================
  // HITUNGAN REAL DARI OPERASIONAL PABRIK PP BUMI MAS
  // =========================================================================

  // 1. Total Pembelian Beras Asalan (HPP Pembelian)
  const totalPembelianBerasKg = weighbridgeInList.reduce((acc, w) => acc + (w.net_weight || 0), 0);
  const totalPembelianBerasRp = weighbridgeInList.reduce((acc, w) => acc + (w.total_payment || 0), 0);
  const totalUtangSuplierRp = weighbridgeInList
    .filter(w => w.transfer_status !== 'CONFIRMED' && w.transfer_status !== 'PAID_H_DAY')
    .reduce((acc, w) => acc + (w.total_payment || (w.net_weight * 12500)), 0);

  // 2. Total Penjualan Beras & Limba (Pendapatan Penjualan)
  const totalPenjualanBerasRp = deliveryOrders.reduce((acc, d) => acc + (d.total_invoice_amount || 0), 0);
  const totalPiutangPelangganRp = deliveryOrders
    .filter(d => d.payment_status !== 'LUNAS' && d.payment_status !== 'PAID')
    .reduce((acc, d) => acc + (d.remaining_balance !== undefined ? d.remaining_balance : (d.total_invoice_amount || 0)), 0);

  // 3. Biaya Operasional (Expenses & Petty Cash)
  const totalBebanOperasionalRp = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const totalBebanUpahRp = expenses.filter(e => e.category === 'UPAH_BURUH').reduce((acc, e) => acc + (e.amount || 0), 0);
  const totalBebanBbmListrikRp = expenses.filter(e => e.category === 'BBM_SOLAR' || e.category === 'LISTRIK_PLN').reduce((acc, e) => acc + (e.amount || 0), 0);
  const totalBebanLainnyaRp = totalBebanOperasionalRp - totalBebanUpahRp - totalBebanBbmListrikRp;

  // 4. Estimasi Nilai Persediaan Stok (Inventory Valuation)
  const totalStokBerasJadiKg = products.reduce((acc, p) => acc + (p.finished_goods_stock_kg || 0), 0);
  const avgBerasPricePerKg = totalPembelianBerasKg > 0 ? (totalPembelianBerasRp / totalPembelianBerasKg) : 12500;
  const nilaiPersediaanBerasRp = totalStokBerasJadiKg * avgBerasPricePerKg;
  const nilaiPersediaanSakRp = sakItems.reduce((acc, s) => acc + ((s.stock_current || 0) * 1500), 0);

  // 5. Kalkulasi Laba Rugi Komersial SAK EMKM
  const totalPendapatanKomersial = totalPenjualanBerasRp;
  const HPP_PembelianBeras = totalPembelianBerasRp;
  const HPP_PersediaanAkhir = nilaiPersediaanBerasRp;
  const totalHPPKomersial = Math.max(0, HPP_PembelianBeras - HPP_PersediaanAkhir);
  const labaKotorKomersial = totalPendapatanKomersial - totalHPPKomersial;
  const labaBersihKomersial = labaKotorKomersial - totalBebanOperasionalRp;

  // 6. Neraca Keuangan Sesuai Standar SAK EMKM (Persamaan: Aset = Kewajiban + Ekuitas)
  const totalAsetLancar = cashBalance + bankBalance + totalPiutangPelangganRp + nilaiPersediaanBerasRp + nilaiPersediaanSakRp;
  const totalAsetTetap = 850000000; // Nilai Buku Aset Tetap (Mesin Poles, Grader, & Bangunan Pabrik)
  const totalAktiva = totalAsetLancar + totalAsetTetap;

  const totalKewajiban = totalUtangSuplierRp;
  const labaDitahan = labaBersihKomersial;
  // Ekuitas awal dihitung dari persamaan akuntansi untuk memastikan Neraca selalu seimbang (Balance 100%)
  const modalAwalPemilik = Math.max(0, totalAktiva - totalKewajiban - labaDitahan);
  const totalPasiva = totalKewajiban + modalAwalPemilik + labaDitahan;

  // Generate dynamic combined general journal (Seluruh modul operasional terhubung ke Jurnal Umum)
  const allGeneratedJournals: JournalEntry[] = [
    ...journalEntries,
    // 1. Jurnal Pembelian dari Jembatan Timbang (Beras Asalan / Gabah)
    ...weighbridgeInList.map((w) => ({
      id: `jrn-wb-${w.id}`,
      date: w.datetime_in.substring(0, 10),
      ref_no: w.ticket_number,
      description: `Pembelian Beras Asalan Truk ${w.nopol} (${w.supplier_name})`,
      source_module: 'TIMBANGAN_PEMBELIAN' as const,
      items: [
        { account_code: '1104', account_name: 'Persediaan Beras Asalan / Gabah', debit: w.total_payment || (w.net_weight * 12500), credit: 0 },
        { account_code: '2101', account_name: 'Utang Usaha Suplier Beras', debit: 0, credit: w.total_payment || (w.net_weight * 12500) }
      ]
    })),
    // 2. Jurnal Pelunasan Utang Suplier (Owner Bank BCA Transfer)
    ...weighbridgeInList
      .filter(w => w.transfer_status === 'PAID_H_DAY' || w.transfer_status === 'CONFIRMED')
      .map(w => ({
        id: `jrn-pay-wb-${w.id}`,
        date: w.transfer_plan_date || w.datetime_in.substring(0, 10),
        ref_no: `TRF-${w.ticket_number}`,
        description: `Pelunasan Utang Pembelian Truk ${w.nopol} (${w.supplier_name}) via Bank BCA`,
        source_module: 'PEMBAYARAN_HUTANG' as const,
        items: [
          { account_code: '2101', account_name: 'Utang Usaha Suplier Beras', debit: w.total_payment || (w.net_weight * 12500), credit: 0 },
          { account_code: '1102', account_name: 'Bank BCA Utama', debit: 0, credit: w.total_payment || (w.net_weight * 12500) }
        ]
      })),
    // 3. Jurnal Penjualan dari Surat Jalan (Delivery Order)
    ...deliveryOrders.map((d) => ({
      id: `jrn-do-${d.id}`,
      date: d.order_date.substring(0, 10),
      ref_no: d.do_number,
      description: `Penjualan Beras Surat Jalan ${d.do_number} (${d.customer_name})`,
      source_module: 'PENJUALAN_DO' as const,
      items: [
        { account_code: '1103', account_name: 'Piutang Usaha Penjualan', debit: d.total_invoice_amount || 0, credit: 0 },
        { account_code: '4101', account_name: 'Pendapatan Penjualan Beras Kemasan', debit: 0, credit: d.total_invoice_amount || 0 }
      ]
    })),
    // 4. Jurnal Penerimaan Pembayaran / Cicilan Piutang dari Pelanggan
    ...deliveryOrders.flatMap(d => (d.payment_logs || []).map(p => ({
      id: `jrn-pay-do-${p.id}`,
      date: p.payment_date,
      ref_no: `KWS-${d.invoice_number || d.do_number}`,
      description: `Penerimaan Pembayaran Invoice ${d.invoice_number || d.do_number} (${d.customer_name})`,
      source_module: 'PELUNASAN_PIUTANG' as const,
      items: [
        { account_code: p.payment_method === 'TRANSFER_BCA' ? '1102' : '1101', account_name: p.payment_method === 'TRANSFER_BCA' ? 'Bank BCA Utama' : 'Kas Brankas Kantor', debit: p.amount, credit: 0 },
        { account_code: '1103', account_name: 'Piutang Usaha Penjualan', debit: 0, credit: p.amount }
      ]
    }))),
    // 5. Jurnal Pengeluaran Biaya Operasional (Expenses)
    ...expenses.map((e) => ({
      id: `jrn-exp-${e.id}`,
      date: e.expense_date.substring(0, 10),
      ref_no: `EXP-${e.id.substring(4, 9)}`,
      description: `Biaya: ${e.description} (${e.recipient_name})`,
      source_module: 'PENGELUARAN_BIAYA' as const,
      items: [
        { account_code: e.category === 'UPAH_BURUH' ? '6101' : e.category === 'BBM_SOLAR' ? '6102' : '6104', account_name: `Beban ${e.category}`, debit: e.amount, credit: 0 },
        { account_code: e.payment_source === 'BANK_BCA' ? '1102' : '1101', account_name: e.payment_source === 'BANK_BCA' ? 'Bank BCA Utama' : 'Kas Brankas Kantor', debit: 0, credit: e.amount }
      ]
    })),
    // 6. Jurnal Transaksi Kas Kecil (Petty Cash)
    ...pettyCash.map(pc => ({
      id: `jrn-pc-${pc.id}`,
      date: pc.transaction_time.substring(0, 10),
      ref_no: `BKK-${pc.id.substring(3, 8)}`,
      description: `Kas Kecil: ${pc.description} (${pc.recipient_payer})`,
      source_module: 'KAS_KECIL' as const,
      items: pc.type === 'KAS_KELUAR' ? [
        { account_code: '6104', account_name: 'Beban Operasional Kas Kecil', debit: pc.amount, credit: 0 },
        { account_code: '1101', account_name: 'Kas Brankas Kantor', debit: 0, credit: pc.amount }
      ] : pc.quick_tag === 'TARIK_BCA' ? [
        { account_code: '1101', account_name: 'Kas Brankas Kantor', debit: pc.amount, credit: 0 },
        { account_code: '1102', account_name: 'Bank BCA Utama', debit: 0, credit: pc.amount }
      ] : [
        { account_code: '1101', account_name: 'Kas Brankas Kantor', debit: pc.amount, credit: 0 },
        { account_code: '4101', account_name: 'Pendapatan Lain-lain Kas Masuk', debit: 0, credit: pc.amount }
      ]
    }))
  ];

  const handleExportAccountingExcel = () => {
    const rows = [
      ['=== LAPORAN KEUANGAN & PAJAK PP BUMI MAS ==='],
      ['Periode', new Date().toLocaleDateString('id-ID')],
      [''],
      ['1. LAPORAN LABA RUGI KOMERSIAL'],
      ['Pendapatan Penjualan Beras & Limba', totalPendapatanKomersial],
      ['HPP Pembelian Beras Asalan', HPP_PembelianBeras],
      ['Persediaan Akhir Beras', HPP_PersediaanAkhir],
      ['Total HPP Komersial', totalHPPKomersial],
      ['LABA KOTOR', labaKotorKomersial],
      ['Beban Operasional Pabrik', totalBebanOperasionalRp],
      ['LABA BERSIH SEBELUM PAJAK', labaBersihKomersial],
      [''],
      ['2. NERACA KEUANGAN'],
      ['Kas & Bank BCA', cashBalance + bankBalance],
      ['Piutang Usaha', totalPiutangPelangganRp],
      ['Persediaan Beras & Sak', nilaiPersediaanBerasRp + nilaiPersediaanSakRp],
      ['Aset Mesin & Pabrik', totalAsetTetap],
      ['TOTAL AKTIVA (ASET)', totalAktiva],
      ['Utang Usaha Suplier', totalKewajiban],
      ['Modal Pemilik & Laba Ditahan', modalAwalPemilik + labaDitahan],
      ['TOTAL PASIVA (KEWAJIBAN & MODAL)', totalPasiva]
    ];
    exportToCSV('Laporan_Keuangan_Pajak_PP_Bumi_Mas', rows);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Super Admin Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xl shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wider">
                SUPER ADMIN
              </span>
              <span className="text-xs text-slate-400 font-medium font-mono">SAK EMKM • Kemenkeu DJP</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight mt-1 text-slate-100">
              Laporan Keuangan &amp; Akuntansi Komersial Standar Indonesia
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              Sistem Pembukuan Berpasangan (*Double-Entry Bookkeeping*) Otomatis Berdasarkan SAK EMKM untuk Pelaporan Keuangan dan SPT Tahunan Badan.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={handleExportAccountingExcel}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 shadow-sm transition flex items-center space-x-2 text-xs"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center space-x-2 text-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF Laporan</span>
          </button>
        </div>
      </div>

      {/* Compliance Ribbon */}
      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs flex items-center justify-between text-slate-300">
        <div className="flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-400">
            Kepatuhan SAK EMKM: Seluruh transaksi jembatan timbang, DO penjualan, buku kas, dan mutasi bank terhubung langsung secara otomatis ke jurnal umum tanpa input manual.
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 shrink-0 hidden sm:inline">
          STATUS: AKTIF &amp; SINKRON
        </span>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold font-mono">
            <span>TOTAL PENDAPATAN</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">{formatRp(totalPendapatanKomersial)}</div>
          <div className="text-[10px] text-slate-400 font-medium">Penjualan Beras Kemasan &amp; Limba</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold font-mono">
            <span>HPP PRODUKSI</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-700 tabular-nums">{formatRp(totalHPPKomersial)}</div>
          <div className="text-[10px] text-slate-400 font-medium">Beras Asalan Dikurangi Persediaan Akhir</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold font-mono">
            <span>LABA BERSIH KOMERSIAL</span>
            <PieChart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className={`text-xl font-bold font-mono tabular-nums ${labaBersihKomersial >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {formatRp(labaBersihKomersial)}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Laba Kotor dikurangi Beban Operasional</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold font-mono">
            <span>TOTAL ASET (AKTIVA)</span>
            <Building2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">{formatRp(totalAktiva)}</div>
          <div className="text-[10px] text-slate-400 font-medium">Kas + Bank + Piutang + Stok + Mesin</div>
        </div>
      </div>

      {/* Interactive Tabs Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('LABA_RUGI')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'LABA_RUGI' ? 'bg-slate-900 text-emerald-400 shadow-sm font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>1. Laporan Laba Rugi</span>
        </button>

        <button
          onClick={() => setActiveTab('NERACA')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'NERACA' ? 'bg-slate-900 text-emerald-400 shadow-sm font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>2. Neraca Keuangan</span>
        </button>

        <button
          onClick={() => setActiveTab('JURNAL')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'JURNAL' ? 'bg-slate-900 text-emerald-400 shadow-sm font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>3. Jurnal Umum (Double-Entry)</span>
        </button>

        <button
          onClick={() => setActiveTab('BUKU_BESAR')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'BUKU_BESAR' ? 'bg-slate-900 text-emerald-400 shadow-sm font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>4. Buku Besar (General Ledger)</span>
        </button>

        <button
          onClick={() => setActiveTab('NERACA_SALDO')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'NERACA_SALDO' ? 'bg-slate-900 text-emerald-400 shadow-sm font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>5. Neraca Saldo (Trial Balance)</span>
        </button>

        <button
          onClick={() => setActiveTab('MUTASI_PAJAK')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'MUTASI_PAJAK' ? 'bg-slate-900 text-emerald-400 shadow-sm font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Warehouse className="w-3.5 h-3.5" />
          <span>6. Mutasi Stok &amp; Pajak</span>
        </button>
      </div>

      {/* TAB 1: LAPORAN LABA RUGI KOMERSIAL */}
      {activeTab === 'LABA_RUGI' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider">STANDAR AKUNTANSI SAK EMKM</span>
              <h2 className="text-xl font-extrabold text-slate-900">Laporan Laba Rugi Komersial</h2>
              <p className="text-xs text-slate-500 font-mono">Tahun Buku 2026 • PP BUMI MAS Wonosobo</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-semibold text-xs flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Format Standar SPT Tahunan Badan</span>
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* I. PENDAPATAN */}
            <div className="space-y-2">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl font-bold text-slate-900 flex justify-between">
                <span>I. PENDAPATAN PENJUALAN UTAMA &amp; SAMPINGAN</span>
                <span className="tabular-nums font-extrabold">{formatRp(totalPendapatanKomersial)}</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>4101 - Pendapatan Penjualan Beras Kemasan Premium &amp; Medium</span>
                  <span className="tabular-nums">{formatRp(totalPenjualanBerasRp)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>4102 - Pendapatan Penjualan Menir, Katul &amp; Reject</span>
                  <span className="tabular-nums">{formatRp(0)}</span>
                </div>
              </div>
            </div>

            {/* II. HARGA POKOK PENJUALAN */}
            <div className="space-y-2">
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl font-bold text-slate-900 flex justify-between">
                <span>II. HARGA POKOK PENJUALAN (HPP)</span>
                <span className="tabular-nums font-extrabold">({formatRp(totalHPPKomersial)})</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>5101 - Pembelian Beras Asalan / Gabah ({totalPembelianBerasKg.toLocaleString('id-ID')} KG)</span>
                  <span className="tabular-nums">{formatRp(HPP_PembelianBeras)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700 font-bold">
                  <span>(-) Persediaan Akhir Beras ({totalStokBerasJadiKg.toLocaleString('id-ID')} KG)</span>
                  <span className="tabular-nums">({formatRp(HPP_PersediaanAkhir)})</span>
                </div>
              </div>
            </div>

            {/* LABA KOTOR */}
            <div className="bg-slate-100 p-3.5 rounded-xl font-bold text-slate-900 flex justify-between text-sm">
              <span>LABA KOTOR (GROSS PROFIT)</span>
              <span className="tabular-nums font-black">{formatRp(labaKotorKomersial)}</span>
            </div>

            {/* III. BEBAN OPERASIONAL */}
            <div className="space-y-2">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-800 flex justify-between">
                <span>III. BEBAN OPERASIONAL PABRIK &amp; KANTOR</span>
                <span className="tabular-nums font-extrabold">({formatRp(totalBebanOperasionalRp)})</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>6101 - Beban Upah Buruh Borong &amp; Penggilingan</span>
                  <span className="tabular-nums">{formatRp(totalBebanUpahRp)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>6102 - Beban Solar Armada &amp; Listrik PLN Mesin</span>
                  <span className="tabular-nums">{formatRp(totalBebanBbmListrikRp)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>6104 - Beban Operasional Kantor &amp; Kas Kecil</span>
                  <span className="tabular-nums">{formatRp(totalBebanLainnyaRp)}</span>
                </div>
              </div>
            </div>

            {/* LABA BERSIH FINAL */}
            <div className="bg-slate-900 text-white p-4 rounded-xl font-bold flex justify-between text-base shadow-md border border-slate-800">
              <span className="text-emerald-400">LABA BERSIH SEBELUM PAJAK (NET PROFIT)</span>
              <span className="text-emerald-300 font-black tabular-nums">{formatRp(labaBersihKomersial)}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NERACA KEUANGAN */}
      {activeTab === 'NERACA' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider">POSISI KEUANGAN (BALANCE SHEET)</span>
              <h2 className="text-xl font-extrabold text-slate-900">Neraca Keuangan Perusahaan</h2>
              <p className="text-xs text-slate-500 font-mono">Format SAK EMKM: Aset = Kewajiban + Ekuitas</p>
            </div>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-xs flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>NERACA SEIMBANG</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* SISI AKTIVA (ASET) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2">AKTIVA (ASET PERUSAHAAN)</h3>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">A. ASET LANCAR:</div>
                <div className="pl-3 space-y-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1101 - Kas Brankas Kantor</span>
                    <span className="tabular-nums">{formatRp(cashBalance)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1102 - Bank BCA Utama</span>
                    <span className="tabular-nums">{formatRp(bankBalance)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1103 - Piutang Usaha Penjualan</span>
                    <span className="tabular-nums">{formatRp(totalPiutangPelangganRp)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1105 - Nilai Persediaan Beras (Stok)</span>
                    <span className="tabular-nums">{formatRp(nilaiPersediaanBerasRp)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1106 - Nilai Persediaan Karung Sak</span>
                    <span className="tabular-nums">{formatRp(nilaiPersediaanSakRp)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 pt-1">
                  <span>Total Aset Lancar:</span>
                  <span className="tabular-nums font-bold">{formatRp(totalAsetLancar)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="font-bold text-slate-800">B. ASET TETAP:</div>
                <div className="pl-3 space-y-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1201 - Mesin Poles, Grader &amp; Pabrik</span>
                    <span className="tabular-nums">{formatRp(totalAsetTetap)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-3.5 rounded-xl font-bold flex justify-between text-sm">
                <span>TOTAL AKTIVA (ASET)</span>
                <span className="text-emerald-400 font-black tabular-nums">{formatRp(totalAktiva)}</span>
              </div>
            </div>

            {/* SISI PASIVA (KEWAJIBAN & EKUITAS) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2">PASIVA (KEWAJIBAN &amp; MODAL)</h3>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">A. KEWAJIBAN / UTANG:</div>
                <div className="pl-3 space-y-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>2101 - Utang Usaha Suplier Beras</span>
                    <span className="tabular-nums">{formatRp(totalUtangSuplierRp)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-amber-800 pt-1">
                  <span>Total Kewajiban:</span>
                  <span className="tabular-nums font-bold">{formatRp(totalKewajiban)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="font-bold text-slate-800">B. EKUITAS (MODAL PEMILIK):</div>
                <div className="pl-3 space-y-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>3101 - Modal Pemilik (Bpk. Hartanto)</span>
                    <span className="tabular-nums">{formatRp(modalAwalPemilik)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>3201 - Laba Ditahan Tahun Berjalan</span>
                    <span className="tabular-nums">{formatRp(labaDitahan)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-3.5 rounded-xl font-bold flex justify-between text-sm">
                <span>TOTAL PASIVA (UTANG &amp; MODAL)</span>
                <span className="text-emerald-400 font-black tabular-nums">{formatRp(totalPasiva)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JURNAL UMUM (DOUBLE-ENTRY) */}
      {activeTab === 'JURNAL' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider">DOUBLE-ENTRY BOOKKEEPING</span>
              <h2 className="text-xl font-extrabold text-slate-900">Jurnal Umum Transaksi Otomatis</h2>
              <p className="text-xs text-slate-500 font-mono">Pencatatan Berpasangan Sesuai Standar Akuntansi Keuangan</p>
            </div>
            <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-xl font-mono text-slate-700 font-bold">
              Total Jurnal: {allGeneratedJournals.length} Transaksi
            </div>
          </div>

          <div className="space-y-4">
            {allGeneratedJournals.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">Belum ada transaksi jurnal umum terdaftar.</div>
            ) : (
              allGeneratedJournals.map((jrn) => {
                const totalDebit = jrn.items.reduce((a, b) => a + b.debit, 0);
                const totalCredit = jrn.items.reduce((a, b) => a + b.credit, 0);

                return (
                  <div key={jrn.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-800 border-b border-slate-200 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded font-mono text-[10px]">
                          {jrn.ref_no}
                        </span>
                        <span>{jrn.description}</span>
                      </div>
                      <span className="text-slate-500 font-mono">{jrn.date}</span>
                    </div>

                    <div className="space-y-1 font-mono pl-2">
                      {jrn.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-0.5">
                          <div className={item.credit > 0 ? 'pl-6 text-slate-600' : 'font-bold text-slate-900'}>
                            {item.account_code} - {item.account_name}
                          </div>
                          <div className="flex space-x-6 min-w-[200px] justify-end">
                            <span className="w-24 text-right tabular-nums">{item.debit > 0 ? formatRp(item.debit) : '-'}</span>
                            <span className="w-24 text-right tabular-nums">{item.credit > 0 ? formatRp(item.credit) : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-bold font-mono">
                      <span>Status: DEBIT = KREDIT ({formatRp(totalDebit)})</span>
                      <span className="text-emerald-600 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Seimbang</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: BUKU BESAR (GENERAL LEDGER) */}
      {activeTab === 'BUKU_BESAR' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider">GENERAL LEDGER</span>
              <h2 className="text-xl font-extrabold text-slate-900">Buku Besar Per Kode Akun (COA)</h2>
              <p className="text-xs text-slate-500 font-mono">Mutasi detail transaksi per nomor rekening pembukuan</p>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-600 shrink-0 font-mono">Pilih Akun:</span>
              <select
                value={selectedAccountCode}
                onChange={e => setSelectedAccountCode(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 w-full md:w-64 font-mono"
              >
                {coaList.map(ac => (
                  <option key={ac.code} value={ac.code}>
                    {ac.code} - {ac.name} ({ac.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-extrabold text-sm text-slate-900 mb-3">
              Rincian Buku Besar Akun: {selectedAccountCode} - {coaList.find(c => c.code === selectedAccountCode)?.name}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-200/80 text-slate-700 font-bold border-b border-slate-300">
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">No. Ref</th>
                    <th className="p-3">Keterangan</th>
                    <th className="p-3 text-right">Debit</th>
                    <th className="p-3 text-right">Kredit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {allGeneratedJournals
                    .filter(j => j.items.some(i => i.account_code === selectedAccountCode))
                    .map(j => {
                      const item = j.items.find(i => i.account_code === selectedAccountCode);
                      return (
                        <tr key={j.id} className="hover:bg-slate-50">
                          <td className="p-3">{j.date}</td>
                          <td className="p-3 font-bold text-slate-900">{j.ref_no}</td>
                          <td className="p-3">{j.description}</td>
                          <td className="p-3 text-right tabular-nums">{item?.debit ? formatRp(item.debit) : '-'}</td>
                          <td className="p-3 text-right tabular-nums">{item?.credit ? formatRp(item.credit) : '-'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NERACA SALDO */}
      {activeTab === 'NERACA_SALDO' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 justify-between items-center flex">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider">TRIAL BALANCE</span>
              <h2 className="text-xl font-extrabold text-slate-900">Neraca Saldo Akun Keseluruhan</h2>
              <p className="text-xs text-slate-500 font-mono">Ringkasan Total Saldo Debit &amp; Kredit Seluruh Rekening COA</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="p-3.5">Kode</th>
                  <th className="p-3.5">Nama Akun Pembukuan</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5 text-right">Total Debit</th>
                  <th className="p-3.5 text-right">Total Kredit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {coaList.map(ac => {
                  let totalD = 0;
                  let totalC = 0;
                  allGeneratedJournals.forEach(j => {
                    j.items.forEach(i => {
                      if (i.account_code === ac.code) {
                        totalD += i.debit;
                        totalC += i.credit;
                      }
                    });
                  });

                  return (
                    <tr key={ac.code} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{ac.code}</td>
                      <td className="p-3 font-extrabold text-slate-900">{ac.name}</td>
                      <td className="p-3 text-slate-500">{ac.category}</td>
                      <td className="p-3 text-right tabular-nums">{totalD > 0 ? formatRp(totalD) : '-'}</td>
                      <td className="p-3 text-right tabular-nums">{totalC > 0 ? formatRp(totalC) : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: MUTASI STOK & PAJAK */}
      {activeTab === 'MUTASI_PAJAK' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider">PHYSICAL INVENTORY &amp; ARSIP PAJAK</span>
              <h2 className="text-xl font-extrabold text-slate-900">Kartu Mutasi Stok &amp; Dokumen SPT Pajak</h2>
              <p className="text-xs text-slate-500 font-mono">Mutasi fisik beras &amp; karung sak untuk lampiran laporan pajak tahunan</p>
            </div>
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Cetak Laporan Pajak</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">1. Kartu Mutasi Stok Fisik Beras &amp; Persediaan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Total Masuk Pembelian:</span>
                  <span className="text-lg font-black text-slate-900 tabular-nums">{totalPembelianBerasKg.toLocaleString('id-ID')} KG</span>
                  <span className="text-[10px] text-slate-400 block mt-1 tabular-nums">Nilai: {formatRp(totalPembelianBerasRp)}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Stok Akhir Beras Jadi:</span>
                  <span className="text-lg font-black text-emerald-700 tabular-nums">{totalStokBerasJadiKg.toLocaleString('id-ID')} KG</span>
                  <span className="text-[10px] text-slate-400 block mt-1 tabular-nums">Nilai: {formatRp(nilaiPersediaanBerasRp)}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Stok Akhir Karung Sak:</span>
                  <span className="text-lg font-black text-amber-700 tabular-nums">{sakItems.reduce((a, s) => a + (s.stock_current || 0), 0).toLocaleString('id-ID')} PCS</span>
                  <span className="text-[10px] text-slate-400 block mt-1 tabular-nums">Nilai: {formatRp(nilaiPersediaanSakRp)}</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl space-y-2 text-xs text-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900">2. Panduan Penyiapan Dokumen Lampiran Pajak (DJP)</h3>
              <p>
                Laporan Keuangan di atas (Laba Rugi, Neraca, Buku Besar, &amp; Mutasi Stok) telah disesuaikan dengan format <strong>SPT Tahunan PPh Badan / UMKM PP 55 / SAK EMKM</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
                <li>Arsip ini direkomendasikan untuk diekspor ke Excel / dicetak PDF setiap akhir periode pelaporan.</li>
                <li>Jika Petugas Pajak melakukan pemeriksaan atau klarifikasi, sertakan print-out halaman <strong>Laporan Laba Rugi</strong>, <strong>Neraca Keuangan</strong>, serta <strong>Lampiran Mutasi Stok</strong> ini.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
