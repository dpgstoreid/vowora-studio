@echo off
title Vowora Studio - Luxury Digital Wedding Invitation
echo ======================================================
echo   Sedang menyalakan Vowora Studio...
echo ======================================================
cd /d "%~dp0"
start http://localhost:3000
node server.js
pause
