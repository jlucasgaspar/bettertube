import { useEffect, useState } from 'react';
import { resolveLocale } from '../lib/i18n';
import { DEFAULT_SETTINGS, getSettings, watchSettings, type Settings } from '../lib/settings';

// Hooks shared by the UI BetterTube injects into YouTube pages.

type PageTheme = 'light' | 'dark';

/** YouTube marks its dark theme with a `dark` attribute on <html>, whatever the OS says. */
function readPageTheme(): PageTheme {
  return document.documentElement.hasAttribute('dark') ? 'dark' : 'light';
}

export function usePageTheme() {
  const [theme, setTheme] = useState(readPageTheme);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readPageTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dark'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/** Live settings: starts from defaults, then follows storage. */
export function useSettings(): Settings {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  useEffect(() => {
    let active = true;
    void getSettings().then((value) => active && setSettings(value));
    const stop = watchSettings((value) => setSettings(value));
    return () => {
      active = false;
      stop();
    };
  }, []);
  return settings;
}

export function useLocale() {
  return resolveLocale(useSettings().locale, navigator.language);
}
