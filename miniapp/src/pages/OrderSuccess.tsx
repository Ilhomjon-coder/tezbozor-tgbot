import { useNavigate, useParams } from 'react-router-dom';
import { texts } from '@tezbozor/shared';
import { useOrder } from '../api/hooks';
import { relativeDayWord } from '../lib/deliveryClock';
import { usePrimaryCta } from '../lib/telegramButtons';
import { Button } from '../components/ui';
import { CheckIcon } from '../components/icons';
import { LoadingScreen } from '../components/states';

// Order placed (PRD §6): big green check, "Rahmat! {relDay} {slot} da yetkazamiz",
// order number, link to status. MainButton → home.
export function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(orderId);

  const showInAppCta = usePrimaryCta({
    text: texts.success.toHome,
    onClick: () => navigate('/', { replace: true }),
  });

  if (isLoading) return <LoadingScreen />;

  const slot = order?.slot?.label ?? '';
  const relDay = relativeDayWord(order?.slot?.date);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-gutter text-center">
      <div className="rounded-lg bg-brand-green-light px-4 py-2 font-body text-sm font-semibold text-brand-green-dark">
        {texts.success.headerLine(relDay, slot)}
      </div>

      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-green text-white shadow-green">
        <CheckIcon size={56} />
      </div>

      <h1 className="font-heading text-h1 text-ink-900">{texts.success.title}</h1>
      <p className="max-w-[20rem] font-body text-base text-ink-600">{texts.success.body(relDay, slot)}</p>

      {order ? (
        <div className="rounded-lg bg-card px-6 py-3 shadow-sm">
          <p className="font-body text-xs font-semibold uppercase tracking-wide text-ink-400">
            {texts.success.orderNoLabel}
          </p>
          <p className="font-heading text-h3 font-bold text-ink-900">{texts.success.orderNo(order.id)}</p>
        </div>
      ) : null}

      <button
        onClick={() => navigate(`/order/${orderId}`, { replace: true })}
        className="press font-body text-base font-semibold text-brand-green"
      >
        {texts.success.viewStatus}
      </button>

      {showInAppCta ? (
        <Button variant="secondary" full className="mt-2 max-w-xs" onClick={() => navigate('/', { replace: true })}>
          {texts.success.toHome}
        </Button>
      ) : null}
    </div>
  );
}
