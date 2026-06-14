import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Unit, Fallback } from '@tezbozor/shared';
import { DEFAULT_FALLBACK } from '@tezbozor/shared';
import { clampQty, stepFor, defaultQty } from '../lib/qty';

// The cart is the ONLY client state (tgbot/CLAUDE.md): Zustand + localStorage
// persist. A line stores what the order needs (productId, qty, fallback, note)
// plus a snapshot of the product at add-time so the cart can render and detect
// price drift even before the live catalog loads. Prices shown in the cart come
// from the LIVE catalog (today's price); the snapshot price only flags drift.

export interface CartLine {
  productId: number;
  qty: number;
  unit: Unit;
  fallback: Fallback;
  itemNote?: string;
  nameAtAdd: string;
  priceAtAddUzs: number;
  imageAtAdd: string | null;
}

export interface AddToCartInput {
  productId: number;
  unit: Unit;
  name: string;
  priceUzs: number;
  imageUrl: string | null;
  qty?: number;
  fallback?: Fallback;
  itemNote?: string;
}

interface CartState {
  lines: CartLine[];
  add: (input: AddToCartInput) => void;
  setQty: (productId: number, qty: number) => void;
  increment: (productId: number, direction: 1 | -1) => void;
  setFallback: (productId: number, fallback: Fallback) => void;
  setNote: (productId: number, note: string) => void;
  remove: (productId: number) => void;
  clear: () => void;
  get: (productId: number) => CartLine | undefined;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      add: (input) =>
        set((state) => {
          const qty = clampQty(input.qty ?? defaultQty(input.unit), input.unit);
          const existing = state.lines.find((l) => l.productId === input.productId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === input.productId
                  ? {
                      ...l,
                      qty: clampQty(l.qty + qty, input.unit),
                      unit: input.unit,
                      fallback: input.fallback ?? l.fallback,
                      itemNote: input.itemNote ?? l.itemNote,
                      nameAtAdd: input.name,
                      priceAtAddUzs: input.priceUzs,
                      imageAtAdd: input.imageUrl,
                    }
                  : l,
              ),
            };
          }
          const line: CartLine = {
            productId: input.productId,
            qty,
            unit: input.unit,
            fallback: input.fallback ?? DEFAULT_FALLBACK,
            itemNote: input.itemNote,
            nameAtAdd: input.name,
            priceAtAddUzs: input.priceUzs,
            imageAtAdd: input.imageUrl,
          };
          return { lines: [...state.lines, line] };
        }),

      setQty: (productId, qty) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.productId === productId ? { ...l, qty: clampQty(qty, l.unit) } : l,
          ),
        })),

      increment: (productId, direction) =>
        set((state) => {
          const line = state.lines.find((l) => l.productId === productId);
          if (!line) return state;
          const next = line.qty + direction * stepFor(line.unit);
          // Stepping below the minimum removes the line.
          if (next < (line.unit === 'kg' ? 0.5 : 1)) {
            return { lines: state.lines.filter((l) => l.productId !== productId) };
          }
          return {
            lines: state.lines.map((l) =>
              l.productId === productId ? { ...l, qty: clampQty(next, l.unit) } : l,
            ),
          };
        }),

      setFallback: (productId, fallback) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.productId === productId ? { ...l, fallback } : l,
          ),
        })),

      setNote: (productId, note) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.productId === productId ? { ...l, itemNote: note || undefined } : l,
          ),
        })),

      remove: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),

      clear: () => set({ lines: [] }),

      get: (productId) => get().lines.find((l) => l.productId === productId),

      count: () => get().lines.length,
    }),
    { name: 'tezbozor-cart' },
  ),
);
