(()=>{
  const KEY='elif-os-v2-state';
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}};
  const save=s=>{localStorage.setItem(KEY,JSON.stringify(s));location.reload()};
  const uid=()=>crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  window.render=window.render||function(){location.reload()};

  function modal(title,body){
    const m=document.querySelector('#modal');
    if(!m)return;
    m.innerHTML=`<div class="modalbox"><button class="close" data-runtime-close>×</button><span class="eyebrow">ELIF OS</span><h2>${title}</h2>${body}</div>`;
    m.classList.add('open');
  }
  const field=(label,name,type='text',value='')=>`<label class="field">${label}<input name="${name}" type="${type}" value="${esc(value)}" required></label>`;
  const state=()=>{const s=load()||{};s.tasks??=[];s.goals??=[];s.projects??=[];s.habits??=[];s.wallet??={balance:0,transactions:[]};s.wallet.transactions??=[];s.notes??=[];s.journal??=[];s.meals??={};s.calendarEvents??=[];s.automations??=[];s.studyLog??={};s.studySessions??=[];s.water??={};s.sleep??={};s.movementLog??={};s.habitLog??={};return s};
  const page=()=>document.querySelector('#view')?.dataset.page||'home';

  function addFor(p){
    // Tasks are owned exclusively by task-engine-v2. Never let the legacy
    // runtime modal intercept the Tasks page, otherwise its save reloads Home.
    if(p==='tasks') return;
    if(p==='home') return modal('New task',`<form data-runtime-form="task">${field('Title','title')}${field('Date','date','date',today())}<label class="field">Priority<select name="priority"><option>low</option><option selected>medium</option><option>high</option></select></label><div class="actions"><button class="primary">save</button></div></form>`);
    if(p==='goals') return modal('New goal',`<form data-runtime-form="goal">${field('Goal','title')} ${field('Area','area','text','Personal')}<label class="field">Starting progress<input name="progress" type="number" min="0" max="100" value="0"></label><div class="actions"><button class="primary">save</button></div></form>`);
    if(p==='projects') return modal('New project',`<form data-runtime-form="project">${field('Project name','name')} ${field('Area','area','text','Personal')}<div class="actions"><button class="primary">save</button></div></form>`);
    if(p==='habits') return modal('New habit',`<form data-runtime-form="habit">${field('Habit','name')}<div class="actions"><button class="primary">save</button></div></form>`);
    if(p==='wallet') return modal('New transaction',`<form data-runtime-form="wallet">${field('Description','name')}<label class="field">Amount<input name="amount" type="number" step="0.01" placeholder="-250 or 1000" required></label><div class="actions"><button class="primary">save</button></div></form>`);
    if(p==='meal') return modal('Today’s meal',`<form data-runtime-form="meal">${field('Meal','meal','text',state().meals[today()]||'')}<div class="actions"><button class="primary">save</button></div></form>`);
    if(p==='journal') return modal('New journal entry',`<form data-runtime-form="journal"><label class="field">Entry<textarea name="text" required></textarea></label><div class="actions"><button class="primary">save</button></div></form>`);
    if(p==='calendar') return modal('New event',`<form data-runtime-form="event">${field('Title','title')}${field('Date','date','date',today())}${field('Start','start','time','18:00')}${field('End','end','time','19:00')}<div class="actions"><button class="primary">save</button></div></form>`);
    if(p==='automation') return modal('New automation',`<form data-runtime-form="automation">${field('Name','title','text','Daily review')}${field('When','when','text','Every morning')}<div class="actions"><button class="primary">save</button></div></form>`);
    if(p==='study') return modal('Log study session',`<form data-runtime-form="study"><label class="field">Minutes<input name="minutes" type="number" min="1" value="25" required></label><div class="actions"><button class="primary">save</button></div></form>`);
    if(p==='body'||p==='glow') return modal('Log movement',`<form data-runtime-form="movement"><label class="field">Workout count<input name="count" type="number" min="1" value="1" required></label><div class="actions"><button class="primary">save</button></div></form>`);
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.matches('[data-runtime-close]')){e.preventDefault();e.stopImmediatePropagation();document.querySelector('#modal')?.classList.remove('open');return}
    if(b.hasAttribute('data-add')){
      // task-engine-v2 owns Tasks and must receive the click itself.
      if(page()==='tasks')return;
      e.preventDefault();e.stopImmediatePropagation();addFor(page());return
    }
    if(b.dataset.addProjectTask){
      e.preventDefault();e.stopImmediatePropagation();
      const pid=b.dataset.addProjectTask;
      modal('Add project task',`<form data-runtime-form="project-task" data-project-id="${esc(pid)}">${field('Task','title')}${field('Date','date','date',today())}<label class="field">Priority<select name="priority"><option>low</option><option selected>medium</option><option>high</option></select></label><div class="actions"><button class="primary">save</button></div></form>`);return;
    }
    if(b.dataset.eventDelete!==undefined){
      e.preventDefault();e.stopImmediatePropagation();const s=state();s.calendarEvents.splice(+b.dataset.eventDelete,1);save(s);return;
    }
    if(b.dataset.autoDelete!==undefined){
      e.preventDefault();e.stopImmediatePropagation();const s=state();s.automations.splice(+b.dataset.autoDelete,1);save(s);return;
    }
  },true);

  document.addEventListener('submit',e=>{
    const f=e.target.closest('form[data-runtime-form]');if(!f)return;
    e.preventDefault();e.stopImmediatePropagation();const x=new FormData(f),s=state(),type=f.dataset.runtimeForm;
    if(type==='task')s.tasks.push({id:uid(),title:String(x.get('title')||'').trim(),date:x.get('date')||today(),priority:x.get('priority')||'medium',done:false,projectId:null,goalId:null,status:'active'});
    if(type==='goal')s.goals.push({id:uid(),title:String(x.get('title')||'').trim(),area:String(x.get('area')||'Personal').trim(),progress:Math.max(0,Math.min(100,+x.get('progress')||0)),status:'active'});
    if(type==='project')s.projects.push({id:uid(),name:String(x.get('name')||'').trim(),area:String(x.get('area')||'Personal').trim(),status:'active'});
    if(type==='habit')s.habits.push({id:uid(),name:String(x.get('name')||'').trim(),status:'active'});
    if(type==='wallet'){const amount=+x.get('amount')||0;s.wallet.transactions.push({id:uid(),name:String(x.get('name')||'').trim(),amount,date:today()});s.wallet.balance=(+s.wallet.balance||0)+amount;}
    if(type==='meal')s.meals[today()]=String(x.get('meal')||'').trim();
    if(type==='journal')s.journal.push({id:uid(),date:today(),text:String(x.get('text')||'').trim()});
    if(type==='event')s.calendarEvents.push({id:uid(),title:String(x.get('title')||'').trim(),date:x.get('date')||today(),start:x.get('start')||'',end:x.get('end')||''});
    if(type==='automation')s.automations.push({id:uid(),title:String(x.get('title')||'').trim(),when:String(x.get('when')||'').trim(),enabled:true});
    if(type==='study'){const m=Math.max(1,+x.get('minutes')||0);s.studyLog[today()]=(+s.studyLog[today()]||0)+m;s.studySessions.push({id:uid(),date:today(),minutes:m});}
    if(type==='movement'){s.movementLog[today()]=(+s.movementLog[today()]||0)+Math.max(1,+x.get('count')||1);}
    save(s);
  },true);

  document.addEventListener('input',e=>{
    if(e.target.id!=='searchInput')return;
    const q=e.target.value.trim().toLowerCase(),s=state(),out=document.querySelector('#searchResults');if(!out)return;
    if(!q){out.innerHTML='';return}
    const rows=[];
    s.tasks.forEach(x=>{if(`${x.title} ${x.priority}`.toLowerCase().includes(q))rows.push(['Task',x.title])});
    s.goals.forEach(x=>{if(`${x.title} ${x.area}`.toLowerCase().includes(q))rows.push(['Goal',x.title])});
    s.projects.forEach(x=>{if(`${x.name} ${x.area}`.toLowerCase().includes(q))rows.push(['Project',x.name])});
    s.notes.forEach(x=>{if(String(x).toLowerCase().includes(q))rows.push(['Note',x])});
    s.journal.forEach(x=>{if(String(x.text).toLowerCase().includes(q))rows.push(['Journal',x.text])});
    out.innerHTML=rows.length?`<div class="list">${rows.slice(0,30).map(([k,v])=>`<div class="row"><div class="grow"><b>${esc(v)}</b><small>${k}</small></div></div>`).join('')}</div>`:'<div class="panel muted">No matches.</div>';
  });

  document.addEventListener('click',e=>{const b=e.target.closest('button[data-date]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();modal('New event',`<form data-runtime-form="event">${field('Title','title')}${field('Date','date','date',b.dataset.date)}${field('Start','start','time','18:00')}${field('End','end','time','19:00')}<div class="actions"><button class="primary">save</button></div></form>`)},true);
})();
