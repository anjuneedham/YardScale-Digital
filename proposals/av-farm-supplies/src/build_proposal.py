import base64, pathlib

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parents[2]

logo = 'data:image/png;base64,' + base64.b64encode(
    (REPO / 'brand' / 'yardscale-lockup-ink.png').read_bytes()).decode()

HTML = r'''<title>AV Farm Supplies Proposal</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
:root{
  --bg:#f9f8f4;
  --surface:#ffffff;
  --fg:#131313;
  --muted:#6b6b62;
  --rule:#dedbd2;
  --rule-soft:#eae8e0;
  --accent:#c3fc0f;
  --slab:#131313;
  --slab-fg:#f4f3ee;
  --slab-muted:#8f8f86;
  --display:'Archivo','Arial Narrow',Helvetica,sans-serif;
  --body:'Instrument Sans',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,'SFMono-Regular',Menlo,monospace;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bg:#131313;
    --surface:#1a1a18;
    --fg:#f4f3ee;
    --muted:#8f8f86;
    --rule:#2e2e2b;
    --rule-soft:#232320;
    --slab:#000000;
    --slab-fg:#f4f3ee;
    --slab-muted:#8f8f86;
  }
}
:root[data-theme="dark"]{
  --bg:#131313;
  --surface:#1a1a18;
  --fg:#f4f3ee;
  --muted:#8f8f86;
  --rule:#2e2e2b;
  --rule-soft:#232320;
  --slab:#000000;
  --slab-fg:#f4f3ee;
  --slab-muted:#8f8f86;
}

*{box-sizing:border-box}
body{
  background:var(--bg);
  color:var(--fg);
  font-family:var(--body);
  font-size:16px;
  line-height:1.62;
  -webkit-font-smoothing:antialiased;
}
.wrap{max-width:900px;margin:0 auto;padding:0 24px 96px}

/* ---------- masthead ---------- */
.masthead{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:24px;flex-wrap:wrap;
  padding:40px 0 28px;
}
.plate{
  background:#f9f8f4;
  border:1px solid var(--rule);
  border-radius:3px;
  padding:12px 16px;
  line-height:0;
}
.plate img{width:172px;height:auto;display:block}
.stamp{
  font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--muted);text-align:right;line-height:1.9;
}
.stamp b{color:var(--fg);font-weight:500}

/* ---------- title ---------- */
.title{border-top:2px solid var(--fg);padding-top:26px}
.eyebrow{
  font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--muted);margin:0 0 18px;
}
.eyebrow .tick{color:var(--fg);background:var(--accent);padding:2px 6px;border-radius:2px;font-weight:500}
h1{
  font-family:var(--display);font-weight:800;
  font-size:clamp(38px,7vw,66px);line-height:.98;letter-spacing:-.025em;
  margin:0;text-wrap:balance;
}
.subtitle{
  font-size:clamp(17px,2.3vw,20px);color:var(--muted);
  max-width:34ch;margin:18px 0 0;line-height:1.45;
}

/* ---------- fact strip ---------- */
.facts{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:1px;background:var(--rule);
  border:1px solid var(--rule);
  margin:38px 0 0;
}
.fact{background:var(--bg);padding:14px 16px}
.fact dt{
  font-family:var(--mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;
  color:var(--muted);margin:0 0 5px;
}
.fact dd{margin:0;font-size:15px;font-weight:500;font-variant-numeric:tabular-nums}

/* ---------- sections ---------- */
section{margin-top:62px}
.shead{
  display:flex;align-items:baseline;gap:14px;
  border-bottom:1px solid var(--rule);padding-bottom:12px;margin-bottom:30px;
}
.shead .num{
  font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--muted);
  flex:none;padding-top:2px;
}
.shead h2{
  font-family:var(--display);font-weight:800;
  font-size:clamp(22px,3.2vw,30px);letter-spacing:-.02em;line-height:1.1;
  margin:0;
}

/* ---------- lede ---------- */
.lede{
  font-size:clamp(18px,2.4vw,21px);line-height:1.5;margin:0;
  max-width:60ch;
}
.lede strong{font-weight:600}

/* ---------- scope blocks ---------- */
.block{
  border-top:1px solid var(--rule-soft);
  padding:26px 0;
  display:grid;grid-template-columns:190px 1fr;gap:28px;
}
.shead + .block{border-top:0;padding-top:0}
.block-tag{
  font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--muted);padding-top:5px;
}
.block h3{
  font-family:var(--display);font-weight:600;font-size:19px;letter-spacing:-.01em;
  margin:0 0 12px;
}
ul.ticks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px}
ul.ticks li{position:relative;padding-left:22px;max-width:58ch}
ul.ticks li::before{
  content:"";position:absolute;left:0;top:.62em;
  width:9px;height:2px;background:var(--fg);
}
.note{
  margin:16px 0 0;font-size:14px;color:var(--muted);
  border-left:2px solid var(--accent);padding-left:14px;max-width:56ch;
}

/* ---------- excluded ---------- */
ul.crosses{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px 32px}
ul.crosses li{position:relative;padding-left:22px;color:var(--muted)}
ul.crosses li::before{
  content:"×";position:absolute;left:2px;top:-1px;
  font-family:var(--mono);color:var(--fg);
}

/* ---------- timeline ---------- */
.weeks{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule)}
.week{background:var(--bg);padding:20px 18px 22px;display:flex;flex-direction:column;gap:9px}
.week .wk{
  font-family:var(--mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);
}
.week h4{
  font-family:var(--display);font-weight:600;font-size:16px;margin:0;letter-spacing:-.01em;
}
.week p{margin:0;font-size:14px;line-height:1.5;color:var(--muted)}

/* ---------- money ---------- */
.linetable{width:100%;border-collapse:collapse;font-size:15px}
.linetable th{
  font-family:var(--mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;
  color:var(--muted);font-weight:400;text-align:left;padding:0 0 10px;
  border-bottom:1px solid var(--rule);
}
.linetable th:last-child{text-align:right}
.linetable td{padding:15px 0;border-bottom:1px solid var(--rule-soft);vertical-align:top}
.linetable td:last-child{text-align:right;font-family:var(--mono);font-variant-numeric:tabular-nums;white-space:nowrap;padding-left:20px}
.linetable td small{display:block;color:var(--muted);font-size:13.5px;font-family:var(--body);margin-top:3px;line-height:1.45}

.slab{
  background:var(--slab);color:var(--slab-fg);
  margin-top:24px;padding:28px 30px;
  display:flex;align-items:baseline;justify-content:space-between;gap:20px;flex-wrap:wrap;
}
.slab .lab{
  font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--slab-muted);
}
.slab .amt{
  font-family:var(--display);font-weight:800;
  font-size:clamp(34px,6.4vw,54px);line-height:1;letter-spacing:-.03em;
  color:var(--accent);font-variant-numeric:tabular-nums;
}
.slab .amt .cur{font-size:.44em;letter-spacing:.02em;color:var(--slab-fg);margin-right:.34em;vertical-align:.32em}
.fixed-note{margin:14px 0 0;font-size:14px;color:var(--muted)}

.pay{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);margin-top:34px}
.pay-cell{background:var(--bg);padding:22px}
.pay-cell .step{
  font-family:var(--mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);
  display:block;margin-bottom:10px;
}
.pay-cell .fig{
  font-family:var(--display);font-weight:800;font-size:30px;letter-spacing:-.02em;
  font-variant-numeric:tabular-nums;display:block;line-height:1.05;
}
.pay-cell .fig .cur{font-size:.5em;vertical-align:.28em;color:var(--muted);margin-right:.3em;letter-spacing:.02em}
.pay-cell p{margin:9px 0 0;font-size:14px;color:var(--muted);line-height:1.5}
.pct{
  display:inline-block;background:var(--accent);color:#131313;
  font-family:var(--mono);font-size:10px;letter-spacing:.12em;font-weight:500;
  padding:3px 7px;border-radius:2px;margin-left:8px;vertical-align:2px;
}

/* ---------- retainer ---------- */
.retainer{
  border:1px solid var(--rule);padding:28px 30px;background:var(--surface);
}
.retainer h3{font-family:var(--display);font-weight:600;font-size:19px;margin:0 0 12px}
.retainer p{margin:0 0 14px;max-width:60ch}
.retainer p:last-child{margin-bottom:0}

/* ---------- needs ---------- */
ol.needs{list-style:none;counter-reset:n;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px 36px}
ol.needs li{counter-increment:n;position:relative;padding-left:32px;line-height:1.5}
ol.needs li::before{
  content:counter(n,decimal-leading-zero);position:absolute;left:0;top:1px;
  font-family:var(--mono);font-size:11px;color:var(--muted);
}

/* ---------- sign ---------- */
.sign{display:grid;grid-template-columns:1fr 1fr;gap:44px;margin-top:8px}
.sig{border-top:1px solid var(--rule);padding-top:14px}
.sig .who{
  font-family:var(--mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);
  margin-bottom:54px;
}
.sig .line{border-bottom:1px solid var(--fg);height:1px;margin-bottom:8px}
.sig .cap{font-size:12.5px;color:var(--muted)}
.sig .line+.cap{margin-bottom:50px}

footer{
  margin-top:70px;border-top:1px solid var(--rule);padding-top:20px;
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--muted);
}
footer a{color:var(--fg);text-decoration:none;border-bottom:1px solid var(--accent)}
footer a:hover{background:var(--accent);color:#131313}
a:focus-visible,.plate:focus-visible{outline:2px solid var(--accent);outline-offset:3px}

@media (max-width:820px){
  .weeks{grid-template-columns:repeat(2,1fr)}
  .facts{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:640px){
  .weeks{grid-template-columns:1fr}
  .block{grid-template-columns:1fr;gap:12px}
  .block-tag{padding-top:0}
  .sign{grid-template-columns:1fr;gap:32px}
  .stamp{text-align:left}
}
@media print{
  body{background:#fff;color:#131313}
  section{break-inside:avoid}
}
</style>

<div class="wrap">

  <header class="masthead">
    <div class="plate"><img src="__LOGO__" alt="YardScale Digital"></div>
    <div class="stamp">
      Proposal <b>YSD&#8209;2026&#8209;AVF</b><br>
      Issued <b>29 August 2026</b><br>
      Valid until <b>12 September 2026</b>
    </div>
  </header>

  <div class="title">
    <p class="eyebrow"><span class="tick">Prepared for AV Farm Supplies</span></p>
    <h1>Landing page,<br>content, and<br>leads in 30 days.</h1>
    <p class="subtitle">One page that converts, your existing content pushed out organically and behind paid spend, and every enquiry landing somewhere you can act on it.</p>

    <dl class="facts">
      <div class="fact"><dt>Client</dt><dd>AV Farm Supplies</dd></div>
      <div class="fact"><dt>Engagement</dt><dd>30 days</dd></div>
      <div class="fact"><dt>Total</dt><dd>JMD $40,000</dd></div>
      <div class="fact"><dt>Deposit</dt><dd>JMD $20,000</dd></div>
    </dl>
  </div>

  <section>
    <div class="shead"><span class="num">01</span><h2>The short version</h2></div>
    <p class="lede">Your landing page is built. Over the next thirty days we put it to work: your existing photos and video reformatted and posted on a schedule that holds, paid campaigns behind the pieces that perform, and every lead that comes back captured in one place with a name, a number and what they asked about. <strong>One fixed price of JMD $40,000</strong> — half to start, half on launch. At day 30 you get the numbers and a written next step, and you can carry on month to month.</p>
  </section>

  <section>
    <div class="shead"><span class="num">02</span><h2>What's included</h2></div>

    <div class="block">
      <div class="block-tag">Web</div>
      <div>
        <h3>The landing page, live and yours</h3>
        <ul class="ticks">
          <li>One page with one job — turn a visit into an enquiry</li>
          <li>Mobile-first and built to load fast on local mobile data</li>
          <li>Enquiry form plus click-to-chat straight into your WhatsApp</li>
          <li>Your products, prices and delivery areas laid out plainly</li>
          <li>Hosting configured, domain connected, analytics wired in</li>
          <li>Handed over documented — nothing you run depends on us</li>
        </ul>
      </div>
    </div>

    <div class="block">
      <div class="block-tag">Organic</div>
      <div>
        <h3>Your content, posted properly</h3>
        <ul class="ticks">
          <li>Built from the content you already have — product shots, yard photos, video</li>
          <li>Reformatted, captioned and cut for each platform</li>
          <li>A posting calendar built and run by us for the full 30 days</li>
          <li>Hooks and angles tested against each other, not guessed at</li>
          <li>What performs gets made again; what doesn't gets dropped</li>
        </ul>
      </div>
    </div>

    <div class="block">
      <div class="block-tag">Paid</div>
      <div>
        <h3>Advertising behind what works</h3>
        <ul class="ticks">
          <li>Meta campaigns — Facebook and Instagram — built, launched and managed</li>
          <li>Audiences targeted by parish, farming type and buying intent</li>
          <li>Ad creative cut from your existing content, not stock</li>
          <li>Monitored daily, with budget moved to the ads that convert</li>
          <li>Retargeting for people who hit the page and didn't enquire</li>
        </ul>
        <p class="note">Ad spend is paid by AV Farm Supplies directly to Meta and sits outside this quote. You set the daily budget and you keep control of it.</p>
      </div>
    </div>

    <div class="block">
      <div class="block-tag">Leads</div>
      <div>
        <h3>Lead generation and handover</h3>
        <ul class="ticks">
          <li>Every enquiry captured in one place — a shared sheet or your inbox, your call</li>
          <li>Name, contact, source and what they were asking about</li>
          <li>Reply templates so nothing sits unanswered overnight</li>
          <li>Weekly check-in on what's coming in and what it's costing</li>
          <li>Day-30 report: leads, cost per lead, best-performing content, next step</li>
        </ul>
      </div>
    </div>
  </section>

  <section>
    <div class="shead"><span class="num">03</span><h2>What's not in this</h2></div>
    <ul class="crosses">
      <li>Ad spend — paid direct to Meta by you</li>
      <li>New photo or video shoots — this works from content you already have</li>
      <li>Online checkout or card payments</li>
      <li>Print, radio or outdoor advertising</li>
      <li>Work past day 30 — that's the retainer</li>
    </ul>
  </section>

  <section>
    <div class="shead"><span class="num">04</span><h2>The thirty days</h2></div>
    <div class="weeks">
      <div class="week">
        <span class="wk">Week 1</span>
        <h4>Set up</h4>
        <p>Page finalised and tracking installed. Ad accounts, pixel and channels prepared. Your existing content audited and sorted into what we can use.</p>
      </div>
      <div class="week">
        <span class="wk">Week 2</span>
        <h4>Live</h4>
        <p>Landing page goes live. Organic calendar starts posting. First paid campaigns launch with the strongest creative we have.</p>
      </div>
      <div class="week">
        <span class="wk">Week 3</span>
        <h4>Read and adjust</h4>
        <p>Two weeks of real numbers. Losing ads switched off, budget moved behind the winners, fresh hooks cut from what week 2 told us.</p>
      </div>
      <div class="week">
        <span class="wk">Week 4</span>
        <h4>Push and report</h4>
        <p>The angles that work get scaled to the end of the month. You get the day-30 report and a written recommendation for what comes next.</p>
      </div>
    </div>
  </section>

  <section>
    <div class="shead"><span class="num">05</span><h2>Investment</h2></div>
    <table class="linetable">
      <thead>
        <tr><th scope="col">Item</th><th scope="col">Amount</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Landing page<small>Build, launch, hosting setup and documented handover</small></td>
          <td>Included</td>
        </tr>
        <tr>
          <td>Organic content distribution — 30 days<small>Reformatting, captions, calendar built and managed</small></td>
          <td>Included</td>
        </tr>
        <tr>
          <td>Paid advertising — 30 days<small>Campaign build, creative, daily management and optimisation</small></td>
          <td>Included</td>
        </tr>
        <tr>
          <td>Lead generation, tracking and reporting<small>Capture system, reply templates, weekly check-ins, day-30 report</small></td>
          <td>Included</td>
        </tr>
      </tbody>
    </table>

    <div class="slab">
      <span class="lab">Total — fixed</span>
      <span class="amt"><span class="cur">JMD</span>$40,000</span>
    </div>
    <p class="fixed-note">One fixed price for the thirty days. Nothing is billed on top of this figure, and it does not change once the deposit is paid.</p>

    <div class="pay">
      <div class="pay-cell">
        <span class="step">Payment 1 — to start<span class="pct">50%</span></span>
        <span class="fig"><span class="cur">JMD</span>$20,000</span>
        <p>Due on acceptance of this proposal. Work begins the day it clears.</p>
      </div>
      <div class="pay-cell">
        <span class="step">Payment 2 — on launch<span class="pct">50%</span></span>
        <span class="fig"><span class="cur">JMD</span>$20,000</span>
        <p>Due the day the landing page is live and the first campaigns are running.</p>
      </div>
    </div>
  </section>

  <section>
    <div class="shead"><span class="num">06</span><h2>After day 30</h2></div>
    <div class="retainer">
      <h3>Carry on, month to month</h3>
      <p>The thirty days are designed to stand on their own — at the end of it the page is yours, the content system is documented, and you have real numbers on what your leads cost. Nothing about this proposal locks you into anything after that.</p>
      <p>If you want it to keep running, we continue on a monthly retainer: the posting calendar, paid campaign management, lead handling and a monthly report. The rate is set at the day-30 review and priced against what the first month's numbers actually show, so you are never paying against a guess.</p>
      <p>Month to month, thirty days' notice either way.</p>
    </div>
  </section>

  <section>
    <div class="shead"><span class="num">07</span><h2>What we need from you</h2></div>
    <ol class="needs">
      <li>Your existing content — product photos, yard photos, any video</li>
      <li>Product list, prices and the areas you deliver to</li>
      <li>Logo files and anything brand-related you already have</li>
      <li>Admin access to your Facebook and Instagram, or a Business Manager invite</li>
      <li>The WhatsApp number enquiries should reach</li>
      <li>One person who can answer questions and sign off</li>
      <li>A daily ad budget you're comfortable with, paid direct to Meta</li>
    </ol>
  </section>

  <section>
    <div class="shead"><span class="num">08</span><h2>Acceptance</h2></div>
    <p class="lede" style="font-size:16px;color:var(--muted);margin-bottom:34px;max-width:62ch">Signing below accepts the scope, the timeline and the fixed price of JMD&nbsp;$40,000, with JMD&nbsp;$20,000 payable on acceptance and JMD&nbsp;$20,000 on launch.</p>
    <div class="sign">
      <div class="sig">
        <div class="who">For AV Farm Supplies</div>
        <div class="line"></div><div class="cap">Signature</div>
        <div class="line"></div><div class="cap">Name and position</div>
        <div class="line"></div><div class="cap">Date</div>
      </div>
      <div class="sig">
        <div class="who">For YardScale Digital</div>
        <div class="line"></div><div class="cap">Signature</div>
        <div class="line"></div><div class="cap">Name and position</div>
        <div class="line"></div><div class="cap">Date</div>
      </div>
    </div>
  </section>

  <footer>
    <span>YardScale Digital &middot; Automation &amp; creative agency</span>
    <span><a href="mailto:yardscaledigital@gmail.com">yardscaledigital@gmail.com</a></span>
  </footer>

</div>
'''

out = HERE.parent / 'proposal.html'
out.write_text(HTML.replace('__LOGO__', logo))
print('written', out, out.stat().st_size)
