(()=>{
  function target(e){return e.target?.closest?.('[data-te-new]')}
  window.addEventListener('click',e=>{
    const b=target(e);if(!b)return;
    const engine=window.ELIFTaskEngine;
    if(!engine?.openNew)return;
    e.preventDefault();e.stopImmediatePropagation();engine.openNew();
  },true);
})();
