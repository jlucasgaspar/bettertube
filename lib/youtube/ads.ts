import { selectors, AD_SHOWING_CLASS } from './selectors';

/** Keys of the player response that carry ad data. Removing them leaves a video with no ads. */
const AD_KEYS = ['adPlacements', 'playerAds', 'adSlots', 'adBreakHeartbeatParams'] as const;

/**
 * Remove ad data from a YouTube player response, in place. Returns how many keys were removed,
 * so callers can count the response as handled. Anything that is not an object is ignored.
 */
export function stripPlayerAds(response: unknown): number {
  if (typeof response !== 'object' || response === null) return 0;
  const target = response as Record<string, unknown>;
  let removed = 0;
  for (const key of AD_KEYS) {
    if (key in target) {
      delete target[key];
      removed += 1;
    }
  }
  // Some responses wrap the player response, e.g. `[{ playerResponse }]` or `{ playerResponse }`.
  const nested = target.playerResponse;
  if (nested) removed += stripPlayerAds(nested);
  return removed;
}

/** URLs of the InnerTube endpoint that returns the player response. */
export const isPlayerRequest = (url: string): boolean => /\/youtubei\/v1\/player(\?|$)/.test(url);

export interface AdSkipperOptions {
  /** Called once per ad, when it starts. */
  onAd?: () => void;
  doc?: Document;
}

/**
 * Layer 3. While an ad plays (`.ad-showing` on the player): mute it, speed it up, jump to its end
 * and press "Skip" when the button exists. When the ad ends, put muted state and speed back.
 * Call `check()` on every DOM mutation; it is cheap and idempotent.
 */
export function createAdSkipper({ onAd, doc = document }: AdSkipperOptions = {}) {
  let saved: { muted: boolean; rate: number; video: HTMLVideoElement } | null = null;
  let active = false;

  const restore = () => {
    if (!saved) return;
    saved.video.muted = saved.muted;
    saved.video.playbackRate = saved.rate;
    saved = null;
  };

  const handleAd = (video: HTMLVideoElement) => {
    if (!saved) saved = { muted: video.muted, rate: video.playbackRate, video };
    video.muted = true;
    video.playbackRate = 16;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = video.duration;
    }
    doc.querySelector<HTMLElement>(selectors.adSkipButton)?.click();
  };

  return {
    check() {
      if (!active) return;
      const player = doc.querySelector(selectors.player);
      const video = doc.querySelector<HTMLVideoElement>(selectors.playerVideo);
      const showing = !!player?.classList.contains(AD_SHOWING_CLASS);
      if (showing && video) {
        if (!saved) onAd?.();
        handleAd(video);
      } else {
        restore();
      }
    },
    /** Turn the skipper on or off. Turning it off restores the player right away. */
    setActive(next: boolean) {
      active = next;
      if (!next) restore();
    },
  };
}
