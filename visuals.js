(()=>{
  const artPages=new Set(['sleep','glow','meal','journal','goals','projects']);
  function patch(){
    const tiles=document.querySelector('.tiles'); if(!tiles)return;
    const more=tiles.querySelector('.tile.more');
    const existing=new Set([...tiles.querySelectorAll('.tile[data-page]')].map(x=>x.dataset.page));
    const add=(p,n,s,before)=>{if(existing.has(p))return;const el=document.createElement('button');el.className='tile visual-art visual-'+p;el.dataset.page=p;el.innerHTML=`<span class="art-image art-${p}" aria-hidden="true"></span><div class="tb"><b>${n}</b><span>${s}</span></div>`;tiles.insertBefore(el,before||more||null);existing.add(p)};
    add('sleep','Sleep','Rest to perform',tiles.firstElementChild);
    if(!existing.has('hobbies')){
      const el=document.createElement('button');
      el.className='tile visual-hobbies';
      el.dataset.page='hobbies';
      el.innerHTML='<img src="hobbies.jpeg" alt="Hobbies" loading="lazy"><div class="tb"><b>Hobbies</b><span>Do what you love</span></div>';
      tiles.insertBefore(el,more||null);
      existing.add('hobbies');
    }
    tiles.querySelectorAll('.tile[data-page]').forEach(tile=>{
      const p=tile.dataset.page;if(!p)return;
      tile.classList.add('visual-'+p);
      if(artPages.has(p)){const img=tile.querySelector('img');if(img)img.remove();}
    });
  }
  patch();
  const root=document.getElementById('view');
  if(root){let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;patch()})}).observe(root,{childList:true,subtree:true});}
})();
