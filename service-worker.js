const CACHE='weekly-check-pwa-v36-duplicate-diagnostics-20260926';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-192.png','./icon-maskable-512.png'];

const DIAG = String.raw`
/* v36 read-only duplicate diagnostics */
const dupDiagState={renders:0,saves:0,cloudEvents:0,lastSave:'-',lastCloud:'-'};
function diagTasks(d){const o=[];(d?.days||[]).forEach((a,di)=>(a||[]).forEach(t=>{const x=(t?.text||'').trim();if(x)o.push({di,text:x,status:+t.status||0})}));return o}
function diagDupes(a){const m=new Map();a.forEach(t=>{const k=t.di+'|'+t.text.toLowerCase()+'|'+t.status;m.set(k,(m.get(k)||0)+1});return [...m.entries()].filter(x=>x[1]>1)}
async function refreshDupDiag(){
 const box=document.getElementById('dupDiag');if(!box||box.style.display==='none')return;
 const cur=currentWeekKey||weekKey(monday()),base=new Date(cur+'T00:00:00');
 const keys=[-1,0,1].map(n=>{const d=new Date(base);d.setDate(d.getDate()+n*7);return ymd(d)});
 const cloud=new Map();
 if(currentUser){try{const snap=await getDocs(collection(db,'users',currentUser.uid,'weekly_check'));snap.forEach(x=>cloud.set(x.id,fromCloud(x.data())))}catch(e){}}
 const lines=['WEEKLY CHECK · 복제 진단','현재 주: '+cur,'렌더링 '+dupDiagState.renders+'회 · 저장 요청 '+dupDiagState.saves+'회 · Firebase 수신 '+dupDiagState.cloudEvents+'회','마지막 저장: '+dupDiagState.lastSave+' · 마지막 수신: '+dupDiagState.lastCloud,''];
 for(const k of keys){
   const ld=load(k),ll=diagTasks(ld),du=diagDupes(ll);let cc=currentUser?'0':'로그인 필요',cd='-',cmp='-';
   if(currentUser&&cloud.has(k)){const sd=cloud.get(k),sl=diagTasks(sd);cc=String(sl.length);cd=String(diagDupes(sl).length);cmp=JSON.stringify(toCloud(ld))===JSON.stringify(toCloud(sd))?'같음':'다름 ⚠️'}
   else if(currentUser){cd='0';cmp=ll.length?'로컬만 있음 ⚠️':'같음'}
   lines.push((k===cur?'▶ ':'  ')+k+' · 로컬 '+ll.length+' / Firebase '+cc+' / 로컬중복 '+du.length+' / 서버중복 '+cd+' / '+cmp);
   du.slice(0,5).forEach(([sig,n])=>lines.push('    중복 '+n+'× · '+sig.split('|')[1]));
 }
 const curD=load(cur),sig=JSON.stringify(toCloud(curD));keys.filter(k=>k!==cur).forEach(k=>{const d=load(k);if(hasContent(curD)&&hasContent(d)&&JSON.stringify(toCloud(d))===sig)lines.push('⚠️ '+k+'가 현재 주와 완전히 동일합니다.')});
 lines.push('','※ 진단 기능은 기록을 읽기만 하며 수정·삭제하지 않습니다.');box.textContent=lines.join('\n')
}
setTimeout(()=>{
 const footer=document.querySelector('.footer');if(!footer||document.getElementById('diagToggle'))return;
 footer.insertAdjacentHTML('afterend', '<button id="diagToggle" type="button" style="display:block;margin:14px auto 4px;border:1px solid #ded8cf;background:#fffdf9;border-radius:999px;padding:7px 11px;font:10px Maru Buri,serif;color:#756d63">복제 진단 보기</button><div id="dupDiag" style="display:none;margin:8px 0 4px;padding:12px;border:1px solid #e5ddd3;border-radius:12px;background:#fffaf7;font:10px/1.55 Maru Buri,serif;color:#655f58;white-space:pre-wrap;word-break:break-word"></div>');
 document.getElementById('diagToggle').onclick=()=>{const b=document.getElementById('dupDiag'),v=b.style.display==='none';b.style.display=v?'block':'none';document.getElementById('diagToggle').textContent=v?'복제 진단 닫기':'복제 진단 보기';if(v)refreshDupDiag()}
},0);
`;

function instrument(html){
 if(html.includes('v36 read-only duplicate diagnostics')) return html;
 html=html.replace('function save(){if(!currentWeekKey)return;', "function save(){dupDiagState.saves++;dupDiagState.lastSave=new Date().toLocaleTimeString('ko-KR');if(!currentWeekKey)return;");
 html=html.replace('function render(){let m=monday()', 'function render(){dupDiagState.renders++;let m=monday()');
 html=html.replace('snap=>{remoteApplying=true;', "snap=>{dupDiagState.cloudEvents++;dupDiagState.lastCloud=new Date().toLocaleTimeString('ko-KR');remoteApplying=true;");
 html=html.replace('// account / cloud', DIAG+'\\n// account / cloud');
 return html;
}

self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin===location.origin){
   if(e.request.mode==='navigate'){
     e.respondWith(fetch(e.request).then(async r=>{
       const raw=await r.text(), body=instrument(raw);
       return new Response(body,{status:r.status,statusText:r.statusText,headers:r.headers});
     }).catch(()=>caches.match('./index.html')));
     return;
   }
   e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request)));return;
 }
 if(/\.(woff2?|css)(\?|$)/i.test(u.pathname)){e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r})))}
});
