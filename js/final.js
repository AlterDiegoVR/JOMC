// ==========================================================================
// JUST ONE MORE CHEST — final.js — VERSIÓN 0.3
// final del bucle 3: los dos cofres (Tienda y Sellado), el cerrojo de la tienda (ruleta + 6 puzles), el cofre sellado (3 palabras) y los dos finales (provisionales)
// Todos los textos y números están en DATOS_JUEGO.FINAL3 (datos.js). Este archivo solo tiene la lógica.
// ==========================================================================

const FIN_RT = { sel: null, order: [], idx: 0, seals: 0, active: false, timers: [], anim: null, frame: 0 };   // estado de ejecución (no se guarda)
// STATE.finalPhase (sí se guarda): null | { stage: 'armed' | 'choice' | 'puzzles' | 'sealed', tries, tiendaLocked, selladoLocked, wedge }

function finCfg() { return DATOS_JUEGO.FINAL3; }
function finT(key, n) { const t = (finCfg().TEXTOS || {})[key]; return typeof t === 'string' ? t.replace('{n}', n != null ? n : '') : t; }
function finArt(k) { return (typeof ASSETS !== 'undefined' && ASSETS.final && ASSETS.final[k]) || ''; }
function finalLoop3() { return (STATE.currentLoop || 1) >= 3; }
function finalLocked() { const f = STATE.finalPhase; return !!(f && (f.stage === 'choice' || f.stage === 'puzzles' || f.stage === 'sealed')); }
function finalPuzzleMode() { return !!FIN_RT.active; }
function finLater(fn, ms) { const t = setTimeout(() => { FIN_RT.timers = FIN_RT.timers.filter(x => x !== t); fn(); }, ms); FIN_RT.timers.push(t); return t; }
function finClearTimers() { FIN_RT.timers.forEach(clearTimeout); FIN_RT.timers = []; }
function finEl(cls, html, id) { const d = document.createElement('div'); d.className = cls; if (id) d.id = id; if (html != null) d.innerHTML = html; return d; }
function finRemove(id) { const e = document.getElementById(id); if (e) e.remove(); }

/* ---------- Armado en el cofre 79 y aparición de los dos cofres ---------- */
function finalArm() {
  STATE.finalPhase = { stage: 'armed', tries: finCfg().INTENTOS, tiendaLocked: false, selladoLocked: false, wedge: -1 };
  saveDirty = true;
}
// Gancho del cofre abierto (cofres.js): en el 79 habla el Trapero; en la siguiente aparición de la tienda salen los dos cofres
function finalHook(co) {
  const seq = DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA, f = STATE.finalPhase;
  if (co === seq.COFRE_INICIO_TRAPERO && !f) {
    finalArm();
    (finCfg().REVELACION || []).forEach((txt, i, arr) => {
      STATE.eventQueue.push(() => triggerSequentialDialogue('EL TRAPERO', txt, 'fa-mask', i === 0 ? 'Advertencia' : 'Instrucción', 'text-rose-400', null, () => processNextQueuedEvent()));
    });
    return;
  }
  const freq = DATOS_JUEGO.PROGRESIÓN.INTERVALOS_VISITAS.DUENDE_INTERVALO;
  if (f && f.stage === 'armed' && co > seq.COFRE_INICIO_TRAPERO && co % freq === 0) STATE.eventQueue.push(() => finalStart());
}
function finalStart() {
  const f = STATE.finalPhase; if (!f) return;
  f.stage = 'choice'; saveDirty = true;
  try { clearPlayerNotes(); } catch (e) {}
  finShowChoice();
}
// Al cargar una partida guardada en pleno final: vuelve a la pantalla de los dos cofres
function finalResume() {
  const f = STATE.finalPhase;
  if (f && (f.stage === 'choice' || f.stage === 'puzzles' || f.stage === 'sealed')) { f.stage = 'choice'; finShowChoice(); }
}

/* ---------- Pantalla de los dos cofres ---------- */
function finShowChoice() {
  const f = STATE.finalPhase; if (!f) return;
  f.stage = 'choice';
  finClearTimers(); FIN_RT.active = false; FIN_RT.sel = null;
  ['finalLock', 'finalSealed', 'finalHud'].forEach(finRemove);
  uiHost().classList.add('final-on');
  STATE.screenChests = [];
  let ov = document.getElementById('finalChoice');
  if (!ov) {
    ov = finEl('fin-choice', `
      <div class="fc-row">
        <button type="button" class="fc-chest" data-k="tienda"><span class="fc-spr" style="background-image:url('${finArt('tienda')}')"></span><i class="fc-lock">🔒</i></button>
        <button type="button" class="fc-chest" data-k="sellado"><span class="fc-spr" style="background-image:url('${finArt('sellado')}')"></span><i class="fc-lock">🔒</i></button>
      </div>
      <div class="fc-cartel">
        <div class="fc-title"></div>
        <div class="fc-sub"></div>
        <button type="button" class="fc-go"></button>
      </div>`, 'finalChoice');
    uiHost().appendChild(ov);
    ov.querySelectorAll('.fc-chest').forEach(b => b.addEventListener('click', () => { try { audio.init(); audio.playUiClick(); } catch (e) {} finSelect(b.dataset.k); }));
    ov.querySelector('.fc-go').addEventListener('click', () => { if (FIN_RT.sel) finOpen(FIN_RT.sel); });
  }
  ov.classList.remove('hidden');
  FIN_RT.frame = 0;
  clearInterval(FIN_RT.anim);
  FIN_RT.anim = setInterval(() => {
    FIN_RT.frame = (FIN_RT.frame + 1) % 8;
    ov.querySelectorAll('.fc-spr').forEach(e => { e.style.backgroundPosition = (FIN_RT.frame * 100 / 7) + '% 0'; });
  }, 140);
  finPaintChoice();
  saveDirty = true;
}
function finHideChoice() {
  clearInterval(FIN_RT.anim); FIN_RT.anim = null;
  const ov = document.getElementById('finalChoice'); if (ov) ov.classList.add('hidden');
}
function finSelect(k) {
  const f = STATE.finalPhase; if (!f) return;
  const locked = k === 'tienda' ? f.tiendaLocked : f.selladoLocked;
  if (FIN_RT.sel === k && !locked) { finOpen(k); return; }
  FIN_RT.sel = k; finPaintChoice();
}
function finPaintChoice() {
  const f = STATE.finalPhase, ov = document.getElementById('finalChoice'); if (!f || !ov) return;
  const T = finCfg().TEXTOS, sel = FIN_RT.sel;
  ov.querySelectorAll('.fc-chest').forEach(b => {
    const k = b.dataset.k, lk = k === 'tienda' ? f.tiendaLocked : f.selladoLocked;
    b.classList.toggle('sel', sel === k); b.classList.toggle('dim', !!sel && sel !== k); b.classList.toggle('locked', !!lk);
  });
  const title = ov.querySelector('.fc-title'), sub = ov.querySelector('.fc-sub'), go = ov.querySelector('.fc-go');
  let t, s, g = null;
  if (!sel) { [t, s] = T.ELIGE; }
  else if (sel === 'tienda') { if (f.tiendaLocked) [t, s] = T.BLOQ_TIENDA; else [t, s, g] = T.TIENDA; }
  else { if (f.selladoLocked) [t, s] = T.BLOQ_SELLADO; else [t, s, g] = T.SELLADO; }
  title.textContent = t; sub.textContent = s;
  go.classList.toggle('hidden', !g); if (g) go.textContent = g;
}
function finOpen(k) {
  const f = STATE.finalPhase; if (!f) return;
  if ((k === 'tienda' && f.tiendaLocked) || (k === 'sellado' && f.selladoLocked)) return;
  finHideChoice();
  if (k === 'tienda') { f.stage = 'puzzles'; FIN_RT.seals = 0; FIN_RT.idx = 0; finLockScreen(false, ''); }
  else { f.stage = 'sealed'; finSealedScreen(); }
  saveDirty = true;
}

/* ---------- Cofre-Tienda: pantalla del cerrojo, ruleta y 6 puzles ---------- */
function finLockScreen(restart, msg) {
  const f = STATE.finalPhase, T = finCfg().TEXTOS, R = finCfg().RULETA;
  try { shopArtInit(); } catch (e) {}
  finRemove('finalLock'); finRemove('finalHud');
  const ov = finEl('fin-ov fl-lock', `
    <div class="fl-stage"><div class="fl-zoom" id="flZoom">
      <img class="fl-shop" src="${shopImg('cerrado')}" alt="">
      <img id="flWheel" class="fl-wheel" src="${finArt('rueda')}" alt="">
      <img id="flPlaca" class="fl-placa" src="${finArt('placa')}" alt="">
    </div></div>
    <div class="fl-head"><div class="fl-title">${T.LOCK_TITULO}</div><div class="fl-sub" id="flSub">${msg || T.LOCK_SUB}</div><div class="fl-info" id="flInfo"></div></div>
    <div class="fl-foot"><button type="button" class="fc-go" id="flGo">${restart ? T.LOCK_BTN_REINTENTO : T.LOCK_BTN}</button><button type="button" class="fl-back" id="flBack">← VOLVER</button></div>`, 'finalLock');
  uiHost().appendChild(ov);
  finInfo();
  const zoom = ov.querySelector('#flZoom'), wheel = ov.querySelector('#flWheel'), placa = ov.querySelector('#flPlaca');
  const wedge = restart ? (FIN_RT.order[0] != null ? FIN_RT.order[0] : 0) : -1;
  if (restart) {   // ya se vio la ruleta: la placa está levantada y la rueda sigue iluminada en el primer sello
    placa.style.display = 'none';
    zoom.style.transition = 'none'; zoom.style.transform = `scale(${R.ZOOM})`;
    wheel.src = (ASSETS.final.ruedaLit || [])[wedge] || finArt('rueda');
  }
  const go = ov.querySelector('#flGo'), back = ov.querySelector('#flBack');
  back.addEventListener('click', () => { if (restart) return; finShowChoice(); });
  if (restart) back.classList.add('hidden');
  go.addEventListener('click', () => {
    try { audio.init(); } catch (e) {}
    go.disabled = true; back.classList.add('hidden'); go.classList.add('hidden');
    if (restart) { finRunPuzzle(); return; }
    finRoulette(ov, zoom, wheel, placa);
  });
}
function finInfo() {
  const f = STATE.finalPhase, T = finCfg().TEXTOS;
  const txt = `${T.INTENTOS}: ${f ? f.tries : 0} · ${T.SELLO.replace('{n}', Math.min(6, FIN_RT.seals + 1))}`;
  const a = document.getElementById('flInfo'); if (a) a.textContent = txt;
}
function finRoulette(ov, zoom, wheel, placa) {
  const R = finCfg().RULETA, f = STATE.finalPhase;
  const w = Math.floor(Math.random() * 6);
  f.wedge = w; FIN_RT.order = [0, 1, 2, 3, 4, 5].map(i => (w + i) % 6);
  try { audio.playShutter(); } catch (e) {}
  placa.style.transition = 'transform 1.15s cubic-bezier(.45,.05,.8,.35)'; void placa.offsetWidth;
  placa.style.transform = 'rotate(-150deg)';
  finLater(() => { placa.style.transition = 'opacity .35s'; placa.style.opacity = '0'; }, 1200);
  finLater(() => {
    zoom.style.transition = `transform ${R.ZOOM_MS}ms cubic-bezier(.4,0,.2,1)`; zoom.style.transform = `scale(${R.ZOOM})`;
  }, 1450);
  const lits = ASSETS.final.ruedaLit || [];
  let t0 = 1450 + R.ZOOM_MS + 350;
  const N = R.PASOS;
  for (let k = 0; k < N; k++) {
    const idx = (((w - (N - 1 - k)) % 6) + 6) % 6;
    const d = R.MS_INICIO + (R.MS_FINAL - R.MS_INICIO) * Math.pow(k / (N - 1), 2);
    finLater(() => { wheel.src = lits[idx] || finArt('rueda'); try { audio.playRouletteTick(k / N); } catch (e) {} }, t0);
    t0 += d;
  }
  for (let b = 0; b < R.PARPADEOS; b++) {
    finLater(() => { wheel.src = (b % 2 === 0) ? finArt('rueda') : lits[w]; try { audio.playClick(0.3); } catch (e) {} }, t0);
    t0 += R.PARPADEO_MS;
  }
  finLater(() => { wheel.src = lits[w]; try { audio.playUnlockFanfare('raro'); } catch (e) {} }, t0);
  const sub = document.getElementById('flSub');
  finLater(() => { if (sub) sub.textContent = finCfg().NOMBRES_CUNAS[w]; }, 1450 + R.ZOOM_MS + 350 + 400);
  finLater(() => finRunPuzzle(), t0 + 1000);
}
function finHud() {
  let h = document.getElementById('finalHud');
  if (!h) { h = finEl('fin-hud', '', 'finalHud'); uiHost().appendChild(h); }
  const f = STATE.finalPhase, T = finCfg().TEXTOS;
  let pips = '';
  for (let i = 0; i < 6; i++) pips += `<i class="${i < FIN_RT.seals ? 'on' : (i === FIN_RT.seals ? 'cur' : '')}"></i>`;
  h.innerHTML = `<div class="fh-pips">${pips}</div><div class="fh-txt">${T.SELLO.replace('{n}', Math.min(6, FIN_RT.seals + 1))} · ${T.INTENTOS} ${f ? f.tries : 0}</div>`;
}
function finRunPuzzle() {
  const f = STATE.finalPhase; if (!f) return;
  const C = finCfg();
  const wedge = FIN_RT.order[FIN_RT.idx];
  const type = DATOS_JUEGO.COFRES.ESTANDAR.find(t => t.id === C.TIPOS_CUNAS[wedge]);
  const rarity = CHEST_RARITIES.find(r => r.id === C.RAREZA_PUZLES) || CHEST_RARITIES[2];
  const lock = document.getElementById('finalLock'); if (lock) lock.classList.add('hidden');
  FIN_RT.active = true;
  STATE.screenChests = [{ type, rarity }]; STATE.activeChestIdx = 0;
  ['lockpickContainer', 'tumblerContainer', 'hackContainer', 'pipeContainer', 'sequenceContainer', 'fuseContainer'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });
  const staleHelp = document.getElementById('pipeAdvancedHelp'); if (staleHelp) staleHelp.remove();
  const mt = document.getElementById('minigameTitle'); if (mt) mt.textContent = C.NOMBRES_CUNAS[wedge];
  pzHardBadgeUpdate();
  { const mm0 = document.getElementById('minigameModal'); if (mm0) mm0.classList.remove('pz-seq'); }
  mentiraPuzzle = false; masterKeyActive = false; sedaPuzzle = false; puzzleToolPaid = null; puzzleStat = null;
  setPuzzleBackground(type.juego);
  if (type.juego === 'lockpick') startLockpickGame();
  else if (type.juego === 'tumbler') startTumblerGame();
  else if (type.juego === 'hack') startHackGame();
  else if (type.juego === 'pipe') startPipeGame();
  else if (type.juego === 'sequence') startSequenceGame();
  else if (type.juego === 'fuses') startFuseGame();
  minigameInProgress = true; humHoldChest = STATE.screenChests[0];
  const mm = document.getElementById('minigameModal'); if (mm) mm.classList.remove('hidden');
  pzFit();
  finHud();
  saveDirty = true;
}
// Ganar un puzle del cerrojo (lo llama triggerLootExplosion)
function finalPuzzleWon() {
  minigameInProgress = false; stopMinigameTimer(); hideAllMinigameUI();
  STATE.screenChests = [];
  FIN_RT.seals++;
  try { audio.playUnlockFanfare('raro'); screenShake(4, 220); } catch (e) {}
  if (FIN_RT.seals >= 6) { finEndBad(); return; }
  FIN_RT.idx++;
  FIN_RT.active = true;   // sigue en modo final hasta que arranque el siguiente puzle
  finHud();
  finLater(() => finRunPuzzle(), 900);
}
// Fallar (lo llama handleFailure): un fallo reinicia desde el primer puzle; sin intentos, la tienda se atasca para siempre
function finalPuzzleFailed() {
  minigameInProgress = false; stopMinigameTimer(); hideAllMinigameUI();
  const f = STATE.finalPhase; FIN_RT.active = false; STATE.screenChests = [];
  if (!f) return;
  try { audio.playBreak(); screenShake(7, 320); } catch (e) {}
  f.tries--; FIN_RT.seals = 0; FIN_RT.idx = 0; saveDirty = true;
  finRemove('finalHud');
  if (f.tries <= 0) {
    f.tiendaLocked = true; finRemove('finalLock');
    if (f.selladoLocked) { finNoExit(); return; }
    finShowChoice(); FIN_RT.sel = 'tienda'; finPaintChoice();
    showPersistentFeedback(finT('ATASCADA'));
    return;
  }
  finLockScreen(true, f.tries === 1 ? finT('FALLO_UNO') : finT('FALLO', f.tries));
}
function finNoExit() {
  STATE.finalPhase = null; finRemove('finalChoice'); finRemove('finalLock'); finRemove('finalSealed'); finRemove('finalHud');
  uiHost().classList.remove('final-on');
  showPersistentFeedback(finT('SIN_SALIDA'));
  whenBannerClosed(() => showFinalGameOver());
}

/* ---------- Cofre Sellado: reto de memoria (una palabra de cada bucle) ---------- */
function finSealedScreen() {
  const f = STATE.finalPhase, T = finCfg().TEXTOS, P = DATOS_JUEGO.CONTRASENA.BUCLES;
  finRemove('finalSealed');
  const pick = { 1: null, 2: null, 3: null };
  const cols = [1, 2, 3].map(l => `
    <div class="fs-col" data-l="${l}">
      <div class="fs-phrase">${P[l].frase}</div>
      ${P[l].palabras.map(w => `<button type="button" class="fs-word" data-w="${w}">${w}</button>`).join('')}
    </div>`).join('');
  const ov = finEl('fin-ov fs-screen', `
    <div class="fs-head"><div class="fl-title">${T.SEALED_TITULO}</div><div class="fl-sub">${T.SEALED_SUB}</div></div>
    <div class="fs-cols">${cols}</div>
    <div class="fl-foot"><button type="button" class="fc-go" id="fsGo" disabled>${T.SEALED_BTN}</button><button type="button" class="fl-back" id="fsBack">← VOLVER</button></div>`, 'finalSealed');
  uiHost().appendChild(ov);
  const go = ov.querySelector('#fsGo');
  ov.querySelectorAll('.fs-col').forEach(col => {
    col.querySelectorAll('.fs-word').forEach(b => b.addEventListener('click', () => {
      try { audio.init(); audio.playUiClick(); } catch (e) {}
      const l = +col.dataset.l;
      pick[l] = b.dataset.w;
      col.querySelectorAll('.fs-word').forEach(x => x.classList.toggle('on', x === b));
      go.disabled = !(pick[1] && pick[2] && pick[3]);
    }));
  });
  ov.querySelector('#fsBack').addEventListener('click', () => finShowChoice());
  go.addEventListener('click', () => {
    askYesNo(T.SEALED_CONFIRMA_T, T.SEALED_CONFIRMA, T.SEALED_CONFIRMA_BTN, () => {
      const pw = STATE.passWords || {};
      const ok = pw[1] === pick[1] && pw[2] === pick[2] && pw[3] === pick[3];
      if (ok) { finEndGood(); return; }
      f.selladoLocked = true; saveDirty = true;
      try { audio.playBreak(); screenShake(7, 320); } catch (e) {}
      finRemove('finalSealed');
      if (f.tiendaLocked) { finNoExit(); return; }
      finShowChoice(); FIN_RT.sel = 'sellado'; finPaintChoice();
      showPersistentFeedback(T.SEALED_FALLO);
    });
  });
}

/* ---------- Finales (pantallas PROVISIONALES) ---------- */
function finEndCommon() {
  autosaveEnabled = false; finClearTimers(); clearInterval(FIN_RT.anim);
  clearSave();
  STATE.finalPhase = null; FIN_RT.active = false;
  ['finalChoice', 'finalLock', 'finalSealed', 'finalHud'].forEach(finRemove);
}
// Limpieza total (reiniciar partida, nuevo final): quita todas las pantallas del final y los temporizadores
function finalCleanup() {
  finClearTimers(); clearInterval(FIN_RT.anim); FIN_RT.anim = null; FIN_RT.active = false; FIN_RT.sel = null;
  ['finalChoice', 'finalLock', 'finalSealed', 'finalHud', 'finalScene', 'finalBlack'].forEach(finRemove);
  const h = uiHost(); if (h) h.classList.remove('final-on', 'fin-glitch');
}
function finRestart() {
  finRemove('finalScene'); finRemove('finalBlack');
  uiHost().classList.remove('final-on', 'fin-glitch');
  resetGame(); autosaveEnabled = true; showCover();
}

// FINAL MALO: el Duende y el Trapero eran uno; el jugador se queda tras el mostrador
function finEndBad() {
  finEndCommon();
  const B = finCfg().FINAL_MALO, frame = uiHost();
  frame.classList.add('fin-glitch');
  try { audio.playGlassIrreal(); } catch (e) {}
  let i = 0;
  const next = () => {
    if (i >= B.LIBERACION.length) { frame.classList.remove('fin-glitch'); finDark(B); return; }
    const [who, txt] = B.LIBERACION[i++];
    const isT = who === 'EL TRAPERO';
    triggerSequentialDialogue(who, txt, isT ? 'fa-mask' : 'fa-hat-wizard', i > 3 ? 'Una sola voz' : 'Liberación', isT ? 'text-rose-400' : 'text-purple-300', null, () => next());
  };
  finLater(next, 900);
}
function finDark(B) {
  const black = finEl('fin-black', '<div class="fb-line"></div>', 'finalBlack'); uiHost().appendChild(black);
  const line = black.querySelector('.fb-line');
  void black.offsetWidth; black.classList.add('on');
  try { audio.playDarkOut(); } catch (e) {}
  let t = 2200;
  (B.OSCURO || []).forEach(s => {
    finLater(() => { line.textContent = s; line.classList.remove('show'); void line.offsetWidth; line.classList.add('show'); try { audio.playSoftPad(); } catch (e) {} }, t);
    t += 2800;
  });
  finLater(() => { line.classList.remove('show'); finEyelids(B); }, t + 600);
}
function finEyelids(B) {
  const sc = finEl('fin-ov fin-scene', `
    <div class="fy-you">
      <div class="fl-title">${B.TU_TITULO}</div>
      <div class="fl-sub">${B.TU_SUB}</div>
      <div class="fy-opts">${B.BIENVENIDAS.map((p, k) => `<button type="button" class="fy-opt" data-k="${k}">${p}</button>`).join('')}</div>
      <div class="fy-gold hidden"><div class="fy-say"></div><div class="fy-coins"><span id="fyGp">0</span> GP</div><div class="fy-line">${B.ORO_LINEA}</div></div>
      <div class="fy-end hidden"><div class="fy-fin">${B.FIN}</div><button type="button" class="fc-go" id="fyBack">${B.VOLVER}</button></div>
    </div>
    <div class="fy-lid top"></div><div class="fy-lid bot"></div>`, 'finalScene');
  uiHost().appendChild(sc);
  finRemove('finalBlack');
  sc.style.zIndex = 62;
  void sc.offsetWidth; try { audio.playLightOn(); } catch (e) {}
  finLater(() => sc.classList.add('open'), 400);
  sc.querySelectorAll('.fy-opt').forEach(b => b.addEventListener('click', () => {
    try { audio.init(); audio.playDialogueMelody('EL DUENDE'); } catch (e) {}
    sc.querySelector('.fy-opts').classList.add('hidden');
    const g = sc.querySelector('.fy-gold'); g.classList.remove('hidden'); g.querySelector('.fy-say').textContent = '“' + b.textContent + '”';
    let gp = 0; const el = sc.querySelector('#fyGp');
    const tick = () => { gp += Math.ceil((gp + 10) * 0.12); el.textContent = gp; try { audio.playCashRegister(); } catch (e) {} if (gp < 2000) finLater(tick, 220); else finLater(() => sc.querySelector('.fy-end').classList.remove('hidden'), 900); };
    finLater(tick, 700);
  }));
  sc.querySelector('#fyBack').addEventListener('click', finRestart);
}

// FINAL BUENO: Gafas de Ver, la puerta con luz azul de día
function finEndGood() {
  finEndCommon();
  const G = finCfg().FINAL_BUENO;
  try { audio.playUnlockFanfare('legendario'); } catch (e) {}
  const sc = finEl('fin-ov fg-scene', `
    <div class="fg-text"><i class="fa-solid fa-glasses fg-glasses hidden"></i><div class="fg-line"></div></div>
    <div class="fg-door hidden"><div class="fg-rays"></div><div class="fg-frame"><div class="fg-light"></div></div></div>
    <div class="fg-end hidden"><div class="fg-thanks">${G.GRACIAS}</div><button type="button" class="fc-go" id="fgBack">${G.VOLVER}</button></div>`, 'finalScene');
  sc.style.zIndex = 62;
  uiHost().appendChild(sc);
  const line = sc.querySelector('.fg-line'), gl = sc.querySelector('.fg-glasses');
  let t = 1000;
  G.LINEAS.forEach((s, k) => {
    finLater(() => {
      line.textContent = s; line.classList.remove('show'); void line.offsetWidth; line.classList.add('show');
      gl.classList.toggle('hidden', s !== 'GAFAS DE VER');
      try { audio.playSoftPad(); } catch (e) {}
    }, t);
    t += 3000;
  });
  finLater(() => { line.classList.remove('show'); gl.classList.add('hidden'); sc.classList.add('lit'); sc.querySelector('.fg-door').classList.remove('hidden'); try { audio.playLightOn(); } catch (e) {} }, t);
  finLater(() => sc.querySelector('.fg-end').classList.remove('hidden'), t + 3200);
  sc.querySelector('#fgBack').addEventListener('click', finRestart);
}
