/* Panel de Celia - código común (ES5) */
var PC={};
PC.DIAS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
PC.DIAS_C=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
PC.KEYS=['dom','lun','mar','mie','jue','vie','sab'];
PC.MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
PC.NOMBRE_KEY={lun:'lunes',mar:'martes',mie:'miércoles',jue:'jueves',vie:'viernes',sab:'sábado',dom:'domingo'};

/* ---- horario por defecto (editable desde la web familiar) ---- */
PC.DEF=function(){
  var base=function(extra){
    var L=[
      {h:'07:30',t:'Ya es de día. Puedes levantarte.',i:'☀'},
      {h:'08:00',t:'Es hora de desayunar.',i:'🍳'}
    ].concat(extra,[
      {h:'13:00',t:'Es hora de comer.',i:'🍽'},
      {h:'20:30',t:'Es hora de cenar.',i:'🍽'},
      {h:'21:00',t:'Es de noche. Hay que dormir.',i:'🌙',n:1}
    ]);
    return L;
  };
  var lv=base([{h:'08:30',t:'Es hora de bajar al centro de día.',i:'🏫'},{h:'09:30',t:'Hoy toca centro de día.',i:'🏫'}]);
  return {
    sem:{
      lun:lv,mar:lv.slice(),mie:lv.slice(),jue:lv.slice(),vie:lv.slice(),
      sab:base([{h:'08:30',t:'Hoy es sábado. No hay centro de día.',i:'🏠'}]),
      dom:base([{h:'08:30',t:'Es hora de ir a misa.',i:'⛪'},{h:'09:45',t:'Hoy es domingo. Día tranquilo.',i:'🏠'}])
    },
    fest:{}
  };
};

/* ---- utilidades ---- */
PC.pad=function(n){return n<10?'0'+n:''+n};
PC.iso=function(d){return d.getFullYear()+'-'+PC.pad(d.getMonth()+1)+'-'+PC.pad(d.getDate())};
PC.mins=function(hhmm){var p=String(hhmm).split(':');return (parseInt(p[0],10)||0)*60+(parseInt(p[1],10)||0)};
PC.h12=function(h){return (h%12)||12};
PC.hm12=function(hhmm){var p=String(hhmm).split(':');var h=parseInt(p[0],10)||0,m=parseInt(p[1],10)||0;return PC.h12(h)+':'+PC.pad(m)};
PC.periodo=function(h){
  if(h<6)return 'de la madrugada';
  if(h<12)return 'de la mañana';
  if(h<14)return 'del mediodía';
  if(h<21)return 'de la tarde';
  return 'de la noche';
};
PC.hmFull=function(hhmm){var h=parseInt(String(hhmm).split(':')[0],10)||0;return PC.hm12(hhmm)+' '+PC.periodo(h)};
PC.fechaLarga=function(d){return d.getDate()+' de '+PC.MESES[d.getMonth()]+' de '+d.getFullYear()};
PC.arr=function(v){
  var o=[],k;if(!v)return o;
  if(v.length!==undefined&&typeof v!=='string'){for(k=0;k<v.length;k++)if(v[k])o.push(v[k]);return o}
  for(k in v)if(v.hasOwnProperty(k)&&v[k])o.push(v[k]);return o;
};
PC.sortBlocks=function(L){
  return L.slice().sort(function(a,b){return PC.mins(a.h)-PC.mins(b.h)});
};
PC.keyDe=function(ag,d){
  var f=ag&&ag.fest&&ag.fest[PC.iso(d)];
  if(f&&PC.NOMBRE_KEY[f])return f;
  return PC.KEYS[d.getDay()];
};
PC.bloquesDe=function(ag,d){
  var k=PC.keyDe(ag,d),L=ag&&ag.sem?PC.arr(ag.sem[k]):[];
  return PC.sortBlocks(L.filter(function(b){return b&&b.h}));
};
/* devuelve {cur, next, nextManana} para el instante d */
PC.ahora=function(ag,d){
  var m=d.getHours()*60+d.getMinutes(),L=PC.bloquesDe(ag,d),cur=null,next=null,i;
  for(i=0;i<L.length;i++){
    if(PC.mins(L[i].h)<=m)cur=L[i];
    else if(!next)next=L[i];
  }
  if(!cur){
    var y=new Date(d.getFullYear(),d.getMonth(),d.getDate()-1,12,0),Ly=PC.bloquesDe(ag,y);
    if(Ly.length)cur=Ly[Ly.length-1];
  }
  var manana=false;
  if(!next){
    var t=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1,12,0),Lt=PC.bloquesDe(ag,t);
    if(Lt.length){next=Lt[0];manana=true}
  }
  return {cur:cur,next:next,manana:manana};
};

/* ---- red (REST de Firebase) ---- */
PC.configurado=function(){return !!(PC_CONFIG&&PC_CONFIG.dbUrl)};
PC.url=function(path,tok){
  var u=PC_CONFIG.dbUrl.replace(/\/+$/,'')+'/panel'+(path?'/'+path:'')+'.json';
  if(tok)u+='?auth='+encodeURIComponent(tok);
  return u;
};
PC.xhr=function(method,url,body,cb,timeout){
  var x=new XMLHttpRequest(),done=false;
  var fin=function(ok,status,txt){if(done)return;done=true;var j=null;try{j=txt?JSON.parse(txt):null}catch(e){}cb(ok,j,status)};
  x.open(method,url,true);
  if(body!==undefined&&body!==null)x.setRequestHeader('Content-Type','application/json');
  x.timeout=timeout||15000;
  x.onload=function(){fin(x.status>=200&&x.status<300,x.status,x.responseText)};
  x.onerror=function(){fin(false,0,'')};
  x.ontimeout=function(){fin(false,0,'')};
  try{x.send(body!==undefined&&body!==null?JSON.stringify(body):null)}catch(e){fin(false,0,'')}
};
