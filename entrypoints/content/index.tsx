import { createRoot } from 'react-dom/client';
import { CUSTOM_HOME_CSS, CustomHome } from '../../components/custom-home';
import {
  SAVED_RECOMMENDATIONS_CSS,
  SavedRecommendations,
} from '../../components/saved-recommendations';
import { SAVE_CHANNEL_CSS, SaveChannelButton } from '../../components/save-channel-button';
import { SAVE_BUTTON_CSS, SaveButton } from '../../components/save-button';
import { getSettings, watchSettings, type Settings } from '../../lib/settings';
import { createHider } from '../../lib/youtube/hide';
import { createPageMount } from '../../lib/youtube/mount';
import { onNavigate } from '../../lib/youtube/navigation';
import type { PageType } from '../../lib/youtube/page-type';
import { selectors } from '../../lib/youtube/selectors';
import { shortsToWatchUrl } from '../../lib/youtube/shorts';

/** The custom home needs the switch on and at least one section to show. */
function customHomeActive({ enabled, home }: Settings): boolean {
  return (
    enabled &&
    home.enabled &&
    (home.showSaved || home.showWatchLater || home.showChannels || home.showPlaylists)
  );
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

    const shortsFeedHider = createHider('bettertube-hide-shorts-feed', selectors.shortsFeed);
    const shortsGuideHider = createHider(
      'bettertube-hide-shorts-guide',
      selectors.shortsGuideEntry,
    );

    const feedAdsHider = createHider('bettertube-hide-feed-ads', selectors.feedAds);

    const savedRecommendations = await createPageMount(ctx, {
      name: 'bettertube-saved-recommendations',
      pages: ['watch'],
      anchor: 'watchRelated',
      css: SAVED_RECOMMENDATIONS_CSS,
      append: 'before',
      onMount: (container) => {
        const root = createRoot(container);
        root.render(<SavedRecommendations />);
        return root;
      },
      onRemove: (root) => root?.unmount(),
    });
    const relatedHider = createHider('bettertube-hide-related', selectors.watchRelated);
    const endScreenHider = createHider('bettertube-hide-end-screen', selectors.watchEndScreen);

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

      const blockShorts = on && settings.shorts.enabled;
      shortsFeedHider.set(blockShorts);
      shortsGuideHider.set(blockShorts);
      feedAdsHider.set(on && settings.ads.enabled && settings.ads.hideFeedAds);
      const hideRecommendations = on && settings.recommendations.enabled;
      relatedHider.set(hideRecommendations);
      endScreenHider.set(hideRecommendations);
      savedRecommendations.update(
        hideRecommendations && settings.recommendations.showSaved ? pageType : 'other',
      );

      if (on && settings.shorts.redirectToWatch && pageType === 'shorts') {
        const target = shortsToWatchUrl(location.href);
        if (target) location.replace(target);
      }
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
      shortsFeedHider.set(false);
      shortsGuideHider.set(false);
      feedAdsHider.set(false);
      savedRecommendations.dispose();
      relatedHider.set(false);
      endScreenHider.set(false);
    });
  },
});
