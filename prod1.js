const PLAYERS = [
  {id:'kane',name:'Harry Kane',club:'Bayern Munich',tier:'common'},
  {id:'dembele',name:'Ousmane Dembélé',club:'Paris Saint-Germain',tier:'common'},
  {id:'dowman',name:'Max Dowman',club:'Arsenal',tier:'common',rookie:true},
  {id:'haaland',name:'Erling Haaland',club:'Manchester City',tier:'common'},
  {id:'estevao',name:'Estêvão Willian',club:'Chelsea FC',tier:'uncommon',rookie:true},
  {id:'karl',name:'Lennart Karl',club:'Bayern Munich',tier:'uncommon',rookie:true},
  {id:'vini',name:'Vinícius Jr.',club:'Real Madrid',tier:'uncommon'},
  {id:'palmer',name:'Cole Palmer',club:'Chelsea FC',tier:'uncommon'},
  {id:'messi',name:'Lionel Messi',club:'Inter Miami',tier:'scarce'},
  {id:'ronaldo',name:'Cristiano Ronaldo',club:'Al-Nassr',tier:'scarce'},
  {id:'yamal',name:'Lamine Yamal',club:'Barcelona',tier:'scarce',rookie:true},
  {id:'bellingham',name:'Jude Bellingham',club:'Real Madrid',tier:'scarce'}
];
const WEIGHTS={common:1,uncommon:.65,scarce:.35};
const CORE_HITS={
  elevation:['kane','dembele','ronaldo','haaland'],
  afterimage:['messi','bellingham','palmer'],
  frameless:['dowman','yamal','estevao','karl'],
  road:['dembele','karl','estevao','ronaldo'],
  stage:['vini','messi','palmer','yamal']
};
const TYPE_META={
  base:{label:'Base',rank:0}, green:{label:'Green',rank:1}, blue:{label:'Blue',rank:2},
  apex:{label:'APEX',rank:3}, red:{label:'Red',rank:4}, neon:{label:'Neon Nights',rank:4}, ice:{label:'Black Ice',rank:4},
  road:{label:'Road to Glory',rank:5}, stage:{label:'The Stage',rank:5}, elevation:{label:'Elevation',rank:5}, afterimage:{label:'Afterimage',rank:6}, frameless:{label:'Frameless: Breakthrough',rank:7},
  onlyone:{label:'Gold Only One',rank:8}, theapex:{label:'THE APEX',rank:9}, reward:{label:'APEX Reward',rank:10}
};
const CARD_ART={
  'base:haaland':{src:'assets/cards/debut-edition/base/haaland.png',orientation:'portrait'},
  'green:haaland':{src:'assets/cards/debut-edition/green/haaland.png',orientation:'portrait'},
  'blue:haaland':{src:'assets/cards/debut-edition/blue/haaland.png',orientation:'portrait'},
  'apex:haaland':{src:'assets/cards/debut-edition/apex/haaland.png',orientation:'portrait'},
  'red:haaland':{src:'assets/cards/debut-edition/red/haaland.png',orientation:'portrait'},
  'base:estevao':{src:'assets/cards/debut-edition/base/estevao.png',orientation:'portrait'},
  'green:estevao':{src:'assets/cards/debut-edition/green/estevao.png',orientation:'portrait'},
  'blue:estevao':{src:'assets/cards/debut-edition/blue/estevao.png',orientation:'portrait'},
  'apex:estevao':{src:'assets/cards/debut-edition/apex/estevao.png',orientation:'portrait'},
  'red:estevao':{src:'assets/cards/debut-edition/red/estevao.png',orientation:'portrait'}
};
function cardArt(card){return CARD_ART[card.id]||null}
const PRODUCTS={
  normal:{name:'Normal Pack',price:200,kind:'pack',packs:1,desc:'3 cards · standard Debut Edition odds'},
  plus:{name:'Plus Pack',kind:'reward',packs:1,desc:'Green+ guaranteed · modestly boosted hit chance'},
  premium:{name:'Premium Pack',kind:'reward',packs:1,desc:'Blue+ guaranteed · boosted hit chance'},
  elite:{name:'Elite Pack',kind:'reward',packs:1,desc:'Red+ guaranteed · 12% Set Hit · 2.5% Only One · 0.1% THE APEX'},
  hanger:{name:'Hanger Box',price:800,kind:'box',packs:3,desc:'3 packs · 1 Neon Nights guaranteed · Road to Glory live'},
  value:{name:'Value Box',price:1750,kind:'box',packs:5,desc:'5 packs · 1 Black Ice · 1 APEX · 1 Green+ guaranteed · The Stage live'},
  hobby:{name:'Hobby Box',price:4500,kind:'box',packs:8,desc:'8 packs · 1 Green+ · 1 Blue+ · 1 APEX+ · 1 Red+ guaranteed'}
};
const DEFAULT_SAVE={
  version:10,
  coins:100000,
  inventory:{normal:100,plus:15,premium:8,elite:3,hanger:10,value:6,hobby:5},
  stats:{draftStars:34,perfectDrafts:2,perfectRushes:1,packsOpened:0,boxesOpened:0,cardsPulled:0,onlyOnes:0,theApex:0},
  cards:{}, discovered:{}, gallery:[], recent:[], lastOpening:[], onlyOnesPulled:[],
  objectivesReady:3, claimedObjectives:{}, pendingDraftReward:null, sbc:{completed:{},claimed:{},submitted:0}
};
const SAVE_KEY='apex-v010-save';
const save=JSON.parse(localStorage.getItem(SAVE_KEY)||'null')||structuredClone(DEFAULT_SAVE);
save.sbc=save.sbc||{completed:{},claimed:{},submitted:0}; save.sbc.completed=save.sbc.completed||{}; save.sbc.claimed=save.sbc.claimed||{}; save.sbc.submitted=save.sbc.submitted||0;
save.stats.rushesPlayed=save.stats.rushesPlayed||0; save.stats.rushPacksOpened=save.stats.rushPacksOpened||0; save.stats.perfectRushes=save.stats.perfectRushes||0; save.stats.rushBest=save.stats.rushBest||0; save.stats.rushPerfectStreak=save.stats.rushPerfectStreak||0; save.stats.rushLongestStreak=save.stats.rushLongestStreak||0; save.pendingRushReward=save.pendingRushReward||null;
save.stats.draftsPlayed=save.stats.draftsPlayed||0; save.stats.sbcCompleted=save.stats.sbcCompleted||0; save.stats.coinsEarned=save.stats.coinsEarned||0; save.stats.coinsSpent=save.stats.coinsSpent||0; save.stats.hangersOpened=save.stats.hangersOpened||0; save.stats.valuesOpened=save.stats.valuesOpened||0; save.stats.hobbiesOpened=save.stats.hobbiesOpened||0;
save.objectiveSystem=save.objectiveSystem||{claimed:{},xp:0,levelClaims:{},hiddenUnlocked:{},hiddenClaimed:{},daily:null,weekly:null};
const DAY_KEY=()=>new Date().toISOString().slice(0,10); const WEEK_KEY=()=>{const d=new Date(),x=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));x.setUTCDate(x.getUTCDate()+4-(x.getUTCDay()||7));const y=new Date(Date.UTC(x.getUTCFullYear(),0,1));return x.getUTCFullYear()+'-W'+String(Math.ceil((((x-y)/86400000)+1)/7)).padStart(2,'0')};
function statSnapshot(){return {packs:save.stats.packsOpened,drafts:save.stats.draftsPlayed,rushes:save.stats.rushesPlayed,sbcs:save.stats.sbcCompleted,green:pullCount('green'),blue:pullCount('blue'),apex:pullCount('apex'),red:pullCount('red'),scarce:pullTierCount('scarce')}}
function ensureObjectivePeriods(){if(!save.objectiveSystem.daily||save.objectiveSystem.daily.key!==DAY_KEY())save.objectiveSystem.daily={key:DAY_KEY(),base:statSnapshot(),claimed:{},bonus:false};if(!save.objectiveSystem.weekly||save.objectiveSystem.weekly.key!==WEEK_KEY())save.objectiveSystem.weekly={key:WEEK_KEY(),base:statSnapshot(),claimed:{},milestones:{}}}
const persist=()=>localStorage.setItem(SAVE_KEY,JSON.stringify(save));
const app=document.getElementById('app');
let openingSession=null;
let draftSession=null;
let rushSession=null;
function byId(id){return document.getElementById(id)}
function weighted(items,weightFn){const total=items.reduce((s,x)=>s+weightFn(x),0);let r=Math.random()*total;for(const x of items){r-=weightFn(x);if(r<=0)return x}return items[items.length-1]}
function pickPlayer(exclude=[]){const pool=PLAYERS.filter(p=>!exclude.includes(p.id));return weighted(pool,p=>WEIGHTS[p.tier])}
function cardId(type,playerId){return `${type}:${playerId}`}
function makeCard(type,playerId,extra={}){const p=PLAYERS.find(x=>x.id===playerId)||{id:playerId,name:extra.name||'Zinedine Zidane',club:extra.club||'Legend',tier:'legend'};return {id:cardId(type,playerId),type,playerId:p.id,name:p.name,club:p.club,tier:p.tier,rookie:!!p.rookie,...extra}}
function chooseHitPlayer(type){return CORE_HITS[type][Math.floor(Math.random()*CORE_HITS[type].length)]}
function roll(percent){return Math.random()*100<percent}
function rollSlot2(){const r=Math.random()*100;if(r<25)return'green';if(r<36.111)return'blue';if(r<41.374)return'apex';return'base'}
function rollSlot2Value(){const r=Math.random()*100;if(r<2)return'green';if(r<3)return'blue';return'base'}
function rollSlot2Hobby(){const r=Math.random()*100;if(r<10)return'green';if(r<15)return'blue';if(r<17)return'apex';return'base'}
function rollSlot3(mult=1,exclusive=null){const rows=[];if(exclusive==='road') rows.push(['road',2.5]);if(exclusive==='stage') rows.push(['stage',100/60]);rows.push(['red',(100/42)*mult],['elevation',(100/76)*mult],['afterimage',(100/198)*mult],['frameless',(100/364)*mult],['onlyone',(100/1000)*mult],['theapex',(100/5000)*mult]);const total=rows.reduce((s,x)=>s+x[1],0);let r=Math.random()*100;if(r>=Math.min(total,95))return'base';for(const [t,w] of rows){if(r<w)return t;r-=w}return'base'}
function remainingOnlyOnes(){return PLAYERS.filter(p=>!save.onlyOnesPulled.includes(p.id))}
function chooseOnlyOne(exclude=[]){const pool=remainingOnlyOnes().filter(p=>!exclude.includes(p.id));if(!pool.length)return null;return weighted(pool,p=>WEIGHTS[p.tier])}
function makeByType(type,exclude=[]){if(type==='theapex')return makeCard('theapex','zidane',{name:'Zinedine Zidane',club:'THE APEX'});if(type==='onlyone'){const p=chooseOnlyOne(exclude); if(!p)return makeByType('base',exclude); return makeCard('onlyone',p.id)}if(CORE_HITS[type])return makeCard(type,chooseHitPlayer(type));return makeCard(type,pickPlayer(exclude).id)}
function weightedValueGreenPlus(){return Math.random()*100<82?'green':'blue'}
function weightedPlus(minType){const tables={green:[['green',76],['blue',17],['apex',5],['red',1.4],['sethit',.4],['onlyone',.18],['theapex',.02]],blue:[['blue',79],['apex',15],['red',4],['sethit',1.5],['onlyone',.45],['theapex',.05]],apex:[['apex',82],['red',13],['sethit',4],['onlyone',.9],['theapex',.1]],red:[['red',90],['sethit',8],['onlyone',1.8],['theapex',.2]]};const table=tables[minType],r=Math.random()*100;let n=r;let out=table[0][0];for(const [k,w] of table){if(n<w){out=k;break}n-=w}if(out==='sethit'){const rr=Math.random()*100;out=rr<66?'elevation':rr<91?'afterimage':'frameless'}return out}
function generateNormalPack(opts={}){const used=[];const c1=makeByType('base',used); used.push(c1.playerId);const t2=opts.force2||(opts.valueOdds?rollSlot2Value():opts.hobbyOdds?rollSlot2Hobby():rollSlot2()); let c2=makeByType(t2,used);if(used.includes(c2.playerId)){ const alt=PLAYERS.find(p=>!used.includes(p.id)); c2=makeCard(t2,alt.id); }used.push(c2.playerId);const t3=opts.force3||rollSlot3(opts.hitMult||1,opts.exclusiveHit||null);let c3=makeByType(t3,used);if(used.includes(c3.playerId)){if(CORE_HITS[t3]){ const eligible=CORE_HITS[t3].filter(id=>!used.includes(id)); c3=eligible.length?makeCard(t3,eligible[Math.floor(Math.random()*eligible.length)]):makeByType('base',used); }else { c3=makeByType(t3,used); }}return [c1,c2,c3]}
function rewardEliteType(){const r=Math.random()*100;if(r<85.4)return'red';if(r<97.4){const x=Math.random()*100;return x<66?'elevation':x<91?'afterimage':'frameless'}if(r<99.9)return'onlyone';return'theapex'}
function generateRewardPack(kind){if(kind==='plus') return generateNormalPack({force2:weightedPlus('green')});if(kind==='premium') return generateNormalPack({force2:weightedPlus('blue')});if(kind==='elite') return generateNormalPack({force3:rewardEliteType()});return generateNormalPack()}
function injectExactGuarantee(pack,type){const current=pack[2];const toSlot3=((TYPE_META[type]?.rank||0) >= (TYPE_META[current.type]?.rank||0) || ['neon','ice'].includes(type));const slot=toSlot3?2:1;const exclude=pack.filter((_,i)=>i!==slot).filter(c=>!CORE_HITS[c.type]&&c.type!=='theapex').map(c=>c.playerId);pack[slot]=makeByType(type,(CORE_HITS[type]||type==='theapex')?[]:exclude);return pack}
function injectValueGreenGuarantee(pack){return injectExactGuarantee(pack,weightedValueGreenPlus())}
function injectGuarantee(pack,type,minType=null){const actual=minType?weightedPlus(minType):type;const current=pack[2];const toSlot3=((TYPE_META[actual]?.rank||0) >= (TYPE_META[current.type]?.rank||0) || ['neon','ice'].includes(actual));const slot=toSlot3?2:1;const exclude=pack.filter((_,i)=>i!==slot).filter(c=>!CORE_HITS[c.type]&&c.type!=='theapex').map(c=>c.playerId);pack[slot]=makeByType(actual,(CORE_HITS[actual]||actual==='theapex')?[]:exclude);return pack}
function enforceBoxCardUniqueness(packs){const seenByType={};for(const pack of packs){for(let slot=0;slot<pack.length;slot++){let card=pack[slot];const type=card.type;if(!seenByType[type]) seenByType[type]=new Set();if(!seenByType[type].has(card.playerId)){seenByType[type].add(card.playerId);continue}const otherPlayers=pack.filter((_,i)=>i!==slot).map(c=>c.playerId);let candidates=[];if(CORE_HITS[type])candidates=CORE_HITS[type].filter(id=>!seenByType[type].has(id)&&!otherPlayers.includes(id));else if(type==='onlyone')candidates=remainingOnlyOnes().map(p=>p.id).filter(id=>!seenByType[type].has(id)&&!otherPlayers.includes(id));else if(type!=='theapex')candidates=PLAYERS.map(p=>p.id).filter(id=>!seenByType[type].has(id)&&!otherPlayers.includes(id));if(candidates.length){const chosen=weighted(candidates,id=>WEIGHTS[(PLAYERS.find(p=>p.id===id)||{tier:'common'}).tier]||1);card=makeCard(type,chosen);pack[slot]=card}seenByType[type].add(card.playerId)}}return packs}
function limitExactTypePerBox(packs,type,maxCount=1){let seen=0;for(const pack of packs){for(let i=0;i<pack.length;i++){if(pack[i].type!==type) continue;seen++;if(seen<=maxCount) continue;const otherPlayers=pack.filter((_,j)=>j!==i).map(c=>c.playerId);pack[i]=makeByType('blue',otherPlayers)}}return packs}
function limitValueNaturalColor(packs,maxCount=1){let kept=0;for(const pack of packs){for(let i=0;i<pack.length;i++){if(!['green','blue','apex'].includes(pack[i].type)) continue;kept++;if(kept<=maxCount) continue;const others=pack.filter((_,j)=>j!==i).map(c=>c.playerId);pack[i]=makeByType('base',others)}}return packs}
function generateBox(kind){const p=PRODUCTS[kind];const packs=Array.from({length:p.packs},()=>generateNormalPack({exclusiveHit:kind==='hanger'?'road':kind==='value'?'stage':null,valueOdds:kind==='value',hobbyOdds:kind==='hobby'}));if(kind==='value') limitValueNaturalColor(packs,1);const indices=[...Array(p.packs).keys()].sort(()=>Math.random()-.5);if(kind==='hanger') injectGuarantee(packs[indices[0]],'neon');if(kind==='value'){injectExactGuarantee(packs[indices[0]],'ice');injectExactGuarantee(packs[indices[1]],'apex');injectValueGreenGuarantee(packs[indices[2]])}if(kind==='hobby'){injectGuarantee(packs[indices[0]],null,'green');injectGuarantee(packs[indices[1]],null,'blue');injectGuarantee(packs[indices[2]],null,'apex');injectGuarantee(packs[indices[3]],null,'red')}if(kind==='value') limitExactTypePerBox(packs,'apex',1);return enforceBoxCardUniqueness(packs)}