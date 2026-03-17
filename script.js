  let freq = 1, gram = 50;
  let resData = {};

  function fmt(n) { return Math.round(n).toLocaleString('id-ID'); }

  function calc() {
    const price = parseInt(document.getElementById('price-slider').value);
    const perMonth = freq * 4;
    const wasteKg = (gram * perMonth) / 1000;
    const co2     = wasteKg * 2.5;
    const water   = wasteKg * 270;
    const money   = price * (gram / 400) * perMonth;
    const annual  = money * 12;

    resData = { money, water, co2, wasteKg, annual, perMonth, freq };

    document.getElementById('res-money').textContent = 'Rp ' + fmt(money);
    document.getElementById('res-water').textContent = fmt(water) + ' L';
    document.getElementById('res-co2').textContent   = co2.toFixed(1) + ' kg';
    document.getElementById('res-waste').textContent = wasteKg.toFixed(1) + ' kg';
    document.getElementById('res-annual').textContent = 'Rp ' + fmt(annual);
    document.getElementById('eq-money').textContent  = '≈ ' + Math.round(money / 15000) + '× beli makan siang';
    document.getElementById('eq-water').textContent  = '≈ ' + Math.round(water / 200) + ' hari mandi';
    document.getElementById('eq-co2').textContent    = '≈ ' + Math.round(co2 * 4) + ' km naik motor';
    document.getElementById('eq-waste').textContent  = '≈ ' + Math.round(wasteKg * 3) + ' porsi makan';

    const v = document.getElementById('verdict');
    const vIcon = document.getElementById('v-icon');
    const vTitle = document.getElementById('v-title');
    const vText = document.getElementById('v-text');
    v.className = 'verdict ';
    if (wasteKg < 2) {
      v.className += 'good'; vIcon.textContent = '🌱';
      vTitle.textContent = 'Kamu sudah cukup bijak!';
      vText.textContent = 'Food waste kamu tergolong rendah. Pertahankan dan ajak temanmu untuk sadar juga!';
    } else if (wasteKg < 5) {
      v.className += 'warn'; vIcon.textContent = '⚠️';
      vTitle.textContent = 'Masih bisa lebih baik';
      vText.textContent = 'Coba ambil porsi lebih kecil dulu, dan minta tambah kalau masih lapar.';
    } else {
      v.className += 'danger'; vIcon.textContent = '🚨';
      vTitle.textContent = 'Perlu perubahan sekarang!';
      vText.textContent = 'Dengan sedikit perubahan, kamu bisa hemat jutaan rupiah per tahun.';
    }
  }

  function updateShareCard() {
    const { money, water, co2, wasteKg, annual, perMonth } = resData;

    const freqLabels = { 1:'1', 2:'2–3', 5:'4–5', 7:'7' };
    document.getElementById('sc-freq-label').textContent =
      'buang sisa makanan ~' + (freqLabels[freq] || freq) + 'x seminggu';

    document.getElementById('sc-money').textContent = 'Rp ' + fmt(money);
    document.getElementById('sc-water').textContent = fmt(water) + ' L';
    document.getElementById('sc-co2').textContent   = co2.toFixed(1) + ' kg';
    document.getElementById('sc-waste').textContent = wasteKg.toFixed(1) + ' kg';
    document.getElementById('sc-annual').textContent = 'Rp ' + fmt(annual);

    const bar = document.getElementById('sc-verdict-bar');
    const icon = document.getElementById('sc-v-icon');
    const text = document.getElementById('sc-v-text');
    bar.className = 'sc-verdict-bar ';
    if (wasteKg < 2) {
      bar.className += 'good'; icon.textContent = '🌱';
      text.innerHTML = '<strong>Cukup bijak!</strong><br>Pertahankan dan ajak temanmu sadar.';
    } else if (wasteKg < 5) {
      bar.className += 'warn'; icon.textContent = '⚠️';
      text.innerHTML = '<strong>Masih bisa lebih baik!</strong><br>Ambil porsi kecil, minta tambah kalau lapar.';
    } else {
      bar.className += 'danger'; icon.textContent = '🚨';
      text.innerHTML = '<strong>Yuk mulai berubah!</strong><br>Sedikit langkah kecil berdampak besar.';
    }
  }

  function bukaShare() {
    updateShareCard();
    document.getElementById('overlay').classList.add('show');
  }

  function tutupShare(e) {
    if (!e || e.target === document.getElementById('overlay')) {
      document.getElementById('overlay').classList.remove('show');
    }
  }

  function downloadKartu() {
    const card = document.getElementById('share-card');
    html2canvas(card, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      logging: false
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'foodwaste-hasilku.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  document.querySelectorAll('#freq-group .chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#freq-group .chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      freq = parseInt(btn.dataset.val);
      calc();
    });
  });

  document.querySelectorAll('#portion-group .portion-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#portion-group .portion-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      gram = parseInt(card.dataset.gram);
      calc();
    });
  });

  document.getElementById('price-slider').addEventListener('input', function() {
    document.getElementById('price-disp').textContent = parseInt(this.value).toLocaleString('id-ID');
    calc();
  });

  calc();
function toggleDarkMode() {
    const body = document.body;
    const btn = document.getElementById('darkToggle');
    
    body.classList.toggle('dark-mode');
    
    // Ganti icon tombol
    if (body.classList.contains('dark-mode')) {
        btn.innerHTML = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        btn.innerHTML = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Cek settingan terakhir user pas web dibuka
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkToggle').innerHTML = '☀️';
    }
    // Panggil calc() lo biar angkanya lgsg muncul
    calc(); 
});