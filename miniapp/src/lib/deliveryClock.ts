import { useEffect, useState } from 'react';
import { texts } from '@tezbozor/shared';

// All business time is Asia/Tashkent (root CLAUDE.md iron rule #2). We read the
// device clock and convert to Tashkent wall-clock parts via Intl — no fixed
// offset assumed, and the 21:00 boundary is verifiable by changing the clock.
//
// The dynamic home banner (PRD §7) is keyed to the DELIVERY day, which is
// tomorrow before the 21:00 deadline and the day after once it passes — so the
// banner shifts automatically at 21:00. Money never lives here; this is pure
// time/display logic. The backend's `deliveryDate` (from GET /slots) is the
// authority used at checkout; this client clock drives the home presentation.

const TZ = 'Asia/Tashkent';
const DEADLINE_HOUR = 21;

export type BannerKey = 'market_day' | 'bozor_narxida' | 'hafta_zaxirasi' | 'fallback';

export interface DateParts {
  year: number;
  month: number; // 1-12
  day: number;
  /** 0=Sunday … 6=Saturday */
  weekday: number;
}

interface WallClock extends DateParts {
  hour: number;
  minute: number;
  second: number;
}

const partsFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

/** Weekday (0=Sun) for a calendar date, timezone-independent. */
function weekdayOf(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** Current Tashkent wall clock. */
export function tashkentNow(date: Date = new Date()): WallClock {
  const map: Record<string, number> = {};
  for (const p of partsFmt.formatToParts(date)) {
    if (p.type !== 'literal') map[p.type] = Number(p.value);
  }
  // `hour` can come back as 24 at midnight in some engines — normalize.
  const hour = map.hour === 24 ? 0 : map.hour;
  return {
    year: map.year,
    month: map.month,
    day: map.day,
    hour,
    minute: map.minute,
    second: map.second,
    weekday: weekdayOf(map.year, map.month, map.day),
  };
}

/** Add `n` days to a calendar date, returning normalized parts. */
function addDays(parts: DateParts, n: number): DateParts {
  const d = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  d.setUTCDate(d.getUTCDate() + n);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    weekday: d.getUTCDay(),
  };
}

function isoOf(parts: DateParts): string {
  const mm = String(parts.month).padStart(2, '0');
  const dd = String(parts.day).padStart(2, '0');
  return `${parts.year}-${mm}-${dd}`;
}

/** Banner key from the delivery-day weekday (PRD §7). */
export function bannerKeyForWeekday(weekday: number): BannerKey {
  // Sun=0, Wed=3, Fri=5 → market day
  if (weekday === 0 || weekday === 3 || weekday === 5) return 'market_day';
  // Mon=1, Thu=4, Sat=6 → bozor narxida
  if (weekday === 1 || weekday === 4 || weekday === 6) return 'bozor_narxida';
  // Tue=2 → hafta zaxirasi
  if (weekday === 2) return 'hafta_zaxirasi';
  return 'fallback';
}

/** "7-iyun, chorshanba" — Uzbek date label. */
export function formatUzDate(parts: DateParts): string {
  return `${parts.day}-${texts.months[parts.month - 1]}, ${texts.weekdays[parts.weekday]}`;
}

export interface DeliveryClock {
  now: WallClock;
  isAfterDeadline: boolean;
  /** Delivery calendar date (tomorrow before 21:00, day-after once passed). */
  deliveryDate: DateParts;
  deliveryDateISO: string;
  bannerKey: BannerKey;
  /** Milliseconds until today's 21:00 deadline (0 once passed). */
  msUntilDeadline: number;
  /** Relative-day word for the delivery day ("Ertaga" / "Indinga"). */
  deliveryRelDay: string;
}

export function computeDeliveryClock(date: Date = new Date()): DeliveryClock {
  const now = tashkentNow(date);
  const isAfterDeadline = now.hour >= DEADLINE_HOUR;
  const deliveryOffset = isAfterDeadline ? 2 : 1;
  const deliveryDate = addDays(now, deliveryOffset);
  const secondsLeft =
    (DEADLINE_HOUR * 60 - (now.hour * 60 + now.minute)) * 60 - now.second;

  return {
    now,
    isAfterDeadline,
    deliveryDate,
    deliveryDateISO: isoOf(deliveryDate),
    bannerKey: bannerKeyForWeekday(deliveryDate.weekday),
    msUntilDeadline: isAfterDeadline ? 0 : Math.max(0, secondsLeft * 1000),
    deliveryRelDay: isAfterDeadline ? texts.relDay.dayAfter : texts.relDay.tomorrow,
  };
}

/** Live delivery clock; re-renders once a minute (enough for the countdown). */
export function useDeliveryClock(): DeliveryClock {
  const [clock, setClock] = useState(() => computeDeliveryClock());
  useEffect(() => {
    const id = setInterval(() => setClock(computeDeliveryClock()), 30_000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

/** Split ms into whole hours + minutes for the countdown line. */
export function splitHoursMinutes(ms: number): { hours: number; minutes: number } {
  const totalMinutes = Math.floor(ms / 60_000);
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
}

/** Uzbek date label for a backend date string, e.g. "7-iyun, chorshanba". */
export function dateLabel(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  const parts = dateStringToParts(dateStr);
  return parts ? formatUzDate(parts) : '';
}

/** Take the YYYY-MM-DD parts out of a backend date string. */
function dateStringToParts(dateStr: string): DateParts | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  return { year, month, day, weekday: weekdayOf(year, month, day) };
}

/**
 * Relative-day word for a backend delivery date ("Bugun" / "Ertaga" / "Indinga",
 * else a plain Uzbek date). Used on success / status / order screens, anchored
 * to the same Tashkent "today" as the rest of the app.
 */
export function relativeDayWord(dateStr: string | undefined | null, date: Date = new Date()): string {
  if (!dateStr) return texts.relDay.tomorrow;
  const target = dateStringToParts(dateStr);
  if (!target) return texts.relDay.tomorrow;
  const today = tashkentNow(date);
  const a = Date.UTC(today.year, today.month - 1, today.day);
  const b = Date.UTC(target.year, target.month - 1, target.day);
  const diffDays = Math.round((b - a) / 86_400_000);
  if (diffDays === 0) return texts.relDay.today;
  if (diffDays === 1) return texts.relDay.tomorrow;
  if (diffDays === 2) return texts.relDay.dayAfter;
  return formatUzDate(target);
}
