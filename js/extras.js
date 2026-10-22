// ==========================================================================
// JUST ONE MORE CHEST — extras.js — VERSIÓN 0.41
// cartas y comodines nuevos de la 0.210: Inconformista, Herrero, Re-Roll, Pulsera VIP, Ruleta, Hallazgo Táctico+
// ==========================================================================

function helpPasiva(key, vars) {
  let t = ((DATOS_JUEGO.TEXTOS_AYUDA || {}).pasivas210 || {})[key] || '';
  return t.replace('{n}', vars && vars.n != null ? vars.n : '');
}

// Pregunta Sí/No con el mismo estilo que la pantalla previa de las cartas
function askYesNo(titulo, texto, siLabel, onYes, onNo) {
  if (document.getElementById('askYesNoModal')) return;
  const m = document.createElement('div');
  m.id = 'askYesNoModal';
  m.className = 'fixed inset-0 z-[9995] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-5 gx-ov';
  m.innerHTML = `
    <div class="gm-card gx-card">
      <i class="cr a"></i><i class="cr b"></i><i class="cr c"></i><i class="cr d"></i>
      <div class="gm-seal">¿SEGURO?</div>
      <div class="gx-ico"><i class="fa-solid fa-circle-question"></i></div>
      <h3 class="gx-ttl">${titulo}</h3>
      <p class="gx-tx">${texto}</p>
      <button id="ynYes" class="gm-btn" type="button">${siLabel}</button>
      <button id="ynNo" class="gm-btn sec" type="button">NO, VOLVER</button>
    </div>`;
  (uiHost() || document.body).appendChild(m);
  m.querySelector('#ynYes').addEventListener('click', () => { m.remove(); if (onYes) onYes(); });
  m.querySelector('#ynNo').addEventListener('click', () => { m.remove(); if (onNo) onNo(); });
}

/* ---------- Botones de las pasivas INCONFORMISTA y HERRERO ---------- */
function rerollCost() { const C = DATOS_JUEGO.CARTAS_210.INCONFORMISTA; return C.COSTE_BASE + C.COSTE_POR_USO * (STATE.rerollCount || 0); }
function updatePerkActions() {
  const host = document.getElementById('perkActions'), br = document.getElementById('rerollPerkBtn'), bs = document.getElementById('smithPerkBtn');
  if (!host || !br || !bs) return;
  const climax = isClimaxActive();
  const showR = !!STATE.perks.inconformista && !climax, showS = (STATE.perks.herrero || 0) > 0 && !climax;
  br.classList.toggle('hidden', !showR); bs.classList.toggle('hidden', !showS);
  host.classList.toggle('hidden', !(showR || showS));
  const c = document.getElementById('rerollPerkCost'); if (c) c.textContent = rerollCost() + ' GP';
  br.disabled = STATE.gold < rerollCost();
  br.title = helpPasiva('inconformista', { n: rerollCost() }); bs.title = helpPasiva('herrero');
  _pkKey = '';
}
// [0.42] Coloca los dos botones de icono a los lados del cofre grande (coordenadas del lienzo = píxeles del marco)
let _pkKey = '';
function placePerkSide(ccx, ccy, dw, dh) {
  const host = document.getElementById('perkActions'); if (!host || host.classList.contains('hidden')) return;
  const busy = !!(minigameInProgress || !mainScreenFree()); if (host._busy !== busy) { host._busy = busy; host.style.visibility = busy ? 'hidden' : 'visible'; }
  const key = [Math.round(ccx), Math.round(ccy), Math.round(dw)].join(',');
  if (key === _pkKey) return; _pkKey = key;
  const W = (document.getElementById('roomCanvas') || {}).width || 360, bw = 46, gap = 8, y = Math.round(ccy - bw / 2);
  const br = document.getElementById('rerollPerkBtn'), bs = document.getElementById('smithPerkBtn');
  if (br) { br.style.left = Math.max(4, Math.round(ccx - dw / 2 - gap - bw)) + 'px'; br.style.top = y + 'px'; }
  if (bs) { bs.style.left = Math.min(W - bw - 4, Math.round(ccx + dw / 2 + gap)) + 'px'; bs.style.top = y + 'px'; }
}
window.addEventListener('resize', () => { _pkKey = ''; });
function perkActionsBusy() { return minigameInProgress || isLootProcessing || document.getElementById('cofradiaModal') || !mainScreenFree(); }

(function () {
  const br = document.getElementById('rerollPerkBtn'), bs = document.getElementById('smithPerkBtn');
  if (br) br.addEventListener('click', () => {
    if (perkActionsBusy() || !STATE.perks.inconformista) return;
    const cost = rerollCost();
    if (STATE.gold < cost) { try { audio.playBreak(); } catch (e) {} showPersistentFeedback(`⚠️ Necesitas ${cost} GP para cambiar los cofres.`); return; }
    STATE.gold -= cost; STATE.rerollCount = (STATE.rerollCount || 0) + 1;
    try { audio.init(); audio.playClick(0.9); } catch (e) {}
    updateUI();
    showPersistentFeedback(`🔄 Inconformista: has pagado ${cost} GP y los cofres cambian. El próximo cambio costará ${rerollCost()} GP.`);
    chestMutateFx(() => generateScreenChests());
  });
  if (bs) bs.addEventListener('click', () => { if (perkActionsBusy() || !(STATE.perks.herrero > 0)) return; openSmith(); });
})();

/* ---------- HERRERO: reciclaje en cualquier sitio ---------- */
const SMITH_TOOLS = [
  { prop: 'proPicks', name: 'Pin de Acero', ic: 'ic_pin', minLvl: () => 2 },
  { prop: 'usb', name: 'Llave USB', ic: 'ic_usb', minLvl: () => 3 },
  { prop: 'valves', name: 'Válvula Hidráulica', ic: 'ic_valvula', minLvl: () => valvesShopLevel() },
  { prop: 'batteries', name: 'Pila', ic: 'ic_pila', unlocked: 'batteries' },
  { prop: 'fuses', name: 'Fusible', ic: 'ic_fusible', unlocked: 'fuses' }
];
// Tarifa del Herrero para una herramienta según su nivel (casillas sin rellenar: coge la anterior; recibe lo que da el Duende)
function smithRate(prop) {
  const lvl = Math.min(STATE.perks.herrero || 1, 3), T = (DATOS_JUEGO.ECONOMIA.HERRERO || {})[prop] || {};
  let cell = null;
  for (let l = lvl; l >= 1 && !cell; l--) if (T[l]) cell = T[l];
  const duende = ((DATOS_JUEGO.ECONOMIA.RECICLAJE.otorgadas || {})[prop]) || DATOS_JUEGO.ECONOMIA.RECICLAJE.herramientas_otorgadas;
  return { g: (cell && cell.g) ? +cell.g : 4, r: (cell && cell.r) ? +cell.r : duende };
}
// [0.42] Fragua en pixel art (88x60 px lógicos): yunque detallado, pieza al rojo, martillo que golpea de verdad, chispas. Devuelve { strike }.
function smithForgeScene(cv) {
  const cx = cv.getContext('2d'), W = 88, H = 60, AX = 7, AY = 27, TX = AX + 44, TOP = AY - 3;
  let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const PAL = { K: '#100c16', D: '#241f2e', M: '#3a3445', L: '#565063', H: '#8a8397', W: '#d6d0df', R: '#7a3412', P: '#f08a3c', O: '#f97316', Y: '#ffe9a8', B: '#6b4423', N: '#3a2010', Q: '#a36a36' };
  const AW = 75, AH = 32, sol = []; for (let y = 0; y < AH; y++) { sol.push([]); for (let x = 0; x < AW; x++) sol[y].push(0); }
  (function () {
    const fill = (x0, x1, y) => { for (let x = Math.max(0, Math.round(x0)); x <= Math.min(AW - 1, Math.round(x1)); x++) sol[y][x] = 1; };
    for (let y = 0; y <= 5; y++) fill(18, 74, y);
    for (let x = 0; x < 18; x++) { const t = (18 - x) / 18, yc = 3 + 4 * t * t, h = 0.5 + 2.9 * Math.pow(x / 18, 0.8); for (let y = Math.round(yc - h); y <= Math.round(yc + h); y++) if (y >= 0 && y < AH) sol[y][x] = 1; }
    fill(20, 70, 6); fill(23, 66, 7); fill(26, 60, 8);
    for (let y = 9; y <= 19; y++) { const hw = 13 - 3.2 * Math.sin(Math.PI * (y - 9) / 10); fill(42 - hw, 42 + hw, y); }
    fill(27, 57, 20); fill(26, 58, 21); fill(24, 60, 22); fill(19, 65, 23);
    for (let y = 24; y <= 31; y++) { const hw = 21 + Math.round((y - 24) * 0.5); fill(42 - hw, 42 + hw, y); }
  })();
  const S = (x, y) => x >= 0 && y >= 0 && x < AW && y < AH && sol[y][x] === 1;
  const anv = document.createElement('canvas'); anv.width = AW; anv.height = AH; const ag = anv.getContext('2d');
  for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) {
    if (!S(x, y)) continue;
    let up = 0, le = 0, ri = 0, dn = 0;
    while (S(x, y - 1 - up)) up++; while (S(x - 1 - le, y)) le++; while (S(x + 1 + ri, y)) ri++; while (S(x, y + 1 + dn)) dn++;
    let k = 'M';
    if (up === 0) k = (x >= 18) ? 'W' : 'H'; else if (up === 1) k = 'H'; else if (up <= 3) k = 'L'; else k = 'M';
    if (le <= 1 && up > 1) k = 'L';
    if (ri <= 1 && up > 0) k = 'D';
    if (dn === 0 && up > 0) k = 'D';
    if (dn === 1 && k !== 'D' && y > 6) k = (k === 'L') ? 'M' : 'D';
    if (y === 6 || y === 7) { k = (y === 6) ? 'M' : 'D'; if (le <= 1) k = 'L'; }
    if (y === 23 && x >= 19 && x <= 65) k = 'L';
    if (y >= 24 && y <= 25 && k !== 'D') k = 'M';
    const edge = (!S(x - 1, y) || !S(x + 1, y) || !S(x, y - 1) || !S(x, y + 1));
    if (edge && !(up === 0 && S(x - 1, y) && S(x + 1, y))) k = 'K';
    if (k !== 'K') {
      const dxw = Math.abs(x - 44);
      if (y <= 2 && dxw <= 12 && (k === 'W' || k === 'H') && rnd() < .5) k = 'P';
      else if (y >= 24 && x < 30 && rnd() < .35) k = 'R';
      else if (k === 'M' && rnd() < .14) k = 'L';
      else if (k === 'D' && rnd() < .14) k = 'M';
    }
    ag.fillStyle = PAL[k]; ag.fillRect(x, y, 1, 1);
  }
  ag.fillStyle = PAL.K; ag.fillRect(62, 0, 3, 1); ag.fillRect(62, 1, 3, 2); ag.fillRect(54, 0, 1, 2);
  ag.fillStyle = PAL.D; ag.fillRect(63, 1, 1, 1);
  ag.fillStyle = PAL.W; for (let x = 22; x <= 72; x += 5) ag.fillRect(x, 0, 2, 1);
  ag.fillStyle = PAL.H; ag.fillRect(31, 3, 3, 1); ag.fillRect(49, 2, 4, 1); ag.fillRect(68, 3, 2, 1);
  ag.fillStyle = PAL.K; ag.fillRect(37, 4, 2, 1); ag.fillRect(58, 3, 1, 1);
  // martillo (sprite local rotado por mapeo inverso)
  const HL = 24, HH = 9, HW = 10, PXc = TX, PYc = TOP - (HL + HH);
  const hamColor = (lx, ly) => {
    if (ly >= 0 && ly < HL && lx >= -2 && lx < 2) { let c = lx < -0.8 ? 'Q' : (lx < 0.8 ? 'B' : 'N'); if (Math.floor(ly) % 5 === 0 && ly > HL - 9) c = 'N'; return c; }
    if (ly >= HL - 1 && ly < HL + HH && lx >= -HW && lx < HW) {
      const r = ly - (HL - 1), isEdge = (lx < -HW + 1.1 || lx >= HW - 1.1 || r < 1 || ly >= HL + HH - 1);
      if (isEdge) return 'K'; if (r < 2.2) return 'W'; if (r < 3.6) return (lx < -HW + 3) ? 'H' : 'L';
      if (lx < -HW + 2.4) return 'L'; if (lx >= HW - 2.6) return 'D'; return (r > 5) ? 'D' : 'M';
    }
    return null;
  };
  const ham = { st: 'idle', t0: 0 }, sp = [], REST = -40;
  let squash = 0, shakeAt = 0, heatEl = null;
  const impact = () => {
    squash = shakeAt = performance.now();
    for (let i = 0; i < 70; i++) { const a = -Math.PI * (0.05 + Math.random() * 0.9), v = 0.55 + Math.random() * 1.3; sp.push({ x: TX - 7 + Math.random() * 14, y: TOP, vx: Math.cos(a) * v * 1.5, vy: Math.sin(a) * v * 1.5 - 0.3, l: 0, m: 34 + Math.random() * 34, big: Math.random() < .25 }); }
    if (heatEl) { heatEl.classList.add('flash'); setTimeout(() => heatEl && heatEl.classList.remove('flash'), 140); }
  };
  const angAt = now => {
    if (ham.st === 'idle') return REST;
    const t = now - ham.t0;
    if (ham.st === 'wind') { if (t >= 110) { ham.st = 'hit'; ham.t0 = now; return REST - 6; } return REST - 6 * (t / 110); }
    if (ham.st === 'hit') { if (t >= 85) { ham.st = 'rest'; ham.t0 = now; impact(); return 0; } const u = t / 85; return (REST - 6) * (1 - u * u); }
    if (ham.st === 'rest') { if (t >= 420) { ham.st = 'idle'; return REST; } const v = Math.min(1, t / 420), e = 1 - Math.pow(1 - v, 3); if (t < 70) return 0; return REST * e; }
    return REST;
  };
  const drawBar = () => {
    const now = performance.now(), sq = (now - squash < 110), wl = sq ? 20 : 18, th = sq ? 2 : 3, x0 = TX - wl / 2, y0 = AY - th;
    for (let i = 0; i < wl; i++) { const d = Math.abs(i - (wl - 1) / 2) / ((wl - 1) / 2); for (let j = 0; j < th; j++) { let k = d < .35 ? 'Y' : d < .75 ? 'O' : 'R'; if (j === 0 && d < .6 && !sq) k = 'Y'; if (j === th - 1 && d > .35) k = d < .75 ? 'O' : 'R'; cx.fillStyle = PAL[k]; cx.fillRect(x0 + i, y0 + j, 1, 1); } }
    cx.globalAlpha = .5; cx.fillStyle = PAL.P; cx.fillRect(x0 + 2, AY, wl - 4, 1); cx.globalAlpha = 1;
  };
  const drawHammer = ang => {
    const th = ang * Math.PI / 180, c = Math.cos(th), sn = Math.sin(th);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const dx = x + 0.5 - PXc, dy = y + 0.5 - PYc, lx = dx * c + dy * sn, ly = -dx * sn + dy * c, col = hamColor(lx, ly); if (col) { cx.fillStyle = PAL[col]; cx.fillRect(x, y, 1, 1); } }
  };
  let last = 0, alive = true;
  const frame = now => {
    if (!alive || !cv.isConnected) return;
    const dt = Math.min(40, now - (last || now)) / 16.7; last = now;
    cx.clearRect(0, 0, W, H);
    cx.save(); cx.translate(0, (now - shakeAt < 70) ? 1 : 0);
    cx.drawImage(anv, AX, AY); drawBar(); drawHammer(angAt(now));
    cx.restore();
    if (Math.random() < 0.26 * dt) sp.push({ x: TX - 8 + Math.random() * 16, y: TOP - 1, vx: (Math.random() - .5) * 0.18, vy: -(0.12 + Math.random() * 0.3), l: 0, m: 60 + Math.random() * 70, big: Math.random() < .2, amb: true });   // [0.42] más chispitas que suben
    for (let i = sp.length - 1; i >= 0; i--) {
      const q = sp[i]; q.l += dt; q.vy += (q.amb ? -0.002 : 0.045) * dt; q.x += q.vx * dt; q.y += q.vy * dt;
      if (q.l > q.m || q.y > H || q.x < 0 || q.x > W) { sp.splice(i, 1); continue; }
      const f = q.l / q.m; cx.fillStyle = f < .35 ? PAL.Y : f < .7 ? PAL.O : PAL.R; cx.fillRect(Math.round(q.x), Math.round(q.y), q.big && f < .5 ? 2 : 1, 1);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  return {
    setHeat(el) { heatEl = el; },
    strike() { if (ham.st !== 'idle' && ham.st !== 'rest') return; ham.st = 'wind'; ham.t0 = performance.now(); },
    stop() { alive = false; }
  };
}

function openSmith() {
  document.querySelectorAll('#smithModal').forEach(e => e.remove());
  const m = document.createElement('div');
  m.id = 'smithModal';
  m.className = 'smith-stage';
  (uiHost() || document.body).appendChild(m);
  const lite = (typeof PERF !== 'undefined' && PERF.lagging && PERF.lagging());
  let scene = null, built = false;
  const paint = () => {
    const list = SMITH_TOOLS.filter(t => STATE.level >= (t.minLvl ? t.minLvl() : 1) && (!t.unlocked || toolUnlocked(t.unlocked)));
    if (!list.length) list.push(SMITH_TOOLS[0]);
    const pickSp = (typeof shopImg === 'function') ? shopImg('ic_ganzua') : '';
    const rows = list.map(t => {
      const r = smithRate(t.prop), poor = STATE.picks < r.g;
      const src = (typeof shopImg === 'function') ? shopImg(t.ic) : '';
      return `<div class="sm-row${poor ? ' poor' : ''}"><div class="sm-it">${src ? `<img src="${src}" alt="">` : ''}</div><div class="sm-tx"><div class="sm-nm">${t.name} +${r.r}</div><div class="sm-have">Tienes <i>${STATE[t.prop] || 0}</i></div></div><button type="button" class="sm-buy" data-prop="${t.prop}"${poor ? ' disabled' : ''}>${pickSp ? `<img src="${pickSp}" alt="">` : ''}<span>${r.g} Ganzúas</span></button></div>`;
    }).join('');
    if (!built) {
      built = true;
      m.innerHTML = `<div class="sm-forge"><canvas class="sm-scene" width="88" height="60"></canvas><div class="sm-heat"></div></div>
        <div class="sm-card"><i class="rv a"></i><i class="rv b"></i><i class="rv c"></i><i class="rv d"></i>
          <div class="sm-hd"><i class="fa-solid fa-hammer"></i><h1>EL HERRERO</h1><span class="sm-lv">Lv.${STATE.perks.herrero}</span></div>
          <p class="sm-sub">Cambia ganzúas por herramientas, donde sea. Tienes <b id="smPk">${STATE.picks}</b> ganzúas.</p>
          <div class="sm-rows" id="smRows">${rows}</div>
          <button id="smithClose" class="sm-close" type="button">CERRAR</button></div>`;
      // ascuas que suben por toda la pantalla, también por encima de las filas de reciclaje
      const nE = lite ? 16 : 34;
      for (let i = 0; i < nE; i++) { const e = document.createElement('i'); e.className = 'sm-ember' + (i % 4 === 0 ? ' big' : ''); e.style.left = (4 + Math.random() * 92) + '%'; e.style.setProperty('--d', (3.6 + Math.random() * 4.4) + 's'); e.style.setProperty('--dx', (Math.random() * 70 - 35) + 'px'); e.style.animationDelay = (-Math.random() * 8) + 's'; m.appendChild(e); }
      scene = smithForgeScene(m.querySelector('.sm-scene')); scene.setHeat(m.querySelector('.sm-heat'));
      m.querySelector('#smithClose').addEventListener('click', () => { if (scene) scene.stop(); m.remove(); });
      m.addEventListener('click', e => {
        const b = e.target.closest('.sm-buy'); if (!b || b.disabled) return;
        const prop = b.getAttribute('data-prop'), r = smithRate(prop);
        if (STATE.picks < r.g) return;
        STATE.picks -= r.g; STATE[prop] += r.r;
        try { achEvent('recycle', r.g); } catch (er) {}   // [0.42] logro de ganzúas recicladas
        try { audio.init(); audio.playClick(0.9); } catch (er) {}
        updateUI(); paint(); if (scene) scene.strike();
      });
    } else {
      m.querySelector('#smRows').innerHTML = rows;
      const pk = m.querySelector('#smPk'); if (pk) pk.textContent = STATE.picks;
    }
  };
  paint();
}

/* ---------- Cartas tácticas nuevas ---------- */
// Cambia los cofres de la pantalla (RE-ROLL)
(function () {
  const b = document.getElementById('abilityRerollBtn');
  if (b) b.addEventListener('click', () => {
    if (!(STATE.abilities.reroll > 0) || perkActionsBusy() || isClimaxActive()) return;
    STATE.abilities.reroll--;
    try { audio.init(); audio.playClick(0.9); } catch (e) {}
    updateUI();
    showPersistentFeedback('🔀 RE-ROLL: los cofres cambian por otros aleatorios.');
    chestMutateFx(() => generateScreenChests());
  });
  const p = document.getElementById('abilityPulseraBtn');
  if (p) p.addEventListener('click', () => {
    if (!(STATE.abilities.pulsera > 0) || STATE.pulseraLeft > 0 || perkActionsBusy() || isClimaxActive()) return;
    STATE.abilities.pulsera--;
    STATE.pulseraLeft = DATOS_JUEGO.CARTAS_210.PULSERA_VIP.COFRES;
    try { audio.init(); audio.playUnlockFanfare('epico'); } catch (e) {}
    updateUI();
    showPersistentFeedback(`🎟️ PULSERA VIP: los próximos ${STATE.pulseraLeft} intentos son de cofres épicos o legendarios y no necesitas herramientas.`);
    chestMutateFx(() => generateScreenChests());
  });
  const r = document.getElementById('abilityRuletaBtn');
  if (r) r.addEventListener('click', () => {
    if (!(STATE.abilities.ruleta > 0) || perkActionsBusy() || isClimaxActive()) return;
    STATE.abilities.ruleta--;
    updateUI();
    openRouletteOnly();
  });
})();

// Ruleta de wildcards fuera de la subida de nivel (carta RULETA)
function openRouletteOnly() {
  const lm = document.getElementById('levelUpModal'), bn = document.getElementById('wildcardBanner');
  const nextBtn = document.getElementById('wildcardNextBtn'), choices = document.getElementById('levelUpChoices');
  if (!lm || !bn || !nextBtn) return;
  lvlClearTimers();
  const hdr = lm.querySelector('h2');
  const sub = hdr && hdr.previousElementSibling;
  const saved = { sub: sub ? sub.textContent : '', h: hdr ? hdr.textContent : '' };
  if (sub) sub.textContent = '¡TIRADA EXTRA!';
  if (hdr) { hdr.classList.remove('rainbow-text'); hdr.textContent = 'RULETA'; }
  if (choices) choices.classList.add('hidden');
  nextBtn.classList.remove('hidden'); nextBtn.classList.add('invisible');
  bn.innerHTML = (typeof wcFirstSpinHtml === 'function') ? wcFirstSpinHtml() : ''; bn.className = 'wcard-host lvl-card-spin'; bn.style.minHeight = 'min(300px, 40vh)';
  lm.style.overflowY = 'hidden'; lm.classList.remove('hidden');
  try { audio.init(); audio.playLevelUpFanfare(); } catch (e) {}
  const res = pickWildcard();
  updateUI();
  lvlTimers.push(setTimeout(() => runWildcardRoulette(res, () => {
    nextBtn.classList.remove('invisible');
    nextBtn.onclick = () => {
      try { audio.playUiClick(); } catch (e) {}
      lm.classList.add('hidden'); bn.classList.add('hidden');
      if (sub) sub.textContent = saved.sub; if (hdr) { hdr.textContent = saved.h; hdr.classList.add('rainbow-text'); }
      updateUI();
      processNextQueuedEvent();
    };
  }), 700));
}

// Hallazgo Táctico+: tres cartas tácticas, eliges n
function openTacticPicker(n) {
  const lm = document.getElementById('levelUpModal'), bn = document.getElementById('wildcardBanner');
  const nextBtn = document.getElementById('wildcardNextBtn'), choices = document.getElementById('levelUpChoices');
  const grid = document.getElementById('levelUpCardsGrid') || document.getElementById('chestChoicesGrid');
  if (!lm || !grid) { processNextQueuedEvent(); return; }
  lvlClearTimers();
  const hdr = lm.querySelector('h2'), sub = hdr && hdr.previousElementSibling;
  const saved = { sub: sub ? sub.textContent : '', h: hdr ? hdr.textContent : '' };
  if (sub) sub.textContent = 'HALLAZGO TÁCTICO+';
  if (hdr) { hdr.classList.remove('rainbow-text'); hdr.textContent = `ELIGE ${n}`; }
  bn.classList.add('hidden'); nextBtn.classList.add('hidden');
  const label = choices.querySelector('div'); const savedLabel = label ? label.textContent : '';
  if (label) label.textContent = `Elige ${n} cartas tácticas:`;
  choices.classList.remove('hidden');
  grid.innerHTML = '';
  const pool = shuffleU(levelCardPool(true)).slice(0, 3);
  let left = Math.min(n, pool.length);
  pool.forEach(cd => {
    const el = document.createElement('button');
    el.className = 'lvl-chest group cursor-pointer active:scale-95 transition-transform';
    const art = makeChestArt();
    el.innerHTML = `
      <div class="lvl-chest-glow"></div>
      <div class="lvl-sparks"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="lvl-chest-back" style="background-image:url('${art.back}')"></div>
      <div class="lvl-card bg-slate-900 border border-indigo-500/60 rounded-xl flex items-center gap-2.5 text-left shadow-xl group-hover:border-indigo-300">
        <div class="w-10 h-10 flex-none rounded-xl bg-indigo-950 border border-indigo-500 flex items-center justify-center text-indigo-400 text-lg"><i class="fa-solid ${cd.icono}"></i></div>
        <div class="min-w-0">
          <span class="text-[9px] font-extrabold font-mono uppercase px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded-full border border-indigo-800">${cd.tipo}</span>
          <div class="text-white font-black text-xs mt-1">${cd.titulo}</div>
          <div class="text-[10px] text-slate-400 font-mono mt-0.5">${cd.desc}</div>
        </div>
      </div>
      <div class="lvl-chest-front" style="background-image:url('${art.front}')"></div>`;
    el.addEventListener('click', () => {
      if (el.dataset.taken) return;
      el.dataset.taken = '1'; el.style.opacity = '0.35'; el.style.pointerEvents = 'none';
      try { audio.playUnlockFanfare('raro'); } catch (e) {}
      applyLevelCard(cd);
      updateUI();
      left--;
      if (label) label.textContent = left > 0 ? `Elige ${left} más:` : '';
      if (left <= 0) {
        setTimeout(() => {
          lm.classList.add('hidden'); choices.classList.add('hidden');
          if (sub) sub.textContent = saved.sub; if (hdr) { hdr.textContent = saved.h; hdr.classList.add('rainbow-text'); }
          if (label) label.textContent = savedLabel;
          updateUI();
          processNextQueuedEvent();
        }, 450);
      }
    });
    grid.appendChild(el);
  });
  lm.style.overflowY = 'auto'; lm.classList.remove('hidden');
  [...grid.children].forEach((el, i) => { el.style.opacity = '0'; setTimeout(() => { el.style.opacity = ''; el.classList.add('lvl-chest-in'); try { audio.playCardRise(); } catch (e) {} }, 120 + i * 260); });
}
