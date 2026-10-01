@echo off
title PP BUMI MAS - Aplikasi Desktop Electron (Weighbridge ERP)
color 0A
echo ========================================================
echo   MENJALANKAN APLIKASI DESKTOP ELECTRON PP BUMI MAS
echo   Mode: Native Desktop Window (Chromium + Node.js)
echo ========================================================
echo.
cd /d "%~dp0"
echo Membuka aplikasi Electron PT. BUMI MAS...
npx electron .
