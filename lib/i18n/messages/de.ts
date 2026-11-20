import type { Messages } from './en';

export const de: Messages = {
  'app.name': 'BetterTube',
  'app.tagline': 'Ein besseres YouTube am Desktop',

  'nav.label': 'Bereiche der Einstellungen',
  'nav.general': 'Allgemein',
  'nav.home': 'Startseite',
  'nav.shorts': 'Shorts',
  'nav.recommendations': 'Empfehlungen',
  'nav.ads': 'Werbung',
  'nav.saved': 'Gespeicherte Videos',
  'nav.channels': 'Gespeicherte Kanäle',
  'nav.about': 'Über',

  'state.on': 'An',
  'state.off': 'Aus',

  'general.title': 'Allgemein',
  'general.language': 'Sprache',
  'general.language.desc': 'Sprache von BetterTube. Automatisch folgt deinem Browser.',
  'general.language.auto': 'Automatisch',
  'general.theme': 'Design',
  'general.theme.desc': 'Automatisch folgt dem Erscheinungsbild von Chrome und System.',
  'theme.system': 'Automatisch',
  'theme.light': 'Hell',
  'theme.dark': 'Dunkel',

  'enabled.label': 'Aktivieren',
  'enabled.desc': 'Hauptschalter. Ist er aus, sieht YouTube aus und funktioniert wie gewohnt.',

  'home.title': 'Startseite',
  'home.enabled': 'Eigene Startseite',
  'home.enabled.desc': 'Ersetzt den Standard-Feed durch deine eigenen Bereiche.',
  'home.showSaved': 'Gespeicherte Videos anzeigen',
  'home.showSaved.desc': 'Videos, die du in BetterTube gespeichert hast.',
  'home.showWatchLater': 'Videos aus „Später ansehen“ anzeigen',
  'home.showWatchLater.desc': 'Deine YouTube-Liste „Später ansehen“.',
  'home.showChannels': 'Gespeicherte Kanäle anzeigen',
  'home.showChannels.desc': 'Kanäle, die du in BetterTube gespeichert hast.',
  'home.showPlaylists': 'Meine Playlists anzeigen',
  'home.showPlaylists.desc': 'Deine eigenen YouTube-Playlists.',

  'shorts.title': 'Shorts',
  'shorts.enabled': 'Shorts blockieren',
  'shorts.enabled.desc': 'Entfernt Shorts von Startseite, Suchergebnissen und Seitenleiste.',
  'shorts.redirect': 'Shorts als normale Videos öffnen',
  'shorts.redirect.desc': 'Links zu einem Short öffnen sich im normalen Player.',

  'recommendations.title': 'Empfehlungen',
  'recommendations.enabled': 'Vorgeschlagene Videos ausblenden',
  'recommendations.enabled.desc':
    'Entfernt vorgeschlagene Videos neben und nach dem Video, das du ansiehst.',
  'recommendations.showSaved': 'Stattdessen gespeicherte Videos zeigen',
  'recommendations.showSaved.desc':
    'Füllt den freien Platz mit deinen gespeicherten Videos, Später ansehen und gespeicherten Kanälen.',

  'ads.title': 'Werbung',
  'ads.enabled': 'Werbung blockieren',
  'ads.enabled.desc': 'Hauptschalter für die drei Ebenen darunter.',
  'ads.blockRequests': 'Werbeanfragen blockieren',
  'ads.blockRequests.desc': 'Stoppt bekannte Werbe- und Tracking-Anfragen, bevor sie laden.',
  'ads.stripPlayerAds': 'Werbung aus dem Player entfernen',
  'ads.stripPlayerAds.desc': 'Entfernt Werbedaten aus der Antwort des Videoplayers.',
  'ads.autoSkip': 'Stummschalten und Rest überspringen',
  'ads.autoSkip.desc':
    'Schaltet jede noch laufende Werbung stumm und klickt auf Überspringen, sobald es erscheint.',
  'ads.hideFeedAds': 'Banner und gesponserte Karten ausblenden',
  'ads.hideFeedAds.desc':
    'Entfernt Werbebanner und gesponserte Einträge von Startseite, Suche und Videoseite.',
  'ads.stats.title': 'Behandelte Werbung',
  'ads.stats.desc':
    '{count} insgesamt: {stripped} aus dem Player entfernt, {skipped} stummgeschaltet und übersprungen. Blockierte Anfragen werden nicht gezählt.',
  'ads.stats.reset': 'Zähler zurücksetzen',

  'saved.title': 'Gespeicherte Videos',

  'saved.empty.title': 'Noch nichts gespeichert',
  'saved.empty.desc':
    'Öffne ein Video auf YouTube und klicke neben „Gefällt mir“ auf Speichern. Es erscheint hier.',
  'saved.count.one': '{count} Video',
  'saved.count.other': '{count} Videos',
  'saved.savedOn': 'Gespeichert am {date}',
  'saved.moveUp': 'Nach oben',
  'saved.moveDown': 'Nach unten',
  'saved.remove': 'Entfernen',
  'saved.export': 'JSON exportieren',
  'saved.import': 'JSON importieren',
  'saved.import.done': '{added} hinzugefügt, {skipped} übersprungen.',
  'saved.import.error': 'Diese Datei ist kein BetterTube-Export.',
  'save.button.save': 'In BetterTube speichern',
  'save.button.saved': 'In BetterTube',
  'save.button.save.title': 'In BetterTube speichern',
  'save.button.saved.title': 'Aus BetterTube entfernen',

  'channels.title': 'Gespeicherte Kanäle',
  'channels.empty.title': 'Noch keine Kanäle gespeichert',
  'channels.empty.desc':
    'Öffne einen Kanal auf YouTube und klicke neben „Abonnieren“ auf „Kanal in BetterTube speichern“. Er erscheint hier.',
  'channels.count.one': '{count} Kanal',
  'channels.count.other': '{count} Kanäle',
  'channel.button.save': 'Kanal in BetterTube speichern',
  'channel.button.saved': 'Kanal in BetterTube',
  'channel.button.save.title': 'Kanal in BetterTube speichern',
  'channel.button.saved.title': 'Kanal aus BetterTube entfernen',

  'about.title': 'Über',
  'about.description':
    'BetterTube ist eine Open-Source-Chrome-Erweiterung für ein besseres YouTube am Desktop.',
  'about.privacy': 'Alles bleibt in deinem Browser. Kein Konto, kein Server.',
  'about.disclaimer':
    'Nicht mit YouTube oder Google verbunden und nicht von ihnen unterstützt oder gesponsert.',
  'about.version': 'Version',

  'customHome.saved.title': 'Gespeicherte Videos',
  'customHome.watchLater.title': 'Später ansehen',
  'customHome.channels.title': 'Gespeicherte Kanäle',
  'customHome.loading': 'Wird geladen…',
  'customHome.retry': 'Erneut versuchen',
  'customHome.playlists.title': 'Meine Playlists',
  'customHome.playlists.empty': 'Du hast noch keine Playlists.',
  'customHome.playlists.error':
    'Deine Playlists konnten nicht geladen werden. YouTube hat möglicherweise etwas geändert.',
  'customHome.showMore': 'Mehr anzeigen',
  'customHome.showLess': 'Weniger anzeigen',
  'customHome.menu.open': 'Weitere Optionen',
  'customHome.menu.remove': 'Entfernen',
  'customHome.order.label': 'Sortieren nach',
  'customHome.order.default': 'Standardreihenfolge',
  'customHome.order.newest': 'Neueste zuerst',
  'customHome.order.oldest': 'Älteste zuerst',
  'customHome.watchLater.removeError':
    'Konnte nicht aus „Später ansehen“ entfernt werden. Es wurde nichts geändert.',
  'customHome.scroll.prev': 'Nach links scrollen',
  'customHome.scroll.next': 'Nach rechts scrollen',
  'customHome.saved.empty':
    'Noch keine Videos gespeichert. Klicke bei einem Video neben „Gefällt mir“ auf Speichern.',
  'customHome.watchLater.empty': 'Deine Liste „Später ansehen“ ist leer.',
  'customHome.watchLater.error':
    'Deine Liste „Später ansehen“ konnte nicht geladen werden. Prüfe, ob du bei YouTube angemeldet bist.',
  'customHome.channels.empty':
    'Noch keine Kanäle gespeichert. Klicke neben „Abonnieren“ auf „Kanal in BetterTube speichern“.',

  'popup.openSettings': 'Einstellungen öffnen',
};
