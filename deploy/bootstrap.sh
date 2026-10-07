#!/bin/bash
# One-time host setup for Amazon Linux 2023. Run as root on the instance.
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "run as root" >&2
  exit 1
fi

HERE="$(cd "$(dirname "$0")" && pwd)"
NODE_VERSION=v22.23.3
REPO_URL="https://github.com/gdgcnitj/gdgc-dev-platform.git"
APP_ROOT=/var/www/gdgc
SRC="${APP_ROOT}/src"

if [[ ! -f /swapfile ]]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
fi
swapon /swapfile 2>/dev/null || true
grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab

dnf install -y git nginx tar gzip xz gcc-c++ make python3
if ! /usr/local/bin/node --version 2>/dev/null | grep -qx "$NODE_VERSION"; then
  tmp="$(mktemp -d)"
  curl -fsSL "https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz" -o "${tmp}/node.tar.xz"
  tar -xJf "${tmp}/node.tar.xz" -C /usr/local --strip-components=1
  rm -rf "$tmp"
fi

if ! id gdgc >/dev/null 2>&1; then
  useradd --system --create-home --home-dir /var/lib/gdgc --shell /bin/bash gdgc
fi
passwd -l gdgc >/dev/null
install -d -o gdgc -g gdgc -m 750 /var/lib/gdgc
install -d -o gdgc -g gdgc -m 750 "$APP_ROOT"
install -d -o root -g root -m 755 /etc/gdgc
install -d -o root -g root -m 755 /etc/ssh/authorized_keys

if [[ ! -f /etc/gdgc/env ]]; then
  umask 077
  auth_secret="$(openssl rand -base64 32)"
  cat > /etc/gdgc/env << EOF
NODE_ENV=production
BETTER_AUTH_SECRET=${auth_secret}
EOF
  umask 022
fi
chown root:gdgc /etc/gdgc/env
chmod 640 /etc/gdgc/env

install -m 755 -o root -g root "${HERE}/gdgc-deploy" /usr/local/sbin/gdgc-deploy
touch "${APP_ROOT}/deploy.log"
chown gdgc:gdgc "${APP_ROOT}/deploy.log"
chmod 640 "${APP_ROOT}/deploy.log"

pub="${HERE}/gdgc-deploy.pub"
if [[ ! -f "$pub" ]]; then
  echo "missing ${pub}" >&2
  exit 1
fi
# Key options are fixed here. The deploy user cannot rewrite this file.
{
  printf '%s' 'restrict,command="/usr/local/sbin/gdgc-deploy" '
  tr -d '\r\n' < "$pub"
  printf '\n'
} > /etc/ssh/authorized_keys/gdgc
chown root:root /etc/ssh/authorized_keys/gdgc
chmod 644 /etc/ssh/authorized_keys/gdgc

cat > /etc/sudoers.d/gdgc << 'EOF'
gdgc ALL=(root) NOPASSWD: /usr/bin/systemctl restart gdgc-web, /usr/bin/systemctl is-active gdgc-web
EOF
chmod 440 /etc/sudoers.d/gdgc
visudo -cf /etc/sudoers.d/gdgc

cat > /etc/ssh/sshd_config.d/gdgc.conf << 'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
AllowUsers ec2-user gdgc
ClientAliveInterval 30
ClientAliveCountMax 40
EOF
# Match has to stay at the end of sshd_config. A Match inside sshd_config.d
# would capture every setting that follows the Include.
marker="# gdgc-deploy-match"
if ! grep -q "$marker" /etc/ssh/sshd_config; then
  cat >> /etc/ssh/sshd_config << EOF

${marker}
Match User gdgc
    AuthorizedKeysFile /etc/ssh/authorized_keys/gdgc
    ForceCommand /usr/local/sbin/gdgc-deploy
    PermitTTY no
    AllowTcpForwarding no
    X11Forwarding no
    PermitTunnel no
    AllowAgentForwarding no
EOF
fi
sshd -t
admin_force="$(sshd -T -C user=ec2-user,host=localhost,addr=127.0.0.1 | awk '/^forcecommand / { print $2 }')"
if [[ "$admin_force" != "none" ]]; then
  echo "refusing to reload sshd because the admin user would be locked out" >&2
  exit 1
fi
systemctl reload sshd

if [[ -f /etc/nginx/nginx.conf && ! -f /etc/nginx/nginx.conf.dist ]]; then
  cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.dist
fi
cat > /etc/nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;
  types_hash_bucket_size 128;
  log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent"';
  access_log /var/log/nginx/access.log main;
  sendfile on;
  keepalive_timeout 65;
  server_tokens off;
  include /etc/nginx/conf.d/*.conf;
}
EOF
install -m 644 -o root -g root "${HERE}/nginx-gdgc.conf" /etc/nginx/conf.d/gdgc.conf
rm -f /etc/nginx/conf.d/default.conf
nginx -t
if getenforce 2>/dev/null | grep -qx Enforcing; then
  setsebool -P httpd_can_network_connect 1
fi
systemctl enable --now nginx
systemctl reload nginx

install -m 644 -o root -g root "${HERE}/gdgc-web.service" /etc/systemd/system/gdgc-web.service
systemctl daemon-reload
systemctl enable gdgc-web

hostnamectl set-hostname gdgc-web
git config --system protocol.file.allow never || true
if ! git config --system --get-all safe.directory | grep -qx "$SRC"; then
  git config --system --add safe.directory "$SRC"
fi
if [[ ! -d "${SRC}/.git" ]]; then
  sudo -u gdgc -H git clone "$REPO_URL" "$SRC"
fi
sudo -u gdgc -H git -C "$SRC" remote set-url origin "$REPO_URL"
sudo -u gdgc -H git -C "$SRC" config core.hooksPath /dev/null
sudo -u gdgc -H git -C "$SRC" config core.symlinks false
sudo -u gdgc -H git config --global advice.detachedHead false

echo "bootstrap complete"
