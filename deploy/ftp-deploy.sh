#!/usr/bin/env bash
# Uploads dist/ to Namecheap over FTPS, replacing the manual zip-and-extract.
#
# Namecheap has no API for uploading files (see README — their API is domains,
# DNS and SSL only). FTP is the scriptable route, and cPanel gives you the
# credentials for free.
#
# One-time setup:
#   cPanel → Files → FTP Accounts → Create an account with its directory set
#   to public_html. Then put the details in deploy/.ftp-credentials:
#
#     FTP_HOST=ftp.yardscaledigital.com
#     FTP_USER=deploy@yardscaledigital.com
#     FTP_PASS=the-password-you-set
#     FTP_DIR=/                       # relative to the FTP account's home
#
#   chmod 600 deploy/.ftp-credentials   ← it holds a password, keep it local.
#   The file is gitignored. Never commit it.
#
# Usage:
#   ./deploy/ftp-deploy.sh            # show what would change, upload nothing
#   ./deploy/ftp-deploy.sh --live     # actually upload

set -euo pipefail
cd "$(dirname "$0")/.."

CREDS="deploy/.ftp-credentials"
DIST="dist"

if ! command -v lftp >/dev/null 2>&1; then
  cat <<'MSG'
lftp isn't installed, and it's the only dependency here.

  macOS          brew install lftp
  Debian/Ubuntu  sudo apt install lftp

Or skip this script entirely and upload yardscale-site.zip through
cPanel's File Manager — the README walks through it.
MSG
  exit 1
fi

if [ ! -f "$CREDS" ]; then
  echo "No $CREDS — see the comments at the top of this script."
  exit 1
fi

# Refuse to run with world-readable credentials.
perms=$(stat -c '%a' "$CREDS" 2>/dev/null || stat -f '%Lp' "$CREDS")
if [ "$perms" != "600" ]; then
  echo "$CREDS is mode $perms. Run: chmod 600 $CREDS"
  exit 1
fi

# shellcheck disable=SC1090
source "$CREDS"
: "${FTP_HOST:?FTP_HOST missing from $CREDS}"
: "${FTP_USER:?FTP_USER missing from $CREDS}"
: "${FTP_PASS:?FTP_PASS missing from $CREDS}"
FTP_DIR="${FTP_DIR:-/}"

[ -d "$DIST" ] || { echo "No $DIST/ — run ./build.sh first."; exit 1; }

DRY="--dry-run"
LABEL="DRY RUN — nothing will be uploaded"
if [ "${1:-}" = "--live" ]; then
  DRY=""
  LABEL="LIVE — uploading to $FTP_HOST$FTP_DIR"
fi

echo "$LABEL"
echo

# --only-newer keeps the transfer small on repeat deploys.
# _private holds live enquiries written by the server; never mirror over it.
lftp -u "$FTP_USER","$FTP_PASS" "ftps://$FTP_HOST" <<LFTP
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ssl:verify-certificate true
set net:max-retries 3
set net:timeout 20
mirror --reverse --only-newer --verbose $DRY \
       --exclude-glob _private/ \
       "$DIST" "$FTP_DIR"
bye
LFTP

echo
if [ -n "$DRY" ]; then
  echo "That was a dry run. Re-run with --live to upload."
else
  echo "Uploaded. Check https://yardscaledigital.com/"
fi
