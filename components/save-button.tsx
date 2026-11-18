import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { resolveLocale, translate, type MessageKey } from '../lib/i18n';
import { getSavedVideos, saveVideo, unsaveVideo, watchSavedVideos } from '../lib/saved-videos';
import { DEFAULT_SETTINGS, getSettings, watchSettings } from '../lib/settings';
import { events } from '../lib/youtube/selectors';
import { currentVideoId, readVideo } from '../lib/youtube/video';

/**
 * Styles for the shadow root. YouTube's own CSS variables do not reach the shadow root reliably,
 * so the button carries its own colors: always the opposite of the page theme, like Subscribe.
 */
export const SAVE_BUTTON_CSS = `
  button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 0 12px;
    height: 36px;
    padding: 0 16px;
    border: 0;
    border-radius: 18px;
    background: #0f0f0f;
    color: #ffffff;
    font: 500 14px/36px Roboto, Arial, sans-serif;
    white-space: nowrap;
    cursor: pointer;
  }
  button:hover { background: #272727; }
  button[data-page-theme='dark'] { background: #f1f1f1; color: #0f0f0f; }
  button[data-page-theme='dark']:hover { background: #d9d9d9; }
  button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  svg { flex: none; }
`;

type PageTheme = 'light' | 'dark';

/** YouTube marks its dark theme with a `dark` attribute on <html>, whatever the OS says. */
function readPageTheme(): PageTheme {
  return document.documentElement.hasAttribute('dark') ? 'dark' : 'light';
}

function usePageTheme() {
  const [theme, setTheme] = useState(readPageTheme);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readPageTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dark'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

function useLocale() {
  const [setting, setSetting] = useState(DEFAULT_SETTINGS.locale);
  useEffect(() => {
    let active = true;
    void getSettings().then((settings) => active && setSetting(settings.locale));
    const stop = watchSettings((settings) => setSetting(settings.locale));
    return () => {
      active = false;
      stop();
    };
  }, []);
  return resolveLocale(setting, navigator.language);
}

/** The video on screen. YouTube reuses the action bar across videos, so follow navigation. */
function useVideoId() {
  const [id, setId] = useState(() => currentVideoId());
  useEffect(() => {
    const update = () => setId(currentVideoId());
    document.addEventListener(events.navigateFinish, update);
    return () => document.removeEventListener(events.navigateFinish, update);
  }, []);
  return id;
}

function useIsSaved(id: string | undefined) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    let active = true;
    const apply = (list: { id: string }[]) => active && setSavedIds(new Set(list.map((v) => v.id)));
    void getSavedVideos().then(apply);
    const stop = watchSavedVideos(apply);
    return () => {
      active = false;
      stop();
    };
  }, []);
  return id !== undefined && savedIds.has(id);
}

export function SaveButton() {
  const locale = useLocale();
  const id = useVideoId();
  const saved = useIsSaved(id);
  const pageTheme = usePageTheme();
  if (!id) return null;

  const t = (key: MessageKey) => translate(locale, key);
  const label = saved ? t('save.button.saved') : t('save.button.save');
  const title = saved ? t('save.button.saved.title') : t('save.button.save.title');

  return (
    <button
      type="button"
      aria-pressed={saved}
      data-page-theme={pageTheme}
      title={title}
      onClick={() => void (saved ? unsaveVideo(id) : saveVideo(readVideo(id)))}
    >
      <Bookmark size={18} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
      {label}
    </button>
  );
}
