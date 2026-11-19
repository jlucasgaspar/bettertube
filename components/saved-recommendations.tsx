import { useEffect, useState } from 'react';
import { resolveLocale, translate } from '../lib/i18n';
import { getSavedVideos, watchSavedVideos, type SavedVideo } from '../lib/saved-videos';
import { usePageTheme, useSettings } from './inject-hooks';

/** Styles for the shadow root: a compact vertical list that fits the watch page side column. */
export const SAVED_RECOMMENDATIONS_CSS = `
  :host { display: block; }
  .panel {
    --ink: #0f0f0f; --muted: #606060; --surface: #f2f2f2;
    box-sizing: border-box; padding: 0 0 16px;
    color: var(--ink);
    font: 400 14px/1.4 Roboto, Arial, sans-serif;
  }
  .panel[data-page-theme='dark'] { --ink: #f1f1f1; --muted: #aaaaaa; --surface: #272727; }
  h2 { margin: 0 0 12px; font: 700 16px/1.2 Roboto, Arial, sans-serif; }
  .list { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
  a { display: flex; gap: 8px; color: inherit; text-decoration: none; }
  a:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  .thumb {
    flex: none; width: 168px; aspect-ratio: 16 / 9;
    border-radius: 8px; background: var(--surface); object-fit: cover;
  }
  .title {
    display: -webkit-box; overflow: hidden;
    -webkit-box-orient: vertical; -webkit-line-clamp: 2;
    font-weight: 500; font-size: 14px; line-height: 1.3;
  }
  a:hover .title { text-decoration: underline; }
  .meta { margin-top: 2px; color: var(--muted); font-size: 12px; }
  .state { margin: 0; color: var(--muted); }
`;

/** Saved videos shown in the watch page side column while suggested videos are hidden. */
export function SavedRecommendations() {
  const settings = useSettings();
  const pageTheme = usePageTheme();
  const locale = resolveLocale(settings.locale, navigator.language);
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
    <div className="panel" data-page-theme={pageTheme}>
      <h2>{translate(locale, 'customHome.saved.title')}</h2>
      {!videos ? (
        <p className="state">{translate(locale, 'customHome.loading')}</p>
      ) : videos.length === 0 ? (
        <p className="state">{translate(locale, 'customHome.saved.empty')}</p>
      ) : (
        <ul className="list">
          {videos.map((video) => (
            <li key={video.id}>
              <a href={`/watch?v=${video.id}`}>
                <img className="thumb" src={video.thumbnail} alt="" loading="lazy" />
                <span>
                  <span className="title">{video.title}</span>
                  {video.channel && <span className="meta">{video.channel}</span>}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
