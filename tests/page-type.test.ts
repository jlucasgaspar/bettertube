import { describe, expect, it } from 'vitest';
import { detectPageType } from '../lib/youtube/page-type';

describe('detectPageType', () => {
  it.each([
    ['https://www.youtube.com/', 'home'],
    ['https://www.youtube.com/watch?v=abc', 'watch'],
    ['https://www.youtube.com/results?search_query=x', 'search'],
    ['https://www.youtube.com/shorts/abc', 'shorts'],
    ['https://www.youtube.com/@someone', 'channel'],
    ['https://www.youtube.com/channel/UC123', 'channel'],
    ['https://www.youtube.com/c/name', 'channel'],
    ['https://www.youtube.com/user/name', 'channel'],
    ['https://www.youtube.com/feed/subscriptions', 'other'],
  ])('%s is %s', (url, expected) => {
    expect(detectPageType(url)).toBe(expected);
  });

  it('accepts a URL object', () => {
    expect(detectPageType(new URL('https://www.youtube.com/watch?v=1'))).toBe('watch');
  });
});
