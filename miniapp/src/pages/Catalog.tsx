import { useNavigate } from 'react-router-dom';
import { texts } from '@tezbozor/shared';
import { useCategories, useProducts } from '../api/hooks';
import { ErrorState, LoadingScreen } from '../components/states';
import { ChevronRight } from '../components/icons';

// Category list (PRD §6). Each row links to /category/:slug with a product count.
export function Catalog() {
  const navigate = useNavigate();
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const { data: products } = useProducts();

  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const countByCat = new Map<number, number>();
  for (const p of products ?? []) {
    countByCat.set(p.categoryId, (countByCat.get(p.categoryId) ?? 0) + 1);
  }

  return (
    <div className="px-gutter pt-4">
      <h1 className="mb-1 font-heading text-h1 text-ink-900">{texts.catalog.title}</h1>
      <p className="mb-4 font-body text-sm text-ink-600">{texts.catalog.subtitle}</p>

      <div className="flex flex-col gap-2.5">
        {(categories ?? []).map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/category/${c.slug}`)}
            className="press flex items-center justify-between gap-3 rounded-lg bg-card p-4 text-left shadow-sm"
          >
            <span>
              <span className="block font-body text-base font-semibold text-ink-900">{c.nameUz}</span>
              <span className="mt-0.5 block font-body text-xs text-ink-400">
                {texts.catalog.productsCount(countByCat.get(c.id) ?? 0)}
              </span>
            </span>
            <ChevronRight size={22} className="text-ink-400" />
          </button>
        ))}
      </div>
    </div>
  );
}
