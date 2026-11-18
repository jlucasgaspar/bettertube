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

  'home.title': 'Accueil',
  'home.enabled': 'Accueil avec mes vidéos enregistrées',
  'home.enabled.desc': 'Affiche vos vidéos enregistrées à la place du flux par défaut.',
  'home.watchLater': 'Inclure À regarder plus tard',
  'home.watchLater.desc':
    'Ajoute votre liste À regarder plus tard de YouTube sous vos vidéos enregistrées.',

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

  'saved.title': 'Vidéos enregistrées',

  'saved.button.enabled': 'Bouton Enregistrer sur les vidéos',
  'saved.button.enabled.desc':
    'Ajoute un bouton Ajouter à BetterTube à côté de J’aime sur les pages de vidéo.',
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

  'about.title': 'À propos',
  'about.description':
    'BetterTube est une extension Chrome open source pour un meilleur YouTube sur ordinateur.',
  'about.privacy': 'Tout reste dans votre navigateur. Pas de compte, pas de serveur.',
  'about.disclaimer': 'Non affilié à YouTube ou Google, ni approuvé ou sponsorisé par eux.',
  'about.version': 'Version',

  'popup.openSettings': 'Ouvrir les réglages',
};
