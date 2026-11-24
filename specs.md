# BetterTube — Specs

> Chrome extension for an enhanced YouTube experience on desktop.
> This file is the source of truth for scope, decisions and progress. Read it before doing any work.

## Progress tracker

Status values: `todo` · `in-progress` · `done`.
**Rule:** an agent may propose `done`, but only José can confirm it. Ask before changing any item to `done`.

| Milestone | Title                     | Status |
| --------- | ------------------------- | ------ |
| M0        | Foundation                | done   |
| M1        | Settings core             | done   |
| M2        | YouTube integration layer | done   |
| M3        | Save videos               | done   |
| M4        | Custom home               | done   |
| M5        | Shorts blocking           | done   |
| M6        | Recommendations control   | done   |
| M7        | Ad handling (removed)     | done   |
| M8        | Polish                    | done   |
| M9        | Release                   | todo   |

Milestones are executed one at a time, only when José asks.

---

## Product goals

- A master "Enable" switch (on by default on first install) gates the whole extension. When off, YouTube is stock.
- Replace the default YouTube home with a personal one ("Custom Home Page"), with three independent sections: videos saved via BetterTube, YouTube "Watch Later", and channels saved via BetterTube.
- Block Shorts and recommendations on demand.
- Highly customizable, all settings stored locally in the browser. No backend, no accounts.
- Internationalized: English, Portuguese (pt-BR), Spanish, French, Italian, German.
- Light/dark theme, defaulting to the Chrome/OS color scheme.

## Technical decisions

### Stack

- **WXT** (MV3, Vite-based) + **React 19** + **TypeScript** (strict) + **pnpm**.
- **Tailwind CSS v4** for the popup and options page, with own-styled native controls (`role="switch"` button, `<select>`, `<a>` nav). Decision (M1): no shadcn/Radix for now. The impeccable "Projection Leader" direction asks for standard controls with a custom skin, the surfaces are small, and fewer dependencies keep the extension light. Radix or shadcn can be added later when a complex widget is needed (dialog, popover, combobox). Icons: `lucide-react`. Font: Barlow (self-hosted via `@fontsource`). The **impeccable** skill drives the visual direction (`DESIGN.md`, `PRODUCT.md`).
- UI injected into youtube.com is mounted with WXT `createShadowRootUi` for CSS isolation. Portals (dialogs, popovers) must target the shadow root.

### Tooling

- ESLint (flat config, `typescript-eslint`, `react-hooks`), Prettier, `tsc --noEmit`.
- Vitest (unit) and Playwright (e2e, loading the unpacked extension).
- Pre-commit hooks via lefthook (or husky + lint-staged): format check, lint, typecheck, unit tests. `commit-msg` hook enforces Conventional Commits (commitlint).
- Single entry point: `pnpm check` runs format check + lint + typecheck + unit tests.
- Docs stay `.md` (GitHub and agent tooling expect it). MDX is reserved for a possible docs site (backlog).

### Loop engineering

Every milestone lists acceptance criteria and verification commands so an agent loop (`/loop` or Ralph-style) can iterate until everything is green. M0 researches and documents the loop protocol before feature work starts.

### Storage

- `chrome.storage.sync` for small settings (quota ~100 KB).
- `chrome.storage.local` for saved videos.
- Typed wrapper (WXT `storage`) with a versioned schema and migrations.

### i18n

`_locales` with `en`, `pt_BR`, `es`, `fr`, `it`, `de`. Default from browser locale, overridable in options.

### Theme

`system` (default, follows `prefers-color-scheme`), `light`, `dark`.

### YouTube Watch Later access

Feasible without OAuth. The content script runs on youtube.com with the user's session:

- Fetch `/playlist?list=WL` and parse `ytInitialData`, or
- Call InnerTube `youtubei/v1/browse` with `browseId: "VLWL"` using keys from `ytcfg`.

The official Data API v3 no longer exposes Watch Later. Risk: unofficial endpoints can change. Isolate behind an adapter with a clear fallback state in the UI.

### Ads

Out of scope for 1.0.0. The M7 ad handling code (request blocking, player-response stripping, mute and auto-skip, feed ad hiding, counter) was removed before release: it adds Chrome Web Store policy risk and conflicts with the YouTube Terms of Service, and the author uses YouTube Premium. It can come back later as its own milestone; see git history of M7.

### YouTube SPA handling

Listen to `yt-navigate-finish` plus a MutationObserver. All YouTube selectors live in one module so breakage fixes touch one file.

---

## Milestones

### M0 — Foundation

**Goal:** working empty extension with full quality tooling.

Tasks:

- [x] Scaffold WXT + React + TypeScript strict with pnpm
- [x] ESLint, Prettier, `tsc --noEmit`
- [x] Vitest and Playwright (extension e2e smoke test)
- [x] lefthook pre-commit + commitlint
- [x] `pnpm check` script
- [x] GitHub Actions CI running `pnpm check`
- [x] Loop-engineering protocol doc (research + write-up)
- [x] Decide license (MIT)

Acceptance: `pnpm check` green; `pnpm build` produces a loadable extension; a bad commit is blocked by hooks.

### M1 — Settings core

**Goal:** settings infrastructure and the extension's own UI shell.

Tasks:

- [x] Typed storage layer with versioned schema and migrations
- [x] Feature-flag/settings model for all planned options
- [x] Options page and popup shell
- [x] Component library decision + setup (shadcn/ui or alternative)
- [x] i18n infrastructure with the 6 locales
- [x] Theme: system / light / dark
- [x] `DESIGN.md` via impeccable skill

Acceptance: settings persist across reloads, locale and theme switch live, unit tests for storage and migrations.

### M2 — YouTube integration layer

**Goal:** reliable foundation to hook into YouTube pages.

Tasks:

- [x] Content script bootstrap on youtube.com
- [x] SPA navigation handling (`yt-navigate-finish`)
- [x] Central selector module
- [x] Shadow-root UI mounting helper
- [x] Page-type detection (home, watch, search, shorts, channel)

Acceptance: a test component mounts and survives SPA navigation without duplicates or leaks.

### M3 — Save videos

**Goal:** save videos with a button next to Like.

Tasks:

- [x] "Save to BetterTube" button in the watch page action bar (toggle state)
- [x] Saved videos stored in `storage.local` (id, title, channel, thumbnail, savedAt)
- [x] Manage list in options: remove, reorder, export/import JSON

Acceptance: save/unsave works across navigation and reloads; export then import restores the list.

### M4 — Custom home

**Goal:** replace the default home feed.

Tasks:

- [x] Master `enabled` setting (default `true`), replacing the "Save button on videos" flag. Needs a storage schema migration (drop the old flag, add `enabled`). The popup shows an "Enable" switch in its place and the options page follows. Content scripts mount nothing and apply no feature when `enabled` is `false`. (Touches M1/M3 code; those milestones stay `done`.)
- [x] "Save channel to BetterTube" button on the channel page, next to the Subscribe button (toggle state)
- [x] Saved channels stored in `storage.local` (id = `@handle` or `channel/UC...`, name, avatar, savedAt), with a manage list in options (remove, reorder, export/import JSON)
- [x] "Custom Home Page" option (replaces "Home with my saved videos"); hides the default home feed when on
- [x] When "Custom Home Page" is on, the popup and options reveal three sub-options: "Show saved videos", "Show watch later videos", "Show saved channels"
- [x] Section 1: BetterTube saved videos
- [x] Section 2: YouTube Watch Later via adapter (see decisions)
- [x] Section 3: BetterTube saved channels (data from M3)
- [x] Loading, empty and error states; graceful fallback when the adapter breaks

Acceptance: toggling `enabled` off removes all injected UI without a reload and the migration is unit tested; save/unsave of channels survives navigation and reloads; home shows each enabled section independently; disabling "Custom Home Page" restores stock YouTube.

### M5 — Shorts blocking

Tasks:

- [x] Hide Shorts shelves on home/search/subscriptions
- [x] Hide Shorts entry in sidebar
- [x] Optional redirect `/shorts/ID` → `/watch?v=ID`

Acceptance: each toggle works independently, no layout gaps left behind.

### M6 — Recommendations control

Tasks:

- [x] Hide watch-page recommendations and end-screen suggestions
- [x] Optional: show saved videos in place of recommendations

Acceptance: toggle works on watch page, no layout breakage in theater/fullscreen.

### M7 — Ad handling (removed before 1.0.0)

Built, then removed in branch `feat-remove-ads-handling` so the Chrome Web Store release does not ship ad blocking. The tasks below were completed and later reverted. Recover them from git history if the feature returns.

Tasks:

- [x] Layer 1: `declarativeNetRequest` rules
- [x] Layer 2: player-response stripping (MAIN world)
- [x] Layer 3: mute + auto-skip fallback
- [x] Hide feed ads (banners, sponsored cards) by CSS, own toggle under the ads switch
- [x] Per-layer toggles and an "ads handled" counter

### M8 — Polish

Tasks:

- [x] Accessibility pass (keyboard, contrast, ARIA). Contrast tokens locked by `tests/contrast.test.ts`; dark `--line-strong` raised to `#787070` (control borders were 2.9:1 on surface).
- [x] Performance budget (content script cost, bundle size): `pnpm budget` checks the build against limits in `scripts/check-budget.mjs`.
- [x] impeccable audit pass (no blockers)
- [x] impeccable polish pass (Ads counter title size fixed; popup and options checked in light/dark, en/de, desktop and mobile)

### M9 — Release

Tasks:

- [x] Ad handling policy risk: resolved by removing ad handling from 1.0.0 (see Ads section)
- [ ] Store assets: screenshots (1280x800), small promo tile (440x280), optional marquee. Listing copy is drafted in `docs/store-listing.md`
- [x] Privacy policy: text is in `docs/privacy-policy.md`; host it at a public URL
- [x] Bump `version` to `1.0.0`, run `pnpm check`, `pnpm build`, `pnpm budget`, `pnpm test:e2e`
- [ ] Chrome Web Store submission and `v1.0.0` tag

---

## Feature ideas (backlog)

Not scheduled. Promote to a milestone when José approves.

- Focus mode: hide comments, end cards, sidebar
- Default playback speed (global and per channel)
- SponsorBlock-style segment skipping (public API)
- Disable autoplay
- Force theater mode / default quality
- Hide already-watched videos
- Progress bars on saved videos
- Keyboard shortcuts (save video, toggle features)
- Channel blocklist
- Time-spent tracker and optional daily limit
- Return dislike count (public API)
- Tags or folders for saved videos
- Sync saved list across devices (`storage.sync` subset or file-based)
- Settings export/import
- Custom home: open videos and channels without a full page reload. Cards are plain links today (full navigation). Needs a MAIN-world bridge to YouTube's router. Moved out of M4.
- Docs site built with MDX
