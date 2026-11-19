import { storage } from 'wxt/utils/storage';
import { addToList, moveInList, removeFromList } from './saved-videos';

export interface SavedChannel {
  /** Channel path on YouTube without the leading slash: `@handle` or `channel/UC...`. */
  id: string;
  name: string;
  avatar: string;
  /** Epoch milliseconds. */
  savedAt: number;
}

export const CHANNELS_EXPORT_FORMAT = 'bettertube-saved-channels';
export const CHANNELS_EXPORT_VERSION = 1;

const CHANNEL_ID = /^(@[^\s/?#]+|(channel|c|user)\/[^\s/?#]+)$/;

export const channelUrl = (id: string) => `https://www.youtube.com/${id}`;

/** Return a valid SavedChannel, or undefined when the input cannot be repaired. */
export function normalizeChannel(input: unknown): SavedChannel | undefined {
  if (typeof input !== 'object' || input === null) return undefined;
  const raw = input as Record<string, unknown>;
  if (typeof raw.id !== 'string' || !CHANNEL_ID.test(raw.id)) return undefined;
  const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
  return {
    id: raw.id,
    name: text(raw.name) || raw.id,
    avatar: text(raw.avatar),
    savedAt:
      typeof raw.savedAt === 'number' && Number.isFinite(raw.savedAt) ? raw.savedAt : Date.now(),
  };
}

/** Normalize a stored list: invalid entries are dropped, duplicates keep the first. */
export function normalizeChannels(stored: unknown): SavedChannel[] {
  if (!Array.isArray(stored)) return [];
  const seen = new Set<string>();
  const result: SavedChannel[] = [];
  for (const item of stored) {
    const channel = normalizeChannel(item);
    if (channel && !seen.has(channel.id)) {
      seen.add(channel.id);
      result.push(channel);
    }
  }
  return result;
}

export function serializeChannels(list: SavedChannel[], now = Date.now()): string {
  return JSON.stringify(
    {
      format: CHANNELS_EXPORT_FORMAT,
      version: CHANNELS_EXPORT_VERSION,
      exportedAt: now,
      channels: list,
    },
    null,
    2,
  );
}

export interface ChannelImportResult {
  list: SavedChannel[];
  added: number;
  skipped: number;
}

export class InvalidChannelImportError extends Error {}

/** Merge an exported file into the current list; same rules as saved videos. */
export function mergeChannelImport(current: SavedChannel[], json: string): ChannelImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new InvalidChannelImportError('Not valid JSON');
  }
  const entries =
    typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as { channels?: unknown }).channels
      : parsed;
  if (!Array.isArray(entries)) throw new InvalidChannelImportError('No channel list found');

  const known = new Set(current.map((channel) => channel.id));
  const list = [...current];
  let added = 0;
  let skipped = 0;
  for (const entry of entries) {
    const channel = normalizeChannel(entry);
    if (!channel) skipped++;
    else if (!known.has(channel.id)) {
      known.add(channel.id);
      list.push(channel);
      added++;
    }
  }
  return { list, added, skipped };
}

export const savedChannelsItem = storage.defineItem<SavedChannel[]>('local:savedChannels', {
  fallback: [],
  version: 1,
});

export async function getSavedChannels(): Promise<SavedChannel[]> {
  return normalizeChannels(await savedChannelsItem.getValue());
}

/** Read-modify-write against storage. */
async function mutate(change: (list: SavedChannel[]) => SavedChannel[]): Promise<SavedChannel[]> {
  const next = change(await getSavedChannels());
  await savedChannelsItem.setValue(next);
  return next;
}

export const saveChannel = (channel: SavedChannel) => mutate((list) => addToList(list, channel));
export const unsaveChannel = (id: string) => mutate((list) => removeFromList(list, id));
export const moveChannel = (id: string, direction: -1 | 1) =>
  mutate((list) => moveInList(list, id, direction));

export async function importChannels(json: string): Promise<ChannelImportResult> {
  const result = mergeChannelImport(await getSavedChannels(), json);
  await savedChannelsItem.setValue(result.list);
  return result;
}

export function watchSavedChannels(callback: (list: SavedChannel[]) => void): () => void {
  return savedChannelsItem.watch((value) => callback(normalizeChannels(value)));
}
