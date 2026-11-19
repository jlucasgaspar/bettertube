/**
 * Every YouTube selector lives here. When YouTube changes its markup, fixes touch this file only.
 */
export const selectors = {
  /** Container the watch page action bar (Like, Share, ...) renders into. */
  watchActions: '#top-level-buttons-computed',
  /** Title heading of the watch page. */
  watchTitle: 'ytd-watch-metadata h1',
  /** Channel link under the watch page title. */
  watchChannel: 'ytd-watch-metadata ytd-channel-name a',
  /** Row of buttons (Subscribe, Join, ...) in the channel page header, new and old layouts. */
  channelActions: 'yt-flexible-actions-view-model, ytd-c4-tabbed-header-renderer #buttons',
  /** Channel name heading in the channel page header. */
  channelName: 'yt-page-header-renderer h1, ytd-c4-tabbed-header-renderer #channel-name',
  /** Channel avatar image in the channel page header. */
  channelAvatar:
    'yt-page-header-renderer yt-decorated-avatar-view-model img, ytd-c4-tabbed-header-renderer #avatar img',
  /** Home feed grid, scoped to the home page (the same renderer powers other feeds). */
  homeFeed: 'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer',
  /** The page manager element YouTube swaps content into on SPA navigation. */
  pageManager: 'ytd-page-manager',
  /** Sidebar guide entries. */
  guideEntries: 'ytd-guide-entry-renderer',
  /**
   * Shorts shelves and Shorts items in feeds (home, search, subscriptions, watch next): dedicated
   * shelf renderers, their section wrappers, and any video card linking to a Short.
   */
  shortsFeed: [
    'ytd-reel-shelf-renderer',
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])',
    'ytd-rich-section-renderer:has(ytd-reel-shelf-renderer)',
    'ytd-rich-item-renderer:has(a[href^="/shorts/"])',
    'ytd-video-renderer:has(a[href^="/shorts/"])',
    'ytd-grid-video-renderer:has(a[href^="/shorts/"])',
    'ytd-compact-video-renderer:has(a[href^="/shorts/"])',
    'grid-shelf-view-model:has(a[href^="/shorts/"])',
    'yt-lockup-view-model:has(a[href^="/shorts/"])',
  ].join(', '),
  /** Suggested videos column on the watch page. Playlist panel and live chat are siblings, untouched. */
  watchRelated: '#secondary ytd-watch-next-secondary-results-renderer',
  /** Suggestions the player shows when a video ends, plus creator end cards over the video. */
  watchEndScreen: ['.html5-endscreen', '.ytp-endscreen-content', '.ytp-ce-element'].join(', '),
  /** Shorts entry in the expanded sidebar and in the collapsed mini sidebar. */
  shortsGuideEntry: [
    'ytd-guide-entry-renderer:has(a[href^="/shorts"])',
    'ytd-mini-guide-entry-renderer:has(a[href^="/shorts"])',
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
  ].join(', '),
  /** The player element; YouTube adds the `ad-showing` class to it while an ad plays. */
  player: '.html5-video-player',
  /** Main video element inside the player. It also plays the ad. */
  playerVideo: '.html5-video-player video.html5-main-video, .html5-video-player video',
  /** "Skip" button, old and new (modern) player layouts. */
  adSkipButton: [
    '.ytp-skip-ad-button',
    '.ytp-ad-skip-button',
    '.ytp-ad-skip-button-modern',
    '.ytp-ad-skip-button-container button',
  ].join(', '),
} as const;

/** Class YouTube puts on the player while an ad plays. */
export const AD_SHOWING_CLASS = 'ad-showing';

export type SelectorKey = keyof typeof selectors;

/** Custom events YouTube dispatches on `document` during SPA navigation. */
export const events = {
  navigateStart: 'yt-navigate-start',
  navigateFinish: 'yt-navigate-finish',
} as const;
