import { useState } from 'react';
import { texts } from '@tezbozor/shared';
import { haptic } from '../telegram';
import { Button } from './ui';
import { ChevronRight } from './icons';

// First-launch intro carousel (design screens 03–06), shown before the register
// form and skippable. Marketing only — 4 slides: a tinted hero card with two
// floating badge chips, a bold title and body, dots, and the orange CTA. Strings
// live in shared texts; this file owns only the visual structure (emoji, tint,
// chip placement). "O'tkazib yuborish" / the final "Boshlash" both call onDone.

type ChipPos = 'tl' | 'tr' | 'bl' | 'br';
type Tone = 'green' | 'orange';

interface Slide {
  hero?: string;
  tint?: Tone;
  final?: boolean;
  chips?: { pos: ChipPos; tone: Tone; ic: string }[];
}

const SLIDES: Slide[] = [
  { hero: '🛒', tint: 'green', chips: [
    { pos: 'tl', tone: 'orange', ic: '⚡' },
    { pos: 'br', tone: 'green', ic: '🥬' },
  ] },
  { hero: '🚚', tint: 'orange', chips: [
    { pos: 'tr', tone: 'orange', ic: '🕘' },
    { pos: 'bl', tone: 'green', ic: '📅' },
  ] },
  { hero: '🏷️', tint: 'green', chips: [
    { pos: 'tl', tone: 'green', ic: '📉' },
    { pos: 'br', tone: 'orange', ic: '🥬' },
  ] },
  { final: true },
];

const POS: Record<ChipPos, string> = {
  tl: 'left-2 top-3',
  tr: 'right-2 top-3',
  bl: 'left-2 bottom-3',
  br: 'right-2 bottom-3',
};

function Chip({ pos, tone, ic, label }: { pos: ChipPos; tone: Tone; ic: string; label: string }) {
  return (
    <span
      className={`absolute ${POS[pos]} inline-flex items-center gap-1 rounded-pill bg-card px-3 py-1.5 text-xs font-semibold shadow-md ${
        tone === 'orange' ? 'text-brand-orange' : 'text-brand-green-dark'
      }`}
    >
      <span>{ic}</span>
      {label}
    </span>
  );
}

function Scene({ slide, chips }: { slide: Slide; chips: readonly string[] }) {
  if (slide.final) {
    return (
      <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-brand-green-light shadow-sm">
        <img src="/tezbozor-mark.svg" alt={texts.appName} className="h-16 w-16" />
      </div>
    );
  }
  return (
    <div
      className={`relative flex h-52 w-52 items-center justify-center rounded-xl ${
        slide.tint === 'orange' ? 'bg-brand-orange-light' : 'bg-brand-green-light'
      }`}
    >
      <span className="text-7xl leading-none">{slide.hero}</span>
      {slide.chips?.map((c, i) => (
        <Chip key={i} pos={c.pos} tone={c.tone} ic={c.ic} label={chips[i] ?? ''} />
      ))}
    </div>
  );
}

export function OnboardingIntro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const last = SLIDES.length - 1;
  const isLast = step === last;
  const slide = SLIDES[step];
  const copy = texts.onboarding.intro[step];

  const next = () => {
    haptic.tap();
    if (isLast) onDone();
    else setStep((s) => s + 1);
  };
  const back = () => {
    haptic.tap();
    setStep((s) => Math.max(0, s - 1));
  };
  const skip = () => {
    haptic.tap();
    onDone();
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-paper px-gutter"
      style={{
        paddingTop: 'calc(var(--safe-top) + 12px)',
        paddingBottom: 'calc(var(--safe-bottom) + 16px)',
      }}
    >
      {/* Top: back + skip */}
      <div className="flex h-11 items-center justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            aria-label={texts.common.back}
            className="press flex h-11 w-11 -ml-2 items-center justify-center rounded-pill text-ink-600 active:bg-ink-100"
          >
            <ChevronRight size={24} className="rotate-180" />
          </button>
        ) : (
          <span className="h-11 w-11" />
        )}
        {!isLast ? (
          <button
            type="button"
            onClick={skip}
            className="press -mr-1 inline-flex min-h-tap items-center px-2 font-body text-sm font-semibold text-ink-400"
          >
            {texts.onboarding.introSkip}
          </button>
        ) : null}
      </div>

      {/* Body: hero + title + text, re-animated each slide */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div key={step} className="animate-fade-up flex flex-col items-center">
          <Scene slide={slide} chips={copy.chips} />
          <h1 className="mt-8 max-w-xs font-heading text-h1 text-ink-900">{copy.title}</h1>
          <p className="mt-3 max-w-xs font-body text-base leading-normal text-ink-600">{copy.body}</p>
        </div>
      </div>

      {/* Foot: dots + CTA */}
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-pill transition-all ${i === step ? 'w-5 bg-brand-green' : 'w-2 bg-ink-200'}`}
            />
          ))}
        </div>
        <Button full onClick={next}>
          {isLast ? texts.onboarding.finishCta : `${texts.onboarding.next} →`}
        </Button>
      </div>
    </div>
  );
}
