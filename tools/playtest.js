// App-faithful playtest: node tools/playtest.js aerosec-lab.html
const fs=require('fs'); const path=process.argv[2]||'aerosec-lab.html';
const h=fs.readFileSync(path,'utf8'); const js=(h.match(/<script[^>]*>([\s\S]*?)<\/script>/)||[])[1];
if(!js){console.error('no <script>');process.exit(2);}
globalThis.SEL={signal:[],cls:'',triage:[],cms:[]}; const store={};
globalThis.document={readyState:'complete',getElementById:(id)=>store[id]||null,
 createElement:()=>({style:{cssText:''},_t:'',set textContent(v){this._t=v},get textContent(){return this._t},id:''}),
 addEventListener:()=>{},body:{appendChild:(el)=>{store[el.id]=el;}},
 querySelector:(q)=>q.includes('ttb-class')?{value:SEL.cls}:null,
 querySelectorAll:(q)=>q.includes('ttb-alert-cb')?SEL.signal.map(id=>({dataset:{alertId:id}})):q.includes('ttb-triage-cb')?SEL.triage.map(v=>({value:v})):q.includes('ttb-cm-cb')?SEL.cms.map(v=>({value:v})):[]};
globalThis.window={addEventListener:()=>{},removeEventListener:()=>{},innerWidth:1200};globalThis.navigator={userAgent:'node'};
globalThis.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};globalThis.location={href:'',hash:''};
globalThis.indexedDB={open:()=>({addEventListener:()=>{}})};globalThis.requestAnimationFrame=()=>0;globalThis.setTimeout=()=>0;globalThis.matchMedia=()=>({matches:false,addEventListener:()=>{}});
const origErr=console.error; console.error=()=>{};
const TEST=`
const SEEDS=[1,7,42,777,31337,2024];
const fmt={
 'aaaa-010':s=>s.firstContactTime+','+s.firstContactStation,'rud-001':s=>s.exploitedTick+',0x'+Number(s.exploitedCmd).toString(16),
 'has3-001':s=>s.correctSequence.join(','),'has4-001':s=>s.correctSequence.join(','),
 'aaaa-012':s=>s.question==='both'?s.answer.raan+' '+s.answer.aop:s.question==='raan_drift'?String(s.answer.raan):String(s.answer.aop),
 'aaaa-011':s=>String(s.Pr_dBW),'comms-004':s=>s.message,'comms-005':s=>[s.scid,s.vcid,s.apid,s.seq,s.questions.secret].join(' '),
 'has3-003':s=>s.forgedAuthHex,'adcs-003':s=>s.ra_deg+' '+s.dec_deg,'has4-002':s=>s.sigma_final.map(x=>x.toFixed(6)).join(' '),'has4-003':s=>s.anomalyTimestamps.join(','),'o-002':s=>String(s.altitude_km),'adcs-002':s=>String(s.torque)};
function human(id,s){ if(fmt[id]) return fmt[id](s); if(s.exp&&s.exp.ans!==undefined) return String(s.exp.ans); if(s.flag) return String(s.flag);
 if(s.answer!==undefined){const a=s.answer; if(Array.isArray(a)) return a.join(' '); if(typeof a==='object') return s.question&&a[s.question]!==undefined?String(a[s.question]):Object.values(a).join(' '); return String(a);} return null; }
let fails=[],n=0;
for(const c of CATALOG){ const E=CHALLENGES[c.id]; if(!E) continue;
 for(const seed of SEEDS){ let s; try{s=E.generate(seed);}catch(e){fails.push(c.id+' gen '+e.message);continue;} n++;
  if(s.correctClassification){ SEL={signal:s.signalIds,cls:s.correctClassification,triage:s.correctTriageIds,cms:s.correctCmIds};
   let r; try{r=verifyWithEngine(E,'x',s,seed);}catch(e){r=e.message} if(r!==true) fails.push(c.id+' tabletop '+r);
   SEL={signal:s.noiseIds||[],cls:'C9',triage:[],cms:[]}; try{ if(verifyWithEngine(E,'x',s,seed)===true) fails.push(c.id+' tabletop accepts wrong'); }catch(e){} continue; }
  const ans=human(c.id,s); if(ans===null){fails.push(c.id+' no-answer-format');continue;}
  let r; if(typeof E.verify==='function'){ try{r=verifyWithEngine(E,ans,s,seed);}catch(e){r=e.message} } else if(s.exp&&s.exp.check){ try{r=s.exp.check(s.exp.ans);}catch(e){r=e.message} } else r='no-verify-path';
  if(r!==true) fails.push(c.id+' seed'+seed+' -> '+r+' ans="'+ans+'"');
  try{ const w = typeof E.verify==='function'? verifyWithEngine(E,'ZZ_WRONG_999',s,seed) : s.exp.check('ZZ_WRONG_999'); if(w===true) fails.push(c.id+' accepts wrong'); }catch(e){}
 }}
return {n,fails,catalog:CATALOG.length,build:BUILD_ID};`;
const out=new Function(js+'\n'+TEST)();
console.error=origErr;
console.log(`build ${out.build} · catalog ${out.catalog} · ${out.n} checks · ${out.fails.length} failures`);
out.fails.forEach(f=>console.log('  ✗ '+f));
process.exit(out.fails.length?1:0);

// ── INDEX DRIFT GUARD ────────────────────────────────────────────────────────
// index.html (GitHub Pages root) must be byte-identical to aerosec-lab.html.
try {
  const fs2=require('fs');
  if (fs2.existsSync('index.html')) {
    const a=fs2.readFileSync('aerosec-lab.html'); const b=fs2.readFileSync('index.html');
    if (!a.equals(b)) { console.log('  ✗ index.html has DRIFTED from aerosec-lab.html — re-copy before publishing'); process.exitCode=1; }
    else console.log('index.html == aerosec-lab.html (Pages root in sync)');
  }
} catch(e){}
