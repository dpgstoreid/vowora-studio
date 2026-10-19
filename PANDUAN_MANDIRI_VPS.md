# 🚀 Panduan Menjalankan Vowora Secara Mandiri (100% Bebas & Mandiri)

Platform **Vowora** dibangun menggunakan teknologi standar industri (**HTML5, Tailwind CSS, JavaScript Vanilla, dan Node.js murni**) tanpa ada keterikatan (*vendor lock-in*) dengan Antigravity sama sekali.

Kamu adalah **pemilik penuh 100%** dari seluruh file ini.

---

## 📂 LANGKAH 1: Amankan Folder Proyek di Laptop Kamu

Pindahkan atau salin folder proyek ini dari folder scratch ke lokasi dokumen utama kamu:
* **Lokasi Saat Ini:**  
  `C:\Users\Santa\.gemini\antigravity\scratch\undangan-digital-kit`
* **Salin ke Lokasi Baru (Contoh):**  
  `D:\Vowora` atau `C:\Users\Santa\Documents\Vowora`

Di folder baru tersebut, kamu cukup klik **`JALANKAN_APLIKASI.bat`** kapan saja untuk menyalakan server lokal secara mandiri.

---

## 🌐 LANGKAH 2: Pasang di VPS Sendiri (Online 24 Jam Non-Stop)

Karena kamu sudah memiliki VPS (tempat bot WA kamu berjalan), kamu bisa menggabungkan website Vowora di VPS yang sama agar online 24 jam tanpa perlu laptop menyala!

### 1. Upload Folder ke VPS
Gunakan FileZilla, WinSCP, atau perintah `scp`/`git`:
```bash
scp -r "C:\Users\Santa\.gemini\antigravity\scratch\undangan-digital-kit" root@IP_VPS_KAMU:/var/www/vowora
```

### 2. Masuk ke VPS via Terminal / SSH:
```bash
ssh root@IP_VPS_KAMU
cd /var/www/vowora
```

### 3. Jalankan Menggunakan PM2 (Process Manager agar Hidup Terus):
PM2 berfungsi menjaga website kamu tetap hidup 24 jam. Jika server restart, PM2 otomatis menyalakan kembali websitenya:
```bash
# Install PM2 jika belum ada
npm install -g pm2

# Nyalakan Vowora
pm2 start server.js --name "vowora"

# Simpan agar otomatis hidup saat VPS reboot
pm2 save
pm2 startup
```

### 4. Pasang Domain (vowora.id) dengan Nginx & SSL HTTPS Gratis:
Konfigurasi Nginx di VPS (`/etc/nginx/sites-available/vowora`):
```nginx
server {
    server_name vowora.id www.vowora.id;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan SSL HTTPS gratis selamanya dengan Certbot:
```bash
sudo certbot --nginx -d vowora.id -d www.vowora.id
```

Website kamu resmi berstatus: **`https://vowora.id`** aman, cepat, dan online 24/7!

---

## ☁️ LANGKAH 3 (Alternatif): Tanpa Setup VPS (Pakai Cloud PaaS)

Jika tidak mau ribet atur terminal Linux di VPS, kamu bisa deploy dalam 3 menit:
1. Buat akun di **[Railway.app](https://railway.app)** atau **[Render.com](https://render.com)**.
2. Hubungkan repository GitHub kamu.
3. Klik **Deploy** — website langsung aktif dengan domain gratis dan sertifikat SSL otomatis!
