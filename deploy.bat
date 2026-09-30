@echo off
echo ========================================================
echo  PP BUMI MAS ERP - Auto Deploy ke Vercel Cloud
echo ========================================================
echo.
echo 1. Memeriksa & memproses build aplikasi...
call npm run build

echo.
echo 2. Mengirim update ke Vercel Cloud...
call npx vercel --prod

echo.
echo ========================================================
echo  Update Selesai! Website telah terupdate di internet.
echo ========================================================
pause
