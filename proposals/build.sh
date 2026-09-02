#!/usr/bin/env bash
# Renders a proposal source file to a print-ready A4 PDF.
#
#   ./proposals/build.sh andrew-james
#
# The source HTML carries three placeholders — __FONTS__, __LOGO_INK__ and
# __LOGO_PAPER__ — which this script fills in with base64 data URIs so the
# finished PDF has no external dependencies and renders identically anywhere.

set -euo pipefail

NAME="${1:-andrew-james}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/proposals/$NAME.src.html"
OUT="$ROOT/proposals/YardScale-Digital-Proposal-$(python3 -c "print('$NAME'.replace('-',' ').title().replace(' ','-'))").pdf"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

[ -f "$SRC" ] || { echo "no such source: $SRC" >&2; exit 1; }

CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in /opt/pw-browsers/chromium-*/chrome-linux/chrome \
           "$(command -v chromium || true)" \
           "$(command -v google-chrome || true)"; do
    [ -x "${c:-}" ] && CHROME="$c" && break
  done
fi
[ -n "$CHROME" ] || { echo "chromium not found — set CHROME=/path/to/chrome" >&2; exit 1; }

echo "→ fetching and inlining fonts"
python3 - "$WORK" <<'PY'
import re, sys, base64, urllib.request
work = sys.argv[1]
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                   '(KHTML, like Gecko) Chrome/120.0 Safari/537.36'}
url = ("https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@112,800"
       "&family=Instrument+Sans:wght@400;500;600"
       "&family=JetBrains+Mono:wght@400;500&display=swap")
css = urllib.request.urlopen(urllib.request.Request(url, headers=UA)).read().decode()

# Latin subset only — the proposal is English and the full set triples the size.
blocks = re.findall(r'/\*\s*([\w\-\[\]]+)\s*\*/\s*(@font-face\s*\{.*?\})', css, re.S)
out = "\n".join(b for name, b in blocks if name == 'latin')

cache = {}
def inline(m):
    u = m.group(1)
    if u not in cache:
        cache[u] = base64.b64encode(
            urllib.request.urlopen(urllib.request.Request(u, headers=UA)).read()).decode()
    return "url(data:font/woff2;base64,%s)" % cache[u]

out = re.sub(r'url\((https://fonts\.gstatic\.com[^)]+)\)', inline, out)
open(work + '/fonts.css', 'w').write(out)
print("  %d faces, %d font files" % (out.count('@font-face'), len(cache)))
PY

echo "→ inlining logos"
python3 - "$SRC" "$ROOT" "$WORK" <<'PY'
import sys, base64
src, root, work = sys.argv[1], sys.argv[2], sys.argv[3]
b64 = lambda p: "data:image/png;base64," + base64.b64encode(open(p, 'rb').read()).decode()
h = open(src).read()
h = h.replace('__FONTS__', open(work + '/fonts.css').read())
h = h.replace('__LOGO_INK__',   b64(root + '/brand/yardscale-lockup-ink.png'))
h = h.replace('__LOGO_PAPER__', b64(root + '/brand/yardscale-lockup-paper.png'))
open(work + '/proposal.html', 'w').write(h)
PY

echo "→ rendering PDF"
"$CHROME" --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
  --print-to-pdf="$OUT" --virtual-time-budget=8000 \
  "file://$WORK/proposal.html" 2>/dev/null

echo "✓ $OUT"
