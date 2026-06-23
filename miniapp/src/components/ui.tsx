import type { ButtonHTMLAttributes, ReactNode, TextareaHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { formatQty, formatQtyShort } from '../lib/qty';
import type { Unit } from '@tezbozor/shared';
import { MinusIcon, PlusIcon, BasketIcon, ChevronDown } from './icons';

// Design-system primitives translated from designs/design-system tokens.
// Orange = CTA only; green = brand action; blue is forbidden (brandbook).

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variantClass: Record<Variant, string> = {
  primary: 'bg-brand-orange text-white shadow-orange active:bg-brand-orange-dark',
  secondary: 'bg-brand-green text-white shadow-green active:bg-brand-green-dark',
  ghost: 'bg-ink-100 text-ink-900 active:bg-ink-200',
  danger: 'bg-danger-light text-danger active:bg-danger/20',
};

export function Button({
  variant = 'primary',
  full,
  loading,
  className = '',
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  full?: boolean;
  loading?: boolean;
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        'press inline-flex h-12 items-center justify-center gap-2 rounded-pill px-5 font-body text-base font-semibold',
        full ? 'w-full' : '',
        isDisabled ? 'bg-ink-200 text-ink-400 shadow-none' : variantClass[variant],
        className,
      ].join(' ')}
    >
      {loading ? <Spinner size={18} /> : children}
    </button>
  );
}

export function Card({
  children,
  className = '',
  ...rest
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`rounded-lg bg-card shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = 'green',
  className = '',
}: {
  children: ReactNode;
  tone?: 'green' | 'orange' | 'neutral' | 'danger';
  className?: string;
}) {
  const tones: Record<string, string> = {
    green: 'bg-brand-green-light text-brand-green-dark',
    orange: 'bg-brand-orange-light text-brand-orange-dark',
    neutral: 'bg-ink-100 text-ink-600',
    danger: 'bg-danger-light text-danger',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function IconButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`press flex h-11 w-11 items-center justify-center rounded-pill text-ink-600 active:bg-ink-100 ${className}`}
    >
      {children}
    </button>
  );
}

export function Spinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Yuklanmoqda"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/** Round orange "+" for product cards/grid. */
export function AddButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label ?? 'Savatga qo‘shish'}
      className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-brand-orange text-white shadow-orange active:bg-brand-orange-dark"
    >
      <PlusIcon size={22} />
    </button>
  );
}

/** − qty + control. 44px hit areas everywhere (low-end Android, big targets).
 * `full` spans the width as a contained pill (product-card grid, where the unit
 * already sits on the price line, so the qty shows the number only and never
 * overflows the ~134px card). Inline (default) keeps the unit, e.g. "1.5 kg". */
export function Stepper({
  qty,
  unit,
  onDec,
  onInc,
  compact,
  full,
}: {
  qty: number;
  unit: Unit;
  onDec: () => void;
  onInc: () => void;
  compact?: boolean;
  full?: boolean;
}) {
  const btn = 'press flex h-11 w-11 shrink-0 items-center justify-center rounded-pill';
  if (full) {
    return (
      <div className="flex w-full items-center rounded-pill bg-ink-100 p-1">
        <button onClick={onDec} aria-label="Kamaytirish" className={`${btn} bg-card text-ink-900 shadow-xs active:bg-ink-200`}>
          <MinusIcon size={18} />
        </button>
        {/* flex-1 + min-w-0 so the qty fills the middle and the 44px buttons can
            never be pushed past the narrow card edge (truncates only at absurd qty). */}
        <span className="min-w-0 flex-1 truncate px-1 text-center font-body text-sm font-bold tabular-nums text-ink-900">
          {formatQtyShort(qty)}
        </span>
        <button onClick={onInc} aria-label="Ko‘paytirish" className={`${btn} bg-brand-green text-white active:bg-brand-green-dark`}>
          <PlusIcon size={18} />
        </button>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2">
      <button onClick={onDec} aria-label="Kamaytirish" className={`${btn} border border-ink-200 text-ink-900 active:bg-ink-100`}>
        <MinusIcon size={18} />
      </button>
      <span
        className={`min-w-14 text-center font-body font-semibold tabular-nums text-ink-900 ${compact ? 'text-sm' : 'text-base'}`}
      >
        {formatQty(qty, unit)}
      </span>
      <button onClick={onInc} aria-label="Ko‘paytirish" className={`${btn} bg-brand-green text-white active:bg-brand-green-dark`}>
        <PlusIcon size={18} />
      </button>
    </div>
  );
}

/** Product image, or a soft placeholder tile when the backend has no image. */
export function ProductImage({
  src,
  alt,
  className = '',
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
}) {
  if (src) {
    return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
  }
  return (
    <div className={`flex items-center justify-center bg-brand-green-light text-brand-green ${className}`}>
      <BasketIcon size={28} />
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-heading text-h3 text-ink-900">{children}</h2>
      {action}
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-body text-sm font-semibold text-ink-600">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-ink-400">{hint}</span> : null}
    </label>
  );
}

const fieldBase =
  'w-full rounded-md border border-ink-200 bg-card px-4 font-body text-base text-ink-900 placeholder:text-ink-400 focus:border-brand-green focus:outline-none';

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldBase} h-12 ${props.className ?? ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldBase} min-h-[88px] py-3 ${props.className ?? ''}`} />;
}

export function Select({
  children,
  placeholder,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { placeholder?: string }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`${fieldBase} h-12 appearance-none pr-10 ${props.value ? '' : 'text-ink-400'} ${props.className ?? ''}`}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      <ChevronDown size={20} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
    </div>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <div className={`h-px bg-ink-100 ${className}`} />;
}
