import { useNavigate } from 'react-router-dom';
import { texts, formatSom, type OrderStatus } from '@tezbozor/shared';
import type { OrderSummaryDto } from '@tezbozor/shared/api';
import { useOrders } from '../api/hooks';
import { dateLabel } from '../lib/deliveryClock';
import { useReorderToCart } from '../lib/useReorderToCart';
import { Badge, Button } from '../components/ui';
import { ChevronRight } from '../components/icons';
import { EmptyState, ErrorState, LoadingScreen } from '../components/states';

const ACTIVE: OrderStatus[] = ['accepted', 'shopping', 'on_the_way'];

function statusTone(status: OrderStatus): 'green' | 'orange' | 'neutral' | 'danger' {
  if (status === 'delivered') return 'green';
  if (status === 'cancelled') return 'danger';
  if (status === 'shopping' || status === 'on_the_way') return 'orange';
  return 'neutral';
}

// Orders (PRD §6): active order pinned, then history; each row links to status,
// past orders offer "Qayta buyurtma berish".
export function Orders() {
  const navigate = useNavigate();
  const { data: orders, isLoading, isError, refetch } = useOrders();

  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const active = (orders ?? []).filter((o) => ACTIVE.includes(o.status as OrderStatus));
  const past = (orders ?? []).filter((o) => !ACTIVE.includes(o.status as OrderStatus));

  if ((orders?.length ?? 0) === 0) {
    return (
      <EmptyState
        icon="🧾"
        title={texts.orders.emptyTitle}
        body={texts.orders.emptyBody}
        action={
          <Button variant="secondary" onClick={() => navigate('/')}>
            {texts.orders.emptyCta}
          </Button>
        }
      />
    );
  }

  return (
    <div className="px-gutter pt-4">
      <h1 className="mb-4 font-heading text-h1 text-ink-900">{texts.orders.title}</h1>

      {active.length > 0 ? (
        <section className="mb-6">
          <p className="mb-2 font-body text-sm font-semibold text-ink-600">{texts.orders.activePinned}</p>
          <div className="flex flex-col gap-3">
            {active.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        </section>
      ) : null}

      {past.length > 0 ? (
        <section>
          <p className="mb-2 font-body text-sm font-semibold text-ink-600">{texts.orders.history}</p>
          <div className="flex flex-col gap-3">
            {past.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function OrderCard({ order }: { order: OrderSummaryDto }) {
  const navigate = useNavigate();
  const reorder = useReorderToCart();
  const status = order.status as OrderStatus;
  const isActive = ACTIVE.includes(status);

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-body text-sm text-ink-600">
          {dateLabel(order.slot?.date) || dateLabel(order.createdAt)}
        </span>
        <Badge tone={statusTone(status)}>{texts.labels.status[status]}</Badge>
      </div>
      <p className="mt-1 font-heading text-lg font-bold text-ink-900">
        {formatSom(order.grandTotalUzs)}
        <span className="ml-2 font-body text-sm font-normal text-ink-400">{texts.success.orderNo(order.id)}</span>
      </p>

      <div className="mt-3 border-t border-ink-100 pt-3">
        {isActive ? (
          <button
            onClick={() => navigate(`/order/${order.id}`)}
            className="press flex min-h-tap w-full items-center justify-between font-body text-sm font-semibold text-brand-green"
          >
            {texts.orders.viewStatus}
            <ChevronRight size={18} />
          </button>
        ) : (
          <Button variant="ghost" full onClick={() => reorder.run(order.id)} loading={reorder.isPending}>
            🔄 {texts.orders.reorder}
          </Button>
        )}
      </div>
    </div>
  );
}
