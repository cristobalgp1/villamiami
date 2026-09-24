(function(){function setVW(){document.documentElement.style.setProperty('--vw100', document.documentElement.clientWidth+'px');}setVW();window.addEventListener('resize',setVW);new ResizeObserver(setVW).observe(document.documentElement);})();
var currentLang = (function(){try{var l=localStorage.getItem('lds-lang');return l==='es'?'es':'en';}catch(e){return 'en';}})();
function applyLang(lang){
  document.documentElement.lang = lang; var i;
  var a=document.querySelectorAll('[data-en]'); for(i=0;i<a.length;i++){var v=a[i].getAttribute('data-'+lang); if(v!==null) a[i].textContent=v;}
  var b=document.querySelectorAll('[data-en-html]'); for(i=0;i<b.length;i++){var w=b[i].getAttribute('data-'+lang+'-html'); if(w!==null) b[i].innerHTML=w;}
  var c=document.querySelectorAll('[data-en-ph]'); for(i=0;i<c.length;i++) c[i].setAttribute('placeholder', c[i].getAttribute('data-'+lang+'-ph'));
  var d=document.querySelectorAll('.lang-btn'); for(i=0;i<d.length;i++) d[i].classList.toggle('active', d[i].getAttribute('data-lang')===lang);
}
function setLang(lang){ currentLang=lang; try{localStorage.setItem('lds-lang', lang);}catch(e){} applyLang(lang); }
var lightboxImgs=[], lightboxIdx=0, lightboxGroup='';
function openLightbox(group,i){
  lightboxGroup=group;
  lightboxImgs=Array.prototype.map.call(document.querySelectorAll('img[data-group="'+group+'"]'),function(el){return el.src;});
  lightboxIdx=i; document.getElementById('lightbox-img').src=lightboxImgs[lightboxIdx];
  document.getElementById('lightbox-count').textContent=(lightboxIdx+1)+' / '+lightboxImgs.length;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox(){ var lb=document.getElementById('lightbox'); if(lb) lb.classList.remove('open'); }
function navLightbox(dir){
  lightboxIdx=(lightboxIdx+dir+lightboxImgs.length)%lightboxImgs.length;
  document.getElementById('lightbox-img').src=lightboxImgs[lightboxIdx];
  document.getElementById('lightbox-count').textContent=(lightboxIdx+1)+' / '+lightboxImgs.length;
}
document.addEventListener('keydown',function(e){
  var lb=document.getElementById('lightbox'); if(!lb||!lb.classList.contains('open')) return;
  if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowRight') navLightbox(1); if(e.key==='ArrowLeft') navLightbox(-1);
});
var ROUTES={'':'home','villa-mezzo':'mezzo','villa-piano':'piano'};
var TITLES={home:'Villa Miami × Lacruz Design Studio',mezzo:'Villa Mezzo · Lacruz Design Studio',piano:'Villa Piano · Lacruz Design Studio'};
var currentView=null;
function render(){
  var key=location.hash.replace(/^#/,'');
  if(!(key in ROUTES)){ var t=document.getElementById(key); if(t&&currentView){ window.scrollTo(0,t.getBoundingClientRect().top+window.scrollY); return; } key=''; }
  var v=ROUTES[key]; if(v===currentView) return; currentView=v;
  ['home','mezzo','piano'].forEach(function(k){ document.getElementById('css-'+k).media=(k===v?'all':'not all'); });
  var app=document.getElementById('app'); app.innerHTML=''; app.appendChild(document.getElementById('view-'+v).content.cloneNode(true));
  document.title=TITLES[v]; applyLang(currentLang); window.scrollTo(0,0);
  app.querySelectorAll('video').forEach(function(vd){ vd.muted=true; var p=vd.play(); if(p&&p.catch) p.catch(function(){}); });
  var lb=document.getElementById('lightbox'); if(lb) lb.addEventListener('click',function(e){ if(e.target.id==='lightbox') closeLightbox(); });
  var rows=app.querySelectorAll('.project-row');
  if(rows.length&&'IntersectionObserver' in window){ var io=new IntersectionObserver(function(en){ en.forEach(function(x){ if(x.isIntersecting) x.target.classList.add('in-view'); }); },{threshold:0.35}); rows.forEach(function(r){ io.observe(r); }); }
}
window.addEventListener('hashchange',render);
render();
