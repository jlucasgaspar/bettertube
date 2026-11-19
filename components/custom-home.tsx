import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { resolveLocale, translate, type MessageKey } from '../lib/i18n';
import {
  channelUrl,
  getSavedChannels,
  watchSavedChannels,
  type SavedChannel,
} from '../lib/saved-channels';
import { getSavedVideos, watchSavedVideos, type SavedVideo } from '../lib/saved-videos';
import { fetchWatchLater, type WatchLaterVideo } from '../lib/youtube/watch-later';
import { usePageTheme, useSettings } from './inject-hooks';

/**
 * Styles for the shadow root. YouTube's own CSS variables do not reach the shadow root reliably,
 * so colors follow the page theme through `data-page-theme`, like the Save buttons.
 */
export const CUSTOM_HOME_CSS = `
  :host { display: block; }
  .home {
    --ink: #0f0f0f; --muted: #606060; --line: #e5e5e5; --surface: #f2f2f2;
    box-sizing: border-box;
    padding: 24px 24px 48px;
    color: var(--ink);
    font: 400 14px/1.4 Roboto, Arial, sans-serif;
  }
  .home[data-page-theme='dark'] {
    --ink: #f1f1f1; --muted: #aaaaaa; --line: #3f3f3f; --surface: #272727;
  }
  section + section { margin-top: 40px; }
  h2 { margin: 0 0 16px; font: 700 20px/1.2 Roboto, Arial, sans-serif; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px 16px;
    margin: 0; padding: 0; list-style: none;
  }
  a { color: inherit; text-decoration: none; }
  a:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  .thumb {
    display: block; width: 100%; aspect-ratio: 16 / 9;
    border-radius: 12px; background: var(--surface); object-fit: cover;
  }
  .title {
    display: -webkit-box; margin-top: 8px; overflow: hidden;
    -webkit-box-orient: vertical; -webkit-line-clamp: 2;
    font-weight: 500; font-size: 16px; line-height: 1.3;
  }
  a:hover .title, .channel:hover .name { text-decoration: underline; }
  .meta { margin-top: 2px; color: var(--muted); font-size: 13px; }
  .channel { display: flex; align-items: center; gap: 12px; }
  .avatar {
    flex: none; width: 56px; height: 56px; border-radius: 50%;
    background: var(--surface); object-fit: cover;
  }
  .name { font-weight: 500; font-size: 16px; overflow-wrap: anywhere; }
  .state { margin: 0; color: var(--muted); }
  button {
    margin-top: 8px; height: 32px; padding: 0 14px; border: 1px solid var(--line);
    border-radius: 16px; background: transparent; color: var(--ink);
    font: 500 14px Roboto, Arial, sans-serif; cursor: pointer;
  }
  button:hover { background: var(--surface); }
  button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
`;

type Translate = (key: MessageKey) => string;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

interface Card {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

function VideoGrid({ videos }: { videos: Card[] }) {
  return (
    <ul className="grid">
      {videos.map((video) => (
        <li key={video.id}>
          <a href={`/watch?v=${video.id}`}>
            <img className="thumb" src={video.thumbnail} alt="" loading="lazy" />
            <span className="title">{video.title}</span>
            {video.channel && <div className="meta">{video.channel}</div>}
          </a>
        </li>
      ))}
    </ul>
  );
}

function SavedVideosSection({ t }: { t: Translate }) {
  const [videos, setVideos] = useState<SavedVideo[] | undefined>();
  useEffect(() => {
    let active = true;
    void getSavedVideos().then((list) => active && setVideos(list));
    const stop = watchSavedVideos((list) => setVideos(list));
    return () => {
      active = false;
      stop();
    };
  }, []);

  return (
    <Section title={t('customHome.saved.title')}>
      {!videos ? (
        <p className="state">{t('customHome.loading')}</p>
      ) : videos.length === 0 ? (
        <p className="state">{t('customHome.saved.empty')}</p>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </Section>
  );
}

type WatchLaterState =
  { status: 'loading' } | { status: 'error' } | { status: 'ready'; videos: WatchLaterVideo[] };

function WatchLaterSection({ t }: { t: Translate }) {
  const [state, setState] = useState<WatchLaterState>({ status: 'loading' });

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetchWatchLater().then(
      (videos) => active && setState({ status: 'ready', videos }),
      () => active && setState({ status: 'error' }),
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: 'loading' });
    setAttempt((count) => count + 1);
  };

  return (
    <Section title={t('customHome.watchLater.title')}>
      {state.status === 'loading' && <p className="state">{t('customHome.loading')}</p>}
      {state.status === 'error' && (
        <div>
          <p className="state" role="alert">
            {t('customHome.watchLater.error')}
          </p>
          <button type="button" onClick={retry}>
            {t('customHome.retry')}
          </button>
        </div>
      )}
      {state.status === 'ready' &&
        (state.videos.length === 0 ? (
          <p className="state">{t('customHome.watchLater.empty')}</p>
        ) : (
          <VideoGrid videos={state.videos} />
        ))}
    </Section>
  );
}

function SavedChannelsSection({ t }: { t: Translate }) {
  const [channels, setChannels] = useState<SavedChannel[] | undefined>();
  useEffect(() => {
    let active = true;
    void getSavedChannels().then((list) => active && setChannels(list));
    const stop = watchSavedChannels((list) => setChannels(list));
    return () => {
      active = false;
      stop();
    };
  }, []);

  return (
    <Section title={t('customHome.channels.title')}>
      {!channels ? (
        <p className="state">{t('customHome.loading')}</p>
      ) : channels.length === 0 ? (
        <p className="state">{t('customHome.channels.empty')}</p>
      ) : (
        <ul className="grid">
          {channels.map((channel) => (
            <li key={channel.id}>
              <a className="channel" href={channelUrl(channel.id)}>
                {channel.avatar ? (
                  <img className="avatar" src={channel.avatar} alt="" loading="lazy" />
                ) : (
                  <span className="avatar" aria-hidden="true" />
                )}
                <span className="name">{channel.name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/** The custom home page: one section per enabled option, in a fixed order. */
export function CustomHome() {
  const settings = useSettings();
  const pageTheme = usePageTheme();
  const locale = resolveLocale(settings.locale, navigator.language);
  const t: Translate = (key) => translate(locale, key);
  const { showSaved, showWatchLater, showChannels } = settings.home;

  return (
    <div className="home" data-page-theme={pageTheme}>
      {showSaved && <SavedVideosSection t={t} />}
      {showWatchLater && <WatchLaterSection t={t} />}
      {showChannels && <SavedChannelsSection t={t} />}
    </div>
  );
}
