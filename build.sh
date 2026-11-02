#!/usr/bin/env bash
# Stamps the live site URL into the pages at deploy time.
#
# WhatsApp, iMessage and most link unfurlers only follow ABSOLUTE og:image
# URLs, so this has to be resolved before the HTML ships — it cannot be done in
# the browser. Vercel exposes the address as a build-time environment variable:
#
#   VERCEL_PROJECT_PRODUCTION_URL  the project's production domain — your custom
#                                  domain once you add one, the .vercel.app
#                                  address until then. Used for production.
#   VERCEL_URL                     this specific deployment's address. Used for
#                                  preview deploys, so a preview's previews
#                                  point at the preview.
#
# Neither includes a protocol, so https:// is prepended here.
#
# Nothing here is required for local viewing: open index.html straight from
# disk and it works, the placeholder just sits unresolved in the meta tags.

set -euo pipefail

if [ "${VERCEL_ENV:-}" = "production" ] && [ -n "${VERCEL_PROJECT_PRODUCTION_URL:-}" ]; then
  SITE_URL="https://${VERCEL_PROJECT_PRODUCTION_URL}"
elif [ -n "${VERCEL_URL:-}" ]; then
  SITE_URL="https://${VERCEL_URL}"
else
  # Escape hatch for other hosts or a local `bash ./build.sh` run.
  SITE_URL="${SITE_URL:-}"
fi

if [ -z "$SITE_URL" ]; then
  echo "build.sh: no VERCEL_PROJECT_PRODUCTION_URL/VERCEL_URL/SITE_URL in the environment — skipping URL stamping."
  exit 0
fi

SITE_URL="${SITE_URL%/}"   # never leave a double slash in a canonical URL
echo "build.sh: stamping site URL -> $SITE_URL"

for f in index.html journal.html privacy.html 404.html robots.txt sitemap.xml; do
  [ -f "$f" ] || continue
  sed -i "s|__SITE_URL__|${SITE_URL}|g" "$f"
done

echo "build.sh: done."
