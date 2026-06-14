import { useNavigate } from 'react-router-dom';
import { texts, DEFAULT_FALLBACK } from '@tezbozor/shared';
import { useReorder } from '../api/hooks';
import { useCart } from '../store/cart';
import { useToast } from '../components/Toast';
import { haptic } from '../telegram';

// "Qayta buyurtma berish": fetch the reorder preview, load today's available
// items into the cart, warn about price drift / unavailable items (PRD §6), and
// go to the cart. The preview does NOT create an order — totals are recomputed
// at checkout.
export function useReorderToCart() {
  const navigate = useNavigate();
  const reorder = useReorder();
  const add = useCart((s) => s.add);
  const toast = useToast();

  return {
    isPending: reorder.isPending,
    async run(orderId: number) {
      try {
        const preview = await reorder.preview(orderId);
        const available = preview.items.filter((i) => i.available && i.todayPriceUzs != null);
        if (available.length === 0) {
          toast.show(texts.orders.reorderEmpty);
          return;
        }
        for (const i of available) {
          add({
            productId: i.productId,
            unit: i.unit,
            name: i.nameSnapshot,
            priceUzs: i.todayPriceUzs as number,
            imageUrl: null,
            qty: Number(i.qty),
            fallback: DEFAULT_FALLBACK,
          });
        }
        const unavailable = preview.items.filter((i) => !i.available || i.todayPriceUzs == null);
        const drifted = available.some((i) => i.priceChanged);
        haptic.success();
        if (unavailable.length > 0) {
          toast.show(texts.orders.reorderUnavailable(unavailable.map((i) => i.nameSnapshot).join(', ')));
        } else if (drifted) {
          toast.show(texts.orders.reorderDrift);
        }
        navigate('/cart');
      } catch {
        haptic.error();
        toast.show(texts.common.errorBody);
      }
    },
  };
}
