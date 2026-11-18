import type { Messages } from './en';

export const it: Messages = {
  'app.name': 'BetterTube',
  'app.tagline': 'Un YouTube migliore sul desktop',

  'nav.label': 'Sezioni delle impostazioni',
  'nav.general': 'Generale',
  'nav.home': 'Home',
  'nav.shorts': 'Shorts',
  'nav.recommendations': 'Consigli',
  'nav.ads': 'Annunci',
  'nav.saved': 'Video salvati',
  'nav.about': 'Informazioni',

  'state.on': 'Attivo',
  'state.off': 'Disattivo',

  'general.title': 'Generale',
  'general.language': 'Lingua',
  'general.language.desc': 'Lingua di BetterTube. Automatica segue il browser.',
  'general.language.auto': 'Automatica',
  'general.theme': 'Tema',
  'general.theme.desc': "Automatico segue l'aspetto di Chrome e del sistema.",
  'theme.system': 'Automatico',
  'theme.light': 'Chiaro',
  'theme.dark': 'Scuro',

  'home.title': 'Home',
  'home.enabled': 'Home con i miei video salvati',
  'home.enabled.desc': 'Mostra i tuoi video salvati al posto del feed predefinito.',
  'home.watchLater': 'Includi Guarda più tardi',
  'home.watchLater.desc':
    'Aggiunge la tua lista Guarda più tardi di YouTube sotto i video salvati.',

  'shorts.title': 'Shorts',
  'shorts.enabled': 'Blocca gli Shorts',
  'shorts.enabled.desc': 'Rimuove gli Shorts da home, risultati di ricerca e barra laterale.',
  'shorts.redirect': 'Apri gli Shorts come video normali',
  'shorts.redirect.desc': 'I link a uno Short si aprono nel player normale.',

  'recommendations.title': 'Consigli',
  'recommendations.enabled': 'Nascondi i video suggeriti',
  'recommendations.enabled.desc': 'Rimuove i video suggeriti accanto e dopo il video che guardi.',
  'recommendations.showSaved': 'Mostra invece i video salvati',
  'recommendations.showSaved.desc': 'Riempie lo spazio vuoto con i video che hai salvato.',

  'ads.title': 'Annunci',
  'ads.enabled': 'Blocca gli annunci',
  'ads.enabled.desc': 'Interruttore generale dei tre livelli qui sotto.',
  'ads.blockRequests': 'Blocca le richieste pubblicitarie',
  'ads.blockRequests.desc':
    'Ferma le richieste note di pubblicità e tracciamento prima del caricamento.',
  'ads.stripPlayerAds': 'Rimuovi gli annunci dal player',
  'ads.stripPlayerAds.desc': 'Elimina i dati pubblicitari dalla risposta del player video.',
  'ads.autoSkip': 'Silenzia e salta il resto',
  'ads.autoSkip.desc':
    'Silenzia ogni annuncio ancora in riproduzione e preme Salta appena compare.',

  'saved.title': 'Video salvati',

  'saved.button.enabled': 'Pulsante Salva sui video',
  'saved.button.enabled.desc':
    'Aggiunge un pulsante Salva su BetterTube accanto a Mi piace nelle pagine dei video.',
  'saved.empty.title': 'Ancora niente di salvato',
  'saved.empty.desc': 'Apri un video su YouTube e premi Salva accanto a Mi piace. Comparirà qui.',
  'saved.count.one': '{count} video',
  'saved.count.other': '{count} video',
  'saved.savedOn': 'Salvato il {date}',
  'saved.moveUp': 'Sposta su',
  'saved.moveDown': 'Sposta giù',
  'saved.remove': 'Rimuovi',
  'saved.export': 'Esporta JSON',
  'saved.import': 'Importa JSON',
  'saved.import.done': '{added} aggiunti, {skipped} ignorati.',
  'saved.import.error': 'Questo file non è un’esportazione di BetterTube.',
  'save.button.save': 'Salva su BetterTube',
  'save.button.saved': 'In BetterTube',
  'save.button.save.title': 'Salva su BetterTube',
  'save.button.saved.title': 'Rimuovi da BetterTube',

  'about.title': 'Informazioni',
  'about.description':
    'BetterTube è un’estensione Chrome open source per un YouTube migliore sul desktop.',
  'about.privacy': 'Tutto resta nel tuo browser. Nessun account, nessun server.',
  'about.disclaimer': 'Non affiliato a, approvato da o sponsorizzato da YouTube o Google.',
  'about.version': 'Versione',

  'popup.openSettings': 'Apri impostazioni',
};
