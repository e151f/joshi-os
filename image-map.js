(()=>{
  const MAP={
    body:'IMG_0953.jpeg',
    meal:'IMG_0954.jpeg',
    journal:'IMG_0955.jpeg',
    goals:'IMG_0956.jpeg',
    projects:'IMG_0957.jpeg',
    sleep:'IMG_0958.jpeg',
    hobbies:'hobbies.jpeg',
    glow:'F584E7AC-3482-4B28-819F-8872E899B875.png'
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
