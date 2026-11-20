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

## Branches and commits

José reviews and commits everything himself, so he controls what enters the repository.

- Every change goes on a new branch (`feat-...`, `fix-...`, `docs-...`) created from an up-to-date `main`.
- **Never commit.** Do not run `git commit`, `git push`, `git merge` or `git rebase`, and do not open or merge a PR. Leave the changes uncommitted in the working tree of the new branch.
- When the work is done, tell José the branch name and list what changed, so he can review the diff and commit by hand.
- Run `pnpm check` before handing off (format, lint, typecheck, tests) and report the result. Never bypass hooks and never disable checks to make them pass.
- Keep the changes in small, single-concern groups of files, so José can split them into Conventional Commits (`feat:`, `fix:`, `docs:`...). Suggest the commit messages when handing off.
- Never mark a task or milestone `done` in `specs.md` on your own. See Workflow.

## Code rules

- TypeScript strict. No `any` without a justified comment.
- All YouTube selectors live in the central selector module. Never inline them.
- Injected UI uses shadow-root mounting to avoid CSS conflicts with YouTube.
- Settings and saved data stay in browser storage. No backend, no external services with user data.
- UI and design decisions go through the `impeccable` skill.
- Use pnpm only.

## Stack

WXT (MV3) · React · TypeScript · pnpm · Tailwind · ESLint · Prettier · Vitest · Playwright. Details in `specs.md`.
