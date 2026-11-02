# YardScale Digital — website

The site for YardScale Digital, an app studio building from Jamaica. AgriLoop is
the first product.

Static HTML, no framework, no build dependencies. The favicon is inlined as a
data URI; everything else is a real file so the pages stay small (the homepage
is ~18 KB gzipped). The one piece of server-side code is a Vercel Function that
handles newsletter signups, because the Resend API key must never reach the
browser.

```
index.html                      the homepage — hero, studio, AgriLoop, journey,
                                products, roots, build log, founder, contact
journal.html                    the journal (no CMS yet — structure, honest empty state)
privacy.html                    privacy policy, linked from the signup form
404.html                        not-found page
api/subscribe.js                newsletter signup → Resend (server-side only)
og-image.png                    link preview image for WhatsApp / socials
vercel.json                     headers, caching, redirects, clean URLs, build command
build.sh                        stamps the live URL into the meta tags at deploy time
robots.txt  sitemap.xml         SEO
brand/                          YardScale logos + AgriLoop store assets
```

## 1. Deploy to Vercel

Push this repo to GitHub, then in Vercel: **Add New → Project → Import** this
repo. Leave the framework preset as **Other** and don't touch the build
settings — `vercel.json` already declares the build command, the output
directory and the clean-URL behaviour. First deploy takes well under a minute.

`cleanUrls` is on, so `/journal` and `/privacy` serve `journal.html` and
`privacy.html`, and the `.html` versions 308-redirect to the clean paths. The
file at `api/subscribe.js` is picked up automatically as a Vercel Function at
`/api/subscribe` — there is nothing to configure for it beyond the environment
variables in the next section.

To run it locally with the function working: `vercel dev`. To view the pages
alone without the function, any static server will do (`python3 -m http.server`),
or just open `index.html` from disk.

## 2. Turn the newsletter on (Resend)

Until the environment variables below are set, the signup endpoint returns a
clear "signups aren't switched on yet" message. It never pretends to have
subscribed anyone.

### Environment variables

Set these in **Vercel → your project → Settings → Environment Variables**. Tick
**Production**, **Preview** and **Development** for each — previews are where
you'll test before going live. Mark `RESEND_API_KEY` as **Sensitive** so it
can't be read back out of the dashboard afterwards.

| Variable | Required | What it is |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | From [resend.com/api-keys](https://resend.com/api-keys). **Secret — server-side only.** Never put it in HTML or a `NEXT_PUBLIC`-style variable. |
| `RESEND_AUDIENCE_ID` | yes | From [resend.com/audiences](https://resend.com/audiences) — the list subscribers are added to. |
| `NEWSLETTER_FROM` | no | The welcome email's From address, e.g. `YardScale Digital <updates@yourdomain.com>`. Must be on a domain verified in Resend. Leave it unset until you have one: signups still work, they just don't trigger a welcome email. |
| `NEWSLETTER_NOTIFY_TO` | no | Address that gets a one-line heads-up on each new subscriber. Needs `NEWSLETTER_FROM` set too. |

For local development, `vercel dev` reads these from `.env.local` in the repo
root; `vercel env pull .env.local` fetches the Development values straight from
the project. Both `.env` and `.env.local` are gitignored — never commit a key.

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

`api/subscribe.js` validates the email, drops bot submissions via a honeypot
field, rate-limits per IP as a speed bump, adds the contact to the
Resend audience, treats a repeat address as a success rather than an error, and
only then — if `NEWSLETTER_FROM` is set — sends the welcome and admin emails. A
failed welcome email never fails the subscription.

The per-IP limit is in-memory, so it resets whenever Vercel recycles the
instance and doesn't span concurrent ones. It's a speed bump, not a security
control. If the endpoint ever gets seriously abused, put **Vercel Firewall** or
**BotID** in front of `/api/subscribe` rather than trying to harden the counter.

## 3. Custom domain + Resend domain setup

The site works on the `.vercel.app` address from the first deploy, and switches
to your domain once you set it as the production domain and redeploy —
`build.sh` reads the address from Vercel's build-time environment, so no domain
is hard-coded anywhere and nothing has to be edited twice.

1. **Buy the domain.** No domain is assumed anywhere in this repo. (`yardscaledigital.com`
   appears in the Zero-to-Revenue repo's test fixtures as the intended address —
   worth checking before you pick something else.) You can buy it inside Vercel
   under **Domains**, which skips the DNS step below entirely.
2. **Vercel → your project → Settings → Domains → Add.** If the domain is
   registered elsewhere, Vercel shows the nameserver or A/CNAME records to set at
   your registrar. Set the new domain as the **production** domain.
3. **Redeploy once** so `build.sh` restamps the canonical and og:image URLs from
   `VERCEL_PROJECT_PRODUCTION_URL`. Until you redeploy, the meta tags still point
   at the `.vercel.app` address — the pages themselves are fine, only link
   previews are affected.
4. **Resend → Domains → Add domain.** Enter the same domain, or a subdomain such
   as `send.yourdomain.com`, which keeps your main domain's email reputation
   separate.
5. **Add the DNS records Resend gives you.** If the domain's DNS is on Vercel,
   add them under **Domains → your domain → DNS Records**; otherwise add them at
   your DNS host. You need the DKIM `TXT` record, the SPF `TXT` record on the
   sending subdomain, and the `MX` record for bounce handling. Add a DMARC `TXT`
   record at `_dmarc.yourdomain.com` too — `v=DMARC1; p=none; rua=mailto:you@yourdomain.com`
   is a safe start.
6. **Verify in Resend.** It can take anywhere from a few minutes to a few hours
   for DNS to propagate.
7. **Create the sending address** — `hello@` for replies, `updates@` for the
   build log. Both are fine; pick one for `NEWSLETTER_FROM`.
8. **Set `NEWSLETTER_FROM`** (and optionally `NEWSLETTER_NOTIFY_TO`) in Vercel
   and redeploy. Environment variable changes only reach a new deployment, so
   redeploying is not optional.
9. **Test the signup** on the live site with a real address you control: check
   the contact appears in the Resend audience, the welcome email arrives, it is
   not in spam, and the unsubscribe link works.
10. **Test the duplicate path** by subscribing the same address again — you
    should get the success state, not an error.

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
it after the fact. So `build.sh` substitutes `__SITE_URL__` at deploy time
across `index.html`, `journal.html`, `privacy.html`, `404.html`, `robots.txt`
and `sitemap.xml`, reading the address from Vercel's build environment:
`VERCEL_PROJECT_PRODUCTION_URL` on production deploys and `VERCEL_URL` on
previews, so a preview's link previews point at that preview. Setting `SITE_URL`
by hand overrides both, which is the escape hatch for any other host.

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
