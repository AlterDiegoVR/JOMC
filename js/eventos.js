// ==========================================================================
// JUST ONE MORE CHEST — eventos.js — VERSIÓN 0.105
// tiendas especiales, visitas, habilidades, temporizador, fallo y Game Over
// ==========================================================================

/* ==========================================================================
   TIENDA ESPECIAL 'NO COMPRAR NADA' (85, 88 Y 90)
   ========================================================================== */

function triggerSpecialMerchantShop() {
  const co = STATE.chestsOpened;
  const seqHist = DATOS_JUEGO.NARRATIVA.HISTORIA_SECUENCIA;
  let speech = "";

  if (co === DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA.COFRE_OFERTA_1) speech = seqHist.COFRE_85_DUENDE;
  else if (co === DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA.COFRE_OFERTA_2) speech = seqHist.COFRE_88_DUENDE;
  else if (co === DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA.COFRE_OFERTA_3) speech = seqHist.COFRE_90_DUENDE;

  // [0.102] Primero se abre la tienda y luego habla el Duende en su bocadillo
  dshopOpening = speech;
  openSpecialShopModal();
}

// [CAMBIO] Lógica de "NO COMPRAR NADA" compartida: también la usan los botones Salir y X de la tienda especial
function handleSpecialShopNoBuy() {
  specialShopOpen = false;
  STATE.boughtInCurrentShop = false;
  const merchantModal = document.getElementById('merchantModal');
  if (merchantModal) merchantModal.classList.add('hidden');

  const co = STATE.chestsOpened;
  const reac = DATOS_JUEGO.NARRATIVA.REACCIONES_DUENDE_NO_COMPRAR;
  let reactionText = reac[co] || reac.DEFAULT;
  {   // [0.090] Enfado: sonido y sacudida de pantalla, más fuertes cuanto más avanzado el final
    const ec = DATOS_JUEGO.ENFADO_DUENDE || {}; const e = ec[co] || ec.DEFAULT;
    if (e) { try { audio.init(); audio.playDuendeAngry(e.NIVEL); } catch (x) {} screenShake(e.SACUDIDA_PX, e.MS); if (e.NIVEL >= 2) flashScreen('rgba(190,20,30,.35)', 450); }
  }

  triggerSequentialDialogue(
    "EL DUENDE",
    reactionText,
    "fa-hat-wizard",
    "Desesperación",
    "text-purple-300",
    null,
    () => processNextQueuedEvent()
  );
}

function openSpecialShopModal() {
  const shopGrid = document.getElementById('merchantItemsGrid') || document.getElementById('shopItemsList');
  if (!shopGrid) return;
  shopGrid.innerHTML = '';
  STATE.boughtInCurrentShop = false;
  specialShopOpen = true;
  // [CAMBIO] La mesa de reciclaje no aplica en esta tienda: se vacía para que no queden botones de una visita anterior
  const staleRecycle = document.getElementById('recycleList');
  if (staleRecycle) staleRecycle.innerHTML = '';

  const discountMult = getDiscountMultiplier();
  let catalog = [
    { id: 'pack_ganzuas', name: '+3 Ganzúas Básicas', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_ganzuas * discountMult), icon: 'fa-key', prop: 'picks', qty: 3 },
    { id: 'pack_pines', name: '+2 Pines de Acero', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_pines * discountMult), icon: 'fa-screwdriver', prop: 'proPicks', qty: 2, minLvl: 2 },
    { id: 'pack_usb', name: '+2 Llaves USB', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_usb * discountMult), icon: 'fa-microchip', prop: 'usb', qty: 2, minLvl: 3 },
    { id: 'pack_valvulas', name: '+2 Válvulas Hidráulicas', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_valvulas * discountMult), icon: 'fa-faucet', prop: 'valves', qty: 2, minLvl: 5 },
    { id: 'carta_auto_open', name: 'Carta Auto-Open', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.carta_auto_open * discountMult), icon: 'fa-wand-magic-sparkles', abilityProp: 'auto' },
    { id: 'carta_escudo', name: 'Carta Escudo Protector', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.carta_escudo * discountMult), icon: 'fa-shield-halved', abilityProp: 'shield' }
  ];

  const availableCatalog = catalog.filter(item => !item.minLvl || STATE.level >= item.minLvl);
  const offeredItems = [...availableCatalog].sort(() => 0.5 - Math.random()).slice(0, 2);

  const cfgS = shopCfg();
  const descS = cfgS.DESCRIPCIONES || {};
  offeredItems.forEach(item => {
    const vis = SHOP_VIS[item.id] || { n: item.name.toUpperCase(), ic: 'ic_ganzua' };
    const row = dshopRowEl({
      vis, desc: descS[item.id], own: 0,
      label: (cfgS.BOTONES || {}).COMPRAR || 'COMPRAR', price: dshopGoldPrice(item.cost), cls: 'w',
      poor: STATE.gold < item.cost,
      onPoor: () => dshopPoorReact(cfgS.FRASES_SIN_ORO),
      onClick: () => {
        STATE.gold -= item.cost;
        if (item.prop) STATE[item.prop] += item.qty;
        if (item.abilityProp) STATE.abilities[item.abilityProp]++;

        STATE.boughtInCurrentShop = true;
        STATE.traperoStrikes++;
        specialShopOpen = false;

        updateUI();
        const merchantModal = document.getElementById('merchantModal');
        if (merchantModal) merchantModal.classList.add('hidden');

        triggerSequentialDialogue(
          "EL DUENDE",
          DATOS_JUEGO.NARRATIVA.REACCIONES_DUENDE_NO_COMPRAR.COMPRA_EXITOSA,
          "fa-hat-wizard",
          "Codicia Satisfactoria",
          "text-purple-300",
          null,
          () => processNextQueuedEvent()
        );
      }
    });
    shopGrid.appendChild(row);
  });

  dshopShow(true);
}

/* ==========================================================================
   COLAPSO SENSORIAL Y SECUENCIA FINAL
   ========================================================================== */

/* [0.105] FONDO DE LA GALAXIA: lo que queda detrás del cristal cuando se rompe. UNA sola galaxia en espiral que gira despacio, con aberración cromática (cada punto con
   flecos azules y verdes desplazados) y una ondulación suave que deforma toda la imagen. */
let starfieldRaf = null;
function starfieldStart(r) {
  starfieldStop();
  const W = Math.round(r.width), H = Math.round(r.height);
  const cv = document.createElement('canvas');
  cv.id = 'starfieldBg'; cv.width = W; cv.height = H;
  cv.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${W}px;height:${H}px;z-index:19999;pointer-events:none;opacity:0;transition:opacity .35s ease`;
  document.body.appendChild(cv);
  requestAnimationFrame(() => { cv.style.opacity = '1'; });
  const g = cv.getContext('2d');
  const stars = Array.from({ length: Math.round(W * H / 2400) }, () => ({ x: Math.random() * W, y: Math.random() * H, s: Math.random() < .12 ? 2 : 1, p: Math.random() * 6.28, v: .8 + Math.random() * 2.2 }));
  const GX = W * .5, GY = H * .45, R = Math.min(W, H) * .5, TILT = .5;
  const pts = [];
  for (let i = 0; i < 1500; i++) {
    const arm = i % 2, t = Math.pow(Math.random(), .75) * 3.6, a = t * 2.1 + arm * Math.PI + (Math.random() - .5) * .55, rr = R * (t / 3.6) * (.9 + Math.random() * .2);
    pts.push({ a, r: rr, s: Math.random() < .08 ? 2 : 1, h: 200 + Math.random() * 90 });
  }
  const t0 = performance.now();
  const AMP = Math.max(3, Math.min(W, H) * .012);
  const warp = (x, y, t) => [x + Math.sin(y * .018 + t * 1.6) * AMP + Math.sin(y * .045 - t * 2.3) * AMP * .35, y + Math.cos(x * .016 + t * 1.3) * AMP * .8];
  const dot = (x, y, sz, t, ab, hue, alpha) => {
    const w = warp(x, y, t), px = w[0], py = w[1];
    g.globalAlpha = alpha * .8; g.fillStyle = 'rgb(40,110,255)'; g.fillRect(px - ab, py - ab * .5, sz, sz);          // fleco azul
    g.fillStyle = 'rgb(40,255,120)'; g.fillRect(px + ab, py + ab * .5, sz, sz);                                    // fleco verde
    g.globalAlpha = alpha; g.fillStyle = hue ? `hsl(${hue},45%,86%)` : '#ffffff'; g.fillRect(px, py, sz, sz);     // punto
  };
  const frame = now => {
    if (!document.getElementById('starfieldBg')) return;
    const t = (now - t0) / 1000;
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    g.fillStyle = '#02030a'; g.fillRect(0, 0, W, H);
    const neb = g.createRadialGradient(GX, GY, 0, GX, GY, Math.max(W, H) * .65); neb.addColorStop(0, 'rgba(70,40,120,.34)'); neb.addColorStop(1, 'rgba(2,3,10,0)');
    g.fillStyle = neb; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    stars.forEach(s => dot(s.x, s.y, s.s, t, 1.3, 0, .3 + .6 * Math.abs(Math.sin(s.p + t * s.v))));
    const core = g.createRadialGradient(GX, GY, 0, GX, GY, R * .24); core.addColorStop(0, 'rgba(255,240,215,.95)'); core.addColorStop(1, 'rgba(255,200,160,0)');
    g.globalAlpha = 1; g.fillStyle = core; g.fillRect(GX - R * .26, GY - R * .26, R * .52, R * .52);
    const rot = t * .09;
    pts.forEach(p => {
      const a = p.a + rot, x = GX + Math.cos(a) * p.r, y = GY + Math.sin(a) * p.r * TILT * 1.5 + Math.cos(a) * p.r * .12;
      dot(x, y, p.s, t, 1 + p.r / R * 2.2, p.h, .45 + .45 * (1 - p.r / R));
    });
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    starfieldRaf = requestAnimationFrame(frame);
  };
  starfieldRaf = requestAnimationFrame(frame);
}
function starfieldStop() { if (starfieldRaf) cancelAnimationFrame(starfieldRaf); starfieldRaf = null; const e = document.getElementById('starfieldBg'); if (e) e.remove(); }

/* [0.103] CRISTAL ROTO EN VIVO: al llegar al punto álgido del colapso, la pantalla real (el marco de juego) se agrieta desde el centro y se rompe en trozos que caen.
   Cada trozo es un clon del marco, recortado con clip-path (con el lienzo de la sala copiado). Mientras caen, el marco real se oculta y deja ver el negro. */
function glassShatterFx() {
  const fr = document.getElementById('gameFrame');
  if (!fr || document.getElementById('shatterRoot')) return;
  killSceneVeil();   // [0.104] sin telón azul marino: los trozos copian la sala real, con sus cofres e interfaz
  const r = fr.getBoundingClientRect(), W = r.width, H = r.height;
  const root = document.createElement('div');
  root.id = 'shatterRoot';
  root.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${W}px;height:${H}px;z-index:20000;pointer-events:none;overflow:visible`;
  // 1) puntos: centro de impacto + dos anillos (el segundo pasa de las esquinas) con ángulos y radios irregulares
  const cx = W * (0.42 + Math.random() * 0.16), cy = H * (0.4 + Math.random() * 0.14);
  const n = 11, diag = Math.hypot(W, H);
  const ang0 = Math.random() * Math.PI * 2, angs = [];
  for (let i = 0; i < n; i++) angs.push(ang0 + (i + (Math.random() - 0.5) * 0.55) * (Math.PI * 2 / n));
  const ring = (k, rmin, rmax) => angs.map(a => { const rr = diag * (rmin + Math.random() * (rmax - rmin)); return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; });
  const r1 = ring(1, 0.13, 0.24), r2 = ring(2, 0.9, 1.05);
  const shards = [];
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; shards.push([[cx, cy], r1[i], r1[j]]); shards.push([r1[i], r2[i], r2[j], r1[j]]); }
  // 2) grietas (se ven un instante antes de romper)
  let lines = '';
  shards.forEach(sh => { for (let k = 0; k < sh.length; k++) { const a = sh[k], b = sh[(k + 1) % sh.length]; lines += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`; } });
  const svg = document.createElement('div');
  svg.style.cssText = 'position:absolute;inset:0;overflow:hidden;z-index:2';
  svg.innerHTML = `<svg width="${W}" height="${H}" style="position:absolute;left:0;top:0"><g stroke="rgba(255,255,255,.85)" stroke-width="1.4" fill="none" style="filter:drop-shadow(0 0 3px #fff)">${lines}</g></svg><div style="position:absolute;inset:0;background:radial-gradient(circle at ${cx}px ${cy}px,rgba(255,255,255,.55),transparent 55%)"></div>`;
  root.appendChild(svg);
  // 3) un clon del marco por trozo
  const srcCanv = fr.querySelectorAll('canvas');
  const clone = () => {
    const c = fr.cloneNode(true);
    c.setAttribute('aria-hidden', 'true'); c.setAttribute('inert', '');
    c.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;margin:0;visibility:visible;pointer-events:none`;
    const dst = c.querySelectorAll('canvas');
    srcCanv.forEach((sc, i) => { const d = dst[i]; if (!d) return; try { d.width = sc.width; d.height = sc.height; d.getContext('2d').drawImage(sc, 0, 0); } catch (e) {} });
    return c;
  };
  const pieces = shards.map(sh => {
    const w = document.createElement('div');
    const mx = sh.reduce((a, p) => a + p[0], 0) / sh.length, my = sh.reduce((a, p) => a + p[1], 0) / sh.length;
    w.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:${mx}px ${my}px;clip-path:polygon(${sh.map(p => p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px').join(',')});will-change:transform`;
    w.appendChild(clone());
    root.appendChild(w);
    return { w, mx, my };
  });
  document.body.appendChild(root);
  try { audio.playGlassIrreal(); } catch (e) {}   // [0.105]
  // 4) tiempo de grietas y caída
  setTimeout(() => {
    svg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
    fr.style.visibility = 'hidden';   // [0.104] detrás de los trozos quedan estrellas y galaxias
    starfieldStart(r);
    pieces.forEach(({ w, mx, my }) => {
      const out = Math.hypot(mx - cx, my - cy) || 1;
      const dx = (mx - cx) / out * (40 + Math.random() * 90), dy = H * (0.9 + Math.random() * 0.5), rot = (Math.random() - 0.5) * 80;
      try { w.animate([{ transform: 'translate(0,0) rotate(0deg)' }, { transform: `translate(${dx * 0.3}px,${dy * 0.08}px) rotate(${rot * 0.15}deg)`, offset: .18 }, { transform: `translate(${dx}px,${dy}px) rotate(${rot}deg)` }],
        { duration: 1100 + Math.random() * 700, delay: Math.random() * 260, easing: 'cubic-bezier(.5,0,.9,.55)', fill: 'forwards' }); } catch (e) {}
    });
    setTimeout(() => root.remove(), 2400);
  }, 380);
}
function glassShatterRestore() { const fr = document.getElementById('gameFrame'); if (fr) fr.style.visibility = ''; const r = document.getElementById('shatterRoot'); if (r) r.remove(); starfieldStop(); }

function triggerSensoryOverloadCollapse() {
  stopMinigameTimer();
  killSceneVeil();   // [0.104]
  const modals = ['merchantModal', 'traperoModal', 'minigameModal', 'dialogueModal', 'lootModal', 'persistentFeedbackBanner', 'duendeReceiptModal'];
  modals.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'duendeReceiptModal') el.remove();
      else el.classList.add('hidden');
    }
  });

  const appBody = document.getElementById('appBody') || document.body;
  appBody.classList.add('shake-screen');

  let bursts = 0;
  const overloadInterval = setInterval(() => {
    bursts++;
    if (typeof audio !== 'undefined' && audio.playUnlockFanfare) audio.playUnlockFanfare('legendario');
    
    if (typeof spawnParticles === 'function') {
      const cx = Math.random() * window.innerWidth;
      const cy = Math.random() * window.innerHeight;
      spawnParticles(cx, cy, bursts % 2 === 0 ? '#c084fc' : '#f43f5e', 50, true);
    }

    if (bursts === 13) { try { glassShatterFx(); } catch (e) { glassShatterRestore(); } }   // [0.103] a mitad del colapso, la pantalla se rompe como un cristal
    if (bursts >= 35) {
      clearInterval(overloadInterval);
      appBody.classList.remove('shake-screen');
      executeDiffuseEchoTransition();
    }
  }, 100);
}

function executeDiffuseEchoTransition() {
  if (typeof audio !== 'undefined' && audio.ctx) audio.ctx.suspend();

  let overlay = document.getElementById('diffuseEchoOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'diffuseEchoOverlay';
    overlay.className = 'fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center p-8 transition-opacity duration-1000 opacity-0 pointer-events-none text-center';
    uiHost().appendChild(overlay);
  }
  overlay.style.visibility = 'visible';   // [0.103] el marco puede estar oculto por el cristal roto; el aviso final sí se ve

  const ecos = DATOS_JUEGO.NARRATIVA.ECOS_FINALES;

  setTimeout(() => {
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');
    const sf = document.getElementById('starfieldBg');   // [0.104] las estrellas se funden a negro a la vez que entra el fundido con las dos frases
    if (sf) { sf.style.transition = 'opacity 1s ease'; sf.style.opacity = '0'; }
  }, 100);

  setTimeout(() => {
    overlay.innerHTML = `
      <div id="echoMsg1" class="text-2xl sm:text-4xl font-mono font-bold tracking-widest text-[#c084fc] blur-[0.6px] drop-shadow-[0_0_15px_rgba(192,132,252,0.6)] transition-opacity duration-700 opacity-0 select-none">
        ${ecos.MENSAJE_1}
      </div>
    `;
    const msg1 = document.getElementById('echoMsg1');
    setTimeout(() => { if (msg1) msg1.classList.remove('opacity-0'); }, 50);

    setTimeout(() => {
      if (msg1) msg1.classList.add('opacity-0');

      setTimeout(() => {
        overlay.innerHTML = `
          <div id="echoMsg2" class="text-2xl sm:text-4xl font-mono font-bold tracking-widest text-[#f43f5e] blur-[0.6px] drop-shadow-[0_0_15px_rgba(244,63,94,0.6)] transition-opacity duration-700 opacity-0 select-none">
            ${ecos.MENSAJE_2}
          </div>
        `;
        const msg2 = document.getElementById('echoMsg2');
        setTimeout(() => { if (msg2) msg2.classList.remove('opacity-0'); }, 50);

        setTimeout(() => {
          if (msg2) msg2.classList.add('opacity-0');
          overlay.classList.add('opacity-0');

          setTimeout(() => {
            overlay.remove();
            if (typeof audio !== 'undefined' && audio.ctx) audio.ctx.resume();
            
            // 🟢 TRANSICIÓN AL BUCLE 2
            STATE.currentLoop = 2;
            glassShatterRestore();   // [0.103] el marco vuelve a verse
            resetGame(true);
            // [0.084] Sin ningún aviso sobre el bucle: el jugador lo deduce por lo que ve y por las pistas de tenderos y post-its
          }, 1000);
        }, 2000);

      }, 600);
    }, 2000);

  }, 1000);
}

function triggerDuendeNarrativeVisit() {
  const tier = getNarrativeTier();
  const phrases = DATOS_JUEGO.NARRATIVA.DUENDE_FRASES[tier];
  const speech = phrases[Math.floor(Math.random() * phrases.length)];

  const smallGifts = [
    { prop: 'picks', name: '+1 Ganzúa Básica', icon: 'fa-key' },
    { prop: 'proPicks', name: '+1 Pin de Acero', icon: 'fa-screwdriver' },
    { prop: 'usb', name: '+1 Llave USB', icon: 'fa-microchip' },
    { prop: 'valves', name: '+1 Válvula Hidráulica', icon: 'fa-faucet' }
  ];

  const gift = smallGifts[Math.floor(Math.random() * smallGifts.length)];
  STATE[gift.prop]++;

  triggerSequentialDialogue("EL DUENDE", speech, "fa-hat-wizard", "Encuentro Casual", "text-purple-300", gift, () => {
    updateUI();
    processNextQueuedEvent();
  });
}

/* [0.089b] En pantallas táctiles, tocar una carta abre primero una pantalla con su descripción y los botones USAR / VOLVER
   (en PC se mantiene el clic directo + tooltip). Se intercepta en fase de captura, antes de los manejadores de cada carta. */
(function () {
  const ids = { abilityAutoBtn: 'auto', ability2xBtn: 'double', abilityShieldBtn: 'shield', abilityRiskBtn: 'riskPot', abilityPerdedorBtn: 'perdedor', abilitySummonDuendeBtn: 'summonDuende', abilityCofradiaBtn: 'cofradia' };
  const NOMBRES = { auto: 'AUTO', double: '2X', shield: 'ESCUDO', riskPot: 'APUESTA', perdedor: 'PERDEDOR', summonDuende: 'DUENDE', cofradia: 'COFRADÍA DEL COFRE' };
  let bypass = false;
  document.addEventListener('click', (e) => {
    const cfg = DATOS_JUEGO.CARTAS_PANTALLA_PREVIA || {};
    if (!cfg.ACTIVAR || bypass) return;
    const btn = e.target.closest && e.target.closest(Object.keys(ids).map(i => '#' + i).join(','));
    if (!btn || btn.disabled) return;
    const isTouch = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    if (cfg.SOLO_TACTIL && !isTouch) return;
    e.stopImmediatePropagation(); e.preventDefault();
    if (document.getElementById('cardPreModal')) return;
    const key = ids[btn.id];
    const m = document.createElement('div');
    m.id = 'cardPreModal';
    m.className = 'fixed inset-0 z-[9990] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-5 font-sans';
    m.innerHTML = `
      <div class="bg-slate-900 border-2 border-amber-500/70 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center gap-3">
        <h3 class="text-xl font-black text-amber-300 font-retro">CARTA ${NOMBRES[key]}</h3>
        <p class="text-sm font-mono text-slate-200 leading-relaxed">${((DATOS_JUEGO.TEXTOS_AYUDA.cartas || {})[key]) || ''}</p>
        <button id="cardPreUse" class="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm rounded-xl shadow-lg cursor-pointer">USAR</button>
        <button id="cardPreBack" class="w-full py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">VOLVER</button>
      </div>`;
    (uiHost() || document.body).appendChild(m);
    m.querySelector('#cardPreBack').addEventListener('click', () => m.remove());
    m.querySelector('#cardPreUse').addEventListener('click', () => { m.remove(); bypass = true; try { btn.click(); } finally { bypass = false; } });
  }, true);
})();

/* HABILIDADES TÁCTICAS */
const btnAuto = document.getElementById('abilityAutoBtn');
if (btnAuto) {
  btnAuto.addEventListener('click', () => {
    if (STATE.abilities.auto > 0) {
      STATE.abilities.auto--;
      stopMinigameTimer();
      const minigameModal = document.getElementById('minigameModal');
      if (minigameModal) minigameModal.classList.add('hidden');
      audio.playUnlockFanfare('epico');
      
      const active = STATE.screenChests[STATE.activeChestIdx];
      const reqCount = getRequiredToolCount(active.rarity);
      if (active.type.consumible !== 'picks' && !puzzleToolPaid) {   // [0.090] si ya se pagó al entrar, no se cobra otra vez
        STATE[active.type.consumible] = Math.max(0, STATE[active.type.consumible] - reqCount);
      }
      puzzleToolPaid = null; puzzleStat = null;   // [0.090] la carta AUTO no cuenta como puzle superado

      triggerLootExplosion();
      updateUI();
    }
  });
}

const btn2x = document.getElementById('ability2xBtn');
if (btn2x) {
  btn2x.addEventListener('click', () => {
    if (STATE.abilities.double > 0 && !STATE.active2XMultiplier) {
      STATE.abilities.double--;
      STATE.active2XMultiplier = true;
      audio.playClick(0.8);
      updateUI();
      showPersistentFeedback("⚡ ¡Doble Recompensa 2X activada!");
    }
  });
}

const btnShield = document.getElementById('abilityShieldBtn');
if (btnShield) {
  btnShield.addEventListener('click', () => {
    if (STATE.abilities.shield > 0 && !STATE.activeShield) {
      STATE.abilities.shield--;
      STATE.activeShield = true;
      audio.playClick(0.8);
      updateUI();
      showPersistentFeedback("🛡️ ¡ESCUDO activado!");
    }
  });
}

const btnRisk = document.getElementById('abilityRiskBtn');
if (btnRisk) {
  btnRisk.addEventListener('click', () => {
    if (STATE.abilities.riskPot > 0 && !STATE.riskModeActive) {
      STATE.abilities.riskPot--;
      STATE.riskModeActive = true;
      STATE.riskPot = 0;
      audio.playClick(0.8);
      updateUI();
      showPersistentFeedback("🎲 ¡Modo Apuesta Doble o Nada activado!");
    }
  });
}

const claimRiskBtn = document.getElementById('claimRiskPotBtn');
if (claimRiskBtn) {
  claimRiskBtn.addEventListener('click', () => {
    if (STATE.riskModeActive && STATE.riskPot > 0) {
      audio.init(); audio.playCashRegister();   // [0.089]
      STATE.gold += STATE.riskPot;
      showPersistentFeedback(`💰 ¡Has cobrado el Bote de Riesgo de ${STATE.riskPot} GP!`);
      STATE.riskPot = 0;
      STATE.riskModeActive = false;
      rechargeUsed('riskPot');   // [0.105]
      updateUI();
    }
  });
}

const btnPerdedor = document.getElementById('abilityPerdedorBtn');
if (btnPerdedor) {
  btnPerdedor.addEventListener('click', () => {
    if (STATE.abilities.perdedor > 0 && !STATE.perdedorActive) {
      STATE.perdedorActive = true;
      STATE.fallosConsecutivos = 0;
      audio.playClick(0.8);
      updateUI();
      showPersistentFeedback("💀 Carta PERDEDOR equipada: tras 5 fallos (seguidos o no), el botín del siguiente cofre será Legendario x2.");
    }
  });
}

const btnSummon = document.getElementById('abilitySummonDuendeBtn');
if (btnSummon) {
  btnSummon.addEventListener('click', () => {
    if (STATE.abilities.summonDuende > 0) {
      STATE.abilities.summonDuende--;
      audio.playClick(0.9);
      updateUI();
      triggerMerchantShopModalSequence();
    }
  });
}

/* ==========================================================================
   [0.104] CARTA COFRADÍA DEL COFRE
   Sustituye los cofres de la pantalla por 10 cofres aleatorios (cualquier rareza, con las probabilidades del último escalón).
   Se presenta barajando y abriendo en abanico sobre la habitación vacía (sin cofre ni interfaz, conservando el ambiente). Tocar una carta la amplía; ELEGIR la confirma.
   El cofre elegido aparece en la sala con el destello del reroll y NO se abre solo. Consumible de un solo uso; no disponible en la secuencia final.
   ========================================================================== */
function cofradiaRoll() {
  const types = DATOS_JUEGO.COFRES.ESTANDAR.filter(t => STATE.level >= t.minNivel);
  const tier = DATOS_JUEGO.PROBABILIDADES.RAREZAS_COFRES_POR_NIVEL[4];
  const out = [];
  for (let i = 0; i < 10; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const roll = Math.random();
    let rarity = CHEST_RARITIES[0];
    if (roll < tier.legendario) rarity = CHEST_RARITIES[3];
    else if (roll < tier.legendario + tier.epico) rarity = CHEST_RARITIES[2];
    else if (roll < tier.legendario + tier.epico + tier.raro) rarity = CHEST_RARITIES[1];
    out.push({ type, rarity: chestToolMods(rarity), fog: false });
  }
  return out;
}
let cofradiaBusy = false;
function cofradiaStart() {
  if (cofradiaBusy || document.getElementById('cofradiaModal')) return;
  if ((STATE.abilities.cofradia || 0) <= 0) return;
  if (isClimaxActive()) { showPersistentFeedback('🃏 La Cofradía ya no responde...'); return; }
  if (minigameInProgress || isLootProcessing || !mainScreenFree()) return;
  cofradiaBusy = true;
  STATE.abilities.cofradia--;
  audio.init(); audio.playClick(0.9);
  const picks = cofradiaRoll();
  const host = uiHost();
  const fr = document.getElementById('gameFrame'); if (fr) fr.classList.add('cofradia-on');
  cofradiaOpen = true;   // la sala se queda vacía (el cofre se desvanece) y la interfaz se oculta
  updateUI();
  const m = document.createElement('div');
  m.id = 'cofradiaModal';
  m.innerHTML = `<div class="cf-title">COFRADÍA DEL COFRE</div><div class="cf-sub" id="cfSub">Barajando...</div><div class="cf-fan" id="cfFan"></div>
    <div class="cf-prev hidden" id="cfPrev"><div class="cf-prev-card" id="cfPrevCard"></div><div class="cf-prev-btns"><button id="cfPick" type="button">ELEGIR</button><button id="cfBack" type="button">VOLVER</button></div></div>`;
  host.appendChild(m);
  const fan = m.querySelector('#cfFan'), prev = m.querySelector('#cfPrev'), prevCard = m.querySelector('#cfPrevCard'), sub = m.querySelector('#cfSub');
  const W = fan.clientWidth || 360;
  const bigScr = !document.documentElement.classList.contains('narrow-layout');
  const cw = Math.min(bigScr ? 104 : 74, Math.round(W * (bigScr ? 0.23 : 0.19))), step = Math.min(bigScr ? 48 : 34, (W - cw - 12) / 9);   // [0.105] cartas más grandes en PC
  const cardHtml = c => {
    const src = (ART_ON && ASSETS.cofres[c.type.id]) ? chestSpriteSrc(c.type, c.rarity) : '';
    return `<div class="cf-face cf-front" style="border-color:${c.rarity.color}"><span class="cf-rar" style="color:${c.rarity.color}">${c.rarity.name}</span>${src ? `<img src="${src}" alt="">` : '<i class="fa-solid fa-box"></i>'}<span class="cf-typ">${c.type.nombre}</span></div><div class="cf-face cf-back"><i class="fa-solid fa-boxes-stacked"></i></div>`;
  };
  const cards = picks.map((c, i) => {
    const el = document.createElement('div');
    el.className = 'cf-card';
    el.style.cssText = `width:${cw}px;height:${Math.round(cw * 1.4)}px;left:${W / 2 - cw / 2}px;`;
    el.innerHTML = `<div class="cf-in">${cardHtml(c)}</div>`;
    fan.appendChild(el);
    el.style.transform = `translate(0px, 0px) rotate(${(Math.random() * 8 - 4).toFixed(1)}deg)`;
    return el;
  });
  // 1) baraja: las cartas se reparten a izquierda y derecha varias veces
  const shuffleMs = 1000;
  cards.forEach((el, i) => {
    const dir = i % 2 ? 1 : -1;
    try { el.animate([{ transform: el.style.transform }, { transform: `translate(${dir * 46}px, ${-6 * (i % 3)}px) rotate(${dir * 9}deg)` }, { transform: `translate(${-dir * 30}px, 0px) rotate(${-dir * 6}deg)` }, { transform: `translate(${dir * 38}px, ${4 * (i % 3)}px) rotate(${dir * 7}deg)` }, { transform: 'translate(0px, 0px) rotate(0deg)' }], { duration: shuffleMs, delay: i * 14, easing: 'ease-in-out' }); } catch (e) {}
  });
  [0, 280, 560].forEach(t => setTimeout(() => { try { audio.playSwoosh(); } catch (e) {} }, t));
  // 2) abanico
  setTimeout(() => {
    sub.textContent = 'Toca un cofre para verlo';
    cards.forEach((el, i) => {
      const k = i - 4.5, x = k * step, y = Math.pow(Math.abs(k) / 4.5, 2) * 28, rot = k * 4.6;
      setTimeout(() => {
        el.style.transition = 'transform .5s cubic-bezier(.2,1.3,.4,1)';
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        el.classList.add('flip');
        el.dataset.k = String(i);
        if (i % 3 === 0) { try { audio.playCardRise(); } catch (e) {} }
      }, i * 55);
    });
    setTimeout(() => cards.forEach((el, i) => { el.classList.add('ready'); el.addEventListener('click', () => openPrev(i)); }), 10 * 55 + 520);
  }, shuffleMs + 120);
  let sel = -1;
  function openPrev(i) {
    sel = i; try { audio.playClick(0.6); } catch (e) {}
    prevCard.innerHTML = `<div class="cf-big">${cardHtml(picks[i]).replace('cf-face cf-front', 'cf-face cf-front show').replace('<div class="cf-face cf-back"><i class="fa-solid fa-boxes-stacked"></i></div>', '')}</div>`;
    prev.classList.remove('hidden');
    cards.forEach((el, k) => el.classList.toggle('sel', k === i));
  }
  m.querySelector('#cfBack').addEventListener('click', () => { sel = -1; prev.classList.add('hidden'); cards.forEach(el => el.classList.remove('sel')); try { audio.playClick(0.5); } catch (e) {} });
  m.querySelector('#cfPick').addEventListener('click', () => {
    if (sel < 0) return;
    const chosen = picks[sel];
    try { audio.playUnlockFanfare(chosen.rarity.id); } catch (e) {}
    m.style.transition = 'opacity .35s ease'; m.style.opacity = '0';
    setTimeout(() => {
      m.remove();
      cofradiaOpen = false;
      const f2 = document.getElementById('gameFrame'); if (f2) f2.classList.remove('cofradia-on');
      updateChestSelectionUI();   // [0.105] al volver se ve el cofre ANTERIOR; el elegido aparece dentro del destello
      chestMutateFxNow(() => { STATE.screenChests = [chosen]; STATE.activeChestIdx = 0; updateChestSelectionUI(); updateUI(); });   // mismo destello que el reroll; el cofre NO se abre solo
      cofradiaBusy = false;
      updateUI();
    }, 380);
  });
}
const btnCofradia = document.getElementById('abilityCofradiaBtn');
if (btnCofradia) btnCofradia.addEventListener('click', () => cofradiaStart());

let globalPuzzleTimerInterval = null;
let globalPuzzleTimeLeft = 10;
let currentPuzzleConsumable = 'picks';
let TEST_SERIES = { active: false };   // [0.090] Modo test: puzles en serie
let puzzleToolPaid = null;   // [0.090] herramienta avanzada pagada al entrar al puzle en curso

// [0.103] Reloj grande e independiente (#bigTimer). Rojo en los últimos 5 s; "SIN TIEMPO" en los puzles sin reloj
function paintBigTimer(seconds) {
  const box = document.getElementById('bigTimer'); const dig = document.getElementById('bigTimerDigits');
  if (!box || !dig) return;
  const lab = box.querySelector('.lab');
  if (seconds === null) {
    dig.textContent = '∞'; if (lab) lab.textContent = 'SIN TIEMPO';
    box.classList.remove('low'); box.classList.add('notime');
    return;
  }
  const s = Math.max(0, seconds);
  dig.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  if (lab) lab.textContent = 'TIEMPO';
  box.classList.remove('notime');
  box.classList.toggle('low', s <= 5);
}

function startMinigameTimer(seconds, consumableName) {
  stopMinigameTimer();
  // [CAMBIO] Se fija ANTES del return para los puzles sin tiempo (hack no legendario); si no, la X cobraba la herramienta equivocada
  currentPuzzleConsumable = consumableName;

  if (seconds === null) {
    paintBigTimer(null);
    return;
  }

  let adjustedSeconds = seconds + STATE.perks.extraTime;
  if (modOn('relojBueno')) adjustedSeconds = Math.round(adjustedSeconds * DATOS_JUEGO.MODS_WILDCARD.RELOJ_BUENO.TIEMPO_MULT);   // [0.093]
  if (modOn('relojMalo')) adjustedSeconds = Math.max(5, Math.round(adjustedSeconds * DATOS_JUEGO.MODS_WILDCARD.RELOJ_MALO.TIEMPO_MULT));
  globalPuzzleTimeLeft = adjustedSeconds;
  currentPuzzleConsumable = consumableName;
  paintBigTimer(globalPuzzleTimeLeft);

  globalPuzzleTimerInterval = setInterval(() => {
    if (typeof rotateBlocked !== 'undefined' && rotateBlocked) return;   // [0.088] pausa mientras se pide girar el móvil
    globalPuzzleTimeLeft--;
    paintBigTimer(globalPuzzleTimeLeft);
    // [0.103] Pitido por segundo en los últimos 5 s, cada vez más agudo (Variante D "Latido")
    const ca = DATOS_JUEGO.CUENTA_ATRAS;
    if (ca && ca.ACTIVAR && globalPuzzleTimeLeft > 0 && globalPuzzleTimeLeft <= ca.SEGUNDOS) {
      audio.playCountdownBeep(ca.SEGUNDOS - globalPuzzleTimeLeft);
    }

    if (globalPuzzleTimeLeft <= 0) {
      audio.playBreak();
      hideAllMinigameUI();
      showPersistentFeedback("⏱️ ¡TIEMPO AGOTADO! Fallo en el puzle.");
      if (isTrapLockpickActive()) showPersistentFeedback(DATOS_JUEGO.MINIJUEGOS.LOCKPICK.MENSAJES_TRAMPA.TIEMPO, 'trampa');
      handleFailure(currentPuzzleConsumable);
    }
  }, 1000);
}

function stopMinigameTimer() {
  if (globalPuzzleTimerInterval) {
    clearInterval(globalPuzzleTimerInterval);
    globalPuzzleTimerInterval = null;
  }
}

function handleFailure(toolName = 'picks', reasonText = "Fallo en el puzle.") {
  if (TEST_SERIES.active) { testPuzzleResult(false); return; }   // [0.090] Modo test: no se gasta nada, pasa al siguiente puzle
  humHoldChest = null;   // [0.091] tras fallar, el cofre sigue ahí y el zumbido puede volver
  if (puzzleStat) { statsPuzzle(puzzleStat, false); puzzleStat = null; }   // [0.090]
  minigameInProgress = false;
  stopMinigameTimer();
  if (modOn('congelada')) { const left = useMod('congelada'); showPersistentFeedback(`🧊 Racha Congelada: tu racha sobrevive al fallo.${left > 0 ? ' Te quedan ' + left + (left === 1 ? ' uso.' : ' usos.') : ' Era el último uso.'}`); } else STATE.cleanStreak = 0;   // [0.093][0.096] gasta un uso
  const active = STATE.screenChests[STATE.activeChestIdx];
  const reqCount = getRequiredToolCount(active.rarity);

  if (STATE.riskModeActive && !STATE.activeShield) {   // [0.087b] el escudo también protege el bote de la Apuesta
    STATE.riskPot = 0;
    STATE.riskModeActive = false;
    rechargeUsed('riskPot');   // [0.105]
    // [0.082] El oro solo cae a 30 si el jugador tenía más de 30; si tenía menos, no se toca
    if (STATE.gold > 30) {
      STATE.gold = 30;
      showPersistentFeedback("💥 ¡Has fallado en Modo Apuesta! Has perdido todo el Bote y tu oro cae a 30 GP.");
    } else {
      showPersistentFeedback("💥 ¡Has fallado en Modo Apuesta! Has perdido todo el Bote.");
    }
  }

  if (STATE.perdedorActive) {
    STATE.fallosConsecutivos++;
    if (STATE.fallosConsecutivos >= 5) {
      STATE.perdedorActive = false;
      STATE.abilities.perdedor = Math.max(0, STATE.abilities.perdedor - 1);
      STATE.fallosConsecutivos = 0;
      audio.playUnlockFanfare('legendario');
      
      // [0.085] El cofre no cambia: solo su botín (XP y GP) pasará a ser legendario x2 al abrir el siguiente con éxito
      STATE.perdedorLootPending = true;
      showPersistentFeedback("💀 ¡5 Fallos completados! El botín (GP y XP) de tu siguiente cofre abierto será LEGENDARIO x2.");
    } else {
      showPersistentFeedback(`💀 Fallo registrado (${STATE.fallosConsecutivos}/5) para la carta PERDEDOR.`);
    }
  }

  if (modOn('seda')) {   // [0.093][0.096] Manos de Seda (antes que el Escudo, para no gastar la carta): el fallo no cuesta herramientas y gasta UN uso
    const left = useMod('seda');
    showPersistentFeedback(`🧤 Manos de Seda: el fallo no te ha costado ninguna herramienta.${left > 0 ? ' Te quedan ' + left + (left === 1 ? ' uso.' : ' usos.') : ' Era el último uso.'}`);
    if (puzzleToolPaid) { STATE[puzzleToolPaid.prop] += puzzleToolPaid.n; puzzleToolPaid = null; }
    updateUI();
    return;
  }

  if (STATE.activeShield) {
    STATE.activeShield = false;
    rechargeUsed('shield');   // [0.105]
    showPersistentFeedback(STATE.riskModeActive ? "🛡️ ¡Tu ESCUDO te ha salvado! Herramientas y Bote de Riesgo intactos." : "🛡️ ¡Tu ESCUDO te ha salvado! Herramientas intactas.");
    if (puzzleToolPaid) { STATE[puzzleToolPaid.prop] += puzzleToolPaid.n; puzzleToolPaid = null; }   // [0.090] el Escudo devuelve la herramienta pagada al entrar
    updateUI();
    return;
  }

  // [0.090] Si la herramienta ya se pagó al entrar, no se descuenta de nuevo
  if (puzzleToolPaid && puzzleToolPaid.prop === toolName) puzzleToolPaid = null;
  else STATE[toolName] = Math.max(0, STATE[toolName] - reqCount);
  if (toolName === 'picks') statsAdd('picksBroken', reqCount);   // [0.090]
  updateUI();
  
  if (!checkCanOpenAnyChestOnScreen()) {
    checkGameOver();
  }
}

function checkCanOpenAnyChestOnScreen() {
  if (STATE.abilities.auto > 0 || isClimaxActive()) return true;

  return STATE.screenChests.some(chest => {
    const req = getRequiredToolCount(chest.rarity);
    return STATE[chest.type.consumible] >= req;
  });
}

// [0.090] Secuencia de Game Over / Trato Injusto: (1) golpe con letras pixel art sangrientas, (2) diálogo del Trapero, (3) ventana del trato
let gameOverSeq = false;
const PIXEL_FONT = {
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001']
};
function whenBannerClosed(cb) {
  const tick = () => {
    const b = document.getElementById('persistentFeedbackBanner');
    if ((b && !b.classList.contains('hidden')) || modalVisible('dialogueModal') || modalVisible('lootModal')) setTimeout(tick, 200);
    else cb();
  };
  tick();
}
const GAME_OVER_GLYPHS = {   // [0.092] letras serifadas 11x15 ('1' = relleno, 'c' = grieta, '.' = vacío), con mellas en los bordes
  G: ["...111111..", "..1111111..", ".11c..111..", ".111...11..", "111.....11.", "11c........", ".1c........", ".c1...11111", "c11...11111", "111....111.", "111....111.", ".111...111.", ".111..1111.", "..11111111.", "...1111.11."],
  A: ["....111....", "....111....", "....111....", "....1111...", "...11111...", "...1c.11...", "...c..11...", "...c..c11..", "..1111c11..", "..111c111..", "..1....11..", "..1....111.", ".11....111.", "1111..11111", "1111..11111"],
  M: ["1111...1111", "1111...1111", ".111...111.", ".1111.11c1.", ".1111.11c1.", ".1111.1c1c.", ".1111.1c1c.", ".1.11.1.cc.", ".1.1111.11.", ".1.1111.11.", ".1..111.11.", ".1..11..11.", ".1..11..11.", "111.11.1111", "111.11.1111"],
  E: ["111111111..", "1111111111.", ".111...c11.", ".111....11.", ".111..1c.1.", ".111..1....", ".111111....", ".111111....", ".11c..1....", ".11c..11..1", ".111.....11", ".111....11.", ".111...111.", "1111111111.", "1111111111."],
  O: ["...11111...", "..1111111..", ".1111.1111.", ".111...111.", "111.....111", "11c.....11.", "11c.....111", "1cc.....111", "11c.....111", "111.....111", "111.....111", ".111...111.", ".1111.1111.", "..1111111..", "...11111..."],
  V: ["11111..1111", "11111..1111", ".111....11.", "..11....11.", "..111...1..", "..111..1c..", "..111..1c..", "...11..11..", "...c1..1...", "...c1111...", "...1c111...", "....c11....", "....111....", "....111....", "....111...."],
  R: ["11111111...", "111111111..", ".111..1111.", ".111...c11.", ".111...1c1.", ".11c...1c1.", ".11c11111..", ".11c11111..", ".11c1111...", ".1c1.111...", ".111.1111..", ".111..111..", ".111..1111.", "11111..1111", "11111..1111"]
};
function runGameOverStrike(done) {
  // [0.092] Letras serifadas de rejilla fina (11x15) con mellas y grietas, volumen rojo con borde negro, que CAEN y rebotan;
  // después gotea sangre de forma natural: anchos de 1-2 px, velocidades y aceleraciones distintas, bifurcaciones, gotas sueltas y grietas que supuran.
  const cfg = (DATOS_JUEGO.GAME_OVER || {}).GOLPE || {};
  const host = uiHost();
  document.querySelectorAll('#gameOverStrike').forEach(e => e.remove());   // [0.096] nunca dos capas a la vez
  const ov = document.createElement('div');
  ov.id = 'gameOverStrike';
  ov.style.cssText = 'position:absolute;inset:0;z-index:10030;background:rgba(0,0,0,.88);pointer-events:auto;opacity:0;transition:opacity .12s ease-out';
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;image-rendering:pixelated';
  ov.appendChild(cv); host.appendChild(ov);
  const W = host.clientWidth || 390, H = host.clientHeight || 700;
  cv.width = W; cv.height = H;
  const c2 = cv.getContext('2d');
  const GW = 11, GH = 15, uW = 4 * (GW + 1) - 1, wordH = GH + 11;
  const sc = Math.max(3, Math.floor((W * 0.84) / uW));
  const dp = Math.max(2, Math.round(sc / 3));            // píxel fino de las gotas
  const ox = Math.round((W - uW * sc) / 2), oy = Math.round(H * 0.30);
  const fallMs = cfg.CAIDA_MS || 320, stagger = cfg.ESCALONADO_MS || 90, wordGap = cfg.PAUSA_PALABRAS_MS || 170;
  const ROW_COL = ['#ff6a5c', '#ff4a42', '#ef2f33', '#d6142c', '#c30f26', '#b00d22', '#9c0a1e', '#8a0818', '#780614', '#6a0012'];
  const rcol = y => ROW_COL[Math.min(ROW_COL.length - 1, Math.floor(y * ROW_COL.length / GH))];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const letters = [];
  ['GAME', 'OVER'].forEach((word, li) => {
    word.split('').forEach((ch, ci) => {
      const g = GAME_OVER_GLYPHS[ch], set = new Set(), px = [], crack = new Set(), bottoms = {};
      g.forEach((row, ry) => row.split('').forEach((v, rx) => {
        if (v === '.') return;
        set.add(rx + ',' + ry); px.push([rx, ry]); if (v === 'c') crack.add(rx + ',' + ry);
        bottoms[rx] = Math.max(bottoms[rx] === undefined ? -1 : bottoms[rx], ry);
      }));
      const drips = [];
      Object.keys(bottoms).forEach(k => {
        const x = +k;
        if (Math.random() > 0.42) return;
        const big = Math.random() < 0.28, len = rnd(14, 120) * (big ? 1.2 : 1);
        drips.push({
          x: (x + rnd(0.2, 0.55)) * sc, y0: (bottoms[x] + 1) * sc, w: big ? 2 : 1, len,
          v: rnd(14, 55), a: rnd(20, 90), delay: rnd(0, 0.9),
          branch: len > 50 && Math.random() < 0.6 ? { at: rnd(0.35, 0.7), dir: Math.random() < 0.5 ? -1 : 1, len: rnd(0.25, 0.5) * len } : null,
          drop: Math.random() < 0.45 ? { gap: rnd(8, 18), fall: rnd(10, 30) } : null,
          over: false
        });
      });
      // grietas que supuran: una gota sobre la cara de la letra
      const cl = [...crack].map(k => k.split(',').map(Number)).sort((p, q) => q[1] - p[1]);
      if (cl.length && Math.random() < 0.8) {
        const [cx, cy] = cl[0];
        drips.push({ x: (cx + 0.35) * sc, y0: (cy + 1) * sc, w: 1, len: rnd(10, 28), v: rnd(10, 30), a: rnd(10, 40), delay: rnd(0.4, 1.1), branch: null, drop: null, over: true });
      }
      const start = li * (3 * stagger + fallMs * 0.25 + wordGap) + ci * stagger;
      letters.push({ px, set, crack, drips, x0: ci * (GW + 1), y0: li * wordH, start, land: start + fallMs, dist: oy + (li * wordH + GH) * sc });
    });
  });
  const lastLand = letters[letters.length - 1].land, midLand = letters[3].land;
  const total = cfg.DURACION_MS || 3000;
  ov.style.opacity = '0';
  requestAnimationFrame(() => { ov.style.opacity = '1'; });
  audio.init();
  // [0.096] Reloj virtual: avanza con tope por fotograma (un tirón o una tasa de refresco variable no se salta letras ni duplica efectos)
  let fxMid = false, fxLast = false, finished = false, vt = 0, lastNow = performance.now();
  const finish = () => { if (finished) return; finished = true; ov.remove(); done(); };
  setTimeout(finish, total * 4 + 2000);   // red de seguridad (pestaña en segundo plano)
  const fr = v => Math.round(v);
  function drawDrip(L, d, tau, X0, Y0) {
    // longitud actual: aceleración suave hasta el máximo
    const h = Math.min(d.len, d.v * tau + 0.5 * d.a * tau * tau);
    if (h <= 0) return;
    const w = d.w * dp, xx = fr(X0 + d.x), yy = fr(Y0 + d.y0 - sc * 0.4), done = h >= d.len;
    const body = (x, y, ww, hh) => { c2.fillStyle = '#9c0018'; c2.fillRect(x, y, ww, hh); c2.fillStyle = '#d83a46'; c2.fillRect(x, y, Math.max(1, Math.floor(dp / 2)), hh); };
    // contorno negro
    c2.fillStyle = '#000';
    c2.fillRect(xx - 1, yy - 1, w + 2, fr(h) + 2);
    const bulb = (done ? 1.8 : 1.5) * dp;
    c2.beginPath(); c2.arc(xx + w / 2, yy + h, bulb / 2 + 1.5, 0, 6.3); c2.fill();
    // cuerpo (se afina hacia el final si es ancho)
    if (d.w === 2) { body(xx, yy, w, fr(h * 0.6)); body(xx + Math.floor(dp / 2), yy + fr(h * 0.6), dp, fr(h * 0.4)); }
    else body(xx, yy, w, fr(h));
    c2.fillStyle = '#b30a1e'; c2.beginPath(); c2.arc(xx + w / 2, yy + h, bulb / 2, 0, 6.3); c2.fill();
    c2.fillStyle = '#f07a7a'; c2.fillRect(fr(xx + w / 2 - bulb / 4), fr(yy + h - bulb / 4), Math.max(1, Math.floor(dp / 2)), Math.max(1, Math.floor(dp / 2)));
    // bifurcación
    if (d.branch && h > d.len * d.branch.at) {
      const by = yy + d.len * d.branch.at, bl = Math.min(d.branch.len, (h - d.len * d.branch.at) * 0.85);
      for (let k = 0; k < bl; k += dp) {
        const bx = xx + d.branch.dir * Math.floor(k / (dp * 1.6)) * dp;
        c2.fillStyle = '#000'; c2.fillRect(bx - 1, fr(by + k) - 1, dp + 2, dp + 2);
      }
      for (let k = 0; k < bl; k += dp) {
        const bx = xx + d.branch.dir * Math.floor(k / (dp * 1.6)) * dp;
        c2.fillStyle = '#9c0018'; c2.fillRect(bx, fr(by + k), dp, dp);
      }
      c2.fillStyle = '#000'; c2.beginPath(); c2.arc(xx + d.branch.dir * Math.floor(bl / (dp * 1.6)) * dp + dp / 2, by + bl + dp * 0.4, dp * 0.95 + 1.2, 0, 6.3); c2.fill();
      c2.fillStyle = '#b30a1e'; c2.beginPath(); c2.arc(xx + d.branch.dir * Math.floor(bl / (dp * 1.6)) * dp + dp / 2, by + bl + dp * 0.4, dp * 0.95, 0, 6.3); c2.fill();
    }
    // gota suelta que se desprende al terminar
    if (done && d.drop) {
      const dy = Math.min(d.drop.fall, Math.max(0, (tau - (-d.v / d.a + Math.sqrt((d.v * d.v + 2 * d.a * d.len)) / d.a)) * 60));
      const gy = fr(yy + d.len + d.drop.gap + dy);
      c2.fillStyle = '#000'; c2.beginPath(); c2.arc(xx + w / 2, gy, dp * 0.95 + 1.2, 0, 6.3); c2.fill();
      c2.fillStyle = '#a80c20'; c2.beginPath(); c2.arc(xx + w / 2, gy, dp * 0.95, 0, 6.3); c2.fill();
    }
  }
  (function frame() {
    const nowP = performance.now();
    vt += Math.min(50, Math.max(0, nowP - lastNow)); lastNow = nowP;
    const t = vt;
    if (!fxMid && t >= midLand) { fxMid = true; screenShake(Math.round((cfg.SACUDIDA_PX || 16) * 0.4), 220); }
    if (!fxLast && t >= lastLand) {   // golpe final: sacudida, destello rojo y sonido grave
      fxLast = true;
      try { audio.playGameOverStrike(); } catch (e) {}
      screenShake(cfg.SACUDIDA_PX || 16, cfg.SACUDIDA_MS || 650);
      flashScreen('rgba(200,0,20,.55)', 600);
    }
    c2.clearRect(0, 0, W, H);
    letters.forEach(L => {
      const p = (t - L.start) / fallMs;
      if (p < 0) return;
      let dy = 0;
      if (p < 1) dy = -L.dist * (1 - p * p);
      else { const b = (t - L.land) / 260; if (b < 1) dy = -Math.abs(Math.sin(b * Math.PI * 1.5)) * sc * 0.9 * (1 - b); }
      const X = u => fr(ox + (L.x0 + u) * sc), Y = u => fr(oy + dy + (L.y0 + u) * sc), S = u => Math.max(1, fr(u * sc));
      const X0 = ox + L.x0 * sc, Y0 = oy + dy + L.y0 * sc;
      const landed = t >= L.land;
      // 1) borde negro grueso
      c2.fillStyle = '#000';
      L.px.forEach(([x, y]) => c2.fillRect(X(x - 0.5), Y(y - 0.5), S(2), S(2)));
      // 2) gotas que salen del borde inferior (tras caer)
      if (landed) L.drips.filter(d => !d.over).forEach(d => drawDrip(L, d, (t - L.land) / 1000 - d.delay, X0, Y0));
      // 3) relleno en bandas, grietas, brillos y sombras de borde
      L.px.forEach(([x, y]) => { c2.fillStyle = L.crack.has(x + ',' + y) ? '#33000a' : rcol(y); c2.fillRect(X(x), Y(y), S(1) + 1, S(1) + 1); });
      L.px.forEach(([x, y]) => {
        if (L.crack.has(x + ',' + y)) return;
        if (!L.set.has(x + ',' + (y - 1))) { c2.fillStyle = '#ffc7b8'; c2.fillRect(X(x), Y(y), S(1) + 1, Math.max(1, S(0.26))); }
        if (!L.set.has((x - 1) + ',' + y)) { c2.fillStyle = '#ff9a8a'; c2.fillRect(X(x), Y(y), Math.max(1, S(0.2)), S(1) + 1); }
        if (!L.set.has(x + ',' + (y + 1))) { c2.fillStyle = '#3d000b'; c2.fillRect(X(x), Y(y + 0.72), S(1) + 1, S(0.28) + 1); }
        if (!L.set.has((x + 1) + ',' + y)) { c2.fillStyle = '#58000d'; c2.fillRect(X(x + 0.8), Y(y), Math.max(1, S(0.2)) + 1, S(1) + 1); }
      });
      // 4) grietas que supuran (sobre la cara)
      if (landed) L.drips.filter(d => d.over).forEach(d => drawDrip(L, d, (t - L.land) / 1000 - d.delay, X0, Y0));
    });
    if (t < total) requestAnimationFrame(frame);
    else { ov.style.transition = 'opacity .35s ease-in'; ov.style.opacity = '0'; setTimeout(finish, 380); }
  })();
}
function showFinalGameOver() {
  gameOverSeq = false;
  const goChests = document.getElementById('goChests'); if (goChests) goChests.textContent = STATE.chestsOpened;
  const goLvl = document.getElementById('goLevel'); if (goLvl) goLvl.textContent = STATE.level;
  // El bucle solo se nombra si se muere en el segundo o posteriores (en el primero el jugador no sabe que hay bucles)
  const goLoopRow = document.getElementById('goLoopRow'), goLoop = document.getElementById('goLoop');
  if (goLoopRow) { goLoopRow.classList.toggle('hidden', (STATE.currentLoop || 1) < 2); if (goLoop) goLoop.textContent = STATE.currentLoop; }
  const goModal = document.getElementById('gameOverModal'); if (goModal) goModal.classList.remove('hidden');
  audio.init(); audio.playGameOver();
  clearSave();
}
function checkGameOver() {
  if (checkCanOpenAnyChestOnScreen()) return;
  if (gameOverSeq) return;
  gameOverSeq = true;
  whenBannerClosed(() => runGameOverStrike(() => {
    if (STATE.salvageCurseActive && STATE.cursedChestsLeft > 0) { showFinalGameOver(); return; }
    openUnfairDeal();
  }));
}
function openUnfairDeal() {
  const active = STATE.screenChests[STATE.activeChestIdx];
  const reqCount = getRequiredToolCount(active.rarity);
  let toolTitle = 'Ganzúa Básica';
  if (active.type.consumible === 'proPicks') toolTitle = 'Pin de Acero';
  if (active.type.consumible === 'usb') toolTitle = 'Llave USB';
  if (active.type.consumible === 'valves') toolTitle = 'Válvula Hidráulica';

  const curseBase = DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.DURACION_BASE;
  const curseInc = DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.INCREMENTO_POR_TRATO;
  const curseDuration = curseBase + (STATE.salvageDealsCount * curseInc);

  const offerTxt = document.getElementById('unfairOfferText');
  if (offerTxt) {
    offerTxt.innerHTML = `
      • Recibes <span class="text-amber-400 font-bold">+${reqCount} ${toolTitle}</span> y <span class="text-amber-400 font-bold">+2 Ganzúas</span>.<br>
      • Sufres Maldición durante <span class="text-rose-400 font-bold">${curseDuration} cofres</span> (-50% GP y XP).
    `;
  }
  const showDeal = () => { const dealModal = document.getElementById('unfairDealModal'); if (dealModal) dealModal.classList.remove('hidden'); };
  // Diálogo del Trapero (la primera vez más explicativo)
  const fr = (DATOS_JUEGO.NARRATIVA.TRAPERO_GAME_OVER || {});
  const first = STATE.salvageDealsCount === 0;
  const pool = first ? [].concat(fr.PRIMERA || []) : (fr.OTRAS || []);
  const phrase = (pool.filter(Boolean).length ? pool.filter(Boolean)[Math.floor(Math.random() * pool.filter(Boolean).length)] : '');
  if (phrase) triggerSequentialDialogue("EL TRAPERO", phrase, "fa-mask", "Última oportunidad", "text-rose-400", null, showDeal);
  else showDeal();
}

const acceptDealBtn = document.getElementById('acceptDealBtn');
if (acceptDealBtn) {
  acceptDealBtn.addEventListener('click', () => {
    const dealModal = document.getElementById('unfairDealModal');
    if (dealModal) dealModal.classList.add('hidden');
    gameOverSeq = false;
    STATE.salvageDealsCount++;
    STATE.salvageCurseActive = true;
    
    const curseBase = DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.DURACION_BASE;
    const curseInc = DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.INCREMENTO_POR_TRATO;
    STATE.cursedChestsLeft = curseBase + (STATE.salvageDealsCount - 1) * curseInc;

    STATE.picks += 2;
    const active = STATE.screenChests[STATE.activeChestIdx];
    const reqCount = getRequiredToolCount(active.rarity);
    STATE[active.type.consumible] = Math.max(reqCount, STATE[active.type.consumible] + reqCount);

    audio.playUnlockFanfare('epico');
    showPersistentFeedback(`📜 Trato Injusto #${STATE.salvageDealsCount} aceptado. Maldición activada por ${STATE.cursedChestsLeft} cofres.`);
    updateUI();
  });
}

const declineDealBtn = document.getElementById('declineDealBtn');
if (declineDealBtn) {
  declineDealBtn.addEventListener('click', () => {
    const dealModal = document.getElementById('unfairDealModal'); if (dealModal) dealModal.classList.add('hidden');
    showFinalGameOver();
  });
}
