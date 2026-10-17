// Cash Count service worker
// App files: network first (so updates arrive at once), cache as offline backup.
// Change VERSION on every release.
const VERSION='2026-10-17-2',C='cash-count-'+VERSION;
const F=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];

self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));

// Same-origin: try network (max 3.5s if a cached copy exists), else cached copy.
function fresh(req){
  const isNav=req.mode==='navigate';
  const cached=caches.match(req,{ignoreSearch:true}).then(r=>r||(isNav?caches.match('index.html'):undefined));
  return new Promise(res=>{
    let done=false;const end=r=>{if(!done&&r){done=true;res(r)}};
    const t=setTimeout(()=>cached.then(end),3500);
    fetch(req.url,{cache:'no-cache'}).then(r=>{
      if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp))}
      clearTimeout(t);end(r);
    }).catch(()=>cached.then(r=>{clearTimeout(t);if(!done){done=true;res(r||Response.error())}}));
  });
}

// Fonts + Firebase SDK files (fixed version URLs): cached copy first, refresh in background.
function font(req){
  return caches.match(req).then(r=>{
    const net=fetch(req).then(x=>{const cp=x.clone();caches.open(C).then(c=>c.put(req,cp));return x}).catch(()=>r);
    return r||net;
  });
}

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin)return e.respondWith(fresh(e.request));
  // Only cache static files from these hosts. Never touch Firebase login/database calls.
  const ok=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'||(u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/'));
  if(ok)e.respondWith(font(e.request));
});
