# AGENTS.md

Instructions for AI coding agents working on BetterTube. `CLAUDE.md` is a symlink to this file.

## Workflow

- **Always read `specs.md` first.** Work only on the milestone José asked for.
- **Always keep the progress tracker in `specs.md` up to date** (milestone table and task checkboxes).
- **Never mark anything `done` without asking José first.** Propose it, wait for confirmation.
- Milestones run one at a time, on request.

## Language

- Code, comments, commit messages and docs: English.
- Chat with José: Brazilian Portuguese (keep technical terms in English).
- Extension UI strings go through i18n (`en`, `pt_BR`, `es`, `fr`, `it`, `de`). No hardcoded user-facing text.

## Commits

- Run `pnpm check` before every commit (format, lint, typecheck, tests).
- Never bypass hooks (`--no-verify`) and never disable checks to make them pass.
- Conventional Commits. Small commits, one concern each.

## Code rules

- TypeScript strict. No `any` without a justified comment.
- All YouTube selectors live in the central selector module. Never inline them.
- Injected UI uses shadow-root mounting to avoid CSS conflicts with YouTube.
- Settings and saved data stay in browser storage. No backend, no external services with user data.
- UI and design decisions go through the `impeccable` skill.
- Use pnpm only.

## Stack

WXT (MV3) · React · TypeScript · pnpm · Tailwind · ESLint · Prettier · Vitest · Playwright. Details in `specs.md`.
