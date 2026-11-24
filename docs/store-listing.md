# Chrome Web Store listing

Draft copy and checklist for the v1.0.0 submission (M9). Locale strings for the name and short description live in `public/_locales/*/messages.json`.

## Short description (max 132 characters)

> A better YouTube on desktop: your own home, no Shorts and fewer recommendations.

## Detailed description

BetterTube gives you control of YouTube on desktop.

- **Your own home page.** Replace the default feed with three sections you choose: videos you saved, your YouTube Watch Later list, and channels you saved.
- **Save button.** Save any video from the watch page, and any channel from its page.
- **No Shorts.** Hide Shorts shelves and the sidebar entry, and optionally open Shorts in the regular player.
- **Fewer recommendations.** Hide suggested videos and end-screen suggestions, or show your saved videos in their place.
- **Light and dark.** Follows your system theme by default.
- **Six languages.** English, Português (Brasil), Español, Français, Italiano, Deutsch.
- **Private.** No accounts, no servers, no tracking. Everything stays in your browser.

Every feature has its own switch, and a master switch turns the whole extension off.

## Category

Productivity

## Single purpose statement

Customize the YouTube desktop experience: personal home page, saved videos and channels, and removal of Shorts and recommendations.

## Permission justifications

| Permission                 | Justification                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `storage`                  | Keep settings and the user's saved videos and channels.                                   |
| Host `*://*.youtube.com/*` | Content scripts add buttons and change the page layout on YouTube. No other site is used. |

## Data disclosure form

- Collects user data: **no**.
- Sells or transfers user data: **no**.
- Remote code: **no**.
- Privacy policy URL: `https://jlucasgaspar.github.io/bettertube/privacy-policy/` (GitHub Pages, served from `docs/` on `main`).

## Assets checklist

- [x] Icons 16, 32, 48, 96, 128 (`public/icon`)
- [ ] Screenshots, 1280x800 or 640x400, 1 to 5: custom home, save button, options page (light and dark)
- [ ] Small promo tile 440x280
- [ ] Optional marquee 1400x560
- [ ] Privacy policy hosted at a public URL

## Release checklist

- [x] Ad handling removed from 1.0.0, so no ad policy risk (see specs.md, Ads section)
- [ ] Bump `version` in `package.json` to `1.0.0`
- [ ] `pnpm check`, `pnpm build`, `pnpm budget`, `pnpm test:e2e`
- [ ] `pnpm zip` and upload to the Developer Dashboard
- [ ] Tag `v1.0.0`
