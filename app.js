(()=>{'use strict';
const SV=d=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
const IC={sun:SV('<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>'),moon:SV('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),gear:SV('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
prev:SV('<polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>'),next:SV('<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>'),play:SV('<polygon points="6 4 20 12 6 20 6 4"/>'),pause:SV('<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'),stop:SV('<rect x="5" y="5" width="14" height="14" rx="2"/>'),
dl:SV('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'),rotate:SV('<polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10"/>'),
copy:SV('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),trash:SV('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>'),
volume:SV('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>'),x:SV('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),chev:SV('<polyline points="6 9 12 15 18 9"/>')};
document.querySelectorAll('[data-ic]').forEach(e=>e.innerHTML=IC[e.dataset.ic]);
const $=s=>document.querySelector(s),LS=localStorage;
const DEFAULT_CLOUD=[['en-US-Chirp-HD-F','Chirp HD · US Female','en-US'],['en-US-Chirp-HD-D','Chirp HD · US Male','en-US'],['en-US-Chirp-HD-O','Chirp HD · US Female 2','en-US'],['en-US-Neural2-F','Neural2 · US Female','en-US'],['en-US-Neural2-D','Neural2 · US Male','en-US'],['en-GB-Neural2-A','Neural2 · UK Female','en-GB'],['en-GB-Neural2-B','Neural2 · UK Male','en-GB'],['en-US-Studio-O','Studio · US Female','en-US'],['en-US-Studio-Q','Studio · US Male','en-US']];
let CLOUD=(()=>{try{const v=JSON.parse(localStorage.getItem('aispeak.voices'));return v&&v.length?v:DEFAULT_CLOUD}catch{return DEFAULT_CLOUD}$('#testVoice').onclick=()=>speakNow([{t:'Hello! This is how I sound. Pick a voice and speed that feel natural.',el:null,b:null}]);
inp.addEventListener('input',()=>{inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,160)+'px'});
})();
const FAM=['Chirp3-HD','Chirp-HD','Neural2','Studio','Journey'];
async function fetchVoices(k){
 const r=await fetch('https://texttospeech.googleapis.com/v1/voices?key='+encodeURIComponent(k));
 if(!r.ok)throw Object.assign(new Error('HTTP '+r.status),{status:r.status});
 const out=[];
 for(const v of (await r.json()).voices||[]){
  const lang=(v.languageCodes||[]).find(l=>/^en-(US|GB|AU)$/.test(l));if(!lang)continue;
  const fi=FAM.findIndex(f=>v.name.includes('-'+f+'-'));if(fi<0)continue;
  out.push([fi,lang,[v.name,FAM[fi]+' · '+v.name.split(FAM[fi]+'-')[1]+' · '+lang+' '+(v.ssmlGender||'').toLowerCase(),lang]]);}
 out.sort((a,b)=>a[0]-b[0]||a[1].localeCompare(b[1])||a[2][0].localeCompare(b[2][0]));
 if(!out.length)throw new Error('No English voices returned');
 CLOUD=out.map(o=>o[2]);LS.setItem('aispeak.voices',JSON.stringify(CLOUD));return CLOUD.length}
const AU=new Audio();AU.preload='auto';
const SIL='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
let unlocked=false;const unlock=()=>{if(unlocked)return;unlocked=true;try{const AC=new(window.AudioContext||window.webkitAudioContext)();AC.resume();const q=new SpeechSynthesisUtterance(' ');q.volume=0;speechSynthesis.speak(q)}catch{}AU.src=SIL;AU.play().then(()=>{if(!S.audio)AU.pause()}).catch(()=>{})};
['pointerdown','keydown'].forEach(e=>addEventListener(e,unlock,{once:true,capture:true}));
const S={q:[],i:-1,run:0,playing:false,paused:false,audio:null,blobs:new Map(),grp:[],liveFrom:0,deferred:null};
const key=()=>LS.getItem('aispeak.key')||'';
const toast=(m,t=4000)=>{const e=$('#toast');e.textContent=m;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,t);$('#status').textContent=m};

/* ---------- theme ---------- */
const th=LS.getItem('aispeak.theme');if(th)document.documentElement.dataset.theme=th;
const themeIcon=()=>{const d=document.documentElement,dark=d.dataset.theme?d.dataset.theme==='dark':!matchMedia('(prefers-color-scheme:light)').matches;$('#themeBtn').innerHTML=dark?IC.sun:IC.moon;$('#themeBtn').setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme')};themeIcon();
const tc=()=>{const m=document.querySelector('meta[name=theme-color]');if(m)m.content=getComputedStyle(document.body).backgroundColor};addEventListener('load',tc);
$('#themeBtn').onclick=()=>{const d=document.documentElement,dark=d.dataset.theme?d.dataset.theme==='dark':!matchMedia('(prefers-color-scheme:light)').matches;d.dataset.theme=dark?'light':'dark';LS.setItem('aispeak.theme',d.dataset.theme);tc();themeIcon()};

/* ---------- voices ---------- */
let bv=[];
const loadBV=()=>{bv=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));fill()};
function bestBrowser(lang){
 const pref=(lang==='en-GB'?['Google UK English Female','Google UK English Male','Daniel','Karen','Moira']:['Google US English','Samantha (Enhanced)','Ava (Premium)','Samantha']).concat(['Aria','Guy','Daniel','Karen','Moira']);
 for(const n of pref){const v=bv.find(v=>v.name.includes(n));if(v)return v}
 return bv.find(v=>/google/i.test(v.name))||bv.find(v=>/natural|neural|online/i.test(v.name))||bv.find(v=>v.lang===lang)||bv[0]||null}
function fill(){
 const sel=$('#voice'),cur=LS.getItem('aispeak.voice')||(key()?'c:'+CLOUD[0][0]:'b:auto');
 sel.innerHTML='';
 const g1=document.createElement('optgroup');g1.label='Active Device Voices (Free)';
 g1.append(new Option('Auto: '+((bestBrowser('en-US')||{}).name||'device default'),'b:auto'));
 bv.forEach(v=>g1.append(new Option(v.name+' ('+v.lang+')','b:'+v.name)));
 const g2=document.createElement('optgroup');g2.label='Google Cloud HD (Requires API Key in Settings)';
 CLOUD.forEach(c=>g2.append(new Option(c[1],'c:'+c[0])));
 key()?sel.append(g2,g1):sel.append(g1,g2);const ok=[...sel.options].some(o=>o.value===cur)&&!(cur.startsWith('c:')&&!key());sel.value=ok?cur:(key()?'c:'+CLOUD[0][0]:'b:auto');badge()}
function badge(){const b=$('#engine'),on=navigator.onLine,cloud=$('#voice').value.startsWith('c:')&&key()&&on;b.innerHTML='<i class="dot"></i>'+(!on?'Offline':cloud?'Cloud HD • Ready':'Browser • Ready');b.className='badge'+(!on?' off':cloud?' cloud':'');const l=$('#vsLabel');if(l)l.textContent='Voice • '+(+$('#rate').value).toFixed(1)+'x'}
$('#voice').onchange=e=>{LS.setItem('aispeak.voice',e.target.value);badge()};
if('speechSynthesis'in window){loadBV();speechSynthesis.onvoiceschanged=loadBV}else fill();
$('#rate').value=LS.getItem('aispeak.rate')||1;
const rateOut=()=>$('#rateOut').textContent=(+$('#rate').value).toFixed(2).replace(/0$/,'')+'×';rateOut();
$('#rate').oninput=e=>{LS.setItem('aispeak.rate',e.target.value);rateOut();badge()};

/* ---------- speech ---------- */
const split=t=>(t.replace(/\s+/g,' ').trim().match(/[^.!?…]+(?:[.!?…]+["')\]]*|$)\s*/g)||[]).map(s=>s.trim()).filter(Boolean)
 .flatMap(s=>s.length>300?s.match(/.{1,280}(?:\s|$)/g).map(x=>x.trim()):[s]);
function bubble(text,spans=true){
 const w=$('#welcome');if(w)w.remove();
 const b=document.createElement('article');b.className='bubble';
 const items=split(text).map(t=>{const s=document.createElement('span');s.className='s';s.textContent=t+' ';b.append(s);return{t,el:s,b}});
 const a=document.createElement('div');a.className='acts';
 [['rotate','Replay',()=>speakNow(items)],['copy','Copy',()=>navigator.clipboard&&navigator.clipboard.writeText(text).then(()=>toast('Copied'))],['trash','Delete',()=>{if(S.grp===items)stop();b.remove()}]].forEach(([i,l,f])=>{const x=document.createElement('button');x.className='act';x.innerHTML=IC[i];x.setAttribute('aria-label',l+' message');x.onclick=f;a.append(x)});b.append(a);
 $('#chat').append(b);requestAnimationFrame(()=>$('#chat').scrollTo({top:$('#chat').scrollHeight,behavior:'smooth'}));return items}
function enqueue(items,start=false){
 S.grp=items;if(start){S.q=S.q.slice(0,Math.max(S.i,-1)+1)}
 S.q.push(...items);if(!S.playing)step(S.q.indexOf(items[0]))}
function speakNow(items){stop(true);S.q=[...items];S.grp=items;step(0)}
function mark(it){document.querySelectorAll('.s.now').forEach(e=>e.classList.remove('now'));document.querySelectorAll('.bubble.active').forEach(e=>e.classList.remove('active'));
 if(it&&it.el){it.el.classList.add('now');it.b.classList.add('active');it.el.scrollIntoView({block:'nearest'})}}
function ui(on){$('#wave').classList.toggle('on',on);$('#play').innerHTML=on?IC.pause:IC.play;$('#dl').disabled=!S.blobs.size}
function cancelAudio(){S.run++;if(S.audio){S.audio.pause();S.audio=null}if('speechSynthesis'in window)speechSynthesis.cancel()}
function step(i){
 cancelAudio();
 if(i<0||i>=S.q.length){S.playing=false;S.i=-1;mark(null);ui(false);return}
 S.i=i;S.playing=true;S.paused=false;const it=S.q[i],run=S.run;mark(it);ui(true);
 const v=$('#voice').value,rate=+$('#rate').value,done=()=>{if(run===S.run)step(i+1)};
 if(v.startsWith('c:')&&key()&&navigator.onLine){
  cloud(it,v.slice(2),rate,run).then(done).catch(e=>{if(run!==S.run)return;toast(e.message+' Using browser voice instead.',6000);browser(it,v,rate,done)})
 }else{if(v.startsWith('c:')&&!key()&&!step.warned){step.warned=1;toast('Add a Google Cloud API key in Settings for studio voices. Using browser voice.')}browser(it,v,rate,done)}
}
function browser(it,v,rate,done){
 if(!('speechSynthesis'in window)){toast('Speech is not supported in this browser.');return stop()}
 if(!bv.length)loadBV();const u=new SpeechSynthesisUtterance(it.t);
 let voice=null;if(v.startsWith('b:')&&v!=='b:auto')voice=bv.find(x=>x.name===v.slice(2));
 else{const lang=v.startsWith('c:')?(CLOUD.find(c=>c[0]===v.slice(2))||[])[2]:'en-US';voice=bestBrowser(lang||'en-US')}
 if(voice){u.voice=voice;u.lang=voice.lang}else u.lang='en-US';
 u.rate=rate;u.onend=done;u.onerror=e=>{if(e.error!=='canceled'&&e.error!=='interrupted')done()};
 speechSynthesis.cancel();speechSynthesis.speak(u)}
const pend=new Map();
function getBlob(it,name,rate){
 const k=name+'|'+rate+'|'+it.t;
 if(S.blobs.has(k))return Promise.resolve(S.blobs.get(k));
 if(pend.has(k))return pend.get(k);
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
 const nx=S.q[S.q.indexOf(it)+1];if(nx)getBlob(nx,name,rate).catch(()=>{});
 const blob=await getBlob(it,name,rate);
 if(run!==S.run)return new Promise(()=>{});
 const url=URL.createObjectURL(blob);S.audio=AU;ui(true);
 return new Promise((res,rej)=>{AU.onended=()=>{URL.revokeObjectURL(url);S.audio=null;res()};AU.onerror=()=>{S.audio=null;rej(new Error('Audio playback failed.'))};AU.src=url;AU.play().catch(e=>{S.audio=null;rej(e)})})}
function stop(quiet){cancelAudio();S.playing=false;S.paused=false;S.i=-1;if(!quiet){S.q=[];}mark(null);ui(false)}

/* ---------- transport ---------- */
$('#play').onclick=()=>{
 if(!S.playing){if(S.grp.length)speakNow(S.grp);return}
 if(!S.paused){S.paused=true;S.audio?S.audio.pause():speechSynthesis.pause();$('#play').innerHTML=IC.play;$('#wave').classList.remove('on')}
 else{S.paused=false;S.audio?S.audio.play():speechSynthesis.resume();ui(true)}};
$('#stop').onclick=()=>stop();
$('#next').onclick=()=>S.playing&&step(S.i+1);
$('#prev').onclick=()=>S.playing&&step(Math.max(0,S.i-1));
$('#dl').onclick=()=>{const bl=S.grp.map(it=>[...S.blobs].find(([k])=>k.endsWith('|'+it.t))).filter(Boolean).map(x=>x[1]);
 if(!bl.length)return toast('Play a paragraph with a Google Cloud voice first.');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(bl,{type:'audio/mpeg'}));a.download='aispeak.mp3';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000)};

/* ---------- composer ---------- */
const inp=$('#input'),mode=()=>document.querySelector('[name=mode]:checked').value;
function send(){const t=inp.value.trim();if(!t)return;
 const items=bubble(t);inp.value='';inp.style.height='';S.liveFrom=0;
 if(mode()==='live'&&S.liveSpoken){S.grp=items;S.liveSpoken=0;return}
 S.liveSpoken=0;speakNow(items)}
$('#send').onclick=send;
inp.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();send()}else if(e.key==='Enter'&&!e.shiftKey&&mode()==='send'&&matchMedia('(min-width:700px)').matches){e.preventDefault();send()}});
addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#settings').open)stop()});
inp.addEventListener('input',()=>{
 if(mode()!=='live')return;
 const v=inp.value;if(v.length<S.liveFrom)S.liveFrom=0;
 const rest=v.slice(S.liveFrom),m=rest.match(/^[\s\S]*?[.!?]+["')\]]*\s/);
 if(m){S.liveFrom+=m[0].length;S.liveSpoken=1;const t=m[0].trim();if(t){const it=[{t,el:null,b:null}];if(S.playing)S.q.push(...it);else{S.q=[];step(0,S.q.push(...it)&&0)}}}});
document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>speakNow(bubble(c.dataset.s)));

/* ---------- settings ---------- */
const dlg=$('#settings');$('#settingsBtn').onclick=()=>{$('#apiKey').value=key();$('#keyMsg').textContent='';dlg.showModal()};
dlg.addEventListener('close',()=>{const k=$('#apiKey').value.trim();k?LS.setItem('aispeak.key',k):(LS.removeItem('aispeak.key'),LS.removeItem('aispeak.voices'),CLOUD=DEFAULT_CLOUD);fill();if(k)fetchVoices(k).then(fill).catch(()=>{})});
$('#clearKey').onclick=()=>{$('#apiKey').value='';$('#keyMsg').textContent='Key removed. Browser voices will be used.'};
$('#testKey').onclick=async()=>{const k=$('#apiKey').value.trim(),m=$('#keyMsg');if(!k){m.textContent='Enter a key first.';return}
 m.textContent='Testing…';
 try{const n=await fetchVoices(k);LS.setItem('aispeak.key',k);fill();m.textContent='✓ Key works. Loaded '+n+' live English voices into the voice menu.'}
 catch(e){m.textContent=e.status===429?'Quota exceeded for this key.':e.status?'✗ Google rejected this key ('+e.status+'). Check that the Text-to-Speech API is enabled and the key restrictions allow this site.':'✗ '+(e.message||'Could not reach Google.')}};

/* ---------- online / install ---------- */
const net=()=>{badge();if(!navigator.onLine)toast('You are offline. Using browser voices.')};
addEventListener('online',net);addEventListener('offline',net);net();
const ios=/iphone|ipad|ipod/i.test(navigator.userAgent),standalone=matchMedia('(display-mode:standalone)').matches||navigator.standalone;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();S.deferred=e;if(!LS.getItem('aispeak.nobanner')){$('#installBanner').hidden=false}0});
const doInstall=async()=>{if(S.deferred){S.deferred.prompt();await S.deferred.userChoice;S.deferred=null;$('#installBanner').hidden=true;0}};
$('#bannerInstall').onclick=doInstall;
$('#bannerClose').onclick=()=>{$('#installBanner').hidden=true;LS.setItem('aispeak.nobanner','1')};
if(ios&&!standalone&&!LS.getItem('aispeak.nobanner')){$('#installText').textContent='To install: tap Share, then “Add to Home Screen”.';$('#bannerInstall').hidden=true;$('#installBanner').hidden=false}
addEventListener('appinstalled',()=>{$('#installBanner').hidden=true;0});
$('#vsBtn').onclick=()=>{const d=$('#drawer');d.hidden=!d.hidden;$('#vsBtn').setAttribute('aria-expanded',String(!d.hidden))};
inp.placeholder=matchMedia('(pointer:coarse)').matches?'Type or paste English text to read aloud...':'Type or paste English text… (Ctrl/Cmd + Enter to read aloud)';
})();
