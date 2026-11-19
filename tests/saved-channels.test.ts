import { beforeEach, describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';
import {
  InvalidChannelImportError,
  channelUrl,
  getSavedChannels,
  importChannels,
  mergeChannelImport,
  moveChannel,
  normalizeChannel,
  normalizeChannels,
  saveChannel,
  serializeChannels,
  unsaveChannel,
  type SavedChannel,
} from '../lib/saved-channels';

const channel = (id: string, extra: Partial<SavedChannel> = {}): SavedChannel => ({
  id,
  name: `Name ${id}`,
  avatar: 'https://example.com/a.jpg',
  savedAt: 1_700_000_000_000,
  ...extra,
});

const ids = (list: SavedChannel[]) => list.map((item) => item.id);

beforeEach(() => {
  fakeBrowser.reset();
});

describe('normalizeChannel', () => {
  it('accepts handles and channel paths', () => {
    expect(normalizeChannel({ id: '@handle' })).toMatchObject({ id: '@handle', name: '@handle' });
    expect(normalizeChannel({ id: 'channel/UC123' })?.id).toBe('channel/UC123');
  });

  it('rejects ids that are not channel paths', () => {
    expect(normalizeChannel({ id: 'watch?v=abc' })).toBeUndefined();
    expect(normalizeChannel({ id: '@a/videos' })).toBeUndefined();
    expect(normalizeChannel({})).toBeUndefined();
    expect(normalizeChannel('nope')).toBeUndefined();
  });
});

describe('normalizeChannels', () => {
  it('drops invalid entries and duplicates', () => {
    const list = normalizeChannels([channel('@a'), { id: 'x' }, channel('@a'), channel('@b')]);
    expect(ids(list)).toEqual(['@a', '@b']);
    expect(normalizeChannels('junk')).toEqual([]);
  });
});

describe('storage', () => {
  it('saves newest first, without duplicates, and removes', async () => {
    await saveChannel(channel('@a'));
    await saveChannel(channel('@b'));
    await saveChannel(channel('@a'));
    expect(ids(await getSavedChannels())).toEqual(['@b', '@a']);
    await unsaveChannel('@b');
    expect(ids(await getSavedChannels())).toEqual(['@a']);
  });

  it('reorders one step at a time', async () => {
    for (const id of ['@c', '@b', '@a']) await saveChannel(channel(id));
    await moveChannel('@a', 1);
    expect(ids(await getSavedChannels())).toEqual(['@b', '@a', '@c']);
    await moveChannel('@b', -1);
    expect(ids(await getSavedChannels())).toEqual(['@b', '@a', '@c']);
  });
});

describe('export and import', () => {
  it('round-trips through a file', async () => {
    const list = [channel('@a'), channel('channel/UC1')];
    const json = serializeChannels(list, 1);
    const result = mergeChannelImport([], json);
    expect(result).toMatchObject({ added: 2, skipped: 0 });
    expect(result.list).toEqual(list);
  });

  it('keeps existing channels, appends new ones and counts invalid entries', async () => {
    await saveChannel(channel('@a'));
    const json = JSON.stringify({ channels: [channel('@a'), channel('@b'), { id: 'bad' }] });
    const result = await importChannels(json);
    expect(result).toMatchObject({ added: 1, skipped: 1 });
    expect(ids(await getSavedChannels())).toEqual(['@a', '@b']);
  });

  it('rejects files that are not channel exports', () => {
    expect(() => mergeChannelImport([], 'not json')).toThrow(InvalidChannelImportError);
    expect(() => mergeChannelImport([], '{"videos":[]}')).toThrow(InvalidChannelImportError);
  });
});

it('builds the YouTube url from the id', () => {
  expect(channelUrl('@handle')).toBe('https://www.youtube.com/@handle');
});
