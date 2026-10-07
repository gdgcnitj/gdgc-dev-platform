# Contributing

## Branches

| Branch | Purpose | Receives changes from |
| --- | --- | --- |
| `develop` | Integration branch for upcoming work | Task PRs |
| `main` | Production | Release PRs from `develop` |
| `feat/`, `fix/`, `chore/`, `docs/` | One task per branch | Latest `develop` |

Name the branch for the task, such as `feat/landing-hero`,
`fix/mobile-navigation`, or `chore/update-dependencies`.
The legacy `development` branch is history. Use `develop` for new work.

`main` stays behind `develop` between releases. Bring it forward only for a
requested production release, then sync that release commit back into `develop`.

## Start a task

Finish or safely stash local work before switching branches.

```sh
git fetch --all --tags
git switch develop
git pull --ff-only origin develop
git switch -c feat/landing-hero
```

Local setup is in [docs/development.md](docs/development.md).
For application changes, run:

```sh
npm ci
npm run check
npm run build
```

Commit focused changes, then push the new branch and open a PR into `develop`:

```sh
git push -u origin HEAD
gh pr create --base develop
```

Describe the problem, resulting behavior, and validation. For UI changes, include
screenshots and check desktop and mobile layouts. Resolve failing checks before
merging. Squash merge ordinary task PRs, then delete their remote task branches.
Never delete `develop` or `main`. Start the next task from the updated `develop`.

## Release to production

Release only when explicitly requested. Verify the changes on `develop`, choose a
version, and open a PR with **base `main`, head `develop`**. Include the release
scope and validation in its description.

Merge release PRs with **Create a merge commit** to preserve shared history.
Do not squash or rebase releases, and do not delete `develop`. After the merge,
fetch and fast-forward local `main`, then create the requested version tag and
GitHub release at that production commit. The push to `main` starts
[Deploy production](.github/workflows/deploy.yml), which checks that commit
out on the production instance. Preview or staging deployments should track
`develop` or task PRs. See [deployment](docs/deployment.md).

Bring the release commit back into `develop` through a fresh synchronization PR:

```sh
git fetch origin
git switch develop
git pull --ff-only origin develop
git switch -c chore/sync-release-vX.Y.Z
git merge origin/main
git push -u origin HEAD
gh pr create --base develop --title "chore: sync production release into develop"
```

Merge this synchronization PR with **Create a merge commit** as well, so the
production commit remains an ancestor of `develop`. Delete only its task branch.

## GitHub settings for repository admins

These settings require repository admin access:

1. Set the [default branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/changing-the-default-branch)
   to `develop` in repository Settings under **Default branch**.
2. Protect `develop` and `main`: require PRs, require the `Branch policy` and
   `Validate` status checks, and block force pushes and branch deletion.
3. Keep merge commits enabled for releases and release synchronization. Use
   squash merges for ordinary task PRs.
4. Set the hosting provider's production branch to `main` and use previews or
   staging for `develop`. Hosting configuration is managed separately from GitHub.

The branch-policy workflow checks that PRs into `main` come from this repository's
`develop`, and rejects PRs from `main` or the legacy `development` into `develop`.
Status checks become merge requirements only after an admin configures protection.
