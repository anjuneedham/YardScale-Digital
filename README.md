# YardScale Digital — website

Static HTML plus one small PHP file, built for **Namecheap shared hosting
(cPanel)**. No framework, no node_modules, no build step on the server. The
logos are baked into the HTML as data URIs, so the page renders even if
nothing else uploads.

```
index.html      the whole site
contact.php     the form handler — emails you, logs a copy
thanks.html     where a no-JavaScript submit lands
404.html        not-found page
.htaccess       https, www redirect, caching, security headers
og-image.png    link preview image for WhatsApp / socials
robots.txt      + sitemap.xml
brand/          logos as transparent PNGs
build.sh        checks everything, then packages dist/ + a zip
deploy/         optional scripts: FTP upload, Namecheap DNS API
```

Live at **https://yardscaledigital.com** · enquiries go to
**andrew@yardscaledigital.com**

---

## Your three questions, answered first

### "Can I get an API for Namecheap?"

Yes — but not for what you're hoping.

**The Namecheap API does:** register/renew/transfer domains, read and write
DNS records, order SSL certificates, manage email forwarding.
**It does not:** upload files, deploy websites, or touch anything inside
cPanel. There is no "publish my site" endpoint. That is not a limitation
you can work around; it's simply outside what the API covers.

So the answer splits in two:

| What you want to automate | Use |
|---|---|
| Pointing the domain at your server, DNS records | Namecheap API — `deploy/namecheap-dns.sh` |
| Getting the site files onto the server | FTP — `deploy/ftp-deploy.sh` |

Getting an API key: namecheap.com → **Profile → Tools → Namecheap API
Access** → toggle on. Two things trip people up:

1. **Eligibility.** You need 20+ domains, OR $50+ account balance, OR $50+
   spent in the last two years. One domain on its own usually isn't enough —
   topping the balance up to $50 is the normal fix.
2. **IP whitelisting.** You must add the IP address you'll call from, on
   that same page. Calls from anywhere else are refused, and the error looks
   like a bad key, so people burn an afternoon regenerating keys that were
   fine all along.

### "How do I upload?"

Three ways, easiest first. **Option A is the one to use the first time.**

#### A. cPanel File Manager (no tools, ~5 minutes)

```bash
./build.sh          # produces yardscale-site.zip
```

1. Namecheap → **Account → Dashboard → Hosting List → Manage → Go to cPanel**
2. **Files → File Manager → public_html**
3. Delete the `default.html` placeholder if one is sitting there
4. **Upload** → pick `yardscale-site.zip` → wait for 100%
5. Back in `public_html`, right-click the zip → **Extract** → Extract Files
6. Delete the zip
7. Click **Settings** (top right) → tick **Show Hidden Files** → confirm
   `.htaccess` is there. It carries the https redirect and the security
   headers, and cPanel hides it by default so it's easy to think it vanished.

#### B. FTP, scripted (best for repeat deploys)

```bash
cp deploy/ftp-credentials.example deploy/.ftp-credentials
# fill it in from cPanel → Files → FTP Accounts
chmod 600 deploy/.ftp-credentials

./build.sh
./deploy/ftp-deploy.sh          # dry run — shows what would change
./deploy/ftp-deploy.sh --live   # actually upload
```

Needs `lftp` (`brew install lftp` / `sudo apt install lftp`). It uploads only
changed files and never touches `_private/`, where your live enquiries are.

#### C. Git, from cPanel

cPanel → **Files → Git Version Control** → Create, clone this repo, then
**Manage → Pull or Deploy**. Tidy if you're already pushing to GitHub, but
it needs a `.cpanel.yml` and is more setup than it saves for a site this
size. Start with A.

### "The booking should capture contacts, then link to my Google Calendar"

Done — that's the main change in this version. See below.

---

## How the booking flow now works

It used to drop a Google Calendar iframe straight onto the page. If someone
looked and left, you got nothing. Now it's two steps:

**Step 1** — a short form: name, email, business and what they want fixed
(the last two optional). Nothing else is shown.

**Step 2** — on submit, the panel flips to *"Thanks Sam — now grab your
slot"* with a button through to your calendar, plus a smaller
"pick a time without leaving this page" link that loads the embed inline.

The point: **an abandoned booking is still a lead.** You get the email the
moment they finish step 1, whether or not they ever pick a slot.

It works without JavaScript — the form posts to `contact.php`, which
redirects to `thanks.html`, and that page shows the same calendar button.

To change the calendar, edit **both**:
- `index.html` → `const BOOKING_URL = "…"` near the bottom
- `contact.php` → `const BOOKING_URL = '…'` near the top

`./build.sh` fails loudly if the two ever drift apart.

---

## Setting up before launch

### 1. Create the mailbox

`contact.php` sends **to** `andrew@yardscaledigital.com` and **from**
`website@yardscaledigital.com`. Both need to exist:

cPanel → **Email → Email Accounts → Create**, once for each.

> The "from" address must be on your own domain. Putting a Gmail address
> there gets the mail binned by SPF/DMARC before it reaches you — this is the
> single most common reason a working contact form appears to send nothing.

Namecheap shared hosting includes mailboxes at no extra cost. Read your mail
at `https://yardscaledigital.com/webmail`, or connect Gmail/Outlook using the
IMAP settings cPanel shows under **Connect Devices**.

### 2. Check SPF exists

cPanel → **Email → Email Deliverability**. If it flags a problem, hit
**Repair**. Two minutes, and it's the difference between landing in the inbox
and landing in spam.

### 3. Point the domain

Get your server IP: cPanel → **General Information → Shared IP Address**.

Then either Namecheap → **Domain List → Manage → Advanced DNS**, adding
`A @ → <ip>` and `A www → <ip>`; or with the API:

```bash
./deploy/namecheap-dns.sh list            # see what's there now
./deploy/namecheap-dns.sh point 1.2.3.4   # set both A records
```

> `point` replaces **every** DNS record on the domain — that's how
> Namecheap's `setHosts` endpoint works, not a choice this script makes. Run
> `list` first and keep a copy of any MX records, or your new email stops
> working. The script makes you type REPLACE before it will proceed.

If your domain and hosting are both at Namecheap, the nameservers are usually
already right and there's nothing to do here.

### 4. Turn on SSL

cPanel → **Security → SSL/TLS Status** → **Run AutoSSL**. Free, renews
itself. Do this *after* DNS resolves, or issuance fails.

The `.htaccess` forces https, so until the certificate exists the site will
redirect to an address that doesn't work yet. Ten minutes of ugly, then fine.

### 5. Test it

Submit the booking form yourself and confirm the email arrives. Then check
`_private/enquiries.csv` in File Manager — every submission is logged there
too, so nothing is lost even if mail delivery breaks.

---

## Day-to-day

**Change some copy?** Edit `index.html`, run `./build.sh`, upload. Or edit it
directly in cPanel's File Manager for a one-word fix.

**Where do enquiries go?** Your inbox, plus `_private/enquiries.csv` as a
backup. That folder is denied to the web by two separate rules — nobody can
read it over the internet.

**Spam?** Three defences, all invisible to real people: a honeypot field, a
timing trap (anything submitted within 3 seconds is a bot), and a limit of 6
submissions per IP per hour. No captcha, nothing for visitors to solve.

---

## Swap before launch

- The example chat in the hero is a car-rental booking. Change the `script`
  array near the bottom of `index.html` to match whichever client type you're
  selling to most.
- Footer social links — currently email and internal links only.

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
