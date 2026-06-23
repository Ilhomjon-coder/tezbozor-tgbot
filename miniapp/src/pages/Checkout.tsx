import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  texts,
  formatSom,
  MAHALLAS,
  ACTIVE_PAYMENT_METHODS,
  PAYMENT_METHODS,
  type PaymentMethod,
} from '@tezbozor/shared';
import type { AddressDto, CreateOrderDto, SlotsResponseDtoSlotsItem } from '@tezbozor/shared/api';
import { useAddresses, useCreateAddress, useCreateOrder, useSlots } from '../api/hooks';
import { useCartPricing } from '../lib/useCartPricing';
import { useCart } from '../store/cart';
import { qtyToApiString } from '../lib/qty';
import { relativeDayWord, formatUzDate } from '../lib/deliveryClock';
import { usePrimaryCta } from '../lib/telegramButtons';
import { haptic } from '../telegram';
import { Button, Card, Divider, Field, Select, TextArea, TextInput } from '../components/ui';
import { EmptyState, LoadingScreen } from '../components/states';
import { useToast } from '../components/Toast';
import { PinIcon, CheckIcon } from '../components/icons';

// Checkout (PRD §6): address card + change, two morning-slot picker, payment
// (Naqd active / Click+Payme disabled), note, summary. Backend recomputes money
// on POST /orders; the summary here is the same preview as the cart.
export function Checkout() {
  const navigate = useNavigate();
  const toast = useToast();
  const { orderableLines, preview, count } = useCartPricing();
  const clearCart = useCart((s) => s.clear);

  const { data: addresses, isLoading: addrLoading } = useAddresses();
  const slotsQuery = useSlots();
  const createOrder = useCreateOrder();

  const [addressId, setAddressId] = useState<number | null>(null);
  const [slotId, setSlotId] = useState<number | null>(null);
  const [payment] = useState<PaymentMethod>('cash');
  const [note, setNote] = useState('');
  const [addrMode, setAddrMode] = useState<'view' | 'pick' | 'new'>('view');

  // Default address once loaded.
  useEffect(() => {
    if (addressId == null && addresses && addresses.length > 0) {
      setAddressId((addresses.find((a) => a.isDefault) ?? addresses[0]).id);
    }
  }, [addresses, addressId]);

  // Auto-select the most-chosen open slot, else the first open one.
  useEffect(() => {
    const slots = slotsQuery.data?.slots;
    if (slotId == null && slots && slots.length > 0) {
      const open = slots.filter((s) => s.isOpen && !s.isFull);
      const pick = open.find((s) => s.isMostChosen) ?? open[0];
      if (pick) setSlotId(pick.id);
    }
  }, [slotsQuery.data, slotId]);

  const selectedAddress = addresses?.find((a) => a.id === addressId);
  const deliveryDate = slotsQuery.data?.deliveryDate;
  const relDay = relativeDayWord(deliveryDate);
  const canPlace = addressId != null && slotId != null && orderableLines.length > 0 && preview.meetsMinimum;

  const place = async () => {
    if (!canPlace || addressId == null || slotId == null) return;
    const items: CreateOrderDto['items'] = orderableLines.map((l) => ({
      productId: l.line.productId,
      qty: qtyToApiString(l.line.qty),
      fallback: l.line.fallback,
      itemNote: l.line.itemNote,
    }));
    try {
      const order = await createOrder.create({
        addressId,
        slotId,
        paymentMethod: payment,
        customerNote: note.trim() || undefined,
        items,
      });
      haptic.success();
      clearCart();
      navigate(`/order/${order.id}/success`, { replace: true });
    } catch (e) {
      haptic.error();
      toast.show(e instanceof Error ? e.message : texts.common.errorBody);
    }
  };

  const showInAppCta = usePrimaryCta(
    count > 0
      ? {
          text: texts.checkout.confirmCtaWithSum(formatSom(preview.grandTotalUzs)),
          onClick: place,
          enabled: canPlace,
          loading: createOrder.isPending,
        }
      : null,
  );

  if (count === 0) {
    return (
      <EmptyState
        title={texts.cart.emptyTitle}
        body={texts.cart.emptyBody}
        action={
          <Button variant="secondary" onClick={() => navigate('/')}>
            {texts.cart.emptyCta}
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 px-gutter pt-4" style={{ paddingBottom: 160 }}>
        <h1 className="font-heading text-h2 text-ink-900">{texts.checkout.title}</h1>

        {/* 1. Address */}
        <section>
          <SectionLabel n={1} title={texts.checkout.addressSection} />
          {addrLoading ? (
            <Card className="p-4">
              <LoadingScreen />
            </Card>
          ) : (
            <AddressBlock
              addresses={addresses ?? []}
              mode={addrMode}
              setMode={setAddrMode}
              selectedId={addressId}
              setSelectedId={setAddressId}
              selected={selectedAddress}
            />
          )}
        </section>

        {/* 2. Slot */}
        <section>
          <SectionLabel n={2} title={texts.checkout.slotSection} />
          {slotsQuery.isLoading ? (
            <Card className="p-4">
              <LoadingScreen />
            </Card>
          ) : (
            <>
              <p className="mb-2 font-body text-sm text-ink-600">
                📅 {deliveryDate ? texts.checkout.slotDate(relDay, formatUzDate(toParts(deliveryDate))) : texts.checkout.slotPickHint}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(slotsQuery.data?.slots ?? []).map((s) => (
                  <SlotCard key={s.id} slot={s} selected={slotId === s.id} onSelect={() => setSlotId(s.id)} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* 3. Payment */}
        <section>
          <SectionLabel n={3} title={texts.checkout.paymentSection} />
          <div className="flex flex-col gap-3">
            {PAYMENT_METHODS.map((m) => {
              const active = ACTIVE_PAYMENT_METHODS.includes(m);
              const selected = payment === m;
              return (
                <div
                  key={m}
                  className={[
                    'flex items-center justify-between rounded-lg border bg-card p-4',
                    selected ? 'border-brand-green' : 'border-ink-200',
                    active ? '' : 'opacity-50',
                  ].join(' ')}
                >
                  <div>
                    <p className="font-body text-base font-semibold text-ink-900">
                      {m === 'cash' ? '💵 ' : ''}
                      {texts.labels.payment[m]}
                    </p>
                    <p className="font-body text-xs text-ink-400">
                      {active ? texts.labels.paymentSub[m] : texts.checkout.paymentSoon}
                    </p>
                  </div>
                  <RadioDot selected={selected && active} />
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Note */}
        <section>
          <SectionLabel n={4} title={`${texts.checkout.noteSection} — ${texts.common.optional}`} />
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={texts.checkout.notePlaceholder}
            maxLength={500}
          />
        </section>

        {/* 5. Summary */}
        <section>
          <SectionLabel n={5} title={texts.checkout.summarySection} />
          <Card className="p-4">
            <Row k={texts.cart.itemsRow(orderableLines.length)} v={formatSom(preview.itemsTotalUzs)} />
            <Row
              k={texts.cart.deliveryRow}
              v={preview.freeDelivery ? texts.cart.deliveryFree : formatSom(preview.deliveryFeeUzs)}
              green={preview.freeDelivery}
            />
            {slotId != null ? (
              <Row
                k={texts.checkout.slotRow}
                v={`${relDay}, ${slotsQuery.data?.slots.find((s) => s.id === slotId)?.label ?? ''}`}
                green
              />
            ) : null}
            <Divider className="my-3" />
            <div className="flex items-center justify-between">
              <span className="font-body text-base font-semibold text-ink-900">{texts.cart.totalRow}</span>
              <span className="font-heading text-h3 font-bold text-ink-900">{formatSom(preview.grandTotalUzs)}</span>
            </div>
          </Card>
        </section>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-content border-t border-ink-100 bg-card px-gutter pt-3"
        style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}
      >
        {!canPlace ? (
          <p className="mb-2 text-center font-body text-xs text-ink-400">
            {addressId == null ? texts.checkout.needAddress : slotId == null ? texts.checkout.needSlot : ''}
          </p>
        ) : null}
        {showInAppCta ? (
          <Button full onClick={place} disabled={!canPlace} loading={createOrder.isPending}>
            {texts.checkout.confirmCtaWithSum(formatSom(preview.grandTotalUzs))}
          </Button>
        ) : null}
      </div>
    </>
  );
}

function toParts(dateStr: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  const y = m ? Number(m[1]) : 2026;
  const mo = m ? Number(m[2]) : 1;
  const d = m ? Number(m[3]) : 1;
  const weekday = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
  return { year: y, month: mo, day: d, weekday };
}

function SectionLabel({ n, title }: { n: number; title: string }) {
  return (
    <p className="mb-2 font-body text-sm font-semibold text-ink-600">
      <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-pill bg-brand-green-light text-xs text-brand-green-dark">
        {n}
      </span>
      {title}
    </p>
  );
}

function Row({ k, v, green }: { k: string; v: string; green?: boolean }) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3 font-body text-base first:mt-0">
      <span className="shrink-0 text-ink-600">{k}</span>
      <span className={`text-right ${green ? 'font-semibold text-brand-green' : 'font-semibold text-ink-900'}`}>{v}</span>
    </div>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      className={[
        'flex h-5 w-5 items-center justify-center rounded-pill border-2',
        selected ? 'border-brand-green bg-brand-green text-white' : 'border-ink-200',
      ].join(' ')}
    >
      {selected ? <CheckIcon size={12} /> : null}
    </span>
  );
}

function SlotCard({
  slot,
  selected,
  onSelect,
}: {
  slot: SlotsResponseDtoSlotsItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const disabled = slot.isFull || !slot.isOpen;
  return (
    <button
      onClick={() => {
        if (disabled) return;
        haptic.select();
        onSelect();
      }}
      disabled={disabled}
      className={[
        'press relative flex flex-col items-start rounded-lg border p-3 text-left',
        disabled
          ? 'border-ink-200 bg-ink-100 opacity-60'
          : selected
            ? 'border-brand-green bg-brand-green text-white'
            : 'border-ink-200 bg-card',
      ].join(' ')}
    >
      <span className="font-heading text-base font-bold">{slot.label}</span>
      <span className={`mt-0.5 font-body text-xs ${selected ? 'text-white/90' : 'text-ink-400'}`}>
        {disabled ? texts.checkout.slotFull : slot.isMostChosen ? texts.checkout.slotMostChosen : ' '}
      </span>
      {selected ? <CheckIcon size={18} className="absolute right-2 top-2" /> : null}
    </button>
  );
}

function AddressBlock({
  addresses,
  mode,
  setMode,
  selectedId,
  setSelectedId,
  selected,
}: {
  addresses: AddressDto[];
  mode: 'view' | 'pick' | 'new';
  setMode: (m: 'view' | 'pick' | 'new') => void;
  selectedId: number | null;
  setSelectedId: (id: number) => void;
  selected?: AddressDto;
}) {
  const createAddress = useCreateAddress();
  const [mahalla, setMahalla] = useState('');
  const [house, setHouse] = useState('');
  const [landmark, setLandmark] = useState('');

  const addressLine = (a: AddressDto) =>
    `${a.mahalla}, ${a.house}${a.landmark ? ` · ${texts.addresses.landmarkPrefix}${a.landmark}` : ''}`;

  const saveNew = async () => {
    if (!mahalla || !house.trim()) return;
    try {
      const created = await createAddress.create({
        mahalla,
        house: house.trim(),
        landmark: landmark.trim() || undefined,
        isDefault: addresses.length === 0,
      });
      setSelectedId(created.id);
      setMode('view');
      setMahalla('');
      setHouse('');
      setLandmark('');
    } catch {
      /* surfaced by toast elsewhere; keep form open */
    }
  };

  if (mode === 'new') {
    return (
      <Card className="flex flex-col gap-3 p-4">
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
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setMode(addresses.length ? 'pick' : 'view')}>
            {texts.common.back}
          </Button>
          <Button variant="secondary" full onClick={saveNew} disabled={!mahalla || !house.trim()} loading={createAddress.isPending}>
            {texts.common.save}
          </Button>
        </div>
      </Card>
    );
  }

  if (mode === 'pick') {
    return (
      <Card className="flex flex-col gap-2 p-4">
        <p className="font-body text-sm text-ink-600">{texts.checkout.pickAddress}</p>
        {addresses.map((a) => (
          <button
            key={a.id}
            onClick={() => {
              setSelectedId(a.id);
              setMode('view');
            }}
            className="press flex items-center gap-3 rounded-lg border border-ink-100 p-3 text-left"
          >
            <PinIcon size={20} className="text-ink-400" />
            <span className="flex-1">
              <span className="block font-body text-base font-semibold text-ink-900">
                {a.mahalla}
                {a.isDefault ? <span className="ml-2 text-xs text-brand-green">{texts.checkout.defaultTag}</span> : null}
              </span>
              <span className="block font-body text-xs text-ink-400">{addressLine(a)}</span>
            </span>
            <RadioDot selected={selectedId === a.id} />
          </button>
        ))}
        <button onClick={() => setMode('new')} className="press inline-flex min-h-tap items-center font-body text-sm font-semibold text-brand-green">
          {texts.checkout.addAddress}
        </button>
      </Card>
    );
  }

  // view
  if (!selected) {
    return (
      <Card className="flex items-center justify-between p-4">
        <p className="font-body text-sm text-ink-600">{texts.checkout.noAddress}</p>
        <button onClick={() => setMode('new')} className="press inline-flex min-h-tap items-center font-body text-sm font-semibold text-brand-green">
          {texts.checkout.addAddress}
        </button>
      </Card>
    );
  }
  return (
    <Card className="flex items-start gap-3 p-4">
      <PinIcon size={22} className="mt-0.5 text-brand-green" />
      <div className="flex-1">
        <p className="font-body text-base font-semibold text-ink-900">{selected.mahalla}</p>
        <p className="mt-0.5 font-body text-sm text-ink-600">{addressLine(selected)}</p>
      </div>
      <button onClick={() => setMode('pick')} className="press inline-flex min-h-tap shrink-0 items-center font-body text-sm font-semibold text-brand-green">
        {texts.common.change}
      </button>
    </Card>
  );
}
