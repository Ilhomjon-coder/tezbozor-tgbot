// Deep-link helpers shared by the bot (builds links) and the mini app (parses
// the startapp payload). Format and payloads per docs/contracts.md -> Deep links:
//
//   https://t.me/<bot_username>/<app_short_name>?startapp=<payload>
//
//   order_<id>   -> /order/:id   (order status changed)
//   promo_bozor  -> /?promo=bozor (market-day announcement)

export const PROMO_BOZOR_PAYLOAD = 'promo_bozor';

/** Build the startapp payload for an order-status deep link. */
export function orderPayload(orderId: number | string): string {
  return `order_${orderId}`;
}

/** Build a full t.me Mini App link with a startapp payload. */
export function buildMiniAppLink(
  botUsername: string,
  appShortName: string,
  payload: string,
): string {
  return `https://t.me/${botUsername}/${appShortName}?startapp=${encodeURIComponent(payload)}`;
}

export type StartParam =
  | { type: 'order'; orderId: string }
  | { type: 'promo'; promo: 'bozor' }
  | { type: 'unknown'; raw: string };

/** Parse the startapp payload the mini app receives into a routing intent. */
export function parseStartParam(raw: string | undefined | null): StartParam | null {
  if (!raw) return null;
  if (raw === PROMO_BOZOR_PAYLOAD) return { type: 'promo', promo: 'bozor' };
  const orderMatch = /^order_(.+)$/.exec(raw);
  if (orderMatch) return { type: 'order', orderId: orderMatch[1] };
  return { type: 'unknown', raw };
}

/** Map a parsed start param to an in-app route path. */
export function startParamToPath(param: StartParam | null): string {
  if (!param) return '/';
  switch (param.type) {
    case 'order':
      return `/order/${param.orderId}`;
    case 'promo':
      return '/?promo=bozor';
    default:
      return '/';
  }
}
