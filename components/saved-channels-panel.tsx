import { ChevronDown, ChevronUp, Download, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../lib/app-context';
import { downloadJson } from '../lib/download-json';
import {
  InvalidChannelImportError,
  channelUrl,
  getSavedChannels,
  importChannels,
  moveChannel,
  serializeChannels,
  unsaveChannel,
  watchSavedChannels,
  type SavedChannel,
} from '../lib/saved-channels';

function useSavedChannels() {
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
  return channels;
}

/** The saved list: reorder, remove, export and import. Reads and writes storage directly. */
export function SavedChannelsPanel() {
  const { t, locale } = useApp();
  const channels = useSavedChannels();
  const fileInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ text: string; error: boolean } | undefined>();

  if (!channels) return null;

  const tag = locale.replace('_', '-');
  const countKey = new Intl.PluralRules(tag).select(channels.length) === 'one' ? 'one' : 'other';
  const formatDate = new Intl.DateTimeFormat(tag, { dateStyle: 'medium' });

  async function onImport(file: File | undefined) {
    if (!file) return;
    try {
      const { added, skipped } = await importChannels(await file.text());
      setStatus({ text: t('saved.import.done', { added, skipped }), error: false });
    } catch (error) {
      if (!(error instanceof InvalidChannelImportError)) throw error;
      setStatus({ text: t('saved.import.error'), error: true });
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
        <p className="mr-auto text-sm text-muted">
          {t(`channels.count.${countKey}`, { count: channels.length })}
        </p>
        <button
          type="button"
          className="btn"
          disabled={channels.length === 0}
          onClick={() => downloadJson(serializeChannels(channels), 'bettertube-channels')}
        >
          <Download size={16} aria-hidden="true" />
          {t('saved.export')}
        </button>
        <button type="button" className="btn" onClick={() => fileInput.current?.click()}>
          <Upload size={16} aria-hidden="true" />
          {t('saved.import')}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            void onImport(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>

      <p
        role="status"
        className={`text-sm ${status ? 'pt-3' : ''} ${status?.error ? 'text-ink font-bold' : 'text-muted'}`}
      >
        {status?.text}
      </p>

      {channels.length === 0 ? (
        <div className="max-w-prose py-8">
          <p className="text-xl font-bold">{t('channels.empty.title')}</p>
          <p className="mt-2 text-base text-muted">{t('channels.empty.desc')}</p>
        </div>
      ) : (
        <ul>
          {channels.map((channel, index) => (
            <li key={channel.id} className="flex items-center gap-4 border-b border-line py-4">
              <a
                href={channelUrl(channel.id)}
                target="_blank"
                rel="noreferrer"
                tabIndex={-1}
                aria-hidden="true"
                className="shrink-0"
              >
                {channel.avatar ? (
                  <img
                    src={channel.avatar}
                    alt=""
                    loading="lazy"
                    className="size-14 rounded-full bg-surface object-cover"
                  />
                ) : (
                  <span className="block size-14 rounded-full bg-surface" />
                )}
              </a>
              <div className="min-w-0 flex-1">
                <a
                  href={channelUrl(channel.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="line-clamp-2 text-base font-medium underline-offset-4 hover:underline"
                >
                  {channel.name}
                </a>
                <p className="mt-0.5 truncate text-sm text-muted">
                  {t('saved.savedOn', { date: formatDate.format(channel.savedAt) })}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-center sm:flex-row">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`${t('saved.moveUp')}: ${channel.name}`}
                  title={t('saved.moveUp')}
                  disabled={index === 0}
                  onClick={() => void moveChannel(channel.id, -1)}
                >
                  <ChevronUp size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`${t('saved.moveDown')}: ${channel.name}`}
                  title={t('saved.moveDown')}
                  disabled={index === channels.length - 1}
                  onClick={() => void moveChannel(channel.id, 1)}
                >
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`${t('saved.remove')}: ${channel.name}`}
                  title={t('saved.remove')}
                  onClick={() => void unsaveChannel(channel.id)}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
