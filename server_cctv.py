"""
=============================================================================
PP BUMI MAS ERP - Server CCTV LPR (License Plate Recognition) & Scale Bridge
=============================================================================
Microservice lokal untuk membaca Plat Nomor Polisi (Nopol) truk timbangan
secara otomatis dari IP Camera Dahua 2MP menggunakan EasyOCR dan OpenCV.

Mendukung:
1. Dahua HTTP Digest Snapshot (/cgi-bin/snapshot.cgi?channel=1) - Tercepat & Stabil
2. Dahua RTSP Stream (/cam/realmonitor?channel=1&subtype=0)
3. Preprocessing Plat Nomor Indonesia (Plat Hitam & Plat Putih Baru)
4. Jembatan Timbang Serial RS232 / COM Port Bridge (CAS, Yaohua, Toledo, Universal)
=============================================================================
"""

import os
import re
import sys
import logging
import base64
import time
import threading
from io import BytesIO

import numpy as np
import cv2
import requests
from requests.auth import HTTPDigestAuth, HTTPBasicAuth
from flask import Flask, jsonify, request, Response
from flask_cors import CORS

try:
    import serial
    import serial.tools.list_ports
except ImportError:
    serial = None

try:
    import easyocr
    ocr_reader = easyocr.Reader(['en'], gpu=False, verbose=False)
    logging.info("EasyOCR Engine berhasil dimuat!")
except Exception as e:
    logging.error(f"Gagal memuat EasyOCR: {e}")
    ocr_reader = None

# Setup logging
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s: %(message)s')
logger = logging.getLogger("Dahua_ANPR_Server")

app = Flask(__name__)
CORS(app)

# =============================================================================
# KONFIGURASI DAHUA IP CAMERA 2MP
# =============================================================================
DAHUA_CONFIG = {
    "ip": os.getenv("DAHUA_IP", "192.168.1.108"),
    "user": os.getenv("DAHUA_USER", "admin"),
    "pass": os.getenv("DAHUA_PASS", "admin123"),
    "http_port": int(os.getenv("DAHUA_HTTP_PORT", "80")),
    "rtsp_port": int(os.getenv("DAHUA_RTSP_PORT", "554")),
    "channel": int(os.getenv("DAHUA_CHANNEL", "1")),
}

# =============================================================================
# HARDWARE SCALE SERIAL MANAGER (RS232 / COM Port)
# =============================================================================
class ScaleManager:
    def __init__(self):
        self.conn = None
        self.port = "COM4"
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
                            self._parse_weight(line)
            except Exception as e:
                logger.warning(f"Error pembacaan scale: {e}")
                time.sleep(0.5)
            time.sleep(0.05)

    def _parse_weight(self, raw_str):
        trimmed = raw_str.strip()
        self.is_stable = not ("US" in trimmed or "us" in trimmed)
        # Regex angka berat
        match = re.search(r'([+-]?\d+\.?\d*)', trimmed)
        if match:
            try:
                self.current_weight = float(match.group(1))
            except ValueError:
                pass

scale_manager = ScaleManager()

# =============================================================================
# DAHUA CAPTURE & PREPROCESSING ENGINE
# =============================================================================
def capture_dahua_snapshot(ip=None, user=None, password=None, port=None):
    """
    Mengambil snapshot JPEG resolusi penuh (1080p) langsung dari Dahua IP Camera
    menggunakan HTTP Digest Authentication resmi Dahua.
    Metode ini jauh lebih cepat (<200ms) dan lebih tajam dibanding stream RTSP.
    """
    cam_ip = ip or DAHUA_CONFIG["ip"]
    cam_user = user or DAHUA_CONFIG["user"]
    cam_pass = password or DAHUA_CONFIG["pass"]
    cam_port = port or DAHUA_CONFIG["http_port"]

    url = f"http://{cam_ip}:{cam_port}/cgi-bin/snapshot.cgi?channel={DAHUA_CONFIG['channel']}"
    logger.info(f"Mengambil snapshot Dahua dari {url}...")

    # Coba Digest Auth terlebih dahulu (standar Dahua)
    try:
        res = requests.get(url, auth=HTTPDigestAuth(cam_user, cam_pass), timeout=5)
        if res.status_code == 200 and len(res.content) > 1000:
            arr = np.frombuffer(res.content, dtype=np.uint8)
            img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
            if img is not None:
                logger.info(f"Snapshot Dahua berhasil didapatkan! Resolusi: {img.shape[1]}x{img.shape[0]}")
                return img, None
    except Exception as e:
        logger.warning(f"Digest snapshot gagal: {e}")

    # Fallback ke Basic Auth
    try:
        res = requests.get(url, auth=HTTPBasicAuth(cam_user, cam_pass), timeout=5)
        if res.status_code == 200 and len(res.content) > 1000:
            arr = np.frombuffer(res.content, dtype=np.uint8)
            img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
            if img is not None:
                return img, None
    except Exception as e:
        logger.warning(f"Basic snapshot gagal: {e}")

    # Fallback ke RTSP stream Dahua
    rtsp_url = f"rtsp://{cam_user}:{cam_pass}@{cam_ip}:{DAHUA_CONFIG['rtsp_port']}/cam/realmonitor?channel={DAHUA_CONFIG['channel']}&subtype=0"
    logger.info(f"Mencoba koneksi ke RTSP Dahua: rtsp://{cam_user}:***@{cam_ip}:{DAHUA_CONFIG['rtsp_port']}...")
    try:
        cap = cv2.VideoCapture(rtsp_url)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        if cap.isOpened():
            for _ in range(2):
                cap.read()
            ret, frame = cap.read()
            cap.release()
            if ret and frame is not None:
                logger.info(f"RTSP frame Dahua berhasil didapatkan! ({frame.shape[1]}x{frame.shape[0]})")
                return frame, None
    except Exception as e:
        logger.warning(f"RTSP capture gagal: {e}")

    return None, f"Tidak dapat terhubung ke kamera Dahua di {cam_ip}. Periksa IP, username, dan password."


def preprocess_plate_image(image):
    """
    Pipeline pra-pemrosesan citra untuk plat nomor Indonesia:
    1. Ekualisasi kontras (CLAHE)
    2. Bilateral filter untuk menghilangkan noise debu aspal tanpa memudarkan tepi huruf
    3. Normalisasi plat putih (tulisan hitam) & plat hitam (tulisan putih)
    """
    if image is None:
        return []

    processed_variants = []

    # Varian 1: Original image
    processed_variants.append(image)

    # Fokuskan ke area bawah/tengah (Region of Interest tempat plat truk berada)
    h, w = image.shape[:2]
    # Crop bagian bawah 65% di mana plat nomor kendaraan selalu berada
    roi_bottom = image[int(h * 0.35):, :]
    processed_variants.append(roi_bottom)

    # Konversi ke grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray_clahe = clahe.apply(gray)
    processed_variants.append(cv2.cvtColor(gray_clahe, cv2.COLOR_GRAY2BGR))

    # Bilateral filter
    denoised = cv2.bilateralFilter(gray_clahe, 11, 17, 17)
    
    # Otsu thresholding (Hitam Putih Murni)
    _, thresh_inv = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    _, thresh_norm = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    processed_variants.append(cv2.cvtColor(thresh_inv, cv2.COLOR_GRAY2BGR))
    processed_variants.append(cv2.cvtColor(thresh_norm, cv2.COLOR_GRAY2BGR))

    return processed_variants


# Kode Wilayah Plat Nomor Indonesia Resmi
KODE_WILAYAH_INDONESIA = {
    'P', 'DK', 'L', 'W', 'N', 'B', 'AG', 'AE', 'S', 'M', 
    'AA', 'AB', 'AD', 'D', 'F', 'T', 'E', 'G', 'H', 'K', 
    'R', 'A', 'Z', 'BE', 'BG', 'BK', 'BL', 'BM', 'BN', 'BA'
}

def clean_and_normalize_nopol(raw_texts):
    """
    Membersihkan dan memvalidasi format plat nomor Indonesia:
    [KODE WILAYAH] [NOMOR POLISI 1-4 DIGIT] [SERI 1-3 HURUF]
    Contoh: P 8890 UZ, L 9482 UB, DK 1234 AB, B 1234 XYZ
    Mengabaikan angka masa berlaku (seperti 04.28 atau 11-27).
    """
    logger.info(f"Menganalisis teks terdeteksi: {raw_texts}")

    # Gabungkan semua potongan teks menjadi satu baris bersih
    text_blobs = []
    for item in raw_texts:
        t = item.upper().strip()
        # Hilangkan simbol titik atau minus yang biasa pada tanggal berlaku (04.28 -> diabaikan)
        t = re.sub(r'[\.\:\;\,\_\-]', '', t)
        text_blobs.append(t)

    combined_all = " ".join(text_blobs)

    # 1. Pola standar Indonesia: 1-2 Huruf + 1-4 Angka + 1-3 Huruf
    pattern_standard = re.compile(r'\b([A-Z]{1,2})\s*(\d{1,4})\s*([A-Z]{1,3})\b')
    match = pattern_standard.search(combined_all)
    if match:
        wilayah = match.group(1).upper()
        angka = match.group(2)
        seri = match.group(3).upper()

        # Validasi kode wilayah jika cocok dengan daftar wilayah
        if wilayah in KODE_WILAYAH_INDONESIA or len(wilayah) <= 2:
            return f"{wilayah} {angka} {seri}"

    # 2. Coba periksa per elemen jika OCR memisahkan kotak
    for i in range(len(text_blobs)):
        blob = text_blobs[i]
        match = pattern_standard.search(blob)
        if match:
            return f"{match.group(1)} {match.group(2)} {match.group(3)}"

    # 3. Coba koreksi karakter umum yang tertukar (O->0, I->1, dll)
    corrected = combined_all
    # Jika ada huruf O di tengah kumpulan angka
    corrected = re.sub(r'(?<=\d)O(?=\d)', '0', corrected)
    corrected = re.sub(r'(?<=\d)I(?=\d)', '1', corrected)
    corrected = re.sub(r'(?<=[A-Z])0(?=[A-Z])', 'O', corrected)

    match = pattern_standard.search(corrected)
    if match:
        return f"{match.group(1)} {match.group(2)} {match.group(3)}"

    return ""


# =============================================================================
# ENDPOINT API
# =============================================================================
@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "service": "PP BUMI MAS - Dahua ANPR & Scale Bridge",
        "status": "ONLINE",
        "dahua_config": {
            "ip": DAHUA_CONFIG["ip"],
            "user": DAHUA_CONFIG["user"],
            "http_port": DAHUA_CONFIG["http_port"],
            "rtsp_port": DAHUA_CONFIG["rtsp_port"]
        },
        "ocr_engine": "EasyOCR" if ocr_reader else "None",
        "scale_connected": scale_manager.is_connected,
        "scale_port": scale_manager.port
    })


@app.route("/scan-nopol", methods=["GET", "POST"])
def scan_nopol():
    """
    Endpoint utama pembacaan plat nomor CCTV Dahua.
    Mendukung GET (ambil dari kamera Dahua) atau POST (mengirimkan snapshot khusus).
    """
    logger.info("Menerima permintaan scan Nopol...")

    if not ocr_reader:
        return jsonify({
            "success": False,
            "nopol": "",
            "message": "Engine OCR belum siap. Periksa instalasi library."
        }), 500

    frame = None
    err = None

    # Jika dikirim gambar base64 lewat POST body
    if request.is_json and request.json and "image_base64" in request.json:
        try:
            b64_data = request.json["image_base64"]
            if "," in b64_data:
                b64_data = b64_data.split(",")[1]
            img_bytes = base64.b64decode(b64_data)
            arr = np.frombuffer(img_bytes, dtype=np.uint8)
            frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        except Exception as e:
            err = f"Gagal decode base64: {e}"

    # Jika tidak ada base64, ambil langsung dari Dahua IP Camera
    if frame is None:
        custom_ip = request.args.get("ip") or (request.json and request.json.get("ip")) or DAHUA_CONFIG["ip"]
        frame, err = capture_dahua_snapshot(ip=custom_ip)

    if frame is None or err:
        return jsonify({
            "success": False,
            "nopol": "",
            "message": f"Kamera Dahua tidak dapat diakses: {err}"
        }), 500

    # Jalankan preprocessing
    variants = preprocess_plate_image(frame)
    all_detected_texts = []

    # Jalankan OCR pada varian gambar
    for var_img in variants:
        try:
            results = ocr_reader.readtext(var_img, detail=0)
            if results:
                all_detected_texts.extend(results)
                # Coba cek apakah sudah dapat plat nomor valid
                detected_nopol = clean_and_normalize_nopol(results)
                if detected_nopol:
                    logger.info(f"Nopol terdeteksi akurat: {detected_nopol}")
                    return jsonify({
                        "success": True,
                        "nopol": detected_nopol,
                        "raw_texts": all_detected_texts,
                        "message": f"Plat nomor berhasil dideteksi: {detected_nopol}"
                    })
        except Exception as e:
            logger.warning(f"Error OCR varian: {e}")

    # Analisis semua gabungan teks jika belum cocok
    final_nopol = clean_and_normalize_nopol(all_detected_texts)
    if final_nopol:
        return jsonify({
            "success": True,
            "nopol": final_nopol,
            "raw_texts": all_detected_texts,
            "message": f"Plat nomor terdeteksi: {final_nopol}"
        })

    raw_str = ", ".join(all_detected_texts) if all_detected_texts else "Tidak ada teks terbaca"
    return jsonify({
        "success": False,
        "nopol": "",
        "raw_texts": all_detected_texts,
        "message": f"Plat nomor belum terbaca jelas. Teks sekitar: '{raw_str}'"
    }), 200


@app.route("/dahua-test", methods=["GET"])
def dahua_test():
    """
    Endpoint diagnostik untuk menguji koneksi langsung ke kamera Dahua.
    """
    test_ip = request.args.get("ip", DAHUA_CONFIG["ip"])
    start_t = time.time()
    frame, err = capture_dahua_snapshot(ip=test_ip)
    latency_ms = round((time.time() - start_t) * 1000, 1)

    if frame is not None:
        # Encode preview kecil
        small = cv2.resize(frame, (480, 270))
        _, buffer = cv2.imencode('.jpg', small)
        b64_preview = "data:image/jpeg;base64," + base64.b64encode(buffer).decode('ascii')
        return jsonify({
            "success": True,
            "camera_ip": test_ip,
            "latency_ms": latency_ms,
            "resolution": f"{frame.shape[1]}x{frame.shape[0]}",
            "preview_thumbnail": b64_preview,
            "message": f"Kamera Dahua 2MP terhubung sempurna ({latency_ms} ms)!"
        })
    else:
        return jsonify({
            "success": False,
            "camera_ip": test_ip,
            "latency_ms": latency_ms,
            "error": err,
            "message": f"Gagal terhubung ke Dahua {test_ip}: {err}"
        }), 500


@app.route("/set-camera", methods=["POST"])
def set_camera():
    """
    Update konfigurasi IP, User, dan Password kamera Dahua secara dinamis.
    """
    data = request.json or {}
    if "ip" in data:
        DAHUA_CONFIG["ip"] = data["ip"]
    if "user" in data:
        DAHUA_CONFIG["user"] = data["user"]
    if "pass" in data:
        DAHUA_CONFIG["pass"] = data["pass"]
    if "http_port" in data:
        DAHUA_CONFIG["http_port"] = int(data["http_port"])

    logger.info(f"Update konfigurasi Dahua: IP={DAHUA_CONFIG['ip']}, User={DAHUA_CONFIG['user']}")
    return jsonify({
        "success": True,
        "message": "Konfigurasi kamera Dahua berhasil diperbarui.",
        "config": {
            "ip": DAHUA_CONFIG["ip"],
            "user": DAHUA_CONFIG["user"],
            "http_port": DAHUA_CONFIG["http_port"]
        }
    })


@app.route("/snapshot", methods=["GET"])
def get_snapshot_jpeg():
    """
    Mengambil frame JPEG langsung untuk ditampilkan di browser.
    """
    frame, err = capture_dahua_snapshot()
    if frame is not None:
        _, buffer = cv2.imencode('.jpg', frame)
        return Response(buffer.tobytes(), mimetype='image/jpeg')
    return Response(b"Error capturing snapshot", status=500)


# =============================================================================
# ENDPOINT HARDWARE TIMBANGAN SERIAL RS232 / COM PORT
# =============================================================================
@app.route('/ports', methods=['GET'])
def get_serial_ports():
    ports = scale_manager.get_ports()
    return jsonify({
        "success": True,
        "ports": ports,
        "connected_port": scale_manager.port if scale_manager.is_connected else None
    })

@app.route('/connect-scale', methods=['POST'])
def connect_scale():
    data = request.json or {}
    port = data.get('port', 'COM4')
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
    scale_manager.disconnect()
    return jsonify({
        "success": True,
        "connected": False,
        "message": "Koneksi timbangan serial diputuskan."
    })

@app.route('/scale-weight', methods=['GET'])
def get_scale_weight():
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
    print(" PP BUMI MAS - DAHUA 2MP ANPR & SCALE BRIDGE SERVER")
    print(f" Dahua Target IP : {DAHUA_CONFIG['ip']}:{DAHUA_CONFIG['http_port']}")
    print(" Server Endpoint : http://localhost:5000")
    print(" Scan Nopol      : http://localhost:5000/scan-nopol")
    print(" Dahua Test Ping : http://localhost:5000/dahua-test")
    print(" Live Snapshot   : http://localhost:5000/snapshot")
    print(" Scale COM       : http://localhost:5000/scale-weight")
    print("="*70 + "\n")

    app.run(host="0.0.0.0", port=5000, debug=False)
