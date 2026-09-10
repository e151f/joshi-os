(()=>{
  try{
    if(window.crypto && !window.crypto.randomUUID){window.crypto.randomUUID=()=>{const a=crypto.getRandomValues(new Uint8Array(16));a[6]=(a[6]&15)|64;a[8]=(a[8]&63)|128;const h=[...a].map(x=>x.toString(16).padStart(2,'0')).join('');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`}}
    if('serviceWorker' in navigator)navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});
    if(window.caches)caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))).catch(()=>{});
  }catch(e){console.warn('ELIF OS boot',e)}
  window.addEventListener('error',e=>{
    const app=document.getElementById('app');
    if(app && !app.querySelector('.boot-error')){
      app.innerHTML=`<div class="boot-error" style="min-height:100vh;display:grid;place-items:center;padding:30px;background:#090709;color:#f7edf2;font-family:system-ui"><div style="max-width:680px;width:100%;padding:24px;border:1px solid #543044;border-radius:16px;background:#130d12"><div style="color:#e48cae;font:11px monospace;letter-spacing:.15em">ELIF OS // BOOT ERROR</div><h1 style="font-family:Georgia,serif">The app hit a startup error.</h1><p style="color:#a796a1">${String(e.message||e.error||'Unknown error').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}</p><small style="color:#77636e">${e.filename||''}:${e.lineno||''}:${e.colno||''}</small></div></div>`;
    }
  });
})();