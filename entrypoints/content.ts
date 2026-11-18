import { createPageMount } from '../lib/youtube/mount';
import { onNavigate } from '../lib/youtube/navigation';

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  async main(ctx) {
    // Dev-only probe proving the integration layer: mounts once, survives SPA navigation.
    const probe = import.meta.env.DEV
      ? await createPageMount(ctx, {
          name: 'bettertube-probe',
          pages: ['home', 'watch', 'search', 'channel'],
          anchor: 'pageManager',
          append: 'first',
          onMount: (container) => {
            const el = document.createElement('div');
            el.dataset.testid = 'bettertube-probe';
            el.textContent = 'BetterTube';
            container.append(el);
            return el;
          },
        })
      : undefined;

    const stop = onNavigate(({ pageType }) => probe?.update(pageType));
    ctx.onInvalidated(() => {
      stop();
      probe?.dispose();
    });
  },
});
