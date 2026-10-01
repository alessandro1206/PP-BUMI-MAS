"""
=============================================================================
PP BUMI MAS ERP - Server OCR Nopol CCTV TP-Link (Local POS API)
=============================================================================
Skrip Python ini berfungsi sebagai microservice lokal untuk mengambil foto 1 frame 
dari stream CCTV RTSP TP-Link di pos timbangan dan membaca Plat Nomor Polisi (Nopol) 
armada truk menggunakan PaddleOCR.

Persyaratan Library Python:
  pip install flask flask-cors opencv-python paddlepaddle paddleocr numpy

Cara menjalankan di komputer Pos Timbangan:
  python server_cctv.py

Endpoint API:
  GET  http://localhost:5000/scan-nopol
  POST http://localhost:5000/scan-nopol
=============================================================================
"""

import os
import re
import sys
import logging
import numpy as np
import cv2
import threading
import time
from flask import Flask, jsonify, request
from flask_cors import CORS

try:
    import serial
    import serial.tools.list_ports
except ImportError:
    serial = None

# Setup logging
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s: %(message)s')
logger = logging.getLogger("CCTV_Scale_Server")

app = Flask(__name__)
CORS(app)  # Izinkan CORS agar website ERP (Vite / localhost) bisa akses API port 5000

# =============================================================================
# HARDWARE SCALE SERIAL MANAGER (RS232 / COM Port)
# =============================================================================
class ScaleManager:
    def __init__(self):
        self.conn = None
        self.port = "COM3"
        self.baudrate = 9600
        self.is_connected = False
        self.is_reading = False
        self.current_weight = 0.0
        self.is_stable = True
        self.last_raw = ""
        self.lock = threading.Lock()

    def get_ports(self):
        if not serial:
            return []
        try:
            return [p.device for p in serial.tools.list_ports.comports()]
        except Exception:
            return []

    def connect(self, port, baudrate=9600):
        if not serial:
            return False, "Modul pyserial belum terpasang."
        self.disconnect()
        try:
            self.conn = serial.Serial(port, baudrate=int(baudrate), timeout=1)
            self.port = port
            self.baudrate = int(baudrate)
            self.is_connected = True
            self.is_reading = True
            threading.Thread(target=self._read_loop, daemon=True).start()
            logger.info(f"Scale serial terhubung ke {port} @ {baudrate}")
            return True, f"Terhubung ke {port} @ {baudrate} bps"
        except Exception as e:
            self.is_connected = False
            logger.error(f"Gagal koneksi scale serial {port}: {e}")
            return False, str(e)

    def disconnect(self):
        self.is_reading = False
        if self.conn and self.conn.is_open:
            try:
                self.conn.close()
            except Exception:
                pass
        self.conn = None
        self.is_connected = False
        logger.info("Scale serial terputus.")

    def _read_loop(self):
        while self.is_reading and self.conn and self.conn.is_open:
            try:
                if self.conn.in_waiting:
                    line = self.conn.readline().decode('ascii', errors='ignore').strip()
                    if line:
                        with self.lock:
                            self.last_raw = line
                            if 'ST' in line:
                                self.is_stable = True
                            elif 'US' in line:
                                self.is_stable = False
                            
                            m = re.search(r'[-+]?\s*\d*\.\d+|[-+]?\s*\d+', line)
                            if m:
                                try:
                                    val = float(m.group().replace(' ', ''))
                                    if 0 <= val < 150000:
                                        self.current_weight = val
                                except ValueError:
                                    pass
                time.sleep(0.04)
            except Exception:
                time.sleep(0.1)

scale_manager = ScaleManager()


# =============================================================================
# KONFIGURASI CCTV TP-LINK & PADDLEOCR
# =============================================================================
# RTSP URL CCTV TP-Link (Tapo / VIGI)
# Format RTSP TP-Link Tapo: rtsp://username:password@IP_CCTV:554/stream1
# Format RTSP TP-Link VIGI: rtsp://username:password@IP_CCTV:554/h264/ch1/main/av_stream
RTSP_URL = os.getenv("CCTV_RTSP_URL", "rtsp://admin:admin123@192.168.1.60:554/stream1")

# Fallback ke webcam USB jika RTSP gagal / mode testing (0 = default webcam)
FALLBACK_TO_WEBCAM = os.getenv("FALLBACK_TO_WEBCAM", "true").lower() == "true"

# Inisialisasi PaddleOCR (CPU mode secara bawaan agar kompatibel di semua PC Pos)
logger.info("Menginisialisasi PaddleOCR Engine...")
try:
    from paddleocr import PaddleOCR
    # lang='en' atau 'id' bagus untuk karakter huruf & angka latin
    ocr_engine = PaddleOCR(use_angle_cls=True, lang='en', show_log=False, use_gpu=False)
    logger.info("PaddleOCR Engine berhasil dimuat!")
except Exception as e:
    logger.error(f"Gagal memuat PaddleOCR: {e}")
    ocr_engine = None


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================
def clean_nopol_text(text_list):
    """
    Ekstrak & format teks plat nomor Indonesia dari hasil deteksi PaddleOCR.
    Format Plat Nomor: 1-2 Huruf (Kode Wilayah) + 1-4 Angka + 1-3 Huruf (Seri)
    Contoh: L 9482 UB, B 1234 XYZ, N 888 AB, W 1020 A
    """
    nopol_pattern = re.compile(r'\b([A-Z]{1,2})\s*(\d{1,4})\s*([A-Z]{1,3})\b', re.IGNORECASE)

    for item in text_list:
        raw_str = item.strip().upper()
        # Bersihkan karakter aneh
        cleaned = re.sub(r'[^A-Z0-9\s]', '', raw_str)
        
        match = nopol_pattern.search(cleaned)
        if match:
            kode_wilayah = match.group(1).upper()
            angka = match.group(2)
            seri = match.group(3).upper()
            return f"{kode_wilayah} {angka} {seri}"

    # Jika pola baku tidak ketemu, coba gabungkan teks angka dan huruf terdeteksi
    combined = " ".join(text_list).upper()
    match = nopol_pattern.search(combined)
    if match:
        return f"{match.group(1)} {match.group(2)} {match.group(3)}"

    return ""


def capture_frame_from_cctv():
    """
    Membuka stream RTSP CCTV TP-Link dan mengambil 1 frame foto terbaru.
    """
    logger.info(f"Membuka RTSP Stream CCTV: {RTSP_URL}")
    cap = cv2.VideoCapture(RTSP_URL)
    
    # Set buffer size terkecil agar tidak terjadi delay/lag snapshot
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

    if not cap.isOpened():
        logger.warning("Stream RTSP CCTV tidak dapat dibuka!")
        cap.release()
        
        if FALLBACK_TO_WEBCAM:
            logger.info("Mencoba fallback ke Webcam USB lokal (device 0)...")
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                cap.release()
                return None, "Gagal terhubung ke CCTV RTSP dan Webcam USB"

    # Buang beberapa frame awal buffer untuk dapatkan frame terbaru (fresh photo)
    for _ in range(3):
        cap.read()

    ret, frame = cap.read()
    cap.release()

    if not ret or frame is None:
        return None, "Gagal mengambil frame foto dari kamera"

    return frame, None


# =============================================================================
# ENDPOINT API
# =============================================================================
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ONLINE",
        "service": "PP Bumi Mas CCTV OCR Nopol Service",
        "rtsp_url": RTSP_URL,
        "ocr_loaded": ocr_engine is not None
    })


@app.route("/scan-nopol", methods=["GET", "POST"])
def scan_nopol():
    """
    Endpoint utama yang dipanggil oleh tombol [ SCAN NOPOL CCTV ] di website ERP.
    """
    logger.info("Menerima permintaan scan Nopol CCTV...")

    if ocr_engine is None:
        return jsonify({
            "success": False,
            "nopol": "",
            "message": "Engine PaddleOCR belum terpasang atau gagal dimuat di server Python."
        }), 500

    # 1. Ambil 1 frame foto dari CCTV
    frame, err_msg = capture_frame_from_cctv()
    if err_msg or frame is None:
        logger.error(f"Capture error: {err_msg}")
        return jsonify({
            "success": False,
            "nopol": "",
            "message": f"Gagal membaca CCTV: {err_msg}. Periksa koneksi RTSP IP camera."
        }), 500

    # 2. Proses foto dengan PaddleOCR
    try:
        # PaddleOCR menerima array OpenCV BGR / RGB
        result = ocr_engine.ocr(frame, cls=True)

        detected_texts = []
        if result and len(result) > 0 and result[0] is not None:
            for line in result[0]:
                text = line[1][0]
                confidence = line[1][1]
                logger.info(f"Detected Text: '{text}' (Conf: {confidence:.2f})")
                detected_texts.append(text)

        # 3. Ekstrak format Plat Nopol dari teks terdeteksi
        nopol_result = clean_nopol_text(detected_texts)

        if nopol_result:
            logger.info(f"✅ Nopol Terdeteksi: {nopol_result}")
            return jsonify({
                "success": True,
                "nopol": nopol_result,
                "raw_texts": detected_texts,
                "message": "Nopol berhasil dibaca dari CCTV"
            })
        else:
            raw_concat = ", ".join(detected_texts) if detected_texts else "Tidak ada teks terdeteksi"
            logger.warning(f"❌ Nopol tidak terdeteksi. Teks mentah: {raw_concat}")
            return jsonify({
                "success": False,
                "nopol": "",
                "raw_texts": detected_texts,
                "message": f"Plat Nopol tidak terbaca dengan jelas. Teks terdeteksi: '{raw_concat}'"
            }), 200

    except Exception as e:
        logger.error(f"Error saat proses OCR: {e}")
        return jsonify({
            "success": False,
            "nopol": "",
            "message": f"Terjadi kesalahan pada OCR: {str(e)}"
        }), 500


# =============================================================================
# ENDPOINT TIMBANGAN SERIAL RS232 / HARDWARE SCALE BRIDGE
# =============================================================================
@app.route('/ports', methods=['GET'])
def get_serial_ports():
    """Daftar Port COM yang tersedia di Windows."""
    ports = scale_manager.get_ports()
    return jsonify({
        "success": True,
        "ports": ports,
        "connected_port": scale_manager.port if scale_manager.is_connected else None
    })

@app.route('/connect-scale', methods=['POST'])
def connect_scale():
    """Hubungkan hardware timbangan ke port COM tertentu."""
    data = request.json or {}
    port = data.get('port', 'COM3')
    baudrate = data.get('baudrate', 9600)
    success, msg = scale_manager.connect(port, baudrate)
    return jsonify({
        "success": success,
        "message": msg,
        "connected": scale_manager.is_connected,
        "port": scale_manager.port,
        "baudrate": scale_manager.baudrate
    })

@app.route('/disconnect-scale', methods=['POST'])
def disconnect_scale():
    """Putuskan koneksi hardware timbangan."""
    scale_manager.disconnect()
    return jsonify({
        "success": True,
        "connected": False,
        "message": "Koneksi timbangan serial diputuskan."
    })

@app.route('/scale-weight', methods=['GET'])
def get_scale_weight():
    """Ambil data pembacaan berat realtime dari timbangan."""
    with scale_manager.lock:
        return jsonify({
            "connected": scale_manager.is_connected,
            "port": scale_manager.port,
            "baudrate": scale_manager.baudrate,
            "weight": scale_manager.current_weight,
            "stable": scale_manager.is_stable,
            "raw": scale_manager.last_raw
        })


if __name__ == "__main__":
    print("\n" + "="*70)
    print(" 🚀 PP BUMI MAS ERP - SERVER POS: CCTV OCR & SCALE HARDWARE")
    print(" Port: 5000")
    print(" Endpoint CCTV OCR : http://localhost:5000/scan-nopol")
    print(" Endpoint Scale COM: http://localhost:5000/scale-weight")
    print(" Daftar Port COM   : http://localhost:5000/ports")
    print(" Press Ctrl+C to stop server")
    print("="*70 + "\n")

    app.run(host="0.0.0.0", port=5000, debug=False)

