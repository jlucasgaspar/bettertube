import { detectPageType, type PageType } from './page-type';
import { events } from './selectors';

export interface NavigationInfo {
  url: string;
  pageType: PageType;
}

type Listener = (info: NavigationInfo) => void;

function current(): NavigationInfo {
  return { url: location.href, pageType: detectPageType(location.href) };
}

/**
 * Calls `listener` once for the current page and again after every SPA navigation.
 * Returns an unsubscribe function.
 */
export function onNavigate(listener: Listener, target: Document = document): () => void {
  const handler = () => listener(current());
  target.addEventListener(events.navigateFinish, handler);
  listener(current());
  return () => target.removeEventListener(events.navigateFinish, handler);
}
