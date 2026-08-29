# Scales Fare — demo site

A spec/demo concept for a point-of-sale supplier serving small businesses in
Jamaica and the wider Caribbean. Designed and built by YardScale Digital as a
portfolio piece — **not a live trading company**. Every page carries a demo
notice so it can be shown to a prospect without misleading anyone.

Lives at `/scales-fare/` on the same Netlify site. Same rules as the parent:
static HTML, no build dependencies, no framework.

```
index.html                    the demo site
thanks.html                   post-submit page, with the download
guide.html                    source of the free PDF
scales-fare-pos-guide.pdf     the lead magnet — 16 pages, A4
guide-cover.png               cover render used on the site
og-image.png                  link preview
brand/                        the logo system + brand sheet (see brand/README.md)
```

## What's in it

- **The demo site** — hero with a live terminal ringing up a JMD sale with GCT,
  four system packages, hardware, setup process, pricing, an FAQ answering the
  questions Jamaican shopkeepers actually ask, and a lead-capture form.
- **The lead magnet** — *The POS Guide for Jamaican Small Business*, 16 pages:
  where money leaks in a shop with no system, trading through an outage, GCT and
  what belongs on a receipt, the real cost of each payment method, a worked
  break-even in JMD, and a one-page checklist to take shopping.
- **The brand** — a full logo system with a seven-page brand sheet, the piece
  meant to be handed over on its own.

## Before this goes anywhere real

Placeholders that need swapping, all marked in the page:

- Phone / WhatsApp number in the contact section
- `hello@scalesfare.com` in the contact section and the guide's back page
- Pricing — the figures are indicative, flagged under the tier cards
- The booking link on the guide's back cover (`scalesfare.com`)
- The demo strip at the top of `index.html` and the note in the footer

## The form

Netlify Forms, named `scalesfare-guide`, posting to `thanks.html`. After the
first deploy, add a notification email under **Forms** in the Netlify dashboard.
Spam is handled by a honeypot field (`company-website`) that nobody real fills
in. The thanks page links the PDF directly, so the download works whether or not
email is wired up yet.

## Rebuilding the PDFs

Both PDFs print from their HTML source — `guide.html` and
`brand/brand-sheet.html`. Open either in a browser and **Print → Save as PDF**,
A4, margins none, background graphics on. The `@page` rules and per-page
`.page` blocks do the rest; nothing else is needed.
