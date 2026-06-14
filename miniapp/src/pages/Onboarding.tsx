import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { texts } from '@tezbozor/shared';
import { useProfile, useUpdateProfile } from '../api/hooks';
import { usePrimaryCta } from '../lib/telegramButtons';
import { getTelegramUser, haptic } from '../telegram';
import { Button, Field, TextInput } from '../components/ui';
import { PhoneField } from '../components/PhoneField';
import { useToast } from '../components/Toast';

// First-launch onboarding (PRD §6): name + phone only. Name is prefilled from
// Telegram initData; phone is prefilled from the profile if known, otherwise
// shared via the Telegram contact dialog (phone is NOT in initData) or typed.
// The delivery address is collected later, at checkout.
export function Onboarding() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const tgUser = useMemo(() => getTelegramUser(), []);
  const [name, setName] = useState(tgUser?.name ?? '');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  // Prefill from the backend profile once it loads (without clobbering edits).
  useEffect(() => {
    if (profile?.name) setName((n) => n || profile.name!);
    if (profile?.phone) setPhone((p) => p || profile.phone!);
  }, [profile?.name, profile?.phone]);

  const valid = name.trim().length > 0 && phone.trim().length > 0;

  const finish = async () => {
    if (!valid || saving) return;
    setSaving(true);
    try {
      await updateProfile.update({ name: name.trim(), phone: phone.trim() });
      haptic.success();
      navigate('/', { replace: true });
    } catch {
      haptic.error();
      toast.show(texts.common.errorBody);
      setSaving(false);
    }
  };

  const showInAppCta = usePrimaryCta({
    text: texts.onboarding.finishCta,
    onClick: finish,
    enabled: valid,
    loading: saving,
  });

  return (
    <div className="flex min-h-screen flex-col px-gutter pb-8 pt-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <img src="/tezbozor-mark.svg" alt={texts.appName} className="mb-3 h-16 w-16" />
        <h1 className="font-heading text-h2 text-ink-900">{texts.onboarding.welcomeTitle}</h1>
        <p className="mt-1 max-w-[20rem] font-body text-sm text-ink-600">
          {texts.onboarding.welcomeBody}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <Field label={texts.onboarding.nameLabel}>
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={texts.onboarding.namePlaceholder}
            autoComplete="name"
          />
        </Field>
        <Field label={texts.onboarding.phoneLabel} hint={texts.onboarding.contactHint}>
          <PhoneField value={phone} onChange={setPhone} />
        </Field>
      </div>

      {showInAppCta ? (
        <div className="mt-6">
          <Button full onClick={finish} disabled={!valid} loading={saving}>
            {texts.onboarding.finishCta}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
