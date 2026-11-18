export type PageType = 'home' | 'watch' | 'search' | 'shorts' | 'channel' | 'other';

const CHANNEL_PREFIXES = ['/@', '/channel/', '/c/', '/user/'];

export function detectPageType(url: string | URL): PageType {
  const { pathname } = typeof url === 'string' ? new URL(url) : url;

  if (pathname === '/') return 'home';
  if (pathname === '/watch') return 'watch';
  if (pathname === '/results') return 'search';
  if (pathname.startsWith('/shorts/')) return 'shorts';
  if (CHANNEL_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return 'channel';
  return 'other';
}
