// Fixed mahalla (neighbourhood) list for Kattaqo'rg'on — the address selector at
// onboarding and on the address form picks from this list (PRD §6, root
// CLAUDE.md: address = mahalla + house + landmark, no geocoding).
//
// ⚠️ PLACEHOLDER LIST — the final mahalla list is an open question in PRD §13
// ("final mahalla list" — resolve before launch). Update this single array when
// the real list is confirmed; nothing else needs to change.
export const MAHALLAS: readonly string[] = [
  'Mustaqillik MFY',
  "Do'stlik MFY",
  'Navbahor MFY',
  'Bunyodkor MFY',
  'Guliston MFY',
  "Yangiobod MFY",
  'Birlik MFY',
  'Obod MFY',
  "Bog'bon MFY",
  'Chashma MFY',
  'Sharq MFY',
  'Markaz MFY',
];
