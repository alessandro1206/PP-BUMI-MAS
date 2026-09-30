-- PP BUMI MAS - DATABASE SCHEMA (POSTGRESQL / MYSQL / SQLITE)

CREATE TABLE IF NOT EXISTS suppliers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(64) NOT NULL,
    bank_account_number VARCHAR(64) NOT NULL,
    phone VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS weighbridge_in (
    id VARCHAR(64) PRIMARY KEY,
    ticket_number VARCHAR(64) UNIQUE NOT NULL,
    datetime_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nopol VARCHAR(32) NOT NULL,
    supplier_id VARCHAR(64) REFERENCES suppliers(id),
    gross_weight DECIMAL(10,2) NOT NULL,
    tare_weight DECIMAL(10,2) DEFAULT 0,
    bag_deduction DECIMAL(10,2) DEFAULT 0,
    net_weight DECIMAL(10,2) NOT NULL,
    price_per_kg DECIMAL(10,2),
    total_payment DECIMAL(15,2),
    transfer_plan_date DATE,
    transfer_status VARCHAR(32) DEFAULT 'PENDING_PRICE', -- PENDING_PRICE, SCHEDULED_H1, PAID_H_DAY
    transfer_proof_file TEXT
);

CREATE TABLE IF NOT EXISTS milling_cor_batches (
    id VARCHAR(64) PRIMARY KEY,
    batch_date DATE NOT NULL,
    target_product_name VARCHAR(255) NOT NULL,
    total_target_kg DECIMAL(10,2) NOT NULL,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS milling_cor_items (
    id VARCHAR(64) PRIMARY KEY,
    batch_id VARCHAR(64) REFERENCES milling_cor_batches(id),
    stapel_pile_name VARCHAR(128) NOT NULL,
    ratio_parts INT NOT NULL,
    required_kg DECIMAL(10,2) NOT NULL,
    remaining_stock_kg DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS packaging_stock_logs (
    id VARCHAR(64) PRIMARY KEY,
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bag_type VARCHAR(64) NOT NULL,
    qty_requested INT NOT NULL,
    qty_used INT NOT NULL,
    qty_rejected INT DEFAULT 0,
    taken_by_mandor VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS byproduct_opname (
    id VARCHAR(64) PRIMARY KEY,
    opname_date DATE NOT NULL,
    katul_kg DECIMAL(10,2) DEFAULT 0,
    menir_kg DECIMAL(10,2) DEFAULT 0,
    rijek_kg DECIMAL(10,2) DEFAULT 0,
    beras_jadi_kg DECIMAL(10,2) DEFAULT 0,
    checker_name VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS truck_load_tiers (
    id VARCHAR(64) PRIMARY KEY,
    load_date DATE NOT NULL,
    nopol VARCHAR(32) NOT NULL,
    tier_count INT NOT NULL,
    sak_per_tier INT NOT NULL,
    total_sak INT NOT NULL,
    total_kg DECIMAL(10,2) NOT NULL,
    destination VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS sales_delivery_orders (
    id VARCHAR(64) PRIMARY KEY,
    do_number VARCHAR(64) UNIQUE NOT NULL,
    invoice_number VARCHAR(64),
    customer_name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    total_kg DECIMAL(10,2) NOT NULL,
    selling_price_per_kg DECIMAL(10,2),
    total_invoice_amount DECIMAL(15,2),
    payment_status VARCHAR(32) DEFAULT 'UNPAID', -- UNPAID, TEMPO, PAID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS petty_cash_transactions (
    id VARCHAR(64) PRIMARY KEY,
    transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(32) NOT NULL, -- KAS_MASUK, KAS_KELUAR
    amount DECIMAL(15,2) NOT NULL,
    source_destination VARCHAR(255) NOT NULL,
    recipient_payer VARCHAR(255) NOT NULL,
    description TEXT,
    quick_tag VARCHAR(64) NOT NULL -- UPAH_BURUH, SOLAR, MAKAN_LEMBUR, TARIK_BCA
);
