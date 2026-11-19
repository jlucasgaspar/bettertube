import { ExternalLink } from 'lucide-react';
import { RegistrationMark } from '../../components/registration-mark';
import { PreferenceFields } from '../../components/preference-fields';
import { SwitchRow } from '../../components/setting-row';
import { useApp } from '../../lib/app-context';

export default function App() {
  const { settings, update, t, loaded } = useApp();
  const state = (on: boolean) => t(on ? 'state.on' : 'state.off');
  const off = !settings.enabled;

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
            label={t('enabled.label')}
            checked={settings.enabled}
            stateLabel={state(settings.enabled)}
            onChange={(enabled) => update({ enabled })}
          />
          <SwitchRow
            compact
            label={t('home.enabled')}
            checked={settings.home.enabled}
            disabled={off}
            stateLabel={state(settings.home.enabled)}
            onChange={(enabled) => update({ home: { enabled } })}
          />
          {settings.home.enabled && (
            <>
              <SwitchRow
                compact
                nested
                label={t('home.showSaved')}
                checked={settings.home.showSaved}
                disabled={off}
                stateLabel={state(settings.home.showSaved)}
                onChange={(showSaved) => update({ home: { showSaved } })}
              />
              <SwitchRow
                compact
                nested
                label={t('home.showWatchLater')}
                checked={settings.home.showWatchLater}
                disabled={off}
                stateLabel={state(settings.home.showWatchLater)}
                onChange={(showWatchLater) => update({ home: { showWatchLater } })}
              />
              <SwitchRow
                compact
                nested
                label={t('home.showChannels')}
                checked={settings.home.showChannels}
                disabled={off}
                stateLabel={state(settings.home.showChannels)}
                onChange={(showChannels) => update({ home: { showChannels } })}
              />
            </>
          )}
          <SwitchRow
            compact
            label={t('shorts.enabled')}
            checked={settings.shorts.enabled}
            disabled={off}
            stateLabel={state(settings.shorts.enabled)}
            onChange={(enabled) => update({ shorts: { enabled } })}
          />
          <SwitchRow
            compact
            label={t('recommendations.enabled')}
            checked={settings.recommendations.enabled}
            disabled={off}
            stateLabel={state(settings.recommendations.enabled)}
            onChange={(enabled) => update({ recommendations: { enabled } })}
          />
          <SwitchRow
            compact
            label={t('ads.enabled')}
            checked={settings.ads.enabled}
            disabled={off}
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
