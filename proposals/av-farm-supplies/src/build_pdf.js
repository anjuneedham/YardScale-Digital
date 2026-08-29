/**
 * Renders proposal.html to a print-ready PDF with Chromium.
 *
 * The brand faces are downloaded from Google Fonts and inlined as base64
 * woff2, so the PDF carries its own type rather than depending on a font
 * host at render time. The print stylesheet pins the light palette (a PDF
 * has no viewer theme to follow) and keeps sections off page seams.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const HERE = __dirname;
const SRC = path.join(HERE, '..', 'proposal.html');
const OUT = path.join(HERE, '..', 'AV-Farm-Supplies-Proposal-YardScale-Digital.pdf');
const STAGE = path.join(HERE, '.print.html');

// Playwright's bundled revision isn't what this image ships; use what's here.
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const FAMILIES = [
  'Archivo:wght@600;800',
  'Instrument+Sans:wght@400;500;600',
  'JetBrains+Mono:wght@400;500',
];
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function inlineFonts() {
  const url = 'https://fonts.googleapis.com/css2?family=' + FAMILIES.join('&family=') + '&display=swap';
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('font css ' + res.status);
  const css = await res.text();

  // Keep only the latin block of each face - the rest is dead weight in a PDF.
  const blocks = css.split('@font-face').slice(1).map((b) => '@font-face' + b.split('}\n')[0] + '}');
  const keep = blocks.filter((b) => /U\+0000-00FF/.test(b));

  const out = [];
  for (const block of keep) {
    const m = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    if (!m) continue;
    const buf = Buffer.from(await (await fetch(m[1])).arrayBuffer());
    out.push(
      block
        .replace(m[1], 'data:font/woff2;base64,' + buf.toString('base64'))
        .replace(/\s*unicode-range:[^;]+;/, '')
    );
  }
  console.log(`inlined ${out.length} faces`);
  return out.join('\n');
}

const PRINT_CSS = `
@page { size: Letter; margin: 15mm 14mm 16mm; }
html, body { background: #ffffff !important; }
:root {
  --bg:#ffffff; --surface:#ffffff; --fg:#131313; --muted:#5f5f57;
  --rule:#d6d3c9; --rule-soft:#e7e5dd; --accent:#c3fc0f;
  --slab:#131313; --slab-fg:#f4f3ee; --slab-muted:#9c9c93;
}
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
.wrap { max-width: none; padding: 0; }

/* the masthead is the letterhead - it belongs to page one only */
.masthead { padding-top: 0; }
/* on paper the lockup sits on the sheet; the plate is only there to carry
   it over a dark viewer theme, which a PDF does not have */
.plate { background: none; border: 0; padding: 0; }
.plate img { width: 190px; }

/* Letter's text column is narrower than the 4-across breakpoint, so the
   weeks fall to a 2x2 - which reads better on paper than four 177px cells */
.weeks { grid-template-columns: repeat(2, 1fr); }

/* keep a section's heading with its content, and its content off a seam */
section { break-inside: avoid; margin-top: 34px; }
.shead { break-after: avoid; }
.block, .week, .pay-cell, .fact, .retainer, .sig, .slab { break-inside: avoid; }
.linetable tr { break-inside: avoid; }
.title { break-after: avoid; }

/* the money and the signature block each want a clean page of their own */
#sec-investment { break-before: page; }
#sec-accept { break-inside: avoid; }

h1 { font-size: 46px; }
.subtitle { font-size: 17px; }
.lede { font-size: 17px; }
body { font-size: 14.5px; }
.shead h2 { font-size: 25px; }
.slab .amt { font-size: 46px; }
footer { margin-top: 40px; }
`;

(async () => {
  let html = fs.readFileSync(SRC, 'utf8');
  const fonts = await inlineFonts();

  // swap the Google Fonts <link>s for the embedded faces
  html = html.replace(/<link rel="preconnect"[^>]*>\s*/g, '');
  html = html.replace(
    /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/,
    `<style>\n${fonts}\n</style>`
  );
  // pin the light palette: a PDF has no viewer theme, and the dark blocks
  // would otherwise win on a dark-set rendering host
  html = html.replace(
    /@media \(prefers-color-scheme: dark\)\{[\s\S]*?\n\}\n:root\[data-theme="dark"\]\{[\s\S]*?\n\}/,
    '/* theme blocks dropped for print */'
  );
  // must land after the document's own stylesheet - the inlined @font-face
  // block is itself a <style>, so anchor on the LAST one, not the first
  const lastStyle = html.lastIndexOf('</style>');
  html = html.slice(0, lastStyle + 8) + '\n<style>' + PRINT_CSS + '</style>' + html.slice(lastStyle + 8);

  // anchors the print rules above hang page breaks on
  html = html.replace('<div class="shead"><span class="num">05</span>', '<div class="shead" id="ih-inv"><span class="num">05</span>');
  html = html.replace(/<section>\s*<div class="shead" id="ih-inv">/, '<section id="sec-investment">\n    <div class="shead">');
  html = html.replace('<div class="shead"><span class="num">08</span>', '<div class="shead" id="ih-acc"><span class="num">08</span>');
  html = html.replace(/<section>\s*<div class="shead" id="ih-acc">/, '<section id="sec-accept">\n    <div class="shead">');

  html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{margin:0;font:14px system-ui}img{max-width:100%}</style>
</head><body>${html}</body></html>`;

  fs.writeFileSync(STAGE, html);

  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage();
  await page.goto('file://' + STAGE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const foot = (s) =>
    `<div style="width:100%;font:8.5px 'JetBrains Mono',monospace;color:#8a8a80;padding:0 14mm;display:flex;justify-content:space-between;letter-spacing:.06em">${s}</div>`;

  await page.pdf({
    path: OUT,
    format: 'Letter',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: foot(
      '<span>YARDSCALE DIGITAL &middot; PROPOSAL YSD-2026-AVF</span>' +
      '<span><span class="pageNumber"></span> / <span class="totalPages"></span></span>'
    ),
    margin: { top: '15mm', right: '14mm', bottom: '16mm', left: '14mm' },
  });

  await browser.close();
  fs.unlinkSync(STAGE);
  console.log('wrote', OUT, fs.statSync(OUT).size, 'bytes');
})();
