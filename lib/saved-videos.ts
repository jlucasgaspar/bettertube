import { storage } from 'wxt/utils/storage';

export interface SavedVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  /** Epoch milliseconds. */
  savedAt: number;
}

export const EXPORT_FORMAT = 'bettertube-saved-videos';
export const EXPORT_VERSION = 1;

const VIDEO_ID = /^[\w-]{6,20}$/;

export function thumbnailFor(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** Return a valid SavedVideo, or undefined when the input cannot be repaired. */
export function normalizeVideo(input: unknown): SavedVideo | undefined {
  if (typeof input !== 'object' || input === null) return undefined;
  const raw = input as Record<string, unknown>;
  if (typeof raw.id !== 'string' || !VIDEO_ID.test(raw.id)) return undefined;
  const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
  return {
    id: raw.id,
    title: text(raw.title) || raw.id,
    channel: text(raw.channel),
    thumbnail: text(raw.thumbnail) || thumbnailFor(raw.id),
    savedAt:
      typeof raw.savedAt === 'number' && Number.isFinite(raw.savedAt) ? raw.savedAt : Date.now(),
  };
}

/** Normalize a stored list: invalid entries are dropped, duplicates keep the first. */
export function normalizeList(stored: unknown): SavedVideo[] {
  if (!Array.isArray(stored)) return [];
  const seen = new Set<string>();
  const result: SavedVideo[] = [];
  for (const item of stored) {
    const video = normalizeVideo(item);
    if (video && !seen.has(video.id)) {
      seen.add(video.id);
      result.push(video);
    }
  }
  return result;
}

/** Newest first. Saving an already saved video keeps its place. */
export function addToList(list: SavedVideo[], video: SavedVideo): SavedVideo[] {
  return list.some((item) => item.id === video.id) ? list : [video, ...list];
}

export function removeFromList(list: SavedVideo[], id: string): SavedVideo[] {
  return list.filter((item) => item.id !== id);
}

/** Move an item one step; out-of-range moves return the list unchanged. */
export function moveInList(list: SavedVideo[], id: string, direction: -1 | 1): SavedVideo[] {
  const from = list.findIndex((item) => item.id === id);
  const to = from + direction;
  if (from === -1 || to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  if (item) next.splice(to, 0, item);
  return next;
}

export function serializeList(list: SavedVideo[], now = Date.now()): string {
  return JSON.stringify(
    { format: EXPORT_FORMAT, version: EXPORT_VERSION, exportedAt: now, videos: list },
    null,
    2,
  );
}

export interface ImportResult {
  list: SavedVideo[];
  added: number;
  skipped: number;
}

export class InvalidImportError extends Error {}

/**
 * Merge an exported file into the current list. Videos already saved keep their place,
 * new ones are appended in file order, invalid entries are counted as skipped.
 */
export function mergeImport(current: SavedVideo[], json: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new InvalidImportError('Not valid JSON');
  }
  const entries =
    typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as { format?: unknown; videos?: unknown }).videos
      : parsed;
  if (!Array.isArray(entries)) throw new InvalidImportError('No video list found');

  const known = new Set(current.map((video) => video.id));
  const list = [...current];
  let added = 0;
  let skipped = 0;
  for (const entry of entries) {
    const video = normalizeVideo(entry);
    if (!video) skipped++;
    else if (!known.has(video.id)) {
      known.add(video.id);
      list.push(video);
      added++;
    }
  }
  return { list, added, skipped };
}

export const savedVideosItem = storage.defineItem<SavedVideo[]>('local:savedVideos', {
  fallback: [],
  version: 1,
});

export async function getSavedVideos(): Promise<SavedVideo[]> {
  return normalizeList(await savedVideosItem.getValue());
}

/** Read-modify-write against storage. */
async function mutate(change: (list: SavedVideo[]) => SavedVideo[]): Promise<SavedVideo[]> {
  const next = change(await getSavedVideos());
  await savedVideosItem.setValue(next);
  return next;
}

export const saveVideo = (video: SavedVideo) => mutate((list) => addToList(list, video));
export const unsaveVideo = (id: string) => mutate((list) => removeFromList(list, id));
export const moveVideo = (id: string, direction: -1 | 1) =>
  mutate((list) => moveInList(list, id, direction));

export async function importVideos(json: string): Promise<ImportResult> {
  const result = mergeImport(await getSavedVideos(), json);
  await savedVideosItem.setValue(result.list);
  return result;
}

export function watchSavedVideos(callback: (list: SavedVideo[]) => void): () => void {
  return savedVideosItem.watch((value) => callback(normalizeList(value)));
}
