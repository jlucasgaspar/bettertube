import { ChevronDown, ChevronUp, Download, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../lib/app-context';
import { downloadJson } from '../lib/download-json';
import {
  InvalidImportError,
  getSavedVideos,
  importVideos,
  moveVideo,
  serializeList,
  unsaveVideo,
  watchSavedVideos,
  type SavedVideo,
} from '../lib/saved-videos';

function useSavedVideos() {
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
  return videos;
}

/** The saved list: reorder, remove, export and import. Reads and writes storage directly. */
export function SavedVideosPanel() {
  const { t, locale } = useApp();
  const videos = useSavedVideos();
  const fileInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ text: string; error: boolean } | undefined>();

  if (!videos) return null;

  const tag = locale.replace('_', '-');
  const countKey = new Intl.PluralRules(tag).select(videos.length) === 'one' ? 'one' : 'other';
  const formatDate = new Intl.DateTimeFormat(tag, { dateStyle: 'medium' });

  async function onImport(file: File | undefined) {
    if (!file) return;
    try {
      const { added, skipped } = await importVideos(await file.text());
      setStatus({ text: t('saved.import.done', { added, skipped }), error: false });
    } catch (error) {
      if (!(error instanceof InvalidImportError)) throw error;
      setStatus({ text: t('saved.import.error'), error: true });
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
        <p className="mr-auto text-sm text-muted">
          {t(`saved.count.${countKey}`, { count: videos.length })}
        </p>
        <button
          type="button"
          className="btn"
          disabled={videos.length === 0}
          onClick={() => downloadJson(serializeList(videos), 'bettertube-saved')}
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

      {videos.length === 0 ? (
        <div className="max-w-prose py-8">
          <p className="text-xl font-bold">{t('saved.empty.title')}</p>
          <p className="mt-2 text-base text-muted">{t('saved.empty.desc')}</p>
        </div>
      ) : (
        <ul>
          {videos.map((video, index) => (
            <li key={video.id} className="flex items-center gap-4 border-b border-line py-4">
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noreferrer"
                tabIndex={-1}
                aria-hidden="true"
                className="shrink-0"
              >
                <img
                  src={video.thumbnail}
                  alt=""
                  loading="lazy"
                  className="aspect-video w-32 rounded bg-surface object-cover sm:w-40"
                />
              </a>
              <div className="min-w-0 flex-1">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="line-clamp-2 text-base font-medium underline-offset-4 hover:underline"
                >
                  {video.title}
                </a>
                {video.channel && (
                  <p className="mt-0.5 truncate text-sm text-muted">{video.channel}</p>
                )}
                <p className="mt-0.5 text-sm text-muted">
                  {t('saved.savedOn', { date: formatDate.format(video.savedAt) })}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-center sm:flex-row">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`${t('saved.moveUp')}: ${video.title}`}
                  title={t('saved.moveUp')}
                  disabled={index === 0}
                  onClick={() => void moveVideo(video.id, -1)}
                >
                  <ChevronUp size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`${t('saved.moveDown')}: ${video.title}`}
                  title={t('saved.moveDown')}
                  disabled={index === videos.length - 1}
                  onClick={() => void moveVideo(video.id, 1)}
                >
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`${t('saved.remove')}: ${video.title}`}
                  title={t('saved.remove')}
                  onClick={() => void unsaveVideo(video.id)}
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
