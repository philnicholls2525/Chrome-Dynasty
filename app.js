const state={coins:100000,packs:12,boxes:4,draftStars:34,perfectRushes:1,owned:0,total:120};
const app=document.getElementById('app');
function updateChrome(){
  const coin=document.getElementById('coinBalance'); if(coin) coin.textContent=state.coins.toLocaleString();
  document.querySelectorAll('.bottom-nav [data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===window.__route));
}
function bindRoutes(root=document){
  root.querySelectorAll('[data-route]').forEach(el=>{if(el.__bound)return;el.__bound=true;el.addEventListener('click',e=>{e.preventDefault();navigate(el.dataset.route);});});
}
function home(){
  const t=document.getElementById('homeTemplate'); app.innerHTML=''; app.appendChild(t.content.cloneNode(true));
  const hp=document.getElementById('heroPackCount'),hb=document.getElementById('heroBoxCount'),ds=document.getElementById('draftStars'),pr=document.getElementById('perfectRushes'),co=document.getElementById('collectionOwned'),cp=document.getElementById('collectionPct');
  if(hp)hp.textContent=`${state.packs} packs`;if(hb)hb.textContent=`${state.boxes} boxes`;if(ds)ds.textContent=state.draftStars;if(pr)pr.textContent=state.perfectRushes;if(co)co.textContent=state.owned;if(cp)cp.textContent=`${Math.round(state.owned/state.total*100)}%`;
  bindRoutes(app);
}
const screens={
 collection:['COLLECTION','Your APEX binder','Your full Debut Edition collection will live here. The production card database is being restored to this deployment.'],
 open:['SEALED INVENTORY','Open Packs','Normal Packs, Hanger Boxes, Value Boxes and Hobby Boxes will open from here.'],
 objectives:['PROGRESS','Objectives','Daily, weekly, set and career objectives are part of APEX.'],
 store:['STORE','APEX Store','Buy Normal Packs, Hanger Boxes, Value Boxes and Hobby Boxes with coins.'],
 draft:['PLAY','Quick Draft','Build a 12-pick squad and complete the five live Draft objectives.'],
 rush:['10 PACKS','Pack Rush','Open ten Rush packs and chase a 4★ board.'],
 sbc:['BUILD','SBCs','Submit duplicate cards into upgrade and Debut Edition challenges.'],
 profile:['PROFILE','APEX Profile','Your career stats, discoveries and rewards will appear here.']
};
function generic(route){
 const [eyebrow,title,desc]=screens[route]||['APEX','Coming soon','This section is being restored.'];
 app.innerHTML=`<section class="page generic-page"><div class="page-title-row"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1></div><button class="ghost" data-route="home">← Home</button></div><div class="panel" style="padding:22px;margin-top:16px"><p style="color:#c5cada;line-height:1.6">${desc}</p>${route==='open'?'<button class="primary" style="margin-top:18px" data-route="store">Go to Store →</button>':''}</div></section>`;
 bindRoutes(app);
}
function navigate(route){window.__route=route||'home'; if(window.__route==='home')home();else generic(window.__route);updateChrome();window.scrollTo({top:0,behavior:'instant'});}
bindRoutes();navigate('home');
