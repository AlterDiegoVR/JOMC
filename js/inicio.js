// ==========================================================================
// JUST ONE MORE CHEST — inicio.js — VERSIÓN 0.208
// portada, arranque, avisos, pantalla completa
// ==========================================================================

// [0.087b] Al tocar la portada: clic + melodía ascendente de dungeon synth
let coverTemplate = null;
function attachCoverClose(cover) {
  cover.addEventListener('click', () => {
    cover.style.opacity = '0';
    setTimeout(() => cover.remove(), 450);
    try { audio.init(); audio.playClick(0.8); audio.playIntro(); } catch (e) {}
    try { requestGameFullscreen(); } catch (e) {}   // [0.088]
  }, { once: true });
}

// [0.103] Filtro 2x fino (Scale2x/EPX) para los sprites del Trapero: duplica la resolución suavizando solo las diagonales, así se ve menos blocky
// en la tienda y en los diálogos sin perder el estilo pixel art. Se aplica una vez al arrancar (DATOS_JUEGO.GRAFICOS.FILTRO_2X).
(function scale2xFilter() {
  const cfg = (DATOS_JUEGO.GRAFICOS && DATOS_JUEGO.GRAFICOS.FILTRO_2X) || {};
  if (!cfg.ACTIVAR || typeof ASSETS === 'undefined') return;
  (cfg.BANCOS || []).forEach(name => {
    const bank = ASSETS[name]; if (!bank) return;
    Object.keys(bank).forEach(key => {
      const src = bank[key];
      if (typeof src !== 'string' || src.indexOf('data:image') !== 0) return;
      const im = new Image();
      im.onload = () => {
        try {
          const w = im.width, h = im.height;
          const c1 = document.createElement('canvas'); c1.width = w; c1.height = h;
          const g1 = c1.getContext('2d'); g1.drawImage(im, 0, 0);
          const a = new Uint32Array(g1.getImageData(0, 0, w, h).data.buffer);
          const c2 = document.createElement('canvas'); c2.width = w * 2; c2.height = h * 2;
          const g2 = c2.getContext('2d'); const out = g2.createImageData(w * 2, h * 2); const o = new Uint32Array(out.data.buffer);
          const at = (x, y) => a[Math.max(0, Math.min(h - 1, y)) * w + Math.max(0, Math.min(w - 1, x))];
          for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
            const P = at(x, y), A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), D = at(x, y + 1);
            let p1 = P, p2 = P, p3 = P, p4 = P;
            if (C === A && C !== D && A !== B) p1 = A;
            if (A === B && A !== C && B !== D) p2 = B;
            if (D === C && D !== B && C !== A) p3 = C;
            if (B === D && B !== A && D !== C) p4 = D;
            const i = (y * 2) * (w * 2) + x * 2;
            o[i] = p1; o[i + 1] = p2; o[i + w * 2] = p3; o[i + w * 2 + 1] = p4;
          }
          g2.putImageData(out, 0, 0);
          bank[key] = c2.toDataURL('image/png');
          if (name === 'trapero' && key === 'base') { const im2 = document.querySelector('#traperoPortrait img'); if (im2) im2.src = bank[key]; }
        } catch (e) { /* si el navegador no deja leer los píxeles, se queda el sprite original */ }
      };
      im.src = src;
    });
  });
})();

// [0.085] Arte del marco: marquesinas laterales, retratos de las tiendas y portada de inicio
(function initArtFrame() {
  if (!ART_ON) return;
  const setBg = (id, src) => { const el = document.getElementById(id); if (el && src) el.style.backgroundImage = `url('${src}')`; };
  setBg('marqueeL', ASSETS.marquesinaIzq);
  setBg('marqueeR', ASSETS.marquesinaDer);
  document.body.classList.add('art-on');
  const portrait = (id, src) => {
    const el = document.getElementById(id);
    if (el && src) el.innerHTML = `<img src="${src}" alt="" style="image-rendering:pixelated;width:100%;height:100%;object-fit:contain">`;
  };
  portrait('merchantPortrait', ASSETS.duende.base);
  portrait('traperoPortrait', ASSETS.trapero.base);

  const cover = document.getElementById('coverScreen');
  if (cover && DATOS_JUEGO.GRAFICOS.MOSTRAR_PORTADA) {
    coverTemplate = cover.cloneNode(true);
    cover.style.backgroundImage = `url('${ASSETS.portada}')`;
    cover.classList.remove('hidden');
    attachCoverClose(cover);
  } else if (cover) {
    cover.remove();
  }
})();

// INICIALIZACIÓN DE LA PARTIDA
generateScreenChests();
updateUI();
updateMuteButton();

// [CAMBIO] Guardado: si hay una partida guardada, se ofrece continuarla
(function initSave() {
  const data = readSave();
  if (data && data.state && data.state.chestsOpened > 0) {
    showResumePrompt(data);
  } else {
    autosaveEnabled = true;
  }
})();

/* ==========================================================================
   [0.090] El antiguo bloque DEV (DEV_CONFIG y botón "cofre 79") desaparece: ahora todo está en el MODO TEST del menú del engranaje.
   applyDevStart queda vacía para no romper las llamadas que existían.
   ========================================================================== */
function applyDevStart() {}

/* ==========================================================================
   [0.087] SONIDO DE INTERFAZ Y MISCELÁNEA
   ========================================================================== */
// Clic suave en los botones que no tenían sonido (se salta los que ya suenan y el interior de los puzles)
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('button, [role="button"]');
  if (!btn || btn.disabled) return;
  if (btn.id === 'openChestBtn' || btn.id === 'openActiveChestBtn' || btn.id === 'muteBtn') return;
  if (btn.closest('#minigameModal') || btn.closest('#multiChestGrid')) return;
  if (btn.id && btn.id.indexOf('ability') === 0) return;
  audio.init();
  if (audio.lastSound && performance.now() - audio.lastSound < 80) return;
  audio.playUiClick();
});

// Terminal digital: el historial se desplaza hacia arriba con cada línea para que "ACCESO CONCEDIDO" siempre se vea
(function () {
  const h = document.getElementById('hackHistory');
  if (!h || !window.MutationObserver) return;
  new MutationObserver(() => { h.scrollTop = h.scrollHeight; }).observe(h, { childList: true, subtree: true, characterData: true });
})();


/* ==========================================================================
   [0.087b] AVISOS "+N" DE LLAVES (esquina inferior derecha)
   ========================================================================== */
const KEY_TOAST_STYLE = {
  picks:    { icon: 'fa-key',         color: '#fbbf24' },
  proPicks: { icon: 'fa-screwdriver', color: '#34d399' },
  usb:      { icon: 'fa-microchip',   color: '#22d3ee' },
  valves:   { icon: 'fa-faucet',      color: '#fb7185' },
  batteries: { icon: 'fa-battery-half', color: '#7dd3fc' },   // [0.201]
  fuses:    { icon: 'fa-bolt',         color: '#fde047' }   // [0.203]
};
// [0.090] Efectos de pantalla compartidos: sacudida del marco y destello de color
function screenShake(px = 6, ms = 400) {
  const f = document.getElementById('gameFrame');
  if (!f || !f.animate) return;
  const n = Math.max(4, Math.round(ms / 40)), kf = [];
  for (let i = 0; i < n; i++) { const k = 1 - i / n; kf.push({ transform: `translate3d(${((Math.random() * 2 - 1) * px * k).toFixed(1)}px,${((Math.random() * 2 - 1) * px * k).toFixed(1)}px,0)` }); }
  kf.push({ transform: 'translate3d(0,0,0)' });
  try { f.animate(kf, { duration: ms, easing: 'linear' }); } catch (e) {}
}
function flashScreen(color = 'rgba(255,0,0,.4)', ms = 500) {
  const el = document.createElement('div');
  el.style.cssText = `position:absolute;inset:0;z-index:10040;pointer-events:none;background:${color};opacity:1;transition:opacity ${ms}ms ease-out`;
  uiHost().appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '0'; }));
  setTimeout(() => el.remove(), ms + 100);
}
function modalVisible(id) { const e = document.getElementById(id); return !!(e && !e.classList.contains('hidden')); }
// [0.089] Compara las llaves con la última lectura y apunta ganancias (+N) y gastos (-N). Solo la tienda del Duende queda excluida.
function trackKeyGains() {
  if (TEST_SERIES.active) { keysBaseline = null; keyToastQueue.length = 0; return; }   // [0.091] el Modo test no genera avisos de llaves
  const cur = { picks: STATE.picks, proPicks: STATE.proPicks, usb: STATE.usb, valves: STATE.valves, batteries: STATE.batteries, fuses: STATE.fuses };
  if (!keysBaseline) { keysBaseline = cur; return; }
  const inDuendeShop = modalVisible('merchantModal') || specialShopOpen;
  Object.keys(cur).forEach(k => {
    const d = cur[k] - keysBaseline[k];
    if (d !== 0 && !inDuendeShop) {
      const ex = keyToastQueue.find(q => q.k === k && Math.sign(q.d) === Math.sign(d));
      if (ex) ex.d += d; else keyToastQueue.push({ k, d });
    }
  });
  keysBaseline = cur;
}
function showKeyToast(k, d, done) {
  const host = uiHost();
  const st = KEY_TOAST_STYLE[k] || KEY_TOAST_STYLE.picks;
  const neg = d < 0;
  const cfgK = DATOS_JUEGO.AVISOS_LLAVES || {};
  const visibleMs = keyToastQueue.length ? (cfgK.DURACION_RAPIDA_MS || 800) : (cfgK.DURACION_MS || 1450);
  const el = document.createElement('div');
  // Esquina superior derecha, justo bajo la fila de cartas (donde está el contador de cofres)
  let topPx = 150;
  try {
    const row = (document.getElementById('loopCounterDisplay') || document.getElementById('abilityAutoBtn') || {}).parentElement;
    const fr = host.getBoundingClientRect();
    if (row) topPx = Math.round(row.getBoundingClientRect().bottom - fr.top + 10);
    const lc = document.getElementById('loopCounterDisplay');
    if (lc && !lc.classList.contains('hidden')) topPx = Math.round(lc.getBoundingClientRect().bottom - fr.top + 10);
  } catch (e) {}
  // [0.089b] z-index 10050: por encima de modales (z-50), tiendas, banners (9999) y recibo (10001); antes el banner del Trato Injusto tapaba el +N
  el.style.cssText = `position:absolute;right:14px;top:${topPx}px;z-index:10050;pointer-events:none;display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:12px;background:${neg ? 'rgba(69,10,10,.92)' : 'rgba(2,6,23,.88)'};border:2px solid ${neg ? '#ef4444' : st.color};color:${st.color};font:800 18px 'Outfit',sans-serif;opacity:0;transform:translateY(-14px);transition:opacity .25s ease,transform .25s ease`;
  el.innerHTML = `<span>${neg ? '-' : '+'}${Math.abs(d)}</span><i class="fa-solid ${st.icon}"></i>`;
  host.appendChild(el);
  audio.init(); if (neg) audio.playKeySpend(); else audio.playKeyPickup();
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(12px)'; }, visibleMs);
  setTimeout(() => { el.remove(); done(); }, visibleMs + 300);
}
// Los avisos salen de uno en uno. Con ESPERAR_PANTALLA_LIBRE:true esperan a que no haya ninguna pantalla encima.
setInterval(() => {
  if (keyToastBusy || !keyToastQueue.length) return;
  const cfgK = DATOS_JUEGO.AVISOS_LLAVES || {};
  if (document.getElementById('resumeGameModal') || document.getElementById('coverScreen')) return;
  if (modalVisible('levelUpModal')) return;   // [0.097] los efectos de las wildcards esperan al final de la secuencia de subida de nivel (ruleta + elección)
  if (cfgK.ESPERAR_PANTALLA_LIBRE) {
    const blockers = ['lootModal', 'cofradiaModal', 'dialogueModal', 'levelUpModal', 'merchantModal', 'traperoShopModal', 'traperoModal', 'unfairDealModal', 'gameOverModal', 'minigameModal'];
    if (blockers.some(modalVisible) || document.getElementById('duendeReceiptModal')) return;
  }
  const q = keyToastQueue.shift();
  keyToastBusy = true;
  showKeyToast(q.k, q.d, () => { keyToastBusy = false; });
}, 250);

// [0.089] Pitido suave mientras las cartas AUTO / DUENDE palpitan: uno solo para ambas, se calla en pantallas encima y tras unas repeticiones
let cardBeepCount = 0;
// [0.089b] Zumbido legendario: suena mientras el cofre seleccionado sea legendario; se calla al empezar el puzle o con el silencio
(function () {
  const cfg = DATOS_JUEGO.ZUMBIDO_LEGENDARIO || {};
  if (!cfg.ACTIVAR) return;
  setInterval(() => {
    if (!audio.ctx) return;
    const a = STATE.screenChests && STATE.screenChests[STATE.activeChestIdx];
    // [0.092] Solo suena con la pantalla libre: sin diálogos, ventanas, banners ni eventos en cola (vuelve con su fundido al cerrarlos)
    const screenBusy = !mainScreenFree() || ['optionsModal', 'statsModal', 'achievementsModal', 'duendeReceiptModal', 'confirmModal', 'resumeGameModal', 'resetConfirmModal', 'testKeyModal'].some(modalVisible);
    const on = !!(a && a.rarity && a.rarity.id === 'legendario') && a !== humHoldChest && !screenBusy;
    audio.setLegendHum(on, cfg);
  }, 250);
})();
(function () {
  const cfg = DATOS_JUEGO.PITIDO_CARTAS || {};
  if (!cfg.ACTIVAR) return;
  setInterval(() => {
    const pulsing = ['abilityAutoBtn', 'abilitySummonDuendeBtn'].some(id => { const e = document.getElementById(id); return !!(e && e.classList.contains('card-pulse')); });
    if (!pulsing) { cardBeepCount = 0; return; }
    if (cfg.MAX_REPETICIONES && cardBeepCount >= cfg.MAX_REPETICIONES) return;
    if (!mainScreenFree() || minigameInProgress || rotateBlocked) return;   // [0.089b] se pausa con banners/ventanas y se reanuda después
    if (!audio.ctx) return;
    audio.playCardBeep(); cardBeepCount++;
  }, cfg.CADA_MS || 2000);
})();

/* ==========================================================================
   [0.087b] PORTADA: se vuelve a mostrar al reiniciar la partida
   ========================================================================== */
function showCover() {
  if (document.getElementById('coverScreen') || !coverTemplate) return;
  const c = coverTemplate.cloneNode(true);
  c.style.opacity = '1';
  c.classList.remove('hidden');
  c.style.backgroundImage = `url('${ASSETS.portada}')`;
  uiHost().appendChild(c);
  attachCoverClose(c);
}


/* ==========================================================================
   [0.088] VERSIÓN VISIBLE, AVISO "GIRA EL MÓVIL" Y PANTALLA COMPLETA
   ========================================================================== */
(function initVersionTag() {
  const el = document.getElementById('versionTag');
  if (el) el.textContent = 'v' + (DATOS_JUEGO.VERSION || '');
})();

// Aviso de girar: solo pantalla táctil + apaisada + poca altura (nunca en PC). El juego se pausa mientras está visible.
let rotateBlocked = false;
(function initRotateNotice() {
  const mq = window.matchMedia ? window.matchMedia('(orientation: landscape) and (pointer: coarse) and (max-height: 520px)') : null;
  const notice = document.getElementById('rotateNotice');
  if (!mq || !notice) return;
  const apply = () => {
    rotateBlocked = mq.matches;
    document.documentElement.classList.toggle('rotate-block', rotateBlocked);
    if (rotateBlocked) {
      const cfg = DATOS_JUEGO.AVISO_GIRAR || {};
      const list = cfg.FRASES || [];
      const t = document.getElementById('rotateTitle'); if (t) t.textContent = cfg.TITULO || '';
      const m = document.getElementById('rotateText'); if (m && list.length) m.textContent = list[Math.floor(Math.random() * list.length)];
    }
  };
  (mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply));
  apply();
})();

// Pantalla completa (solo táctil y si el navegador lo permite). Se pide al tocar la portada; el botón sirve para volver a entrar.
function fullscreenSupported() {
  const d = document.documentElement;
  return !!(d.requestFullscreen || d.webkitRequestFullscreen) && !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
}
function isFullscreenNow() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
function requestGameFullscreen() {
  if (!fullscreenSupported() || isFullscreenNow()) return;
  const d = document.documentElement;
  try {
    const p = (d.requestFullscreen || d.webkitRequestFullscreen).call(d);
    const lockPortrait = () => { try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('portrait').catch(() => {}); } catch (e) {} };
    if (p && p.then) p.then(lockPortrait).catch(() => {}); else lockPortrait();
  } catch (e) {}
}
(function initFullscreenButton() {
  const btn = document.getElementById('fsBtn');
  if (!btn || !fullscreenSupported()) return;
  btn.classList.remove('hidden');
  const icon = () => { btn.innerHTML = isFullscreenNow() ? '<i class="fa-solid fa-compress"></i>' : '<i class="fa-solid fa-expand"></i>'; };
  icon();
  document.addEventListener('fullscreenchange', icon);
  document.addEventListener('webkitfullscreenchange', icon);
  btn.addEventListener('click', () => {
    audio.init(); audio.playClick(0.6);
    if (isFullscreenNow()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} }
    else requestGameFullscreen();
  });
})();
