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
| M3        | Save videos               | todo   |
| M4        | Custom home               | todo   |
| M5        | Shorts blocking           | todo   |
| M6        | Recommendations control   | todo   |
| M7        | Ad handling               | todo   |
| M8        | Polish & release          | todo   |

Milestones are executed one at a time, only when José asks.

---

## Product goals

- Replace the default YouTube home with a personal one: videos saved via BetterTube + YouTube "Watch Later".
- Block Shorts and recommendations on demand.
- Block ads, or mute and auto-skip as fallback.
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

Layered, each layer toggleable:

1. `declarativeNetRequest` rules for known ad/tracking endpoints.
2. MAIN-world script stripping `adPlacements` / `playerAds` from the player response (most effective, most brittle).
3. Fallback: detect `.ad-showing`, mute, speed up, click "Skip ad" when available, restore player state after.

Risks: YouTube anti-adblock detection and Chrome Web Store policy. Revisit before M8.

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

- [ ] "Save to BetterTube" button in the watch page action bar (toggle state)
- [ ] Saved videos stored in `storage.local` (id, title, channel, thumbnail, savedAt)
- [ ] Manage list in options: remove, reorder, export/import JSON

Acceptance: save/unsave works across navigation and reloads; export then import restores the list.

### M4 — Custom home

**Goal:** replace the default home feed.

Tasks:

- [ ] Hide default home feed (option)
- [ ] Section 1: BetterTube saved videos
- [ ] Section 2: YouTube Watch Later via adapter (see decisions)
- [ ] Loading, empty and error states; graceful fallback when the adapter breaks
- [ ] Videos open natively (SPA navigation preserved)

Acceptance: home shows both sections when enabled; disabling the option restores stock YouTube.

### M5 — Shorts blocking

Tasks:

- [ ] Hide Shorts shelves on home/search/subscriptions
- [ ] Hide Shorts entry in sidebar
- [ ] Optional redirect `/shorts/ID` → `/watch?v=ID`

Acceptance: each toggle works independently, no layout gaps left behind.

### M6 — Recommendations control

Tasks:

- [ ] Hide watch-page recommendations and end-screen suggestions
- [ ] Optional: show saved videos in place of recommendations

Acceptance: toggle works on watch page, no layout breakage in theater/fullscreen.

### M7 — Ad handling

Tasks:

- [ ] Layer 1: `declarativeNetRequest` rules
- [ ] Layer 2: player-response stripping (MAIN world)
- [ ] Layer 3: mute + auto-skip fallback
- [ ] Per-layer toggles and an "ads handled" counter

Acceptance: with all layers off, stock behavior; each layer verifiable on its own.

### M8 — Polish & release

Tasks:

- [ ] Accessibility pass (keyboard, contrast, ARIA)
- [ ] Performance budget (content script cost, bundle size)
- [ ] impeccable audit/polish pass
- [ ] Store assets, screenshots, privacy policy
- [ ] Chrome Web Store submission, v1.0.0

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
- Docs site built with MDX
