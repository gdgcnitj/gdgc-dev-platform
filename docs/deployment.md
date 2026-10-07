# Production deployment

The public site runs on a `t3.micro` instance named `gdgc-web` in `ap-south-1`.
Merging a release into `main` deploys that commit. The instance was created with
the `hpc-relay` AWS profile. Do not put that profile's keys in GitHub. The user
can start other machines in the account, including GPU instances.

| | |
| --- | --- |
| Instance | `i-023def43e7585cdbd` |
| Address | `13.201.196.178` |
| Site | `http://13.201.196.178` |
| Admin SSH | `ssh -i ~/.ssh/gdgc-web ec2-user@13.201.196.178` |
| CPU credits | Unlimited, so a build is not held to the micro baseline |

The admin private key stays on the machine that created the instance, at
`~/.ssh/gdgc-web` with mode `600`. The deploy private key is
`~/.ssh/gdgc-deploy`. Neither key belongs in git.

## What a release does

`Deploy production` runs only for a push to `main`. It uses the GitHub
environment `production`, which is limited to that branch, and it has no
`GITHUB_TOKEN` permissions. The job checks out nothing and uses no third-party
actions. It opens SSH as `gdgc` and sends one command:

```text
deploy <commit>
```

The commit is `github.sha` for that push. The host must be an IPv4 address, and
the commit must be 40 hex characters. The SSH client checks the pinned host key
and does not accept a new one.

On the instance, `sshd` forces that command for `gdgc`. The authorized key also
sets `command=` and `restrict`, so the key cannot open a shell, forward ports,
or allocate a terminal. The command refuses anything except `deploy` plus a
commit that is already on `origin/main`. It then fetches that branch, checks
the commit out with hooks and symlinks disabled, runs `npm ci` and
`npm run build`, and restarts the service. If the home page does not answer,
it builds the previous commit again.

`gdgc` may restart `gdgc-web` through `sudo` and nothing else. The deploy
script, sudoers file, and authorized keys are owned by root. The app listens
on `127.0.0.1:3000`. nginx on port 80 is the public entry. There is no instance
role and no AWS credentials on the machine. Metadata requires IMDSv2.

Port 22 allows the internet because GitHub-hosted runners do not have a stable
address. Password login and root login are off. Only `ec2-user` and `gdgc` may
authenticate, and `gdgc` cannot get a shell.

## Server settings

Runtime and build settings live in `/etc/gdgc/env`, mode `640`, group `gdgc`.
Registration still answers that it opens later when `NODE_ENV` is not
`development`. Member sign-in needs `DATABASE_URL` and the OAuth values from
[environment settings](environment.md) in that file. The next production
deploy rebuilds the app with that file loaded.

A root shell on the instance can seed a commit that is on `develop` or `main`:

```sh
sudo /usr/local/sbin/gdgc-deploy seed <40-hex-sha>
```

That path is not available over the deploy key. The first running commit was
seeded from `develop` so the site was up before this workflow existed on
`main`. The next release replaces it.

## GitHub environment

The workflow reads `DEPLOY_HOST`, `DEPLOY_SSH_KEY`, and `DEPLOY_KNOWN_HOSTS` from
the `production` environment. That environment has to allow the `main` branch
only. Creating it needs a repository admin. The account used while this host
was set up has write access, so an admin runs:

```sh
bash deploy/configure-github.sh
```

The script reads `~/.ssh/gdgc-deploy` and the server host key. It does not
print either value.

## Rebuild the host

On a new Amazon Linux 2023 instance, copy `deploy/` to the machine and run
`sudo bash bootstrap.sh` from that directory. Then set `BETTER_AUTH_URL` in
`/etc/gdgc/env` to the public origin, seed a commit, and replace the
`production` environment secrets `DEPLOY_HOST`, `DEPLOY_SSH_KEY`, and
`DEPLOY_KNOWN_HOSTS`.
