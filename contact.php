<?php
/**
 * YardScale Digital — enquiry + booking capture.
 *
 * Namecheap shared hosting (cPanel) runs PHP with mail() wired to the server's
 * MTA, so this needs no library, no API key and no third-party form service.
 * Drop it in public_html next to index.html and it works.
 *
 * Two entry points post here:
 *   source=booking   the gate in front of the calendar — replies with the
 *                    Google Calendar link once the details are captured
 *   source=enquiry   the "not ready for a call" form at the foot of the page
 *
 * It answers JSON to fetch() and a 303 redirect to a browser, so the form
 * still works with JavaScript switched off.
 */

// ─────────────────────────── SETTINGS ───────────────────────────

// Where enquiries land. Create this mailbox in cPanel → Email Accounts.
const TO_EMAIL = 'andrew@yardscaledigital.com';

// The envelope sender. MUST be a real mailbox on this domain — a Gmail or
// Outlook address here gets the mail binned by SPF/DMARC before it lands.
const FROM_EMAIL = 'website@yardscaledigital.com';

// Where the booking gate sends people once their details are captured.
const BOOKING_URL = 'https://calendar.app.google/Lr4EwPBgc7azDz7X7';

// Copies of every submission, in case mail delivery ever hiccups.
const LOG_DIR = __DIR__ . '/_private';

// Per-IP throttle: this many submissions per hour.
const RATE_LIMIT = 6;

// A form completed faster than this is a bot, not a person.
const MIN_SECONDS = 3;

// ─────────────────────────── PLUMBING ───────────────────────────

/** True when the caller wants JSON back rather than a page. */
function wants_json(): bool {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $xhr    = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    return str_contains($accept, 'application/json') || $xhr === 'XMLHttpRequest';
}

/** Ends the request, in whichever shape the caller asked for. */
function finish(bool $ok, string $message, int $status = 200, array $extra = []): never {
    if (wants_json()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message] + $extra);
        exit;
    }
    if ($ok) {
        header('Location: /thanks.html?' . http_build_query($extra + ['ok' => 1]), true, 303);
        exit;
    }
    // No-JS failure: send them back to the form with the reason in the URL.
    // Query first, fragment last — the other order is not a valid URL.
    header('Location: /?error=' . rawurlencode($message) . '#book', true, 303);
    exit;
}

/** Collapses whitespace and strips anything that could forge a mail header. */
function clean(string $key, int $max = 400): string {
    $raw = (string) ($_POST[$key] ?? '');
    $raw = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $raw);
    $raw = trim(preg_replace('/[ \t]+/', ' ', $raw));
    return mb_substr($raw, 0, $max);
}

/** Multi-line fields keep their newlines but lose the header-injection risk. */
function clean_multiline(string $key, int $max = 4000): string {
    $raw = str_replace("\r\n", "\n", (string) ($_POST[$key] ?? ''));
    return mb_substr(trim($raw), 0, $max);
}

function client_ip(): string {
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

/**
 * File-backed hourly throttle. Keyed on a hash of the IP so the counter
 * file never becomes a list of visitor addresses.
 */
function under_rate_limit(): bool {
    if (!is_dir(LOG_DIR) && !@mkdir(LOG_DIR, 0750, true) && !is_dir(LOG_DIR)) {
        return true; // Can't track it, so don't punish a real enquiry for it.
    }
    $file = LOG_DIR . '/rate-' . substr(hash('sha256', client_ip()), 0, 16) . '.txt';
    $now  = time();
    $hits = array_filter(
        is_readable($file) ? (array) explode(',', (string) file_get_contents($file)) : [],
        static fn($t) => is_numeric($t) && $now - (int) $t < 3600
    );
    if (count($hits) >= RATE_LIMIT) {
        return false;
    }
    $hits[] = $now;
    @file_put_contents($file, implode(',', $hits), LOCK_EX);
    return true;
}

/** Appends the submission to a CSV that lives outside the web root's reach. */
function log_submission(array $fields): void {
    if (!is_dir(LOG_DIR) && !@mkdir(LOG_DIR, 0750, true) && !is_dir(LOG_DIR)) {
        return;
    }
    // Belt and braces: the directory is denied in .htaccess, and denied again here.
    $guard = LOG_DIR . '/.htaccess';
    if (!file_exists($guard)) {
        @file_put_contents($guard, "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
    }
    $csv = LOG_DIR . '/enquiries.csv';
    $new = !file_exists($csv);
    if ($fh = @fopen($csv, 'a')) {
        if (flock($fh, LOCK_EX)) {
            if ($new) {
                fputcsv($fh, ['received', 'source', 'name', 'email', 'business', 'message']);
            }
            fputcsv($fh, [
                gmdate('c'),
                $fields['source'],
                $fields['name'],
                $fields['email'],
                $fields['business'],
                $fields['message'],
            ]);
            flock($fh, LOCK_UN);
        }
        fclose($fh);
    }
}

// ─────────────────────────── REQUEST ───────────────────────────

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    finish(false, 'Send this form with POST.', 405);
}

// Honeypot. Real people never see this field, so anything in it is a bot —
// answer as though it worked so the bot has nothing to learn from.
if (clean('company-website') !== '') {
    finish(true, 'Thanks — we\'ll be in touch.', 200, ['booking_url' => BOOKING_URL]);
}

// Time trap: the form stamps its render time, a script fills and fires instantly.
$rendered = (int) ($_POST['rendered_at'] ?? 0);
if ($rendered > 0 && (time() - $rendered) < MIN_SECONDS) {
    finish(true, 'Thanks — we\'ll be in touch.', 200, ['booking_url' => BOOKING_URL]);
}

if (!under_rate_limit()) {
    finish(false, 'That\'s a few too many in a row — email ' . TO_EMAIL . ' and it\'ll reach us just the same.', 429);
}

$source   = clean('source', 20) === 'booking' ? 'booking' : 'enquiry';
$name     = clean('name', 120);
$email    = clean('email', 200);
$business = clean('business', 200);
$message  = clean_multiline('message');

if ($name === '') {
    finish(false, 'Please add your name.', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    finish(false, 'That email address doesn\'t look right.', 422);
}
// The booking gate asks for less — only the long form insists on a message.
if ($source === 'enquiry' && $message === '') {
    finish(false, 'Tell us what\'s slowing you down and we\'ll reply with something useful.', 422);
}

$fields = compact('source', 'name', 'email', 'business', 'message');
log_submission($fields);

$subject = $source === 'booking'
    ? "Booking started — {$name}"
    : "Website enquiry — {$name}";

$lines = [
    $source === 'booking'
        ? 'Someone filled in the booking gate and was sent to your calendar.'
        : 'Someone sent the enquiry form at the foot of the site.',
    '',
    "Name:     {$name}",
    "Email:    {$email}",
    "Business: " . ($business !== '' ? $business : '—'),
    '',
    'What they said:',
    $message !== '' ? $message : '—',
    '',
    str_repeat('─', 46),
    'Received: ' . gmdate('D, d M Y H:i') . ' UTC',
    'Page:     ' . ($_SERVER['HTTP_REFERER'] ?? 'unknown'),
];

$headers = [
    'From'         => 'YardScale Digital <' . FROM_EMAIL . '>',
    'Reply-To'     => $name . ' <' . $email . '>',
    'Content-Type' => 'text/plain; charset=utf-8',
    'X-Mailer'     => 'yardscaledigital.com',
];
$header_string = '';
foreach ($headers as $key => $value) {
    $header_string .= $key . ': ' . $value . "\r\n";
}

$sent = @mail(
    TO_EMAIL,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    implode("\n", $lines),
    $header_string,
    '-f' . FROM_EMAIL
);

if (!$sent) {
    // The CSV already has it, so this is recoverable — say so rather than
    // pretending, and give them a route that doesn't depend on our server.
    finish(false, 'Our mail server didn\'t take that. Email ' . TO_EMAIL . ' directly and we\'ll pick it up.', 500);
}

finish(true, 'Got it.', 200, ['booking_url' => BOOKING_URL, 'source' => $source]);
