// [0.47] Bonos de píxel: sustituyen a los banners de efecto activado / agotado y al contador de fallos del Perdedor.
// Bajan desde arriba, perforan el cuadro que toca, se quedan un instante y se van. No se quedan en pantalla.
(function () {
  const G={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'110101101101101',O:'010101101101010',P:'110101110100100',Q:'010101101111011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111','0':'111101101101111','1':'010110010010111','2':'110001010100111','3':'110001010001110','4':'101101111001001','5':'111100110001110','6':'011100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001110','/':'001001010100100'};
  const CFG = {
    perdedor: { n: 'PERDEDOR', who: 'd', tot: 5 },
    pulsera:  { n: 'PULSERA VIP', who: 'd', tot: 5, on: 'ACTIVADA', end: 'AGOTADA' },
    atajo:    { n: 'ATAJO', who: 't', tot: 10, on: 'ACTIVADO', end: 'AGOTADO' },
    pesados:  { n: 'COFRES PESADOS', who: 't', tot: 5, on: 'ACTIVADO', end: 'SE ACABO' },
    oxidados: { n: 'CERROJOS OXIDADOS', who: 't', tot: 3, on: 'ACTIVADO', end: 'SE ACABO' },
    racha:    { n: 'MALA RACHA', who: 't', tot: 10, on: 'ACTIVADA', end: 'SE ACABO' }
  };
  // [0.51] texto explicativo que acompaña al ticket cuando se concede la carta o el efecto ({n} = nº de cofres/intentos)
  const DESC = {
    perdedor: 'Tras 5 fallos (seguidos o no), el botín del siguiente cofre será Legendario x2.',
    pulsera: 'Los próximos {n} intentos son de cofres épicos o legendarios y no gastan herramientas.',
    atajo: 'Si fallas un cofre durante los próximos {n}, es el fin.',
    pesados: 'Los próximos {n} cofres Raros o superiores piden +1 herramienta.',
    oxidados: 'Los próximos {n} cofres piden entre 1 y 3 herramientas al azar.',
    racha: 'Tu racha no sube durante {n} cofres más. Si fallas, la pierdes.'
  };
  const LAST = {};   // último total concedido de cada efecto (para enseñar cuántos quedan al pulsar su icono)
  const COL = { d: { m: '#7b3fe0', m2: '#4a1fa0', st: '#1e0f40' }, t: { m: '#d63a55', m2: '#7a1730', st: '#0b1d3f' } };
  const PAPER = '#efe3c4', PAPER2 = '#d9c9a3', INK = '#2a1a47';
  const IMG = {};
  let pop = null, cv = null, tx = null, ctx = null, queue = [], busy = false, timers = [];

  function build() {
    if (pop) return true;
    pop = document.createElement('div');
    pop.id = 'bonoPop';
    pop.style.cssText = 'position:fixed;left:50%;top:calc(10px + env(safe-area-inset-top,0px));width:min(360px,92vw);z-index:10200;pointer-events:none;transform:translate(-50%,-160%);transition:transform .35s steps(5);image-rendering:pixelated';
    cv = document.createElement('canvas');
    cv.width = 144; cv.height = 48;
    cv.style.cssText = 'display:block;width:100%;height:auto;image-rendering:pixelated;image-rendering:crisp-edges';
    pop.appendChild(cv);
    tx = document.createElement('div');
    tx.style.cssText = 'margin:6px auto 0;max-width:94%;padding:6px 10px;border-radius:8px;background:rgba(15,10,30,.94);border:1px solid #f5b932;color:#fde68a;font:600 13px/1.3 ui-monospace,Menlo,Consolas,monospace;text-align:center;display:none';
    pop.appendChild(tx);
    document.body.appendChild(pop);
    ctx = cv.getContext('2d');
    try {
      [['d', ASSETS.duende.base], ['t', ASSETS.trapero.base]].forEach(([k, src]) => { const i = new Image(); i.src = src; IMG[k] = i; });
    } catch (e) {}
    return true;
  }
  const px = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  function txt(x, y, s, c) { let cx = x; for (const ch of s) { const g = G[ch]; if (g) for (let i = 0; i < 15; i++) if (g[i] === '1') px(cx + (i % 3), y + ((i / 3) | 0), 1, 1, c); cx += 4; } }
  const tw = s => Math.max(0, s.length * 4 - 1);
  function ticket(c, u, mode, label) {
    const P = COL[c.who], W = 144, H = 48;
    ctx.clearRect(0, 0, W, H); ctx.imageSmoothingEnabled = false;
    px(0, 0, W, H, INK); px(1, 1, W - 2, H - 2, PAPER);
    for (let y = 2; y < H - 2; y++) for (let x = 36; x < W - 2; x++) if ((x * 3 + y * 5) % 11 === 0) px(x, y, 1, 1, PAPER2);
    px(36, 1, W - 37, 10, P.m); for (let x = 37; x < W - 2; x += 2) px(x, 10, 1, 1, P.m2);
    px(1, 1, 34, H - 2, P.st);
    const im = IMG[c.who];
    try { if (im && im.complete && im.naturalWidth) ctx.drawImage(im, 0, 0, 24, 34, 5, 7, 24, 34); } catch (e) {}
    for (let y = 3; y < H - 3; y += 3) px(35, y, 1, 2, INK);
    const cut = (x, y) => ctx.clearRect(x, y, 1, 1);
    [[0,0],[1,0],[0,1],[W-1,0],[W-2,0],[W-1,1],[0,H-1],[1,H-1],[0,H-2],[W-1,H-1],[W-2,H-1],[W-1,H-2]].forEach(a => cut(a[0], a[1]));
    for (const nx of [0, W - 1]) for (let dy = -4; dy <= 4; dy++) { const r = Math.round(Math.sqrt(17 - dy * dy)); for (let k = 0; k < r; k++) cut(nx + (nx ? -k : k), 24 + dy); }
    for (const ny of [0, H - 1]) for (let dx = -3; dx <= 3; dx++) { const r = Math.round(Math.sqrt(11 - dx * dx)); for (let k = 0; k < r; k++) cut(35 + dx, ny + (ny ? -k : k)); }
    txt(40, 3, c.n, '#fff');
    const cnt = u + '/' + c.tot; txt(W - 5 - tw(cnt), 3, cnt, '#f5b932');
    const two = c.tot > 5, cw = 13, ch = two ? 8 : 12, gap = 3, x0 = 40, y0 = two ? 14 : 16;
    for (let i = 0; i < c.tot; i++) {
      const cx = x0 + (i % 5) * (cw + gap), cy = y0 + ((i / 5) | 0) * (ch + 2), p = i < u, fr = mode === 'fresh' && i === u - 1;
      px(cx, cy, cw, ch, INK); px(cx + 1, cy + 1, cw - 2, ch - 2, fr ? '#f5b932' : (p ? '#120a1c' : PAPER));
      if (p && !fr) { const mx = cx + ((cw - 5) >> 1), my = cy + ((ch - 4) >> 1); px(mx + 1, my, 3, 4, '#000'); px(mx, my + 1, 5, 2, '#000'); px(mx + 1, my, 3, 1, '#3a2f55'); }
      if (!p && !fr) { const n = String(i + 1); txt(cx + ((cw - tw(n)) >> 1), cy + ((ch - 5) >> 1), n, P.m2); }
      if (fr) px(cx + ((cw - 3) >> 1), cy + ((ch - 3) >> 1), 3, 3, '#fff');
    }
    const by = two ? 38 : 34;
    if (label && mode !== 'stamp') txt(x0, by, label, P.m2);
    for (let x = W - 30; x < W - 5; x++) if ((x * 7 + 3) % 5 < 3) px(x, by - 1, 1, 7, INK);
    for (let x = 40; x < W - 5; x++) if (!label && (x * 5 + 2) % 7 < 3) px(x, two ? 41 : 39, 1, 5, INK);
    if (mode === 'stamp') { const t = label || ''; const w = tw(t) + 6; px(x0 + 20, two ? 20 : 21, w, 9, P.m); px(x0 + 21, two ? 21 : 22, w - 2, 7, PAPER); txt(x0 + 23, two ? 22 : 23, t, P.m); }
  }
  const at = (ms, f) => timers.push(setTimeout(f, ms));
  function play(job) {
    busy = true; build(); timers = [];
    const c = Object.assign({}, CFG[job.id]), seq = [];
    if (job.tot) c.tot = Math.min(10, job.tot);
    if (job.kind === 'on' && job.tot) LAST[job.id] = job.tot;
    // [0.51] al concederse (o al equipar el Perdedor) el ticket se ve más grande en PC y lleva un pequeño texto explicativo
    const big = job.kind === 'on' || job.kind === 'equip', wide = (() => { try { return typeof isWideLayout === 'function' && isWideLayout(); } catch (e) { return false; } })();
    pop.style.width = big && wide ? 'min(640px, 62vw)' : 'min(360px, 92vw)';
    if (big && DESC[job.id]) { tx.textContent = DESC[job.id].replace('{n}', job.tot || c.tot); tx.style.display = ''; tx.style.fontSize = wide ? '15px' : '13px'; } else tx.style.display = 'none';
    if (job.kind === 'use') { const u = job.u; seq.push([c, u - 1, 'idle', 'FALLO ' + u + ' DE ' + c.tot], [c, u, 'fresh', 'FALLO ' + u + ' DE ' + c.tot], [c, u, 'idle', 'FALLO ' + u + ' DE ' + c.tot]); }
    else if (job.kind === 'on') seq.push([c, 0, 'idle', c.on + ' ' + (job.tot || c.tot)]);
    else if (job.kind === 'equip') seq.push([c, job.u || 0, 'idle', 'FALLO ' + (job.u || 0) + ' DE ' + c.tot]);   // Perdedor equipado
    else if (job.kind === 'info') { const left = Math.max(0, job.u || 0), tot = Math.max(job.tot || c.tot, left); c.tot = Math.min(10, tot); seq.push([c, Math.min(c.tot, c.tot - Math.min(c.tot, left)), 'idle', 'QUEDAN ' + left]); }   // estado actual al pulsar su icono
    else seq.push([c, c.tot - 1, 'idle', ''], [c, c.tot, 'fresh', ''], [c, c.tot, 'stamp', c.end]);
    at(30, () => { ticket(...seq[0]); pop.style.transform = 'translate(-50%,0)'; try { audio.init(); audio.playTicketOut(); } catch (e) {} });
    let t = 420;
    for (let i = 1; i < seq.length; i++) { const s = seq[i]; at(t, () => { ticket(...s); try { if (s[2] === 'fresh') audio.playTicketPunch(); else if (s[2] === 'stamp') audio.playTicketStamp(); } catch (e) {} }); t += s[2] === 'fresh' ? 200 : 300; }
    at(t + 3800, () => { pop.style.transform = 'translate(-50%,-160%)'; try { audio.playTicketIn(); } catch (e) {} });
    at(t + 3800 + 450, () => { busy = false; next(); });
  }
  // [0.5] El bono solo sale con la habitación libre (sin diálogos, tiendas ni ventanas encima): mientras tanto espera en cola
  let waitT = null;
  function next() {
    if (busy || !queue.length) return;
    let free = true;
    try { free = typeof mainScreenFree === 'function' ? mainScreenFree() : true; } catch (e) {}
    if (queue[0] && queue[0].force) free = true;   // [0.51] al pulsar un icono el ticket sale aunque haya un aviso encima
    if (free && !(typeof STATE !== 'undefined' && (STATE.finalPhase || STATE.gameOver))) { play(queue.shift()); return; }
    if (!waitT) waitT = setTimeout(() => { waitT = null; next(); }, 350);
  }
  // kind: 'use' (u = fallos hasta ahora), 'on' (activación), 'end' (agotado). tot opcional: nº real de intentos/cofres.
  window.showBono = function (id, kind, u, tot) {
    try {
      if (!CFG[id]) return false;
      const force = kind === 'info' || kind === 'equip';
      if (kind === 'info' && !tot) tot = LAST[id] || CFG[id].tot;
      queue.push({ id, kind, u, tot, force });
      next();
      return true;
    } catch (e) { return false; }
  };
})();
