(()=>{
  const MAP={
    sleep:'sleep.jpeg',
    study:'study.jpeg',
    body:'body.jpeg',
    glow:'glow up.jpeg',
    wallet:'walleti.jpeg',
    meal:'meal.jpeg',
    journal:'journal.jpeg',
    goals:'goals.jpeg',
    projects:'projects.jpeg',
    habits:'hobbies.jpeg',
    hobbies:'hobbies.jpeg',
    korean:'korean.jpeg'
  };
  function patch(){
    document.querySelectorAll('.tile[data-page]').forEach(tile=>{
      const page=tile.dataset.page;
      const src=MAP[page];
      if(!src)return;
      tile.classList.remove('visual-art','visual-'+page);
      const art=tile.querySelector('.art-image');
      if(art)art.remove();
      let img=tile.querySelector('img');
      if(!img){
        img=document.createElement('img');
        tile.insertBefore(img,tile.firstChild);
      }
      img.src=src;
      img.alt=page.charAt(0).toUpperCase()+page.slice(1);
      img.loading='lazy';
    });
  }
  patch();
  const root=document.getElementById('view');
  if(root){
    let pending=false;
    new MutationObserver(()=>{
      if(pending)return;
      pending=true;
      requestAnimationFrame(()=>{pending=false;patch()});
    }).observe(root,{childList:true,subtree:true});
  }
})();
