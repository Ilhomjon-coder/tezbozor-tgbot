// Bot-side user-facing strings — Uzbek (Latin), warm "siz" tone, 1–2 emoji max
// (root CLAUDE.md). Mini App strings live separately in shared/src/texts.ts.
export const botTexts = {
  start: {
    greeting:
      'Assalomu alaykum! Tezbozorga xush kelibsiz 🛒\n\n' +
      'Bozorga bormasdan, eng yangi mahsulotlarni eshigingizgacha yetkazib beramiz. ' +
      'Buyurtma berish uchun ilovani oching.',
    button: 'Tezbozorni ochish 🛒',
    // Shown when the Mini App URL is not configured yet (local dev without a tunnel).
    noAppConfigured:
      'Ilova hozircha sozlanmagan. Tez orada ishga tushiramiz — biroz kuting 🙏',
  },
} as const;
