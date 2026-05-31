// VARIABEL STATUS DEFAULT
let freq = 1;      // Nilai awal intensitas kali per minggu
let gram = 50;     // Berat sisa makanan (gram)
let resData = {};

// Fungsi format ribuan Rp ala Indonesia
function fmt(n) { 
  return Math.round(n).toLocaleString('id-ID'); 
}

// FUNGSI UTAMA KALKULASI BERDASARKAN BULANAN
function calc() {
  const price = parseInt(document.getElementById('price-slider').value);
  
  // Rumus hitungan rata-rata intensitas dikali 4 minggu
  const perMonth = freq * 4;
  
  // Total Berat Sampah Makanan (Kg) per bulan
  const wasteKg = (gram * perMonth) / 1000;
  
  // Dampak Karbon & Air Terbuang (Metrik referensi dasar lingkungan)
  const co2 = wasteKg * 2.5;
  const water = wasteKg * 270;
  
  // Estimasi kerugian uang per bulan
  const money = price * (gram / 400) * perMonth;

  // Simpan data state untuk dilempar ke Kartu Screenshot
  resData = { money, water, co2, wasteKg, perMonth };

  // Render hasil angka di Halaman Utama
  document.getElementById('res-money').textContent = 'Rp ' + fmt(money);
  document.getElementById('res-water').textContent = fmt(water) + ' L';
  document.getElementById('res-co2').textContent = co2.toFixed(1) + ' kg';
  document.getElementById('res-waste').textContent = wasteKg.toFixed(1) + ' kg';

  // Render teks perbandingan (Equivalen) unik retro
  document.getElementById('eq-money').textContent = '≈ ' + Math.round(money / 15000) + 'x porsi makan';
  document.getElementById('eq-water').textContent = '≈ ' + Math.round(water / 200) + ' hari mandi';
  document.getElementById('eq-co2').textContent = '≈ ' + Math.round(co2 * 4) + ' km naik motor';
  document.getElementById('eq-waste').textContent = '≈ ' + Math.round(wasteKg * 3) + ' porsi mi';
}

// Sinkronisasi data ke Box Kartu sebelum di-screenshot/share
function updateShareCard() {
  const { money, water, co2, wasteKg, perMonth } = resData;

  document.getElementById('sc-summary').textContent = `Membesitkan sisa makan ~${perMonth}x dalam sebulan.`;
  document.getElementById('sc-money').textContent = 'Rp ' + fmt(money);
  document.getElementById('sc-water').textContent = fmt(water) + ' L';
  document.getElementById('sc-co2').textContent = co2.toFixed(1) + ' kg';
  document.getElementById('sc-waste').textContent = wasteKg.toFixed(1) + ' kg';
}

// EVENT LISTENER: Pilihan Intensitas (Step 1)
document.querySelectorAll('#freq-group .freq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#freq-group .freq-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    freq = parseFloat(btn.dataset.val);
    calc();
  });
});

// EVENT LISTENER: Pilihan Besaran Porsi Gram (Step 2)
document.querySelectorAll('#portion-group .portion-btn').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#portion-group .portion-btn').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    gram = parseInt(card.dataset.gram);
    calc();
  });
});

// EVENT LISTENER: Perubahan Range Slider Harga Makanan (Step 3)
const priceSlider = document.getElementById('price-slider');
if (priceSlider) {
  priceSlider.addEventListener('input', function() {
    document.getElementById('price-disp').textContent = parseInt(this.value).toLocaleString('id-ID');
    calc();
  });
}

// CONTROLLER MODAL / SHARE SCREEN
function openShareModal() { 
  updateShareCard();
  document.getElementById('share-modal').classList.add('show'); 
}
function closeShareModal() { 
  document.getElementById('share-modal').classList.remove('show'); 
}

// ACTION BUTTON DOWNLOAD KARTU (Menggunakan html2canvas)
function downloadKartu() {
  const card = document.getElementById('share-card');
  html2canvas(card, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#1a1c2c'
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'wastewise-pixelated-report.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// MENYEMBUNYIKAN LOADING SCREEN JADUL
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500); 
    }
  }, 1200);
  calc(); // Jalankan fungsi kalkulasi pertama kali buka web
});

// SISTEM NAVIGASI TAB MENU SEDERHANA
function switchTab(tabName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  
  const targetPage = document.getElementById('page-' + tabName);
  if (targetPage) targetPage.classList.add('active');
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('active');
  }
}