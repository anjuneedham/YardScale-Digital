/**
 * Newsletter signup — the build log.
 *
 * A Vercel Function (Node.js runtime, Web Request/Response signature). This is
 * the ONLY place the Resend API key is ever read — it runs server-side, so the
 * key is never sent to the browser and never appears in the HTML. The page
 * posts JSON to /api/subscribe and gets JSON back.
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *
 *   RESEND_API_KEY          required. From resend.com/api-keys. Secret.
 *   RESEND_AUDIENCE_ID      required. From resend.com/audiences — the list the
 *                           subscriber is added to.
 *   NEWSLETTER_FROM         optional. The welcome email's From address, e.g.
 *                           "YardScale Digital <updates@yourdomain.com>".
 *                           Must be on a domain verified in Resend. If it is
 *                           not set, the subscriber is still added to the
 *                           audience and no welcome email is sent — the signup
 *                           works from day one, before a domain exists.
 *   NEWSLETTER_NOTIFY_TO    optional. Address that gets a one-line heads-up on
 *                           each new subscriber. Needs NEWSLETTER_FROM too.
 *
 * Until RESEND_API_KEY and RESEND_AUDIENCE_ID are set the endpoint returns a
 * clear 503 rather than pretending to have subscribed anyone.
 */

const RESEND_API = 'https://api.resend.com';

/** Deliberately conservative — Resend does the authoritative validation. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Per-instance, best-effort flood control. Vercel may run many concurrent
   instances and recycle them, so this is a speed bump for a single noisy
   client, not a security control — the honeypot and Resend's own duplicate
   handling do the real work. For anything stronger, put Vercel's Firewall /
   BotID in front of this route. */
const seen = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip) {
  const now = Date.now();
  const hits = (seen.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  seen.set(ip, hits);
  if (seen.size > 5000) seen.clear(); // crude ceiling; this is not a database
  return hits.length > MAX_PER_WINDOW;
}

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

async function handler(request) {
  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.error('subscribe: RESEND_API_KEY and/or RESEND_AUDIENCE_ID are not set.');
    return json(503, { error: 'Signups aren’t switched on yet. Email us instead and we’ll add you.' });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: 'Could not read that request.' });
  }

  // Honeypot: a real person never sees this field, so anything in it is a bot.
  // Answer 200 so the bot believes it succeeded and doesn't retry.
  if (typeof payload.companyWebsite === 'string' && payload.companyWebsite.trim() !== '') {
    return json(200, { ok: true });
  }

  const email = String(payload.email || '').trim().toLowerCase();
  const firstName = String(payload.firstName || '').trim().slice(0, 60);

  if (!email || email.length > 200 || !EMAIL_RE.test(email)) {
    return json(400, { error: 'That email address doesn’t look right — mind checking it?' });
  }

  // Vercel sets both; x-real-ip is already the single client address.
  const ip =
    request.headers.get('x-real-ip') ||
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown';
  if (rateLimited(ip)) {
    return json(429, { error: 'Too many attempts just now. Give it a minute.' });
  }

  // ── Add to the audience ───────────────────────────────────────────────
  // Resend treats a repeat address as an update, not an error, so a duplicate
  // signup is simply a success from the subscriber's point of view.
  let created;
  try {
    const res = await fetch(`${RESEND_API}/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        first_name: firstName || undefined,
        unsubscribed: false,
      }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      // 409 / "already exists" is a duplicate, which is a success here.
      const message = String(body?.message || body?.error?.message || '');
      if (res.status === 409 || /already/i.test(message)) {
        return json(200, { ok: true, duplicate: true });
      }
      console.error('subscribe: Resend contact create failed', res.status, message);
      return json(502, { error: 'We couldn’t complete that just now. Try again in a moment.' });
    }
    created = body;
  } catch (error) {
    console.error('subscribe: Resend request threw', error);
    return json(502, { error: 'We couldn’t reach the mailing list. Try again in a moment.' });
  }

  // ── Welcome + notify (optional, needs a verified sending domain) ──────
  const from = process.env.NEWSLETTER_FROM;
  if (from) {
    const hello = firstName ? `Hi ${firstName},` : 'Hi,';
    const send = (body) =>
      fetch(`${RESEND_API}/emails`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).catch((error) => {
        // A failed welcome email must never fail the subscription itself.
        console.error('subscribe: welcome/notify email failed', error);
      });

    await send({
      from,
      to: email,
      subject: 'You’re on the YardScale build log',
      text:
        `${hello}\n\n` +
        'Thanks for following the build. The build log goes out when there’s ' +
        'something real to report — products, experiments and what we learn ' +
        'building an app studio in Jamaica.\n\n' +
        'First up is AgriLoop, our first product: https://agriloopmain.vercel.app\n\n' +
        '— Andrew Needham, YardScale Digital\n\n' +
        'You can unsubscribe from any email we send.',
    });

    const notify = process.env.NEWSLETTER_NOTIFY_TO;
    if (notify) {
      await send({
        from,
        to: notify,
        subject: `New build log subscriber: ${email}`,
        text: `${email}${firstName ? ` (${firstName})` : ''} just subscribed.`,
      });
    }
  }

  return json(200, { ok: true, id: created?.id });
}

/* Vercel Node.js runtime: default export with a `fetch` method. */
export default { fetch: handler };
