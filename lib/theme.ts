import type { ThemeSetting } from './settings';

export type ResolvedTheme = 'light' | 'dark';

export function resolveTheme(setting: ThemeSetting, systemPrefersDark: boolean): ResolvedTheme {
  if (setting === 'system') return systemPrefersDark ? 'dark' : 'light';
  return setting;
}

/**
 * `system` leaves the attribute off so CSS follows `prefers-color-scheme` directly,
 * with no flash and no JavaScript needed to stay in sync.
 */
export function applyTheme(setting: ThemeSetting, root: HTMLElement = document.documentElement) {
  if (setting === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', setting);
  }
}
