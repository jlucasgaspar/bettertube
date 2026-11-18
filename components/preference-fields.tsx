import { useApp } from '../lib/app-context';
import { LOCALE_NAMES } from '../lib/i18n';
import { LOCALES, THEMES, type LocaleSetting, type ThemeSetting } from '../lib/settings';
import { FieldRow } from './setting-row';

/** Language and theme selects, shared by the options page and the popup. */
export function PreferenceFields({ compact }: { compact?: boolean }) {
  const { settings, update, t } = useApp();
  return (
    <>
      <FieldRow
        label={t('general.language')}
        description={t('general.language.desc')}
        compact={compact}
      >
        {(id) => (
          <select
            id={id}
            className="field"
            value={settings.locale}
            onChange={(event) => update({ locale: event.target.value as LocaleSetting })}
          >
            <option value="auto">{t('general.language.auto')}</option>
            {LOCALES.map((locale) => (
              <option key={locale} value={locale}>
                {LOCALE_NAMES[locale]}
              </option>
            ))}
          </select>
        )}
      </FieldRow>
      <FieldRow label={t('general.theme')} description={t('general.theme.desc')} compact={compact}>
        {(id) => (
          <select
            id={id}
            className="field"
            value={settings.theme}
            onChange={(event) => update({ theme: event.target.value as ThemeSetting })}
          >
            {THEMES.map((theme) => (
              <option key={theme} value={theme}>
                {t(`theme.${theme}` as const)}
              </option>
            ))}
          </select>
        )}
      </FieldRow>
    </>
  );
}
