// Security gate: proves the public (http/https) build never requests or stores an API key,
// and the local (file://) build keeps the optional coach. Spawns its own static server.
//   node tools/security-gate.js
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path=require('path');
(async () => {
  const srv = spawn('python3', ['-I','-m','http.server','8765','--bind','127.0.0.1'], {cwd: path.resolve(__dirname,'..'), stdio:'ignore'});
  await new Promise(r=>setTimeout(r,900));
  const b = await chromium.launch(); const fails=[]; const ok=(c,m)=>{ if(!c) fails.push(m); };
  async function probe(url){
    const ctx=await b.newContext(); const p=await ctx.newPage(); const errs=[];
    p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); }); p.on('dialog',d=>d.dismiss());
    await p.goto(url,{waitUntil:'load'}); await p.waitForTimeout(2200);
    const r = await p.evaluate(async ()=>{
      const vis=id=>{const e=document.getElementById(id); return !!e && getComputedStyle(e).display!=='none' && !e.hasAttribute('hidden');};
      const out={ enabled:AEGIS_ENABLED, robotBtn:!!document.querySelector('button[onclick="App.showApiModal()"]'), csp:!!document.querySelector('meta[http-equiv="Content-Security-Policy"]'), lsKey:localStorage.getItem('anthropic_api_key') };
      try{ App.showApiModal(); }catch(e){} try{ App.toggleChat(); }catch(e){}
      await new Promise(r=>setTimeout(r,100));
      out.modalVisible=vis('apimod'); out.coachVisible=vis('ce');
      App.openChallenge('rf-001'); await new Promise(r=>setTimeout(r,80)); App.launch(); await new Promise(r=>setTimeout(r,200));
      document.getElementById('fi').value=String(App.chState.scenario.exp.ans); App.submit(); await new Promise(r=>setTimeout(r,250));
      out.play=/correct|solved|earned|✓/i.test(document.body.innerText); return out;
    });
    await ctx.close(); return {r, errs, csp: errs.filter(e=>/Content Security Policy/i.test(e))};
  }
  const pub = await probe('http://127.0.0.1:8765/index.html');
  const loc = await probe('file://' + path.resolve(__dirname,'..','index.html'));
  ok(pub.r.enabled===false, 'public: AEGIS should be disabled');
  ok(!pub.r.robotBtn, 'public: robot/API-key button present');
  ok(!pub.r.modalVisible, 'public: API-key modal became visible');
  ok(!pub.r.coachVisible, 'public: coach panel became visible');
  ok(pub.r.lsKey===null, 'public: key found in localStorage');
  ok(pub.r.csp, 'public: CSP meta missing');
  ok(pub.csp.length===0, 'public: CSP violations: '+pub.csp.slice(0,2).join(' | '));
  ok(pub.errs.length===0, 'public: errors: '+pub.errs.slice(0,2).join(' | '));
  ok(pub.r.play, 'public: challenge did not play');
  ok(loc.r.enabled===true && loc.r.robotBtn && loc.r.modalVisible, 'local: coach/key UI should be available');
  ok(loc.errs.length===0 && loc.csp.length===0, 'local: errors/CSP: '+loc.errs.slice(0,2).join(' | '));
  await b.close(); srv.kill();
  console.log(`security-gate: ${fails.length?'FAIL':'PASS'} (${11-fails.length}/11)`); fails.forEach(f=>console.log('  ✗ '+f));
  process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
