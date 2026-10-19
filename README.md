# 💍 Starter Kit Bisnis Undangan Digital

Toolkit lengkap dan siap pakai untuk memulai, mengelola, dan mengotomatisasi bisnis jasa pembuatan undangan digital interaktif.

---

## 📁 Struktur Direktori

```text
undangan-digital-kit/
├── template-undangan/
│   ├── index.html       # File utama tampilan undangan (mobile-first luxury theme)
│   ├── config.js        # File konfigurasi data pengantin (cukup edit file ini!)
│   ├── style.css        # Desain estetis, responsif, dan animasi
│   └── script.js       # Logika interaktif: countdown, musik, amplop, RSVP, ?to=Nama
│
├── guest-generator/
│   ├── index.html       # Web tool generator link nama tamu & tombol kirim WA sekali klik
│   └── google-sheets-formula.md # Rumus Google Sheets siap pakai untuk klien
│
└── order-automation/
    ├── orders.json      # Database data pesanan klien & status keuangan
    ├── check_reminders.js # Skrip pengecek deadline pengerjaan & reminder H-7 acara (Node.js)
    └── check_reminders.py # Skrip Python versi alternatif
```

---

## 🚀 Panduan Penggunaan

### 1. Template Undangan Digital (`/template-undangan`)
* **Cara Coba:** Cukup klik dua kali `index.html` atau buka di browser Chrome/Edge.
* **Fitur Utama:**
  * **Personalisasi Tamu Otomatis:** Buka dengan parameter nama tamu di URL, contoh:
    `index.html?to=Budi+Santoso`
    Maka di cover & teks sambutan akan otomatis tertulis *"Kepada Yth. Budi Santoso"*.
  * **Audio Background Musik:** Otomatis berputar begitu tamu menekan tombol *"Buka Undangan"*, lengkap dengan tombol jeda mengambang (floating disc).
  * **Hitung Mundur (Countdown Timer):** Real-time detik menuju waktu akad/resepsi.
  * **Amplop Digital & Kado:** Tombol salin nomor rekening (BCA, Mandiri, dll.) dengan notifikasi toast popup.
  * **Buku Tamu / RSVP Interaktif:** Formulir ucapan langsung tersimpan dan tampil di layar.
* **Cara Mengganti Data untuk Klien Baru:**
  * Buka file `template-undangan/config.js`.
  * Ubah nama pengantin, tanggal acara, alamat, nomor rekening, dan link foto.
  * **Kamu tidak perlu menyentuh kode HTML atau CSS sama sekali!**

---

### 2. Tool Generator Nama Tamu & WhatsApp (`/guest-generator`)
* **Cara Pakai:** Buka `guest-generator/index.html` di browser.
* **Fungsi:**
  1. Masukkan link website undangan pengantin (misal: `https://undangankita.id/dimas-sarah`).
  2. Paste daftar 50–500 nama tamu dari WhatsApp/Excel.
  3. Klik **"Generate Semua Link & Pesan WA"**.
  4. Langsung tersedia tombol **Kirim via WhatsApp** (sekali klik langsung membuka chat WA tamu), salin pesan lengkap, atau export ke file **CSV/Excel**.
* **Formula Google Sheets:** Jika pengantin ingin mengelola di Google Spreadsheet, kamu tinggal berikan rumus dari file `guest-generator/google-sheets-formula.md`.

---

### 3. Sistem Pengingat & Rekap Order (`/order-automation`)
Biar kamu tidak lupa deadline pengerjaan draft dan tidak lupa follow-up pengantin menjelang hari pernikahan:
* Jalankan perintah ini di terminal:
  ```bash
  node order-automation/check_reminders.js
  ```
* Skrip akan otomatis memeriksa:
  1. ⏳ **Deadline Pengerjaan Draft:** Peringatan pesanan yang H-2, H-1, atau sudah lewat batas waktu.
  2. 🔔 **Reminder Acara Pengantin:** Peringatan pengantin yang acaranya H-7 (waktunya ingatkan cek RSVP) atau H-1 (waktunya kirim ucapan selamat).
  3. 💰 **Rekap Keuangan & Piutang:** Menampilkan total omset, uang DP yang sudah masuk, dan tagihan sisa yang belum dilunasi.

---

## 🌐 Cara Hosting Gratis & Cepat

1. **Cloudflare Pages / Vercel / Netlify:**
   * Cukup drag-and-drop folder `template-undangan` ke dashboard Cloudflare Pages atau Vercel.
   * Langsung dapat domain aktif gratis dengan SSL HTTPS (contoh: `dimas-sarah.pages.dev`).
2. **Subdomain Custom (Brand Sendiri):**
   * Beli domain utama (misal: `undangankita.id` sekitar Rp 100rb-an per tahun).
   * Sambungkan ke Vercel/Cloudflare, lalu setiap klien baru cukup buat folder atau subdomain: `dimas-sarah.undangankita.id`.
