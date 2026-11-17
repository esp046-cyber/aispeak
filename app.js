(()=>{'use strict';
const SV=d=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
const IC={sun:SV('<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>'),moon:SV('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),gear:SV('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
prev:SV('<polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>'),next:SV('<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>'),play:SV('<polygon points="6 4 20 12 6 20 6 4"/>'),pause:SV('<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'),stop:SV('<rect x="5" y="5" width="14" height="14" rx="2"/>'),
dl:SV('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'),trash:SV('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>'),
x:SV('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),chev:SV('<polyline points="6 9 12 15 18 9"/>'),lib:SV('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),plus:SV('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'),
clip:SV('<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>'),file:SV('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>'),down:SV('<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>')};
const $=s=>document.querySelector(s),LS=localStorage;
const fillIc=()=>document.querySelectorAll('[data-ic]').forEach(e=>e.innerHTML=IC[e.dataset.ic]);fillIc();
const DEFAULT_CLOUD=[['en-US-Chirp-HD-F','Chirp HD · US Female','en-US'],['en-US-Chirp-HD-D','Chirp HD · US Male','en-US'],['en-US-Chirp-HD-O','Chirp HD · US Female 2','en-US'],['en-US-Neural2-F','Neural2 · US Female','en-US'],['en-US-Neural2-D','Neural2 · US Male','en-US'],['en-GB-Neural2-A','Neural2 · UK Female','en-GB'],['en-GB-Neural2-B','Neural2 · UK Male','en-GB'],['en-US-Studio-O','Studio · US Female','en-US'],['en-US-Studio-Q','Studio · US Male','en-US']];
let CLOUD=(()=>{try{const v=JSON.parse(LS.getItem('aispeak.voices'));return v&&v.length?v:DEFAULT_CLOUD}catch{return DEFAULT_CLOUD}})();
const FAM=['Chirp3-HD','Chirp-HD','Neural2','Studio','Journey'];
async function fetchVoices(k){
 const r=await fetch('https://texttospeech.googleapis.com/v1/voices?key='+encodeURIComponent(k));
 if(!r.ok)throw Object.assign(new Error('HTTP '+r.status),{status:r.status});
 const out=[];
 for(const v of (await r.json()).voices||[]){const lang=(v.languageCodes||[]).find(l=>/^en-(US|GB|AU)$/.test(l));if(!lang)continue;
  const fi=FAM.findIndex(f=>v.name.includes('-'+f+'-'));if(fi<0)continue;
  out.push([fi,lang,[v.name,FAM[fi]+' · '+v.name.split(FAM[fi]+'-')[1]+' · '+lang+' '+(v.ssmlGender||'').toLowerCase(),lang]])}
 out.sort((a,b)=>a[0]-b[0]||a[1].localeCompare(b[1])||a[2][0].localeCompare(b[2][0]));
 if(!out.length)throw new Error('No English voices returned');
 CLOUD=out.map(o=>o[2]);LS.setItem('aispeak.voices',JSON.stringify(CLOUD));return CLOUD.length}
const S={flat:[],pbs:[],before:[],total:0,i:-1,pos:0,run:0,playing:false,paused:false,audio:null,blobs:new Map(),follow:true,doc:null,lastS:null,lastW:null,editing:false,deferred:null};
const key=()=>LS.getItem('aispeak.key')||'';
const toast=(m,t=4000)=>{const e=$('#toast');e.textContent=m;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,t);$('#status').textContent=m};
const AU=new Audio();AU.preload='auto';
const SIL='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
let unlocked=false;const unlock=()=>{if(unlocked)return;unlocked=true;try{const AC=new(window.AudioContext||window.webkitAudioContext)();AC.resume();const q=new SpeechSynthesisUtterance(' ');q.volume=0;speechSynthesis.speak(q)}catch{}AU.src=SIL;AU.play().then(()=>{if(!S.audio)AU.pause()}).catch(()=>{})};
['pointerdown','keydown'].forEach(e=>addEventListener(e,unlock,{once:true,capture:true}));

/* theme + typography */
const themeIcon=()=>{const d=document.documentElement,dark=d.dataset.theme?d.dataset.theme==='dark':!matchMedia('(prefers-color-scheme:light)').matches;$('#themeBtn').innerHTML=dark?IC.sun:IC.moon;$('#themeBtn').setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');const m=document.querySelector('meta[name=theme-color]');if(m)m.content=dark?'#090d16':'#f6f8fc'};
if(LS.getItem('aispeak.theme'))document.documentElement.dataset.theme=LS.getItem('aispeak.theme');themeIcon();
$('#themeBtn').onclick=()=>{const d=document.documentElement,dark=d.dataset.theme?d.dataset.theme==='dark':!matchMedia('(prefers-color-scheme:light)').matches;d.dataset.theme=dark?'light':'dark';LS.setItem('aispeak.theme',d.dataset.theme);themeIcon()};
let fam=LS.getItem('aispeak.fam')||'sans',fs=+LS.getItem('aispeak.fs')||18;
const FF={sans:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",serif:"'Iowan Old Style',Georgia,'Times New Roman',serif",mono:"ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"};
const applyType=()=>{const r=$('#reader').style;r.setProperty('--rf',FF[fam]);r.setProperty('--rs',fs+'px');$('#fsOut').textContent=fs+'px';document.querySelectorAll('[data-f]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.f===fam)))};
document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{fam=b.dataset.f;LS.setItem('aispeak.fam',fam);applyType()});
$('#fsDown').onclick=()=>{fs=Math.max(16,fs-1);LS.setItem('aispeak.fs',fs);applyType()};$('#fsUp').onclick=()=>{fs=Math.min(24,fs+1);LS.setItem('aispeak.fs',fs);applyType()};applyType();

/* voices */
let bv=[];
const loadBV=()=>{bv=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));fill()};
function bestBrowser(lang){
 const pref=(lang==='en-GB'?['Google UK English Female','Google UK English Male','Daniel','Karen','Moira']:['Google US English','Samantha (Enhanced)','Ava (Premium)','Samantha']).concat(['Aria','Guy','Daniel','Karen','Moira']);
 for(const n of pref){const v=bv.find(v=>v.name.includes(n));if(v)return v}
 return bv.find(v=>/google/i.test(v.name))||bv.find(v=>/natural|neural|online/i.test(v.name))||bv.find(v=>v.lang===lang)||bv[0]||null}
function fill(){
 const sel=$('#voice'),cur=LS.getItem('aispeak.voice')||(key()?'c:'+CLOUD[0][0]:'b:auto');sel.innerHTML='';
 const g1=document.createElement('optgroup');g1.label='Active Device Voices (Free)';
 g1.append(new Option('Auto: '+((bestBrowser('en-US')||{}).name||'device default'),'b:auto'));bv.forEach(v=>g1.append(new Option(v.name+' ('+v.lang+')','b:'+v.name)));
 const g2=document.createElement('optgroup');g2.label='Google Cloud HD (Requires API Key in Settings)';CLOUD.forEach(c=>g2.append(new Option(c[1],'c:'+c[0])));
 key()?sel.append(g2,g1):sel.append(g1,g2);
 const ok=[...sel.options].some(o=>o.value===cur)&&!(cur.startsWith('c:')&&!key());sel.value=ok?cur:(key()?'c:'+CLOUD[0][0]:'b:auto');badge()}
function badge(){const b=$('#engine'),on=navigator.onLine,cloud=$('#voice').value.startsWith('c:')&&key()&&on;b.innerHTML='<i class="dot"></i>'+(!on?'Offline':cloud?'Cloud HD':'Browser');b.className='badge'+(!on?' off':cloud?' cloud':'');$('#vsLabel').textContent='Voice • '+(+$('#rate').value).toFixed(1)+'x';tele(S.i>=0?S.i:S.pos)}
$('#voice').onchange=e=>{LS.setItem('aispeak.voice',e.target.value);badge()};
if('speechSynthesis'in window){loadBV();speechSynthesis.onvoiceschanged=loadBV}else fill();
$('#rate').value=LS.getItem('aispeak.rate')||1;
const rateOut=()=>{$('#rateOut').textContent=(+$('#rate').value).toFixed(2).replace(/0$/,'')+'×';badge()};
$('#rate').oninput=e=>{LS.setItem('aispeak.rate',e.target.value);rateOut()};rateOut();

/* document model */
const split=t=>(t.replace(/\s+/g,' ').trim().match(/[^.!?…]+(?:[.!?…]+["')\]”’]*|$)\s*/g)||[]).map(s=>s.trim()).filter(Boolean).flatMap(s=>s.length>300?s.match(/.{1,280}(?:\s|$)/g).map(x=>x.trim()):[s]);
const parse=t=>t.split(/\n+/).map(x=>x.trim()).filter(Boolean);
function mkSent(t,i,p){const el=document.createElement('span');el.className='sentence';el.dataset.i=i;el.dataset.p=p;
 const words=[],frag=document.createDocumentFragment(),re=/\S+/g;let m;
 while(m=re.exec(t)){const w=document.createElement('span');w.className='w';w.textContent=m[0];frag.append(w,document.createTextNode(' '));words.push({el:w,start:m.index,len:m[0].length+1})}
 el.append(frag);const tot=words.reduce((a,w)=>a+w.len,0)||1;let c=0;
 return{t,el,words,cum:words.map(w=>(c+=w.len)/tot),p,i,n:words.length}}
function addParas(paras){const root=$('#doc');
 for(const text of paras){const P=S.pbs.length,pb=document.createElement('article');pb.className='pb';pb.dataset.p=P;
  const ix=document.createElement('span');ix.className='idx';ix.textContent=String(P+1).padStart(2,'0');
  const tx=document.createElement('div');tx.className='ptxt';
  for(const t of split(text)){const it=mkSent(t,S.flat.length,P);S.before.push(S.total);S.total+=it.n;S.flat.push(it);tx.append(it.el)}
  pb.append(ix,tx);root.append(pb);S.pbs.push(pb)}
 $('#scrub').max=Math.max(0,S.flat.length-1);tele(S.pos)}
const docs=()=>{try{return JSON.parse(LS.getItem('aispeak.docs')||'[]')}catch{return[]}};
const poss=()=>{try{return JSON.parse(LS.getItem('aispeak.pos')||'{}')}catch{return{}}};
function saveDoc(d){const a=docs().filter(x=>x.id!==d.id);a.unshift(d);try{LS.setItem('aispeak.docs',JSON.stringify(a.slice(0,25)))}catch{toast('Storage is full. Delete old documents in the Library.')}}
function savePos(){if(!S.doc)return;const p=poss();p[S.doc.id]=S.pos;try{LS.setItem('aispeak.pos',JSON.stringify(p))}catch{}}
function openDoc(d,play){stop(true);S.doc=d;S.flat=[];S.pbs=[];S.before=[];S.total=0;S.lastS=S.lastW=null;$('#doc').innerHTML='';
 S.pos=0;addParas(parse(d.text));S.pos=Math.min(poss()[d.id]||0,S.flat.length-1);tele(S.pos);
 requestAnimationFrame(()=>{const it=S.flat[S.pos];if(it&&S.pos>0)it.el.scrollIntoView({block:'center'});else $('#reader').scrollTop=0});
 if(play)S.follow=true,step(S.pos)}
function newDoc(text,play,title){const paras=parse(text);if(!paras.length)return toast('Add some text first.');const t=paras.join('\n\n');
 const ex=docs().find(x=>x.text===t);const d=ex||{id:Date.now()+'',title:title||paras.join(' ').split(/\s+/).slice(0,6).join(' '),text:t,ts:Date.now()};
 if(S.editing&&S.doc){d.id=S.doc.id;d.title=S.doc.title}S.editing=false;saveDoc(d);openDoc(d,play)}
function appendText(text){const paras=parse(text);if(!paras.length)return toast('Add some text first.');if(!S.doc)return newDoc(text,true);
 S.doc.text+='\n\n'+paras.join('\n\n');saveDoc(S.doc);addParas(paras);toast('Added '+paras.length+' paragraph'+(paras.length>1?'s':'')+'.')}
function welcome(){$('#doc').innerHTML='<section class="card"><h2>Welcome to AISpeak</h2><p>A reader that speaks. Paste an article, import a chapter, or tap a sample to hear it in a natural English voice.</p><div class="samples"><button class="chip" data-s="Hey there! I just wanted to check in and see how your week is going. Did you get a chance to try that new cafe we talked about? I would love to hear what you thought.">Conversation</button><button class="chip" data-s="The morning fog rolled slowly over the hills, softening every edge of the valley below. She paused at the gate, listening.\nSomewhere far off, a bell was ringing, and for the first time in years, she was not afraid.">Book narration</button><button class="chip" data-s="Good morning. Here is your daily briefing. Today will be mostly sunny with a high of twenty-four degrees.\nYou have three meetings, starting at nine thirty. Remember to submit your report before noon.">Daily briefing</button></div></section>'}
$('#doc').addEventListener('click',e=>{const c=e.target.closest('.chip');if(c){newDoc(c.dataset.s,true,c.textContent);return}const s=e.target.closest('.sentence');if(s){S.follow=true;$('#follow').hidden=true;step(+s.dataset.i)}});

/* telemetry + highlight */
function tele(i){const n=S.flat.length;if(!n){$('#tele').textContent='No document yet';$('#scrub').value=0;return}
 i=Math.max(0,Math.min(i,n-1));const it=S.flat[i],rem=S.total-S.before[i],m=Math.max(1,Math.ceil(rem/(150*(+$('#rate').value||1))));
 $('#tele').textContent='Paragraph '+(it.p+1)+' of '+S.pbs.length+' • Sentence '+(i+1)+' of '+n+' • ~'+m+' min left';$('#scrub').value=i}
function mark(i){const it=S.flat[i];
 if(S.lastS){S.lastS.el.classList.remove('on');const pb=S.lastS.el.closest('.pb');pb&&pb.classList.remove('cur')}
 if(S.lastW){S.lastW.classList.remove('on');S.lastW=null}
 if(!it){S.lastS=null;$('#reader').classList.remove('speaking');return}
 it.el.classList.add('on');it.el.closest('.pb').classList.add('cur');S.lastS=it;$('#reader').classList.add('speaking');S.pos=i;savePos();tele(i);
 if(S.follow)it.el.scrollIntoView({behavior:'smooth',block:'center'})}
function hl(it,k){if(S.lastW)S.lastW.classList.remove('on');const w=it.words&&it.words[k];if(w){w.el.classList.add('on');S.lastW=w.el}}
function ui(on){$('#wave').classList.toggle('on',on);$('#play').innerHTML=on?IC.pause:IC.play}
for(const e of['wheel','touchmove'])$('#reader').addEventListener(e,()=>{if(S.playing&&!S.paused){S.follow=false;$('#follow').hidden=false}},{passive:true});
$('#follow').onclick=()=>{S.follow=true;$('#follow').hidden=true;const it=S.flat[S.i];it&&it.el.scrollIntoView({behavior:'smooth',block:'center'})};

/* engine */
const pend=new Map();
function getBlob(it,name,rate){
 const k=name+'|'+rate+'|'+it.t;
 if(S.blobs.has(k))return Promise.resolve(S.blobs.get(k));if(pend.has(k))return pend.get(k);
 const p=(async()=>{
  const nopitch=/Chirp|Journey/i.test(name),lang=name.split('-').slice(0,2).join('-');
  const cfg={audioEncoding:'MP3',speakingRate:rate};if(!nopitch)cfg.pitch=0;
  let r;try{r=await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key='+encodeURIComponent(key()),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input:{text:it.t},voice:{languageCode:lang,name},audioConfig:cfg})})}catch{throw new Error('Network error reaching Google Cloud.')}
  if(!r.ok){let m='';try{m=(await r.json()).error.message}catch{}
   throw new Error(r.status===429?'Google Cloud quota exceeded.':r.status===400||r.status===403?'Google Cloud rejected the API key or voice ('+(m||r.status)+').':'Google Cloud error '+r.status+'.')}
  const d=await r.json(),bin=atob(d.audioContent),a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);
  const blob=new Blob([a],{type:'audio/mpeg'});S.blobs.set(k,blob);return blob})();
 pend.set(k,p);const clr=()=>pend.delete(k);p.then(clr,clr);return p}
async function cloud(it,name,rate,run){
 const nx=it.i!=null&&S.flat[it.i]===it?S.flat[it.i+1]:null;if(nx)getBlob(nx,name,rate).catch(()=>{});
 const blob=await getBlob(it,name,rate);if(run!==S.run)return new Promise(()=>{});
 const url=URL.createObjectURL(blob);S.audio=AU;
 return new Promise((res,rej)=>{AU.onended=()=>{URL.revokeObjectURL(url);S.audio=null;res()};AU.onerror=()=>{S.audio=null;rej(new Error('Audio playback failed.'))};AU.src=url;
  AU.play().then(()=>{const tick=()=>{if(run!==S.run||S.audio!==AU)return;const d=AU.duration;if(d>0&&it.words){const f=AU.currentTime/d,k=it.cum.findIndex(c=>c>=f);hl(it,k<0?it.words.length-1:k)}requestAnimationFrame(tick)};tick()}).catch(e=>{S.audio=null;rej(e)})})}
function browser(it,v,rate,run,done){
 if(!('speechSynthesis'in window)){toast('Speech is not supported in this browser.');return stop()}
 if(!bv.length)loadBV();const u=new SpeechSynthesisUtterance(it.t);let voice=null;
 if(v.startsWith('b:')&&v!=='b:auto')voice=bv.find(x=>x.name===v.slice(2));else{const lang=v.startsWith('c:')?(CLOUD.find(c=>c[0]===v.slice(2))||[])[2]:'en-US';voice=bestBrowser(lang||'en-US')}
 if(voice){u.voice=voice;u.lang=voice.lang}else u.lang='en-US';
 u.rate=rate;u.onend=()=>{if(run===S.run)done()};u.onerror=e=>{if(run===S.run&&e.error!=='canceled'&&e.error!=='interrupted')done()};
 u.onboundary=e=>{if(run!==S.run||!it.words)return;let k=0;for(let j=0;j<it.words.length;j++){if(it.words[j].start<=e.charIndex)k=j;else break}hl(it,k)};
 speechSynthesis.cancel();speechSynthesis.speak(u)}
function say(it,run,done){
 const v=$('#voice').value,rate=+$('#rate').value,br=()=>browser(it,v,rate,run,done);
 if(v.startsWith('c:')&&key()&&navigator.onLine)cloud(it,v.slice(2),rate,run).then(()=>{if(run===S.run)done()}).catch(e=>{if(run!==S.run)return;toast(e.message+' Using browser voice instead.',6000);br()});
 else{if(v.startsWith('c:')&&!key()&&!say.w){say.w=1;toast('Add a Google Cloud API key in Settings for studio voices. Using browser voice.')}br()}}
let L=[],liveBusy=false;
function cancelAudio(){S.run++;liveBusy=false;if(S.audio){AU.pause();S.audio=null}if('speechSynthesis'in window)speechSynthesis.cancel()}
function step(i){cancelAudio();L=[];
 if(i<0||i>=S.flat.length){S.playing=false;S.i=-1;if(i>=S.flat.length){S.pos=0;savePos()}mark(-1);ui(false);tele(S.pos);return}
 S.playing=true;S.paused=false;S.i=i;mark(i);ui(true);const run=S.run;say(S.flat[i],run,()=>step(i+1))}
function stop(keep){cancelAudio();L=[];S.playing=false;S.paused=false;S.i=-1;mark(-1);ui(false);tele(S.pos)}
function pumpLive(){if(liveBusy||!L.length)return;cancelAudio();S.playing=false;ui(false);liveBusy=true;const run=S.run,it=L.shift();say(it,run,()=>{if(run!==S.run)return;liveBusy=false;pumpLive()})}

/* transport */
$('#play').onclick=()=>{if(!S.flat.length)return toast('Tap + to add some text first.');
 if(!S.playing){S.follow=true;$('#follow').hidden=true;step(S.pos)}
 else if(!S.paused){S.paused=true;S.audio?AU.pause():speechSynthesis.pause();$('#play').innerHTML=IC.play;$('#wave').classList.remove('on')}
 else{S.paused=false;S.audio?AU.play():speechSynthesis.resume();ui(true)}};
const go=d=>{if(!S.flat.length)return;S.follow=true;$('#follow').hidden=true;step(Math.min(Math.max((S.playing?S.i:S.pos)+d,0),S.flat.length-1))};
$('#prev').onclick=()=>go(-1);$('#next').onclick=()=>go(1);$('#stop').onclick=()=>stop();
$('#scrub').addEventListener('input',e=>tele(+e.target.value));
$('#scrub').addEventListener('change',e=>{const i=+e.target.value;S.follow=true;$('#follow').hidden=true;if(S.playing)step(i);else{S.pos=i;savePos();const it=S.flat[i];it&&it.el.scrollIntoView({behavior:'smooth',block:'center'});tele(i)}});
$('#dl').onclick=async()=>{const v=$('#voice').value;if(!(v.startsWith('c:')&&key()))return toast('MP3 download needs a Google Cloud voice and an API key.');if(!S.flat.length)return toast('Nothing to download yet.');
 const name=v.slice(2),rate=+$('#rate').value,bl=new Array(S.flat.length);let n=0,idx=0;
 const worker=async()=>{while(idx<S.flat.length){const j=idx++;bl[j]=await getBlob(S.flat[j],name,rate);toast('Preparing MP3… '+(++n)+'/'+S.flat.length,60000)}};
 try{await Promise.all([worker(),worker(),worker()]);const bufs=await Promise.all(bl.map(b=>b.arrayBuffer()));const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(bufs.map(b=>new Uint8Array(b)),{type:'audio/mpeg'}));a.download=((S.doc&&S.doc.title)||'aispeak').replace(/[^\w-]+/g,'_')+'.mp3';a.click();toast('MP3 ready.')}catch(e){toast(e.message,6000)}};

/* sheets */
let openS=null;
function openSheet(id){closeSheet();openS=id;$('#scrim').hidden=false;$('#'+id).hidden=false;if(id==='sLib')renderLib();if(id==='sNew')stats()}
function closeSheet(){if(!openS)return;$('#'+openS).hidden=true;$('#scrim').hidden=true;openS=null}
$('#scrim').onclick=closeSheet;document.querySelectorAll('.sx').forEach(b=>b.onclick=closeSheet);
$('#vsBtn').onclick=()=>openSheet('sVoice');$('#aaBtn').onclick=()=>openSheet('sType');$('#newBtn').onclick=()=>openSheet('sNew');$('#libBtn').onclick=()=>openSheet('sLib');
function renderLib(){const l=$('#libList'),a=docs(),p=poss();l.innerHTML='';
 if(!a.length){l.innerHTML='<p class="hint">Nothing saved yet. Documents you read appear here automatically.</p>';return}
 a.forEach(d=>{const n=parse(d.text).length,r=document.createElement('div');r.className='li';
  const b=document.createElement('button');b.className='lit';const pi=p[d.id]||0;let para=1,c=0;for(const x of parse(d.text)){c+=split(x).length;if(pi<c)break;para++}
  b.innerHTML='<b></b><small></small>';b.firstChild.textContent=d.title||'Untitled';b.lastChild.textContent=n+' paragraph'+(n>1?'s':'')+(pi>0?' • Resume at Para '+Math.min(para,n):'');
  b.onclick=()=>{closeSheet();openDoc(d,false);toast('Opened. Press play to continue.')};
  const x=document.createElement('button');x.className='act';x.setAttribute('aria-label','Delete document');x.innerHTML=IC.trash;
  x.onclick=()=>{LS.setItem('aispeak.docs',JSON.stringify(docs().filter(y=>y.id!==d.id)));if(S.doc&&S.doc.id===d.id){stop();S.doc=null;S.flat=[];S.pbs=[];welcome();tele(0)}renderLib()};
  r.append(b,x);l.append(r)})}
const inp=$('#input'),mode=()=>document.querySelector('[name=mode]:checked').value;
function stats(){const t=inp.value.trim(),w=t?t.split(/\s+/).length:0,p=t?parse(t).length:0;$('#stats').textContent=w+' words • '+p+' paragraph'+(p===1?'':'s')+' • ~'+(w?Math.max(1,Math.ceil(w/(150*(+$('#rate').value||1)))):0)+' min'}
inp.addEventListener('input',()=>{stats();inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,220)+'px';
 if(mode()!=='live')return;const v=inp.value;if(v.length<S.liveFrom)S.liveFrom=0;
 const m=v.slice(S.liveFrom||0).match(/^[\s\S]*?[.!?]+["')\]]*\s/);
 if(m){S.liveFrom=(S.liveFrom||0)+m[0].length;S.liveSpoke=1;const t=m[0].trim();if(t){L.push({t});pumpLive()}}});
const doRead=()=>{const t=inp.value;if(!t.trim())return toast('Type or paste some text first.');const live=mode()==='live'&&S.liveSpoke;
 closeSheet();inp.value='';inp.style.height='';S.liveFrom=0;S.liveSpoke=0;newDoc(t,!live,S.nextTitle);S.nextTitle=null};
$('#readBtn').onclick=doRead;
$('#appendBtn').onclick=()=>{const t=inp.value;if(!t.trim())return toast('Type or paste some text first.');closeSheet();inp.value='';inp.style.height='';appendText(t)};
$('#editBtn').onclick=()=>{if(!S.doc)return toast('No document to edit yet.');inp.value=S.doc.text;S.editing=true;stats()};
inp.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();doRead()}});
$('#pasteBtn').onclick=async()=>{try{const t=await navigator.clipboard.readText();if(!t.trim())return toast('Clipboard is empty.');inp.value=inp.value?inp.value+'\n\n'+t:t;stats()}catch{toast('Clipboard blocked. Long-press the box and choose Paste.')}};
$('#fileBtn').onclick=()=>$('#file').click();
$('#file').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{let t=String(r.result);if(/\.(md|markdown)$/i.test(f.name))t=t.replace(/^#{1,6}\s+/gm,'').replace(/[*_`>]/g,'').replace(/!?\[([^\]]*)\]\([^)]*\)/g,'$1');inp.value=t;S.nextTitle=f.name.replace(/\.[^.]+$/,'');stats()};r.readAsText(f);e.target.value=''};
addEventListener('keydown',e=>{if(e.key==='Escape'){if(openS)closeSheet();else if($('#settings').open){}else stop()}});

/* settings, network, install */
const dlg=$('#settings');$('#settingsBtn').onclick=()=>{$('#apiKey').value=key();$('#keyMsg').textContent='';dlg.showModal()};
dlg.addEventListener('close',()=>{const k=$('#apiKey').value.trim();k?LS.setItem('aispeak.key',k):(LS.removeItem('aispeak.key'),LS.removeItem('aispeak.voices'),CLOUD=DEFAULT_CLOUD);fill();if(k)fetchVoices(k).then(fill).catch(()=>{})});
$('#clearKey').onclick=()=>{$('#apiKey').value='';$('#keyMsg').textContent='Key removed. Browser voices will be used.'};
$('#testVoice').onclick=()=>{dlg.close();L.push({t:'Hello! This is how I sound. Pick a voice and speed that feel natural.'});pumpLive()};
$('#testKey').onclick=async()=>{const k=$('#apiKey').value.trim(),m=$('#keyMsg');if(!k){m.textContent='Enter a key first.';return}m.textContent='Testing…';
 try{const n=await fetchVoices(k);LS.setItem('aispeak.key',k);fill();m.textContent='OK: key works. Loaded '+n+' live English voices.'}
 catch(e){m.textContent=e.status===429?'Quota exceeded for this key.':e.status?'Error: Google rejected this key ('+e.status+'). Check that the Text-to-Speech API is enabled and the key restrictions allow this site.':'Error: '+(e.message||'Could not reach Google.')}};
const net=()=>{badge();if(!navigator.onLine)toast('You are offline. Using browser voices.')};addEventListener('online',net);addEventListener('offline',net);
const ios=/iphone|ipad|ipod/i.test(navigator.userAgent),standalone=matchMedia('(display-mode:standalone)').matches||navigator.standalone;
if(standalone)$('#installRow').hidden=true;
else if(ios){$('#installText').textContent='To install on iPhone: tap the Share button in Safari, then Add to Home Screen.';$('#bannerInstall').hidden=true}
else{$('#installText').textContent='Install is available from your browser menu when supported.';$('#bannerInstall').hidden=true}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();S.deferred=e;$('#installText').textContent='Install AISpeak as an app on this device.';$('#bannerInstall').hidden=false});
$('#bannerInstall').onclick=async()=>{if(S.deferred){S.deferred.prompt();await S.deferred.userChoice;S.deferred=null;$('#installRow').hidden=true}};
addEventListener('appinstalled',()=>{$('#installRow').hidden=true});

/* boot */
const last=docs()[0];if(last)openDoc(last,false);else{welcome();tele(0)}
})();
