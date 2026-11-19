export const en = {
  'app.name': 'BetterTube',
  'app.tagline': 'A better YouTube on desktop',

  'nav.label': 'Settings sections',
  'nav.general': 'General',
  'nav.home': 'Home',
  'nav.shorts': 'Shorts',
  'nav.recommendations': 'Recommendations',
  'nav.ads': 'Ads',
  'nav.saved': 'Saved videos',
  'nav.channels': 'Saved channels',
  'nav.about': 'About',

  'state.on': 'On',
  'state.off': 'Off',

  'general.title': 'General',
  'general.language': 'Language',
  'general.language.desc': 'Language of BetterTube. Automatic follows your browser.',
  'general.language.auto': 'Automatic',
  'general.theme': 'Theme',
  'general.theme.desc': 'Automatic follows your Chrome and system appearance.',
  'theme.system': 'Automatic',
  'theme.light': 'Light',
  'theme.dark': 'Dark',

  'enabled.label': 'Enable',
  'enabled.desc': 'Master switch. When off, YouTube looks and works as usual.',

  'home.title': 'Home',
  'home.enabled': 'Custom Home Page',
  'home.enabled.desc': 'Replace the default feed with your own sections.',
  'home.showSaved': 'Show saved videos',
  'home.showSaved.desc': 'Videos you saved with BetterTube.',
  'home.showWatchLater': 'Show watch later videos',
  'home.showWatchLater.desc': 'Your YouTube Watch Later list.',
  'home.showChannels': 'Show saved channels',
  'home.showChannels.desc': 'Channels you saved with BetterTube.',

  'shorts.title': 'Shorts',
  'shorts.enabled': 'Block Shorts',
  'shorts.enabled.desc': 'Remove Shorts from the home, search results and sidebar.',
  'shorts.redirect': 'Open Shorts as regular videos',
  'shorts.redirect.desc': 'Links to a Short open in the normal player instead.',

  'recommendations.title': 'Recommendations',
  'recommendations.enabled': 'Hide suggested videos',
  'recommendations.enabled.desc': 'Remove suggested videos next to and after the video you watch.',
  'recommendations.showSaved': 'Show saved videos instead',
  'recommendations.showSaved.desc': 'Fill the empty space with videos you saved.',

  'ads.title': 'Ads',
  'ads.enabled': 'Block ads',
  'ads.enabled.desc': 'Master switch for the three layers below.',
  'ads.blockRequests': 'Block ad requests',
  'ads.blockRequests.desc': 'Stop known ad and tracking requests before they load.',
  'ads.stripPlayerAds': 'Remove ads from the player',
  'ads.stripPlayerAds.desc': 'Strip ad data from the video player response.',
  'ads.autoSkip': 'Mute and skip what remains',
  'ads.autoSkip.desc': 'Mute any ad that still plays and press Skip as soon as it appears.',
  'ads.hideFeedAds': 'Hide banners and sponsored cards',
  'ads.hideFeedAds.desc':
    'Remove ad banners and sponsored items from the home, search results and watch page.',
  'ads.stats.title': 'Ads handled',
  'ads.stats.desc':
    '{count} total: {stripped} cleaned from the player, {skipped} muted and skipped. Blocked requests are not counted.',
  'ads.stats.reset': 'Reset counter',

  'saved.title': 'Saved videos',

  'saved.empty.title': 'Nothing saved yet',
  'saved.empty.desc': 'Open a video on YouTube and press Save next to Like. It will show up here.',
  'saved.count.one': '{count} video',
  'saved.count.other': '{count} videos',
  'saved.savedOn': 'Saved {date}',
  'saved.moveUp': 'Move up',
  'saved.moveDown': 'Move down',
  'saved.remove': 'Remove',
  'saved.export': 'Export JSON',
  'saved.import': 'Import JSON',
  'saved.import.done': '{added} added, {skipped} skipped.',
  'saved.import.error': 'That file is not a BetterTube export.',
  'save.button.save': 'Save to BetterTube',
  'save.button.saved': 'In BetterTube',
  'save.button.save.title': 'Save to BetterTube',
  'save.button.saved.title': 'Remove from BetterTube',

  'channels.title': 'Saved channels',
  'channels.empty.title': 'No channels saved yet',
  'channels.empty.desc':
    'Open a channel on YouTube and press Save channel to BetterTube next to Subscribe. It will show up here.',
  'channels.count.one': '{count} channel',
  'channels.count.other': '{count} channels',
  'channel.button.save': 'Save channel to BetterTube',
  'channel.button.saved': 'Channel in BetterTube',
  'channel.button.save.title': 'Save channel to BetterTube',
  'channel.button.saved.title': 'Remove channel from BetterTube',

  'about.title': 'About',
  'about.description':
    'BetterTube is an open source Chrome extension for a better YouTube on desktop.',
  'about.privacy': 'Everything stays in your browser. There is no account and no server.',
  'about.disclaimer': 'Not affiliated with, endorsed by or sponsored by YouTube or Google.',
  'about.version': 'Version',

  'customHome.saved.title': 'Saved videos',
  'customHome.watchLater.title': 'Watch Later',
  'customHome.channels.title': 'Saved channels',
  'customHome.loading': 'Loading…',
  'customHome.retry': 'Try again',
  'customHome.saved.empty': 'No saved videos yet. Press Save next to Like on any video.',
  'customHome.watchLater.empty': 'Your Watch Later list is empty.',
  'customHome.watchLater.error':
    'Could not load your Watch Later list. Make sure you are signed in to YouTube.',
  'customHome.channels.empty':
    'No saved channels yet. Press Save channel to BetterTube next to Subscribe.',

  'popup.openSettings': 'Open settings',
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
