# Formula Google Sheets untuk Broadcast Undangan Digital

Jika klien kamu lebih suka mengelola daftar tamu di Google Sheets atau Excel, kamu bisa bagikan template kolom dan formula sakti ini kepada mereka!

---

### Struktur Kolom Google Sheets

| Kolom | Nama Kolom | Contoh Nilai | Formula / Keterangan |
| :--- | :--- | :--- | :--- |
| **A** | **Nama Tamu** | `Budi Santoso` | Diisi nama tamu oleh pengantin |
| **B** | **No. WhatsApp** | `08123456789` | Diisi no HP (bisa awalan `08` atau `628`) |
| **C** | **Base URL Undangan** | `https://undangankita.id/dimas-sarah` | Link utama website undangan |
| **D** | **Link Personal (?to=)** | *(Formula)* | Menghasilkan link dengan nama tamu di URL |
| **E** | **Format No. WA Internasional** | *(Formula)* | Mengubah `08xxx` menjadi `628xxx` otomatis |
| **F** | **Isi Pesan Undangan** | *(Formula)* | Menggabungkan nama, link, dan kata mutiara |
| **G** | **Tombol Klik Kirim WA** | *(Formula)* | Klik langsung membuka aplikasi WhatsApp |

---

### Rumus / Formula yang Digunakan:

#### 1. Rumus Link Personal (Kolom D2):
```excel
=C2 & "?to=" & ENCODEURL(A2)
```

#### 2. Rumus Format No WA (Kolom E2):
*(Otomatis ubah 08xxx jadi 628xxx)*
```excel
=IF(ISBLANK(B2), "", IF(LEFT(REGEXREPLACE(TO_TEXT(B2), "\D", ""), 1)="0", "62" & MID(REGEXREPLACE(TO_TEXT(B2), "\D", ""), 2, 50), REGEXREPLACE(TO_TEXT(B2), "\D", "")))
```

#### 3. Rumus Template Pesan WA (Kolom F2):
```excel
="Kepada Yth. Bapak/Ibu/Saudara/i " & A2 & CHAR(10) & CHAR(10) & "Tanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk hadir pada acara pernikahan kami:" & CHAR(10) & CHAR(10) & D2 & CHAR(10) & CHAR(10) & "Merupakan kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu." & CHAR(10) & CHAR(10) & "Terima kasih."
```
> *Tips:* `CHAR(10)` adalah kode Enter (baris baru) di Google Sheets.

#### 4. Rumus Tombol Kirim WhatsApp Sekali Klik (Kolom G2):
```excel
=IF(ISBLANK(E2), HYPERLINK("https://api.whatsapp.com/send?text=" & ENCODEURL(F2), "💬 Kirim (Tanpa No)"), HYPERLINK("https://api.whatsapp.com/send?phone=" & E2 & "&text=" & ENCODEURL(F2), "💬 Kirim ke " & A2))
```

---

Dengan formula ini, pengantin tinggal buka Google Sheets di laptop/HP, lalu klik tombol **"💬 Kirim"**, WhatsApp Web atau aplikasi WhatsApp di HP akan langsung terbuka dengan pesan yang sudah terisi rapi!
