/* ==========================================================================
   [0.44] MODO INFINITO
   Se desbloquea al acabar el juego (final bueno o final malo). Es una partida normal sin secuencia final ni cofres finales:
   las reglas del Duende, la tienda, el Trapero y la subida de nivel son las mismas. Empieza solo con cofres de madera y, con los cofres abiertos,
   sube la rareza, aparecen las variantes del bucle 2 y del bucle 3 mezcladas con las viejas y los puzles se vuelven cada vez más duros y con menos tiempo.
   Las wildcards salen siempre 50-50 (positivas / negativas). Nada se reinicia: las ventajas se quedan para siempre.
   TODOS los valores (invento mío, para ajustar) están aquí abajo.
   ========================================================================== */
const INF = {
  BUCLE2_DESDE: 40,        // cofre desde el que se usan las variantes del bucle 2 (equivale a «bucle efectivo 2»)
  BUCLE3_DESDE: 110,       // cofre desde el que se usan las del bucle 3
  PILAS_AL_ENTRAR_B2: 3,   // pilas que se regalan al llegar al bucle efectivo 2 (el Duende ya las vende desde entonces)
  FUSIBLES_AL_ENTRAR_B3: 3,
  RAREZA_RAMPA: { DESDE: 20, HASTA: 260 },   // de este cofre a este cofre las probabilidades de rareza pasan de las del nivel a las de RAREZA_META
  RAREZA_META: { normal: 0.08, raro: 0.22, epico: 0.35, legendario: 0.35 },
  TIEMPO: { DESDE: 60, BAJADA_POR_COFRE: 0.0035, MINIMO: 0.55 },   // multiplicador del tiempo de los puzles con reloj
  DUROS_DESDE: 160,        // cofre desde el que todos los puzles salen «endurecidos»
  EXTREMOS_DESDE: 300,     // cofre desde el que salen «extremos»
  AVISO_BUCLE: ['La sala se pone seria.', 'Algo en los cofres ha cambiado.']
};

function infUnlocked() {
  try {
    if (typeof achProg !== 'undefined' && achProg.flags && (achProg.flags.good || achProg.flags.bad)) return true;
    if (typeof nbHas === 'function' && (nbHas('fin.bueno') || nbHas('fin.malo'))) return true;
  } catch (e) {}
  return false;
}
function infOn() { return !!(typeof STATE !== 'undefined' && STATE.infinite); }

// Bucle efectivo según los cofres abiertos (se llama tras cada cofre)
function infAdvance(co) {
  if (!infOn()) return;
  const want = co >= INF.BUCLE3_DESDE ? 3 : co >= INF.BUCLE2_DESDE ? 2 : 1;
  const cur = STATE.currentLoop || 1;
  if (want <= cur) return;
  STATE.currentLoop = want;
  if (want >= 2 && !STATE.batteriesUnlocked) { STATE.batteriesUnlocked = true; STATE.batteries = Math.max(STATE.batteries || 0, INF.PILAS_AL_ENTRAR_B2); }
  if (want >= 3 && !STATE.fusesUnlocked) { STATE.fusesUnlocked = true; STATE.fuses = Math.max(STATE.fuses || 0, INF.FUSIBLES_AL_ENTRAR_B3); }
  try { STATE.eventQueue.push(() => { showPersistentFeedback('ℹ️ ' + INF.AVISO_BUCLE[want - 2]); }); } catch (e) {}
}

// Probabilidades de rareza que se van desplazando hacia las más altas
function infRarityMap(base) {
  if (!infOn()) return base;
  const R = INF.RAREZA_RAMPA, t = Math.max(0, Math.min(1, (STATE.chestsOpened - R.DESDE) / (R.HASTA - R.DESDE)));
  const M = INF.RAREZA_META, out = {};
  ['normal', 'raro', 'epico', 'legendario'].forEach(k => { out[k] = (base[k] || 0) * (1 - t) + M[k] * t; });
  return out;
}
function infTimeMult() {
  if (!infOn()) return 1;
  const T = INF.TIEMPO;
  return Math.max(T.MINIMO, 1 - T.BAJADA_POR_COFRE * Math.max(0, STATE.chestsOpened - T.DESDE));
}
function infHardLevel() {
  if (!infOn()) return 0;
  return STATE.chestsOpened >= INF.EXTREMOS_DESDE ? 2 : STATE.chestsOpened >= INF.DUROS_DESDE ? 1 : 0;
}

function startInfiniteMode() {
  resetGame();
  STATE.infinite = true;
  STATE.sequenceBroken = true;   // sin secuencia final: solo visitas normales del Duende y del Trapero
  STATE.currentLoop = 1;
  try { const c = document.getElementById('coverScreen'); if (c) c.remove(); } catch (e) {}
  generateScreenChests(); updateUI();
  try { showPersistentFeedback('ℹ️ MODO INFINITO: no hay final. Los cofres no paran, y cada vez piden más.'); } catch (e) {}
}
