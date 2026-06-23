import type { Unit } from '@tezbozor/shared';

// Quantity rules per unit. kg is a fixed-point decimal bought in 0.5 steps;
// dona is whole pieces. Money is never computed here.

export function stepFor(unit: Unit): number {
  return unit === 'kg' ? 0.5 : 1;
}

export function minFor(unit: Unit): number {
  return unit === 'kg' ? 0.5 : 1;
}

/** Default quantity when first adding a product to the cart. */
export function defaultQty(unit: Unit): number {
  return unit === 'kg' ? 1 : 1;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Clamp a quantity to the unit's minimum and step, rounded cleanly. */
export function clampQty(qty: number, unit: Unit): number {
  const min = minFor(unit);
  return round2(Math.max(min, qty));
}

/** Human display: "1.5 kg", "2 kg", "3 dona". */
export function formatQty(qty: number, unit: Unit): string {
  return `${round2(qty)} ${unit}`;
}

/** Number only ("1.5", "3") — used in the space-tight product-card stepper,
 * where the unit is already shown on the price line above it. */
export function formatQtyShort(qty: number): string {
  return String(round2(qty));
}

/** Quantity as the string the backend expects (fixed-point decimal). */
export function qtyToApiString(qty: number): string {
  return String(round2(qty));
}
