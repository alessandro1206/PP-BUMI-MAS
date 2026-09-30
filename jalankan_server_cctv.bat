@echo off
title Server CCTV OCR Nopol - PP BUMI MAS
echo ===================================================
echo   Memulai Server CCTV OCR Nopol (Port 5000)...
echo ===================================================
cd /d "%~dp0"
python server_cctv.py
pause
