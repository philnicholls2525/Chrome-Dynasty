(function(){
  if (typeof CARD_ART === 'undefined') return;
  Object.keys(CARD_ART).forEach(function(k){ delete CARD_ART[k]; });
  CARD_ART['base:haaland']={src:'assets/cards/debut-edition/base/haaland.webp?v=0357',orientation:'portrait'};
  CARD_ART['base:estevao']={src:'assets/cards/debut-edition/base/estevao.webp?v=0357',orientation:'portrait'};
})();
