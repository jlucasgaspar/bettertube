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

// --- Removing a video -----------------------------------------------------------------------
//
// This edits the user's real Watch Later list through YouTube's own InnerTube endpoint, the same
// call the site makes when you press "Remove from Watch Later". It is unofficial and can change.

interface InnertubeConfig {
  apiKey?: string;
  clientName: string;
  clientVersion: string;
}

/** Read the web client name and version (and API key) from the text of a YouTube page. */
export function readInnertubeConfig(pageText: string): InnertubeConfig {
  const version = /"INNERTUBE_CLIENT_VERSION":"([^"]+)"/.exec(pageText)?.[1];
  if (!version) throw new WatchLaterError('YouTube client version not found');
  return {
    apiKey: /"INNERTUBE_API_KEY":"([^"]+)"/.exec(pageText)?.[1],
    clientName: /"INNERTUBE_CLIENT_NAME":"([^"]+)"/.exec(pageText)?.[1] ?? 'WEB',
    clientVersion: version,
  };
}

/** The text of the page script that carries YouTube's config. */
function pageConfigText(): string {
  for (const script of document.scripts) {
    const text = script.textContent ?? '';
    if (text.includes('INNERTUBE_CLIENT_VERSION')) return text;
  }
  return '';
}

/** YouTube's `SAPISIDHASH` proof, built from the readable SAPISID cookie of the signed-in session. */
export async function sapisidHash(cookie: string, origin: string, nowSeconds: number) {
  const sapisid = /(?:^|;\s*)(?:__Secure-3PAPISID|SAPISID)=([^;]+)/.exec(cookie)?.[1];
  if (!sapisid) throw new WatchLaterError('Not signed in to YouTube');
  const data = new TextEncoder().encode(`${nowSeconds} ${sapisid} ${origin}`);
  const digest = await crypto.subtle.digest('SHA-1', data);
  const hex = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return `SAPISIDHASH ${nowSeconds}_${hex}`;
}

interface RemoveOptions {
  fetcher?: typeof fetch;
  cookie?: string;
  origin?: string;
  pageText?: string;
  nowSeconds?: number;
}

/** Remove one video from the user's Watch Later playlist on YouTube. Throws if it did not work. */
export async function removeFromWatchLater(
  videoId: string,
  {
    fetcher = fetch,
    cookie = document.cookie,
    origin = location.origin,
    pageText = pageConfigText(),
    nowSeconds = Math.floor(Date.now() / 1000),
  }: RemoveOptions = {},
): Promise<void> {
  const config = readInnertubeConfig(pageText);
  const authorization = await sapisidHash(cookie, origin, nowSeconds);
  const query = config.apiKey ? `?key=${encodeURIComponent(config.apiKey)}&prettyPrint=false` : '';
  const response = await fetcher(`/youtubei/v1/browse/edit_playlist${query}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
      'X-Goog-AuthUser': '0',
      'X-Origin': origin,
    },
    body: JSON.stringify({
      context: { client: { clientName: config.clientName, clientVersion: config.clientVersion } },
      playlistId: 'WL',
      actions: [{ action: 'ACTION_REMOVE_VIDEO_BY_VIDEO_ID', removedVideoId: videoId }],
    }),
  });
  if (!response.ok) throw new WatchLaterError(`Request failed with ${response.status}`);
  const result = (await response.json()) as { status?: string };
  if (result.status !== 'STATUS_SUCCEEDED') throw new WatchLaterError('YouTube did not confirm');
}
