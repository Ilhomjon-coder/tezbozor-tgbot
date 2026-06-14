import {
  init as sdkInit,
  retrieveRawInitData,
  retrieveLaunchParams,
  backButton,
  mainButton,
  viewport,
  miniApp,
  themeParams,
  hapticFeedback,
  requestContact,
} from '@telegram-apps/sdk-react';
import { setInitData } from '@tezbozor/shared/api';

// Telegram Mini App SDK integration (@telegram-apps/sdk-react v3). Every call is
// best-effort and guarded: outside a Telegram client (plain browser during dev)
// the app still renders and falls back to in-app UI. The SDK functions are
// "SafeWrapped" — `.isAvailable()` tells us whether calling them is safe.

/** Did we boot inside a real Telegram client? Decides MainButton vs in-app CTA. */
export const IN_TELEGRAM: boolean = detectTelegram();

function detectTelegram(): boolean {
  try {
    retrieveLaunchParams();
    return true;
  } catch {
    return false;
  }
}

function safe<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch (error) {
    console.warn('[telegram] call skipped:', error);
    return undefined;
  }
}

let started = false;

/**
 * Initialize the SDK once at startup: capture initData for the API auth header,
 * mount the mini-app/theme/viewport scopes, expand the viewport, and bind the
 * Telegram CSS variables (safe-area insets, theme colours) used by the layout.
 */
export function initTelegram(): void {
  if (started) return;
  started = true;

  safe(() => sdkInit());

  // Capture the raw initData string so the API fetcher can send it as the
  // `x-telegram-init-data` header (docs/contracts.md -> Auth).
  let raw: string | undefined;
  try {
    raw = retrieveRawInitData();
  } catch {
    raw = undefined;
  }
  setInitData(raw ?? '');

  safe(() => {
    if (miniApp.mountSync.isAvailable()) miniApp.mountSync();
  });
  safe(() => {
    if (miniApp.bindCssVars.isAvailable()) miniApp.bindCssVars();
  });
  safe(() => {
    if (themeParams.mountSync.isAvailable()) themeParams.mountSync();
  });
  safe(() => {
    if (themeParams.bindCssVars.isAvailable()) themeParams.bindCssVars();
  });
  safe(() => {
    if (backButton.mount.isAvailable()) backButton.mount();
  });
  safe(() => {
    if (mainButton.mount.isAvailable()) mainButton.mount();
  });
  // Viewport mount is async; expand + bind once available.
  safe(() => {
    if (viewport.mount.isAvailable()) {
      const p = viewport.mount();
      Promise.resolve(p)
        .then(() => {
          safe(() => viewport.expand.isAvailable() && viewport.expand());
          safe(() => viewport.bindCssVars.isAvailable() && viewport.bindCssVars());
        })
        .catch(() => {});
    }
  });
}

/** The Telegram user's display name from initData, or null outside Telegram. */
export function getTelegramUser(): { name: string } | null {
  try {
    // The launch-params user object is snake_case; tolerate camelCase too.
    const lp = retrieveLaunchParams() as {
      tgWebAppData?: {
        user?: { first_name?: string; last_name?: string; firstName?: string; lastName?: string };
      };
    };
    const u = lp?.tgWebAppData?.user;
    if (!u) return null;
    const name = `${u.first_name ?? u.firstName ?? ''} ${u.last_name ?? u.lastName ?? ''}`.trim();
    return name ? { name } : null;
  } catch {
    return null;
  }
}

/** The Telegram start_param (deep link payload), or undefined. */
export function getStartParam(): string | undefined {
  try {
    const lp = retrieveLaunchParams();
    // camelCase false form exposes tgWebAppStartParam
    return (lp as { tgWebAppStartParam?: string }).tgWebAppStartParam ?? undefined;
  } catch {
    return undefined;
  }
}

// ---- Back button ----------------------------------------------------------

export function showBackButton(onClick: () => void): () => void {
  let off: () => void = () => {};
  safe(() => {
    if (backButton.onClick.isAvailable()) off = backButton.onClick(onClick);
  });
  safe(() => {
    if (backButton.show.isAvailable()) backButton.show();
  });
  return () => {
    safe(() => off());
    safe(() => {
      if (backButton.hide.isAvailable()) backButton.hide();
    });
  };
}

// ---- Main button -----------------------------------------------------------

export interface MainButtonParams {
  text: string;
  isVisible?: boolean;
  isEnabled?: boolean;
  isLoaderVisible?: boolean;
}

const ORANGE = '#FF7A00';
const DISABLED = '#D8DEE2';

export function setMainButton(params: MainButtonParams): void {
  safe(() => {
    if (!mainButton.setParams.isAvailable()) return;
    const enabled = params.isEnabled !== false;
    mainButton.setParams({
      text: params.text,
      isVisible: params.isVisible !== false,
      isEnabled: enabled,
      isLoaderVisible: !!params.isLoaderVisible,
      backgroundColor: enabled ? ORANGE : DISABLED,
      textColor: '#FFFFFF',
    });
  });
}

export function hideMainButton(): void {
  safe(() => {
    if (mainButton.setParams.isAvailable()) mainButton.setParams({ isVisible: false });
  });
}

export function onMainButtonClick(cb: () => void): () => void {
  let off: () => void = () => {};
  safe(() => {
    if (mainButton.onClick.isAvailable()) off = mainButton.onClick(cb);
  });
  return () => safe(() => off());
}

// ---- Contact / haptics -----------------------------------------------------

/** Ask Telegram for the user's phone via the contact-sharing dialog. */
export async function requestContactPhone(): Promise<string | null> {
  try {
    if (!requestContact.isAvailable()) return null;
    const res = (await requestContact()) as {
      parsed?: { contact?: { phone_number?: string } };
    };
    return res?.parsed?.contact?.phone_number ?? null;
  } catch {
    return null;
  }
}

export const haptic = {
  tap(): void {
    safe(() => {
      if (hapticFeedback.impactOccurred.isAvailable()) hapticFeedback.impactOccurred('light');
    });
  },
  select(): void {
    safe(() => {
      if (hapticFeedback.selectionChanged.isAvailable()) hapticFeedback.selectionChanged();
    });
  },
  success(): void {
    safe(() => {
      if (hapticFeedback.notificationOccurred.isAvailable())
        hapticFeedback.notificationOccurred('success');
    });
  },
  error(): void {
    safe(() => {
      if (hapticFeedback.notificationOccurred.isAvailable())
        hapticFeedback.notificationOccurred('error');
    });
  },
};
