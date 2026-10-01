@echo off
title PP BUMI MAS - Web Weighbridge ERP
color 0B
echo ========================================================
echo   MENJALANKAN PP BUMI MAS ERP (WEBSITE JEMBATAN TIMBANG)
echo ========================================================
echo.
cd /d "%~dp0"
echo Membuka browser ke http://localhost:5173 ...
timeout /t 2 /nobreak >nul
start http://localhost:5173
npm run dev
pause
