import { useNavigate } from 'react-router-dom';
import { texts } from '@tezbozor/shared';
import type { FavoriteDto } from '@tezbozor/shared/api';
import { useFavorites, useRemoveFavorite } from '../api/hooks';
import { useCart } from '../store/cart';
import { usePrimaryCta } from '../lib/telegramButtons';
import { haptic } from '../telegram';
import { Button, ProductImage } from '../components/ui';
import { useToast } from '../components/Toast';
import { EmptyState, LoadingScreen } from '../components/states';
import { TrashIcon } from '../components/icons';

// "Doimiy ro'yxatim" (PRD §6): saved staples with today's price; "Hammasini
// savatga" adds every available item in one tap.
export function FavoritesList() {
  const navigate = useNavigate();
  const { data: favorites, isLoading } = useFavorites();
  const removeFavorite = useRemoveFavorite();
  const add = useCart((s) => s.add);
  const toast = useToast();

  const available = (favorites ?? []).filter((f) => f.isActive && f.todayPriceUzs != null);

  const addAll = () => {
    if (available.length === 0) return;
    for (const f of available) {
      add({
        productId: f.productId,
        unit: f.unit,
        name: f.nameUz,
        priceUzs: f.todayPriceUzs as number,
        imageUrl: f.imageUrl,
      });
    }
    haptic.success();
    toast.show(texts.favorites.added);
    navigate('/cart');
  };

  const showInAppCta = usePrimaryCta(
    available.length > 0
      ? { text: texts.favorites.addAllCta(available.length), onClick: addAll }
      : null,
  );

  if (isLoading) return <LoadingScreen />;

  if ((favorites?.length ?? 0) === 0) {
    return (
      <EmptyState
        icon="🔁"
        title={texts.favorites.emptyTitle}
        body={texts.favorites.emptyBody}
        action={
          <Button variant="secondary" onClick={() => navigate('/catalog')}>
            {texts.favorites.emptyCta}
          </Button>
        }
      />
    );
  }

  return (
    <div className="px-gutter pt-4" style={{ paddingBottom: 96 }}>
      <h1 className="mb-1 font-heading text-h1 text-ink-900">{texts.favorites.title}</h1>
      <p className="mb-4 font-body text-sm text-ink-600">{texts.favorites.intro}</p>

      <div className="flex flex-col gap-3">
        {favorites!.map((f) => (
          <FavoriteRow key={f.productId} fav={f} onRemove={() => removeFavorite.remove(f.productId)} />
        ))}
      </div>

      {showInAppCta ? (
        <Button full className="mt-5" onClick={addAll}>
          🛒 {texts.favorites.addAllCta(available.length)}
        </Button>
      ) : null}
    </div>
  );
}

function FavoriteRow({ fav, onRemove }: { fav: FavoriteDto; onRemove: () => void }) {
  const navigate = useNavigate();
  const unavailable = !fav.isActive || fav.todayPriceUzs == null;
  return (
    <div className="flex items-center gap-3 rounded-lg bg-card p-4 shadow-sm">
      <button onClick={() => navigate(`/product/${fav.productId}`)} className="press shrink-0">
        <ProductImage src={fav.imageUrl} alt={fav.nameUz} className="h-12 w-12 rounded-md" />
      </button>
      <div className="flex-1">
        <p className="font-body text-base font-semibold text-ink-900">{fav.nameUz}</p>
        {unavailable ? (
          <p className="font-body text-xs font-medium text-danger">{texts.favorites.unavailableToday}</p>
        ) : (
          <p className="font-body text-base font-semibold text-ink-900">{texts.common.priceLine(fav.todayPriceUzs as number, fav.unit)}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        aria-label={texts.favorites.remove}
        className="press -mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-ink-400 active:bg-ink-100"
      >
        <TrashIcon size={18} />
      </button>
    </div>
  );
}
