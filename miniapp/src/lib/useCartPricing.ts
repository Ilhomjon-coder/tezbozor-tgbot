import { useMemo } from 'react';
import { previewCart, type CartPreview } from '@tezbozor/shared';
import type { ProductDto } from '@tezbozor/shared/api';
import { useProducts } from '../api/hooks';
import { useCart, type CartLine } from '../store/cart';

// Joins the persisted cart with the LIVE catalog so the cart/checkout show
// today's prices and can flag drift vs the price at add-time. Money is still
// display-only: the cart total is a preview (see shared/money.ts); the backend
// recomputes authoritatively at POST /orders.

export interface PricedLine {
  line: CartLine;
  product?: ProductDto;
  /** Today's price (backend), falling back to the snapshot until catalog loads. */
  currentPriceUzs: number;
  lineTotalUzs: number;
  /** Product still sold today with a price. */
  available: boolean;
  /** Today's price differs from the price when it was added. */
  priceChanged: boolean;
}

export interface CartPricing {
  count: number;
  lines: PricedLine[];
  /** Lines available for ordering (priced + active). */
  orderableLines: PricedLine[];
  preview: CartPreview;
  /** Catalog still loading (prices may be snapshot fallbacks). */
  loading: boolean;
}

export function useCartPricing(): CartPricing {
  const cartLines = useCart((s) => s.lines);
  const { data: products, isLoading } = useProducts();

  return useMemo(() => {
    const byId = new Map<number, ProductDto>((products ?? []).map((p) => [p.id, p]));

    const lines: PricedLine[] = cartLines.map((line) => {
      const product = byId.get(line.productId);
      const todayPrice = product?.priceUzs ?? null;
      const currentPriceUzs = todayPrice ?? line.priceAtAddUzs;
      const available = product != null && todayPrice != null;
      return {
        line,
        product,
        currentPriceUzs,
        lineTotalUzs: Math.round(currentPriceUzs * line.qty),
        available,
        priceChanged: todayPrice != null && todayPrice !== line.priceAtAddUzs,
      };
    });

    const orderableLines = lines.filter((l) => l.available);
    const preview = previewCart(
      orderableLines.map((l) => ({ priceUzs: l.currentPriceUzs, qty: l.line.qty })),
    );

    return {
      count: cartLines.length,
      lines,
      orderableLines,
      preview,
      loading: isLoading,
    };
  }, [cartLines, products, isLoading]);
}
