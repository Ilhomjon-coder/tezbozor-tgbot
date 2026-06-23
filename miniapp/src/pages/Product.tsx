import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { texts, formatSom, lineTotalUzs } from '@tezbozor/shared';
import { useProduct, useProducts } from '../api/hooks';
import { useCart } from '../store/cart';
import { stepFor, minFor, clampQty } from '../lib/qty';
import { usePrimaryCta } from '../lib/telegramButtons';
import { haptic } from '../telegram';
import { Button, ProductImage, Stepper, TextInput } from '../components/ui';
import { LoadingScreen } from '../components/states';
import { useToast } from '../components/Toast';

// Product detail as a bottom sheet (PRD §6): image, name, today's price + "narx
// har kuni yangilanadi", qty stepper (kg/dona), item note, add-to-cart CTA.
export function Product() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();
  const toast = useToast();

  const { data: products, isLoading: listLoading } = useProducts();
  const fromList = products?.find((p) => p.id === productId);
  const single = useProduct(productId, !fromList);
  const product = fromList ?? single.data;

  const cartLine = useCart((s) => s.lines.find((l) => l.productId === productId));
  const add = useCart((s) => s.add);
  const setQtyStore = useCart((s) => s.setQty);
  const setNoteStore = useCart((s) => s.setNote);

  const [qty, setQty] = useState<number>(cartLine?.qty ?? 1);
  const [note, setNote] = useState<string>(cartLine?.itemNote ?? '');

  const close = () => navigate(-1);
  const loading = !product && (listLoading || single.isLoading);

  const canAdd = !!product && product.priceUzs != null;
  const sum = product?.priceUzs != null ? lineTotalUzs(product.priceUzs, qty) : 0;

  const confirm = () => {
    if (!product || product.priceUzs == null) return;
    const clamped = clampQty(qty, product.unit);
    if (cartLine) {
      setQtyStore(product.id, clamped);
      setNoteStore(product.id, note);
    } else {
      add({
        productId: product.id,
        unit: product.unit,
        name: product.nameUz,
        priceUzs: product.priceUzs,
        imageUrl: product.imageUrl,
        qty: clamped,
        itemNote: note || undefined,
      });
    }
    haptic.success();
    toast.show(texts.favorites.added);
    close();
  };

  const showInAppCta = usePrimaryCta(
    canAdd
      ? {
          text: texts.product.addCtaWithSum(formatSom(sum)),
          onClick: confirm,
        }
      : null,
  );

  const unit = product?.unit ?? 'dona';
  const dec = () => setQty((q) => Math.max(minFor(unit), clampQty(q - stepFor(unit), unit)));
  const inc = () => setQty((q) => clampQty(q + stepFor(unit), unit));

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <button aria-label={texts.common.back} className="absolute inset-0 bg-ink-900/40" onClick={close} />
      <div className="relative mx-auto max-h-[90vh] w-full max-w-content overflow-y-auto rounded-t-xl bg-card pb-6">
        <div className="sticky top-0 flex justify-center bg-card pt-3">
          <span className="h-1 w-10 rounded-pill bg-ink-200" />
        </div>

        {loading ? (
          <LoadingScreen />
        ) : !product ? (
          <div className="flex flex-col items-center gap-3 px-gutter py-12 text-center">
            <p className="font-heading text-h3 text-ink-900">{texts.product.notFound}</p>
            <Button variant="ghost" onClick={close}>
              {texts.common.back}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-gutter pt-2">
            <ProductImage src={product.imageUrl} alt={product.nameUz} className="h-44 w-full rounded-lg" />

            <div>
              <h1 className="font-heading text-h2 text-ink-900">{product.nameUz}</h1>
              {product.priceUzs != null ? (
                <p className="mt-1 font-body text-h3 font-extrabold text-ink-900">
                  {texts.common.priceLine(product.priceUzs, product.unit)}
                </p>
              ) : (
                <p className="mt-1 font-body text-sm text-ink-400">Narx tez orada</p>
              )}
              <p className="mt-1 font-body text-xs text-ink-400">🔄 {texts.product.priceNote}</p>
            </div>

            {canAdd ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-body text-base font-semibold text-ink-900">
                    {texts.product.qtyLabel}
                  </span>
                  <Stepper qty={qty} unit={product.unit} onDec={dec} onInc={inc} />
                </div>

                <label className="block">
                  <span className="mb-1.5 block font-body text-sm font-semibold text-ink-600">
                    {texts.product.noteLabel} — {texts.common.optional}
                  </span>
                  <TextInput
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={texts.product.notePlaceholder}
                    maxLength={200}
                  />
                </label>

                {showInAppCta ? (
                  <Button full onClick={confirm} className="mt-1">
                    {texts.product.addCtaWithSum(formatSom(sum))}
                  </Button>
                ) : null}
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
