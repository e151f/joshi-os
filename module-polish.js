(()=>{
  const heroes={
    study:['study.jpeg','Study'],body:['body.jpeg','Body'],wallet:['money.jpeg','Wallet'],meal:['IMG_0954.jpeg','Meal'],journal:['IMG_0955.jpeg','Journal'],goals:['IMG_0956.jpeg','Goals'],projects:['IMG_0957.jpeg','Projects'],sleep:['IMG_0958.jpeg','Sleep']
  };
  function style(){if(document.getElementById('elif-module-polish-css'))return;const s=document.createElement('style');s.id='elif-module-polish-css';s.textContent=`
    /* Module imagery follows Glow Up: compact visual card, no hero-banner overlay. */
    .module-visual{width:100%;margin:14px 0;border:1px solid #493440;border-radius:13px;overflow:hidden;background:#100d12}
    .module-visual img{display:block;width:100%;height:220px;object-fit:cover}
    .module-visual-caption{padding:12px 16px;border-top:1px solid #292029;display:flex;align-items:center;justify-content:space-between;gap:12px}
    .module-visual-caption span{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--pink)}
    .module-visual-caption small{font-size:10px;color:var(--muted)}
    .memory-hero{display:flex;justify-content:space-between;align-items:center;gap:20px;margin:18px 0 12px;padding:22px 24px;border:1px solid #493440;border-radius:13px;background:linear-gradient(120deg,#171017,#100d11)}
    .memory-hero h1{font:30px Georgia,serif;margin:7px 0 3px}.memory-hero p{margin:0;color:var(--muted);font-size:12px}.memory-count{min-width:120px;text-align:right}.memory-count b{display:block;font:30px 'DM Mono',monospace;color:var(--pink2)}.memory-count small{color:var(--muted);font-size:10px}
    .memory-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}.memory-stats .panel{padding:14px 16px}.memory-stats b{display:block;font:21px 'DM Mono',monospace;color:var(--pink2)}.memory-stats small{color:var(--muted);font-size:10px}
    .memory-analysis{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.memory-pattern{padding:16px 18px}.memory-pattern h3{font:18px Georgia,serif;margin:7px 0}.memory-pattern p{margin:0;color:#d6c9cf;line-height:1.65}.memory-pattern small{display:block;color:var(--muted);font-size:10px;margin-top:9px}
    .memory-report{padding:20px;margin-top:12px}.memory-report h2{font:22px Georgia,serif;margin:7px 0}.memory-report p{color:#d6c9cf;line-height:1.7;margin:7px 0}.memory-report .report-item{padding:12px 0;border-top:1px solid #292029}.memory-report .report-item b{display:block;margin-bottom:4px}.memory-report .report-item span{color:#cfc1c8;line-height:1.6}
    @media(max-width:700px){.module-visual img{height:175px}.memory-hero{padding:18px;align-items:flex-start}.memory-count{text-align:left}.memory-stats{grid-template-columns:repeat(2,1fr)}.memory-analysis{grid-template-columns:1fr}}
  `;document.head.appendChild(s)}
  function addMemoryNav(){const nav=document.querySelector('.nav');if(!nav||nav.querySelector('[data-page="memory"]'))return;const journal=nav.querySelector('button[data-page="journal"]');if(!journal)return;const b=document.createElement('button');b.dataset.page='memory';b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6l1 2h4v14H4V6h4z"/><path d="M8 10h8M8 14h6"/></svg><span>Memory</span>';journal.insertAdjacentElement('afterend',b)}
  function addVisual(){const v=document.querySelector('#view'),page=v?.dataset.page;if(!v||!heroes[page]||page==='glow'||v.querySelector('.module-visual'))return;const [img,title]=heroes[page],section=v.querySelector('section')||v.firstElementChild;if(!section)return;const head=section.querySelector('.viewhead');const h=document.createElement('div');h.className='module-visual';h.innerHTML=`<img src="${img}" alt="${title}"><div class="module-visual-caption"><span>ELIF OS MODULE</span><small>${title}</small></div>`;if(head)head.insertAdjacentElement('afterend',h);else section.insertBefore(h,section.firstChild)}
  function tick(){style();addMemoryNav();addVisual()}
  tick();
  const root=document.getElementById('view');if(root)new MutationObserver(()=>requestAnimationFrame(tick)).observe(root,{childList:true,subtree:true});
  window.addEventListener('click',e=>{if(e.target.closest?.('button[data-page]'))setTimeout(tick,0)});
})();