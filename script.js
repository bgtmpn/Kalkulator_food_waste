// ==========================================
// 1. STATE
// ==========================================
let freq = 1;
let gram = 50;
let resData = {};

function fmt(n) {
  return Math.round(n).toLocaleString("id-ID");
}

function fmtKg(n) {
  return n < 1 ? (n * 1000).toFixed(0) + " gram" : n.toFixed(1) + " kg";
}

function fmtL(n) {
  return n < 1000 ? Math.round(n) + " L" : (n / 1000).toFixed(1) + " kL";
}

function fmtNum(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
}

// ==========================================
// 2. KALKULASI UTAMA
// ==========================================
function calc() {
  const priceSliderEl = document.getElementById("price-slider");
  if (!priceSliderEl) return;

  const price = parseInt(priceSliderEl.value);
  const perMonth = freq * 4;
  const wasteKg = (gram * perMonth) / 1000;
  const co2 = wasteKg * 2.5;
  const water = wasteKg * 270;
  const money = price * (gram / 400) * perMonth;
  const annual = money * 12;
  const meals = Math.round(wasteKg * 3);
  const compost = wasteKg * 0.3;
  const biogas = Math.round(wasteKg * 150);

  resData = {
    wasteKg,
    co2,
    water,
    money,
    annual,
    meals,
    compost,
    biogas,
    perMonth,
    freq,
  };

  let level = "good";
  if (wasteKg >= 2 && wasteKg < 5) level = "warn";
  if (wasteKg >= 5) level = "danger";

  updateTab1(wasteKg, co2, water, money, annual, level);
  updateTab2(wasteKg, co2, water, meals, compost, biogas, level);
  updateTab3(wasteKg, co2, water, meals, compost, biogas, level);
}

// ==========================================
// 3. UPDATE TAB 1: MAIN
// ==========================================
function updateTab1(wasteKg, co2, water, money, annual, level) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("res-money", "Rp " + fmt(money));
  set("res-water", fmtL(water));
  set("res-co2", co2.toFixed(1) + " kg");
  set("res-waste", fmtKg(wasteKg));
  set("res-annual", "Rp " + fmt(annual));
  set("eq-money", "≈ " + Math.round(money / 15000) + "× beli makan siang");
  set("eq-water", "≈ " + Math.round(water / 200) + " hari mandi");
  set("eq-co2", "≈ " + Math.round(co2 * 4) + " km naik motor");
  set("eq-waste", "≈ " + Math.round(wasteKg * 3) + " porsi makan");

  const v = document.getElementById("verdict");
  const vIcon = document.getElementById("v-icon");
  const vTitle = document.getElementById("v-title");
  const vText = document.getElementById("v-text");

  if (v && vIcon && vTitle && vText) {
    v.className = "verdict " + level;
    if (level === "good") {
      vIcon.textContent = "🌱";
      vTitle.textContent = "Kamu sudah cukup bijak!";
      vText.textContent =
        "Food waste kamu tergolong rendah. Pertahankan dan ajak temanmu untuk sadar juga!";
    } else if (level === "warn") {
      vIcon.textContent = "⚠️";
      vTitle.textContent = "Masih bisa lebih baik";
      vText.textContent =
        "Coba ambil porsi lebih kecil dulu, dan minta tambah kalau masih lapar.";
    } else {
      vIcon.textContent = "🚨";
      vTitle.textContent = "Perlu perubahan sekarang!";
      vText.textContent =
        "Dengan sedikit perubahan, kamu bisa hemat jutaan rupiah per tahun.";
    }
  }
}

// ==========================================
// 4. UPDATE TAB 2: DAMPAK
// ==========================================
function updateTab2(wasteKg, co2, water, meals, compost, biogas, level) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const motorKm = Math.round(co2 * 4);
  const botol = Math.round(water / 600);
  const pohon = (co2 / 21).toFixed(1);

  set("pi-co2", co2.toFixed(1) + " kg");
  set("pi-meals", meals + " porsi");
  set("pi-water", fmtL(water));
  set("pi-pohon", pohon + " pohon");
  set("pi-co2-eq", "≈ " + motorKm + " km motor");
  set("pi-meals-eq", "≈ " + meals + " orang lapar");
  set("pi-water-eq", "≈ " + botol + " botol air");

  const dn = document.getElementById("dampak-narrative");
  const dnt = document.getElementById("dampak-narrative-text");
  const ico = document.getElementById("dampak-dn-icon");

  if (dn && dnt) {
    dn.className = "pixel-narrative " + level;
    if (level === "good") {
      if (ico) ico.textContent = "🌱";
      dnt.textContent =
        "Keren! Sisa makanmu hasilkan " +
        co2.toFixed(1) +
        " kg CO₂ — setara " +
        motorKm +
        " km naik motor. Air yang terbuang " +
        fmtL(water) +
        " (" +
        botol +
        " botol). Kamu sudah baik, pertahankan!";
    } else if (level === "warn") {
      if (ico) ico.textContent = "⚠️";
      dnt.textContent =
        "Sisa makanmu hasilkan " +
        co2.toFixed(1) +
        " kg CO₂ (≈" +
        motorKm +
        " km motor) dan " +
        fmtL(water) +
        " air terbuang (≈" +
        botol +
        " botol). " +
        meals +
        " porsi makanan bisa dimakan orang lain tapi terbuang sia-sia. Masih bisa diperbaiki!";
    } else {
      if (ico) ico.textContent = "🚨";
      dnt.textContent =
        "Dalam sebulan, sisa makanmu hasilkan " +
        co2.toFixed(1) +
        " kg CO₂ — butuh " +
        pohon +
        " pohon setahun penuh untuk menyerapnya! Kamu juga buang " +
        fmtL(water) +
        " air bersih dan " +
        meals +
        " porsi yang bisa selamatkan " +
        meals +
        " orang dari kelaparan. Yuk berubah!";
    }
  }

  const avgID = 12;
  const pct = Math.min(Math.round((wasteKg / avgID) * 100), 150);
  const comparePct = document.getElementById("compare-pct");
  const compareBar = document.getElementById("compare-bar");
  const compareCap = document.getElementById("compare-caption");

  if (comparePct) comparePct.textContent = pct + "%";
  if (compareBar) {
    compareBar.style.width = Math.min(pct, 100) + "%";
    compareBar.className = "compare-fill " + level;
  }
  if (compareCap) {
    compareCap.textContent =
      pct < 50
        ? "Sisa makanmu jauh di bawah rata-rata Indonesia. Luar biasa! 🎉"
        : pct < 100
          ? "Sisa makanmu " + pct + "% dari rata-rata Indonesia (~12 kg/bulan)."
          : "Sisa makanmu " +
            pct +
            "% dari rata-rata Indonesia — di atas rata-rata. Yuk dikurangi!";
  }
}

// ==========================================
// 5. UPDATE TAB 3: AKSI
// ==========================================
function updateTab3(wasteKg, co2, water, meals, compost, biogas, level) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const potsFromCompost = Math.round(compost / 0.5);
  const biogasJam = Math.round(biogas / 10);
  const biogasEq =
    biogas >= 500
      ? "nyalakan TV " + Math.round(biogas / 100) + " jam"
      : biogas >= 100
        ? "nyalakan lampu LED " + biogasJam + " jam"
        : "bantu memasak";

  set("pp-compost", compost.toFixed(2) + " kg");
  set("pp-compost-eq", "≈ " + potsFromCompost + " pot tanaman");
  set("pp-meals", meals + " porsi");
  set("pp-biogas", fmtNum(biogas) + " Wh");
  set("pp-biogas-eq", "≈ " + biogasJam + " jam lampu LED");
  set("pp-co2saved", co2.toFixed(1) + " kg");
  set("bd-compost", compost.toFixed(2) + " kg");
  set("bd-meals", meals + " porsi");
  set("bd-biogas", fmtNum(biogas) + " Wh");
  set("bd-biogas-eq", biogasEq);

  const pn = document.getElementById("pos-narrative");
  const pnt = document.getElementById("pos-narrative-text");

  if (pn && pnt) {
    pn.className = "pixel-narrative good";
    if (level === "good") {
      pnt.textContent =
        "Kamu sudah bagus! Dengan " +
        compost.toFixed(2) +
        " kg kompos dari sisa makanmu, kamu bisa subur ~" +
        potsFromCompost +
        " pot tanaman. Terus jadi inspirasi untuk teman-temanmu!";
    } else if (level === "warn") {
      pnt.textContent =
        "Bayangkan kalau semua sisa makanmu dikelola baik: " +
        compost.toFixed(2) +
        " kg kompos untuk " +
        potsFromCompost +
        " pot tanaman, " +
        meals +
        " orang bisa kenyang, dan " +
        fmtNum(biogas) +
        " Wh energi biogas — cukup lampu LED " +
        biogasJam +
        " jam!";
    } else {
      pnt.textContent =
        "Sisa makanmu punya potensi besar! Kalau semua dikelola: " +
        compost.toFixed(2) +
        " kg kompos (" +
        potsFromCompost +
        " pot tanaman), " +
        meals +
        " porsi untuk dibagikan, dan " +
        fmtNum(biogas) +
        " Wh biogas. Mulai berubah sekarang, sisa makanmu bisa jadi berkah!";
    }
  }
}

// ==========================================
// 6. SHARE CARD
// ==========================================
function updateShareCard() {
  const { wasteKg, co2, water, money, annual, meals, compost, biogas, freq } =
    resData;
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  const freqLabel = {
    1: "1 kali",
    2.5: "2-3 kali",
    4.5: "4-5 kali",
    7: "tiap hari",
  };

  set(
    "sc-summary",
    "Menyisakan makanan ~" + (freqLabel[freq] || freq + "x") + " / minggu",
  );
  set("sc-money", "Rp " + fmt(money));
  set("sc-water", fmtL(water));
  set("sc-co2", co2.toFixed(1) + " kg");
  set("sc-waste", fmtKg(wasteKg));
  set("sc-compost", compost.toFixed(2) + " kg");
  set("sc-donate", meals + " porsi");
  set("sc-biogas", fmtNum(biogas) + " Wh");
}

function openShareModal() {
  updateShareCard();
  const modal = document.getElementById("share-modal");
  if (modal) modal.classList.add("show");
}

function closeShareModal() {
  const modal = document.getElementById("share-modal");
  if (modal) modal.classList.remove("show");
}

function downloadKartu() {
  const card = document.getElementById("share-card");
  if (card) {
    html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#1a1c2c",
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "wastewise-pixelated-report.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }
}

// ==========================================
// 7. CHALLENGE CHECKLIST
// ==========================================
function toggleChallenge(item) {
  const box = item.querySelector(".chk-box");
  const isDone = item.classList.contains("done");

  if (isDone) {
    item.classList.remove("done");
    box.classList.remove("checked");
    box.textContent = "";
  } else {
    item.classList.add("done");
    box.classList.add("checked");
    box.textContent = "✓";
  }

  const total = document.querySelectorAll(
    "#challenge-list .challenge-item",
  ).length;
  const done = document.querySelectorAll(
    "#challenge-list .challenge-item.done",
  ).length;
  const pct = Math.round((done / total) * 100);

  const countEl = document.getElementById("chk-count");
  const progEl = document.getElementById("chk-prog");
  if (countEl) countEl.textContent = done;
  if (progEl) progEl.style.width = pct + "%";
}

// ==========================================
// 8. EVENT LISTENERS
// ==========================================
document.querySelectorAll("#freq-group .freq-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll("#freq-group .freq-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    freq = parseFloat(btn.dataset.val);
    calc();
  });
});

document.querySelectorAll("#portion-group .portion-btn").forEach((card) => {
  card.addEventListener("click", () => {
    document
      .querySelectorAll("#portion-group .portion-btn")
      .forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    gram = parseInt(card.dataset.gram);
    calc();
  });
});

const priceSlider = document.getElementById("price-slider");
if (priceSlider) {
  priceSlider.addEventListener("input", function () {
    const priceDisp = document.getElementById("price-disp");
    if (priceDisp)
      priceDisp.textContent = parseInt(this.value).toLocaleString("id-ID");
    calc();
  });
}

// ==========================================
// 9. NAVIGATION & LIFECYCLE
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
  calc();
  setTimeout(() => {
    const loader = document.getElementById("loading-screen");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 600);
    }
  }, 1800);
});

function switchTab(tabName) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-tab")
    .forEach((t) => t.classList.remove("active"));

  const targetPage = document.getElementById("page-" + tabName);
  if (targetPage) targetPage.classList.add("active");

  const tabMap = { input: 0, impact: 1, positive: 2 };
  const idx = tabMap[tabName];
  const tabs = document.querySelectorAll(".nav-tab");
  if (tabs[idx]) tabs[idx].classList.add("active");

  window.scrollTo(0, 0);
}
