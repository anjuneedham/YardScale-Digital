const pptx = require('pptxgenjs');
const fs = require('fs');
const p = new pptx();
p.layout = 'LAYOUT_WIDE';            // 13.333 x 7.5
const W = 13.333, H = 7.5;

const INK='131313', INK2='1C1C1A', LIME='C3FC0F', PAPER='F9F8F4', PAPER2='EFEEE8',
      HAIR='DEDBD2', HAIRD='2E2E2B', MUTED='6B6B62', MUTEDD='8F8F86';
const DISP='Arial', BODY='Calibri';
const img = n => SHOTDIR + '/' + n;
const SHOTDIR = process.env.SHOTDIR || __dirname + '/deck-assets';

p.author='YardScale Digital'; p.company='YardScale Digital';
p.title='Design Container JA — website & lead system';

// the signature skewed lime slash, reused as the deck's motif
function tick(s, x, y, w=0.26, h=0.115){
  s.addShape(p.ShapeType.parallelogram, {x, y, w, h, fill:{color:LIME}, line:{type:'none'}, rotate:0});
}
function label(s, txt, x, y, color=MUTEDD, size=10){
  s.addText(txt, {x, y, w:8, h:0.28, isTextBox:true, margin:0, fontFace:DISP, fontSize:size,
    bold:true, color, charSpacing:2.6, align:'left', valign:'middle'});
}
function eyebrow(s, txt, x=0.85, y=0.62, color=MUTEDD){
  tick(s, x, y+0.075);
  label(s, txt.toUpperCase(), x+0.42, y, color);
}
function foot(s, txt, dark=true){
  s.addText(txt, {x:0.85, y:H-0.68, w:6, h:0.3, isTextBox:true, margin:0, fontFace:DISP,
    fontSize:9, color:dark?MUTEDD:MUTED, charSpacing:2.2, bold:true});
  s.addText('YARDSCALE DIGITAL', {x:W-4.35, y:H-0.68, w:3.5, h:0.3, isTextBox:true, margin:0,
    fontFace:DISP, fontSize:9, color:dark?MUTEDD:MUTED, charSpacing:2.2, bold:true, align:'right'});
}
const dark = () => { const s=p.addSlide(); s.background={color:INK}; return s; };
const light= () => { const s=p.addSlide(); s.background={color:PAPER}; return s; };

/* ───────── 1 · TITLE ───────── */
{
  const s = dark();
  s.addImage({path:img('deck-hero-tall.png'), x:6.85, y:0, w:6.483, h:7.5});
  s.addShape(p.ShapeType.rect,{x:6.85,y:0,w:6.483,h:7.5,fill:{color:INK,transparency:42},line:{type:'none'}});
  eyebrow(s,'Proposal · 30 August 2026','0.85',0.66);
  s.addText([{text:'A WEBSITE THAT\nSELLS CONTAINERS\n',options:{color:PAPER}},
             {text:'WHILE YOU SLEEP.',options:{color:LIME}}],
    {x:0.85,y:1.55,w:5.9,h:3.3,isTextBox:true,margin:0,fontFace:DISP,fontSize:31,bold:true,
     lineSpacingMultiple:0.94,charSpacing:-0.6});
  s.addShape(p.ShapeType.rect,{x:0.85,y:4.55,w:1.5,h:0.045,fill:{color:LIME},line:{type:'none'}});
  s.addText('Prepared for Design Container JA — the website, the buyer’s guide that captures leads, and the system that delivers it.',
    {x:0.85,y:4.85,w:5.7,h:1.25,isTextBox:true,margin:0,fontFace:BODY,fontSize:14.5,color:'B6B6AD',lineSpacingMultiple:1.25});
  s.addText([{text:'J$100,000',options:{fontSize:22,bold:true,color:PAPER,fontFace:DISP}},
             {text:'  FIXED   ·   ',options:{fontSize:10.5,color:MUTEDD,fontFace:DISP,charSpacing:2}},
             {text:'3 WEEKS',options:{fontSize:22,bold:true,color:PAPER,fontFace:DISP}}],
    {x:0.85,y:6.35,w:5.8,h:0.7,isTextBox:true,margin:0,valign:'middle'});
  s.addNotes('Open warmly. Thank them for the time. Frame: I did not come to show you a mock-up — I built the thing. Then move straight to slide 2 rather than talking about YardScale.');
}

/* ───────── 2 · THE GAP ───────── */
{
  const s = light();
  eyebrow(s,'Where you are now','0.85',0.62,MUTED);
  s.addText('THE PROBLEM IS NOT\nDEMAND. IT IS PROOF.',
    {x:0.85,y:1.15,w:8.6,h:1.3,isTextBox:true,margin:0,fontFace:DISP,fontSize:34,bold:true,
     color:INK,lineSpacingMultiple:0.95,charSpacing:-0.4});
  const rows=[
    ['01','Social sells the look. It cannot sell the decision.','A buyer about to spend eight million dollars needs specifications, a price range and proof the structure is engineered. None of that fits in a caption — so the conversation stalls at “DM for price”.'],
    ['02','Every enquiry arrives cold, into one inbox.','You answer the same six questions by hand, several times a week, to people who may not own land yet. That is expensive in the one resource you cannot buy more of.'],
    ['03','You do not own the audience.','A follower is rented. If the platform changes what it shows, your pipeline changes with it. An email list of people who raised their hand is an asset you keep.']];
  let y=2.72;
  rows.forEach(([n,h,b])=>{
    s.addShape(p.ShapeType.ellipse,{x:0.85,y:y,w:0.46,h:0.46,fill:{color:INK},line:{type:'none'}});
    s.addText(n,{x:0.85,y:y,w:0.46,h:0.46,isTextBox:true,margin:0,fontFace:DISP,fontSize:11,
      bold:true,color:LIME,align:'center',valign:'middle'});
    s.addText(h,{x:1.55,y:y-0.04,w:10.9,h:0.34,isTextBox:true,margin:0,fontFace:DISP,fontSize:15,bold:true,color:INK});
    s.addText(b,{x:1.55,y:y+0.33,w:10.9,h:0.78,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,
      color:MUTED,lineSpacingMultiple:1.2});
    y+=1.44;
  });
  foot(s,'THE GAP',false);
  s.addNotes('Do not rush these. Ask after each one whether that matches their experience. The third point — owning the audience — is the one that usually lands hardest.');
}

/* ───────── 3 · THE STAKE ───────── */
{
  const s = dark();
  eyebrow(s,'What it costs you');
  s.addText('EVERY WEEK WITHOUT IT,\nTHE SAME THING HAPPENS.',
    {x:0.85,y:1.15,w:11,h:1.3,isTextBox:true,margin:0,fontFace:DISP,fontSize:32,bold:true,
     color:PAPER,lineSpacingMultiple:0.95,charSpacing:-0.4});
  const stats=[['11pm','When people actually decide about houses — and there is nowhere to send them'],
               ['6','Questions answered by hand, over and over, before anyone is qualified'],
               ['0','Records kept of the buyer who was eight months out but real']];
  stats.forEach(([big,cap],i)=>{
    const x=0.85+i*4.0;
    s.addShape(p.ShapeType.rect,{x,y:2.95,w:3.6,h:2.5,fill:{color:INK2},line:{color:HAIRD,width:0.75}});
    s.addText(big,{x:x+0.35,y:3.2,w:2.9,h:1.05,isTextBox:true,margin:0,fontFace:DISP,fontSize:44,
      bold:true,color:LIME,charSpacing:-1.4,valign:'middle'});
    s.addText(cap,{x:x+0.35,y:4.3,w:2.9,h:1.0,isTextBox:true,margin:0,fontFace:BODY,fontSize:11.5,
      color:'A9A9A0',lineSpacingMultiple:1.2});
  });
  s.addText('None of this is a marketing problem. It is a plumbing problem — and plumbing is fixable.',
    {x:0.85,y:5.85,w:11.6,h:0.5,isTextBox:true,margin:0,fontFace:BODY,fontSize:15,italic:true,color:PAPER});
  foot(s,'THE STAKE');
  s.addNotes('Keep this slide short. It is a bridge, not an argument. The line at the bottom is the pivot into the solution.');
}

/* ───────── 4 · THE PROPOSAL ───────── */
{
  const s = light();
  eyebrow(s,'What we propose','0.85',0.62,MUTED);
  s.addText('A SITE, A GUIDE, AND A\nSYSTEM BETWEEN THEM.',
    {x:0.85,y:1.15,w:11,h:1.3,isTextBox:true,margin:0,fontFace:DISP,fontSize:34,bold:true,
     color:INK,lineSpacingMultiple:0.95,charSpacing:-0.4});
  const cards=[['01','The website','Answers every question a buyer has before they contact you — models, prices, process, hurricane engineering, financing and approvals. The people who do call are already most of the way to yes.'],
               ['02','The buyer’s guide','A 20-page PDF worth having: costs, import duty, parish approvals, financing, and a site checklist. Given away free in exchange for a name and an email.'],
               ['03','The lead system','The guide sends itself. Every enquiry arrives with the parish, the model and the site notes already attached — by email and on WhatsApp, in seconds.']];
  cards.forEach(([n,h,b],i)=>{
    const x=0.85+i*4.0;
    s.addShape(p.ShapeType.rect,{x,y:2.9,w:3.6,h:3.15,fill:{color:'FFFFFF'},line:{color:HAIR,width:0.75}});
    s.addShape(p.ShapeType.ellipse,{x:x+0.35,y:3.2,w:0.44,h:0.44,fill:{color:INK},line:{type:'none'}});
    s.addText(n,{x:x+0.35,y:3.2,w:0.44,h:0.44,isTextBox:true,margin:0,fontFace:DISP,fontSize:10.5,
      bold:true,color:LIME,align:'center',valign:'middle'});
    s.addText(h,{x:x+0.35,y:3.82,w:2.9,h:0.36,isTextBox:true,margin:0,fontFace:DISP,fontSize:16,bold:true,color:INK});
    s.addText(b,{x:x+0.35,y:4.24,w:2.9,h:1.62,isTextBox:true,margin:0,fontFace:BODY,fontSize:11.5,
      color:MUTED,lineSpacingMultiple:1.22});
  });
  s.addText('The site and the guide are already built. You can look at both today.',
    {x:0.85,y:6.35,w:11.6,h:0.45,isTextBox:true,margin:0,fontFace:BODY,fontSize:14.5,italic:true,color:INK});
  foot(s,'THE PROPOSAL',false);
  s.addNotes('This is the moment to slow down and say plainly: this is not a pitch for work I might do. It is done. That is the whole reason they should say yes today.');
}

/* ───────── 5 · THE SITE ───────── */
{
  const s = dark();
  s.addImage({path:img('deck-hero.png'), x:0, y:0, w:W, h:7.333});
  s.addShape(p.ShapeType.rect,{x:0,y:5.55,w:W,h:1.95,fill:{color:INK,transparency:8},line:{type:'none'}});
  s.addText('THE SITE — BUILT, NOT SKETCHED',
    {x:0.85,y:5.82,w:9,h:0.42,isTextBox:true,margin:0,fontFace:DISP,fontSize:19,bold:true,color:PAPER,charSpacing:-0.2});
  s.addText('Mobile-first, loads instantly, and every drawing is vector — so it stays sharp on any screen and costs nothing to host.',
    {x:0.85,y:6.3,w:9.6,h:0.6,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,color:'B6B6AD',lineSpacingMultiple:1.18});
  s.addNotes('Open the live site on a phone here rather than talking over the screenshot. Let them scroll it themselves — that does more than anything you can say.');
}

/* ───────── 6 · THE MODELS ───────── */
{
  const s = light();
  s.addImage({path:img('deck-models.png'), x:0, y:0.9, w:W, h:4.418});
  s.addText('EVERY MODEL, PRICED IN THE OPEN',
    {x:0.85,y:0.3,w:11.6,h:0.45,isTextBox:true,margin:0,fontFace:DISP,fontSize:21,bold:true,color:INK,charSpacing:-0.3});
  s.addText('Prices shown are placeholders benchmarked against the published Jamaican market — we swap in your real numbers in week one. Publishing a range filters out the people who were never going to buy, before they reach your phone.',
    {x:0.85,y:5.55,w:11.6,h:1.0,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,color:MUTED,lineSpacingMultiple:1.2});
  foot(s,'THE RANGE',false);
  s.addNotes('Be explicit that the prices are placeholders and that you need their real ones. This is the single biggest thing you need from them in week one — say so here.');
}

/* ───────── 7 · THE GUIDE ───────── */
{
  const s = dark();
  s.addImage({path:img('deck-guidecover.png'), x:0.85, y:0.95, w:3.28, h:4.64});
  s.addImage({path:img('deck-guidepage.png'), x:4.35, y:1.5, w:2.83, h:4.0});
  eyebrow(s,'The lead magnet');
  s.addText('20 PAGES THEY\nACTUALLY WANT.',
    {x:7.7,y:1.35,w:5,h:1.3,isTextBox:true,margin:0,fontFace:DISP,fontSize:30,bold:true,
     color:PAPER,lineSpacingMultiple:0.95,charSpacing:-0.4});
  const bullets=['The true landed cost of an imported unit — duty, GCT and stamp duty, worked through',
                 'What parish council asks for, and the four things that stall an approval',
                 'Which lenders finance prefab here, and what each needs from the buyer',
                 'Seven questions to ask any builder before paying a deposit',
                 'A site-readiness checklist they can walk their land with'];
  s.addText(bullets.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<bullets.length-1}})),
    {x:7.7,y:2.95,w:4.8,h:2.6,isTextBox:true,margin:0,fontFace:BODY,fontSize:12,color:'A9A9A0',
     paraSpaceAfter:8,lineSpacingMultiple:1.15});
  s.addText('It also makes you the one who told them the truth — the position you want to hold when they finally choose a builder.',
    {x:7.7,y:5.75,w:4.8,h:0.8,isTextBox:true,margin:0,fontFace:BODY,fontSize:12,italic:true,color:LIME,lineSpacingMultiple:1.18});
  foot(s,'THE GUIDE');
  s.addNotes('Hand them the printed guide here if you have one. Physical beats a slide. Point out that it is genuinely useful even to someone who never buys from them — that is what makes it work.');
}

/* ───────── 8 · THE FUNNEL ───────── */
{
  const s = light();
  eyebrow(s,'How it works','0.85',0.62,MUTED);
  s.addText('FROM STRANGER TO SITE VISIT.',
    {x:0.85,y:1.15,w:11,h:0.7,isTextBox:true,margin:0,fontFace:DISP,fontSize:34,bold:true,
     color:INK,charSpacing:-0.4});
  const steps=[['Finds you','Search, a shared link, or your social bio — all now pointing somewhere that sells.'],
               ['Reads the site','Models, prices, process and engineering. Most objections answered before contact.'],
               ['Takes the guide','Not ready to buy, but happy to swap an email for something genuinely useful.'],
               ['Gets nurtured','You now own the relationship, and can stay in touch until they are ready.'],
               ['Books a viewing','Arrives warm, informed, and already comfortable with the price.']];
  steps.forEach(([h,b],i)=>{
    const x=0.85+i*2.42;
    s.addShape(p.ShapeType.rect,{x,y:2.55,w:2.16,h:2.75,fill:{color:i===4?INK:'FFFFFF'},line:{color:i===4?INK:HAIR,width:0.75}});
    s.addText(String(i+1).padStart(2,'0'),{x:x+0.28,y:2.8,w:1.6,h:0.32,isTextBox:true,margin:0,
      fontFace:DISP,fontSize:10,bold:true,color:i===4?LIME:MUTED,charSpacing:2.2});
    s.addText(h,{x:x+0.28,y:3.2,w:1.7,h:0.6,isTextBox:true,margin:0,fontFace:DISP,fontSize:14,bold:true,
      color:i===4?PAPER:INK,lineSpacingMultiple:0.98});
    s.addText(b,{x:x+0.28,y:3.85,w:1.7,h:1.3,isTextBox:true,margin:0,fontFace:BODY,fontSize:10.5,
      color:i===4?'A9A9A0':MUTED,lineSpacingMultiple:1.18});
    if(i<4) s.addShape(p.ShapeType.chevron,{x:x+2.2,y:3.82,w:0.2,h:0.2,fill:{color:LIME},line:{type:'none'}});
  });
  s.addText('The step most builders skip is the third one. It is the only one that turns traffic you already have into a list you own.',
    {x:0.85,y:5.62,w:11.6,h:0.6,isTextBox:true,margin:0,fontFace:BODY,fontSize:14,italic:true,color:INK});
  foot(s,'THE FUNNEL',false);
  s.addNotes('Walk left to right with your hand. Pause on step three. Ask them what happens today to someone who is eight months out — the honest answer is nothing, and they will say so themselves.');
}

/* ───────── 9 · TIMELINE ───────── */
{
  const s = dark();
  eyebrow(s,'Timeline');
  s.addText('THREE WEEKS, START TO LIVE.',
    {x:0.85,y:1.15,w:11,h:0.7,isTextBox:true,margin:0,fontFace:DISP,fontSize:32,bold:true,color:PAPER,charSpacing:-0.4});
  const wk=[['WEEK 1','Content and confirmation','You confirm model names, real prices and specifications. One 45-minute call covers most of it.','Your input'],
            ['WEEK 2','Build and revisions','Your content goes in, the guide takes your real figures, and you get a private preview link. Two rounds included.','Preview link'],
            ['WEEK 3','Launch and handover','Domain connected, forms tested with a real submission, walkthrough recorded, accounts put in your name.','Live site'],
            ['AFTER','Two weeks of support','Anything broken or confusing, we fix it. Not a contract — just making sure what we handed you works.','Included']];
  let y=2.42;
  wk.forEach(([w,h,b,d],i)=>{
    s.addText(w,{x:0.85,y:y+0.03,w:1.3,h:0.3,isTextBox:true,margin:0,fontFace:DISP,fontSize:10.5,
      bold:true,color:LIME,charSpacing:2.2});
    s.addText(h,{x:2.35,y:y-0.02,w:6.4,h:0.34,isTextBox:true,margin:0,fontFace:DISP,fontSize:15,bold:true,color:PAPER});
    s.addText(b,{x:2.35,y:y+0.33,w:7.6,h:0.62,isTextBox:true,margin:0,fontFace:BODY,fontSize:11.5,
      color:'A9A9A0',lineSpacingMultiple:1.18});
    s.addText(d.toUpperCase(),{x:W-3.5,y:y+0.03,w:2.65,h:0.3,isTextBox:true,margin:0,fontFace:DISP,
      fontSize:10,bold:true,color:MUTEDD,charSpacing:2,align:'right'});
    if(i<3) s.addShape(p.ShapeType.rect,{x:0.85,y:y+1.06,w:11.6,h:0.007,fill:{color:HAIRD},line:{type:'none'}});
    y+=1.15;
  });
  s.addText('One thing only would slow this down: waiting on your confirmed prices and specifications.',
    {x:0.85,y:6.95,w:11.6,h:0.4,isTextBox:true,margin:0,fontFace:BODY,fontSize:13,italic:true,color:LIME});
  s.addNotes('Emphasise that the clock is mostly on them, in a friendly way. Ask directly: can you get me the confirmed prices this week?');
}

/* ───────── 10 · INVESTMENT ───────── */
{
  const s = light();
  eyebrow(s,'Investment','0.85',0.62,MUTED);
  s.addText('ONE PRICE. NO SURPRISES.',
    {x:0.85,y:1.1,w:11,h:0.7,isTextBox:true,margin:0,fontFace:DISP,fontSize:34,bold:true,color:INK,charSpacing:-0.4});
  s.addShape(p.ShapeType.rect,{x:0.85,y:2.15,w:6.5,h:3.9,fill:{color:INK},line:{type:'none'}});
  s.addText('TOTAL — FIXED',{x:1.25,y:2.5,w:5.7,h:0.3,isTextBox:true,margin:0,fontFace:DISP,fontSize:10.5,
    bold:true,color:MUTEDD,charSpacing:2.4});
  s.addText('J$100,000',{x:1.25,y:2.9,w:5.7,h:1.1,isTextBox:true,margin:0,fontFace:DISP,fontSize:52,
    bold:true,color:LIME,charSpacing:-1.6,valign:'middle'});
  s.addText('Founding-client rate. In exchange we ask for a short testimonial once the site is live, permission to feature the work, and an introduction to one other business you rate.',
    {x:1.25,y:4.05,w:5.7,h:1.1,isTextBox:true,margin:0,fontFace:BODY,fontSize:12,color:'A9A9A0',lineSpacingMultiple:1.2});
  s.addShape(p.ShapeType.rect,{x:1.25,y:5.2,w:5.7,h:0.007,fill:{color:HAIRD},line:{type:'none'}});
  s.addText('J$50,000 on acceptance   ·   J$50,000 on launch',
    {x:1.25,y:5.38,w:5.7,h:0.36,isTextBox:true,margin:0,fontFace:DISP,fontSize:12,bold:true,color:PAPER});

  const inc=['Website — designed, built, deployed','Buyer’s guide — written, designed, produced',
             'Lead capture and automated delivery','Hosting setup, domain and SSL',
             'Handover, documentation and training','Two weeks of post-launch support'];
  s.addText('WHAT IS INCLUDED',{x:7.9,y:2.5,w:4.6,h:0.3,isTextBox:true,margin:0,fontFace:DISP,
    fontSize:10.5,bold:true,color:MUTED,charSpacing:2.4});
  s.addText(inc.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<inc.length-1}})),
    {x:7.9,y:2.95,w:4.6,h:2.3,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,color:INK,
     paraSpaceAfter:9,lineSpacingMultiple:1.15});
  s.addText('You own everything on final payment — site, guide, domain, files. No lock-in and no monthly fee required to keep it running.',
    {x:7.9,y:5.35,w:4.6,h:0.9,isTextBox:true,margin:0,fontFace:BODY,fontSize:11.5,italic:true,
     color:MUTED,lineSpacingMultiple:1.2});
  foot(s,'INVESTMENT',false);
  s.addNotes('Say the number plainly and then stop talking. Do not justify it. If they ask why it is low, the honest answer is the founding-client trade — testimonial, portfolio, one referral.');
}

/* ───────── 11 · CLOSE ───────── */
{
  const s = dark();
  s.addImage({path:img('deck-magnet.png'), x:6.6, y:0, w:6.733, h:4.88});
  s.addShape(p.ShapeType.rect,{x:6.6,y:0,w:6.733,h:4.88,fill:{color:INK,transparency:58},line:{type:'none'}});
  eyebrow(s,'Next step');
  s.addText([{text:'LOOK AT IT\nBEFORE YOU\n',options:{color:PAPER}},{text:'DECIDE.',options:{color:LIME}}],
    {x:0.85,y:1.5,w:6.2,h:2.5,isTextBox:true,margin:0,fontFace:DISP,fontSize:40,bold:true,
     lineSpacingMultiple:0.94,charSpacing:-0.6});
  s.addText('The site and the guide already exist. Open the preview, read the guide the way one of your buyers would, and tell me what is wrong with it. If it is right, say the word and we start on your content this week.',
    {x:0.85,y:4.3,w:5.9,h:1.4,isTextBox:true,margin:0,fontFace:BODY,fontSize:14,color:'B6B6AD',lineSpacingMultiple:1.25});
  s.addShape(p.ShapeType.rect,{x:0.85,y:5.85,w:5.9,h:0.9,fill:{color:LIME},line:{type:'none'}});
  s.addText('SEE THE LIVE PREVIEW  →',{x:0.85,y:5.85,w:5.9,h:0.9,isTextBox:true,margin:0,fontFace:DISP,
    fontSize:15,bold:true,color:INK,align:'center',valign:'middle',charSpacing:1.6});
  s.addText('yardscaledigital@gmail.com',{x:7.6,y:6.1,w:4.9,h:0.4,isTextBox:true,margin:0,fontFace:BODY,
    fontSize:12.5,color:MUTEDD,align:'right'});
  s.addNotes('Close by asking for the decision, not for another meeting. If they hesitate, the fallback ask is small: give me your confirmed prices this week and I will put them in, then you decide.');
}

p.writeFile({fileName: process.env.OUT || __dirname + '/YardScale-Pitch-Design-Container-JA.pptx'}).then(f=>console.log('wrote',f));
