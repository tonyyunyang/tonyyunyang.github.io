(function(){
  var root=document.documentElement;
  var themeBtn=document.getElementById('theme');
  if(themeBtn)themeBtn.addEventListener('click',function(){
    root.classList.toggle('dark');
    try{localStorage.setItem('ebay-s2-theme',root.classList.contains('dark')?'dark':'light');}catch(e){}
  });
  var menu=document.getElementById('menu'),sb=document.getElementById('sidebar'),scrim=document.getElementById('scrim');
  function close(){sb&&sb.classList.remove('open');scrim&&scrim.classList.remove('open');}
  if(menu)menu.addEventListener('click',function(){sb.classList.toggle('open');scrim.classList.toggle('open');});
  if(scrim)scrim.addEventListener('click',close);

  // ---- search ----
  var data=window.SEARCH_DATA||[];
  var q=document.getElementById('q'),box=document.getElementById('results');
  var base=(location.pathname.indexOf('/docs/')>-1)?'../':'';
  function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function score(rec,t){
    var s=0,ti=rec.title.toLowerCase(),ex=(rec.excerpt||'').toLowerCase();
    var hs=(rec.headings||[]).join(' ').toLowerCase();
    if(ti.indexOf(t)>-1)s+=12; if(ti.indexOf(t)===0)s+=6;
    if(hs.indexOf(t)>-1)s+=5; if(ex.indexOf(t)>-1)s+=2;
    t.split(/\s+/).forEach(function(w){if(w&&(ti+' '+hs).indexOf(w)>-1)s+=1;});
    return s;
  }
  function run(){
    if(!box)return;var t=(q.value||'').trim().toLowerCase();
    if(t.length<2){box.classList.remove('on');box.innerHTML='';return;}
    var res=data.map(function(r){return{r:r,s:score(r,t)};}).filter(function(x){return x.s>0;})
      .sort(function(a,b){return b.s-a.s;}).slice(0,8);
    if(!res.length){box.innerHTML='<div class="r-none">No matches</div>';box.classList.add('on');return;}
    box.innerHTML=res.map(function(x){return '<a href="'+base+x.r.url+'"><div class="r-t">'+esc(x.r.title)+
      '</div><div class="r-g">'+esc(x.r.group)+'</div></a>';}).join('');
    box.classList.add('on');
  }
  if(q){
    q.addEventListener('input',run);
    q.addEventListener('keydown',function(e){
      var items=box.querySelectorAll('a');if(!items.length)return;
      var cur=box.querySelector('a.sel'),idx=Array.prototype.indexOf.call(items,cur);
      if(e.key==='ArrowDown'){e.preventDefault();idx=Math.min(items.length-1,idx+1);}
      else if(e.key==='ArrowUp'){e.preventDefault();idx=Math.max(0,idx-1);}
      else if(e.key==='Enter'){if(cur){location.href=cur.getAttribute('href');}return;}
      else return;
      items.forEach(function(a){a.classList.remove('sel');});if(items[idx])items[idx].classList.add('sel');
    });
    document.addEventListener('click',function(e){if(!e.target.closest('.search'))box.classList.remove('on');});
  }

  // ---- TOC scroll-spy ----
  var toc=document.querySelector('.toc');
  if(toc){
    var links=[].slice.call(toc.querySelectorAll('a'));
    var map=links.map(function(a){var id=decodeURIComponent(a.getAttribute('href').slice(1));
      return{a:a,el:document.getElementById(id)};}).filter(function(m){return m.el;});
    function spy(){
      var y=window.scrollY+120,cur=null;
      map.forEach(function(m){if(m.el.offsetTop<=y)cur=m;});
      links.forEach(function(a){a.classList.remove('active');});
      if(cur)cur.a.classList.add('active');
    }
    window.addEventListener('scroll',spy,{passive:true});spy();
  }
})();
