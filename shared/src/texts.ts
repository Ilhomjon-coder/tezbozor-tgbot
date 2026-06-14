import { formatSom } from './money';
import type {
  OrderStatus,
  PaymentMethod,
  Fallback,
  ProductBadge,
  Unit,
} from './enums';

// All user-facing Mini App strings — Uzbek (Latin), warm "siz" tone, 1–2 emoji
// max (root CLAUDE.md). Bot strings live separately in bot/texts.ts. Never inline
// user-facing strings in components — add them here.

export const texts = {
  appName: 'Tezbozor',
  tagline: "Bozorga bormasdan — eshigingizgacha 🚪",

  splash: {
    tagline: 'Bozoringiz — cho‘ntagingizda',
    city: 'Kattaqo‘rg‘on · mini bozor',
  },

  common: {
    loading: 'Yuklanmoqda…',
    retry: 'Qayta urinish',
    offline: 'Internet uzildi. Qayta urinish',
    errorTitle: 'Nimadir xato ketdi',
    errorBody: 'Iltimos, biroz kuting va qayta urinib ko‘ring.',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    add: "Qo'shish",
    edit: 'Tahrirlash',
    delete: "O'chirish",
    change: "O'zgartirish",
    back: 'Orqaga',
    yes: 'Ha',
    no: "Yo'q",
    optional: 'ixtiyoriy',
    perUnit: (unit: Unit) => (unit === 'kg' ? "so'm/kg" : "so'm/dona"),
    priceLine: (priceUzs: number, unit: Unit) =>
      `${formatSom(priceUzs).replace(" so'm", '')} ${unit === 'kg' ? "so'm/kg" : "so'm/dona"}`,
  },

  nav: {
    home: 'Asosiy',
    catalog: 'Katalog',
    orders: 'Buyurtmalar',
    profile: 'Profil',
  },

  onboarding: {
    welcomeTitle: 'Assalomu alaykum! 👋',
    welcomeBody:
      "Tezbozor'ga xush kelibsiz — Kattaqo'rg'on uchun kundalik bozor. Boshlash uchun bir necha ma'lumot kiritamiz.",
    step1Title: "O'zingiz haqingizda",
    nameLabel: 'Ism familiya',
    namePlaceholder: 'Masalan: Dilnoza Karimova',
    phoneLabel: 'Telefon raqami',
    phonePlaceholder: '+998 90 123 45 67',
    phoneShare: 'Telegram raqamini ulashish 📲',
    phoneSharing: 'Olinmoqda…',
    phoneShared: 'Raqam olindi ✓',
    phoneManual: 'Raqamni qo‘lda kiritish',
    phoneShareToggle: 'Telegram orqali ulashish 📲',
    phoneShareFailed: 'Raqam olinmadi — qo‘lda kiriting',
    contactHint: 'Telegram raqamingizni ulashing — yoki qo‘lda yozing.',
    step2Title: 'Yetkazish manzili',
    mahallaLabel: 'Mahalla',
    mahallaPlaceholder: 'Mahallani tanlang',
    houseLabel: 'Uy / xonadon raqami',
    housePlaceholder: 'Masalan: 14-uy, 3-xonadon',
    landmarkLabel: "Mo'ljal",
    landmarkPlaceholder: 'Masalan: maktab yonida, ko‘k darvoza',
    next: 'Keyingi',
    start: 'Boshlash',
    finishCta: 'Boshlash 🛒',
    saving: 'Saqlanmoqda…',
  },

  home: {
    greeting: 'Assalomu alaykum! 👋',
    deadlineOpenTitle: 'Bugun 21:00 gacha buyurtma bering',
    deadlineOpenSub: (relDay: string) => `${relDay} o‘zingiz tanlagan vaqtda yetkazamiz 🚪`,
    countdownLabel: (h: number, m: number) => `Qoldi ${h} soat ${m} daqiqa`,
    deadlineClosedTitle: 'Bugungi qabul yopildi 🌙',
    deadlineClosedSub: (relDay: string) => `${relDay}gi yetkazish uchun qabul ochiq`,
    searchPlaceholder: 'Mahsulot qidirish — masalan, pomidor',
    productOfDay: 'Kunning mahsuloti ⭐',
    todaysPricesTitle: 'Bugungi narxlar',
    pricesUpdated: 'Narxlar bugun ertalab yangilandi',
    activeOrder: (statusLabel: string) => `Joriy buyurtma · ${statusLabel}`,
    activeOrderView: "Ko'rish →",
    allCategories: 'Barcha kategoriyalar',
    empty: 'Hozircha mahsulot yo‘q. Tez orada to‘ladi.',
  },

  catalog: {
    title: 'Katalog',
    subtitle: 'Kategoriyani tanlang',
    productsCount: (n: number) => `${n} ta mahsulot`,
  },

  category: {
    sortCheapest: 'Arzon avval',
    empty: 'Bu kategoriyada hozircha mahsulot yo‘q.',
  },

  product: {
    priceNote: 'Narx har kuni yangilanadi',
    qtyLabel: 'Miqdori',
    noteLabel: 'Izoh',
    notePlaceholder: 'Masalan: maydalab bering',
    addToCart: "Savatga qo'shish",
    inCart: 'Savatda',
    addCtaWithSum: (sum: string) => `Savatga qo'shish — ${sum}`,
    notFound: 'Mahsulot topilmadi.',
  },

  search: {
    title: 'Qidiruv',
    placeholder: 'Mahsulot qidirish — masalan, pomidor',
    resultsFor: (q: string) => `“${q}” bo‘yicha natija`,
    resultCount: (n: number) => `${n} ta mahsulot topildi`,
    emptyTitle: 'Topilmadi',
    emptyBody: "Yozib qoldiring — bozordan qarab kelamiz 🛒",
    wishPlaceholder: 'Qaysi mahsulotni qidirdingiz?',
    wishSend: 'Yuborish',
    wishSent: 'Rahmat! Yozib oldik 🌿',
    hint: 'Mahsulot nomini yozing',
  },

  cart: {
    title: 'Savat',
    itemsCount: (n: number) => `${n} ta mahsulot`,
    clear: 'Tozalash',
    fallbackQuestion: 'Topilmasa nima qilamiz?',
    summaryTitle: 'Hisob-kitob',
    itemsRow: (n: number) => `Mahsulotlar (${n} ta)`,
    deliveryRow: 'Yetkazish',
    deliveryFree: 'Bepul ✓',
    totalRow: 'Jami to‘lov',
    freeProgress: (remaining: string) => `Yana ${remaining} — bepul yetkazish`,
    freeReached: 'Tabriklaymiz — yetkazish bepul! 🎉',
    minHint: (remaining: string) => `Minimal buyurtma ${formatSom(50000)}. Yana ${remaining}`,
    checkoutCta: (sum: string) => `Rasmiylashtirish — ${sum}`,
    stickyButton: (count: number, sum: string) => `Savat · ${count} ta · ${sum}`,
    emptyTitle: 'Savatingiz bo‘sh',
    emptyBody: 'Bugungi narxlardan tanlang — eshigingizgacha yetkazamiz 🛒',
    emptyCta: 'Xaridni boshlash',
    priceDrift: (oldP: string, newP: string) => `Narx yangilandi: ${oldP} → ${newP}`,
  },

  checkout: {
    title: 'Rasmiylashtirish',
    addressSection: 'Yetkazish manzili',
    pickAddress: 'Saqlangan manzillardan birini tanlang',
    addAddress: '+ Yangi manzil qo‘shish',
    defaultTag: 'Asosiy',
    noAddress: 'Manzil qo‘shing',
    slotSection: 'Yetkazish vaqti',
    slotDate: (relDay: string, date: string) => `${relDay}, ${date}`,
    slotPickHint: 'Qulay vaqtni tanlang',
    slotFull: "To'ldi",
    slotMostChosen: 'Eng ko‘p tanlangan 🔥',
    paymentSection: 'To‘lov usuli',
    paymentSoon: 'Tez orada',
    noteSection: 'Kuryerga izoh',
    notePlaceholder: 'Masalan: domofon ishlamaydi, qo‘ng‘iroq qiling',
    summarySection: 'Buyurtma xulosasi',
    slotRow: 'Yetkazish vaqti',
    confirmCta: 'Buyurtmani tasdiqlash',
    confirmCtaWithSum: (sum: string) => `Buyurtmani tasdiqlash — ${sum}`,
    placing: 'Yuborilmoqda…',
    needAddress: 'Avval manzilni tanlang',
    needSlot: 'Avval vaqtni tanlang',
  },

  success: {
    headerLine: (relDay: string, slot: string) => `🚚 ${relDay} ${slot} da yetkazamiz`,
    title: 'Rahmat! 🛒',
    body: (relDay: string, slot: string) =>
      `Buyurtmangizni qabul qildik. ${relDay} ${slot} da eshigingizda bo‘ladi.`,
    orderNoLabel: 'BUYURTMA RAQAMI',
    orderNo: (id: number | string) => `№ ${id}`,
    viewStatus: 'Buyurtma holatini ko‘rish',
    toHome: 'Bosh sahifaga',
  },

  status: {
    title: 'Buyurtma holati',
    header: (relDay: string, slot: string) => `${relDay} ${slot} da yetkazamiz`,
    nowStep: 'Hozir shu bosqichda',
    cancelled: 'Buyurtma bekor qilindi',
    contactTitle: 'Savol bo‘lsa',
    guarantee: 'Muammo bormi? So‘zsiz qaytarib beramiz.',
    rateTitle: 'Buyurtmani baholang',
    rateCommentPlaceholder: 'Izoh yozing — ixtiyoriy',
    rateSubmit: 'Yuborish',
    rateThanks: 'Bahoyingiz uchun rahmat! ⭐',
    reorderCta: 'Qayta buyurtma berish',
  },

  orders: {
    title: 'Buyurtmalar',
    activePinned: 'Joriy buyurtma',
    history: 'Tarix',
    reorder: 'Qayta buyurtma berish',
    viewStatus: 'Holatni ko‘rish →',
    totalLabel: 'Jami',
    emptyTitle: 'Hali buyurtma yo‘q',
    emptyBody: 'Birinchi buyurtmangizni bering — bugungi narxlardan tanlang.',
    emptyCta: 'Xaridni boshlash',
    reorderUnavailable: (names: string) => `Ba'zi mahsulotlar bugun yo‘q: ${names}`,
    reorderDrift: 'Ba\'zi narxlar yangilangan — savatda ko‘rsatdik.',
    reorderEmpty: 'Bu buyurtmadagi mahsulotlar bugun mavjud emas.',
  },

  profile: {
    title: 'Profil',
    editProfile: 'Tahrirlash',
    ordersHistory: 'Buyurtmalar tarixi',
    ordersHistorySub: 'O‘tgan buyurtmalar va qayta buyurtma',
    addresses: 'Manzillarim',
    addressesSub: 'Yetkazish manzillarini boshqaring',
    favorites: 'Doimiy ro‘yxatim',
    favoritesSub: 'Har hafta oladigan mahsulotlar',
    about: 'Biz haqimizda',
    aboutSub: 'Kafolat va aloqa',
    aboutText:
      "Tezbozor — Kattaqo'rg'on uchun kundalik bozor. Mahsulot topilmasa yoki yoqmasa — so‘zsiz qaytarib beramiz. Savol bo‘lsa, biz bilan bog‘laning.",
    nameLabel: 'Ism familiya',
    phoneLabel: 'Telefon raqami',
    version: 'Tezbozor · Kattaqo‘rg‘on',
    saved: 'Saqlandi ✓',
  },

  addresses: {
    title: 'Manzillarim',
    addNew: '+ Yangi manzil qo‘shish',
    addTitle: 'Yangi manzil',
    editTitle: 'Manzilni tahrirlash',
    mahallaLabel: 'Mahalla',
    mahallaPlaceholder: 'Mahallani tanlang',
    houseLabel: 'Uy / xonadon raqami',
    housePlaceholder: 'Masalan: 14-uy, 3-xonadon',
    landmarkLabel: 'Mo‘ljal',
    landmarkPlaceholder: 'Masalan: maktab yonida, ko‘k darvoza',
    makeDefault: 'Asosiy manzil sifatida belgilash',
    defaultTag: 'Asosiy',
    deleteConfirm: 'Bu manzilni o‘chirilsinmi?',
    emptyTitle: 'Manzil yo‘q',
    emptyBody: 'Yetkazish uchun birinchi manzilingizni qo‘shing.',
    landmarkPrefix: 'Mo‘ljal: ',
  },

  favorites: {
    title: 'Doimiy ro‘yxatim',
    intro: 'Har hafta oladigan mahsulotlar. Bir bosishda savatga qo‘shing.',
    addAllCta: (n: number) => `Hammasini savatga qo‘shish (${n} ta)`,
    added: 'Savatga qo‘shildi ✓',
    emptyTitle: 'Ro‘yxat bo‘sh',
    emptyBody:
      'Tez-tez oladigan mahsulotlaringizni shu yerga saqlang — keyingi safar bir bosishda savatga qo‘shasiz.',
    emptyCta: 'Mahsulotlarni ko‘rish',
    remove: 'O‘chirish',
    unavailableToday: 'Bugun mavjud emas',
  },

  // Banner text per PRD §7 — keyed to the DELIVERY day. Colour lives in the
  // component (Banner.tsx) keyed by the same key.
  banner: {
    market_day: 'Ertaga bozor kuni — bugun buyurtma bering, arzon olasiz! 🥬',
    bozor_narxida: 'Bozor narxida yetkazamiz 🥬',
    hafta_zaxirasi: "Hafta zaxirasi kuni 🌾 — un, guruch, yog' har kuni bir xil narxda",
    fallback: 'Bozorga bormasdan — eshigingizgacha 🚪',
    promoBozor: 'Bozor kuni — bugun buyurtma bersangiz arzon olasiz! 🥬',
  },

  labels: {
    status: {
      accepted: 'Qabul qilindi',
      shopping: 'Bozorda xarid',
      on_the_way: "Yo'lda",
      delivered: 'Yetkazildi',
      cancelled: 'Bekor qilindi',
    } satisfies Record<OrderStatus, string>,
    statusSub: {
      accepted: 'Buyurtmangizni qabul qildik',
      shopping: 'Bozordan xarid qilyapmiz',
      on_the_way: 'Kuryer yo‘lda',
      delivered: 'Eshigingizga yetkazdik',
      cancelled: 'Buyurtma bekor qilindi',
    } satisfies Record<OrderStatus, string>,
    fallback: {
      substitute: 'O‘xshashi bilan',
      skip: 'O‘tkazib yuboring',
      call: 'Qo‘ng‘iroq qiling',
    } satisfies Record<Fallback, string>,
    fallbackIcon: {
      substitute: '🔄',
      skip: '⏭️',
      call: '📞',
    } satisfies Record<Fallback, string>,
    payment: {
      cash: 'Naqd pul',
      click: 'Click',
      payme: 'Payme',
    } satisfies Record<PaymentMethod, string>,
    paymentSub: {
      cash: 'Yetkazganda to‘laysiz',
      click: 'Tez orada',
      payme: 'Tez orada',
    } satisfies Record<PaymentMethod, string>,
    badge: {
      yangi_keldi: 'Yangi keldi 🌿',
      narxi_barqaror: 'Narxi barqaror 🔒',
    } satisfies Record<ProductBadge, string>,
  },

  // Relative-day words (Asia/Tashkent): delivery is tomorrow before 21:00,
  // day-after-tomorrow once the deadline passes.
  relDay: {
    tomorrow: 'Ertaga',
    dayAfter: 'Indinga',
    today: 'Bugun',
  },

  weekdays: ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'],
  months: [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
  ],
} as const;

export type Texts = typeof texts;
