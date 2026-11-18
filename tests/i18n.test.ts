import { describe, expect, it } from 'vitest';
import { LOCALE_NAMES, MESSAGES, matchLocale, resolveLocale, translate } from '../lib/i18n';
import { LOCALES } from '../lib/settings';

describe('messages', () => {
  const englishKeys = Object.keys(MESSAGES.en).sort();

  it.each(LOCALES)('%s defines exactly the same keys as English', (locale) => {
    expect(Object.keys(MESSAGES[locale]).sort()).toEqual(englishKeys);
  });

  it.each(LOCALES)('%s has no empty strings', (locale) => {
    for (const [key, value] of Object.entries(MESSAGES[locale])) {
      expect(value.trim(), `${locale}.${key}`).not.toBe('');
    }
  });

  it('has a native name for every locale', () => {
    for (const locale of LOCALES) expect(LOCALE_NAMES[locale]).toBeTruthy();
  });
});

describe('matchLocale', () => {
  it.each([
    ['pt-BR', 'pt_BR'],
    ['pt-PT', 'pt_BR'],
    ['es-419', 'es'],
    ['fr-CA', 'fr'],
    ['it', 'it'],
    ['de-AT', 'de'],
    ['en-GB', 'en'],
    ['ja', 'en'],
    [undefined, 'en'],
  ])('maps %s to %s', (tag, expected) => {
    expect(matchLocale(tag)).toBe(expected);
  });
});

describe('resolveLocale', () => {
  it('follows the browser when automatic', () => {
    expect(resolveLocale('auto', 'de-DE')).toBe('de');
  });

  it('lets an explicit choice win over the browser', () => {
    expect(resolveLocale('fr', 'de-DE')).toBe('fr');
  });
});

describe('translate', () => {
  it('returns the localized string', () => {
    expect(translate('pt_BR', 'nav.home')).toBe('Início');
  });
});
