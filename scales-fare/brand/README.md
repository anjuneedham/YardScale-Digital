# Scales Fare — brand assets

Everything here is drawn from one vector source. **SVG is the master** — reach for
it first, and only fall back to PNG where a tool refuses vector (Word,
PowerPoint, some print portals).

The wordmark is set in Sora ExtraBold and **shipped as outlines**, so no logo
file depends on a font being installed anywhere.

Start with `scalesfare-brand-sheet.pdf` — seven pages covering the lockups,
clear space, minimum sizes, colour, type and misuse.

## Files

| File | Use it for |
|---|---|
| `scalesfare-logo-horizontal.svg` | The default. Light backgrounds. |
| `scalesfare-logo-horizontal-reversed.svg` | Dark and photographic backgrounds. |
| `scalesfare-logo-horizontal-tagline.svg` | First impressions — stationery, a stand, a cover. |
| `scalesfare-logo-stacked.svg` | Square and narrow spaces. |
| `scalesfare-logo-stacked-reversed.svg` | The same, on dark. |
| `scalesfare-logo-mono-black.svg` | One-colour print, engraving, stamps. |
| `scalesfare-logo-mono-white.svg` | Knockouts out of any single dark colour. |
| `scalesfare-symbol.svg` | The mark on its own. |
| `scalesfare-symbol-tile.svg` | App icon, social avatar, profile picture. |
| `scalesfare-wordmark.svg` | Rare — where the symbol already appears nearby. |
| `favicon.svg` · `favicon.ico` · `favicon-32.png` | Browser tabs. |
| `apple-touch-icon.png` | Saved to a phone home screen. |
| `*.png` | Conveniences at 1600px / 1200px / 800px / 512px wide. |
| `brand-sheet.html` | Source of the brand sheet PDF. |

## Colour

| | Hex | RGB | CMYK (unproofed) | Role |
|---|---|---|---|---|
| Blue Mountain | `#0B3B2E` | 11 · 59 · 46 | 81 · 0 · 22 · 77 | Primary |
| Pimento Gold | `#F4B41A` | 244 · 180 · 26 | 0 · 26 · 89 · 4 | Accent only |
| Jade | `#12A36B` | 18 · 163 · 107 | 89 · 0 · 34 · 36 | Secondary |
| Coconut | `#FBF8F1` | 251 · 248 · 241 | 0 · 1 · 4 · 2 | Paper |
| Coal | `#14120E` | 20 · 18 · 14 | 0 · 10 · 30 · 92 | Text on light |

The CMYK figures are a straight conversion, not a proofed build. Send a printer
the hex values and ask them to match on their own profile — and ask for a proof
of the green, which is the one that shifts.

Gold on a light ground fails text contrast. Keep it to shapes, never body copy.

## Type

| | Face | Weights |
|---|---|---|
| Display | Sora | 700, 800 |
| Body | Inter | 400, 500, 600 |
| Labels & figures | JetBrains Mono | 500 |

Sora and Inter are under the SIL Open Font License; JetBrains Mono under Apache
2.0. All three are free for commercial use, including in the wordmark outlines.

## Rebuilding the brand sheet

`brand-sheet.html` links the fonts from Google Fonts, so it opens correctly in a
browser. The PDF was printed from it with the fonts subsetted and inlined —
`Print → Save as PDF`, A4, margins none, background graphics on, gives the same
result on any machine that has the fonts.
