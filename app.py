import os
import sqlite3
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, 'dist')

app = Flask(__name__, static_folder=DIST_DIR, static_url_path='')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

DB_FILE = os.path.join(BASE_DIR, 'bumi_mas.db')

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS suppliers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            bank_name TEXT NOT NULL,
            bank_account_number TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            status TEXT DEFAULT 'AKTIF'
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            contact_person TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT,
            credit_limit REAL DEFAULT 0,
            payment_term TEXT DEFAULT 'TEMPO_7_HARI',
            status TEXT DEFAULT 'AKTIF'
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            unit TEXT DEFAULT 'SAK',
            weight_per_unit REAL DEFAULT 50,
            empty_bag_stock INTEGER DEFAULT 0,
            finished_goods_stock_kg REAL DEFAULT 0,
            base_price_per_kg REAL DEFAULT 0
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id TEXT PRIMARY KEY,
            expense_date TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            payment_source TEXT NOT NULL,
            recipient_name TEXT NOT NULL,
            description TEXT,
            logged_by TEXT NOT NULL
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS weighbridge_in (
            id TEXT PRIMARY KEY,
            ticket_number TEXT UNIQUE NOT NULL,
            datetime_in TEXT NOT NULL,
            nopol TEXT NOT NULL,
            supplier_id TEXT NOT NULL,
            supplier_name TEXT NOT NULL,
            gross_weight REAL NOT NULL,
            tare_weight REAL DEFAULT 0,
            bag_deduction REAL DEFAULT 0,
            net_weight REAL NOT NULL,
            price_per_kg REAL,
            total_payment REAL,
            transfer_plan_date TEXT,
            transfer_status TEXT DEFAULT 'PENDING_PRICE',
            transfer_proof_file TEXT
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS sales_delivery_orders (
            id TEXT PRIMARY KEY,
            do_number TEXT UNIQUE NOT NULL,
            invoice_number TEXT,
            customer_name TEXT NOT NULL,
            product_name TEXT NOT NULL,
            total_kg REAL NOT NULL,
            selling_price_per_kg REAL,
            total_invoice_amount REAL,
            payment_status TEXT DEFAULT 'UNPAID',
            created_at TEXT NOT NULL
        )''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS petty_cash_transactions (
            id TEXT PRIMARY KEY,
            transaction_time TEXT NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            source_destination TEXT NOT NULL,
            recipient_payer TEXT NOT NULL,
            description TEXT,
            quick_tag TEXT NOT NULL
        )''')

        conn.commit()
        conn.close()
    except Exception as e:
        print("DB Init Error:", e)

try:
    init_db()
except Exception:
    pass

@app.route('/')
def index():
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')
    return "<h1>PP BUMI MAS ERP Backend Server</h1>"

@app.route('/<path:path>')
def serve_static(path):
    file_path = os.path.join(DIST_DIR, path)
    if os.path.exists(file_path):
        return send_from_directory(DIST_DIR, path)
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')
    return "File not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
