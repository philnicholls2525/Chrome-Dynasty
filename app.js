(() => {
  "use strict";

  const SAVE_KEY = "apex-journey-save-v1";

  const PLAYERS = [
    { id: "haaland", name: "Erling Haaland", short: "Haaland", club: "Manchester City", rating: 92, role: "FINISHER", weight: 6 },
    { id: "vinicius", name: "Vinícius Jr", short: "Vinícius", club: "Real Madrid", rating: 91, role: "FLAIR", weight: 3 },
    { id: "estevao", name: "Estêvão", short: "Estêvão", club: "Chelsea", rating: 84, role: "ROOKIE", rookie: true, weight: 3 },
    { id: "yamal", name: "Lamine Yamal", short: "Yamal", club: "Barcelona", rating: 91, role: "ROOKIE", rookie: true, weight: 1.3 },
    { id: "dowman", name: "Max Dowman", short: "Dowman", club: "Arsenal", rating: 78, role: "ROOKIE", rookie: true, weight: 6 },
    { id: "bellingham", name: "Jude Bellingham", short: "Bellingham", club: "Real Madrid", rating: 92, role: "ENGINE", weight: 1.3 },
    { id: "palmer", name: "Cole Palmer", short: "Palmer", club: "Chelsea", rating: 90, role: "CREATOR", weight: 3 },
    { id: "karl", name: "Lennart Karl", short: "Karl", club: "Bayern Munich", rating: 80, role: "ROOKIE", rookie: true, weight: 3 },
    { id: "kane", name: "Harry Kane", short: "Kane", club: "Bayern Munich", rating: 91, role: "FINISHER", weight: 6 },
    { id: "dembele", name: "Ousmane Dembélé", short: "Dembélé", club: "Paris SG", rating: 91, role: "FLAIR", weight: 6 },
    { id: "messi", name: "Lionel Messi", short: "Messi", club: "Inter Miami", rating: 93, role: "ICON", weight: 1.3 },
    { id: "ronaldo", name: "Cristiano Ronaldo", short: "Ronaldo", club: "Al-Nassr", rating: 92, role: "ICON", weight: 1.3 }
  ];

  const ZIDANE = { id: "zidane", name: "Zinedine Zidane", short: "Zidane", club: "APEX Icons", rating: 96, role: "THE APEX", weight: 1 };
  const PLAYER = Object.fromEntries([...PLAYERS, ZIDANE].map(p => [p.id, p]));
  const ROOKIES = ["dowman", "yamal", "estevao", "karl"];
  const PARALLELS = ["base", "green", "blue", "apex", "red", "only-one"];
  const INSERTS = ["elevation", "afterimage", "breakthrough", "the-apex"];
  const RARITY = {
    base: { label: "Base", code: "B" },
    green: { label: "Green", code: "G" },
    blue: { label: "Blue", code: "BL" },
    apex: { label: "APEX", code: "A" },
    red: { label: "Red", code: "R" },
    "only-one": { label: "Only One", code: "1/1" },
    elevation: { label: "Elevation", code: "EL" },
    afterimage: { label: "Afterimage", code: "AF" },
    breakthrough: { label: "Breakthrough", code: "BT" },
    "the-apex": { label: "The APEX", code: "★" }
  };

  const CHAPTERS = [
    {
      title: "First Touch",
      line: "Learn the collecting loop",
      copy: "Open your starter pack, meet the Debut Edition and complete your first six-pick Draft.",
      reward: { coins: 250, packs: 2, trophy: "First Touch" },
      objectives: [
        { label: "Open a pack", target: 1, value: s => s.stats.packsOpened },
        { label: "Complete a Draft", target: 1, value: s => s.stats.drafts },
        { label: "Discover 5 players", target: 5, value: s => discoveredCount(s) }
      ]
    },
    {
      title: "Build the Core",
      line: "Turn cards into progress",
      copy: "Grow the binder and finish a Collection Path to prove the squad has a foundation.",
      reward: { coins: 350, packs: 1, trophy: "Core Builder" },
      objectives: [
        { label: "Own 5 unique players", target: 5, value: s => uniqueOwnedPlayers(s).size },
        { label: "Complete 2 Drafts", target: 2, value: s => s.stats.drafts },
        { label: "Claim a Collection Path", target: 1, value: s => s.pathsClaimed.length }
      ]
    },
    {
      title: "Rising Stars",
      line: "Back the next generation",
      copy: "Find the rookies, pull your first colour and build a Draft worthy of three stars.",
      reward: { coins: 500, packs: 2, trophy: "Future Class" },
      objectives: [
        { label: "Own 2 rookies", target: 2, value: s => ownedFromList(s, ROOKIES) },
        { label: "Own a Blue or better", target: 1, value: s => hasTier(s, ["blue","apex","red","only-one"]) ? 1 : 0 },
        { label: "Earn a 3-star Draft", target: 3, value: s => s.stats.bestStars }
      ]
    },
    {
      title: "Chasing Colour",
      line: "Make the binder shine",
      copy: "Hunt scarce parallels, complete paths and push the Debut Edition towards mastery.",
      reward: { coins: 750, packs: 3, trophy: "Colour Chaser" },
      objectives: [
        { label: "Own 10 unique players", target: 10, value: s => uniqueOwnedPlayers(s).size },
        { label: "Own a Red or better", target: 1, value: s => hasTier(s, ["red","only-one"]) ? 1 : 0 },
        { label: "Claim 2 Collection Paths", target: 2, value: s => s.pathsClaimed.length }
      ]
    },
    {
      title: "Reach the APEX",
      line: "Complete the opening journey",
      copy: "Finish with a great Draft, a premium hit and a player rainbow in your binder.",
      reward: { coins: 1500, packs: 5, trophy: "Journey One" },
      objectives: [
        { label: "Earn a 4-star Draft", target: 4, value: s => s.stats.bestStars },
        { label: "Own an insert hit", target: 1, value: s => hasTier(s, INSERTS) ? 1 : 0 },
        { label: "Collect 3 variants of one player", target: 3, value: s => maxVariantCount(s) }
      ]
    }
  ];

  const PATHS = [
    { id: "blue-is-the-colour", title: "Blue Is the Colour", copy: "Own Cole Palmer and Estêvão in any variants.", reward: { coins: 250 }, target: 2, value: s => ownedFromList(s, ["palmer","estevao"]) },
    { id: "new-wave", title: "New Wave", copy: "Discover all four Debut Edition rookies.", reward: { packs: 1 }, target: 4, value: s => ROOKIES.filter(id => s.discovered[id]).length },
    { id: "goat-debate", title: "GOAT Debate", copy: "Discover both Lionel Messi and Cristiano Ronaldo.", reward: { coins: 300 }, target: 2, value: s => ["messi","ronaldo"].filter(id => s.discovered[id]).length },
    { id: "lift-off", title: "Lift Off", copy: "Own two insert cards from the Debut Edition.", reward: { packs: 2 }, target: 2, value: s => countRarities(s, INSERTS) },
    { id: "rainbow-starter", title: "Rainbow Starter", copy: "Own three different variants of the same player.", reward: { coins: 500, trophy: "First Rainbow" }, target: 3, value: s => maxVariantCount(s) }
  ];

  const TROPHIES = [
    ["First Touch", "Complete Journey chapter one."],
    ["Core Builder", "Build the foundation of a real collection."],
    ["Future Class", "Complete the Rising Stars chapter."],
    ["Colour Chaser", "Push deep into the parallel chase."],
    ["Journey One", "Complete the first APEX Journey."],
    ["First Rainbow", "Collect three variants of one player."]
  ];

  const defaultState = () => ({
    version: 1,
    view: "journey",
    coins: 400,
    packs: 1,
    xp: 0,
    discovered: {},
    collection: {},
    onlyOnes: {},
    chaptersClaimed: [],
    pathsClaimed: [],
    trophies: [],
    stats: { packsOpened: 0, drafts: 0, bestStars: 0, godPacks: 0 },
    draft: null,
    lastDraft: null,
    packSession: null,
    binderFilter: "all"
  });

  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!raw || raw.version !== 1) return defaultState();
      const base = defaultState();
      return { ...base, ...raw, stats: { ...base.stats, ...(raw.stats || {}) } };
    } catch (_) {
      return defaultState();
    }
  }

  let state = loadState();
  const app = document.getElementById("app");
  const toastEl = document.getElementById("toast");
  let toastTimer;

  function save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }

  function toast(message) {
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add("show");
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }

  function discoveredCount(s) { return PLAYERS.filter(p => s.discovered[p.id]).length; }
  function cards(s) { return Object.values(s.collection).filter(x => x && x.count > 0); }
  function uniqueOwnedPlayers(s) { return new Set(cards(s).map(x => x.playerId).filter(id => id !== "zidane")); }
  function ownedFromList(s, list) { const owned = uniqueOwnedPlayers(s); return list.filter(id => owned.has(id)).length; }
  function hasTier(s, tiers) { return cards(s).some(x => tiers.includes(x.rarity)); }
  function countRarities(s, tiers) { return cards(s).filter(x => tiers.includes(x.rarity)).reduce((n,x) => n + x.count, 0); }
  function variantCount(s, playerId) { return new Set(cards(s).filter(x => x.playerId === playerId).map(x => x.rarity)).size; }
  function maxVariantCount(s) { return Math.max(0, ...PLAYERS.map(p => variantCount(s, p.id))); }
  function totalCards(s) { return cards(s).reduce((n,x) => n + x.count, 0); }
  function level() { return 1 + Math.floor(state.xp / 500); }
  function chapterComplete(index) {
    return CHAPTERS[index].objectives.every(o => o.value(state) >= o.target);
  }
  function activeChapterIndex() { return Math.min(state.chaptersClaimed.length, CHAPTERS.length - 1); }
  function rewardText(reward) {
    const bits = [];
    if (reward.coins) bits.push(`${reward.coins} coins`);
    if (reward.packs) bits.push(`${reward.packs} pack${reward.packs > 1 ? "s" : ""}`);
    if (reward.trophy) bits.push("Trophy Card");
    return bits.join(" + ");
  }
  function applyReward(reward) {
    state.coins += reward.coins || 0;
    state.packs += reward.packs || 0;
    state.xp += reward.xp || 150;
    if (reward.trophy && !state.trophies.includes(reward.trophy)) state.trophies.push(reward.trophy);
  }

  function objectiveMarkup(o) {
    const value = Math.min(o.value(state), o.target);
    const done = value >= o.target;
    return `<div class="objective ${done ? "done" : ""}">
      <span class="check">✓</span>
      <span><strong>${o.label}</strong><small>${done ? "Objective complete" : "Keep playing to progress"}</small></span>
      <b>${value}/${o.target}</b>
    </div>`;
  }

  function renderJourney() {
    const index = activeChapterIndex();
    const chapter = CHAPTERS[index];
    const claimed = state.chaptersClaimed.includes(index);
    const objectivesDone = chapter.objectives.filter(o => o.value(state) >= o.target).length;
    const allDone = state.chaptersClaimed.length === CHAPTERS.length;
    const pct = allDone ? 100 : Math.round((objectivesDone / chapter.objectives.length) * 100);
    const nextAction = state.stats.packsOpened === 0 && state.packs > 0
      ? `<button class="btn" data-view="packs">Open starter pack →</button>`
      : `<button class="btn" data-view="draft">Play Draft →</button>`;

    app.innerHTML = `<section class="page">
      <div class="hero">
        <div class="chapter-kicker"><span class="chapter-pill">${allDone ? "JOURNEY COMPLETE" : `CHAPTER ${index + 1} OF 5`}</span><span class="level-pill">LEVEL ${level()} · ${state.xp % 500}/500 XP</span></div>
        <span class="eyebrow">APEX DEBUT EDITION 26/27</span>
        <h1>${allDone ? "Journey One complete." : chapter.title}</h1>
        <p>${allDone ? "You built the binder, chased colour and proved your Draft instincts. The next Journey can begin from here." : chapter.copy}</p>
        <div class="progress-line" aria-label="Chapter progress"><span style="width:${pct}%"></span></div>
        <div class="hero-actions">
          ${allDone ? `<button class="btn" data-view="binder">View collection →</button>` : chapterComplete(index) && !claimed ? `<button class="btn" data-action="claim-chapter" data-index="${index}">Claim ${rewardText(chapter.reward)} →</button>` : nextAction}
        </div>
      </div>

      <div class="section-head"><div><span class="eyebrow">ACTIVE TARGETS</span><h2>${allDone ? "Journey record" : chapter.title}</h2></div><p>${allDone ? "5/5 claimed" : `${objectivesDone}/3 complete`}</p></div>
      <div class="objective-list">${chapter.objectives.map(objectiveMarkup).join("")}</div>

      <div class="section-head"><div><span class="eyebrow">THE ROAD</span><h2>Journey chapters</h2></div></div>
      <div class="chapter-rail">${CHAPTERS.map((c,i) => {
        const locked = i > state.chaptersClaimed.length;
        const done = state.chaptersClaimed.includes(i);
        return `<div class="chapter-node ${i === index && !allDone ? "active" : ""} ${locked ? "locked" : ""}"><span class="chapter-number">${done ? "✓ COMPLETE" : locked ? "LOCKED" : `0${i+1}`}</span><h3>${c.title}</h3><p>${c.line}</p></div>`;
      }).join("")}</div>

      <div class="section-head"><div><span class="eyebrow">PLAY</span><h2>Choose your next move</h2></div></div>
      <div class="play-grid">
        <button class="play-card accent" data-view="draft"><span class="play-meta">6 PICKS · 1 REROLL EACH</span><h3>APEX Draft</h3><p>Build a balanced six-player squad. Higher chemistry means more stars and better rewards.</p></button>
        <button class="play-card" data-view="packs"><span class="play-meta">${state.packs} PACK${state.packs === 1 ? "" : "S"} READY</span><h3>Pack Room</h3><p>Reveal three cards from Debut Edition, including colour, inserts and the 1/1 chase.</p></button>
      </div>
    </section>`;
  }

  function draftCost() { return state.stats.drafts === 0 ? 0 : 150; }
  function weightedPlayer(pool) {
    const total = pool.reduce((n,p) => n + p.weight, 0);
    let roll = Math.random() * total;
    for (const player of pool) { roll -= player.weight; if (roll <= 0) return player; }
    return pool[pool.length - 1];
  }
  function shuffled(array) { return [...array].sort(() => Math.random() - .5); }
  function draftOptions(excluded = []) {
    const pool = PLAYERS.filter(p => !excluded.includes(p.id));
    const options = shuffled(pool).slice(0,3).map(p => ({ id: p.id, wasNew: !state.discovered[p.id] }));
    options.forEach(o => { state.discovered[o.id] = true; });
    return options;
  }
  function startDraft() {
    const cost = draftCost();
    if (state.coins < cost) return toast("You need 150 coins. Complete goals or open reward packs.");
    state.coins -= cost;
    state.lastDraft = null;
    state.draft = { picks: [], options: draftOptions(), rerolled: false };
    save(); render();
  }
  function rerollDraft() {
    if (!state.draft || state.draft.rerolled) return;
    const avoid = [...state.draft.picks, ...state.draft.options.map(x => x.id)];
    state.draft.options = draftOptions(avoid);
    state.draft.rerolled = true;
    save(); render();
    toast("Three new options discovered.");
  }
  function pickDraft(id) {
    const draft = state.draft;
    if (!draft || draft.picks.includes(id) || !draft.options.some(o => o.id === id)) return;
    draft.picks.push(id);
    if (draft.picks.length === 6) return finishDraft();
    draft.options = draftOptions(draft.picks);
    draft.rerolled = false;
    save(); render();
  }
  function finishDraft() {
    const picks = state.draft.picks.map(id => PLAYER[id]);
    const average = picks.reduce((n,p) => n + p.rating, 0) / picks.length;
    const clubs = new Set(picks.map(p => p.club)).size;
    const rookies = picks.filter(p => p.rookie).length;
    const icons = picks.filter(p => p.role === "ICON").length;
    const score = Math.min(99, Math.round(average + (clubs >= 5 ? 3 : clubs >= 4 ? 2 : 0) + (rookies >= 2 ? 2 : rookies ? 1 : 0) + (icons >= 2 ? 2 : 0)));
    const stars = score >= 94 ? 5 : score >= 90 ? 4 : score >= 86 ? 3 : score >= 82 ? 2 : 1;
    const rewards = [null, {coins:120}, {coins:180,packs:1}, {coins:260,packs:2}, {coins:420,packs:2}, {coins:650,packs:4}][stars];
    applyReward({ ...rewards, xp: stars * 80 });
    state.stats.drafts += 1;
    state.stats.bestStars = Math.max(state.stats.bestStars, stars);
    state.lastDraft = { picks: state.draft.picks, score, stars, rewards, fresh: true };
    state.draft = null;
    save(); render();
  }

  function renderDraft() {
    const cost = draftCost();
    let body;
    if (state.lastDraft && state.lastDraft.fresh) {
      const result = state.lastDraft;
      body = `<div class="draft-empty"><div><span class="eyebrow">DRAFT COMPLETE</span><h2>Squad rating ${result.score}</h2><div class="result-stars">${"★".repeat(result.stars)}${"☆".repeat(5-result.stars)}</div><p>You earned ${rewardText(result.rewards)}. New Draft encounters stay discovered in your binder, even when you did not select them.</p><button class="btn" data-action="dismiss-draft">Continue →</button></div></div>`;
    } else if (!state.draft) {
      body = `<div class="draft-empty"><div><div class="draft-symbol">A</div><span class="eyebrow">REPEATABLE MODE</span><h2>Build your front six.</h2><p>Choose one of three players across six rounds. Every option reveals that player in your binder. You get one reroll every round.</p><button class="btn" data-action="start-draft">${cost === 0 ? "Play first Draft — free" : `Enter Draft — ${cost} coins`}</button></div></div>`;
    } else {
      const d = state.draft;
      body = `<div class="draft-stage">
        <div class="draft-toolbar"><div><span class="eyebrow">PICK ${d.picks.length + 1} OF 6</span><h2>Choose one player</h2></div><button class="btn btn-secondary btn-small" data-action="reroll" ${d.rerolled ? "disabled" : ""}>↻ ${d.rerolled ? "Used" : "Reroll"}</button></div>
        <div class="round-dots">${Array.from({length:6},(_,i)=>`<span class="${i < d.picks.length ? "filled" : ""}"></span>`).join("")}</div>
        <div class="squad-row">${Array.from({length:6},(_,i) => d.picks[i] ? `<div class="squad-slot filled">${PLAYER[d.picks[i]].short}</div>` : `<div class="squad-slot">PICK ${i+1}</div>`).join("")}</div>
        <div class="choice-grid">${d.options.map(o => { const p = PLAYER[o.id]; return `<button class="draft-choice" data-action="draft-pick" data-id="${p.id}">${o.wasNew ? `<span class="new-tag">NEW</span>` : ""}<div class="choice-art"><span class="choice-rating">${p.rating}</span><span class="choice-role">${p.role}</span></div><div class="choice-copy"><strong>${p.name}</strong><small>${p.club}</small></div></button>`; }).join("")}</div>
      </div>`;
    }
    app.innerHTML = `<section class="page"><div class="page-intro"><span class="eyebrow">APEX DRAFT</span><h1>Six picks. One squad.</h1><p>Club variety, rookies and icon pairings add chemistry to your player ratings.</p></div><div class="stat-strip"><div class="stat"><span>Drafts</span><b>${state.stats.drafts}</b></div><div class="stat"><span>Best</span><b>${state.stats.bestStars}★</b></div><div class="stat"><span>Entry</span><b>${cost === 0 ? "FREE" : cost}</b></div></div>${body}</section>`;
  }

  function randomRarity(weighted) {
    let roll = Math.random();
    for (const [rarity, chance] of weighted) { if (roll < chance) return rarity; roll -= chance; }
    return "base";
  }
  function playerPoolFor(rarity) {
    if (rarity === "elevation") return ["kane","dembele","ronaldo","haaland"].map(id => PLAYER[id]);
    if (rarity === "afterimage") return ["messi","bellingham","palmer"].map(id => PLAYER[id]);
    if (rarity === "breakthrough") return ROOKIES.map(id => PLAYER[id]);
    if (rarity === "the-apex") return [ZIDANE];
    if (rarity === "only-one") {
      const available = PLAYERS.filter(p => !state.onlyOnes[p.id]);
      return available.length ? available : PLAYERS;
    }
    return PLAYERS;
  }
  function drawCard(rarity) {
    let actual = rarity;
    const pool = playerPoolFor(actual);
    const player = weightedPlayer(pool);
    if (actual === "only-one" && state.onlyOnes[player.id]) actual = "red";
    if (actual === "only-one") state.onlyOnes[player.id] = true;
    return { playerId: player.id, rarity: actual, name: player.name, club: player.club, rating: player.rating };
  }
  function generatePack() {
    const godPack = Math.random() < .004;
    let rarityList;
    if (godPack) {
      rarityList = ["apex", randomRarity([["red",.55],["elevation",.28],["afterimage",.1],["breakthrough",.06],["only-one",.009],["the-apex",.001]]), randomRarity([["red",.42],["elevation",.34],["afterimage",.14],["breakthrough",.085],["only-one",.014],["the-apex",.001]])];
      state.stats.godPacks += 1;
    } else {
      rarityList = [
        "base",
        randomRarity([["base",.62],["green",.25],["blue",.08],["apex",.05]]),
        randomRarity([["the-apex",.0002],["only-one",.001],["breakthrough",.00275],["afterimage",.00505],["elevation",.01316],["red",.02381],["apex",.05263]])
      ];
    }
    const result = [];
    rarityList.forEach(r => {
      let card = drawCard(r);
      let tries = 0;
      while (result.some(x => x.playerId === card.playerId && x.rarity === card.rarity) && tries < 8) { card = drawCard(r); tries++; }
      result.push(card);
    });
    return { cards: result, godPack };
  }
  function addCard(card) {
    const key = `${card.playerId}:${card.rarity}`;
    state.discovered[card.playerId] = true;
    if (!state.collection[key]) state.collection[key] = { ...card, count: 0 };
    state.collection[key].count += 1;
  }
  function openPack() {
    if (state.packs < 1 || state.packSession) return;
    state.packs -= 1;
    const pack = generatePack();
    pack.cards.forEach(addCard);
    state.stats.packsOpened += 1;
    state.packSession = { ...pack, reveal: 0 };
    save(); render();
    if (pack.godPack) toast("GOD PACK — every card is a hit!");
  }
  function buyPack() {
    if (state.coins < 250) return toast("You need 250 coins.");
    state.coins -= 250;
    state.packs += 1;
    save(); render();
    toast("One Debut Edition pack added.");
  }
  function cardMarkup(card) {
    const p = PLAYER[card.playerId];
    const meta = RARITY[card.rarity];
    return `<article class="pack-card r-${card.rarity}"><div class="card-top"><span class="card-rating">${card.rating}</span><span class="card-series">${meta.label}</span></div><div class="card-graphic"><div class="apex-glyph"><span>${p.short.charAt(0)}</span></div></div><div class="card-name"><strong>${card.name}</strong><small>${card.club} · ${p.role}</small></div></article>`;
  }
  function renderPacks() {
    let body;
    if (state.packSession) {
      const session = state.packSession;
      if (session.reveal === 0) {
        body = `<div class="pack-room reveal-stage"><div class="pack-card r-base"><div class="card-top"><span class="card-series">DEBUT 26/27</span></div><div class="card-graphic"><div class="apex-glyph"><span>A</span></div></div><div class="card-name"><strong>Card one awaits</strong><small>Tap below to reveal</small></div></div><div class="reveal-actions"><button class="btn" data-action="reveal-card">Reveal card 1 →</button></div></div>`;
      } else {
        const card = session.cards[session.reveal - 1];
        const last = session.reveal === session.cards.length;
        body = `<div class="pack-room reveal-stage"><div class="reveal-count">CARD ${session.reveal} OF ${session.cards.length}${session.godPack ? " · GOD PACK" : ""}</div>${cardMarkup(card)}<div class="reveal-actions"><button class="btn" data-action="${last ? "finish-pack" : "reveal-card"}">${last ? "Finish pack" : `Reveal card ${session.reveal + 1}`} →</button></div></div>`;
      }
    } else {
      body = `<div class="pack-room"><span class="eyebrow">3 CARDS PER PACK</span><div class="sealed-pack"><div class="pack-inner"><small>DEBUT EDITION</small><span class="pack-logo">A</span><strong>APEX 26/27</strong></div></div><h2>${state.packs > 0 ? `${state.packs} pack${state.packs === 1 ? "" : "s"} ready` : "The pack room is empty"}</h2><p>Every pack has a Base card and two chances at colour or a special insert.</p>${state.packs > 0 ? `<button class="btn" data-action="open-pack">Open a pack →</button>` : `<button class="btn" data-action="buy-pack" ${state.coins < 250 ? "disabled" : ""}>Buy pack · 250 coins</button>`}</div>`;
    }
    app.innerHTML = `<section class="page"><div class="page-intro"><span class="eyebrow">PACK ROOM</span><h1>Chase the impossible.</h1><p>Green, Blue, APEX, Red, Only One—and Zinedine Zidane as The APEX.</p></div><div class="stat-strip"><div class="stat"><span>Ready</span><b>${state.packs}</b></div><div class="stat"><span>Opened</span><b>${state.stats.packsOpened}</b></div><div class="stat"><span>Owned</span><b>${totalCards(state)}</b></div></div>${body}</section>`;
  }

  function playerCopies(id) { return cards(state).filter(x => x.playerId === id).reduce((n,x) => n + x.count, 0); }
  function binderCard(p) {
    const seen = !!state.discovered[p.id];
    if (!seen) return `<div class="binder-card missing"><div><b>?</b><div class="binder-no">UNDISCOVERED</div></div></div>`;
    const copies = playerCopies(p.id);
    const variants = [...PARALLELS, ...INSERTS].filter(r => {
      if (r === "elevation") return ["kane","dembele","ronaldo","haaland"].includes(p.id);
      if (r === "afterimage") return ["messi","bellingham","palmer"].includes(p.id);
      if (r === "breakthrough") return ROOKIES.includes(p.id);
      if (r === "the-apex") return false;
      return true;
    });
    return `<div class="binder-card">${copies ? `<span class="copy-count">×${copies}</span>` : ""}<span class="binder-no">${String(PLAYERS.indexOf(p)+1).padStart(2,"0")} · ${p.role}</span><div class="binder-initial">${p.short.charAt(0)}</div><h3>${p.name}</h3><p>${p.club}</p><div class="variant-row">${variants.map(r => `<span class="variant ${state.collection[`${p.id}:${r}`] ? "owned" : ""}" title="${RARITY[r].label}">${RARITY[r].code}</span>`).join("")}</div></div>`;
  }
  function renderBinder() {
    let list = PLAYERS;
    if (state.binderFilter === "owned") list = PLAYERS.filter(p => playerCopies(p.id) > 0);
    if (state.binderFilter === "missing") list = PLAYERS.filter(p => !state.discovered[p.id]);
    const zidane = state.collection["zidane:the-apex"];
    app.innerHTML = `<section class="page"><div class="page-intro"><span class="eyebrow">DEBUT EDITION 26/27</span><h1>Your binder.</h1><p>Draft encounters reveal identities. Pack pulls light up the owned variant markers.</p></div><div class="stat-strip"><div class="stat"><span>Discovered</span><b>${discoveredCount(state)}/12</b></div><div class="stat"><span>Owned</span><b>${totalCards(state)}</b></div><div class="stat"><span>Best hit</span><b>${zidane ? "APEX" : hasTier(state,["only-one"]) ? "1/1" : hasTier(state,["red"]) ? "RED" : "—"}</b></div></div><div class="binder-controls">${["all","owned","missing"].map(f => `<button class="filter-btn ${state.binderFilter === f ? "active" : ""}" data-action="binder-filter" data-filter="${f}">${f[0].toUpperCase()+f.slice(1)}</button>`).join("")}</div>${list.length ? `<div class="binder-grid">${list.map(binderCard).join("")}${zidane && state.binderFilter !== "missing" ? cardMarkup(zidane) : ""}</div>` : `<div class="empty-note">No cards match this view yet.</div>`}</section>`;
  }

  function renderGoals() {
    const index = activeChapterIndex();
    const chapter = CHAPTERS[index];
    app.innerHTML = `<section class="page"><div class="page-intro"><span class="eyebrow">GOALS</span><h1>Every card has a purpose.</h1><p>Complete the current Journey targets and themed Collection Paths to earn packs, coins and Trophy Cards.</p></div>
      <div class="section-head"><div><span class="eyebrow">JOURNEY</span><h2>${state.chaptersClaimed.length === 5 ? "Journey One complete" : `Chapter ${index + 1} · ${chapter.title}`}</h2></div></div>
      <div class="objective-list">${chapter.objectives.map(objectiveMarkup).join("")}</div>
      ${state.chaptersClaimed.length < 5 && chapterComplete(index) ? `<div style="margin-top:10px"><button class="btn btn-full" data-action="claim-chapter" data-index="${index}">Claim chapter reward · ${rewardText(chapter.reward)}</button></div>` : ""}
      <div class="section-head"><div><span class="eyebrow">COLLECTION PATHS</span><h2>Build with intent</h2></div><p>${state.pathsClaimed.length}/${PATHS.length} claimed</p></div>
      <div class="path-list">${PATHS.map(path => {
        const value = Math.min(path.value(state),path.target); const complete = value >= path.target; const claimed = state.pathsClaimed.includes(path.id);
        return `<article class="path-card"><div class="path-top"><div><span class="eyebrow">${claimed ? "CLAIMED" : complete ? "READY" : "PATH"}</span><h3>${path.title}</h3></div><span class="reward-tag">${rewardText(path.reward)}</span></div><p>${path.copy}</p><div class="path-footer"><small>${value}/${path.target} complete</small><button class="btn btn-small ${claimed ? "btn-secondary" : ""}" data-action="claim-path" data-id="${path.id}" ${!complete || claimed ? "disabled" : ""}>${claimed ? "Claimed" : "Claim"}</button></div></article>`;
      }).join("")}</div>
      <div class="section-head"><div><span class="eyebrow">TROPHY CARDS</span><h2>Your milestones</h2></div><p>${state.trophies.length}/${TROPHIES.length}</p></div>
      <div class="trophy-grid">${TROPHIES.map(([name,copy]) => `<article class="trophy ${state.trophies.includes(name) ? "" : "locked"}"><span class="trophy-icon">◆</span><h3>${name}</h3><p>${state.trophies.includes(name) ? copy : "Keep progressing to reveal."}</p></article>`).join("")}</div>
    </section>`;
  }

  function claimChapter(index) {
    if (index !== state.chaptersClaimed.length || !chapterComplete(index)) return;
    const chapter = CHAPTERS[index];
    applyReward(chapter.reward);
    state.chaptersClaimed.push(index);
    save(); render(); toast(`${chapter.title} complete — reward claimed.`);
  }
  function claimPath(id) {
    const path = PATHS.find(p => p.id === id);
    if (!path || state.pathsClaimed.includes(id) || path.value(state) < path.target) return;
    applyReward(path.reward);
    state.pathsClaimed.push(id);
    save(); render(); toast(`${path.title} reward claimed.`);
  }

  function updateChrome() {
    document.getElementById("coin-count").textContent = state.coins.toLocaleString();
    document.getElementById("pack-count").textContent = state.packs;
    document.querySelectorAll(".bottom-nav button").forEach(b => b.classList.toggle("active", b.dataset.view === state.view));
  }
  function render() {
    updateChrome();
    if (state.view === "draft") renderDraft();
    else if (state.view === "packs") renderPacks();
    else if (state.view === "binder") renderBinder();
    else if (state.view === "goals") renderGoals();
    else renderJourney();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.view) {
      state.view = button.dataset.view;
      save(); render();
      return;
    }
    const action = button.dataset.action;
    if (action === "claim-chapter") claimChapter(Number(button.dataset.index));
    if (action === "start-draft") startDraft();
    if (action === "reroll") rerollDraft();
    if (action === "draft-pick") pickDraft(button.dataset.id);
    if (action === "dismiss-draft") { state.lastDraft.fresh = false; save(); render(); }
    if (action === "open-pack") openPack();
    if (action === "buy-pack") buyPack();
    if (action === "reveal-card") { state.packSession.reveal += 1; save(); render(); }
    if (action === "finish-pack") { state.packSession = null; save(); render(); toast("Three cards added to your binder."); }
    if (action === "claim-path") claimPath(button.dataset.id);
    if (action === "binder-filter") { state.binderFilter = button.dataset.filter; save(); render(); }
  });

  const dialog = document.getElementById("settings-dialog");
  document.getElementById("settings-btn").addEventListener("click", () => dialog.showModal());
  document.getElementById("close-settings").addEventListener("click", () => dialog.close());
  document.getElementById("reset-progress").addEventListener("click", () => {
    if (!confirm("Start a brand-new APEX save? Your current collection will be cleared from this device.")) return;
    state = defaultState();
    save(); dialog.close(); render(); toast("New Journey started.");
  });

  render();
})();
