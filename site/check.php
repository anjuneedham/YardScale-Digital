<?php
/**
 * One-off deployment check for yardscaledigital.com
 *
 * Visit https://yardscaledigital.com/check.php once after uploading, read the
 * answers, then DELETE THIS FILE. It prints no secrets and no phpinfo dump,
 * but there is no reason to leave a diagnostic on a live site.
 */

header('Content-Type: text/plain; charset=UTF-8');
header('X-Robots-Tag: noindex');

function yn($ok) { return $ok ? 'YES' : 'NO'; }
function val($k) { return isset($_SERVER[$k]) ? $_SERVER[$k] : '(not set)'; }

$here    = __DIR__;
$expect  = array('index.html', 'thanks.html', '404.html', 'send.php', '.htaccess', 'brand/yardscale-lockup-paper.png');

echo "YardScale Digital — deployment check\n";
echo str_repeat('=', 52) . "\n\n";

echo "PHP\n";
echo "  version .................. " . PHP_VERSION . "\n";
echo "  7.4 or newer ............. " . yn(version_compare(PHP_VERSION, '7.4', '>=')) . "\n";
echo "  mail() available ......... " . yn(function_exists('mail')) . "\n";
echo "  mbstring ................. " . yn(function_exists('mb_strlen')) . "\n\n";

echo "WHERE THE FILES ARE\n";
echo "  this script .............. " . $here . "\n";
echo "  document root ............ " . val('DOCUMENT_ROOT') . "\n";
$atRoot = rtrim($here, '/') === rtrim(val('DOCUMENT_ROOT'), '/');
echo "  sitting AT the web root .. " . yn($atRoot) . "\n";
if (!$atRoot) {
    echo "     ^ the files are in a SUBFOLDER. Move everything up one level so\n";
    echo "       index.html sits directly in public_html.\n";
}
echo "\n";

echo "FILES PRESENT\n";
foreach ($expect as $f) {
    printf("  %-34s %s\n", $f . ' ' . str_repeat('.', max(1, 30 - strlen($f))), yn(file_exists($here . '/' . $f)));
}
$stray = array();
foreach (array('index.php', 'default.html', 'default.htm', 'index.htm') as $f) {
    if (file_exists($here . '/' . $f)) { $stray[] = $f; }
}
echo "  leftover placeholder ..... " . ($stray ? implode(', ', $stray) . "  <-- DELETE THESE, they win over index.html" : 'none') . "\n\n";

echo "HOW THE SERVER SEES HTTPS   (this decides the redirect question)\n";
echo "  HTTPS .................... " . val('HTTPS') . "\n";
echo "  X-Forwarded-Proto ........ " . val('HTTP_X_FORWARDED_PROTO') . "\n";
echo "  X-Forwarded-SSL .......... " . val('HTTP_X_FORWARDED_SSL') . "\n";
echo "  SERVER_PORT .............. " . val('SERVER_PORT') . "\n";
echo "  REQUEST_SCHEME ........... " . val('REQUEST_SCHEME') . "\n\n";

echo "SERVER\n";
echo "  software ................. " . val('SERVER_SOFTWARE') . "\n";
echo "  host ..................... " . val('HTTP_HOST') . "\n";
if (function_exists('apache_get_modules')) {
    $mods = apache_get_modules();
    foreach (array('mod_rewrite', 'mod_headers', 'mod_deflate', 'mod_expires') as $m) {
        printf("  %-24s %s\n", $m . ' ' . str_repeat('.', 24 - strlen($m)), yn(in_array($m, $mods)));
    }
} else {
    echo "  (module list unavailable — normal on LiteSpeed / PHP-FPM)\n";
}
echo "\n";

echo str_repeat('=', 52) . "\n";
echo "Send this whole page back, then delete check.php.\n";
