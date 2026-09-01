<?php
/**
 * Contact form handler for yardscaledigital.com
 *
 * Netlify Forms handled this before the move; on Namecheap shared hosting it
 * is plain PHP. Posts land in INBOX_TO, the sender gets thanks.html, and
 * anything that fails validation goes back to the form with an error flag.
 *
 * The From: address must be ON THIS DOMAIN or the mail is rejected or binned
 * as spoofing — that is why it is noreply@yardscaledigital.com and not the
 * visitor's address. Their address goes in Reply-To, so hitting reply in your
 * inbox still writes back to them.
 */

const INBOX_TO   = 'yardscaledigital@gmail.com';
const MAIL_FROM  = 'noreply@yardscaledigital.com';
const SITE_NAME  = 'YardScale Digital';
const MAX_LEN    = 5000;

/** Send the visitor somewhere and stop. (No `never` return type — that is
 *  PHP 8.1+, and cPanel accounts are often still on 7.4.) */
function finish($path) {
    header('Location: ' . $path, true, 303);
    exit;
}

/** Strip CR/LF so a submitted value can never inject extra mail headers. */
function oneLine($v) {
    return trim(preg_replace('/[\r\n]+/', ' ', (string)$v));
}

/** mbstring is normally present on cPanel, but don't fatal if it isn't. */
function len($v) {
    return function_exists('mb_strlen') ? mb_strlen($v) : strlen($v);
}

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    finish('/#contact');
}

// Honeypot: a real person never sees this field, so anything in it is a bot.
// Answer with the thank-you page so the bot has no signal to tune against.
if (trim(isset($_POST['company-website']) ? (string)$_POST['company-website'] : '') !== '') {
    finish('/thanks.html');
}

$name    = oneLine(isset($_POST['name']) ? $_POST['name'] : '');
$contact = oneLine(isset($_POST['contact']) ? $_POST['contact'] : '');
$message = trim(isset($_POST['message']) ? (string)$_POST['message'] : '');

if ($name === '' || $contact === '' || $message === '') {
    finish('/?error=missing#contact');
}
if (len($name) > 200 || len($contact) > 300 || len($message) > MAX_LEN) {
    finish('/?error=length#contact');
}

// If they left an email address anywhere in the contact field, make replying
// one click instead of a copy-paste.
$replyTo = MAIL_FROM;
if (preg_match('/[\w.+-]+@[\w-]+\.[\w.-]+/', $contact, $m)) {
    $candidate = filter_var($m[0], FILTER_VALIDATE_EMAIL);
    if ($candidate !== false) {
        $replyTo = $candidate;
    }
}

$subject = sprintf('Website enquiry — %s', $name);

$body = implode("\n", [
    'New enquiry from the ' . SITE_NAME . ' website.',
    '',
    'Name:    ' . $name,
    'Contact: ' . $contact,
    '',
    'What is slowing them down:',
    $message,
    '',
    str_repeat('-', 48),
    'Sent:  ' . date('D, d M Y H:i:s T'),
    'IP:    ' . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown'),
    'Agent: ' . oneLine(isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'unknown'),
]);

$headers = implode("\r\n", [
    'From: ' . SITE_NAME . ' <' . MAIL_FROM . '>',
    'Reply-To: ' . $replyTo,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
]);

$sent = @mail(INBOX_TO, $subject, $body, $headers, '-f' . MAIL_FROM);

finish($sent ? '/thanks.html' : '/?error=send#contact');
