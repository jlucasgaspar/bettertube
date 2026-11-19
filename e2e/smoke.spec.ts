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

test('Enable is on by default and disables the other switches when off', async ({
  context,
  extensionId,
}) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  const enable = page.getByRole('switch', { name: 'Enable', exact: true });
  await expect(enable).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('switch', { name: 'Block Shorts' })).toBeEnabled();

  await enable.click();
  await expect(enable).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('switch', { name: 'Block Shorts' })).toBeDisabled();
  await expect(page.getByRole('switch', { name: 'Custom Home Page' })).toBeDisabled();
});

test('Custom Home Page reveals its three sections', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options.html#home`);
  const sections = ['Show saved videos', 'Show watch later videos', 'Show saved channels'];
  for (const name of sections) await expect(page.getByRole('switch', { name })).toHaveCount(0);

  await page.getByRole('switch', { name: 'Custom Home Page' }).click();
  for (const name of sections) {
    await expect(page.getByRole('switch', { name })).toHaveAttribute('aria-checked', 'true');
  }
});
