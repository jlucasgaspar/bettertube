// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { currentChannelId, readChannel } from '../lib/youtube/channel';

describe('currentChannelId', () => {
  it.each([
    ['https://www.youtube.com/@handle', '@handle'],
    ['https://www.youtube.com/@handle/videos', '@handle'],
    ['https://www.youtube.com/channel/UC123/featured', 'channel/UC123'],
    ['https://www.youtube.com/c/Legacy', 'c/Legacy'],
    ['https://www.youtube.com/user/Old', 'user/Old'],
  ])('reads %s', (url, expected) => {
    expect(currentChannelId(url)).toBe(expected);
  });

  it('is undefined outside channel pages', () => {
    expect(currentChannelId('https://www.youtube.com/')).toBeUndefined();
    expect(currentChannelId('https://www.youtube.com/watch?v=abc123xyz')).toBeUndefined();
  });
});

describe('readChannel', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('reads name and avatar from the channel header', () => {
    document.body.innerHTML = `
      <yt-page-header-renderer>
        <yt-decorated-avatar-view-model><img src="https://example.com/avatar.jpg"></yt-decorated-avatar-view-model>
        <h1> The channel </h1>
      </yt-page-header-renderer>`;
    expect(readChannel('@handle', document, 5)).toEqual({
      id: '@handle',
      name: 'The channel',
      avatar: 'https://example.com/avatar.jpg',
      savedAt: 5,
    });
  });

  it('falls back to page metadata, then to the id', () => {
    document.head.innerHTML = `
      <meta property="og:title" content="Meta name">
      <meta property="og:image" content="https://example.com/og.jpg">`;
    expect(readChannel('@handle', document, 5)).toMatchObject({
      name: 'Meta name',
      avatar: 'https://example.com/og.jpg',
    });
    document.head.innerHTML = '';
    expect(readChannel('@handle', document, 5)).toMatchObject({ name: '@handle', avatar: '' });
  });
});
