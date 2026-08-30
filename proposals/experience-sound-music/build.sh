#!/usr/bin/env bash
# Builds the Experience Sound & Music proposal.
#
#   proposal.src.html  →  proposal.html  (logos inlined; publishable as an Artifact)
#                      →  Experience-Sound-and-Music-Proposal.pdf
#
# proposal.html is deliberately headless — no <!doctype>, <html>, <head> or
# <body> — because the Artifact renderer supplies that skeleton itself. The PDF
# step wraps it back up before handing it to Chromium.
set -euo pipefail
cd "$(dirname "$0")"
ROOT=../..
OUT_PDF="Experience-Sound-and-Music-Proposal.pdf"

CHROME=""
for c in /opt/pw-browsers/chromium-*/chrome-linux/chrome "$(command -v chromium || true)" "$(command -v google-chrome || true)"; do
  [ -x "${c:-}" ] && { CHROME="$c"; break; }
done
[ -n "$CHROME" ] || { echo "no chromium found" >&2; exit 1; }

python3 - "$ROOT" <<'PY'
import base64, pathlib, sys
root = pathlib.Path(sys.argv[1])
uri = lambda p: "data:image/png;base64," + base64.b64encode((root/p).read_bytes()).decode()

body = pathlib.Path("proposal.src.html").read_text()
body = body.replace("__LOGO_PAPER__", uri("brand/yardscale-lockup-paper.png"))
pathlib.Path("proposal.html").write_text(body)

# Standalone wrapper, for print only.
pathlib.Path("print.tmp.html").write_text(
    '<!doctype html><html lang="en"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1">'
    '<style>*{box-sizing:border-box}body{margin:0}img{max-width:100%}</style>'
    f'</head><body>{body}</body></html>'
)
PY

"$CHROME" --headless --disable-gpu --no-sandbox \
  --virtual-time-budget=20000 \
  --print-to-pdf="$OUT_PDF" --no-pdf-header-footer \
  "file://$PWD/print.tmp.html" 2>/dev/null

rm -f print.tmp.html
echo "built $OUT_PDF ($(du -h "$OUT_PDF" | cut -f1))"
