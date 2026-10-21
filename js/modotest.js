// ==========================================================================
// JUST ONE MORE CHEST — modotest.js — VERSIÓN 0.34
// Modo test
// ==========================================================================

// SHA-256 en JS puro (mismo resultado que hashlib); se usa para comprobar la clave del Modo test sin guardarla en claro
function sha256hex(str) {
  const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const bytes = []; for (let i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i) & 0xff);
  const l = bytes.length; bytes.push(0x80); while (bytes.length % 64 !== 56) bytes.push(0);
  const hi = Math.floor(l * 8 / 4294967296), lo = (l * 8) >>> 0;
  bytes.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255, (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
  let h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let o = 0; o < bytes.length; o += 64) {
    const w = new Array(64);
    for (let i = 0; i < 16; i++) w[i] = ((bytes[o + 4 * i] << 24) | (bytes[o + 4 * i + 1] << 16) | (bytes[o + 4 * i + 2] << 8) | bytes[o + 4 * i + 3]) >>> 0;
    for (let i = 16; i < 64; i++) { const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0; }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g), t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h = [(h[0] + a) >>> 0, (h[1] + b) >>> 0, (h[2] + c) >>> 0, (h[3] + d) >>> 0, (h[4] + e) >>> 0, (h[5] + f) >>> 0, (h[6] + g) >>> 0, (h[7] + hh) >>> 0];
  }
  return h.map(x => ('00000000' + x.toString(16)).slice(-8)).join('');
}
// Huella de una secuencia de flechas (U/D/L/R): sal + 2000 rondas de SHA-256
function testKeyHash(seq, salt) {
  let h = sha256hex(salt + seq);
  for (let i = 0; i < 2000; i++) h = sha256hex(h + salt);
  return h;
}


/* ==========================================================================
   [0.090] MENÚ DE OPCIONES (engranaje), ESTADÍSTICAS Y MODO TEST
   ========================================================================== */
(function () {
  const css = document.createElement('style');
  css.textContent = `
    @keyframes chalkIn { from { clip-path: inset(0 100% 0 0); opacity:.2 } to { clip-path: inset(0 0 0 0); opacity:1 } }
    @keyframes keyShake { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-9px) } 40% { transform: translateX(8px) } 60% { transform: translateX(-6px) } 80% { transform: translateX(4px) } }
    @keyframes tmBlink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
    .jm-chalk { font-family: 'VT323', monospace; color: #eef3ea; text-shadow: 0 0 3px rgba(255,255,255,.45), 1px 1px 0 rgba(0,0,0,.35); }
    .jm-chalk-row { animation: chalkIn .45s ease-out both; }
    .jm-shake { animation: keyShake .45s ease-in-out; }
    .tm-root { font-family: 'VT323', monospace; color: #e8e8e8; background: #000; letter-spacing: .02em; }
    .tm-root::after { content:''; position:absolute; inset:0; pointer-events:none; background: repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0, rgba(255,255,255,.035) 1px, transparent 1px, transparent 3px); }
    .tm-row { display:flex; align-items:center; gap:6px; padding:2px 6px 2px 20px; position:relative; min-height:42px; font-size:23px; cursor:pointer; }
    .tm-row.sel { background: rgba(255,255,255,.07); }
    .tm-row.sel::before { content:'▶'; color:#ff2a2a; position:absolute; left:3px; top:50%; transform:translateY(-50%); font-size:19px; }
    .tm-lbl { flex:1; min-width:0; }
    .tm-val { min-width:78px; text-align:center; color:#ffe14a; }
    .tm-val.off { color:#8a8a8a; }
    .tm-arr { width:44px; height:38px; border:1px solid #666; background:#111; color:#fff; font-size:20px; line-height:1; display:flex; align-items:center; justify-content:center; user-select:none; touch-action:manipulation; }
    .tm-arr:active { background:#333; }
    .tm-btn { flex:1; height:46px; border:2px solid #aaa; background:#0a0a0a; color:#fff; font-family:'VT323',monospace; font-size:23px; letter-spacing:.06em; }
    .tm-btn:active { background:#2a2a2a; }
    .tm-btn.go { border-color:#39e75f; color:#39e75f; }
    .tm-btn.warn { border-color:#ff5a5a; color:#ff5a5a; }
  `;
  document.head.appendChild(css);

  // ---- utilidades ----
  const host = () => uiHost();
  function overlay(id, z) {
    const old = document.getElementById(id); if (old) old.remove();
    const el = document.createElement('div');
    el.id = id;
    el.className = 'fixed inset-0 flex items-center justify-center p-5 font-sans';
    el.style.cssText = 'position:fixed;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;padding:20px;z-index:' + (z || 10020);
    host().appendChild(el);
    return el;
  }
  function close(id) { const e = document.getElementById(id); if (e) e.remove(); }
  AudioEngine.prototype.playChalk = function () {
    if (!this.ctx || this.muted) return;
    const prev = this._bus; this._bus = this.busSmall || null;
    try { [0, 0.09, 0.2].forEach((d, i) => { this._noise(0.07 + i * 0.01, 0.05, d, 3000 + i * 600); this._tone(2300 + i * 300, 1800, 0.04, 'triangle', 0.015, d); }); } finally { this._bus = prev; }
  };
  AudioEngine.prototype.playTestDenied = function () {
    if (!this.ctx || this.muted) return;
    const prev = this._bus; this._bus = this.busSmall || null;
    try { this._tone(140, 90, 0.2, 'square', 0.12); this._tone(120, 80, 0.25, 'square', 0.1, 0.12); } finally { this._bus = prev; }
  };

  // ---- confirmación genérica ----
  function confirmBox(title, text, yesLabel, onYes) {
    const o = overlay('confirmModal', 10040);
    o.className += ' bg-slate-950/90 backdrop-blur-md';
    o.innerHTML = `
      <div class="bg-slate-900 border-2 border-rose-700/70 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center gap-3">
        <div class="w-14 h-14 rounded-full bg-rose-950/80 border border-rose-500 flex items-center justify-center text-2xl text-rose-400"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <h3 class="text-xl font-black text-rose-300 font-retro">${title}</h3>
        <p class="text-xs text-slate-300">${text}</p>
        <button id="cfmYes" class="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-600 active:from-rose-500 text-white font-black text-sm rounded-xl shadow-lg cursor-pointer">${yesLabel}</button>
        <button id="cfmNo" class="w-full py-2.5 bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">Cancelar</button>
      </div>`;
    o.querySelector('#cfmYes').addEventListener('click', () => { close('confirmModal'); onYes(); });
    o.querySelector('#cfmNo').addEventListener('click', () => close('confirmModal'));
  }

  // ---- menú de opciones ----
  window.openOptionsMenu = function () {
    audio.init();
    const o = overlay('optionsModal', 10020);
    o.className += ' bg-slate-950/90 backdrop-blur-md';
    const b = (id, icon, label, cls) => `<button id="${id}" class="w-full py-3 ${cls || 'bg-slate-800 active:bg-slate-700 text-slate-200'} font-extrabold text-xs rounded-xl border border-slate-600/60 flex items-center justify-center gap-2 cursor-pointer"><i class="fa-solid ${icon}"></i> ${label}</button>`;
    o.innerHTML = `
      <div class="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 w-full max-w-xs shadow-2xl flex flex-col gap-2.5">
        <h3 class="text-center text-2xl font-black text-amber-300 font-retro tracking-wide mb-1"><i class="fa-solid fa-gear"></i> OPCIONES</h3>
        ${b('optStats', 'fa-chart-simple', 'ESTADÍSTICAS', 'bg-gradient-to-r from-emerald-800 to-emerald-700 text-white')}
        ${b('optList', 'fa-trophy', 'LOGROS', 'bg-gradient-to-r from-amber-800 to-amber-700 text-white')}
        ${(typeof tomeUnlocked === 'function' && tomeUnlocked()) ? b('optTome', 'fa-book', 'CUADERNO', 'bg-gradient-to-r from-stone-700 to-amber-900 text-amber-100') : ''}
        ${b('optAch', 'fa-trophy', 'RESETEAR LOGROS')}
        ${b('optWipe', 'fa-trash', 'BORRAR TODOS LOS DATOS', 'bg-rose-950/80 active:bg-rose-900 text-rose-200')}
        ${b('optNew', 'fa-rotate-left', 'EMPEZAR DE NUEVO', 'bg-rose-950/80 active:bg-rose-900 text-rose-200')}
        ${b('optTest', 'fa-flask', 'MODO TEST', 'bg-slate-950 text-slate-400')}
        <button id="optClose" class="mt-1 w-full py-2.5 bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">Cerrar</button>
        <div id="optVersion" class="text-center text-[10px] font-mono text-slate-500 tracking-widest">v${DATOS_JUEGO.VERSION}</div>
      </div>`;
    const q = id => o.querySelector('#' + id);
    // [0.202] CUADERNO (solo si ya se ha encontrado): de momento solo muestra un mensaje de prueba
    if (q('optTome')) q('optTome').addEventListener('click', () => {
      close('optionsModal');
      const T = DATOS_JUEGO.NARRATIVA.TOMO, t = overlay('tomeModal', 10030);
      t.className += ' bg-slate-950/90 backdrop-blur-md';
      t.innerHTML = `
        <div class="bg-stone-900 border-2 border-amber-700/70 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center gap-3">
          <div class="w-14 h-14 rounded-full bg-amber-950/80 border border-amber-600 flex items-center justify-center text-2xl text-amber-400"><i class="fa-solid fa-book"></i></div>
          <h3 class="text-xl font-black text-amber-300 font-retro">${T.MOCK_TITULO}</h3>
          <p class="text-sm font-mono italic text-amber-100/90 leading-relaxed">${T.MOCK_TEXTO}</p>
          <button id="tomeClose" class="w-full py-2.5 bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">Cerrar</button>
        </div>`;
      t.querySelector('#tomeClose').addEventListener('click', () => close('tomeModal'));
    });
    q('optClose').addEventListener('click', () => close('optionsModal'));
    q('optStats').addEventListener('click', () => { close('optionsModal'); openStatsBoard(); });
    q('optList').addEventListener('click', () => { close('optionsModal'); openAchievementsList(); });
    q('optNew').addEventListener('click', () => { close('optionsModal'); showResetConfirm(); });
    q('optAch').addEventListener('click', () => { close('optionsModal'); confirmBox('¿RESETEAR LOGROS?', 'Se borrarán los logros desbloqueados en este navegador. La partida no se toca.', 'SÍ, BORRAR LOGROS', () => { clearAchievements(); showPersistentFeedback('🏆 Logros reseteados.'); }); });
    q('optWipe').addEventListener('click', () => { close('optionsModal'); confirmBox('¿BORRAR TODOS LOS DATOS?', 'Se borrará TODO lo guardado en este navegador: la partida, los logros, las estadísticas acumuladas y el cuaderno con sus desbloqueos. No se puede deshacer.', 'SÍ, BORRAR TODO', () => wipeAllGameData()); });   // [0.209] sustituye a RESETEAR CONTADORES
    q('optTest').addEventListener('click', () => { close('optionsModal'); openTestKeyGate(); });
  };
  (function () {
    const btn = document.getElementById('optionsBtn');
    if (btn) btn.addEventListener('click', () => window.openOptionsMenu());
  })();

  // ---- estadísticas: pizarra con tiza ----
  // [0.103] El contenido se construye aparte para usarlo igual en la ventana (móvil) y en la pizarra de la marquesina derecha (PC)
  function statsRowsHtml(animate) {
    const C = STATE.stats || blankStats(), L = lifeStats;
    const pz = (S, t) => { const q = S.puz[t], tot = q.ok + q.fail; return tot ? `<span>${q.ok}/${tot}</span> <span style="font-size:15px;opacity:.85">${Math.round(q.ok * 100 / tot)}%</span>` : '—'; };
    const rows = [
      ['COFRES ABIERTOS', C.chests, L.chests],
      ['NIVEL MÁXIMO', C.maxLevel, L.maxLevel]
    ];
    if (Math.max(C.maxLoop, L.maxLoop, STATE.currentLoop || 1) >= 2) rows.push(['BUCLE MÁXIMO', C.maxLoop, L.maxLoop]);   // el bucle solo se nombra a partir del segundo
    rows.push(['ORO GANADO', C.goldEarned, L.goldEarned], ['ORO GASTADO', C.goldSpent, L.goldSpent], ['GANZÚAS ROTAS', C.picksBroken, L.picksBroken], ['MEJOR RACHA', C.bestStreak, L.bestStreak]);
    rows.push(['#H', 'PUZLES SUPERADOS']);
    [['lockpick', 'MADERA'], ['tumbler', 'ACERO'], ['hack', 'DIGITAL'], ['pipe', 'VAPOR'], ['sequence', 'NEÓN'], ['fuses', 'FUSIBLES']].forEach(([t, n]) => { if ((t === 'sequence' || t === 'fuses') && !(C.puz[t].ok + C.puz[t].fail + L.puz[t].ok + L.puz[t].fail)) return; rows.push([n, pz(C, t), pz(L, t)]); });   // [0.201] NEÓN solo aparece cuando se ha jugado
    const cls = animate ? 'jm-chalk jm-chalk-row' : 'jm-chalk';
    return rows.map((r, i) => r[0] === '#H'
      ? `<div class="${cls}" style="animation-delay:${i * 70}ms;font-size:19px;text-align:center;margin-top:8px;border-top:2px dashed rgba(238,243,234,.35);padding-top:6px;letter-spacing:.12em">${r[1]}</div>`
      : `<div class="${cls}" style="animation-delay:${i * 70}ms;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr);gap:5px;font-size:19px;line-height:1.25;white-space:nowrap;border-bottom:1px dotted rgba(238,243,234,.18)"><span style="opacity:.92">${r[0]}</span><span style="text-align:right;color:#ffe9a8">${r[1]}</span><span style="text-align:right;color:#bfe9ff">${r[2]}</span></div>`).join('');
  }
  const STATS_COLS_HTML = `<div class="jm-chalk" style="display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr);gap:5px;font-size:15px;opacity:.9;margin:6px 0 4px;border-bottom:2px solid rgba(238,243,234,.4);padding-bottom:3px"><span></span><span style="text-align:right;color:#ffe9a8">PARTIDA<br>ACTUAL</span><span style="text-align:right;color:#bfe9ff">ACUMULADO</span></div>`;
  function achievementsChalkHtml(animate) {
    const all = (DATOS_JUEGO.LOGROS && DATOS_JUEGO.LOGROS.LISTA) || [];
    const got = all.filter(l => achievementsUnlocked[l.id]).sort((a, b) => achievementsUnlocked[a.id] - achievementsUnlocked[b.id]);
    if (!got.length) return `<div class="jm-chalk" style="text-align:center;font-size:19px;opacity:.8;padding:18px 6px">Aún no has desbloqueado ningún logro.</div>`;
    const cls = animate ? 'jm-chalk jm-chalk-row' : 'jm-chalk';
    return `<div class="jm-chalk" style="text-align:center;font-size:15px;opacity:.8;margin-bottom:4px">${got.length} desbloqueado${got.length === 1 ? '' : 's'}</div>` + got.map((l, i) =>
      `<div class="${cls}" style="animation-delay:${i * 70}ms;display:flex;gap:10px;align-items:center;padding:5px 2px;border-bottom:1px dotted rgba(238,243,234,.18)"><div style="font-size:24px;line-height:1">${l.icono || '🏆'}</div><div style="min-width:0"><div style="color:#ffe9a8;font-size:21px;letter-spacing:.06em;line-height:1.05">${l.titulo}</div><div style="font-size:16px;line-height:1.1;opacity:.85">${l.descripcion || ''}</div></div></div>`).join('');
  }

  // [0.103] PC: el cartel de la marquesina derecha se convierte en una pizarra con ESTADÍSTICAS y LOGROS. Móvil / pantalla estrecha: ventanas como hasta ahora.
  let boardTab = 'stats', boardTimer = null;
  function marqueeBoardOk() { return !!(typeof ART_ON !== 'undefined' && ART_ON && document.getElementById('marqueeR') && typeof isWideLayout === 'function' && isWideLayout()); }
  function closeMarqueeBoard() { if (boardTimer) { clearInterval(boardTimer); boardTimer = null; } const b = document.getElementById('marqueeBoard'); if (b) b.remove(); }
  function paintMarqueeBoard(animate) {
    const b = document.getElementById('marqueeBoard'); if (!b) return;
    const body = b.querySelector('.mb-body');
    const prev = body.scrollTop;
    body.innerHTML = boardTab === 'stats' ? (STATS_COLS_HTML + statsRowsHtml(animate)) : achievementsChalkHtml(animate);
    body.scrollTop = prev;
    b.querySelectorAll('.mb-tab').forEach(t => t.classList.toggle('on', t.dataset.t === boardTab));
  }
  // [0.104] La pizarra ocupa EXACTAMENTE el cartel JUST ONE MORE CHEST de la marquesina (imagen de 108x192 px; cartel en x 16,5-91,5 / y 14,5-104,5) y el texto se escala con ella
  function layoutMarqueeBoard() {
    const m = document.getElementById('marqueeR'), b = document.getElementById('marqueeBoard'); if (!m || !b) return;
    const k = m.clientHeight / 192;
    b.style.left = (16.5 * k) + 'px'; b.style.top = (14.5 * k) + 'px'; b.style.width = (75 * k) + 'px'; b.style.height = (90 * k) + 'px';
    const sl = b.querySelector('.mb-slate'); if (sl) sl.style.zoom = Math.max(.8, Math.min(1.4, k / 4.6)).toFixed(3);
  }
  window.addEventListener('resize', layoutMarqueeBoard);
  function openMarqueeBoard(tab) {
    audio.init(); try { audio.playChalk(); } catch (e) {}
    boardTab = tab || 'stats';
    closeMarqueeBoard();
    const m = document.getElementById('marqueeR');
    const b = document.createElement('div'); b.id = 'marqueeBoard';
    b.innerHTML = `<div class="mb-frame"><div class="mb-slate">
        <div class="mb-tabs"><button class="mb-tab jm-chalk" data-t="stats">ESTADÍSTICAS</button><button class="mb-tab jm-chalk" data-t="logros">LOGROS</button></div>
        <div class="mb-body"></div>
        <button class="mb-close jm-chalk">✕ CERRAR LA PIZARRA</button>
      </div></div>`;
    m.appendChild(b);
    layoutMarqueeBoard();
    b.querySelectorAll('.mb-tab').forEach(t => t.addEventListener('click', () => { boardTab = t.dataset.t; try { audio.playChalk(); } catch (e) {} paintMarqueeBoard(true); }));
    b.querySelector('.mb-close').addEventListener('click', closeMarqueeBoard);
    paintMarqueeBoard(true);
    boardTimer = setInterval(() => { if (!marqueeBoardOk()) { closeMarqueeBoard(); return; } paintMarqueeBoard(false); }, 1500);   // se mantiene al día mientras juegas
  }
  window.closeMarqueeBoard = closeMarqueeBoard;

  window.openStatsBoard = function () {
    if (marqueeBoardOk()) { openMarqueeBoard('stats'); return; }
    audio.init(); try { audio.playChalk(); } catch (e) {}
    const o = overlay('statsModal', 10020);
    o.className += ' bg-slate-950/90 backdrop-blur-md';
    const html = statsRowsHtml(true);
    o.innerHTML = `
      <div style="width:100%;max-width:23rem;background:#5b3a1e;border:3px solid #3c2412;border-radius:14px;padding:10px;box-shadow:0 10px 40px rgba(0,0,0,.7), inset 0 0 0 2px #7a5230">
        <div style="background:radial-gradient(ellipse at 30% 20%, #2a3c34 0, #1b2a24 60%, #15211c 100%);border-radius:6px;padding:14px 12px 12px;box-shadow:inset 0 0 28px rgba(0,0,0,.65)">
          <div class="jm-chalk jm-chalk-row" style="font-size:30px;text-align:center;letter-spacing:.14em;margin-bottom:2px">ESTADÍSTICAS</div>
          ${STATS_COLS_HTML}
          ${html}
        </div>
        <button id="statsClose" class="mt-3 w-full py-2.5 bg-amber-700/90 active:bg-amber-600 text-amber-50 font-extrabold text-xs rounded-xl cursor-pointer" style="border:1px solid #c69a5a">CERRAR</button>
      </div>`;
    o.querySelector('#statsClose').addEventListener('click', () => close('statsModal'));
    [0.25, 0.7, 1.2].forEach(d => setTimeout(() => { if (document.getElementById('statsModal')) try { audio.playChalk(); } catch (e) {} }, d * 1000));
  };

  // ---- [0.091] lista de logros desbloqueados ----
  window.openAchievementsList = function () {
    if (marqueeBoardOk()) { openMarqueeBoard('logros'); return; }   // [0.103] en PC, en la pizarra de la marquesina
    audio.init(); try { audio.playUiClick(); } catch (e) {}
    const o = overlay('achievementsModal', 10020);
    o.className += ' bg-slate-950/90 backdrop-blur-md';
    const all = (DATOS_JUEGO.LOGROS && DATOS_JUEGO.LOGROS.LISTA) || [];
    const got = all.filter(l => achievementsUnlocked[l.id]).sort((a, b) => achievementsUnlocked[a.id] - achievementsUnlocked[b.id]);
    const rowsHtml = got.length ? got.map(l => `
        <div style="display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:12px;background:rgba(2,6,23,.7);border:1px solid rgba(245,158,11,.35)">
          <div style="font-size:26px;line-height:1">${l.icono || '🏆'}</div>
          <div style="min-width:0"><div class="font-retro" style="color:#fcd34d;font-size:19px;letter-spacing:.06em;line-height:1.1">${l.titulo}</div><div style="color:#cbd5e1;font-size:12px;line-height:1.25">${l.descripcion || ''}</div></div>
        </div>`).join('') : `<div style="text-align:center;color:#94a3b8;font-size:13px;padding:18px 6px">Aún no has desbloqueado ningún logro.</div>`;
    o.innerHTML = `
      <div class="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 w-full max-w-xs shadow-2xl flex flex-col gap-2.5" style="max-height:86vh">
        <h3 class="text-center text-2xl font-black text-amber-300 font-retro tracking-wide"><i class="fa-solid fa-trophy"></i> LOGROS</h3>
        <div style="text-align:center;color:#94a3b8;font-size:11px;margin-top:-4px">${got.length} desbloqueado${got.length === 1 ? '' : 's'}</div>
        <div style="display:flex;flex-direction:column;gap:7px;overflow-y:auto;min-height:0">${rowsHtml}</div>
        <button id="achClose" class="mt-1 w-full py-2.5 bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">Cerrar</button>
      </div>`;
    o.querySelector('#achClose').addEventListener('click', () => close('achievementsModal'));
  };

  // ---- clave de flechas del Modo test ----
  let keyFails = 0, keyLockUntil = 0;
  window.openTestKeyGate = function () {
    audio.init();
    const cfg = DATOS_JUEGO.MODO_TEST || {};
    const len = cfg.LONGITUD || 6;
    const o = overlay('testKeyModal', 10040);
    o.className += ' bg-black/90';
    o.innerHTML = `
      <div id="tkBox" class="tm-root" style="position:relative;width:100%;max-width:18rem;border:2px solid #777;padding:16px 14px;text-align:center">
        <div style="font-size:26px;color:#ffe14a;letter-spacing:.1em">CLAVE</div>
        <div id="tkDots" style="font-size:28px;letter-spacing:.35em;margin:10px 0 12px;min-height:34px"></div>
        <div style="display:grid;grid-template-columns:repeat(3,64px);grid-template-rows:repeat(3,56px);gap:6px;justify-content:center">
          <span></span><button class="tm-arr tk" data-k="U" style="width:64px;height:56px">▲</button><span></span>
          <button class="tm-arr tk" data-k="L" style="width:64px;height:56px">◀</button><span></span><button class="tm-arr tk" data-k="R" style="width:64px;height:56px">▶</button>
          <span></span><button class="tm-arr tk" data-k="D" style="width:64px;height:56px">▼</button><span></span>
        </div>
        <button id="tkBack" class="tm-btn" style="margin-top:14px;width:100%;flex:none">VOLVER</button>
      </div>`;
    let seq = '';
    const dots = () => { o.querySelector('#tkDots').textContent = '●'.repeat(seq.length) + '○'.repeat(len - seq.length); };
    dots();
    const press = k => {
      if (performance.now() < keyLockUntil) { try { audio.playTestDenied(); } catch (e) {} return; }   // bloqueado tras fallar
      seq += k; dots(); try { audio.playUiClick(); } catch (e) {}
      if (seq.length < len) return;
      const ok = testKeyHash(seq, cfg.SAL || '') === cfg.HUELLA;
      seq = '';
      if (ok) { keyFails = 0; document.removeEventListener('keydown', onKey, true); close('testKeyModal'); try { audio.playUnlockFanfare('normal'); } catch (e) {} openTestMenu(); return; }
      keyFails++;
      keyLockUntil = performance.now() + Math.min(60000, 1500 * Math.pow(2, keyFails - 1));   // 1,5 s, 3 s, 6 s... hasta 60 s
      try { audio.playTestDenied(); } catch (e) {}
      const box = o.querySelector('#tkBox'); box.classList.remove('jm-shake'); void box.offsetWidth; box.classList.add('jm-shake');
      dots();
    };
    const onKey = e => {
      const m = { ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R' }[e.key];
      if (!m) return; e.preventDefault(); e.stopPropagation(); press(m);
    };
    document.addEventListener('keydown', onKey, true);
    o.querySelectorAll('.tk').forEach(b => b.addEventListener('click', () => press(b.dataset.k)));
    o.querySelector('#tkBack').addEventListener('click', () => { document.removeEventListener('keydown', onKey, true); close('testKeyModal'); });
  };

  // ---- menú de servicio (estilo arcade) ----
  const TM_PAGES = [
    { title: 'AJUSTES DE PARTIDA', rows: [
      { id: 'final3', label: 'FINAL BUCLE 3 (TODO ABIERTO)', kind: 'bool' },   // [0.31] salta al cofre 70 del bucle 3 con todo desbloqueado y las 3 contraseñas
      { id: 'chest', label: 'IR AL COFRE', kind: 'num', min: 1, max: 100, def: 78 },
      { id: 'loop', label: 'BUCLE', kind: 'list', opts: [1, 2, 3] },
      { id: 'level', label: 'NIVEL', kind: 'num', min: 1, max: 30, def: 5 },
      { id: 'gold', label: 'ORO (GP)', kind: 'num', min: 0, max: 9999, step: 50, def: 500 },
      { id: 'picks', label: 'GANZÚAS', kind: 'num', min: 0, max: 99, def: 20 },
      { id: 'proPicks', label: 'PINES DE ACERO', kind: 'num', min: 0, max: 99, def: 20 },
      { id: 'usb', label: 'LLAVES USB', kind: 'num', min: 0, max: 99, def: 20 },
      { id: 'valves', label: 'VÁLVULAS', kind: 'num', min: 0, max: 99, def: 20 },
      { id: 'batteries', label: 'PILAS', kind: 'num', min: 0, max: 99, def: 20 },
      { id: 'fuses', label: 'FUSIBLES', kind: 'num', min: 0, max: 99, def: 20 }
    ] },
    { title: 'CARTAS Y EXTRAS', rows: [
      { id: 'ab_auto', label: 'CARTA AUTO', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_double', label: 'CARTA x2', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_shield', label: 'CARTA ESCUDO', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_riskPot', label: 'CARTA APUESTA', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_perdedor', label: 'CARTA PERDEDOR', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_summonDuende', label: 'CARTA DUENDE', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_cofradia', label: 'CARTA COFRADÍA DEL COFRE', kind: 'num', min: 0, max: 9, def: 0 },
      { id: 'ab_reroll', label: 'CARTA RE-ROLL', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_pulsera', label: 'CARTA PULSERA VIP', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_ruleta', label: 'CARTA RULETA', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'curse', label: 'MALDICIÓN (COFRES)', kind: 'num', min: 1, max: 30, def: 10 },
      { id: 'clearAch', label: 'BORRAR LOGROS', kind: 'bool' }
    ] },
    { title: 'WILDCARDS (LISTA COMPLETA)', rows: (DATOS_JUEGO.WILDCARDS || []).map(w => ({ id: 'wc_' + w.id, label: (w.tipo === 'PERJUDICIAL' ? '(-) ' : '(+) ') + String(w.nombre || w.id).toUpperCase(), kind: 'bool' })) },   // [0.096] se pueden activar varias; se aplican al VALIDAR como si salieran de la ruleta
    { title: 'PERKS Y ESTADOS', rows: [   // [0.097b]
      { id: 'ps_sweetSpot', label: 'MANO FIRME (NIVEL)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_rarityBonus', label: 'OJO DE CAZADOR (NIVEL)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_discount', label: 'REGATEADOR (NIVEL)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_slowerPistons', label: 'PISTONES LENTOS (NIVEL)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_goldStreak', label: 'FONDO DE BOLSILLO (NIVEL)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_extraTime', label: 'HOMBRE TRANQUILO (+S)', kind: 'num', min: 1, max: 30, def: 5 },
      { id: 'ps_clienteVip', label: 'CLIENTE VIP', kind: 'bool' },
      { id: 'ps_exorcismo', label: 'EXORCISMO', kind: 'bool' },
      { id: 'ps_inconformista', label: 'INCONFORMISTA', kind: 'bool' },
      { id: 'ps_herrero', label: 'HERRERO (NIVEL)', kind: 'num', min: 1, max: 3, def: 1 },
      { id: 'ps_oidoClinico', label: 'OÍDO CLÍNICO', kind: 'bool' },
      { id: 'ps_luckyLootChance', label: 'TIPO CON SUERTE', kind: 'bool' },
      { id: 'ps_shopStealFree', label: 'FORZAR ROBO (LADRÓN)', kind: 'bool' },
      { id: 'ps_bonusMadera', label: 'MAESTRÍA CLÁSICO (LV)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_bonusAcero', label: 'MAESTRÍA MECÁNICO (LV)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_bonusDigital', label: 'MAESTRÍA INFORMÁTICO (LV)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_bonusVapor', label: 'MAESTRÍA FONTANERO (LV)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_bonusNeon', label: 'MAESTRÍA ELECTRICISTA (LV)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_tor_madera', label: 'TORPEZA MADERA (LV)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_tor_acero', label: 'TORPEZA ACERO (LV)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_tor_digital', label: 'TORPEZA DIGITAL (LV)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_tor_vapor', label: 'TORPEZA VAPOR (LV)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_tor_neon', label: 'TORPEZA NEÓN (LV)', kind: 'num', min: 1, max: 5, def: 1 },
      { id: 'ps_picksBrokenOnUse', label: 'DEDOS ROTOS', kind: 'bool' },
      { id: 'ps_tb_harderMinigames', label: 'PUZLES DUROS (PERMANENTE)', kind: 'bool' },
      { id: 'ps_tb_shortPipeTimer', label: 'TIEMPO CORTO EN VAPOR', kind: 'bool' },
      { id: 'ps_tb_bonusXp', label: 'XP EXTRA (PERMANENTE)', kind: 'bool' },
      { id: 'ps_tb_doubleGold', label: 'ORO x2 (PERMANENTE)', kind: 'bool' },
      { id: 'ps_heavy', label: 'CONTRATO LEONINO (COFRES)', kind: 'num', min: 1, max: 30, def: 5 }
    ] },
    { title: 'PROBAR UN PUZLE (SOLO)', puzzle: true, rows: [
      { id: 'pType', label: 'PUZLE', kind: 'list', opts: ['MADERA', 'ACERO', 'DIGITAL', 'VAPOR', 'NEON', 'FUSIBLES'], always: true },
      { id: 'pVar', label: 'VARIANTE', kind: 'list', opts: ['RANDOM', '1x1', '1x2', '1x3', '1x4', '2x1', '2x2', '2x3', '2x4', '3x1', '3x2', '3x3', '3x4'], always: true }
    ] }
  ];
  const tmVals = { pType: 'MADERA', pVar: 'RANDOM' };
  function fmtVal(r) {
    const v = tmVals[r.id];
    if (r.kind === 'bool') return v ? 'ON' : 'OFF';
    if (v === undefined || v === null) return 'OFF';
    return String(v);
  }
  function stepVal(r, dir, fast) {
    const v = tmVals[r.id];
    if (r.kind === 'bool') { tmVals[r.id] = dir > 0; return; }
    if (r.kind === 'list') {
      const i = (v === undefined || v === null) ? -1 : r.opts.indexOf(v);
      let n = i + dir;
      if (r.always) n = (n + r.opts.length) % r.opts.length;
      else if (n < 0) { tmVals[r.id] = null; return; }
      else n = Math.min(r.opts.length - 1, n);
      tmVals[r.id] = r.opts[n]; return;
    }
    const st = (r.step || 1) * (fast ? 5 : 1);
    if (v === undefined || v === null) { if (dir > 0) tmVals[r.id] = r.def; return; }
    const n = v + dir * st;
    if (n < r.min) { tmVals[r.id] = (v === r.min || dir < 0) ? null : r.min; return; }
    tmVals[r.id] = Math.min(r.max, n);
  }
  function applyTestCheats() {
    const v = tmVals; let any = false;
    const set = (cond, fn) => { if (cond) { fn(); any = true; } };
    set(v.loop != null, () => { STATE.currentLoop = v.loop; });
    set(v.chest != null, () => { window.goToChest(v.chest); });
    // [0.31] Salto al final del bucle 3: todos los cofres/herramientas abiertos, linterna y cuaderno, y las 3 palabras de la contraseña rellenas (se muestran para poder acertar o fallar a propósito)
    set(!!v.final3, () => {
      STATE.currentLoop = 3; STATE.level = Math.max(STATE.level, 10); STATE.xp = 0; STATE.xpNext = getXpForLevel(STATE.level); STATE.chestsAtLevelUp = 60;
      STATE.lanternFound = true; STATE.batteriesUnlocked = true; STATE.fusesUnlocked = true; try { setTomeUnlocked(); } catch (e) {}
      STATE.picks = STATE.proPicks = STATE.usb = STATE.valves = STATE.batteries = STATE.fuses = 20; STATE.gold = Math.max(STATE.gold, 2000);
      const P = DATOS_JUEGO.CONTRASENA.BUCLES; STATE.passWords = {};
      [1, 2, 3].forEach(l => { const ws = P[l].palabras; STATE.passWords[l] = ws[Math.floor(Math.random() * ws.length)]; });
      window.goToChest(70);
      STATE.testPassHint = true;
      const pw = STATE.passWords;
      setTimeout(() => showPersistentFeedback(`🛠️ [MODO TEST] FINAL BUCLE 3 · Contraseña correcta: ${pw[1].toUpperCase()} · ${pw[2].toUpperCase()} · ${pw[3].toUpperCase()}`), 400);
    });
    set(v.level != null, () => { STATE.level = v.level; STATE.xp = 0; STATE.xpNext = getXpForLevel(v.level); STATE.chestsAtLevelUp = Math.max(0, STATE.chestsOpened - 3); STATE.chestsOpened = Math.max(STATE.chestsOpened, 3); });
    set(v.gold != null, () => { STATE.gold = v.gold; });
    ['picks', 'proPicks', 'usb', 'valves', 'batteries', 'fuses'].forEach(k => set(v[k] != null, () => { STATE[k] = v[k]; if (k === 'batteries') STATE.batteriesUnlocked = true; if (k === 'fuses') STATE.fusesUnlocked = true; }));
    ['auto', 'double', 'shield', 'riskPot', 'perdedor', 'summonDuende', 'cofradia', 'reroll', 'pulsera', 'ruleta'].forEach(k => set(v['ab_' + k] != null, () => { STATE.abilities[k] = v['ab_' + k]; }));
    set(v.curse != null, () => { STATE.cursedChestsLeft = v.curse; });
    set(!!v.clearAch, () => { clearAchievements(); });
    ['sweetSpot', 'rarityBonus', 'discount', 'slowerPistons', 'goldStreak', 'extraTime', 'bonusMadera', 'bonusAcero', 'bonusDigital', 'bonusVapor', 'bonusNeon'].forEach(k => set(v['ps_' + k] != null, () => { STATE.perks[k] = v['ps_' + k]; }));   // [0.097b]
    ['madera', 'acero', 'digital', 'vapor', 'neon'].forEach(k => set(v['ps_tor_' + k] != null, () => { STATE.torpezas[k] = v['ps_tor_' + k]; }));
    set(!!v.ps_clienteVip, () => { STATE.perks.clienteVip = 1; });
    set(!!v.ps_exorcismo, () => { STATE.perks.exorcismo = 1; });
    set(!!v.ps_inconformista, () => { STATE.perks.inconformista = 1; });
    set(v.ps_herrero != null, () => { STATE.perks.herrero = v.ps_herrero; });
    set(!!v.ps_oidoClinico, () => { STATE.perks.oidoClinico = 1; });
    set(!!v.ps_luckyLootChance, () => { STATE.perks.luckyLootChance = 0.15; });
    set(!!v.ps_shopStealFree, () => { STATE.perks.shopStealFree = true; });
    set(!!v.ps_picksBrokenOnUse, () => { STATE.picksBrokenOnUse = true; });
    ['harderMinigames', 'shortPipeTimer', 'bonusXp', 'doubleGold'].forEach(k => set(!!v['ps_tb_' + k], () => { STATE.traperoBuffs = STATE.traperoBuffs || {}; STATE.traperoBuffs[k] = true; }));
    set(v.ps_heavy != null, () => { STATE.heavyChestsLeft = v.ps_heavy; });
    const wcDone = [];
    (DATOS_JUEGO.WILDCARDS || []).forEach(w => set(!!v['wc_' + w.id], () => { try { applyWildcard(w); wcDone.push(w.nombre); } catch (e) { console.warn('Wildcard de test fallida', w.id, e); } }));   // [0.096]
    if (any) {
      statsPaused = true; statsGoldPrev = null;   // una partida con trucos no cuenta para las estadísticas
      Object.keys(tmVals).forEach(k => { if (k !== 'pType' && k !== 'pVar') tmVals[k] = (k === 'clearAch' || k.indexOf('wc_') === 0 || (k.indexOf('ps_') === 0 && /oidoClinico|luckyLootChance|shopStealFree|picksBrokenOnUse|ps_tb_/.test(k))) ? false : null; });
      generateScreenChests(); keysBaseline = null; keyToastQueue.length = 0; updateUI();   // [0.091] sin avisos por los ajustes de test
      showPersistentFeedback('🛠️ [MODO TEST] Ajustes aplicados' + (wcDone.length ? ' (wildcards: ' + wcDone.join(', ') + ')' : '') + '. Esta partida ya no cuenta para las estadísticas.');
    }
    return any;
  }
  let tmPage = 0, tmCursor = 0, tmKeyHandler = null;
  window.openTestMenu = function () {
    audio.init();
    const o = overlay('testMenuModal', 10040);
    o.style.padding = '0';
    o.innerHTML = `<div class="tm-root" style="position:relative;width:100%;height:100%;display:flex;flex-direction:column;padding:10px 8px;overflow-y:auto">
      <div style="text-align:center;color:#ffe14a;font-size:26px;letter-spacing:.1em;line-height:1">— MODO TEST —</div>
      <div style="text-align:center;color:#999;font-size:17px;margin-bottom:6px">JOMC v${DATOS_JUEGO.VERSION} · <span id="tmPg"></span></div>
      <div id="tmRows" style="flex:1"></div>
      <div id="tmNote" style="color:#8fd6ff;font-size:17px;min-height:42px;padding:4px 6px"></div>
      <div style="display:flex;gap:6px;margin-top:4px"><button class="tm-btn" id="tmNext">NEXT PAGE ▶</button><button class="tm-btn go" id="tmGo">VALIDAR</button></div>
      <div style="display:flex;gap:6px;margin-top:6px"><button class="tm-btn warn" id="tmExit">SALIR</button></div>
    </div>`;
    const rowsEl = o.querySelector('#tmRows');
    const draw = () => {
      const pg = TM_PAGES[tmPage];
      o.querySelector('#tmPg').textContent = `PAGE ${tmPage + 1}/${TM_PAGES.length} · ${pg.title}`;
      tmCursor = Math.min(tmCursor, pg.rows.length - 1);
      rowsEl.innerHTML = pg.rows.map((r, i) => `<div class="tm-row ${i === tmCursor ? 'sel' : ''}" data-i="${i}"><span class="tm-lbl">${r.label}</span><span class="tm-arr" data-d="-1">◀</span><span class="tm-val ${(fmtVal(r) === 'OFF') ? 'off' : ''}">${fmtVal(r)}</span><span class="tm-arr" data-d="1">▶</span></div>`).join('');
      o.querySelector('#tmGo').textContent = pg.puzzle ? 'LANZAR PUZLE' : 'VALIDAR';
      o.querySelector('#tmNote').textContent = pg.puzzle ? 'Se prueba SOLO este puzle, en serie, con herramientas infinitas. VARIANTE = bucle x rareza (1x3 = bucle 1, épico). Se sale desde la barra superior.' : 'Los ajustes activados se aplican UNA vez a la partida en curso. OFF = no tocar.';
      // flechas: pulsación y mantener
      rowsEl.querySelectorAll('.tm-row').forEach(rowEl => {
        const i = +rowEl.dataset.i, r = pg.rows[i];
        rowEl.addEventListener('click', e => { if (e.target.closest('.tm-arr')) return; tmCursor = i; draw(); try { audio.playUiClick(); } catch (x) {} });
        rowEl.querySelectorAll('.tm-arr').forEach(a => {
          let tm = null, iv = null, n = 0;
          const stop = () => { clearTimeout(tm); clearInterval(iv); };
          const act = () => { n++; stepVal(r, +a.dataset.d, n > 12); const vEl = rowEl.querySelector('.tm-val'); vEl.textContent = fmtVal(r); vEl.classList.toggle('off', fmtVal(r) === 'OFF'); };
          a.addEventListener('pointerdown', e => { e.preventDefault(); tmCursor = i; rowsEl.querySelectorAll('.tm-row').forEach((x, j) => x.classList.toggle('sel', j === i)); try { audio.playUiClick(); } catch (x) {} act(); tm = setTimeout(() => { iv = setInterval(act, 80); }, 420); });
          ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => a.addEventListener(ev, stop));
        });
      });
    };
    draw();
    o.querySelector('#tmNext').addEventListener('click', () => { tmPage = (tmPage + 1) % TM_PAGES.length; tmCursor = 0; draw(); try { audio.playUiClick(); } catch (e) {} });
    const exit = () => { if (tmKeyHandler) document.removeEventListener('keydown', tmKeyHandler, true); tmKeyHandler = null; close('testMenuModal'); };
    o.querySelector('#tmExit').addEventListener('click', exit);
    o.querySelector('#tmGo').addEventListener('click', () => {
      const pg = TM_PAGES[tmPage];
      if (pg.puzzle) { exit(); startTestSeries(tmVals.pType, tmVals.pVar); return; }
      if (applyTestCheats()) exit();
      else { o.querySelector('#tmNote').textContent = 'No hay ningún ajuste activado (todo en OFF).'; try { audio.playTestDenied(); } catch (e) {} }
    });
    // teclado (PC): ↑↓ elegir fila, ←→ cambiar valor, Enter valida
    tmKeyHandler = e => {
      const pg = TM_PAGES[tmPage];
      if (e.key === 'ArrowUp') tmCursor = (tmCursor + pg.rows.length - 1) % pg.rows.length;
      else if (e.key === 'ArrowDown') tmCursor = (tmCursor + 1) % pg.rows.length;
      else if (e.key === 'ArrowLeft') stepVal(pg.rows[tmCursor], -1, e.shiftKey);
      else if (e.key === 'ArrowRight') stepVal(pg.rows[tmCursor], 1, e.shiftKey);
      else if (e.key === 'Enter') { o.querySelector('#tmGo').click(); return; }
      else return;
      e.preventDefault(); e.stopPropagation(); draw();
    };
    document.addEventListener('keydown', tmKeyHandler, true);
  };

  /* ---- Puzles en serie (Modo test): un puzle concreto, repetido; al acabar (éxito o error) sale el siguiente ---- */
  const JUEGO_TIPO = { MADERA: 'wooden', ACERO: 'piston', DIGITAL: 'cyber', VAPOR: 'hydraulic', NEON: 'neon', FUSIBLES: 'electric' };
  window.startTestSeries = function (typeName, variant) {
    if (TEST_SERIES.active) return;
    const snap = { state: {}, chests: STATE.screenChests, idx: STATE.activeChestIdx, autosave: autosaveEnabled, statsPaused };
    SAVE_KEYS.forEach(k => { try { snap.state[k] = JSON.parse(JSON.stringify(STATE[k])); } catch (e) { snap.state[k] = STATE[k]; } });
    Object.assign(TEST_SERIES, { active: true, typeId: JUEGO_TIPO[typeName] || 'wooden', typeName, variant, snap, n: 0, ok: 0, fail: 0 });
    autosaveEnabled = false; statsPaused = true;
    makeSeriesBar();
    testPuzzleNext();
  };
  function makeSeriesBar() {
    const old = document.getElementById('testSeriesBar'); if (old) old.remove();
    const bar = document.createElement('div');
    bar.id = 'testSeriesBar';
    bar.style.cssText = "position:absolute;top:4px;left:50%;transform:translateX(-50%);z-index:10045;display:flex;gap:6px;align-items:center;background:rgba(0,0,0,.88);border:1px solid #39e75f;color:#39e75f;font:17px 'VT323',monospace;padding:2px 6px;border-radius:6px;white-space:nowrap";
    bar.innerHTML = `<span id="tsInfo"></span><button id="tsExit" style="border:1px solid #ff5a5a;color:#ff5a5a;background:#000;padding:0 8px;font:inherit">SALIR</button>`;
    uiHost().appendChild(bar);
    bar.querySelector('#tsExit').addEventListener('click', stopTestSeries);
  }
  function updateSeriesBar(label) {
    const i = document.getElementById('tsInfo'); if (!i) return;
    i.textContent = `TEST ${TEST_SERIES.typeName} · ${label} · #${TEST_SERIES.n} ✔${TEST_SERIES.ok} ✘${TEST_SERIES.fail}`;
  }
  window.testPuzzleNext = function () {
    if (!TEST_SERIES.active) return;
    let loop, rar;
    const v = TEST_SERIES.variant;
    if (v === 'RANDOM') { loop = 1 + Math.floor(Math.random() * 3); rar = 1 + Math.floor(Math.random() * 4); }
    else { loop = +v[0]; rar = +v[2]; }
    TEST_SERIES.n++;
    const type = DATOS_JUEGO.COFRES.ESTANDAR.find(t => t.id === TEST_SERIES.typeId);
    STATE.currentLoop = loop; STATE.level = Math.max(STATE.level, 6);
    STATE.chestsOpened = Math.max(STATE.chestsOpened, 20);
    STATE.picks = STATE.proPicks = STATE.usb = STATE.valves = STATE.batteries = STATE.fuses = 99; STATE.batteriesUnlocked = STATE.fusesUnlocked = true;
    STATE.abilities.auto = 0; STATE.activeShield = false; STATE.riskModeActive = false; STATE.cursedChestsLeft = 0;
    STATE.screenChests = [{ type, rarity: CHEST_RARITIES[rar - 1] }]; STATE.activeChestIdx = 0;
    isLootProcessing = false; minigameInProgress = false; puzzleToolPaid = null;
    updateChestSelectionUI(); updateUI();
    updateSeriesBar(`${loop}x${rar}`);
    setTimeout(() => { if (TEST_SERIES.active) openActiveChest(); }, 350);
  };
  window.testPuzzleResult = function (ok) {
    if (!TEST_SERIES.active) return;
    minigameInProgress = false; stopMinigameTimer(); hideAllMinigameUI(); isLootProcessing = false;
    if (ok) TEST_SERIES.ok++; else TEST_SERIES.fail++;
    flashScreen(ok ? 'rgba(57,231,95,.28)' : 'rgba(255,60,60,.3)', 500);
    updateSeriesBar(ok ? 'SUPERADO' : 'FALLADO');
    whenBannerClosed(() => setTimeout(() => { if (TEST_SERIES.active) testPuzzleNext(); }, 650));
  };
  window.stopTestSeries = function () {
    if (!TEST_SERIES.active) return;
    const s = TEST_SERIES.snap;
    TEST_SERIES.active = false;
    minigameInProgress = false; stopMinigameTimer(); hideAllMinigameUI(); isLootProcessing = false; puzzleToolPaid = null; puzzleStat = null;
    SAVE_KEYS.forEach(k => { STATE[k] = s.state[k]; });
    STATE.screenChests = s.chests; STATE.activeChestIdx = s.idx;
    autosaveEnabled = s.autosave; statsPaused = s.statsPaused; statsGoldPrev = null;
    const bar = document.getElementById('testSeriesBar'); if (bar) bar.remove();
    keysBaseline = null; keyToastQueue.length = 0;   // [0.091] al volver, sin avisos de llaves
    updateChestSelectionUI(); updateUI();
  };
})();


/* ==========================================================================
   [0.090] GANZÚA TÁCTIL: arrastrar el anillo del dial gira la ganzúa; mantener el centro prueba girar (como el botón).
   El deslizador y el botón de abajo se conservan. Con dos dedos se puede girar y mantener a la vez.
   ========================================================================== */
(function () {
  const glow = document.getElementById('proximityGlow');
  if (!glow) return;
  const dial = glow.parentElement;
  dial.style.touchAction = 'none'; dial.style.userSelect = 'none'; dial.style.position = 'relative';
  const roles = {};   // pointerId -> 'ring' | 'center'
  const ringDrag = {};   // pointerId -> { x0, a0 } (arrastre relativo del anillo)
  let hintRing = null, hintCenter = null;
  const fake = { preventDefault() {} };
  function geom(e) {
    const r = dial.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = r.width / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    return { dist: Math.hypot(dx, dy) / R, ang: Math.atan2(dx, -dy) * 180 / Math.PI };
  }
  function setAngle(a) {
    if (lpState.isBreaking || lpState.isCompleted) return;
    a = Math.max(-85, Math.min(85, a));
    lpState.angle = a;
    const sl = document.getElementById('angleSlider'); if (sl) sl.value = a;
    const ro = document.getElementById('angleReadout'); if (ro) ro.textContent = `${Math.round(a)}°`;
    updateLockpickProximityVisuals();
  }
  const clampAng = t => (t > 85 && t <= 180) ? 85 : (t < -85 && t >= -180) ? -85 : t;
  dial.addEventListener('pointerdown', e => {
    if (lpState.isBreaking || lpState.isCompleted) return;
    const g = geom(e);
    // [0.093] El anillo solo se agarra pulsando SOBRE la aguja (margen GRAB_GRADOS); la aguja sigue entonces el ángulo del dedo
    const grabDeg = ((DATOS_JUEGO.GANZUA_TACTIL || {}).GRAB_GRADOS) || 32;
    // [0.095] Se quita el control táctil del anillo: la ganzúa se gira con la barra de arriba; el centro sigue siendo "mantener para probar girar"
    let role = g.dist < 0.58 ? 'center' : 'none';
    if (role === 'none') return;
    roles[e.pointerId] = role;
    if (role === 'ring') ringDrag[e.pointerId] = { off: g.ang - lpState.angle };
    try { dial.setPointerCapture(e.pointerId); } catch (x) {}
    e.preventDefault();
    if (role === 'center') { startTension(fake); if (hintCenter) { hintCenter.remove(); hintCenter = null; } }
    else { if (hintRing) { hintRing.remove(); hintRing = null; } }
  });
  dial.addEventListener('pointermove', e => {
    if (roles[e.pointerId] !== 'ring') return;
    const dr = ringDrag[e.pointerId]; if (!dr) return;
    const g = geom(e);
    if (g.dist < 0.12) return;   // dedo casi en el eje: el ángulo es inestable
    setAngle(clampAng(g.ang) - dr.off);
  });
  const up = e => {
    const role = roles[e.pointerId]; delete roles[e.pointerId]; delete ringDrag[e.pointerId];
    if (role === 'center') stopTension(fake);
  };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => dial.addEventListener(ev, up));

  // Ayuda visual en las primeras veces de madera (por partida)
  window.showLockTouchHints = function () {
    [hintRing, hintCenter].forEach(h => { if (h) h.remove(); }); hintRing = hintCenter = null;
    const hc = (DATOS_JUEGO.AYUDAS || {}).GANZUA_TACTIL; if (!hc) return;
    STATE.hintUses = STATE.hintUses || {};
    const used = STATE.hintUses.lockTouch || 0;
    if (used >= hc.VECES) return;
    STATE.hintUses.lockTouch = used + 1;
    const mk = html => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:5'; d.innerHTML = html; dial.appendChild(d); return d; };
    hintCenter = mk(`
      <div class="lp-hint-ring" style="animation:cardPulse 1.1s ease-in-out infinite"></div>
      <div class="lp-hint-txt">${hc.CENTRO}</div>`);   // [0.103] el texto va debajo del círculo, dentro de la placa, más grande
  };

  // [0.091] Háptica del punto dulce: la intensidad sube al acercarse al punto dulce MÁS CERCANO (real o falso, sin distinguirlos).
  const hapCfg = (DATOS_JUEGO.GANZUA_TACTIL || {}).HAPTICA || {};
  if (hapCfg.ACTIVAR) {
    const touchVib = !!(navigator.vibrate && window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    let wasVib = false, hapLastAngle = 0, hapLastMove = 0, hapLastRem = 0;
    setInterval(() => {
      const box = document.getElementById('lockpickContainer');
      const active = !!(box && !box.classList.contains('hidden')) && minigameInProgress && !lpState.isBreaking && !lpState.isCompleted && lpState.phase !== 2;   // [0.31] en la fase del destornillador no hay zumbido continuo
      if (!active) { if (wasVib) { try { navigator.vibrate(0); } catch (e) {} wasVib = false; } return; }
      let d = Math.abs(lpState.angle - lpState.sweetSpot);
      (lpState.decoySpots || []).forEach(ds => { d = Math.min(d, Math.abs(lpState.angle - ds)); });
      // [0.092] La intensidad se mide desde el CENTRO exacto del punto dulce: empieza a ZONA_GRADOS y llega al máximo solo en el centro
      const zone = hapCfg.ZONA_GRADOS || 20;
      let r = Math.max(0, 1 - d / zone);
      r = Math.pow(r, hapCfg.CURVA || 2.6);
      if (r < 0.03) { if (wasVib) { try { navigator.vibrate(0); } catch (e) {} wasVib = false; } return; }
      // [0.093b] Aguja quieta dentro de la zona: solo un toquecito muy leve cada RECORDATORIO_MS (recordatorio). Al moverla vuelve el comportamiento normal.
      const nowT = Date.now();
      if (Math.abs(lpState.angle - hapLastAngle) > 0.01) { hapLastAngle = lpState.angle; hapLastMove = nowT; }
      // [0.096] El recordatorio de aguja quieta es SOLO del móvil; en escritorio el temblor continúa mientras la aguja esté en la zona
      if (touchVib && hapCfg.RECORDATORIO_ACTIVAR !== false && nowT - hapLastMove > 280) {
        if (nowT - hapLastRem >= (hapCfg.RECORDATORIO_MS || 1200)) {
          hapLastRem = nowT;
          try { navigator.vibrate(hapCfg.RECORDATORIO_ON_MS || 10); wasVib = true; } catch (e) {}
        }
        return;
      }
      const per = hapCfg.PERIODO_MS || 110;
      if (touchVib) {
        const onMin = hapCfg.ON_MIN_MS || 4, imax = hapCfg.INTENSIDAD_MAX != null ? hapCfg.INTENSIDAD_MAX : 1;
        const on = Math.max(1, Math.round(onMin + (per * imax - onMin) * r));
        try { navigator.vibrate(on); wasVib = true; } catch (e) {}
      } else {
        const px = (hapCfg.TEMBLOR_PX_MIN || 0.6) + ((hapCfg.TEMBLOR_PX_MAX || 3.2) - (hapCfg.TEMBLOR_PX_MIN || 0.6)) * r;
        screenShake(px, per);
      }
    }, (hapCfg.PERIODO_MS || 110));
  }
})();
