import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { resolveLocale, translate, type MessageKey } from './i18n';
import {
  DEFAULT_SETTINGS,
  getSettings,
  updateSettings,
  watchSettings,
  type DeepPartial,
  type Locale,
  type Settings,
} from './settings';
import { applyTheme } from './theme';

interface AppContextValue {
  settings: Settings;
  loaded: boolean;
  locale: Locale;
  update: (patch: DeepPartial<Settings>) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

/** Loads settings, keeps them live across extension pages, and applies theme and language. */
export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void getSettings().then((value) => {
      if (!active) return;
      setSettings(value);
      setLoaded(true);
    });
    const unwatch = watchSettings((value) => {
      if (active) setSettings(value);
    });
    return () => {
      active = false;
      unwatch();
    };
  }, []);

  const locale = resolveLocale(settings.locale, navigator.language);

  useEffect(() => {
    applyTheme(settings.theme);
    document.documentElement.lang = locale.replace('_', '-');
  }, [settings.theme, locale]);

  const update = useCallback((patch: DeepPartial<Settings>) => {
    // Optimistic: the storage watcher confirms and keeps other pages in sync.
    void updateSettings(patch).then(setSettings);
  }, []);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  );

  const value = useMemo(
    () => ({ settings, loaded, locale, update, t }),
    [settings, loaded, locale, update, t],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside <AppProvider>');
  return context;
}
