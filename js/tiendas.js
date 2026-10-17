// ==========================================================================
// JUST ONE MORE CHEST — tiendas.js — VERSIÓN 0.1
// tienda del Duende y del Trapero
// ==========================================================================

/* ==========================================================================
   TIENDA DEL DUENDE Y MESA DE RECICLAJE
   ========================================================================== */

function triggerMerchantShopModalSequence() {
  const tier = getNarrativeTier();
  const phrases = DATOS_JUEGO.NARRATIVA.DUENDE_TIENDA_FRASES[tier];
  const speech = phrases[Math.floor(Math.random() * phrases.length)];

  triggerSequentialDialogue(
    "EL DUENDE",
    speech,
    "fa-hat-wizard",
    "Tienda Ambulante & Taller",
    "text-purple-300",
    null,
    () => {
      openMerchantShop();
    }
  );
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

  const frasesRecibo = DATOS_JUEGO.NARRATIVA.FRASES_RECIBO_DUENDE;
  let duendeQuote = frasesRecibo.DEFAULT;
  const bankTier = (frasesRecibo.POR_TIER || {})[getNarrativeTier()];
  if (bankTier && bankTier.length) duendeQuote = bankTier[Math.floor(Math.random() * bankTier.length)];
  if (session.totalGold >= 80) {
    duendeQuote = frasesRecibo.ALTO_ORO;
  } else if (session.totalGold === 0 && session.totalPicksRecycled > 0) {
    duendeQuote = frasesRecibo.SOLO_RECICLAJE;
  }

  const itemsHTML = validItems.map(item => `
    <div class="flex items-center justify-between bg-slate-900 border border-amber-500/30 px-3 py-3 rounded-xl text-xs font-mono">
      <span class="flex items-center gap-2 text-amber-200">
        <i class="fa-solid ${item.icon || 'fa-box'} text-amber-400"></i> ${item.name}
      </span>
      <span class="text-amber-400 font-black">${item.costText}</span>
    </div>
  `).join('');

  const receiptModal = document.createElement('div');
  receiptModal.id = 'duendeReceiptModal';
  receiptModal.className = 'fixed inset-0 z-[10000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans';
  receiptModal.innerHTML = `
    <div class="bg-slate-950 border-2 border-amber-500/60 w-full max-w-md p-5 rounded-2xl shadow-2xl flex flex-col gap-4 text-white relative animate-fade-in">
      <div class="flex items-center gap-3 border-b border-amber-500/30 pb-3">
        <div class="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-300 text-xl shadow-inner">
          <i class="fa-solid fa-receipt"></i>
        </div>
        <div>
          <h3 class="text-base font-black tracking-wide text-amber-400 uppercase">Recibo de la Visita</h3>
          <p class="text-[11px] font-mono text-slate-400">Tienda del Duende Mercader</p>
        </div>
      </div>

      <div class="receipt-quote bg-purple-950/40 border border-purple-500/30 p-3 rounded-xl text-xs italic text-purple-200 leading-relaxed font-serif">
        ${duendeQuote}
      </div>

      <div class="space-y-1.5 max-h-48 overflow-y-auto">
        ${itemsHTML}
      </div>

      <div class="bg-slate-900 border border-amber-500/30 px-3 py-3 rounded-xl flex flex-col gap-2 text-xs font-mono">
        <span class="text-slate-400 font-bold uppercase">Balance Final:</span>
        ${session.totalGold > 0 ? `<div class="flex items-center justify-between"><span class="text-slate-300">GP gastados</span><span class="text-amber-400 font-black"><i class="fa-solid fa-coins"></i> -${session.totalGold} GP</span></div>` : ''}
        ${session.totalPicksRecycled > 0 ? `<div class="flex items-center justify-between"><span class="text-slate-300">Ganzúas recicladas</span><span class="text-amber-300 font-black"><i class="fa-solid fa-screwdriver"></i> -${session.totalPicksRecycled} Ganzúas</span></div>` : ''}
      </div>

      <button id="closeReceiptBtn" class="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all cursor-pointer">
        Continuar
      </button>
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
      { id: 'pack_ganzuas', name: '+3 Ganzúas Básicas', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_ganzuas * discountMult), icon: 'fa-key', prop: 'picks', qty: 3 },
      { id: 'pack_pines', name: '+2 Pines de Acero', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_pines * discountMult), icon: 'fa-screwdriver', prop: 'proPicks', qty: 2, minLvl: 2 },
      { id: 'pack_usb', name: '+2 Llaves USB', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_usb * discountMult), icon: 'fa-microchip', prop: 'usb', qty: 2, minLvl: 3 },
      { id: 'pack_valvulas', name: '+1 Válvula Hidráulica', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_valvulas * discountMult), icon: 'fa-faucet', prop: 'valves', qty: 1, minLvl: 5 },
      { id: 'carta_auto_open', name: 'Carta Auto-Open', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.carta_auto_open * discountMult), icon: 'fa-wand-magic-sparkles', abilityProp: 'auto' },
      { id: 'carta_escudo', name: 'Carta Escudo Protector', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.carta_escudo * discountMult), icon: 'fa-shield-halved', abilityProp: 'shield' },
      { id: 'carta_apuesta', name: 'Carta Doble o Nada', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.carta_apuesta * discountMult), icon: 'fa-dice', abilityProp: 'riskPot' }
    ];

    if (!STATE.chestCounterUnlocked) {
      catalog.push({
        id: 'contador_cofres',
        name: 'Contador de Cofres',
        baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.contador_cofres * discountMult),
        icon: 'fa-stopwatch',
        isChestCounter: true
      });
    }

    const availableCatalog = catalog.filter(item => !item.minLvl || STATE.level >= item.minLvl);
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
      // [0.087b] La respuesta la dice el Duende con su retrato (el diálogo se pone por encima de la tienda)
      const dm = document.getElementById('dialogueModal');
      if (dm) dm.style.zIndex = '60';
      triggerSequentialDialogue("EL DUENDE", DATOS_JUEGO.NARRATIVA.FRASES_RECIBO_DUENDE.CONTADOR_RESPUESTA, "fa-hat-wizard", "Contador de cofres", "text-purple-300", null, () => { if (dm) dm.style.zIndex = ''; });
    } else if (item.prop) {
      STATE[item.prop] += item.qty;
    } else if (item.abilityProp) {
      STATE.abilities[item.abilityProp]++;
    }
  }

  const aumentoPrecio = DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.aumento_precio_por_compra;

  STATE.currentShopOffer.forEach(item => {
    const currentPrice = item.baseCost + (item.purchaseCount * aumentoPrecio);
    const isStealAvailable = STATE.perks.shopStealFree;

    const card = document.createElement('div');
    card.className = "bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between gap-1.5 text-left shadow-md";

    card.innerHTML = `
      <div>
        <div class="text-amber-400 font-black text-xs flex items-center gap-1.5 mb-0.5">
          <i class="fa-solid ${item.icon}"></i> ${item.name}
        </div>
        <div class="text-[10px] font-mono">
          ${isStealAvailable 
            ? '<span class="text-rose-400 font-bold uppercase">¡GRATIS (ROBO)!</span>' 
            : `Precio: <span class="text-yellow-400 font-bold">${currentPrice} GP</span> ${item.purchaseCount > 0 ? `<span class="text-slate-500 text-[9px]">(+${item.purchaseCount * aumentoPrecio}GP)</span>` : ''}`}
        </div>
      </div>
      <button class="w-full py-1 ${isStealAvailable ? 'bg-gradient-to-r from-rose-600 to-red-700' : 'bg-gradient-to-r from-purple-600 to-indigo-600'} active:scale-95 text-white font-black text-[11px] rounded-lg shadow transition-all cursor-pointer">
        ${isStealAvailable ? 'ROBAR' : `COMPRAR (${currentPrice} GP)`}
      </button>
    `;

    const btn = card.querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => {
        if (!STATE.shopSession) resetShopSession();

        if (STATE.perks.shopStealFree) {
          STATE.perks.shopStealFree = false;
          grantItem(item);

          STATE.shopSession.items.push({ name: item.name, costText: 'GRATIS (ROBO)', icon: item.icon, isStolen: true });

          // [0.084] Al robar solo suena el efecto; la frase de culpa se muestra al salir de la tienda, tras el recibo
          const culpaList = DATOS_JUEGO.NARRATIVA.FRASES_CULPA_ROBO;
          STATE.shopSession.guiltPhrase = culpaList[Math.floor(Math.random() * culpaList.length)];

          audio.playUnlockFanfare('raro');
          updateUI();
          renderMerchantShopGrid();

        } else {
          if (STATE.gold >= currentPrice) {
            STATE.gold -= currentPrice;
            grantItem(item);

            STATE.shopSession.items.push({ name: item.name, costText: `${currentPrice} GP`, icon: item.icon, isStolen: false });
            STATE.shopSession.totalGold += currentPrice;

            item.purchaseCount++;

            // [0.082] Sin mensaje frontal al comprar (el recibo del Duende se muestra al salir)
            audio.playUnlockFanfare('raro');
            updateUI();
            renderMerchantShopGrid();
          } else {
            audio.playBreak();
            showPersistentFeedback("⚠️ No tienes suficiente oro.");
          }
        }
      });
    }

    shopGrid.appendChild(card);
  });

  const recycleListContainer = document.getElementById('recycleList');
  if (recycleListContainer) {
    recycleListContainer.innerHTML = '';
    
    let recycleTargets = [ 
      { name: "Pin de Acero", prop: "proPicks", icon: "fa-screwdriver", color: "emerald", minLvl: 2 }, 
      { name: "Llave USB", prop: "usb", icon: "fa-microchip", color: "cyan", minLvl: 3 }, 
      { name: "Válvula Hidráulica", prop: "valves", icon: "fa-faucet", color: "rose", minLvl: 5 } 
    ].filter(t => STATE.level >= t.minLvl);
    
    if (recycleTargets.length === 0) { 
      recycleTargets = [{ name: "Pin de Acero", prop: "proPicks", icon: "fa-screwdriver", color: "emerald", minLvl: 1 }]; 
    }
    
    const reqGanzuasReciclaje = DATOS_JUEGO.ECONOMIA.RECICLAJE.ganzuas_requeridas;
    
    recycleTargets.forEach(target => {
      const card = document.createElement('div');
      card.className = "bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between gap-1.5 text-left shadow-md";
      
      card.innerHTML = `
        <div>
          <div class="text-${target.color}-400 font-black text-xs flex items-center gap-1.5 mb-0.5">
            <i class="fa-solid ${target.icon}"></i> ${target.name}
          </div>
          <div class="text-[10px] font-mono text-slate-400">
            Canje: <span class="text-amber-300 font-bold">${reqGanzuasReciclaje} Ganzúas</span> ➔ <span class="text-white font-bold">1 ${target.name}</span>
          </div>
        </div>
        <button class="w-full py-1 bg-gradient-to-r from-emerald-600 to-teal-700 active:scale-95 text-white font-black text-[11px] rounded-lg shadow transition-all cursor-pointer">
          RECICLAR (${reqGanzuasReciclaje} Ganzúas)
        </button>
      `;
      
      const btn = card.querySelector('button');
      btn.addEventListener('click', () => {
        if (!STATE.shopSession) resetShopSession();
        if (STATE.picks >= reqGanzuasReciclaje) {
          STATE.picks -= reqGanzuasReciclaje;
          STATE[target.prop] += 1;

          STATE.shopSession.items.push({ name: `Reciclaje: ${target.name}`, costText: `${reqGanzuasReciclaje} Ganzúas`, icon: target.icon, isStolen: false });
          STATE.shopSession.totalPicksRecycled += reqGanzuasReciclaje;

          audio.playClick(0.9);
          showPersistentFeedback(`♻️ Recicladas ${reqGanzuasReciclaje} Ganzúas Básicas por 1 ${target.name}.`);
          updateUI();
          renderMerchantShopGrid();
        } else {
          audio.playBreak();
          showPersistentFeedback(`⚠️ Necesitas al menos ${reqGanzuasReciclaje} Ganzúas Básicas para reciclar.`);
        }
      });
      
      recycleListContainer.appendChild(card);
    });
  }

  const merchantModal = document.getElementById('merchantModal'); 
  if (merchantModal) merchantModal.classList.remove('hidden');
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

function triggerTraperoShopSequence() {
  const tier = getNarrativeTier();
  const phrases = DATOS_JUEGO.NARRATIVA.TRAPERO_FRASES[tier];
  const speech = phrases[Math.floor(Math.random() * phrases.length)];

  triggerSequentialDialogue(
    "EL TRAPERO",
    speech,
    "fa-mask",
    "Tratos Oscuros",
    "text-rose-400",
    null,
    () => {
      openTraperoShop();
    }
  );
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
  return DATOS_JUEGO.COFRES.ESTANDAR.filter(t => t.consumible !== 'picks' && STATE.level >= t.minNivel).map(t => t.consumible);
}

function openTraperoShop() {
  const grid = document.getElementById('traperoDealsGrid') || document.getElementById('traperoItemsList'); 
  if (!grid) return;
  grid.innerHTML = '';

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
    card.className = "bg-slate-900 border border-rose-900/60 p-2.5 rounded-xl flex flex-col justify-between gap-1.5 text-left shadow-md";
    card.innerHTML = `
      <div>
        <div class="text-rose-400 font-black text-xs flex items-center gap-1.5 mb-0.5">
          <i class="fa-solid fa-skull"></i> ${deal.titulo}
        </div>
        <div class="text-[10px] text-slate-400 font-mono">${deal.desc}</div>
      </div>
      <button class="w-full py-1 bg-gradient-to-r from-rose-900 to-amber-900 active:scale-95 text-white font-black text-[11px] rounded-lg shadow transition-all cursor-pointer">
        ACEPTAR TRATO
      </button>
    `;

    const btn = card.querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => {
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
          const hasAdvancedTool = (STATE.proPicks >= 1 || STATE.usb >= 1 || STATE.valves >= 1);
          if (hasAdvancedTool && STATE.cursedChestsLeft > 0) {
            if (STATE.proPicks >= 1) STATE.proPicks--;
            else if (STATE.usb >= 1) STATE.usb--;
            else if (STATE.valves >= 1) STATE.valves--;

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
          STATE.gold += DATOS_JUEGO.ECONOMIA.TRAPERO.gp_contrato_leonino;
          STATE.heavyChestsLeft += 10;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Contrato Leonino", `Recibes +${DATOS_JUEGO.ECONOMIA.TRAPERO.gp_contrato_leonino} GP inmediatos. Cuidado: los próximos 10 cofres Raros+ requerirán +1 herramienta extra.`);
        } else if (deal.id === 'pacto_sangre') {
          unlockedAdvancedTools().forEach(p => { STATE[p] += 3; });   // [0.089] solo las ya desbloqueadas
          STATE.cursedChestsLeft += 12;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Pacto de Sangre", "Obtienes +3 de cada herramienta avanzada que ya has desbloqueado, pero sufres 12 turnos de Maldición (-50% GP y XP).");
        } else if (deal.id === 'pacto_sombra') {
          STATE.harderPuzzlesLeft += 10;
          STATE.traperoBuffs.bonusXp = true;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Pacto de la Sombra", "+25% Experiencia permanente activado. Los minijuegos de los próximos 10 cofres serán más exigentes.");
        } else if (deal.id === 'amor_arte') {
          unlockedAdvancedTools().forEach(p => { STATE[p] += 2; });   // [0.089] solo las ya desbloqueadas
          STATE.noXpChestsLeft += 5;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Por Amor al Arte", "Obtienes +2 de cada herramienta avanzada que ya has desbloqueado. No ganarás experiencia durante los próximos 5 cofres.");
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
          const PERK_NOMBRES = { sweetSpot: 'Mano Firme', rarityBonus: 'Ojo de Cazador', discount: 'Regateador', slowerPistons: 'Pistones Lentos', goldStreak: 'Fondo de Bolsillo', extraTime: 'Hombre Tranquilo (-2 s de margen)', oidoClinico: 'Oído Clínico', shopStealFree: 'Ladrón', luckyLootChance: 'Tipo con Suerte', bonusMadera: 'Clásico (maestría de Madera)', bonusAcero: 'Mecánico (maestría de Acero)', bonusDigital: 'Informático (maestría Digital)', bonusVapor: 'Fontanero (maestría de Vapor)' };
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
          const chestTypes = ['madera', 'acero', 'digital', 'vapor'];
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
}
