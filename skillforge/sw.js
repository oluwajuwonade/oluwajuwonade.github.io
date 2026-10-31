const CACHE='skillforge-v8';
const BASE=new URL('./',self.registration.scope).pathname;
const CORE=[BASE,BASE+'index.html',BASE+'manifest.webmanifest',BASE+'icon.svg',BASE+'logo-lockup.svg',BASE+'academy.js'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==location.origin)return;

  // Always check the network for page navigations so deployed updates reach installed users.
  if(request.mode==='navigate'||request.destination==='document'){
    event.respondWith(
      fetch(request).then(response=>{
        if(response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy));
        }
        return response;
      }).catch(()=>caches.match(request).then(cached=>cached||caches.match(BASE+'index.html')))
    );
    return;
  }

  // Keep same-origin static assets available offline after their first successful request.
  event.respondWith(
    caches.match(request).then(cached=>cached||fetch(request).then(response=>{
      if(response.ok&&request.destination!=='document'){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(request,copy));
      }
      return response;
    }).catch(()=>caches.match(BASE+'index.html')))
  );
});