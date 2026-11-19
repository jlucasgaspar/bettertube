import type { Messages } from './en';

export const pt_BR: Messages = {
  'app.name': 'BetterTube',
  'app.tagline': 'Um YouTube melhor no desktop',

  'nav.label': 'Seções das configurações',
  'nav.general': 'Geral',
  'nav.home': 'Início',
  'nav.shorts': 'Shorts',
  'nav.recommendations': 'Recomendações',
  'nav.ads': 'Anúncios',
  'nav.saved': 'Vídeos salvos',
  'nav.channels': 'Canais salvos',
  'nav.about': 'Sobre',

  'state.on': 'Ativado',
  'state.off': 'Desativado',

  'general.title': 'Geral',
  'general.language': 'Idioma',
  'general.language.desc': 'Idioma do BetterTube. Automático segue o seu navegador.',
  'general.language.auto': 'Automático',
  'general.theme': 'Tema',
  'general.theme.desc': 'Automático segue a aparência do Chrome e do sistema.',
  'theme.system': 'Automático',
  'theme.light': 'Claro',
  'theme.dark': 'Escuro',

  'enabled.label': 'Ativar',
  'enabled.desc': 'Chave geral. Desativada, o YouTube fica e funciona como de costume.',

  'home.title': 'Início',
  'home.enabled': 'Página inicial personalizada',
  'home.enabled.desc': 'Troca o feed padrão por suas próprias seções.',
  'home.showSaved': 'Mostrar vídeos salvos',
  'home.showSaved.desc': 'Vídeos que você salvou no BetterTube.',
  'home.showWatchLater': 'Mostrar vídeos de Assistir mais tarde',
  'home.showWatchLater.desc': 'Sua lista Assistir mais tarde do YouTube.',
  'home.showChannels': 'Mostrar canais salvos',
  'home.showChannels.desc': 'Canais que você salvou no BetterTube.',

  'shorts.title': 'Shorts',
  'shorts.enabled': 'Bloquear Shorts',
  'shorts.enabled.desc': 'Remove os Shorts do início, da busca e do menu lateral.',
  'shorts.redirect': 'Abrir Shorts como vídeos normais',
  'shorts.redirect.desc': 'Links de Shorts abrem no player comum.',

  'recommendations.title': 'Recomendações',
  'recommendations.enabled': 'Ocultar vídeos sugeridos',
  'recommendations.enabled.desc':
    'Remove os vídeos sugeridos ao lado e depois do vídeo que você assiste.',
  'recommendations.showSaved': 'Mostrar vídeos salvos no lugar',
  'recommendations.showSaved.desc': 'Preenche o espaço vazio com os vídeos que você salvou.',

  'ads.title': 'Anúncios',
  'ads.enabled': 'Bloquear anúncios',
  'ads.enabled.desc': 'Chave geral das três camadas abaixo.',
  'ads.blockRequests': 'Bloquear requisições de anúncios',
  'ads.blockRequests.desc':
    'Impede requisições conhecidas de anúncios e rastreamento antes de carregar.',
  'ads.stripPlayerAds': 'Remover anúncios do player',
  'ads.stripPlayerAds.desc': 'Retira os dados de anúncio da resposta do player de vídeo.',
  'ads.autoSkip': 'Silenciar e pular o que sobrar',
  'ads.autoSkip.desc':
    'Silencia qualquer anúncio que ainda toque e clica em Pular assim que aparecer.',

  'saved.title': 'Vídeos salvos',

  'saved.empty.title': 'Nada salvo ainda',
  'saved.empty.desc':
    'Abra um vídeo no YouTube e clique em Salvar ao lado de Gostei. Ele aparece aqui.',
  'saved.count.one': '{count} vídeo',
  'saved.count.other': '{count} vídeos',
  'saved.savedOn': 'Salvo em {date}',
  'saved.moveUp': 'Mover para cima',
  'saved.moveDown': 'Mover para baixo',
  'saved.remove': 'Remover',
  'saved.export': 'Exportar JSON',
  'saved.import': 'Importar JSON',
  'saved.import.done': '{added} adicionados, {skipped} ignorados.',
  'saved.import.error': 'Esse arquivo não é uma exportação do BetterTube.',
  'save.button.save': 'Salvar no BetterTube',
  'save.button.saved': 'No BetterTube',
  'save.button.save.title': 'Salvar no BetterTube',
  'save.button.saved.title': 'Remover do BetterTube',

  'channels.title': 'Canais salvos',
  'channels.empty.title': 'Nenhum canal salvo ainda',
  'channels.empty.desc':
    'Abra um canal no YouTube e clique em Salvar canal no BetterTube ao lado de Inscrever-se. Ele aparecerá aqui.',
  'channels.count.one': '{count} canal',
  'channels.count.other': '{count} canais',
  'channel.button.save': 'Salvar canal no BetterTube',
  'channel.button.saved': 'Canal no BetterTube',
  'channel.button.save.title': 'Salvar canal no BetterTube',
  'channel.button.saved.title': 'Remover canal do BetterTube',

  'about.title': 'Sobre',
  'about.description':
    'BetterTube é uma extensão open source do Chrome para um YouTube melhor no desktop.',
  'about.privacy': 'Tudo fica no seu navegador. Não há conta nem servidor.',
  'about.disclaimer': 'Sem afiliação, endosso ou patrocínio do YouTube ou do Google.',
  'about.version': 'Versão',

  'customHome.saved.title': 'Vídeos salvos',
  'customHome.watchLater.title': 'Assistir mais tarde',
  'customHome.channels.title': 'Canais salvos',
  'customHome.loading': 'Carregando…',
  'customHome.retry': 'Tentar de novo',
  'customHome.saved.empty':
    'Nenhum vídeo salvo ainda. Clique em Salvar ao lado de Gostei em qualquer vídeo.',
  'customHome.watchLater.empty': 'Sua lista Assistir mais tarde está vazia.',
  'customHome.watchLater.error':
    'Não foi possível carregar sua lista Assistir mais tarde. Confirme que você está logado no YouTube.',
  'customHome.channels.empty':
    'Nenhum canal salvo ainda. Clique em Salvar canal no BetterTube ao lado de Inscrever-se.',

  'popup.openSettings': 'Abrir configurações',
};
