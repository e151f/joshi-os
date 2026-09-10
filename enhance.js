// ELIF OS relationship + progress layer. Goal -> Project -> Task and active-area-only progress.
(() => {
  const KEY='elif-os-v2-state';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=s=>localStorage.setItem(KEY,JSON.stringify(s));
  const active=s=>x=>String(x?.status||'active').toLowerCase()!=='on hold'&&x?.active!==false;
  const today=()=>new Date().toISOString().slice(0,10);
  const rerender=()=>{const a=document.querySelector('nav button.active');(a||document.querySelector('nav button[data-page="home"]'))?.click()};
  const normalize=s=>{
    s.goals ||= [];s.projects ||= [];s.tasks ||= [];
    for(const g of s.goals)g.status ||= 'active';
    for(const p of s.projects){p.status ||= 'active';if(!p.goalId){const g=s.goals.find(x=>String(x.area||'').toLowerCase()===String(p.area||'').toLowerCase()&&active(s)(x));if(g)p.goalId=g.id}}
    for(const t of s.tasks){t.status ||= 'active';const p=s.projects.find(x=>x.id===t.projectId);if(p?.goalId)t.goalId=p.goalId}
    for(const p of s.projects.filter(active(s))){const ts=s.tasks.filter(t=>t.projectId===p.id&&active(s)(t));if(ts.length)p.progress=Math.round(ts.filter(t=>t.done).length/ts.length*100)}
    for(const g of s.goals.filter(active(s))){const ps=s.projects.filter(p=>p.goalId===g.id&&active(s));const exec=ps.filter(p=>s.tasks.some(t=>t.projectId===p.id&&active(s)(t)));if(exec.length)g.progress=Math.round(exec.reduce((a,p)=>a+Number(p.progress||0),0)/exec.length)}
    return s;
  };
  function removeScore(){document.querySelectorAll('.metric').forEach(m=>{if(/ELIF SCORE/i.test(m.textContent||''))m.remove()});}
  function modal(kind,preset=''){
    const s=read(),goals=(s.goals||[]).filter(active(s)),projects=(s.projects||[]).filter(active(s));
    const p=projects.find(x=>x.id===preset);
    const po=projects.map(x=>`<option value="${x.id}" ${x.id===preset?'selected':''}>${x.name}</option>`).join('');
    const go=goals.map(x=>`<option value="${x.id}" ${p?.goalId===x.id?'selected':''}>${x.title}</option>`).join('');
    let body='';
    if(kind==='task')body=`<form data-rel="task"><label>Task<input name="title" required></label><label>Date<input name="date" type="date" value="${today()}"></label><label>Priority<select name="priority"><option>low</option><option selected>medium</option><option>high</option></select></label><label>Project<select name="projectId"><option value="">No project</option>${po}</select></label><label>Goal<select name="goalId"><option value="">No goal</option>${go}</select></label><button class="primary">Create task</button></form>`;
    if(kind==='project')body=`<form data-rel="project"><label>Project<input name="name" required></label><label>Area<input name="area"></label><label>Goal<select name="goalId"><option value="">No goal</option>${go}</select></label><button class="primary">Create project</button></form>`;
    if(kind==='goal')body=`<form data-rel="goal"><label>Goal<input name="title" required></label><label>Area<input name="area"></label><button class="primary">Create goal</button></form>`;
    document.querySelector('#modal').innerHTML=`<div class="modal-box"><button class="close" data-rel-close>×</button><span class="eyebrow">ELIF OS · LINKED DATA</span><h2>New ${kind}</h2>${body}</div>`;document.querySelector('#modal').classList.add('open');
  }
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.matches('[data-rel-close]')){e.preventDefault();e.stopImmediatePropagation();document.querySelector('#modal').classList.remove('open');return}if(b.matches('[data-add-task]')||b.matches('[data-add]')){e.preventDefault();e.stopImmediatePropagation();modal('task');return}if(b.matches('[data-add-task-project]')){e.preventDefault();e.stopImmediatePropagation();modal('task',b.dataset.addTaskProject);return}if(b.matches('[data-add-project]')){e.preventDefault();e.stopImmediatePropagation();modal('project');return}if(b.matches('[data-add-goal]')){e.preventDefault();e.stopImmediatePropagation();modal('goal');return}},true);
  document.addEventListener('submit',e=>{const f=e.target.closest('[data-rel]');if(!f)return;e.preventDefault();e.stopImmediatePropagation();const s=read(),d=new FormData(f),type=f.dataset.rel;s.tasks||=[];s.projects||=[];s.goals||=[];if(type==='task'){const projectId=d.get('projectId')||null,p=s.projects.find(x=>x.id===projectId);s.tasks.push({id:crypto.randomUUID(),title:d.get('title'),priority:d.get('priority'),date:d.get('date')||today(),done:false,projectId,goalId:d.get('goalId')||p?.goalId||null,status:'active'})}if(type==='project'){const goalId=d.get('goalId')||null,g=s.goals.find(x=>x.id===goalId);s.projects.push({id:crypto.randomUUID(),name:d.get('name'),area:d.get('area')||g?.area||'',goalId,progress:0,status:'active'})}if(type==='goal')s.goals.push({id:crypto.randomUUID(),title:d.get('title'),area:d.get('area')||'',progress:0,status:'active'});write(normalize(s));document.querySelector('#modal').classList.remove('open');rerender()},true);
  document.addEventListener('change',()=>setTimeout(()=>{const s=read();write(normalize(s));rerender();removeScore()},0));
  setTimeout(()=>{const s=read();if(s.tasks){write(normalize(s));removeScore()}},300);
})();
