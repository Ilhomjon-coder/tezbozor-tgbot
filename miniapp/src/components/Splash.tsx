import { texts } from '@tezbozor/shared';

// Brand splash (design screen 02): full-screen green, centred logo + name +
// tagline, city footer. Shown on launch and during the initial profile load.
export function Splash() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-green px-gutter text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-brand-green-dark shadow-md">
        <img src="/tezbozor-mark.svg" alt={texts.appName} className="h-14 w-14" />
      </div>
      <h1 className="mt-6 font-heading text-h1 font-extrabold text-white">{texts.appName}</h1>
      <p className="mt-2 max-w-[16rem] font-body text-base text-white/90">{texts.splash.tagline}</p>
      <p
        className="absolute inset-x-0 text-center font-body text-sm text-white/70"
        style={{ bottom: 'calc(24px + var(--safe-bottom))' }}
      >
        {texts.splash.city}
      </p>
    </div>
  );
}
