import type { ContentScriptContext } from 'wxt/utils/content-script-context';
import {
  createShadowRootUi,
  type ShadowRootContentScriptUiOptions,
} from 'wxt/utils/content-script-ui/shadow-root';
import { selectors, type SelectorKey } from './selectors';
import type { PageType } from './page-type';

export interface MountOptions<TMounted> {
  /** Kebab-case custom element name hosting the shadow root. */
  name: string;
  /** Pages the UI is allowed on. */
  pages: PageType[];
  /** Key into the central selector module. */
  anchor: SelectorKey;
  /** Extra CSS for the shadow root. */
  css?: string;
  append?: ShadowRootContentScriptUiOptions<TMounted>['append'];
  onMount: ShadowRootContentScriptUiOptions<TMounted>['onMount'];
  onRemove?: ShadowRootContentScriptUiOptions<TMounted>['onRemove'];
}

export interface PageMount {
  /** Mount or unmount to match the given page. Safe to call repeatedly. */
  update(pageType: PageType): void;
  /** Unmount and stop observing. */
  dispose(): void;
}

/**
 * Mounts a shadow-root UI next to a YouTube anchor, only on the allowed pages.
 * Waits for the anchor, never mounts twice and removes the UI when the anchor goes away.
 */
export async function createPageMount<TMounted>(
  ctx: ContentScriptContext,
  options: MountOptions<TMounted>,
): Promise<PageMount> {
  const ui = await createShadowRootUi(ctx, {
    name: options.name,
    position: 'inline',
    anchor: selectors[options.anchor],
    css: options.css,
    append: options.append ?? 'last',
    onMount: options.onMount,
    onRemove: options.onRemove,
  });

  let active = false;

  return {
    update(pageType) {
      const allowed = options.pages.includes(pageType);
      if (allowed && !active) {
        ui.autoMount();
        active = true;
      } else if (!allowed && active) {
        ui.remove();
        active = false;
      }
    },
    dispose() {
      if (active) ui.remove();
      active = false;
    },
  };
}
