// ELIF OS — domain progress layer. No global score.
(() => {
  const KEY='elif-os-v2-state';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=s=>localStorage.setItem(KEY,JSON.stringify(s));
  const today=()=>new Date().toISOString().slice(0,10);
  const active=x=>String(x?.status||'active').toLowerCase()!=='on hold'&&x?.active!==false;
  const clamp=n=>Math.max(0,Math.min(100,Math.round(Number(n)||0)));
  const sync=()=>{
    const s=read(); if(!s.tasks)return;
    s.goals||=[];s.projects||=[];s.habits||=[];s.habitLog||={};s.studyLog||={};s.studySessions||=[];s.movementLog||={};s.water||={};s.sleep||={};
    for(const h of s.habits){h.status ||= 'active';if(String(h.name||'').toLowerCase()==='korean')h.status='on hold'}
    for(const g of s.goals){g.status ||= 'active';if(String(g.title||'').toLowerCase().includes('korean'))g.status='on hold'}
    for(const p of s.projects){p.status ||= 'active';if(String(p.name||'').toLowerCase().includes('korean'))p.status='on hold'}
    for(const t of s.tasks){t.status ||= 'active';if(String(t.title||'').toLowerCase().includes('korean'))t.status='on hold'}
    for(const p of s.projects.filter(active)){const ts=s.tasks.filter(t=>t.projectId===p.id&&active(t));if(ts.length)p.progress=clamp(ts.filter(t=>t.done).length/ts.length*100)}
    for(const g of s.goals.filter(active)){const ps=s.projects.filter(p=>p.goalId===g.id&&active(p));const exec=ps.filter(p=>s.tasks.some(t=>t.projectId===p.id&&active(t)));if(exec.length)g.progress=clamp(exec.reduce((a,p)=>a+Number(p.progress||0),0)/exec.length)}
    write(s);
  };
  const activeHabits=s=>(s.habits||[]).filter(active);
  const studyMinutes=s=>Number(s.studyLog?.[today()]||0);
  const water=s=>Number(s.water?.[today()]||0);
  const sleep=s=>Number(s.sleep?.[today()]||0);
  const movement=s=>Number(s.movementLog?.[today()]||0);
  const habitPct=s=>{const hs=activeHabits(s);return hs.length?clamp(hs.filter(h=>s.habitLog?.[h.id]?.[today()]).length/hs.length*100):100};
  const studyPct=s=>clamp(studyMinutes(s)/120*100);
  const bodyPct=s=>clamp((Math.min(water(s)/2,1)+Math.min(sleep(s)/8,1)+Math.min(movement(s),1))/3*100);
  const weeklyHabitPct=s=>{const hs=activeHabits(s);if(!hs.length)return 100;let done=0;for(let d=0;d<7;d++){const x=new Date();x.setDate(x.getDate()-d);const key=x.toISOString().slice(0,10);done+=hs.filter(h=>s.habitLog?.[h.id]?.[key]).length}return clamp(done/(hs.length*7)*100)};
  const streak=(s,h)=>{let n=0;for(let d=0;d<365;d++){const x=new Date();x.setDate(x.getDate()-d);const key=x.toISOString().slice(0,10);if(s.habitLog?.[h.id]?.[key])n++;else break}return n};
  const hideScore=()=>document.querySelectorAll('.metric').forEach(m=>{if(/ELIF SCORE/i.test(m.textContent||''))m.remove()});
  const setMetric=(title,value,sub,pct)=>{const m=[...document.querySelectorAll('.metric')].find(x=>(x.querySelector('span')?.textContent||'').trim().toUpperCase()===title.toUpperCase());if(!m)return;m.querySelector('strong').textContent=value;m.querySelector('small').textContent=sub;let bar=m.querySelector('.progress');if(pct!=null){if(!bar){bar=document.createElement('div');bar.className='progress';m.appendChild(bar)}bar.innerHTML=`<i style="width:${clamp(pct)}%"></i>`}return m};
  const home=()=>{const s=read(),h=activeHabits(s),tasks=(s.tasks||[]).filter(t=>t.date===today()&&active(t)),td=tasks.filter(t=>t.done).length,st=studyPct(s),hp=habitPct(s),bp=bodyPct(s),waterPct=clamp(water(s)/2*100),taskPct=tasks.length?clamp(td/tasks.length*100):100,daily=clamp((taskPct+hp+st+bp)/4);setMetric('Tasks',`${td} / ${tasks.length}`,'active tasks today',taskPct);setMetric('Habits',`${h.filter(x=>s.habitLog?.[x.id]?.[today()]).length} / ${h.length}`,'active habits today',hp);setMetric('Study',`${studyMinutes(s)}m`,'of 120 min target',st);setMetric('Water',`${water(s).toFixed(2)} L`,'of 2.0 L',waterPct);if(!document.querySelector('[data-domain-body]')){const box=document.createElement('div');box.className='metric';box.dataset.domainBody='';box.innerHTML=`<span>Body</span><strong>0%</strong><small>water + sleep + movement</small><div class="progress"><i></i></div>`;document.querySelector('.metrics')?.appendChild(box)}const bm=document.querySelector('[data-domain-body]');if(bm){bm.querySelector('strong').textContent=`${bp}%`;bm.querySelector('.progress i').style.width=`${bp}%`;}const focus=[...document.querySelectorAll('.panel-title')].find(x=>/today's focus/i.test(x.textContent||''));if(focus){const span=focus.querySelector('span');if(span)span.textContent=`${daily}%`;const bar=focus.parentElement.querySelector('.progress i');if(bar)bar.style.width=`${daily}%`}};
  const studyUI=()=>{const s=read(),host=document.querySelector('.study-focus');if(!host||host.dataset.domainReady)return;if(host.parentElement.querySelector('[data-study-progress]'))return;const box=document.createElement('div');box.className='panel';box.dataset.studyProgress='';box.innerHTML=`<div class="panel-title"><span>DAILY STUDY PROGRESS</span><b>${studyMinutes(s)} / 120 min</b></div><div class="progress"><i style="width:${studyPct(s)}%"></i></div><small class="muted">Target: 120 focused minutes today. Log sessions below to move this bar.</small>`;host.parentElement.insertBefore(box,host.nextSibling);host.dataset.domainReady='1'};
  const habitsUI=()=>{const s=read(),grid=document.querySelector('.cards'),pageTitle=[...document.querySelectorAll('h1')].find(x=>x.textContent.trim()==='HABITS');if(!grid||!pageTitle||grid.dataset.habitReady)return;const hs=activeHabits(s),done=hs.filter(h=>s.habitLog?.[h.id]?.[today()]).length;const box=document.createElement('div');box.className='panel';box.dataset.habitProgress='';box.innerHTML=`<div class="panel-title"><span>HABIT CONSISTENCY · 7 DAYS</span><b>${weeklyHabitPct(s)}%</b></div><div class="progress"><i style="width:${weeklyHabitPct(s)}%"></i></div><small class="muted">Today: ${done}/${hs.length} active habits · Korean is on hold.</small>`;grid.parentElement.insertBefore(box,grid);grid.dataset.habitReady='1';hs.forEach(h=>{const btn=[...grid.querySelectorAll('[data-habit]')].find(b=>b.dataset.habit===h.id);if(btn){const small=btn.querySelector('small');if(small)small.textContent=`${streak(s,h)} day streak`}});const k=(s.habits||[]).find(h=>String(h.name||'').toLowerCase()==='korean');if(k){const btn=[...grid.querySelectorAll('[data-habit]')].find(b=>b.dataset.habit===k.id);if(btn){btn.disabled=true;btn.classList.remove('on');btn.style.opacity='.45';const small=btn.querySelector('small');if(small)small.textContent='ON HOLD'}}};
  const bodyUI=()=>{const s=read(),cards=document.querySelector('.cards'),title=[...document.querySelectorAll('h1')].find(x=>x.textContent.trim()==='BODY');if(!cards||!title)return;let panel=document.querySelector('[data-body-progress]');if(!panel){panel=document.createElement('div');panel.className='panel';panel.dataset.bodyProgress='';cards.appendChild(panel)}const bp=bodyPct(s);panel.innerHTML=`<div class="panel-title"><span>BODY PROGRESS</span><b>${bp}%</b></div><div class="progress"><i style="width:${bp}%"></i></div><small class="muted">Water ${water(s).toFixed(2)}/2L · Sleep ${sleep(s)}/8h · Movement ${movement(s)}/1</small><div class="quick"><button data-enhance-workout>＋ workout</button></div>`};
  const studyLogUI=()=>{const title=[...document.querySelectorAll('h1')].find(x=>x.textContent.trim()==='STUDY'),existing=document.querySelector('[data-study-log]');if(!title||existing)return;const box=document.createElement('div');box.className='panel';box.dataset.studyLog='';box.innerHTML=`<div class="panel-title"><span>SUBJECT SESSION</span><span>feeds study progress</span></div><div class="quick"><input data-study-subject placeholder="Subject / topic" style="flex:1;min-width:150px"><input data-study-minutes type="number" min="5" max="240" value="25" style="width:90px"><button data-enhance-study-log>log session</button></div>`;document.querySelector('.study-focus')?.parentElement.appendChild(box)};
  const refresh=()=>{sync();hideScore();home();studyUI();habitsUI();bodyUI();studyLogUI();};
  document.addEventListener('click',e=>setTimeout(refresh,120));
  document.addEventListener('change',e=>setTimeout(refresh,120));
  setTimeout(refresh,450);
  window.ELIFProgress={refresh,sync};
})();
