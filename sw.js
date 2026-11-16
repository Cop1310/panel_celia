var CACHE='panel-celia-v1';
var FILES=['./','index.html','familia.html','comun.js','firebase-config.js','manifest.json','manifest-familia.json','icon-192.png','icon-512.png','icon-familia-192.png','icon-familia-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
/* primero la red (para coger versiones nuevas) y, si no hay, la copia guardada */
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET'||r.url.indexOf(self.location.origin)!==0)return;
  e.respondWith(fetch(r).then(function(res){
    var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)});return res;
  }).catch(function(){return caches.match(r).then(function(m){return m||caches.match('index.html')})}));
});
