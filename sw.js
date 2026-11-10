const CACHE='slowka-es-v2';
const FILES=['./','index.html','manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
// najpierw sieć (z pominięciem pamięci HTTP, żeby zawsze była najnowsza wersja), offline — zapisana kopia
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin) return;
  e.respondWith(fetch(e.request.url,{cache:'no-cache'}).then(r=>{const c=r.clone();caches.open(CACHE).then(ch=>ch.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});
