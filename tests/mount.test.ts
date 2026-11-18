// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { ContentScriptContext } from 'wxt/utils/content-script-context';
import { createPageMount } from '../lib/youtube/mount';

const hosts = () => document.querySelectorAll('bettertube-test');

describe('createPageMount', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts once, ignores repeated updates and removes off allowed pages', async () => {
    document.body.innerHTML = '<ytd-page-manager></ytd-page-manager>';
    const ctx = new ContentScriptContext('test');
    const mount = await createPageMount(ctx, {
      name: 'bettertube-test',
      pages: ['home'],
      anchor: 'pageManager',
      onMount: (container) => container.append(document.createElement('span')),
    });

    mount.update('home');
    mount.update('home');
    await expect.poll(() => hosts().length).toBe(1);

    mount.update('watch');
    await expect.poll(() => hosts().length).toBe(0);

    mount.update('home');
    await expect.poll(() => hosts().length).toBe(1);

    mount.dispose();
    expect(hosts().length).toBe(0);
    ctx.notifyInvalidated();
  });
});
