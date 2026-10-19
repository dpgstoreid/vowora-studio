/**
 * KONFIGURASI DATA UNDANGAN DIGITAL
 * Cukup edit file ini untuk setiap klien baru.
 */
window.WEDDING_CONFIG = {
  // Pilihan Tema: "gold" (Champagne Gold), "sage" (Botanical Green), "rose" (Romantic Rose), "midnight" (Royal Navy)
  theme: "gold",

  // Panggilan & Nama Mempelai
  mempelai: {
    pria: {
      panggilan: "Dimas",
      namaLengkap: "Dimas Arya Pratama, S.Kom.",
      ayah: "Bpk. Bambang Sulistyo",
      ibu: "Ibu Siti Rahmawati",
      instagram: "dimas_pratama",
      foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
    },
    wanita: {
      panggilan: "Sarah",
      namaLengkap: "Sarah Annisa Putri, S.E.",
      ayah: "Bpk. H. Hendra Wijaya",
      ibu: "Ibu Hj. Farida Hanum",
      instagram: "sarah_annisa",
      foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    }
  },

  // Foto Cover / Hero
  coverFoto: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",

  // Kutipan Ayat / Kata Mutiara
  quote: {
    teks: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    sumber: "QS. Ar-Rum: 21"
  },

  // Detail Acara & Countdown
  acara: {
    targetWaktuCountdown: "2026-12-25T08:00:00",
    
    akad: {
      judul: "Akad Nikah",
      hariTanggal: "Jumat, 25 Desember 2026",
      waktu: "08.00 - 10.00 WIB",
      tempat: "Masjid Raya Al-Ikhlas",
      alamat: "Jl. Melati No. 45, Kebayoran Baru, Jakarta Selatan",
      linkMaps: "https://maps.google.com"
    },
    
    resepsi: {
      judul: "Resepsi Pernikahan",
      hariTanggal: "Jumat, 25 Desember 2026",
      waktu: "11.00 - 15.00 WIB",
      tempat: "Grand Ballroom Hotel Harmoni",
      alamat: "Jl. Sudirman Kav. 10, Jakarta Pusat",
      linkMaps: "https://maps.google.com"
    }
  },

  // Panduan Dresscode
  dresscode: {
    aktif: true,
    catatan: "Tamu undangan disarankan mengenakan pakaian bertema Sage Green, Champagne, atau Earth Tone."
  },

  // Live Streaming (YouTube / Zoom / IG Live)
  liveStreaming: {
    aktif: true,
    url: "https://youtube.com/live"
  },

  // Kisah Cinta (Timeline)
  loveStory: [
    {
      tahun: "2020",
      judul: "Awal Berjumpa",
      deskripsi: "Pertama kali bertemu saat ospek kampus dan menjadi rekan satu kelompok proyek akhir."
    },
    {
      tahun: "2023",
      judul: "Komitmen Bersama",
      deskripsi: "Setelah 3 tahun saling mengenal dan mendukung, kami memutuskan untuk berkomitmen serius."
    },
    {
      tahun: "2026",
      judul: "Lamaran",
      deskripsi: "Dengan restu kedua orang tua, kami mengikat janji suci dalam prosesi lamaran keluarga."
    }
  ],

  // Galeri Foto
  galeri: [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=600&q=80"
  ],

  // Amplop Digital / Rekening Hadiah
  amplopDigital: {
    aktif: true,
    rekening: [
      {
        bank: "BCA",
        nomorRekening: "1234567890",
        atasNama: "Dimas Arya Pratama"
      },
      {
        bank: "Mandiri",
        nomorRekening: "9876543210123",
        atasNama: "Sarah Annisa Putri"
      }
    ],
    kirimKado: {
      aktif: true,
      penerima: "Dimas & Sarah",
      noHp: "0812-3456-7890",
      alamat: "Jl. Melati No. 45, RT 02/RW 04, Kebayoran Baru, Jakarta Selatan 12160"
    }
  },

  // Pilihan Musik Romantis (Default Track)
  musikUrl: "https://cdn.jsdelivr.net/gh/rafaelreis-hotmart/Audio-Sample-files@master/sample.mp3",

  // Watermark / Branding
  branding: {
    namaBrand: "DPGSTORE.ID (Palugada Serba Ada)",
    linkBrand: "https://wa.me/6287898199000",
    pesanFooter: "Dibuat dengan segenap cinta oleh"
  }
};
