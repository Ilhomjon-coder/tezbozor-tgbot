import type { ReactNode } from 'react';
import { texts } from '@tezbozor/shared';
import { Button, Spinner } from './ui';

// Shared loading / error / empty states.

export function LoadingScreen() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-ink-400">
      <Spinner size={28} className="text-brand-green" />
      <p className="font-body text-sm">{texts.common.loading}</p>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-gutter text-center">
      <p className="font-heading text-h3 text-ink-900">{texts.common.errorTitle}</p>
      <p className="font-body text-sm text-ink-600">{texts.common.errorBody}</p>
      {onRetry ? (
        <Button variant="ghost" onClick={onRetry} className="mt-1">
          {texts.common.retry}
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3 px-gutter text-center">
      {icon ? <div className="text-5xl">{icon}</div> : null}
      <p className="font-heading text-h3 text-ink-900">{title}</p>
      {body ? <p className="max-w-[18rem] font-body text-sm text-ink-600">{body}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
