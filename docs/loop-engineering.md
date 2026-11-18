# Loop engineering protocol

Loop engineering means designing the system that prompts, verifies, retries and stops a coding agent, instead of prompting it by hand each time. This document defines how BetterTube milestones are run in a loop.

## Principles

1. **Verification is the backpressure.** An agent iterates until objective gates pass. In this repo the gates are `pnpm check` (format, lint, typecheck, unit tests), `pnpm build`, and `pnpm test:e2e`.
2. **Every milestone is loop-ready.** Each milestone in [specs.md](../specs.md) has tasks and acceptance criteria that can be checked by a command or a clear observation.
3. **Always a stop condition.** A loop stops when all acceptance criteria pass, or after a bounded number of iterations without progress. Never run unbounded.
4. **Humans own "done".** The agent proposes `done`; José confirms (see [AGENTS.md](../AGENTS.md)). This avoids verification debt: tests only catch what they were written to catch.
5. **Small steps.** One task per iteration, one Conventional Commit per task, so each iteration is reviewable and revertible.

## Loop shape

Each iteration:

1. Read `specs.md`, pick the next unchecked task of the current milestone.
2. Implement only that task.
3. Run the gates: `pnpm check`, plus `pnpm build` and `pnpm test:e2e` when behavior in the browser changed.
4. If gates fail, fix and re-run. If the same failure repeats 3 times, stop and report instead of retrying blindly.
5. If gates pass, update the task checkbox in `specs.md` and commit.
6. When all tasks are checked, stop and ask José to confirm `done`.

## Tooling

- Claude Code `/loop` for self-paced iteration, or a Stop-hook based Ralph loop for longer runs.
- Git hooks (lefthook) run `pnpm check` on commit and commitlint on the message, so a loop cannot commit broken code.
- CI runs the same gates on every push and PR.

## Guardrails

- Never use `--no-verify`, never weaken a check to make it pass.
- Cap iterations and token budget per run; parallel agents multiply cost fast.
- Loops must not touch files outside the current milestone's scope.

## References

- [Loop Engineering (Tessl)](https://tessl.io/patterns/agentic-development-workflow/loop-engineering/)
- [Practical Loop Engineering (Addy Osmani)](https://addyosmani.com/blog/practical-loop-engineering/)
- [What is a Ralph loop (kingy.ai)](https://kingy.ai/news/what-is-a-ralph-loop-how-a-bash-one-liner-became-an-ai-coding-pattern/)
- [Loop engineering: new idea or old? (The Nuanced Perspective)](https://thenuancedperspective.substack.com/p/loop-engineering-new-idea-or-old)
