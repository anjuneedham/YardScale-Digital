#!/usr/bin/env bash
# Packages the site for Namecheap cPanel.
#
# There is no build step on shared hosting — whatever you upload is what gets
# served — so this just collects the files that belong on the server into
# dist/ and zips them. cPanel's File Manager can extract a zip in place, which
# is far quicker and more reliable than dragging 200 files through a browser.
#
#   ./build.sh          → dist/ and yardscale-site.zip
#   ./build.sh --check  → validate only, build nothing
#
# Upload yardscale-site.zip to public_html, then Extract. See README.md.

set -euo pipefail
cd "$(dirname "$0")"

DIST="dist"
ZIP="yardscale-site.zip"
DOMAIN="yardscaledigital.com"

# Everything that belongs on the server. Anything not listed here — README,
# build.sh, the deploy scripts, .git — deliberately stays off it.
FILES=(
  index.html
  thanks.html
  404.html
  contact.php
  .htaccess
  robots.txt
  sitemap.xml
  og-image.png
)
DIRS=(brand partnership)

fail=0
note() { printf '  %s\n' "$1"; }
bad()  { printf '  ✗ %s\n' "$1"; fail=1; }

echo "Checking…"

for f in "${FILES[@]}"; do
  [ -f "$f" ] || bad "missing: $f"
done
for d in "${DIRS[@]}"; do
  [ -d "$d" ] || bad "missing directory: $d"
done

# A leftover placeholder means link previews ship broken, and it is invisible
# in a browser — so it has to be caught here rather than after upload.
if grep -rl '__SITE_URL__' index.html thanks.html 404.html robots.txt sitemap.xml 2>/dev/null | grep -q .; then
  bad "__SITE_URL__ placeholder still present — meta tags would ship unresolved"
fi

# The two booking URLs have to agree, or people with JavaScript off get sent
# to a different calendar than everyone else.
js_url=$(grep -oP 'const BOOKING_URL = "\K[^"]+' index.html 2>/dev/null || true)
php_url=$(grep -oP "const BOOKING_URL = '\K[^']+" contact.php 2>/dev/null || true)
if [ -n "$js_url" ] && [ -n "$php_url" ] && [ "$js_url" != "$php_url" ]; then
  bad "BOOKING_URL differs: index.html has $js_url, contact.php has $php_url"
fi

# PHP syntax, if a local php is around. The server has one either way.
if command -v php >/dev/null 2>&1; then
  php -l contact.php >/dev/null || bad "contact.php has a syntax error"
else
  note "no local php — skipping the syntax check"
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "Not packaging. Fix the above first."
  exit 1
fi

note "✓ files present"
note "✓ URLs stamped for $DOMAIN"
note "✓ booking links agree"

if [ "${1:-}" = "--check" ]; then
  echo
  echo "Checks passed. Nothing built (--check)."
  exit 0
fi

echo
echo "Packaging…"
rm -rf "$DIST" "$ZIP"
mkdir -p "$DIST"
cp -p "${FILES[@]}" "$DIST"/
for d in "${DIRS[@]}"; do cp -Rp "$d" "$DIST"/; done

# _private is where contact.php keeps the enquiry log. Ship it pre-denied so
# there is no window where the CSV is reachable over the web.
mkdir -p "$DIST/_private"
cat > "$DIST/_private/.htaccess" <<'DENY'
Require all denied
<IfModule !mod_authz_core.c>
Deny from all
</IfModule>
DENY

# -x nothing, but keep dotfiles: .htaccess is the whole server config.
( cd "$DIST" && zip -qr "../$ZIP" . ) || {
  echo "  zip isn't installed — dist/ is ready, upload that folder instead."
  exit 0
}

echo
echo "  dist/            $(find "$DIST" -type f | wc -l | tr -d ' ') files"
echo "  $ZIP   $(du -h "$ZIP" | cut -f1)"
echo
echo "Next: upload $ZIP to public_html in cPanel File Manager, then Extract."
