(()=>{
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(!b || !b.hasAttribute('data-add')) return;
    const page=document.querySelector('#view')?.dataset.page||'home';
    if(page!=='home') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    // Let the app's normal navigation handler open Tasks, then hand control
    // to Task Engine V2. This avoids the legacy runtime's reload-based task form.
    const nav=document.querySelector('button[data-page="tasks"]');
    if(nav) nav.click();
    setTimeout(()=>document.querySelector('[data-te-new]')?.click(),120);
  },true);
})();
