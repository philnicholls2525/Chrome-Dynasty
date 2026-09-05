(function(){
  try{
    const chunks=window.__apexChunks||[];
    const source=chunks.join('');
    const re=/'(base|green|blue|apex|red):(haaland|estevao)':\{src:'(data:image\/webp;base64,[^']+)'/g;
    let m,count=0;
    while((m=re.exec(source))){
      const key=m[1]+':'+m[2];
      if(window.CARD_ART && window.CARD_ART[key]) window.CARD_ART[key].src=m[3];
      else if(typeof CARD_ART!=='undefined' && CARD_ART[key]) CARD_ART[key].src=m[3];
      count++;
    }
    window.__apexArtRecovered=count;
    window.__apexChunks=[];
  }catch(e){console.error('APEX art recovery failed',e);window.__apexArtRecovered=0;}
})();
