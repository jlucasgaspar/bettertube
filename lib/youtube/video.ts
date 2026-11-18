import { thumbnailFor, type SavedVideo } from '../saved-videos';
import { selectors } from './selectors';

export function currentVideoId(url: string = location.href): string | undefined {
  const parsed = new URL(url);
  if (parsed.pathname !== '/watch') return undefined;
  return parsed.searchParams.get('v') ?? undefined;
}

/** Read what the watch page shows about the video. Missing pieces fall back gracefully. */
export function readVideo(id: string, doc: Document = document, now = Date.now()): SavedVideo {
  const title =
    doc.querySelector(selectors.watchTitle)?.textContent?.trim() ||
    doc.title.replace(/\s*-\s*YouTube$/, '').trim() ||
    id;
  const channel = doc.querySelector(selectors.watchChannel)?.textContent?.trim() ?? '';
  return { id, title, channel, thumbnail: thumbnailFor(id), savedAt: now };
}
