(()=>{
  const modules={
    study:['study.jpeg','Study','Study time today','120 min target'],
    body:['body.jpeg','Body','Movement today','1 workout target'],
    meal:['IMG_0954.jpeg','Meal','Meal plan today','1 meal planned'],
    journal:['IMG_0955.jpeg','Journal','Journal today','1 entry target'],
    goals:['IMG_0956.jpeg','Goals','Goals progress','Active goals'],
    projects:['IMG_0957.jpeg','Projects','Project progress','Active projects'],
    sleep:['IMG_0958.jpeg','Sleep','Sleep today','8 hour target'],
    habits:['hobbies.jpeg','Habits','Habits today','Daily consistency'],
    calendar:['IMG_0957.jpeg','Calendar','Today','Upcoming events'],
    automation:['korean.jpeg','Automation','Automations','Keep your system running'],
    memory:['hobbies.jpeg','Memory','Memory today','Keep what matters']
  };
  const excluded=new Set(['home','wallet','glow','search','settings']);
  function css(){
    if(document.getElementById('module-polish-css'))return;
    const s=document.createElement('style');s.id='module-polish-css';
    s.textContent=''
      +'.module-hero{display:none!important}'
      +'.module-layout-grid{display:grid!important;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:12px;margin-top:14px;align-items:stretch}'
      +'.module-layout-grid>.module-visual{margin:0!important;min-width:0}'
      +'.module-visual{width:100%;border:1px solid #493440;border-radius:13px;overflow:hidden;background:#100d12}'
      +'.module-visual img{display:block;width:100%;height:260px;object-fit:cover}'
      +'.module-visual-caption{padding:12px 16px;border-top:1px solid #292029;display:flex;align-items:center;justify-content:space-between;gap:12px}'
      +'.module-visual-caption span{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--pink)}'
      +'.module-visual-caption small{font-size:10px;color:var(--muted)}'
      +'.module-today-card{min-width:0;padding:24px;display:flex;flex-direction:column;justify-content:center}'
      +'.module-today-card .module-today-value{font:30px "DM Mono",monospace;color:var(--pink2);margin:7px 0}'
      +'.module-today-bar{height:8px;border-radius:999px;background:#241b23;overflow:hidden;margin:8px 0 16px}'
      +'.module-today-bar i{display:block;height:100%;background:var(--pink);border-radius:999px;transition:width .2s}'
      +'.module-today-card p{color:var(--muted);font-size:12px;line-height:1.6;margin:0 0 6px}'
      +'.module-today-card small{color:var(--muted);font-size:10px}'
      +'.module-content-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:12px;margin-top:14px}'
      +'.module-content-grid>.panel{min-width:0}'
      +'@media(max-width:700px){.module-layout-grid,.module-content-grid{grid-template-columns:1fr}.module-visual img{height:220px}.module-today-card{min-height:190px}}';
    document.head.appendChild(s);
  }
  function today(){return new Date().toISOString().slice(0,10)}
  function state(){try{return JSON.parse(localStorage.getItem('elif-os-v2-state')||'{}')}catch{return {}}}
  function progress(page){
    const s=state(),d=today();let pct=0,value='0',note='Keep the system moving.';
    if(page==='study'){const n=Number(s.studyLog&&s.studyLog[d]||0);pct=Math.min(n/120*100,100);value=n+' / 120 min';note='A focused session is enough to keep momentum.'}
    else if(page==='body'){const n=Number(s.movementLog&&s.movementLog[d]||0);pct=Math.min(n*100,100);value=n+' / 1 workout';note='Move your body, even on a lighter day.'}
    else if(page==='meal'){const ok=!!(s.meals&&s.meals[d]);pct=ok?100:0;value=ok?'1 / 1 planned':'0 / 1 planned';note=ok?'Today\'s meal is planned.':'Give today\'s meals a simple plan.'}
    else if(page==='journal'){const arr=Array.isArray(s.journal)?s.journal:[];const n=arr.filter(x=>x&&x.date===d).length;pct=Math.min(n*100,100);value=n+' / 1 entry';note=n?'You checked in with yourself today.':'A few honest lines are enough.'}
    else if(page==='goals'){const arr=Array.isArray(s.goals)?s.goals.filter(x=>(x.status||'active')==='active'):[];const avg=arr.length?Math.round(arr.reduce((a,x)=>a+Number(x.progress||0),0)/arr.length):0;pct=avg;value=avg+'% average';note=arr.length?arr.length+' active goals':'Set one meaningful goal.'}
    else if(page==='projects'){const arr=Array.isArray(s.projects)?s.projects.filter(x=>(x.status||'active')==='active'):[];pct=arr.length?50:0;value=arr.length+' active';note='Keep the next action visible.'}
    else if(page==='sleep'){const n=Number(s.sleep&&s.sleep[d]||0);pct=Math.min(n/8*100,100);value=n+' / 8 hours';note='Recovery is part of the work.'}
    else if(page==='habits'){const hs=Array.isArray(s.habits)?s.habits.filter(x=>(x.status||'active')==='active'):[];const log=s.habitLog||{};const n=hs.filter(x=>log[x.id]&&log[x.id][d]).length;pct=hs.length?Math.round(n/hs.length*100):0;value=n+' / '+hs.length+' habits';note='Consistency beats a perfect streak.'}
    else if(page==='calendar'){const arr=Array.isArray(s.calendarEvents)?s.calendarEvents:[];const n=arr.filter(x=>x&&x.date===d).length;pct=n?100:0;value=n+' today';note=n?'Your day has events on the calendar.':'A clear day is still a useful plan.'}
    else if(page==='automation'){const arr=Array.isArray(s.automations)?s.automations.filter(x=>x&&x.enabled!==false):[];pct=arr.length?100:0;value=arr.length+' active';note='Let your system handle repeatable work.'}
    else if(page==='memory'){const notes=Array.isArray(s.notes)?s.notes:[];pct=notes.length?100:0;value=notes.length+' saved';note='Keep useful things easy to remember.'}
    return [Math.round(Math.max(0,Math.min(100,pct))),value,note];
  }
  function cleanup(){document.querySelectorAll('.module-hero').forEach(x=>x.remove())}
  function visual(page){
    const cfg=modules[page];if(!cfg)return null;
    const h=document.createElement('div');h.className='module-visual';
    const img=document.createElement('img');img.src=cfg[0];img.alt=cfg[1];img.loading='lazy';
    const cap=document.createElement('div');cap.className='module-visual-caption';
    const a=document.createElement('span');a.textContent='MODULE';
    const b=document.createElement('small');b.textContent=cfg[1];
    cap.append(a,b);h.append(img,cap);return h;
  }
  function enhance(){
    css();cleanup();
    const v=document.querySelector('#view');if(!v)return;
    const page=v.dataset.page;if(excluded.has(page)||!modules[page])return;
    const section=v.querySelector('section')||v.firstElementChild;if(!section)return;
    if(section.querySelector('.module-layout-grid'))return;
    const head=section.querySelector('.viewhead');
    const oldVisual=section.querySelector('.module-visual');
    const grid=document.createElement('div');grid.className='module-layout-grid';
    const left=oldVisual||visual(page);if(!left)return;
    const p=progress(page),right=document.createElement('div');right.className='panel enh-card module-today-card';
    right.innerHTML='<div class="eyebrow">TODAY</div><div class="module-today-value">'+p[1]+'</div><div class="module-today-bar"><i style="width:'+p[0]+'%"></i></div><p>'+p[2]+'</p><small>'+modules[page][3]+'</small>';
    grid.append(left,right);
    if(oldVisual)oldVisual.remove();
    if(head)head.insertAdjacentElement('afterend',grid);else section.insertBefore(grid,section.firstChild);
    const panels=Array.from(section.children).filter(x=>x.classList&&x.classList.contains('panel')&&x!==grid);
    if(panels.length>=2&&!section.querySelector('.module-content-grid')){
      const cg=document.createElement('div');cg.className='module-content-grid';
      panels.forEach(x=>cg.appendChild(x));grid.insertAdjacentElement('afterend',cg);
    }
  }
  enhance();
  const root=document.getElementById('view');
  if(root)new MutationObserver(()=>requestAnimationFrame(enhance)).observe(root,{childList:true,subtree:true});
  window.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('button[data-page]'))setTimeout(enhance,0)});
})();
