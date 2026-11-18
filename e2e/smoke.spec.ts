import { test, expect } from './fixtures';

test('popup renders the quick toggles', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.getByRole('heading', { name: 'BetterTube' })).toBeVisible();
  await expect(page.getByRole('switch')).toHaveCount(4);
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
