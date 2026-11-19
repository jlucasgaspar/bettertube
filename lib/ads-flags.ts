import type { Settings } from './settings';

/**
 * The MAIN-world script cannot read extension storage. The isolated bridge mirrors the setting into
 * the page's localStorage (shared by both worlds), which the MAIN script reads synchronously. It
 * survives reloads, so the very first player response of a page load is already covered.
 */
export const STRIP_FLAG_KEY = 'bettertube:strip-player-ads';
/** `postMessage` tag the MAIN script uses to report a cleaned player response. */
export const STRIPPED_MESSAGE = 'bettertube:player-ads-stripped';

export const stripLayerActive = ({ enabled, ads }: Settings): boolean =>
  enabled && ads.enabled && ads.stripPlayerAds;

export const skipLayerActive = ({ enabled, ads }: Settings): boolean =>
  enabled && ads.enabled && ads.autoSkip;

export const requestLayerActive = ({ enabled, ads }: Settings): boolean =>
  enabled && ads.enabled && ads.blockRequests;
