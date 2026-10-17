// ==========================================================================
// JUST ONE MORE CHEST — ui.js — VERSIÓN 0.102
// actualización de la interfaz (HUD)
// ==========================================================================

function updateUI() {
  trackStats();   // [0.090]
  const levelEl = document.getElementById('playerLevel'); if (levelEl) levelEl.textContent = STATE.level;
  
  const xpBar = document.getElementById('xpBar'); 
  if (xpBar) {
    xpBar.style.width = `${Math.min(100, (STATE.xp / STATE.xpNext) * 100)}%`;
    const xpContainer = xpBar.parentElement;
    if (xpContainer && !xpContainer.dataset.hasClickListener) {
      xpContainer.dataset.hasClickListener = 'true';
      xpContainer.classList.add('cursor-pointer');
      xpContainer.addEventListener('click', () => {
        showPersistentFeedback(`⭐ EXPERIENCIA: ${STATE.xp} / ${STATE.xpNext} XP (Faltan ${STATE.xpNext - STATE.xp} XP para Nivel ${STATE.level + 1})`);
      });
    }
  }

  const goldEl = document.getElementById('goldText'); if (goldEl) goldEl.textContent = STATE.gold;
  const pickEl = document.getElementById('pickText'); if (pickEl) pickEl.textContent = STATE.picks;
  const proPickEl = document.getElementById('proPickText'); if (proPickEl) proPickEl.textContent = STATE.proPicks;
  const usbEl = document.getElementById('usbText'); if (usbEl) usbEl.textContent = STATE.usb;
  const valveEl = document.getElementById('valveText'); if (valveEl) valveEl.textContent = STATE.valves;

  let chestCounterEl = document.getElementById('loopCounterDisplay');
  const abilitiesBar = document.getElementById('abilitiesBar') || document.getElementById('tacticalCardsContainer') || document.getElementById('abilityAutoBtn')?.parentElement;

  if (STATE.chestCounterUnlocked) {
    if (!chestCounterEl) {
      chestCounterEl = document.createElement('div');
      chestCounterEl.id = 'loopCounterDisplay';
      chestCounterEl.className = 'bg-amber-950/80 border border-amber-500/60 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 font-mono text-xs text-amber-300 backdrop-blur-md shrink-0 animate-fade-in select-none';
      chestCounterEl.innerHTML = `<i class="fa-solid fa-stopwatch text-amber-400 text-sm"></i> <span class="font-bold text-amber-400/80">COFRES:</span> <span id="loopCounterValue" class="font-black text-amber-200 text-sm">0</span>`;
    }

    // [0.087b] Lugar fijo: siempre al final (extremo derecho) de la fila de cartas
    chestCounterEl.classList.add('ml-auto');
    if (abilitiesBar && (chestCounterEl.parentElement !== abilitiesBar || abilitiesBar.lastElementChild !== chestCounterEl)) {
      abilitiesBar.appendChild(chestCounterEl);
    }

    chestCounterEl.classList.remove('hidden');
    const valEl = document.getElementById('loopCounterValue');
    if (valEl) valEl.textContent = STATE.chestsOpened;
  } else if (chestCounterEl) {
    chestCounterEl.classList.add('hidden');
  }

  const riskBar = document.getElementById('riskPotBar');
  if (riskBar) {
    if (STATE.riskModeActive) {
      riskBar.classList.remove('hidden');
      const potEl = document.getElementById('riskPotText');
      if (potEl) potEl.textContent = STATE.riskPot;
    } else {
      riskBar.classList.add('hidden');
    }
  }

  const streakBadge = document.getElementById('streakBadge');
  if (streakBadge) {
    if (STATE.cleanStreak >= DATOS_JUEGO.ECONOMIA.RACHAS_APERTURA.MINIMO_PARA_BONUS) {
      streakBadge.classList.remove('hidden');
      const streakText = document.getElementById('streakText');
      if (streakText) streakText.textContent = `x${STATE.cleanStreak}`;
      setHelp(streakBadge, helpText('racha'));
    } else {
      streakBadge.classList.add('hidden');
    }
  }

  // [0.087b] Efecto "Por Amor al Arte": sin XP durante N cofres
  const noXpBadge = document.getElementById('noXpBadge');
  if (noXpBadge) {
    if (STATE.noXpChestsLeft > 0) {
      noXpBadge.classList.remove('hidden');
      noXpBadge.innerHTML = `<i class="fa-solid fa-ban"></i> x${STATE.noXpChestsLeft}`;
      setHelp(noXpBadge, helpText('sinXp', { n: STATE.noXpChestsLeft }));
    } else noXpBadge.classList.add('hidden');
  }

  const curseBadge = document.getElementById('curseBadge');
  if (curseBadge) {
    if (STATE.cursedChestsLeft > 0) {
      curseBadge.classList.remove('hidden');
      curseBadge.innerHTML = `<i class="fa-solid fa-skull"></i> x${STATE.cursedChestsLeft}`;
      setHelp(curseBadge, helpText('maldicion', { n: STATE.cursedChestsLeft }), true);
    } else {
      curseBadge.classList.add('hidden');
    }
  }

  // [0.087] Etiquetas y banners de las llaves consumibles
  [['pickText', 'ganzuas'], ['proPickChip', 'pines'], ['usbChip', 'usb'], ['valveChip', 'valvulas']].forEach(([id, key]) => {
    let el = document.getElementById(id);
    if (el && id === 'pickText') el = el.parentElement;
    if (el) setHelp(el, helpText(key));
  });
  // y de las cartas consumibles (tooltip; al pulsarlas ya muestran su propio aviso al activarse)
  [['abilityAutoBtn', 'auto'], ['ability2xBtn', 'double'], ['abilityShieldBtn', 'shield'], ['abilityRiskBtn', 'riskPot'], ['abilityPerdedorBtn', 'perdedor'], ['abilitySummonDuendeBtn', 'summonDuende']].forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.title = ((DATOS_JUEGO.TEXTOS_AYUDA.cartas || {})[key]) || '';
  });

  const proChip = document.getElementById('proPickChip'); if (proChip && STATE.level >= 2) proChip.classList.remove('hidden');
  const usbChip = document.getElementById('usbChip'); if (usbChip && STATE.level >= 3) usbChip.classList.remove('hidden');
  const valveChip = document.getElementById('valveChip'); if (valveChip && STATE.level >= 4) valveChip.classList.remove('hidden');

  
  // ACTUALIZACIÓN DE PERKS Y PASIVAS
  const perksBar = document.getElementById('perksBar');
  if (perksBar) {
    perksBar.innerHTML = '';

    // [0.084] Maestría + Torpeza del mismo tipo: los niveles se anulan 1 con 1
    reconcileMasteryTorpeza();

    const perkList = [
      { active: STATE.perks.sweetSpot > 0, text: `🎯 Firme x${STATE.perks.sweetSpot}`, shortText: `🎯 x${STATE.perks.sweetSpot}`, desc: "Mano Firme: +20% margen de error en puzles.", isTorpeza: false },
      { active: STATE.perks.rarityBonus > 0, text: `👁️ Cazador x${STATE.perks.rarityBonus}`, shortText: `👁️ x${STATE.perks.rarityBonus}`, desc: "Ojo de Cazador: Mayor probabilidad de cofres Raros, Épicos y Legendarios.", isTorpeza: false },
      { active: STATE.perks.discount > 0, text: `🏷️ Regateador x${STATE.perks.discount}`, shortText: `🏷️ x${STATE.perks.discount}`, desc: `Regateador: -${Math.round(getDiscountPct() * 100)}% en los precios del Duende.`, isTorpeza: false },
      { active: STATE.perks.slowerPistons > 0, text: `⚙️ Lentos x${STATE.perks.slowerPistons}`, shortText: `⚙️ x${STATE.perks.slowerPistons}`, desc: "Pistones Lentos: -20% velocidad en minijuego de pistones.", isTorpeza: false },
      { active: STATE.perks.goldStreak > 0, text: `💰 Bolsillo x${STATE.perks.goldStreak}`, shortText: `💰 x${STATE.perks.goldStreak}`, desc: "Fondo de Bolsillo: +1 GP fijo y +15% extra en racha de aperturas.", isTorpeza: false },
      { active: STATE.perks.extraTime > 0, text: `⏱️ Tranquilo (+${STATE.perks.extraTime}s)`, shortText: `⏱️ +${STATE.perks.extraTime}s`, desc: "Hombre Tranquilo: Segundos extra en temporizadores de puzle.", isTorpeza: false },
      { active: STATE.perks.oidoClinico > 0, text: `👂 Oído Clínico`, shortText: `👂`, desc: "Oído Clínico: Advertencia visual de Falso Punto Dulce.", isTorpeza: false },
      { active: STATE.perks.bonusMadera > 0, text: `📦 Clásico Lv.${STATE.perks.bonusMadera} (+${Math.round(getMasteryTorpezaPct(STATE.perks.bonusMadera) * 100)}%)`, shortText: `📦 Lv.${STATE.perks.bonusMadera}`, desc: `Clásico: +${Math.round(getMasteryTorpezaPct(STATE.perks.bonusMadera) * 100)}% botín y EXP en cofres de Madera.`, kind: 'mastery', isTorpeza: false },
      { active: STATE.perks.bonusAcero > 0, text: `⚙️ Mecánico Lv.${STATE.perks.bonusAcero} (+${Math.round(getMasteryTorpezaPct(STATE.perks.bonusAcero) * 100)}%)`, shortText: `⚙️ Lv.${STATE.perks.bonusAcero}`, desc: `Mecánico: +${Math.round(getMasteryTorpezaPct(STATE.perks.bonusAcero) * 100)}% botín y EXP en cofres de Acero.`, kind: 'mastery', isTorpeza: false },
      { active: STATE.perks.bonusDigital > 0, text: `💻 Informático Lv.${STATE.perks.bonusDigital} (+${Math.round(getMasteryTorpezaPct(STATE.perks.bonusDigital) * 100)}%)`, shortText: `💻 Lv.${STATE.perks.bonusDigital}`, desc: `Informático: +${Math.round(getMasteryTorpezaPct(STATE.perks.bonusDigital) * 100)}% botín y EXP en cofres Digitales (USB).`, kind: 'mastery', isTorpeza: false },
      { active: STATE.perks.bonusVapor > 0, text: `🚰 Fontanero Lv.${STATE.perks.bonusVapor} (+${Math.round(getMasteryTorpezaPct(STATE.perks.bonusVapor) * 100)}%)`, shortText: `🚰 Lv.${STATE.perks.bonusVapor}`, desc: `Fontanero: +${Math.round(getMasteryTorpezaPct(STATE.perks.bonusVapor) * 100)}% botín y EXP en cofres de Vapor.`, kind: 'mastery', isTorpeza: false },
      { active: STATE.perks.shopStealFree, text: `🎭 Ladrón`, shortText: `🎭`, desc: "Ladrón: El primer ítem de la tienda del Duende es gratis.", isTorpeza: false },
      { active: STATE.perks.luckyLootChance > 0, text: `🍀 Suerte 15%`, shortText: `🍀 15%`, desc: "Tipo con Suerte: 15% de probabilidad de duplicar botín.", isTorpeza: false },
      
      // TORPEZAS
      { active: STATE.torpezas.madera > 0, text: `📦 Torpeza Madera Lv.${STATE.torpezas.madera} (-${Math.round(getMasteryTorpezaPct(STATE.torpezas.madera) * 100)}%)`, shortText: `📦 Lv.${STATE.torpezas.madera}`, desc: `Torpeza en Madera: -${Math.round(getMasteryTorpezaPct(STATE.torpezas.madera) * 100)}% botín y EXP en cofres de Madera.`, kind: 'torpeza', isTorpeza: true },
      { active: STATE.torpezas.acero > 0, text: `⚙️ Torpeza Acero Lv.${STATE.torpezas.acero} (-${Math.round(getMasteryTorpezaPct(STATE.torpezas.acero) * 100)}%)`, shortText: `⚙️ Lv.${STATE.torpezas.acero}`, desc: `Torpeza en Acero: -${Math.round(getMasteryTorpezaPct(STATE.torpezas.acero) * 100)}% botín y EXP en cofres de Acero.`, kind: 'torpeza', isTorpeza: true },
      { active: STATE.torpezas.digital > 0, text: `💻 Torpeza Digital Lv.${STATE.torpezas.digital} (-${Math.round(getMasteryTorpezaPct(STATE.torpezas.digital) * 100)}%)`, shortText: `💻 Lv.${STATE.torpezas.digital}`, desc: `Torpeza en Digital: -${Math.round(getMasteryTorpezaPct(STATE.torpezas.digital) * 100)}% botín y EXP en cofres Digitales (USB).`, kind: 'torpeza', isTorpeza: true },
      { active: STATE.torpezas.vapor > 0, text: `🚰 Torpeza Vapor Lv.${STATE.torpezas.vapor} (-${Math.round(getMasteryTorpezaPct(STATE.torpezas.vapor) * 100)}%)`, shortText: `🚰 Lv.${STATE.torpezas.vapor}`, desc: `Torpeza en Vapor: -${Math.round(getMasteryTorpezaPct(STATE.torpezas.vapor) * 100)}% botín y EXP en cofres de Vapor.`, kind: 'torpeza', isTorpeza: true }
    ];

    // [0.089b] Efectos temporales / penalizaciones de los tratos del Trapero, en la misma barra
    const tempXp = STATE.xpBoostChestsLeft > 0, permXp = !!(STATE.traperoBuffs && STATE.traperoBuffs.bonusXp);
    perkList.push(
      { active: tempXp, text: `⭐ XP x${STATE.xpBoostChestsLeft}`, shortText: `⭐ x${STATE.xpBoostChestsLeft}`, desc: helpText('xpExtra', { n: STATE.xpBoostChestsLeft }), isTorpeza: false, isBoost: true },
      { active: permXp, text: `⭐ XP ∞`, shortText: `⭐ ∞`, desc: helpText('xpPermanente'), isTorpeza: false, isBoost: true },
      { active: STATE.harderPuzzlesLeft > 0, text: `💀 Puzles duros x${STATE.harderPuzzlesLeft}`, shortText: `💀 x${STATE.harderPuzzlesLeft}`, desc: `Pacto de la Sombra: los puzles son más difíciles durante los próximos ${STATE.harderPuzzlesLeft} cofres.`, isTorpeza: true },
      { active: !!(STATE.traperoBuffs && STATE.traperoBuffs.harderMinigames), text: `💀 Puzles duros ∞`, shortText: `💀 ∞`, desc: `Los puzles son más difíciles de forma permanente.`, isTorpeza: true },
      { active: !!STATE.picksBrokenOnUse, text: `🩹 Dedos Rotos`, shortText: `🩹`, desc: `Dedos Rotos: tus ganzúas se rompen al usarse (permanente).`, isTorpeza: true },
      { active: modOn('fiebre'), text: `🔥 Fiebre x${(STATE.mods||{}).fiebre}`, shortText: `🔥 x${(STATE.mods||{}).fiebre}`, desc: `Fiebre del Oro: GP x2 durante ${(STATE.mods||{}).fiebre} cofres más, pero cada cofre pide +1 herramienta.`, isBoost: true },
      { active: modOn('seda'), text: `🧤 Seda x${(STATE.mods||{}).seda}`, shortText: `🧤 x${(STATE.mods||{}).seda}`, desc: `Manos de Seda: los próximos ${(STATE.mods||{}).seda} fallos no gastan herramientas.`, isBoost: true },
      { active: modOn('solitario'), text: `🕯️ Solitarios x${(STATE.mods||{}).solitario}`, shortText: `🕯️ x${(STATE.mods||{}).solitario}`, desc: `Cofres Solitarios: 1 cofre por pantalla y +50% XP durante ${(STATE.mods||{}).solitario} cofres más.`, isBoost: true },
      { active: modOn('niebla'), text: `🌫️ Niebla x${(STATE.mods||{}).niebla}`, shortText: `🌫️ x${(STATE.mods||{}).niebla}`, desc: `Niebla Espesa: rareza oculta pero botín +40% durante ${(STATE.mods||{}).niebla} cofres más.`, isBoost: true },
      { active: modOn('congelada'), text: `🧊 Racha x${(STATE.mods||{}).congelada}`, shortText: `🧊 x${(STATE.mods||{}).congelada}`, desc: `Racha Congelada: tus próximos ${(STATE.mods||{}).congelada} fallos no rompen tu racha.`, isBoost: true },
      { active: modOn('relojBueno'), text: `⏳ Tiempo +50% x${(STATE.mods||{}).relojBueno}`, shortText: `⏳ x${(STATE.mods||{}).relojBueno}`, desc: `Reloj Lento: +50% de tiempo en los puzles durante ${(STATE.mods||{}).relojBueno} cofres más.`, isBoost: true },
      { active: modOn('hambre'), text: `🍽️ Hambre x${(STATE.mods||{}).hambre}`, shortText: `🍽️ x${(STATE.mods||{}).hambre}`, desc: `Hambre de XP: XP x2 pero sin GP durante ${(STATE.mods||{}).hambre} cofres más.`, kind: 'bad' },
      { active: modOn('destino'), text: `🎲 Destino`, shortText: `🎲`, desc: `Cofre del Destino: la próxima pantalla te deja elegir entre 3 cofres.`, isBoost: true },
      { active: modOn('relojMalo'), text: `⌛ Tiempo -30% x${(STATE.mods||{}).relojMalo}`, shortText: `⌛ x${(STATE.mods||{}).relojMalo}`, desc: `Reloj Roto: -30% de tiempo en los puzles durante ${(STATE.mods||{}).relojMalo} cofres más.`, isTorpeza: true },
      { active: STATE.heavyChestsLeft > 0, text: `📜 Contrato x${STATE.heavyChestsLeft}`, shortText: `📜 x${STATE.heavyChestsLeft}`, desc: `Contrato Leonino: los próximos ${STATE.heavyChestsLeft} cofres Raros o superiores piden +1 herramienta.`, isTorpeza: true }
    );
    const activePerks = perkList.filter(p => p.active);
    const activePerksCount = activePerks.length;
    const isCompact = activePerksCount >= 4;

    activePerks.forEach(p => {
      const badge = document.createElement('span');
      // [0.097] Código: forma = tipo (cuadrado = maestría/torpeza; píldora = perk o efecto), color = signo (azul/azul claro permanente, rojo torpeza, verde temporal bueno, naranja temporal malo o mixto)
      const kind = p.kind || (p.isBoost ? 'good' : p.isTorpeza ? 'bad' : 'perk');
      badge.className = "perk-badge pb-" + kind + " px-2 py-0.5 cursor-pointer select-none font-mono whitespace-nowrap shrink-0";   // [0.097b] sin zoom al pasar el ratón (el marco lo cortaba): sube el brillo
      badge.title = p.desc;
      badge.textContent = isCompact ? p.shortText : p.text;
      
      badge.addEventListener('click', () => {
        showPersistentFeedback(`ℹ️ ${p.desc}`);
      });

      perksBar.appendChild(badge);
    });

    if (activePerksCount > 0) perksBar.classList.remove('hidden');
    else perksBar.classList.add('hidden');
    // [0.095] Versión corta también cuando el texto completo no cabe en el ancho (antes solo con 4+ insignias)
    if (!isCompact && activePerksCount > 0 && perksBar.scrollWidth > perksBar.clientWidth + 1) {
      [...perksBar.children].forEach((b, i) => { if (activePerks[i]) b.textContent = activePerks[i].shortText; });
    }
  }

  const cntAuto = document.getElementById('cntAuto'); if (cntAuto) cntAuto.textContent = `x${STATE.abilities.auto}`;
  const cnt2x = document.getElementById('cnt2x'); if (cnt2x) cnt2x.textContent = `x${STATE.abilities.double}`;
  const cntShield = document.getElementById('cntShield'); if (cntShield) cntShield.textContent = `x${STATE.abilities.shield}`;
  const cntRisk = document.getElementById('cntRisk'); if (cntRisk) cntRisk.textContent = `x${STATE.abilities.riskPot}`;
  const cntPerdedor = document.getElementById('cntPerdedor'); if (cntPerdedor) cntPerdedor.textContent = `x${STATE.abilities.perdedor}`;
  const cntSummon = document.getElementById('cntSummon'); if (cntSummon) cntSummon.textContent = `x${STATE.abilities.summonDuende}`;

  const btnAutoEl = document.getElementById('abilityAutoBtn');
  const btn2xEl = document.getElementById('ability2xBtn');
  const btnShieldEl = document.getElementById('abilityShieldBtn');
  const btnRiskEl = document.getElementById('abilityRiskBtn');
  const btnPerdedorEl = document.getElementById('abilityPerdedorBtn');
  const btnSummonEl = document.getElementById('abilitySummonDuendeBtn');

  if (btnAutoEl) { if (STATE.abilities.auto <= 0) btnAutoEl.classList.add('hidden'); else btnAutoEl.classList.remove('hidden'); btnAutoEl.disabled = STATE.abilities.auto <= 0; }
  if (btn2xEl) { if (STATE.abilities.double <= 0) btn2xEl.classList.add('hidden'); else btn2xEl.classList.remove('hidden'); btn2xEl.disabled = STATE.abilities.double <= 0 || STATE.active2XMultiplier; }
  if (btnShieldEl) { if (STATE.abilities.shield <= 0) btnShieldEl.classList.add('hidden'); else btnShieldEl.classList.remove('hidden'); btnShieldEl.disabled = STATE.abilities.shield <= 0 || STATE.activeShield; }
  if (btnRiskEl) { if (STATE.abilities.riskPot <= 0) btnRiskEl.classList.add('hidden'); else btnRiskEl.classList.remove('hidden'); btnRiskEl.disabled = STATE.abilities.riskPot <= 0 || STATE.riskModeActive; }
  if (btnPerdedorEl) { if (STATE.abilities.perdedor <= 0) btnPerdedorEl.classList.add('hidden'); else btnPerdedorEl.classList.remove('hidden'); btnPerdedorEl.disabled = STATE.abilities.perdedor <= 0 || STATE.perdedorActive; }
  if (btnSummonEl) { if (STATE.abilities.summonDuende <= 0) btnSummonEl.classList.add('hidden'); else btnSummonEl.classList.remove('hidden'); btnSummonEl.disabled = STATE.abilities.summonDuende <= 0; }

  // [0.087b] Las cartas AUTO y DUENDE palpitan cuando ningún cofre en pantalla se puede abrir con las llaves actuales
  const blockedNow = STATE.screenChests.length > 0 && !isClimaxActive() && !STATE.screenChests.some(c => (STATE[c.type.consumible] || 0) >= getRequiredToolCount(c.rarity));   // [0.088] ya no cuenta la propia carta AUTO
  ['abilityAutoBtn', 'abilitySummonDuendeBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('card-pulse', !!blockedNow && !el.disabled && !el.classList.contains('hidden'));
  });

  fitHudTitle();
  trackKeyGains();
  updateShopResourcesUI();
  scheduleSave();
}

// [0.089b] Si el título no cabe junto a las insignias, pasa a "JOMC" en vez de partirse en dos líneas
function fitHudTitle() {
  const root = document.documentElement;
  const t = document.querySelector('.title-full');
  if (!t) return;
  root.classList.remove('title-compact');
  // [0.093] Por geometría: si el título completo invade el borde izquierdo del primer elemento a su derecha, se compacta (JOMC)
  // [0.095] Se compara SOLO con el grupo de insignias (2.º hijo de la fila de la cabecera); antes también contaba la barra de XP, que está justo debajo del título
  const tr = t.getBoundingClientRect();
  const row = t.closest('.justify-between');
  const limit = (row && row.children[1]) ? row.children[1].getBoundingClientRect().left : Infinity;
  if (tr.width > 0 && tr.right > limit - 6) root.classList.add('title-compact');   // [0.093b] (quitada la comprobación scrollWidth: en un <span> inline clientWidth es 0 y compactaba siempre)
}
window.addEventListener('resize', () => { try { fitHudTitle(); } catch (e) {} });
// [0.092] Recalcular también cuando cambia el ancho de las insignias (p. ej. x9 -> x17) o su contenido
(function watchHudTitle() {
  let raf = 0;
  const go = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; try { fitHudTitle(); } catch (e) {} }); };
  const hud = document.getElementById('persistentHUD');
  if (!hud) return;
  try { new ResizeObserver(go).observe(hud); } catch (e) {}
  try { new MutationObserver(go).observe(hud, { childList: true, characterData: true, subtree: true }); } catch (e) {}
})();

function updateShopResourcesUI() {
  const resHTML = `
    <span class="text-yellow-400 font-black"><i class="fa-solid fa-coins"></i> ${STATE.gold} GP</span>
    <span class="text-amber-400 font-black"><i class="fa-solid fa-key"></i> ${STATE.picks}</span>
    <span class="text-emerald-400 font-black"><i class="fa-solid fa-screwdriver"></i> ${STATE.proPicks}</span>
    <span class="text-cyan-400 font-black"><i class="fa-solid fa-microchip"></i> ${STATE.usb}</span>
    <span class="text-rose-400 font-black"><i class="fa-solid fa-faucet"></i> ${STATE.valves}</span>
  `;
  const mBar = document.getElementById('merchantResourceBar');
  const tBar = document.getElementById('traperoResourceBar');
  const curseHTML = STATE.cursedChestsLeft > 0 ? `<span class="text-rose-300 font-black" title="Cofres de maldición restantes"><i class="fa-solid fa-skull"></i> ${STATE.cursedChestsLeft}</span>` : '';
  if (mBar) mBar.innerHTML = resHTML;
  if (typeof shopHudSync === 'function' && modalVisible('merchantModal')) shopHudSync();   // [0.102] la barra de la tienda del Duende es copia de la del juego
  if (tBar) tBar.innerHTML = resHTML + curseHTML;   // [0.087b] el Trapero muestra los turnos de maldición
}
