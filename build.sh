#!/usr/bin/env bash
# Stamps the live site URL into the pages at deploy time.
#
# Netlify sets URL to the site's primary address (your custom domain once you
# add one, the .netlify.app address until then) and DEPLOY_PRIME_URL to the
# per-branch address on deploy previews. WhatsApp, iMessage and most link
# unfurlers only follow ABSOLUTE og:image URLs, so this has to be resolved
# before the HTML ships — it cannot be done in the browser.
#
# Nothing here is required for local viewing: open index.html straight from
# disk and it works, the placeholder just sits unresolved in the meta tags.

set -euo pipefail

SITE_URL="${DEPLOY_PRIME_URL:-${URL:-}}"

if [ -z "$SITE_URL" ]; then
  echo "build.sh: no URL/DEPLOY_PRIME_URL in the environment — skipping URL stamping."
  exit 0
fi

SITE_URL="${SITE_URL%/}"   # never leave a double slash in a canonical URL
echo "build.sh: stamping site URL -> $SITE_URL"

for f in index.html thanks.html 404.html robots.txt sitemap.xml \
         scales-fare/index.html scales-fare/thanks.html; do
  [ -f "$f" ] || continue
  sed -i "s|__SITE_URL__|${SITE_URL}|g" "$f"
done

echo "build.sh: done."
