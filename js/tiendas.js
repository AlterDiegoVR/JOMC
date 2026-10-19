// ==========================================================================
// JUST ONE MORE CHEST — tiendas.js — VERSIÓN 0.208
// tienda del Duende y del Trapero
// ==========================================================================

/* ==========================================================================
   TIENDA DEL DUENDE Y MESA DE RECICLAJE
   ========================================================================== */

/* ==========================================================================
   [0.101] ARTE DE LAS TIENDAS: ayudantes compartidos (Duende y Trapero)
   ========================================================================== */

const SHOP_VIS = {
  pack_ganzuas:    { n: 'GANZÚAS +3',      ic: 'ic_ganzua' },
  pack_pines:      { n: 'PINES +2',        ic: 'ic_pin' },
  pack_usb:        { n: 'LLAVES USB +2',   ic: 'ic_usb' },
  pack_valvulas:   { n: 'VÁLVULAS +2',      ic: 'ic_valvula' },
  pack_pilas:      { n: 'PILAS +2',        ic: 'ic_pila' },   // [0.201]
  pack_fusibles:   { n: 'FUSIBLES +2',     ic: 'ic_fusible' },   // [0.203]
  carta_auto_open: { n: 'CARTA AUTO-OPEN', ic: 'ic_auto' },
  carta_escudo:    { n: 'CARTA ESCUDO',    ic: 'ic_escudo' },
  carta_apuesta:   { n: 'CARTA APUESTA',   ic: 'ic_apuesta' },
  contador_cofres: { n: 'CONTADOR DE COFRES', ic: 'ic_contador' },
  carta_cofradia:  { n: 'CARTA COFRADÍA DEL COFRE',  ic: 'ic_cofradia' }   // [0.104]
};
const SHOP_VIS_RECICLAJE = {
  proPicks: { n: 'PIN DE ACERO +2',    ic: 'ic_pin' },
  usb:      { n: 'LLAVE USB +1',       ic: 'ic_usb' },
  valves:   { n: 'VÁLVULA +1',         ic: 'ic_valvula' },
  batteries: { n: 'PILA +1',           ic: 'ic_pila' },   // [0.201]
  fuses:    { n: 'FUSIBLE +1',        ic: 'ic_fusible' }   // [0.203]
};

function shopCfg() { return (DATOS_JUEGO.GRAFICOS && DATOS_JUEGO.GRAFICOS.TIENDAS) || {}; }
function shopRandom(list, fallback) { return (list && list.length) ? list[Math.floor(Math.random() * list.length)] : (fallback || ''); }
function shopImg(key) { return (typeof ASSETS !== 'undefined' && ASSETS.tienda && ASSETS.tienda[key]) || ''; }
// Separa el mood final "texto {alegre}" de una frase
function shopSplitMood(text) {
  text = text || '';
  const mm = text.match(/\s*\{([a-z_]+)\}\s*$/);
  return mm ? { text: text.slice(0, mm.index), mood: mm[1] } : { text: text, mood: null };
}

// [0.106] Movimiento de respiración/balanceo de un personaje según su mood (valores en DATOS_JUEGO.GRAFICOS.MOVIMIENTO)
function npcMotion(el, who, mood) {
  if (!el) return;
  const cfg = (DATOS_JUEGO.GRAFICOS || {}).MOVIMIENTO;
  if (!cfg || !cfg.ACTIVAR) { el.classList.remove('npc-mv'); return; }
  const bank = cfg[who] || {};
  const m = bank[mood] || bank.base;
  if (!m) { el.classList.remove('npc-mv'); return; }
  el.style.setProperty('--mv-ms', m.ms + 'ms'); el.style.setProperty('--mv-y', m.y + '%');
  el.style.setProperty('--mv-rot', m.rot + 'deg'); el.style.setProperty('--mv-esc', String(m.esc / 100));
  el.classList.add('npc-mv');
}

let shopArtReady = false;
function shopArtInit() {
  if (shopArtReady || typeof ASSETS === 'undefined' || !ASSETS.tienda) return;
  const r = document.documentElement.style;
  const map = { '--ds-cerrado': 'cerrado', '--ds-relleno': 'cerradoRelleno', '--ds-tira': 'escenaTira', '--ds-narr': 'narrativaDuende', '--ds-trapero': 'trapero', '--ds-madera': 'madera', '--ds-marco-l': 'marco_l', '--ds-marco-r': 'marco_r' };
  Object.keys(map).forEach(v => { const u = shopImg(map[v]); if (u) r.setProperty(v, `url("${u}")`); });
  const sc = document.getElementById('dshopScene'); if (sc && shopImg('escena')) sc.setAttribute('src', shopImg('escena'));
  shopArtReady = true;
}

// Copia exacta de la barra de recursos del juego dentro de la tienda del Duende
function shopHudSync() {
  const src = document.getElementById('resourceBar'), dst = document.getElementById('dshopHud');
  if (!src || !dst) return;
  const c = src.cloneNode(true);
  c.removeAttribute('id'); c.classList.remove('hidden');
  c.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
  dst.innerHTML = ''; dst.appendChild(c);
}

function dshopMood(name) {
  const im = document.getElementById('dshopDuende');
  if (!im || typeof ASSETS === 'undefined' || !ASSETS.duende) return;
  const u = ASSETS.duende[name] || ASSETS.duende.base;
  if (im.getAttribute('src') !== u) im.setAttribute('src', u);
  npcMotion(im, 'duende', name);   // [0.106]
}
// El bocadillo conserva SIEMPRE la altura de la frase de apertura; si otra frase es más larga, se reduce la letra
function dshopFit() {
  const bub = document.getElementById('dshopBubble'), sp = document.getElementById('dshopPhrase');
  if (!bub || !sp) return;
  let fs = 15;
  bub.style.setProperty('--bub-fs', fs + 'px');
  const room = () => bub.clientHeight - 16;
  while (sp.offsetHeight > room() && fs > 8) { fs -= 1; bub.style.setProperty('--bub-fs', fs + 'px'); }
}
function dshopSay(text, mood) {
  const sp = document.getElementById('dshopPhrase'); if (!sp) return;
  const t = shopSplitMood(text);
  sp.textContent = t.text;
  const m = mood || t.mood; if (m) dshopMood(m);
  dshopFit();
}
function dshopLockBubble(text) {
  const bub = document.getElementById('dshopBubble'), sp = document.getElementById('dshopPhrase');
  if (!bub || !sp) return;
  bub.style.height = ''; bub.style.setProperty('--bub-fs', '15px');
  sp.textContent = shopSplitMood(text).text;
  bub.style.height = bub.offsetHeight + 'px';
}

// Doble toque (solo Trapero): el 1.º toque elige la tarjeta, el 2.º la confirma.
let shopArmedTimer = null;
function shopConfirmClick(btn, card, onConfirm, opts) {
  opts = opts || {};
  btn.addEventListener('click', () => {
    if (opts.blocked) { const why = opts.blocked(); if (why) { if (opts.onBlocked) opts.onBlocked(why); return; } }
    if (!shopCfg().CONFIRMAR_CON_SEGUNDO_TOQUE || card.classList.contains('armed')) { onConfirm(); return; }
    document.querySelectorAll('.tshop .armed').forEach(c => c.classList.remove('armed'));
    card.classList.add('armed');
    try { audio.init(); audio.playClick(1.1); } catch (e) {}
    if (opts.onSelect) opts.onSelect();
    clearTimeout(shopArmedTimer);
    shopArmedTimer = setTimeout(() => { card.classList.remove('armed'); if (opts.onDisarm) opts.onDisarm(); }, 4000);
  });
}

// Persiana: se sacude y sube. Es lo PRIMERO que pasa; después habla el Duende
let dshopAnimTimers = [];
function dshopPlayOpening(done) {
  const cfg = shopCfg().APERTURA || {};
  const lid = document.getElementById('dshopLid');
  const modal = document.getElementById('merchantModal');
  if (!cfg.ACTIVAR || !lid || !modal) { if (done) done(); return; }
  dshopAnimTimers.forEach(clearTimeout); dshopAnimTimers = [];
  const shakeMs = cfg.SACUDIDA_MS || 450, riseMs = cfg.SUBIDA_MS || 1300;
  modal.classList.add('locked');
  lid.style.setProperty('--lid-ms', riseMs + 'ms');
  lid.classList.remove('hidden', 'open'); lid.classList.add('shake');
  dshopAnimTimers.push(setTimeout(() => {
    lid.classList.remove('shake');
    void lid.offsetWidth;
    lid.classList.add('open');
    try { audio.init(); audio.playShutter(); } catch (e) {}
  }, shakeMs));
  dshopAnimTimers.push(setTimeout(() => {
    lid.classList.add('hidden'); lid.classList.remove('open', 'shake');
    modal.classList.remove('locked');
    if (done) done();
  }, shakeMs + riseMs + 60));
}

// Frase de apertura pendiente (la fijan los disparadores; la dice el Duende ya dentro de la tienda)
let dshopOpening = '';
function dshopShow(special) {
  const modal = document.getElementById('merchantModal');
  if (!modal) return;
  shopArtInit();
  modal.classList.toggle('dshop-special', !!special);
  const txt = document.getElementById('dshopLeaveTxt'), sub = document.getElementById('dshopLeaveSub');
  if (txt) txt.textContent = special ? 'NO COMPRAR' : 'SALIR';
  if (sub) sub.textContent = special ? '(RECHAZAR)' : '';
  const hs = document.getElementById('dshopHdrShop'); if (hs) hs.textContent = special ? 'OFERTA' : 'TIENDA';
  const wasHidden = modal.classList.contains('hidden');
  modal.classList.remove('hidden');
  shopHudSync();
  if (wasHidden) {
    const cfg = shopCfg();
    const speech = dshopOpening || (special ? shopRandom(cfg.FRASE_ESPECIAL) : shopRandom(cfg.FRASES_DUENDE, '¡SOLO UNO MÁS!'));
    dshopOpening = '';
    const bub = document.getElementById('dshopBubble');
    const col = document.getElementById('dshopStage'); if (col) col.scrollTop = 0;
    dshopMood('base');
    dshopLockBubble(speech);
    if (bub) bub.classList.add('silent');
    dshopPlayOpening(() => {
      if (bub) bub.classList.remove('silent');
      try { audio.init(); audio.playDialogueMelody('EL DUENDE'); } catch (e) {}
      dshopSay(speech);
    });
  }
}

// Fila de la lista: icono, nombre, descripción y botón. opts: {vis, desc, own, label, price (HTML), cls ('', 'w', 'steal'), poor, onClick, onPoor}
function dshopRowEl(o) {
  const row = document.createElement('div');
  row.className = 'dshop-row' + (o.poor ? ' poor' : '');
  row.innerHTML = `
    <img class="ic" src="${shopImg(o.vis.ic)}" alt="">
    <div class="dshop-tx"><div class="dshop-nm">${o.vis.n}${o.own > 0 ? `<span class="dshop-own">(tienes ${o.own})</span>` : ''}</div><div class="dshop-ds">${o.desc || ''}</div></div>
    <button class="dshop-bt ${o.poor ? 'off' : (o.cls || '')}" type="button"><span>${o.label}</span><span class="pr">${o.price}</span></button>`;
  row.querySelector('.dshop-bt').addEventListener('click', () => { if (o.poor) { if (o.onPoor) o.onPoor(); } else o.onClick(); });
  return row;
}
function dshopGoldPrice(n) { return `${n}<img src="${shopImg('moneda')}" alt="GP">`; }
function dshopPicksPrice(n) { return `x${n}<img src="${shopImg('ic_ganzua')}" alt="">`; }
function dshopPoorReact(phrases) { try { audio.init(); audio.playBreak(); } catch (e) {} dshopSay(shopRandom(phrases), 'enfadado'); }

function triggerMerchantShopModalSequence() {
  const tier = getNarrativeTier();
  const phrases = narr('DUENDE_TIENDA_FRASES')[tier];
  // [0.102] Primero se "abre" la tienda (persiana) y luego el Duende dice la frase dentro de su bocadillo
  dshopOpening = phrases[Math.floor(Math.random() * phrases.length)];
  openMerchantShop();
}

function resetShopSession() {
  STATE.shopSession = {
    items: [],
    totalGold: 0,
    totalPicksRecycled: 0
  };
}

function showShopReceipt(onCloseCallback) {
  const persistentBanner = document.getElementById('persistentFeedbackBanner');
  if (persistentBanner) persistentBanner.classList.add('hidden');

  const session = STATE.shopSession;
  const validItems = session ? (session.items || []).filter(item => !item.isStolen) : [];

  // [0.084] Frase de culpa por robo: aparece DESPUÉS del recibo, ya fuera de la tienda
  const guiltText = session && session.guiltPhrase ? session.guiltPhrase : null;
  if (session) session.guiltPhrase = null;
  const originalCallback = onCloseCallback;
  onCloseCallback = () => {
    if (originalCallback) originalCallback();
    if (guiltText) showPersistentFeedback(`🎭 "${guiltText}"`);
  };

  if (!session || validItems.length === 0) {
    if (onCloseCallback) onCloseCallback();
    return;
  }

  const oldReceipt = document.getElementById('duendeReceiptModal');
  if (oldReceipt) oldReceipt.remove();
  try { audio.init(); audio.playCashRegister(); } catch (e) {}   // [0.097] caja registradora al pasar a la factura (solo si hubo compra o reciclaje; con solo robos no se llega aquí)

  const frasesRecibo = narr('FRASES_RECIBO_DUENDE');
  let duendeQuote = frasesRecibo.DEFAULT;
  const bankTier = (frasesRecibo.POR_TIER || {})[getNarrativeTier()];
  if (bankTier && bankTier.length) duendeQuote = bankTier[Math.floor(Math.random() * bankTier.length)];
  if (session.totalGold >= 80) {
    duendeQuote = frasesRecibo.ALTO_ORO;
  } else if (session.totalGold === 0 && session.totalPicksRecycled > 0) {
    duendeQuote = frasesRecibo.SOLO_RECICLAJE;
  }

  // [0.2] Factura como papel de recibo: crece con las compras (el modal hace scroll), con el sello PAGADO anclado al total
  shopArtInit();
  const A = (typeof ASSETS !== 'undefined' && ASSETS) || {};
  const duendeSrc = (A.duende || {}).codicia || (A.duende || {}).base || '';
  const itemsHTML = validItems.map(item => {
    const sp = item.ic ? shopImg(item.ic) : '';
    const ic = sp ? `<img src="${sp}" alt="">` : `<i class="fa-solid ${item.icon || 'fa-box'}"></i>`;
    return `<div class="rc-li">${ic}<span>${item.name}</span><b>${item.costText}</b></div>`;
  }).join('');
  const coinSp = shopImg('moneda'), pickSp = shopImg('ic_ganzua');

  const receiptModal = document.createElement('div');
  receiptModal.id = 'duendeReceiptModal';
  receiptModal.className = 'rc-modal animate-fade-in';
  receiptModal.innerHTML = `
    <div class="rc-wrap">
      <div class="rc-paper">
        <div class="rc-hdr">
          <div><h3>RECIBO DE LA VISITA</h3><div class="rc-shop">Tienda del Duende Mercader</div></div>
          ${duendeSrc ? `<img class="rc-duen" src="${duendeSrc}" alt="">` : ''}
        </div>
        <div class="rc-quote">${duendeQuote}</div>
        ${itemsHTML}
        <div class="rc-sum">
          ${session.totalPicksRecycled > 0 ? `<div class="rc-sub2"><span>${pickSp ? `<img src="${pickSp}" alt="">` : ''}Ganzúas recicladas</span><span>-${session.totalPicksRecycled} Ganzúas</span></div>` : ''}
          ${session.totalGold > 0 ? `<div class="rc-total"><span>TOTAL</span><b>${coinSp ? `<img src="${coinSp}" alt="">` : ''}-${session.totalGold} GP</b></div>` : ''}
          <div class="rc-iva">IVA 21% INCLUIDO · NO SE ADMITEN DEVOLUCIONES</div>
        </div>
        <div class="rc-stamp">PAGADO</div>
      </div>
      <button id="closeReceiptBtn" class="gm-btn" type="button">CONTINUAR</button>
    </div>
  `;

  uiHost().appendChild(receiptModal);

  document.getElementById('closeReceiptBtn').addEventListener('click', () => {
    receiptModal.remove();
    if (persistentBanner) persistentBanner.classList.add('hidden');
    resetShopSession();
    if (onCloseCallback) onCloseCallback();
  });
}

function openMerchantShop() {
  if (!STATE.shopSession) {
    resetShopSession();
  }

  const shopGrid = document.getElementById('shopItemsList') || document.getElementById('merchantItemsGrid'); 
  if (!shopGrid) return;

  const discountMult = getDiscountMultiplier();

  if (!STATE.currentShopOffer) {
    let catalog = [
      { id: 'pack_ganzuas', name: '+3 Ganzúas Básicas', baseCost: Math.round(shopBasePrice('pack_ganzuas') * discountMult), icon: 'fa-key', prop: 'picks', qty: 3 },
      { id: 'pack_pines', name: '+2 Pines de Acero', baseCost: Math.round(shopBasePrice('pack_pines') * discountMult), icon: 'fa-screwdriver', prop: 'proPicks', qty: 2, minLvl: 2 },
      { id: 'pack_usb', name: '+2 Llaves USB', baseCost: Math.round(shopBasePrice('pack_usb') * discountMult), icon: 'fa-microchip', prop: 'usb', qty: 2, minLvl: 3 },
      { id: 'pack_valvulas', name: '+2 Válvulas Hidráulicas', baseCost: Math.round(shopBasePrice('pack_valvulas') * discountMult), icon: 'fa-faucet', prop: 'valves', qty: 2, minLvl: valvesShopLevel() },
      { id: 'pack_pilas', name: '+2 Pilas', baseCost: Math.round(shopBasePrice('pack_pilas') * discountMult), icon: 'fa-battery-half', prop: 'batteries', qty: 2, needUnlocked: 'batteries' },   // [0.201]
      { id: 'pack_fusibles', name: '+2 Fusibles', baseCost: Math.round(shopBasePrice('pack_fusibles') * discountMult), icon: 'fa-bolt', prop: 'fuses', qty: 2, needUnlocked: 'fuses' },   // [0.203]
      { id: 'carta_auto_open', name: 'Carta Auto-Open', baseCost: Math.round(shopBasePrice('carta_auto_open') * discountMult), icon: 'fa-wand-magic-sparkles', abilityProp: 'auto' },
      { id: 'carta_escudo', name: 'Carta Escudo Protector', baseCost: Math.round(shopBasePrice('carta_escudo') * discountMult), icon: 'fa-shield-halved', abilityProp: 'shield' },
      { id: 'carta_apuesta', name: 'Carta Doble o Nada', baseCost: Math.round(shopBasePrice('carta_apuesta') * discountMult), icon: 'fa-dice', abilityProp: 'riskPot' }
    ];

    // [0.104] Carta COFRADÍA: de vez en cuando aparece en la tienda (100 GP). Fuera de la secuencia final.
    if (STATE.level >= 2 && !isClimaxActive() && Math.random() < ((DATOS_JUEGO.GRAFICOS.TIENDAS || {}).COFRADIA_PROB_TIENDA != null ? DATOS_JUEGO.GRAFICOS.TIENDAS.COFRADIA_PROB_TIENDA : 0.30)) {
      catalog.push({ id: 'carta_cofradia', name: 'Carta Cofradía del Cofre', baseCost: Math.round(shopBasePrice('carta_cofradia') * discountMult), icon: 'fa-boxes-stacked', abilityProp: 'cofradia' });
    }

    if (!STATE.chestCounterUnlocked) {
      catalog.push({
        id: 'contador_cofres',
        name: 'Contador de Cofres',
        baseCost: Math.round(shopBasePrice('contador_cofres') * discountMult),
        icon: 'fa-stopwatch',
        isChestCounter: true
      });
    }

    const availableCatalog = catalog.filter(item => (!item.minLvl || STATE.level >= item.minLvl) && (!item.needUnlocked || toolUnlocked(item.needUnlocked)));
    STATE.currentShopOffer = [...availableCatalog].sort(() => 0.5 - Math.random()).slice(0, 3).map(item => ({
      ...item,
      purchaseCount: 0
    }));
  }

  renderMerchantShopGrid();
}

function renderMerchantShopGrid() {
  const shopGrid = document.getElementById('shopItemsList') || document.getElementById('merchantItemsGrid'); 
  if (!shopGrid || !STATE.currentShopOffer) return;
  shopGrid.innerHTML = '';

  function grantItem(item) {
    if (item.isChestCounter) {
      STATE.chestCounterUnlocked = true;
      // [0.104] La respuesta la dice el Duende en la propia tienda (burbuja de texto), sin pantalla narrativa
      dshopSay(narr('FRASES_RECIBO_DUENDE').CONTADOR_RESPUESTA);
      return true;
    } else if (item.prop) {
      STATE[item.prop] += item.qty;
    } else if (item.abilityProp) {
      STATE.abilities[item.abilityProp]++;
    }
  }

  const aumentoPrecio = shopBasePrice('aumento_precio_por_compra');
  const cfg = shopCfg();
  const desc = cfg.DESCRIPCIONES || {};
  const B = cfg.BOTONES || {};
  shopArtInit();

  STATE.currentShopOffer.forEach(item => {
    const currentPrice = item.baseCost + (item.purchaseCount * aumentoPrecio);
    const isStealAvailable = STATE.perks.shopStealFree;
    const vis = SHOP_VIS[item.id] || { n: item.name.toUpperCase(), ic: 'ic_ganzua' };
    const poor = !isStealAvailable && STATE.gold < currentPrice;
    const own = item.prop ? STATE[item.prop] : (item.abilityProp ? STATE.abilities[item.abilityProp] : 0);

    const row = dshopRowEl({
      vis, desc: desc[item.id], own,
      label: isStealAvailable ? (B.ROBAR || 'ROBAR') : (B.COMPRAR || 'COMPRAR'),
      price: isStealAvailable ? '' : dshopGoldPrice(currentPrice),   // [0.2] con Ladrón solo «ROBAR»
      cls: isStealAvailable ? 'steal' : 'w',
      poor,
      onPoor: () => dshopPoorReact(cfg.FRASES_SIN_ORO),
      onClick: () => {
        if (!STATE.shopSession) resetShopSession();

        if (STATE.perks.shopStealFree) {
          STATE.perks.shopStealFree = false;
          grantItem(item);

          STATE.shopSession.items.push({ name: item.name, costText: 'GRATIS (ROBO)', icon: item.icon, ic: vis.ic, isStolen: true });

          // [0.084] Al robar solo suena el efecto; la frase de culpa se muestra al salir de la tienda, tras el recibo
          const culpaList = narr('FRASES_CULPA_ROBO');
          STATE.shopSession.guiltPhrase = culpaList[Math.floor(Math.random() * culpaList.length)];

          audio.playUnlockFanfare('raro');
          updateUI();
          renderMerchantShopGrid();
          dshopSay(shopRandom(cfg.FRASES_ROBO), 'sorpresa');
        } else {
          STATE.gold -= currentPrice;
          const spoke = grantItem(item);   // [0.104] el contador de cofres ya trae su propia frase

          STATE.shopSession.items.push({ name: item.name, costText: `${currentPrice} GP`, icon: item.icon, ic: vis.ic, isStolen: false });
          STATE.shopSession.totalGold += currentPrice;

          item.purchaseCount++;

          // [0.082] Sin mensaje frontal al comprar (el recibo del Duende se muestra al salir)
          audio.playUnlockFanfare('raro');
          updateUI();
          renderMerchantShopGrid();
          if (!spoke) dshopSay(shopRandom(cfg.FRASES_COMPRA), 'alegre');
        }
      }
    });
    shopGrid.appendChild(row);
  });

  const recycleListContainer = document.getElementById('recycleList');
  if (recycleListContainer) {
    recycleListContainer.innerHTML = '';

    let recycleTargets = [
      { name: "Pin de Acero", prop: "proPicks", icon: "fa-screwdriver", minLvl: 2 },
      { name: "Llave USB", prop: "usb", icon: "fa-microchip", minLvl: 3 },
      { name: "Válvula Hidráulica", prop: "valves", icon: "fa-faucet", minLvl: valvesShopLevel() },
      { name: "Pila", prop: "batteries", icon: "fa-battery-half", minLvl: 1, needUnlocked: 'batteries' },   // [0.201]
      { name: "Fusible", prop: "fuses", icon: "fa-bolt", minLvl: 1, needUnlocked: 'fuses' }   // [0.203]
    ].filter(t => STATE.level >= t.minLvl && (!t.needUnlocked || toolUnlocked(t.needUnlocked)));

    if (recycleTargets.length === 0) {
      recycleTargets = [{ name: "Pin de Acero", prop: "proPicks", icon: "fa-screwdriver", minLvl: 1 }];
    }

    const reqGanzuasReciclaje = DATOS_JUEGO.ECONOMIA.RECICLAJE.ganzuas_requeridas;

    recycleTargets.forEach(target => {
      const vis = SHOP_VIS_RECICLAJE[target.prop];
      const poor = STATE.picks < reqGanzuasReciclaje;
      const row = dshopRowEl({
        vis, desc: desc['reciclaje_' + target.prop], own: STATE[target.prop],
        label: B.CANJEAR || 'CANJEAR', price: dshopPicksPrice(reqGanzuasReciclaje), cls: '', poor,
        onPoor: () => dshopPoorReact(cfg.FRASES_SIN_GANZUAS),
        onClick: () => {
          if (!STATE.shopSession) resetShopSession();
          STATE.picks -= reqGanzuasReciclaje;
          STATE[target.prop] += ((DATOS_JUEGO.ECONOMIA.RECICLAJE.otorgadas || {})[target.prop] || DATOS_JUEGO.ECONOMIA.RECICLAJE.herramientas_otorgadas);   // [0.105] por herramienta

          STATE.shopSession.items.push({ name: `Reciclaje: ${target.name}`, costText: `${reqGanzuasReciclaje} Ganzúas`, icon: target.icon, ic: vis.ic, isStolen: false });
          STATE.shopSession.totalPicksRecycled += reqGanzuasReciclaje;

          audio.playClick(0.9);
          updateUI();
          renderMerchantShopGrid();
          dshopSay(shopRandom(cfg.FRASES_RECICLAJE), 'alegre');
        }
      });
      recycleListContainer.appendChild(row);
    });
  }

  dshopShow(false);
}

const closeMerchantBtns = [
  document.getElementById('closeMerchantBtn'),
  document.getElementById('leaveShopBtn')
];
closeMerchantBtns.forEach(btn => {
  if (btn) {
    btn.addEventListener('click', () => {
      if (specialShopOpen) { handleSpecialShopNoBuy(); return; }
      STATE.currentShopOffer = null;
      const merchantModal = document.getElementById('merchantModal'); 
      if (merchantModal) merchantModal.classList.add('hidden');
      showShopReceipt(() => processNextQueuedEvent());
    });
  }
});

/* ==========================================================================
   TRATOS DEL TRAPERO
   ========================================================================== */

// [0.102] Entrada del Trapero: juego -> negro -> pantalla de tratos. Habla arriba; al continuar, los tratos aparecen en cascada.
let traperoTimers = [];
function triggerTraperoShopSequence() {
  const tier = getNarrativeTier();
  const phrases = narr('TRAPERO_FRASES')[tier];
  const t = shopSplitMood(phrases[Math.floor(Math.random() * phrases.length)]);
  const cfg = shopCfg().TRAPERO || {};
  const fadeMs = cfg.FUNDIDO_MS || 600;
  const modal = document.getElementById('traperoShopModal');
  if (!modal) { openTraperoShop(); return; }
  shopArtInit();
  traperoTimers.forEach(clearTimeout); traperoTimers = [];

  const veil = document.createElement('div');
  veil.style.cssText = `position:absolute;inset:0;z-index:10050;background:#000;opacity:0;transition:opacity ${fadeMs}ms ease;pointer-events:all`;
  uiHost().appendChild(veil);
  requestAnimationFrame(() => requestAnimationFrame(() => { veil.style.opacity = '1'; }));

  traperoTimers.push(setTimeout(() => {
    // Pantalla de tratos preparada (tratos vacíos, personaje y texto)
    const list = document.getElementById('traperoItemsList'); if (list) list.innerHTML = '';
    const leave = document.getElementById('leaveTraperoShopBtn'); if (leave) leave.classList.add('hidden');
    const pj = document.getElementById('tshopPj');
    if (pj) {
      const bank = (typeof ASSETS !== 'undefined' && ASSETS.trapero) || {};
      const src = bank[t.mood] || bank.base || '';
      if (src) { pj.setAttribute('src', src); pj.style.display = ''; } else pj.style.display = 'none';
      pj.classList.remove('small'); pj.style.left = pj.style.top = pj.style.width = '';
      npcMotion(pj, 'trapero', t.mood);   // [0.106]
    }
    const sp = document.getElementById('tshopSpeech'), st = document.getElementById('tshopSpeechText'), go = document.getElementById('tshopContinueBtn');
    if (st) st.textContent = t.text;
    if (sp) { sp.classList.remove('hidden', 'fade'); }
    if (go) {
      const nb = go.cloneNode(true); go.parentNode.replaceChild(nb, go);
      nb.addEventListener('click', () => {
        try { audio.init(); audio.playClick(1); } catch (e) {}
        sp.classList.add('fade');
        traperoTimers.push(setTimeout(() => { sp.classList.add('hidden'); openTraperoShop(); }, 380));
      });
    }
    modal.classList.remove('hidden');
    try { audio.init(); audio.playDialogueMelody('EL TRAPERO'); } catch (e) {}
    veil.style.opacity = '0';
    traperoTimers.push(setTimeout(() => veil.remove(), fadeMs + 60));
  }, fadeMs + 80));
}

// Los tratos (ya creados con la clase .pre) aparecen uno a uno con sonido; al acabar sale "NO TRATAR · SALIR"
function traperoCascade() {
  const cfg = shopCfg().TRAPERO || {};
  const step = cfg.CASCADA_MS || 380;
  const list = document.getElementById('traperoItemsList'), stage = document.getElementById('tshopStage');
  const leave = document.getElementById('leaveTraperoShopBtn'), pj = document.getElementById('tshopPj');
  if (!list) return;
  const cards = Array.from(list.querySelectorAll('.tcard'));
  // [0.2] El Trapero tiene UN solo tamaño grande en bienvenida, tratos y cierre (sin cálculo): los tratos son transparentes y pueden tapar parte del personaje
  if (pj) { pj.classList.remove('small'); pj.style.left = pj.style.top = pj.style.width = ''; }
  cards.forEach((c, i) => {
    traperoTimers.push(setTimeout(() => {
      c.classList.remove('pre');
      if (cfg.SONIDO_CASCADA !== false) { try { audio.init(); audio.playDealBell(i); } catch (e) {} }   // [0.105]
    }, 120 + i * step));
  });
  traperoTimers.push(setTimeout(() => { if (leave) leave.classList.remove('hidden'); }, 120 + cards.length * step + 80));
}

function showTraperoDealFeedback(dealTitle, summaryText, onClose) {
  triggerSequentialDialogue(
    "EL TRAPERO",
    summaryText,
    "fa-handshake",
    `TRATO ACEPTADO: ${dealTitle.toUpperCase()}`,
    "text-rose-400",
    null,
    () => {
      if (typeof onClose === 'function') onClose();
      else closeTraperoShop();
    }
  );
}

// [0.089] Herramientas avanzadas "descubiertas" = las de los cofres cuyo puzle ya está desbloqueado por nivel
function unlockedAdvancedTools() {
  return DATOS_JUEGO.COFRES.ESTANDAR.filter(t => t.consumible !== 'picks' && toolUnlocked(t.consumible)).map(t => t.consumible);
}

// [0.105] Contrato Leonino: 50 GP en el nivel 1, +10 por nivel, tope 100 (nivel 6)
function leoninoGp() { const T = DATOS_JUEGO.ECONOMIA.TRAPERO; return Math.min(T.LEONINO_MAX, T.gp_contrato_leonino + T.LEONINO_POR_NIVEL * Math.max(0, STATE.level - 1)); }

function openTraperoShop() {
  const grid = document.getElementById('traperoDealsGrid') || document.getElementById('traperoItemsList'); 
  if (!grid) return;
  grid.innerHTML = '';
  shopArtInit();

  let deals = [...DATOS_JUEGO.TRATOS_TRAPERO.INICIALES, ...DATOS_JUEGO.TRATOS_TRAPERO.OSCUROS];

  deals = deals.filter(deal => {
    if (deal.id === 'empujon_siniestro' && STATE.gold <= 100) return false;
    // [0.082] Dedos Rotos ya aceptado: no vuelve a aparecer hasta el siguiente bucle (resetGame lo desactiva)
    if (deal.id === 'dedos_rotos' && STATE.picksBrokenOnUse) return false;
    // [0.089] Los tratos que dan "+N de cada herramienta avanzada" no se ofrecen si aún no hay ninguna desbloqueada
    if ((deal.id === 'amor_arte' || deal.id === 'pacto_sangre') && unlockedAdvancedTools().length === 0) return false;
    return true;
  });

  if (STATE.chestsOpened >= 30 && !STATE.chestCounterUnlocked) {
    deals.push({
      id: 'contador_cofres_trapero',
      titulo: 'Contador de Cofres',
      desc: 'Entrega 5 Ganzúas Básicas para saber más.',
      isChestCounterTrapero: true
    });
  }

  const selectedDeals = deals.sort(() => 0.5 - Math.random()).slice(0, 3);

  selectedDeals.forEach(deal => {
    const card = document.createElement('div');
    card.className = 'tcard pre';
    const tag = (shopCfg().ETIQUETAS_TRAPERO || {})[deal.id] || 'TRATO';
    card.innerHTML = `
      <div class="tcard-top"><span class="tcard-title">${deal.titulo}</span><span class="tcard-tag">${tag}</span></div>
      <div class="tcard-desc">${String(deal.desc).replace('{LEONINO}', leoninoGp())}</div>
      <div class="tcard-hint">${shopCfg().TRAPERO_ARMADO_TEXTO || 'TOCA OTRA VEZ PARA ACEPTAR'}</div>
      <button class="tcard-btn" type="button" aria-label="${deal.titulo}"></button>
    `;

    const btn = card.querySelector('.tcard-btn');
    if (btn) {
      shopConfirmClick(btn, card, () => {
        const traperoModal = document.getElementById('traperoModal') || document.getElementById('traperoShopModal');

        if (deal.isChestCounterTrapero) {
          if (STATE.picks >= 5) {
            STATE.picks -= 5;
            STATE.chestCounterUnlocked = true;
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playUnlockFanfare('epico');
            updateUI();
            showTraperoDealFeedback("Contador de Cofres", "Entregaste 5 Ganzúas. El Contador de Cofres ha sido instalado en tu interfaz.");
          } else {
            audio.playBreak();
            showPersistentFeedback("⚠️ Necesitas 5 Ganzúas Básicas para este trato.");
          }
        } else if (deal.id === 'vender_ganzuas') {
          if (STATE.picks >= 2) {
            STATE.picks -= 2;
            STATE.gold += DATOS_JUEGO.ECONOMIA.TRAPERO.gp_por_dos_ganzuas;
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playClick(0.8);
            updateUI();
            showTraperoDealFeedback("Vender 2 Ganzúas", `Entregaste 2 Ganzúas a cambio de +${DATOS_JUEGO.ECONOMIA.TRAPERO.gp_por_dos_ganzuas} GP inmediatos.`);
          } else {
            showPersistentFeedback("⚠️ Necesitas al menos 2 Ganzúas.");
          }
        } else if (deal.id === 'vender_avanzada') {
          // [CAMBIO] Vender 1 Herramienta Avanzada: se entrega una al azar entre las que tengas y paga gp_por_herramienta_avanzada
          const disponibles = [];
          if (STATE.proPicks >= 1) disponibles.push({ prop: 'proPicks', name: 'Pin de Acero' });
          if (STATE.usb >= 1) disponibles.push({ prop: 'usb', name: 'Llave USB' });
          if (STATE.valves >= 1) disponibles.push({ prop: 'valves', name: 'Válvula Hidráulica' });
          if (STATE.batteries >= 1) disponibles.push({ prop: 'batteries', name: 'Pila' });   // [0.201]
          if (STATE.fuses >= 1) disponibles.push({ prop: 'fuses', name: 'Fusible' });   // [0.203]
          if (disponibles.length > 0) {
            const vendida = disponibles[Math.floor(Math.random() * disponibles.length)];
            const gpVenta = DATOS_JUEGO.ECONOMIA.TRAPERO.gp_por_herramienta_avanzada;
            STATE[vendida.prop] -= 1;
            STATE.gold += gpVenta;
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playClick(0.8);
            updateUI();
            showTraperoDealFeedback("Vender 1 Herramienta Avanzada", `El Trapero se lleva tu ${vendida.name} a cambio de +${gpVenta} GP inmediatos.`);
          } else {
            showPersistentFeedback("⚠️ Necesitas al menos 1 herramienta avanzada (Pin, USB o Válvula).");
          }
        } else if (deal.id === 'canje_directo') {
          if (STATE.picks >= 2) {
            STATE.picks -= 2;
            STATE.proPicks += 1;
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playClick(0.8);
            updateUI();
            showTraperoDealFeedback("Canje Directo", "Intercambiaste 2 Ganzúas por 1 Pin de Acero.");
          } else {
            showPersistentFeedback("⚠️ Necesitas al menos 2 Ganzúas.");
          }
        } else if (deal.id === 'purga_maldicion') {
          const hasAdvancedTool = (STATE.proPicks >= 1 || STATE.usb >= 1 || STATE.valves >= 1 || STATE.batteries >= 1 || STATE.fuses >= 1);
          if (hasAdvancedTool && STATE.cursedChestsLeft > 0) {
            if (STATE.proPicks >= 1) STATE.proPicks--;
            else if (STATE.usb >= 1) STATE.usb--;
            else if (STATE.valves >= 1) STATE.valves--;
            else if (STATE.batteries >= 1) STATE.batteries--;
            else if (STATE.fuses >= 1) STATE.fuses--;

            STATE.cursedChestsLeft = Math.max(0, STATE.cursedChestsLeft - 4);
            if (STATE.cursedChestsLeft === 0) { STATE.salvageCurseActive = false; curseHold = true; queueCurseEndMessage(); }
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playClick(0.8);
            updateUI();
            showTraperoDealFeedback("Purga de Maldición", "Entregaste 1 herramienta avanzada. La duración de tu maldición se ha reducido en 4 cofres.");
          } else {
            showPersistentFeedback("⚠️ Necesitas 1 herramienta avanzada y estar maldecido.");
          }
        } else if (deal.id === 'contrato_leonino') {
          const gpLeo = leoninoGp(); STATE.gold += gpLeo;
          STATE.heavyChestsLeft += 10;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Contrato Leonino", `Recibes +${gpLeo} GP inmediatos. Cuidado: los próximos 10 cofres Raros+ requerirán +1 herramienta extra.`);
        } else if (deal.id === 'pacto_sangre') {
          unlockedAdvancedTools().forEach(p => { STATE[p] += 3; });   // [0.089] solo las ya desbloqueadas
          STATE.cursedChestsLeft += 12;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Pacto de Sangre", "Obtienes +3 de cada herramienta avanzada que ya has desbloqueado, pero sufres 12 turnos de Maldición (-50% GP y XP).");
        } else if (deal.id === 'pacto_sombra') {
          STATE.harderPuzzlesLeft += 10; STATE.harderSrc = 'Pacto de la Sombra';   // [0.105]
          STATE.traperoBuffs.bonusXp = true;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Pacto de la Sombra", "+25% Experiencia permanente activado. Los minijuegos de los próximos 10 cofres serán más exigentes.");
        } else if (deal.id === 'amor_arte') {
          unlockedAdvancedTools().forEach(p => { STATE[p] += DATOS_JUEGO.ECONOMIA.TRAPERO.amor_arte_herramientas; });   // [0.089] solo las ya desbloqueadas; [0.105] 3
          STATE.noXpChestsLeft += 5;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Por Amor al Arte", "Obtienes +3 de cada herramienta avanzada que ya has desbloqueado. No ganarás experiencia durante los próximos 5 cofres.");
        } else if (deal.id === 'empujon_siniestro') {
          STATE.gold = 30;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          // [CAMBIO] Primero se muestra el trato y, al continuar, se sube de nivel (evita que los diálogos se pisen)
          showTraperoDealFeedback("Empujón Siniestro", "Tus GP han caído a 30, pero ascenderás un nivel inmediatamente.", () => {
            ['traperoModal', 'traperoShopModal', 'dialogueModal'].forEach(mid => {
              const el = document.getElementById(mid);
              if (el) el.classList.add('hidden');
            });
            processLevelUp(true);
          });
        } else if (deal.id === 'dedos_rotos') {
          STATE.picks += 10;
          STATE.picksBrokenOnUse = true;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Dedos Rotos", "Recibes +10 Ganzúas Básicas. ¡Atención! A partir de ahora tus ganzúas se consumirán aunque resuelvas el puzle.");
        } else if (deal.id === 'cambio_trabajo') {
          let lostPerkText = 'una modificación positiva';
          const activePerksList = [];
          if (STATE.perks.sweetSpot > 0) activePerksList.push('sweetSpot');
          if (STATE.perks.rarityBonus > 0) activePerksList.push('rarityBonus');
          if (STATE.perks.discount > 0) activePerksList.push('discount');
          if (STATE.perks.slowerPistons > 0) activePerksList.push('slowerPistons');
          if (STATE.perks.goldStreak > 0) activePerksList.push('goldStreak');
          if (STATE.perks.extraTime > 0) activePerksList.push('extraTime');
          if (STATE.perks.oidoClinico > 0) activePerksList.push('oidoClinico');
          if (STATE.perks.shopStealFree) activePerksList.push('shopStealFree');
          if (STATE.perks.luckyLootChance > 0) activePerksList.push('luckyLootChance');
          if (STATE.perks.bonusMadera > 0) activePerksList.push('bonusMadera');
          if (STATE.perks.bonusAcero > 0) activePerksList.push('bonusAcero');
          if (STATE.perks.bonusDigital > 0) activePerksList.push('bonusDigital');
          if (STATE.perks.bonusVapor > 0) activePerksList.push('bonusVapor');
          if (STATE.perks.bonusNeon > 0) activePerksList.push('bonusNeon');

          if (activePerksList.length === 0) {
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playBreak();
            triggerSequentialDialogue(
              "EL TRAPERO",
              "¿De verdad pensaste que podías engañarme?",
              "fa-mask",
              "TRATO NO SELLADO",
              "text-rose-500",
              null,
              () => { closeTraperoShop(); }
            );
            showPersistentFeedback("Trato no sellado: no tienes modificaciones activas.");
            return;
          }

          const chosenPerk = activePerksList[Math.floor(Math.random() * activePerksList.length)];
          // [0.089] Nombre de lo que se pierde, para decirlo en la frase del Trapero
          const PERK_NOMBRES = { sweetSpot: 'Mano Firme', rarityBonus: 'Ojo de Cazador', discount: 'Regateador', slowerPistons: 'Pistones Lentos', goldStreak: 'Fondo de Bolsillo', extraTime: 'Hombre Tranquilo (-2 s de margen)', oidoClinico: 'Oído Clínico', shopStealFree: 'Ladrón', luckyLootChance: 'Tipo con Suerte', bonusMadera: 'Clásico (maestría de Madera)', bonusAcero: 'Mecánico (maestría de Acero)', bonusDigital: 'Informático (maestría Digital)', bonusVapor: 'Fontanero (maestría de Vapor)', bonusNeon: 'Electricista (maestría de Neón)' };
          const lostLevelled = !['shopStealFree', 'luckyLootChance', 'oidoClinico', 'extraTime'].includes(chosenPerk) && (STATE.perks[chosenPerk] || 0) > 1;
          lostPerkText = (lostLevelled ? '1 nivel de ' : '') + (PERK_NOMBRES[chosenPerk] || chosenPerk);
          if (chosenPerk === 'shopStealFree') STATE.perks.shopStealFree = false;
          else if (chosenPerk === 'extraTime') STATE.perks.extraTime = Math.max(0, STATE.perks.extraTime - 2);
          else if (chosenPerk === 'luckyLootChance') STATE.perks.luckyLootChance = 0;
          else if (chosenPerk.startsWith('bonus')) STATE.perks[chosenPerk] = Math.max(0, STATE.perks[chosenPerk] - 1);
          else STATE.perks[chosenPerk] = Math.max(0, STATE.perks[chosenPerk] - 1);

          STATE.gold += 35;
          STATE.xpBoostChestsLeft += 10;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Cambio de Trabajo", `Has perdido: ${lostPerkText}. Recibes +35 GP y +25% XP extra durante 10 cofres.`);
        } else if (deal.id === 'maestria_doble_filo') {
          const chestTypes = ['madera', 'acero', 'digital', 'vapor'].concat((STATE.currentLoop || 1) >= 2 ? ['neon'] : []);   // [0.202] neón solo desde el bucle 2
          const maestriaType = chestTypes[Math.floor(Math.random() * chestTypes.length)];
          const remainingTypes = chestTypes.filter(t => t !== maestriaType);
          const torpezaType = remainingTypes[Math.floor(Math.random() * remainingTypes.length)];

          let isAnulacion = false;

          const perkKeyM = 'bonus' + maestriaType.charAt(0).toUpperCase() + maestriaType.slice(1);
          if (STATE.torpezas[maestriaType] > 0) {
            STATE.torpezas[maestriaType] = Math.max(0, STATE.torpezas[maestriaType] - 1);
            isAnulacion = true;
          } else {
            STATE.perks[perkKeyM] = (STATE.perks[perkKeyM] || 0) + 1;
          }

          const perkKeyT = 'bonus' + torpezaType.charAt(0).toUpperCase() + torpezaType.slice(1);
          if (STATE.perks[perkKeyT] > 0) {
            STATE.perks[perkKeyT] = Math.max(0, STATE.perks[perkKeyT] - 1);
            isAnulacion = true;
          } else {
            STATE.torpezas[torpezaType] = (STATE.torpezas[torpezaType] || 0) + 1;
          }

          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();

          if (isAnulacion) {
            showTraperoDealFeedback("Maestría de Doble Filo", "Se ha reducido un nivel de conflicto entre tu torpeza y maestría para uno de los tipos de cofre.");
          } else {
            showTraperoDealFeedback("Maestría de Doble Filo", `Has recibido +1 Nivel de Maestría en ${maestriaType.toUpperCase()}, pero sufres +1 Nivel de Torpeza en ${torpezaType.toUpperCase()}.`);
          }
        } else {
          STATE.gold += 20;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playClick(0.8);
          updateUI();
          showTraperoDealFeedback(deal.titulo, "Trato cerrado. Revisa tu inventario y efectos activos.");
        }
      });
    }

    grid.appendChild(card);
  });

  const traperoModal = document.getElementById('traperoModal') || document.getElementById('traperoShopModal'); 
  if (traperoModal) traperoModal.classList.remove('hidden');
  traperoCascade();
}
