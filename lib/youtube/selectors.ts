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
} as const;

export type SelectorKey = keyof typeof selectors;

/** Custom events YouTube dispatches on `document` during SPA navigation. */
export const events = {
  navigateStart: 'yt-navigate-start',
  navigateFinish: 'yt-navigate-finish',
} as const;
