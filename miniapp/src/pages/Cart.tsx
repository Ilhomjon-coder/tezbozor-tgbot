import { useNavigate } from 'react-router-dom';
import {
  texts,
  formatSom,
  FALLBACK_OPTIONS,
  type Fallback,
} from '@tezbozor/shared';
import { useCart } from '../store/cart';
import { useCartPricing, type PricedLine } from '../lib/useCartPricing';
import { usePrimaryCta } from '../lib/telegramButtons';
import { haptic } from '../telegram';
import { Button, ProductImage, Stepper, Divider } from '../components/ui';
import { EmptyState } from '../components/states';
import { TrashIcon } from '../components/icons';

// Cart (PRD §6): item rows with stepper + delete, per-item B-variant chips,
// free-delivery progress / min-order block, summary. Money shown is a preview
// from today's prices; the backend is authoritative at checkout.
export function Cart() {
  const navigate = useNavigate();
  const { lines, orderableLines, preview, count } = useCartPricing();
  const clear = useCart((s) => s.clear);

  const meetsMin = preview.meetsMinimum && orderableLines.length > 0;

  const showInAppCta = usePrimaryCta(
    count > 0
      ? {
          text: texts.cart.checkoutCta(formatSom(preview.grandTotalUzs)),
          onClick: () => navigate('/checkout'),
          enabled: meetsMin,
        }
      : null,
  );

  if (count === 0) {
    return (
      <EmptyState
        icon="🧺"
        title={texts.cart.emptyTitle}
        body={texts.cart.emptyBody}
        action={
          <Button variant="secondary" onClick={() => navigate('/')}>
            {texts.cart.emptyCta}
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="px-gutter pt-4" style={{ paddingBottom: 200 }}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-h2 text-ink-900">{texts.cart.title}</h1>
            <p className="font-body text-sm text-ink-600">{texts.cart.itemsCount(count)}</p>
          </div>
          <button
            onClick={() => {
              clear();
              haptic.tap();
            }}
            className="press -my-2 inline-flex min-h-tap items-center gap-1 px-1 font-body text-sm text-ink-400"
          >
            <TrashIcon size={18} />
            {texts.cart.clear}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {lines.map((pl) => (
            <CartRow key={pl.line.productId} pl={pl} />
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-lg bg-card p-4 shadow-sm">
          <p className="mb-3 font-body text-sm font-semibold text-ink-600">🧾 {texts.cart.summaryTitle}</p>
          <div className="flex items-center justify-between font-body text-base">
            <span className="text-ink-600">{texts.cart.itemsRow(orderableLines.length)}</span>
            <span className="font-semibold text-ink-900">{formatSom(preview.itemsTotalUzs)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between font-body text-base">
            <span className="text-ink-600">{texts.cart.deliveryRow}</span>
            {preview.freeDelivery ? (
              <span className="font-semibold text-brand-green">{texts.cart.deliveryFree}</span>
            ) : (
              <span className="font-semibold text-ink-900">{formatSom(preview.deliveryFeeUzs)}</span>
            )}
          </div>
          <Divider className="my-3" />
          <div className="flex items-center justify-between font-body">
            <span className="text-base font-semibold text-ink-900">{texts.cart.totalRow}</span>
            <span className="font-heading text-h2 font-extrabold text-ink-900">{formatSom(preview.grandTotalUzs)}</span>
          </div>
        </div>
      </div>

      {/* Sticky dock: progress / min hint + CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-content border-t border-ink-100 bg-card px-gutter pt-3"
        style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}
      >
        <DockHint preview={preview} meetsMin={meetsMin} />
        {showInAppCta ? (
          <Button full onClick={() => navigate('/checkout')} disabled={!meetsMin} className="mt-2">
            {texts.cart.checkoutCta(formatSom(preview.grandTotalUzs))}
          </Button>
        ) : null}
      </div>
    </>
  );
}

function DockHint({
  preview,
  meetsMin,
}: {
  preview: ReturnType<typeof useCartPricing>['preview'];
  meetsMin: boolean;
}) {
  if (!meetsMin) {
    return (
      <div className="rounded-md bg-brand-orange-light px-3 py-2 text-center font-body text-sm font-medium text-brand-orange-dark">
        {texts.cart.minHint(formatSom(preview.remainingToMinimumUzs))}
      </div>
    );
  }
  if (preview.freeDelivery) {
    return (
      <p className="text-center font-body text-sm font-semibold text-brand-green">
        {texts.cart.freeReached}
      </p>
    );
  }
  return (
    <div>
      <p className="mb-1.5 text-center font-body text-sm text-ink-600">
        {texts.cart.freeProgress(formatSom(preview.remainingToFreeUzs))}
      </p>
      <div className="h-2 overflow-hidden rounded-pill bg-ink-100">
        <div className="h-full rounded-pill bg-brand-green" style={{ width: `${preview.freeProgressPct}%` }} />
      </div>
    </div>
  );
}

function CartRow({ pl }: { pl: PricedLine }) {
  const inc = useCart((s) => s.increment);
  const remove = useCart((s) => s.remove);
  const setFallback = useCart((s) => s.setFallback);
  const { line } = pl;
  const name = pl.product?.nameUz ?? line.nameAtAdd;

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <ProductImage src={pl.product?.imageUrl ?? line.imageAtAdd} alt={name} className="h-14 w-14 shrink-0 rounded-md" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-body text-base font-semibold text-ink-900">{name}</p>
            <button
              onClick={() => remove(line.productId)}
              aria-label={texts.common.delete}
              className="press -mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-ink-400 active:bg-ink-100"
            >
              <TrashIcon size={18} />
            </button>
          </div>
          {pl.available ? (
            <p className="mt-0.5 font-body text-xs text-ink-400">
              {texts.common.priceLine(pl.currentPriceUzs, line.unit)} · bugungi narx
            </p>
          ) : (
            <p className="mt-0.5 font-body text-xs font-medium text-danger">
              {texts.favorites.unavailableToday}
            </p>
          )}
          {pl.priceChanged ? (
            <p className="mt-1 rounded bg-brand-orange-light px-2 py-0.5 font-body text-xs font-medium text-brand-orange-dark">
              {texts.cart.priceDrift(formatSom(line.priceAtAddUzs), formatSom(pl.currentPriceUzs))}
            </p>
          ) : null}
          <div className="mt-2 flex items-center justify-between">
            <Stepper
              qty={line.qty}
              unit={line.unit}
              compact
              onDec={() => inc(line.productId, -1)}
              onInc={() => inc(line.productId, 1)}
            />
            {pl.available ? (
              <span className="font-body text-base font-bold text-ink-900">
                {formatSom(pl.lineTotalUzs)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* B-variant chips */}
      <div className="mt-3">
        <p className="mb-1.5 font-body text-xs text-ink-600">🛒 {texts.cart.fallbackQuestion}</p>
        <div className="flex flex-wrap gap-2">
          {FALLBACK_OPTIONS.map((f) => {
            const active = line.fallback === f;
            return (
              <button
                key={f}
                onClick={() => {
                  setFallback(line.productId, f as Fallback);
                  haptic.select();
                }}
                className={[
                  'press inline-flex min-h-tap items-center gap-1 rounded-pill border px-3.5 py-2 font-body text-xs font-semibold',
                  active
                    ? 'border-brand-green bg-brand-green text-white'
                    : 'border-ink-200 bg-card text-ink-600',
                ].join(' ')}
              >
                <span>{texts.labels.fallbackIcon[f]}</span>
                {texts.labels.fallback[f]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
