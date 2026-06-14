import { texts } from '@tezbozor/shared';
import type { BannerKey } from '../lib/deliveryClock';

// Dynamic home banner (PRD §7). Backend has no banner key, so the key is derived
// from the delivery-day weekday in deliveryClock.ts; here we map key → Uzbek text
// + colour. Colours come straight from the PRD table.

const styleByKey: Record<BannerKey, string> = {
  // light orange #FFF1E0
  market_day: 'bg-brand-orange-light text-brand-orange-dark',
  // green
  bozor_narxida: 'bg-brand-green text-white',
  // light green #E6F4EC
  hafta_zaxirasi: 'bg-brand-green-light text-brand-green-dark',
  // light green (fallback)
  fallback: 'bg-brand-green-light text-brand-green-dark',
};

export function HomeBanner({ bannerKey, promo }: { bannerKey: BannerKey; promo?: boolean }) {
  const text = promo ? texts.banner.promoBozor : texts.banner[bannerKey];
  const style = promo ? styleByKey.market_day : styleByKey[bannerKey];
  return (
    <div className={`rounded-lg px-4 py-3.5 font-body text-base font-semibold leading-snug ${style}`}>
      {text}
    </div>
  );
}
