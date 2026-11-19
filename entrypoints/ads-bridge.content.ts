import { AD_HANDLED_MESSAGE, type AdHandledMessage, type AdLayer } from '../lib/ads-stats';
import {
  STRIP_FLAG_KEY,
  STRIPPED_MESSAGE,
  skipLayerActive,
  stripLayerActive,
} from '../lib/ads-flags';
import { getSettings, watchSettings, type Settings } from '../lib/settings';
import { createAdSkipper } from '../lib/youtube/ads';

/**
 * Isolated-world half of the ad layers. Mirrors the layer 2 flag for the MAIN script, runs
 * layer 3 (mute and skip), and reports every handled ad to the background for the counter.
 */
export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  runAt: 'document_start',
  async main(ctx) {
    const report = (layer: AdLayer) => {
      const message: AdHandledMessage = { type: AD_HANDLED_MESSAGE, layer };
      void browser.runtime.sendMessage(message).catch(() => undefined);
    };

    const skipper = createAdSkipper({ onAd: () => report('skip') });
    const observer = new MutationObserver(() => skipper.check());
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class'],
    });

    const apply = (settings: Settings) => {
      try {
        if (stripLayerActive(settings)) localStorage.setItem(STRIP_FLAG_KEY, '1');
        else localStorage.removeItem(STRIP_FLAG_KEY);
      } catch {
        // localStorage can be blocked; the MAIN script then stays off.
      }
      skipper.setActive(skipLayerActive(settings));
      skipper.check();
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source === window && event.data?.type === STRIPPED_MESSAGE) report('strip');
    };
    window.addEventListener('message', onMessage);

    apply(await getSettings());
    const stopSettings = watchSettings(apply);
    ctx.onInvalidated(() => {
      stopSettings();
      observer.disconnect();
      skipper.setActive(false);
      window.removeEventListener('message', onMessage);
    });
  },
});
