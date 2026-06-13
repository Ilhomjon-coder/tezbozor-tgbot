# CLAUDE.md — tgbot (customer surface)

Two deployables in one repo: the **bot** (grammY) and the **mini app** (Vite + React). Read root `../CLAUDE.md`, `../docs/PRD.md` (§6 routing, §7 banner), `../docs/contracts.md` first.

## Structure

```
tgbot/
├── bot/        grammY bot — /start, status notifications, deep links
├── miniapp/    Vite + React + Tailwind — the 14 routes
├── shared/     Uzbek text strings, deep-link helpers, generated API client (shared by both)
└── designs/    REFERENCE ONLY — do not run as the app, do not ship as-is
```
Small pnpm workspace inside this repo so `bot/` and `miniapp/` share `shared/`.

## Mini app stack

React 18 + Vite + Tailwind · `@telegram-apps/sdk-react` · TanStack Query (server state) · Zustand (cart only, localStorage persist) · React Router (14 routes per PRD §6). Static build served by Caddy. **No SSR/Next** — it's a webview gated behind initData, nothing to render server-side.

## Using `designs/` (this is why the folder exists)

- `designs/screenshots/*.png` — **visual intent** (look, spacing, states). One per screen.
- `designs/app-preview/*.jsx` (home, cart, checkout, profile, search, status, onboarding…) — Claude Design's exported React. Use for **exact layout & structure**, then **rebuild properly** in our stack (real API client, Telegram SDK, router). Do **not** ship the raw export — it has inline mock data, no router, no SDK.
- `designs/design-system/tokens/*.css` (colors, fonts, radius, spacing, typography) — **translate these into the Tailwind theme / CSS variables** of the real miniapp. These token values are the source of truth, not guesses. `_ds_manifest.json` has the machine-readable values; `_adherence.oxlintrc.json` is an optional lint rule to enforce token usage — adopt it if convenient.
- `designs/logos/*` — use `tezbozor-mark*.svg` for the bot avatar/favicon, `tezbozor-logo*.svg` for in-app header.

When implementing a screen: picture (`screenshots/NN.png`) for look + exported jsx for structure + PRD §6 for behavior + contracts.md for enums/slots.

## Scope reconciliation (design was made before scope was locked — obey these)

- **No meat video confirmation.** Delete `designs/screenshots/17-order-status-meat-video.png`. In the order-status screen, **omit the meat-video block** that appears in `app-preview/status.jsx`. No `/order/:id/meat` route, no video UI anywhere. Status timeline is just: Qabul qilindi → Bozorda xarid → Yo'lda → Yetkazildi.
- **No evening slot.** Checkout shows only `09:00–11:00` and `11:00–13:00`. Ignore any 16:00–19:00 slot in the design.
- **Address = mahalla + house + landmark** (fixed mahalla list, no geocoding). The map-picker screen (`22-profile-add-address-map.png`) is **out of MVP** — keep onboarding to 2 steps (PRD §6). An optional "drop a pin for lat/lng" can be a fast-follow, not now.
- The 4 intro/marketing slides (screenshots 03–06) are an **optional** intro carousel before the data-entry onboarding; the required onboarding is the phone+name+mahalla+house form.

## Telegram integration

initData sent to backend on every request. **BackButton** on every route except `/`. **MainButton** per the route table in PRD §6 (e.g. cart → "Rasmiylashtirish — {summa}", checkout → "Buyurtmani tasdiqlash"). Deep links per contracts.md (`order_<id>`, `promo_bozor`).

## Text & tone

All Uzbek strings in `shared/texts.ts` (miniapp) and `bot/texts.ts` (bot) — never inline. Warm, "siz", 1–2 emoji max, no Russian/English mixed words. Examples ✓ "Rahmat! Ertaga 10:00–13:00 da yetkazamiz 🛒" ✗ "Sizning so'rovingiz qayta ishlanmoqda…".

## API client

`pnpm gen:api` pulls backend's OpenAPI spec → typed client (+ TanStack Query hooks via orval) into `shared/`. Regenerate after backend API changes. Never hand-write response types.

## Env

`bot/.env.example`: `TELEGRAM_BOT_TOKEN` · `API_BASE_URL` · `MINIAPP_URL` (· webhook secret if webhook mode)
`miniapp/.env.example`: `VITE_API_BASE_URL`
