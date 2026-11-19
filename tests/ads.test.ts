// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addHandled, isAdHandledMessage, normalizeAdStats, totalHandled } from '../lib/ads-stats';
import { requestLayerActive, skipLayerActive, stripLayerActive } from '../lib/ads-flags';
import { DEFAULT_SETTINGS, applyPatch } from '../lib/settings';
import { createAdSkipper, isPlayerRequest, stripPlayerAds } from '../lib/youtube/ads';
import rules from '../public/rules/ads.json';

describe('stripPlayerAds', () => {
  it('removes ad keys and counts them', () => {
    const response = { videoDetails: { videoId: 'a' }, adPlacements: [1], playerAds: [2] };
    expect(stripPlayerAds(response)).toBe(2);
    expect(response).toEqual({ videoDetails: { videoId: 'a' } });
  });

  it('cleans a wrapped player response', () => {
    const response = { playerResponse: { adSlots: [1] }, other: 1 };
    expect(stripPlayerAds(response)).toBe(1);
    expect(response.playerResponse).toEqual({});
  });

  it('ignores clean responses and non-objects', () => {
    expect(stripPlayerAds({ videoDetails: {} })).toBe(0);
    expect(stripPlayerAds(null)).toBe(0);
    expect(stripPlayerAds('x')).toBe(0);
  });
});

describe('isPlayerRequest', () => {
  it('matches the player endpoint only', () => {
    expect(isPlayerRequest('https://www.youtube.com/youtubei/v1/player?key=1')).toBe(true);
    expect(isPlayerRequest('https://www.youtube.com/youtubei/v1/next?key=1')).toBe(false);
  });
});

describe('layer flags', () => {
  const on = applyPatch(DEFAULT_SETTINGS, { ads: { enabled: true } });

  it('are all off by default', () => {
    for (const layer of [stripLayerActive, skipLayerActive, requestLayerActive]) {
      expect(layer(DEFAULT_SETTINGS)).toBe(false);
    }
  });

  it('follow the ads switch and each layer toggle independently', () => {
    expect(stripLayerActive(on)).toBe(true);
    const onlySkip = applyPatch(on, { ads: { blockRequests: false, stripPlayerAds: false } });
    expect(requestLayerActive(onlySkip)).toBe(false);
    expect(stripLayerActive(onlySkip)).toBe(false);
    expect(skipLayerActive(onlySkip)).toBe(true);
  });

  it('turn off with the master switch', () => {
    const off = applyPatch(on, { enabled: false });
    expect(stripLayerActive(off) || skipLayerActive(off) || requestLayerActive(off)).toBe(false);
  });
});

describe('ad stats', () => {
  it('normalizes bad data', () => {
    expect(normalizeAdStats({ stripped: -1, skipped: 'x' })).toEqual({ stripped: 0, skipped: 0 });
    expect(normalizeAdStats(null)).toEqual({ stripped: 0, skipped: 0 });
  });

  it('counts per layer', () => {
    const stats = addHandled(addHandled({ stripped: 0, skipped: 0 }, 'strip'), 'skip', 2);
    expect(stats).toEqual({ stripped: 1, skipped: 2 });
    expect(totalHandled(stats)).toBe(3);
  });

  it('validates messages', () => {
    expect(isAdHandledMessage({ type: 'bettertube:ad-handled', layer: 'skip' })).toBe(true);
    expect(isAdHandledMessage({ type: 'bettertube:ad-handled', layer: 'x' })).toBe(false);
    expect(isAdHandledMessage('x')).toBe(false);
  });
});

describe('static ruleset', () => {
  it('has unique ids and only block rules', () => {
    const ids = rules.map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(rules.every((rule) => rule.action.type === 'block')).toBe(true);
  });
});

describe('createAdSkipper', () => {
  let player: HTMLElement;
  let video: HTMLVideoElement;
  let skip: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = `<div class="html5-video-player"><video class="html5-main-video"></video>
      <button class="ytp-skip-ad-button"></button></div>`;
    player = document.querySelector('.html5-video-player')!;
    video = document.querySelector('video')!;
    skip = document.querySelector('button')!;
  });

  it('does nothing while inactive', () => {
    const onAd = vi.fn();
    const skipper = createAdSkipper({ onAd });
    player.classList.add('ad-showing');
    skipper.check();
    expect(onAd).not.toHaveBeenCalled();
    expect(video.muted).toBe(false);
  });

  it('mutes, speeds up and clicks skip during an ad, then restores', () => {
    const onAd = vi.fn();
    const clicked = vi.fn();
    skip.addEventListener('click', clicked);
    video.playbackRate = 1.5;
    const skipper = createAdSkipper({ onAd });
    skipper.setActive(true);

    player.classList.add('ad-showing');
    skipper.check();
    skipper.check();
    expect(video.muted).toBe(true);
    expect(video.playbackRate).toBe(16);
    expect(clicked).toHaveBeenCalled();
    expect(onAd).toHaveBeenCalledTimes(1);

    player.classList.remove('ad-showing');
    skipper.check();
    expect(video.muted).toBe(false);
    expect(video.playbackRate).toBe(1.5);
  });

  it('keeps a video the user had muted muted afterwards', () => {
    video.muted = true;
    const skipper = createAdSkipper();
    skipper.setActive(true);
    player.classList.add('ad-showing');
    skipper.check();
    player.classList.remove('ad-showing');
    skipper.check();
    expect(video.muted).toBe(true);
  });

  it('restores right away when turned off mid-ad', () => {
    const skipper = createAdSkipper();
    skipper.setActive(true);
    player.classList.add('ad-showing');
    skipper.check();
    skipper.setActive(false);
    expect(video.muted).toBe(false);
    expect(video.playbackRate).toBe(1);
  });
});
