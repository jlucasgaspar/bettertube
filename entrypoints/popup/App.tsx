import { ExternalLink } from 'lucide-react';
import { RegistrationMark } from '../../components/registration-mark';
import { PreferenceFields } from '../../components/preference-fields';
import { SwitchRow } from '../../components/setting-row';
import { useApp } from '../../lib/app-context';

export default function App() {
  const { settings, update, t, loaded } = useApp();
  const state = (on: boolean) => t(on ? 'state.on' : 'state.off');

  return (
    <div className="w-[22.5rem] px-4 pt-4 pb-4" aria-busy={!loaded}>
      <header className="mb-3 flex items-center gap-2.5">
        <RegistrationMark size={22} />
        <h1 className="text-xl leading-none font-bold">{t('app.name')}</h1>
      </header>
      {loaded && (
        <>
          <SwitchRow
            compact
            label={t('home.enabled')}
            checked={settings.home.enabled}
            stateLabel={state(settings.home.enabled)}
            onChange={(enabled) => update({ home: { enabled } })}
          />
          <SwitchRow
            compact
            label={t('shorts.enabled')}
            checked={settings.shorts.enabled}
            stateLabel={state(settings.shorts.enabled)}
            onChange={(enabled) => update({ shorts: { enabled } })}
          />
          <SwitchRow
            compact
            label={t('recommendations.enabled')}
            checked={settings.recommendations.enabled}
            stateLabel={state(settings.recommendations.enabled)}
            onChange={(enabled) => update({ recommendations: { enabled } })}
          />
          <SwitchRow
            compact
            label={t('ads.enabled')}
            checked={settings.ads.enabled}
            stateLabel={state(settings.ads.enabled)}
            onChange={(enabled) => update({ ads: { enabled } })}
          />
          <PreferenceFields compact />
          <button
            type="button"
            className="btn mt-4 w-full"
            onClick={() => void browser.runtime.openOptionsPage()}
          >
            {t('popup.openSettings')}
            <ExternalLink size={14} aria-hidden={true} />
          </button>
        </>
      )}
    </div>
  );
}
