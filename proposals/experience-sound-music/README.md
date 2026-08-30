# Experience Sound & Music — proposal ESM-260830

Fixed-price booking-page build. **J$50,000 JMD**, 50% deposit (J$25,000) on
acceptance, balance on handover. Three-week build, one-off, full handover.

```
proposal.src.html   the source — edit this one
proposal.html       generated: logos inlined, ready to publish as an Artifact
build.sh            regenerates proposal.html + the PDF
Experience-Sound-and-Music-Proposal.pdf   the sendable file
```

## Rebuilding

```sh
./build.sh
```

Substitutes the brand lockup from `brand/` as a data URI, then renders the PDF
with headless Chromium at A4.

`proposal.html` is deliberately headless — no `<!doctype>`, `<html>`, `<head>`
or `<body>` — because the Artifact renderer supplies that skeleton itself. The
`<title>` and `<style>` sit at the top of the file instead. `build.sh` wraps it
back into a full document before printing.

## Before sending

- **Confirm the currency.** Quoted in JMD throughout.
- **Check the three observations** in *Where this came from*. They are drawn
  from the outreach message they sent, not from their live site — their domain
  was unreachable when this was written, so re-read `/aboutus` and adjust
  anything that no longer holds.
- **Dates.** Prepared 30 August 2026, valid to 20 September 2026. Both appear
  on the cover, in *Terms* and in the footer.
- **Reference ESM-260830** appears on the cover, the accept line and the footer.

## Hosting it

`netlify.toml` publishes the repo root, so this folder ships with the site at
`/proposals/experience-sound-music/proposal.html` — but that file has no
`<head>`, so serve `Experience-Sound-and-Music-Proposal.pdf` or the Artifact
link instead. `robots.txt` disallows `/proposals/` either way.
