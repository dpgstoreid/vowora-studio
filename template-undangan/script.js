document.addEventListener('DOMContentLoaded', () => {
  const config = window.WEDDING_CONFIG;
  if (!config) {
    console.error("Wedding config not found!");
    return;
  }

  // 1. TEMA WARNA & MESSAGE LISTENER (Untuk Live Preview dari Studio Admin)
  const theme = config.theme || 'gold';
  document.documentElement.setAttribute('data-theme', theme);
  const wrapper = document.getElementById('mobileWrapper');
  if (wrapper) wrapper.setAttribute('data-theme', theme);

  window.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'changeTheme') {
      document.documentElement.setAttribute('data-theme', event.data.theme);
      if (wrapper) wrapper.setAttribute('data-theme', event.data.theme);
    }
  });

  // 2. URL PARAMETER FOR GUEST NAME (?to=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to');
  const guestNameElement = document.getElementById('guestName');
  if (guestParam) {
    const formattedGuest = decodeURIComponent(guestParam.replace(/\+/g, ' '));
    guestNameElement.textContent = formattedGuest;
  } else {
    guestNameElement.textContent = "Tamu Undangan";
  }

  // 3. RENDER DATA MEMPELAI & COVER
  const priaPanggilan = config.mempelai.pria.panggilan || "Pria";
  const wanitaPanggilan = config.mempelai.wanita.panggilan || "Wanita";
  document.getElementById('coverTitleCouple').textContent = `${priaPanggilan} & ${wanitaPanggilan}`;
  document.getElementById('heroTitleCouple').textContent = `${priaPanggilan} & ${wanitaPanggilan}`;
  
  const coverScreen = document.getElementById('coverScreen');
  if (config.coverFoto) {
    coverScreen.style.backgroundImage = `url('${config.coverFoto}')`;
    const heroInner = document.getElementById('heroInner');
    heroInner.style.backgroundImage = `url('${config.coverFoto}')`;
  }

  // Quote
  if (config.quote) {
    document.getElementById('quoteText').textContent = `"${config.quote.teks || ''}"`;
    document.getElementById('quoteSource').textContent = config.quote.sumber || '';
  }

  // Profil Pria (Perbaikan bug string orang tua)
  document.getElementById('priaFoto').src = config.mempelai.pria.foto || '';
  document.getElementById('priaNama').textContent = config.mempelai.pria.namaLengkap || '';
  
  let ortuPriaText = '';
  if (config.mempelai.pria.ibu && config.mempelai.pria.ayah) {
    ortuPriaText = `Putra dari ${config.mempelai.pria.ayah} & ${config.mempelai.pria.ibu}`;
  } else if (config.mempelai.pria.ayah) {
    ortuPriaText = `Putra dari ${config.mempelai.pria.ayah}`;
  }
  document.getElementById('priaOrtu').textContent = ortuPriaText;

  const priaIg = config.mempelai.pria.instagram || '';
  document.getElementById('priaIg').href = `https://instagram.com/${priaIg.replace('@', '')}`;
  document.getElementById('priaIgText').textContent = priaIg ? `@${priaIg.replace('@', '')}` : '';

  // Profil Wanita (Perbaikan bug string orang tua)
  document.getElementById('wanitaFoto').src = config.mempelai.wanita.foto || '';
  document.getElementById('wanitaNama').textContent = config.mempelai.wanita.namaLengkap || '';

  let ortuWanitaText = '';
  if (config.mempelai.wanita.ibu && config.mempelai.wanita.ayah) {
    ortuWanitaText = `Putri dari ${config.mempelai.wanita.ayah} & ${config.mempelai.wanita.ibu}`;
  } else if (config.mempelai.wanita.ayah) {
    ortuWanitaText = `Putri dari ${config.mempelai.wanita.ayah}`;
  }
  document.getElementById('wanitaOrtu').textContent = ortuWanitaText;

  const wanitaIg = config.mempelai.wanita.instagram || '';
  document.getElementById('wanitaIg').href = `https://instagram.com/${wanitaIg.replace('@', '')}`;
  document.getElementById('wanitaIgText').textContent = wanitaIg ? `@${wanitaIg.replace('@', '')}` : '';

  // Detail Acara Akad & Resepsi
  if (config.acara) {
    document.getElementById('akadTanggal').textContent = config.acara.akad?.hariTanggal || '';
    document.getElementById('akadWaktu').textContent = config.acara.akad?.waktu || '';
    document.getElementById('akadTempat').textContent = config.acara.akad?.tempat || '';
    document.getElementById('akadAlamat').textContent = config.acara.akad?.alamat || '';
    document.getElementById('akadMaps').href = config.acara.akad?.linkMaps || '#';

    document.getElementById('resepsiTanggal').textContent = config.acara.resepsi?.hariTanggal || '';
    document.getElementById('resepsiWaktu').textContent = config.acara.resepsi?.waktu || '';
    document.getElementById('resepsiTempat').textContent = config.acara.resepsi?.tempat || '';
    document.getElementById('resepsiAlamat').textContent = config.acara.resepsi?.alamat || '';
    document.getElementById('resepsiMaps').href = config.acara.resepsi?.linkMaps || '#';
  }

  // 4. GENERATE GOOGLE CALENDAR LINKS (Perbaikan parsing tanggal)
  function parseTargetDate(dateStr) {
    if (!dateStr) return new Date(2026, 11, 25, 8, 0);
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    return new Date(2026, 11, 25, 8, 0);
  }

  function generateGCalUrl(title, details, location, dateIso) {
    const d = parseTargetDate(dateIso);
    const startStr = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(d.getTime() + 3 * 60 * 60 * 1000); // durasi 3 jam
    const endStr = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    return `${base}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&dates=${startStr}/${endStr}`;
  }

  const akadCal = document.getElementById('akadCalendar');
  if (akadCal && config.acara) {
    akadCal.href = generateGCalUrl(
      `Akad Nikah: ${priaPanggilan} & ${wanitaPanggilan}`,
      `Menghadiri prosesi Akad Nikah ${config.mempelai.pria.namaLengkap} & ${config.mempelai.wanita.namaLengkap}`,
      `${config.acara.akad?.tempat || ''}, ${config.acara.akad?.alamat || ''}`,
      config.acara.targetWaktuCountdown
    );
  }

  const resepsiCal = document.getElementById('resepsiCalendar');
  if (resepsiCal && config.acara) {
    resepsiCal.href = generateGCalUrl(
      `Resepsi Pernikahan: ${priaPanggilan} & ${wanitaPanggilan}`,
      `Menghadiri Resepsi Pernikahan ${config.mempelai.pria.namaLengkap} & ${config.mempelai.wanita.namaLengkap}`,
      `${config.acara.resepsi?.tempat || ''}, ${config.acara.resepsi?.alamat || ''}`,
      config.acara.targetWaktuCountdown
    );
  }

  // 5. LIVE STREAMING & DRESSCODE
  const streamingBox = document.getElementById('streamingContainer');
  const btnStream = document.getElementById('btnStreaming');
  if (config.liveStreaming && config.liveStreaming.aktif && config.liveStreaming.url) {
    btnStream.href = config.liveStreaming.url;
  } else if (streamingBox) {
    streamingBox.style.display = 'none';
  }

  const dressNotes = document.getElementById('dresscodeNotes');
  if (config.dresscode && config.dresscode.catatan && dressNotes) {
    dressNotes.textContent = config.dresscode.catatan;
  }

  // Timeline Love Story
  const storyContainer = document.getElementById('storyTimeline');
  storyContainer.innerHTML = '';
  if (config.loveStory && Array.isArray(config.loveStory)) {
    config.loveStory.forEach(item => {
      const el = document.createElement('div');
      el.className = 'story-item';
      el.innerHTML = `
        <div class="story-year">${item.tahun}</div>
        <div class="story-title">${item.judul}</div>
        <div class="story-desc">${item.deskripsi}</div>
      `;
      storyContainer.appendChild(el);
    });
  }

  // Galeri Foto
  const galleryGrid = document.getElementById('galleryGrid');
  galleryGrid.innerHTML = '';
  if (config.galeri && Array.isArray(config.galeri)) {
    config.galeri.forEach(imgUrl => {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = "Momen Bahagia";
      img.className = "gallery-img";
      img.loading = "lazy";
      galleryGrid.appendChild(img);
    });
  }

  // Amplop Digital
  const bankContainer = document.getElementById('bankContainer');
  bankContainer.innerHTML = '';
  if (config.amplopDigital && config.amplopDigital.aktif) {
    if (config.amplopDigital.rekening) {
      config.amplopDigital.rekening.forEach(rek => {
        const card = document.createElement('div');
        card.className = 'gift-card';
        card.innerHTML = `
          <div class="bank-logo-text">${rek.bank}</div>
          <div class="bank-account-num">${rek.nomorRekening}</div>
          <div class="bank-holder">a.n ${rek.atasNama}</div>
          <button class="btn-copy" onclick="copyText('${rek.nomorRekening}', 'Nomor rekening ${rek.bank} berhasil disalin!')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Salin Rekening
          </button>
        `;
        bankContainer.appendChild(card);
      });
    }

    if (config.amplopDigital.kirimKado && config.amplopDigital.kirimKado.aktif) {
      const kado = config.amplopDigital.kirimKado;
      const kadoCard = document.createElement('div');
      kadoCard.className = 'gift-card';
      kadoCard.innerHTML = `
        <div class="bank-logo-text" style="color: var(--primary);">KIRIM KADO FISIK</div>
        <div class="bank-holder" style="font-weight:600; color:var(--text-main); margin-bottom:4px;">Penerima: ${kado.penerima} (${kado.noHp})</div>
        <div class="bank-holder">${kado.alamat}</div>
        <button class="btn-copy" onclick="copyText('${kado.alamat}', 'Alamat pengiriman kado berhasil disalin!')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Salin Alamat
        </button>
      `;
      bankContainer.appendChild(kadoCard);
    }
  }

  // Branding Footer
  document.getElementById('brandName').textContent = config.branding?.namaBrand || 'Vowora.studio';
  document.getElementById('brandLink').href = config.branding?.linkBrand || '/';

  // 6. AUDIO PLAYER DENGAN SYNTHESIZER FALLBACK OTOMATIS
  const bgAudio = document.getElementById('bgAudio');
  bgAudio.src = config.musikUrl || "https://cdn.jsdelivr.net/gh/rafaelreis-hotmart/Audio-Sample-files@master/sample.mp3";
  const audioCtrl = document.getElementById('audioController');
  let isPlaying = false;
  let synthTimer = null;

  // Web Audio API Synthesizer (Jika audio eksternal gagal/403/offline)
  function playProceduralRomanticChimes() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Akor Romantis C - G - Am - F (Canon progression)
      const notes = [
        261.63, 329.63, 392.00, 523.25, // C Major
        196.00, 246.94, 293.66, 392.00, // G Major
        220.00, 261.63, 329.63, 440.00, // A minor
        174.61, 220.00, 261.63, 349.23  // F Major
      ];
      let step = 0;

      function playNote(freq) {
        if (!isPlaying) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 1.8);
      }

      synthTimer = setInterval(() => {
        if (!isPlaying) return;
        playNote(notes[step % notes.length]);
        step++;
      }, 700);
    } catch (e) {
      console.log("Audio Synth info:", e);
    }
  }

  const btnOpen = document.getElementById('btnOpen');
  btnOpen.addEventListener('click', () => {
    coverScreen.classList.add('opened');
    
    // Play music dengan fallback
    bgAudio.play().then(() => {
      isPlaying = true;
      audioCtrl.classList.add('rotating');
    }).catch(err => {
      console.log("Audio file diblokir/error, menyalakan procedural synthesizer...", err);
      isPlaying = true;
      audioCtrl.classList.add('rotating');
      playProceduralRomanticChimes();
    });

    // Refresh AOS
    setTimeout(() => {
      if (window.AOS) {
        AOS.init({ duration: 800, once: true, offset: 40 });
        AOS.refresh();
      }
    }, 300);
  });

  audioCtrl.addEventListener('click', () => {
    if (isPlaying) {
      bgAudio.pause();
      if (synthTimer) clearInterval(synthTimer);
      isPlaying = false;
      audioCtrl.classList.remove('rotating');
    } else {
      bgAudio.play().catch(() => playProceduralRomanticChimes());
      isPlaying = true;
      audioCtrl.classList.add('rotating');
    }
  });

  // 7. COUNTDOWN TIMER
  const targetDate = parseTargetDate(config.acara?.targetWaktuCountdown).getTime();
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = d < 10 ? '0' + d : d;
    hoursEl.textContent = h < 10 ? '0' + h : h;
    minutesEl.textContent = m < 10 ? '0' + m : m;
    secondsEl.textContent = s < 10 ? '0' + s : s;
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 8. RSVP & BUKU UCAPAN (LOCAL STORAGE DEMO)
  const rsvpForm = document.getElementById('rsvpForm');
  const wishesList = document.getElementById('wishesList');

  const defaultWishes = [
    { name: "Aditya & Istri", status: "Hadir", message: "Selamat ya Dimas dan Sarah! Semoga langgeng sampai maut memisahkan dan jadi keluarga yang sakinah mawaddah warahmah." },
    { name: "Dewi Kartika", status: "Hadir", message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khoir. Lancar sampai hari H!" }
  ];

  let storedWishes = JSON.parse(localStorage.getItem('wedding_wishes')) || defaultWishes;

  function renderWishes() {
    wishesList.innerHTML = '';
    storedWishes.forEach(item => {
      const card = document.createElement('div');
      card.className = 'wish-item';
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-sender">${item.name}</span>
          <span class="wish-badge">${item.status}</span>
        </div>
        <div class="wish-message">${item.message}</div>
      `;
      wishesList.prepend(card);
    });
  }
  renderWishes();

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvpName').value.trim();
    const status = document.getElementById('rsvpStatus').value;
    const message = document.getElementById('rsvpMessage').value.trim();

    if (!name || !message) return;

    const newWish = { name, status, message };
    storedWishes.push(newWish);
    localStorage.setItem('wedding_wishes', JSON.stringify(storedWishes));

    renderWishes();
    rsvpForm.reset();
    showToast("Terima kasih atas doa restunya!");
  });
});

// GLOBAL TOAST & COPY HELPER
function showToast(message) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function copyText(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg || "Berhasil disalin ke clipboard!");
  }).catch(() => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(successMsg || "Berhasil disalin!");
  });
}
