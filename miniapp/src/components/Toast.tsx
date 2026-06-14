import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

// Minimal ephemeral toast (no extra deps, no extra store). One message at a time,
// auto-dismisses. Used for "Savatga qo‘shildi", "Saqlandi", wish-sent, etc.

interface ToastApi {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastApi>({ show: () => {} });

export function useToast(): ToastApi {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {message ? (
        <div className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4" style={{ bottom: 'calc(96px + var(--safe-bottom))' }}>
          <div className="pointer-events-auto max-w-content rounded-pill bg-ink-900/95 px-5 py-2.5 text-center font-body text-sm font-medium text-white shadow-lg">
            {message}
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}
