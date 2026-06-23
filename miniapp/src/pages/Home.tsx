import { useNavigate, useSearchParams } from 'react-router-dom';
import { texts } from '@tezbozor/shared';
import type { ProductDto } from '@tezbozor/shared/api';
import { useCategories, useOrders, useProducts, useProfile } from '../api/hooks';
import { useDeliveryClock, formatUzDate, splitHoursMinutes } from '../lib/deliveryClock';
import { useCart } from '../store/cart';
import { haptic } from '../telegram';
import { useToast } from '../components/Toast';
import { HomeBanner } from '../components/Banner';
import { ProductCard } from '../components/ProductCard';
import { ErrorState, LoadingScreen } from '../components/states';
import { AddButton, Badge, ProductImage } from '../components/ui';
import { SearchIcon, ChevronRight, UserIcon } from '../components/icons';

const ACTIVE_STATUSES = ['accepted', 'shopping', 'on_the_way'];

export function Home() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const promo = params.get('promo') === 'bozor';

  const clock = useDeliveryClock();
  const { data: profile } = useProfile();
  const { data: orders } = useOrders();
  const { data: categories } = useCategories();
  const products = useProducts();

  const activeOrder = orders?.find((o) => ACTIVE_STATUSES.includes(o.status));
  const productOfDay = products.data?.find((p) => p.isProductOfDay);
  const { hours, minutes } = splitHoursMinutes(clock.msUntilDeadline);

  return (
    <div className="flex flex-col gap-4 px-gutter pt-4">
      {/* Header: greeting + date + profile avatar */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-h2 text-ink-900">{texts.home.greeting}</h1>
          <p className="mt-0.5 font-body text-sm text-ink-600">📅 {formatUzDate(clock.now)}</p>
        </div>
        <button
          onClick={() => navigate('/profile')}
          aria-label={texts.nav.profile}
          className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-brand-green-light text-brand-green-dark"
        >
          {profile?.name ? (
            <span className="font-heading text-base font-bold">
              {profile.name.trim().charAt(0).toUpperCase()}
            </span>
          ) : (
            <UserIcon size={22} />
          )}
        </button>
      </header>

      {/* Active order bar */}
      {activeOrder ? (
        <button
          onClick={() => navigate(`/order/${activeOrder.id}`)}
          className="press flex items-center justify-between gap-2 rounded-lg bg-brand-green-light px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-green" />
            <span className="font-body text-sm font-semibold text-brand-green-dark">
              {texts.home.activeOrder(texts.labels.status[activeOrder.status])}
            </span>
          </span>
          <span className="font-body text-sm font-semibold text-brand-green">
            {texts.home.activeOrderView}
          </span>
        </button>
      ) : null}

      {/* Dynamic banner (PRD §7) */}
      <HomeBanner bannerKey={clock.bannerKey} promo={promo} />

      {/* Deadline line + countdown */}
      {clock.isAfterDeadline ? (
        <div className="rounded-lg bg-ink-100 px-4 py-3">
          <p className="font-body text-base font-semibold text-ink-900">
            {texts.home.deadlineClosedTitle}
          </p>
          <p className="mt-0.5 font-body text-sm text-ink-600">
            {texts.home.deadlineClosedSub(clock.deliveryRelDay)}
          </p>
        </div>
      ) : (
        <div className="rounded-lg bg-brand-green px-4 py-3 text-white">
          <p className="font-body text-base font-semibold">{texts.home.deadlineOpenTitle}</p>
          <p className="mt-0.5 font-body text-sm text-white/90">
            {texts.home.deadlineOpenSub(clock.deliveryRelDay)}
          </p>
          <p className="mt-1.5 font-body text-sm font-semibold">
            ⏳ {texts.home.countdownLabel(hours, minutes)}
          </p>
        </div>
      )}

      {/* Search entry */}
      <button
        onClick={() => navigate('/search')}
        className="press flex h-12 w-full items-center gap-2 rounded-pill border border-ink-200 bg-card px-4 text-left text-ink-400"
      >
        <SearchIcon size={20} />
        <span className="font-body text-base">{texts.home.searchPlaceholder}</span>
      </button>

      {/* Category chips (+ "Barchasi" → full catalog, since there's no tab bar) */}
      {categories && categories.length > 0 ? (
        <div className="no-scrollbar -mx-gutter flex gap-2 overflow-x-auto px-gutter">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/category/${c.slug}`)}
              className="press shrink-0 rounded-pill bg-card px-4 py-2 font-body text-sm font-semibold text-ink-900 shadow-xs"
            >
              {c.nameUz}
            </button>
          ))}
          <button
            onClick={() => navigate('/catalog')}
            className="press shrink-0 rounded-pill bg-brand-green-light px-4 py-2 font-body text-sm font-semibold text-brand-green-dark"
          >
            {texts.home.allCategories} →
          </button>
        </div>
      ) : null}

      {/* Product of the day */}
      {productOfDay ? <FeaturedCard product={productOfDay} /> : null}

      {/* Today's prices grid */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-h3 text-ink-900">{texts.home.todaysPricesTitle}</h2>
          <span className="flex items-center gap-1.5 font-body text-xs text-brand-green">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            {texts.home.pricesUpdated}
          </span>
        </div>

        {products.isLoading ? (
          <LoadingScreen />
        ) : products.isError ? (
          <ErrorState onRetry={() => products.refetch()} />
        ) : (products.data?.length ?? 0) === 0 ? (
          <p className="py-10 text-center font-body text-sm text-ink-400">{texts.home.empty}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.data!.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FeaturedCard({ product }: { product: ProductDto }) {
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  const toast = useToast();
  const canAdd = product.priceUzs != null;

  return (
    <div className="overflow-hidden rounded-lg bg-card shadow-sm">
      <div className="bg-brand-orange-light px-4 py-1.5">
        <Badge tone="orange">{texts.home.productOfDay}</Badge>
      </div>
      <div className="flex items-center gap-3 p-3">
        <button onClick={() => navigate(`/product/${product.id}`)} className="press shrink-0">
          <ProductImage src={product.imageUrl} alt={product.nameUz} className="h-16 w-16 rounded-md" />
        </button>
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="press flex-1 text-left"
        >
          <p className="font-body text-base font-semibold text-ink-900">{product.nameUz}</p>
          {canAdd ? (
            <p className="mt-0.5 font-body text-base font-bold text-ink-900">
              {texts.common.priceLine(product.priceUzs as number, product.unit)}
            </p>
          ) : (
            <p className="mt-0.5 font-body text-sm text-ink-400">Narx tez orada</p>
          )}
        </button>
        {canAdd ? (
          <AddButton
            onClick={() => {
              add({
                productId: product.id,
                unit: product.unit,
                name: product.nameUz,
                priceUzs: product.priceUzs as number,
                imageUrl: product.imageUrl,
              });
              haptic.tap();
              toast.show(texts.favorites.added);
            }}
          />
        ) : (
          <ChevronRight size={22} className="text-ink-400" />
        )}
      </div>
    </div>
  );
}
