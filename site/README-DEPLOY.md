# yardscaledigital.com — upload guide

Everything in this folder is the website. There is no build step: what is here
is exactly what goes on the server.

```
index.html          the whole site
thanks.html         where the contact form lands after a send
404.html            not-found page
send.php            contact form handler (replaces Netlify Forms)
.htaccess           canonical domain, caching, compression, 404 (hidden file)
htaccess.txt        the same config, visible — rename it to .htaccess if the
                    dotfile didn't survive the upload
htaccess-minimal.txt safe-mode config, if the full one ever causes a 500
check.php           one-off deployment diagnostic — delete after using
robots.txt          + sitemap.xml
og-image.png        link preview for WhatsApp / socials
favicon.ico         + favicon-32.png, apple-touch-icon.png
brand/              logos
```

---

## 1. Upload

cPanel → **File Manager** → open **public_html** → **Upload**.

Upload the **contents** of this folder, not the folder itself. `index.html`
must sit directly in `public_html`, not in `public_html/site/`.

If you drag a ZIP up instead, use File Manager's **Extract**, then delete the ZIP.

### About `.htaccess`

It ships twice, on purpose:

- **`.htaccess`** — the real one. It is a hidden file, so File Manager will not
  show it unless you turn on **Settings → Show Hidden Files (dotfiles)**, and
  some cPanel extractors skip dotfiles altogether.
- **`htaccess.txt`** — the identical config as an ordinary, visible file. If you
  cannot see `.htaccess` after extracting, **rename `htaccess.txt` to
  `.htaccess`** (right-click → Rename). It disappears from the listing once
  renamed; that is expected, not a failure.

**A missing `.htaccess` does not stop the site loading.** You lose caching,
security headers, tidy URLs and the custom 404 — the pages still serve. The one
exception is a leftover `index.php` in `public_html`, because
`DirectoryIndex index.html` is what stops that file outranking yours. So if you
are looking at a placeholder, delete the placeholder first and sort out
`.htaccess` second.

## 2. Point the domain

If the domain and the hosting are both on Namecheap, connect them under
**Domain List → Manage → Nameservers → Namecheap Web Hosting DNS**.

Then in cPanel confirm `yardscaledigital.com` is the primary domain and that its
document root is `public_html`. DNS usually settles in under an hour; it can
take up to 24.

## 3. Turn on HTTPS

cPanel → **SSL/TLS Status** → tick the domain → **Run AutoSSL**. Free and
automatic on Namecheap shared hosting.

Wait until the padlock works before doing anything else — `.htaccess` forces
every visitor to `https://`, so if the certificate is not issued yet people get
a browser warning.

Once you have confirmed HTTPS works on every page, you can uncomment the
`Strict-Transport-Security` line in `.htaccess`. Do not do it before then: it
tells browsers to refuse plain HTTP for a year and is painful to undo.

## 4. Make the contact form deliver

`send.php` uses PHP's `mail()`, which is on by default. Two things make the
difference between arriving and going to spam:

1. **Set PHP to 7.4 or newer** — cPanel → **Select PHP Version**. 8.1+ preferred.
2. **Create the sender mailbox.** cPanel → **Email Accounts** → add
   `noreply@yardscaledigital.com`. Mail is sent *from* this address (mail from a
   Gmail address on your own domain gets rejected as spoofing). The visitor's
   own address goes in `Reply-To`, so hitting reply in Gmail still writes back
   to them.

Then **test it**: submit the form on the live site and check
`yardscaledigital@gmail.com`, including spam.

Where enquiries land is the `INBOX_TO` line at the top of `send.php`.

**If mail lands in spam** (common with shared-hosting `mail()`), the fix is to
send over authenticated SMTP instead — or point the form at Formspree and change
one attribute:

```html
<form class="rise" method="POST" action="https://formspree.io/f/YOUR_ID">
```

Also add an **SPF record** in cPanel → **Email Deliverability**; it is one click
and it is the single biggest thing you can do for inbox placement.

## 5. Two things to check after launch

- **The booking calendar.** `BOOKING_URL` near the bottom of `index.html` is set
  to the live Google Calendar schedule. Open the site and confirm the calendar
  loads in the Book section. To swap it: Google Calendar → **Create** →
  **Appointment schedule** → **Share** → paste the link between the quotes.
  Leave it empty and a setup card shows instead of a broken frame.
- **The link preview.** Paste `https://yardscaledigital.com` into WhatsApp and
  confirm the image and title come up. The `og:` tags use absolute URLs, so this
  works as soon as DNS resolves.

---

## If you uploaded and still see a Namecheap / "coming soon" page

There are only two causes, and they need opposite fixes. **Find out which one
first** — the test takes thirty seconds.

### The test: open the hosting account's temporary URL

Namecheap gives every cPanel account an address that bypasses the domain
entirely, so it works before DNS does. Find it in the Namecheap dashboard under
**Hosting List → Manage**, or in cPanel's right sidebar. It looks like:

```
http://serverNNN.web-hosting.com/~yourcpanelusername/
```

- **The site shows there** → the files are fine. **It is DNS.** Go to A below.
- **You still get a placeholder there** → DNS is fine. **It is the files.** Go to B.

### A. DNS — the domain isn't pointed at the hosting

Buying a domain and buying hosting does not connect them; that is a separate
step people miss constantly.

Namecheap dashboard → **Domain List → Manage → Nameservers** → choose
**Namecheap Web Hosting DNS** → save. Then in cPanel confirm
`yardscaledigital.com` is listed under **Domains** with its document root set
to `public_html`.

Give it an hour. A parking page cached in your browser can outlive the change —
check in a private window.

### B. Files — something outranks index.html

Apache serves the first match in its `DirectoryIndex` list, and on a fresh
Namecheap account that list usually puts **`index.php` before `index.html`**.
Namecheap drops a placeholder `index.php` into `public_html` on setup, so it
keeps winning even though your `index.html` is sitting right next to it.

In cPanel **File Manager → public_html**:

1. **Settings → Show Hidden Files (dotfiles)** — turn this on first, or you
   cannot see `.htaccess` and half of what follows is invisible.
2. **Delete** any of these that exist: `index.php`, `default.html`,
   `default.htm`, `index.htm`.
3. Confirm `index.html` sits **directly** in `public_html` — not in
   `public_html/site/` or `public_html/yardscaledigital-public_html/`. If it is
   one level down, select all and **Move** it up.
4. Confirm `.htaccess` is there. Its `DirectoryIndex index.html` line is what
   stops this happening again.

### Still stuck? Let the server answer

Upload `check.php`, visit `https://yardscaledigital.com/check.php` (or the temp
URL above), and send the page back. It reports the PHP version, whether the
files landed at the web root or in a subfolder, which expected files are
missing, any leftover placeholder that would outrank `index.html`, and how the
server reports SSL. **Delete it once you're done.**

### A 500 error or a redirect loop instead?

That is always `.htaccess`. Delete it, rename `htaccess-minimal.txt` to
`.htaccess`, reload. If that fixes it, tell me which directive was rejected and
I'll adjust — do not just leave the minimal one in place, you lose compression
and caching.

Do **not** add a force-HTTPS rule to `.htaccess` by hand. Use cPanel →
**Domains → Force HTTPS Redirect**; it knows how the server is fronted and
cannot cause the loop that a hand-written rule can.

## Editing later

Everything is one file per page with the CSS at the top — open `index.html`,
change the text, re-upload it. No build, no framework, no dependencies.

Brand tokens are the `:root` block at the top of each page:

| | |
|---|---|
| Ink | `#131313` |
| Paper | `#F9F8F4` |
| Lime | `#C3FC0F` |
| Display | Archivo 800 |
| Body | Instrument Sans |
| Labels | JetBrains Mono |

The fonts load from Google Fonts. The page stays perfectly readable if that
request is ever blocked — every family declares a real fallback stack.

HTML is served with `must-revalidate`, so an edit you upload is live on refresh.
Images and CSS are cached for a year; if you replace `og-image.png` or a logo and
still see the old one, that is the cache — rename the file or hard-refresh.
