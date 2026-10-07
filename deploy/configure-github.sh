#!/bin/bash
# Create the production GitHub environment and its deploy secrets.
# Requires an account with admin access to gdgcnitj/gdgc-dev-platform.
# Prints secret names only.
set -euo pipefail
umask 077

repo="${REPO:-gdgcnitj/gdgc-dev-platform}"
host="${DEPLOY_HOST:-13.201.196.178}"
key="${DEPLOY_KEY_FILE:-$HOME/.ssh/gdgc-deploy}"

if [[ ! "$host" =~ ^[0-9]{1,3}(\.[0-9]{1,3}){3}$ ]]; then
  echo "unexpected host" >&2
  exit 1
fi
if [[ ! -f "$key" ]]; then
  echo "missing deploy private key at ${key}" >&2
  exit 1
fi
if grep -q 'OPENSSH PRIVATE KEY' "$key"; then
  :
else
  echo "deploy key file is not an OpenSSH private key" >&2
  exit 1
fi

admin="$(gh repo view "$repo" --json viewerCanAdminister --jq .viewerCanAdminister)"
if [[ "$admin" != "true" ]]; then
  echo "this GitHub account cannot administer ${repo}" >&2
  exit 1
fi

known="$(mktemp)"
trap 'rm -f "$known"' EXIT
ssh-keyscan -t ed25519 "$host" 2>/dev/null | grep -v '^#' > "$known"
if [[ ! -s "$known" ]]; then
  echo "could not read the server host key" >&2
  exit 1
fi

gh api --method PUT "repos/${repo}/environments/production" --input - << 'EOF'
{"deployment_branch_policy":{"protected_branches":false,"custom_branch_policies":true}}
EOF
if ! gh api "repos/${repo}/environments/production/deployment-branch-policies" --jq '.branch_policies[].name' | grep -qx main; then
  gh api --method POST "repos/${repo}/environments/production/deployment-branch-policies" -f name=main -f type=branch >/dev/null
fi

printf '%s' "$host" | gh secret set DEPLOY_HOST --env production --repo "$repo"
gh secret set DEPLOY_SSH_KEY --env production --repo "$repo" < "$key"
gh secret set DEPLOY_KNOWN_HOSTS --env production --repo "$repo" < "$known"

echo "production environment allows main only"
gh secret list --env production --repo "$repo"
