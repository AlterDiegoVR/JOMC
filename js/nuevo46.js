/* ==========================================================================
   [0.46] Contenido nuevo: Cura Espiritual, Manos Ajenas, Cofres a Oscuras, Deuda con el Trapero,
   moneda de la Apuesta del Trapero, trato Sin Red y ayudas comunes.
   ========================================================================== */

// ¿Puede salir esta wildcard ahora? ('unico' = ya está activa; 'cond' = condición propia)
function wcCondOk(w) {
  if (w.unico && w.valor && w.valor.id && modOn(w.valor.id)) return false;
  if (w.cond === 'CURABLE' && !curablesActivos().length) return false;
  if (w.efecto === 'DEUDA_TRAPERO' && (STATE.deudaTrapero || 0) > 0) return false;
  return true;
}

// Efectos negativos PERMANENTES que la Cura Espiritual puede borrar (nunca la maldición ni los de turnos fijos)
function curablesActivos() {
  const L = [], M = STATE.mods || {};
  if (M.mentirosos > 0) L.push({ n: 'Cofres Mentirosos', f: () => { delete M.mentirosos; } });
  if (M.spooky > 0) L.push({ n: 'Spooky Things', f: () => { delete M.spooky; } });
  if (M.apagonFin > 0) L.push({ n: 'Apagón Financiero', f: () => { delete M.apagonFin; } });
  if (M.manosAjenas > 0) L.push({ n: 'Manos Ajenas', f: () => { delete M.manosAjenas; } });
  if (M.cofresOscuros > 0) L.push({ n: 'Cofres a Oscuras', f: () => { delete M.cofresOscuros; } });
  if (STATE.picksBrokenOnUse) L.push({ n: 'Dedos Rotos', f: () => { STATE.picksBrokenOnUse = false; } });
  if (Object.keys(STATE.torpezas || {}).some(k => STATE.torpezas[k] > 0)) L.push({ n: 'Torpezas', f: () => { Object.keys(STATE.torpezas).forEach(k => { STATE.torpezas[k] = 0; }); } });
  if ((STATE.harderPuzzlesLeft || 0) > 0 && STATE.harderSrc === 'Pacto de la Sombra') L.push({ n: 'Pacto de la Sombra (puzles más duros)', f: () => { STATE.harderPuzzlesLeft = 0; } });
  return L;
}
function cureSpiritual() {
  const L = curablesActivos();
  L.forEach(x => x.f());
  if (L.length) { saveDirty = true; try { audio.init(); audio.playUnlockFanfare('epico'); } catch (e) {} }
  return L.map(x => x.n);
}

// Manos Ajenas: roba 1 herramienta al azar (siempre te queda 1 ganzúa)
function stealRandomTool() {
  const NOM = { picks: 'Ganzúa', proPicks: 'Pin de Acero', usb: 'Llave USB', valves: 'Válvula', batteries: 'Pila', fuses: 'Fusible' };
  const cand = getUnlockedConsumables().filter(t => (STATE[t.prop] || 0) > (t.prop === 'picks' ? 1 : 0));
  if (!cand.length) return null;
  const t = cand[Math.floor(Math.random() * cand.length)];
  STATE[t.prop]--; updateUI();
  return `1 ${NOM[t.prop] || t.name}`;
}
function manosAjenasTick() {
  const M = DATOS_JUEGO.MODS_WILDCARD.MANOS_AJENAS;
  if (!(STATE.mods && STATE.mods.manosAjenas > 0)) return;
  if ((STATE.roomDarkUntil || 0) < STATE.chestsOpened) return;
  if (Math.random() >= M.PROB) return;
  const what = stealRandomTool(); if (!what) return;
  const fr = M.FRASES[Math.floor(Math.random() * M.FRASES.length)].replace('{n}', what);
  try { audio.playKeySpend(); } catch (e) {}
  setTimeout(() => showPersistentFeedback(fr), 600);
}

// Cofres a Oscuras: con la luz apagada solo se ve la silueta
function chestSilOn() { return modOn('cofresOscuros') && isRoomDark() && !isClimaxActive(); }
const SIL_CACHE = {};
function silCanvasOf(im, key) {
  if (SIL_CACHE[key]) return SIL_CACHE[key];
  try {
    const c = document.createElement('canvas'); c.width = im.naturalWidth || im.width; c.height = im.naturalHeight || im.height;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(im, 0, 0);
    x.globalCompositeOperation = 'source-in'; x.fillStyle = '#05060a'; x.fillRect(0, 0, c.width, c.height);
    c.naturalWidth = c.width; c.naturalHeight = c.height; SIL_CACHE[key] = c; return c;
  } catch (e) { return im; }
}
function chestSilSrc(type) {
  const key = 'cofre_' + type.id;
  if (typeof artReady === 'function' && artReady(key)) { try { return silCanvasOf(ART[key], key).toDataURL(); } catch (e) {} }
  return '';
}

// Tratos del Trapero: ¿se puede aceptar ahora mismo? (para la Deuda: nunca se obliga a aceptar algo imposible)
function traperoDealUsable(d) {
  const adv = ['proPicks', 'usb', 'valves', 'batteries', 'fuses'];
  switch (d.id) {
    case 'vender_ganzuas': case 'canje_directo': return STATE.picks >= 2;
    case 'contador_cofres_trapero': return STATE.picks >= 5;
    case 'vender_avanzada': return adv.some(p => STATE[p] >= 1);
    case 'purga_maldicion': return STATE.cursedChestsLeft > 0 && adv.some(p => STATE[p] >= 1);
    case 'purga_maldicion_plus': return STATE.cursedChestsLeft > 0 && STATE.picks >= DATOS_JUEGO.TRATOS_210.PURGA_PLUS.GANZUAS;
    case 'cambio_trabajo': { const P = STATE.perks || {}; return ['sweetSpot', 'rarityBonus', 'discount', 'slowerPistons', 'goldStreak', 'extraTime', 'oidoClinico', 'luckyLootChance', 'bonusMadera', 'bonusAcero', 'bonusDigital', 'bonusVapor', 'bonusNeon'].some(k => P[k] > 0) || !!P.shopStealFree; }
    case 'sin_red': return !STATE.sinRed;
  }
  return true;
}

// Moneda de la Apuesta del Trapero: gira, cae y suena; devuelve 'cara' o 'cruz' (50/50)
function coinFlipFx(onDone) {
  const side = Math.random() < 0.5 ? 'cara' : 'cruz';
  const host = uiHost(), ms = (DATOS_JUEGO.TRATOS_46 || {}).MONEDA_MS || 2200;
  const el = document.createElement('div'); el.id = 'coinFlip'; el.className = 'coin-ov';
  el.innerHTML = `<div class="coin-stage"><div class="coin" style="--turns:${side === 'cara' ? 7 : 7.5};--ms:${ms}ms"><div class="coin-f coin-a"><i class="fa-solid fa-crown"></i><span>CARA</span></div><div class="coin-f coin-b"><i class="fa-solid fa-skull"></i><span>CRUZ</span></div></div><div class="coin-shadow"></div></div><div class="coin-res" id="coinRes"></div>`;
  host.appendChild(el);
  try { audio.init(); audio.playCoinFlip(ms); } catch (e) {}
  setTimeout(() => {
    const r = document.getElementById('coinRes');
    if (r) { r.textContent = side === 'cara' ? 'CARA' : 'CRUZ'; r.classList.add('show'); }
  }, ms + 80);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => { el.remove(); onDone(side); }, 380); }, ms + 1100);
}

// Trato Sin Red: regalos ocultos al azar (1 o 2)
function sinRedRegalos() {
  const C = [];
  const types = ['madera', 'acero', 'digital', 'vapor'].concat((STATE.currentLoop || 1) >= 2 ? ['neon'] : []);
  const NOMT = { madera: 'Madera', acero: 'Acero', digital: 'Digital', vapor: 'Vapor', neon: 'Neón' };
  const mt = types[Math.floor(Math.random() * types.length)];
  C.push({ txt: `+1 nivel de Maestría de ${NOMT[mt]}`, f: () => { const k = 'bonus' + mt.charAt(0).toUpperCase() + mt.slice(1); STATE.perks[k] = (STATE.perks[k] || 0) + 1; } });
  C.push({ txt: '1 carta Auto-Open', f: () => { STATE.abilities.auto++; } });
  C.push({ txt: '1 carta Cofradía del Cofre', f: () => { STATE.abilities.cofradia++; } });
  C.push({ txt: '1 carta Escudo', f: () => { STATE.abilities.shield++; } });
  C.push({ txt: '1 carta Ruleta', f: () => { STATE.abilities.ruleta++; } });
  const n = Math.random() < 0.5 ? 1 : (DATOS_JUEGO.TRATOS_46.SIN_RED.REGALOS_MAX || 2);
  return shuffleU(C).slice(0, n);
}
