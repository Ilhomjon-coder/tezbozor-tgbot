import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAHALLAS, texts } from '@tezbozor/shared';
import { useCreateAddress, useUpdateProfile } from '../api/hooks';
import { usePrimaryCta, useBackButton } from '../lib/telegramButtons';
import { requestContactPhone, haptic, IN_TELEGRAM } from '../telegram';
import { Button, Field, Select, TextInput } from '../components/ui';
import { useToast } from '../components/Toast';

// First-launch onboarding (PRD §6): max 2 steps — (1) name + phone (Telegram
// contact share, with manual fallback), (2) mahalla + house + landmark. On
// finish: PATCH /me then POST /me/addresses (default), then home.

export function Onboarding() {
  const navigate = useNavigate();
  const toast = useToast();
  const updateProfile = useUpdateProfile();
  const createAddress = useCreateAddress();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [mahalla, setMahalla] = useState('');
  const [house, setHouse] = useState('');
  const [landmark, setLandmark] = useState('');
  const [saving, setSaving] = useState(false);

  // Telegram back goes step 2 → step 1 (step 1 is the first screen — no back).
  useBackButton(() => setStep(1), step === 2);

  const step1Valid = name.trim().length > 0 && phone.trim().length > 0;
  const step2Valid = mahalla.length > 0 && house.trim().length > 0;

  const shareContact = async () => {
    const num = await requestContactPhone();
    if (num) {
      setPhone(num.startsWith('+') ? num : `+${num}`);
      haptic.success();
    }
  };

  const finish = async () => {
    if (!step2Valid || saving) return;
    setSaving(true);
    try {
      await updateProfile.update({ name: name.trim(), phone: phone.trim() });
      await createAddress.create({
        mahalla,
        house: house.trim(),
        landmark: landmark.trim() || undefined,
        isDefault: true,
      });
      haptic.success();
      navigate('/', { replace: true });
    } catch {
      haptic.error();
      toast.show(texts.common.errorBody);
      setSaving(false);
    }
  };

  const onPrimary = step === 1 ? () => step1Valid && setStep(2) : finish;
  const showInAppCta = usePrimaryCta({
    text: step === 1 ? texts.onboarding.next : texts.onboarding.finishCta,
    onClick: onPrimary,
    enabled: step === 1 ? step1Valid : step2Valid,
    loading: saving,
  });

  return (
    <div className="flex min-h-screen flex-col px-gutter pb-8 pt-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <img src="/tezbozor-mark.svg" alt={texts.appName} className="mb-3 h-16 w-16" />
        <h1 className="font-heading text-h2 text-ink-900">{texts.onboarding.welcomeTitle}</h1>
        {step === 1 ? (
          <p className="mt-1 max-w-[20rem] font-body text-sm text-ink-600">
            {texts.onboarding.welcomeBody}
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {step === 1 ? (
          <>
            <h2 className="font-heading text-h3 text-ink-900">{texts.onboarding.step1Title}</h2>
            <Field label={texts.onboarding.nameLabel}>
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={texts.onboarding.namePlaceholder}
                autoComplete="name"
              />
            </Field>
            <Field label={texts.onboarding.phoneLabel} hint={texts.onboarding.contactHint}>
              <TextInput
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={texts.onboarding.phonePlaceholder}
                inputMode="tel"
                autoComplete="tel"
              />
            </Field>
            {IN_TELEGRAM ? (
              <Button variant="secondary" full onClick={shareContact}>
                {phone ? texts.onboarding.contactShared : texts.onboarding.shareContact}
              </Button>
            ) : null}
          </>
        ) : (
          <>
            <h2 className="font-heading text-h3 text-ink-900">{texts.onboarding.step2Title}</h2>
            <Field label={texts.onboarding.mahallaLabel}>
              <Select
                value={mahalla}
                placeholder={texts.onboarding.mahallaPlaceholder}
                onChange={(e) => setMahalla(e.target.value)}
              >
                {MAHALLAS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={texts.onboarding.houseLabel}>
              <TextInput
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                placeholder={texts.onboarding.housePlaceholder}
              />
            </Field>
            <Field label={`${texts.onboarding.landmarkLabel} — ${texts.common.optional}`}>
              <TextInput
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={texts.onboarding.landmarkPlaceholder}
              />
            </Field>
          </>
        )}
      </div>

      {showInAppCta ? (
        <div className="mt-6">
          <Button
            full
            onClick={onPrimary}
            disabled={step === 1 ? !step1Valid : !step2Valid}
            loading={saving}
          >
            {step === 1 ? texts.onboarding.next : texts.onboarding.finishCta}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
