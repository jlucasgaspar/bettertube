import { storage } from 'wxt/utils/storage';

export const LOCALES = ['en', 'pt_BR', 'es', 'fr', 'it', 'de'] as const;
export type Locale = (typeof LOCALES)[number];
export type LocaleSetting = 'auto' | Locale;

export const THEMES = ['system', 'light', 'dark'] as const;
export type ThemeSetting = (typeof THEMES)[number];

export interface Settings {
  locale: LocaleSetting;
  theme: ThemeSetting;
  home: {
    enabled: boolean;
    showWatchLater: boolean;
  };
  shorts: {
    enabled: boolean;
    redirectToWatch: boolean;
  };
  recommendations: {
    enabled: boolean;
    showSaved: boolean;
  };
  ads: {
    enabled: boolean;
    blockRequests: boolean;
    stripPlayerAds: boolean;
    autoSkip: boolean;
  };
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

/** Conservative defaults: nothing changes on YouTube until the user opts in. */
export const DEFAULT_SETTINGS: Settings = {
  locale: 'auto',
  theme: 'system',
  home: { enabled: false, showWatchLater: true },
  shorts: { enabled: false, redirectToWatch: false },
  recommendations: { enabled: false, showSaved: false },
  ads: { enabled: false, blockRequests: true, stripPlayerAds: true, autoSkip: true },
};

type Plain = Record<string, unknown>;

const isPlain = (value: unknown): value is Plain =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Merge stored data over a template. Unknown keys are dropped, keys missing from
 * storage fall back to the template, and values of the wrong type are discarded.
 */
function mergeWithTemplate(template: Plain, stored: unknown): Plain {
  const source = isPlain(stored) ? stored : {};
  const result: Plain = {};
  for (const key of Object.keys(template)) {
    const fallback = template[key];
    const value = source[key];
    if (isPlain(fallback)) {
      result[key] = mergeWithTemplate(fallback, value);
    } else {
      result[key] = typeof value === typeof fallback ? value : fallback;
    }
  }
  return result;
}

/** Produce a fully valid Settings object from anything read out of storage. */
export function normalizeSettings(stored: unknown): Settings {
  const merged = mergeWithTemplate(
    DEFAULT_SETTINGS as unknown as Plain,
    stored,
  ) as unknown as Settings;
  if (merged.locale !== 'auto' && !LOCALES.includes(merged.locale)) {
    merged.locale = DEFAULT_SETTINGS.locale;
  }
  if (!THEMES.includes(merged.theme)) {
    merged.theme = DEFAULT_SETTINGS.theme;
  }
  return merged;
}

/** Apply a partial update on top of current settings. */
export function applyPatch(current: Settings, patch: DeepPartial<Settings>): Settings {
  const next = structuredClone(current) as unknown as Plain;
  const apply = (target: Plain, changes: Plain) => {
    for (const key of Object.keys(changes)) {
      const change = changes[key];
      const existing = target[key];
      if (isPlain(existing) && isPlain(change)) {
        apply(existing, change);
      } else if (change !== undefined) {
        target[key] = change;
      }
    }
  };
  apply(next, patch as Plain);
  return normalizeSettings(next);
}

/**
 * Bump `version` and add an entry to `migrations` whenever the stored shape changes
 * in a way `normalizeSettings` cannot absorb (renames, splits, changed meaning).
 */
export const SETTINGS_VERSION = 1;
export const settingsMigrations: Record<number, (old: unknown) => unknown> = {};

export const settingsItem = storage.defineItem<Settings>('sync:settings', {
  fallback: DEFAULT_SETTINGS,
  version: SETTINGS_VERSION,
  migrations: settingsMigrations,
});

export async function getSettings(): Promise<Settings> {
  return normalizeSettings(await settingsItem.getValue());
}

export async function updateSettings(patch: DeepPartial<Settings>): Promise<Settings> {
  const next = applyPatch(await getSettings(), patch);
  await settingsItem.setValue(next);
  return next;
}

export function watchSettings(callback: (settings: Settings) => void): () => void {
  return settingsItem.watch((value) => callback(normalizeSettings(value)));
}
