# Contributing

## Current branch flow

Task PRs target `main` during the setup period.
The user merges these PRs.
The `develop` branch remains available for the future integration flow.

1. Fetch the remote branches:

   ```sh
   git fetch --all --tags
   ```

2. Update the local `main` branch:

   ```sh
   git switch main
   git pull --ff-only origin main
   ```

3. Create a branch with a clear task name:

   ```sh
   git switch -c codex/feat-homepage-redesign
   ```

4. Make the changes.
5. Run the checks:

   ```sh
   npm run check
   npm run build
   ```

6. Review the diff and commit the task files.
7. Push the branch:

   ```sh
   git push -u origin HEAD
   ```

8. Open a PR:

   ```sh
   gh pr create --base main
   ```

Use [the writing rules](docs/writing.md) for the PR text.
Include desktop and mobile screenshots when you change the UI.
State which checks passed and which checks did not run.

## Future branch flow

Enable this flow only after the user requests the change.

| Branch | Purpose | PR source |
| --- | --- | --- |
| `develop` | Default branch for development | Task branches |
| `main` | Production releases | `develop` |

1. Set the GitHub default branch to `develop`.
2. Bring the latest `main` changes into `develop` through a task PR.
3. Update these instructions and the PR template to use `develop`.
4. Require PRs and checks on both long-term branches.
5. Restrict release PRs into `main` to this repository's `develop` branch.

Create each new task branch from the latest `develop`.
Squash ordinary task PRs into `develop`.
Use a merge commit for each requested release from `develop` into `main`.
Bring each release commit back into `develop` through a separate task PR.
Use a merge commit for that synchronization PR.
Delete only completed task branches.
