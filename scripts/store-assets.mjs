// Generates the Chrome Web Store images into `store-assets/`. Run after `pnpm build`:
//   pnpm store-assets
// Loads the built extension in a real Chromium window, seeds it with sample data (open-licensed
// Blender Foundation films) and takes the screenshots. Needs network access to youtube.com.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const extensionPath = path.resolve(import.meta.dirname, '../.output/chrome-mv3');
const outDir = path.resolve(import.meta.dirname, '../store-assets');
fs.mkdirSync(outDir, { recursive: true });

const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const day = 86_400_000;
const now = Date.now();
const videos = [
  ['aqz-KE-bpKQ', 'Big Buck Bunny', 'Blender'],
  ['eRsGyueVLvQ', 'Sintel - Open Movie by Blender Foundation', 'Blender'],
  ['R6MlUcmOul8', 'Tears of Steel - Blender VFX Open Movie', 'Blender'],
  ['TLkA0RELQ1g', 'Elephants Dream', 'Blender'],
  ['mN0zPOpADL4', 'Spring - Blender Open Movie', 'Blender'],
  ['Z4C82eyhwgU', 'Cosmos Laundromat - Blender Open Movie', 'Blender'],
].map(([id, title, channel], index) => ({
  id,
  title,
  channel,
  thumbnail: thumb(id),
  savedAt: now - index * day,
}));
const channelSeeds = [
  { id: '@blender', name: 'Blender', savedAt: now },
  { id: '@NASA', name: 'NASA', savedAt: now - day },
  { id: '@veritasium', name: 'Veritasium', savedAt: now - 2 * day },
];
let channels = [];

const settings = (extra = {}) => ({
  locale: 'en',
  theme: 'system',
  enabled: true,
  home: {
    enabled: true,
    showSaved: true,
    showWatchLater: false,
    showChannels: true,
    showPlaylists: false,
  },
  shorts: { enabled: true, redirectToWatch: false },
  recommendations: { enabled: true, showSaved: false },
  ...extra,
});

// The promo images use the same Barlow 700 the extension ships.
const barlowName = fs
  .readdirSync(path.join(extensionPath, 'assets'))
  .find((name) => /barlow-latin-700-normal.*\.woff2$/.test(name));
if (!barlowName) throw new Error('Barlow 700 not found in the build. Run `pnpm build` first.');
const barlow = fs.readFileSync(path.join(extensionPath, 'assets', barlowName)).toString('base64');

const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bettertube-store-'));
const context = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chromium',
  viewport: { width: 1280, height: 800 },
  args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
});

try {
  let [worker] = context.serviceWorkers();
  worker ??= await context.waitForEvent('serviceworker');
  const base = `chrome-extension://${new URL(worker.url()).host}`;

  const seed = async (value) => {
    const page = await context.newPage();
    await page.goto(`${base}/options.html`);
    await page.evaluate(
      async ({ value, videos, channels }) => {
        const { chrome } = globalThis;
        await chrome.storage.sync.set({ settings: value });
        await chrome.storage.local.set({ savedVideos: videos, savedChannels: channels });
      },
      { value, videos, channels },
    );
    await page.close();
  };
  const shot = (page, name) => page.screenshot({ path: path.join(outDir, name) });

  // Real avatars, read from each channel page, so the saved channels look like they do for users.
  const avatarPage = await context.newPage();
  channels = [];
  for (const channel of channelSeeds) {
    await avatarPage.goto(`https://www.youtube.com/${channel.id}`, {
      waitUntil: 'domcontentloaded',
    });
    const avatar = await avatarPage
      .locator(
        'yt-page-header-renderer yt-decorated-avatar-view-model img[src^="http"], ytd-c4-tabbed-header-renderer #avatar img[src^="http"]',
      )
      .first()
      .getAttribute('src', { timeout: 30_000 });
    console.log(channel.id, avatar?.slice(0, 60));
    channels.push({ ...channel, avatar: avatar ?? '' });
  }
  await avatarPage.close();

  // 1: the custom home, in YouTube's light and dark themes (YouTube reads a cookie, not the OS).
  for (const dark of [false, true]) {
    await context.clearCookies();
    if (dark) {
      await context.addCookies([
        { name: 'PREF', value: 'f6=400&tz=UTC', domain: '.youtube.com', path: '/' },
      ]);
    }
    await seed(settings());
    const page = await context.newPage();
    await page.goto('https://www.youtube.com/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Saved videos' }).waitFor({ timeout: 30_000 });
    await page.waitForTimeout(2500);
    await shot(page, `01-custom-home-${dark ? 'dark' : 'light'}.png`);
    await page.close();
  }
  await context.clearCookies();

  // 3: the Save button on a watch page.
  await seed(settings());
  const watch = await context.newPage();
  await watch.goto('https://www.youtube.com/watch?v=SkVqJ1SGeL0', {
    waitUntil: 'domcontentloaded',
  });
  await watch
    .getByRole('button', { name: 'Save to BetterTube' })
    .first()
    .waitFor({ timeout: 30_000 });
  // Let the video run a moment so the frame is not black, then pause it.
  await watch.evaluate(async () => {
    const video = document.querySelector('video');
    if (!video) return;
    video.muted = true;
    await video.play().catch(() => undefined);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    video.pause();
  });
  await watch.waitForTimeout(1000);
  await shot(watch, '02-save-button.png');
  await watch.close();

  // 4 and 5: the options page, both themes.
  for (const theme of ['light', 'dark']) {
    await seed(settings({ theme }));
    const page = await context.newPage();
    await page.goto(`${base}/options.html#home`);
    await page.waitForTimeout(600);
    await shot(page, `03-options-${theme}.png`);
    await page.close();
  }

  // 6: the popup, enlarged on a plain ground so it reads at store size.
  await seed(settings({ theme: 'light' }));
  const popup = await context.newPage();
  await popup.goto(`${base}/popup.html`);
  await popup.waitForTimeout(600);
  await popup.addStyleTag({
    content: 'html{background:#faf8f7}body{zoom:1.2;width:22.5rem;margin:1rem auto 0}',
  });
  await shot(popup, '04-popup.png');
  await popup.close();

  // Promo images, drawn from the same tokens as the extension.
  const promo = async (name, width, height, scale) => {
    const page = await context.newPage();
    await page.setViewportSize({ width, height });
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      @font-face{font-family:Barlow;font-weight:700;src:url(data:font/woff2;base64,${barlow}) format('woff2')}
      *{box-sizing:border-box;margin:0}
      body{width:${width}px;height:${height}px;display:flex;align-items:center;justify-content:center;gap:${24 * scale}px;
        padding:0 ${24 * scale}px;background:#131110;color:#f2eeec;font-family:Barlow,system-ui,sans-serif}
      svg{width:${96 * scale}px;height:${96 * scale}px;flex:none}
      h1{font-size:${56 * scale}px;line-height:1;font-weight:700;letter-spacing:-0.025em}
      p{margin-top:${12 * scale}px;font-size:${22 * scale}px;line-height:1.2;color:#a8a09d}
    </style>
    <svg viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#d93a22"/>
      <path d="M64 16L104 30V62C104 86 88 102 64 112C40 102 24 86 24 62V30Z" fill="#fff"/>
      <path d="M54 46v36l30-18z" fill="#d93a22"/></svg>
    <div><h1>BetterTube</h1><p>Your own YouTube home.</p></div>`);
    await page.evaluate(() => document.fonts.ready);
    await shot(page, name);
    await page.close();
  };
  await promo('promo-tile-440x280.png', 440, 280, 0.8);
  await promo('promo-marquee-1400x560.png', 1400, 560, 1.8);
} finally {
  await context.close();
  fs.rmSync(userDataDir, { recursive: true, force: true });
}
