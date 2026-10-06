# Repository instructions

## Git workflow

- Fetch the latest remote branches before starting a task. Preserve existing local changes.
- Start each new task on a fresh branch from the latest `origin/develop`.
- Use `codex/<type>-<short-description>` for agent branches, such as
  `codex/feat-homepage-redesign` or `codex/fix-mobile-navigation`.
- Continue follow-up work for an open PR on its existing branch. Do not reuse a
  merged task branch for a new task.
- Commit focused changes, push the task branch, and open PRs with base `develop`.
- Validate and review the diff before merging into `develop` when authorized.
- Never push task changes directly to `develop` or `main`.
- `main` is production. Release PRs must come from this repository's `develop`.
  Merge into `main`, tag a release, or deploy only when the user requests a release.
- Follow the release and synchronization steps in `CONTRIBUTING.md`. Never delete
  `develop` or `main` while cleaning up a task branch.

## Project conventions

- This is a Next.js App Router app using TypeScript, Tailwind CSS, Drizzle, and Better Auth.
- Keep server-only auth and database code out of client components.
- Reuse existing UI primitives and the `@/` import alias where appropriate.
- Keep credentials in environment variables and never commit local `.env` files.
- Run `npm run lint`, `npm run typecheck`, and `npm run build` for application changes.
  For workflow or documentation changes, validate the affected files and inspect CI.
- Report failed or unavailable checks accurately; do not silently bypass them.
