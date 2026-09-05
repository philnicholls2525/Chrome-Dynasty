(function(){
  try {
    var chunks = window.__apexChunks || [];
    if (!chunks.length) throw new Error('APEX production chunks not loaded');
    var source = chunks.join('');
    (0, eval)(source);
  } catch (err) {
    console.error('APEX bootstrap failed', err);
    var app = document.getElementById('app');
    if (app) app.innerHTML = '<section class="page generic-page"><div class="panel" style="padding:22px;margin:20px"><h2>APEX failed to start</h2><p style="color:#c5cada;line-height:1.5">The production JavaScript did not load correctly. Refresh once; if this remains, the deployment still needs repair.</p></div></section>';
  }
})();
