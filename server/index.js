import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// In-Memory Database Store (Mirroring Prisma / SQLite Schema)
const db = {
  suppliers: [
    { id: 'sup-1', name: 'H. Suwandi (Jombang)', bank_name: 'BCA', bank_account_number: '0182391201', phone: '081234567890' },
    { id: 'sup-2', name: 'Pak Slamet (Nganjuk)', bank_name: 'BRI', bank_account_number: '38190100291', phone: '081398765432' }
  ],
  weighbridge_in: [
    {
      id: 'wb-1',
      ticket_number: 'STT-2026-0901',
      datetime_in: '2026-09-15 07:15',
      nopol: 'L 9482 UB',
      supplier_id: 'sup-1',
      gross_weight: 25400,
      tare_weight: 0,
      bag_deduction: 150,
      net_weight: 25250,
      price_per_kg: null,
      total_payment: null,
      transfer_plan_date: null,
      transfer_status: 'PENDING_PRICE',
      transfer_proof_file: null
    }
  ],
  milling_cor_batches: [],
  milling_cor_items: [],
  packaging_stock_logs: [],
  byproduct_opname: [],
  truck_load_tiers: [],
  sales_delivery_orders: [],
  petty_cash_transactions: []
};

// ==========================================
// 1. OWNER API ENDPOINTS
// ==========================================

// GET /api/owner/pending-rates: Ambil daftar truk masuk yang belum ditetapkan harganya
app.get('/api/owner/pending-rates', (req, res) => {
  const pending = db.weighbridge_in.filter(w => w.transfer_status === 'PENDING_PRICE');
  res.json({ success: true, count: pending.length, data: pending });
});

// POST /api/owner/set-rate: Simpan harga per KG dan tanggal transfer H-1
app.post('/api/owner/set-rate', (req, res) => {
  const { id, price_per_kg, transfer_plan_date } = req.body;
  const item = db.weighbridge_in.find(w => w.id === id);
  if (!item) return res.status(404).json({ success: false, message: 'Data timbangan tidak ditemukan' });

  item.price_per_kg = price_per_kg;
  item.total_payment = item.net_weight * price_per_kg;
  item.transfer_plan_date = transfer_plan_date;
  item.transfer_status = 'SCHEDULED_H1';

  res.json({ success: true, message: 'Harga & Jadwal Transfer H-1 Berhasil Disimpan', data: item });
});

// GET /api/owner/transfer-schedule: Ambil daftar transfer hari H
app.get('/api/owner/transfer-schedule', (req, res) => {
  const scheduled = db.weighbridge_in.filter(w => w.transfer_status === 'SCHEDULED_H1');
  res.json({ success: true, data: scheduled });
});

// POST /api/owner/confirm-transfer: Verifikasi checklist pembayaran & upload bukti transfer
app.post('/api/owner/confirm-transfer', (req, res) => {
  const { id, transfer_proof_file } = req.body;
  const item = db.weighbridge_in.find(w => w.id === id);
  if (!item) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });

  item.transfer_proof_file = transfer_proof_file || 'default_proof.jpg';
  item.transfer_status = 'PAID_H_DAY';

  res.json({ success: true, message: 'Transfer Hari H Berhasil Dikonfirmasi Lunas', data: item });
});

// POST /api/owner/set-selling-price: Tetapkan harga jual per kg pada draf invoice
app.post('/api/owner/set-selling-price', (req, res) => {
  const { id, selling_price_per_kg } = req.body;
  const item = db.sales_delivery_orders.find(d => d.id === id);
  if (!item) return res.status(404).json({ success: false, message: 'Surat Jalan tidak ditemukan' });

  item.selling_price_per_kg = selling_price_per_kg;
  item.total_invoice_amount = item.total_kg * selling_price_per_kg;
  item.invoice_number = item.do_number.replace('DO', 'INV');
  item.payment_status = 'TEMPO';

  res.json({ success: true, message: 'Harga Jual Invoice Berhasil Ditetapkan', data: item });
});

// ==========================================
// 2. ADMIN 1 API ENDPOINTS (Kantor & Timbangan)
// ==========================================

// POST /api/admin/weighbridge/in: Simpan data jembatan timbang masuk (COM port serial)
app.post('/api/admin/weighbridge/in', (req, res) => {
  const { nopol, supplier_id, gross_weight, bag_deduction } = req.body;
  const net_weight = gross_weight - bag_deduction;
  const ticket_number = `STT-2026-${String(db.weighbridge_in.length + 1).padStart(4, '0')}`;

  const newEntry = {
    id: `wb-${Date.now()}`,
    ticket_number,
    datetime_in: new Date().toISOString().replace('T', ' ').substring(0, 16),
    nopol,
    supplier_id,
    gross_weight,
    tare_weight: 0,
    bag_deduction,
    net_weight,
    price_per_kg: null,
    total_payment: null,
    transfer_plan_date: null,
    transfer_status: 'PENDING_PRICE',
    transfer_proof_file: null
  };

  db.weighbridge_in.push(newEntry);
  res.json({ success: true, message: 'Data Timbangan Masuk Berhasil Disimpan', data: newEntry });
});

// GET /api/admin/weighbridge/pending-stt: Ambil antrean STT
app.get('/api/admin/weighbridge/pending-stt', (req, res) => {
  res.json({ success: true, data: db.weighbridge_in });
});

// POST /api/admin/delivery-order/create: Terbitkan Surat Jalan
app.post('/api/admin/delivery-order/create', (req, res) => {
  const { customer_name, product_name, total_kg } = req.body;
  const do_number = `DO-2026-${String(db.sales_delivery_orders.length + 88).padStart(3, '0')}`;

  const newDO = {
    id: `do-${Date.now()}`,
    do_number,
    invoice_number: null,
    customer_name,
    product_name,
    total_kg,
    selling_price_per_kg: null,
    total_invoice_amount: null,
    payment_status: 'UNPAID',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  db.sales_delivery_orders.push(newDO);
  res.json({ success: true, message: 'Surat Jalan Berhasil Diterbitkan', data: newDO });
});

// POST /api/admin/cash/transaction: Catat transaksi kasir
app.post('/api/admin/cash/transaction', (req, res) => {
  const { type, amount, source_destination, recipient_payer, description, quick_tag } = req.body;
  const newTx = {
    id: `pc-${Date.now()}`,
    transaction_time: new Date().toISOString().replace('T', ' ').substring(0, 16),
    type,
    amount,
    source_destination,
    recipient_payer,
    description,
    quick_tag
  };

  db.petty_cash_transactions.push(newTx);
  res.json({ success: true, message: 'Transaksi Kas Berhasil Disimpan', data: newTx });
});

// GET /api/admin/cash/daily-summary: Ambil rekapitulasi kas harian
app.get('/api/admin/cash/daily-summary', (req, res) => {
  const balance = db.petty_cash_transactions.reduce((acc, curr) => {
    return curr.type === 'KAS_MASUK' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  res.json({ success: true, cash_balance: balance, transactions: db.petty_cash_transactions });
});

// ==========================================
// 3. ADMIN 2 API ENDPOINTS (Mobile Checker HP)
// ==========================================

// POST /api/checker/cor-batch: Simpan rencana cor racikan
app.post('/api/checker/cor-batch', (req, res) => {
  const { batch_date, target_product_name, total_target_kg, notes, items } = req.body;
  const batch_id = `batch-${Date.now()}`;

  const batch = { id: batch_id, batch_date, target_product_name, total_target_kg, notes };
  db.milling_cor_batches.push(batch);

  items.forEach(it => {
    db.milling_cor_items.push({ id: `item-${Date.now()}`, batch_id, ...it });
  });

  res.json({ success: true, message: 'Rencana Cor Berhasil Disimpan', data: batch });
});

// POST /api/checker/bags/take: Catat pengambilan sak kemasan
app.post('/api/checker/bags/take', (req, res) => {
  const { bag_type, qty_requested, qty_rejected, taken_by_mandor } = req.body;
  const log = {
    id: `pkg-${Date.now()}`,
    log_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    bag_type,
    qty_requested,
    qty_used: qty_requested - qty_rejected,
    qty_rejected,
    taken_by_mandor
  };

  db.packaging_stock_logs.push(log);
  res.json({ success: true, message: 'Pengambilan Sak Karung Berhasil Dicatat', data: log });
});

// POST /api/checker/opname/byproduct: Simpan hasil sore
app.post('/api/checker/opname/byproduct', (req, res) => {
  const { opname_date, katul_kg, menir_kg, rijek_kg, beras_jadi_kg, checker_name } = req.body;
  const opname = {
    id: `byp-${Date.now()}`,
    opname_date,
    katul_kg,
    menir_kg,
    rijek_kg,
    beras_jadi_kg,
    checker_name
  };

  db.byproduct_opname.push(opname);
  res.json({ success: true, message: 'Opname Sore Hasil Giling Berhasil Disimpan', data: opname });
});

// POST /api/checker/truck-loading: Simpan perhitungan tier muatan truk
app.post('/api/checker/truck-loading', (req, res) => {
  const { load_date, nopol, tier_count, sak_per_tier, total_sak, total_kg, destination } = req.body;
  const tier = {
    id: `tr-${Date.now()}`,
    load_date,
    nopol,
    tier_count,
    sak_per_tier,
    total_sak,
    total_kg,
    destination
  };

  db.truck_load_tiers.push(tier);
  res.json({ success: true, message: 'Tally Tier Muatan Truk Berhasil Disimpan', data: tier });
});

app.listen(PORT, () => {
  console.log(`PP BUMI MAS Express Backend API running on port ${PORT}`);
});
