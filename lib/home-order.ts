import { storage } from 'wxt/utils/storage';

/** `default` keeps the stored order, including any manual reordering done in the options page. */
export type HomeOrder = 'default' | 'newest' | 'oldest';
export type HomeOrderSection = 'saved' | 'watchLater' | 'channels';
export type HomeOrderSettings = Record<HomeOrderSection, HomeOrder>;

export const DEFAULT_HOME_ORDER: HomeOrderSettings = {
  saved: 'default',
  channels: 'default',
  // YouTube lists Watch Later newest first, so that is its default.
  watchLater: 'newest',
};

const ORDERS: readonly HomeOrder[] = ['default', 'newest', 'oldest'];

export function normalizeHomeOrder(stored: unknown): HomeOrderSettings {
  const value = (typeof stored === 'object' && stored !== null ? stored : {}) as Record<
    string,
    unknown
  >;
  const pick = (section: HomeOrderSection): HomeOrder => {
    const order = value[section];
    const valid = ORDERS.includes(order as HomeOrder) ? (order as HomeOrder) : undefined;
    // Watch Later has no "default": it is already newest first.
    if (section === 'watchLater') return valid === 'oldest' ? 'oldest' : 'newest';
    return valid ?? DEFAULT_HOME_ORDER[section];
  };
  return { saved: pick('saved'), watchLater: pick('watchLater'), channels: pick('channels') };
}

/**
 * Order a list for display. Items with a `savedAt` date are sorted by it. A list without dates
 * (Watch Later) arrives newest first from YouTube, so `oldest` reverses it.
 */
export function orderItems<T extends object>(list: T[], order: HomeOrder): T[] {
  if (order === 'default') return list;
  const dateOf = (item: T) => (item as { savedAt?: unknown }).savedAt;
  const dated = list.every((item) => typeof dateOf(item) === 'number');
  if (!dated) return order === 'oldest' ? [...list].reverse() : list;
  const sign = order === 'newest' ? -1 : 1;
  return [...list].sort((a, b) => sign * ((dateOf(a) as number) - (dateOf(b) as number)));
}

export const homeOrderItem = storage.defineItem<HomeOrderSettings>('local:homeOrder', {
  fallback: DEFAULT_HOME_ORDER,
  version: 1,
});

export async function getHomeOrder(): Promise<HomeOrderSettings> {
  return normalizeHomeOrder(await homeOrderItem.getValue());
}

export async function setHomeOrder(section: HomeOrderSection, order: HomeOrder): Promise<void> {
  await homeOrderItem.setValue({ ...(await getHomeOrder()), [section]: order });
}

export function watchHomeOrder(callback: (value: HomeOrderSettings) => void): () => void {
  return homeOrderItem.watch((value) => callback(normalizeHomeOrder(value)));
}
