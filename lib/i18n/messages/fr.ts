import type { Messages } from './en';

export const fr: Messages = {
  'app.name': 'BetterTube',
  'app.tagline': 'Un meilleur YouTube sur ordinateur',

  'nav.label': 'Sections des réglages',
  'nav.general': 'Général',
  'nav.home': 'Accueil',
  'nav.shorts': 'Shorts',
  'nav.recommendations': 'Recommandations',
  'nav.ads': 'Publicités',
  'nav.saved': 'Vidéos enregistrées',
  'nav.channels': 'Chaînes enregistrées',
  'nav.about': 'À propos',

  'state.on': 'Activé',
  'state.off': 'Désactivé',

  'general.title': 'Général',
  'general.language': 'Langue',
  'general.language.desc': 'Langue de BetterTube. Automatique suit votre navigateur.',
  'general.language.auto': 'Automatique',
  'general.theme': 'Thème',
  'general.theme.desc': "Automatique suit l'apparence de Chrome et du système.",
  'theme.system': 'Automatique',
  'theme.light': 'Clair',
  'theme.dark': 'Sombre',

  'enabled.label': 'Activer',
  'enabled.desc':
    'Interrupteur général. Désactivé, YouTube s’affiche et fonctionne comme d’habitude.',

  'home.title': 'Accueil',
  'home.enabled': 'Page d’accueil personnalisée',
  'home.enabled.desc': 'Remplace le flux par défaut par vos propres sections.',
  'home.showSaved': 'Afficher les vidéos enregistrées',
  'home.showSaved.desc': 'Les vidéos que vous avez enregistrées dans BetterTube.',
  'home.showWatchLater': 'Afficher les vidéos à regarder plus tard',
  'home.showWatchLater.desc': 'Votre liste À regarder plus tard de YouTube.',
  'home.showChannels': 'Afficher les chaînes enregistrées',
  'home.showChannels.desc': 'Les chaînes que vous avez enregistrées dans BetterTube.',

  'shorts.title': 'Shorts',
  'shorts.enabled': 'Bloquer les Shorts',
  'shorts.enabled.desc': "Retire les Shorts de l'accueil, des résultats et du menu latéral.",
  'shorts.redirect': 'Ouvrir les Shorts comme des vidéos normales',
  'shorts.redirect.desc': 'Les liens vers un Short s’ouvrent dans le lecteur habituel.',

  'recommendations.title': 'Recommandations',
  'recommendations.enabled': 'Masquer les vidéos suggérées',
  'recommendations.enabled.desc':
    'Retire les vidéos suggérées à côté et à la suite de la vidéo regardée.',
  'recommendations.showSaved': 'Afficher les vidéos enregistrées à la place',
  'recommendations.showSaved.desc':
    "Remplit l'espace libéré avec les vidéos que vous avez enregistrées.",

  'ads.title': 'Publicités',
  'ads.enabled': 'Bloquer les publicités',
  'ads.enabled.desc': 'Interrupteur général des trois couches ci-dessous.',
  'ads.blockRequests': 'Bloquer les requêtes publicitaires',
  'ads.blockRequests.desc':
    'Arrête les requêtes publicitaires et de suivi connues avant leur chargement.',
  'ads.stripPlayerAds': 'Retirer les publicités du lecteur',
  'ads.stripPlayerAds.desc': 'Supprime les données publicitaires de la réponse du lecteur vidéo.',
  'ads.autoSkip': 'Couper le son et passer le reste',
  'ads.autoSkip.desc':
    'Coupe le son de toute publicité encore diffusée et clique sur Passer dès que possible.',
  'ads.hideFeedAds': 'Masquer bannières et cartes sponsorisées',
  'ads.hideFeedAds.desc':
    "Retire les bannières publicitaires et les éléments sponsorisés de l'accueil, de la recherche et de la page vidéo.",
  'ads.stats.title': 'Publicités traitées',
  'ads.stats.desc':
    '{count} au total : {stripped} retirées du lecteur, {skipped} coupées et passées. Les requêtes bloquées ne sont pas comptées.',
  'ads.stats.reset': 'Réinitialiser le compteur',

  'saved.title': 'Vidéos enregistrées',

  'saved.empty.title': 'Rien d’enregistré pour l’instant',
  'saved.empty.desc':
    'Ouvrez une vidéo sur YouTube et cliquez sur Enregistrer à côté de J’aime. Elle apparaîtra ici.',
  'saved.count.one': '{count} vidéo',
  'saved.count.other': '{count} vidéos',
  'saved.savedOn': 'Enregistrée le {date}',
  'saved.moveUp': 'Monter',
  'saved.moveDown': 'Descendre',
  'saved.remove': 'Retirer',
  'saved.export': 'Exporter en JSON',
  'saved.import': 'Importer un JSON',
  'saved.import.done': '{added} ajoutées, {skipped} ignorées.',
  'saved.import.error': 'Ce fichier n’est pas un export BetterTube.',
  'save.button.save': 'Ajouter à BetterTube',
  'save.button.saved': 'Dans BetterTube',
  'save.button.save.title': 'Enregistrer dans BetterTube',
  'save.button.saved.title': 'Retirer de BetterTube',

  'channels.title': 'Chaînes enregistrées',
  'channels.empty.title': 'Aucune chaîne enregistrée',
  'channels.empty.desc':
    'Ouvrez une chaîne sur YouTube et cliquez sur Enregistrer la chaîne dans BetterTube à côté de S’abonner. Elle apparaîtra ici.',
  'channels.count.one': '{count} chaîne',
  'channels.count.other': '{count} chaînes',
  'channel.button.save': 'Enregistrer la chaîne dans BetterTube',
  'channel.button.saved': 'Chaîne dans BetterTube',
  'channel.button.save.title': 'Enregistrer la chaîne dans BetterTube',
  'channel.button.saved.title': 'Retirer la chaîne de BetterTube',

  'about.title': 'À propos',
  'about.description':
    'BetterTube est une extension Chrome open source pour un meilleur YouTube sur ordinateur.',
  'about.privacy': 'Tout reste dans votre navigateur. Pas de compte, pas de serveur.',
  'about.disclaimer': 'Non affilié à YouTube ou Google, ni approuvé ou sponsorisé par eux.',
  'about.version': 'Version',

  'customHome.saved.title': 'Vidéos enregistrées',
  'customHome.watchLater.title': 'À regarder plus tard',
  'customHome.channels.title': 'Chaînes enregistrées',
  'customHome.loading': 'Chargement…',
  'customHome.retry': 'Réessayer',
  'customHome.menu.open': 'Plus d’options',
  'customHome.menu.remove': 'Retirer',
  'customHome.watchLater.removeError':
    'Impossible de retirer la vidéo de À regarder plus tard. Rien n’a été modifié.',
  'customHome.scroll.prev': 'Défiler vers la gauche',
  'customHome.scroll.next': 'Défiler vers la droite',
  'customHome.saved.empty':
    'Aucune vidéo enregistrée. Cliquez sur Ajouter à BetterTube à côté de J’aime sur n’importe quelle vidéo.',
  'customHome.watchLater.empty': 'Votre liste À regarder plus tard est vide.',
  'customHome.watchLater.error':
    'Impossible de charger votre liste À regarder plus tard. Vérifiez que vous êtes connecté à YouTube.',
  'customHome.channels.empty':
    'Aucune chaîne enregistrée. Cliquez sur Enregistrer la chaîne dans BetterTube à côté de S’abonner.',

  'popup.openSettings': 'Ouvrir les réglages',
};
