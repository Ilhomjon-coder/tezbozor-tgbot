/* ============ Tezbozor — ma'lumotlar ============ */

// Bugungi sana (namoyish uchun qat'iy: chorshanba — bozor kuni)
const TODAY = {
  weekdayIdx: 3,                 // 0=Yak ... 3=Chor
  label: "6-iyun, chorshanba",
  isBozorDay: true,              // chor / juma / yakshanba
};

const WEEKDAYS = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];

/* ===== Kunlik badge tizimi =====
   Bozor kunlari: chorshanba(3), juma(5), yakshanba(0).
   Buyurtma bugun 21:00 gacha, yetkazish ertaga — shuning uchun banner
   ERTANGI yetkazish kunini hisobga oladi. Prioritet: eve > bozor > theme. */
const BOZOR_WEEKDAYS = [0, 3, 5];

// Kun mavzulari (TODAY indeksi bo'yicha) — bozor/eve bo'lmagan kunlar uchun
const DAY_THEMES = {
  1: { emoji: "🌾", title: "Hafta zaxirasi kuni", text: "un, guruch, yog‘ — har kuni bir xil narxda" }, // Dushanba
  6: { emoji: "🍇", title: "Mehmon kuni",         text: "dam olishga mehmon dasturxonini tayyorlang" }, // Shanba
  2: { emoji: "🥬", title: "Yangi hosil kuni",    text: "bozordan yangi sabzavotlar keladi" },          // Seshanba
  4: { emoji: "🍅", title: "Konserva kuni",       text: "qishki tayyorgarlik — pomidor, qalampir arzon" }, // Payshanba
};

function daysToBozor(todayIdx) {
  for (let d = 0; d <= 7; d++) {
    if (BOZOR_WEEKDAYS.includes((todayIdx + d) % 7)) return d;
  }
  return null;
}

// Bosh sahifa banner holatini aniqlash
function deliveryInfo(todayIdx) {
  const tomorrow = (todayIdx + 1) % 7;
  if (BOZOR_WEEKDAYS.includes(tomorrow)) return { kind: "eve" };       // A — ertaga bozor kuni
  if (BOZOR_WEEKDAYS.includes(todayIdx)) return { kind: "bozor" };    // B — bugun bozor narxi
  return { kind: "theme", theme: DAY_THEMES[todayIdx] || DAY_THEMES[tomorrow] }; // C
}

// Kunning mahsuloti ⭐
const FEATURED = { id: "pomidor", note: "Bugun Samarqand pomidori zo‘r keldi" };

// Yetkazish vaqti slotlari (ertaga uchun)
const SLOTS = [
  { id: "s1", t: "09:00–11:00", sub: "Erta — tinch vaqt" },
  { id: "s2", t: "11:00–13:00", sub: "Tushlikkacha", popular: true },
  { id: "s3", t: "13:00–16:00", full: true },
  { id: "s4", t: "16:00–19:00", sub: "Ish kunidan keyin" },
];

const CATEGORIES = [
  { id: "sabzavot", name: "Sabzavot", emoji: "🥬" },
  { id: "meva",     name: "Meva",     emoji: "🍎" },
  { id: "gosht",    name: "Go‘sht",   emoji: "🥩", video: true },
  { id: "sut",      name: "Sut mahsulotlari", emoji: "🥛" },
  { id: "non",      name: "Non",      emoji: "🫓" },
  { id: "quruq",    name: "Quruq mahsulotlar", emoji: "🍚" },
];

// narx — so'm/kg yoki dona. trend: bugun narx kechagiga nisbatan.
const PRODUCTS = [
  // Sabzavot
  { id: "pomidor",  cat: "sabzavot", name: "Pomidor",   emoji: "🍅", price: 12000, unit: "kg", trend: "down", old: 14000, bozor: true },
  { id: "kartoshka",cat: "sabzavot", name: "Kartoshka", emoji: "🥔", price: 6500,  unit: "kg", trend: "down", old: 7000 },
  { id: "piyoz",    cat: "sabzavot", name: "Piyoz",     emoji: "🧅", price: 5000,  unit: "kg", trend: null,  bozor: true },
  { id: "sabzi",    cat: "sabzavot", name: "Sabzi",     emoji: "🥕", price: 7000,  unit: "kg", trend: "up",   old: 6500 },
  { id: "bodring",  cat: "sabzavot", name: "Bodring",   emoji: "🥒", price: 13000, unit: "kg", trend: "down", old: 16000, bozor: true, fresh: true },
  { id: "karam",    cat: "sabzavot", name: "Karam",     emoji: "🥬", price: 5500,  unit: "kg", trend: null },
  { id: "kokat",    cat: "sabzavot", name: "Ko‘katlar", emoji: "🌿", price: 4000,  unit: "bog‘", fresh: true },

  // Meva
  { id: "olma",     cat: "meva", name: "Olma",   emoji: "🍎", price: 18000, unit: "kg", trend: "down", old: 20000 },
  { id: "uzum",     cat: "meva", name: "Uzum",   emoji: "🍇", price: 24000, unit: "kg", trend: null, bozor: true },
  { id: "banan",    cat: "meva", name: "Banan",  emoji: "🍌", price: 21000, unit: "kg", trend: null },
  { id: "nok",      cat: "meva", name: "Nok",    emoji: "🍐", price: 19000, unit: "kg", trend: "up", old: 17000 },

  // Go'sht — video orqali tanlash
  { id: "mol",      cat: "gosht", name: "Mol go‘shti",  emoji: "🥩", price: 95000,  unit: "kg", video: true, bozor: true },
  { id: "qoy",      cat: "gosht", name: "Qo‘y go‘shti", emoji: "🍖", price: 110000, unit: "kg", video: true },
  { id: "tovuq",    cat: "gosht", name: "Tovuq",        emoji: "🍗", price: 38000,  unit: "kg", video: true },

  // Sut mahsulotlari
  { id: "sut",      cat: "sut", name: "Sut, 1 l",       emoji: "🥛", price: 12000, unit: "dona", trend: null },
  { id: "tuxum",    cat: "sut", name: "Tuxum, 10 ta",   emoji: "🥚", price: 18000, unit: "dona", trend: "down", old: 19000 },
  { id: "qaymoq",   cat: "sut", name: "Qaymoq",         emoji: "🧈", price: 28000, unit: "kg", trend: null },

  // Non
  { id: "non",      cat: "non", name: "Patir non",      emoji: "🫓", price: 4000, unit: "dona", trend: null },
  { id: "bulochka", cat: "non", name: "Bulochka",       emoji: "🥖", price: 3500, unit: "dona", trend: null },

  // Quruq mahsulotlar
  { id: "guruch",   cat: "quruq", name: "Guruch (lazer)", emoji: "🍚", price: 18000, unit: "kg", stable: true },
  { id: "un",       cat: "quruq", name: "Un, oliy nav",   emoji: "🌾", price: 7500,  unit: "kg", stable: true },
  { id: "makaron",  cat: "quruq", name: "Makaron",        emoji: "🍝", price: 9000,  unit: "kg", stable: true },
  { id: "yog",      cat: "quruq", name: "Paxta yog‘i, 1 l", emoji: "🫗", price: 22000, unit: "dona", stable: true },
];

// narxni so'mda formatlash: 12000 -> "12 000"
function sum(n) {
  return n.toLocaleString("ru-RU").replace(/\u00A0/g, " ");
}

const MIN_ORDER = 50000;
const DELIVERY_FEE = 6000;
const FREE_DELIVERY_FROM = 100000;

Object.assign(window, {
  TODAY, WEEKDAYS, CATEGORIES, PRODUCTS, sum, MIN_ORDER, DELIVERY_FEE, FREE_DELIVERY_FROM,
  BOZOR_WEEKDAYS, DAY_THEMES, deliveryInfo, daysToBozor, FEATURED, SLOTS,
});
