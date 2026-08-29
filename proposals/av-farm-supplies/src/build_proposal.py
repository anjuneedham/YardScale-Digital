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
  font-size:15px;
  line-height:1.55;
  -webkit-font-smoothing:antialiased;
}
.wrap{max-width:780px;margin:0 auto;padding:0 24px 72px}

.eyebrow{
  font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--muted);margin:0;
}

/* ---------- masthead ---------- */
.masthead{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:24px;flex-wrap:wrap;padding:38px 0 20px;
}
.masthead img{width:168px;height:auto;display:block}
.stamp{text-align:right;line-height:1.85}
.stamp b{color:var(--fg);font-weight:500}

/* ---------- title ---------- */
.title{border-top:2px solid var(--fg);padding-top:22px}
.tick{
  display:inline-block;background:var(--accent);color:#131313;
  padding:3px 7px;border-radius:2px;font-weight:500;
}
h1{
  font-family:var(--display);font-weight:800;
  font-size:clamp(32px,5.4vw,46px);line-height:1.02;letter-spacing:-.025em;
  margin:16px 0 0;text-wrap:balance;
}
.lede{
  font-size:16.5px;color:var(--muted);max-width:58ch;
  margin:14px 0 0;line-height:1.5;
}

/* ---------- sections ---------- */
section{margin-top:34px}
h2{
  font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--muted);font-weight:400;margin:0 0 14px;
  padding-bottom:9px;border-bottom:1px solid var(--rule);
}

/* ---------- included ---------- */
dl.scope{margin:0;display:flex;flex-direction:column;gap:11px}
dl.scope > div{display:grid;grid-template-columns:112px 1fr;gap:18px;align-items:baseline}
dl.scope dt{
  font-family:var(--display);font-weight:600;font-size:15px;letter-spacing:-.01em;
}
dl.scope dd{margin:0;color:var(--muted);max-width:56ch}

/* ---------- timeline ---------- */
ol.weeks{
  list-style:none;margin:0;padding:0;
  display:grid;grid-template-columns:repeat(4,1fr);gap:1px;
  background:var(--rule);border:1px solid var(--rule);
}
ol.weeks li{background:var(--bg);padding:13px 14px}
ol.weeks .wk{
  display:block;font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--muted);margin-bottom:4px;
}
ol.weeks b{font-family:var(--display);font-weight:600;font-size:14.5px;letter-spacing:-.01em}

/* ---------- money ---------- */
.slab{
  background:var(--slab);color:var(--slab-fg);padding:22px 26px;
  display:flex;align-items:baseline;justify-content:space-between;gap:18px;flex-wrap:wrap;
}
.slab .lab{
  font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--slab-muted);
}
.slab .amt{
  font-family:var(--display);font-weight:800;
  font-size:clamp(30px,5.4vw,44px);line-height:1;letter-spacing:-.03em;
  color:var(--accent);font-variant-numeric:tabular-nums;
}
.slab .amt .cur{
  font-size:.44em;letter-spacing:.02em;color:var(--slab-fg);
  margin-right:.34em;vertical-align:.32em;
}
.pay{
  display:grid;grid-template-columns:repeat(2,1fr);gap:1px;
  background:var(--rule);border:1px solid var(--rule);border-top:0;
}
.pay div{background:var(--bg);padding:15px 18px}
.pay .step{
  display:block;font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--muted);margin-bottom:6px;
}
.pay .fig{
  font-family:var(--display);font-weight:800;font-size:23px;letter-spacing:-.02em;
  font-variant-numeric:tabular-nums;
}
.pay .fig .cur{font-size:.52em;vertical-align:.26em;color:var(--muted);margin-right:.3em}
.note{
  margin:13px 0 0;font-size:13.5px;color:var(--muted);max-width:60ch;
  display:flex;gap:9px;
}
.note::before{
  content:"";flex:none;width:9px;height:9px;background:var(--accent);
  margin-top:.42em;
}

/* ---------- sign ---------- */
.sign{display:grid;grid-template-columns:1fr 1fr;gap:38px}
.sig .who{
  font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--muted);margin-bottom:44px;
}
.sig .line{border-bottom:1px solid var(--fg);height:1px;margin-bottom:7px}
.sig .cap{font-size:12px;color:var(--muted)}
.sig .line + .cap{margin-bottom:0}

footer{
  margin-top:38px;border-top:1px solid var(--rule);padding-top:16px;
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font-family:var(--mono);font-size:10px;letter-spacing:.08em;color:var(--muted);
}
footer a{color:var(--fg);text-decoration:none;border-bottom:1px solid var(--accent)}
footer a:hover{background:var(--accent);color:#131313}
a:focus-visible{outline:2px solid var(--accent);outline-offset:3px}

@media (max-width:640px){
  dl.scope > div{grid-template-columns:1fr;gap:2px}
  ol.weeks{grid-template-columns:repeat(2,1fr)}
  .sign{grid-template-columns:1fr;gap:28px}
  .stamp{text-align:left}
}
@media print{ body{background:#fff} }
</style>

<div class="wrap">

  <header class="masthead">
    <img src="__LOGO__" alt="YardScale Digital">
    <p class="eyebrow stamp">
      Proposal <b>YSD&#8209;2026&#8209;AVF</b><br>
      29 August 2026 &middot; valid to <b>12 September 2026</b>
    </p>
  </header>

  <div class="title">
    <p class="eyebrow"><span class="tick">Prepared for AV Farm Supplies</span></p>
    <h1>Landing page, content,<br>and leads in 30 days.</h1>
    <p class="lede">Your page goes live, the photos and video you already have get posted and put behind paid spend for thirty days, and every enquiry comes back to you in one place.</p>
  </div>

  <section>
    <h2>What's included</h2>
    <dl class="scope">
      <div>
        <dt>Landing page</dt>
        <dd>Built, live and mobile-first, with an enquiry form and WhatsApp chat. Yours to keep.</dd>
      </div>
      <div>
        <dt>Organic</dt>
        <dd>Your existing photos and video reformatted, captioned and posted on a calendar we run.</dd>
      </div>
      <div>
        <dt>Paid ads</dt>
        <dd>Facebook and Instagram campaigns from that same content, managed daily.</dd>
      </div>
      <div>
        <dt>Leads</dt>
        <dd>Every enquiry in one place, plus a day-30 report on what each lead cost.</dd>
      </div>
    </dl>
  </section>

  <section>
    <h2>The thirty days</h2>
    <ol class="weeks">
      <li><span class="wk">Week 1</span><b>Set up</b></li>
      <li><span class="wk">Week 2</span><b>Go live</b></li>
      <li><span class="wk">Week 3</span><b>Read and adjust</b></li>
      <li><span class="wk">Week 4</span><b>Scale and report</b></li>
    </ol>
  </section>

  <section>
    <h2>Investment</h2>
    <div class="slab">
      <span class="lab">Total — fixed</span>
      <span class="amt"><span class="cur">JMD</span>$40,000</span>
    </div>
    <div class="pay">
      <div>
        <span class="step">50% to start</span>
        <span class="fig"><span class="cur">JMD</span>$20,000</span>
      </div>
      <div>
        <span class="step">50% on launch</span>
        <span class="fig"><span class="cur">JMD</span>$20,000</span>
      </div>
    </div>
    <p class="note">Ad spend is paid by you directly to Meta and is not included. Nothing else is billed on top. After day 30 you can continue on a monthly retainer, priced at the day-30 review — no lock-in.</p>
  </section>

  <section>
    <h2>Acceptance</h2>
    <div class="sign">
      <div class="sig">
        <div class="who">For AV Farm Supplies</div>
        <div class="line"></div><div class="cap">Signature, name and date</div>
      </div>
      <div class="sig">
        <div class="who">For YardScale Digital</div>
        <div class="line"></div><div class="cap">Signature, name and date</div>
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
