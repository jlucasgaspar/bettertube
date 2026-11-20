export interface UserPlaylist {
  id: string;
  title: string;
  thumbnail: string;
  /** Number of videos, when YouTube says it. */
  count?: number;
}

const PLAYLISTS_URL = '/feed/playlists';
const INITIAL_DATA = /var ytInitialData\s*=\s*(\{.*?\});\s*<\/script>/s;

/** Watch Later and Liked videos show up in the playlists feed, but they have their own place. */
const SKIPPED_IDS = new Set(['WL', 'LL']);

export class PlaylistsError extends Error {}

type Node = Record<string, unknown>;
const isNode = (value: unknown): value is Node => typeof value === 'object' && value !== null;

/** Collect the playlist entries, in either layout YouTube uses, wherever they are nested. */
function collectEntries(node: unknown, found: Node[] = []): Node[] {
  if (Array.isArray(node)) {
    for (const item of node) collectEntries(item, found);
  } else if (isNode(node)) {
    for (const [key, value] of Object.entries(node)) {
      const lockup =
        key === 'lockupViewModel' &&
        isNode(value) &&
        value.contentType === 'LOCKUP_CONTENT_TYPE_PLAYLIST';
      if (
        lockup ||
        ((key === 'gridPlaylistRenderer' || key === 'playlistRenderer') && isNode(value))
      ) {
        found.push(value as Node);
      } else {
        collectEntries(value, found);
      }
    }
  }
  return found;
}

/** The last (largest) image url found anywhere under `node`. */
function lastImageUrl(node: unknown): string | undefined {
  let url: string | undefined;
  const walk = (value: unknown) => {
    if (Array.isArray(value)) {
      const last = value.at(-1);
      if (isNode(last) && typeof last.url === 'string' && /^https?:/.test(last.url)) {
        url = last.url;
        return;
      }
      value.forEach(walk);
    } else if (isNode(value)) {
      Object.values(value).forEach(walk);
    }
  };
  walk(node);
  return url;
}

/** First number in a text such as "12 videos" or "1.234 vídeos". */
function countFromText(text: unknown): number | undefined {
  if (typeof text !== 'string') return undefined;
  const digits = /\d[\d.,\s]*/.exec(text)?.[0]?.replace(/\D/g, '');
  return digits ? Number(digits) : undefined;
}

function textOf(value: unknown): string {
  if (!isNode(value)) return '';
  const runs = value.runs;
  if (Array.isArray(runs) && isNode(runs[0]) && typeof runs[0].text === 'string')
    return runs[0].text;
  if (typeof value.simpleText === 'string') return value.simpleText;
  if (typeof value.content === 'string') return value.content;
  return '';
}

/** The text of the first badge (the "N videos" label over a playlist thumbnail). */
function badgeText(node: unknown): string | undefined {
  let found: string | undefined;
  const walk = (value: unknown) => {
    if (found !== undefined) return;
    if (Array.isArray(value)) value.forEach(walk);
    else if (isNode(value)) {
      const badge = value.thumbnailBadgeViewModel;
      if (isNode(badge) && typeof badge.text === 'string') found = badge.text;
      else Object.values(value).forEach(walk);
    }
  };
  walk(node);
  return found;
}

function toPlaylist(entry: Node): UserPlaylist | undefined {
  const lockup = entry.contentType === 'LOCKUP_CONTENT_TYPE_PLAYLIST';
  const id = lockup ? entry.contentId : entry.playlistId;
  if (typeof id !== 'string' || SKIPPED_IDS.has(id)) return undefined;
  const metadata = isNode(entry.metadata) ? entry.metadata : {};
  const lockupMetadata = isNode(metadata.lockupMetadataViewModel)
    ? metadata.lockupMetadataViewModel
    : {};
  const title = lockup ? textOf(lockupMetadata.title) : textOf(entry.title);
  const count = lockup
    ? countFromText(badgeText(entry.contentImage))
    : (countFromText(entry.videoCount) ?? countFromText(textOf(entry.videoCountText)));
  const thumbnail = lastImageUrl(entry.contentImage ?? entry.thumbnail ?? entry.thumbnails);
  return {
    id,
    title: title || id,
    thumbnail: thumbnail ?? '',
    ...(count !== undefined && { count }),
  };
}

/** Extract the user's playlists from the HTML of the playlists feed. Throws if the page changed. */
export function parsePlaylists(html: string): UserPlaylist[] {
  const match = INITIAL_DATA.exec(html);
  if (!match?.[1]) throw new PlaylistsError('Page data not found');
  let data: unknown;
  try {
    data = JSON.parse(match[1]);
  } catch {
    throw new PlaylistsError('Page data is not valid JSON');
  }
  const seen = new Set<string>();
  const playlists: UserPlaylist[] = [];
  for (const entry of collectEntries(data)) {
    const playlist = toPlaylist(entry);
    if (playlist && !seen.has(playlist.id)) {
      seen.add(playlist.id);
      playlists.push(playlist);
    }
  }
  return playlists;
}

/** The first page of the user's playlists, read with their YouTube session. */
export async function fetchPlaylists(fetcher: typeof fetch = fetch): Promise<UserPlaylist[]> {
  const response = await fetcher(PLAYLISTS_URL, { credentials: 'include' });
  if (!response.ok) throw new PlaylistsError(`Request failed with ${response.status}`);
  return parsePlaylists(await response.text());
}
