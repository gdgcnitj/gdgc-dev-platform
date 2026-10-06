# Repository instructions

## Git workflow

- Fetch the latest remote branches before starting a task. Preserve existing local changes.
- Start each new task on a fresh branch from the latest `origin/develop`.
- Name the branch for the work: `feat/`, `fix/`, `chore/`, or `docs/`, plus a short description.
  Examples: `feat/landing-hero`, `fix/mobile-navigation`, `docs/google-design-language`.
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
- Read [the code map](docs/architecture.md) before changing a subsystem.
- Keep credentials in environment variables and never commit local `.env` files.
- Update the related docs when commands, settings, or app behavior change.
- Run `npm run check` and `npm run build` for application changes.
  For workflow or documentation changes, validate the affected files and inspect CI.
- Check Docker Compose changes with `docker compose --env-file .env.example -f compose.dev.yaml config --quiet`.
- Report failed or unavailable checks accurately; do not silently bypass them.
