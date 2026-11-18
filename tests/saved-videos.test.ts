import { beforeEach, describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';
import {
  InvalidImportError,
  addToList,
  getSavedVideos,
  importVideos,
  mergeImport,
  moveInList,
  moveVideo,
  normalizeList,
  normalizeVideo,
  saveVideo,
  serializeList,
  thumbnailFor,
  unsaveVideo,
  type SavedVideo,
} from '../lib/saved-videos';

const video = (id: string, extra: Partial<SavedVideo> = {}): SavedVideo => ({
  id,
  title: `Title ${id}`,
  channel: 'Channel',
  thumbnail: thumbnailFor(id),
  savedAt: 1_700_000_000_000,
  ...extra,
});

const ids = (list: SavedVideo[]) => list.map((item) => item.id);

beforeEach(() => {
  fakeBrowser.reset();
});

describe('normalizeVideo', () => {
  it('repairs missing optional fields', () => {
    const result = normalizeVideo({ id: 'abcdefghijk' });
    expect(result).toMatchObject({
      id: 'abcdefghijk',
      title: 'abcdefghijk',
      channel: '',
      thumbnail: thumbnailFor('abcdefghijk'),
    });
  });

  it.each([null, 'text', {}, { id: 42 }, { id: 'bad id!' }])('rejects %j', (input) => {
    expect(normalizeVideo(input)).toBeUndefined();
  });
});

describe('normalizeList', () => {
  it('drops junk and duplicates, keeping the first', () => {
    const list = normalizeList([
      video('aaaaaaaaaaa'),
      null,
      video('aaaaaaaaaaa', { title: 'dup' }),
    ]);
    expect(list).toHaveLength(1);
    expect(list[0]?.title).toBe('Title aaaaaaaaaaa');
  });

  it('returns an empty list for non-arrays', () => {
    expect(normalizeList(undefined)).toEqual([]);
    expect(normalizeList({})).toEqual([]);
  });
});

describe('list operations', () => {
  const a = video('aaaaaaaaaaa');
  const b = video('bbbbbbbbbbb');
  const c = video('ccccccccccc');

  it('adds newest first and ignores duplicates', () => {
    expect(ids(addToList([a], b))).toEqual([b.id, a.id]);
    expect(addToList([a], a)).toEqual([a]);
  });

  it('moves one step and stops at the edges', () => {
    expect(ids(moveInList([a, b, c], b.id, -1))).toEqual([b.id, a.id, c.id]);
    expect(ids(moveInList([a, b, c], b.id, 1))).toEqual([a.id, c.id, b.id]);
    expect(moveInList([a, b], a.id, -1)).toEqual([a, b]);
    expect(moveInList([a, b], b.id, 1)).toEqual([a, b]);
    expect(moveInList([a, b], 'missing', 1)).toEqual([a, b]);
  });
});

describe('storage', () => {
  it('persists save, move and unsave', async () => {
    await saveVideo(video('aaaaaaaaaaa'));
    await saveVideo(video('bbbbbbbbbbb'));
    expect(ids(await getSavedVideos())).toEqual(['bbbbbbbbbbb', 'aaaaaaaaaaa']);

    await moveVideo('aaaaaaaaaaa', -1);
    expect(ids(await getSavedVideos())).toEqual(['aaaaaaaaaaa', 'bbbbbbbbbbb']);

    await unsaveVideo('aaaaaaaaaaa');
    expect(ids(await getSavedVideos())).toEqual(['bbbbbbbbbbb']);
  });

  it('exports then imports to restore the exact list', async () => {
    await saveVideo(video('aaaaaaaaaaa'));
    await saveVideo(video('bbbbbbbbbbb'));
    await saveVideo(video('ccccccccccc'));
    await moveVideo('aaaaaaaaaaa', -1);
    const before = await getSavedVideos();
    const json = serializeList(before);

    await fakeBrowser.storage.local.clear();
    expect(await getSavedVideos()).toEqual([]);

    const result = await importVideos(json);
    expect(result).toMatchObject({ added: 3, skipped: 0 });
    expect(await getSavedVideos()).toEqual(before);
  });
});

describe('mergeImport', () => {
  it('keeps existing entries first, appends new ones and counts invalid ones', () => {
    const a = video('aaaaaaaaaaa');
    const json = JSON.stringify({ videos: [video('bbbbbbbbbbb'), a, { id: '!' }] });
    const result = mergeImport([a], json);
    expect(ids(result.list)).toEqual([a.id, 'bbbbbbbbbbb']);
    expect(result).toMatchObject({ added: 1, skipped: 1 });
  });

  it('accepts a bare array', () => {
    expect(mergeImport([], JSON.stringify([video('aaaaaaaaaaa')])).added).toBe(1);
  });

  it.each(['not json', '{"videos":"nope"}', '42'])('rejects %s', (input) => {
    expect(() => mergeImport([], input)).toThrow(InvalidImportError);
  });
});
