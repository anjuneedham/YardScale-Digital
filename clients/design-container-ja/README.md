# Design Container JA — website

Static, no framework, no build step of its own. Deploys with the rest of the
YardScale site; `build.sh` at the repo root stamps the live URL into the meta
tags at deploy time.

```
index.html      the whole site
thanks.html     where both forms land (?d=guide or ?d=viewing switches the copy)
og-image.png    link preview card for WhatsApp / socials
README.md       this file
```

Live at `/clients/design-container-ja/`, with `/dcja` redirecting there for a
short link to share in a message.

## Before this goes live — five things only the client can answer

Everything below is marked with a comment in `index.html` at the point it
appears, so you can find it fast.

1. **Prices.** The four "from" figures are indicative, benchmarked against the
   published Jamaican market (Kingston Logistics Centre's range of roughly
   J$2.5M–J$12.5M, and the 480 sq ft two-bedroom widely reported at J$8.5M).
   They are placed to bracket that range honestly, but they are **not** Design
   Container JA's numbers. Replace all four before launch.
2. **Phone number.** `18760000000` appears in three places — the contact block,
   the WhatsApp float, and `thanks.html`. Search and replace.
3. **Email.** `hello@designcontainerja.com` — same treatment.
4. **Specifications.** The wind rating, insulation depth, coating system and
   warranty term in "Built for Jamaica" describe a good container build. Confirm
   each one matches what the client actually supplies before publishing, and
   change anything that does not.
5. **Photography.** The gallery uses drawn SVG configurations. They are there so
   the site looks finished today, not as a permanent answer — swap each `<svg>`
   inside the `<figure>` for a real photograph once units are shot, keeping the
   `<figure>`/`<figcaption>` shell.

## Forms

Two Netlify forms, no backend:

- `guide-download` — the lead magnet capture
- `viewing-enquiry` — the contact form

After the first deploy, open **Forms** in the Netlify dashboard and add a
notification email for each. Spam is handled by a honeypot field
(`company-website`) that real people never see.

The guide itself is not wired to auto-send yet. Until it is, someone has to
email the PDF manually when a submission lands — see the proposal for what
automating that looks like.

## Design notes

Palette is taken from the material: weathering (corten) steel `#b85c38`, hull
charcoal `#14171a`, Jamaican limestone `#f5f2ec`, deep canopy green `#1f3a31`.

| | |
|---|---|
| Display | Instrument Serif (400 + italic) |
| Body | Instrument Sans |
| Labels | JetBrains Mono |

Every drawing on the page is inline SVG sharing one corrugation `<pattern>`,
which is what makes a container read as a container at any size. Nothing is
raster except the link-preview card, so the page is fast and stays sharp on any
display.

## The buyer's guide

`guide.html` is the source; `Design-Container-JA-Buyers-Guide.pdf` is the built
20-page A4 PDF that gets emailed to whoever fills in the form.

To rebuild after editing the source:

```bash
chromium --headless --no-pdf-header-footer --virtual-time-budget=15000 \
  --print-to-pdf=Design-Container-JA-Buyers-Guide.pdf guide.html
```

Note that the PDF sits in the deploy directory, so it is reachable at its own
URL by anyone who has that URL. That is normal for a lead magnet delivered by
email — the form is there to capture the lead, not to lock the file down — but
worth knowing before you treat the contents as gated.

The same content-verification pass is worth repeating on any edit: no page
should have content running into the bottom 25 mm, where the running foot sits.

## The pitch deck

`deck.js` generates `YardScale-Pitch-Design-Container-JA.pptx` (11 slides, 16:9)
from the images in `deck-assets/`. Speaker notes are on every slide.

```bash
npm install pptxgenjs      # once
node deck.js
```

The screenshots in `deck-assets/` are captured from the live site — regenerate
them if the site changes materially, or the deck will show stale prices.

Fonts are Arial and Calibri rather than the brand's Archivo/Instrument Sans, so
the deck renders identically on any machine the client opens it on. The PDFs use
the real brand fonts, embedded.
