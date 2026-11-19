import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { resolveLocale, translate, type MessageKey } from '../lib/i18n';
import { channelUrl } from '../lib/saved-channels';
import { fetchWatchLaterCached, type WatchLaterVideo } from '../lib/youtube/watch-later';
import { usePageTheme, useSavedChannelList, useSavedVideoList, useSettings } from './inject-hooks';

/** Rows shown at first, and added by each "Show more". Keeps the side column short. */
const FIRST_ROWS = 4;
const MORE_ROWS = 8;

/** Styles for the shadow root: compact rows that fit the watch page side column. */
export const SAVED_RECOMMENDATIONS_CSS = `
  :host { display: block; }
  .panel {
    --ink: #0f0f0f; --muted: #606060; --line: #e5e5e5; --surface: #f2f2f2;
    box-sizing: border-box; padding: 0 0 16px;
    color: var(--ink);
    font: 400 14px/1.4 Roboto, Arial, sans-serif;
  }
  .panel[data-page-theme='dark'] { --ink: #f1f1f1; --muted: #aaaaaa; --line: #3f3f3f; --surface: #272727; }
  section + section { margin-top: 20px; }
  h2 { margin: 0 0 12px; font: 700 16px/1.2 Roboto, Arial, sans-serif; }
  .list { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
  a { display: flex; gap: 8px; color: inherit; text-decoration: none; }
  a:focus-visible, button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  .thumb {
    flex: none; width: 168px; aspect-ratio: 16 / 9;
    border-radius: 8px; background: var(--surface); object-fit: cover;
  }
  .title {
    display: -webkit-box; overflow: hidden;
    -webkit-box-orient: vertical; -webkit-line-clamp: 2;
    font-weight: 500; font-size: 14px; line-height: 1.3;
  }
  a:hover .title, a:hover .name { text-decoration: underline; }
  .meta { display: block; margin-top: 2px; color: var(--muted); font-size: 12px; }
  .channel { align-items: center; }
  .avatar {
    flex: none; width: 40px; height: 40px; border-radius: 50%;
    background: var(--surface); object-fit: cover;
  }
  .name { font-weight: 500; font-size: 14px; overflow-wrap: anywhere; }
  .state { margin: 0; color: var(--muted); }
  .actions { display: flex; gap: 8px; margin-top: 12px; }
  button {
    height: 32px; padding: 0 14px; border: 1px solid var(--line); border-radius: 16px;
    background: transparent; color: var(--ink); font: 500 13px Roboto, Arial, sans-serif; cursor: pointer;
  }
  button:hover { background: var(--surface); }
`;

type Translate = (key: MessageKey) => string;

/** A titled list that starts short and grows on request, so 100 saved items never flood the page. */
function Group<T>({
  title,
  items,
  t,
  row,
}: {
  title: string;
  items: T[];
  t: Translate;
  row: (item: T) => ReactNode;
}) {
  const [shown, setShown] = useState(FIRST_ROWS);
  const visible = items.slice(0, shown);
  return (
    <section>
      <h2>{title}</h2>
      <ul className="list">{visible.map(row)}</ul>
      {items.length > FIRST_ROWS && (
        <div className="actions">
          {shown < items.length && (
            <button type="button" onClick={() => setShown((count) => count + MORE_ROWS)}>
              {t('customHome.showMore')}
            </button>
          )}
          {shown > FIRST_ROWS && (
            <button type="button" onClick={() => setShown(FIRST_ROWS)}>
              {t('customHome.showLess')}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

interface VideoItem {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

const videoRow = (video: VideoItem) => (
  <li key={video.id}>
    <a href={`/watch?v=${video.id}`}>
      <img className="thumb" src={video.thumbnail} alt="" loading="lazy" />
      <span>
        <span className="title">{video.title}</span>
        {video.channel && <span className="meta">{video.channel}</span>}
      </span>
    </a>
  </li>
);

type WatchLaterState =
  { status: 'loading' } | { status: 'error' } | { status: 'ready'; videos: WatchLaterVideo[] };

function useWatchLater(): WatchLaterState {
  const [state, setState] = useState<WatchLaterState>({ status: 'loading' });
  useEffect(() => {
    let active = true;
    fetchWatchLaterCached().then(
      (videos) => active && setState({ status: 'ready', videos }),
      () => active && setState({ status: 'error' }),
    );
    return () => {
      active = false;
    };
  }, []);
  return state;
}

/**
 * Your own lists in the watch page side column while suggested videos are hidden: saved videos,
 * Watch Later and saved channels. Empty lists stay out of the way.
 */
export function SavedRecommendations() {
  const settings = useSettings();
  const pageTheme = usePageTheme();
  const locale = resolveLocale(settings.locale, navigator.language);
  const t: Translate = (key) => translate(locale, key);
  const videos = useSavedVideoList();
  const channels = useSavedChannelList();
  const watchLater = useWatchLater();

  const loading = !videos || !channels;
  const hasWatchLater = watchLater.status === 'ready' && watchLater.videos.length > 0;
  const nothing =
    !loading &&
    videos.length === 0 &&
    channels.length === 0 &&
    watchLater.status === 'ready' &&
    !hasWatchLater;

  return (
    <div className="panel" data-page-theme={pageTheme}>
      {loading && <p className="state">{t('customHome.loading')}</p>}
      {nothing && (
        <section>
          <h2>{t('customHome.saved.title')}</h2>
          <p className="state">{t('customHome.saved.empty')}</p>
        </section>
      )}
      {videos && videos.length > 0 && (
        <Group title={t('customHome.saved.title')} items={videos} t={t} row={videoRow} />
      )}
      {watchLater.status === 'error' && (
        <section>
          <h2>{t('customHome.watchLater.title')}</h2>
          <p className="state" role="alert">
            {t('customHome.watchLater.error')}
          </p>
        </section>
      )}
      {hasWatchLater && (
        <Group
          title={t('customHome.watchLater.title')}
          items={watchLater.videos}
          t={t}
          row={videoRow}
        />
      )}
      {channels && channels.length > 0 && (
        <Group
          title={t('customHome.channels.title')}
          items={channels}
          t={t}
          row={(channel) => (
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
          )}
        />
      )}
    </div>
  );
}
