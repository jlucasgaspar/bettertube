import { describe, expect, it } from 'vitest';
import {
  WatchLaterError,
  clearWatchLaterCache,
  fetchWatchLater,
  fetchWatchLaterCached,
  parseWatchLater,
  removeFromWatchLater,
} from '../lib/youtube/watch-later';

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

describe('removeFromWatchLater', () => {
  const pageText =
    '{"INNERTUBE_API_KEY":"KEY123","INNERTUBE_CLIENT_NAME":"WEB","INNERTUBE_CLIENT_VERSION":"2.20990101.00.00"}';
  const options = {
    pageText,
    cookie: 'a=1; SAPISID=secret; b=2',
    origin: 'https://www.youtube.com',
    nowSeconds: 1000,
  };

  it('asks YouTube to remove the video from the WL playlist, signed with the session', async () => {
    let seen: { url: string; init: RequestInit } | undefined;
    const fetcher = (async (url: string, init: RequestInit) => {
      seen = { url, init };
      return new Response(JSON.stringify({ status: 'STATUS_SUCCEEDED' }));
    }) as unknown as typeof fetch;
    await removeFromWatchLater('vid00000001', { ...options, fetcher });
    expect(seen?.url).toBe('/youtubei/v1/browse/edit_playlist?key=KEY123&prettyPrint=false');
    expect(seen?.init.method).toBe('POST');
    expect(JSON.parse(seen?.init.body as string)).toEqual({
      context: { client: { clientName: 'WEB', clientVersion: '2.20990101.00.00' } },
      playlistId: 'WL',
      actions: [{ action: 'ACTION_REMOVE_VIDEO_BY_VIDEO_ID', removedVideoId: 'vid00000001' }],
    });
    const headers = seen?.init.headers as Record<string, string>;
    expect(headers.Authorization).toMatch(/^SAPISIDHASH 1000_[0-9a-f]{40}$/);
    expect(headers['X-Origin']).toBe('https://www.youtube.com');
  });

  it('throws when YouTube refuses or does not confirm', async () => {
    const reply = (body: BodyInit, status = 200) =>
      (async () => new Response(body, { status })) as unknown as typeof fetch;
    await expect(
      removeFromWatchLater('x', { ...options, fetcher: reply('{}', 403) }),
    ).rejects.toThrow(WatchLaterError);
    await expect(
      removeFromWatchLater('x', { ...options, fetcher: reply('{"status":"STATUS_FAILED"}') }),
    ).rejects.toThrow(WatchLaterError);
  });

  it('throws before any request when signed out or the page config is missing', async () => {
    const fetcher = (async () => {
      throw new Error('should not be called');
    }) as unknown as typeof fetch;
    await expect(removeFromWatchLater('x', { ...options, cookie: 'a=1', fetcher })).rejects.toThrow(
      'Not signed in',
    );
    await expect(removeFromWatchLater('x', { ...options, pageText: '', fetcher })).rejects.toThrow(
      WatchLaterError,
    );
  });
});

describe('fetchWatchLaterCached', () => {
  it('reuses a recent result and refetches after the ttl', async () => {
    clearWatchLaterCache();
    let calls = 0;
    const fetcher = (async () => {
      calls++;
      return new Response(page({ x: renderer('vid00000001', 'One') }));
    }) as unknown as typeof fetch;
    await fetchWatchLaterCached(1000, 0, fetcher);
    await fetchWatchLaterCached(1000, 500, fetcher);
    expect(calls).toBe(1);
    await fetchWatchLaterCached(1000, 1500, fetcher);
    expect(calls).toBe(2);
  });

  it('does not cache a failure', async () => {
    clearWatchLaterCache();
    const failing = (async () => new Response('', { status: 500 })) as unknown as typeof fetch;
    await expect(fetchWatchLaterCached(1000, 0, failing)).rejects.toThrow(WatchLaterError);
    const ok = (async () =>
      new Response(page({ x: renderer('vid00000001', 'One') }))) as unknown as typeof fetch;
    await expect(fetchWatchLaterCached(1000, 1, ok)).resolves.toHaveLength(1);
  });
});
