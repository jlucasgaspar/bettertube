export interface WatchLaterVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

const WATCH_LATER_URL = '/playlist?list=WL';
const INITIAL_DATA = /var ytInitialData\s*=\s*(\{.*?\});\s*<\/script>/s;

interface Runs {
  runs?: { text?: string }[];
  simpleText?: string;
}

const textOf = (value: Runs | undefined) => value?.runs?.[0]?.text ?? value?.simpleText ?? '';

/** Collect every `playlistVideoRenderer` in the page data, wherever YouTube nests them. */
function collectRenderers(node: unknown, found: Record<string, unknown>[] = []) {
  if (Array.isArray(node)) {
    for (const item of node) collectRenderers(item, found);
  } else if (typeof node === 'object' && node !== null) {
    for (const [key, value] of Object.entries(node)) {
      if (key === 'playlistVideoRenderer' && typeof value === 'object' && value !== null) {
        found.push(value as Record<string, unknown>);
      } else {
        collectRenderers(value, found);
      }
    }
  }
  return found;
}

export class WatchLaterError extends Error {}

/** Extract the videos from the HTML of the Watch Later playlist page. Throws if the page changed. */
export function parseWatchLater(html: string): WatchLaterVideo[] {
  const match = INITIAL_DATA.exec(html);
  if (!match?.[1]) throw new WatchLaterError('Page data not found');
  let data: unknown;
  try {
    data = JSON.parse(match[1]);
  } catch {
    throw new WatchLaterError('Page data is not valid JSON');
  }
  const videos: WatchLaterVideo[] = [];
  for (const renderer of collectRenderers(data)) {
    const id = renderer.videoId;
    if (typeof id !== 'string') continue;
    const thumbnails = (renderer.thumbnail as { thumbnails?: { url?: string }[] } | undefined)
      ?.thumbnails;
    videos.push({
      id,
      title: textOf(renderer.title as Runs | undefined) || id,
      channel: textOf(renderer.shortBylineText as Runs | undefined),
      thumbnail: thumbnails?.at(-1)?.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    });
  }
  return videos;
}

/** The first page of the user's Watch Later list, read with their YouTube session. */
export async function fetchWatchLater(fetcher: typeof fetch = fetch): Promise<WatchLaterVideo[]> {
  const response = await fetcher(WATCH_LATER_URL, { credentials: 'include' });
  if (!response.ok) throw new WatchLaterError(`Request failed with ${response.status}`);
  return parseWatchLater(await response.text());
}
