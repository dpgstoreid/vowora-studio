#!/usr/bin/env python3
"""
SKRIP OTOMASI REMINDER & KELOLA ORDER UNDANGAN DIGITAL
Menghitung:
1. Pesanan yang deadline draft-nya dekat (H-2, H-1, atau Lewat Deadline).
2. Mempelai yang tanggal acaranya dekat (H-7: reminder sebar undangan/cek RSVP, H-1: ucapan selamat).
3. Tagihan pelunasan (klien berstatus DP yang draft-nya sudah selesai).
"""

import json
import os
from datetime import datetime, date

def load_orders(file_path):
    if not os.path.exists(file_path):
        print(f"File {file_path} tidak ditemukan!")
        return []
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except Exception:
        return None

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, "orders.json")
    orders = load_orders(json_path)

    today = date.today()
    print("=" * 65)
    print(f"  RINGKASAN HARIAN BISNIS UNDANGAN DIGITAL")
    print(f"  Tanggal Hari Ini: {today.strftime('%d %B %Y')}")
    print("=" * 65)

    if not orders:
        print("Belum ada data pesanan di orders.json.")
        return

    deadline_alerts = []
    event_alerts = []
    unpaid_alerts = []
    total_omset = 0
    total_diterima = 0

    for ord in orders:
        mempelai = ord.get("mempelai", "Unknown")
        order_id = ord.get("order_id", "-")
        status_kerja = ord.get("status_pengerjaan", "-")
        status_bayar = ord.get("status_pembayaran", "-")
        biaya = ord.get("biaya_total", 0)
        dp = ord.get("dp_dibayar", 0)
        sisa = biaya - dp
        wa = ord.get("no_wa", "-")

        total_omset += biaya
        total_diterima += dp

        # 1. Cek Deadline Draft
        deadline_str = ord.get("deadline_draft")
        if deadline_str and status_kerja not in ["Selesai", "Batal"]:
            deadline_dt = parse_date(deadline_str)
            if deadline_dt:
                diff_draft = (deadline_dt - today).days
                if diff_draft < 0:
                    deadline_alerts.append(f"❌ [LEWAT DEADLINE {abs(diff_draft)} HARI] {order_id} - {mempelai} (Status: {status_kerja})")
                elif diff_draft == 0:
                    deadline_alerts.append(f"⚠️ [DEADLINE HARI INI!] {order_id} - {mempelai} (WA: {wa})")
                elif diff_draft <= 2:
                    deadline_alerts.append(f"⏳ [H-{diff_draft} DEADLINE DRAFT] {order_id} - {mempelai} (Deadline: {deadline_str})")

        # 2. Cek Tanggal Acara Mempelai
        acara_str = ord.get("tanggal_acara")
        if acara_str:
            acara_dt = parse_date(acara_str)
            if acara_dt:
                diff_event = (acara_dt - today).days
                if diff_event == 7:
                    event_alerts.append(f"🔔 [H-7 ACARA] {mempelai} - Ingatkan cek RSVP & konfirmasi kehadiran tamu!")
                elif diff_event == 1:
                    event_alerts.append(f"🎉 [H-1 ACARA BESOK!] {mempelai} - Kirim ucapan selamat & doa restu dari tim!")
                elif 0 <= diff_event <= 14:
                    event_alerts.append(f"📅 [H-{diff_event} Menuju Hari H] {mempelai} (Tgl: {acara_str})")

        # 3. Cek Tagihan Sisa Pembayaran
        if status_bayar != "Lunas" and sisa > 0:
            if status_kerja in ["Revisi", "Selesai"]:
                unpaid_alerts.append(f"💰 {order_id} - {mempelai}: Belum Lunas (Sisa: Rp {sisa:,.0f} | WA: {wa})")

    # Output Alerts
    print("\n[1] PERHATIAN DEADLINE PENGERJAAN:")
    if deadline_alerts:
        for alert in deadline_alerts:
            print(f"  {alert}")
    else:
        print("  ✅ Tidak ada deadline pengerjaan yang mendesak hari ini.")

    print("\n[2] REMINDER TANGGAL ACARA MEMPELAI:")
    if event_alerts:
        for alert in event_alerts:
            print(f"  {alert}")
    else:
        print("  ✅ Tidak ada jadwal acara pernikahan dalam 14 hari ke depan.")

    print("\n[3] TAGIHAN SISA PEMBAYARAN (PIUTANG):")
    if unpaid_alerts:
        for alert in unpaid_alerts:
            print(f"  {alert}")
    else:
        print("  ✅ Semua pesanan aktif sudah lunas atau masih tahap awal.")

    print("\n[4] REKAP KEUANGAN:")
    print(f"  Total Nilai Order : Rp {total_omset:,.0f}")
    print(f"  Total Uang Masuk  : Rp {total_diterima:,.0f}")
    print(f"  Piutang Belum Cair: Rp {total_omset - total_diterima:,.0f}")
    print("=" * 65)

if __name__ == "__main__":
    main()
