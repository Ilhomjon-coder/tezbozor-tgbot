import { useMemo, useState } from 'react';
import { texts } from '@tezbozor/shared';
import { useProducts, useSendWish } from '../api/hooks';
import { ProductCard } from '../components/ProductCard';
import { Button, TextArea } from '../components/ui';
import { SearchIcon } from '../components/icons';
import { useToast } from '../components/Toast';
import { haptic } from '../telegram';

// Search by product name (client-side over the cached catalog — the backend
// declares no search params). Empty result → wishes capture (POST /wishes,
// demand research) per PRD §6.
export function Search() {
  const { data: products } = useProducts();
  const sendWish = useSendWish();
  const toast = useToast();

  const [query, setQuery] = useState('');
  const [wish, setWish] = useState('');
  const [wishSent, setWishSent] = useState(false);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [];
    return (products ?? []).filter((p) => p.nameUz.toLowerCase().includes(q));
  }, [products, q]);

  const submitWish = async () => {
    const text = (wish.trim() || query.trim());
    if (!text) return;
    try {
      await sendWish.send({ text });
      setWishSent(true);
      haptic.success();
      toast.show(texts.search.wishSent);
    } catch {
      toast.show(texts.common.errorBody);
    }
  };

  return (
    <div className="px-gutter pt-4">
      <div className="mb-4 flex h-12 items-center gap-2 rounded-pill border border-ink-200 bg-card px-4">
        <SearchIcon size={20} className="text-ink-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setWishSent(false);
          }}
          placeholder={texts.search.placeholder}
          className="flex-1 bg-transparent font-body text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>

      {!q ? (
        <p className="py-12 text-center font-body text-sm text-ink-400">{texts.search.hint}</p>
      ) : results.length > 0 ? (
        <>
          <p className="mb-3 font-body text-sm text-ink-600">
            {texts.search.resultsFor(query.trim())} · {texts.search.resultCount(results.length)}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 px-2 pt-8 text-center">
          <div className="text-5xl">🔍</div>
          <p className="font-heading text-h3 text-ink-900">{texts.search.emptyTitle}</p>
          <p className="max-w-[20rem] font-body text-sm text-ink-600">{texts.search.emptyBody}</p>
          {wishSent ? (
            <p className="mt-2 font-body text-base font-semibold text-brand-green">
              {texts.search.wishSent}
            </p>
          ) : (
            <div className="mt-2 w-full">
              <TextArea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder={texts.search.wishPlaceholder}
              />
              <Button
                variant="secondary"
                full
                className="mt-3"
                onClick={submitWish}
                loading={sendWish.isPending}
              >
                {texts.search.wishSend}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
