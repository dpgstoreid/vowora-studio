@echo off
title Upload Vowora ke GitHub
color 0A
echo ======================================================
echo   SEDANG MENGUPLOAD SEMUA FILE VOWORA KE GITHUB...
echo   MOHON TUNGGU SEBENTAR...
echo ======================================================
echo.
cd /d "C:\Users\Santa\.gemini\antigravity\scratch\undangan-digital-kit"
git remote remove origin 2>nul
git remote add origin https://github.com/dpgstoreid/vowora-studio.git
git branch -M main
git push -u --force origin main
echo.
echo ======================================================
echo   SUKSES! SEMUA FILE VOWORA SUDAH MASUK GITHUB!
echo ======================================================
echo.
echo Sekarang buka: https://vercel.com/new
echo.
pause
