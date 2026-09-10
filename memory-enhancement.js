(()=>{
  const APP='elif-os-v2-state',GLOW='elif-os-glow-v1',TRADING='elif-os-trading-v1',root=()=>document.querySelector('#view');
  const read=()=>{try{return JSON.parse(localStorage.getItem(APP)||'{}')}catch{return{}}};
  const glow=()=>{try{return JSON.parse(localStorage.getItem(GLOW)||'{}')}catch{return{}}};
  const trading=()=>{try{const x=JSON.parse(localStorage.getItem(TRADING)||'{}');return Array.isArray(x.trades)?x.trades:[]}catch{return[]}};
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const key=d=>{const x=new Date(d);return isNaN(x)?'':`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`};
  const dateKeyOffset=n=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-n);return key(d)};
  const inWindow=(d,days)=>{const k=key(d);return k>=dateKeyOffset(days-1)&&k<=dateKeyOffset(0)};
  const dayName=k=>new Date(k+'T12:00:00').toLocaleDateString('en-US',{weekday:'long'});
  const hour=h=>`${String(h).padStart(2,'0')}:00`;
  function data(days=30){
    const s=read(),sessions=(s.studySessions||[]).filter(x=>inWindow(x.date||x.start,days)),tasks=(s.tasks||[]).filter(x=>inWindow(x.date,days)),habits=s.habits||[],gl=glow().days||{},tr=trading().filter(x=>inWindow(x.date,days));
    const taskDays={};tasks.forEach(t=>{if(!taskDays[t.date])taskDays[t.date]=[];taskDays[t.date].push(t)});
    const completedByDay={};Object.entries(taskDays).forEach(([d,a])=>completedByDay[d]=a.filter(x=>x.done).length);
    const studyByDay={};sessions.forEach(x=>{const d=key(x.date||x.start);studyByDay[d]=(studyByDay[d]||0)+Number(x.minutes||0)});
    const studyHours={};sessions.forEach(x=>{if(!x.start)return;const h=new Date(x.start).getHours();studyHours[h]=(studyHours[h]||0)+Number(x.minutes||0)});
    const studyWeek={};sessions.forEach(x=>{const d=key(x.date||x.start),w=dayName(d);studyWeek[w]=(studyWeek[w]||0)+Number(x.minutes||0)});
    const routineDays={};Object.entries(gl).forEach(([d,v])=>{if(inWindow(d,days)){const evening=['cleanseNight','treatment','nightMoisturize'];routineDays[d]=evening.filter(k=>v[k]).length/evening.length}});
    const sleepDays={};Object.entries(s.sleep||{}).forEach(([d,v])=>{if(inWindow(d,days))sleepDays[d]=Number(v)||0});
    return {s,sessions,tasks,habits,gl,tr,taskDays,completedByDay,studyByDay,studyHours,studyWeek,routineDays,sleepDays};
  }
  function patterns(days=30){
    const x=data(days),p=[];
    const hs=Object.entries(x.studyHours).sort((a,b)=>b[1]-a[1]);
    if(x.sessions.length>=3&&hs.length){const h=Number(hs[0][0]),end=h+2; p.push({title:'Best study window',text:`You studied most consistently between ${hour(h)}–${hour(end%24)}.`,evidence:`${x.sessions.length} study sessions analyzed over ${days} days.`})}
    const ws=Object.entries(x.studyWeek).sort((a,b)=>b[1]-a[1]);
    if(x.sessions.length>=4&&ws.length){const top=ws.slice(0,2).map(a=>a[0]);p.push({title:'Strongest study days',text:`Your strongest study days are ${top.join(' and ')}.`,evidence:`Based on ${Math.round(ws.reduce((n,a)=>n+a[1],0))} logged study minutes.`})}
    const loads=Object.entries(x.taskDays).map(([d,a])=>[d,a.length,x.routineDays[d]||0]);
    const heavy=loads.filter(a=>a[1]>6),light=loads.filter(a=>a[1]<=6);
    if(heavy.length>=2&&light.length>=2){const ha=heavy.reduce((n,a)=>n+a[2],0)/heavy.length,la=light.reduce((n,a)=>n+a[2],0)/light.length;if(la-ha>.25)p.push({title:'Task-load effect',text:'You tend to skip evening routines when your day has more than 6 tasks.',evidence:`Evening-routine completion: ${Math.round(ha*100)}% on heavy-task days vs ${Math.round(la*100)}% on lighter days.`})}
    const pairs=Object.entries(x.studyByDay).map(([d,m])=>[d,m,x.sleepDays[d]]).filter(a=>a[2]>0);
    if(pairs.length>=4){const good=pairs.filter(a=>a[2]>=7),rest=pairs.filter(a=>a[2]<7),gm=good.reduce((n,a)=>n+a[1],0)/(good.length||1),rm=rest.reduce((n,a)=>n+a[1],0)/(rest.length||1);if(good.length&&rest.length&&gm>rm*1.15)p.push({title:'Sleep → study relationship',text:'Your study duration increases on days following 7+ hours of sleep.',evidence:`Average study: ${Math.round(gm)} min after 7+ hours vs ${Math.round(rm)} min after less sleep.`})}
    const early=Object.entries(x.taskDays).map(([d,a])=>[d,a]);
    if(early.length>=5){const yes=early.filter(([d,a])=>a.some(t=>t.done&&t.date===d&&(!t.time||Number(String(t.time).slice(0,2))<10)));const no=early.filter(([d])=>!yes.some(y=>y[0]===d));const yr=yes.reduce((n,[d,a])=>n+a.filter(t=>t.done).length/(a.length||1),0)/(yes.length||1),nr=no.reduce((n,[d,a])=>n+a.filter(t=>t.done).length/(a.length||1),0)/(no.length||1);if(yes.length>=2&&no.length>=2&&yr>nr+.15)p.push({title:'Early-start effect',text:'You complete more tasks when your first task is finished before 10:00.',evidence:`Completion rate ${Math.round(yr*100)}% vs ${Math.round(nr*100)}%.`})}
    const wins=x.tr.filter(t=>Number(t.pnl)>0),loss=x.tr.filter(t=>Number(t.pnl)<0);if(x.tr.length>=8){const wr=wins.length/x.tr.length;if(wr>.6)p.push({title:'Trading pattern',text:`Your logged trading win rate is ${Math.round(wr*100)}%.`,evidence:`${wins.length} winning and ${loss.length} losing trades in the last ${days} days.`});else if(wr<.4)p.push({title:'Trading pattern',text:`Your logged trading win rate is ${Math.round(wr*100)}%; review your recurring setups before increasing risk.`,evidence:`${wins.length} winning and ${loss.length} losing trades in the last ${days} days.`})}
    return p;
  }
  function render(){const v=root();if(!v||v.dataset.page!=='memory')return;const p30=patterns(30),p7=patterns(7),sessions=data(30).sessions,hasEnough=sessions.length>=3;v.innerHTML=`<section class="memory-page"><div class="memory-hero"><div><span class="eyebrow">PERSONAL PATTERN INTELLIGENCE</span><h1>Memory</h1><p>ELIF OS observes your behavior and turns repeated activity into useful patterns.</p></div><div class="memory-count"><b>${sessions.length}</b><small>study sessions analyzed</small></div></div><div class="memory-stats"><div class="panel"><b>${data(30).tasks.length}</b><small>tasks · 30 days</small></div><div class="panel"><b>${sessions.reduce((n,x)=>n+Number(x.minutes||0),0)}</b><small>study minutes</small></div><div class="panel"><b>${data(30).tr.length}</b><small>trades analyzed</small></div><div class="panel"><b>${Object.keys(data(30).routineDays).length}</b><small>glow days</small></div></div><div class="panel memory-report"><span class="eyebrow">30-DAY DOCUMENTATION</span><h2>What your behavior is telling us</h2><p>${hasEnough?'Patterns appear only when there is enough repeated evidence. New observations are generated whenever you open Memory.':'The system is building your baseline. Keep using ELIF OS and Memory will begin reporting recurring patterns automatically.'}</p>${p30.map(z=>`<div class="report-item"><b>${esc(z.title)}</b><span>${esc(z.text)}</span><small>${esc(z.evidence)}</small></div>`).join('')||'<div class="report-item"><b>Baseline building</b><span>We need more repeated activity before calling something a pattern. This prevents one-off days from becoming fake conclusions.</span></div>'}</div><div class="memory-analysis"><div class="panel memory-pattern"><span class="eyebrow">RECENT SIGNALS</span><h3>Last 7 days</h3>${p7.map(z=>`<p>• ${esc(z.text)}</p>`).join('')||'<p>No reliable 7-day pattern yet.</p>'}</div><div class="panel memory-pattern"><span class="eyebrow">NEXT REVIEW</span><h3>Keep living normally.</h3><p>There is nothing extra you need to enter for Memory. Study, plan, complete tasks, log trades, sleep, journal and use your routines. The analysis layer reads those records.</p><small>30-day reports become more useful as the dataset grows.</small></div></div></section>`}
  window.addEventListener('click',e=>{if(e.target.closest?.('button[data-page="memory"]'))setTimeout(render,0)});
  window.ELIFMemory={render,patterns,data};
})();