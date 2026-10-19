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
set /p REPO_URL="Paste link GitHub kamu di sini lalu tekan ENTER: "
if "%REPO_URL%"=="" goto end

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
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
