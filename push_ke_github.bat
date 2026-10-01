@echo off
title Push PP Bumi Mas ERP ke GitHub
color 0A
echo ========================================================
echo       PROSES PUSH PP BUMI MAS KE GITHUB
echo       Repository: https://github.com/alessandro1206/PP-BUMI-MAS.git
echo ========================================================
echo.
cd /d "d:\program bumi mas new"
echo Menjalankan git push ke branch main...
"C:\Program Files\Microsoft Visual Studio\18\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe" push -u origin main
echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo [SUKSES] Berhasil dipush ke GitHub!
) else (
    echo [GAGAL/LOGIN] Silakan login GitHub pada jendela yang muncul.
)
echo ========================================================
pause
