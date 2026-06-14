import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { texts } from '@tezbozor/shared';
import { useBackButton } from '../lib/telegramButtons';
import { useOnline } from '../lib/useOnline';
import { StickyCart } from './StickyCart';

// App shell: Telegram BackButton (every route except / and onboarding), the
// offline banner, and the sticky cart button. There is NO bottom tab bar — the
// design navigates via the home header avatar (→ profile), category chips, and
// the sticky cart button; everything else returns via the Telegram BackButton.

const BROWSE_PREFIXES = ['/catalog', '/category', '/search'];

function startsWithAny(path: string, prefixes: string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(`${p}/`));
}

export function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const online = useOnline();

  // Sticky cart appears only on browse screens (home/catalog/category/search).
  const showCart = pathname === '/' || startsWithAny(pathname, BROWSE_PREFIXES);
  const backEnabled = pathname !== '/' && pathname !== '/onboarding';

  useBackButton(() => navigate(-1), backEnabled);

  const paddingBottom = `calc(${showCart ? 76 : 12}px + var(--safe-bottom))`;

  return (
    <div className="mx-auto flex min-h-screen max-w-content flex-col bg-paper">
      {!online ? (
        <div className="sticky top-0 z-40 bg-danger px-gutter py-2 text-center font-body text-sm font-medium text-white">
          {texts.common.offline}
        </div>
      ) : null}

      <main className="flex-1 safe-top" style={{ paddingBottom }}>
        <Outlet />
      </main>

      {showCart ? <StickyCart /> : null}
    </div>
  );
}
