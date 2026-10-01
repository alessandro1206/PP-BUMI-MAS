import React, { createContext, useContext, useState } from 'react';
import {
  RoleType,
  UserAccount,
  AuditLog,
  Supplier,
  Customer,
  ProductItem,
  ExpenseCategory,
  ExpenseTransaction,
  WeighbridgeIn,
  MillingCorBatch,
  PackagingStockLog,
  ByproductOpname,
  TruckLoadTier,
  SalesDeliveryOrder,
  PettyCashTransaction,
  StapelPile,
  SakItem,
  SakTransaction,
  AccountCOA,
  JournalEntry,
  InitialSetupData
} from '../types';


interface AppContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
  activeScreen: string;
  setActiveScreen: (screenId: string) => void;

  // Accounting & Journal State
  journalEntries: JournalEntry[];
  coaList: AccountCOA[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;

  // Auth & User Management State
  currentUser: UserAccount | null;
  userAccounts: UserAccount[];
  addUserAccount: (user: Omit<UserAccount, 'id'>) => UserAccount;
  updateUserAccount: (updated: UserAccount) => void;
  deleteUserAccount: (id: string) => void;
  login: (username: string, pass: string, targetRole: RoleType) => boolean;
  logout: () => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details?: string) => void;

  // Data Collections & Sample Master Loader
  suppliers: Supplier[];
  customers: Customer[];
  products: ProductItem[];
  loadSampleMasterData: () => void;
  expenses: ExpenseTransaction[];
  weighbridgeInList: WeighbridgeIn[];
  corBatches: MillingCorBatch[];
  packagingLogs: PackagingStockLog[];
  byproductOpnames: ByproductOpname[];
  truckTiers: TruckLoadTier[];
  deliveryOrders: SalesDeliveryOrder[];
  pettyCash: PettyCashTransaction[];
  stapelPiles: StapelPile[];

  // Sak Management
  sakItems: SakItem[];
  sakTransactions: SakTransaction[];
  addSakMasuk: (sakId: string, qty: number, notes?: string) => void;
  addSakTransaction: (sakId: string, type: 'MASUK' | 'KELUAR', qty: number, source: SakTransaction['source'], notes?: string) => void;

  pettyCashCategories: string[];
  addPettyCashCategory: (catName: string) => void;
  updateDOItemLoadedQty: (doId: string, itemId: string, actualLoadedKg: number) => void;

  // Cash Balance & Initial Setup
  cashBalance: number;
  bankBalance: number;
  setBankBalance: (amount: number) => void;
  setInitialFinancialBalances: (kasAmount: number, bankAmount: number) => void;
  saveAllInitialSetup: (setupData: InitialSetupData) => void;

  // Actions
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Supplier;
  updateSupplier: (supplier: Supplier) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addProduct: (product: Omit<ProductItem, 'id'>) => ProductItem;
  updateProduct: (product: ProductItem) => void;
  adjustStapelStock: (stapelId: string, newStockKg: number, reason: string) => void;
  addStapelPile: (name: string, grade: string) => StapelPile;
  addExpense: (expense: Omit<ExpenseTransaction, 'id' | 'expense_date'>) => ExpenseTransaction;
  
  addWeighbridgeIn: (data: Omit<WeighbridgeIn, 'id' | 'ticket_number' | 'transfer_status' | 'transfer_proof_file' | 'price_per_kg' | 'total_payment' | 'transfer_plan_date'>) => WeighbridgeIn;
  updateTareAndFinishWeighbridge: (id: string, tareWeight: number, sacks?: string | number, goods?: string) => void;
  deleteWeighbridgeIn: (id: string) => void;
  setOwnerPriceAndSchedule: (id: string, pricePerKg: number, planDate: string) => void;
  confirmOwnerTransfer: (id: string, proofFile: string) => void;
  createCorBatch: (batch: Omit<MillingCorBatch, 'id'>) => void;
  requestPackaging: (log: Omit<PackagingStockLog, 'id'>) => void;
  saveByproductOpname: (opname: Omit<ByproductOpname, 'id'>) => void;
  saveTruckTier: (tier: Omit<TruckLoadTier, 'id'>) => void;
  createDeliveryOrder: (doData: Omit<SalesDeliveryOrder, 'id' | 'do_number' | 'invoice_number' | 'selling_price_per_kg' | 'total_invoice_amount' | 'payment_status' | 'created_at'>) => SalesDeliveryOrder;
  setInvoicePrice: (id: string, pricePerKg: number) => void;
  confirmDOShipped: (doId: string, actualShipDate: string) => void;
  addInvoicePayment: (doId: string, amount: number, paymentMethod: 'TUNAI' | 'TRANSFER_BCA', paymentDate: string, notes?: string) => void;
  addPettyCash: (tx: Omit<PettyCashTransaction, 'id' | 'transaction_time'>) => void;
  exportToCSV: (filename: string, rows: any[]) => void;
}


export const defaultCOAList: AccountCOA[] = [
  { code: '1101', name: 'Kas Brankas Kantor', category: 'ASSET', normal_balance: 'DEBIT' },
  { code: '1102', name: 'Bank BCA Utama', category: 'ASSET', normal_balance: 'DEBIT' },
  { code: '1103', name: 'Piutang Usaha Penjualan', category: 'ASSET', normal_balance: 'DEBIT' },
  { code: '1104', name: 'Persediaan Beras Asalan / Gabah', category: 'ASSET', normal_balance: 'DEBIT' },
  { code: '1105', name: 'Persediaan Beras Jadi & Menir (FG)', category: 'ASSET', normal_balance: 'DEBIT' },
  { code: '1106', name: 'Persediaan Karung Sak Kemasan', category: 'ASSET', normal_balance: 'DEBIT' },
  { code: '1201', name: 'Aset Mesin Poles, Grader & Color Sorter', category: 'ASSET', normal_balance: 'DEBIT' },
  { code: '2101', name: 'Utang Usaha Suplier Beras', category: 'LIABILITY', normal_balance: 'CREDIT' },
  { code: '2102', name: 'Utang Titipan / Akrual Operasional', category: 'LIABILITY', normal_balance: 'CREDIT' },
  { code: '3101', name: 'Modal Disetor Pemilik (Hartanto)', category: 'EQUITY', normal_balance: 'CREDIT' },
  { code: '3201', name: 'Laba Ditahan / Keuntungan Ditahan', category: 'EQUITY', normal_balance: 'CREDIT' },
  { code: '4101', name: 'Pendapatan Penjualan Beras Kemasan', category: 'REVENUE', normal_balance: 'CREDIT' },
  { code: '4102', name: 'Pendapatan Penjualan Menir & Reject', category: 'REVENUE', normal_balance: 'CREDIT' },
  { code: '5101', name: 'HPP - Pembelian Beras Asalan', category: 'EXPENSE', normal_balance: 'DEBIT' },
  { code: '5102', name: 'HPP - Biaya Karung & Benang Jahit', category: 'EXPENSE', normal_balance: 'DEBIT' },
  { code: '5103', name: 'HPP - Biaya Listrik PLN & Solar Mesin', category: 'EXPENSE', normal_balance: 'DEBIT' },
  { code: '6101', name: 'Beban Upah Buruh Borong & Cor', category: 'EXPENSE', normal_balance: 'DEBIT' },
  { code: '6102', name: 'Beban Solar Armada & Ekspedisi', category: 'EXPENSE', normal_balance: 'DEBIT' },
  { code: '6103', name: 'Beban Perawatan Mesin & Sparepart', category: 'EXPENSE', normal_balance: 'DEBIT' },
  { code: '6104', name: 'Beban Operasional Kantor & Kas Kecil', category: 'EXPENSE', normal_balance: 'DEBIT' },
];

export const initialUserAccounts: UserAccount[] = [
  { id: 'u-super', username: 'superadmin', name: 'Super Admin (Akses Penuh + Pajak)', role: 'SUPER_ADMIN', password: 'super123' },
  { id: 'u-owner', username: 'owner', name: 'Bpk. Hartanto (Owner)', role: 'OWNER', password: 'owner123' },
  { id: 'u-admin1', username: 'admin1', name: 'Mbak Rina (Admin Kantor)', role: 'ADMIN1', password: 'admin123' },
  { id: 'u-admin2', username: 'admin2', name: 'Cak Mat (Checker Lapangan)', role: 'ADMIN2', password: 'admin234' }
];

const initialSuppliers: Supplier[] = [];
const initialCustomers: Customer[] = [];
const initialProducts: ProductItem[] = [];
const initialSakItems: SakItem[] = [];
const initialExpenses: ExpenseTransaction[] = [];
const initialWeighbridge: WeighbridgeIn[] = [];
const initialAuditLogs: AuditLog[] = [];
const initialStapels: StapelPile[] = [];
const initialDeliveryOrders: SalesDeliveryOrder[] = [];
const initialPettyCash: PettyCashTransaction[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<RoleType>('PORTAL');
  const [activeScreen, setActiveScreen] = useState<string>('SCREEN_5');

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(initialUserAccounts);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [coaList, setCoaList] = useState<AccountCOA[]>(defaultCOAList);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [expenses, setExpenses] = useState<ExpenseTransaction[]>(initialExpenses);

  const [weighbridgeInList, setWeighbridgeInList] = useState<WeighbridgeIn[]>(initialWeighbridge);
  const [corBatches, setCorBatches] = useState<MillingCorBatch[]>([]);
  const [packagingLogs, setPackagingLogs] = useState<PackagingStockLog[]>([]);
  const [byproductOpnames, setByproductOpnames] = useState<ByproductOpname[]>([]);
  const [truckTiers, setTruckTiers] = useState<TruckLoadTier[]>([]);
  const [deliveryOrders, setDeliveryOrders] = useState<SalesDeliveryOrder[]>(initialDeliveryOrders);
  const [pettyCash, setPettyCash] = useState<PettyCashTransaction[]>(initialPettyCash);
  const [pettyCashCategories, setPettyCashCategories] = useState<string[]>([
    'UPAH_BURUH',
    'SOLAR',
    'MAKAN_LEMBUR',
    'TARIK_BCA',
    'OPERASIONAL_KANTOR',
    'LAINNYA'
  ]);
  const [stapelPiles, setStapelPiles] = useState<StapelPile[]>(initialStapels);
  const [sakItems, setSakItems] = useState<SakItem[]>(initialSakItems);
  const [sakTransactions, setSakTransactions] = useState<SakTransaction[]>([]);

  const [bankBalance, setBankBalance] = useState<number>(1450000000);


  const cashBalance = pettyCash.reduce((acc, tx) => {
    return tx.type === 'KAS_MASUK' ? acc + tx.amount : acc - tx.amount;
  }, 0);

  const addAuditLog = (action: string, details?: string) => {
    const username = currentUser?.username || 'system';
    const currentRole = currentUser?.role || role;

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      username,
      role: currentRole,
      action_description: action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addUserAccount = (user: Omit<UserAccount, 'id'>): UserAccount => {
    const newUser: UserAccount = {
      ...user,
      id: `u-${Date.now()}`
    };
    setUserAccounts(prev => [...prev, newUser]);
    addAuditLog('Tambah User Baru', `Username: ${user.username}, Nama: ${user.name}, Role: ${user.role}`);
    return newUser;
  };

  const updateUserAccount = (updated: UserAccount) => {
    setUserAccounts(prev => prev.map(u => u.id === updated.id ? updated : u));
    addAuditLog('Update User Account', `Username: ${updated.username}, Nama: ${updated.name}, Role: ${updated.role}`);
  };

  const deleteUserAccount = (id: string) => {
    const target = userAccounts.find(u => u.id === id);
    if (target) {
      setUserAccounts(prev => prev.filter(u => u.id !== id));
      addAuditLog('Hapus User Account', `Username: ${target.username} (${target.name})`);
    }
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `jrn-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const login = (username: string, pass: string, targetRole: RoleType): boolean => {
    const cleanUsername = username.trim().toLowerCase();
    const found = userAccounts.find(
      u => u.username.toLowerCase() === cleanUsername && u.password === pass && u.role === targetRole
    );
    if (found) {
      setCurrentUser(found);
      setRole(found.role);
      addAuditLog(`User Login Berhasil`, `Login sebagai ${found.name} (${found.role})`);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog(`User Logout`, `User ${currentUser.username} keluar dari sistem`);
    }
    setCurrentUser(null);
    setRole('PORTAL');
    setActiveScreen('SCREEN_5');
  };

  const loadSampleMasterData = () => {
    setSuppliers([
      { id: 'sup-1', name: 'Suplier H. Ahmad (Gabah Jombang)', bank_name: 'BCA', bank_account_number: '0129384751', phone: '081234567890', address: 'Jombang', status: 'AKTIF' },
      { id: 'sup-2', name: 'Mitra Tani Jaya (Beras Asalan)', bank_name: 'BCA', bank_account_number: '8830192847', phone: '081987654321', address: 'Nganjuk', status: 'AKTIF' }
    ]);
    setCustomers([
      { id: 'cust-1', name: 'BUMI SUBUR SURABAYA', brand_aka: 'DM', contact_person: 'Ko Jimmy', phone: '0811324567', address: 'Surabaya', expedition_destination: 'Ekspedisi Niaga Trans', credit_limit: 500000000, payment_term: 'TEMPO_14_HARI', status: 'AKTIF' },
      { id: 'cust-2', name: 'BUMI SUBUR SURABAYA', brand_aka: 'BCAMP', contact_person: 'Ko Jimmy', phone: '0811324567', address: 'Surabaya', expedition_destination: 'Ekspedisi Caravan', credit_limit: 500000000, payment_term: 'TEMPO_14_HARI', status: 'AKTIF' }
    ]);
    setProducts([
      { id: 'prod-1', code: 'BRS-5X10', name: 'Beras Premium Cap Putri @(5x10) KG', unit: 'SAK', weight_per_unit: 50, empty_bag_stock: 500, finished_goods_stock_kg: 10000, base_price_per_kg: 14200, packaging_config: '@(5x10)', inner_qty: 5, inner_weight_kg: 10 },
      { id: 'prod-2', code: 'BRS-5X5', name: 'Beras Premium Cap Putri @(5x5) KG', unit: 'SAK', weight_per_unit: 25, empty_bag_stock: 800, finished_goods_stock_kg: 7500, base_price_per_kg: 14300, packaging_config: '@(5x5)', inner_qty: 5, inner_weight_kg: 5 }
    ]);
    setStapelPiles([
      { id: 'stapel-1', name: 'Stapel 1 - Gudang Utama', quality_grade: 'Standar Pabrik', current_stock_kg: 25000, created_at: new Date().toISOString() },
      { id: 'stapel-2', name: 'Stapel 2 - Area Reprocessing', quality_grade: 'Super Fine', current_stock_kg: 18000, created_at: new Date().toISOString() }
    ]);
    setSakItems([
      { id: 'sak-1', name: 'Karung Sak 50kg Outer Polos', sak_type: 'OUTER', unit: 'PCS', stock_current: 1200 },
      { id: 'sak-2', name: 'Kantong 10kg Cap Putri Inner', sak_type: 'INNER', unit: 'PCS', stock_current: 4500 }
    ]);
    addAuditLog('Load Data Awal Master', 'Mengisi sampel awal master data suplier, customer, produk & stapel.');
  };

  const setInitialFinancialBalances = (kasAmount: number, bankAmount: number) => {
    setBankBalance(bankAmount);
    setPettyCash([
      {
        id: `pc-init-${Date.now()}`,
        transaction_time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'KAS_MASUK',
        category: 'TARIK_BCA',
        amount: kasAmount,
        recipient_or_source: 'Setoran Saldo Awal Brankas',
        description: 'Setoran Saldo Awal Kas Brankas Kantor',
        logged_by: currentUser?.username || 'owner'
      }
    ]);
    addAuditLog('Set Saldo Awal Keuangan', `Kas Brankas: Rp ${kasAmount.toLocaleString('id-ID')}, Bank BCA: Rp ${bankAmount.toLocaleString('id-ID')}`);
  };

  const saveAllInitialSetup = (setupData: InitialSetupData) => {
    // 1. Set Financial Balances
    setBankBalance(setupData.bank_balance);
    if (setupData.kas_balance > 0) {
      setPettyCash([
        {
          id: `pc-init-${Date.now()}`,
          transaction_time: new Date().toISOString().replace('T', ' ').substring(0, 16),
          type: 'KAS_MASUK',
          category: 'TARIK_BCA',
          amount: setupData.kas_balance,
          recipient_or_source: 'Setoran Saldo Awal Brankas',
          description: 'Setoran Saldo Awal Kas Brankas Kantor',
          logged_by: currentUser?.username || 'owner'
        }
      ]);
    }

    // 2. Process Initial Payables (Utang Bawaan Transaksi Lama)
    const newSuppliers: Supplier[] = [...suppliers];
    const newWeighbridges: WeighbridgeIn[] = [];

    setupData.payables.forEach((p, idx) => {
      let existingSup = newSuppliers.find(s => s.name.toLowerCase() === p.supplier_name.trim().toLowerCase());
      if (!existingSup) {
        existingSup = {
          id: `sup-init-${Date.now()}-${idx}`,
          name: p.supplier_name.trim(),
          bank_name: p.bank_name || 'BCA',
          bank_account_number: p.bank_account_number || '-',
          phone: '-',
          status: 'AKTIF'
        };
        newSuppliers.push(existingSup);
      }

      newWeighbridges.push({
        id: `wb-init-${Date.now()}-${idx}`,
        ticket_number: p.invoice_no || `UTANG-BAWAAN-${idx + 1}`,
        datetime_in: new Date().toISOString().replace('T', ' ').substring(0, 16),
        nopol: 'SALDO-AWAL',
        supplier_id: existingSup.id,
        supplier_name: existingSup.name,
        gross_weight: 0,
        tare_weight: 0,
        bag_deduction: 0,
        net_weight: 0,
        allocations: [],
        transfer_status: 'PENDING_TRANSFER',
        total_payment: p.amount,
        price_per_kg: 0,
        status: 'SELESAI'
      });
    });

    setSuppliers(newSuppliers);
    if (newWeighbridges.length > 0) {
      setWeighbridgeInList(prev => [...newWeighbridges, ...prev]);
    }

    // 3. Process Initial Receivables (Piutang Bawaan Transaksi Lama)
    const newCustomers: Customer[] = [...customers];
    const newDOs: SalesDeliveryOrder[] = [];

    setupData.receivables.forEach((r, idx) => {
      let existingCust = newCustomers.find(c => c.name.toLowerCase() === r.customer_name.trim().toLowerCase());
      if (!existingCust) {
        existingCust = {
          id: `cust-init-${Date.now()}-${idx}`,
          name: r.customer_name.trim(),
          brand_aka: r.brand_aka || 'BUMI SUBUR',
          contact_person: 'Penanggung Jawab',
          phone: '-',
          address: 'Alamat Konsumen',
          credit_limit: 500000000,
          payment_term: 'TEMPO_14_HARI',
          status: 'AKTIF'
        };
        newCustomers.push(existingCust);
      }

      newDOs.push({
        id: `do-init-${Date.now()}-${idx}`,
        do_number: r.invoice_no || `PIUTANG-BAWAAN-${idx + 1}`,
        invoice_number: r.invoice_no || `INV-BAWAAN-${idx + 1}`,
        order_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        customer_id: existingCust.id,
        customer_name: existingCust.name,
        brand_aka: r.brand_aka || existingCust.brand_aka || 'BUMI SUBUR',
        items: [],
        total_invoice_amount: r.amount,
        payment_status: 'BELUM_BAYAR',
        status: 'SHIPPED',
        created_at: new Date().toISOString()
      });
    });

    setCustomers(newCustomers);
    if (newDOs.length > 0) {
      setDeliveryOrders(prev => [...newDOs, ...prev]);
    }

    // 4. Initial Stock Beras & Sak
    if (setupData.stapel_stock_kg > 0) {
      setStapelPiles([
        { id: 'stapel-init-1', name: 'Stapel 1 (Gudang Utama - Saldo Awal)', quality_grade: 'Standar Pabrik', current_stock_kg: setupData.stapel_stock_kg, created_at: new Date().toISOString() }
      ]);
    }
    if (setupData.sak_stock_pcs > 0) {
      setSakItems([
        { id: 'sak-init-1', name: 'Karung Sak 50kg Outer (Saldo Awal)', sak_type: 'OUTER', unit: 'PCS', stock_current: setupData.sak_stock_pcs }
      ]);
    }

    addAuditLog('Set Saldo Awal Lengkap', `Kas: Rp ${setupData.kas_balance}, Bank: Rp ${setupData.bank_balance}, Utang: ${setupData.payables.length} Suplier, Piutang: ${setupData.receivables.length} Pelanggan.`);
  };

  const addSupplier = (supplier: Omit<Supplier, 'id'>): Supplier => {
    const newSupplier: Supplier = {
      ...supplier,
      id: `sup-${Date.now()}`
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    addAuditLog(`Tambah Suplier Baru`, `Nama: ${supplier.name} (${supplier.bank_name})`);
    return newSupplier;
  };

  const updateSupplier = (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s));
    addAuditLog(`Update Suplier`, `Ubah data suplier: ${supplier.name}`);
  };

  const addCustomer = (customer: Omit<Customer, 'id'>): Customer => {
    const newCust: Customer = {
      ...customer,
      id: `cust-${Date.now()}`
    };
    setCustomers(prev => [newCust, ...prev]);
    addAuditLog(`Tambah Customer Baru`, `Nama: ${customer.name}, Limit: Rp ${customer.credit_limit.toLocaleString('id-ID')}`);
    return newCust;
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    addAuditLog(`Update Customer`, `Ubah data customer: ${customer.name}`);
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    addAuditLog(`Hapus Customer`, `Customer ID: ${id}`);
  };

  const addProduct = (product: Omit<ProductItem, 'id'>): ProductItem => {
    const newProd: ProductItem = {
      ...product,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
    addAuditLog(`Tambah Master Barang`, `Nama: ${product.name}, Kode: ${product.code}`);
    return newProd;
  };

  const updateProduct = (product: ProductItem) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    addAuditLog(`Update Master Barang`, `Ubah produk: ${product.name}`);
  };

  const adjustStapelStock = (stapelId: string, newStockKg: number, reason: string) => {
    setStapelPiles(prev => prev.map(s => {
      if (s.id === stapelId) {
        addAuditLog(`Stock Opname Stapel Adjustment`, `${s.name}: Sisa stok diubah dari ${s.stock_kg} KG ke ${newStockKg} KG (Alasan: ${reason})`);
        return { ...s, stock_kg: newStockKg };
      }
      return s;
    }));
  };

  const addStapelPile = (name: string, grade: string): StapelPile => {
    const newStapel: StapelPile = {
      id: `st-${Date.now()}`,
      name,
      stock_kg: 0,
      quality_grade: grade || 'Standar Pabrik'
    };
    setStapelPiles(prev => [...prev, newStapel]);
    addAuditLog(`Tambah Stapel/Tumpukan Baru`, `Nama: ${name}, Grade: ${grade}`);
    return newStapel;
  };

  // ---- Sak Management ----
  const addSakTransaction = (
    sakId: string,
    type: 'MASUK' | 'KELUAR',
    qty: number,
    source: SakTransaction['source'],
    notes?: string
  ) => {
    const sak = sakItems.find(s => s.id === sakId);
    if (!sak) return;
    const newTx: SakTransaction = {
      id: `saktx-${Date.now()}`,
      transaction_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      sak_id: sakId,
      sak_name: sak.name,
      type,
      qty,
      source,
      notes,
      logged_by: currentUser?.username || 'system'
    };
    setSakTransactions(prev => [newTx, ...prev]);
    setSakItems(prev => prev.map(s => {
      if (s.id === sakId) {
        const newStock = type === 'MASUK' ? s.stock_current + qty : Math.max(0, s.stock_current - qty);
        return { ...s, stock_current: newStock };
      }
      return s;
    }));
    addAuditLog(`Sak ${type}`, `${sak.name}: ${type === 'MASUK' ? '+' : '-'}${qty} pcs (${source})`);
  };

  const addSakMasuk = (sakId: string, qty: number, notes?: string) => {
    addSakTransaction(sakId, 'MASUK', qty, 'PEMBELIAN', notes || 'Pembelian sak baru');
  };

  const addExpense = (expense: Omit<ExpenseTransaction, 'id' | 'expense_date'>): ExpenseTransaction => {
    const newExp: ExpenseTransaction = {

      ...expense,
      id: `exp-${Date.now()}`,
      expense_date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setExpenses(prev => [newExp, ...prev]);

    if (expense.payment_source === 'KAS_BRANKAS') {
      addPettyCash({
        type: 'KAS_KELUAR',
        amount: expense.amount,
        source_destination: 'Brankas Kantor',
        recipient_payer: expense.recipient_name,
        description: `[${expense.category}] ${expense.description}`,
        quick_tag: expense.category === 'UPAH_BURUH' ? 'UPAH_BURUH' : expense.category === 'BBM_SOLAR' ? 'SOLAR' : 'LAINNYA'
      });
    } else {
      setBankBalance(b => b - expense.amount);
      addAuditLog(`Biaya Operasional Bank BCA`, `Rp ${expense.amount.toLocaleString('id-ID')} untuk ${expense.recipient_name} (${expense.category})`);
    }

    return newExp;
  };

  const addWeighbridgeIn = (data: Omit<WeighbridgeIn, 'id' | 'ticket_number' | 'transfer_status' | 'transfer_proof_file' | 'price_per_kg' | 'total_payment' | 'transfer_plan_date'>): WeighbridgeIn => {
    const ticketSeq = String(weighbridgeInList.length + 1).padStart(4, '0');
    const newEntry: WeighbridgeIn = {
      ...data,
      id: `wb-${Date.now()}`,
      ticket_number: `STT-2026-${ticketSeq}`,
      price_per_kg: null,
      total_payment: null,
      transfer_plan_date: null,
      transfer_status: 'PENDING_PRICE',
      transfer_proof_file: null,
      status: 'MASUK'
    };

    // If gross/net is immediately calculated & allocations provided
    if (data.allocations && data.allocations.length > 0) {
      data.allocations.forEach(alloc => {
        if (!alloc.is_direct_cor && alloc.stapel_id) {
          setStapelPiles(piles => piles.map(p => p.id === alloc.stapel_id ? { ...p, stock_kg: p.stock_kg + alloc.allocated_kg } : p));
        }
      });
    }

    setWeighbridgeInList(prev => [newEntry, ...prev]);
    addAuditLog(`Input Timbangan Digital (STT)`, `No STT: ${newEntry.ticket_number}, Nopol: ${data.nopol}, Netto: ${data.net_weight.toLocaleString('id-ID')} KG`);
    return newEntry;
  };

  const updateTareAndFinishWeighbridge = (id: string, tareWeight: number, sacks?: string | number, goods?: string) => {
    setWeighbridgeInList(prev => prev.map(item => {
      if (item.id === id) {
        const netWeight = Math.max(0, item.gross_weight - tareWeight);
        const datetimeOut = new Date().toISOString().replace('T', ' ').substring(0, 16);

        if (item.allocations && item.allocations.length > 0) {
          item.allocations.forEach(alloc => {
            if (!alloc.is_direct_cor && alloc.stapel_id) {
              setStapelPiles(piles => piles.map(p => p.id === alloc.stapel_id ? { ...p, stock_kg: p.stock_kg + netWeight } : p));
            }
          });
        }

        addAuditLog(`Timbang Keluar (Tara)`, `No STT: ${item.ticket_number}, Nopol: ${item.nopol}, Bruto: ${item.gross_weight} KG, Tara: ${tareWeight} KG, Netto: ${netWeight.toLocaleString('id-ID')} KG`);

        return {
          ...item,
          datetime_out: datetimeOut,
          tare_weight: tareWeight,
          net_weight: netWeight,
          sacks: sacks !== undefined ? sacks : item.sacks,
          goods: goods !== undefined ? goods : item.goods,
          status: 'SELESAI'
        };
      }
      return item;
    }));
  };

  const deleteWeighbridgeIn = (id: string) => {
    setWeighbridgeInList(prev => prev.filter(item => item.id !== id));
    addAuditLog(`Hapus Antrean Timbangan`, `Truk ID: ${id}`);
  };

  const setOwnerPriceAndSchedule = (id: string, pricePerKg: number, planDate: string) => {
    setWeighbridgeInList(prev =>
      prev.map(item => {
        if (item.id === id) {
          const totalPayment = item.net_weight * pricePerKg;
          addAuditLog(`Owner Penetapan Harga Gabah`, `No STT: ${item.ticket_number}, Harga: Rp ${pricePerKg.toLocaleString('id-ID')}/KG, Total: Rp ${totalPayment.toLocaleString('id-ID')}, Transfer: ${planDate}`);
          return {
            ...item,
            price_per_kg: pricePerKg,
            total_payment: totalPayment,
            transfer_plan_date: planDate,
            transfer_status: 'SCHEDULED_H1'
          };
        }
        return item;
      })
    );
  };

  const confirmOwnerTransfer = (id: string, proofFile: string) => {
    setWeighbridgeInList(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (item.total_payment) {
            setBankBalance(b => b - item.total_payment!);
          }
          addAuditLog(`Owner Verifikasi Transfer Hari H`, `No STT: ${item.ticket_number}, Lunas Rp ${item.total_payment?.toLocaleString('id-ID')}`);
          return {
            ...item,
            transfer_proof_file: proofFile || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
            transfer_status: 'PAID_H_DAY'
          };
        }
        return item;
      })
    );
  };

  const createCorBatch = (batch: Omit<MillingCorBatch, 'id'>) => {
    const newBatch: MillingCorBatch = {
      ...batch,
      id: `batch-${Date.now()}`
    };
    setCorBatches(prev => [newBatch, ...prev]);
    batch.items.forEach(item => {
      setStapelPiles(piles =>
        piles.map(p => p.name === item.stapel_pile_name ? { ...p, stock_kg: Math.max(0, p.stock_kg - item.required_kg) } : p)
      );
    });
    addAuditLog(`Admin 2 Recipe Cor Batch`, `Produk: ${batch.target_product_name}, Total: ${batch.total_target_kg.toLocaleString('id-ID')} KG`);
  };

  const requestPackaging = (log: Omit<PackagingStockLog, 'id'>) => {
    const newLog: PackagingStockLog = {
      ...log,
      id: `pkg-${Date.now()}`
    };
    setPackagingLogs(prev => [newLog, ...prev]);
    addAuditLog(`Admin 2 Minta Sak Karung`, `Merek: ${log.bag_type}, Qty: ${log.qty_requested} Sak, Mandor: ${log.taken_by_mandor}`);
  };

  const saveByproductOpname = (opname: Omit<ByproductOpname, 'id'>) => {
    const newOpname: ByproductOpname = {
      ...opname,
      id: `byp-${Date.now()}`
    };
    setByproductOpnames(prev => [newOpname, ...prev]);
    addAuditLog(`Admin 2 Opname Hasil Sore`, `Beras Jadi: ${opname.beras_jadi_kg} KG, Broken A: ${opname.broken_a_kg || opname.katul_kg || 0} KG, Menir: ${opname.menir_kg} KG, Reject: ${opname.rijek_kg} KG`);
  };

  const saveTruckTier = (tier: Omit<TruckLoadTier, 'id'>) => {
    const newTier: TruckLoadTier = {
      ...tier,
      id: `tr-${Date.now()}`
    };
    setTruckTiers(prev => [newTier, ...prev]);
    addAuditLog(`Admin 2 Tally Tier Truk`, `Nopol: ${tier.nopol}, Total: ${tier.total_sak} Sak (${tier.total_kg.toLocaleString('id-ID')} KG) ke ${tier.destination}`);
  };

  const createDeliveryOrder = (doData: Omit<SalesDeliveryOrder, 'id' | 'do_number' | 'invoice_number' | 'selling_price_per_kg' | 'total_invoice_amount' | 'payment_status' | 'created_at'>): SalesDeliveryOrder => {
    const doSeq = String(deliveryOrders.length + 90).padStart(3, '0');
    const newDO: SalesDeliveryOrder = {
      ...doData,
      id: `do-${Date.now()}`,
      do_number: `DO-2026-${doSeq}`,
      invoice_number: null,
      selling_price_per_kg: null,
      total_invoice_amount: null,
      payment_status: 'UNPAID',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setDeliveryOrders(prev => [newDO, ...prev]);
    addAuditLog(`Admin 1 Terbit Surat Jalan (DO)`, `No DO: ${newDO.do_number}, Customer: ${doData.customer_name}, Total: ${doData.total_kg.toLocaleString('id-ID')} KG`);
    return newDO;
  };

  const setInvoicePrice = (id: string, pricePerKg: number) => {
    setDeliveryOrders(prev =>
      prev.map(item => {
        if (item.id === id) {
          const invSeq = item.do_number.replace('DO', 'INV');
          const totalAmount = item.total_kg * pricePerKg;
          addAuditLog(`Owner Set Harga Jual Invoice`, `No DO: ${item.do_number}, Harga Jual: Rp ${pricePerKg.toLocaleString('id-ID')}/KG, Total Invoice: Rp ${totalAmount.toLocaleString('id-ID')}`);
          return {
            ...item,
            invoice_number: invSeq,
            selling_price_per_kg: pricePerKg,
            total_invoice_amount: totalAmount,
            paid_amount: 0,
            remaining_balance: totalAmount,
            payment_status: 'TEMPO'
          };
        }
        return item;
      })
    );
  };

  const confirmDOShipped = (doId: string, actualShipDate: string) => {
    setDeliveryOrders(prev =>
      prev.map(item => {
        if (item.id === doId) {
          addAuditLog(`Konfirmasi DO Terkirim`, `DO: ${item.do_number} → TERKIRIM tgl ${actualShipDate}`);
          return {
            ...item,
            status: 'TERKIRIM' as any,
            actual_ship_date: actualShipDate
          };
        }
        return item;
      })
    );
  };

  const addInvoicePayment = (doId: string, amount: number, paymentMethod: 'TUNAI' | 'TRANSFER_BCA', paymentDate: string, notes?: string) => {
    setDeliveryOrders(prev =>
      prev.map(item => {
        if (item.id === doId && item.total_invoice_amount) {
          const prevPaid = item.paid_amount || 0;
          const newPaid = prevPaid + amount;
          const newRemaining = Math.max(0, item.total_invoice_amount - newPaid);
          const newStatus = newRemaining <= 0 ? 'PAID' : 'CICILAN';

          const newLog = {
            id: `pay-${Date.now()}`,
            payment_date: paymentDate || new Date().toISOString().split('T')[0],
            amount,
            payment_method: paymentMethod,
            notes
          };

          if (paymentMethod === 'TUNAI') {
            addPettyCash({
              type: 'KAS_MASUK',
              amount: amount,
              source_destination: 'Pelunasan Piutang Toko',
              recipient_payer: item.customer_name,
              description: `[PELUNASAN/CICILAN ${item.invoice_number}] ${notes || ''}`,
              quick_tag: 'PELUNASAN_PIUTANG'
            });
          } else {
            setBankBalance(b => b + amount);
          }

          addAuditLog(
            `Admin 1 Input Pelunasan/Cicilan Piutang`,
            `No Invoice: ${item.invoice_number}, Customer: ${item.customer_name}, Bayar: Rp ${amount.toLocaleString('id-ID')} (${paymentMethod}), Sisa Piutang: Rp ${newRemaining.toLocaleString('id-ID')}`
          );

          return {
            ...item,
            paid_amount: newPaid,
            remaining_balance: newRemaining,
            payment_status: newStatus,
            payment_logs: [...(item.payment_logs || []), newLog]
          };
        }
        return item;
      })
    );
  };

  const addPettyCash = (tx: Omit<PettyCashTransaction, 'id' | 'transaction_time'>) => {
    const newTx: PettyCashTransaction = {
      ...tx,
      id: `pc-${Date.now()}`,
      transaction_time: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setPettyCash(prev => [newTx, ...prev]);

    if (tx.type === 'KAS_MASUK' && tx.quick_tag === 'TARIK_BCA') {
      setBankBalance(b => b - tx.amount);
    }
    addAuditLog(`Admin 1 Catat Kas (${tx.type})`, `Nominal: Rp ${tx.amount.toLocaleString('id-ID')}, Untuk: ${tx.recipient_payer} (${tx.quick_tag})`);
  };

  const addPettyCashCategory = (catName: string) => {
    const formatted = catName.trim().toUpperCase().replace(/\s+/g, '_');
    if (!formatted) return;
    if (!pettyCashCategories.includes(formatted)) {
      setPettyCashCategories(prev => [...prev, formatted]);
      addAuditLog(`Tambah Kategori Kas Kecil`, `Kategori Baru: ${formatted}`);
    }
  };

  const updateDOItemLoadedQty = (doId: string, itemId: string, actualLoadedKg: number) => {
    setDeliveryOrders(prev => prev.map(d => {
      if (d.id === doId) {
        const updatedItems = d.items.map(it => {
          if (it.id === itemId) {
            return { ...it, actual_loaded_kg: actualLoadedKg };
          }
          return it;
        });
        addAuditLog(`Admin 2 Field Adjust Muatan DO`, `DO: ${d.do_number}, Item ${itemId}: actual_loaded_kg set to ${actualLoadedKg} KG`);
        return {
          ...d,
          items: updatedItems,
          status: 'DI_MUAT_TRUK'
        };
      }
      return d;
    }));
  };

  const exportToCSV = (filename: string, rows: any[]) => {
    if (!rows || !rows.length) {
      alert('Tidak ada data untuk diekspor!');
      return;
    }
    const keys = Object.keys(rows[0]);
    const csvContent = [
      keys.join(','),
      ...rows.map(row => keys.map(k => `"${String(row[k] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog(`Export Data Excel/CSV`, `Download file ${filename}.csv (${rows.length} baris)`);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeScreen,
        setActiveScreen,
        journalEntries,
        coaList,
        addJournalEntry,
        currentUser,
        userAccounts,
        addUserAccount,
        updateUserAccount,
        deleteUserAccount,
        login,
        logout,
        auditLogs,
        addAuditLog,
        suppliers,
        customers,
        products,
        loadSampleMasterData,
        expenses,
        weighbridgeInList,
        corBatches,
        packagingLogs,
        byproductOpnames,
        truckTiers,
        deliveryOrders,
        pettyCash,
        stapelPiles,
        sakItems,
        sakTransactions,
        addSakMasuk,
        addSakTransaction,
        pettyCashCategories,
        addPettyCashCategory,
        updateDOItemLoadedQty,
        cashBalance,
        bankBalance,
        setBankBalance,
        setInitialFinancialBalances,
        saveAllInitialSetup,
        addSupplier,
        updateSupplier,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addProduct,
        updateProduct,
        adjustStapelStock,
        addStapelPile,
        addExpense,
        addWeighbridgeIn,
        updateTareAndFinishWeighbridge,
        deleteWeighbridgeIn,
        setOwnerPriceAndSchedule,
        confirmOwnerTransfer,
        createCorBatch,
        requestPackaging,
        saveByproductOpname,
        saveTruckTier,
        createDeliveryOrder,
        setInvoicePrice,
        confirmDOShipped,
        addInvoicePayment,
        addPettyCash,
        exportToCSV
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
