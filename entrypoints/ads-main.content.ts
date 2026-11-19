import { STRIP_FLAG_KEY, STRIPPED_MESSAGE } from '../lib/ads-flags';
import { isPlayerRequest, stripPlayerAds } from '../lib/youtube/ads';

/**
 * Layer 2, MAIN world. Runs inside the page so it can clean the player response before YouTube's
 * player reads it: the inline `ytInitialPlayerResponse` and `/youtubei/v1/player` fetches.
 * The on/off flag comes from localStorage, written by the isolated bridge.
 */
export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  world: 'MAIN',
  runAt: 'document_start',
  main() {
    const active = (): boolean => {
      try {
        return localStorage.getItem(STRIP_FLAG_KEY) === '1';
      } catch {
        return false;
      }
    };
    const clean = (response: unknown) => {
      if (!active()) return;
      if (stripPlayerAds(response) > 0) window.postMessage({ type: STRIPPED_MESSAGE }, '*');
    };

    // Inline response: YouTube assigns `window.ytInitialPlayerResponse`; clean it on assignment.
    let initial: unknown;
    try {
      Object.defineProperty(window, 'ytInitialPlayerResponse', {
        configurable: true,
        get: () => initial,
        set: (value: unknown) => {
          clean(value);
          initial = value;
        },
      });
    } catch {
      // Already defined by the page: the fetch hook below still covers navigation.
    }

    const nativeFetch = window.fetch;
    window.fetch = async function (this: unknown, input: RequestInfo | URL, init?: RequestInit) {
      const response = await nativeFetch.call(this, input, init);
      try {
        const url = input instanceof Request ? input.url : String(input);
        if (!active() || !isPlayerRequest(url)) return response;
        const data: unknown = await response.clone().json();
        clean(data);
        const headers = new Headers(response.headers);
        headers.delete('content-length');
        return new Response(JSON.stringify(data), {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } catch {
        // Never break playback over a failed clean: hand back the original response.
        return response;
      }
    };
  },
});
