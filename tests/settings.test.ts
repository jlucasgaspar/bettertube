import { beforeEach, describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';
import {
  DEFAULT_SETTINGS,
  applyPatch,
  getSettings,
  normalizeSettings,
  updateSettings,
} from '../lib/settings';

beforeEach(() => {
  fakeBrowser.reset();
});

describe('normalizeSettings', () => {
  it('returns defaults for empty or junk input', () => {
    expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings('nope')).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings([])).toEqual(DEFAULT_SETTINGS);
  });

  it('keeps valid stored values and fills in missing keys', () => {
    const result = normalizeSettings({ theme: 'dark', home: { enabled: true } });
    expect(result.theme).toBe('dark');
    expect(result.home.enabled).toBe(true);
    expect(result.home.showWatchLater).toBe(DEFAULT_SETTINGS.home.showWatchLater);
    expect(result.ads).toEqual(DEFAULT_SETTINGS.ads);
  });

  it('drops unknown keys and values of the wrong type', () => {
    const result = normalizeSettings({ theme: 'dark', legacy: true, shorts: { enabled: 'yes' } });
    expect(result).not.toHaveProperty('legacy');
    expect(result.shorts.enabled).toBe(DEFAULT_SETTINGS.shorts.enabled);
  });

  it('rejects unsupported locale and theme values', () => {
    expect(normalizeSettings({ locale: 'klingon' }).locale).toBe('auto');
    expect(normalizeSettings({ theme: 'sepia' }).theme).toBe('system');
    expect(normalizeSettings({ locale: 'pt_BR' }).locale).toBe('pt_BR');
  });
});

describe('applyPatch', () => {
  it('updates nested values without touching siblings', () => {
    const next = applyPatch(DEFAULT_SETTINGS, { ads: { autoSkip: false } });
    expect(next.ads.autoSkip).toBe(false);
    expect(next.ads.blockRequests).toBe(DEFAULT_SETTINGS.ads.blockRequests);
  });

  it('does not mutate the input', () => {
    const snapshot = structuredClone(DEFAULT_SETTINGS);
    applyPatch(DEFAULT_SETTINGS, { theme: 'light', home: { enabled: true } });
    expect(DEFAULT_SETTINGS).toEqual(snapshot);
  });
});

describe('storage', () => {
  it('returns defaults on first run', async () => {
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('persists updates across reads', async () => {
    await updateSettings({ theme: 'dark', shorts: { enabled: true } });
    await updateSettings({ locale: 'fr' });
    const settings = await getSettings();
    expect(settings.theme).toBe('dark');
    expect(settings.shorts.enabled).toBe(true);
    expect(settings.locale).toBe('fr');
  });
});
