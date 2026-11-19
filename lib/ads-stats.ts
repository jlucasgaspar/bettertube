import { storage } from 'wxt/utils/storage';

export type AdLayer = 'strip' | 'skip';

export interface AdStats {
  /** Player responses cleaned of ad data (layer 2). */
  stripped: number;
  /** Ads muted and skipped (layer 3). */
  skipped: number;
}

export const EMPTY_AD_STATS: AdStats = { stripped: 0, skipped: 0 };

const count = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;

export function normalizeAdStats(stored: unknown): AdStats {
  const raw =
    typeof stored === 'object' && stored !== null ? (stored as Record<string, unknown>) : {};
  return { stripped: count(raw.stripped), skipped: count(raw.skipped) };
}

export const totalHandled = (stats: AdStats): number => stats.stripped + stats.skipped;

export function addHandled(stats: AdStats, layer: AdLayer, amount = 1): AdStats {
  const next = { ...stats };
  if (layer === 'strip') next.stripped += amount;
  else next.skipped += amount;
  return next;
}

export const adStatsItem = storage.defineItem<AdStats>('local:adStats', {
  fallback: EMPTY_AD_STATS,
});

export async function getAdStats(): Promise<AdStats> {
  return normalizeAdStats(await adStatsItem.getValue());
}

export function watchAdStats(callback: (stats: AdStats) => void): () => void {
  return adStatsItem.watch((value) => callback(normalizeAdStats(value)));
}

export async function resetAdStats(): Promise<void> {
  await adStatsItem.setValue(EMPTY_AD_STATS);
}

/** Message content scripts send to the background so counts from many tabs never race. */
export const AD_HANDLED_MESSAGE = 'bettertube:ad-handled';
export interface AdHandledMessage {
  type: typeof AD_HANDLED_MESSAGE;
  layer: AdLayer;
}
export const isAdHandledMessage = (value: unknown): value is AdHandledMessage =>
  typeof value === 'object' &&
  value !== null &&
  (value as AdHandledMessage).type === AD_HANDLED_MESSAGE &&
  ((value as AdHandledMessage).layer === 'strip' || (value as AdHandledMessage).layer === 'skip');
