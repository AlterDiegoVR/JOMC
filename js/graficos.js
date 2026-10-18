// ==========================================================================
// JUST ONE MORE CHEST — graficos.js — VERSIÓN 0.105
// canvas, sala, cerradura, decoración, efectos de cofre
// ==========================================================================

// [0.085] Carga de imágenes y utilidades gráficas
const ART_ON = !!(DATOS_JUEGO.GRAFICOS && DATOS_JUEGO.GRAFICOS.ACTIVAR_ARTE);
const ART = {};
function loadArt(key, src) {
  const im = new Image();
  // [0.090] Cofre de Vapor: el humo del sprite se borra al cargar (en memoria, el original sigue en ASSETS para miniaturas) y se anima aparte en renderRoom
  if (/^cofre_hydraulic/.test(key) && ((DATOS_JUEGO.GRAFICOS || {}).VAPOR_ANIMADO || {}).ACTIVAR) {
    im.onload = function () {
      if (im._steamless) return;
      try {
        const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
        const cx2 = c.getContext('2d'); cx2.drawImage(im, 0, 0);
        const v = DATOS_JUEGO.GRAFICOS.VAPOR_ANIMADO.BORRAR;   // zona del humo en píxeles del sprite
        cx2.clearRect(v.x0, v.y0, v.x1 - v.x0 + 1, v.y1 - v.y0 + 1);
        im._steamless = true; im.src = c.toDataURL();
      } catch (e) {}
    };
  }
  im.src = src; ART[key] = im;
}
if (ART_ON) {
  loadArt('celda', ASSETS.celda);
  Object.keys(ASSETS.cofres).forEach(k => loadArt('cofre_' + k, ASSETS.cofres[k]));
  // [0.086] Cofres por rareza, adornos pixel art y fotogramas de la celda a oscuras
  Object.keys(ASSETS.cofresRareza || {}).forEach(k => Object.keys(ASSETS.cofresRareza[k]).forEach(r => loadArt('cofre_' + k + '_' + r, ASSETS.cofresRareza[k][r])));
  Object.keys(ASSETS.decoraciones || {}).forEach(k => loadArt('deco_' + k, ASSETS.decoraciones[k]));
  ['celdaParpadeo1', 'celdaParpadeo2', 'celdaApagada'].forEach(k => { if (ASSETS[k]) loadArt(k, ASSETS[k]); });
}
// [0.086] Sprite de cofre según tipo y rareza (la normal usa el sprite base)
function chestSpriteSrc(type, rarity) {
  if (!ART_ON || !type) return null;
  const r = rarity && rarity.id;
  const byRar = ASSETS.cofresRareza && ASSETS.cofresRareza[type.id];
  if (r && r !== 'normal' && byRar && byRar[r]) return byRar[r];
  return ASSETS.cofres[type.id] || null;
}
function chestSpriteKey(type, rarity) {
  const r = rarity && rarity.id;
  if (r && r !== 'normal' && artReady('cofre_' + type.id + '_' + r)) return 'cofre_' + type.id + '_' + r;
  return 'cofre_' + type.id;
}
// [0.086] Texto un poco mayor (CSS: html.texto-grande). Reversible con GRAFICOS.TEXTO_GRANDE = false
document.documentElement.classList.toggle('texto-grande', !!(DATOS_JUEGO.GRAFICOS && DATOS_JUEGO.GRAFICOS.TEXTO_GRANDE));
// [0.104] Terminal CRT: líneas de barrido suaves y halo verde más fuerte (valores en DATOS_JUEGO.GRAFICOS.TERMINAL_CRT)
(function () { const c = (DATOS_JUEGO.GRAFICOS && DATOS_JUEGO.GRAFICOS.TERMINAL_CRT) || {}; const st = document.documentElement.style;
  if (c.SCANLINES != null) st.setProperty('--crt-scan', String(c.SCANLINES)); if (c.BRILLO != null) st.setProperty('--cg', String(c.BRILLO)); })();
// [0.086] ¿Pantalla ancha? (se ven las marquesinas laterales). Solo ahí se puede abrir tocando la cerradura
function isWideLayout() {
  const fr = document.getElementById('gameFrame');
  const cfg = DATOS_JUEGO.GRAFICOS.TOCAR_CERRADURA || {};
  if (!fr) return false;
  return (window.innerWidth - fr.clientWidth) >= (cfg.ANCHO_MIN_LATERAL_PX || 160);
}
let CHEST_LOCK_ZONE = null;     // [0.087] zona de la cerradura aunque haya un modal abierto
let CHEST_LOCK = null;          // zona táctil de la cerradura del cofre activo (se recalcula cada fotograma)
let lockArmedChest = null;      // con varios cofres: el primer toque arma, el segundo abre
let lockArmedAt = 0;
let lockShakeUntil = 0;
let darkFlickerT0 = 0;
let lightOnT0 = 0;            // [0.087b] inicio de la animación de encendido de la luz
let roomDarkPrev = null;      // para detectar el paso oscuro → encendido
let cofradiaOpen = false;     // [0.104] la Cofradía está abierta: sala vacía (sin cofre) y sin interfaz
let npcHideUntil = 0;         // [0.087b] el cofre no se dibuja mientras entra el Duende / Trapero
let chestFade = 1;            // opacidad actual del cofre (fundido)
let keysBaseline = null;      // [0.087b] avisos "+N" de llaves
const keyToastQueue = [];
let keyToastBusy = false;
function artReady(key) { const im = ART[key]; return !!(ART_ON && im && im.complete && im.naturalWidth > 0); }
// Contenedor para modales creados por script (dentro del marco, no sobre las marquesinas)

const canvas = document.getElementById('roomCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  const frame = document.getElementById('gameFrame');
  canvas.width = frame ? frame.clientWidth : window.innerWidth;
  canvas.height = frame ? frame.clientHeight : window.innerHeight;
  // Zoom de la interfaz en pantallas grandes (el marco crece, la UI proporcionalmente)
  const maxZ = (DATOS_JUEGO.GRAFICOS && DATOS_JUEGO.GRAFICOS.ESCALA_UI_MAX) || 1;
  const z = Math.max(1, Math.min(maxZ, canvas.width / 430));
  document.documentElement.style.setProperty('--uiz', z.toFixed(3));
  // [0.089b] Escala de las ventanas informativas (botín, tiendas, tratos, recibo, diálogos...) solo en pantalla ancha. No afecta a los puzles.
  const wm = DATOS_JUEGO.GRAFICOS.ESCALA_VENTANAS || {};
  const mz = (wm.ACTIVAR !== false && isWideLayout()) ? Math.max(1, Math.min(wm.MAX || 1.7, canvas.width / (wm.ANCHO_BASE || 390))) : 1;
  document.documentElement.style.setProperty('--mz', mz.toFixed(3));
  document.documentElement.classList.toggle('narrow-layout', !isWideLayout());   // [0.088] ajustes solo para móvil / ventanas estrechas
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
if (window.ResizeObserver && document.getElementById('gameFrame')) new ResizeObserver(resizeCanvas).observe(document.getElementById('gameFrame'));

function spawnParticles(x, y, color, count = 35, isRainbow = false) {
  for (let i = 0; i < count; i++) {
    const particleColor = isRainbow ? `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)` : color;
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10 - 2,
      radius: Math.random() * 5 + 2,
      color: particleColor,
      alpha: 1,
      decay: Math.random() * 0.025 + 0.015
    });
  }
}

// [0.086] Posición vertical efectiva de un adorno (los guardados con la fila antigua y=210 pasan a la nueva fila superior)
// [0.087] Opacidad de un adorno que está siendo reemplazado (fundido de 0,7 s)
// [0.088] Telón oscuro: entre cerrar el botín y abrirse la tienda/diálogo no se ve la habitación
let sceneVeilEl = null, sceneVeilTimer = null;
function showSceneVeil() {
  if (!sceneVeilEl) {
    sceneVeilEl = document.createElement('div');
    sceneVeilEl.id = 'sceneVeil';
    sceneVeilEl.style.cssText = 'position:absolute;inset:0;z-index:49;background:#020617;pointer-events:none;opacity:1;transition:opacity .22s ease';
    uiHost().appendChild(sceneVeilEl);
  }
  sceneVeilEl.style.transition = 'none';
  sceneVeilEl.style.opacity = '1';
  clearInterval(sceneVeilTimer);
  const t0 = Date.now();
  sceneVeilTimer = setInterval(() => {
    const open = ['dialogueModal', 'merchantModal', 'traperoShopModal', 'traperoModal', 'levelUpModal', 'unfairDealModal', 'gameOverModal'].some(modalVisible);
    if (open || Date.now() - t0 > 1300) hideSceneVeil();
  }, 50);
}
function hideSceneVeil() {
  clearInterval(sceneVeilTimer); sceneVeilTimer = null;
  if (!sceneVeilEl) return;
  const el = sceneVeilEl;
  el.style.transition = 'opacity .22s ease';
  setTimeout(() => { el.style.opacity = '0'; }, 120);
}
// [0.104] Quita el telón del todo (sin fundido): antes del cristal roto, para que los trozos copien la sala y no el azul marino
function killSceneVeil() {
  clearInterval(sceneVeilTimer); sceneVeilTimer = null;
  if (sceneVeilEl) { try { sceneVeilEl.remove(); } catch (e) {} sceneVeilEl = null; }
  document.querySelectorAll('#sceneVeil').forEach(e => e.remove());
}
// [0.104] Efectos de la apertura automática (cofres 101-110): ráfagas de partículas (también hacia el centro), vibración creciente, pulso de la sala y destello suave.
// Todo se regula en DATOS_JUEGO.SECUENCIA_FINAL_FX; la intensidad sube con cada cofre.
function autoOpenFx(co) {
  const cfg = DATOS_JUEGO.SECUENCIA_FINAL_FX || {};
  if (cfg.ACTIVAR === false || !canvas) return;
  const c = DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA;
  const k = Math.max(0, Math.min(1, (co - c.COFRE_AUTO_OPEN_INICIO) / Math.max(1, c.COFRE_AUTO_OPEN_FIN - c.COFRE_AUTO_OPEN_INICIO)));
  const W = canvas.width, H = canvas.height;
  const bursts = Math.round((cfg.ESTALLIDOS_BASE || 2) + (cfg.ESTALLIDOS_EXTRA || 4) * k);
  for (let i = 0; i < bursts; i++) {
    setTimeout(() => { try { spawnParticles(Math.random() * W, Math.random() * H, ['#c084fc', '#f43f5e', '#fbbf24', '#38bdf8'][i % 4], cfg.PARTICULAS_POR_ESTALLIDO || 40, i % 2 === 0); } catch (e) {} }, i * 70);
  }
  // partículas que entran desde los bordes hacia el centro
  const nIn = Math.round((cfg.HACIA_CENTRO_BASE || 30) + (cfg.HACIA_CENTRO_EXTRA || 60) * k);
  for (let i = 0; i < nIn; i++) {
    const a = Math.random() * Math.PI * 2, R = Math.hypot(W, H) * 0.55;
    const x = W / 2 + Math.cos(a) * R, y = H / 2 + Math.sin(a) * R, sp = 7 + Math.random() * 7;
    particles.push({ x, y, vx: -Math.cos(a) * sp, vy: -Math.sin(a) * sp, radius: 2 + Math.random() * 4, color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 65%)`, alpha: 1, decay: 0.012 + Math.random() * 0.012 });
  }
  try { screenShake((cfg.SACUDIDA_PX || 6) + (cfg.SACUDIDA_EXTRA_PX || 10) * k, cfg.SACUDIDA_MS || 520); } catch (e) {}
  try { flashScreen(`rgba(255,255,255,${((cfg.DESTELLO || 0.10) + 0.12 * k).toFixed(2)})`, 380); } catch (e) {}
  const z = (cfg.PULSO_ZOOM || 0.02) * (0.6 + k);
  try { canvas.animate([{ transform: 'scale(1)' }, { transform: `scale(${(1 + z).toFixed(4)})`, offset: .25 }, { transform: 'scale(1)' }], { duration: 480, easing: 'ease-out' }); } catch (e) {}
  if (navigator.vibrate) { try { navigator.vibrate([60, 30, 60 + Math.round(80 * k)]); } catch (e) {} }
}
// [0.087b] ¿Está entrando el Duende o el Trapero (o hay uno en pantalla)?
function npcSceneActive() {
  if (Date.now() < npcHideUntil) return true;
  if (cofradiaOpen) return true;
  const ids = ['dialogueModal', 'merchantModal', 'traperoShopModal', 'traperoModal'];
  for (const id of ids) { const e = document.getElementById(id); if (e && !e.classList.contains('hidden')) return true; }
  return false;
}
let chestUiLast = -1;
function setChestUiOpacity(v) {
  const q = Math.round(v * 20) / 20;
  if (q === chestUiLast) return;
  chestUiLast = q;
  ['chestActionCard', 'multiChestGrid'].forEach(id => {
    const e = document.getElementById(id);
    if (e) { e.style.opacity = String(q); e.style.pointerEvents = q < 0.5 ? 'none' : ''; }
  });
  const ob = document.getElementById('openChestBtn'); if (ob) ob.style.pointerEvents = q < 0.5 ? 'none' : '';   // [0.091] la tarjeta deja pasar los toques; solo el botón los recoge
}
// [0.091] Fuente hexadecimal 5x7 para la pantalla del Arca Digital
const HEX_FONT = {
  '0': ['01110','10001','10011','10101','11001','10001','01110'], '1': ['00100','01100','00100','00100','00100','00100','01110'],
  '2': ['01110','10001','00001','00010','00100','01000','11111'], '3': ['11110','00001','00001','01110','00001','00001','11110'],
  '4': ['00010','00110','01010','10010','11111','00010','00010'], '5': ['11111','10000','11110','00001','00001','10001','01110'],
  '6': ['00110','01000','10000','11110','10001','10001','01110'], '7': ['11111','00001','00010','00100','01000','01000','01000'],
  '8': ['01110','10001','10001','01110','10001','10001','01110'], '9': ['01110','10001','10001','01111','00001','00010','01100'],
  'A': ['01110','10001','10001','11111','10001','10001','10001'], 'B': ['11110','10001','10001','11110','10001','10001','11110'],
  'C': ['01110','10001','10000','10000','10000','10001','01110'], 'D': ['11110','10001','10001','10001','10001','10001','11110'],
  'E': ['11111','10000','10000','11110','10000','10000','11111'], 'F': ['11111','10000','10000','11110','10000','10000','10000']
};
const HEX_CHARS = '0123456789ABCDEF';
function seededHex(seed, n) { let h = (seed * 2654435761) >>> 0, out = ''; for (let i = 0; i < n; i++) { h = (Math.imul(h ^ (h >>> 15), 2246822519) + 374761393) >>> 0; out += HEX_CHARS[h % 16]; } return out; }
function drawChestAnim(typeId, R, aco, ctx, ox, oy, px) {
  const t = Date.now() / 1000;
  if (typeId === 'piston' && aco.PISTONES && aco.PISTONES.ACTIVAR) {
    const P = aco.PISTONES;
    P.X.forEach((X, i) => {
      const k = (Math.sin(t * Math.PI * 2 / P.PERIODOS_S[i] + P.FASES[i]) + 1) / 2;
      const h = Math.round(P.Y_MIN + (P.Y_MAX - P.Y_MIN) * k);
      R(X, 29, 4, 12, '#1f1d2b');                         // hueco vacío
      R(X, h, 1, 1, '#8a7f6a'); R(X + 1, h, 3, 1, '#b5a888');   // cabeza del pistón
      R(X, h + 1, 1, 40 - h, '#8a7f6a'); R(X + 1, h + 1, 3, 40 - h, '#5a5768');   // cuerpo
    });
  } else if (typeId === 'cyber' && aco.DIGITAL && aco.DIGITAL.ACTIVAR) {
    const D = aco.DIGITAL, now = Date.now();
    const cyc = Math.floor(now / D.CAMBIO_MS), ph = now % D.CAMBIO_MS;
    const target = seededHex(cyc + 11, 4);
    R(12, 15, 32, 9, '#0a0910');                            // fondo de la pantalla
    for (let i = 0; i < 4; i++) {
      const settle = 120 + i * (D.BARAJA_MS - 120) / 3;
      const scr = ph < settle;
      const ch = scr ? seededHex(Math.floor(now / 55) * 7 + i * 31, 1) : target[i];
      const col = scr ? '#3f8a8a' : '#5aa1a0';
      HEX_FONT[ch].forEach((row, ry) => { for (let rx = 0; rx < 5; rx++) if (row[rx] === '1') R(15 + i * 6 + rx, 15 + ry, 1, 1, col); });
    }
    if (Math.floor(now / 450) % 2 === 0) R(39, 22, 4, 1, '#5aa1a0');   // cursor parpadeante
    const LED = ['#b03a3a', '#5fd08a', '#5a5768', '#c9983a', '#1a1a26'];
    [42, 44, 46].forEach((X, i) => {
      const col = LED[Math.floor(t / D.LEDS_PERIODOS_S[i] + i * 1.7) % LED.length];
      R(X, 30, 1, 1, col);
      if (col !== '#1a1a26' && col !== '#5a5768') {
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.22; ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(ox + (X + 0.5) * px, oy + 30.5 * px, px * 2.2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    });
  } else if (typeId === 'hydraulic' && aco.AGUJA && aco.AGUJA.ACTIVAR) {
    const A = aco.AGUJA, tt = t % A.CICLO_S;
    let ang;
    if (tt < A.SUBIDA_S) { const u = tt / A.SUBIDA_S, e = 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2); ang = A.ANGULO_REPOSO + (A.ANGULO_PRESION - A.ANGULO_REPOSO) * e; }
    else ang = A.ANGULO_PRESION + A.TEMBLOR_GRADOS * Math.sin((tt - A.SUBIDA_S) * 2.9) * Math.min(1, (tt - A.SUBIDA_S) / 1.2) + 1.8 * Math.sin(tt * 14);
    [[28, 20], [29, 19], [30, 18], [31, 17]].forEach(([x, y]) => R(x, y, 1, 1, '#dccfae'));   // borra la aguja original
    const rad = ang * Math.PI / 180, dx = Math.sin(rad), dy = -Math.cos(rad), seen = {};
    for (let sLen = 0.6; sLen <= 5.6; sLen += 0.35) {
      const x = Math.floor(27.5 + dx * sLen), y = Math.floor(21.5 + dy * sLen), key = x + ',' + y;
      if (!seen[key]) { seen[key] = 1; R(x, y, 1, 1, '#0a0910'); }
    }
    R(27, 21, 1, 1, '#b03a3a');                              // eje rojo
  }
}
function decorFadeAlpha(d) {
  if (!d.fading) return 1;
  return Math.max(0, 1 - (Date.now() - d.fading) / 700);
}
// [0.087b] Las tres filas de adornos (arriba, centro, abajo) mantienen siempre la misma separación entre sí
function decorRowY(row) {
  const h = canvas ? canvas.height : 600;
  const top = Math.min(DATOS_JUEGO.DECORACIONES_SALA.FILA_SUPERIOR_Y || 350, h * 0.32);
  const bottom = h - 210;
  if (row === 'top') return top;
  if (row === 'bot') return bottom;
  return (top + bottom) / 2;
}
function decorY(d) {
  if (d.row) return decorRowY(d.row);
  return (d.y === 210 || d.y === 270) ? decorRowY('top') : d.y;   // adornos guardados con la fila antigua
}

const TOOL_COLORS = { picks: '#fbbf24', proPicks: '#cbd5e1', usb: '#22d3ee', valves: '#fb923c' };

// [0.086] Indicador pegado a la cerradura: coste en herramientas (color de la herramienta) o "faltan N" en rojo
function drawLockOverlay(lx, ly, lr, chest) {
  const now = Date.now();
  const req = getRequiredToolCount(chest.rarity);
  const have = STATE[chest.type.consumible] || 0;
  const missing = Math.max(0, req - have);
  const armed = lockArmedChest === chest && (now - lockArmedAt) < 4000;
  const shake = now < lockShakeUntil ? Math.sin(now * 0.06) * 5 : 0;
  const fs = Math.max(13, Math.round(canvas.width * 0.028));
  ctx.save();
  ctx.translate(shake, 0);
  // aro de la zona táctil (más visible mientras dura la flecha de ayuda)
  const flc = DATOS_JUEGO.GRAFICOS.FLECHA_CERROJO || {};
  const openedN = (STATE.opensByType || {})[chest.type.id] || 0;
  const showArrow = !!flc.ACTIVAR && openedN < (flc.COFRES_POR_TIPO || 2);
  ctx.globalAlpha = armed ? 0.9 : (showArrow ? 0.75 + Math.sin(now * 0.005) * 0.2 : 0.30 + Math.sin(now * 0.004) * 0.12);
  ctx.strokeStyle = missing ? '#ef4444' : (armed ? '#ffffff' : '#fde68a');
  ctx.lineWidth = armed || showArrow ? 3 : 2;
  ctx.setLineDash(armed ? [] : [5, 5]);
  ctx.beginPath(); ctx.arc(lx, ly, lr * (armed ? 0.95 + Math.sin(now * 0.012) * 0.05 : 1), 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  // etiqueta de coste: solo si hacen falta 2+ herramientas o si faltan (con 1 sola no se pinta)
  if (req > 1 || missing > 0) {
    const label = missing ? `faltan ${missing}` : `x${req}`;
    ctx.font = `bold ${fs}px monospace`;
    const tw = ctx.measureText(label).width + 14;
    const bx = lx - tw / 2, by = ly - lr - fs - 12;
    ctx.fillStyle = 'rgba(2,6,23,0.85)';
    ctx.strokeStyle = missing ? '#ef4444' : (TOOL_COLORS[chest.type.consumible] || '#fbbf24');
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, tw, fs + 8, 6); else ctx.rect(bx, by, tw, fs + 8);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = missing ? '#fca5a5' : (TOOL_COLORS[chest.type.consumible] || '#fbbf24');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, lx, by + (fs + 8) / 2 + 1);
  }
  // flecha + mensaje en los primeros cofres de cada tipo (o aviso de "toca otra vez" con varios cofres)
  const fl = flc;
  const showMsg = showArrow && (fl.MENSAJE_SOLO_TIPOS || ['wooden']).includes(chest.type.id);
  if (armed || showArrow) {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const bounce = Math.sin(now * 0.008) * 4;
    if (showArrow && !armed) {
      // flecha apuntando hacia arriba, hacia el cerrojo
      const tipY = ly + lr + 4 + bounce;
      ctx.fillStyle = '#fde68a'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx, tipY); ctx.lineTo(lx + 11, tipY + 14); ctx.lineTo(lx + 4, tipY + 14); ctx.lineTo(lx + 4, tipY + 26);
      ctx.lineTo(lx - 4, tipY + 26); ctx.lineTo(lx - 4, tipY + 14); ctx.lineTo(lx - 11, tipY + 14); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
    const armedMsg = armed && openedN < (fl.COFRES_POR_TIPO_TOCA_OTRA_VEZ || 5);   // [0.089] se quita tras 5 aciertos por tipo
    if (armedMsg || showMsg) {
    const txt = armedMsg ? 'TOCA OTRA VEZ PARA ABRIR' : (fl.TEXTO || 'TOCA EL CERROJO PARA ABRIR');
    const ty = ly + lr + (armedMsg ? 8 : 36);
    ctx.font = `bold ${fs}px monospace`;
    const hw = ctx.measureText(txt).width + 16;
    ctx.fillStyle = 'rgba(2,6,23,0.88)';
    ctx.fillRect(lx - hw / 2, ty, hw, fs + 10);
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5;
    ctx.strokeRect(lx - hw / 2, ty, hw, fs + 10);
    ctx.fillStyle = '#fef3c7';
    ctx.fillText(txt, lx, ty + (fs + 10) / 2 + 1);
    }
  }
  ctx.restore();
}

// [0.089] Estado "armado" compartido entre la cerradura y el botón: el primer toque carga, el segundo abre (también con un solo cofre)
function lockIsArmed(active) { return !!active && lockArmedChest === active && (Date.now() - lockArmedAt) < 4000; }
function armLock(active) {
  const vib = DATOS_JUEGO.GRAFICOS.VIBRACION || {};
  lockArmedChest = active; lockArmedAt = Date.now();
  audio.playLockCharge(active.type.id);
  if (navigator.vibrate && vib.CARGAR) navigator.vibrate(vib.CARGAR);
}
// [0.086] Toque sobre la cerradura. Primer toque: arma (sonido propio del tipo + vibración); segundo toque: abre.
function handleLockTap() {
  const tl = DATOS_JUEGO.GRAFICOS.TOCAR_CERRADURA || {};
  if (!tl.ACTIVAR || !CHEST_LOCK) return false;
  if (tl.SOLO_PANTALLA_ANCHA && !isWideLayout()) return false;
  const btn = document.getElementById('openChestBtn') || document.getElementById('openActiveChestBtn');
  if (!btn || btn.disabled || !isGameIdle() || minigameInProgress) return false;
  const active = STATE.screenChests[STATE.activeChestIdx];
  if (!active) return false;
  audio.init();
  const vib = DATOS_JUEGO.GRAFICOS.VIBRACION || {};
  const hasTools = (STATE[active.type.consumible] || 0) >= getRequiredToolCount(active.rarity);
  if (hasTools && !lockIsArmed(active)) { armLock(active); return true; }
  lockArmedChest = null;
  if (navigator.vibrate && vib.ABRIR) navigator.vibrate(vib.ABRIR);
  if (!hasTools) lockShakeUntil = Date.now() + 450;
  openActiveChest();
  return true;
}

// [0.089] El botón "Forzar cerradura" cambia de texto, palpita y se enmarca con el color de la rareza mientras está armado
let armedBtnShown = false, armedBtnPrevText = '', armedBtnTextSet = '';
function syncOpenButtonArmed() {
  const btn = document.getElementById('openChestBtn');
  if (!btn) return;
  const active = STATE.screenChests[STATE.activeChestIdx];
  const armed = lockIsArmed(active) && !minigameInProgress;
  const t = document.getElementById('openChestBtnText');
  if (armed && !armedBtnShown) {
    armedBtnShown = true;
    btn.classList.add('btn-armed');
    btn.style.setProperty('--armc', (active.rarity && active.rarity.color) || '#ffffff');
    if (t) { armedBtnPrevText = t.textContent; armedBtnTextSet = DATOS_JUEGO.GRAFICOS.BOTON_ARMADO_TEXTO || 'PULSA DE NUEVO'; t.textContent = armedBtnTextSet; }
  } else if (!armed && armedBtnShown) {
    armedBtnShown = false;
    btn.classList.remove('btn-armed');
    if (t && t.textContent === armedBtnTextSet) t.textContent = armedBtnPrevText;
  }
}

// [0.089b] Nivel visual de la maldición: sube al empezar (con melodía lúgubre) y baja al terminar (melodía con nota final aguda).
// Solo avanza cuando se ve la pantalla principal; si hay un banner o una tienda encima, espera.
let curseLevel = 0, curseLvlT = 0, curseStartTune = false, curseEndTune = false, curseLiftT0 = 0;   // [0.105] curseLiftT0: pulso de luz al terminar la maldición (se nota aunque ya haya tinte de paranoia)
let ambPrev = null, ambCur = null, ambT0 = 0, ambFirst = true;   // [0.105] fundido cruzado entre ambientes
function updateCurseLevel() {
  const cfg = DATOS_JUEGO.MALDICION_TRANSICION || {};
  const now = performance.now(), dt = curseLvlT ? Math.min(100, now - curseLvlT) : 16; curseLvlT = now;
  if (cfg.ACTIVAR === false) return STATE.cursedChestsLeft > 0 ? 1 : 0;
  const want = (STATE.cursedChestsLeft > 0 || curseHold) ? 1 : 0;   // [0.096] curseHold: la maldición 'sigue' hasta cerrar el mensaje del Trapero
  if (curseLevel === want) { if (want) curseEndTune = false; else curseStartTune = false; return curseLevel; }
  if (!mainScreenFree()) return curseLevel;
  if (want && !curseStartTune) { curseStartTune = true; curseEndTune = false; audio.init(); audio.playCurseStart(); }
  if (!want && !curseEndTune) { curseEndTune = true; curseStartTune = false; curseLiftT0 = performance.now(); audio.init(); audio.playCurseEnd(); audio.playSoftPad(); }
  const step = dt / (cfg.DURACION_MS || 2600);
  curseLevel = want ? Math.min(1, curseLevel + step) : Math.max(0, curseLevel - step);
  return curseLevel;
}
function renderRoom() {
  if (!canvas || !ctx) return;
  syncOpenButtonArmed();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2 - 20;

  const rtier = getNarrativeTier();
  let redAlpha = (DATOS_JUEGO.GRAFICOS.TINTE_ROJO_POR_TIER || {})[rtier] || 0;
  if (rtier === 4) {
    // [0.087b] progresivo: 0 al acabar el tier 3 → valor del tier 5 al llegar al tier 5
    const U = DATOS_JUEGO.NARRATIVA.UMBRALES_TIERS;
    const maxA = (DATOS_JUEGO.GRAFICOS.TINTE_ROJO_POR_TIER || {})[5] || 0.28;
    redAlpha = Math.max(0, Math.min(1, (STATE.chestsOpened - U.tier_3) / (U.tier_4 + 1 - U.tier_3))) * maxA;
  }
  const ambientes = DATOS_JUEGO.DECORACIONES_SALA.AMBIENTES;
  const amb = (rtier >= 5 || STATE.cursedChestsLeft > 0) ? null : ambientes[STATE.roomThemeFilter];   // [0.089] maldición (y Tier 5) tienen prioridad sobre el ambiente de los objetos
  const roomDark = (STATE.roomDarkUntil || 0) > STATE.chestsOpened;
  if (roomDarkPrev === null) roomDarkPrev = roomDark;
  if (roomDark !== roomDarkPrev) {
    // [0.087b] La luz vuelve con la animación inversa del parpadeo y un acorde suave
    if (!roomDark) { lightOnT0 = Date.now(); audio.playLightOn(); }
    roomDarkPrev = roomDark;
  }
  // [0.105] Fundido cruzado de 0,5 s cuando cambia el ambiente (fondo y tinte); la primera vez no se anima
  if ((amb || null) !== ambCur) { if (!ambFirst) { ambPrev = ambCur; ambT0 = performance.now(); try { audio.init(); audio.playSoftPad(); } catch (e) {} } ambCur = amb || null; ambFirst = false; }
  const ambP = ambPrev !== null || ambT0 ? Math.min(1, (performance.now() - ambT0) / 500) : 1;
  const paintBg = (a, alpha) => {
    let g = ctx.createRadialGradient(cx, cy, 30, cx, cy, canvas.width), st;
    if (a && a.fondo) st = a.fondo;
    else if (rtier >= 5) st = ['#450a0a', '#180202', '#000000'];
    else st = ['#111827', '#0f172a', '#030712'];
    g.addColorStop(0, st[0]); g.addColorStop(0.6, st[1]); g.addColorStop(1, st[2]);
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.restore();
  };
  if (ambP < 1) { paintBg(ambPrev, 1); paintBg(ambCur, ambP); } else paintBg(ambCur, 1);

  // [0.085] Fondo de la celda (pixel art, escalado "cover") + tinte según el ambiente
  if (artReady('celda')) {
    // [0.086] Celda a oscuras: parpadeo de la bombilla al apagarse y luego fotograma apagado
    let cellKey = 'celda';
    if (roomDark && artReady('celdaApagada')) {
      cellKey = 'celdaApagada';
      const ft = Date.now() - darkFlickerT0;
      if (ft >= 0 && ft < 1500) {
        const seq = ['celda', 'celdaParpadeo1', 'celdaApagada', 'celdaParpadeo2', 'celdaApagada', 'celdaParpadeo1', 'celdaApagada'];
        const k = seq[Math.min(seq.length - 1, Math.floor(ft / 215))];
        if (artReady(k)) cellKey = k;
      }
    } else if (!roomDark && lightOnT0 && Date.now() - lightOnT0 < 1500 && artReady('celdaApagada')) {
      const lt = Date.now() - lightOnT0;
      const seq = ['celdaApagada', 'celdaParpadeo1', 'celdaApagada', 'celdaParpadeo2', 'celda', 'celdaParpadeo1', 'celda'];
      const k = seq[Math.min(seq.length - 1, Math.floor(lt / 215))];
      if (artReady(k)) cellKey = k;
    }
    const im = ART[cellKey];
    const sc = Math.max(canvas.width / im.naturalWidth, canvas.height / im.naturalHeight);
    const dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(im, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    // [0.086] Tinte suave del ambiente + tinte rojo según el tier narrativo
    if (ambP < 1) {
      if (ambPrev && ambPrev.tinte) { ctx.save(); ctx.globalAlpha = 1 - ambP; ctx.fillStyle = ambPrev.tinte; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.restore(); }
      if (ambCur && ambCur.tinte) { ctx.save(); ctx.globalAlpha = ambP; ctx.fillStyle = ambCur.tinte; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.restore(); }
    } else if (amb && amb.tinte) { ctx.fillStyle = amb.tinte; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    if (redAlpha > 0) { ctx.fillStyle = `rgba(140,12,12,${redAlpha})`; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    // [0.090] Maldición activa: rojo rotundo con viñeta. El tinte del tier 5 manda siempre (no se añade); el progresivo del tier 4 se SUMA a la maldición.
    {
      const tm = DATOS_JUEGO.GRAFICOS.TINTE_MALDICION || {};
      const lvl = updateCurseLevel();   // 0..1, sube/baja despacio y solo con la pantalla principal visible
      if (tm.ACTIVAR && lvl > 0 && rtier < 5) {
        const pa = (tm.ALFA + Math.sin(Date.now() * 0.0022) * (tm.PULSO || 0)) * lvl;
        ctx.fillStyle = `rgba(${tm.RGB},${pa.toFixed(3)})`; ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (tm.VINETA) {
          const vg = ctx.createRadialGradient(cx, canvas.height / 2, canvas.width * 0.25, cx, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.75);
          vg.addColorStop(0, `rgba(${tm.VINETA_RGB || '90,0,8'},0)`);
          vg.addColorStop(1, `rgba(${tm.VINETA_RGB || '90,0,8'},${(tm.VINETA * lvl).toFixed(3)})`);
          ctx.fillStyle = vg; ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }

  // [0.105] Fin de la maldición: pulso de luz pálida que se abre desde el centro (se ve también con el tinte de paranoia, donde el rojo no cambia)
  if (curseLiftT0) {
    const lt = (performance.now() - curseLiftT0) / 1500;
    if (lt >= 1) curseLiftT0 = 0;
    else {
      const a = Math.sin(Math.PI * Math.min(1, lt * 1.15)) * 0.34, R = Math.max(canvas.width, canvas.height) * (0.25 + 0.75 * lt);
      const lg = ctx.createRadialGradient(cx, canvas.height / 2, 0, cx, canvas.height / 2, R);
      lg.addColorStop(0, `rgba(190,235,255,${a.toFixed(3)})`); lg.addColorStop(0.65, `rgba(150,210,255,${(a * 0.45).toFixed(3)})`); lg.addColorStop(1, 'rgba(150,210,255,0)');
      ctx.fillStyle = lg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  STATE.roomDecorations.forEach(decor => {
    ctx.save();
    ctx.translate(decor.x, decorY(decor));
    const fa = decorFadeAlpha(decor);
    ctx.globalAlpha = fa;
    const dspr = decor.sprite || ((DATOS_JUEGO.DECORACIONES_SALA.ICONOS.find(i => i.nombre === decor.name) || {}).sprite);
    const di = dspr && artReady('deco_' + dspr) ? ART['deco_' + dspr] : null;
    if (di) {
      // [0.086] Adorno pixel art: brillo suave si sigue sin inspeccionar; atenuado si ya se usó
      const ds = decor.size * 1.9;
      ctx.imageSmoothingEnabled = false;
      if (!decor.used) {
        const pulse = 0.55 + Math.sin(Date.now() * 0.003 + decor.x) * 0.2;
        const gl = ctx.createRadialGradient(0, 0, 2, 0, 0, ds * 0.8);
        gl.addColorStop(0, `rgba(245,158,11,${(0.28 * pulse).toFixed(3)})`);
        gl.addColorStop(1, 'rgba(245,158,11,0)');
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, 0, ds * 0.8, 0, Math.PI * 2); ctx.fill();
      } else ctx.globalAlpha = 0.3 * fa;
      ctx.drawImage(di, -ds / 2, -ds / 2, ds, ds);
    } else {
      ctx.fillStyle = decor.color;
      ctx.font = `${decor.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(decor.icono, 0, 0);
      if (decor.used) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.arc(0, 0, decor.size / 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  });
  // [0.087] Los adornos reemplazados terminan de desvanecerse y se eliminan
  if (STATE.roomDecorations.some(d => d.fading && decorFadeAlpha(d) <= 0)) STATE.roomDecorations = STATE.roomDecorations.filter(d => !d.fading || decorFadeAlpha(d) > 0);

  const useArt = artReady('celda');
  if (!useArt) {
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 90, 160, 42, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const activeChest = STATE.screenChests && STATE.screenChests[STATE.activeChestIdx];
  const chestImgKey = activeChest && activeChest.type ? chestSpriteKey(activeChest.type, activeChest.rarity) : null;
  CHEST_LOCK = null;
  // [0.087b] El cofre (y su tarjeta) se ocultan mientras entra el Duende o el Trapero y vuelven con un fundido
  const npcOn = false;   // [0.088] ya no se oculta el cofre: lo tapa el telón de transición
  chestFade += ((npcOn ? 0 : 1) - chestFade) * 0.18;
  if (npcOn && chestFade < 0.02) chestFade = 0;
  if (!npcOn && chestFade > 0.98) chestFade = 1;
  setChestUiOpacity(chestFade);
  ctx.save();
  ctx.globalAlpha = chestFade;
  if (chestFade > 0) {
  if (useArt && activeChest && activeChest.rarity && chestImgKey && artReady(chestImgKey)) {
    // [0.085] Cofre con sprite: brillo del color de rareza + sprite pixelado
    // [0.086] Halo reforzado por rareza (más grande y opaco; aro exterior en épico y legendario)
    const g = DATOS_JUEGO.GRAFICOS;
    const im = ART[chestImgKey];
    const sc = Math.min((canvas.width * g.COFRE_ANCHO_PCT) / im.naturalWidth, (canvas.height * 0.24) / im.naturalHeight);
    const dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
    const mobileMulti = !isWideLayout() && STATE.screenChests.length > 1;
    const ccx = canvas.width / 2, ccy = canvas.height * (g.COFRE_Y_PCT - (mobileMulti ? (g.COFRE_SUBE_MOVIL_MULTI || 0) : 0));
    const bob = Math.sin(Date.now() * 0.002) * 2;
    const halo = (g.HALO_RAREZA || {})[activeChest.rarity.id] || { a: '88', r: 0.85, anillo: false };
    const glowR = dw * halo.r + Math.sin(Date.now() * 0.003) * 6;
    const rcol = activeChest.rarity.color || '#f59e0b';
    ctx.save();
    if (activeChest.rarity.id !== 'normal') ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(ccx, ccy, 8, ccx, ccy, glowR);
    glow.addColorStop(0, rcol + halo.a);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(ccx, ccy, glowR, 0, Math.PI * 2); ctx.fill();
    if (halo.anillo) {
      ctx.globalAlpha = 0.35 + Math.sin(Date.now() * 0.004) * 0.15;
      ctx.strokeStyle = rcol; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ccx, ccy, glowR * 0.86, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.ellipse(ccx, ccy + dh / 2 + 4, dw * 0.46, dh * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(im, ccx - dw / 2, ccy - dh / 2 + bob, dw, dh);
    if (chestSwapFx) drawChestSwapOverlay(ctx, im, ccx, ccy + bob, dw, dh);   // [0.103] destello blanco + cruz de luz del cambio de cofre
    // [0.097] PRUEBA: chispas doradas subiendo sobre el cofre legendario (como las de la pantalla de subida de nivel). Se apaga con GRAFICOS.CHISPAS_LEGENDARIO.ACTIVAR:false
    const chs = g.CHISPAS_LEGENDARIO;
    if (chs && chs.ACTIVAR && activeChest.rarity.id === 'legendario') {
      const tn = Date.now();
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < chs.CANTIDAD; i++) {
        const ph = ((tn / chs.CICLO_MS) + i / chs.CANTIDAD + ((i * 37) % 7) * 0.013) % 1;
        const fx = ccx + (((i * 53) % 100) / 100 - 0.5) * dw * 0.9 + Math.sin(ph * 7 + i) * 3;
        const fy = ccy + dh * 0.15 - ph * dh * chs.ALTURA;
        const a = Math.min(1, ph * 6) * Math.min(1, (1 - ph) * 2.4);
        const q = Math.max(2, Math.round(dw / 40));
        ctx.globalAlpha = a * 0.95;
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(Math.round(fx / q) * q, Math.round(fy / q) * q, q, q);
        ctx.globalAlpha = a * 0.35;
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(Math.round(fx / q) * q - q, Math.round(fy / q) * q - q, q * 3, q * 3);
      }
      ctx.restore();
    }
    // [0.090] Vapor animado (solo Cofre de Vapor): bocanadas pixeladas que suben, crecen y se desvanecen
    const vap = g.VAPOR_ANIMADO;
    if (vap && vap.ACTIVAR && activeChest.type.id === 'hydraulic' && im._steamless) {
      const t0 = Date.now(), px = dw / im.naturalWidth, ox = ccx - dw / 2, oy = ccy - dh / 2 + bob;
      for (let i = 0; i < vap.BOCANADAS; i++) {
        const ph = ((t0 / vap.CICLO_MS) + i / vap.BOCANADAS) % 1;
        const sz = vap.TAM_MIN + (vap.TAM_MAX - vap.TAM_MIN) * ph;
        const wob = Math.sin(ph * 6 + i * 1.7) * 1.2;
        const sxp = vap.BOQUILLA.x + (vap.DERIVA * ph) + wob + ((i * 37) % 5 - 2) * 0.35;
        const syp = vap.BOQUILLA.y - vap.ALTURA * ph;
        const a = Math.min(1, ph * 8) * Math.min(1, (1 - ph) * 2.2) * 0.92;
        const q = px / 2;   // rejilla de medio píxel del sprite (se ve pixel art)
        const x = Math.round((ox + sxp * px) / q) * q, y = Math.round((oy + syp * px) / q) * q, w = Math.max(q, Math.round(sz * px / q) * q);
        ctx.fillStyle = `rgba(${vap.COLOR},${a.toFixed(3)})`;
        ctx.fillRect(x - w / 2, y - w / 2, w, w);
        ctx.fillRect(x - w * 0.9, y - w * 0.1, w * 0.55, w * 0.55);
        ctx.fillRect(x + w * 0.35, y - w * 0.7, w * 0.6, w * 0.6);
      }
    }
    // [0.091] Animaciones de cofre: pistones (Acero), pantalla y leds (Digital), aguja de presión (Vapor)
    const aco = g.ANIMACION_COFRES;
    if (aco && aco.ACTIVAR && im.naturalWidth === 56) {
      const pxs = dw / im.naturalWidth, oxs = ccx - dw / 2, oys = ccy - dh / 2 + bob;
      const R = (X, Y, W, H, col) => { const x0 = Math.round(oxs + X * pxs), y0 = Math.round(oys + Y * pxs); ctx.fillStyle = col; ctx.fillRect(x0, y0, Math.round(oxs + (X + W) * pxs) - x0, Math.round(oys + (Y + H) * pxs) - y0); };
      drawChestAnim(activeChest.type.id, R, aco, ctx, oxs, oys, pxs);
    }

    // [0.086] Cerradura táctil (solo pantalla ancha)
    const tl = g.TOCAR_CERRADURA || {};
    const L = (g.CERRADURAS || {})[activeChest.type.id];
    CHEST_LOCK_ZONE = null;
    if (tl.ACTIVAR && L && (!tl.SOLO_PANTALLA_ANCHA || isWideLayout())) {
      const lx = ccx - dw / 2 + L.x * dw, ly = ccy - dh / 2 + bob + L.y * dh;
      const lr = Math.max(tl.RADIO_MIN_PX || 26, L.r * dw);
      CHEST_LOCK_ZONE = { x: lx, y: ly, r: lr };   // [0.087] siempre disponible (los post-its la esquivan)
      if (!minigameInProgress && chestFade > 0.95 && isGameIdle()) {
        CHEST_LOCK = CHEST_LOCK_ZONE;
        drawLockOverlay(lx, ly, lr, activeChest);
      }
    }
  } else if (activeChest && activeChest.rarity && activeChest.type) {
    ctx.save();
    ctx.translate(cx, cy);

    const glowRadius = 55 + Math.sin(Date.now() * 0.003) * 8;
    const glow = ctx.createRadialGradient(0, -10, 10, 0, -10, glowRadius);
    const colorHex = activeChest.rarity.color || '#f59e0b';
    glow.addColorStop(0, colorHex + 'aa');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, -10, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colorHex;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-42, -48, 84, 58, 10);
    } else {
      ctx.rect(-42, -48, 84, 58);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-37, -32, 74, 6);

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -16, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  }   // fin de "if (chestFade > 0)"
  ctx.restore();

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  requestAnimationFrame(renderRoom);
}
if (canvas) requestAnimationFrame(renderRoom);

if (canvas) {
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // [0.086] La cerradura tiene prioridad sobre los adornos secretos
    if (CHEST_LOCK && Math.hypot(clickX - CHEST_LOCK.x, clickY - CHEST_LOCK.y) <= CHEST_LOCK.r) {
      if (handleLockTap()) return;
    }

    for (let decor of STATE.roomDecorations) {
      if (!decor.used && !decor.fading && Math.hypot(clickX - decor.x, clickY - decorY(decor)) < decor.size + (DATOS_JUEGO.DECORACIONES_SALA.TOQUE_EXTRA_PX != null ? DATOS_JUEGO.DECORACIONES_SALA.TOQUE_EXTRA_PX : 14)) {
        decor.used = true;
        audio.init(); audio.playDecorTap();   // [0.087b] sonido al pulsar un adorno
        triggerSecretDecorationReward(decor);
        return;
      }
    }
  });
}

function spawnSpookyPerimeterDecoration() {
  const spookyDecorList = DATOS_JUEGO.DECORACIONES_SALA.ICONOS;
  const chosenDecor = spookyDecorList[Math.floor(Math.random() * spookyDecorList.length)];
  const descriptor = DATOS_JUEGO.DECORACIONES_SALA.ADJETIVOS[Math.floor(Math.random() * DATOS_JUEGO.DECORACIONES_SALA.ADJETIVOS.length)];

  const w = canvas ? canvas.width : 800;
  const h = canvas ? canvas.height : 600;

  const anchorZones = [
    { x: 60, row: 'top' },
    { x: w - 60, row: 'top' },
    { x: 60, row: 'mid' },
    { x: w - 60, row: 'mid' },
    { x: 60, row: 'bot' },
    { x: w - 60, row: 'bot' }
  ];

  anchorZones.forEach(z => { z.y = decorRowY(z.row); });
  // [0.097] Solo se pisa un adorno anterior cuando los 6 sitios están ocupados
  const occupied = z => STATE.roomDecorations.some(d => !d.fading && Math.abs(d.x - z.x) < 4 && Math.abs(decorY(d) - z.y) < 4);
  const freeZones = anchorZones.filter(z => !occupied(z));
  // Con los 6 ocupados se pisa primero un adorno ya pulsado (atenuado); si no hay ninguno, uno cualquiera
  const usedZones = anchorZones.filter(z => STATE.roomDecorations.some(d => !d.fading && d.used && Math.abs(d.x - z.x) < 4 && Math.abs(decorY(d) - z.y) < 4));
  const pool = freeZones.length ? freeZones : (usedZones.length ? usedZones : anchorZones);
  const spot = pool[Math.floor(Math.random() * pool.length)];

  // [0.087] Si la posición ya está ocupada, el adorno anterior se desvanece en vez de acumularse
  STATE.roomDecorations.forEach(d => {
    if (!d.fading && Math.abs(d.x - spot.x) < 4 && Math.abs(decorY(d) - spot.y) < 4) d.fading = Date.now();
  });
  STATE.roomDecorations.push({
    x: spot.x, y: spot.y, row: spot.row, size: 28, 
    icono: chosenDecor.icono, 
    sprite: chosenDecor.sprite || null,
    name: chosenDecor.nombre,
    descriptor: descriptor, color: '#f59e0b', used: false
  });

  return `${chosenDecor.icono} ${chosenDecor.nombre} — "${descriptor}"`;
}

// [0.088] Cambio de ambiente en espera: se ejecuta cuando el banner de feedback ya está cerrado
let pendingAmbient = null;
setInterval(() => {
  if (!pendingAmbient) return;
  const b = document.getElementById('persistentFeedbackBanner');
  if (b && !b.classList.contains('hidden')) return;
  const fn = pendingAmbient; pendingAmbient = null;
  setTimeout(fn, 150);
}, 200);
function triggerSecretDecorationReward(decor) {
  const roll = Math.random() * 100;
  let msg = `Inspeccionaste ${decor.name}. "${decor.descriptor.toUpperCase()}"`;

  if (roll < 20) {
    const themes = DATOS_JUEGO.DECORACIONES_SALA.AMBIENTES_AZAR;
    let chosen = themes[Math.floor(Math.random() * themes.length)];
    // [0.104] Si toca "color original" y la sala YA tiene su iluminación normal (ni tinte ni oscuridad), se sustituye por otro ambiente al azar
    if (chosen === 'normal' && (!STATE.roomThemeFilter || STATE.roomThemeFilter === 'normal') && !((STATE.roomDarkUntil || 0) > STATE.chestsOpened)) {
      const others = themes.filter(t => t !== 'normal');
      if (others.length) chosen = others[Math.floor(Math.random() * others.length)];
    }
    // [0.088] El efecto no se aplica hasta cerrar el banner (con el banner delante, la sala está difuminada y no se vería)
    const cursedNow = STATE.cursedChestsLeft > 0;
    const finalTier = getNarrativeTier() >= 5;
    if (chosen !== 'apagado' && (cursedNow || finalTier)) {
      // [0.089] El efecto de color del objeto se cancela: la maldición (o la narrativa final desde el Tier 5) manda. La oscuridad sí convive.
      if (cursedNow && !finalTier) {
        const lst = DATOS_JUEGO.TEXTOS_AMBIENTE_MALDICION || [];
        if (lst.length) msg += ' ' + lst[Math.floor(Math.random() * lst.length)];
      }
    } else if (chosen === 'apagado') {
      pendingAmbient = () => {
        STATE.roomDarkUntil = STATE.chestsOpened + (DATOS_JUEGO.DECORACIONES_SALA.AMBIENTE_APAGADO_COFRES || 10);
        darkFlickerT0 = Date.now();
        setTimeout(() => audio.playDarkOut(), 120);   // [0.087b] progresión de notas graves
      };
      msg += " (¡La bombilla se funde! La celda queda a oscuras un buen rato.)";
    } else {
      pendingAmbient = () => {
        // [0.087b] Cualquier cambio de ambiente enciende la luz si estaba apagada
        if ((STATE.roomDarkUntil || 0) > STATE.chestsOpened) STATE.roomDarkUntil = 0;
        STATE.roomThemeFilter = chosen;
      };
      msg += chosen === 'normal' ? " (La sala recupera su color original.)" : " (¡El ambiente de la sala ha cambiado!)";
    }
    audio.playClick(0.9);
  } else if (roll >= 20 && roll < 35) {
    chestMutateFx(() => generateScreenChests());
    msg += " (¡Luz misteriosa! Los cofres mutan).";
    audio.playUnlockFanfare('raro');
  } else if (roll >= 35 && roll < 45) {
    const active = STATE.screenChests[STATE.activeChestIdx];
    if (active && active.rarity.id !== 'legendario') {
      chestMutateFx(() => { active.rarity = CHEST_RARITIES[3]; updateChestSelectionUI(); });   // [0.097b] el cambio real también tras el banner
      msg += " (¡Un rayo de sombra eleva el cofre a LEGENDARIO!)";
      audio.playUnlockFanfare('legendario');
    } else {
      STATE.gold += 5;
      msg += " (+5 GP descubiertos)";
    }
  } else if (roll >= 45 && roll < 65) { STATE.gold += 2; msg += " (+2 GP secretos)"; }
  else if (roll >= 65 && roll < 80) { STATE.picks += 1; msg += " (+1 Ganzúa hallada)"; }
  else if (roll >= 80 && roll < 90) { STATE.usb += 1; msg += " (+1 USB hallado)"; }
  else if (roll >= 90 && roll < 97) {
    if (STATE.level >= (DATOS_JUEGO.VALVULAS_NIVEL_MIN_BOTIN || 4)) { STATE.valves += 1; msg += " (+1 Válvula hallada)"; }
    else { STATE.gold += 2; msg += " (+2 GP secretos)"; }   // [0.089] sin válvulas antes del nivel mínimo
  }
  else {
    msg += " (¡Vibración sísmica en la sala!)";
    const appBody = document.getElementById('appBody');
    if (appBody) appBody.classList.add('shake-screen');
    setTimeout(() => { if (appBody) appBody.classList.remove('shake-screen'); }, 600);
  }

  updateUI();
  showPersistentFeedback(msg);
}

// [0.096] Cambio visible de los cofres tras Aceptar (mutación / ascenso): sacudida + transformación + "plop"
let pendingChestFx = false;
function chestMutateFx(applyFn) { pendingChestFx = applyFn || true; }   // [0.097b] el cambio REAL de cofres también se aplica al cerrar el banner (sacudida, destello y luego aparecen los nuevos)
setInterval(() => {
  if (!pendingChestFx) return;
  const b = document.getElementById('persistentFeedbackBanner');
  if (b && !b.classList.contains('hidden')) return;
  if (typeof mainScreenFree === 'function' && !mainScreenFree()) return;
  const fn = pendingChestFx; pendingChestFx = false;
  chestMutateFxNow(typeof fn === 'function' ? fn : null);
}, 150);
// [0.103] Cambio de cofre (reroll / mutación / ascenso): el cofre se vuelve blanco, desaparece con un destello de luz en cruz y aparece el nuevo.
// Cronología (ms): 0-320 el cofre se blanquea · 320 cambio real + "plop" · 200-720 cruz de luz · 320-650 el nuevo cofre sale del blanco
let chestSwapFx = null;
const CHEST_SWAP_MS = { CAMBIO: 320, FIN: 720 };
function chestWhite(im) {
  if (im._white) return im._white;
  try {
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#ffffff'; g.fillRect(0, 0, c.width, c.height);
    im._white = c;
  } catch (e) { im._white = null; }
  return im._white;
}
function drawChestSwapOverlay(ctx, im, ccx, ccy, dw, dh) {
  const t = performance.now() - chestSwapFx.t0;
  const wh = chestWhite(im);
  const a = t < CHEST_SWAP_MS.CAMBIO ? Math.min(1, t / CHEST_SWAP_MS.CAMBIO) : Math.max(0, 1 - (t - CHEST_SWAP_MS.CAMBIO) / 330);
  if (wh && a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.imageSmoothingEnabled = false; ctx.drawImage(wh, ccx - dw / 2, ccy - dh / 2, dw, dh); ctx.restore(); }
  const tf = (t - 200) / 520;
  if (tf > 0 && tf < 1) {
    const inten = Math.sin(Math.PI * tf), ease = 1 - Math.pow(1 - tf, 3);
    const th = Math.max(3, dw * 0.03) * (1 - tf * 0.55);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const R = dw * 0.85 * inten;
    const gl = ctx.createRadialGradient(ccx, ccy, 2, ccx, ccy, Math.max(4, R)); gl.addColorStop(0, 'rgba(255,255,255,.9)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl; ctx.globalAlpha = inten; ctx.beginPath(); ctx.arc(ccx, ccy, Math.max(4, R), 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = inten; ctx.fillStyle = '#ffffff';
    const L = dw * 1.2 * ease, V = dh * 1.5 * ease;
    ctx.fillRect(ccx - L, ccy - th / 2, L * 2, th);            // brazo horizontal
    ctx.fillRect(ccx - th / 2, ccy - V, th, V * 2);            // brazo vertical
    ctx.globalAlpha = inten * 0.5; ctx.fillRect(ccx - L * 0.55, ccy - th * 1.4, L * 1.1, th * 2.8); ctx.fillRect(ccx - th * 1.4, ccy - V * 0.55, th * 2.8, V * 1.1);
    ctx.restore();
  }
}
function chestMutateFxNow(applyFn) {
  chestSwapFx = { t0: performance.now() };
  setTimeout(() => {
    try { audio.init(); audio.playChestMutate(); } catch (e) {}
    if (applyFn) { try { applyFn(); } catch (e) {} }
    const g = document.getElementById('multiChestGrid');
    if (g && !g.classList.contains('hidden')) { try { g.animate([{ filter: 'brightness(3)' }, { filter: 'brightness(1)' }], { duration: 380, easing: 'ease-out' }); } catch (e) {} }
  }, CHEST_SWAP_MS.CAMBIO);
  setTimeout(() => { chestSwapFx = null; }, CHEST_SWAP_MS.FIN + 80);
}
