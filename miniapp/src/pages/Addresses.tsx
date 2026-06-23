import { useState } from 'react';
import { MAHALLAS, texts } from '@tezbozor/shared';
import type { AddressDto } from '@tezbozor/shared/api';
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from '../api/hooks';
import { haptic } from '../telegram';
import { Button, Card, Field, Select, TextInput } from '../components/ui';
import { useToast } from '../components/Toast';
import { EmptyState, LoadingScreen } from '../components/states';
import { PinIcon } from '../components/icons';

// Addresses (PRD §6): list + add/edit/delete, mahalla + house + landmark, NO map.
export function Addresses() {
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const toast = useToast();

  const [form, setForm] = useState<{ id: number | null } | null>(null);
  const [mahalla, setMahalla] = useState('');
  const [house, setHouse] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  if (isLoading) return <LoadingScreen />;

  const openAdd = () => {
    setForm({ id: null });
    setMahalla('');
    setHouse('');
    setLandmark('');
    setIsDefault((addresses?.length ?? 0) === 0);
  };
  const openEdit = (a: AddressDto) => {
    setForm({ id: a.id });
    setMahalla(a.mahalla);
    setHouse(a.house);
    setLandmark(a.landmark ?? '');
    setIsDefault(a.isDefault);
  };

  const save = async () => {
    if (!mahalla || !house.trim() || !form) return;
    const payload = { mahalla, house: house.trim(), landmark: landmark.trim() || undefined, isDefault };
    try {
      if (form.id == null) await createAddress.create(payload);
      else await updateAddress.update(form.id, payload);
      haptic.success();
      toast.show(texts.profile.saved);
      setForm(null);
    } catch {
      toast.show(texts.common.errorBody);
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteAddress.remove(id);
      haptic.tap();
      setConfirmId(null);
    } catch {
      toast.show(texts.common.errorBody);
    }
  };

  if (form) {
    return (
      <div className="px-gutter pt-4">
        <h1 className="mb-4 font-heading text-h2 text-ink-900">
          {form.id == null ? texts.addresses.addTitle : texts.addresses.editTitle}
        </h1>
        <div className="flex flex-col gap-3">
          <Field label={texts.addresses.mahallaLabel}>
            <Select value={mahalla} placeholder={texts.addresses.mahallaPlaceholder} onChange={(e) => setMahalla(e.target.value)}>
              {MAHALLAS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={texts.addresses.houseLabel}>
            <TextInput value={house} onChange={(e) => setHouse(e.target.value)} placeholder={texts.addresses.housePlaceholder} />
          </Field>
          <Field label={`${texts.addresses.landmarkLabel} — ${texts.common.optional}`}>
            <TextInput value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder={texts.addresses.landmarkPlaceholder} />
          </Field>
          <label className="flex min-h-tap items-center gap-3 py-1">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-5 w-5 accent-brand-green"
            />
            <span className="font-body text-sm text-ink-900">{texts.addresses.makeDefault}</span>
          </label>
          <div className="mt-2 flex gap-3">
            <Button variant="ghost" onClick={() => setForm(null)}>
              {texts.common.cancel}
            </Button>
            <Button
              variant="secondary"
              full
              onClick={save}
              disabled={!mahalla || !house.trim()}
              loading={createAddress.isPending || updateAddress.isPending}
            >
              {texts.common.save}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-gutter pt-4">
      <h1 className="mb-4 font-heading text-h1 text-ink-900">{texts.addresses.title}</h1>

      {(addresses?.length ?? 0) === 0 ? (
        <EmptyState
          icon="📍"
          title={texts.addresses.emptyTitle}
          body={texts.addresses.emptyBody}
          action={
            <Button variant="secondary" onClick={openAdd}>
              {texts.addresses.addNew}
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {addresses!.map((a) => (
              <Card key={a.id} className="p-4">
                <div className="flex items-start gap-3">
                  <PinIcon size={22} className="mt-0.5 text-brand-green" />
                  <div className="flex-1">
                    <p className="font-body text-base font-semibold text-ink-900">
                      {a.mahalla}
                      {a.isDefault ? <span className="ml-2 text-xs text-brand-green">{texts.addresses.defaultTag}</span> : null}
                    </p>
                    <p className="mt-0.5 font-body text-sm text-ink-600">
                      {a.house}
                      {a.landmark ? ` · ${texts.addresses.landmarkPrefix}${a.landmark}` : ''}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 border-t border-ink-100 pt-3">
                  <button onClick={() => openEdit(a)} className="press inline-flex min-h-tap items-center font-body text-sm font-semibold text-brand-green">
                    {texts.common.edit}
                  </button>
                  {confirmId === a.id ? (
                    <span className="ml-auto flex items-center gap-3">
                      <span className="font-body text-sm text-ink-600">{texts.addresses.deleteConfirm}</span>
                      <button onClick={() => remove(a.id)} className="press inline-flex min-h-tap items-center px-3 font-body text-sm font-semibold text-danger">
                        {texts.common.yes}
                      </button>
                      <button onClick={() => setConfirmId(null)} className="press inline-flex min-h-tap items-center px-3 font-body text-sm text-ink-400">
                        {texts.common.no}
                      </button>
                    </span>
                  ) : (
                    <button onClick={() => setConfirmId(a.id)} className="press ml-auto inline-flex min-h-tap items-center font-body text-sm font-semibold text-danger">
                      {texts.common.delete}
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <Button variant="ghost" full className="mt-4" onClick={openAdd}>
            {texts.addresses.addNew}
          </Button>
        </>
      )}
    </div>
  );
}
