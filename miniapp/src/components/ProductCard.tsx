import { useNavigate } from 'react-router-dom';
import type { ProductDto } from '@tezbozor/shared/api';
import { texts } from '@tezbozor/shared';
import { useCart } from '../store/cart';
import { haptic } from '../telegram';
import { useToast } from './Toast';
import { AddButton, Badge, ProductImage, Stepper } from './ui';

// Product card for the 2-col grids (home, category, search). Tapping the image
// or name opens the product sheet. The add control is fully contained: a round
// "+" until the item is in the cart, then a full-width inline stepper — neither
// ever overflows the narrow card. Money is display-only (today's backend price).

function PriceLine({ product }: { product: ProductDto }) {
  if (product.priceUzs == null) {
    return <span className="font-body text-sm text-ink-400">Narx tez orada</span>;
  }
  return (
    <span className="font-body text-base font-bold text-ink-900">
      {texts.common.priceLine(product.priceUzs, product.unit)}
    </span>
  );
}

export function ProductCard({ product }: { product: ProductDto }) {
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  const inc = useCart((s) => s.increment);
  const line = useCart((s) => s.lines.find((l) => l.productId === product.id));
  const toast = useToast();

  const open = () => navigate(`/product/${product.id}`);
  const canAdd = product.priceUzs != null;

  const onAdd = () => {
    if (!canAdd) return;
    add({
      productId: product.id,
      unit: product.unit,
      name: product.nameUz,
      priceUzs: product.priceUzs as number,
      imageUrl: product.imageUrl,
    });
    haptic.tap();
    toast.show(texts.favorites.added);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-card shadow-sm">
      <button onClick={open} className="press relative block text-left">
        <ProductImage src={product.imageUrl} alt={product.nameUz} className="aspect-[4/3] w-full" />
        {product.badge ? (
          <span className="absolute left-2 top-2">
            <Badge tone={product.badge === 'narxi_barqaror' ? 'neutral' : 'green'} className="shadow-sm">
              {texts.labels.badge[product.badge]}
            </Badge>
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <button onClick={open} className="press text-left">
          <span className="line-clamp-2 font-body text-sm font-semibold leading-snug text-ink-900">
            {product.nameUz}
          </span>
        </button>

        <div className="mt-auto flex flex-col gap-2">
          <PriceLine product={product} />
          {line ? (
            <Stepper
              qty={line.qty}
              unit={line.unit}
              full
              onDec={() => inc(product.id, -1)}
              onInc={() => inc(product.id, 1)}
            />
          ) : canAdd ? (
            <div className="flex justify-end">
              <AddButton onClick={onAdd} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
