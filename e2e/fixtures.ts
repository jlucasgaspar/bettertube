import { test as base, chromium, type BrowserContext } from '@playwright/test';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const extensionPath = path.resolve(import.meta.dirname, '../.output/chrome-mv3');

export const test = base.extend<{ context: BrowserContext; extensionId: string }>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, provide) => {
    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bettertube-e2e-'));
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chromium',
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
    });
    await provide(context);
    await context.close();
    fs.rmSync(userDataDir, { recursive: true, force: true });
  },
  extensionId: async ({ context }, provide) => {
    let [worker] = context.serviceWorkers();
    worker ??= await context.waitForEvent('serviceworker');
    await provide(new URL(worker.url()).host);
  },
});

export const expect = test.expect;
