// Shared enum string-unions — values EXACTLY per docs/contracts.md. The
// generated API client has its own per-DTO enum types; these are the stable,
// human-named unions the app and bot code reference directly.

export type OrderStatus = 'accepted' | 'shopping' | 'on_the_way' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash' | 'click' | 'payme';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
/** Per-item "B variant" fallback. Default `substitute`. */
export type Fallback = 'substitute' | 'skip' | 'call';
export type ItemStatus = 'pending' | 'bought' | 'substituted' | 'skipped';
export type ProductBadge = 'yangi_keldi' | 'narxi_barqaror';
export type Unit = 'kg' | 'dona';

/** Order-status timeline order (terminal `cancelled` is not part of the flow). */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'accepted',
  'shopping',
  'on_the_way',
  'delivered',
];

export const FALLBACK_OPTIONS: Fallback[] = ['substitute', 'skip', 'call'];
export const DEFAULT_FALLBACK: Fallback = 'substitute';

/** Only `cash` is selectable at launch (contracts.md); the rest are forward-compat. */
export const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'click', 'payme'];
export const ACTIVE_PAYMENT_METHODS: PaymentMethod[] = ['cash'];
