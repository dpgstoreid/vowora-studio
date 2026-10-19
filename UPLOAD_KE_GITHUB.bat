@echo off
title Upload Vowora ke GitHub & Vercel
echo ======================================================
echo   PANDUAN 1-KLIK UPLOAD VOWORA KE GITHUB & VERCEL
echo ======================================================
echo.
echo Langkah mudah:
echo 1. Buat repository baru di: https://github.com/new
echo    (Beri nama misal: vowora, pilih Public atau Private)
echo 2. Salin link repository kamu (contoh: https://github.com/username/vowora.git)
echo.
set DEFAULT_REPO=https://github.com/dpgstoreid/vowora-studio.git
echo Repository terdeteksi: %DEFAULT_REPO%
echo.
set /p REPO_URL="Tekan ENTER langsung untuk menggunakan repository di atas (atau paste link lain): "
if "%REPO_URL%"=="" set REPO_URL=%DEFAULT_REPO%

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
echo Mengupload file website Vowora ke GitHub...
git push -u origin main

echo.
echo ======================================================
echo   BERHASIL DIUPLOAD KE GITHUB!
echo ======================================================
echo Sekarang buka: https://vercel.com/new
echo Login pakai GitHub, klik "Import" pada project vowora, lalu klik "Deploy"!
echo.
pause
:end
