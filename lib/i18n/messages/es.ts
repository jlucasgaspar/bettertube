import type { Messages } from './en';

export const es: Messages = {
  'app.name': 'BetterTube',
  'app.tagline': 'Un mejor YouTube en el escritorio',

  'nav.label': 'Secciones de ajustes',
  'nav.general': 'General',
  'nav.home': 'Inicio',
  'nav.shorts': 'Shorts',
  'nav.recommendations': 'Recomendaciones',
  'nav.ads': 'Anuncios',
  'nav.saved': 'Videos guardados',
  'nav.channels': 'Canales guardados',
  'nav.about': 'Acerca de',

  'state.on': 'Activado',
  'state.off': 'Desactivado',

  'general.title': 'General',
  'general.language': 'Idioma',
  'general.language.desc': 'Idioma de BetterTube. Automático sigue tu navegador.',
  'general.language.auto': 'Automático',
  'general.theme': 'Tema',
  'general.theme.desc': 'Automático sigue la apariencia de Chrome y del sistema.',
  'theme.system': 'Automático',
  'theme.light': 'Claro',
  'theme.dark': 'Oscuro',

  'enabled.label': 'Activar',
  'enabled.desc': 'Interruptor general. Desactivado, YouTube se ve y funciona como siempre.',

  'home.title': 'Inicio',
  'home.enabled': 'Página de inicio personalizada',
  'home.enabled.desc': 'Sustituye el feed predeterminado por tus propias secciones.',
  'home.showSaved': 'Mostrar videos guardados',
  'home.showSaved.desc': 'Videos que guardaste en BetterTube.',
  'home.showWatchLater': 'Mostrar videos de Ver más tarde',
  'home.showWatchLater.desc': 'Tu lista Ver más tarde de YouTube.',
  'home.showChannels': 'Mostrar canales guardados',
  'home.showChannels.desc': 'Canales que guardaste en BetterTube.',

  'shorts.title': 'Shorts',
  'shorts.enabled': 'Bloquear Shorts',
  'shorts.enabled.desc': 'Quita los Shorts del inicio, de los resultados y del menú lateral.',
  'shorts.redirect': 'Abrir Shorts como videos normales',
  'shorts.redirect.desc': 'Los enlaces a un Short se abren en el reproductor normal.',

  'recommendations.title': 'Recomendaciones',
  'recommendations.enabled': 'Ocultar videos sugeridos',
  'recommendations.enabled.desc':
    'Quita los videos sugeridos junto al video que ves y al terminar.',
  'recommendations.showSaved': 'Mostrar videos guardados en su lugar',
  'recommendations.showSaved.desc': 'Llena el espacio vacío con los videos que guardaste.',

  'ads.title': 'Anuncios',
  'ads.enabled': 'Bloquear anuncios',
  'ads.enabled.desc': 'Interruptor general de las tres capas de abajo.',
  'ads.blockRequests': 'Bloquear solicitudes de anuncios',
  'ads.blockRequests.desc': 'Detiene solicitudes conocidas de anuncios y rastreo antes de cargar.',
  'ads.stripPlayerAds': 'Quitar anuncios del reproductor',
  'ads.stripPlayerAds.desc': 'Elimina los datos de anuncios de la respuesta del reproductor.',
  'ads.autoSkip': 'Silenciar y saltar lo que quede',
  'ads.autoSkip.desc': 'Silencia cualquier anuncio que aún suene y pulsa Saltar en cuanto aparece.',

  'saved.title': 'Videos guardados',

  'saved.empty.title': 'Nada guardado todavía',
  'saved.empty.desc': 'Abre un video en YouTube y pulsa Guardar junto a Me gusta. Aparecerá aquí.',
  'saved.count.one': '{count} video',
  'saved.count.other': '{count} videos',
  'saved.savedOn': 'Guardado el {date}',
  'saved.moveUp': 'Subir',
  'saved.moveDown': 'Bajar',
  'saved.remove': 'Quitar',
  'saved.export': 'Exportar JSON',
  'saved.import': 'Importar JSON',
  'saved.import.done': '{added} añadidos, {skipped} omitidos.',
  'saved.import.error': 'Ese archivo no es una exportación de BetterTube.',
  'save.button.save': 'Guardar en BetterTube',
  'save.button.saved': 'En BetterTube',
  'save.button.save.title': 'Guardar en BetterTube',
  'save.button.saved.title': 'Quitar de BetterTube',

  'channels.title': 'Canales guardados',
  'channels.empty.title': 'Aún no hay canales guardados',
  'channels.empty.desc':
    'Abre un canal en YouTube y pulsa Guardar canal en BetterTube junto a Suscribirse. Aparecerá aquí.',
  'channels.count.one': '{count} canal',
  'channels.count.other': '{count} canales',
  'channel.button.save': 'Guardar canal en BetterTube',
  'channel.button.saved': 'Canal en BetterTube',
  'channel.button.save.title': 'Guardar canal en BetterTube',
  'channel.button.saved.title': 'Quitar canal de BetterTube',

  'about.title': 'Acerca de',
  'about.description':
    'BetterTube es una extensión de Chrome de código abierto para un mejor YouTube en el escritorio.',
  'about.privacy': 'Todo se queda en tu navegador. No hay cuenta ni servidor.',
  'about.disclaimer': 'Sin afiliación, respaldo ni patrocinio de YouTube o Google.',
  'about.version': 'Versión',

  'customHome.saved.title': 'Videos guardados',
  'customHome.watchLater.title': 'Ver más tarde',
  'customHome.channels.title': 'Canales guardados',
  'customHome.loading': 'Cargando…',
  'customHome.retry': 'Reintentar',
  'customHome.saved.empty':
    'Aún no hay videos guardados. Pulsa Guardar junto a Me gusta en cualquier video.',
  'customHome.watchLater.empty': 'Tu lista Ver más tarde está vacía.',
  'customHome.watchLater.error':
    'No se pudo cargar tu lista Ver más tarde. Comprueba que hayas iniciado sesión en YouTube.',
  'customHome.channels.empty':
    'Aún no hay canales guardados. Pulsa Guardar canal en BetterTube junto a Suscribirse.',

  'popup.openSettings': 'Abrir ajustes',
};
