import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { translate, type MessageKey } from '../lib/i18n';
import {
  getSavedChannels,
  saveChannel,
  unsaveChannel,
  watchSavedChannels,
} from '../lib/saved-channels';
import { currentChannelId, readChannel } from '../lib/youtube/channel';
import { events } from '../lib/youtube/selectors';
import { useLocale, usePageTheme } from './inject-hooks';
import { SAVE_BUTTON_CSS } from './save-button';

/** Same look as the video Save button, spaced for the channel header's button row. */
export const SAVE_CHANNEL_CSS = `${SAVE_BUTTON_CSS}
  button { margin: 0 0 0 8px; }
`;

/** The channel on screen. YouTube reuses the header across channels, so follow navigation. */
function useChannelId() {
  const [id, setId] = useState(() => currentChannelId());
  useEffect(() => {
    const update = () => setId(currentChannelId());
    document.addEventListener(events.navigateFinish, update);
    return () => document.removeEventListener(events.navigateFinish, update);
  }, []);
  return id;
}

function useIsSaved(id: string | undefined) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    let active = true;
    const apply = (list: { id: string }[]) => active && setSavedIds(new Set(list.map((c) => c.id)));
    void getSavedChannels().then(apply);
    const stop = watchSavedChannels(apply);
    return () => {
      active = false;
      stop();
    };
  }, []);
  return id !== undefined && savedIds.has(id);
}

export function SaveChannelButton() {
  const locale = useLocale();
  const id = useChannelId();
  const saved = useIsSaved(id);
  const pageTheme = usePageTheme();
  if (!id) return null;

  const t = (key: MessageKey) => translate(locale, key);
  const label = saved ? t('channel.button.saved') : t('channel.button.save');
  const title = saved ? t('channel.button.saved.title') : t('channel.button.save.title');

  return (
    <button
      type="button"
      aria-pressed={saved}
      data-page-theme={pageTheme}
      title={title}
      onClick={() => void (saved ? unsaveChannel(id) : saveChannel(readChannel(id)))}
    >
      <Bookmark size={18} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
      {label}
    </button>
  );
}
