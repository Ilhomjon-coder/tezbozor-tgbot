import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { texts } from '@tezbozor/shared';
import { useProfile, useUpdateProfile } from '../api/hooks';
import { haptic } from '../telegram';
import { Button, Card, Field, TextInput } from '../components/ui';
import { useToast } from '../components/Toast';
import { LoadingScreen } from '../components/states';
import { ChevronRight, UserIcon } from '../components/icons';

// Profile hub (PRD §6): name + phone (editable inline), links to Buyurtmalar,
// Manzillarim, Doimiy ro'yxatim, Biz haqimizda.
export function Profile() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const toast = useToast();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    setName(profile?.name ?? '');
    setPhone(profile?.phone ?? '');
  }, [profile?.name, profile?.phone]);

  if (isLoading) return <LoadingScreen />;

  const save = async () => {
    try {
      await updateProfile.update({ name: name.trim(), phone: phone.trim() });
      haptic.success();
      setEditing(false);
      toast.show(texts.profile.saved);
    } catch {
      toast.show(texts.common.errorBody);
    }
  };

  const menu = [
    { label: texts.profile.ordersHistory, sub: texts.profile.ordersHistorySub, to: '/orders' },
    { label: texts.profile.addresses, sub: texts.profile.addressesSub, to: '/profile/addresses' },
    { label: texts.profile.favorites, sub: texts.profile.favoritesSub, to: '/profile/list' },
  ];

  return (
    <div className="px-gutter pt-4">
      <h1 className="mb-4 font-heading text-h1 text-ink-900">{texts.profile.title}</h1>

      <Card className="p-4">
        {editing ? (
          <div className="flex flex-col gap-3">
            <Field label={texts.profile.nameLabel}>
              <TextInput value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label={texts.profile.phoneLabel}>
              <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
            </Field>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setEditing(false)}>
                {texts.common.cancel}
              </Button>
              <Button variant="secondary" full onClick={save} loading={updateProfile.isPending}>
                {texts.common.save}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-brand-green-light text-brand-green-dark">
              {profile?.name ? (
                <span className="font-heading text-h3 font-bold">{profile.name.trim().charAt(0).toUpperCase()}</span>
              ) : (
                <UserIcon size={26} />
              )}
            </span>
            <div className="flex-1">
              <p className="font-heading text-h3 text-ink-900">{profile?.name || '—'}</p>
              <p className="font-body text-sm text-ink-600">{profile?.phone || '—'}</p>
            </div>
            <button onClick={() => setEditing(true)} className="press font-body text-sm font-semibold text-brand-green">
              {texts.profile.editProfile}
            </button>
          </div>
        )}
      </Card>

      <div className="mt-4 flex flex-col gap-2.5">
        {menu.map((m) => (
          <button
            key={m.to}
            onClick={() => navigate(m.to)}
            className="press flex items-center justify-between gap-3 rounded-lg bg-card p-4 text-left shadow-sm"
          >
            <span>
              <span className="block font-body text-base font-semibold text-ink-900">{m.label}</span>
              <span className="mt-0.5 block font-body text-xs text-ink-400">{m.sub}</span>
            </span>
            <ChevronRight size={22} className="text-ink-400" />
          </button>
        ))}

        <button
          onClick={() => setAboutOpen((v) => !v)}
          className="press flex items-center justify-between gap-3 rounded-lg bg-card p-4 text-left shadow-sm"
        >
          <span>
            <span className="block font-body text-base font-semibold text-ink-900">{texts.profile.about}</span>
            <span className="mt-0.5 block font-body text-xs text-ink-400">{texts.profile.aboutSub}</span>
          </span>
          <ChevronRight size={22} className={`text-ink-400 transition-transform ${aboutOpen ? 'rotate-90' : ''}`} />
        </button>
        {aboutOpen ? (
          <Card className="p-4">
            <p className="font-body text-sm leading-relaxed text-ink-600">{texts.profile.aboutText}</p>
          </Card>
        ) : null}
      </div>

      <p className="mt-6 text-center font-body text-xs text-ink-400">{texts.profile.version}</p>
    </div>
  );
}
