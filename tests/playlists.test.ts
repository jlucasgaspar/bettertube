import { describe, expect, it } from 'vitest';
import { PlaylistsError, fetchPlaylists, parsePlaylists } from '../lib/youtube/playlists';

const page = (data: unknown) =>
  `<html><script nonce="x">var ytInitialData = ${JSON.stringify(data)};</script></html>`;

const lockup = (id: string, title: string, badge?: string) => ({
  lockupViewModel: {
    contentId: id,
    contentType: 'LOCKUP_CONTENT_TYPE_PLAYLIST',
    contentImage: {
      collectionThumbnailViewModel: {
        primaryThumbnail: {
          thumbnailViewModel: {
            image: { sources: [{ url: 'https://i/small.jpg' }, { url: 'https://i/big.jpg' }] },
            overlays: badge ? [{ thumbnailBadgeViewModel: { text: badge } }] : [],
          },
        },
      },
    },
    metadata: { lockupMetadataViewModel: { title: { content: title } } },
  },
});

describe('parsePlaylists', () => {
  it('reads the new lockup layout', () => {
    const html = page({ a: { b: [lockup('PL000000001', 'Study music', '12 videos')] } });
    expect(parsePlaylists(html)).toEqual([
      { id: 'PL000000001', title: 'Study music', thumbnail: 'https://i/big.jpg', count: 12 },
    ]);
  });

  it('reads the older grid renderer layout', () => {
    const html = page({
      x: [
        {
          gridPlaylistRenderer: {
            playlistId: 'PL000000002',
            title: { runs: [{ text: 'Old style' }] },
            thumbnail: { thumbnails: [{ url: 'https://i/a.jpg' }, { url: 'https://i/b.jpg' }] },
            videoCountText: { runs: [{ text: '1.234' }, { text: ' videos' }] },
          },
        },
      ],
    });
    expect(parsePlaylists(html)).toEqual([
      { id: 'PL000000002', title: 'Old style', thumbnail: 'https://i/b.jpg', count: 1234 },
    ]);
  });

  it('leaves out Watch Later and Liked videos, and repeated playlists', () => {
    const html = page({
      a: [
        lockup('WL', 'Watch later'),
        lockup('LL', 'Liked videos'),
        lockup('PL000000001', 'Mine'),
        lockup('PL000000001', 'Mine again'),
      ],
    });
    expect(parsePlaylists(html).map((p) => p.id)).toEqual(['PL000000001']);
  });

  it('ignores lockups that are not playlists and survives missing fields', () => {
    const html = page({
      a: [
        { lockupViewModel: { contentId: 'vid00000001', contentType: 'LOCKUP_CONTENT_TYPE_VIDEO' } },
        {
          lockupViewModel: {
            contentId: 'PL000000003',
            contentType: 'LOCKUP_CONTENT_TYPE_PLAYLIST',
          },
        },
      ],
    });
    expect(parsePlaylists(html)).toEqual([
      { id: 'PL000000003', title: 'PL000000003', thumbnail: '' },
    ]);
  });

  it('returns an empty list when there are none, and throws when the page changed', () => {
    expect(parsePlaylists(page({ contents: {} }))).toEqual([]);
    expect(() => parsePlaylists('<html></html>')).toThrow(PlaylistsError);
    expect(() => parsePlaylists('var ytInitialData = {oops};</script>')).toThrow(PlaylistsError);
  });
});

describe('fetchPlaylists', () => {
  it('reads the playlists feed with the user session', async () => {
    let seen: { url: string; init?: RequestInit } | undefined;
    const fetcher = (async (url: string, init?: RequestInit) => {
      seen = { url, init };
      return new Response(page({ x: lockup('PL000000001', 'Mine') }));
    }) as unknown as typeof fetch;
    expect(await fetchPlaylists(fetcher)).toHaveLength(1);
    expect(seen).toEqual({ url: '/feed/playlists', init: { credentials: 'include' } });
  });

  it('throws when the request fails', async () => {
    const fetcher = (async () => new Response('', { status: 403 })) as unknown as typeof fetch;
    await expect(fetchPlaylists(fetcher)).rejects.toThrow(PlaylistsError);
  });
});
