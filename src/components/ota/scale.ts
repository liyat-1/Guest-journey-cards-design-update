/**
 * Filter-driven data.
 *
 * OTA Buster's numbers are aggregate, so the global filter bar has to move
 * every figure in the workspace consistently. Rather than duplicating a data
 * set per filter combination, each filter contributes a volume factor (how
 * many guests the selection covers) and a rate factor (how differently that
 * slice behaves). Values are then re-formatted in place, preserving currency
 * symbols, separators and decimal precision.
 */

import { useMemo } from "react";
import { useOta, type Filters } from "./state";

const rangeVolume: Record<string, number> = {
  "Last 7 days": 0.23,
  "Last 30 days": 1,
  "Last 90 days": 2.94,
  "Year to date": 9.6,
  "Custom range": 1.55,
};

const propertyVolume: Record<string, number> = {
  "All properties": 1,
  "Wyndham Grand Istanbul Levent": 0.548,
  "Wyndham Grand Kalamış Marina": 0.274,
  "Wyndham Grand Ankara": 0.178,
};

const channelVolume: Record<string, number> = {
  "All channels": 1,
  Email: 0.78,
  Text: 0.22,
};

const channelRate: Record<string, number> = {
  "All channels": 1,
  Email: 0.96,
  Text: 1.24,
};

const segmentVolume: Record<string, number> = {
  "All segments": 1,
  "First-time OTA guest": 0.449,
  "Repeat OTA guest": 0.338,
  "High-value guest": 0.088,
  Leisure: 0.63,
  Business: 0.183,
  Family: 0.135,
  "Frequent traveller": 0.075,
};

const segmentRate: Record<string, number> = {
  "All segments": 1,
  "First-time OTA guest": 0.78,
  "Repeat OTA guest": 1.36,
  "High-value guest": 1.72,
  Leisure: 1.05,
  Business: 0.92,
  Family: 1.12,
  "Frequent traveller": 1.48,
};

const sourceVolume: Record<string, number> = {
  "All sources": 1,
  "Booking.com": 0.52,
  Expedia: 0.27,
  Agoda: 0.14,
  "Trip.com": 0.07,
};

const sourceRate: Record<string, number> = {
  "All sources": 1,
  "Booking.com": 1.06,
  Expedia: 0.94,
  Agoda: 0.88,
  "Trip.com": 0.82,
};

const conversionVolume: Record<string, number> = {
  "All guests": 1,
  "Not yet converted": 0.92,
  "Converted direct": 0.078,
  "Repeat direct": 0.026,
};

const conversionRate: Record<string, number> = {
  "All guests": 1,
  "Not yet converted": 0.64,
  "Converted direct": 2.4,
  "Repeat direct": 2.9,
};

const offerVolume: Record<string, number> = {
  "All offers": 1,
  "10% off direct": 0.28,
  "15% off + free breakfast": 0.33,
  "Free breakfast": 0.23,
  "Room upgrade": 0.1,
  "Late checkout": 0.14,
};

const offerRate: Record<string, number> = {
  "All offers": 1,
  "10% off direct": 0.95,
  "15% off + free breakfast": 1.22,
  "Free breakfast": 0.86,
  "Room upgrade": 1.34,
  "Late checkout": 0.7,
};

const stageVolume: Record<string, number> = {
  "All stages": 1,
  "Just Booked": 1,
  "Pre-Check-in": 0.79,
  Reminder: 0.62,
  "During Stay": 0.52,
  "Post-Checkout": 0.47,
  Winback: 0.36,
};

const stageRate: Record<string, number> = {
  "All stages": 1,
  "Just Booked": 0.72,
  "Pre-Check-in": 1.08,
  Reminder: 0.86,
  "During Stay": 1.14,
  "Post-Checkout": 1.02,
  Winback: 1.42,
};

const pick = (table: Record<string, number>, key: string) => table[key] ?? 1;

export type Factors = { volume: number; rate: number };

export function filterFactors(f: Filters): Factors {
  const volume =
    pick(rangeVolume, f.range) *
    pick(propertyVolume, f.property) *
    pick(channelVolume, f.channel) *
    pick(segmentVolume, f.segment) *
    pick(sourceVolume, f.source) *
    pick(conversionVolume, f.conversion) *
    pick(offerVolume, f.offer) *
    pick(stageVolume, f.stage);

  const rate =
    pick(channelRate, f.channel) *
    pick(segmentRate, f.segment) *
    pick(sourceRate, f.source) *
    pick(conversionRate, f.conversion) *
    pick(offerRate, f.offer) *
    pick(stageRate, f.stage);

  return { volume, rate };
}

/** Matches an optional currency prefix, a number, and an optional % suffix. */
const NUMBER = /(\$)?(\d[\d,]*(?:\.\d+)?)(\s?%)?/;

function reformat(next: number, decimals: number) {
  return next.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Scales the first number found in a string. Percentages use the rate factor
 * and are clamped to a believable ceiling; everything else uses volume.
 */
export function scaleText(value: string, factors: Factors): string {
  const match = NUMBER.exec(value);
  if (!match) return value;

  const full = match[0];
  const currency = match[1] ?? "";
  const digits = match[2] ?? "";
  const percent = match[3] ?? "";

  const base = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(base)) return value;

  const isRate = percent.length > 0;
  let next = base * (isRate ? factors.rate : factors.volume);
  if (isRate) next = Math.min(next, 99.4);

  const decimals = digits.includes(".") ? (digits.split(".")[1]?.length ?? 0) : 0;

  return value.replace(full, `${currency}${reformat(next, decimals)}${percent}`);
}

/** Scales a plain guest count. */
export function scaleCount(value: number, factors: Factors): number {
  return Math.max(0, Math.round(value * factors.volume));
}

/**
 * Every metric in the workspace reads through this hook so the filter bar and
 * the numbers below it can never drift apart.
 */
export function useScale() {
  const { filters } = useOta();
  return useMemo(() => {
    const factors = filterFactors(filters);
    return {
      factors,
      /** Scale a formatted metric string, e.g. "$84,200" or "14.5%". */
      value: (v: string) => scaleText(v, factors),
      /** Scale a raw count and return it formatted. */
      count: (n: number) => scaleCount(n, factors).toLocaleString("en-US"),
      /** Scale a raw count and return the number. */
      raw: (n: number) => scaleCount(n, factors),
    };
  }, [filters]);
}
