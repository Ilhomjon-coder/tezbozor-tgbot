import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { texts } from '@tezbozor/shared';
import { useCategories, useProducts } from '../api/hooks';
import { ProductCard } from '../components/ProductCard';
import { EmptyState, ErrorState, LoadingScreen } from '../components/states';

// Products of one category, sorted "Arzon avval" (cheapest first) — the only
// sort per PRD §6. Products with no price today go last.
export function Category() {
  const { slug } = useParams<{ slug: string }>();
  const { data: categories } = useCategories();
  const { data: products, isLoading, isError, refetch } = useProducts();

  const category = categories?.find((c) => c.slug === slug);

  const sorted = useMemo(() => {
    const list = (products ?? []).filter((p) => p.categoryId === category?.id);
    return list.sort((a, b) => {
      const pa = a.priceUzs ?? Number.POSITIVE_INFINITY;
      const pb = b.priceUzs ?? Number.POSITIVE_INFINITY;
      return pa - pb;
    });
  }, [products, category?.id]);

  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="px-gutter pt-4">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="font-heading text-h2 text-ink-900">{category?.nameUz ?? texts.catalog.title}</h1>
        <span className="font-body text-xs text-ink-400">{texts.category.sortCheapest}</span>
      </div>

      {sorted.length === 0 ? (
        <EmptyState title={texts.category.empty} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
