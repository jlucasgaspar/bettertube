import type { SavedChannel } from '../saved-channels';
import { selectors } from './selectors';

const CHANNEL_PATH = /^\/(@[^/]+|(?:channel|c|user)\/[^/]+)/;

/** `@handle` or `channel/UC...` for a channel page URL, undefined for any other page. */
export function currentChannelId(url: string = location.href): string | undefined {
  return CHANNEL_PATH.exec(new URL(url).pathname)?.[1];
}

/** Read what the channel header shows. Missing pieces fall back to page metadata, then to the id. */
export function readChannel(id: string, doc: Document = document, now = Date.now()): SavedChannel {
  const meta = (property: string) =>
    doc.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)?.content.trim() ?? '';
  const name =
    doc.querySelector(selectors.channelName)?.textContent?.trim() || meta('og:title') || id;
  const avatar =
    doc.querySelector<HTMLImageElement>(selectors.channelAvatar)?.src || meta('og:image');
  return { id, name, avatar, savedAt: now };
}
