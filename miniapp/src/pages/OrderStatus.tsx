import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  texts,
  formatSom,
  ORDER_STATUS_FLOW,
  type OrderStatus as OrderStatusEnum,
} from '@tezbozor/shared';
import { useOrder, useRateOrder } from '../api/hooks';
import { relativeDayWord } from '../lib/deliveryClock';
import { usePrimaryCta } from '../lib/telegramButtons';
import { useReorderToCart } from '../lib/useReorderToCart';
import { haptic } from '../telegram';
import { Button, Card, Divider, ProductImage, TextArea } from '../components/ui';
import { CheckIcon, StarIcon } from '../components/icons';
import { useToast } from '../components/Toast';
import { LoadingScreen, ErrorState } from '../components/states';
import { formatQty } from '../lib/qty';

const TERMINAL: OrderStatusEnum[] = ['delivered', 'cancelled'];

// Order status (PRD §6): header + vertical timeline (Qabul qilindi → Bozorda
// xarid → Yo'lda → Yetkazildi — NO meat block), backend totals, rating on
// delivery, reorder. Polls the backend until the order is terminal.
export function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const [polling, setPolling] = useState<number | undefined>(8000);
  const { data: order, isLoading, isError, refetch } = useOrder(orderId, polling);
  const reorder = useReorderToCart();

  useEffect(() => {
    if (order && TERMINAL.includes(order.status)) setPolling(undefined);
  }, [order]);

  const isDelivered = order?.status === 'delivered';
  const showInAppCta = usePrimaryCta(
    isDelivered ? { text: texts.status.reorderCta, onClick: () => reorder.run(orderId) } : null,
  );

  if (isLoading) return <LoadingScreen />;
  if (isError || !order) return <ErrorState onRetry={() => refetch()} />;

  const relDay = relativeDayWord(order.slot?.date);
  const slot = order.slot?.label ?? '';
  const cancelled = order.status === 'cancelled';
  const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status as OrderStatusEnum);

  return (
    <div className="px-gutter pt-4" style={{ paddingBottom: 120 }}>
      <h1 className="font-heading text-h2 text-ink-900">{texts.status.title}</h1>
      <p className="mt-1 font-body text-base text-ink-600">
        {cancelled ? texts.status.cancelled : `🚚 ${texts.status.header(relDay, slot)}`}
      </p>

      {/* Timeline */}
      {!cancelled ? (
        <Card className="mt-4 p-4">
          {ORDER_STATUS_FLOW.map((step, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            const last = i === ORDER_STATUS_FLOW.length - 1;
            return (
              <div key={step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={[
                      'flex h-8 w-8 items-center justify-center rounded-full',
                      done ? 'bg-brand-green text-white' : active ? 'bg-brand-green text-white animate-pulse' : 'bg-ink-100 text-ink-400',
                    ].join(' ')}
                  >
                    {done ? <CheckIcon size={16} /> : <span className="text-sm font-bold">{i + 1}</span>}
                  </span>
                  {!last ? <span className={`my-1 w-0.5 flex-1 ${i < currentIndex ? 'bg-brand-green' : 'bg-ink-100'}`} style={{ minHeight: 28 }} /> : null}
                </div>
                <div className={last ? 'pb-0' : 'pb-4'}>
                  <p className={`font-body text-base font-semibold ${done || active ? 'text-ink-900' : 'text-ink-400'}`}>
                    {texts.labels.status[step]}
                  </p>
                  <p className="font-body text-xs text-ink-400">{texts.labels.statusSub[step]}</p>
                  {active ? (
                    <p className="mt-1 font-body text-xs font-semibold text-brand-green">● {texts.status.nowStep}</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </Card>
      ) : null}

      {/* Items + backend totals (authoritative money) */}
      <Card className="mt-4 p-4">
        {order.items.map((it) => (
          <div key={it.id} className="mb-2 flex items-center gap-3 last:mb-0">
            <ProductImage src={null} alt={it.nameSnapshot} className="h-10 w-10 shrink-0 rounded-md" />
            <div className="flex-1">
              <p className="font-body text-sm font-semibold text-ink-900">{it.nameSnapshot}</p>
              <p className="font-body text-xs text-ink-400">{formatQty(Number(it.qty), it.unit)}</p>
            </div>
            <span className="font-body text-sm font-semibold text-ink-900">{formatSom(it.lineTotalUzs)}</span>
          </div>
        ))}
        <Divider className="my-3" />
        <div className="flex items-center justify-between font-body text-base">
          <span className="text-ink-600">{texts.cart.deliveryRow}</span>
          <span className="font-semibold text-ink-900">
            {order.deliveryFeeUzs === 0 ? texts.cart.deliveryFree : formatSom(order.deliveryFeeUzs)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between font-body">
          <span className="text-base font-semibold text-ink-900">{texts.cart.totalRow}</span>
          <span className="font-heading text-h3 font-bold text-ink-900">{formatSom(order.grandTotalUzs)}</span>
        </div>
      </Card>

      {/* Guarantee */}
      <div className="mt-4 rounded-lg bg-brand-green-light px-4 py-3">
        <p className="font-body text-sm font-semibold text-brand-green-dark">{texts.status.contactTitle}</p>
        <p className="mt-0.5 font-body text-sm text-ink-600">{texts.status.guarantee}</p>
      </div>

      {/* Rating (delivered) */}
      {isDelivered ? <RatingBlock orderId={orderId} existingStars={order.rating?.stars ?? null} /> : null}

      {isDelivered && showInAppCta ? (
        <Button variant="secondary" full className="mt-4" onClick={() => reorder.run(orderId)} loading={reorder.isPending}>
          {texts.status.reorderCta}
        </Button>
      ) : null}
    </div>
  );
}

function RatingBlock({ orderId, existingStars }: { orderId: number; existingStars: number | null }) {
  const rateOrder = useRateOrder();
  const toast = useToast();
  const [stars, setStars] = useState(existingStars ?? 0);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(existingStars != null);

  if (done) {
    return (
      <Card className="mt-4 p-4 text-center">
        <p className="font-body text-base font-semibold text-brand-green">{texts.status.rateThanks}</p>
        <div className="mt-2 flex justify-center gap-1 text-brand-orange">
          {[1, 2, 3, 4, 5].map((n) => (
            <StarIcon key={n} size={24} filled={n <= (existingStars ?? stars)} />
          ))}
        </div>
      </Card>
    );
  }

  const submit = async () => {
    if (stars < 1) return;
    try {
      await rateOrder.rate(orderId, { stars, comment: comment.trim() || undefined });
      haptic.success();
      setDone(true);
      toast.show(texts.status.rateThanks);
    } catch {
      toast.show(texts.common.errorBody);
    }
  };

  return (
    <Card className="mt-4 p-4">
      <p className="font-body text-base font-semibold text-ink-900">{texts.status.rateTitle}</p>
      <div className="mt-2 flex justify-center gap-2 text-brand-orange">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => { setStars(n); haptic.select(); }} aria-label={`${n}`} className="press">
            <StarIcon size={32} filled={n <= stars} />
          </button>
        ))}
      </div>
      <TextArea
        className="mt-3"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={texts.status.rateCommentPlaceholder}
        maxLength={500}
      />
      <Button variant="secondary" full className="mt-3" onClick={submit} disabled={stars < 1} loading={rateOrder.isPending}>
        {texts.status.rateSubmit}
      </Button>
    </Card>
  );
}
