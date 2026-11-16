(()=>{'use strict';
const $=s=>document.querySelector(s),LS=localStorage;
const DEFAULT_CLOUD=[['en-US-Chirp-HD-F','Chirp HD · US Female','en-US'],['en-US-Chirp-HD-D','Chirp HD · US Male','en-US'],['en-US-Chirp-HD-O','Chirp HD · US Female 2','en-US'],['en-US-Neural2-F','Neural2 · US Female','en-US'],['en-US-Neural2-D','Neural2 · US Male','en-US'],['en-GB-Neural2-A','Neural2 · UK Female','en-GB'],['en-GB-Neural2-B','Neural2 · UK Male','en-GB'],['en-US-Studio-O','Studio · US Female','en-US'],['en-US-Studio-Q','Studio · US Male','en-US']];
let CLOUD=(()=>{try{const v=JSON.parse(localStorage.getItem('aispeak.voices'));return v&&v.length?v:DEFAULT_CLOUD}catch{return DEFAULT_CLOUD}})();
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
let unlocked=false;const unlock=()=>{if(unlocked)return;unlocked=true;AU.src=SIL;AU.play().then(()=>{if(!S.audio)AU.pause()}).catch(()=>{})};
['pointerdown','keydown'].forEach(e=>addEventListener(e,unlock,{once:true,capture:true}));
const S={q:[],i:-1,run:0,playing:false,paused:false,audio:null,blobs:new Map(),grp:[],liveFrom:0,deferred:null};
const key=()=>LS.getItem('aispeak.key')||'';
const toast=(m,t=4000)=>{const e=$('#toast');e.textContent=m;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,t);$('#status').textContent=m};

/* ---------- theme ---------- */
const th=LS.getItem('aispeak.theme');if(th)document.documentElement.dataset.theme=th;
$('#themeBtn').onclick=()=>{const d=document.documentElement,dark=d.dataset.theme?d.dataset.theme==='dark':!matchMedia('(prefers-color-scheme:light)').matches;d.dataset.theme=dark?'light':'dark';LS.setItem('aispeak.theme',d.dataset.theme)};

/* ---------- voices ---------- */
let bv=[];
const loadBV=()=>{bv=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));fill()};
function bestBrowser(lang){
 const pref=lang==='en-GB'?['Google UK English Female','Google UK English Male']:['Google US English'];
 for(const n of pref){const v=bv.find(v=>v.name===n);if(v)return v}
 return bv.find(v=>/google/i.test(v.name))||bv.find(v=>/natural|neural|online/i.test(v.name))||bv.find(v=>v.lang===lang)||bv[0]||null}
function fill(){
 const sel=$('#voice'),cur=LS.getItem('aispeak.voice')||'b:auto';
 sel.innerHTML='';
 const g1=document.createElement('optgroup');g1.label='Browser (free, works offline)';
 g1.append(new Option('Best Google/natural voice (auto)','b:auto'));
 bv.forEach(v=>g1.append(new Option(v.name+' ('+v.lang+')','b:'+v.name)));
 const g2=document.createElement('optgroup');g2.label='Google Cloud (API key)'+(key()?'':' – add key in Settings');
 CLOUD.forEach(c=>g2.append(new Option(c[1],'c:'+c[0])));
 sel.append(g1,g2);sel.value=[...sel.options].some(o=>o.value===cur)?cur:'b:auto';badge()}
function badge(){const b=$('#engine'),cloud=$('#voice').value.startsWith('c:')&&key()&&navigator.onLine;b.textContent=cloud?'Google Cloud TTS':'Browser voice';b.className='badge'+(cloud?' cloud':'')}
$('#voice').onchange=e=>{LS.setItem('aispeak.voice',e.target.value);badge()};
if('speechSynthesis'in window){loadBV();speechSynthesis.onvoiceschanged=loadBV}else fill();
$('#rate').value=LS.getItem('aispeak.rate')||1;
const rateOut=()=>$('#rateOut').textContent=(+$('#rate').value).toFixed(2).replace(/0$/,'')+'×';rateOut();
$('#rate').oninput=e=>{LS.setItem('aispeak.rate',e.target.value);rateOut()};

/* ---------- speech ---------- */
const split=t=>(t.replace(/\s+/g,' ').trim().match(/[^.!?…]+(?:[.!?…]+["')\]]*|$)\s*/g)||[]).map(s=>s.trim()).filter(Boolean)
 .flatMap(s=>s.length>300?s.match(/.{1,280}(?:\s|$)/g).map(x=>x.trim()):[s]);
function bubble(text,spans=true){
 const w=$('#welcome');if(w)w.remove();
 const b=document.createElement('article');b.className='bubble';
 const items=split(text).map(t=>{const s=document.createElement('span');s.className='s';s.textContent=t+' ';b.append(s);return{t,el:s,b}});
 $('#chat').append(b);b.scrollIntoView({block:'end'});return items}
function enqueue(items,start=false){
 S.grp=items;if(start){S.q=S.q.slice(0,Math.max(S.i,-1)+1)}
 S.q.push(...items);if(!S.playing)step(S.q.indexOf(items[0]))}
function speakNow(items){stop(true);S.q=[...items];S.grp=items;step(0)}
function mark(it){document.querySelectorAll('.s.now').forEach(e=>e.classList.remove('now'));document.querySelectorAll('.bubble.active').forEach(e=>e.classList.remove('active'));
 if(it&&it.el){it.el.classList.add('now');it.b.classList.add('active');it.el.scrollIntoView({block:'nearest'})}}
function ui(on){$('#wave').classList.toggle('on',on);$('#play').textContent=on?'⏸':'▶';$('#dl').disabled=!S.blobs.size}
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
 const u=new SpeechSynthesisUtterance(it.t);
 let voice=null;if(v.startsWith('b:')&&v!=='b:auto')voice=bv.find(x=>x.name===v.slice(2));
 else{const lang=v.startsWith('c:')?(CLOUD.find(c=>c[0]===v.slice(2))||[])[2]:'en-US';voice=bestBrowser(lang||'en-US')}
 if(voice){u.voice=voice;u.lang=voice.lang}else u.lang='en-US';
 u.rate=rate;u.onend=done;u.onerror=e=>{if(e.error!=='canceled'&&e.error!=='interrupted')done()};
 speechSynthesis.speak(u)}
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
 if(!S.paused){S.paused=true;S.audio?S.audio.pause():speechSynthesis.pause();$('#play').textContent='▶';$('#wave').classList.remove('on')}
 else{S.paused=false;S.audio?S.audio.play():speechSynthesis.resume();ui(true)}};
$('#stop').onclick=()=>stop();
$('#next').onclick=()=>S.playing&&step(S.i+1);
$('#prev').onclick=()=>S.playing&&step(Math.max(0,S.i-1));
$('#replay').onclick=()=>S.grp.length&&speakNow(S.grp);
$('#dl').onclick=()=>{const bl=S.grp.map(it=>[...S.blobs].find(([k])=>k.endsWith('|'+it.t))).filter(Boolean).map(x=>x[1]);
 if(!bl.length)return toast('Play a paragraph with a Google Cloud voice first.');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(bl,{type:'audio/mpeg'}));a.download='aispeak.mp3';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000)};

/* ---------- composer ---------- */
const inp=$('#input'),mode=()=>document.querySelector('[name=mode]:checked').value;
function send(){const t=inp.value.trim();if(!t)return;
 const items=bubble(t);inp.value='';S.liveFrom=0;
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
const net=()=>{const o=navigator.onLine,n=$('#net');n.textContent=o?'Online':'Offline';n.className='badge '+(o?'ok':'off');badge();if(!o)toast('You are offline. Using browser voices.')};
addEventListener('online',net);addEventListener('offline',net);net();
const ios=/iphone|ipad|ipod/i.test(navigator.userAgent),standalone=matchMedia('(display-mode:standalone)').matches||navigator.standalone;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();S.deferred=e;if(!LS.getItem('aispeak.nobanner')){$('#installBanner').hidden=false}$('#installBtn').hidden=false});
const doInstall=async()=>{if(S.deferred){S.deferred.prompt();await S.deferred.userChoice;S.deferred=null;$('#installBanner').hidden=true;$('#installBtn').hidden=true}};
$('#installBtn').onclick=$('#bannerInstall').onclick=doInstall;
$('#bannerClose').onclick=()=>{$('#installBanner').hidden=true;LS.setItem('aispeak.nobanner','1')};
if(ios&&!standalone&&!LS.getItem('aispeak.nobanner')){$('#installText').textContent='To install: tap Share, then “Add to Home Screen”.';$('#bannerInstall').hidden=true;$('#installBanner').hidden=false}
addEventListener('appinstalled',()=>{$('#installBanner').hidden=true;$('#installBtn').hidden=true});
})();
