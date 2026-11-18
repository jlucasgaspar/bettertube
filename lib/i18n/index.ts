import type { Locale, LocaleSetting } from '../settings';
import { de } from './messages/de';
import { en, type MessageKey, type Messages } from './messages/en';
import { es } from './messages/es';
import { fr } from './messages/fr';
import { it } from './messages/it';
import { pt_BR } from './messages/pt_BR';

export type { MessageKey } from './messages/en';

export const MESSAGES: Record<Locale, Messages> = { en, pt_BR, es, fr, it, de };

/** Shown in the language picker, always in the language itself. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  pt_BR: 'Português (Brasil)',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
};

/** Map a BCP 47 tag such as `pt-BR` or `es-419` to a supported locale, falling back to English. */
export function matchLocale(tag: string | undefined): Locale {
  const language = (tag ?? '').toLowerCase().split(/[-_]/)[0];
  switch (language) {
    case 'pt':
      return 'pt_BR';
    case 'es':
    case 'fr':
    case 'it':
    case 'de':
      return language;
    default:
      return 'en';
  }
}

export function resolveLocale(setting: LocaleSetting, browserLanguage: string | undefined): Locale {
  return setting === 'auto' ? matchLocale(browserLanguage) : setting;
}

export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  const template = MESSAGES[locale][key] ?? MESSAGES.en[key];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
