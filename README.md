# YardScale Digital — website

The site for YardScale Digital, an app studio building from Jamaica. AgriLoop is
the first product.

Static HTML, no framework, no build dependencies. The favicon is inlined as a
data URI; everything else is a real file so the pages stay small (the homepage
is ~18 KB gzipped). The one piece of server-side code is a Netlify Function that
handles newsletter signups, because the Resend API key must never reach the
browser.

```
index.html                      the homepage — hero, studio, AgriLoop, journey,
                                products, roots, build log, founder, contact
journal.html                    the journal (no CMS yet — structure, honest empty state)
privacy.html                    privacy policy, linked from the signup form
404.html                        not-found page
netlify/functions/subscribe.mjs newsletter signup → Resend (server-side only)
og-image.png                    link preview image for WhatsApp / socials
netlify.toml                    headers, caching, redirects, functions directory
build.sh                        stamps the live URL into the meta tags at deploy time
robots.txt  sitemap.xml         SEO
brand/                          YardScale logos + AgriLoop store assets
```

## 1. Deploy to Netlify

Push this repo to GitHub, then in Netlify: **Add new site → Import an existing
project → GitHub → this repo**. Leave the build settings alone — `netlify.toml`
already declares them, including the functions directory. First deploy takes
about a minute.

> Don't use the drag-and-drop `app.netlify.com/drop` route. It skips the build
> step and the functions, which means link previews ship with an unresolved URL
> placeholder and the newsletter doesn't work.

## 2. Turn the newsletter on (Resend)

Until the environment variables below are set, the signup endpoint returns a
clear "signups aren't switched on yet" message. It never pretends to have
subscribed anyone.

### Environment variables

Set these in **Netlify → Site configuration → Environment variables**. Tick
**Production**, **Preview** and **Development** (the "Deploy contexts: all"
option) for each — previews are where you'll test before going live.

| Variable | Required | What it is |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | From [resend.com/api-keys](https://resend.com/api-keys). **Secret — server-side only.** Never put it in HTML or a `NEXT_PUBLIC`-style variable. |
| `RESEND_AUDIENCE_ID` | yes | From [resend.com/audiences](https://resend.com/audiences) — the list subscribers are added to. |
| `NEWSLETTER_FROM` | no | The welcome email's From address, e.g. `YardScale Digital <updates@yourdomain.com>`. Must be on a domain verified in Resend. Leave it unset until you have one: signups still work, they just don't trigger a welcome email. |
| `NEWSLETTER_NOTIFY_TO` | no | Address that gets a one-line heads-up on each new subscriber. Needs `NEWSLETTER_FROM` set too. |

For local development, `netlify dev` reads the same names from a `.env` file in
the repo root. `.env` is gitignored — never commit a key.

### Resend setup, in order

1. Create a Resend account and an **Audience** (Audiences → Create). Copy its ID
   into `RESEND_AUDIENCE_ID`.
2. Create an **API key** with send + audience access. Copy it into
   `RESEND_API_KEY`.
3. Deploy. Signups now land in the audience — this works before you own a
   domain, which is the point of making `NEWSLETTER_FROM` optional.
4. Once the domain is verified (section 3), set `NEWSLETTER_FROM` and new
   subscribers start getting a welcome email.

### What the function does

`netlify/functions/subscribe.mjs` validates the email, drops bot submissions via
a honeypot field, rate-limits per IP as a speed bump, adds the contact to the
Resend audience, treats a repeat address as a success rather than an error, and
only then — if `NEWSLETTER_FROM` is set — sends the welcome and admin emails. A
failed welcome email never fails the subscription.

## 3. Custom domain + Resend domain setup

The site works on the `.netlify.app` address from the first deploy, and switches
to your domain by itself once you set it as primary — `build.sh` stamps the live
URL into the meta tags, so nothing is hard-coded and nothing has to be edited
twice.

1. **Buy the domain.** No domain is assumed anywhere in this repo. (`yardscaledigital.com`
   appears in the Zero-to-Revenue repo's test fixtures as the intended address —
   worth checking before you pick something else.)
2. **Netlify → Domain management → Add a domain.** Point the registrar's
   nameservers or DNS records at Netlify as instructed, and set the new domain
   as **primary**. Redeploy once so `build.sh` restamps the canonical and
   og:image URLs.
3. **Resend → Domains → Add domain.** Enter the same domain (or a subdomain such
   as `send.yourdomain.com`, which keeps your main domain's email reputation
   separate).
4. **Add the DNS records Resend gives you** at your DNS host: the DKIM `TXT`
   record, the SPF `TXT` record on the sending subdomain, and the `MX` record for
   bounce handling. Add a DMARC `TXT` record at `_dmarc.yourdomain.com` too —
   `v=DMARC1; p=none; rua=mailto:you@yourdomain.com` is a safe start.
5. **Verify in Resend.** It can take anywhere from a few minutes to a few hours
   for DNS to propagate.
6. **Create the sending address** — `hello@` for replies, `updates@` for the
   build log. Both are fine; pick one for `NEWSLETTER_FROM`.
7. **Set `NEWSLETTER_FROM`** (and optionally `NEWSLETTER_NOTIFY_TO`) in Netlify
   and redeploy.
8. **Test the signup** on the live site with a real address you control: check
   the contact appears in the Resend audience, the welcome email arrives, it is
   not in spam, and the unsubscribe link works.
9. **Test the duplicate path** by subscribing the same address again — you should
   get the success state, not an error.

## 4. Contact details

The homepage shows the email from the config block near the bottom of
`index.html`:

```js
var CONFIG = {
  email: "yardscaledigital@gmail.com",
  phone: "",                                  // ← set this and a tel: line appears
  agriloop: "https://agriloopmain.vercel.app"
};
```

There is **no phone number anywhere in this repository**, so none was invented.
Put a real one in `CONFIG.phone` (e.g. `"+1 876 555 0123"`) and a tappable
`tel:` line is added to the contact section automatically. While it's empty,
nothing is shown — no placeholder, no fake number.

Swap `yardscaledigital@gmail.com` for the custom-domain address once it exists.
It appears in `index.html` (contact, footer, structured data), `journal.html`,
`privacy.html` and `404.html`:

```bash
grep -rl 'yardscaledigital@gmail.com' --include='*.html' .
```

## 5. Adding a journal post

There's no CMS, and no fake articles. `journal.html` ships with an honest empty
state and a commented-out post template directly below it. To publish the first
post: delete the `<div class="empty">` block, uncomment the `<article class="post">`
template, fill it in, and add the URL to `sitemap.xml`. A CMS can replace that
block later without touching anything else.

## How the URL stamping works

WhatsApp, iMessage and most link unfurlers only follow **absolute** `og:image`
URLs, and that has to be resolved before the HTML ships — the browser can't do
it after the fact. So `build.sh` substitutes `__SITE_URL__` with Netlify's `URL`
environment variable at deploy time, across `index.html`, `journal.html`,
`privacy.html`, `404.html`, `robots.txt` and `sitemap.xml`.

Opening `index.html` straight from disk still works — the placeholder just sits
there unresolved in the meta tags, which only affects previews, not the page.

## Brand tokens

| | |
|---|---|
| Ink | `#131313` |
| Paper | `#F9F8F4` |
| Lime | `#C3FC0F` |
| Display | Archivo (wide, 800) |
| Body | Instrument Sans |
| Labels | JetBrains Mono |

Unchanged from the previous site — the lime and ink are sampled straight off the
logo files, so the site matches the mark exactly. All three fonts load from
Google Fonts.
