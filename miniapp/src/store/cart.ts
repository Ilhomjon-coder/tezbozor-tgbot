import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Placeholder cart store. Per tgbot/CLAUDE.md, Zustand holds ONLY the cart and
// persists to localStorage. The real cart (steppers, B-variant chips, totals)
// is built in Phase 3 — this just proves the wiring.
interface CartState {
  items: Record<string, number>; // productId -> qty (placeholder shape)
  count: () => number;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      count: () => Object.values(get().items).reduce((sum, qty) => sum + qty, 0),
      clear: () => set({ items: {} }),
    }),
    { name: 'tezbozor-cart' },
  ),
);
