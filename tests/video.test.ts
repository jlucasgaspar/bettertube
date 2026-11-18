// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { currentVideoId, readVideo } from '../lib/youtube/video';

describe('currentVideoId', () => {
  it('reads v on the watch page only', () => {
    expect(currentVideoId('https://www.youtube.com/watch?v=abc123xyz')).toBe('abc123xyz');
    expect(currentVideoId('https://www.youtube.com/watch')).toBeUndefined();
    expect(currentVideoId('https://www.youtube.com/results?v=abc123xyz')).toBeUndefined();
  });
});

describe('readVideo', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.title = 'Fallback title - YouTube';
  });

  it('reads title and channel from the watch metadata', () => {
    document.body.innerHTML = `
      <ytd-watch-metadata>
        <h1> The title </h1>
        <ytd-channel-name><a>The channel</a></ytd-channel-name>
      </ytd-watch-metadata>`;
    expect(readVideo('abc123xyz', document, 5)).toEqual({
      id: 'abc123xyz',
      title: 'The title',
      channel: 'The channel',
      thumbnail: 'https://i.ytimg.com/vi/abc123xyz/hqdefault.jpg',
      savedAt: 5,
    });
  });

  it('falls back to the document title when the page has not rendered yet', () => {
    const result = readVideo('abc123xyz');
    expect(result.title).toBe('Fallback title');
    expect(result.channel).toBe('');
  });
});
