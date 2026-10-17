// ==========================================================================
// JUST ONE MORE CHEST — puzles.js — VERSIÓN 0.1
// minijuegos: ganzúa, pistones, hackeo, tuberías
// ==========================================================================

/* ==========================================================================
   MINIJUEGO 1: GANZÚA BÁSICA (LOCKPICK) - ESCALADO POR RAREZA DE COFRE
   ========================================================================== */

let lpState = {
  angle: 0, screwdriver: 0, sweetSpot: 0, decoySpots: [], tolerance: 14, health: 100, isTension: false, isBreaking: false,
  isCompleted: false, isTrapChest: false,
  tanteoActive: false, // [0.082] ¿penaliza el tanteo en este cofre? (Bucle 2/3 y rareza Raro+)
  tanteoUsed: false    // [0.082] ¿el jugador ha soltado la tensión alguna vez en este intento?
};

// [0.082] ¿Aplican las reglas avanzadas (Bucle 2/3) a un cofre de esta rareza?
function isAdvancedLoopFor(rarityId) {
  const A = DATOS_JUEGO.MINIJUEGOS.AVANZADO;
  const loop = Math.min(STATE.currentLoop || 1, 3);
  return A.BUCLES_ACTIVOS.includes(loop) && A.RAREZAS.includes(rarityId);
}

function startLockpickGame() {
  const configLP = DATOS_JUEGO.MINIJUEGOS.LOCKPICK;
  startMinigameTimer(configLP.TIEMPO_BASE_SEGUNDOS, 'picks');

  lpState.angle = 0;
  lpState.screwdriver = 0;
  lpState.sweetSpot = (Math.random() - 0.5) * 150;
  lpState.health = configLP.SALUD_INICIAL;
  lpState.isTension = false;
  lpState.isBreaking = false;
  lpState.isCompleted = false;
  lpState.isTrapChest = false;

  const active = STATE.screenChests[STATE.activeChestIdx];
  const rarityId = active ? active.rarity.id : 'normal';
  lpState.tanteoActive = isAdvancedLoopFor(rarityId);
  lpState.tanteoUsed = false;

  let baseTol = (STATE.traperoBuffs.harderMinigames || STATE.harderPuzzlesLeft > 0) ? configLP.TOLERANCIA_DIFICIL : configLP.TOLERANCIA_NORMAL;
  baseTol += (STATE.perks.sweetSpot * 3);
  lpState.tolerance = baseTol;

  if (rarityId === 'legendario' && Math.random() < configLP.PROB_TRAMPA_LEGENDARIO) {
    lpState.isTrapChest = true;
  }

  lpState.decoySpots = [];
  const decoyChance = configLP.PROB_DECOYS_POR_RAREZA[rarityId] || 0.0;
  
  if (Math.random() < decoyChance || lpState.isTrapChest) {
    let count = rarityId === 'legendario' ? 3 : (rarityId === 'epico' ? 2 : 1);
    if (lpState.isTrapChest) count = 4;
    // [CAMBIO] Los señuelos se separan del punto real según la tolerancia (Mano Firme la amplía), para que sus zonas no se solapen
    const minSep = (lpState.tolerance * 2) + 6;
    for (let d = 0; d < count; d++) {
      const dist = minSep + Math.random() * 25;
      const sign = (d % 2 === 0 ? 1 : -1);
      let pos = lpState.sweetSpot + sign * dist;
      if (pos > 85 || pos < -85) pos = lpState.sweetSpot - sign * dist;
      lpState.decoySpots.push(Math.max(-85, Math.min(85, pos)));
    }
  }

  const angleSlider = document.getElementById('angleSlider');
  if (angleSlider) angleSlider.value = 0;
  const readout = document.getElementById('angleReadout'); if (readout) readout.textContent = "0°";
  const lpContainer = document.getElementById('lockpickContainer'); if (lpContainer) lpContainer.classList.remove('hidden');

  updateLockpickProximityVisuals();
  if (window.showLockTouchHints) window.showLockTouchHints();   // [0.090]
}

function updateLockpickProximityVisuals() {
  const diffReal = Math.abs(lpState.angle - lpState.sweetSpot);
  let minDiff = diffReal;
  let isNearDecoy = false;

  lpState.decoySpots.forEach(ds => {
    const diffDecoy = Math.abs(lpState.angle - ds);
    if (diffDecoy < minDiff) {
      minDiff = diffDecoy;
      isNearDecoy = true;
    }
  });

  const proximityRatio = Math.max(0, 1 - (minDiff / 90));

  // [0.097] Sin barra de tensión: el color del botón del deslizador y el aro de la cerradura indican la cercanía (el fondo de la barra ya no se tiñe).
  const proxText = document.getElementById('proximityText');
  const proxGlow = document.getElementById('proximityGlow');
  const slEl = document.getElementById('angleSlider');
  const falseWarn = !!(isNearDecoy && STATE.perks.oidoClinico > 0 && lpState.isTension && proximityRatio > 0.85);
  // [0.097b] rojo (≤0.25) → naranja (0.5) y naranja hasta el umbral verde (0.85); solo en la zona verde pasa a verde con un cambio corto. Coherente con el texto y el aro.
  const hue = Math.round(proximityRatio <= 0.25 ? 0 : proximityRatio <= 0.5 ? 30 * (proximityRatio - 0.25) / 0.25 : proximityRatio < 0.85 ? 30 + 8 * (proximityRatio - 0.5) / 0.35 : proximityRatio < 0.88 ? 38 + 87 * (proximityRatio - 0.85) / 0.03 : 125);
  const colMain = falseWarn ? '#a855f7' : `hsl(${hue} 90% 52%)`;
  const colGlow = falseWarn ? 'rgba(168,85,247,.85)' : `hsla(${hue} 95% 55% / .8)`;
  if (slEl) {
    slEl.style.setProperty('--lp-col', colMain);
    slEl.style.setProperty('--lp-glow', colGlow);
  }
  if (proxText && proxGlow) {
    if (falseWarn) {
      proxText.textContent = "¡FALSO PUNTO DULCE!";
      proxText.className = "text-violet-400 font-bold animate-bounce";
      proxGlow.style.borderColor = "#a855f7";
    } else if (proximityRatio > 0.85) {
      proxText.textContent = "VERDE (PUNTO DULCE)";
      proxText.className = "text-emerald-400 font-bold animate-pulse";
      proxGlow.style.borderColor = "#34d399";
    } else if (proximityRatio > 0.5) {
      proxText.textContent = "NARANJA (CERCA)";
      proxText.className = "text-amber-400 font-bold";
      proxGlow.style.borderColor = "#fbbf24";
    } else {
      proxText.textContent = "ROJO (LEJOS)";
      proxText.className = "text-rose-500 font-bold";
      proxGlow.style.borderColor = "#ef4444";
    }
  }

  const needle = document.getElementById('pickNeedle');
  if (needle) needle.style.transform = `rotate(${lpState.angle}deg)`;

  const maxAllowedRotation = proximityRatio * 90;
  const currentRotation = (lpState.screwdriver / 90) * maxAllowedRotation;
  const cylinder = document.getElementById('cylinderGraphic');
  if (cylinder) cylinder.style.transform = `rotate(${currentRotation}deg)`;

  if (lpState.isTension && isNearDecoy && proximityRatio > 0.85) {
    audio.playDecoyBuzz();
  } else if (lpState.isTension) {
    audio.playClick(proximityRatio);
  }
}

function tickLockpick() {
  const lpContainer = document.getElementById('lockpickContainer');
  const configLP = DATOS_JUEGO.MINIJUEGOS.LOCKPICK;
  
  if (!lpContainer || lpContainer.classList.contains('hidden') || lpState.isBreaking || lpState.isCompleted) return;

  if (lpState.isTension) {
    if (lpState.isTrapChest) {
      lpState.health -= configLP.DECAY_SALUD_DECOY * 1.5;
      if (lpState.health <= 0) {
        triggerPickBreakSequence(DATOS_JUEGO.MINIJUEGOS.LOCKPICK.MENSAJES_TRAMPA.ROTURA, 'trampa');
        return;
      }
    } else {
      const diffReal = Math.abs(lpState.angle - lpState.sweetSpot);
      // [CAMBIO] El punto dulce real tiene prioridad sobre los señuelos
      const nearDecoy = !(diffReal <= lpState.tolerance) && lpState.decoySpots.some(ds => Math.abs(lpState.angle - ds) <= lpState.tolerance);

      if (nearDecoy) {
        lpState.health -= configLP.DECAY_SALUD_DECOY;
        lpState.screwdriver = Math.min(15, lpState.screwdriver + configLP.VELOCIDAD_CILINDRO_DECOY);
        if (lpState.health <= 0) {
          triggerPickBreakSequence("⚠️ Ganzúa rota: Falso punto dulce.", 'falsoDulce');
          return;
        }
      } else if (diffReal <= lpState.tolerance) {
        lpState.screwdriver = Math.min(90, lpState.screwdriver + configLP.VELOCIDAD_CILINDRO_ACIERTO);
        
        if (lpState.screwdriver >= 90) {
          lpState.isCompleted = true;
          lpState.isTension = false;

          const minigameModal = document.getElementById('minigameModal'); 
          if (minigameModal) minigameModal.classList.add('hidden');
          if (lpContainer) lpContainer.classList.add('hidden');

          triggerLootExplosion();
          return;
        }
      } else {
        lpState.screwdriver = Math.min(60, lpState.screwdriver + configLP.VELOCIDAD_CILINDRO_ERROR);
        lpState.health -= configLP.DECAY_SALUD_ERROR;
        if (lpState.health <= 0) {
          triggerPickBreakSequence("⚠️ Ganzúa rota: Ángulo equivocado.");
          return;
        }
      }
    }
  } else {
    lpState.screwdriver = Math.max(0, lpState.screwdriver - configLP.RETORNO_DESCENTRO);
  }

  updateLockpickProximityVisuals();
  requestAnimationFrame(tickLockpick);
}

function triggerPickBreakSequence(reasonText, delayKey = null) {
  lpState.isBreaking = true;
  lpState.isTension = false;
  audio.playBreak();

  const minigameModal = document.getElementById('minigameModal');
  if (minigameModal) minigameModal.classList.add('hidden');
  const lpContainer = document.getElementById('lockpickContainer');
  if (lpContainer) lpContainer.classList.add('hidden');

  showPersistentFeedback(reasonText, delayKey);
  handleFailure('picks', reasonText);
}

const angleSlider = document.getElementById('angleSlider');
if (angleSlider) {
  angleSlider.addEventListener('input', (e) => {
    if (lpState.isBreaking) return;
    lpState.angle = parseFloat(e.target.value);
    const readout = document.getElementById('angleReadout'); if (readout) readout.textContent = `${Math.round(lpState.angle)}°`;
    updateLockpickProximityVisuals();
  });
}

const forceLockBtn = document.getElementById('forceLockBtn');
const startTension = (e) => { e.preventDefault(); if (!lpState.isBreaking && !lpState.isCompleted) { lpState.isTension = true; const cy = document.getElementById('cylinderGraphic'); if (cy) cy.classList.add('cyl-held'); tickLockpick(); } };   // [0.096] cyl-held apaga el 'respirar' del centro
const stopTension = (e) => {
  e.preventDefault();
  // [0.082] Bucle 2/3 (Raro+): cualquier tensión mantenida y luego soltada cuenta como tanteo
  if (lpState.isTension && lpState.tanteoActive && !lpState.isBreaking && !lpState.isCompleted) {
    lpState.tanteoUsed = true;
  }
  lpState.isTension = false;
  { const cy = document.getElementById('cylinderGraphic'); if (cy) cy.classList.remove('cyl-held'); }   // [0.096]
};
{ const cfgAn = (DATOS_JUEGO.GANZUA_TACTIL || {}).ANILLO_CENTRO || {}; document.documentElement.classList.toggle('cyl-hint-off', cfgAn.ACTIVAR === false); }   // [0.096]

if (forceLockBtn) {
  forceLockBtn.addEventListener('mousedown', startTension);
  forceLockBtn.addEventListener('mouseup', stopTension);
  forceLockBtn.addEventListener('touchstart', startTension);
  forceLockBtn.addEventListener('touchend', stopTension);
}

/* ==========================================================================
   MINIJUEGO 2: PISTONES DE ACERO (TUMBLER) - ESCALADO POR RAREZA DE COFRE
   ========================================================================== */

let tumblerAnimationFrameId = null;
let tumblerPinsData = [];
let activePinIdx = 0;
let targetShearPosY = 50;
let tumblerAdvanced = false;       // [0.082] ¿este intento usa la fase de sellado (Bucle 2/3, Raro+)?
let tumblerPhase = 'pins';         // 'pins' | 'seal' | 'done'
let tumblerSeal = null;            // estado de la fase de sellado
let tumblerOriginalHelpHTML = null;
let tumblerOriginalBtnHTML = null;

// [0.082] Limpia la UI de la fase de sellado (línea azul, textos) al empezar un intento
function resetTumblerSealUI() {
  const oldLine = document.getElementById('sealLine');
  if (oldLine) oldLine.remove();
  const tc = document.getElementById('tumblerContainer');
  const help = tc ? tc.querySelector('p') : null;
  const btn = document.getElementById('tapPinBtn');
  if (help && tumblerOriginalHelpHTML === null) tumblerOriginalHelpHTML = help.innerHTML;
  if (btn && tumblerOriginalBtnHTML === null) tumblerOriginalBtnHTML = btn.innerHTML;
  if (help && tumblerOriginalHelpHTML !== null) help.innerHTML = tumblerOriginalHelpHTML;
  if (btn && tumblerOriginalBtnHTML !== null) btn.innerHTML = tumblerOriginalBtnHTML;
  tumblerSeal = null;
}

// [0.084] Alinea las líneas verde/azul con la posición REAL de los pistones.
// Los pistones se mueven en % de su carril (más corto que la caja por la luz superior),
// así que las líneas se colocan en píxeles a partir del carril medido.
let tumblerShearTol = 6;
function layoutTumblerLines() {
  const shear = document.getElementById('shearLine');
  const notch = document.getElementById('pinNotch-0');
  if (!shear || !notch || !notch.parentElement || !shear.parentElement) return;
  const box = shear.parentElement;
  const track = notch.parentElement;
  const tr = track.getBoundingClientRect();
  const br = box.getBoundingClientRect();
  if (!tr.height || !br.height) return;
  const notchH = notch.offsetHeight || 16;
  const place = (el, pct, tol, minH) => {
    if (!el) return;
    const h = Math.max(minH, 2 * tol * tr.height / 100);
    const centre = (tr.top - br.top - box.clientTop) + (pct / 100) * tr.height + notchH / 2;
    el.style.top = `${centre - h / 2}px`;
    el.style.height = `${h}px`;
  };
  place(shear, targetShearPosY, tumblerShearTol, 10);
  if (tumblerSeal) place(document.getElementById('sealLine'), tumblerSeal.blueY, tumblerSeal.tol, 10);
}
window.addEventListener('resize', () => { try { layoutTumblerLines(); } catch (e) {} });

// [0.084] Anulación 1 a 1 entre Maestría (perks.bonusX) y Torpeza (torpezas.x)
function reconcileMasteryTorpeza() {
  const names = { madera: 'Madera', acero: 'Acero', digital: 'Digital', vapor: 'Vapor' };
  const msgs = [];
  Object.keys(names).forEach(t => {
    const key = 'bonus' + names[t];
    const m = STATE.perks[key] || 0;
    const q = STATE.torpezas[t] || 0;
    if (m > 0 && q > 0) {
      const n = Math.min(m, q);
      STATE.perks[key] = m - n;
      STATE.torpezas[t] = q - n;
      msgs.push(`${names[t]}: ${n} nivel${n > 1 ? 'es' : ''} de Maestría y Torpeza se anulan entre sí.`);
    }
  });
  if (msgs.length && typeof showPersistentFeedback === 'function') {
    showPersistentFeedback(`⚖️ Maestría y Torpeza se compensan. ${msgs.join(' ')}`);
  }
}

function startTumblerGame() {
  if (tumblerAnimationFrameId) {
    cancelAnimationFrame(tumblerAnimationFrameId);
    tumblerAnimationFrameId = null;
  }

  const configT = DATOS_JUEGO.MINIJUEGOS.TUMBLER;
  tumblerStartedAt = Date.now();
  const tumblerContainer = document.getElementById('tumblerContainer'); if (tumblerContainer) tumblerContainer.classList.remove('hidden');
  { const th = document.getElementById('tumblerTapHint'); if (th) th.classList.add('hidden'); }   // [0.095] el aviso de tocar la pantalla ahora va en la frase fija (una sola vez)
  const pinsContainer = document.getElementById('tumblerPins'); if (!pinsContainer) return;
  pinsContainer.innerHTML = '';

  const active = STATE.screenChests[STATE.activeChestIdx];
  const rarityId = active ? active.rarity.id : 'normal';

  // [0.082] Bucle 2/3 (Raro+): fase de sellado con línea azul; la verde siempre en el tercio inferior
  tumblerAdvanced = isAdvancedLoopFor(rarityId);
  tumblerPhase = 'pins';
  resetTumblerSealUI();
  if (tumblerAdvanced) {
    const [vMin, vMax] = DATOS_JUEGO.MINIJUEGOS.AVANZADO.TUMBLER.VERDE_RANGO;
    targetShearPosY = vMin + Math.random() * (vMax - vMin);
  } else {
    targetShearPosY = Math.floor(Math.random() * 40) + 30;
  }
  const shearLine = document.getElementById('shearLine'); if (shearLine) shearLine.style.top = `${targetShearPosY}%`;

  const pinCount = configT.PINS_POR_RAREZA[rarityId] || 3;
  let dynamicTime = configT.TIEMPOS_POR_PIN[pinCount] || 7;
  if (tumblerAdvanced) dynamicTime += DATOS_JUEGO.MINIJUEGOS.AVANZADO.TUMBLER.SEGUNDOS_EXTRA;

  startMinigameTimer(dynamicTime, 'proPicks');

  tumblerPinsData = [];
  let baseSpeed = (STATE.traperoBuffs.harderMinigames || STATE.harderPuzzlesLeft > 0) ? configT.VELOCIDAD_BASE_DIFICIL : configT.VELOCIDAD_BASE_NORMAL;
  if (rarityId === 'legendario') baseSpeed = configT.VELOCIDAD_LEGENDARIA;
  baseSpeed *= ((configT.MULT_VELOCIDAD_RAREZA || {})[rarityId] || 1); // [0.086]

  baseSpeed *= Math.max(0.4, (1 - STATE.perks.slowerPistons * 0.20));

  for (let i = 0; i < pinCount; i++) {
    tumblerPinsData.push({
      posY: Math.random() * 60 + 10,
      speed: (Math.random() * 0.25 + baseSpeed) * (Math.random() > 0.5 ? 1 : -1),
      locked: false
    });
  }
  activePinIdx = 0;

  let allowedTolerance = (STATE.traperoBuffs.harderMinigames || STATE.harderPuzzlesLeft > 0) ? configT.TOLERANCIA_DIFICIL : configT.TOLERANCIA_NORMAL;
  allowedTolerance += (STATE.perks.sweetSpot * (configT.BONO_MANO_FIRME || 1.5));
  tumblerShearTol = allowedTolerance;
  if (shearLine) shearLine.style.height = `${Math.max(10, allowedTolerance * 1.8)}px`;

  tumblerPinsData.forEach((pin, i) => {
    const pinCol = document.createElement('div');
    pinCol.className = 'flex-1 h-full bg-slate-950 border border-slate-800 rounded-lg relative overflow-hidden flex flex-col items-center justify-start';
    pinCol.id = `pinCol-${i}`;
    pinCol.innerHTML = `
      <div id="pinLight-${i}" class="w-2.5 h-2.5 rounded-full my-1 bg-slate-800 border border-slate-700"></div>
      <div class="w-3 flex-1 bg-slate-900 rounded relative overflow-hidden">
        <div id="pinNotch-${i}" class="w-full h-4 bg-amber-400 rounded border border-yellow-200 shadow-md absolute inset-x-0" style="top: 10%;"></div>
      </div>
    `;
    pinsContainer.appendChild(pinCol);
  });

  updateSequentialPinLights();
  layoutTumblerLines();
  requestAnimationFrame(layoutTumblerLines);
  setTimeout(layoutTumblerLines, 120);
  tumblerPinsLastTs = null;
  animateSequentialTumblerPins();
}

function updateSequentialPinLights() {
  tumblerPinsData.forEach((pin, i) => {
    const light = document.getElementById(`pinLight-${i}`);
    const col = document.getElementById(`pinCol-${i}`);
    if (!light || !col) return;

    if (pin.locked) {
      light.className = "w-2.5 h-2.5 rounded-full my-1 bg-emerald-400 border border-emerald-200 shadow-sm";
      col.className = "flex-1 h-full bg-slate-900/80 border border-emerald-500/40 rounded-lg relative overflow-hidden flex flex-col items-center justify-start opacity-90";
    } else if (i === activePinIdx) {
      light.className = "w-2.5 h-2.5 rounded-full my-1 bg-amber-400 border border-amber-200 animate-ping";
      col.className = "flex-1 h-full bg-slate-900 border-2 border-amber-500/60 rounded-lg relative overflow-hidden flex flex-col items-center justify-start shadow-lg";
    } else {
      light.className = "w-2.5 h-2.5 rounded-full my-1 bg-slate-800 border border-slate-700";
      col.className = "flex-1 h-full bg-slate-950 border border-slate-800 rounded-lg relative overflow-hidden flex flex-col items-center justify-start opacity-50";
    }
  });
}

let humHoldChest = null;   // [0.091] cofre legendario para el que el zumbido se calló al empezar el puzle; no vuelve en el botín
let tumblerPinsLastTs = null;
function animateSequentialTumblerPins(ts) {
  const tumblerContainer = document.getElementById('tumblerContainer');
  if (!tumblerContainer || tumblerContainer.classList.contains('hidden')) return;
  if (tumblerPhase !== 'pins') return;

  if (typeof ts !== 'number') ts = performance.now();
  const dtPins = tumblerPinsLastTs === null ? 0 : Math.max(0, Math.min(0.05, (ts - tumblerPinsLastTs) / 1000));   // [0.091] tiempo real ([0.092b] nunca negativo)
  tumblerPinsLastTs = ts;
  const fpsRef = DATOS_JUEGO.MINIJUEGOS.TUMBLER.VELOCIDAD_FPS_REFERENCIA || 90;
  tumblerPinsData.forEach((pin, i) => {
    if (!pin.locked) {
      pin.posY += pin.speed * dtPins * fpsRef;
      // [0.092b] El rebote fija la dirección (no la invierte): con pasos pequeños por tiempo real, invertir en cada fotograma dejaba el pistón pegado al borde
      if (pin.posY >= 82) { pin.posY = 82; pin.speed = -Math.abs(pin.speed); }
      else if (pin.posY <= 8) { pin.posY = 8; pin.speed = Math.abs(pin.speed); }
      const notch = document.getElementById(`pinNotch-${i}`);
      if (notch) notch.style.top = `${pin.posY}%`;
    }
  });

  tumblerAnimationFrameId = requestAnimationFrame(animateSequentialTumblerPins);
}

// [0.082] Cierre común de éxito / fallo de los pistones
function finishTumblerSuccess() {
  minigameInProgress = false;
  stopMinigameTimer();
  setTimeout(() => {
    const minigameModal = document.getElementById('minigameModal'); if (minigameModal) minigameModal.classList.add('hidden');
    const tumblerContainer = document.getElementById('tumblerContainer'); if (tumblerContainer) tumblerContainer.classList.add('hidden');
    const active = STATE.screenChests[STATE.activeChestIdx];
    const reqCount = getRequiredToolCount(active.rarity);
    puzzleToolPaid = null;   // [0.090] ya pagada al entrar
    triggerLootExplosion();
  }, 300);
}

function failTumbler(message) {
  tumblerPhase = 'done';
  if (tumblerAnimationFrameId) { cancelAnimationFrame(tumblerAnimationFrameId); tumblerAnimationFrameId = null; }
  audio.playBreak();
  const minigameModal = document.getElementById('minigameModal'); if (minigameModal) minigameModal.classList.add('hidden');
  const tumblerContainer = document.getElementById('tumblerContainer'); if (tumblerContainer) tumblerContainer.classList.add('hidden');
  showPersistentFeedback(message);
  handleFailure('proPicks');
}

// [0.082] FASE DE SELLADO: todos los pistones encajan en la línea verde (clic) y suben juntos hasta la línea azul
function startTumblerSealPhase() {
  const cfg = DATOS_JUEGO.MINIJUEGOS.AVANZADO.TUMBLER;
  if (tumblerAnimationFrameId) { cancelAnimationFrame(tumblerAnimationFrameId); tumblerAnimationFrameId = null; }
  tumblerPhase = 'seal';
  audio.playClick(1);
  if (navigator.vibrate) navigator.vibrate(30);

  // Todos los pistones encajan sobre la verde
  tumblerPinsData.forEach((pin, i) => {
    pin.posY = targetShearPosY;
    const notch = document.getElementById(`pinNotch-${i}`);
    if (notch) {
      notch.style.top = `${targetShearPosY}%`;
      notch.className = "w-full h-4 bg-sky-400 rounded border border-sky-200 shadow-md absolute inset-x-0";
    }
  });

  let tol = cfg.TOLERANCIA_AZUL + (STATE.perks.sweetSpot * 1);
  const [bMin, bMax] = cfg.AZUL_RANGO;
  const blueY = bMin + Math.random() * (bMax - bMin);

  const shearLine = document.getElementById('shearLine');
  if (shearLine && shearLine.parentElement) {
    const line = document.createElement('div');
    line.id = 'sealLine';
    line.className = 'absolute left-0 right-0 bg-sky-500/50 border-y border-sky-300 z-10 pointer-events-none flex items-center justify-start pl-2';
    line.style.top = `${blueY}%`;
    line.style.height = `${Math.max(10, tol * 1.8)}px`;
    line.innerHTML = '<span class="text-[9px] font-mono text-sky-200 font-bold tracking-widest uppercase bg-slate-950/80 px-1 rounded">SELLO</span>';
    shearLine.parentElement.appendChild(line);
  }

  const tc = document.getElementById('tumblerContainer');
  const help = tc ? tc.querySelector('p') : null;
  if (help) help.innerHTML = cfg.TEXTO_AYUDA_FINAL;
  const btn = document.getElementById('tapPinBtn');
  if (btn) btn.innerHTML = `<i class="fa-solid fa-hand"></i> ${cfg.TEXTO_BOTON_FINAL}`;

  const speedFactor = Math.max(0.4, (1 - STATE.perks.slowerPistons * 0.20));
  tumblerSeal = { y: targetShearPosY, blueY, tol, speed: cfg.VELOCIDAD_SUBIDA_FINAL * speedFactor, lastTs: null };
  layoutTumblerLines();
  tumblerAnimationFrameId = requestAnimationFrame(animateTumblerSeal);
}

function animateTumblerSeal(ts) {
  const tc = document.getElementById('tumblerContainer');
  if (!tc || tc.classList.contains('hidden') || tumblerPhase !== 'seal' || !tumblerSeal) return;

  const dt = tumblerSeal.lastTs === null ? 0 : Math.min(0.05, (ts - tumblerSeal.lastTs) / 1000);
  tumblerSeal.lastTs = ts;
  tumblerSeal.y -= tumblerSeal.speed * dt;

  tumblerPinsData.forEach((pin, i) => {
    pin.posY = tumblerSeal.y;
    const notch = document.getElementById(`pinNotch-${i}`);
    if (notch) notch.style.top = `${tumblerSeal.y}%`;
  });

  // Si los pistones superan la zona azul sin que el jugador pulse, se ha fallado el sellado
  if (tumblerSeal.y < tumblerSeal.blueY - tumblerSeal.tol - (DATOS_JUEGO.MINIJUEGOS.TUMBLER.MARGEN_INVISIBLE_PCT || 0)) {
    failTumbler("⚠️ Sellado fallido: los pistones pasaron de largo la línea azul.");
    return;
  }
  tumblerAnimationFrameId = requestAnimationFrame(animateTumblerSeal);
}

function handleTumblerSealClick() {
  if (tumblerPhase !== 'seal' || !tumblerSeal) return;
  tumblerPhase = 'done';
  if (tumblerAnimationFrameId) { cancelAnimationFrame(tumblerAnimationFrameId); tumblerAnimationFrameId = null; }
  const diff = Math.abs(tumblerSeal.y - tumblerSeal.blueY);
  if (diff <= tumblerSeal.tol + (DATOS_JUEGO.MINIJUEGOS.TUMBLER.MARGEN_INVISIBLE_PCT || 0)) {
    audio.playClick(0.9);
    tumblerPinsData.forEach((pin, i) => {
      const notch = document.getElementById(`pinNotch-${i}`);
      if (notch) notch.className = "w-full h-4 bg-emerald-400 rounded border border-emerald-200 shadow-md absolute inset-x-0";
    });
    finishTumblerSuccess();
  } else {
    failTumbler("⚠️ Sellado fallido: no frenaste los pistones en la línea azul.");
  }
}

function triggerFixActivePin() {
  if (tumblerPhase === 'seal') { handleTumblerSealClick(); return; }
  if (tumblerPhase !== 'pins') return;
  if (activePinIdx >= tumblerPinsData.length) return;

  const configT = DATOS_JUEGO.MINIJUEGOS.TUMBLER;
  const currentPin = tumblerPinsData[activePinIdx];
  const diff = Math.abs(currentPin.posY - targetShearPosY);
  let allowedTolerance = (STATE.traperoBuffs.harderMinigames || STATE.harderPuzzlesLeft > 0) ? configT.TOLERANCIA_DIFICIL : configT.TOLERANCIA_NORMAL;
  allowedTolerance += (STATE.perks.sweetSpot * (configT.BONO_MANO_FIRME || 1.5));
  const margenInv = configT.MARGEN_INVISIBLE_PCT || 0;   // [0.088] margen no visible, el mismo por arriba y por abajo

  if (diff <= allowedTolerance + margenInv) {
    audio.playClick(0.9);
    currentPin.locked = true;
    currentPin.posY = targetShearPosY;
    
    const notch = document.getElementById(`pinNotch-${activePinIdx}`);
    if (notch) {
      notch.style.top = `${targetShearPosY}%`;
      notch.className = "w-full h-4 bg-emerald-400 rounded border border-emerald-200 shadow-md absolute inset-x-0";
    }

    activePinIdx++;
    updateSequentialPinLights();

    if (activePinIdx >= tumblerPinsData.length) {
      if (tumblerAdvanced) {
        startTumblerSealPhase();
      } else {
        tumblerPhase = 'done';
        finishTumblerSuccess();
      }
    }
  } else {
    failTumbler("⚠️ Pistón desalineado. Pin destruido.");
  }
}

const tapPinBtn = document.getElementById('tapPinBtn');
if (tapPinBtn) tapPinBtn.addEventListener('click', triggerFixActivePin);

// [0.089] Cualquier pulsación dentro del puzle de pistones también los para (el botón sigue siendo la forma "oficial").
// Se ignoran los botones (la X, el propio botón: ese ya dispara con su clic) y los primeros 350 ms para no contar el toque que abrió el puzle.
let tumblerStartedAt = 0;
(function () {
  const mm = document.getElementById('minigameModal');
  if (!mm) return;
  mm.addEventListener('pointerdown', (e) => {
    const tc = document.getElementById('tumblerContainer');
    if (!tc || tc.classList.contains('hidden') || !minigameInProgress) return;
    if (tumblerPhase !== 'pins' && tumblerPhase !== 'seal') return;
    if (e.target.closest && e.target.closest('button, a, [role="button"]')) return;
    if (Date.now() - tumblerStartedAt < 350) return;
    triggerFixActivePin();
  });
})();

/* ==========================================================================
   MINIJUEGO 3: TERMINAL DIGITAL (HACK) - ESCALADO POR RAREZA DE COFRE
   ========================================================================== */

let targetWord = "";
let hackAttemptsLeft = 4;

function startHackGame() {
  const configH = DATOS_JUEGO.MINIJUEGOS.HACK;
  const active = STATE.screenChests[STATE.activeChestIdx];
  const rarityId = active ? active.rarity.id : 'normal';
  const cfgRar = configH.CONFIG_POR_RAREZA[rarityId] || configH.CONFIG_POR_RAREZA.normal;

  if (cfgRar.hasTimer) {
    startMinigameTimer(configH.TIEMPO_LEGENDARIO_SEGUNDOS, 'usb');
  } else {
    startMinigameTimer(null, 'usb');
  }

  const hackContainer = document.getElementById('hackContainer'); if (hackContainer) hackContainer.classList.remove('hidden');
  
  hackAttemptsLeft = (STATE.traperoBuffs.harderMinigames || STATE.harderPuzzlesLeft > 0) ? configH.INTENTOS_DIFICIL : configH.INTENTOS_NORMAL;
  const attemptsEl = document.getElementById('hackAttempts'); if (attemptsEl) attemptsEl.textContent = hackAttemptsLeft;

  const history = document.getElementById('hackHistory'); if (history) history.innerHTML = '<div>> MATRIZ DE LONGITUD UNIFORME...</div>';

  const grid = document.getElementById('hackWordGrid'); if (!grid) return;
  grid.innerHTML = '';

  const displayCount = cfgRar.displayCount;
  const advanced = isAdvancedLoopFor(rarityId);
  const loopNow = Math.min(STATE.currentLoop || 1, 3);

  // [0.082] Longitud: Raro 6-7, Épico 7-8, Legendario 8 (Normal conserva la suya). Misma longitud en todo el puzle.
  const advCfg = DATOS_JUEGO.MINIJUEGOS.AVANZADO.HACK;
  const lengthOptions = advanced
    ? (advCfg.LONGITUD_POR_RAREZA[rarityId] || [cfgRar.wordLength])
    : (configH.LONGITUD_BASE_POR_RAREZA[rarityId] || [cfgRar.wordLength]);
  // [0.082] Bucle 2/3 (Raro+): 70% palabras / 30% números; nunca mezclados
  const numericMode = advanced && Math.random() < advCfg.PROB_NUMEROS;
  // [0.084] En modo números la longitud es de 4, 5 o 6 dígitos según rareza
  const chosenLength = numericMode
    ? (advCfg.LONGITUD_NUMEROS_POR_RAREZA[rarityId] || 4)
    : lengthOptions[Math.floor(Math.random() * lengthOptions.length)];

  const labelEl = document.getElementById('hackWordLength') ? document.getElementById('hackWordLength').parentElement : null;
  if (labelEl) {
    labelEl.innerHTML = numericMode
      ? `CÓDIGOS DE <span id="hackWordLength" class="text-amber-400">${chosenLength}</span> DÍGITOS:`
      : `PALABRAS DE LONGITUD <span id="hackWordLength" class="text-amber-400">${chosenLength}</span>:`;
  }

  let options;
  let numberGroups = null;
  if (numericMode) {
    const built = buildHackNumberOptions(chosenLength, (advCfg.OPCIONES_NUMEROS && advCfg.OPCIONES_NUMEROS[rarityId]) || displayCount, advCfg.GRUPO_DIGITOS);
    options = built.values;
    numberGroups = built.groups;
    targetWord = options[Math.floor(Math.random() * options.length)];
  } else {
    let pool;
    if (advanced) {
      const bank = advCfg.BANCOS_PALABRAS[loopNow] || advCfg.BANCOS_PALABRAS[2];
      pool = bank[chosenLength];
    }
    if (!pool || pool.length < displayCount) pool = configH.BOLSA_PALABRAS[chosenLength] || configH.BOLSA_PALABRAS[6];
    options = [...pool].sort(() => 0.5 - Math.random()).slice(0, displayCount);
    targetWord = options[Math.floor(Math.random() * options.length)];
  }

  options.forEach(word => {
    const btn = document.createElement('button');
    btn.className = 'px-2 py-1.5 bg-emerald-950/60 border border-emerald-600/40 active:bg-emerald-800/50 rounded text-emerald-300 font-mono text-[11px] text-left';
    // Los números se muestran agrupados en bloques de 2-3 dígitos (el valor interno va sin separadores)
    btn.textContent = numericMode ? `> ${formatHackNumber(word, numberGroups)}` : `> ${word}`;
    btn.addEventListener('click', () => submitHackWord(word, btn));
    grid.appendChild(btn);
  });
}

// [0.082] Agrupa una cadena de dígitos en bloques (p. ej. "482915" -> "482 915")
function formatHackNumber(str, groups) {
  let out = [], pos = 0;
  (groups || [str.length]).forEach(g => { out.push(str.slice(pos, pos + g)); pos += g; });
  return out.join(' ');
}

// [0.082] Genera opciones numéricas "parecidas" (comparten parte de los dígitos con el objetivo)
// y comparten la misma agrupación de bloques de 2-3 dígitos. Devuelve { values: [cadenas de dígitos], groups: [tamaños] }.
function buildHackNumberOptions(length, count, groupSizes) {
  const sizes = (groupSizes && groupSizes.length) ? groupSizes : [2, 3];
  // composición aleatoria de bloques que sume exactamente `length`
  let groups = [];
  for (let tries = 0; tries < 50; tries++) {
    groups = []; let left = length;
    while (left > 0) {
      const valid = sizes.filter(g => g <= left && (left - g === 0 || left - g >= Math.min(...sizes)));
      if (!valid.length) { groups = null; break; }
      const g = valid[Math.floor(Math.random() * valid.length)];
      groups.push(g); left -= g;
    }
    if (groups) break;
  }
  if (!groups) groups = [length];

  // [0.085] Generación por columnas: cada posición solo usa 2 dígitos posibles, así los dígitos se repiten entre
  // opciones y el aviso "DENEGADO (k/n)" siempre permite descartar. Se repite el sorteo hasta que el conjunto cumple:
  //  - tanteando CUALQUIER opción, el aviso deja como mucho 2 candidatos con el mismo resultado
  //  - ninguna columna es igual en todas las opciones, ni distinta en todas (no aportaría información)
  const matchCount = (a, b) => { let k = 0; for (let i = 0; i < a.length; i++) if (a[i] === b[i]) k++; return k; };
  const worstClass = (set) => {
    let worst = 0;
    set.forEach(g => {
      const c = {};
      set.forEach(t => { if (t !== g) { const k = matchCount(g, t); c[k] = (c[k] || 0) + 1; worst = Math.max(worst, c[k]); } });
    });
    return worst;
  };
  const columnsOk = (set) => {
    for (let c = 0; c < length; c++) {
      const n = new Set(set.map(x => x[c])).size;
      if (n === 1 || n === set.length) return false;
    }
    return true;
  };
  const digits = '0123456789'.split('');
  let best = null, bestScore = Infinity;
  for (let attempt = 0; attempt < 3000; attempt++) {
    const cols = [];
    for (let c = 0; c < length; c++) cols.push([...digits].sort(() => Math.random() - 0.5).slice(0, 2));
    const set = new Set();
    let guard = 0;
    while (set.size < count && guard++ < 200) {
      let v = '';
      for (let c = 0; c < length; c++) v += cols[c][Math.floor(Math.random() * 2)];
      set.add(v);
    }
    if (set.size < count) continue;
    const arr = [...set];
    const score = worstClass(arr) + (columnsOk(arr) ? 0 : 10);
    if (score < bestScore) { bestScore = score; best = arr; }
    if (score <= 2) break;
  }
  if (!best) { // último recurso (casi imposible): opciones aleatorias distintas
    const set = new Set();
    while (set.size < count) { let v = ''; for (let i = 0; i < length; i++) v += digits[Math.floor(Math.random() * 10)]; set.add(v); }
    best = [...set];
  }
  return { values: best.sort(() => 0.5 - Math.random()), groups };
}

function submitHackWord(word, btn) { 
  if (!minigameInProgress) return;   // [0.097] tras acertar (o fallar) ya no se aceptan más palabras
  audio.playClick(0.5); 
  btn.disabled = true; 
  btn.classList.add('opacity-40');

  const history = document.getElementById('hackHistory');

  // Normalizamos ambas palabras para ignorar diacríticos (tildes/acentos) en la comparación
  const cleanWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cleanTarget = targetWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (cleanWord === cleanTarget) { 
    if (history) history.innerHTML += `<div class="text-emerald-400 font-bold">> ¡ACCESO CONCEDIDO!</div>`; 
    minigameInProgress = false; stopMinigameTimer();
    setTimeout(() => { 
      const minigameModal = document.getElementById('minigameModal'); 
      if (minigameModal) minigameModal.classList.add('hidden'); 
      
      const hackContainer = document.getElementById('hackContainer'); 
      if (hackContainer) hackContainer.classList.add('hidden'); 

      const active = STATE.screenChests[STATE.activeChestIdx]; 
      const reqCount = getRequiredToolCount(active.rarity); 
      puzzleToolPaid = null;   // [0.090] ya pagada al entrar
      triggerLootExplosion(); 
    }, 400); 
  } else { 
    let matches = 0; 
    for (let i = 0; i < Math.min(cleanWord.length, cleanTarget.length); i++) { 
      if (cleanWord[i] === cleanTarget[i]) matches++; 
    }

    hackAttemptsLeft--; 
    const attemptsEl = document.getElementById('hackAttempts'); 
    if (attemptsEl) attemptsEl.textContent = hackAttemptsLeft; 
    if (history) history.innerHTML += `<div>> DENEGADO (${matches}/${cleanTarget.length})</div>`;

    if (hackAttemptsLeft <= 0) { 
      audio.playBreak(); 
      const minigameModal = document.getElementById('minigameModal'); 
      if (minigameModal) minigameModal.classList.add('hidden'); 
      
      const hackContainer = document.getElementById('hackContainer'); 
      if (hackContainer) hackContainer.classList.add('hidden'); 

      showPersistentFeedback("⚠️ Límite de intentos alcanzado. Terminal bloqueada."); 
      handleFailure('usb'); 
    } 
  } 
}

/* ==========================================================================
   MINIJUEGO 4: RED HIDRÁULICA DE VAPOR (PIPE) - ESCALADO POR RAREZA DE COFRE
   ========================================================================== */

let pipeGridData = [];
let pipeGridSize = 3;
let pipeAdvancedActive = false;  // [0.082] ¿este intento usa bombas + VALIDAR?
let pipeValidated = false;       // [0.082] el botón VALIDAR es de un solo uso

// [0.082] Prepara (o limpia) el texto de ayuda y el botón VALIDAR del puzle hidráulico
function setupPipeAdvancedUI(advanced) {
  const pipeContainer = document.getElementById('pipeContainer');
  if (!pipeContainer) return;
  const oldBtn = document.getElementById('pipeValidateBtn');
  if (oldBtn) oldBtn.remove();
  const oldHelp = document.getElementById('pipeAdvancedHelp');
  if (oldHelp) oldHelp.remove();
  if (!advanced) return;

  const grid = document.getElementById('pipeGrid');
  const help = document.createElement('div');
  help.id = 'pipeAdvancedHelp';
  help.className = 'text-[10px] text-center text-rose-300 font-mono leading-snug';
  help.innerHTML = '<i class="fa-solid fa-bomb"></i> Evita las bombas. El fluido no se ve hasta que pulses <span class="text-sky-300 font-bold">VALIDAR</span> (un solo intento).';
  pipeContainer.insertBefore(help, grid);

  const btn = document.createElement('button');
  btn.id = 'pipeValidateBtn';
  btn.className = 'w-full py-3 bg-gradient-to-r from-sky-600 to-cyan-600 active:from-sky-500 text-white font-extrabold text-sm rounded-xl shadow-lg border border-sky-400/40 flex items-center justify-center gap-2';
  btn.innerHTML = '<i class="fa-solid fa-play"></i> VALIDAR';
  btn.addEventListener('click', validatePipeAdvanced);
  pipeContainer.appendChild(btn);
}

// [0.082] Índice vecino de una celda por un lado (0 arriba, 1 derecha, 2 abajo, 3 izquierda); -1 si fuera del tablero
function pipeNeighborIndex(idx, side, size) {
  const row = Math.floor(idx / size);
  const col = idx % size;
  if (side === 0 && row > 0) return idx - size;
  if (side === 1 && col < size - 1) return idx + 1;
  if (side === 2 && row < size - 1) return idx + size;
  if (side === 3 && col > 0) return idx - 1;
  return -1;
}

// [0.082] Simula el flujo desde la celda 0. rotKey: 'rot' (estado actual) o 'requiredRot' (solución).
// Reglas: obstáculos / fuera de tablero / tubo no conectado detienen el fluido; una bomba acepta fluido por sus 4 lados.
function simulatePipeFlow(data, size, rotKey) {
  const total = size * size;
  const visited = new Set();
  const bombs = new Set();
  const queue = [];
  if (data[0] && data[0].type !== 'stone' && data[0].type !== 'bomb') { visited.add(0); queue.push(0); }
  while (queue.length) {
    const curr = queue.shift();
    const item = data[curr];
    getPipeSides(item.type, item[rotKey]).forEach(side => {
      const n = pipeNeighborIndex(curr, side, size);
      if (n === -1) return;
      const nItem = data[n];
      if (nItem.type === 'stone') return;
      if (nItem.type === 'bomb') { bombs.add(n); return; }
      if (visited.has(n)) return;
      if (getPipeSides(nItem.type, nItem[rotKey]).includes((side + 2) % 4)) { visited.add(n); queue.push(n); }
    });
  }
  return { visited, bombs, goal: visited.has(total - 1) };
}

// [0.082] Generador: SIEMPRE devuelve un tablero con solución que llega a la salida sin tocar bombas
function generatePipeBoardAdvanced(size, nObstacles, nBombs) {
  const total = size * size;
  const lastIdx = total - 1;

  const buildPathData = (blocked, bombSet, tProb) => {
    const path = [];
    const seen = new Set();
    const dfs = (curr) => {
      path.push(curr); seen.add(curr);
      if (curr === lastIdx) return true;
      const nbs = [];
      [0, 1, 2, 3].forEach(sd => { const n = pipeNeighborIndex(curr, sd, size); if (n !== -1) nbs.push(n); });
      nbs.sort(() => Math.random() - 0.5);
      for (const n of nbs) {
        if (!seen.has(n) && !blocked.has(n)) { if (dfs(n)) return true; }
      }
      path.pop();
      return false;
    };
    if (!dfs(0)) return null;

    const data = new Array(total);
    for (let i = 0; i < total; i++) {
      if (blocked.has(i)) { data[i] = { type: bombSet.has(i) ? 'bomb' : 'stone', rot: 0, requiredRot: 0 }; }
    }
    path.forEach((curr, i) => {
      let enterSide = 0, exitSide = 2;
      if (i > 0) { const prev = path[i - 1]; if (curr === prev - size) enterSide = 2; else if (curr === prev + 1) enterSide = 3; else if (curr === prev + size) enterSide = 0; else enterSide = 1; }
      if (i < path.length - 1) { const nx = path[i + 1]; if (nx === curr - size) exitSide = 0; else if (nx === curr + 1) exitSide = 1; else if (nx === curr + size) exitSide = 2; else exitSide = 3; }
      let type = 'straight';
      if ((enterSide % 2) !== (exitSide % 2)) type = 'corner';
      else if (Math.random() < tProb) type = 't_junction';
      const good = [];
      for (let rot = 0; rot < 4; rot++) { const sd = getPipeSides(type, rot); if (sd.includes(enterSide) && sd.includes(exitSide)) good.push(rot); }
      const r = good[Math.floor(Math.random() * good.length)];
      data[curr] = { type, rot: r, requiredRot: r };
    });
    const types = ['straight', 'corner', 't_junction'];
    for (let i = 0; i < total; i++) {
      if (!data[i]) { const r = Math.floor(Math.random() * 4); data[i] = { type: types[Math.floor(Math.random() * 3)], rot: r, requiredRot: r }; }
    }
    return data;
  };

  const scramble = (data) => {
    for (let t = 0; t < 30; t++) {
      data.forEach(c => { if (c.type !== 'stone' && c.type !== 'bomb') c.rot = Math.floor(Math.random() * 4); });
      const sim = simulatePipeFlow(data, size, 'rot');
      if (!(sim.goal && sim.bombs.size === 0)) return; // no empieza ya resuelto
    }
  };

  for (let attempt = 0; attempt < 400; attempt++) {
    const slots = [];
    for (let i = 1; i < lastIdx; i++) slots.push(i);
    // [0.096] Orden aleatorio ponderado: las casillas centrales tienen más probabilidad de ser malas
    const pc = Math.max(1, (DATOS_JUEGO.MINIJUEGOS.AVANZADO.PIPE.PESO_CENTRAL || 1));
    const mid = (size - 1) / 2, maxD = Math.max(1, Math.hypot(mid, mid));
    const wkey = i => {
      const d = Math.hypot((i % size) - mid, Math.floor(i / size) - mid);
      const w = 1 + (pc - 1) * (1 - d / maxD);
      return Math.pow(Math.random(), 1 / w);
    };
    const keyed = new Map(slots.map(i => [i, wkey(i)]));
    slots.sort((a, b) => keyed.get(b) - keyed.get(a));
    const bombSet = new Set(slots.slice(0, nBombs));
    const blocked = new Set(slots.slice(0, nBombs + nObstacles));
    const data = buildPathData(blocked, bombSet, attempt < 200 ? 0.25 : 0);
    if (!data) continue;
    const sol = simulatePipeFlow(data, size, 'requiredRot');
    if (sol.goal && sol.bombs.size === 0) { scramble(data); return data; }
  }

  // Último recurso (determinista): camino por el borde, bloqueos en el interior, sin T en el camino
  const blocked = new Set(), bombSet = new Set();
  const interior = [];
  for (let r = 1; r < size - 1; r++) for (let c = 1; c < size - 1; c++) interior.push(r * size + c);
  interior.slice(0, nBombs + nObstacles).forEach((idx, k) => { blocked.add(idx); if (k < nBombs) bombSet.add(idx); });
  for (let tries = 0; tries < 200; tries++) {
    const data = buildPathData(blocked, bombSet, 0);
    if (data) {
      const sol = simulatePipeFlow(data, size, 'requiredRot');
      if (sol.goal && sol.bombs.size === 0) { scramble(data); return data; }
    }
  }
  return null;
}

// [0.082] Botón VALIDAR (un solo uso): llega a la salida sin bombas = éxito; bomba alcanzada = EXPLOSIÓN; sin salida = fallo
function validatePipeAdvanced() {
  if (pipeValidated || !minigameInProgress) return;
  pipeValidated = true;
  stopMinigameTimer();

  const btn = document.getElementById('pipeValidateBtn');
  if (btn) { btn.disabled = true; btn.classList.add('opacity-50'); btn.innerHTML = '<i class="fa-solid fa-droplet"></i> ...'; }

  const size = pipeGridSize;
  const total = size * size;
  const sim = simulatePipeFlow(pipeGridData, size, 'rot');
  const exploded = sim.bombs.size > 0;
  const success = sim.goal && !exploded;

  // Mostramos el recorrido del fluido
  for (let i = 0; i < total; i++) {
    const svgEl = document.getElementById(`pipeSvg-${i}`);
    const item = pipeGridData[i];
    if (svgEl && item.type !== 'stone' && item.type !== 'bomb') {
      const on = sim.visited.has(i);
      svgEl.style.color = on ? (exploded ? '#fb7185' : (success ? '#34d399' : '#fbbf24')) : '#64748b';
      svgEl.className = `w-full h-full ${on ? 'text-amber-400' : 'text-slate-500'} transition-colors`;
    }
  }
  sim.bombs.forEach(b => {
    const t = document.getElementById(`pipeTile-${b}`);
    if (t) { t.classList.add('animate-pulse'); t.style.background = '#be123c'; t.innerHTML += '<span class="absolute inset-0 flex items-center justify-center text-xl">💥</span>'; }
  });

  if (exploded) {
    audio.playBreak();
    const appBody = document.getElementById('appBody');
    if (appBody) { appBody.classList.add('shake-screen'); setTimeout(() => appBody.classList.remove('shake-screen'), 400); }
    if (navigator.vibrate) navigator.vibrate([200, 80, 200]);
  } else if (success) {
    audio.playClick(0.9);
  } else {
    audio.playBreak();
  }

  setTimeout(() => {
    if (!minigameInProgress) return; // el jugador abandonó mientras se mostraba el resultado
    const minigameModal = document.getElementById('minigameModal'); if (minigameModal) minigameModal.classList.add('hidden');
    const pipeContainer = document.getElementById('pipeContainer'); if (pipeContainer) pipeContainer.classList.add('hidden');
    if (success) {
      minigameInProgress = false;
      const active = STATE.screenChests[STATE.activeChestIdx];
      const reqCount = getRequiredToolCount(active.rarity);
      puzzleToolPaid = null;   // [0.090] ya pagada al entrar
      triggerLootExplosion();
    } else if (exploded) {
      showPersistentFeedback("💥 ¡EXPLOSIÓN! El fluido ha llegado a una bomba. La válvula queda destruida.");
      handleFailure('valves');
    } else {
      showPersistentFeedback("💧 El fluido no ha llegado a la salida. La válvula se pierde.");
      handleFailure('valves');
    }
  }, 1100);
}

function getPipeSides(type, rot) {
  if (type === 'straight') return (rot % 2 === 0) ? [0, 2] : [1, 3];
  if (type === 'corner') return [rot, (rot + 1) % 4];
  if (type === 't_junction') return [rot, (rot + 1) % 4, (rot + 2) % 4];
  return [];
}

function startPipeGame() {
  const configP = DATOS_JUEGO.MINIJUEGOS.PIPE;
  const active = STATE.screenChests[STATE.activeChestIdx];
  const rarityId = active ? active.rarity.id : 'normal';
  // [0.082] Bucle 2/3 (Raro+): bombas, botón VALIDAR de un solo uso y 20 s
  const pipeAdvanced = isAdvancedLoopFor(rarityId);
  const advPipe = DATOS_JUEGO.MINIJUEGOS.AVANZADO.PIPE;
  const cfgRar = pipeAdvanced
    ? advPipe.CONFIG_POR_RAREZA[rarityId]
    : (configP.CONFIG_POR_RAREZA[rarityId] || configP.CONFIG_POR_RAREZA.normal);

  let dynamicTime = rarityId === 'legendario' ? configP.TIEMPO_LEGENDARIO_SEGUNDOS : configP.TIEMPO_BASE_SEGUNDOS;
  if (pipeAdvanced) dynamicTime = advPipe.TIEMPO_SEGUNDOS;
  startMinigameTimer(dynamicTime, 'valves');

  pipeAdvancedActive = pipeAdvanced;
  pipeValidated = false;
  const pipeContainer = document.getElementById('pipeContainer'); if (pipeContainer) pipeContainer.classList.remove('hidden');
  setupPipeAdvancedUI(pipeAdvanced);

  const grid = document.getElementById('pipeGrid'); if (!grid) return;
  grid.innerHTML = '';

  pipeGridSize = cfgRar.size;
  const totalTiles = pipeGridSize * pipeGridSize;
  grid.style.gridTemplateColumns = `repeat(${pipeGridSize}, minmax(0, 1fr))`;

  let generatedAndValid = false;
  let generateAttempts = 0;

  if (pipeAdvanced) {
    // [0.082] Tablero con bombas / obstáculos y solución garantizada
    pipeGridData = generatePipeBoardAdvanced(pipeGridSize, cfgRar.obstacles, cfgRar.bombs);
    generatedAndValid = true;
  }

  while (!generatedAndValid && generateAttempts < 100) {
    generateAttempts++;
    pipeGridData = [];

    let obstacleIndices = new Set();
    while (obstacleIndices.size < cfgRar.obstacles && obstacleIndices.size < totalTiles - 2) {
      const idx = Math.floor(Math.random() * (totalTiles - 2)) + 1;
      obstacleIndices.add(idx);
    }

    for (let i = 0; i < totalTiles; i++) {
      if (obstacleIndices.has(i)) {
        pipeGridData.push({ type: 'stone', rot: 0, requiredRot: 0 });
      } else {
        pipeGridData.push({ type: 'straight', rot: 0, requiredRot: 0 });
      }
    }

    const path = [];
    const visitedPath = new Set();

    function findPath(curr) {
      path.push(curr);
      visitedPath.add(curr);

      if (curr === totalTiles - 1) return true;

      const neighbors = [];
      const r = Math.floor(curr / pipeGridSize);
      const c = curr % pipeGridSize;

      if (r > 0) neighbors.push({ idx: curr - pipeGridSize, enterSide: 2, exitSide: 0 });
      if (c < pipeGridSize - 1) neighbors.push({ idx: curr + 1, enterSide: 3, exitSide: 1 });
      if (r < pipeGridSize - 1) neighbors.push({ idx: curr + pipeGridSize, enterSide: 0, exitSide: 2 });
      if (c > 0) neighbors.push({ idx: curr - 1, enterSide: 1, exitSide: 3 });

      neighbors.sort(() => Math.random() - 0.5);

      for (let n of neighbors) {
        if (!visitedPath.has(n.idx) && !obstacleIndices.has(n.idx)) {
          if (findPath(n.idx)) return true;
        }
      }

      path.pop();
      return false;
    }

    if (!findPath(0)) continue;

    for (let i = 0; i < path.length; i++) {
      const curr = path[i];
      let enterSide = -1;
      let exitSide = -1;

      if (i > 0) {
        const prev = path[i - 1];
        if (curr === prev - pipeGridSize) enterSide = 2;
        else if (curr === prev + 1) enterSide = 3;
        else if (curr === prev + pipeGridSize) enterSide = 0;
        else if (curr === prev - 1) enterSide = 1;
      } else {
        enterSide = 0;
      }

      if (i < path.length - 1) {
        const next = path[i + 1];
        if (next === curr - pipeGridSize) exitSide = 0;
        else if (next === curr + 1) exitSide = 1;
        else if (next === curr + pipeGridSize) exitSide = 2;
        else if (next === curr - 1) exitSide = 3;
      } else {
        exitSide = 2;
      }

      let type = 'straight';
      if ((enterSide % 2) !== (exitSide % 2)) type = 'corner';
      else if (Math.random() < 0.25) type = 't_junction';

      let correctRot = 0;
      for (let rot = 0; rot < 4; rot++) {
        const sides = getPipeSides(type, rot);
        if (sides.includes(enterSide) && sides.includes(exitSide)) {
          correctRot = rot;
          break;
        }
      }

      pipeGridData[curr] = { type, rot: correctRot, requiredRot: correctRot };
    }

    const pathSet = new Set(path);
    for (let i = 0; i < totalTiles; i++) {
      if (!pathSet.has(i) && !obstacleIndices.has(i)) {
        const types = ['straight', 'corner', 't_junction'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomRot = Math.floor(Math.random() * 4);
        pipeGridData[i] = { type: randomType, rot: randomRot, requiredRot: randomRot };
      }
    }

    for (let i = 0; i < totalTiles; i++) {
      if (!obstacleIndices.has(i)) {
        pipeGridData[i].rot = Math.floor(Math.random() * 4);
      }
    }

    generatedAndValid = validateBoardBFS(totalTiles);
  }

  for (let i = 0; i < totalTiles; i++) {
    const item = pipeGridData[i];
    const tile = document.createElement('button');
    const tileSizeClass = pipeGridSize === 3 ? 'w-14 h-14' : (pipeGridSize === 4 ? 'w-11 h-11' : 'w-9 h-9');

    let borderClass = 'border-slate-700 bg-slate-800';
    if (item.type === 'stone') borderClass = 'border-amber-600/80 bg-amber-950/40';
    if (item.type === 'bomb') borderClass = 'border-rose-600/80 bg-rose-950/50';

    tile.className = `${tileSizeClass} ${borderClass} border-2 rounded-lg flex items-center justify-center p-1 transition-all relative`;
    tile.id = `pipeTile-${i}`;

    let label = '';
    if (i === 0) label = '<span class="absolute top-0.5 left-1 text-[8px] font-mono font-bold text-emerald-400">IN</span>';
    if (i === totalTiles - 1) label = '<span class="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-rose-400">OUT</span>';
    if (item.type === 'stone') label += '<span class="absolute top-0.5 right-1 text-[9px] text-amber-500"><i class="fa-solid fa-cube"></i></span>';
    if (item.type === 'bomb') label += '<span class="absolute inset-0 flex items-center justify-center text-lg text-rose-400"><i class="fa-solid fa-bomb"></i></span>';

    let svgContent = '';
    if (item.type === 'straight') {
      svgContent = `<line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`;
    } else if (item.type === 'corner') {
      svgContent = `<path d="M 20,0 A 20,20 0 0,1 40,20" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`;
    } else if (item.type === 't_junction') {
      svgContent = `<line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><line x1="20" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`;
    } else {
      svgContent = `<div class="w-4 h-4 bg-amber-800 rounded border border-amber-600"></div>`;
    }

    tile.innerHTML = `
      ${label}
      <svg id="pipeSvg-${i}" class="w-full h-full ${(item.type === 'stone' || item.type === 'bomb') ? 'hidden' : 'text-slate-500'} transition-colors" viewBox="0 0 40 40" style="transform: rotate(${item.rot * 90}deg)">
        ${svgContent}
      </svg>
    `;

    if (item.type !== 'stone' && item.type !== 'bomb') {
      tile.addEventListener('click', () => {
        if (pipeAdvanced && pipeValidated) return; // tras VALIDAR el tablero queda bloqueado
        if (!minigameInProgress) return;   // [0.097] tras acertar no se pueden girar más tuberías
        audio.playClick(0.5);
        item.rot = (item.rot + 1) % 4;
        const svg = document.getElementById(`pipeSvg-${i}`);
        if (svg) svg.style.transform = `rotate(${item.rot * 90}deg)`;
        // [0.082] En la versión avanzada NO se pinta el fluido en tiempo real ni hay victoria automática
        if (!pipeAdvanced) evaluatePipeFlow();
      });
    }

    grid.appendChild(tile);
  }

  if (!pipeAdvanced) evaluatePipeFlow();
}

function validateBoardBFS(totalTiles) {
  let visited = new Set();
  let queue = [];

  const item0 = pipeGridData[0];
  if (item0 && item0.type !== 'stone') {
    visited.add(0);
    queue.push(0);
  }

  const getNeighborIndex = (idx, side) => {
    const row = Math.floor(idx / pipeGridSize);
    const col = idx % pipeGridSize;
    if (side === 0 && row > 0) return idx - pipeGridSize;
    if (side === 1 && col < pipeGridSize - 1) return idx + 1;
    if (side === 2 && row < pipeGridSize - 1) return idx + pipeGridSize;
    if (side === 3 && col > 0) return idx - 1;
    return -1;
  };

  while (queue.length > 0) {
    const curr = queue.shift();
    const item = pipeGridData[curr];
    if (item.type === 'stone') continue;

    const currSides = getPipeSides(item.type, item.requiredRot);
    currSides.forEach(side => {
      const n = getNeighborIndex(curr, side);
      if (n !== -1 && !visited.has(n)) {
        const nItem = pipeGridData[n];
        if (nItem.type !== 'stone') {
          const nSides = getPipeSides(nItem.type, nItem.requiredRot);
          if (nSides.includes((side + 2) % 4)) {
            visited.add(n);
            queue.push(n);
          }
        }
      }
    });
  }

  return visited.has(totalTiles - 1);
}

function evaluatePipeFlow() {
  const totalTiles = pipeGridSize * pipeGridSize;
  let visited = new Set();
  let queue = [];

  const item0 = pipeGridData[0];
  if (item0 && item0.type !== 'stone') {
    visited.add(0);
    queue.push(0);
  }

  const getNeighborIndex = (idx, side) => {
    const row = Math.floor(idx / pipeGridSize);
    const col = idx % pipeGridSize;
    if (side === 0 && row > 0) return idx - pipeGridSize;
    if (side === 1 && col < pipeGridSize - 1) return idx + 1;
    if (side === 2 && row < pipeGridSize - 1) return idx + pipeGridSize;
    if (side === 3 && col > 0) return idx - 1;
    return -1;
  };

  while (queue.length > 0) {
    const curr = queue.shift();
    const item = pipeGridData[curr];
    if (item.type === 'stone') continue;

    const currSides = getPipeSides(item.type, item.rot);
    currSides.forEach(side => {
      const n = getNeighborIndex(curr, side);
      if (n !== -1 && !visited.has(n)) {
        const nItem = pipeGridData[n];
        if (nItem.type !== 'stone') {
          const nSides = getPipeSides(nItem.type, nItem.rot);
          if (nSides.includes((side + 2) % 4)) {
            visited.add(n);
            queue.push(n);
          }
        }
      }
    });
  }

  for (let i = 0; i < totalTiles; i++) {
    const svgEl = document.getElementById(`pipeSvg-${i}`);
    if (svgEl && pipeGridData[i].type !== 'stone') {
      if (visited.has(i)) {
        svgEl.style.color = '#fbbf24';
        svgEl.className = "w-full h-full text-amber-400 transition-colors";
      } else {
        svgEl.style.color = '#64748b';
        svgEl.className = "w-full h-full text-slate-500 transition-colors";
      }
    }
  }

  const outConnected = visited.has(totalTiles - 1);

  const tileOut = document.getElementById(`pipeTile-${totalTiles - 1}`);
  if (tileOut) {
    if (outConnected) {
      tileOut.className = tileOut.className.replace('border-slate-700 bg-slate-800', 'border-emerald-500 bg-emerald-950/60 shadow-lg shadow-emerald-900/40');
      const outSvg = document.getElementById(`pipeSvg-${totalTiles - 1}`);
      if (outSvg) {
        outSvg.style.color = '#34d399';
        outSvg.className = "w-full h-full text-emerald-400 transition-colors";
      }
      
      minigameInProgress = false;
      stopMinigameTimer();
      setTimeout(() => {
        const minigameModal = document.getElementById('minigameModal');
        if (minigameModal) minigameModal.classList.add('hidden');
        const pipeContainer = document.getElementById('pipeContainer');
        if (pipeContainer) pipeContainer.classList.add('hidden');

        const active = STATE.screenChests[STATE.activeChestIdx];
        const reqCount = getRequiredToolCount(active.rarity);
        puzzleToolPaid = null;   // [0.090] ya pagada al entrar
        triggerLootExplosion();
      }, 400);
    } else {
      tileOut.className = tileOut.className.replace('border-emerald-500 bg-emerald-950/60 shadow-lg shadow-emerald-900/40', 'border-slate-700 bg-slate-800');
    }
  }
}
