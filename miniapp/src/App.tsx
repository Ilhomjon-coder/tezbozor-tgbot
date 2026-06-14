import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { parseStartParam } from '@tezbozor/shared';
import { initTelegram, getStartParam, IN_TELEGRAM } from './telegram';
import { ToastProvider } from './components/Toast';
import { AppLayout } from './components/AppLayout';
import { LoadingScreen } from './components/states';
import { useAddresses, useProfile } from './api/hooks';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Category } from './pages/Category';
import { Product } from './pages/Product';
import { Search } from './pages/Search';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { OrderStatus } from './pages/OrderStatus';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import { Addresses } from './pages/Addresses';
import { FavoritesList } from './pages/FavoritesList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

/** Handle a `startapp` deep link once on launch (contracts.md). */
function DeepLinkHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    const parsed = parseStartParam(getStartParam());
    if (!parsed) return;
    if (parsed.type === 'order') navigate(`/order/${parsed.orderId}`);
    else if (parsed.type === 'promo') navigate('/?promo=bozor');
  }, [navigate]);
  return null;
}

/**
 * Force first-time users through onboarding (phone + name + address). Only
 * enforced inside Telegram, where initData lets /me resolve; in a plain browser
 * the routes stay open for development.
 */
function OnboardingGate() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();

  if (!IN_TELEGRAM) return <Outlet />;
  if (profileLoading || addressesLoading) return <LoadingScreen />;

  const onboarded =
    !!profile?.name && !!profile?.phone && (addresses?.length ?? 0) > 0;
  if (!onboarded) return <Navigate to="/onboarding" replace />;

  return <Outlet />;
}

export default function App() {
  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <DeepLinkHandler />
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route element={<OnboardingGate />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/category/:slug" element={<Category />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/search" element={<Search />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order/:id/success" element={<OrderSuccess />} />
                <Route path="/order/:id" element={<OrderStatus />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/addresses" element={<Addresses />} />
                <Route path="/profile/list" element={<FavoritesList />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
