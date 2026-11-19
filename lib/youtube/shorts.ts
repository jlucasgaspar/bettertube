const SHORTS_PATH = /^\/shorts\/([^/?#]+)/;

/**
 * The regular watch URL for a Shorts URL, or `null` when the URL is not a Short.
 * Keeps the origin so it works on `www.` and `m.` hosts.
 */
export function shortsToWatchUrl(url: string | URL): string | null {
  const parsed = typeof url === 'string' ? new URL(url) : url;
  const id = SHORTS_PATH.exec(parsed.pathname)?.[1];
  if (!id) return null;
  return `${parsed.origin}/watch?v=${id}`;
}
