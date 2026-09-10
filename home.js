// ELIF OS — Home Dashboard 2.0
(() => {
  const KEY='elif-os-v2-state';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=s=>localStorage.setItem(KEY,JSON.stringify(s));
  const pad=n=>String(n).padStart(2,'0');
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const pct=n=>Math.max(0,Math.min(100,Math.round(Number(n)||0)));
  const progress=v=>`<div class="progress"><i style="width:${pct(v)}%"></i></div>`;
  const active=x=>String(x?.status||'active').toLowerCase()!=='on hold'&&x?.active!==false;
  const render=()=>{
    const root=document.querySelector('#view'); if(!root)return;
    const s=read(), day=today(), tasks=(s.tasks||[]).filter(active), habits=(s.habits||[]).filter(active);
    const todayTasks=tasks.filter(t=>t.date===day), done=todayTasks.filter(t=>t.done).length;
    const habitDone=habits.filter(h=>s.habitLog?.[h.id]?.[day]).length;
    const study=Number(s.studyLog?.[day]||0), water=Number(s.water?.[day]||0), sleep=Number(s.sleep?.[day]||0);
    const movement=Number(s.movementLog?.[day]||0);
    const body=Math.round(([Math.min(water/2,1),Math.min(sleep/8,1),Math.min(movement,1)].reduce((a,b)=>a+b,0)/3)*100);
    const focus=Math.round(([todayTasks.length?done/todayTasks.length:1,habits.length?habitDone/habits.length:1,Math.min(study/120,1),Math.min(water/2,1),Math.min(sleep/8,1)].reduce((a,b)=>a+b,0)/5)*100);
    const upcoming=[...todayTasks.filter(t=>!t.done),...(tasks.filter(t=>t.date>day&&!t.done))].sort((a,b)=>String(a.date).localeCompare(String(b.date))).slice(0,6);
    const events=(s.calendarEvents||[]).filter(active).filter(e=>e.date>=day).sort((a,b)=>String(a.date).localeCompare(String(b.date))||(a.start||'').localeCompare(b.start||'')).slice(0,6);
    const week=[]; const now=new Date(); const monday=new Date(now); monday.setDate(now.getDate()-((now.getDay()+6)%7));
    for(let i=0;i<7;i++){const d=new Date(monday);d.setDate(monday.getDate()+i);const k=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;week.push({k,label:new Intl.DateTimeFormat('en',{weekday:'short'}).format(d),n:d.getDate(),count:tasks.filter(t=>t.date===k&&t.done).length})}
    root.innerHTML=`<section>
      <div class="hero"><img src="elif-os-banner.png"><div><span>PERSONAL OPERATING SYSTEM</span><h1>it's going to be okay.</h1><p>Your dashboard reflects what you actually do.</p></div></div>
      <div class="head"><div><span class="eyebrow">TODAY</span><h1>my life ✧</h1><p>${new Intl.DateTimeFormat('en',{weekday:'long',month:'long',day:'numeric'}).format(now)}</p></div><button class="primary" data-home-new>＋ new</button></div>
      <div class="metrics">
        <div class="metric"><span>TASKS</span><strong>${done}/${todayTasks.length}</strong><small>completed today</small>${progress(todayTasks.length?done/todayTasks.length*100:100)}</div>
        <div class="metric"><span>HABITS</span><strong>${habitDone}/${habits.length}</strong><small>completed today</small>${progress(habits.length?habitDone/habits.length*100:100)}</div>
        <div class="metric"><span>STUDY</span><strong>${study}m</strong><small>of 120 min</small>${progress(study/120*100)}</div>
        <div class="metric"><span>WATER</span><strong>${water.toFixed(2)}L</strong><small>of 2.0 L</small>${progress(water/2*100)}</div>
        <div class="metric"><span>BODY</span><strong>${body}%</strong><small>recovery + movement</small>${progress(body)}</div>
      </div>
      <div class="grid2">
        <div class="panel"><div class="panel-title"><span>TODAY'S FOCUS</span><b>${focus}%</b></div>${progress(focus)}<div class="list">${todayTasks.map(t=>`<label class="check"><input type="checkbox" data-home-task="${t.id}" ${t.done?'checked':''}><span class="${t.done?'done':''}">${esc(t.title)}</span></label>`).join('')||'<p class="muted">No tasks today. Add one to start.</p>'}</div><button data-home-page="tasks">open tasks →</button></div>
        <div class="panel"><div class="panel-title"><span>UP NEXT</span><button data-home-page="calendar">calendar →</button></div><div class="list">${[...upcoming.map(x=>({...x,_type:'task'})),...events.map(x=>({...x,_type:'event'}))].sort((a,b)=>String(a.date).localeCompare(String(b.date))||(a.start||'').localeCompare(b.start||'')).slice(0,6).map(x=>`<button class="row" data-home-calendar="${x.date}"><div><b>${esc(x.title)}</b><small>${x.date}${x.start?' · '+x.start:''}</small></div><span>${x._type}</span></button>`).join('')||'<p class="muted">Nothing upcoming.</p>'}</div></div>
      </div>
      <div class="panel"><div class="panel-title"><span>THIS WEEK</span><span>execution</span></div><div class="week-strip">${week.map(x=>`<button data-home-calendar="${x.k}"><small>${x.label}</small><b>${x.n}</b><i>${x.count}</i></button>`).join('')}</div></div>
      <div class="cards">
        <button class="visual" data-home-page="study"><img src="study.jpeg"><div><span>STUDY</span><b>${study} min logged</b></div></button>
        <button class="visual" data-home-page="body"><img src="body.jpeg"><div><span>BODY</span><b>${body}% today</b></div></button>
        <button class="visual" data-home-page="goals"><img src="body.jpeg"><div><span>GOALS</span><b>${Math.round((s.goals||[]).filter(active).reduce((a,g)=>a+Number(g.progress||0),0)/Math.max((s.goals||[]).filter(active).length,1))}% avg</b></div></button>
        <button class="visual" data-home-page="wallet"><img src="money.jpeg"><div><span>WALLET</span><b>₺${Number(s.wallet?.balance||0).toLocaleString('tr-TR',{maximumFractionDigits:0})}</b></div></button>
      </div>
    </section>`;
  };
  const go=p=>{const b=document.querySelector(`nav button[data-page="${p}"]`);if(b)b.click();else if(p==='calendar'&&window.ELIFCalendar){window.ELIFCalendar.render();document.querySelector('#crumb').textContent='Calendar'}};
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.matches('[data-page="home"]')){e.preventDefault();e.stopImmediatePropagation();render();document.querySelector('#crumb').textContent='Home';return}if(b.matches('[data-home-page]')){go(b.dataset.homePage);return}if(b.matches('[data-home-calendar]')){if(window.ELIFCalendar){window.ELIFCalendar.render();document.querySelector('#crumb').textContent='Calendar';}return}if(b.matches('[data-home-new]')){const add=document.querySelector('header [data-add]');if(add) add.click();return}},true);
  document.addEventListener('change',e=>{const x=e.target.closest('[data-home-task]');if(!x)return;const s=read(),t=(s.tasks||[]).find(t=>t.id===x.dataset.homeTask);if(t){t.done=x.checked;write(s);render()}});
  setTimeout(()=>{if(document.querySelector('#crumb')?.textContent==='Home')render()},350);
})();
