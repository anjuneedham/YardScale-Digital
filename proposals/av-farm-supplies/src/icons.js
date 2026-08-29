const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Fi = require('react-icons/fi');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WANT = {
  web: 'FiMonitor',
  organic: 'FiCalendar',
  paid: 'FiTarget',
  leads: 'FiInbox',
  check: 'FiCheck',
  clock: 'FiClock',
  refresh: 'FiRefreshCw',
  mail: 'FiMail',
};

(async () => {
  for (const [name, comp] of Object.entries(WANT)) {
    const Icon = Fi[comp];
    if (!Icon) { console.error('missing', comp); process.exit(1); }
    const svg = renderToStaticMarkup(
      React.createElement(Icon, { size: 512, color: '#131313', strokeWidth: 2 })
    );
    const buf = await sharp(Buffer.from(svg)).resize(512, 512).png().toBuffer();
    fs.writeFileSync(path.join(__dirname, 'icons', `icon-${name}.png`), buf);
    console.log('wrote icons/icon-' + name + '.png', buf.length);
  }
})();
