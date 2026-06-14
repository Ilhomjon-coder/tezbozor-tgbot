import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { texts } from '@tezbozor/shared';
import { useBackButton } from '../lib/telegramButtons';
import { useOnline } from '../lib/useOnline';
import { BottomNav } from './BottomNav';
import { StickyCart } from './StickyCart';

// App shell: Telegram BackButton (every route except / and onboarding), the
// offline banner, the bottom tab bar and the sticky cart button. Focused flows
// (product sheet, cart, checkout, order) hide the tab bar and manage their own
// bottom CTA spacing.

const FOCUSED_PREFIXES = ['/onboarding', '/product', '/cart', '/checkout', '/order'];
const BROWSE_PREFIXES = ['/catalog', '/category', '/search'];

function startsWithAny(path: string, prefixes: string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(`${p}/`));
}

export function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const online = useOnline();

  const focused = startsWithAny(pathname, FOCUSED_PREFIXES);
  const showNav = !focused;
  const showCart = pathname === '/' || startsWithAny(pathname, BROWSE_PREFIXES);
  const backEnabled = pathname !== '/' && pathname !== '/onboarding';

  useBackButton(() => navigate(-1), backEnabled);

  const paddingBottom = `calc(${(showNav ? 72 : 8) + (showCart ? 56 : 0)}px + var(--safe-bottom))`;

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
      {showNav ? <BottomNav /> : null}
    </div>
  );
}
