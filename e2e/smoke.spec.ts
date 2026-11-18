import { test, expect } from './fixtures';

test('extension loads and popup renders', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator('#root')).not.toBeEmpty();
});
