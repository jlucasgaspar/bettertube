import { createRoot } from 'react-dom/client';
import { SAVE_BUTTON_CSS, SaveButton } from '../../components/save-button';
import { getSettings, watchSettings } from '../../lib/settings';
import { createPageMount } from '../../lib/youtube/mount';
import { onNavigate } from '../../lib/youtube/navigation';
import type { PageType } from '../../lib/youtube/page-type';

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  async main(ctx) {
    const saveButton = await createPageMount(ctx, {
      name: 'bettertube-save-button',
      pages: ['watch'],
      anchor: 'watchActions',
      css: SAVE_BUTTON_CSS,
      // Right after Like, so it reads as part of the same group.
      append: (anchor, root) => {
        const like = anchor.firstElementChild;
        if (like) like.after(root);
        else anchor.append(root);
      },
      onMount: (container) => {
        const root = createRoot(container);
        root.render(<SaveButton />);
        return root;
      },
      onRemove: (root) => root?.unmount(),
    });

    // The button needs both: the setting on and a page that allows it.
    let pageType: PageType = 'other';
    let enabled = (await getSettings()).saveButton.enabled;
    const apply = () => saveButton.update(enabled ? pageType : 'other');

    const stopNavigation = onNavigate((info) => {
      pageType = info.pageType;
      apply();
    });
    const stopSettings = watchSettings((settings) => {
      enabled = settings.saveButton.enabled;
      apply();
    });
    ctx.onInvalidated(() => {
      stopNavigation();
      stopSettings();
      saveButton.dispose();
    });
  },
});
