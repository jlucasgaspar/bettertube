import { test, expect } from './fixtures';

test('popup renders the quick toggles', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.getByRole('heading', { name: 'BetterTube' })).toBeVisible();
  await expect(page.getByRole('switch')).toHaveCount(5);
});

test('a toggle persists after reload and syncs to the popup', async ({ context, extensionId }) => {
  const options = await context.newPage();
  await options.goto(`chrome-extension://${extensionId}/options.html#shorts`);
  const hide = options.getByRole('switch', { name: 'Block Shorts' });
  await expect(hide).toHaveAttribute('aria-checked', 'false');
  await hide.click();
  await expect(hide).toHaveAttribute('aria-checked', 'true');

  await options.reload();
  await expect(options.getByRole('switch', { name: 'Block Shorts' })).toHaveAttribute(
    'aria-checked',
    'true',
  );

  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(popup.getByRole('switch', { name: 'Block Shorts' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
});

test('language and theme switch live', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options.html#general`);
  await page.getByLabel('Language').selectOption('pt_BR');
  await expect(page.getByRole('heading', { name: 'Geral' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

  await page.getByLabel('Tema').selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('saved videos: list, reorder, remove, export and import', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options.html#saved`);
  await expect(page.getByText('Nothing saved yet')).toBeVisible();

  const video = (id: string) => ({
    id,
    title: `Video ${id}`,
    channel: 'Channel',
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    savedAt: 1_700_000_000_000,
  });
  const list = [video('aaaaaaaaaaa'), video('bbbbbbbbbbb')];
  await page.evaluate((videos) => {
    const { chrome } = globalThis as unknown as {
      chrome: { storage: { local: { set(items: object): Promise<void> } } };
    };
    return chrome.storage.local.set({ savedVideos: videos });
  }, list);

  const rows = page.getByRole('listitem');
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toContainText('Video aaaaaaaaaaa');

  await page.getByRole('button', { name: 'Move down: Video aaaaaaaaaaa' }).click();
  await expect(rows.first()).toContainText('Video bbbbbbbbbbb');

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const exported = await (await download).path();

  await page.getByRole('button', { name: 'Remove: Video bbbbbbbbbbb' }).click();
  await expect(rows).toHaveCount(1);

  await page.locator('input[type=file]').setInputFiles(exported);
  await expect(rows).toHaveCount(2);
  await expect(page.getByRole('status')).toContainText('1 added');
});

test('the Save button has its own switch, independent from the home', async ({
  context,
  extensionId,
}) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options.html#general`);
  const save = page.getByRole('switch', { name: 'Save button on videos' });
  await expect(save).toHaveAttribute('aria-checked', 'true');
  await save.click();
  await expect(save).toHaveAttribute('aria-checked', 'false');

  await page.goto(`chrome-extension://${extensionId}/options.html#home`);
  await expect(page.getByRole('switch', { name: 'Home with my saved videos' })).toHaveAttribute(
    'aria-checked',
    'false',
  );
});
