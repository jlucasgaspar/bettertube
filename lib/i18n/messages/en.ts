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

  'home.title': 'Home',
  'home.enabled': 'Home with my saved videos',
  'home.enabled.desc': 'Show your saved videos instead of the default feed.',
  'home.watchLater': 'Include Watch Later',
  'home.watchLater.desc': 'Add your YouTube Watch Later list below your saved videos.',

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

  'saved.title': 'Saved videos',

  'saved.button.enabled': 'Save button on videos',
  'saved.button.enabled.desc': 'Adds a Save to BetterTube button next to Like on video pages.',
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

  'about.title': 'About',
  'about.description':
    'BetterTube is an open source Chrome extension for a better YouTube on desktop.',
  'about.privacy': 'Everything stays in your browser. There is no account and no server.',
  'about.disclaimer': 'Not affiliated with, endorsed by or sponsored by YouTube or Google.',
  'about.version': 'Version',

  'popup.openSettings': 'Open settings',
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
