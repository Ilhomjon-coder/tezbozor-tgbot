// Custom fetch mutator used by the orval-generated client (see orval.config.ts).
//
// orval's fetch client expects the mutator to resolve to a { status, data,
// headers } envelope (that is the generated `*Response` type), NOT the bare
// body. It prepends the API base URL (from the mini app's Vite env), attaches
// the Telegram `initData` auth header on every request (docs/contracts.md ->
// Auth), and parses the response. Only ever runs in the browser (mini app); the
// bot never imports the generated client.

import { getInitData } from './auth';

// The orval-generated request paths already include the `/api` prefix (e.g.
// `/api/me`), so the base URL must be the bare origin. The deployed
// VITE_API_BASE_URL is baked as `https://…/api`, so strip a trailing `/api`
// (and any trailing slash) to avoid building `/api/api/…` (404). Works whether
// the env is set to the origin or to `…/api`, or left empty for same-origin.
const getBaseUrl = (): string =>
  (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '').replace(/\/api$/, '');

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const text = await response.text();
    return text ? JSON.parse(text) : undefined;
  }
  return response.text();
}

export const customFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  // Merge the Telegram initData header in without clobbering caller headers
  // (e.g. Content-Type set by the generated client for JSON bodies).
  const headers = new Headers(options?.headers);
  const initData = getInitData();
  if (initData) headers.set('x-telegram-init-data', initData);

  const response = await fetch(`${getBaseUrl()}${url}`, { ...options, headers });
  const data = await parseBody(response);

  return {
    status: response.status,
    data,
    headers: response.headers,
  } as T;
};
