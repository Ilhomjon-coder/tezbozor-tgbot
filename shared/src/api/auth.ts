// Holds the Telegram `initData` string for the current Mini App session.
//
// The mini app calls `setInitData()` once at startup (after the Telegram SDK is
// ready); the generated API client's fetcher reads it via `getInitData()` and
// attaches it as the `x-telegram-init-data` header on every request. The backend
// validates the HMAC and rejects initData older than 24h (docs/contracts.md ->
// Auth). Kept in a tiny module so both the fetcher (shared) and the app (miniapp)
// can reach it without a circular import.

let initDataRaw = '';

/** Store the raw Telegram initData string (called once by the mini app). */
export function setInitData(raw: string | undefined | null): void {
  initDataRaw = raw ?? '';
}

/** The raw Telegram initData string, or '' outside a Telegram client. */
export function getInitData(): string {
  return initDataRaw;
}
