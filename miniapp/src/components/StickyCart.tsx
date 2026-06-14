import { useNavigate } from 'react-router-dom';
import { formatSom, texts } from '@tezbozor/shared';
import { haptic } from '../telegram';
import { useCartPricing } from '../lib/useCartPricing';
import { BasketIcon } from './icons';

// Sticky cart button shown above the bottom nav on browse screens when the cart
// is non-empty (PRD §6): "Savat · 3 ta · 127 000 so'm" → /cart.
export function StickyCart() {
  const navigate = useNavigate();
  const { count, preview } = useCartPricing();
  if (count === 0) return null;

  return (
    <div
      className="fixed inset-x-0 z-30 mx-auto max-w-content px-gutter"
      style={{ bottom: 'calc(12px + var(--safe-bottom))' }}
    >
      <button
        onClick={() => {
          haptic.tap();
          navigate('/cart');
        }}
        className="press flex h-12 w-full items-center justify-between rounded-pill bg-brand-green px-5 text-white shadow-green active:bg-brand-green-dark"
      >
        <span className="flex items-center gap-2 font-body text-base font-semibold">
          <BasketIcon size={20} />
          {texts.cart.title} · {texts.cart.itemsCount(count)}
        </span>
        <span className="font-body text-base font-bold">{formatSom(preview.grandTotalUzs)}</span>
      </button>
    </div>
  );
}
