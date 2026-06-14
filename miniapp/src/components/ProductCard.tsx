import { useNavigate } from 'react-router-dom';
import type { ProductDto } from '@tezbozor/shared/api';
import { texts } from '@tezbozor/shared';
import { useCart } from '../store/cart';
import { haptic } from '../telegram';
import { useToast } from './Toast';
import { AddButton, Badge, ProductImage, Stepper } from './ui';

// Product card used on home (grid), category and search. Tapping the image/name
// opens the product sheet; the price line shows a "+" or, once in the cart, a
// quantity stepper. Money is display-only — `priceUzs` is today's backend price.

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

function useCartLine(productId: number) {
  return useCart((s) => s.lines.find((l) => l.productId === productId));
}

export function ProductCard({ product, layout = 'grid' }: { product: ProductDto; layout?: 'grid' | 'row' }) {
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  const inc = useCart((s) => s.increment);
  const line = useCartLine(product.id);
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

  const control = line ? (
    <Stepper
      qty={line.qty}
      unit={line.unit}
      compact
      onDec={() => inc(product.id, -1)}
      onInc={() => inc(product.id, 1)}
    />
  ) : canAdd ? (
    <AddButton onClick={onAdd} />
  ) : null;

  if (layout === 'row') {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-sm">
        <button onClick={open} className="press flex flex-1 items-center gap-3 text-left">
          <ProductImage src={product.imageUrl} alt={product.nameUz} className="h-14 w-14 shrink-0 rounded-md" />
          <span className="flex-1">
            <span className="line-clamp-2 font-body text-base font-semibold text-ink-900">{product.nameUz}</span>
            <span className="mt-0.5 block">
              <PriceLine product={product} />
            </span>
          </span>
        </button>
        {control}
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-card shadow-sm">
      <button onClick={open} className="press relative block text-left">
        <ProductImage src={product.imageUrl} alt={product.nameUz} className="h-28 w-full" />
        {product.badge ? (
          <span className="absolute left-2 top-2">
            <Badge tone={product.badge === 'narxi_barqaror' ? 'neutral' : 'green'}>
              {texts.labels.badge[product.badge]}
            </Badge>
          </span>
        ) : null}
      </button>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <button onClick={open} className="press text-left">
          <span className="line-clamp-2 min-h-[2.6rem] font-body text-base font-semibold text-ink-900">
            {product.nameUz}
          </span>
        </button>
        <div className="mt-auto flex items-center justify-between gap-2">
          <PriceLine product={product} />
          {control}
        </div>
      </div>
    </div>
  );
}
