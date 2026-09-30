export type RoleType = 'PORTAL' | 'OWNER' | 'ADMIN1' | 'ADMIN2' | 'SUPER_ADMIN';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: RoleType;
  password?: string;
}

export interface AccountCOA {
  code: string;
  name: string;
  category: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  normal_balance: 'DEBIT' | 'CREDIT';
}

export interface JournalItem {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  ref_no: string;
  description: string;
  items: JournalItem[];
  source_module: 'TIMBANGAN_PEMBELIAN' | 'PRODUKSI_COR' | 'PENJUALAN_DO' | 'PENGELUARAN_BIAYA' | 'PELUNASAN_PIUTANG' | 'TRANSFER_HUTANG' | 'MANUAL_JURNAL';
}

export interface InitialPayableItem {
  id: string;
  supplier_name: string;
  bank_name: string;
  bank_account_number: string;
  invoice_no: string;
  amount: number;
  notes?: string;
}

export interface InitialReceivableItem {
  id: string;
  customer_name: string;
  brand_aka: string;
  invoice_no: string;
  amount: number;
  notes?: string;
}

export interface InitialSetupData {
  kas_balance: number;
  bank_balance: number;
  payables: InitialPayableItem[];
  receivables: InitialReceivableItem[];
  stapel_stock_kg: number;
  sak_stock_pcs: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  username: string;
  role: RoleType;
  action_description: string;
  details?: string;
}

export interface Supplier {
  id: string;
  name: string;
  bank_name: string;
  bank_account_number: string;
  phone: string;
  address?: string;
  status: 'AKTIF' | 'NONAKTIF';
}

export interface Customer {
  id: string;
  name: string;
  brand_aka?: string; // Merek / Code AKA, contoh: "DM", "BUMI SUBUR"
  contact_person: string;
  phone: string;
  address: string;
  expedition_destination?: string; // Alamat Ekspedisi Langganan
  credit_limit: number;
  payment_term: string; // e.g. "CASH", "TEMPO_7_HARI", "TEMPO_14_HARI"
  status: 'AKTIF' | 'NONAKTIF';
}

export type QualityGrade = 'A' | 'B' | 'C';

// Packaging config: "@(25x1)" = outer sak berisi 25 pcs x 1kg
// "@(5x10)" = outer sak berisi 5 pcs x 10kg
// "@(5x5)"  = outer sak berisi 5 pcs x 5kg
// "@(1x50)" = karung curah 50kg (1 pcs per sak)
export type PackagingConfig = '@(25x1)' | '@(5x10)' | '@(5x5)' | '@(1x50)' | '@(1x25)' | '@(1x20)' | string;

export interface ProductItem {
  id: string;
  code: string;
  name: string;
  unit: string; // "SAK", "KG"
  weight_per_unit: number; // berat per outer sak dalam KG (e.g. 50, 25, 10)
  empty_bag_stock: number;
  finished_goods_stock_kg: number;
  base_price_per_kg: number;
  // Kualitas & Kemasan
  quality_grade?: QualityGrade; // 'A', 'B', 'C'
  packaging_config?: PackagingConfig; // e.g. "@(25x1)"
  inner_qty?: number;       // jumlah kantong kecil per outer sak (e.g. 25 untuk @25x1)
  inner_weight_kg?: number; // berat tiap kantong kecil (e.g. 1 untuk @25x1)
}

// ---- Manajemen Sak (Buku ZAK Digital) ----

export interface SakItem {
  id: string;
  name: string;            // e.g. "Kantong 1kg Cap Putri Thailand", "Sak 50kg Polos"
  sak_type: 'INNER' | 'OUTER'; // INNER = kantong kecil, OUTER = karung besar
  product_code?: string;   // Kode produk terkait (opsional)
  unit: 'PCS';
  stock_current: number;   // Stok saat ini (pcs)
}

export interface SakTransaction {
  id: string;
  transaction_date: string;
  sak_id: string;
  sak_name: string;
  type: 'MASUK' | 'KELUAR';
  qty: number;
  source: 'PEMBELIAN' | 'PRODUKSI_COR' | 'RETUR' | 'ADJUSTMENT';
  notes?: string;
  logged_by: string; // 'admin1' (masuk pembelian) | 'admin2' (keluar cor)
}

export type ExpenseCategory = 'UPAH_BURUH' | 'BBM_SOLAR' | 'LISTRIK_PLN' | 'PERAWATAN_MESIN' | 'BON_MAKAN' | 'OPERASIONAL_KANTOR' | 'BIAYA_OPERASIONAL';

export interface ExpenseTransaction {
  id: string;
  expense_date: string;
  category: ExpenseCategory;
  amount: number;
  payment_source: 'KAS_BRANKAS' | 'BANK_BCA';
  recipient_name: string;
  description: string;
  logged_by: string;
}

export type TransferStatus = 'PENDING_PRICE' | 'SCHEDULED_H1' | 'PAID_H_DAY';

export interface StapelAllocationItem {
  stapel_id?: string;
  stapel_name: string;
  is_direct_cor?: boolean;
  allocated_kg: number;
}

export interface WeighbridgeIn {
  id: string;
  ticket_number: string;
  datetime_in: string;
  datetime_out?: string | null;
  nopol: string;
  supplier_id: string;
  supplier_name: string;
  gross_weight: number; // Berat Masuk (Bruto)
  tare_weight: number;  // Berat Keluar (Tara)
  bag_deduction: number;
  net_weight: number;   // Netto = Bruto - Tara
  allocations: StapelAllocationItem[]; // Multi-Stapel / Direct Cor
  price_per_kg: number | null;
  total_payment: number | null;
  transfer_plan_date: string | null;
  transfer_status: TransferStatus;
  transfer_proof_file: string | null;
  status?: 'MASUK' | 'SELESAI';
}

export interface MillingCorItem {
  id: string;
  stapel_pile_name: string;
  ratio_parts: number;
  required_kg: number;
  remaining_stock_kg: number;
}

export interface MillingCorBatch {
  id: string;
  batch_date: string;
  target_product_name: string;
  total_target_kg: number;
  notes: string;
  items: MillingCorItem[];
}

export interface PackagingStockLog {
  id: string;
  log_date: string;
  bag_type: string;
  qty_requested: number;
  qty_used: number;
  qty_rejected: number;
  taken_by_mandor: string;
}

export interface FinishedGoodOpnameItem {
  product_id?: string;
  product_name: string;
  qty_zak: number;
  total_kg: number;
}

export interface ByproductOpname {
  id: string;
  opname_date: string;
  broken_a_kg?: number; // Beras Broken A (KG) - menggantikan Katul
  menir_kg: number;     // Menir (KG)
  rijek_kg: number;     // Reject (KG)
  katul_kg?: number;    // Backwards compatibility
  beras_jadi_kg: number;
  finished_goods_items?: FinishedGoodOpnameItem[]; // Rincian jenis beras jadi
  checker_name: string;
}

export interface TierRowInput {
  row_number: number;
  sak_count: number;
}

export interface TruckLoadTier {
  id: string;
  load_date: string;
  nopol: string;
  do_id?: string;
  do_number?: string;
  customer_name?: string;
  target_sak_surat_jalan?: number;
  tier_count: number;
  sak_per_tier?: number;
  row_inputs?: TierRowInput[];
  total_sak: number;
  total_kg: number;
  destination: string;
}

export type InvoicePaymentStatus = 'UNPAID' | 'TEMPO' | 'CICILAN' | 'PAID';

export interface InvoicePaymentLog {
  id: string;
  payment_date: string;
  amount: number;
  payment_method: 'TUNAI' | 'TRANSFER_BCA';
  notes?: string;
}

export interface SalesDeliveryOrderItem {
  id: string;
  product_name: string;
  unit: string; // "SAK", "KG", "TON"
  qty: number;
  weight_per_unit_kg: number;
  total_kg: number;
  actual_loaded_kg?: number; // Adjust oleh Admin 2 Field
}

export interface SalesDeliveryOrder {
  id: string;
  do_number: string;
  invoice_number: string | null;
  customer_name: string;
  brand_aka?: string; // Merek / AKA, contoh: "DM"
  expedition_info?: string; // e.g. "EXP. CARAVAN (P.MATHIAS), GD.DIPO CARAVAN..."
  nopol?: string; // e.g. "PT.MU S 9302 UN"
  customer_phone?: string; // e.g. "081 833 4998"
  origin_city?: string; // e.g. "Banyuwangi" or "Wonosobo"
  delivery_date?: string; // Tanggal Pengiriman / Kalender Rencana Kerja
  notes?: string;
  items: SalesDeliveryOrderItem[];
  product_name: string; // Summary string e.g. "Pandan (1k, 5k, 10k), Cap Putri Thailand..."
  total_kg: number;
  selling_price_per_kg: number | null;
  total_invoice_amount: number | null;
  paid_amount?: number; // Nominal yang sudah dibayar/dicicil
  remaining_balance?: number; // Sisa piutang yang belum lunas
  payment_logs?: InvoicePaymentLog[]; // History cicilan pembayaran
  payment_status: InvoicePaymentStatus;
  status?: 'RENCANA_JADWAL' | 'DI_MUAT_TRUK' | 'TERKIRIM';
  parent_po_id?: string; // ID PO Induk jika 1 PO di-split ke beberapa truk
  truck_capacity_ton?: number; // e.g. 12, 13, 25
  created_at: string;
}

export type PettyCashType = 'KAS_MASUK' | 'KAS_KELUAR';
export type QuickTag = string;

export interface PettyCashTransaction {
  id: string;
  transaction_time: string;
  type: PettyCashType;
  amount: number;
  source_destination: string;
  recipient_payer: string;
  description: string;
  quick_tag: QuickTag;
}

export interface StapelPile {
  id: string;
  name: string;
  stock_kg: number;
  quality_grade: string;
}
