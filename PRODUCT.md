# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing codebase: WXT (Manifest V3) + React 19 + TypeScript + Tailwind CSS. See `specs.md`.

## Users

Heavy YouTube users on desktop Chrome (including the author) who spend a lot of time on the site and want less noise (Shorts, recommendations) and a home page they control. They use the extension in two places: a toolbar popup for quick toggles, and an options page for the full set of settings and the saved-videos list.

## Product Purpose

BetterTube is a Chrome extension for an enhanced YouTube experience on desktop. It replaces the default YouTube home with the user's own: videos saved through a BetterTube button plus the native "Watch Later" list. It also blocks Shorts, and blocks recommendations. Success: the user opens YouTube and sees only what they chose to see.

## Positioning

A personal, curated home page built from the user's own saved videos and native Watch Later, combined with per-feature switches for noise blockers. All data stays local, no account and no backend.

## Operating Context

- Runs on desktop Chrome only (Manifest V3), injected into youtube.com and shown in a toolbar popup and options page.
- Settings persist in browser storage (`chrome.storage`), no sync service.
- Injected UI lives in a shadow root so it must coexist with YouTube's own styles and its light/dark themes.
- Locales: English, Portuguese (pt-BR), Spanish, French, Italian, German.
- Theme: light, dark, or system (initial value follows Chrome/OS color scheme).

## Capabilities and Constraints

- Planned features, milestone by milestone, are tracked in `specs.md` (save button, custom home, Shorts block, recommendations block).
- Watch Later access relies on unofficial YouTube endpoints and may break; UI must handle error and fallback states.
- Every user-facing string must go through i18n; layouts must tolerate long German/French strings.
- Public repository, MIT licensed. Not affiliated with YouTube or Google.

## Brand Commitments

Name: BetterTube. Color (confirmed by the user): a red-orange accent between YouTube red and Claude terracotta; dark theme truly dark, light theme truly light with red details, no beige or gold. No logo or brand assets exist yet. Posture: a discreet utility that feels native to YouTube and Chrome, quick to scan, with brand showing in precise details rather than loud identity.

## Evidence on Hand

No screenshots, users, testimonials or metrics yet. Do not fabricate any.

## Product Principles

1. The user is in control: every feature is an independent toggle and defaults are conservative.
2. Local and private: no account, no backend, no data leaves the browser.
3. Native feel: the extension should read as part of YouTube/Chrome, not as a foreign overlay.
4. Fails soft: when YouTube changes and something breaks, the page falls back to stock YouTube instead of showing a broken UI.
5. Fast to scan: settings are understandable at a glance in any of the six languages.

## Accessibility & Inclusion

Keyboard operable, visible focus, sufficient contrast in both themes, respects `prefers-reduced-motion`. Six locales with correct pluralization and text expansion.
