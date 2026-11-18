import { useEffect, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import {
  Bookmark,
  House,
  Info,
  PanelRightClose,
  ShieldBan,
  SlidersHorizontal,
  Smartphone,
} from 'lucide-react';
import { PreferenceFields } from '../../components/preference-fields';
import { RegistrationMark } from '../../components/registration-mark';
import { SwitchRow } from '../../components/setting-row';
import { useApp } from '../../lib/app-context';
import type { MessageKey } from '../../lib/i18n';

type SectionId = 'general' | 'home' | 'shorts' | 'recommendations' | 'ads' | 'saved' | 'about';

const SECTIONS: {
  id: SectionId;
  icon: ComponentType<{ size?: number; 'aria-hidden'?: boolean }>;
}[] = [
  { id: 'general', icon: SlidersHorizontal },
  { id: 'home', icon: House },
  { id: 'shorts', icon: Smartphone },
  { id: 'recommendations', icon: PanelRightClose },
  { id: 'ads', icon: ShieldBan },
  { id: 'saved', icon: Bookmark },
  { id: 'about', icon: Info },
];

function sectionFromHash(): SectionId {
  const id = window.location.hash.replace('#', '');
  return SECTIONS.some((section) => section.id === id) ? (id as SectionId) : 'general';
}

export default function App() {
  const { t, loaded, settings } = useApp();
  const [current, setCurrent] = useState<SectionId>(sectionFromHash);

  useEffect(() => {
    const onHashChange = () => setCurrent(sectionFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.title = `${t(`nav.${current}` as MessageKey)} · ${t('app.name')}`;
  }, [current, t]);

  // On narrow screens the rail scrolls sideways: keep the current section in view.
  useEffect(() => {
    document
      .querySelector('[aria-current="page"]')
      ?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [current]);

  // Rail dots show each feature's cue state; sections without a feature get a plain tick.
  const cue: Partial<Record<SectionId, boolean>> = {
    home: settings.home.enabled,
    shorts: settings.shorts.enabled,
    recommendations: settings.recommendations.enabled,
    ads: settings.ads.enabled,
  };

  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-[auto_1fr] md:grid-cols-[15rem_1fr] md:grid-rows-1">
      <aside className="border-b border-line md:sticky md:top-0 md:h-screen md:border-r md:border-b-0">
        <div className="flex items-center gap-2.5 px-6 pt-6 pb-4 md:pb-8">
          <RegistrationMark />
          <div>
            <div className="text-xl font-bold leading-none">{t('app.name')}</div>
            <div className="mt-1 text-xs text-muted">{t('app.tagline')}</div>
          </div>
        </div>
        <nav
          aria-label={t('nav.label')}
          className="rail flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0"
        >
          {SECTIONS.map(({ id, icon: Icon }) => {
            const active = id === current;
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-3 rounded px-3 py-2 text-sm whitespace-nowrap ${
                  active ? 'bg-surface font-bold' : 'text-muted hover:text-ink'
                }`}
              >
                {cue[id] === undefined ? (
                  <span className="tick" aria-hidden="true" />
                ) : (
                  <span className="cue" data-on={cue[id]} aria-hidden="true" />
                )}
                <Icon size={16} aria-hidden={true} />
                {t(`nav.${id}` as MessageKey)}
              </a>
            );
          })}
        </nav>
      </aside>
      <main className="px-6 py-8 md:px-14 md:py-12" aria-busy={!loaded}>
        <div className="max-w-2xl">{loaded && <Section id={current} />}</div>
      </main>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h1 className="mb-6 text-4xl leading-none font-bold tracking-tight">{children}</h1>;
}

function Section({ id }: { id: SectionId }) {
  const { settings, update, t } = useApp();
  const state = (on: boolean) => t(on ? 'state.on' : 'state.off');

  switch (id) {
    case 'general':
      return (
        <section>
          <SectionTitle>{t('general.title')}</SectionTitle>
          <PreferenceFields />
        </section>
      );
    case 'home':
      return (
        <section>
          <SectionTitle>{t('home.title')}</SectionTitle>
          <SwitchRow
            label={t('home.enabled')}
            description={t('home.enabled.desc')}
            checked={settings.home.enabled}
            stateLabel={state(settings.home.enabled)}
            onChange={(enabled) => update({ home: { enabled } })}
          />
          <SwitchRow
            nested
            label={t('home.watchLater')}
            description={t('home.watchLater.desc')}
            checked={settings.home.showWatchLater}
            disabled={!settings.home.enabled}
            stateLabel={state(settings.home.showWatchLater)}
            onChange={(showWatchLater) => update({ home: { showWatchLater } })}
          />
        </section>
      );
    case 'shorts':
      return (
        <section>
          <SectionTitle>{t('shorts.title')}</SectionTitle>
          <SwitchRow
            label={t('shorts.enabled')}
            description={t('shorts.enabled.desc')}
            checked={settings.shorts.enabled}
            stateLabel={state(settings.shorts.enabled)}
            onChange={(enabled) => update({ shorts: { enabled } })}
          />
          <SwitchRow
            label={t('shorts.redirect')}
            description={t('shorts.redirect.desc')}
            checked={settings.shorts.redirectToWatch}
            stateLabel={state(settings.shorts.redirectToWatch)}
            onChange={(redirectToWatch) => update({ shorts: { redirectToWatch } })}
          />
        </section>
      );
    case 'recommendations':
      return (
        <section>
          <SectionTitle>{t('recommendations.title')}</SectionTitle>
          <SwitchRow
            label={t('recommendations.enabled')}
            description={t('recommendations.enabled.desc')}
            checked={settings.recommendations.enabled}
            stateLabel={state(settings.recommendations.enabled)}
            onChange={(enabled) => update({ recommendations: { enabled } })}
          />
          <SwitchRow
            nested
            label={t('recommendations.showSaved')}
            description={t('recommendations.showSaved.desc')}
            checked={settings.recommendations.showSaved}
            disabled={!settings.recommendations.enabled}
            stateLabel={state(settings.recommendations.showSaved)}
            onChange={(showSaved) => update({ recommendations: { showSaved } })}
          />
        </section>
      );
    case 'ads':
      return (
        <section>
          <SectionTitle>{t('ads.title')}</SectionTitle>
          <SwitchRow
            label={t('ads.enabled')}
            description={t('ads.enabled.desc')}
            checked={settings.ads.enabled}
            stateLabel={state(settings.ads.enabled)}
            onChange={(enabled) => update({ ads: { enabled } })}
          />
          <SwitchRow
            nested
            label={t('ads.blockRequests')}
            description={t('ads.blockRequests.desc')}
            checked={settings.ads.blockRequests}
            disabled={!settings.ads.enabled}
            stateLabel={state(settings.ads.blockRequests)}
            onChange={(blockRequests) => update({ ads: { blockRequests } })}
          />
          <SwitchRow
            nested
            label={t('ads.stripPlayerAds')}
            description={t('ads.stripPlayerAds.desc')}
            checked={settings.ads.stripPlayerAds}
            disabled={!settings.ads.enabled}
            stateLabel={state(settings.ads.stripPlayerAds)}
            onChange={(stripPlayerAds) => update({ ads: { stripPlayerAds } })}
          />
          <SwitchRow
            nested
            label={t('ads.autoSkip')}
            description={t('ads.autoSkip.desc')}
            checked={settings.ads.autoSkip}
            disabled={!settings.ads.enabled}
            stateLabel={state(settings.ads.autoSkip)}
            onChange={(autoSkip) => update({ ads: { autoSkip } })}
          />
        </section>
      );
    case 'saved':
      return (
        <section>
          <SectionTitle>{t('saved.title')}</SectionTitle>
          <p className="max-w-prose text-base text-muted">{t('saved.placeholder')}</p>
        </section>
      );
    case 'about':
      return (
        <section>
          <SectionTitle>{t('about.title')}</SectionTitle>
          <div className="flex max-w-prose flex-col gap-4 text-base">
            <p>{t('about.description')}</p>
            <p>{t('about.privacy')}</p>
            <p className="text-sm text-muted">{t('about.disclaimer')}</p>
            <p className="text-sm text-muted">
              {t('about.version')} {browser.runtime.getManifest().version}
            </p>
          </div>
        </section>
      );
  }
}
