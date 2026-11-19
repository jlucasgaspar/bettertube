import { createRoot } from 'react-dom/client';
import { CUSTOM_HOME_CSS, CustomHome } from '../../components/custom-home';
import { SAVE_CHANNEL_CSS, SaveChannelButton } from '../../components/save-channel-button';
import { SAVE_BUTTON_CSS, SaveButton } from '../../components/save-button';
import { getSettings, watchSettings, type Settings } from '../../lib/settings';
import { createHider } from '../../lib/youtube/hide';
import { createPageMount } from '../../lib/youtube/mount';
import { onNavigate } from '../../lib/youtube/navigation';
import type { PageType } from '../../lib/youtube/page-type';
import { selectors } from '../../lib/youtube/selectors';

/** The custom home needs the switch on and at least one section to show. */
function customHomeActive({ enabled, home }: Settings): boolean {
  return enabled && home.enabled && (home.showSaved || home.showWatchLater || home.showChannels);
}

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  async main(ctx) {
    const saveButton = await createPageMount(ctx, {
      name: 'bettertube-save-button',
      pages: ['watch'],
      anchor: 'watchActions',
      css: SAVE_BUTTON_CSS,
      // Right after Like, so it reads as part of the same group.
      append: (anchor, root) => {
        const like = anchor.firstElementChild;
        if (like) like.after(root);
        else anchor.append(root);
      },
      onMount: (container) => {
        const root = createRoot(container);
        root.render(<SaveButton />);
        return root;
      },
      onRemove: (root) => root?.unmount(),
    });

    const saveChannelButton = await createPageMount(ctx, {
      name: 'bettertube-save-channel-button',
      pages: ['channel'],
      anchor: 'channelActions',
      css: SAVE_CHANNEL_CSS,
      append: 'last',
      onMount: (container) => {
        const root = createRoot(container);
        root.render(<SaveChannelButton />);
        return root;
      },
      onRemove: (root) => root?.unmount(),
    });

    const customHome = await createPageMount(ctx, {
      name: 'bettertube-custom-home',
      pages: ['home'],
      anchor: 'homeFeed',
      css: CUSTOM_HOME_CSS,
      append: 'before',
      onMount: (container) => {
        const root = createRoot(container);
        root.render(<CustomHome />);
        return root;
      },
      onRemove: (root) => root?.unmount(),
    });
    const homeFeedHider = createHider('bettertube-hide-home-feed', selectors.homeFeed);

    // Every feature needs the master switch on, its own setting, and a page that allows it.
    let pageType: PageType = 'other';
    let settings = await getSettings();
    const apply = () => {
      const on = settings.enabled;
      saveButton.update(on ? pageType : 'other');
      saveChannelButton.update(on ? pageType : 'other');
      const home = customHomeActive(settings);
      customHome.update(home ? pageType : 'other');
      homeFeedHider.set(home && pageType === 'home');
    };

    const stopNavigation = onNavigate((info) => {
      pageType = info.pageType;
      apply();
    });
    const stopSettings = watchSettings((next) => {
      settings = next;
      apply();
    });
    ctx.onInvalidated(() => {
      stopNavigation();
      stopSettings();
      saveButton.dispose();
      saveChannelButton.dispose();
      customHome.dispose();
      homeFeedHider.set(false);
    });
  },
});
