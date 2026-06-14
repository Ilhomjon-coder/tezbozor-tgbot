import { useEffect, useRef } from 'react';
import {
  IN_TELEGRAM,
  showBackButton,
  setMainButton,
  hideMainButton,
  onMainButtonClick,
} from '../telegram';

// React hooks that drive the Telegram BackButton / MainButton per the PRD §6
// route table, and a `usePrimaryCta` that uses the native MainButton inside
// Telegram but tells the screen to render an in-app button in a plain browser.

/** Show the Telegram BackButton while mounted; runs `onBack` (default history back). */
export function useBackButton(onBack: () => void, enabled = true): void {
  const cb = useRef(onBack);
  cb.current = onBack;
  useEffect(() => {
    if (!enabled) return;
    const cleanup = showBackButton(() => cb.current());
    return cleanup;
  }, [enabled]);
}

export interface PrimaryCtaConfig {
  text: string;
  onClick: () => void;
  enabled?: boolean;
  loading?: boolean;
  /** Hide entirely (e.g. cart below minimum still shows it but disabled). */
  hidden?: boolean;
}

/**
 * Drives the Telegram MainButton from `config` when running inside Telegram.
 * Returns `true` when the screen should render its own in-app button instead
 * (plain browser / non-Telegram), so the CTA is never missing.
 */
export function usePrimaryCta(config: PrimaryCtaConfig | null): boolean {
  const cb = useRef<() => void>(() => {});
  cb.current = config?.onClick ?? (() => {});

  // Register a single stable click listener; it calls the latest handler.
  useEffect(() => {
    if (!IN_TELEGRAM) return;
    const off = onMainButtonClick(() => cb.current());
    return off;
  }, []);

  useEffect(() => {
    if (!IN_TELEGRAM) return;
    if (!config || config.hidden) {
      hideMainButton();
      return;
    }
    setMainButton({
      text: config.text,
      isVisible: true,
      isEnabled: config.enabled !== false,
      isLoaderVisible: !!config.loading,
    });
    return () => hideMainButton();
  }, [config?.text, config?.enabled, config?.loading, config?.hidden, !!config]);

  return !IN_TELEGRAM;
}
