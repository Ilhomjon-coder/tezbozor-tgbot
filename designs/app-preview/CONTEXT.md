# Tezbozor — Mini App konteksti va ekran routingi

> Kattaqo'rg'on (O'zbekiston, ~80 000 aholi) uchun kundalik oziq-ovqat yetkazib berish Telegram Mini App'i. Ushbu hujjat butun ilovaning konteksti, ekranlari va o'tish (routing) mantig'ini tushuntiradi.

---

## 1. Mahsulot konteksti

**Model:** "Avtobus" (rejali) yetkazish — 10 daqiqalik emas.
- Mijoz **bugun 21:00 gacha** buyurtma beradi → **ertaga** o'zi tanlagan vaqt oralig'ida yetkaziladi.
- Brenddagi "tez" = **bozor qilish tezligi** (2–3 soat o'rniga 2 daqiqa), yetkazish tezligi emas.

**Asosiy qoidalar:**
| Qoida | Qiymat |
|---|---|
| Minimal buyurtma | 50 000 so'm |
| Yetkazish | 6 000 so'm |
| Bepul yetkazish | 100 000 so'mdan oshsa |
| To'lov | Click, Payme, Naqd (yetkazganda) |
| Narx | Har kuni ertalab yangilanadi ("bugungi narx") |
| Bozor kunlari | Chorshanba, Juma, Yakshanba — narxlar arzon |

**Ikki kuchli ishonch elementi:**
1. **"B variant" protokoli** — savatdagi har mahsulot uchun "topilmasa nima qilamiz": (a) o'xshashi bilan almashtirish, (b) o'tkazib yuborish (pul qaytadi), (c) qo'ng'iroq qilish.
2. **Go'sht video tasdig'i** — bozordan 2–3 variant video yuboriladi, mijoz tanlagandan keyingina sotib olinadi.

**Auditoriya:** uy bekalari va oilalar, 25–55 yosh. Texnik savodxonlik har xil → katta tugmalar (≥48px), katta matn, kam yozish, bir ekran = bitta vazifa. Til: o'zbek (lotin), ohang: iliq, "siz"lab, sodda.

---

## 2. Brend / dizayn tizimi

Bog'langan **Tezbozor Design System** tokenlariga asoslanadi (`_ds/.../tokens/*.css`).

**Ranglar (60-30-10):**
- 60% iliq oq fon `#FAF7F2`, oq kartochka `#FFFFFF`
- 30% yashil — brend `#1FA055`, to'q `#157A40`, och `#E6F4EC`
- 10% apelsin — `#FF7A00` (faqat asosiy CTA va aksiya), och `#FFF1E0`
- Matn `#1E2A32`. **Ko'k rang butunlay taqiqlangan** (Click/Payme bilan adashmaslik uchun).

**Tipografika:** sarlavha — Montserrat (700/800), matn/interfeys — Inter (400–600).

**Uslub:** yumaloq burchak (12–16px), yumshoq soya, havodor. Telegram Mini App: 390px mobil viewport, bitta ustun, pastda yopishqoq asosiy tugma (apelsin).

**DS komponentlari** (`ds.jsx` da, `window.TezbozorDesignSystem_77795a`): `Button`, `Card`, `Badge`, `IconButton`, `Avatar`.

---

## 3. Fayl strukturasi

```
TezBozor/
├── index.html            # kirish — tokenlar + barcha skriptlarni yuklaydi
├── app.css               # barcha ekran stillari (tokenlar ustiga)
├── data.jsx              # ma'lumotlar: mahsulot, kategoriya, kun mantiqi, slotlar
├── ds.jsx                # DS komponentlari (Button/Card/Badge/IconButton/Avatar)
├── components.jsx        # umumiy: Mark, Badge, ProductCard, Stepper, kun belgilari
├── designsystem.jsx      # mini dizayn tizimi reference (sahifa tepasidagi hujjat)
├── home.jsx              # Bosh sahifa (3 kunlik holat)
├── cart.jsx              # Savat + B-variant + bo'sh holat
├── checkout.jsx          # Rasmiylashtirish + To'lov kutilmoqda + Muvaffaqiyat
├── status.jsx            # Buyurtma holati (timeline + go'sht video tasdig'i)
├── profile.jsx           # Profil hub + barcha alohida oynalar
└── app.jsx               # kompozitsiya: hujjat + telefon ramkalarini joylashtiradi
```

> **Eslatma:** `index.html` — bu bitta **review/namoyish hujjati**. Barcha ekranlar telefon ramkalarida yonma-yon ko'rsatiladi (haqiqiy ilovada har biri alohida route bo'lardi). Interaktiv oqimlar (savat, rasmiylashtirish→to'lov→muvaffaqiyat, profil hub) har bir telefon ichida ishlaydi.

---

## 4. Ekranlar va routing

### Yuqori darajadagi navigatsiya (foydalanuvchi yo'li)

```
BOSH SAHIFA ──(savat tugmasi)──▶ SAVAT ──(Rasmiylashtirish)──▶ RASMIYLASHTIRISH
     │                                                              │
     │ (header "DK" avatar)                          ┌──────────────┴──────────────┐
     ▼                                               ▼ Click/Payme                  ▼ Naqd
  PROFIL (hub)                              TO'LOV KUTILMOQDA ──▶ MUVAFFAQIYAT ◀─────┘
     │                                                                   │
     ├─▶ Buyurtmalar tarixi ─▶ Buyurtma tafsiloti ─┐                     │
     ├─▶ Manzillarim ─▶ Yangi manzil (xarita)       ├──▶ BUYURTMA HOLATI ◀┘
     ├─▶ Doimiy ro'yxatim                           │   (timeline + go'sht video)
     ├─▶ Shaxsiy ma'lumotlar                        │
     └─▶ (Joriy buyurtma) ──────────────────────────┘
```

### 4.1 Bosh sahifa — `home.jsx` → `HomeScreen`
Kirish: ilova ochilishi. **Profilga kirish:** header'ning o'ng yuqorisidagi **"DK" avatar** tugmasi.

Tarkibi: salomlashish + sana, kunlik banner (pastga qarang), deadline banneri ("21:00 gacha…"), bozor narxigacha countdown, qidiruv, kategoriyalar (gorizontal), "Kunning mahsuloti ⭐", "Bugungi narxlar" grid, pastda yopishqoq **savat tugmasi** (soni + summa).

**Kunlik badge tizimi** (banner ERTANGI yetkazish kunini aks ettiradi, prioritet: arafa > bozor > mavzu):

| Holat | Sharti | Ko'rinishi |
|---|---|---|
| **A — Arafa** | Ertaga bozor kuni (today = Sesh/Pay/Shan) | Apelsin teaser "Ertaga — bozor kuni!" + "Bozor narxigacha 1 kun qoldi" |
| **B — Bozor kuni** | Bugun bozor kuni (Chor/Juma/Yaksh) | Yashil "🥬 Bugun bozor kuni" badge |
| **C — Mavzu** | Oddiy kun (masalan Dushanba) | Yashil mavzu banneri (masalan "Hafta zaxirasi kuni") + countdown |

Mahsulot darajasidagi belgilar: `🌿 Yangi keldi`, `🔒 Barqaror narx` (quruq mahsulotlar), `↓ arzonladi`, `🥬` (bozor kuni mahsuloti), `🎥 Video orqali tanlaysiz` (go'sht).

### 4.2 Savat — `cart.jsx` → `CartScreen`
Kirish: Bosh sahifadagi savat tugmasi.
- Mahsulotlar ro'yxati + miqdor stepper (− / +)
- Har mahsulot ostida **"Topilmasa nima qilamiz?"** — 3 chip (almashtirish / o'tkazib yuborish / qo'ng'iroq)
- "Hammasini tozalash" tugmasi → bo'sh savat holati
- Pastki **bejirim dock**: bepul yetkazishgacha progress (yoki "Bepul yetkazish" chipi yoki minimal-buyurtma ogohlantirishi) + "Rasmiylashtirish — N so'm"
- **Bo'sh holat:** savat illyustratsiyasi + "Xaridni boshlash"

### 4.3 Rasmiylashtirish — `checkout.jsx` → `CheckoutScreen`
Kirish: Savatdan. Beshta blok:
1. **Manzil** — saqlangan manzil kartochkasi + "O'zgartirish" → saqlangan manzillar ro'yxati (tanlash) yoki "＋ Yangi manzil qo'shish" (mahalla / uy / mo'ljal formasi)
2. **Yetkazish vaqti** — slot picker: "Ertaga, 7-iyun" + 4 ta vaqt kartochkasi. Holatlar: mavjud / tanlangan (✓) / "To'ldi" (o'chiq). Belgi: "🔥 Eng ko'p tanlangan"
3. **To'lov** — Click / Payme / Naqd radiokartochkalar (logotip joylari, ko'k yo'q)
4. **Kuryerga izoh** (ixtiyoriy)
5. **Buyurtma xulosasi** — mahsulotlar, yetkazish, tanlangan vaqt, jami
Pastda: **"Buyurtmani tasdiqlash — N so'm"** (minimal summa to'lmasa o'chiq)

**Branch:** Click/Payme → To'lov kutilmoqda; Naqd → to'g'ridan-to'g'ri Muvaffaqiyat.

### 4.4 To'lov kutilmoqda — `checkout.jsx` → `PaymentPendingScreen`
Kirish: Rasmiylashtirishda Click/Payme tanlanganda.
- Brend belgisi (placeholder), yashil spinner, summa, "To'lov kutilmoqda… {brend} ilovasida tasdiqlang", "🔒 Bu oynani yopmang"
- To'lov o'tgach (demo: avtomatik ~3s yoki "Demo: tasdiqlash") → Muvaffaqiyat. "Bekor qilish" → Rasmiylashtirishga qaytadi.

### 4.5 Muvaffaqiyat — `checkout.jsx` → `SuccessScreen`
Kirish: to'lovdan keyin (yoki naqd tasdiqdan keyin).
- Tepada tanlangan vaqt: "🚚 Ertaga 11:00–13:00 da yetkazamiz"
- Katta yashil ✓, "Rahmat! 🛒", yetkazish xabari, **buyurtma raqami** (TB-…)
- "Bosh sahifaga qaytish"

### 4.6 Buyurtma holati — `status.jsx` → `OrderStatusScreen`
Kirish: Muvaffaqiyat ekranidan, Profil hub "Joriy buyurtma"dan, yoki Buyurtma tafsilotidagi "Holat →" dan.
- Tanlangan vaqt strip
- **Vertikal timeline (4 bosqich):** Qabul qilindi ✓ → **Bozorda xarid qilinmoqda** (yashil pulsatsiya) → Yo'lda → Yetkazildi
- "Bozorda xarid" bosqichi ostida **GO'SHT VIDEO TASDIG'I** (hero blok): 3 video preview kartochka + "Tanlash" → tanlangach "shu go'shtni sotib olamiz" tasdig'i
- Pastda: kuryer (Akmal aka) bilan **Qo'ng'iroq / Telegram**

### 4.7 Profil — `profile.jsx` → `ProfileScreen` (hub + spoke routing)
Kirish: Bosh sahifa header'idagi "DK" avatar.
Ichki `view` holati bilan routing (orqaga tugmasi hub'ga qaytaradi):

```
hub ─┬─▶ orders ──▶ orderdetail ──▶ (Holat → status)
     ├─▶ addresses ──▶ addaddr (xarita + forma)
     ├─▶ weekly
     ├─▶ personal
     └─▶ (Joriy buyurtma → status)
```

| View | Tarkibi |
|---|---|
| **hub** | Foydalanuvchi kartochkasi (avatar, ism, telefon, "Tahrirlash"), "Joriy buyurtma" banneri, menyu satrlari (Buyurtmalar / Manzillarim / Doimiy ro'yxatim / Shaxsiy ma'lumotlar / Yordam), "Chiqish" |
| **orders** | Joriy buyurtma (apelsin "Bozorda xarid") + o'tgan buyurtmalar; har kartochkada "Qayta buyurtma" (retention) |
| **orderdetail** | Holat bloki (+ joriy bo'lsa "Holat →"), Yetkazish (manzil/vaqt/to'lov), Mahsulotlar + hisob, baho (5 ⭐) / izoh, pastda "Qayta buyurtma berish" |
| **addresses** | Saqlangan manzillar (Tahrirlash / O'chirish) + "＋ Yangi manzil qo'shish" |
| **addaddr** | **Xaritadan joylashuv** (pin + 🎯), nom segmenti (Uy/Ish/Boshqa), mahalla, uy, mo'ljal → saqlash |
| **weekly** | Doimiy ro'yxat (toggle) + apelsin "Hammasini savatga qo'shish" |
| **personal** | Avatar, ism, telefon → saqlash |

---

## 5. Holat (state) va ma'lumot oqimi

- **Savat:** har telefonda lokal `useState` (namoyish). Haqiqiy ilovada global store bo'lardi.
- **Rasmiylashtirish oqimi** (`CheckoutFlow`): `view` = checkout → pending → success; tanlangan slot vaqti success/holat ekraniga uzatiladi.
- **Profil** (`ProfileScreen`): `view` (hub/orders/orderdetail/…), `addresses` ro'yxati (qo'shish/o'chirish), tanlangan buyurtma, toast.
- **Kun mantiqi** (`data.jsx`): `deliveryInfo(todayIdx)` → `{kind: eve|bozor|theme}`, `daysToBozor(todayIdx)`.
- **Narxlar** `data.jsx` `PRODUCTS` da; `sum(n)` — so'mda formatlash ("12 000").

---

## 6. Asosiy konstantalar (`data.jsx`)

| Nom | Qiymat |
|---|---|
| `MIN_ORDER` | 50 000 |
| `DELIVERY_FEE` | 6 000 |
| `FREE_DELIVERY_FROM` | 100 000 |
| `BOZOR_WEEKDAYS` | `[0, 3, 5]` (Yak, Chor, Juma) |
| `SLOTS` | 09:00–11:00 / 11:00–13:00 (popular) / 13:00–16:00 (to'ldi) / 16:00–19:00 |
| `CATEGORIES` | Sabzavot, Meva, Go'sht (video), Sut, Non, Quruq |

---

## 7. Hali qurilmagan (kelajak uchun g'oyalar)
- Qidiruv natijalari ekrani
- Go'sht video tanlovini alohida to'liq ekran
- Onboarding / ro'yxatdan o'tish
- Push/Telegram bildirishnomalar mantig'i
- Global savat store (ekranlar orasida saqlash)
