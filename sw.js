const CACHE="voz-cura-v11";
const CORE=["./","./index.html","./style.css","./app.js","./self-heal.js","./manifest.webmanifest","./videos.json","./videos-facebook.json","./assets/1000254338.jpg","./assets/1000254338-enhanced.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);
 if(u.origin!==location.origin)return;
 if(u.pathname.endsWith("/videos.json")||u.pathname.endsWith("/videos-facebook.json")){
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./videos.json"))));
  return;
 }
 e.respondWith(fetch(e.request).then(r=>r).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
});
self.addEventListener("message",e=>{if(e.data==="SKIP_WAITING")self.skipWaiting()});