import { init } from '@telegram-apps/sdk-react';

// Initialize the Telegram Mini App SDK. Best-effort and defensive: outside a
// Telegram client (e.g. a plain browser during local dev) this is a no-op so the
// placeholder still renders. Full SDK wiring (viewport, theme, BackButton,
// MainButton, initData -> backend) arrives in Phase 3.
export function initTelegram(): void {
  try {
    init();
  } catch (error) {
    console.warn('[telegram] SDK init skipped (not in a Telegram environment):', error);
  }
}
