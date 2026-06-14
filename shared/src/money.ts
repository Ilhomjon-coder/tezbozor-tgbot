// Money helpers — integer so'm only, never float (root CLAUDE.md iron rule #1,
// docs/contracts.md -> Money). Display format: thousands separated by a space
// ("127 000 so'm").
//
// ⚠️ The BACKEND is the single source of truth for every total at order time.
// `POST /orders` recomputes items total, delivery fee and grand total from
// today's prices and immutable snapshots; the success / status / order-detail
// screens always show those backend numbers. The helpers below produce a
// client-side *preview* for the cart (there is no cart-quote endpoint), using
// exactly the constants and rounding rule documented in contracts.md so the
// preview matches what the backend will charge.

/** Minimum order; checkout is blocked below this (contracts.md). */
export const MIN_ORDER_UZS = 50_000;
/** Items total at/above which delivery is free (contracts.md). */
export const FREE_DELIVERY_UZS = 100_000;
/** Flat delivery fee when items total is below the free threshold (contracts.md). */
export const DELIVERY_FEE_UZS = 6_000;

/** Group an integer amount with space thousands separators: 127000 -> "127 000". */
export function groupThousands(amount: number): string {
  const n = Math.round(amount);
  const sign = n < 0 ? '-' : '';
  return sign + Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** Full money display: 127000 -> "127 000 so'm". */
export function formatSom(amount: number): string {
  return `${groupThousands(amount)} so'm`;
}

/**
 * Line total for one cart item, as integer so'm.
 * contracts.md: line total = round(price_per_kg × qty). Works for `dona` too
 * (qty is a whole number there).
 */
export function lineTotalUzs(priceUzs: number, qty: number): number {
  return Math.round(priceUzs * qty);
}

export interface CartPreviewLine {
  priceUzs: number;
  qty: number;
}

export interface CartPreview {
  itemsTotalUzs: number;
  deliveryFeeUzs: number;
  grandTotalUzs: number;
  /** Items total reached the free-delivery threshold. */
  freeDelivery: boolean;
  /** Items total reached the minimum-order threshold (checkout allowed). */
  meetsMinimum: boolean;
  /** So'm still needed to reach the minimum order (0 once met). */
  remainingToMinimumUzs: number;
  /** So'm still needed to reach free delivery (0 once reached). */
  remainingToFreeUzs: number;
  /** Progress toward free delivery, 0..100 (for the progress bar). */
  freeProgressPct: number;
}

/**
 * Client-side cart preview mirroring the backend's money rules (see file header).
 * Authoritative totals come from `POST /orders`.
 */
export function previewCart(lines: CartPreviewLine[]): CartPreview {
  const itemsTotalUzs = lines.reduce(
    (sum, l) => sum + lineTotalUzs(l.priceUzs, l.qty),
    0,
  );
  const freeDelivery = itemsTotalUzs >= FREE_DELIVERY_UZS;
  const deliveryFeeUzs = freeDelivery ? 0 : DELIVERY_FEE_UZS;
  const meetsMinimum = itemsTotalUzs >= MIN_ORDER_UZS;

  return {
    itemsTotalUzs,
    deliveryFeeUzs,
    grandTotalUzs: itemsTotalUzs + deliveryFeeUzs,
    freeDelivery,
    meetsMinimum,
    remainingToMinimumUzs: Math.max(0, MIN_ORDER_UZS - itemsTotalUzs),
    remainingToFreeUzs: Math.max(0, FREE_DELIVERY_UZS - itemsTotalUzs),
    freeProgressPct: Math.min(
      100,
      Math.round((itemsTotalUzs / FREE_DELIVERY_UZS) * 100),
    ),
  };
}
