// ==========================================================================
// JUST ONE MORE CHEST — estado.js — VERSIÓN 0.101
// estado, wildcards, guardado, logros, estadísticas, reinicio
// ==========================================================================

// [0.1] Movida desde graficos.js: la usan ya al cargar estado.js
function uiHost() { return document.getElementById('gameFrame') || document.body; }


function getXpForLevel(lvl) {
  const baseMap = DATOS_JUEGO.PROGRESIÓN.XP_BASE_NIVELES;
  if (baseMap[lvl]) return baseMap[lvl];
  return Math.floor(baseMap[5] * Math.pow(DATOS_JUEGO.PROGRESIÓN.XP_MULTIPLICADOR_POST_5, lvl - 5));
}

let curseHold = false;   // [0.096] el tinte de maldición se mantiene hasta que se cierra el mensaje de fin de maldición
const STATE = {
  currentLoop: 1, // Control de Bucle (1 o 2)
  level: DATOS_JUEGO.CONFIG_INICIAL.NIVEL,
  xp: 0,
  xpNext: getXpForLevel(DATOS_JUEGO.CONFIG_INICIAL.NIVEL),
  gold: DATOS_JUEGO.CONFIG_INICIAL.ORO,
  chestsOpened: 0,
  chestsAtLevelUp: 0,
  chestCounterUnlocked: false,
  cleanStreak: 0,
  paranoiaStage: 0,
  traperoVisits: 0,
  lastTraperoChest: 0,

  eventQueue: [],
  
  salvageDealsCount: 0,
  salvageCurseActive: false,

  picks: DATOS_JUEGO.CONFIG_INICIAL.GANZUAS,
  proPicks: DATOS_JUEGO.CONFIG_INICIAL.PINES,
  usb: DATOS_JUEGO.CONFIG_INICIAL.USB,
  valves: DATOS_JUEGO.CONFIG_INICIAL.VALVULAS,

  noXpChestsLeft: 0,
  picksBrokenOnUse: false,
  tanteoExplainedLoop: 0,   // [0.082] bucle en el que el Trapero ya explicó la penalización por tanteo
  pendingTanteoPhrase: null, // [0.082] frase del Trapero pendiente de mostrarse al recoger el botín
  xpBoostChestsLeft: 0,
  torpezas: {
    madera: 0,
    acero: 0,
    digital: 0,
    vapor: 0
  },

  seqStage: 0,
  traperoStrikes: 0,
  boughtInCurrentShop: false,
  climaxPhase: false,
  sequenceBroken: false,

  shopSession: null,
  currentShopOffer: null,

  perks: {
    sweetSpot: 0,
    rarityBonus: 0,
    discount: 0,
    slowerPistons: 0,
    goldStreak: 0,
    extraTime: 0,
    oidoClinico: 0,
    shopStealFree: false,
    luckyLootChance: 0,
    bonusMadera: 0,
    bonusAcero: 0,
    bonusDigital: 0,
    bonusVapor: 0
  },

  abilities: { auto: 0, double: 0, shield: 0, reveal: 0, riskPot: 0, perdedor: 0, summonDuende: 0 },
  active2XMultiplier: false,
  activeShield: false,
  
  riskModeActive: false,
  riskPot: 0,

  perdedorActive: false,
  perdedorLootPending: false,   // [0.085] el siguiente cofre abierto da botín (XP y GP) legendario x2
  fallosConsecutivos: 0,

  heavyChestsLeft: 0,
  greedCurseLeft: 0,
  harderPuzzlesLeft: 0,
  blankNotes: {},      // [0.095] textos del jugador por bucle: {bucle: {cofre: texto}}
  pendingNotes: [],    // [0.095] post-its de jugador visibles ahora (se guardan para poder continuar)
  mods: {},   // [0.093] modificadores de wildcard con duración: {id: cofres_restantes}
  traperoBuffs: { bonusXp: false, harderMinigames: false, shortPipeTimer: false, doubleGold: false },
  cursedChestsLeft: 0,

  screenChests: [],
  activeChestIdx: 0,
  roomDecorations: [],
  roomThemeFilter: 'normal',
  stats: null,   // [0.090] estadísticas de la partida actual (se guardan con la partida)
  hintUses: {},   // [0.090] veces que se ha mostrado cada ayuda de las primeras veces (por partida)
  acceptDelayUses: {},   // [0.089b] veces que se ha retardado el botón Aceptar, por tipo de mensaje (por partida)
  opensByType: {},   // [0.087] cofres abiertos con éxito por tipo (para la flecha del cerrojo)
  roomDarkUntil: 0   // [0.086] la celda está a oscuras mientras chestsOpened < roomDarkUntil
};

// 🟢 CANDADO GLOBAL ANTI-DUPLICACIÓN DE BOTÍN
let isLootProcessing = false;

const CHEST_RARITIES = [
  { id: 'normal', name: 'NORMAL', multiplier: DATOS_JUEGO.ECONOMIA.MULTIPLICADORES_RAREZA.normal, border: 'border-slate-600', color: '#94a3b8' },
  { id: 'raro', name: 'RARO', multiplier: DATOS_JUEGO.ECONOMIA.MULTIPLICADORES_RAREZA.raro, border: 'border-blue-500', color: '#3b82f6' },
  { id: 'epico', name: 'ÉPICO', multiplier: DATOS_JUEGO.ECONOMIA.MULTIPLICADORES_RAREZA.epico, border: 'border-purple-500', color: '#a855f7' },
  { id: 'legendario', name: 'LEGENDARIO', multiplier: DATOS_JUEGO.ECONOMIA.MULTIPLICADORES_RAREZA.legendario, border: 'border-amber-500', color: '#f59e0b' }
];

function getMasteryTorpezaPct(level) {
  if (!level || level <= 0) return 0;
  const base = DATOS_JUEGO.ECONOMIA.PORCENTAJE_MAESTRIA_TORPEZA_BASE;
  const inc = DATOS_JUEGO.ECONOMIA.INCREMENTO_MAESTRIA_TORPEZA_POR_NIVEL;
  return base + ((level - 1) * inc);
}

function getNarrativeTier() {
  const co = STATE.chestsOpened;
  const umbrales = DATOS_JUEGO.NARRATIVA.UMBRALES_TIERS;
  if (co <= umbrales.tier_1) return 1;
  if (co <= umbrales.tier_2) return 2;
  if (co <= umbrales.tier_3) return 3;
  if (co <= umbrales.tier_4) return 4;
  return 5;
}

function processNextQueuedEvent() {
  if (STATE.eventQueue.length > 0) {
    const nextEvent = STATE.eventQueue.shift();
    setTimeout(() => nextEvent(), 250);
  }
}

/* ==========================================================================
   [CAMBIO] SISTEMAS AÑADIDOS EN ESTA VERSIÓN
   Estado de minijuego, banner, Regateador, silencio, wildcards, guardado y
   confirmación de reinicio. Todo vive en el JS (no exige tocar HTML ni CSS).
   ========================================================================== */

// Estado de ejecución (no se guarda)
let minigameInProgress = false;
let specialShopOpen = false;

// El banner de feedback cuelga del marco de juego (#gameFrame) para quedar por encima de los modales
(function relocateFeedbackBanner() {
  const banner = document.getElementById('persistentFeedbackBanner');
  if (banner && banner.parentElement !== uiHost()) uiHost().appendChild(banner);
})();

/* ---------- Regateador: 15% base + 5% por nivel, con precio mínimo ---------- */
function getDiscountPct() {
  const lvl = STATE.perks.discount || 0;
  if (lvl <= 0) return 0;
  const cfg = DATOS_JUEGO.ECONOMIA.REGATEADOR;
  const maxPct = 1 - cfg.precio_minimo_pct;
  return Math.min(maxPct, cfg.base + (lvl - 1) * cfg.incremento);
}

function getDiscountMultiplier() {
  return 1 - getDiscountPct();
}

/* ---------- Botón de silencio ---------- */
function updateMuteButton() {
  const btn = document.getElementById('muteBtn');
  if (!btn) return;
  btn.innerHTML = audio.muted
    ? '<i class="fa-solid fa-volume-xmark"></i>'
    : '<i class="fa-solid fa-volume-high"></i>';
}

(function setupMuteButton() {
  const btn = document.getElementById('muteBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    audio.applyProfile();   // [0.090] el canal vivo se apaga con el silencio
    if (!audio.muted) {
      audio.init();
      audio.playClick(0.6);
    }
    updateMuteButton();
    if (audio.muted) {
      showPersistentFeedback("🔇 El sonido forma parte de la experiencia al abrir cofres: te recomendamos jugar con él activado.");
    }
    scheduleSave();
  });
})();

/* ---------- Minijuegos: cierre limpio y abandono ---------- */
function hideAllMinigameUI() {
  stopMinigameTimer();
  lpState.isTension = false;
  if (tumblerAnimationFrameId) {
    cancelAnimationFrame(tumblerAnimationFrameId);
    tumblerAnimationFrameId = null;
  }
  const minigameModal = document.getElementById('minigameModal');
  if (minigameModal) minigameModal.classList.add('hidden');
  ['lockpickContainer', 'tumblerContainer', 'hackContainer', 'pipeContainer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

// [0.084] ¿El puzle en curso es la cerradura trampa (cofre troll) de madera?
function isTrapLockpickActive() {
  const active = STATE.screenChests[STATE.activeChestIdx];
  return !!(active && active.type.juego === 'lockpick' && lpState.isTrapChest);
}

// La X de los puzles cuenta como fallo: cobra la herramienta (en la ganzúa, ganzúa rota)
function abandonCurrentMinigame() {
  if (!minigameInProgress) {
    hideAllMinigameUI();
    return;
  }
  audio.playBreak();
  hideAllMinigameUI();
  showPersistentFeedback("🚪 Has abandonado el puzle: cuenta como fallo y pierdes la herramienta.");
  if (isTrapLockpickActive()) showPersistentFeedback(DATOS_JUEGO.MINIJUEGOS.LOCKPICK.MENSAJES_TRAMPA.ABANDONO, 'trampa');
  handleFailure(currentPuzzleConsumable);
}

/* ---------- Wildcards de subida de nivel ---------- */
const TACTICA_A_HABILIDAD = {
  auto_open: 'auto',
  doble_2x: 'double',
  escudo: 'shield',
  apuesta_riesgo: 'riskPot',
  carta_perdedor: 'perdedor',
  invocar_duende: 'summonDuende'
};

function getWildcardBadChance() {
  const table = DATOS_JUEGO.PROBABILIDADES.WILDCARD_MALA_POR_BUCLE;
  const loop = Math.min(STATE.currentLoop || 1, 3);
  return table[loop] !== undefined ? table[loop] : table[1];
}

function getUnlockedConsumables() {
  const list = [{ prop: 'picks', name: 'Ganzúa' }];
  if (STATE.level >= 2) list.push({ prop: 'proPicks', name: 'Pin de Acero' });
  if (STATE.level >= 3) list.push({ prop: 'usb', name: 'Llave USB' });
  if (STATE.level >= 5) list.push({ prop: 'valves', name: 'Válvula' });
  return list;
}

// Aplica el efecto de un wildcard según su 'efecto' y 'valor'. Devuelve un texto extra para el banner.
// [0.093] Oro fijo de los wildcards escalado por nivel; y descripción con {n} escalado
function wcGold(n) { return Math.max(1, Math.round(n * (1 + ((DATOS_JUEGO.MODS_WILDCARD || {}).ESCALA_ORO_POR_NIVEL || 0) * Math.max(0, STATE.level - 1)))); }
function wcDesc(wc) { return String(wc.desc).replace(/\{(\d+)\}/g, (m, n) => wcGold(+n)); }
const MODS_POR_USOS = ['seda', 'congelada'];   // [0.096] caducan por USOS (un fallo salvado = 1), no por cofres abiertos
function useMod(id) { if (!STATE.mods || !(STATE.mods[id] > 0)) return 0; STATE.mods[id]--; const left = STATE.mods[id]; if (left <= 0) delete STATE.mods[id]; saveDirty = true; return Math.max(0, left); }
function modOn(id) { return !!(STATE.mods && STATE.mods[id] > 0); }

function applyWildcard(wc) {
  let extra = '';
  switch (wc.efecto) {
    case 'MODIFICADOR':
      STATE.mods = STATE.mods || {};
      STATE.mods[wc.valor.id] = (STATE.mods[wc.valor.id] || 0) + (wc.valor.cofres != null ? wc.valor.cofres : wc.valor.usos);   // [0.096] 'usos' = Seda y Racha Congelada (caducan por fallos salvados, no por cofres)
      break;
    case 'PERDER_ORO': {
      const lost = Math.min(STATE.gold, wcGold(wc.valor));
      STATE.gold -= lost;
      extra = `-${lost} GP`;
      break;
    }
    case 'DAR_ORO':
      { const g = wcGold(wc.valor); STATE.gold += g; extra = `+${g} GP`; }
      break;
    case 'DAR_XP':
      STATE.xp += wc.valor;
      extra = `+${wc.valor} XP`;
      break;
    case 'DAR_XP_PCT_NIVEL': {
      // [0.084] Escala con el nivel: % de la XP que exige el nivel actual (valor = 0.20 -> 20%)
      const xpGain = Math.max(1, Math.round(STATE.xpNext * wc.valor));
      STATE.xp += xpGain;
      extra = `+${xpGain} XP`;
      break;
    }
    case 'DAR_HERRAMIENTAS':
      Object.keys(wc.valor).forEach(prop => { STATE[prop] += wc.valor[prop]; });
      break;
    case 'DAR_CARTA':
      Object.keys(wc.valor).forEach(prop => { STATE.abilities[prop] += wc.valor[prop]; });
      break;
    case 'PERDER_HERRAMIENTAS': {   // [0.092] nunca deja menos de 1 (para no bloquear la partida)
      const lost = [];
      Object.keys(wc.valor).forEach(prop => { const n = Math.max(0, Math.min(wc.valor[prop], (STATE[prop] || 0) - 1)); STATE[prop] -= n; if (n) lost.push(`-${n}`); });
      extra = lost.length ? lost.join(', ') + (wc.valor.picks ? ' Ganzúa' : '') : 'Por suerte, no tenías de sobra';
      break;
    }
    case 'COFRES_PESADOS':
      STATE.heavyChestsLeft += wc.valor;
      break;
    case 'MALDICION_CODICIA':
      STATE.greedCurseLeft += wc.valor;
      break;
    case 'PUZLES_EXIGENTES':
      STATE.harderPuzzlesLeft += wc.valor;
      break;
    case 'OTORGAR_CARTA_TACTICA_AZAR': {
      const tacticas = DATOS_JUEGO.CARTAS_NIVEL.TACTICAS;
      const card = tacticas[Math.floor(Math.random() * tacticas.length)];
      const prop = TACTICA_A_HABILIDAD[card.id];
      if (prop) STATE.abilities[prop]++;
      extra = `Carta: ${card.titulo}`;
      break;
    }
    case 'OTORGAR_CONSUMIBLE_DOBLE_AZAR': {
      const pool = getUnlockedConsumables();
      const got = {};
      for (let i = 0; i < wc.valor; i++) {
        const pick = pool[Math.floor(Math.random() * pool.length)];
        STATE[pick.prop]++;
        got[pick.name] = (got[pick.name] || 0) + 1;
      }
      extra = Object.keys(got).map(n => `+${got[n]} ${n}`).join(', ');
      break;
    }
    default:
      console.warn('Wildcard sin efecto conocido:', wc.id);
  }
  return extra;
}

// [0.092] Elige el wildcard (con 'peso' opcional), lo aplica YA (así el guardado nunca se pierde) y devuelve {wc, extra, isBad}
function pickWildcard() {
  const wcList = DATOS_JUEGO.WILDCARDS || [];
  if (wcList.length === 0) return null;
  const wantBad = Math.random() < getWildcardBadChance();
  const okList = wcList.filter(w => !w.minNivel || STATE.level >= w.minNivel);
  let pool = okList.filter(w => (w.tipo === 'PERJUDICIAL') === wantBad);
  if (pool.length === 0) pool = okList.length ? okList : wcList;
  const tot = pool.reduce((a, w) => a + (w.peso != null ? w.peso : 1), 0);
  let r = Math.random() * tot, wc = pool[pool.length - 1];
  for (const w of pool) { r -= (w.peso != null ? w.peso : 1); if (r <= 0) { wc = w; break; } }
  const extra = applyWildcard(wc);
  return { wc, extra, isBad: wc.tipo === 'PERJUDICIAL' };
}

// [0.092] Ruleta de la subida de nivel: la carta cambia con "ruiditos" cada vez más lentos hasta la ganadora (con su sonido y explicación).
// Después aparece SIGUIENTE para ver las 3 mejoras. Tiempos y número de pasos en DATOS_JUEGO.SUBIDA_NIVEL.
let lvlTimers = [];
function lvlClearTimers() { lvlTimers.forEach(t => clearTimeout(t)); lvlTimers = []; }
function runWildcardRoulette(res, onDone) {
  const banner = document.getElementById('wildcardBanner');
  const cfg = DATOS_JUEGO.SUBIDA_NIVEL || {};
  const wcList = DATOS_JUEGO.WILDCARDS || [];
  if (!banner || !res) { if (banner) banner.classList.add('hidden'); onDone(); return; }
  banner.classList.remove('hidden');
  banner.style.minHeight = '150px';   // [0.095] misma altura al girar y al parar: la carta no cambia de tamaño
  const paint = (wc, state, extra) => {   // state: 'spin' | 'win'
    const bad = wc.tipo === 'PERJUDICIAL';
    const tone = bad ? 'bg-rose-950/80 border-rose-500/60 text-rose-200' : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200';
    banner.className = 'w-full max-w-xs p-3 rounded-2xl border-2 font-mono text-xs mb-3 text-center shadow-lg flex flex-col justify-center ' + (state === 'win' ? tone + ' lvl-card-win' : tone.replace('/80', '/40').replace('/60', '/50') + ' lvl-card-spin');
    banner.innerHTML = state === 'win' ? `
      <div class="text-[9px] tracking-widest opacity-70 mb-1">${bad ? 'EVENTO ADVERSO' : 'EVENTO FAVORABLE'}</div>
      <div class="font-black uppercase tracking-wider mb-1 text-sm">${bad ? '⚠️' : '✨'} ${wc.nombre}</div>
      <div class="opacity-90">${wcDesc(wc)}</div>
      ${extra ? `<div class="mt-1 font-bold">${extra}</div>` : ''}` : `
      <div class="text-[9px] tracking-widest opacity-60 mb-1">EL DESTINO GIRA...</div>
      <div class="font-black uppercase tracking-wider text-sm py-2">${wc.nombre}</div>`;
  };
  const steps = Math.max(6, cfg.RULETA_PASOS || 20), d0 = cfg.RULETA_MS_INICIAL || 50, d1 = cfg.RULETA_MS_FINAL || 340, curve = cfg.RULETA_CURVA || 2.5;
  const seq = []; let prev = null;
  for (let i = 0; i < steps; i++) { let w; let guard = 0; do { w = wcList[Math.floor(Math.random() * wcList.length)]; } while ((w === prev || w === res.wc) && wcList.length > 2 && ++guard < 20); seq.push(w); prev = w; }
  let acc = 0;
  seq.forEach((w, i) => {
    acc += d0 + Math.pow(i / steps, curve) * (d1 - d0);
    lvlTimers.push(setTimeout(() => { paint(w, 'spin'); try { audio.playRouletteTick(i / steps); } catch (e) {} }, acc));
  });
  lvlTimers.push(setTimeout(() => {
    paint(res.wc, 'win', res.extra);
    try { if (res.isBad) { audio.playBreak(); screenShake(5, 260); } else audio.playUnlockFanfare('raro'); } catch (e) {}
    updateUI();
    lvlTimers.push(setTimeout(onDone, cfg.PAUSA_TRAS_RULETA_MS != null ? cfg.PAUSA_TRAS_RULETA_MS : 450));
  }, acc + (cfg.RULETA_MS_FINAL_PAUSA || 520)));
}

/* ---------- Guardado de partida (autoguardado en una ranura) ---------- */
const SAVE_KEY = 'justOneMoreChest_save_v1';
const SAVE_VERSION = 1;
const SAVE_KEYS = [
  'currentLoop', 'level', 'xp', 'gold', 'chestsOpened', 'chestsAtLevelUp', 'chestCounterUnlocked',
  'cleanStreak', 'paranoiaStage', 'traperoVisits', 'lastTraperoChest', 'salvageDealsCount', 'salvageCurseActive',
  'picks', 'proPicks', 'usb', 'valves', 'noXpChestsLeft', 'picksBrokenOnUse', 'tanteoExplainedLoop', 'xpBoostChestsLeft', 'torpezas',
  'seqStage', 'traperoStrikes', 'climaxPhase', 'sequenceBroken', 'perks', 'abilities',
  'active2XMultiplier', 'activeShield', 'riskModeActive', 'riskPot', 'perdedorActive', 'perdedorLootPending', 'fallosConsecutivos',
  'heavyChestsLeft', 'greedCurseLeft', 'harderPuzzlesLeft', 'mods', 'blankNotes', 'pendingNotes', 'traperoBuffs', 'cursedChestsLeft',
  'roomDecorations', 'roomThemeFilter', 'roomDarkUntil', 'opensByType', 'acceptDelayUses', 'hintUses', 'stats'
];

let autosaveEnabled = false;
let saveDirty = false;

// Si el navegador bloquea el almacenamiento (p. ej. dentro de CodePen), el juego sigue funcionando sin guardar
function storageGet(key) {
  try { return window.localStorage.getItem(key); } catch (e) { return null; }
}
function storageSet(key, value) {
  try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
}
function storageRemove(key) {
  try { window.localStorage.removeItem(key); } catch (e) { /* sin almacenamiento */ }
}

/* ---------- Logros (guardado propio, independiente de la partida) ---------- */
const ACHIEVEMENTS_KEY = 'justOneMoreChest_logros_v1';
let achievementsUnlocked = {};
let achievementBannerQueue = [];
let achievementBannerBusy = false;

function loadAchievements() {
  try {
    const raw = storageGet(ACHIEVEMENTS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    achievementsUnlocked = (data && typeof data === 'object') ? data : {};
  } catch (e) { achievementsUnlocked = {}; }
}
function saveAchievements() { storageSet(ACHIEVEMENTS_KEY, JSON.stringify(achievementsUnlocked)); }
function clearAchievements() { achievementsUnlocked = {}; storageRemove(ACHIEVEMENTS_KEY); }


/* ---------- [0.090] Estadísticas: PARTIDA ACTUAL (se guardan con la partida) y ACUMULADO (permanentes por navegador) ---------- */
const LIFESTATS_KEY = 'justOneMoreChest_stats_v1';
function blankStats() {
  return { chests: 0, goldEarned: 0, goldSpent: 0, picksBroken: 0, bestStreak: 0, maxLevel: 1, maxLoop: 1,
    puz: { lockpick: { ok: 0, fail: 0 }, tumbler: { ok: 0, fail: 0 }, hack: { ok: 0, fail: 0 }, pipe: { ok: 0, fail: 0 } } };
}
function normStats(o) {
  const b = blankStats();
  if (!o || typeof o !== 'object') return b;
  Object.keys(b).forEach(k => { if (k === 'puz') { Object.keys(b.puz).forEach(t => { const q = (o.puz || {})[t] || {}; b.puz[t].ok = +q.ok || 0; b.puz[t].fail = +q.fail || 0; }); } else b[k] = +o[k] || b[k]; });
  return b;
}
let lifeStats = blankStats();
try { lifeStats = normStats(JSON.parse(window.localStorage.getItem(LIFESTATS_KEY) || 'null')); } catch (e) { lifeStats = blankStats(); }
let lifeStatsDirty = false, statsGoldPrev = null;
function saveLifeStats() { if (!lifeStatsDirty) return; lifeStatsDirty = false; try { window.localStorage.setItem(LIFESTATS_KEY, JSON.stringify(lifeStats)); } catch (e) {} }
setInterval(saveLifeStats, 3000);
window.addEventListener('pagehide', saveLifeStats);
let statsPaused = false;   // el Modo test (puzles en serie) no cuenta para las estadísticas
function statsAdd(key, n) {
  if (statsPaused) return;
  if (!STATE.stats) STATE.stats = blankStats();
  STATE.stats[key] = (STATE.stats[key] || 0) + n; lifeStats[key] = (lifeStats[key] || 0) + n; lifeStatsDirty = true;
}
function statsPuzzle(juego, ok) {
  if (statsPaused || !juego) return;
  if (!STATE.stats) STATE.stats = blankStats();
  [STATE.stats, lifeStats].forEach(S => { if (S.puz[juego]) S.puz[juego][ok ? 'ok' : 'fail']++; });
  lifeStatsDirty = true;
}
function trackStats() {
  if (statsPaused) { statsGoldPrev = STATE.gold; return; }
  if (!STATE.stats) STATE.stats = normStats(null);
  if (statsGoldPrev !== null) {
    const d = STATE.gold - statsGoldPrev;
    if (d > 0) statsAdd('goldEarned', d); else if (d < 0) statsAdd('goldSpent', -d);
  }
  statsGoldPrev = STATE.gold;
  [[STATE.stats, 'cur'], [lifeStats, 'life']].forEach(([S]) => {
    if (STATE.level > S.maxLevel) { S.maxLevel = STATE.level; lifeStatsDirty = true; }
    if ((STATE.currentLoop || 1) > S.maxLoop) { S.maxLoop = STATE.currentLoop || 1; lifeStatsDirty = true; }
    if (STATE.cleanStreak > S.bestStreak) { S.bestStreak = STATE.cleanStreak; lifeStatsDirty = true; }
  });
}
let puzzleStat = null;   // tipo de puzle en curso (para contar acierto/fallo)

function isAchievementMet(logro) {
  const c = logro.condicion || {};
  if (c.tipo === 'COFRES_ABIERTOS') return STATE.chestsOpened >= c.valor;
  return false;
}

function checkAchievements() {
  const cfg = DATOS_JUEGO.LOGROS;
  if (!cfg || !cfg.LISTA) return;
  let changed = false;
  cfg.LISTA.forEach(l => {
    if (achievementsUnlocked[l.id]) return;
    if (isAchievementMet(l)) {
      achievementsUnlocked[l.id] = Date.now();
      changed = true;
      achievementBannerQueue.push(l);
    }
  });
  if (changed) saveAchievements();
  showNextAchievementBanner();
}

function showNextAchievementBanner() {
  if (achievementBannerBusy || !achievementBannerQueue.length) return;
  achievementBannerBusy = true;
  const l = achievementBannerQueue.shift();
  let el = document.getElementById('achievementBanner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'achievementBanner';
    el.className = 'fixed left-1/2 bottom-4 z-[9998] -translate-x-1/2 pointer-events-none';
    el.style.transition = 'opacity .35s ease, transform .35s ease';
    el.style.opacity = '0';
    el.style.transform = 'translate(-50%, 20px)';
    uiHost().appendChild(el);
  }
  el.innerHTML = `<div class="flex items-center gap-3 bg-slate-950/95 border-2 border-amber-400 rounded-xl px-4 py-2 shadow-2xl font-mono">
    <span class="text-2xl">${l.icono || '🏆'}</span>
    <div><div class="text-[10px] text-amber-400 tracking-widest uppercase">Logro desbloqueado</div>
    <div class="text-sm font-black text-white">${l.titulo}</div>
    <div class="text-xs text-slate-300">${l.descripcion}</div></div></div>`;
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translate(-50%, 0)'; });
  try { audio.playUnlockFanfare('epico'); } catch (e) {}
  setTimeout(() => {
    el.style.opacity = '0'; el.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => { achievementBannerBusy = false; showNextAchievementBanner(); }, 400);
  }, DATOS_JUEGO.LOGROS.DURACION_BANNER_MS || 4000);
}
loadAchievements();

function readSave() {
  const raw = storageGet(SAVE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== SAVE_VERSION || !data.state) return null;
    return data;
  } catch (e) {
    return null;
  }
}

function clearSave() {
  storageRemove(SAVE_KEY);
}

function saveGame() {
  const snapshot = {};
  SAVE_KEYS.forEach(k => { snapshot[k] = STATE[k]; });
  storageSet(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, savedAt: Date.now(), state: snapshot, muted: audio.muted }));
}

function loadGame() {
  const data = readSave();
  if (!data) return false;
  const saved = data.state;
  SAVE_KEYS.forEach(k => {
    if (!(k in saved)) return;
    const current = STATE[k];
    const value = saved[k];
    if (current && typeof current === 'object' && !Array.isArray(current) && value && typeof value === 'object') {
      Object.assign(current, value);
    } else {
      STATE[k] = value;
    }
  });
  STATE.xpNext = getXpForLevel(STATE.level);
  keysBaseline = null;
  STATE.eventQueue = [];
  STATE.shopSession = null;
  STATE.currentShopOffer = null;
  STATE.boughtInCurrentShop = false;
  if (typeof data.muted === 'boolean') audio.muted = data.muted;
  updateMuteButton();
  return true;
}

function scheduleSave() {
  saveDirty = true;
}

// Solo se guarda cuando no hay ningún puzle, diálogo ni modal abierto
// [0.089b] "Pantalla principal visible": nada encima (ventanas, banners, recibo, portada)
function mainScreenFree() {
  if (!isGameIdle()) return false;
  const b = document.getElementById('persistentFeedbackBanner');
  if (b && !b.classList.contains('hidden')) return false;
  if (document.getElementById('coverScreen')) return false;
  return true;
}
function isGameIdle() {
  if (isLootProcessing || minigameInProgress || STATE.eventQueue.length > 0) return false;
  const blockers = ['minigameModal', 'dialogueModal', 'lootModal', 'levelUpModal', 'merchantModal', 'traperoShopModal', 'traperoModal', 'unfairDealModal', 'gameOverModal'];
  for (const id of blockers) {
    const el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) return false;
  }
  const overlays = ['duendeReceiptModal', 'diffuseEchoOverlay', 'resumeGameModal', 'resetConfirmModal', 'cardPreModal'];
  for (const id of overlays) {
    if (document.getElementById(id)) return false;
  }
  return true;
}

function trySaveNow() {
  if (autosaveEnabled && saveDirty && isGameIdle()) {
    saveGame();
    saveDirty = false;
  }
}

setInterval(trySaveNow, 1200);
document.addEventListener('visibilitychange', () => { if (document.hidden) trySaveNow(); });
window.addEventListener('pagehide', trySaveNow);

function showResumePrompt(data) {
  const s = data.state;
  const modal = document.createElement('div');
  modal.id = 'resumeGameModal';
  modal.className = 'fixed inset-0 z-[10001] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-5 font-sans';
  modal.innerHTML = `
    <div class="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center gap-3">
      <div class="w-14 h-14 rounded-full bg-amber-950/80 border border-amber-500 flex items-center justify-center text-2xl text-amber-400"><i class="fa-solid fa-floppy-disk"></i></div>
      <h3 class="text-xl font-black text-amber-300 font-retro">PARTIDA GUARDADA</h3>
      <div class="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs font-mono text-slate-300 space-y-1.5">
        ${(s.currentLoop || 1) >= 2 ? `<div class="flex justify-between"><span>Bucle:</span><span class="text-amber-400 font-bold">${s.currentLoop}</span></div>` : ''}
        <div class="flex justify-between"><span>Nivel:</span><span class="text-indigo-400 font-bold">${s.level}</span></div>
        <div class="flex justify-between"><span>Cofres abiertos:</span><span class="text-amber-400 font-bold">${s.chestsOpened}</span></div>
        <div class="flex justify-between"><span>Oro:</span><span class="text-yellow-400 font-bold">${s.gold} GP</span></div>
      </div>
      <button id="resumeContinueBtn" class="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 active:from-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg cursor-pointer">CONTINUAR PARTIDA</button>
      <button id="resumeNewBtn" class="w-full py-2.5 bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">NUEVA PARTIDA</button>
    </div>
  `;
  uiHost().appendChild(modal);

  document.getElementById('resumeContinueBtn').addEventListener('click', () => {
    modal.remove();
    if (loadGame()) {
      // [0.082] Modo pruebas: las opciones DEV prevalecen sobre la partida cargada
      if (typeof applyDevStart === 'function') applyDevStart();
      generateScreenChests();
      updateUI();
      if (STATE.xp >= STATE.xpNext) processLevelUp();
    }
    autosaveEnabled = true;
  });

  document.getElementById('resumeNewBtn').addEventListener('click', () => {
    modal.remove();
    clearSave();
    resetGame();
    autosaveEnabled = true;
  });
}

/* ---------- Confirmación del botón Reiniciar ---------- */
function showResetConfirm() {
  if (document.getElementById('resetConfirmModal')) return;
  const modal = document.createElement('div');
  modal.id = 'resetConfirmModal';
  modal.className = 'fixed inset-0 z-[10001] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-5 font-sans';
  modal.innerHTML = `
    <div class="bg-slate-900 border-2 border-rose-700/70 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center gap-3">
      <div class="w-14 h-14 rounded-full bg-rose-950/80 border border-rose-500 flex items-center justify-center text-2xl text-rose-400"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <h3 class="text-xl font-black text-rose-300 font-retro">¿EMPEZAR DE CERO?</h3>
      <p class="text-xs text-slate-300">Perderás todo tu progreso y la partida guardada.</p>
      <button id="resetConfirmYesBtn" class="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-600 active:from-rose-500 text-white font-black text-sm rounded-xl shadow-lg cursor-pointer">SÍ, BORRAR PARTIDA</button>
      <button id="resetConfirmNoBtn" class="w-full py-2.5 bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">Cancelar</button>
    </div>
  `;
  uiHost().appendChild(modal);

  document.getElementById('resetConfirmYesBtn').addEventListener('click', () => {
    modal.remove();
    resetGame();
    showCover();   // [0.087b] vuelve la pantalla de título
  });
  document.getElementById('resetConfirmNoBtn').addEventListener('click', () => {
    modal.remove();
  });
}


/* ==========================================================================
   REINICIO DE PARTIDA Y DEV CHEAT
   ========================================================================== */

function resetGame(keepLoop) {
  // [CAMBIO] keepLoop === true conserva el bucle actual (lo usa la transición del Bucle 1 al 2)
  if (keepLoop !== true) STATE.currentLoop = 1;
  minigameInProgress = false;
  specialShopOpen = false;
  hideAllMinigameUI();
  clearSave();
  STATE.level = DATOS_JUEGO.CONFIG_INICIAL.NIVEL;
  STATE.xp = 0;
  STATE.xpNext = getXpForLevel(DATOS_JUEGO.CONFIG_INICIAL.NIVEL);
  STATE.gold = DATOS_JUEGO.CONFIG_INICIAL.ORO;
  STATE.chestsOpened = 0;
  STATE.chestsAtLevelUp = 0;
  STATE.chestCounterUnlocked = false;
  STATE.cleanStreak = 0;
  STATE.paranoiaStage = 0;
  STATE.traperoVisits = 0;
  STATE.lastTraperoChest = 0;
  STATE.eventQueue = [];
  STATE.salvageDealsCount = 0;
  STATE.salvageCurseActive = false;

  STATE.picks = DATOS_JUEGO.CONFIG_INICIAL.GANZUAS;
  STATE.proPicks = DATOS_JUEGO.CONFIG_INICIAL.PINES;
  STATE.usb = DATOS_JUEGO.CONFIG_INICIAL.USB;
  STATE.valves = DATOS_JUEGO.CONFIG_INICIAL.VALVULAS;

  STATE.noXpChestsLeft = 0;
  STATE.picksBrokenOnUse = false;
  STATE.pendingTanteoPhrase = null;
  STATE.xpBoostChestsLeft = 0;
  STATE.torpezas = { madera: 0, acero: 0, digital: 0, vapor: 0 };

  STATE.seqStage = 0;
  STATE.traperoStrikes = 0;
  STATE.boughtInCurrentShop = false;
  STATE.climaxPhase = false;
  STATE.sequenceBroken = false;
  STATE.shopSession = null;
  STATE.currentShopOffer = null;

  STATE.perks = {
    sweetSpot: 0, rarityBonus: 0, discount: 0, slowerPistons: 0, goldStreak: 0, extraTime: 0,
    oidoClinico: 0, shopStealFree: false, luckyLootChance: 0, bonusMadera: 0, bonusAcero: 0,
    bonusDigital: 0, bonusVapor: 0
  };

  STATE.abilities = { auto: 0, double: 0, shield: 0, reveal: 0, riskPot: 0, perdedor: 0, summonDuende: 0 };
  STATE.active2XMultiplier = false;
  STATE.activeShield = false;
  STATE.riskModeActive = false;
  STATE.riskPot = 0;
  STATE.perdedorActive = false;
  STATE.perdedorLootPending = false;
  STATE.fallosConsecutivos = 0;

  STATE.heavyChestsLeft = 0;
  STATE.greedCurseLeft = 0;
  STATE.harderPuzzlesLeft = 0;
  STATE.mods = {};
  STATE.pendingNotes = [];
  if (keepLoop !== true) STATE.blankNotes = {};   // [0.095] partida nueva = post-its nuevos; el cambio de bucle los conserva
  STATE.traperoBuffs = { bonusXp: false, harderMinigames: false, shortPipeTimer: false, doubleGold: false };
  STATE.cursedChestsLeft = 0;
  curseHold = false; STATE.curseEndPending = false;   // [0.096]
  STATE.roomDecorations = [];
  STATE.roomThemeFilter = 'normal';
  STATE.roomDarkUntil = 0;
  roomDarkPrev = false;
  keysBaseline = null;
  puzzleToolPaid = null;
  gameOverSeq = false;
  STATE.opensByType = {};
  STATE.acceptDelayUses = {};
  STATE.hintUses = {};
  STATE.stats = blankStats(); statsGoldPrev = null; statsPaused = false;

  const notesContainer = document.getElementById('notesContainer');
  if (notesContainer) notesContainer.innerHTML = '';

  const modals = [
    'gameOverModal', 'unfairDealModal', 'minigameModal', 
    'merchantModal', 'traperoModal', 'traperoShopModal', 
    'lootModal', 'dialogueModal', 'levelUpModal', 'persistentFeedbackBanner',
    'duendeReceiptModal'
  ];
  modals.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'duendeReceiptModal') el.remove();
      else el.classList.add('hidden');
    }
  });

  // [0.082] Modo pruebas: las opciones DEV sobreviven a los reinicios
  if (typeof applyDevStart === 'function') applyDevStart();

  generateScreenChests();
  updateUI();
}
window.resetGame = resetGame;

window.goToChest = function(targetChestNumber) {
  STATE.chestsOpened = targetChestNumber - 1;
  STATE.picks = Math.max(10, STATE.picks);
  STATE.proPicks = Math.max(5, STATE.proPicks);
  STATE.usb = Math.max(5, STATE.usb);
  STATE.valves = Math.max(5, STATE.valves);

  if (targetChestNumber >= 79 && targetChestNumber <= 90) {
    STATE.seqStage = 1;
    STATE.sequenceBroken = false;
  }
  if (targetChestNumber >= 91) {
    STATE.climaxPhase = true;
  }

  generateScreenChests();
  updateUI();
  showPersistentFeedback(`🚀 Teletransporte al Cofre ${targetChestNumber}. Listo para abrir.`);
};

function closeTraperoShop() {
  const traperoModals = ['traperoModal', 'traperoShopModal', 'dialogueModal'];
  traperoModals.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  processNextQueuedEvent();
}
window.closeTraperoShop = closeTraperoShop;
