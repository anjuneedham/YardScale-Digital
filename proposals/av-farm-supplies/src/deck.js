const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..', '..', '..');
const HERE = __dirname;

// ---------- brand tokens (from YardScale Digital site: index.html / README.md) ----------
const INK   = '131313';
const PAPER = 'F9F8F4';
const LIME  = 'C3FC0F';
const RULE  = 'DEDBD2';
const RULED = '2E2E2B';
const MUTED = '6B6B62';
const MUTEDD= '8F8F86';
const WHITE = 'FFFFFF';

const DISPLAY = 'Arial';       // stands in for Archivo
const BODY    = 'Calibri';     // stands in for Instrument Sans
const MONO    = 'Courier New'; // stands in for JetBrains Mono

const W = 13.333, H = 7.5;
const M = 0.72;                // page margin

const img = (f) => 'image/png;base64,' + fs.readFileSync(f).toString('base64');
const brand = (f) => img(path.join(REPO, 'brand', f));
const icon  = (f) => img(path.join(HERE, 'icons', f));
const LOGO_PAPER = brand('yardscale-lockup-paper.png');
const ICON = {
  web: icon('icon-web.png'),
  organic: icon('icon-organic.png'),
  paid: icon('icon-paid.png'),
  leads: icon('icon-leads.png'),
  check: icon('icon-check.png'),
  clock: icon('icon-clock.png'),
  refresh: icon('icon-refresh.png'),
  mail: icon('icon-mail.png'),
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'YardScale Digital';
pres.company = 'YardScale Digital';
pres.title = 'AV Farm Supplies Proposal';

// ---------- shared pieces ----------

// The one repeated motif: a small lime square + mono label, top-left of every slide.
function eyebrow(slide, text, dark) {
  slide.addShape(pres.ShapeType.rect, {
    x: M, y: 0.5, w: 0.11, h: 0.11, fill: { color: LIME }, line: { width: 0 },
  });
  slide.addText(text.toUpperCase(), {
    x: M + 0.22, y: 0.4, w: 7, h: 0.3, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 10, charSpacing: 1.6,
    color: dark ? MUTEDD : MUTED, valign: 'middle',
  });
}

function pageNo(slide, n, dark) {
  slide.addText(String(n).padStart(2, '0'), {
    x: W - M - 0.7, y: 0.4, w: 0.7, h: 0.3, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 10, charSpacing: 1.4, align: 'right',
    color: dark ? MUTEDD : MUTED, valign: 'middle',
  });
}

function title(slide, text, dark, opts = {}) {
  slide.addText(text, {
    x: M, y: opts.y ?? 0.95, w: opts.w ?? 9.2, h: opts.h ?? 0.85, isTextBox: true, margin: 0,
    fontFace: DISPLAY, fontSize: opts.size ?? 38, bold: true, charSpacing: -0.9,
    color: dark ? PAPER : INK, valign: 'top', lineSpacing: opts.lineSpacing ?? 40,
  });
}

// icon in a lime disc — the secondary motif
function iconDisc(slide, key, x, y, d = 0.62) {
  slide.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d, fill: { color: LIME }, line: { width: 0 },
  });
  const p = d * 0.30;
  slide.addImage({ data: ICON[key], x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
}

function newSlide(dark) {
  const s = pres.addSlide();
  s.background = { color: dark ? INK : PAPER };
  return s;
}

// =======================================================================
// 1 — Cover
// =======================================================================
{
  const s = newSlide(true);
  s.addImage({ data: LOGO_PAPER, x: M, y: 0.62, w: 2.5, h: 0.513 });

  s.addText('Proposal  ·  YSD-2026-AVF', {
    x: W - M - 4.5, y: 0.68, w: 4.5, h: 0.3, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 10.5, charSpacing: 1.4, color: MUTEDD, align: 'right',
  });
  s.addText('Issued 29 August 2026  ·  Valid to 12 September 2026', {
    x: W - M - 5.4, y: 0.98, w: 5.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 10.5, charSpacing: 1.4, color: MUTEDD, align: 'right',
  });

  s.addShape(pres.ShapeType.rect, {
    x: M, y: 2.0, w: 0.16, h: 0.16, fill: { color: LIME }, line: { width: 0 },
  });
  s.addText('PREPARED FOR AV FARM SUPPLIES', {
    x: M + 0.32, y: 1.88, w: 8, h: 0.35, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 12, charSpacing: 2, color: LIME, valign: 'middle',
  });

  s.addText('Landing page,\ncontent, and\nleads in 30 days.', {
    x: M, y: 2.45, w: 8.4, h: 2.78, isTextBox: true, margin: 0,
    fontFace: DISPLAY, fontSize: 54, bold: true, charSpacing: -1.6,
    color: PAPER, lineSpacing: 58, valign: 'top',
  });

  s.addText(
    'One page that converts, your existing content pushed out organically and behind paid spend, and every enquiry landing somewhere you can act on it.',
    { x: M, y: 5.38, w: 6.4, h: 0.9, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 15, color: MUTEDD, lineSpacing: 21 }
  );

  // total block, right
  s.addShape(pres.ShapeType.rect, {
    x: 8.55, y: 4.55, w: 4.06, h: 1.72, fill: { color: '1D1D1B' }, line: { color: RULED, width: 1 },
  });
  s.addText('TOTAL — FIXED', {
    x: 8.9, y: 4.8, w: 3.4, h: 0.28, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 10.5, charSpacing: 1.8, color: MUTEDD,
  });
  s.addText(
    [ { text: 'JMD ', options: { fontSize: 20, color: PAPER } },
      { text: '$40,000', options: { fontSize: 42, color: LIME } } ],
    { x: 8.9, y: 5.18, w: 3.4, h: 0.8, isTextBox: true, margin: 0,
      fontFace: DISPLAY, bold: true, charSpacing: -1.2, valign: 'middle' }
  );

  s.addText('YardScale Digital  ·  yardscaledigital@gmail.com', {
    x: M, y: 6.72, w: 8, h: 0.3, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 10, charSpacing: 1.2, color: MUTEDD,
  });
  s.addNotes('Cover. Fixed price of JMD $40,000 for a 30-day engagement: landing page, organic and paid distribution of existing content, and lead generation.');
}

// =======================================================================
// 2 — The short version
// =======================================================================
{
  const s = newSlide(false);
  eyebrow(s, 'The short version', false);
  pageNo(s, 2, false);
  title(s, 'What you get, in a paragraph', false);

  s.addText(
    'Your landing page is built. Over the next thirty days we put it to work: your existing photos and video reformatted and posted on a schedule that holds, paid campaigns behind the pieces that perform, and every lead that comes back captured in one place with a name, a number and what they asked about. At day 30 you get the numbers and a written next step — and you can carry on month to month.',
    { x: M, y: 2.05, w: 7.0, h: 2.4, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 17, color: INK, lineSpacing: 27 }
  );

  const facts = [
    ['Client',     'AV Farm Supplies'],
    ['Engagement', '30 days'],
    ['Total',      'JMD $40,000'],
    ['Deposit',    'JMD $20,000'],
  ];
  let fy = 2.05;
  facts.forEach(([k, v], i) => {
    const money = i >= 2;   // the two figures get the ink treatment — money is the emphasis
    s.addShape(pres.ShapeType.rect, {
      x: 8.35, y: fy, w: 4.26, h: 0.86,
      fill: { color: money ? INK : WHITE }, line: { color: money ? INK : RULE, width: 1 },
    });
    s.addText(k.toUpperCase(), {
      x: 8.65, y: fy + 0.12, w: 3.7, h: 0.25, isTextBox: true, margin: 0,
      fontFace: MONO, fontSize: 9.5, charSpacing: 1.6, color: money ? MUTEDD : MUTED,
    });
    s.addText(v, {
      x: 8.65, y: fy + 0.38, w: 3.7, h: 0.36, isTextBox: true, margin: 0,
      fontFace: DISPLAY, fontSize: 16, bold: true, charSpacing: -0.4,
      color: money ? LIME : INK,
    });
    fy += 1.02;
  });

  s.addText('BY DAY 30 YOU HAVE', {
    x: M, y: 4.72, w: 5, h: 0.26, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 9.5, charSpacing: 1.6, color: MUTED,
  });
  const got = [
    'A landing page you own outright, documented and handed over',
    'Thirty days of posting and paid spend, managed end to end',
    'A written report on leads, cost per lead and what to do next',
  ];
  let gy = 5.08;
  got.forEach((t) => {
    iconDisc(s, 'check', M, gy, 0.34);
    s.addText(t, {
      x: M + 0.52, y: gy - 0.02, w: 6.6, h: 0.38, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 14, color: INK, valign: 'middle',
    });
    gy += 0.46;
  });
  s.addNotes('Summary slide. Emphasise: fixed price, no surprise billing, and that day 30 ends with real numbers rather than a renewal conversation in the dark.');
}

// =======================================================================
// 3 — Included: web + organic
// =======================================================================
function scopeSlide(n, headline, blocks, note) {
  const s = newSlide(false);
  eyebrow(s, "What's included", false);
  pageNo(s, n, false);
  title(s, headline, false);

  let x = M;
  const cw = (W - 2 * M - 0.55) / 2;
  blocks.forEach((b) => {
    s.addShape(pres.ShapeType.rect, {
      x, y: 2.05, w: cw, h: note ? 3.7 : 4.35, fill: { color: WHITE }, line: { color: RULE, width: 1 },
    });
    iconDisc(s, b.icon, x + 0.42, 2.42);
    s.addText(b.tag.toUpperCase(), {
      x: x + 1.2, y: 2.44, w: cw - 1.6, h: 0.25, isTextBox: true, margin: 0,
      fontFace: MONO, fontSize: 9.5, charSpacing: 1.6, color: MUTED,
    });
    s.addText(b.title, {
      x: x + 1.2, y: 2.68, w: cw - 1.6, h: 0.4, isTextBox: true, margin: 0,
      fontFace: DISPLAY, fontSize: 17, bold: true, charSpacing: -0.5, color: INK,
    });
    s.addText(
      b.items.map((t, i) => ({
        text: t,
        options: { bullet: { characterCode: '2013' }, breakLine: i !== b.items.length - 1 },
      })),
      { x: x + 0.42, y: 3.28, w: cw - 0.84, h: (note ? 3.7 : 4.35) - 1.4, isTextBox: true, margin: 0,
        fontFace: BODY, fontSize: 13.5, color: INK, lineSpacing: 18, paraSpaceAfter: 7 }
    );
    x += cw + 0.55;
  });

  if (note) {
    s.addShape(pres.ShapeType.rect, {
      x: M, y: 6.19, w: 0.13, h: 0.13, fill: { color: LIME }, line: { width: 0 },
    });
    s.addText(note, {
      x: M + 0.3, y: 5.98, w: W - 2 * M - 0.3, h: 0.56, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 13, color: MUTED, valign: 'middle', lineSpacing: 18,
    });
  }
  return s;
}

scopeSlide(3, 'The page, and the posting', [
  {
    icon: 'web', tag: 'Web', title: 'The landing page, live and yours',
    items: [
      'One page with one job — turn a visit into an enquiry',
      'Mobile-first, built to load fast on local mobile data',
      'Enquiry form plus click-to-chat into your WhatsApp',
      'Products, prices and delivery areas laid out plainly',
      'Hosting configured, domain connected, analytics wired in',
      'Handed over documented — nothing you run depends on us',
    ],
  },
  {
    icon: 'organic', tag: 'Organic', title: 'Your content, posted properly',
    items: [
      'Built from content you already have — product shots, yard photos, video',
      'Reformatted, captioned and cut for each platform',
      'A posting calendar built and run by us for the full 30 days',
      'Hooks and angles tested against each other, not guessed at',
      'What performs gets made again; what doesn’t gets dropped',
    ],
  },
]).addNotes('Scope part one. The page is the destination; organic is the free traffic feeding it from content they already own — no new shoot required.');

// =======================================================================
// 4 — Included: paid + leads
// =======================================================================
scopeSlide(4, 'The spend, and the leads', [
  {
    icon: 'paid', tag: 'Paid', title: 'Advertising behind what works',
    items: [
      'Meta campaigns — Facebook and Instagram — built and managed',
      'Audiences targeted by parish, farming type and buying intent',
      'Ad creative cut from your existing content, not stock',
      'Monitored daily, budget moved to the ads that convert',
      'Retargeting for people who hit the page and didn’t enquire',
    ],
  },
  {
    icon: 'leads', tag: 'Leads', title: 'Lead generation and handover',
    items: [
      'Every enquiry captured in one place — shared sheet or your inbox',
      'Name, contact, source, and what they were asking about',
      'Reply templates so nothing sits unanswered overnight',
      'Weekly check-in on what’s coming in and what it costs',
      'Day-30 report: leads, cost per lead, best content, next step',
    ],
  },
], 'Ad spend is paid by AV Farm Supplies directly to Meta and sits outside this quote. You set the daily budget and you keep control of it.')
  .addNotes('Scope part two. Be explicit about ad spend being separate and client-controlled — this is the single most common misunderstanding on a paid engagement.');

// =======================================================================
// 5 — The thirty days
// =======================================================================
{
  const s = newSlide(false);
  eyebrow(s, 'Timeline', false);
  pageNo(s, 5, false);
  title(s, 'The thirty days', false);

  const weeks = [
    ['Week 1', 'Set up',          'Page finalised and tracking installed. Ad accounts, pixel and channels prepared. Existing content audited and sorted into what we can use.'],
    ['Week 2', 'Live',            'Landing page goes live. The organic calendar starts posting. First paid campaigns launch with the strongest creative we have.'],
    ['Week 3', 'Read and adjust', 'Two weeks of real numbers. Losing ads switched off, budget moved behind winners, fresh hooks cut from what week 2 told us.'],
    ['Week 4', 'Push and report', 'The angles that work get scaled to month end. You get the day-30 report and a written recommendation for what comes next.'],
  ];

  const cw = (W - 2 * M - 3 * 0.34) / 4;
  let x = M;
  // connector line behind the step markers
  s.addShape(pres.ShapeType.rect, {
    x: M + 0.23, y: 2.42, w: 3 * (cw + 0.34), h: 0.02, fill: { color: RULE }, line: { width: 0 },
  });

  weeks.forEach(([wk, h4, body], i) => {
    s.addShape(pres.ShapeType.ellipse, {
      x, y: 2.19, w: 0.46, h: 0.46, fill: { color: i === 1 ? LIME : INK }, line: { width: 0 },
    });
    s.addText(String(i + 1), {
      x, y: 2.19, w: 0.46, h: 0.46, isTextBox: true, margin: 0,
      fontFace: MONO, fontSize: 13, bold: true, align: 'center', valign: 'middle',
      color: i === 1 ? INK : PAPER,
    });
    s.addText(wk.toUpperCase(), {
      x, y: 2.92, w: cw, h: 0.26, isTextBox: true, margin: 0,
      fontFace: MONO, fontSize: 9.5, charSpacing: 1.6, color: MUTED,
    });
    s.addText(h4, {
      x, y: 3.16, w: cw, h: 0.4, isTextBox: true, margin: 0,
      fontFace: DISPLAY, fontSize: 19, bold: true, charSpacing: -0.6, color: INK,
    });
    s.addText(body, {
      x, y: 3.66, w: cw, h: 1.8, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 13.5, color: MUTED, lineSpacing: 19,
    });
    x += cw + 0.34;
  });

  // deliverable strip
  s.addShape(pres.ShapeType.rect, {
    x: M, y: 5.72, w: W - 2 * M, h: 0.92, fill: { color: WHITE }, line: { color: RULE, width: 1 },
  });
  iconDisc(s, 'check', M + 0.34, 5.87, 0.6);
  s.addText(
    [ { text: 'Ends with a deliverable, not a renewal call.  ', options: { bold: true, color: INK } },
      { text: 'Day 30 is a written report — leads in, cost per lead, best-performing content — and a recommendation you can act on with or without us.', options: { color: MUTED } } ],
    { x: M + 1.16, y: 5.87, w: W - 2 * M - 1.5, h: 0.62, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 13.5, valign: 'middle', lineSpacing: 18 }
  );
  s.addNotes('Timeline. Week 2 is the launch milestone and it is also when the balance falls due — worth saying out loud.');
}

// =======================================================================
// 6 — Investment
// =======================================================================
{
  const s = newSlide(true);
  eyebrow(s, 'Investment', true);
  pageNo(s, 6, true);
  title(s, 'One fixed price', true);

  const lines = [
    ['Landing page',                          'Build, launch, hosting setup and documented handover'],
    ['Organic content distribution — 30 days','Reformatting, captions, calendar built and managed'],
    ['Paid advertising — 30 days',            'Campaign build, creative, daily management and optimisation'],
    ['Lead generation and reporting',         'Capture system, reply templates, weekly check-ins, day-30 report'],
  ];
  let ly = 2.08;
  s.addText('ITEM', {
    x: M, y: 1.82, w: 5, h: 0.22, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 9.5, charSpacing: 1.6, color: MUTEDD,
  });
  s.addText('INCLUDED', {
    x: 4.5, y: 1.82, w: 1.76, h: 0.22, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 9.5, charSpacing: 1.6, color: MUTEDD, align: 'right',
  });
  s.addShape(pres.ShapeType.rect, { x: M, y: 2.02, w: 5.54, h: 0.015, fill: { color: RULED }, line: { width: 0 } });

  lines.forEach(([a, b]) => {
    s.addText(a, {
      x: M, y: ly + 0.1, w: 4.6, h: 0.28, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 14.5, bold: true, color: PAPER,
    });
    s.addText(b, {
      x: M, y: ly + 0.38, w: 4.6, h: 0.5, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 12.5, color: MUTEDD, lineSpacing: 16,
    });
    s.addShape(pres.ShapeType.rect, {
      x: 6.0, y: ly + 0.13, w: 0.26, h: 0.26, fill: { color: LIME }, line: { width: 0 },
    });
    s.addImage({ data: ICON.check, x: 6.05, y: ly + 0.18, w: 0.16, h: 0.16 });
    ly += 0.98;
  });

  // total slab
  s.addShape(pres.ShapeType.rect, {
    x: 7.35, y: 1.82, w: 5.26, h: 1.85, fill: { color: '000000' }, line: { color: RULED, width: 1 },
  });
  s.addText('TOTAL — FIXED', {
    x: 7.72, y: 2.08, w: 4.5, h: 0.28, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 10.5, charSpacing: 1.8, color: MUTEDD,
  });
  s.addText(
    [ { text: 'JMD ', options: { fontSize: 22, color: PAPER } },
      { text: '$40,000', options: { fontSize: 50, color: LIME } } ],
    { x: 7.72, y: 2.5, w: 4.5, h: 0.95, isTextBox: true, margin: 0,
      fontFace: DISPLAY, bold: true, charSpacing: -1.4, valign: 'middle' }
  );

  // payment split
  const pays = [
    ['Payment 1 — to start', '50%', 'JMD $20,000', 'Due on acceptance. Work begins the day it clears.'],
    ['Payment 2 — on launch', '50%', 'JMD $20,000', 'Due the day the page is live and campaigns are running.'],
  ];
  let py = 3.95;
  pays.forEach(([lab, pct, fig, note]) => {
    s.addShape(pres.ShapeType.rect, {
      x: 7.35, y: py, w: 5.26, h: 1.32, fill: { color: '1D1D1B' }, line: { color: RULED, width: 1 },
    });
    s.addText(lab.toUpperCase(), {
      x: 7.72, y: py + 0.16, w: 3.3, h: 0.26, isTextBox: true, margin: 0,
      fontFace: MONO, fontSize: 9.5, charSpacing: 1.5, color: MUTEDD, valign: 'middle',
    });
    s.addShape(pres.ShapeType.rect, {
      x: 11.62, y: py + 0.16, w: 0.62, h: 0.26, fill: { color: LIME }, line: { width: 0 },
    });
    s.addText(pct, {
      x: 11.62, y: py + 0.16, w: 0.62, h: 0.26, isTextBox: true, margin: 0,
      fontFace: MONO, fontSize: 10, bold: true, align: 'center', valign: 'middle', color: INK,
    });
    s.addText(fig, {
      x: 7.72, y: py + 0.46, w: 4.5, h: 0.44, isTextBox: true, margin: 0,
      fontFace: DISPLAY, fontSize: 26, bold: true, charSpacing: -0.9, color: PAPER,
    });
    s.addText(note, {
      x: 7.72, y: py + 0.92, w: 4.5, h: 0.3, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 12, color: MUTEDD,
    });
    py += 1.44;
  });

  s.addText('Nothing is billed on top of this figure, and it does not change once the deposit is paid.', {
    x: M, y: 6.22, w: 5.54, h: 0.58, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 13.5, italic: true, color: MUTEDD, lineSpacing: 18,
  });
  s.addNotes('Money slide. JMD $40,000 total. 50% (JMD $20,000) on acceptance, 50% (JMD $20,000) on launch. Ad spend is separate and paid direct to Meta.');
}

// =======================================================================
// 7 — Boundaries + what we need
// =======================================================================
{
  const s = newSlide(false);
  eyebrow(s, 'Scope and inputs', false);
  pageNo(s, 7, false);
  title(s, 'Where the edges are', false);

  // left: not included
  s.addText('NOT IN THIS QUOTE', {
    x: M, y: 2.05, w: 5.4, h: 0.26, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 9.5, charSpacing: 1.6, color: MUTED,
  });
  const out = [
    'Ad spend — paid direct to Meta by you',
    'New photo or video shoots',
    'Online checkout or card payments',
    'Print, radio or outdoor advertising',
    'Work past day 30 — that’s the retainer',
  ];
  let oy = 2.44;
  out.forEach((t) => {
    s.addText('×', {
      x: M, y: oy, w: 0.26, h: 0.3, isTextBox: true, margin: 0,
      fontFace: MONO, fontSize: 14, color: INK, valign: 'middle',
    });
    s.addText(t, {
      x: M + 0.3, y: oy, w: 5.1, h: 0.3, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 14, color: MUTED, valign: 'middle',
    });
    oy += 0.5;
  });

  // right: what we need from you
  s.addShape(pres.ShapeType.rect, {
    x: 6.85, y: 1.9, w: W - M - 6.85, h: 4.4, fill: { color: WHITE }, line: { color: RULE, width: 1 },
  });
  s.addText('WHAT WE NEED FROM YOU', {
    x: 7.2, y: 2.16, w: 5, h: 0.26, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 9.5, charSpacing: 1.6, color: MUTED,
  });
  const need = [
    'Existing content — product photos and video',
    'Product list, prices and the areas you deliver to',
    'Logo files and anything brand-related you have',
    'Admin access to Facebook and Instagram',
    'The WhatsApp number enquiries should reach',
    'One person who can answer questions and sign off',
    'A daily ad budget you’re comfortable with',
  ];
  let ny = 2.52;
  need.forEach((t, i) => {
    s.addText(String(i + 1).padStart(2, '0'), {
      x: 7.2, y: ny, w: 0.38, h: 0.3, isTextBox: true, margin: 0,
      fontFace: MONO, fontSize: 10.5, color: MUTED, valign: 'middle',
    });
    s.addText(t, {
      x: 7.66, y: ny, w: 4.55, h: 0.3, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 13.5, color: INK, valign: 'middle',
    });
    ny += 0.5;
  });

  s.addShape(pres.ShapeType.rect, {
    x: M, y: 5.53, w: 0.13, h: 0.13, fill: { color: LIME }, line: { width: 0 },
  });
  s.addText('Everything on the right is content and access you already own. None of it costs you anything extra — it just needs to reach us in week 1 so the timeline holds.', {
    x: M + 0.3, y: 5.45, w: 5.6, h: 0.8, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 13, color: MUTED, lineSpacing: 18, valign: 'top',
  });
  s.addNotes('Boundaries slide. Say plainly that late access in week 1 is the one thing that moves the timeline.');
}

// =======================================================================
// 8 — After day 30 + acceptance
// =======================================================================
{
  const s = newSlide(true);
  eyebrow(s, 'After day 30', true);
  title(s, 'Carry on, month to month', true, { w: 7.5 });

  s.addText(
    'The thirty days stand on their own. At the end of it the page is yours, the content system is documented, and you have real numbers on what a lead costs you. Nothing in this proposal locks you into anything after that.',
    { x: M, y: 2.02, w: 11.0, h: 0.8, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 15, color: PAPER, lineSpacing: 22 }
  );

  const cards = [
    ['refresh', 'What continues', 'Posting calendar, paid campaign management, lead handling and a monthly report — the same engine, kept running.'],
    ['clock',   'How it’s priced', 'The retainer rate is set at the day-30 review, against what the first month actually produced. You never pay against a guess.'],
    ['mail',    'How it ends',     'Month to month, thirty days’ notice either way. No lock-in, no minimum term, no exit fee.'],
  ];
  const cw = (W - 2 * M - 2 * 0.36) / 3;
  let cx = M;
  cards.forEach(([ic, h4, body]) => {
    s.addShape(pres.ShapeType.rect, {
      x: cx, y: 3.35, w: cw, h: 2.02, fill: { color: '1D1D1B' }, line: { color: RULED, width: 1 },
    });
    iconDisc(s, ic, cx + 0.34, 3.62, 0.54);
    s.addText(h4, {
      x: cx + 1.02, y: 3.66, w: cw - 1.3, h: 0.34, isTextBox: true, margin: 0,
      fontFace: DISPLAY, fontSize: 15.5, bold: true, charSpacing: -0.4, color: PAPER, valign: 'middle',
    });
    s.addText(body, {
      x: cx + 0.34, y: 4.32, w: cw - 0.68, h: 0.92, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 12.5, color: MUTEDD, lineSpacing: 17,
    });
    cx += cw + 0.36;
  });

  // acceptance strip
  s.addShape(pres.ShapeType.rect, {
    x: M, y: 5.72, w: W - 2 * M, h: 1.0, fill: { color: '000000' }, line: { color: LIME, width: 1 },
  });
  s.addText('TO ACCEPT', {
    x: M + 0.36, y: 5.94, w: 1.6, h: 0.26, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 9.5, charSpacing: 1.6, color: LIME,
  });
  s.addText(
    [ { text: 'Sign the proposal and send the deposit of ', options: { color: PAPER } },
      { text: 'JMD $20,000', options: { color: LIME, bold: true } },
      { text: '. Week 1 starts the day it clears.', options: { color: PAPER } } ],
    { x: M + 0.36, y: 6.18, w: 8.3, h: 0.38, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 14.5, valign: 'middle' }
  );
  s.addText('yardscaledigital@gmail.com', {
    x: W - M - 4.2, y: 6.02, w: 3.84, h: 0.4, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 12, charSpacing: 1, color: PAPER, align: 'right', valign: 'middle',
  });

  s.addImage({ data: LOGO_PAPER, x: W - M - 1.9, y: 0.42, w: 1.9, h: 0.39 });
  s.addNotes('Close. The retainer is genuinely optional and priced off month-one data. Ask for the signature and the deposit before leaving the call.');
}

pres.writeFile({ fileName: path.join(HERE, '..', 'AV-Farm-Supplies-Proposal-YardScale-Digital.pptx') })
  .then((f) => console.log('wrote', f));
