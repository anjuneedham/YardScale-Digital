# AV Farm Supplies — proposal

Two deliverables, same content, same brand tokens as the site:

| File | What it is |
|---|---|
| `AV-Farm-Supplies-Proposal-YardScale-Digital.pdf` | **The one to send the client.** 7 pages, Letter, brand fonts embedded, page numbers in the footer. |
| `proposal.html` | Same document as a web page. Self-contained — logo is a data URI, fonts from Google Fonts. This is the source the PDF is rendered from. |
| `AV-Farm-Supplies-Proposal-YardScale-Digital.pptx` | 8-slide version for walking the client through it on a call. Speaker notes on every slide. |

## The offer, in one place

- Landing page, organic + paid distribution of existing content, and lead generation — 30 days
- **JMD $40,000** fixed
- **JMD $20,000** on acceptance, **JMD $20,000** on launch
- Ad spend is separate, paid by the client direct to Meta
- Retainer continues month to month from day 31, priced at the day-30 review

## Rebuilding

```bash
cd src
npm install pptxgenjs                 # deck only
node deck.js                          # -> ../AV-Farm-Supplies-Proposal-YardScale-Digital.pptx
python3 build_proposal.py             # -> ../proposal.html
node build_pdf.js                     # -> ../AV-Farm-Supplies-Proposal-YardScale-Digital.pdf
```

`build_pdf.js` renders `proposal.html` through Chromium, so run it *after*
`build_proposal.py`. It needs `playwright` (`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
npm install playwright`) and a Chromium binary — set `CHROME_PATH` if yours
isn't at the default in the script. It downloads Archivo, Instrument Sans and
JetBrains Mono at build time and inlines them as base64, so the finished PDF
carries its own type and needs no font host to render correctly.

`src/icons/` holds the Feather icons already rasterised, so a rebuild needs
only `pptxgenjs`. To regenerate them (`npm install react react-dom react-icons sharp`):

```bash
node icons.js
```

`src/render.py` rasterises the built `.pptx` for visual checks — it stands in for
LibreOffice, which can't load files in the CI container:

```bash
pip install python-pptx Pillow
python3 render.py ../AV-Farm-Supplies-Proposal-YardScale-Digital.pptx qa
```

## Reusing this for another client

Both generators are single files with the copy inline. Brand tokens sit at the
top of each — they're the same ink / paper / lime values as `index.html`, so
changing them here only changes the proposal. `brand/yardscale-lockup-paper.png`
is the reversed lockup for dark backgrounds, derived from the ink one.
