# Proposals

Client proposals, authored as HTML and rendered to print-ready A4 PDFs.

```
<client>.src.html   the proposal source
build.sh            renders a source file to PDF
*.pdf               the rendered output, committed so it can be sent without a build
```

## Rendering

```sh
./proposals/build.sh andrew-james
```

Needs Chromium (or Chrome) and network access to Google Fonts. If the binary
isn't on the usual paths, point at it: `CHROME=/path/to/chrome ./proposals/build.sh …`

## How the source works

Each source file is a plain HTML document with one `<section class="page">` per
A4 page and three placeholders that `build.sh` fills in:

| Placeholder | Replaced with |
|---|---|
| `__FONTS__` | Archivo, Instrument Sans and JetBrains Mono, latin subset, base64 `@font-face` rules |
| `__LOGO_INK__` | `brand/yardscale-lockup-ink.png` as a data URI — for light pages |
| `__LOGO_PAPER__` | `brand/yardscale-lockup-paper.png` as a data URI — for ink pages |

Everything is inlined, so the finished PDF has no external dependencies and
renders the same on any machine. Fonts are pulled at build time rather than
committed, which keeps the repo free of font binaries.

Brand tokens match the site: ink `#131313`, paper `#F9F8F4`, lime `#C3FC0F`.

## Starting a new proposal

Copy an existing source, keep the page structure and the placeholders, and
change the content. The shared pieces — cover, running header and footer,
stat strip, cards, tables, terms and signature block — are all in the one
`<style>` block at the top and carry over unchanged.
