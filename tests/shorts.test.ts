import { describe, expect, it } from 'vitest';
import { shortsToWatchUrl } from '../lib/youtube/shorts';

describe('shortsToWatchUrl', () => {
  it('maps a Shorts URL to a watch URL', () => {
    expect(shortsToWatchUrl('https://www.youtube.com/shorts/abc123')).toBe(
      'https://www.youtube.com/watch?v=abc123',
    );
  });

  it('ignores query, hash and trailing path', () => {
    expect(shortsToWatchUrl('https://www.youtube.com/shorts/abc_-1/?feature=share#x')).toBe(
      'https://www.youtube.com/watch?v=abc_-1',
    );
  });

  it('keeps the host', () => {
    expect(shortsToWatchUrl('https://m.youtube.com/shorts/abc')).toBe(
      'https://m.youtube.com/watch?v=abc',
    );
  });

  it('returns null for other pages', () => {
    expect(shortsToWatchUrl('https://www.youtube.com/watch?v=abc')).toBeNull();
    expect(shortsToWatchUrl('https://www.youtube.com/shorts/')).toBeNull();
    expect(shortsToWatchUrl('https://www.youtube.com/@chan/shorts')).toBeNull();
  });
});
