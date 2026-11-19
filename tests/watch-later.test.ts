import { describe, expect, it } from 'vitest';
import { WatchLaterError, fetchWatchLater, parseWatchLater } from '../lib/youtube/watch-later';

const page = (data: unknown) =>
  `<html><script nonce="x">var ytInitialData = ${JSON.stringify(data)};</script></html>`;

const renderer = (videoId: string, title: string) => ({
  playlistVideoRenderer: {
    videoId,
    title: { runs: [{ text: title }] },
    shortBylineText: { runs: [{ text: 'Some channel' }] },
    thumbnail: { thumbnails: [{ url: 'https://i/small.jpg' }, { url: 'https://i/big.jpg' }] },
  },
});

describe('parseWatchLater', () => {
  it('finds videos wherever the renderers are nested', () => {
    const html = page({
      contents: {
        a: { b: [{ c: [renderer('vid00000001', 'One'), renderer('vid00000002', 'Two')] }] },
      },
    });
    expect(parseWatchLater(html)).toEqual([
      { id: 'vid00000001', title: 'One', channel: 'Some channel', thumbnail: 'https://i/big.jpg' },
      { id: 'vid00000002', title: 'Two', channel: 'Some channel', thumbnail: 'https://i/big.jpg' },
    ]);
  });

  it('falls back when optional fields are missing', () => {
    const html = page({ x: [{ playlistVideoRenderer: { videoId: 'vid00000001' } }] });
    expect(parseWatchLater(html)).toEqual([
      {
        id: 'vid00000001',
        title: 'vid00000001',
        channel: '',
        thumbnail: 'https://i.ytimg.com/vi/vid00000001/hqdefault.jpg',
      },
    ]);
  });

  it('returns an empty list for an empty playlist', () => {
    expect(parseWatchLater(page({ contents: {} }))).toEqual([]);
  });

  it('throws when the page data is missing or broken', () => {
    expect(() => parseWatchLater('<html></html>')).toThrow(WatchLaterError);
    expect(() => parseWatchLater('var ytInitialData = {oops};</script>')).toThrow(WatchLaterError);
  });
});

describe('fetchWatchLater', () => {
  it('reads the playlist with the user session', async () => {
    let seen: { url: string; init?: RequestInit } | undefined;
    const fetcher = (async (url: string, init?: RequestInit) => {
      seen = { url, init };
      return new Response(page({ x: renderer('vid00000001', 'One') }));
    }) as unknown as typeof fetch;
    const videos = await fetchWatchLater(fetcher);
    expect(videos).toHaveLength(1);
    expect(seen).toEqual({ url: '/playlist?list=WL', init: { credentials: 'include' } });
  });

  it('throws on a failed request', async () => {
    const fetcher = (async () => new Response('', { status: 500 })) as unknown as typeof fetch;
    await expect(fetchWatchLater(fetcher)).rejects.toThrow(WatchLaterError);
  });
});
