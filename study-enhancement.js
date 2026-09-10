(()=>{
  const APP='elif-os-v2-state';
  const root=()=>document.querySelector('#view');
  const day=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const read=()=>{try{return JSON.parse(localStorage.getItem(APP)||'{}')}catch{return {}}};
  const write=s=>localStorage.setItem(APP,JSON.stringify(s));
  const durations={focus:25*60,short:5*60,long:15*60,focus50:50*60};
  let mode='focus',seconds=durations.focus,running=false,timer=null,startedAt=null,sessionId=null;
  const fmt=n=>`${String(Math.floor(Math.max(0,n)/60)).padStart(2,'0')}:${String(Math.max(0,n)%60).padStart(2,'0')}`;
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  function finishSession(completed=false){
    if(!startedAt)return;
    const s=read();s.studySessions=Array.isArray(s.studySessions)?s.studySessions:[];
    const end=new Date(),mins=Math.max(0,Math.round((end-new Date(startedAt))/60000));
    if(mins>0)s.studySessions.push({id:sessionId||Date.now(),date:startedAt.slice(0,10),start:startedAt,end:end.toISOString(),minutes:mins,mode});
    if(completed&&mode!=='short'&&mode!=='long'){
      s.studyLog=s.studyLog||{};s.studyLog[day()]=Number(s.studyLog[day()]||0)+Math.round(durations[mode]/60);
    }
    write(s);startedAt=null;sessionId=null;
  }
  function stop(saveSession=true){if(timer){clearInterval(timer);timer=null}if(saveSession)finishSession(false);running=false;paint()}
  function complete(){if(timer){clearInterval(timer);timer=null}finishSession(true);running=false;seconds=durations[mode];paint();renderStats()}
  function tick(){if(!running)return;seconds=Math.max(0,seconds-1);if(seconds===0){complete();return}paint()}
  function start(){
    if(running)return;
    running=true;startedAt=new Date().toISOString();sessionId=Date.now();
    if(timer)clearInterval(timer);timer=setInterval(tick,1000);paint();
  }
  function setMode(next){if(!durations[next])return;if(running)stop(true);mode=next;seconds=durations[next];paint()}
  function reset(){if(running)stop(true);seconds=durations[mode];paint()}
  function paint(){
    const t=document.querySelector('#elif-pomo-time'),m=document.querySelector('#elif-pomo-mode'),b=document.querySelector('[data-elif-pomo-toggle]');
    if(t)t.textContent=fmt(seconds);
    if(m)m.textContent=mode==='focus'?'FOCUS':mode==='focus50'?'50 MIN FOCUS':mode==='short'?'SHORT BREAK':'LONG BREAK';
    if(b)b.textContent=running?'pause':'start';
  }
  function weekData(){
    const s=read(),sessions=Array.isArray(s.studySessions)?s.studySessions:[],out=[];
    for(let i=6;i>=0;i--){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-i);const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const ss=sessions.filter(x=>x.date===k);const mins=ss.reduce((a,x)=>a+Number(x.minutes||0),0);out.push({date:k,label:d.toLocaleDateString('en',{weekday:'short'}),day:d.getDate(),mins,sessions:ss})}
    return out;
  }
  function renderStats(){const v=root();if(!v||v.dataset.page!=='study')return;const box=v.querySelector('[data-study-week]');if(!box)return;const data=weekData(),max=Math.max(1,...data.map(x=>x.mins));box.innerHTML=data.map(x=>`<div class="study-day"><div class="study-day-head"><b>${x.label} ${x.day}</b><span>${x.mins} min</span></div><div class="study-track"><i style="width:${Math.round(x.mins/max*100)}%"></i></div><div class="study-blocks">${x.sessions.length?x.sessions.map(z=>`<span title="${new Date(z.start).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} – ${new Date(z.end).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}">${new Date(z.start).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} · ${z.minutes}m</span>`).join(''): '<small>No study sessions</small>'}</div></div>`).join('')}
  function render(){
    const v=root();if(!v||v.dataset.page!=='study')return;
    if(running)return;
    v.innerHTML=`<section class="study-page"><div class="viewhead"><div><h1>Study</h1><p>Focus deeply, recover properly, and measure the work.</p></div></div>
      <div class="panel" style="padding:24px;text-align:center">
        <div class="eyebrow" id="elif-pomo-mode">${mode==='focus'?'FOCUS':mode==='focus50'?'50 MIN FOCUS':mode==='short'?'SHORT BREAK':'LONG BREAK'}</div>
        <div id="elif-pomo-time" style="font:clamp(64px,12vw,104px) DM Mono,monospace;letter-spacing:-.06em;margin:12px 0">${fmt(seconds)}</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button class="ghost" data-elif-pomo-mode="focus" type="button">25 min focus</button>
          <button class="ghost" data-elif-pomo-mode="focus50" type="button">50 min focus</button>
          <button class="ghost" data-elif-pomo-mode="short" type="button">5 min break</button>
          <button class="ghost" data-elif-pomo-mode="long" type="button">15 min break</button>
        </div>
        <div class="actions" style="justify-content:center;margin-top:18px">
          <button class="primary" data-elif-pomo-toggle type="button">start</button>
          <button class="ghost" data-elif-pomo-reset type="button">reset</button>
        </div>
        <p style="color:var(--muted)">${Number(read().studyLog?.[day()]||0)} focus minutes completed today</p>
      </div>
      <div class="panel" style="margin-top:14px;padding:20px"><div class="section-title">This week <small>daily study + time blocks</small></div><div data-study-week style="display:grid;gap:14px;margin-top:16px"></div></div>
    </section>`;
    renderStats();paint();
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-elif-pomo-mode],[data-elif-pomo-toggle],[data-elif-pomo-reset]');
    if(!b||!document.querySelector('.study-page'))return;
    e.preventDefault();e.stopImmediatePropagation();
    if(b.hasAttribute('data-elif-pomo-toggle')){running?stop(true):start();return}
    if(b.hasAttribute('data-elif-pomo-reset')){reset();return}
    setMode(b.dataset.elifPomoMode);
  },true);
  window.addEventListener('click',e=>{const b=e.target.closest?.('button[data-page="study"]');if(b)setTimeout(render,0)});
  window.ELIFStudyEnhancement={render,start,stop,reset,setMode};
})();