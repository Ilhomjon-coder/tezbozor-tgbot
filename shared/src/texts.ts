// All user-facing Mini App strings — Uzbek (Latin), warm "siz" tone, 1–2 emoji
// max (root CLAUDE.md). Bot strings live separately in bot/texts.ts.
// Never inline user-facing strings elsewhere.
export const texts = {
  appName: 'Tezbozor',
  home: {
    greeting: 'Assalomu alaykum!',
    tagline: 'Bozorga bormasdan — eshigingizgacha 🚪',
    placeholder:
      'Ilova tez orada to‘ladi. Bu yerda har kuni yangilanadigan bozor narxlari paydo bo‘ladi.',
  },
  common: {
    loading: 'Yuklanmoqda…',
    retry: 'Qayta urinish',
    offline: 'Internet uzildi. Qayta urinish',
  },
} as const;

export type Texts = typeof texts;
