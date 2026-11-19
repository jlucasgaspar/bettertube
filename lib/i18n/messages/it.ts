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
  'nav.channels': 'Canali salvati',
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

  'enabled.label': 'Attiva',
  'enabled.desc':
    'Interruttore generale. Se disattivato, YouTube appare e funziona come al solito.',

  'home.title': 'Home',
  'home.enabled': 'Home personalizzata',
  'home.enabled.desc': 'Sostituisce il feed predefinito con le tue sezioni.',
  'home.showSaved': 'Mostra i video salvati',
  'home.showSaved.desc': 'I video che hai salvato su BetterTube.',
  'home.showWatchLater': 'Mostra i video di Guarda più tardi',
  'home.showWatchLater.desc': 'La tua lista Guarda più tardi di YouTube.',
  'home.showChannels': 'Mostra i canali salvati',
  'home.showChannels.desc': 'I canali che hai salvato su BetterTube.',

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
  'ads.stats.title': 'Annunci gestiti',
  'ads.stats.desc':
    '{count} in totale: {stripped} rimossi dal player, {skipped} silenziati e saltati. Le richieste bloccate non vengono contate.',
  'ads.stats.reset': 'Azzera contatore',

  'saved.title': 'Video salvati',

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

  'channels.title': 'Canali salvati',
  'channels.empty.title': 'Nessun canale salvato',
  'channels.empty.desc':
    'Apri un canale su YouTube e premi Salva canale su BetterTube accanto a Iscriviti. Apparirà qui.',
  'channels.count.one': '{count} canale',
  'channels.count.other': '{count} canali',
  'channel.button.save': 'Salva canale su BetterTube',
  'channel.button.saved': 'Canale su BetterTube',
  'channel.button.save.title': 'Salva canale su BetterTube',
  'channel.button.saved.title': 'Rimuovi canale da BetterTube',

  'about.title': 'Informazioni',
  'about.description':
    'BetterTube è un’estensione Chrome open source per un YouTube migliore sul desktop.',
  'about.privacy': 'Tutto resta nel tuo browser. Nessun account, nessun server.',
  'about.disclaimer': 'Non affiliato a, approvato da o sponsorizzato da YouTube o Google.',
  'about.version': 'Versione',

  'customHome.saved.title': 'Video salvati',
  'customHome.watchLater.title': 'Guarda più tardi',
  'customHome.channels.title': 'Canali salvati',
  'customHome.loading': 'Caricamento…',
  'customHome.retry': 'Riprova',
  'customHome.saved.empty':
    'Nessun video salvato. Premi Salva accanto a Mi piace su qualsiasi video.',
  'customHome.watchLater.empty': 'La tua lista Guarda più tardi è vuota.',
  'customHome.watchLater.error':
    'Impossibile caricare la tua lista Guarda più tardi. Verifica di aver effettuato l’accesso a YouTube.',
  'customHome.channels.empty':
    'Nessun canale salvato. Premi Salva canale su BetterTube accanto a Iscriviti.',

  'popup.openSettings': 'Apri impostazioni',
};
