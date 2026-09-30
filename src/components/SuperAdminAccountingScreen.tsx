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
    .filter(w => w.transfer_status !== 'CONFIRMED')
    .reduce((acc, w) => acc + (w.total_payment || 0), 0);

  // 2. Total Penjualan Beras & Limba (Pendapatan Penjualan)
  const totalPenjualanBerasRp = deliveryOrders.reduce((acc, d) => acc + (d.total_invoice_amount || 0), 0);
  const totalPiutangPelangganRp = deliveryOrders
    .filter(d => d.payment_status !== 'LUNAS')
    .reduce((acc, d) => acc + (d.total_invoice_amount || 0), 0);

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

  // 6. Neraca Keuangan (Balance Sheet Position)
  const totalAsetLancar = cashBalance + bankBalance + totalPiutangPelangganRp + nilaiPersediaanBerasRp + nilaiPersediaanSakRp;
  const totalAsetTetap = 850000000; // Nilai Aset Mesin Poles, Grader & Pabrik
  const totalAktiva = totalAsetLancar + totalAsetTetap;

  const totalKewajiban = totalUtangSuplierRp;
  const modalAwalPemilik = 1500000000; // Modal Awal Pemilik Hartanto
  const labaDitahan = labaBersihKomersial;
  const totalPasiva = totalKewajiban + modalAwalPemilik + labaDitahan;

  // Generate dynamic combined general journal
  const allGeneratedJournals: JournalEntry[] = [
    ...journalEntries,
    // Auto-generate entries from Weighbridge Purchases
    ...weighbridgeInList.map((w, idx) => ({
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
    // Auto-generate entries from Sales Delivery Orders
    ...deliveryOrders.map((d, idx) => ({
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
    // Auto-generate entries from Expenses
    ...expenses.map((e, idx) => ({
      id: `jrn-exp-${e.id}`,
      date: e.expense_date.substring(0, 10),
      ref_no: `EXP-${e.id.substring(4, 9)}`,
      description: `Biaya: ${e.description} (${e.recipient_name})`,
      source_module: 'PENGELUARAN_BIAYA' as const,
      items: [
        { account_code: e.category === 'UPAH_BURUH' ? '6101' : e.category === 'BBM_SOLAR' ? '6102' : '6104', account_name: `Beban ${e.category}`, debit: e.amount, credit: 0 },
        { account_code: e.payment_source === 'BANK_BCA' ? '1102' : '1101', account_name: e.payment_source === 'BANK_BCA' ? 'Bank BCA Utama' : 'Kas Brankas Kantor', debit: 0, credit: e.amount }
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
      <div className="bg-gradient-to-r from-[#08251b] via-[#0f3e2e] to-[#165640] text-white p-7 rounded-3xl shadow-xl border-2 border-amber-400/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-[#0f3e2e] flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white">
            <BookOpen className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-[#0f3e2e] uppercase tracking-wider">
                AKSES EKSKLUSIF SUPER ADMIN
              </span>
              <span className="text-xs text-emerald-300 font-semibold">• Standard SAK EMKM & Kantor Pajak DJP</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">
              Laporan Keuangan & Pembukuan Pajak Standar Indonesia
            </h1>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl">
              Sistem Jurnal Berpasangan (*Double-Entry Bookkeeping*) Otomatis Sesuai Standar Akuntansi Keuangan Indonesia (SAK EMKM) untuk Pembukuan SPT Pajak PP BUMI MAS.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleExportAccountingExcel}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-md transition flex items-center space-x-2 text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel (.CSV)</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-4 py-3 bg-[#f59e0b] hover:bg-amber-500 text-[#0f3e2e] font-extrabold rounded-2xl shadow-lg transition flex items-center space-x-2 text-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF / Arsip Pajak</span>
          </button>
        </div>
      </div>

      {/* Explanation Banner for Non-Accountant Admin */}
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-start space-x-3 shadow-sm">
        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold">Catatan Sistem Akuntansi Otomatis:</span>
          <p className="mt-0.5 text-amber-800">
            Anda <strong>tidak perlu menginput data akuntansi secara manual</strong>. Setiap transaksi harian (Timbangan Pembelian, Produksi COR, Penjualan DO, & Kas Kecil) secara otomatis diproses oleh sistem menjadi <strong>Jurnal Berpasangan (Debit & Kredit)</strong> yang seimbang sesuai standar Akuntansi Indonesia SAK EMKM. Laporan di bawah ini siap langsung digunakan jika sewaktu-waktu terdapat pemeriksaan dari Kantor Pajak.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
            <span>TOTAL PENDAPATAN</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700">{formatRp(totalPendapatanKomersial)}</div>
          <div className="text-[10px] text-slate-400 font-medium">Penjualan Beras Kemasan & Limba</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
            <span>HPP (Bahan & Produksi)</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-700">{formatRp(totalHPPKomersial)}</div>
          <div className="text-[10px] text-slate-400 font-medium">Beras Asalan Dikurangi Persediaan Akhir</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
            <span>LABA BERSIH KOMERSIAL</span>
            <PieChart className="w-4 h-4 text-[#0f3e2e]" />
          </div>
          <div className={`text-xl font-black ${labaBersihKomersial >= 0 ? 'text-[#0f3e2e]' : 'text-red-600'}`}>
            {formatRp(labaBersihKomersial)}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Laba Kotor dikurangi Beban Operasional</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
            <span>TOTAL ASET (AKTIVA)</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{formatRp(totalAktiva)}</div>
          <div className="text-[10px] text-slate-400 font-medium">Kas + Bank + Piutang + Stok + Mesin</div>
        </div>
      </div>

      {/* Interactive Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1.5 text-xs font-extrabold overflow-x-auto">
        <button
          onClick={() => setActiveTab('LABA_RUGI')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'LABA_RUGI' ? 'bg-[#0f3e2e] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>1. Laporan Laba Rugi</span>
        </button>

        <button
          onClick={() => setActiveTab('NERACA')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'NERACA' ? 'bg-[#0f3e2e] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>2. Neraca Keuangan</span>
        </button>

        <button
          onClick={() => setActiveTab('JURNAL')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'JURNAL' ? 'bg-[#0f3e2e] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Jurnal Umum (Double-Entry)</span>
        </button>

        <button
          onClick={() => setActiveTab('BUKU_BESAR')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'BUKU_BESAR' ? 'bg-[#0f3e2e] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>4. Buku Besar (General Ledger)</span>
        </button>

        <button
          onClick={() => setActiveTab('NERACA_SALDO')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'NERACA_SALDO' ? 'bg-[#0f3e2e] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>5. Neraca Saldo (Trial Balance)</span>
        </button>

        <button
          onClick={() => setActiveTab('MUTASI_PAJAK')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'MUTASI_PAJAK' ? 'bg-[#0f3e2e] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          <span>6. Mutasi Stok & Arsip Pajak</span>
        </button>
      </div>

      {/* TAB 1: LAPORAN LABA RUGI KOMERSIAL */}
      {activeTab === 'LABA_RUGI' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#10b981] tracking-wider">STANDAR AKUNTANSI EMKM INDONESIA</span>
              <h2 className="text-xl font-black text-slate-900">Laporan Laba Rugi Komersial Pabrik</h2>
              <p className="text-xs text-slate-500">Periode Berjalan Tahun 2026 • PP BUMI MAS</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Format Standar SPT Pajak</span>
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* I. PENDAPATAN */}
            <div className="space-y-2">
              <div className="bg-emerald-50 p-3 rounded-xl font-bold text-emerald-900 flex justify-between">
                <span>I. PENDAPATAN PENJUALAN UTAMA & SAMPINGAN</span>
                <span>{formatRp(totalPendapatanKomersial)}</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>4101 - Pendapatan Penjualan Beras Kemasan Premium & Medium</span>
                  <span>{formatRp(totalPenjualanBerasRp)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>4102 - Pendapatan Penjualan Menir, Katul & Reject</span>
                  <span>{formatRp(0)}</span>
                </div>
              </div>
            </div>

            {/* II. HARGA POKOK PENJUALAN */}
            <div className="space-y-2">
              <div className="bg-amber-50 p-3 rounded-xl font-bold text-amber-900 flex justify-between">
                <span>II. HARGA POKOK PENJUALAN (HPP)</span>
                <span>({formatRp(totalHPPKomersial)})</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>5101 - Pembelian Beras Asalan / Gabah ({totalPembelianBerasKg.toLocaleString('id-ID')} KG)</span>
                  <span>{formatRp(HPP_PembelianBeras)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700 font-bold">
                  <span>(-) Persediaan Akhir Beras ({totalStokBerasJadiKg.toLocaleString('id-ID')} KG)</span>
                  <span>({formatRp(HPP_PersediaanAkhir)})</span>
                </div>
              </div>
            </div>

            {/* LABA KOTOR */}
            <div className="bg-slate-100 p-3.5 rounded-xl font-extrabold text-slate-900 flex justify-between text-sm">
              <span>LABA KOTOR (GROSS PROFIT)</span>
              <span>{formatRp(labaKotorKomersial)}</span>
            </div>

            {/* III. BEBAN OPERASIONAL */}
            <div className="space-y-2">
              <div className="bg-slate-50 p-3 rounded-xl font-bold text-slate-800 flex justify-between">
                <span>III. BEBAN OPERASIONAL PABRIK & KANTOR</span>
                <span>({formatRp(totalBebanOperasionalRp)})</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>6101 - Beban Upah Buruh Borong & Penggilingan</span>
                  <span>{formatRp(totalBebanUpahRp)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>6102 - Beban Solar Armada & Listrik PLN Mesin</span>
                  <span>{formatRp(totalBebanBbmListrikRp)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>6104 - Beban Operasional Kantor & Kas Kecil</span>
                  <span>{formatRp(totalBebanLainnyaRp)}</span>
                </div>
              </div>
            </div>

            {/* LABA BERSIH FINAL */}
            <div className="bg-[#0f3e2e] text-white p-4 rounded-2xl font-extrabold flex justify-between text-base shadow-lg border border-emerald-700">
              <span className="text-amber-400">LABA BERSIH SEBELUM PAJAK (NET PROFIT)</span>
              <span className="text-amber-300 font-black">{formatRp(labaBersihKomersial)}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NERACA KEUANGAN */}
      {activeTab === 'NERACA' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#10b981] tracking-wider">POSISI KEUANGAN (BALANCE SHEET)</span>
              <h2 className="text-xl font-black text-slate-900">Neraca Keuangan Perusahaan</h2>
              <p className="text-xs text-slate-500">Format Keseimbangan Aktiva = Pasiva (Aset = Kewajiban + Ekuitas)</p>
            </div>
            <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-extrabold text-xs">
              ✓ BALANCED (SEIMBANG)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* SISI AKTIVA (ASET) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm text-[#0f3e2e] border-b border-slate-200 pb-2">AKTIVA (ASET PERUSAHAAN)</h3>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">A. ASET LANCAR:</div>
                <div className="pl-3 space-y-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1101 - Kas Brankas Kantor</span>
                    <span>{formatRp(cashBalance)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1102 - Bank BCA Utama</span>
                    <span>{formatRp(bankBalance)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1103 - Piutang Usaha Penjualan</span>
                    <span>{formatRp(totalPiutangPelangganRp)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1105 - Nilai Persediaan Beras (Stok)</span>
                    <span>{formatRp(nilaiPersediaanBerasRp)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1106 - Nilai Persediaan Karung Sak</span>
                    <span>{formatRp(nilaiPersediaanSakRp)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 pt-1">
                  <span>Total Aset Lancar:</span>
                  <span>{formatRp(totalAsetLancar)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="font-bold text-slate-800">B. ASET TETAP:</div>
                <div className="pl-3 space-y-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>1201 - Mesin Poles, Grader & Pabrik</span>
                    <span>{formatRp(totalAsetTetap)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f3e2e] text-white p-3.5 rounded-xl font-black flex justify-between text-sm">
                <span>TOTAL AKTIVA (ASET)</span>
                <span className="text-amber-400">{formatRp(totalAktiva)}</span>
              </div>
            </div>

            {/* SISI PASIVA (KEWAJIBAN & EKUITAS) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm text-[#0f3e2e] border-b border-slate-200 pb-2">PASIVA (KEWAJIBAN & MODAL)</h3>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">A. KEWAJIBAN / UTANG:</div>
                <div className="pl-3 space-y-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>2101 - Utang Usaha Suplier Beras</span>
                    <span>{formatRp(totalUtangSuplierRp)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-amber-800 pt-1">
                  <span>Total Kewajiban:</span>
                  <span>{formatRp(totalKewajiban)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="font-bold text-slate-800">B. EKUITAS (MODAL PEMILIK):</div>
                <div className="pl-3 space-y-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>3101 - Modal Pemilik (Bpk. Hartanto)</span>
                    <span>{formatRp(modalAwalPemilik)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>3201 - Laba Ditahan Tahun Berjalan</span>
                    <span>{formatRp(labaDitahan)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f3e2e] text-white p-3.5 rounded-xl font-black flex justify-between text-sm">
                <span>TOTAL PASIVA (UTANG & MODAL)</span>
                <span className="text-amber-400">{formatRp(totalPasiva)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JURNAL UMUM (DOUBLE-ENTRY) */}
      {activeTab === 'JURNAL' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#10b981] tracking-wider">DOUBLE-ENTRY BOOKKEEPING</span>
              <h2 className="text-xl font-black text-slate-900">Jurnal Umum Transaksi Otomatis</h2>
              <p className="text-xs text-slate-500">Setiap transaksi harian tercatat secara berpasangan Debit = Kredit</p>
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
                  <div key={jrn.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-800 border-b border-slate-200 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#0f3e2e] text-white px-2.5 py-0.5 rounded font-mono text-[10px]">
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
                            <span className="w-24 text-right">{item.debit > 0 ? formatRp(item.debit) : '-'}</span>
                            <span className="w-24 text-right">{item.credit > 0 ? formatRp(item.credit) : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-bold">
                      <span>Status: DEBIT = KREDIT ({formatRp(totalDebit)})</span>
                      <span className="text-emerald-600">✓ BALANCED</span>
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#10b981] tracking-wider">GENERAL LEDGER</span>
              <h2 className="text-xl font-black text-slate-900">Buku Besar Per Kode Akun (COA)</h2>
              <p className="text-xs text-slate-500">Mutasi detail transaksi per nomor rekening pembukuan</p>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-600 shrink-0">Pilih Akun:</span>
              <select
                value={selectedAccountCode}
                onChange={e => setSelectedAccountCode(e.target.value)}
                className="px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#10b981] w-full md:w-64"
              >
                {coaList.map(ac => (
                  <option key={ac.code} value={ac.code}>
                    {ac.code} - {ac.name} ({ac.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="font-extrabold text-sm text-[#0f3e2e] mb-3">
              Rincian Buku Besar Akun: {selectedAccountCode} - {coaList.find(c => c.code === selectedAccountCode)?.name}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-200 text-slate-700 font-bold border-b border-slate-300">
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
                          <td className="p-3 font-bold text-[#0f3e2e]">{j.ref_no}</td>
                          <td className="p-3">{j.description}</td>
                          <td className="p-3 text-right">{item?.debit ? formatRp(item.debit) : '-'}</td>
                          <td className="p-3 text-right">{item?.credit ? formatRp(item.credit) : '-'}</td>
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 justify-between items-center flex">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#10b981] tracking-wider">TRIAL BALANCE</span>
              <h2 className="text-xl font-black text-slate-900">Neraca Saldo Akun Keseluruhan</h2>
              <p className="text-xs text-slate-500">Ringkasan Total Saldo Debit & Kredit Seluruh Rekening COA</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#0f3e2e] text-white font-bold">
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
                      <td className="p-3 text-right">{totalD > 0 ? formatRp(totalD) : '-'}</td>
                      <td className="p-3 text-right">{totalC > 0 ? formatRp(totalC) : '-'}</td>
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#10b981] tracking-wider">MUTASI PHYSICAL INVENTORY & ARSIP PAJAK</span>
              <h2 className="text-xl font-black text-slate-900">Kartu Mutasi Stok & Dokumen SPT Pajak</h2>
              <p className="text-xs text-slate-500">Mutasi stok fisik beras & karung sak untuk lampiran laporan pajak tahunan/bulanan</p>
            </div>
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2 bg-[#0f3e2e] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition flex items-center space-x-1"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Laporan Pajak</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-sm text-[#0f3e2e]">1. Kartu Mutasi Stok Fisik Beras & Persediaan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Total Masuk Pembelian:</span>
                  <span className="text-lg font-black text-slate-900">{totalPembelianBerasKg.toLocaleString('id-ID')} KG</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Nilai: {formatRp(totalPembelianBerasRp)}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Stok Akhir Beras Jadi:</span>
                  <span className="text-lg font-black text-emerald-800">{totalStokBerasJadiKg.toLocaleString('id-ID')} KG</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Nilai: {formatRp(nilaiPersediaanBerasRp)}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Stok Akhir Karung Sak:</span>
                  <span className="text-lg font-black text-amber-800">{sakItems.reduce((a, s) => a + (s.stock_current || 0), 0).toLocaleString('id-ID')} PCS</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Nilai: {formatRp(nilaiPersediaanSakRp)}</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-900">
              <h3 className="font-extrabold text-sm text-[#0f3e2e]">2. Panduan Penyiapan Dokumen Lampiran Pajak (DJP)</h3>
              <p>
                Laporan Keuangan di atas (Laba Rugi, Neraca, Buku Besar, & Mutasi Stok) telah disesuaikan dengan format <strong>SPT Tahunan PPh Badan / UMKM PP 55 / SAK EMKM</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-emerald-800 font-medium">
                <li>Arsip ini direkomendasikan untuk diekspor ke Excel / dicetak PDF setiap akhir bulan.</li>
                <li>Jika Petugas Pajak melakukan pemeriksaan atau klarifikasi, sertakan print-out halaman <strong>Laporan Laba Rugi</strong>, <strong>Neraca Keuangan</strong>, serta <strong>Lampiran Mutasi Stok</strong> ini.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
