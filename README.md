# YardScale Digital — website

Static site, no framework, no build dependencies. The logos are baked into the
HTML as data URIs, so the page renders even if nothing else uploads.

```
index.html      the whole site
thanks.html     where the contact form lands after a submit
404.html        not-found page
og-image.png    link preview image for WhatsApp / socials
netlify.toml    headers, caching, redirects
build.sh        stamps the live URL into the meta tags at deploy time
robots.txt      + sitemap.xml
brand/          logos as transparent PNGs
scales-fare/    the Scales Fare demo — see scales-fare/README.md
```

## The Scales Fare demo

`/scales-fare/` holds a self-contained portfolio piece: a demo site for a
point-of-sale supplier aimed at Jamaican small business, a full logo system with
a brand sheet, and a sixteen-page PDF lead magnet. It deploys with the rest of
the site and needs no separate setup. It is clearly labelled as a demo on every
page. Details in `scales-fare/README.md`.

## 1. Deploy to Netlify

Push this repo to GitHub, then in Netlify: **Add new site → Import an existing
project → GitHub → this repo**. Leave the build settings alone — `netlify.toml`
already declares them. First deploy takes about a minute.

Then **Site configuration → Domain management** to add your domain.

> Don't use the drag-and-drop `app.netlify.com/drop` route. It skips the build
> step, which means link previews ship with an unresolved URL placeholder.

## 2. Put your Google Calendar in

This is the only edit the site needs from you.

1. Google Calendar → **Create** → **Appointment schedule**
2. Set it to 20 minutes, pick your open hours, save
3. Open the schedule → **Share** → copy the link
4. In `index.html`, near the bottom, paste it between the quotes:

```js
const BOOKING_URL = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ...";
```

Either link Google offers works — share or embed. Anything missing `?gv=true`
gets it appended automatically, so you don't have to hunt for the right button.

Commit and push; Netlify redeploys on its own. Until you do this, the booking
section shows a setup card with these same steps rather than a broken frame —
nobody ever sees a blank box.

## 3. Turn the contact form on

The form uses Netlify Forms, so there's no backend. After the first deploy, go
to **Forms** in the Netlify dashboard, find `enquiry`, and add your email under
notifications. Submissions then land in your inbox, and the sender gets
`thanks.html`.

Spam is handled by a honeypot field (`company-website`) that real people never
see and never fill in.

## How the URL stamping works

WhatsApp, iMessage and most link unfurlers only follow **absolute** `og:image`
URLs, and that has to be resolved before the HTML ships — the browser can't do
it after the fact. So `build.sh` substitutes `__SITE_URL__` with Netlify's `URL`
environment variable at deploy time.

The practical effect: link previews work on the `.netlify.app` address
immediately, and switch to your custom domain by themselves the moment you set
it as primary. Nothing to remember, nothing to edit twice.

Opening `index.html` straight from disk still works — the placeholder just sits
there unresolved in the meta tags, which only affects previews, not the page.

## Swap before launch

- `yardscaledigital@gmail.com` — appears in the booking section, the footer,
  `thanks.html` and `404.html`
- The example chat in the hero is a car-rental booking. Change the `script`
  array near the bottom of `index.html` to match whichever client type you're
  selling to most.
- Footer social links — currently email and internal links only

## Brand tokens

| | |
|---|---|
| Ink | `#131313` |
| Paper | `#F9F8F4` |
| Lime | `#C3FC0F` |
| Display | Archivo (wide, 800) |
| Body | Instrument Sans |
| Labels | JetBrains Mono |

All three fonts load from Google Fonts. The lime and ink are sampled straight
off the logo files, so the site matches the mark exactly.
