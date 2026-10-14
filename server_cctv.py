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
from flask import Flask, jsonify, request, Response, send_from_directory
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


# =============================================================================
# KONFIGURASI PREPROCESSING & OCR PLAT NOMOR INDONESIA
# =============================================================================
# Rasio cropping bounding box plat (Langkah 1)
CROP_TOP_RATIO = 0.08       # Pangkas 8% bagian atas (bingkai/baut)
CROP_BOTTOM_RATIO = 0.75    # Pangkas 25% bagian bawah (angka masa berlaku MM.YY)
CROP_LEFT_RATIO = 0.05      # Pangkas 5% sisi kiri
CROP_RIGHT_RATIO = 0.95     # Pangkas 5% sisi kanan

# Parameter EasyOCR
ALLOWLIST_ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
OCR_WIDTH_THS = 0.8         # Penggabungan kotak karakter horizontal

# Visual Character Swap Mappings
NUM_TO_LETTER = {
    '0': 'O', '1': 'I', '2': 'Z', '4': 'A', '5': 'S', '6': 'G', '8': 'B'
}

LETTER_TO_NUM = {
    'O': '0', 'D': '0', 'Q': '0',
    'I': '1', 'L': '1',
    'Z': '2',
    'A': '4',
    'S': '5',
    'G': '6',
    'B': '8'
}

# Daftar resmi kode wilayah plat nomor Indonesia
INDONESIA_PREFIXES = {
    'A', 'B', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W', 'Z',
    'AA', 'AB', 'AD', 'AE', 'AG', 'BA', 'BB', 'BD', 'BE', 'BG', 'BH', 'BK', 'BL', 'BM', 'BN', 'BP',
    'DA', 'DB', 'DC', 'DD', 'DE', 'DG', 'DH', 'DK', 'DM', 'DN', 'DR', 'DT', 'DW',
    'EA', 'EB', 'ED', 'KB', 'KH', 'KT', 'KU', 'PA', 'PB'
}

DEBUG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "debug_plates")


def preprocess_plate_for_ocr(plate_crop):
    """
    Pipeline OpenCV 6 langkah untuk pra-pemrosesan plat nomor sebelum OCR:
    1. Border & Sub-text Crop (pangkas 5% kiri/kanan, 8% atas, 25% bawah).
    2. Upscale 3x dengan interpolasi cv2.INTER_LANCZOS4.
    3. Grayscale & CLAHE (clipLimit=2.0, tileGridSize=(8, 8)).
    4. Edge-Preserving Denoise dengan cv2.bilateralFilter(img, 11, 17, 17).
    5. Binarisasi Otsu & Auto-Inversi (menjamin teks selalu hitam di atas latar putih).
    6. White Padding 15px di sekeliling gambar dengan cv2.copyMakeBorder.
    """
    if plate_crop is None or plate_crop.size == 0:
        return None

    h, w = plate_crop.shape[:2]
    if h < 5 or w < 10:
        return None

    # 1. Border & Sub-text Crop
    y1 = int(h * CROP_TOP_RATIO)
    y2 = int(h * CROP_BOTTOM_RATIO)
    x1 = int(w * CROP_LEFT_RATIO)
    x2 = int(w * CROP_RIGHT_RATIO)

    if y2 > y1 and x2 > x1:
        cropped = plate_crop[y1:y2, x1:x2]
    else:
        cropped = plate_crop

    # 2. Upscale 3x dengan Lanczos4
    upscaled = cv2.resize(cropped, None, fx=3.0, fy=3.0, interpolation=cv2.INTER_LANCZOS4)

    # 3. Grayscale & CLAHE
    if len(upscaled.shape) == 3:
        gray = cv2.cvtColor(upscaled, cv2.COLOR_BGR2GRAY)
    else:
        gray = upscaled.copy()

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    clahe_img = clahe.apply(gray)

    # 4. Edge-Preserving Denoise
    denoised = cv2.bilateralFilter(clahe_img, 11, 17, 17)

    # 5. Binarization & Auto-Inversion
    _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    white_pixel_ratio = np.count_nonzero(thresh == 255) / float(thresh.size)

    # Jika piksel putih < 50% (plat hitam tulisan putih), balik gambar
    if white_pixel_ratio < 0.50:
        bin_img = cv2.bitwise_not(thresh)
    else:
        bin_img = thresh

    # 6. White Padding 15px
    padded = cv2.copyMakeBorder(bin_img, 15, 15, 15, 15, cv2.BORDER_CONSTANT, value=255)
    return padded


def run_ocr_on_plate(preprocessed_plate):
    """
    Menjalankan EasyOCR dengan allowlist strictly uppercase alphanumeric
    dan width_ths=0.8, serta mengurutkan hasil deteksi dari kiri ke kanan.
    """
    if not ocr_reader or preprocessed_plate is None:
        return [], 0.0

    try:
        results = ocr_reader.readtext(
            preprocessed_plate,
            allowlist=ALLOWLIST_ALPHANUMERIC,
            width_ths=OCR_WIDTH_THS,
            detail=1
        )
    except Exception as e:
        logger.warning(f"Error pada easyocr readtext: {e}")
        return [], 0.0

    if not results:
        return [], 0.0

    # Urutkan kotak deteksi dari kiri ke kanan berdasarkan koordinat x minimum
    results.sort(key=lambda item: min(pt[0] for pt in item[0]))

    raw_items = []
    conf_sum = 0.0
    for bbox, text, conf in results:
        clean_item = text.strip()
        if clean_item:
            raw_items.append(clean_item)
            conf_sum += float(conf)

    avg_conf = conf_sum / len(results) if results else 0.0
    return raw_items, avg_conf


def correct_segment_to_letters(text, is_prefix=False):
    """
    Mengonversi angka pada segmen huruf ke karakter huruf visual serupa.
    """
    res = []
    for c in text:
        if is_prefix and c == '0':
            res.append('D') # Wilayah D (Bandung/Jabar), tidak ada wilayah O di Indonesia
        else:
            res.append(NUM_TO_LETTER.get(c, c))
    return "".join(res)


def correct_segment_to_digits(text):
    """
    Mengonversi huruf pada segmen angka ke karakter angka visual serupa.
    """
    return "".join(LETTER_TO_NUM.get(c, c) for c in text)


def clean_and_correct_plate(raw_ocr_str):
    """
    Positional heuristic post-processing untuk format plat nomor Indonesia:
    [1-2 Huruf Wilayah] [1-4 Angka Nomor Polisi] [1-3 Huruf Seri]
    Contoh: P 8890 UZ, L 1234 AB, B 1089 XYZ, DK 1234 AB
    Memperbaiki karakter yang tertukar secara visual (0/O/D/Q, 1/I/L, 2/Z, 4/A, 5/S, 6/G, 8/B).
    """
    if not raw_ocr_str:
        return ""

    cleaned = re.sub(r'[^A-Z0-9]', '', raw_ocr_str.upper())
    if len(cleaned) < 3 or len(cleaned) > 9:
        return ""

    # Cek jika string input sudah terpisah spasi dalam 3 segmen
    parts = [p.strip() for p in raw_ocr_str.upper().split() if p.strip()]
    if len(parts) == 3:
        p_raw = re.sub(r'[^A-Z0-9]', '', parts[0])
        m_raw = re.sub(r'[^A-Z0-9]', '', parts[1])
        s_raw = re.sub(r'[^A-Z0-9]', '', parts[2])
        if 1 <= len(p_raw) <= 2 and 1 <= len(m_raw) <= 4 and 1 <= len(s_raw) <= 3:
            p_corr = correct_segment_to_letters(p_raw, is_prefix=True)
            m_corr = correct_segment_to_digits(m_raw)
            s_corr = correct_segment_to_letters(s_raw, is_prefix=False)
            if p_corr.isalpha() and m_corr.isdigit() and s_corr.isalpha():
                return f"{p_corr} {m_corr} {s_corr}"

    # Cari partisi terbaik (prefix, middle, suffix) untuk string utuh
    best_plate = ""
    best_score = -9999
    n = len(cleaned)

    for p_len in (1, 2):
        for m_len in range(1, 5):
            s_len = n - p_len - m_len
            if not (1 <= s_len <= 3):
                continue

            p_raw = cleaned[0:p_len]
            m_raw = cleaned[p_len:p_len + m_len]
            s_raw = cleaned[p_len + m_len:]

            p_corr = correct_segment_to_letters(p_raw, is_prefix=True)
            m_corr = correct_segment_to_digits(m_raw)
            s_corr = correct_segment_to_letters(s_raw, is_prefix=False)

            if not (p_corr.isalpha() and m_corr.isdigit() and s_corr.isalpha()):
                continue

            # Skor kesesuaian format plat Indonesia
            score = 100
            if p_corr in INDONESIA_PREFIXES:
                score += 60
            if p_raw.isalpha():
                score += 20
            if m_raw.isdigit():
                score += 25
            if s_raw.isalpha():
                score += 20

            # Seri akhiran di Indonesia tidak pernah diawali huruf O atau Q
            if s_corr.startswith('O') or s_corr.startswith('Q'):
                score -= 40

            if score > best_score:
                best_score = score
                best_plate = f"{p_corr} {m_corr} {s_corr}"

    return best_plate


class PlateVoteBuffer:
    """
    Buffer multi-frame majority voting untuk mencegah kesalahan akibat motion blur
    atau refleksi sesaat pada single frame.
    Menyimpan hingga 5 pembacaan valid terakhir dalam jendela waktu (15 detik).
    """
    def __init__(self, max_size=5, window_seconds=15.0):
        self.max_size = max_size
        self.window_seconds = window_seconds
        self.buffer = []
        self.lock = threading.Lock()

    def add(self, plate, confidence):
        if not plate:
            return None, 0.0, 0, 0
        now = time.time()
        with self.lock:
            # Hapus pembacaan yang sudah kedaluwarsa di luar jendela waktu
            self.buffer = [item for item in self.buffer if (now - item["ts"]) <= self.window_seconds]
            self.buffer.append({"plate": plate, "conf": float(confidence), "ts": now})
            if len(self.buffer) > self.max_size:
                self.buffer.pop(0)
            return self._calculate_winner_unlocked()

    def get_winner(self):
        now = time.time()
        with self.lock:
            self.buffer = [item for item in self.buffer if (now - item["ts"]) <= self.window_seconds]
            return self._calculate_winner_unlocked()

    def _calculate_winner_unlocked(self):
        if not self.buffer:
            return None, 0.0, 0, 0

        counts = {}
        conf_sums = {}
        for item in self.buffer:
            p = item["plate"]
            counts[p] = counts.get(p, 0) + 1
            conf_sums[p] = conf_sums.get(p, 0.0) + item["conf"]

        ranked = sorted(counts.items(), key=lambda x: (x[1], conf_sums[x[0]]), reverse=True)
        winner_plate, winner_count = ranked[0]
        avg_conf = conf_sums[winner_plate] / float(winner_count)
        return winner_plate, avg_conf, winner_count, len(self.buffer)

    def clear(self):
        with self.lock:
            self.buffer.clear()

plate_vote_buffer = PlateVoteBuffer(max_size=5, window_seconds=15.0)


def save_debug_plate(raw_crop, preprocessed_plate, nopol_str=""):
    """
    Menyimpan citra raw_crop dan preprocessed_plate ke folder debug_plates/.
    Menyimpan pointer latest dan mengarsipkan 10 deteksi terakhir.
    """
    try:
        os.makedirs(DEBUG_DIR, exist_ok=True)
        if raw_crop is not None and raw_crop.size > 0:
            cv2.imwrite(os.path.join(DEBUG_DIR, "latest_raw_crop.jpg"), raw_crop)
        if preprocessed_plate is not None and preprocessed_plate.size > 0:
            cv2.imwrite(os.path.join(DEBUG_DIR, "latest_preprocessed.jpg"), preprocessed_plate)

        ts = int(time.time() * 1000)
        safe_name = re.sub(r'[^A-Z0-9]', '_', nopol_str.upper()) if nopol_str else "undetected"
        raw_filename = f"plate_{ts}_{safe_name}_raw.jpg"
        prep_filename = f"plate_{ts}_{safe_name}_prep.jpg"

        if raw_crop is not None and raw_crop.size > 0:
            cv2.imwrite(os.path.join(DEBUG_DIR, raw_filename), raw_crop)
        if preprocessed_plate is not None and preprocessed_plate.size > 0:
            cv2.imwrite(os.path.join(DEBUG_DIR, prep_filename), preprocessed_plate)

        # Rotasi: simpan maksimal 10 pasang deteksi terakhir
        raw_files = sorted([f for f in os.listdir(DEBUG_DIR) if f.startswith("plate_") and f.endswith("_raw.jpg")])
        if len(raw_files) > 10:
            for old_raw in raw_files[:-10]:
                old_prep = old_raw.replace("_raw.jpg", "_prep.jpg")
                try:
                    os.remove(os.path.join(DEBUG_DIR, old_raw))
                except Exception:
                    pass
                try:
                    os.remove(os.path.join(DEBUG_DIR, old_prep))
                except Exception:
                    pass
    except Exception as e:
        logger.warning(f"Gagal menyimpan debug plate: {e}")


def extract_plate_crops(image):
    """
    Mengekstrak kandidat bounding box plat nomor dari frame kamera 2MP:
    - Jika citra sudah berukuran crop plat, langsung kembalikan citra tersebut.
    - Menemukan kontur persegi panjang di area bumper truk (aspek rasio 2.0 s.d 6.0).
    - Menyertakan fallback crop area bumper tengah dan area bawah truk.
    """
    if image is None or image.size == 0:
        return []

    h, w = image.shape[:2]
    aspect = w / float(h)
    if 1.5 <= aspect <= 6.5 and w <= 950 and h <= 450:
        return [image]

    candidates = []
    # Fokuskan pencarian pada zona bumper truk (30% s.d 95% tinggi)
    roi_top = int(h * 0.30)
    roi_bottom = int(h * 0.95)
    roi_left = int(w * 0.10)
    roi_right = int(w * 0.90)
    roi = image[roi_top:roi_bottom, roi_left:roi_right]
    roi_h, roi_w = roi.shape[:2]

    try:
        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        grad_x = cv2.Sobel(gray, cv2.CV_16S, 1, 0, ksize=3)
        abs_grad_x = cv2.convertScaleAbs(grad_x)
        blurred = cv2.GaussianBlur(abs_grad_x, (9, 9), 0)
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 7))
        closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for c in contours:
            cx, cy, cw, ch = cv2.boundingRect(c)
            ar = cw / float(ch)
            area = cw * ch
            if 2.0 <= ar <= 6.0 and cw >= 70 and ch >= 18 and area >= 2000:
                pad_x = int(cw * 0.10)
                pad_y = int(ch * 0.15)
                x1 = max(0, cx - pad_x)
                y1 = max(0, cy - pad_y)
                x2 = min(roi_w, cx + cw + pad_x)
                y2 = min(roi_h, cy + ch + pad_y)
                crop = roi[y1:y2, x1:x2]
                candidates.append((crop, area))
    except Exception as e:
        logger.warning(f"Contour locator fallback error: {e}")

    candidates.sort(key=lambda item: item[1], reverse=True)
    crops = [item[0] for item in candidates[:4]]

    # Fallback 1: Area bumper tengah depan
    bumper_crop = image[int(h * 0.45):int(h * 0.88), int(w * 0.20):int(w * 0.80)]
    crops.append(bumper_crop)

    # Fallback 2: 65% area bawah frame
    lower_crop = image[int(h * 0.35):, :]
    crops.append(lower_crop)

    return crops


# =============================================================================
# ENDPOINT API
# =============================================================================
@app.route("/", methods=["GET"])
def index():
    winner, avg_conf, win_count, total_in_buf = plate_vote_buffer.get_winner()
    debug_files_count = len(os.listdir(DEBUG_DIR)) if os.path.exists(DEBUG_DIR) else 0
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
        "scale_port": scale_manager.port,
        "vote_buffer": {
            "current_winner": winner,
            "average_confidence": round(avg_conf, 2),
            "votes": f"{win_count}/{total_in_buf}"
        },
        "debug_plates_stored": debug_files_count
    })


@app.route("/scan-nopol", methods=["GET", "POST"])
def scan_nopol():
    """
    Endpoint utama pembacaan plat nomor CCTV Dahua 2MP.
    Menerapkan pipeline:
    1. Preprocessing OpenCV (Crop border, 3x Lanczos upscale, CLAHE, Bilateral Denoise, Otsu Auto-Invert, 15px border).
    2. Locked down EasyOCR (allowlist alphanumeric, width_ths=0.8, left-to-right sorting).
    3. Positional heuristic post-processing (koreksi karakter visual swap & format Indonesia).
    4. Multi-frame majority voting buffer & penyimpanan debug_plates/.
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

    candidate_crops = extract_plate_crops(frame)
    all_raw_texts = []
    valid_detections = []
    first_prep = None
    first_crop = candidate_crops[0] if candidate_crops else None

    for crop in candidate_crops:
        preprocessed = preprocess_plate_for_ocr(crop)
        if preprocessed is None:
            continue
        if first_prep is None:
            first_prep = preprocessed

        ocr_items, conf = run_ocr_on_plate(preprocessed)
        if not ocr_items:
            continue

        all_raw_texts.extend(ocr_items)
        combined_spaced = " ".join(ocr_items)
        combined_concat = "".join(ocr_items)

        # Uji koreksi heuristik dengan spasi dan tanpa spasi
        plate_cand = clean_and_correct_plate(combined_spaced) or clean_and_correct_plate(combined_concat)
        if plate_cand:
            valid_detections.append((plate_cand, conf, crop, preprocessed))
            # Jika confidence tinggi, hentikan iterasi kandidat
            if conf >= 0.70:
                break

    if valid_detections:
        # Urutkan berdasarkan confidence tertinggi
        valid_detections.sort(key=lambda x: x[1], reverse=True)
        best_plate, best_conf, best_crop, best_prep = valid_detections[0]

        # Catat ke Multi-Frame Majority Voting Buffer
        winner_plate, avg_conf, win_votes, total_votes = plate_vote_buffer.add(best_plate, best_conf)
        winning_plate = winner_plate or best_plate

        # Simpan ke folder debug_plates/
        save_debug_plate(best_crop, best_prep, winning_plate)

        logger.info(f"Nopol terdeteksi: {winning_plate} ({win_votes}/{total_votes} votes, conf: {avg_conf:.2f})")
        return jsonify({
            "success": True,
            "nopol": winning_plate,
            "confidence": round(avg_conf, 2),
            "votes": f"{win_votes}/{total_votes}",
            "raw_texts": all_raw_texts,
            "message": f"Plat nomor berhasil dideteksi: {winning_plate} ({win_votes}/{total_votes} votes)"
        })

    # Jika belum terdeteksi, simpan preview debug untuk inspeksi operator
    if first_crop is not None and first_prep is not None:
        save_debug_plate(first_crop, first_prep, "undetected")

    raw_str = ", ".join(all_raw_texts) if all_raw_texts else "Tidak ada teks terbaca"
    return jsonify({
        "success": False,
        "nopol": "",
        "raw_texts": all_raw_texts,
        "message": f"Plat nomor belum terbaca jelas. Teks sekitar: '{raw_str}'"
    }), 200


@app.route("/reset-plate-buffer", methods=["POST", "GET"])
def reset_plate_buffer():
    """
    Mereset riwayat buffer voting plat nomor ketika truk baru masuk timbangan.
    """
    plate_vote_buffer.clear()
    return jsonify({
        "success": True,
        "message": "Buffer multi-frame voting plat nomor berhasil dikosongkan."
    })


@app.route("/debug-plates", methods=["GET"])
def list_debug_plates():
    """
    Menampilkan daftar file inspeksi citra plat pada folder debug_plates/.
    """
    if not os.path.exists(DEBUG_DIR):
        return jsonify({"files": []})
    files = sorted(os.listdir(DEBUG_DIR), reverse=True)
    return jsonify({
        "debug_dir": DEBUG_DIR,
        "files": files,
        "latest_raw_url": "/debug-plates/latest_raw_crop.jpg",
        "latest_prep_url": "/debug-plates/latest_preprocessed.jpg"
    })


@app.route("/debug-plates/<path:filename>", methods=["GET"])
def get_debug_plate_image(filename):
    """
    Menyajikan file gambar debug plat nomor untuk inspeksi browser.
    """
    return send_from_directory(DEBUG_DIR, filename)


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
