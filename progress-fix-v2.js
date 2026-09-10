(()=>{
  const KEY='elif-os-v2-state';
  const today=()=>new Date().toISOString().slice(0,10);
  const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const clamp=n=>Math.max(0,Math.min(1,n));
  function progress(){
    const s=get(), d=today();
    const active=a=>(a||[]).filter(x=>(x.status||'active')==='active');
    const tasks=active(s.tasks).filter(t=>t.date===d);
    const habits=active(s.habits);
    const parts=[];
    if(tasks.length) parts.push(tasks.filter(t=>t.done).length/tasks.length);
    if(habits.length) parts.push(habits.filter(h=>s.habitLog?.[h.id]?.[d]).length/habits.length);
    const study=Number(s.studyLog?.[d]||0);
    const sleep=Number(s.sleep?.[d]||0);
    const movement=Number(s.movementLog?.[d]||0);
    const water=Number(s.water?.[d]||0);
    if(study>0) parts.push(clamp(study/120));
    if(sleep>0) parts.push(clamp(sleep/8));
    if(movement>0) parts.push(clamp(movement));
    if(water>0) parts.push(clamp(water/2));
    const p=parts.length?Math.round(parts.reduce((a,b)=>a+b,0)/parts.length*100):0;
    const v=document.querySelector('#view');
    if(!v||v.dataset.page!=='home')return;
    const small=[...v.querySelectorAll('.focusbar small')].find(x=>/\d+%/.test(x.textContent));
    if(small)small.textContent=p+'%';
    const bar=v.querySelector('.focusbar .progress i');
    if(bar)bar.style.width=p+'%';
  }
  new MutationObserver(progress).observe(document.body,{childList:true,subtree:true});
  setInterval(progress,500);
  window.ELIFProgress={refresh:progress};
})();
