import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initTelegram } from './telegram';
import { Home } from './pages/Home';

const queryClient = new QueryClient();

// Phase 0 shell: providers wired (TanStack Query, Router, Telegram SDK) with a
// single placeholder route. The 14 real routes (PRD §6) come in Phase 3.
export default function App() {
  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
