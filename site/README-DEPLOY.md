# yardscaledigital.com — upload guide

Everything in this folder is the website. There is no build step: what is here
is exactly what goes on the server.

```
index.html          the whole site
thanks.html         where the contact form lands after a send
404.html            not-found page
send.php            contact form handler (replaces Netlify Forms)
.htaccess           HTTPS, canonical domain, caching, compression, 404
robots.txt          + sitemap.xml
og-image.png        link preview for WhatsApp / socials
favicon.ico         + favicon-32.png, apple-touch-icon.png, icon-512.png
brand/              logos
```

---

## 1. Upload

cPanel → **File Manager** → open **public_html** → **Upload**.

Upload the **contents** of this folder, not the folder itself. `index.html`
must sit directly in `public_html`, not in `public_html/site/`.

**`.htaccess` is a hidden file.** File Manager hides it by default and it is the
single most common thing to miss — without it you get no HTTPS redirect, no
www redirect and no custom 404. Turn on **Settings → Show Hidden Files (dotfiles)**
before you upload, then confirm it is listed afterwards.

If you drag a ZIP up instead, use File Manager's **Extract**, then delete the ZIP.

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
