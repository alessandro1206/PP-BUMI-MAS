@echo off
title Push PP Bumi Mas ERP ke GitHub
color 0A
echo ========================================================
echo       PROSES PUSH PP BUMI MAS KE GITHUB
echo       Repository: https://github.com/alessandro1206/PP-BUMI-MAS.git
echo ========================================================
echo.
cd /d "%~dp0"
set "PATH=C:\software\git\cmd;%PATH%"
echo Menjalankan git push ke branch main...
git push -u origin main
echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo [SUKSES] Berhasil dipush ke GitHub!
) else (
    echo [GAGAL/LOGIN] Silakan login GitHub pada jendela yang muncul.
)
echo ========================================================
pause

