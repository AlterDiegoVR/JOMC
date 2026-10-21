// ==========================================================================
// JUST ONE MORE CHEST — final.js — VERSIÓN 0.31
// final del bucle 3: los dos cofres, el cerrojo de la tienda (6 puzles con voces), el cofre sellado (3 palabras) y los dos finales (puerta de dungeon / tapa del cofre y tienda del Duende)
// Todos los textos y números están en DATOS_JUEGO.FINAL3 (datos.js). Este archivo solo tiene la lógica.
// ==========================================================================

const FIN_RT = { sel: null, order: [], idx: 0, seals: 0, active: false, timers: [], anim: null, frame: 0, ending: false };   // estado de ejecución (no se guarda)
// STATE.finalPhase (sí se guarda): null | { stage: 'armed' | 'choice' | 'puzzles' | 'sealed', tries, tiendaLocked, selladoLocked, wedge }

function finCfg() { return DATOS_JUEGO.FINAL3; }
function finT(key, n) { const t = (finCfg().TEXTOS || {})[key]; return typeof t === 'string' ? t.replace('{n}', n != null ? n : '') : t; }
function finArt(k) { return (typeof ASSETS !== 'undefined' && ASSETS.final && ASSETS.final[k]) || ''; }
function finalLoop3() { return (STATE.currentLoop || 1) >= 3; }
function finalLocked() { const f = STATE.finalPhase; return !!(FIN_RT.ending || (f && (f.stage === 'choice' || f.stage === 'puzzles' || f.stage === 'sealed'))); }   // [0.31] ending: durante los finales no se generan cofres
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
  finVoice(FIN_RT.idx);   // [0.31] voces del Duende y el Trapero durante los puzles
  saveDirty = true;
}
// Ganar un puzle del cerrojo (lo llama triggerLootExplosion)
function finalPuzzleWon() {
  minigameInProgress = false; stopMinigameTimer();
  const last = FIN_RT.seals + 1 >= 6;
  const jt = (STATE.screenChests[0] || {}).type;
  if (!last) hideAllMinigameUI();
  else {   // [0.31] el último puzle se queda a la vista (resuelto) mientras la pantalla se rompe
    const cid = jt ? ({ lockpick: 'lockpickContainer', tumbler: 'tumblerContainer', hack: 'hackContainer', pipe: 'pipeContainer', sequence: 'sequenceContainer', fuses: 'fuseContainer' })[jt.juego] : null;
    const mm = document.getElementById('minigameModal'); if (mm) mm.classList.remove('hidden');
    const ct = cid && document.getElementById(cid); if (ct) ct.classList.remove('hidden');
  }
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

/* ---------- Voces del Duende y el Trapero durante los 6 puzles (final malo) ---------- */
function finVoice(k) {
  const B = finCfg().FINAL_MALO, v = (B.VOCES || [])[k]; if (!v) return;
  finRemove('finVoice');
  const trap = v[0] === 'EL TRAPERO';
  const el = finEl('fin-voice ' + (trap ? 'trap' : 'duen'), `<b>${v[0]}</b><span>${v[1]}</span>`, 'finVoice');
  uiHost().appendChild(el);
  el.style.animationDuration = (B.VOCES_MS || 4200) + 'ms';
  try { audio.playDialogueMelody(v[0]); } catch (e) {}
  finLater(() => finRemove('finVoice'), (B.VOCES_MS || 4200) + 100);
}

/* ---------- Finales ---------- */
function finEndCommon() {
  autosaveEnabled = false; finClearTimers(); clearInterval(FIN_RT.anim);
  clearSave();
  STATE.finalPhase = null; FIN_RT.active = false; FIN_RT.ending = true; STATE.screenChests = []; uiHost().classList.add('final-on');
  ['finalChoice', 'finalLock', 'finalSealed', 'finalHud', 'finVoice'].forEach(finRemove);
}
const FIN_END_IDS = ['finalScene', 'finalBlack', 'finalCrack', 'finalMix', 'finalLid', 'finDoor', 'finDim', 'finFlood', 'finBadUI'];
// Limpieza total (reiniciar partida, nuevo final): quita todas las pantallas del final y los temporizadores
function finalCleanup() {
  finClearTimers(); clearInterval(FIN_RT.anim); FIN_RT.anim = null; FIN_RT.active = false; FIN_RT.sel = null; FIN_RT.ending = false;
  ['finalChoice', 'finalLock', 'finalSealed', 'finalHud', 'finVoice'].concat(FIN_END_IDS).forEach(finRemove);
  const h = uiHost(); if (h) h.classList.remove('final-on', 'fin-glitch', 'fin-shake');
  finBadRestoreDialogue();
}
function finRestart() {
  finalCleanup();
  resetGame(); autosaveEnabled = true; showCover();
}
// Devuelve el diálogo del Duende a su estado normal (el final malo lo usa como escenario y le quita personaje y botón)
function finBadRestoreDialogue() {
  const dm = document.getElementById('dialogueModal'); if (dm) dm.classList.add('hidden');
  const fig = document.getElementById('dlgFig'); if (fig) fig.style.display = '';
  const b = document.getElementById('closeDialogueBtn'); if (b) b.style.display = '';
}

/* ---------- FINAL MALO: el Duende y el Trapero eran uno; el jugador se queda tras el mostrador ---------- */
function finCrackSVG() {
  const f = uiHost(), r = f.getBoundingClientRect(), W = Math.round(r.width) || 412, H = Math.round(r.height) || 915;
  const cx = W * 0.5, cy = H * 0.46;
  let seed = 7; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const rays = []; for (let i = 0; i < 15; i++) rays.push(i / 15 * Math.PI * 2 + rnd() * 0.3);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">`;
  rays.forEach((a, i) => {
    const b = rays[(i + 1) % rays.length] + (i === rays.length - 1 ? Math.PI * 2 : 0), R = Math.max(W, H);
    s += `<polygon points="${cx},${cy} ${cx + Math.cos(a) * R},${cy + Math.sin(a) * R} ${cx + Math.cos(b) * R},${cy + Math.sin(b) * R}" fill="rgba(${150 + i * 6},200,255,${(0.05 + rnd() * 0.08).toFixed(3)})" transform="translate(${((rnd() - 0.5) * 6).toFixed(1)},${((rnd() - 0.5) * 6).toFixed(1)})"/>`;
  });
  rays.forEach(a => {
    let x = cx, y = cy, d = `M${x} ${y}`, ang = a; const n = 6 + Math.floor(rnd() * 5);
    for (let k = 0; k < n; k++) {
      const L = 28 + rnd() * 70; ang += (rnd() - 0.5) * 0.35; x += Math.cos(ang) * L; y += Math.sin(ang) * L; d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
      if (rnd() < 0.35) { const ba = ang + (rnd() < 0.5 ? -1 : 1) * (0.6 + rnd() * 0.5), bl = 20 + rnd() * 50; s += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${(x + Math.cos(ba) * bl).toFixed(1)} ${(y + Math.sin(ba) * bl).toFixed(1)}" stroke="rgba(235,245,255,.75)" stroke-width="1" fill="none"/>`; }
    }
    s += `<path d="${d}" stroke="rgba(10,10,20,.55)" stroke-width="3.5" fill="none"/><path d="${d}" stroke="rgba(240,248,255,.92)" stroke-width="1.6" fill="none"/>`;
  });
  [38, 90, 160, 250].forEach(R => {
    let d = ''; rays.forEach((a, i) => { const rr = R * (0.85 + rnd() * 0.3); d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)} `; });
    s += `<path d="${d}Z" stroke="rgba(235,245,255,.55)" stroke-width="1.2" fill="none"/>`;
  });
  s += `<circle cx="${cx}" cy="${cy}" r="9" fill="rgba(255,255,255,.85)"/></svg>`;
  return s;
}
function finEndBad() {
  finEndCommon();
  const B = finCfg().FINAL_MALO, frame = uiHost();
  frame.classList.add('fin-shake');
  try { audio.playGlassIrreal(); screenShake(8, 600); if (navigator.vibrate) navigator.vibrate([120, 60, 200]); } catch (e) {}
  const crack = finEl('fin-crack', finCrackSVG(), 'finalCrack'); frame.appendChild(crack);
  // mensajes de las dos voces, que se van juntando hasta decir lo mismo
  const mix = finEl('fin-mix', '', 'finalMix'); frame.appendChild(mix);
  let t = 1600;
  B.MEZCLA.forEach(([d, tr], k) => {
    finLater(() => {
      mix.innerHTML = `<div class="mx d">${d}</div><div class="mx t">${tr}</div>`;
      mix.classList.remove('show'); void mix.offsetWidth; mix.classList.add('show');
      mix.classList.toggle('one', d === tr);
      try { audio.playDialogueMelody('EL DUENDE'); setTimeout(() => audio.playDialogueMelody('EL TRAPERO'), 120); } catch (e) {}
    }, t);
    t += B.MEZCLA_MS;
  });
  finLater(() => finBadBlack(B), t + 400);
}
function finBadBlack(B) {
  const frame = uiHost();
  const black = finEl('fin-black', '', 'finalBlack'); frame.appendChild(black);
  void black.offsetWidth; black.classList.add('on');
  try { audio.playDarkOut(); } catch (e) {}
  finLater(() => {   // la pantalla del puzle ya no hace falta: queda el negro con la tapa del cofre del Duende
    try { hideAllMinigameUI(); } catch (e) {}
    ['finalCrack', 'finalMix'].forEach(finRemove); frame.classList.remove('fin-shake', 'final-on');
    const lid = finEl('fin-lid', '<div class="lid-planks"></div><div class="lid-band b1"></div><div class="lid-band b2"></div><div class="lid-lock"></div><div class="lid-dust"></div>', 'finalLid');
    frame.appendChild(lid);
    finRemove('finalBlack');
    // sonidos de una partida normal (cofres, suma, botín): solo se oyen
    (B.SONIDOS || []).forEach(([ms, k]) => finLater(() => {
      try { audio.init(); ({ lock: () => audio.playLockOpen('wooden'), cash: () => audio.playCashRegister(), click: () => audio.playClick(0.8), beep: () => audio.playCardBeep(), fanfare: () => audio.playUnlockFanfare('raro') })[k](); } catch (e) {}
    }, 400 + ms));
    finLater(() => finBadOpen(B), B.TAPA_MS);
  }, 2300);
}
function finBadOpen(B) {
  const frame = uiHost();
  // el escenario del Duende (diálogo de evento) se prepara debajo de la tapa: sin personaje y sin botón
  triggerSequentialDialogue('EL DUENDE', B.APERTURA, 'fa-hat-wizard', B.SUBTITULO, 'text-purple-300', null, null);
  const dm = document.getElementById('dialogueModal'); dm.classList.remove('hidden');
  const fig = document.getElementById('dlgFig'); if (fig) fig.style.display = 'none';
  const cb = document.getElementById('closeDialogueBtn'); if (cb) cb.style.display = 'none';
  const ui = finEl('fin-badui', `<div class="fx-opts">${B.BIENVENIDAS.map((p, k) => `<button type="button" class="fx-opt" data-k="${k}">${p}</button>`).join('')}</div>`, 'finBadUI');
  frame.appendChild(ui);
  const lid = document.getElementById('finalLid');
  if (lid) { lid.classList.add('open'); try { audio.playLockOpen('wooden'); audio.playLightOn(); } catch (e) {} finLater(() => finRemove('finalLid'), 1900); }
  ui.querySelectorAll('.fx-opt').forEach(b => b.addEventListener('click', () => {
    try { audio.init(); audio.playDialogueMelody('EL DUENDE'); } catch (e) {}
    const say = b.textContent;
    ui.querySelector('.fx-opts').remove();
    const sp = document.getElementById('npcSpeechText'); if (sp) sp.innerHTML = '“' + say + '”';
    finBadSales(B, ui, dm);
  }));
}
// Entra el aventurero: los sitios de la tienda se van seleccionando uno a uno mientras compra y el oro sube
function finBadSales(B, ui, dm) {
  const sp = document.getElementById('npcSpeechText');
  ui.insertAdjacentHTML('beforeend', `<div class="fx-gp"><span id="fxGp">0</span> GP</div>`);
  const gpEl = ui.querySelector('#fxGp'); let gp = 0;
  const per = Math.ceil(B.ORO_FINAL / B.SITIOS.length);
  B.SITIOS.forEach(([nm, x, y, w, h], k) => {
    finLater(() => {
      ui.querySelectorAll('.fx-hl').forEach(e => e.classList.remove('on'));
      const hl = finEl('fx-hl on', `<i>${nm}</i>`); hl.style.cssText = `left:${x}%;top:${y}%;width:${w}%;height:${h}%`; ui.appendChild(hl);
      try { audio.playCashRegister(); } catch (e) {}
      const goal = Math.min(B.ORO_FINAL, gp + per), from = gp; const t0 = performance.now();
      const step = now => { const p = Math.min(1, (now - t0) / (B.SITIO_MS * 0.8)); gp = Math.round(from + (goal - from) * p); gpEl.textContent = gp; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, 900 + k * B.SITIO_MS);
  });
  const tEnd = 900 + B.SITIOS.length * B.SITIO_MS + 500;
  finLater(() => {
    ui.querySelectorAll('.fx-hl').forEach(e => e.classList.remove('on')); gpEl.textContent = B.ORO_FINAL;
    if (sp) sp.innerHTML = B.ORO_LINEA;
    ui.insertAdjacentHTML('beforeend', `<div class="fx-end"><div class="fx-fin">${B.FIN}</div><button type="button" class="fc-go" id="fxBack">${B.VOLVER}</button></div>`);
    ui.querySelector('#fxBack').addEventListener('click', finRestart);
  }, tEnd);
}

/* ---------- FINAL BUENO: Gafas de Ver, la puerta de dungeon al fondo de la habitación y la luz azul del día ---------- */
// Dibujo de la puerta en pixel art (rejilla 26x38 que se escala con image-rendering: pixelated): marco de piedra, cielo, hoja de madera con cerrojo
function finDrawDoor(frameCv, skyCv, leafCv) {
  const GX = 26, GY = 38;
  const arch = (x, y) => { if (x < 0 || x >= GX || y < 0 || y >= GY) return false; const cut = ({ 0: 5, 1: 3, 2: 2, 3: 1, 4: 1 })[y] || 0; return cut <= x && x < GX - cut; };
  const inner = (x, y) => arch(x - 2, y - 2) && arch(x + 2, y + 2) && x >= 2 && x < GX - 2 && y >= 2;
  let seed = 11; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const F = frameCv.getContext('2d'), S = skyCv.getContext('2d'), L = leafCv.getContext('2d');
  const px = (g, x, y, c) => { g.fillStyle = c; g.fillRect(x, y, 1, 1); };
  for (let y = 0; y < GY; y++) for (let x = 0; x < GX; x++) {
    if (!arch(x, y)) continue;
    if (!inner(x, y)) px(F, x, y, (x + y) % 5 ? '#42424e' : '#4d4d5a');
    else {
      const t = y / GY; px(S, x, y, `rgb(${Math.round(40 + t * 150)},${Math.round(110 + t * 105)},${Math.round(210 + t * 40)})`);
      const plank = Math.floor((x - 2) / 5); let c = ['#6b4423', '#7a4f29', '#5e3b1e', '#74492a', '#654020'][plank % 5];
      if ((x - 2) % 5 === 0) c = '#3e2812'; else if (rnd() < 0.07) c = '#4d3016';
      px(L, x, y, c);
    }
  }
  [[8, 10], [15, 14], [10, 22]].forEach(([cx, cy]) => { for (let dx = -3; dx <= 3; dx++) if (inner(cx + dx, cy)) px(S, cx + dx, cy, '#f2f8ff'); for (let dx = -2; dx <= 2; dx++) if (inner(cx + dx, cy - 1)) px(S, cx + dx, cy - 1, '#ffffff'); });
  [9, 10, 24, 25].forEach(y => { for (let x = 2; x < GX - 2; x++) if (inner(x, y)) px(L, x, y, y === 9 || y === 24 ? '#2a2a32' : '#3a3a44'); });
  [4, 8, 17, 21].forEach(x => [9, 24].forEach(y => px(L, x, y, '#9a9aa8')));
  for (let y = 15; y < 21; y++) for (let x = 10; x < 16; x++) px(L, x, y, '#2a2a32');
  for (let y = 16; y < 20; y++) for (let x = 11; x < 15; x++) px(L, x, y, '#e0b030');
  [[12, 17], [13, 17], [12, 18], [13, 18], [12, 19], [13, 19]].forEach(([x, y]) => px(L, x, y, '#2a1608')); px(L, 12, 16, '#fff0a0');
  px(L, 20, 12, '#8a8a96'); px(L, 20, 13, '#8a8a96');
}
function finEndGood() {
  finEndCommon();
  const G = finCfg().FINAL_BUENO, frame = uiHost();
  try { audio.playUnlockFanfare('legendario'); } catch (e) {}
  // 1) las gafas: texto sobre la habitación oscurecida y difuminada (sin cofres)
  const dim = finEl('fin-dim', `<div class="fd-text"><i class="fa-solid fa-glasses fd-glasses hidden"></i><div class="fd-line"></div></div>`, 'finDim');
  frame.appendChild(dim);
  const line = dim.querySelector('.fd-line'), gl = dim.querySelector('.fd-glasses');
  let t = 1000;
  G.LINEAS.forEach(s => {
    finLater(() => { line.textContent = s; line.classList.remove('show'); void line.offsetWidth; line.classList.add('show'); gl.classList.toggle('hidden', s !== 'GAFAS DE VER'); try { audio.playSoftPad(); } catch (e) {} }, t);
    t += 3000;
  });
  // 2) la sala se aclara y al fondo aparece la puerta con su cerrojo
  const door = finEl('fin-door', `
    <div class="fdr" id="fdr">
      <canvas class="fdr-sky" width="26" height="38"></canvas>
      <canvas class="fdr-leaf" width="26" height="38"></canvas>
      <canvas class="fdr-frame" width="26" height="38"></canvas>
      <button type="button" class="fdr-hit" aria-label="Abrir la puerta"></button>
    </div>
    <div class="fdr-glow"></div>
    <div class="fdr-line"></div>
    <div class="fdr-hint">${G.HINT}</div>`, 'finDoor');
  frame.appendChild(door);
  finDrawDoor(door.querySelector('.fdr-frame'), door.querySelector('.fdr-sky'), door.querySelector('.fdr-leaf'));
  finLater(() => {
    line.classList.remove('show'); gl.classList.add('hidden'); dim.classList.add('clear');
    door.classList.add('on'); try { audio.playLightOn(); } catch (e) {}
    const dl = door.querySelector('.fdr-line'); dl.textContent = G.LINEA_PUERTA; dl.classList.add('show');
    finLater(() => { dl.classList.remove('show'); door.classList.add('ready'); finRemove('finDim'); }, 3600);
  }, t);
  // 3) tocar el cerrojo: la hoja se abre, la luz azul se derrama y llena la pantalla
  let opened = false;
  door.querySelector('.fdr-hit').addEventListener('click', () => {
    if (opened || !door.classList.contains('ready')) return; opened = true;
    try { audio.init(); audio.playLockOpen('wooden'); } catch (e) {}
    door.classList.remove('ready'); door.classList.add('opening');
    finLater(() => { try { audio.playLightOn(); } catch (e) {} door.classList.add('glow'); }, 900);
    finLater(() => {
      const fl = finEl('fin-flood', `<div class="ff-thanks">${G.GRACIAS}</div><button type="button" class="fc-go" id="fgBack">${G.VOLVER}</button>`, 'finFlood');
      frame.appendChild(fl); void fl.offsetWidth; fl.classList.add('on');
      fl.querySelector('#fgBack').addEventListener('click', finRestart);
    }, 2600);
  });
}
