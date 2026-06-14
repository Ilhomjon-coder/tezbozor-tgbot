import { NavLink } from 'react-router-dom';
import { texts } from '@tezbozor/shared';
import { haptic } from '../telegram';
import { HomeIcon, GridIcon, BagIcon, UserIcon } from './icons';

// Bottom tab bar: Asosiy / Katalog / Buyurtmalar / Profil (PRD §6). Cart is NOT
// a tab — it's the sticky button above this bar (StickyCart).

const tabs = [
  { to: '/', label: texts.nav.home, Icon: HomeIcon, end: true },
  { to: '/catalog', label: texts.nav.catalog, Icon: GridIcon, end: false },
  { to: '/orders', label: texts.nav.orders, Icon: BagIcon, end: false },
  { to: '/profile', label: texts.nav.profile, Icon: UserIcon, end: false },
];

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-content items-stretch border-t border-ink-100 bg-card"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => haptic.select()}
          className="flex flex-1 flex-col items-center gap-0.5 py-2.5"
        >
          {({ isActive }) => (
            <>
              <Icon size={24} className={isActive ? 'text-brand-green' : 'text-ink-400'} />
              <span
                className={`font-body text-xs font-medium ${isActive ? 'text-brand-green' : 'text-ink-400'}`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
