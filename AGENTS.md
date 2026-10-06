# Repository instructions

## Branches

- Use the temporary `main` flow until the user enables the `develop` flow.
- Fetch the remote branches before you start a task.
- Preserve existing local changes.
- Start each task from the latest `origin/main` on a new branch.
- Name agent branches `codex/<type>-<task>`, for example `codex/fix-mobile-navigation`.
- Open task PRs with `main` as the base branch.
- Leave PR merging to the user unless the user requests a merge.
- Continue an open PR on its existing branch.
- Do not reuse a merged task branch for a new task.
- Do not push task changes directly to `main` or `develop`.
- Keep `develop` for the future integration flow.
- Change repository settings or enable the future flow only when the user requests it.

## Project rules

- Keep server auth and database code out of client components.
- Use existing UI components and the `@/` import alias where applicable.
- Read [the code map](docs/architecture.md) before you change a subsystem.
- Keep secrets in environment variables.
- Update the related docs when you change commands, settings, or app behavior.
- Run `npm run check` and `npm run build` before you open a PR.
- Check Docker Compose changes with `docker compose --env-file .env.example -f compose.dev.yaml config --quiet`.
- Report check failures and checks that you could not run.

## Writing

- Follow [the writing rules](docs/writing.md) for docs and PR text.
- Use short sentences, active voice, and one term for each technical concept.
- State the problem, change, and check results in each PR.
- Use the Conventional Commit form for commit messages and PR titles.
