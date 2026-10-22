/* ==========================================================================
   [0.42] LOGROS: motor, contadores permanentes, iconos dibujados y banner
   - Los logros desbloqueados viven en estado.js (achievementsUnlocked, clave propia).
   - Los contadores ACUMULADOS (cofres por tipo, ganzúas recicladas, eventos) viven aquí, en una clave aparte:
     sobreviven a "Empezar de nuevo" y solo se borran con "Borrar todos los datos".
   - Los contadores de partida / de bucle viven en STATE.achG ({ g: partida, l: bucle }).
   ========================================================================== */
const ACH_PROG_KEY = 'justOneMoreChest_logros_prog_v1';
let achProg = { types: {}, recycled: 0, flags: {} };
(function achProgLoad() {
  try { const o = JSON.parse(window.localStorage.getItem(ACH_PROG_KEY) || 'null'); if (o && typeof o === 'object') achProg = { types: o.types || {}, recycled: +o.recycled || 0, flags: o.flags || {} }; } catch (e) {}
})();
function achProgSave() { try { window.localStorage.setItem(ACH_PROG_KEY, JSON.stringify(achProg)); } catch (e) {} }

// Contadores de la partida (g) y del bucle (l). Se guardan con la partida (STATE.achG).
function achG() {
  if (!STATE.achG || typeof STATE.achG !== 'object') STATE.achG = {};
  if (!STATE.achG.g) STATE.achG.g = {};
  if (!STATE.achG.l) STATE.achG.l = {};
  return STATE.achG;
}
// Se llama desde resetGame: el bucle siempre empieza de cero; la partida solo si no se conserva el bucle
function achResetCounters(keepLoop) { const a = achG(); a.l = {}; if (keepLoop !== true) a.g = {}; }

// Eventos del juego → contadores y desbloqueos
function achEvent(ev, data) {
  if (typeof statsPaused !== 'undefined' && statsPaused) return;   // el Modo Test no cuenta
  const a = achG();
  switch (ev) {
    case 'chest': { const id = data && data.type && data.type.id; if (id) { achProg.types[id] = (achProg.types[id] || 0) + 1; achProgSave(); } break; }
    case 'recycle': achProg.recycled += (data || 0); achProgSave(); break;
    case 'deal': a.l.deals = (a.l.deals || 0) + 1; break;
    case 'curse': a.l.curse = (a.l.curse || 0) + 1; break;
    case 'puzzle': a.l.tot = (a.l.tot || 0) + 1; if (data) a.l.ok = (a.l.ok || 0) + 1; break;
    case 'spent': a.g.spent = (a.g.spent || 0) + (data || 0); break;
    case 'steal': case 'flawless': case 'good': case 'bad': case 'gift': if (ev !== 'gift') achProg.flags[ev] = Date.now(); achProgSave(); break;
    case 'loopEnd': {   // data = nº de bucle que se acaba de pasar
      achProg.flags['loop' + data] = achProg.flags['loop' + data] || Date.now();
      if ((a.l.curse || 0) > 20) achProg.flags.curse20 = achProg.flags.curse20 || Date.now();
      if ((STATE.level || 1) >= 10) achProg.flags.lvl10 = achProg.flags.lvl10 || Date.now();
      if (!(a.l.deals || 0)) achProg.flags.nodeal = achProg.flags.nodeal || Date.now();
      if ((a.l.tot || 0) > 0 && (a.l.ok || 0) / a.l.tot >= 0.9) achProg.flags.p90 = achProg.flags.p90 || Date.now();
      achProgSave(); break;
    }
  }
  try { checkAchievements(); } catch (e) {}
}

function achMetric(l) {
  const c = l.condicion || {}, a = achG();
  switch (c.tipo) {
    case 'COFRES_ABIERTOS': return STATE.chestsOpened >= c.valor;
    case 'TIPO_COFRES': return (achProg.types[c.cofre] || 0) >= c.valor;
    case 'ORO_ACUM': return (typeof lifeStats !== 'undefined' && lifeStats.goldSpent >= c.valor);
    case 'ORO_PARTIDA': return (a.g.spent || 0) >= c.valor;
    case 'RACHA': return (STATE.cleanStreak || 0) > c.valor;
    case 'RECICLADAS': return achProg.recycled >= c.valor;
    case 'EVENTO': return !!achProg.flags[c.ev];
    case 'TODOS': return DATOS_JUEGO.LOGROS.LISTA.every(x => x === l || x.condicion.tipo === 'TODOS' || achievementsUnlocked[x.id]);
  }
  return false;
}
function isAchievementMet(l) { return achMetric(l); }

function checkAchievements() {
  const cfg = DATOS_JUEGO.LOGROS;
  if (!cfg || !cfg.LISTA) return;
  if (typeof statsPaused !== 'undefined' && statsPaused) return;
  let changed = false;
  // dos pasadas: así "todos los logros" salta a la vez que el último
  for (let pass = 0; pass < 2; pass++) {
    cfg.LISTA.forEach(l => {
      if (achievementsUnlocked[l.id]) return;
      if (achMetric(l)) { achievementsUnlocked[l.id] = Date.now(); changed = true; achievementBannerQueue.push(l); }
    });
  }
  if (changed) saveAchievements();
  showNextAchievementBanner();
}

/* ---------- Estado de cada logro para las listas ---------- */
// ¿Se enseña su descripción? Los secretos solo cuando están conseguidos; los de tipos de cofre, también en cuanto se ha abierto alguno de ese tipo
function achShowDesc(l) {
  if (achievementsUnlocked[l.id]) return true;
  if (!l.secreto) return true;
  const c = l.condicion || {};
  if (c.tipo === 'TIPO_COFRES' && (achProg.types[c.cofre] || 0) > 0) return true;
  return false;
}
function achDescText(l) { return achShowDesc(l) ? (l.descripcion || '') : (DATOS_JUEGO.LOGROS.TEXTO_SECRETO || 'Logro secreto'); }
function achCounts() { const all = DATOS_JUEGO.LOGROS.LISTA; return { got: all.filter(l => achievementsUnlocked[l.id]).length, total: all.length }; }
// Conseguidos primero (por orden de consecución) y luego los que faltan, en el orden de la lista
function achSorted() {
  const all = DATOS_JUEGO.LOGROS.LISTA;
  const got = all.filter(l => achievementsUnlocked[l.id]).sort((a, b) => achievementsUnlocked[a.id] - achievementsUnlocked[b.id]);
  return got.concat(all.filter(l => !achievementsUnlocked[l.id]));
}

/* ---------- Iconos dibujados (SVG, 40x40) ---------- */
function achIcon(key, size) {
  const sz = size || 44, p = String(key || 'trofeo').split(':'), k = p[0];
  const O = '#1b1206';   // contorno
  let g = '';
  const num = (t, x, y, fs, col) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="'VT323','Courier New',monospace" font-weight="900" font-size="${fs}" fill="${col}" stroke="${O}" stroke-width="2" paint-order="stroke">${t}</text>`;
  switch (k) {
    case 'cofre': {
      const col = p[1] || '#a16207', tier = p[2] || '1';
      g = `<rect x="5" y="17" width="30" height="17" rx="2" fill="${col}" stroke="${O}" stroke-width="2"/>
        <path d="M5 19 V13 Q5 7 20 7 Q35 7 35 13 V19 Z" fill="${col}" stroke="${O}" stroke-width="2"/>
        <path d="M5 19 V13 Q5 7 20 7" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
        <rect x="5" y="18" width="30" height="3" fill="#000" fill-opacity=".35"/>
        <rect x="16" y="17" width="8" height="8" rx="1.5" fill="#fbbf24" stroke="${O}" stroke-width="1.5"/><rect x="19" y="20" width="2" height="3" fill="${O}"/>`;
      if (tier === '50') g += `<circle cx="32" cy="32" r="7" fill="#cbd5e1" stroke="${O}" stroke-width="2"/>` + num('50', 32, 35, 6, '#0f172a');
      else if (tier === '100') g += `<circle cx="32" cy="32" r="8" fill="#fbbf24" stroke="${O}" stroke-width="2"/>` + num('100', 32, 35, 5, '#451a03');
      break;
    }
    case 'monedas':
      g = `<ellipse cx="15" cy="30" rx="10" ry="4.5" fill="#d97706" stroke="${O}" stroke-width="2"/><rect x="5" y="24" width="20" height="6" fill="#fbbf24" stroke="${O}" stroke-width="2"/><ellipse cx="15" cy="24" rx="10" ry="4.5" fill="#fcd34d" stroke="${O}" stroke-width="2"/>
        <ellipse cx="27" cy="21" rx="9" ry="4" fill="#d97706" stroke="${O}" stroke-width="2"/><rect x="18" y="15" width="18" height="6" fill="#fbbf24" stroke="${O}" stroke-width="2"/><ellipse cx="27" cy="15" rx="9" ry="4" fill="#fcd34d" stroke="${O}" stroke-width="2"/>${num('$', 27, 18, 7, '#78350f')}`;
      break;
    case 'bolsa':
      g = `<path d="M13 12 L16 6 H24 L27 12" fill="#92400e" stroke="${O}" stroke-width="2"/><path d="M13 12 Q4 20 6 30 Q8 36 20 36 Q32 36 34 30 Q36 20 27 12 Z" fill="#b45309" stroke="${O}" stroke-width="2"/><path d="M12 12 H28" stroke="#fbbf24" stroke-width="3"/>${num('$', 20, 30, 12, '#fde68a')}<circle cx="32" cy="8" r="3" fill="#fbbf24" stroke="${O}" stroke-width="1.5"/><circle cx="8" cy="10" r="2.5" fill="#fbbf24" stroke="${O}" stroke-width="1.5"/>`;
      break;
    case 'calavera':
      g = `<path d="M8 20 Q8 5 20 5 Q32 5 32 20 Q32 25 28 27 V33 H12 V27 Q8 25 8 20 Z" fill="#e5e7eb" stroke="${O}" stroke-width="2"/><ellipse cx="14.5" cy="20" rx="4" ry="4.5" fill="${O}"/><ellipse cx="25.5" cy="20" rx="4" ry="4.5" fill="${O}"/><path d="M20 24 L18 28 H22 Z" fill="${O}"/><path d="M16 33 V29 M20 33 V29 M24 33 V29" stroke="${O}" stroke-width="2"/><circle cx="14.5" cy="20" r="1.4" fill="#a78bfa"/><circle cx="25.5" cy="20" r="1.4" fill="#a78bfa"/>`;
      break;
    case 'nivel10':
      g = `<path d="M20 3 L25 14 L37 15.5 L28 24 L30.5 36 L20 30 L9.5 36 L12 24 L3 15.5 L15 14 Z" fill="#fbbf24" stroke="${O}" stroke-width="2" stroke-linejoin="round"/>${num('10', 20, 25, 9, '#fff7cc')}`;
      break;
    case 'llama': {
      const n = p[1] || '10';
      g = `<path d="M20 3 Q25 11 29 15 Q36 21 33 28 Q30 37 20 37 Q10 37 7 28 Q5 21 12 15 Q13 20 16 20 Q14 11 20 3 Z" fill="#f97316" stroke="${O}" stroke-width="2" stroke-linejoin="round"/><path d="M20 17 Q25 23 25 28 Q25 34 20 34 Q15 34 15 28 Q15 24 20 17 Z" fill="#fde047"/>` + num(n, 20, 33, 10, '#fff');
      break;
    }
    case 'mano':
      g = `<path d="M8 22 Q8 16 13 16 L14 9 Q14 6 17 6 Q19 6 19 9 V15 L20 8 Q20 5 23 5 Q25.5 5 25.5 8 V15 L27 10 Q28 7.500 30.500 8.500 Q32.500 9.500 32 12 L30 20 Q34 21 33 27 Q31 35 22 35 Q9 35 8 26 Z" fill="#fcd9a8" stroke="${O}" stroke-width="2" stroke-linejoin="round"/><circle cx="31" cy="31" r="6.500" fill="#fbbf24" stroke="${O}" stroke-width="2"/>${num('$', 31, 34, 8, '#78350f')}`;
      break;
    case 'sintrato':
      g = `<path d="M3 21 L11 13 L19 15 L26 13 L37 21 L29 29 L25 27 L19 31 L12 29 Z" fill="#fcd9a8" stroke="${O}" stroke-width="2" stroke-linejoin="round"/><path d="M12 15 L9 28 M28 14 L31 27" stroke="${O}" stroke-width="2"/><circle cx="20" cy="20" r="15" fill="none" stroke="#dc2626" stroke-width="4"/><path d="M9.500 9.500 L30.500 30.500" stroke="#dc2626" stroke-width="4"/>`;
      break;
    case 'bucle': {
      const n = p[1] || '1';
      g = `<path d="M31 12 A13 13 0 1 0 33 22" fill="none" stroke="#38bdf8" stroke-width="4.500" stroke-linecap="round"/><path d="M26 5 L34 12 L25 16 Z" fill="#38bdf8" stroke="${O}" stroke-width="1.500" stroke-linejoin="round"/><path d="M31 12 A13 13 0 1 0 33 22" fill="none" stroke="${O}" stroke-width="1" stroke-opacity=".5"/>` + num(n, 20, 26, 14, '#fff');
      break;
    }
    case 'sol':
      g = `<g stroke="#fbbf24" stroke-width="3" stroke-linecap="round"><path d="M20 3 V8 M20 32 V37 M3 20 H8 M32 20 H37 M8 8 L11.500 11.500 M28.500 28.500 L32 32 M32 8 L28.500 11.500 M11.500 28.500 L8 32"/></g><circle cx="20" cy="20" r="9" fill="#fde047" stroke="${O}" stroke-width="2"/><circle cx="17" cy="17" r="3" fill="#fff" fill-opacity=".6"/>`;
      break;
    case 'grieta':
      g = `<circle cx="20" cy="20" r="15" fill="#312e81" stroke="${O}" stroke-width="2"/><path d="M24 5 L19 15 L26 19 L17 27 L22 36" fill="none" stroke="#e0e7ff" stroke-width="2.500" stroke-linejoin="round"/><path d="M19 15 L12 14 M26 19 L33 21 M17 27 L10 30" stroke="#e0e7ff" stroke-width="1.500"/><circle cx="12" cy="22" r="1.800" fill="#f43f5e"/><circle cx="28" cy="26" r="1.800" fill="#f43f5e"/>`;
      break;
    case 'corazones':
      g = '';
      [[6, 8], [14, 21], [22, 8]].forEach(([x, y]) => { g += `<path d="M${x + 6} ${y + 14} C${x - 3} ${y + 6} ${x + 1} ${y - 1} ${x + 6} ${y + 2} C${x + 11} ${y - 1} ${x + 15} ${y + 6} ${x + 6} ${y + 14} Z" fill="#ef4444" stroke="${O}" stroke-width="2" stroke-linejoin="round"/>`; });
      break;
    case 'diana':
      g = `<circle cx="20" cy="20" r="16" fill="#f8fafc" stroke="${O}" stroke-width="2"/><circle cx="20" cy="20" r="11" fill="#ef4444" stroke="${O}" stroke-width="1.500"/><circle cx="20" cy="20" r="6" fill="#f8fafc" stroke="${O}" stroke-width="1.500"/><circle cx="20" cy="20" r="2.500" fill="#ef4444"/><path d="M20 20 L35 5" stroke="${O}" stroke-width="3"/><path d="M31 4 L36 4 L36 9 Z" fill="#fbbf24" stroke="${O}" stroke-width="1.500"/>`;
      break;
    case 'reciclar':
      g = `<path d="M9 14 A12 12 0 0 1 28 9" fill="none" stroke="#4ade80" stroke-width="4.500" stroke-linecap="round"/><path d="M32 4 L33 15 L22 13 Z" fill="#4ade80" stroke="${O}" stroke-width="1.500" stroke-linejoin="round"/><path d="M31 26 A12 12 0 0 1 12 31" fill="none" stroke="#4ade80" stroke-width="4.500" stroke-linecap="round"/><path d="M8 36 L7 25 L18 27 Z" fill="#4ade80" stroke="${O}" stroke-width="1.500" stroke-linejoin="round"/><circle cx="17" cy="20" r="4" fill="#fbbf24" stroke="${O}" stroke-width="1.500"/><path d="M20 20 H30 M26 20 V24 M30 20 V23" stroke="${O}" stroke-width="2.500" fill="none"/>`;
      break;
    default:   // trofeo
      g = `<path d="M11 5 H29 V16 Q29 25 20 26 Q11 25 11 16 Z" fill="#fbbf24" stroke="${O}" stroke-width="2"/><path d="M11 8 H5 Q4 18 12 20 M29 8 H35 Q36 18 28 20" fill="none" stroke="#fbbf24" stroke-width="3"/><path d="M11 8 H5 Q4 18 12 20 M29 8 H35 Q36 18 28 20" fill="none" stroke="${O}" stroke-width="1" opacity=".5"/><rect x="17" y="26" width="6" height="6" fill="#d97706" stroke="${O}" stroke-width="1.500"/><rect x="11" y="32" width="18" height="5" rx="1.500" fill="#92400e" stroke="${O}" stroke-width="2"/><path d="M15 9 V16" stroke="#fff" stroke-opacity=".5" stroke-width="2.500" stroke-linecap="round"/>`;
  }
  return `<svg class="ach-ico" width="${sz}" height="${sz}" viewBox="0 0 40 40" aria-hidden="true">${g}</svg>`;
}

/* ---------- Banner de logro desbloqueado (gráfico) ---------- */
function showNextAchievementBanner() {
  if (achievementBannerBusy || !achievementBannerQueue.length) return;
  achievementBannerBusy = true;
  const l = achievementBannerQueue.shift();
  let el = document.getElementById('achievementBanner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'achievementBanner';
    uiHost().appendChild(el);
  }
  el.className = 'ach-banner';
  el.innerHTML = `<div class="ab-card"><span class="ab-glint"></span><div class="ab-medal">${achIcon(l.ic, 46)}</div>
    <div class="ab-tx"><div class="ab-kick">LOGRO DESBLOQUEADO</div><div class="ab-ttl">${l.titulo}</div><div class="ab-dsc">${l.descripcion || ''}</div></div></div>`;
  void el.offsetWidth;
  el.classList.add('show');
  try { audio.playUnlockFanfare('epico'); } catch (e) {}
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => { achievementBannerBusy = false; showNextAchievementBanner(); }, 420);
  }, DATOS_JUEGO.LOGROS.DURACION_BANNER_MS || 4000);
}

/* ---------- Borrar todos los datos: ya se limpia por prefijo (justOneMoreChest_); aquí solo se vacía lo cargado ---------- */
function achWipeProgress() { achProg = { types: {}, recycled: 0, flags: {} }; try { window.localStorage.removeItem(ACH_PROG_KEY); } catch (e) {} }
