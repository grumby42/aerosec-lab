// Real-browser UX smoke test (headless Chromium via Playwright).
//   node tools/ux-smoke.js [index.html]
// Checks: clean load (no page/console errors), build badge, no auto-opened modal,
// mobile nav tabs all visible, no null/malformed hrefs across every challenge brief,
// openChallenge routing targets valid, a legacy seed-first engine passes in the REAL UI,
// and a tabletop passes with correct DOM selections. Exits non-zero on any failure.
const { chromium } = require('playwright'); const path=require('path');
const FILE = 'file://' + path.resolve(process.argv[2] || 'index.html');
(async () => {
  const fails=[]; const ok=(c,m)=>{ if(!c) fails.push(m); };
  const b = await chromium.launch();
  // ── desktop
  let ctx = await b.newContext({ viewport:{width:1280,height:900} }); let p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());}); p.on('dialog',d=>d.dismiss());
  await p.goto(FILE,{waitUntil:'load'}); await p.waitForTimeout(2500);
  const d = await p.evaluate(async ()=>{
    const out={};
    out.badge=(document.getElementById('build-badge')||{}).textContent||'';
    out.modal=getComputedStyle(document.getElementById('apimod')).display;
    const ids=new Set(CATALOG.map(c=>c.id));
    out.badRoutes=[...document.documentElement.outerHTML.matchAll(/openChallenge\('([a-z0-9-]+)'\)/g)].map(m=>m[1]).filter(r=>!ids.has(r));
    let badHref=0; for(const c of CATALOG){ App.openChallenge(c.id); await new Promise(r=>setTimeout(r,5));
      for(const a of document.querySelectorAll('#pbm a')){ const h=a.getAttribute('href')||''; if(!h||h==='#'||/null|undefined|\[object/.test(h)) badHref++; } }
    out.badHref=badHref;
    // legacy seed-first engine in the real UI
    App.openChallenge('aaaa-002'); await new Promise(r=>setTimeout(r,50)); App.launch(); await new Promise(r=>setTimeout(r,200));
    const sc=App.chState.scenario; document.getElementById('fi').value=sc.answer.az+' '+sc.answer.el; App.submit(); await new Promise(r=>setTimeout(r,250));
    out.legacyPass=/correct|solved|earned|✓/i.test(document.body.innerText);
    // tabletop with correct DOM selections
    App.openChallenge('tabletop-008'); await new Promise(r=>setTimeout(r,50)); App.launch(); await new Promise(r=>setTimeout(r,250));
    const t=App.chState.scenario;
    document.querySelectorAll('.ttb-alert-cb').forEach(cb=>cb.checked=t.signalIds.includes(cb.dataset.alertId));
    const rad=document.querySelector(`input[name="ttb-class"][value="${t.correctClassification}"]`); if(rad) rad.checked=true;
    document.querySelectorAll('.ttb-triage-cb').forEach(cb=>cb.checked=t.correctTriageIds.includes(cb.value));
    document.querySelectorAll('.ttb-cm-cb').forEach(cb=>cb.checked=t.correctCmIds.includes(cb.value));
    App.submit(); await new Promise(r=>setTimeout(r,300));
    out.tabletopPass=/correct|solved|earned|passed|✓/i.test(document.body.innerText) && !/not quite|incorrect/i.test(document.body.innerText);
    return out;
  });
  ok(errs.length===0, 'page/console errors: '+errs.slice(0,3).join(' | '));
  ok(/AS-\d/.test(d.badge), 'build badge missing');
  ok(d.modal==='none', 'API-key modal auto-opened');
  ok(d.badRoutes.length===0, 'broken openChallenge routes: '+d.badRoutes.join(','));
  ok(d.badHref===0, 'malformed hrefs in briefs: '+d.badHref);
  ok(d.legacyPass, 'legacy seed-first engine (aaaa-002) did not pass in real UI');
  ok(d.tabletopPass, 'tabletop-008 correct selection did not pass in real UI');
  await ctx.close();
  // ── mobile
  ctx = await b.newContext({ viewport:{width:360,height:780}, deviceScaleFactor:3, isMobile:true, hasTouch:true }); p = await ctx.newPage(); p.on('dialog',x=>x.dismiss());
  await p.goto(FILE,{waitUntil:'load'}); await p.waitForTimeout(600);
  const m = await p.evaluate(async ()=>{
    const tabs=[...document.querySelectorAll('.ntab')]; const vis=tabs.filter(t=>{const r=t.getBoundingClientRect(); return r.width>0 && r.right<=window.innerWidth;}).length;
    App.openChallenge('rud-001'); await new Promise(r=>setTimeout(r,50)); App.launch(); await new Promise(r=>setTimeout(r,300));
    const pre=[...document.querySelectorAll('#scp pre')]; const preWraps=pre.every(e=>getComputedStyle(e).whiteSpace==='pre-wrap');
    return {tabs:tabs.length, vis, overflow:document.documentElement.scrollWidth>window.innerWidth+2, preWraps};
  });
  ok(m.vis===m.tabs, `mobile nav tabs visible ${m.vis}/${m.tabs}`);
  ok(!m.overflow, 'mobile page overflows horizontally');
  ok(m.preWraps, 'engine <pre> blocks not wrapping on mobile');
  await b.close();
  console.log(`ux-smoke: ${fails.length? 'FAIL':'PASS'} (${9-fails.length}/9)`); fails.forEach(f=>console.log('  ✗ '+f));
  process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
