#!/usr/bin/env bash
# site.html  →  index.html
#
# site.html is headless on purpose — no <!doctype>, <html>, <head> or <body> —
# because the Artifact renderer supplies that skeleton itself. This wraps it
# back into a standalone document for hosting or opening from disk.
set -euo pipefail
cd "$(dirname "$0")"

python3 - <<'PY'
import pathlib
body = pathlib.Path("site.html").read_text()
pathlib.Path("index.html").write_text(
    '<!doctype html>\n<html lang="en">\n<head>\n'
    '<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
    '<meta name="robots" content="noindex,nofollow">\n'
    '<meta name="description" content="Concept design demo by YardScale Digital for Experience Sound &amp; Music. Not a live booking page.">\n'
    '<meta name="theme-color" content="#120e17">\n'
    '<style>*{box-sizing:border-box}body{margin:0;background:#120e17}img{max-width:100%}[hidden]{display:none!important}</style>\n'
    f'</head>\n<body>\n{body}\n</body>\n</html>\n'
)
print("wrote index.html")
PY
