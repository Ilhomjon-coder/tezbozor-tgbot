import { useState } from 'react';
import { texts } from '@tezbozor/shared';
import { requestContactPhone, haptic, IN_TELEGRAM } from '../telegram';
import { Spinner, TextInput } from './ui';
import { EditIcon } from './icons';
import { useToast } from './Toast';

// Phone capture for onboarding: a prominent "share Telegram number" button that
// loads then fills the value from the Telegram contact dialog, plus a pencil to
// switch to manual entry. Outside Telegram it starts in manual mode.
export function PhoneField({
  value,
  onChange,
}: {
  value: string;
  onChange: (phone: string) => void;
}) {
  const toast = useToast();
  const [mode, setMode] = useState<'share' | 'manual'>(IN_TELEGRAM ? 'share' : 'manual');
  const [loading, setLoading] = useState(false);

  const share = async () => {
    if (loading) return;
    setLoading(true);
    haptic.tap();
    const num = await requestContactPhone();
    setLoading(false);
    if (num) {
      onChange(num.startsWith('+') ? num : `+${num}`);
      haptic.success();
    } else {
      // Declined or unsupported — let the user type it instead.
      toast.show(texts.onboarding.phoneShareFailed);
      setMode('manual');
    }
  };

  if (mode === 'manual') {
    return (
      <div>
        <TextInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={texts.onboarding.phonePlaceholder}
          inputMode="tel"
          autoComplete="tel"
          autoFocus={!value}
        />
        {IN_TELEGRAM ? (
          <button
            type="button"
            onClick={() => setMode('share')}
            className="press mt-2 font-body text-sm font-semibold text-brand-green"
          >
            {texts.onboarding.phoneShareToggle}
          </button>
        ) : null}
      </div>
    );
  }

  // share mode, already have a number → show it with an edit affordance.
  if (value) {
    return (
      <div className="flex h-12 items-center gap-2 rounded-md bg-brand-green-light px-4">
        <span className="flex-1 font-body text-base font-semibold text-brand-green-dark">
          📱 {value} <span className="text-brand-green">✓</span>
        </span>
        <button
          type="button"
          aria-label={texts.onboarding.phoneManual}
          onClick={() => setMode('manual')}
          className="press flex h-9 w-9 items-center justify-center rounded-pill text-brand-green-dark active:bg-brand-green/10"
        >
          <EditIcon size={18} />
        </button>
      </div>
    );
  }

  // share mode, no number yet → big share button + pencil to type manually.
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={share}
        disabled={loading}
        className="press flex h-12 flex-1 items-center justify-center gap-2 rounded-pill bg-brand-green font-body text-base font-semibold text-white shadow-green active:bg-brand-green-dark disabled:opacity-80"
      >
        {loading ? (
          <>
            <Spinner size={18} /> {texts.onboarding.phoneSharing}
          </>
        ) : (
          texts.onboarding.phoneShare
        )}
      </button>
      <button
        type="button"
        aria-label={texts.onboarding.phoneManual}
        onClick={() => setMode('manual')}
        className="press flex h-12 w-12 shrink-0 items-center justify-center rounded-pill border border-ink-200 text-ink-600 active:bg-ink-100"
      >
        <EditIcon size={20} />
      </button>
    </div>
  );
}
