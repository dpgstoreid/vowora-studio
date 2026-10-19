#!/usr/bin/env node
/**
 * SKRIP OTOMASI REMINDER & KELOLA ORDER UNDANGAN DIGITAL (Node.js)
 * Jalan langsung tanpa dependensi tambahan: node check_reminders.js
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'orders.json');
if (!fs.existsSync(jsonPath)) {
  console.error("File orders.json tidak ditemukan!");
  process.exit(1);
}

const orders = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const today = new Date();
today.setHours(0, 0, 0, 0);

function diffDays(targetDateStr) {
  if (!targetDateStr) return null;
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

console.log("=".repeat(65));
console.log("  RINGKASAN HARIAN BISNIS UNDANGAN DIGITAL");
console.log(`  Tanggal Hari Ini: ${today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
console.log("=".repeat(65));

const deadlineAlerts = [];
const eventAlerts = [];
const unpaidAlerts = [];
let totalOmset = 0;
let totalDiterima = 0;

orders.forEach(ord => {
  const mempelai = ord.mempelai || 'Unknown';
  const orderId = ord.order_id || '-';
  const statusKerja = ord.status_pengerjaan || '-';
  const statusBayar = ord.status_pembayaran || '-';
  const biaya = ord.biaya_total || 0;
  const dp = ord.dp_dibayar || 0;
  const sisa = biaya - dp;
  const wa = ord.no_wa || '-';

  totalOmset += biaya;
  totalDiterima += dp;

  // 1. Cek Deadline Draft
  if (ord.deadline_draft && statusKerja !== 'Selesai' && statusKerja !== 'Batal') {
    const diff = diffDays(ord.deadline_draft);
    if (diff < 0) {
      deadlineAlerts.push(`❌ [LEWAT DEADLINE ${Math.abs(diff)} HARI] ${orderId} - ${mempelai} (Status: ${statusKerja})`);
    } else if (diff === 0) {
      deadlineAlerts.push(`⚠️ [DEADLINE HARI INI!] ${orderId} - ${mempelai} (WA: ${wa})`);
    } else if (diff <= 2) {
      deadlineAlerts.push(`⏳ [H-${diff} DEADLINE DRAFT] ${orderId} - ${mempelai} (Deadline: ${ord.deadline_draft})`);
    }
  }

  // 2. Cek Tanggal Acara Mempelai
  if (ord.tanggal_acara) {
    const diff = diffDays(ord.tanggal_acara);
    if (diff === 7) {
      eventAlerts.push(`🔔 [H-7 ACARA] ${mempelai} - Ingatkan cek buku tamu/RSVP & konfirmasi kehadiran!`);
    } else if (diff === 1) {
      eventAlerts.push(`🎉 [H-1 ACARA BESOK!] ${mempelai} - Kirim ucapan selamat & doa restu tim!`);
    } else if (diff >= 0 && diff <= 14) {
      eventAlerts.push(`📅 [H-${diff} Menuju Hari H] ${mempelai} (Tgl: ${ord.tanggal_acara})`);
    }
  }

  // 3. Cek Tagihan Belum Lunas
  if (statusBayar !== 'Lunas' && sisa > 0) {
    if (statusKerja === 'Revisi' || statusKerja === 'Selesai') {
      unpaidAlerts.push(`💰 ${orderId} - ${mempelai}: Belum Lunas (Sisa: ${formatRupiah(sisa)} | WA: ${wa})`);
    }
  }
});

console.log("\n[1] PERHATIAN DEADLINE PENGERJAAN:");
if (deadlineAlerts.length > 0) {
  deadlineAlerts.forEach(a => console.log(`  ${a}`));
} else {
  console.log("  ✅ Tidak ada deadline pengerjaan yang mendesak hari ini.");
}

console.log("\n[2] REMINDER TANGGAL ACARA MEMPELAI:");
if (eventAlerts.length > 0) {
  eventAlerts.forEach(a => console.log(`  ${a}`));
} else {
  console.log("  ✅ Tidak ada jadwal acara pernikahan dalam 14 hari ke depan.");
}

console.log("\n[3] TAGIHAN SISA PEMBAYARAN (PIUTANG):");
if (unpaidAlerts.length > 0) {
  unpaidAlerts.forEach(a => console.log(`  ${a}`));
} else {
  console.log("  ✅ Semua pesanan aktif sudah lunas atau masih tahap awal.");
}

console.log("\n[4] REKAP KEUANGAN:");
console.log(`  Total Nilai Order : ${formatRupiah(totalOmset)}`);
console.log(`  Total Uang Masuk  : ${formatRupiah(totalDiterima)}`);
console.log(`  Piutang Belum Cair: ${formatRupiah(totalOmset - totalDiterima)}`);
console.log("=".repeat(65));
