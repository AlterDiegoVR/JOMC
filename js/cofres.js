// ==========================================================================
// JUST ONE MORE CHEST — cofres.js — VERSIÓN 0.202
// selección de cofres, banner, diálogos, post-its, botín y subida de nivel
// ==========================================================================

function generateScreenChests() {
  quadPicked = false; quadMarked = -1;
  STATE.screenChests = [];
  let chestCount = STATE.chestsOpened < 4 ? 1 : (Math.random() < 0.6 ? 2 : 3);
  const destino = modOn('destino') && !isClimaxActive();
  if (modOn('solitario')) chestCount = 1;   // [0.093] Cofres Solitarios
  // [0.104] Cofre del Destino: reparto 50% dos / 30% tres / 20% cuatro cofres (rarezas y tipos con las probabilidades normales)
  if (destino && STATE.chestsOpened >= 4) {
    const dc = DATOS_JUEGO.MODS_WILDCARD.DESTINO_REPARTO || { 2: 0.5, 3: 0.3, 4: 0.2 };
    const r0 = Math.random(); chestCount = r0 < dc[2] ? 2 : (r0 < dc[2] + dc[3] ? 3 : 4);
  }

  // [0.201] En el cofre 4 del nivel, cada tipo recién desbloqueado debe tener su cofre en pantalla (bucle 2+: nivel 3 = hackeo + tuberías)
  { const sinceF = STATE.chestsOpened - (STATE.chestsAtLevelUp || 0);
    const nF = DATOS_JUEGO.COFRES.ESTANDAR.filter(t => chestMinLevel(t) > 1 && STATE.level === chestMinLevel(t) && sinceF === 3).length;
    if (nF > chestCount && !modOn('solitario')) chestCount = nF; }

  for (let i = 0; i < chestCount; i++) {
    const availableTypes = DATOS_JUEGO.COFRES.ESTANDAR.filter(t => {
      const minLv = chestMinLevel(t);   // [0.201] depende del bucle (tuberías en el 3 y Arca de Neón en el 5 desde el bucle 2)
      if (minLv === 1) return true;
      if (STATE.level < minLv) return false;
      
      const chestsSinceLevelUp = STATE.chestsOpened - (STATE.chestsAtLevelUp || 0);
      if (STATE.level === minLv && chestsSinceLevelUp < 3) {
        return false;
      }
      return true;
    });

    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    let rarity = CHEST_RARITIES[0];
    if (STATE.chestsOpened >= 3) {
      const levelKey = Math.min(STATE.level, 4);
      const probMap = DATOS_JUEGO.PROBABILIDADES.RAREZAS_COFRES_POR_NIVEL[levelKey] || DATOS_JUEGO.PROBABILIDADES.RAREZAS_COFRES_POR_NIVEL[4];

      let pNormal = probMap.normal;
      let pRaro = probMap.raro;
      let pEpico = probMap.epico;
      let pLegendario = probMap.legendario;

      if (STATE.perks.rarityBonus > 0) {
        const bonus = STATE.perks.rarityBonus * 0.15;   // [0.105] 15% por nivel (como dice la carta)
        pNormal = Math.max(0.10, pNormal - bonus);

        if (pLegendario > 0) {
          pLegendario += bonus * 0.4;
          pEpico += bonus * 0.4;
          pRaro += bonus * 0.2;
        } else if (pEpico > 0) {
          pEpico += bonus * 0.6;
          pRaro += bonus * 0.4;
        } else if (pRaro > 0) {
          pRaro += bonus;
        }
      }

      const roll = Math.random();
      if (roll < pLegendario) rarity = CHEST_RARITIES[3];
      else if (roll < pLegendario + pEpico) rarity = CHEST_RARITIES[2];
      else if (roll < pLegendario + pEpico + pRaro) rarity = CHEST_RARITIES[1];
      else rarity = CHEST_RARITIES[0];
    }

    { const fogOn = modOn('niebla'); let rr = chestToolMods(rarity); if (fogOn) rr = Object.assign({}, rr, { fogOne: true });   // [0.202] con niebla TODO cofre cuesta 1 herramienta
      STATE.screenChests.push({ type: randomType, rarity: rr, fog: fogOn }); } chestHoldLift = false;   // [0.093] fog = rareza oculta
  }

  // [0.104] BALANCE: en el cofre 4 de cada nivel que desbloquea un tipo de puzle (3 cofres bloqueados + este), al menos un cofre en pantalla es del tipo recién desbloqueado.
  // La garantía se repite si la pantalla se regenera (reroll, luz misteriosa...) mientras sea ese mismo cofre.
  {
    const since = STATE.chestsOpened - (STATE.chestsAtLevelUp || 0);
    const forced = DATOS_JUEGO.COFRES.ESTANDAR.filter(t => chestMinLevel(t) > 1 && STATE.level === chestMinLevel(t) && since === 3);
    let used = [];
    forced.forEach(t => {
      const have = STATE.screenChests.findIndex((c, k) => c.type.id === t.id && !used.includes(k));   // [0.201] con dos tipos forzados, el que ya está en pantalla se reserva para no pisarlo
      if (have >= 0) { used.push(have); return; }
      const free = STATE.screenChests.map((c, k) => k).filter(k => !used.includes(k));
      if (!free.length) return;
      const k = free[Math.floor(Math.random() * free.length)];
      STATE.screenChests[k].type = t; used.push(k);
    });
  }

  STATE.activeChestIdx = 0;
  updateChestSelectionUI();
  if (typeof renderPlayerNotes === 'function') requestAnimationFrame(() => requestAnimationFrame(() => renderPlayerNotes()));   // [0.095]
}

function isClimaxActive() {
  const co = STATE.chestsOpened;
  const seqConfig = DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA;
  return STATE.climaxPhase || (!STATE.sequenceBroken && co >= (seqConfig.COFRE_CLIMAX_INICIO - 1));
}

// [0.105] Efectos que cambian las herramientas que pide CADA cofre: se tiran al generar la pantalla y se guardan en una copia de la rareza
function chestToolMods(rarity) {
  const oxi = STATE.oxidadoLeft > 0, fie = modOn('fiebre') && !isClimaxActive();
  if (!oxi && !fie) return rarity;
  const r = Object.assign({}, rarity);
  if (oxi) r.toolFixed = 1 + Math.floor(Math.random() * 3);
  if (fie) { const F = DATOS_JUEGO.MODS_WILDCARD.FIEBRE_ORO; r.toolExtra = Math.random() < (F.PROB_EXTRA != null ? F.PROB_EXTRA : 0.5) ? (F.HERRAMIENTAS_EXTRA || 1) : 0; }
  return r;
}

function getRequiredToolCount(rarity) {
  if (isClimaxActive()) return 0;
  if (rarity.fogOne) return 1;   // [0.202] Niebla Espesa: todos los cofres cuestan 1 herramienta

  let base = rarity.toolFixed != null ? rarity.toolFixed : (rarity.id === 'legendario' ? 2 : 1);   // [0.105] Cerrojos Oxidados fija 1-3
  if (STATE.heavyChestsLeft > 0 && rarity.id !== 'normal') {
    base += 1;
  }
  if (rarity.toolExtra) base += rarity.toolExtra;   // [0.105] Fiebre del Oro: tirada por cofre (50%) al generar la pantalla
  return base;
}

let quadMarked = -1;   // [0.106b] cofre marcado (primer toque) en la cuadrícula de 4
let quadPicked = false;   // [0.105] con 4 cofres, la cuadrícula 2x2 solo se ve hasta que eliges uno
function updateChestSelectionUI() {
  const multiGrid = document.getElementById('multiChestGrid');
  if (multiGrid) {
    multiGrid.innerHTML = '';
    multiGrid.classList.toggle('quad4', STATE.screenChests.length === 4 && !quadPicked);   // [0.104] 4 cofres: centrados en 2x2 con velo difuminado

    if (STATE.screenChests.length > 1) {
      multiGrid.classList.remove('hidden');
      STATE.screenChests.forEach((c, idx) => {
        const btn = document.createElement('button');
        const isSelected = idx === STATE.activeChestIdx;
        const quadMk = STATE.screenChests.length === 4 && !quadPicked && quadMarked === idx;   // [0.106b]
        btn.className = `${quadMk ? 'quad-mark ' : ''}p-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${chestVisRarity(c).border} ${isSelected ? 'bg-slate-800 scale-105 ring-2 ring-amber-400' : 'bg-slate-900/80 opacity-70'}`;
        btn.innerHTML = `
          <span class="text-[9px] font-extrabold font-mono" style="color: ${c.fog ? '#94a3b8' : c.rarity.color}">${c.fog ? '???' : c.rarity.name}</span>
          ${ART_ON && ASSETS.cofres[c.type.id] ? `<img src="${chestSpriteSrc(c.type, c.fog ? CHEST_RARITIES[0] : c.rarity)}" alt="" style="image-rendering:pixelated;width:44px;height:auto">` : '<i class="fa-solid fa-box text-sm"></i>'}
        `;
        btn.addEventListener('click', () => {
          audio.init();
          // [0.106b] Con 4 cofres: el primer toque solo marca (marco brillante) y el segundo sobre el mismo confirma
          if (STATE.screenChests.length === 4 && !quadPicked) {
            if (quadMarked === idx) { audio.playClick(0.8); quadPicked = true; quadMarked = -1; STATE.activeChestIdx = idx; updateChestSelectionUI(); return; }
            audio.playSwoosh(); quadMarked = idx; STATE.activeChestIdx = idx; updateChestSelectionUI(); return;
          }
          if (STATE.activeChestIdx !== idx) audio.playSwoosh(); else audio.playClick(0.5);   // [0.090] swoosh al cambiar de cofre
          STATE.activeChestIdx = idx;
          updateChestSelectionUI();
        });
        multiGrid.appendChild(btn);
      });
    } else {
      multiGrid.classList.add('hidden');
    }
  }

  const active = STATE.screenChests[STATE.activeChestIdx];
  if (active) {
    const badge = document.getElementById('chestRarityBadge');
    if (badge) {
      badge.textContent = active.fog ? '???' : active.rarity.name;
      badge.style.borderColor = active.fog ? '#94a3b8' : active.rarity.color;
      badge.style.color = active.fog ? '#94a3b8' : active.rarity.color;
    }

    const title = document.getElementById('chestTitle');
    if (title) title.textContent = active.type.nombre;

    const subtitle = document.getElementById('chestSubtitle');
    if (subtitle) subtitle.textContent = active.type.desc;

    const reqCount = getRequiredToolCount(active.rarity);
    // [0.088] singular y plural correctos ("1 PIN DE ACERO", "2 PINES DE ACERO")
    let toolTitle = reqCount === 1 ? "GANZÚA" : "GANZÚAS";
    if (active.type.consumible === 'proPicks') toolTitle = reqCount === 1 ? "PIN DE ACERO" : "PINES DE ACERO";
    if (active.type.consumible === 'usb') toolTitle = reqCount === 1 ? "LLAVE USB" : "LLAVES USB";
    if (active.type.consumible === 'valves') toolTitle = reqCount === 1 ? "VÁLVULA" : "VÁLVULAS";
    if (active.type.consumible === 'batteries') toolTitle = reqCount === 1 ? "PILA" : "PILAS";

    const reqEl = document.getElementById('chestCostRequirement');
    if (reqEl) {
      if (isClimaxActive()) {
        reqEl.className = "text-[10px] font-extrabold text-emerald-400 mb-3 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500 animate-pulse";
        reqEl.textContent = "REQUIERE: 0 (LIBRE)";
      } else if (active.rarity.id === 'legendario' || reqCount > 1) {
        reqEl.className = "text-[10px] font-extrabold text-amber-300 mb-3 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-400 animate-pulse";
        reqEl.textContent = `REQUIERE: ${reqCount} ${toolTitle}`;
      } else {
        reqEl.className = "text-[10px] font-bold text-amber-400 mb-3 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800";
        reqEl.textContent = `REQUIERE: ${reqCount} ${toolTitle}`;
      }
    }

    const btnText = document.getElementById('openChestBtnText');
    if (btnText) {
      if (active.type.juego === 'lockpick') btnText.textContent = `FORZAR CERRADURA (${reqCount})`;
      if (active.type.juego === 'tumbler') btnText.textContent = `USAR PIN (${reqCount})`;
      if (active.type.juego === 'hack') btnText.textContent = `CONECTAR USB (${reqCount})`;
      if (active.type.juego === 'pipe') btnText.textContent = `GIRAR VÁLVULA (${reqCount})`;
    }
  }

  updateUI();
}

// [0.087] Etiqueta al pasar el ratón + banner al pulsar (igual que las pasivas). El texto se actualiza en cada refresco.
function helpText(key, vars = {}) {
  let t = (DATOS_JUEGO.TEXTOS_AYUDA || {})[key] || '';
  t = t.replace('{min}', DATOS_JUEGO.ECONOMIA.RACHAS_APERTURA.MINIMO_PARA_BONUS).replace('{n}', vars.n != null ? vars.n : '');
  return t;
}
function setHelp(el, text) {
  el.title = text;
  el.dataset.helpText = text;
  el.classList.add('cursor-pointer');
  if (!el.dataset.helpBound) {
    el.dataset.helpBound = '1';
    el.addEventListener('click', () => { if (el.dataset.helpText) showPersistentFeedback(`ℹ️ ${el.dataset.helpText}`); });
  }
}

// [0.089b] delayKey (opcional): tipo de mensaje de "clic compulsivo". Las primeras VECES de cada tipo, por partida, el botón de cerrar aparece tras RETARDO_MS.
// [0.104] Resalta palabras clave de un texto (para quien lee en diagonal): devuelve HTML seguro. Listas en DATOS_JUEGO.PALABRAS_CLAVE
function kwHighlight(text) {
  const esc = String(text == null ? '' : text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cfg = DATOS_JUEGO.PALABRAS_CLAVE || {};
  if (cfg.ACTIVAR === false) return esc;
  const bad = (cfg.MALAS || []).join('|'), good = (cfg.BUENAS || []).join('|');
  const W = list => list && '(?<![\\p{L}])(?:' + list + ')(?![\\p{L}])';
  const re = new RegExp('(' + [W(bad), W(good), '[+\\-]?#?\\d+(?:[.,]\\d+)?(?:\\s?(?:cofres?|GP|XP|ganz[uú]as?|llaves?|segundos?|%))?'].filter(Boolean).join('|') + ')', 'giu');
  const badRe = bad ? new RegExp('^(?:' + bad + ')$', 'iu') : null;
  return esc.replace(re, m => `<b class="${badRe && badRe.test(m) ? 'kw kw-bad' : 'kw'}">${m}</b>`);
}
// [0.2] Tipo de aviso según su texto: MALDICIÓN/¡CUIDADO! (rojo), PREMIO (verde), AYUDA o AVISO (latón). Retrato pixel art del juego.
function fbVariant(raw) {
  const cfg = DATOS_JUEGO.PALABRAS_CLAVE || {};
  const has = list => { const l = (list || []).join('|'); return !!l && new RegExp('(?<![\\p{L}])(?:' + l + ')(?![\\p{L}])', 'iu').test(raw); };
  const bad = has(cfg.MALAS), curse = /maldici|trato injusto|castigo|trampa|robo|oscuridad|condena/i.test(raw);
  const gain = /recib|ganas|premio|regalo|obtien|\+\s?\d/i.test(raw) && has(cfg.BUENAS);   // «Ganzúa Perdida: recibes +5 ganzúas» es un premio aunque lleve «perdida»
  if (/^\s*ℹ️/.test(raw)) return { cls: '', seal: 'AYUDA', art: 'pergamino' };
  if (curse) return /maldici|trato|condena/i.test(raw) ? { cls: 'curse', seal: 'MALDICIÓN', art: 'trapero' } : { cls: 'curse', seal: '¡CUIDADO!', art: 'pergamino' };
  if (gain) return { cls: 'good', seal: 'PREMIO', art: 'duende' };
  if (bad) return { cls: 'curse', seal: '¡CUIDADO!', art: 'pergamino' };
  return { cls: '', seal: 'AVISO', art: 'pergamino' };
}
function fbApplyVariant(raw) {
  const card = document.getElementById('fbCard'), seal = document.getElementById('fbSeal'), img = document.getElementById('fbImg');
  if (!card) return;
  const v = fbVariant(raw);
  card.classList.toggle('curse', v.cls === 'curse'); card.classList.toggle('good', v.cls === 'good');
  if (seal) seal.textContent = v.seal;
  if (img) {
    const A = (typeof ASSETS !== 'undefined' && ASSETS) || {};
    const src = v.art === 'trapero' ? (A.trapero || {}).amenaza : v.art === 'duende' ? (A.duende || {}).alegre : (A.decoraciones || {}).pergamino;
    if (src) { img.src = src; img.parentElement.style.display = ''; } else img.parentElement.style.display = 'none';
  }
}
let acceptDelayTimer = null;
function showPersistentFeedback(message, delayKey = null) {
  const banner = document.getElementById('persistentFeedbackBanner');
  const txt = document.getElementById('feedbackText');
  const wasVisible = !!(banner && !banner.classList.contains('hidden'));
  const dBtn = document.getElementById('dismissFeedbackBtn');
  const dcfg = DATOS_JUEGO.ACEPTAR_RETARDADO || {};
  if (!wasVisible && dBtn) { clearTimeout(acceptDelayTimer); dBtn.style.visibility = ''; }
  if (!wasVisible && delayKey && dBtn && dcfg.ACTIVAR) {
    STATE.acceptDelayUses = STATE.acceptDelayUses || {};
    const used = STATE.acceptDelayUses[delayKey] || 0;
    if (used < (dcfg.VECES || 2)) {
      STATE.acceptDelayUses[delayKey] = used + 1;
      dBtn.style.visibility = 'hidden';
      acceptDelayTimer = setTimeout(() => { dBtn.style.visibility = ''; }, dcfg.RETARDO_MS || 2000);
    }
  }
  // [0.084] Si el banner ya está visible, el mensaje nuevo se añade debajo en lugar de taparlo
  // (así el aviso del cofre troll no lo pisan Perdedor / Escudo / Apuesta)
  const visible = banner && !banner.classList.contains('hidden');
  if (txt) {
    txt.style.whiteSpace = 'pre-line';
    const prev = txt.dataset.raw || txt.textContent;
    let raw;
    if (visible && prev && prev !== message && !prev.includes(message)) raw = prev + '\n\n' + message;
    else raw = message;
    txt.dataset.raw = raw;
    txt.innerHTML = kwHighlight(raw);   // [0.104] palabras clave resaltadas
    try { fbApplyVariant(raw); } catch (e) {}   // [0.2] sello, color y retrato según el tipo
  }
  if (banner) banner.classList.remove('hidden');
}

const dismissBtn = document.getElementById('dismissFeedbackBtn');
if (dismissBtn) {
  dismissBtn.addEventListener('click', () => {
    const banner = document.getElementById('persistentFeedbackBanner');
    if (banner) banner.classList.add('hidden');
  });
}

// [0.202] ¿Este cofre es un hueco libre para encontrar el Tomo? Bucle 1, nivel mínimo, ni visita del Duende o del Trapero ni subida de nivel en este cofre ni en el siguiente
function tomeSlotFree(co) {
  const T = DATOS_JUEGO.NARRATIVA.TOMO;
  if ((STATE.currentLoop || 1) !== 1 || STATE.level < T.NIVEL_MIN || tomeUnlocked() || STATE.pendingTraperoTome || co > T.COFRE_MAX) return false;
  if (STATE.xp >= STATE.xpNext || STATE.pendingTraperoLantern) return false;
  const V = DATOS_JUEGO.PROGRESIÓN.INTERVALOS_VISITAS, f = V.DUENDE_INTERVALO, lt = STATE.lastTraperoChest;
  const traperoAt = n => n === V.TRAPERO_PRIMER_COFRE || (lt > 0 && n - lt >= V.TRAPERO_INTERVALO);
  for (const n of [co, co + 1]) if (n % f === 0 || traperoAt(n)) return false;
  return true;
}
function triggerSequentialDialogue(speaker, speechText, iconClass, subtitleText, titleColorClass, giftObj = null, onComplete = null, itemSrc = null) {
  // [0.086] Las frases llevan su mood al final: "texto {alegre}". Se separa aquí y manda sobre el subtítulo.
  let taggedMood = null;
  if (typeof speechText === 'string') {
    const mm = speechText.match(/\s*\{([a-z_]+)\}\s*$/);
    if (mm) { taggedMood = mm[1]; speechText = speechText.slice(0, mm.index); }
  }
  try { audio.init(); audio.playDialogueMelody(speaker); } catch (e) {}   // [0.089b]
  const npcName = document.getElementById('npcName');
  if (npcName) {
    npcName.textContent = speaker;
    npcName.className = `text-xl font-black font-retro tracking-wide ${titleColorClass}`;
  }

  const npcSub = document.getElementById('npcSubtitle');
  if (npcSub) npcSub.textContent = subtitleText;

  const npcSpeech = document.getElementById('npcSpeechText');
  if (npcSpeech) npcSpeech.innerHTML = kwHighlight(speechText);   // [0.104] palabras clave resaltadas

  const npcIcon = document.getElementById('npcIcon');
  if (npcIcon) npcIcon.className = `fa-solid ${iconClass}`;

  const avatar = document.getElementById('npcAvatar');
  const speechBox = document.getElementById('npcSpeechText');
  const closeBtn = document.getElementById('closeDialogueBtn');

  if (avatar && speechBox && closeBtn) {
    if (speaker === "EL TRAPERO") {
      avatar.className = "w-14 h-14 rounded-2xl bg-rose-950 border border-rose-500 flex items-center justify-center text-2xl text-rose-400 shadow-xl";
      avatar.style.background = '#0b1d3f';   // [0.089b] fondo azul oscuro (la túnica es granate)
      speechBox.className = "w-full text-lg sm:text-xl font-mono leading-relaxed italic bg-rose-950/60 border border-rose-800/80 p-5 rounded-2xl shadow-inner text-center text-rose-200";
      closeBtn.className = "w-full py-4 bg-gradient-to-r from-rose-700 to-amber-700 active:from-rose-600 text-white font-extrabold text-sm rounded-2xl shadow-2xl border border-rose-500/40 cursor-pointer";
    } else {
      avatar.className = "w-14 h-14 rounded-2xl bg-purple-950 border border-purple-500 flex items-center justify-center text-2xl text-purple-400 shadow-xl";
      avatar.style.background = '';
      speechBox.className = "w-full text-lg sm:text-xl font-mono leading-relaxed italic bg-purple-950/60 border border-purple-800/80 p-5 rounded-2xl shadow-inner text-center text-purple-200";
      closeBtn.className = "w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 active:from-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-2xl border border-purple-400/40 cursor-pointer";
    }
  }

  // [0.085] Retrato pixel art del personaje (expresión según el contexto); sin arte, se queda el icono
  if (avatar) {
    const isTrap = speaker === "EL TRAPERO";
    const mood = isTrap
      ? ({ 'Condena Eterna': 'amenaza', 'Último Aviso': 'amenaza', 'Advertencia': 'alerta', 'Pre-Clímax': 'alerta', 'Sobre tu pulso': 'sonrisa' }[subtitleText] || 'base')
      : ({ 'Encuentro Casual': 'alegre' }[subtitleText] || 'base');
    const bank = isTrap ? ASSETS.trapero : ASSETS.duende;
    const src = ART_ON ? ((taggedMood && bank[taggedMood]) || bank[mood] || bank.base) : null;
    // [0.102] Personaje grande detrás del banner de texto (completo en PC, busto en móvil por CSS); con él, el retrato pequeño se sustituye por el icono
    const bigWrap = document.getElementById('npcBigWrap'), bigImg = document.getElementById('npcBigImg');
    const bigOn = !!(src && bigWrap && bigImg);
    if (bigWrap) {
      if (bigOn) { bigImg.src = src; bigWrap.classList.remove('hidden'); bigWrap.classList.toggle('trap', isTrap); }
      else bigWrap.classList.add('hidden');
    }
    // [0.104] Fondo de tienda + personaje de cuerpo entero abajo (texto arriba)
    const dlgM = document.getElementById('dialogueModal'), dlgFig = document.getElementById('dlgFig'), dlgScene = document.getElementById('dlgScene');
    if (dlgM) {
      dlgM.classList.toggle('dlg-shop', bigOn); dlgM.classList.toggle('dlg-t', bigOn && isTrap); dlgM.classList.toggle('dlg-d', bigOn && !isTrap);
      if (bigOn && dlgFig) {
        dlgFig.src = src;
        npcMotion(dlgFig, isTrap ? 'trapero' : 'duende', taggedMood || mood);   // [0.106]
        if (!isTrap && dlgScene && typeof shopImg === 'function') { shopArtInit(); const sc = shopImg('escena'); if (sc) dlgScene.src = sc; }
      }
    }
    let img = document.getElementById('npcPortraitImg');
    if (src && !bigOn) {
      if (!img) {
        img = document.createElement('img');
        img.id = 'npcPortraitImg';
        img.alt = '';
        img.style.cssText = 'image-rendering:pixelated;width:100%;height:100%;object-fit:contain';
        avatar.appendChild(img);
      }
      img.src = src;
      img.style.display = '';
      if (npcIcon) npcIcon.style.display = 'none';
      avatar.style.width = '84px'; avatar.style.height = '112px'; avatar.style.padding = '4px';
    } else {
      if (img) img.style.display = 'none';
      if (npcIcon) npcIcon.style.display = '';
      avatar.style.width = ''; avatar.style.height = ''; avatar.style.padding = '';
    }
  }

  // [0.202] Objeto de historia en grande (linterna, tomo) junto al personaje
  const dlgItem = document.getElementById('dlgItem');
  if (dlgItem) { if (itemSrc) { dlgItem.src = itemSrc; dlgItem.classList.remove('hidden'); } else dlgItem.classList.add('hidden'); }

  const giftContainer = document.getElementById('npcGiftContainer');
  if (giftContainer) {
    if (giftObj) {
      const giftTxt = document.getElementById('npcGiftText');
      if (giftTxt) giftTxt.textContent = `REGALO: ${giftObj.name}`;
      giftContainer.classList.remove('hidden');
    } else {
      giftContainer.classList.add('hidden');
    }
  }

  const modal = document.getElementById('dialogueModal');
  if (modal) modal.classList.remove('hidden');

  if (closeBtn) {
    const newBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newBtn, closeBtn);

    newBtn.addEventListener('click', () => {
      if (modal) modal.classList.add('hidden');
      if (dlgItem) dlgItem.classList.add('hidden');
      if (giftContainer) giftContainer.classList.add('hidden');
      if (typeof onComplete === 'function') {
        onComplete();
      } else {
        processNextQueuedEvent();
      }
    });
  }
}

// [0.087] El Trapero comenta que la maldición ha terminado (frase al azar de NARRATIVA.TRAPERO_FIN_MALDICION)
function queueCurseEndMessage() {
  const list = DATOS_JUEGO.NARRATIVA.TRAPERO_FIN_MALDICION || [];
  if (!list.length) { curseHold = false; return; }
  const phrase = list[Math.floor(Math.random() * list.length)];
  // [0.096] Va al FINAL de la cola de eventos del cofre; al cerrarse, la sala suelta el tinte con la animación completa
  STATE.eventQueue.push(() => triggerSequentialDialogue("EL TRAPERO", phrase, "fa-mask", "Maldición rota", "text-rose-400", null, () => { curseHold = false; processNextQueuedEvent(); }));
}

// [0.087] Coloca un post-it en cualquier punto de la sala (por debajo del HUD), esquivando solo la cerradura táctil
function placeStickyNote(note, container) {
  const cr = container.getBoundingClientRect();
  const hud = document.getElementById('persistentHUD');
  const topMin = hud ? Math.max(0, hud.getBoundingClientRect().bottom - cr.top) + 8 : cr.height * 0.22;   // [0.2] reflowNotes() lo mantiene si el HUD crece después
  const nw = note.offsetWidth, nh = note.offsetHeight;
  const xMax = Math.max(6, cr.width - nw - 6);
  const yMax = Math.max(topMin, cr.height * 0.80 - nh);
  const zone = CHEST_LOCK_ZONE;
  let x = 6, y = topMin;
  for (let i = 0; i < 25; i++) {
    x = 6 + Math.random() * (xMax - 6);
    y = topMin + Math.random() * (yMax - topMin);
    if (!zone) break;
    const nx = Math.max(x, Math.min(zone.x, x + nw)), ny = Math.max(y, Math.min(zone.y, y + nh));
    if (Math.hypot(nx - zone.x, ny - zone.y) > zone.r + 10) break;
  }
  note.style.left = `${Math.round(x)}px`;
  note.style.top = `${Math.round(y)}px`;
}


/* ==========================================================================
   [0.095] POST-ITS EN BLANCO (el jugador escribe) y sus "ecos" en los bucles siguientes
   ========================================================================== */
// [0.096] Lista (sin efectos) de los post-its de jugador que toca mostrar con co cofres abiertos
function playerNotesFor(co) {
  const cfg = DATOS_JUEGO.NOTAS_JUGADOR, out = [];
  if (!cfg || STATE.climaxPhase) return out;
  STATE.blankNotes = STATE.blankNotes || {};
  (cfg.COFRES || []).forEach(slot => {
    if (co === slot - 1) {   // eco: lo escrito en bucles anteriores (el del bucle 1 primero)
      for (let l = 1; l < (STATE.currentLoop || 1); l++) {
        const t = (STATE.blankNotes[l] || {})[slot];
        out.push({ kind: 'read', id: 'r' + l + '_' + slot, text: t || '' });
      }
    }
    if (co === slot) out.push({ kind: 'write', id: 'w' + slot, slot, written: false, text: '' });
  });
  // [0.202] Post-it de la contraseña: una vez por bucle, hasta que se elige la palabra
  const pw = DATOS_JUEGO.CONTRASENA, lp = Math.min(STATE.currentLoop || 1, 3);
  if (pw && co === pw.COFRE && pw.BUCLES[lp] && !(STATE.passWords || {})[lp]) out.push({ kind: 'pass', id: 'pw' + lp, loop: lp, written: false, text: '' });
  return out;
}

// [0.096] Los post-its de jugador se AÑADEN a los pendientes (sin vaciar los anteriores): duran hasta que el jugador los toque
function queuePlayerNotes(co) {
  STATE.pendingNotes = STATE.pendingNotes || [];
  playerNotesFor(co).forEach(p => { if (!STATE.pendingNotes.some(x => x.id === p.id)) STATE.pendingNotes.push(p); });
}

function clearPlayerNotes() {
  document.querySelectorAll('.scene-note').forEach(n => { n.classList.add('crumple-anim'); setTimeout(() => n.remove(), 350); });
  const ed = document.getElementById('noteEditor'); if (ed) ed.remove();
  STATE.pendingNotes = [];
}

function buildSceneNote(p) {
  const cfg = DATOS_JUEGO.NOTAS_JUGADOR || {};
  const el = document.createElement('div');
  el.className = 'sticky-note scene-note absolute p-2.5 rounded-lg text-[11px] font-bold font-mono pointer-events-auto cursor-pointer border border-amber-300 shadow-2xl z-20';
  el.dataset.nid = p.id;
  el.style.width = (cfg.ANCHO_PX || 210) + 'px';
  el.style.minHeight = '38px';
  el.style.visibility = 'hidden';
  if (p.kind === 'pass') el.classList.add('pass-note');   // [0.202] algo mayor, con brillo y parpadeo
  const fill = () => {
    if (p.kind === 'pass') { const B = DATOS_JUEGO.CONTRASENA.BUCLES[p.loop]; el.innerHTML = p.written ? '' : `${B.frase} <span class="pass-gap">${DATOS_JUEGO.CONTRASENA.HUECO}</span>`; if (p.written) { el.textContent = `"${B.frase} ${p.text}"`; el.classList.add('player-text'); el.classList.remove('pass-pending'); } else el.classList.add('pass-pending'); return; }
    if (p.kind === 'read' || p.written) { el.textContent = p.text ? `"${p.text}"` : ''; el.classList.add('player-text'); }   // [0.096] cursiva
    else el.innerHTML = '<span class="note-caret">|</span>';
  };
  fill();
  el.addEventListener('click', () => {
    if (p.kind === 'pass' && !p.written) { openPassEditor(el, p, fill); return; }   // [0.202]
    if (p.kind === 'write' && !p.written) { openNoteEditor(el, p, fill); return; }
    audio.playPaperRustle();
    el.classList.add('crumple-anim');
    setTimeout(() => el.remove(), 350);
    STATE.pendingNotes = (STATE.pendingNotes || []).filter(x => x.id !== p.id);
    saveDirty = true;
  });
  return el;
}

// [0.2] Borde inferior del HUD (barra de cartas incluida) en coordenadas del contenedor de post-its: por encima de él el clic lo recibe el HUD
function hudFloor(container) {
  const hud = document.getElementById('persistentHUD'); if (!hud) return 70;
  const cr = container.getBoundingClientRect();
  return Math.max(0, Math.ceil(hud.getBoundingClientRect().bottom - cr.top)) + 10;
}
// [0.2] El HUD crece cuando aparece la barra de cartas/bote: baja los post-its que hayan quedado debajo para que se puedan pulsar
let _reflowQueued = false;
function reflowNotes() {
  if (_reflowQueued) return; _reflowQueued = true;
  requestAnimationFrame(() => {
    _reflowQueued = false;
    const container = document.getElementById('notesContainer'); if (!container) return;
    const floor = hudFloor(container), cr = container.getBoundingClientRect();
    container.querySelectorAll('.sticky-note').forEach(n => {
      const top = parseFloat(n.style.top) || 0;
      if (top < floor) n.style.top = Math.round(floor) + "px";
    });
    try { positionSceneNotes(); } catch (e) {}
  });
}
window.addEventListener('resize', () => reflowNotes());

function positionSceneNotes() {
  const container = document.getElementById('notesContainer'); if (!container) return;
  const notes = [...container.querySelectorAll('.scene-note')]; if (!notes.length) return;
  const cr = container.getBoundingClientRect();
  const grid = document.getElementById('multiChestGrid'), card = document.getElementById('chestActionCard');
  const gridOn = grid && !grid.classList.contains('hidden') && grid.getBoundingClientRect().height > 0;
  const anchor = gridOn ? grid : card; if (!anchor) return;
  const ar = anchor.getBoundingClientRect();
  const cx = ar.left + ar.width / 2 - cr.left, topA = ar.top - cr.top, n = notes.length;
  notes.forEach((el, i) => {
    const w = el.offsetWidth, h = el.offsetHeight;
    const off = n === 1 ? 0 : (i - (n - 1) / 2) * Math.min(110, w * 0.55);
    el.style.left = Math.round(Math.max(6, Math.min(cr.width - w - 6, cx - w / 2 + off))) + 'px';
    el.style.top = Math.round(Math.max(hudFloor(container), topA - h - 10 - (n > 1 && i % 2 ? 12 : 0))) + 'px';   // [0.2] nunca bajo el HUD (que crece con la barra de cartas)
    el.style.setProperty('--rot', (n === 1 ? -2 : (i === 0 ? -4 : 3)) + 'deg');
    el.style.visibility = '';
  });
}

function renderPlayerNotes() {
  const container = document.getElementById('notesContainer'); if (!container) return;
  if (document.getElementById('noteEditor')) return;   // editando: no tocar
  container.querySelectorAll('.scene-note').forEach(n => n.remove());
  const list = STATE.pendingNotes || [];
  syncPassLock();   // [0.202]
  if (!list.length || STATE.climaxPhase) return;
  list.forEach(p => container.appendChild(buildSceneNote(p)));
  positionSceneNotes();
}
window.addEventListener('resize', () => { try { positionSceneNotes(); } catch (e) {} });

// [0.202] Bloqueo del juego mientras hay un post-it de contraseña sin resolver: solo se puede pulsar ese post-it y el botón de opciones
function passPending() { return (STATE.pendingNotes || []).some(p => p.kind === 'pass' && !p.written); }
function syncPassLock() {
  const host = uiHost(); if (!host) return;
  let bl = document.getElementById('passBlock');
  if (!passPending()) { if (bl) bl.remove(); host.classList.remove('pass-lock'); return; }
  host.classList.add('pass-lock');
  if (!bl) { bl = document.createElement('div'); bl.id = 'passBlock'; host.appendChild(bl); }
  // agujero (sin bloqueo) justo sobre el botón de opciones
  const ob = document.getElementById('optionsBtn'), hr = host.getBoundingClientRect();
  if (ob) {
    const r = ob.getBoundingClientRect(), x1 = Math.round(r.left - hr.left) - 2, y1 = Math.round(r.top - hr.top) - 2, x2 = Math.round(r.right - hr.left) + 2, y2 = Math.round(r.bottom - hr.top) + 2;
    bl.style.clipPath = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${x1}px ${y1}px, ${x1}px ${y2}px, ${x2}px ${y2}px, ${x2}px ${y1}px, ${x1}px ${y1}px)`;
  }
}
window.addEventListener('resize', () => { try { syncPassLock(); } catch (e) {} });

// [0.202] El post-it de la contraseña crece al centro; el hueco parpadea y al pulsarlo se despliega la lista de palabras. Hasta elegir una no hay X
function openPassEditor(noteEl, p, refill) {
  if (document.getElementById('noteEditor')) return;
  const CP = DATOS_JUEGO.CONTRASENA, B = CP.BUCLES[p.loop];
  const host = uiHost();
  audio.init(); audio.playPaperRustle();
  const ov = document.createElement('div');
  ov.id = 'noteEditor';
  ov.style.cssText = 'position:absolute;inset:0;z-index:10040;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0);transition:background .28s ease';
  const paper = document.createElement('div');
  paper.className = 'note-paper pass-paper';
  paper.innerHTML = `<button type="button" class="note-x" aria-label="Cerrar" style="display:none">✕</button>
    <div class="pass-phrase">${B.frase} <button type="button" class="pass-gap" aria-label="Elegir palabra">${CP.HUECO}</button></div>
    <div class="pass-list" aria-hidden="true">${B.palabras.map((w, i) => `<button type="button" class="pass-opt" data-i="${i}">${w}</button>`).join('')}</div>`;
  ov.appendChild(paper); host.appendChild(ov);
  const gap = paper.querySelector('.pass-gap'), list = paper.querySelector('.pass-list'), xBtn = paper.querySelector('.note-x');
  let chosen = null, open = false;
  const setOpen = on => { open = on; paper.classList.toggle('open', on); list.setAttribute('aria-hidden', on ? 'false' : 'true'); if (on) audio.playPaperRustle(); };
  gap.addEventListener('click', e => { e.stopPropagation(); setOpen(!open); });
  list.querySelectorAll('.pass-opt').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    chosen = B.palabras[+b.dataset.i];
    gap.textContent = chosen; gap.classList.add('chosen');
    list.querySelectorAll('.pass-opt').forEach(o => o.classList.toggle('sel', o === b));
    STATE.passWords = STATE.passWords || {}; STATE.passWords[p.loop] = chosen; saveDirty = true;   // se graba al elegir (se puede cambiar hasta cerrar)
    try { audio.playClick(0.6); } catch (err) {}
    xBtn.style.display = '';
    setOpen(false);
  }));
  // animación: del post-it pequeño al papel grande
  const fromR = noteEl.getBoundingClientRect(), toR = paper.getBoundingClientRect();
  const tf = (a, b) => `translate(${Math.round(a.left + a.width / 2 - (b.left + b.width / 2))}px, ${Math.round(a.top + a.height / 2 - (b.top + b.height / 2))}px) scale(${(a.width / b.width).toFixed(3)}, ${(a.height / b.height).toFixed(3)})`;
  paper.style.transition = 'none'; paper.style.transform = tf(fromR, toR); paper.style.opacity = '0.9';
  noteEl.style.visibility = 'hidden';
  void paper.offsetWidth;
  paper.style.transition = 'transform .32s cubic-bezier(.2,1.2,.4,1), opacity .2s'; paper.style.transform = ''; paper.style.opacity = '1';
  ov.style.background = 'rgba(0,0,0,.6)';
  let closing = false;
  xBtn.addEventListener('click', () => {
    if (closing || !chosen) return; closing = true;
    p.text = chosen; p.written = true; saveDirty = true;
    refill(); noteEl.style.height = ''; noteEl.style.visibility = 'hidden';
    syncPassLock(); positionSceneNotes(); noteEl.style.visibility = 'hidden';
    const back = noteEl.getBoundingClientRect(), cur = paper.getBoundingClientRect();
    paper.style.transition = 'transform .28s ease-in, opacity .25s ease-in';
    paper.style.transform = tf(back, cur); paper.style.opacity = '0.9';
    ov.style.background = 'rgba(0,0,0,0)';
    audio.playPaperRustle();
    setTimeout(() => { ov.remove(); noteEl.style.visibility = ''; }, 300);
  });
}

function openNoteEditor(noteEl, p, refill) {
  if (document.getElementById('noteEditor')) return;
  const cfg = DATOS_JUEGO.NOTAS_JUGADOR || {}, max = cfg.MAX_CARACTERES || 60;
  const host = uiHost();
  audio.init(); audio.playPaperRustle();
  const ov = document.createElement('div');
  ov.id = 'noteEditor';
  ov.style.cssText = 'position:absolute;inset:0;z-index:10040;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0);transition:background .28s ease';
  const paper = document.createElement('div');
  paper.className = 'note-paper';
  paper.innerHTML = '<button type="button" class="note-x" aria-label="Cerrar">✕</button><textarea rows="4" spellcheck="false" autocomplete="off"></textarea><div class="note-count"></div>';
  ov.appendChild(paper); host.appendChild(ov);
  const ta = paper.querySelector('textarea'), cnt = paper.querySelector('.note-count');
  ta.maxLength = max; ta.value = p.text || '';
  const upd = () => { cnt.textContent = ta.value.length + '/' + max; };
  upd();
  ta.addEventListener('input', upd);
  ta.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (!e.isComposing) close(); } if (e.key === 'Escape') close(); });   // [0.097b] Enter cierra y guarda como la X
  try { ta.focus(); } catch (e) {}   // dentro del gesto del toque: en móvil abre el teclado
  // animación: del post-it pequeño al papel grande
  const fromR = noteEl.getBoundingClientRect(), toR = paper.getBoundingClientRect();
  const tf = (a, b) => `translate(${Math.round(a.left + a.width / 2 - (b.left + b.width / 2))}px, ${Math.round(a.top + a.height / 2 - (b.top + b.height / 2))}px) scale(${(a.width / b.width).toFixed(3)}, ${(a.height / b.height).toFixed(3)})`;
  paper.style.transition = 'none'; paper.style.transform = tf(fromR, toR); paper.style.opacity = '0.9';
  noteEl.style.visibility = 'hidden';
  void paper.offsetWidth;
  paper.style.transition = 'transform .32s cubic-bezier(.2,1.2,.4,1), opacity .2s'; paper.style.transform = ''; paper.style.opacity = '1';
  ov.style.background = 'rgba(0,0,0,.6)';
  let closing = false;
  function close() {
    if (closing) return; closing = true;
    p.text = ta.value.replace(/\s+/g, ' ').trim().slice(0, max);
    p.written = true;
    STATE.blankNotes = STATE.blankNotes || {};
    const loop = STATE.currentLoop || 1;
    (STATE.blankNotes[loop] = STATE.blankNotes[loop] || {})[p.slot] = p.text;   // se graba SIEMPRE, esté como esté
    saveDirty = true;
    try { ta.blur(); } catch (e) {}
    refill(); noteEl.style.height = ''; noteEl.style.visibility = 'hidden';
    positionSceneNotes(); noteEl.style.visibility = 'hidden';
    const back = noteEl.getBoundingClientRect(), cur = paper.getBoundingClientRect();
    paper.style.transition = 'transform .28s ease-in, opacity .25s ease-in';
    paper.style.transform = tf(back, cur); paper.style.opacity = '0.9';
    ov.style.background = 'rgba(0,0,0,0)';
    audio.playPaperRustle();
    setTimeout(() => { ov.remove(); noteEl.style.visibility = ''; }, 300);
  }
  paper.querySelector('.note-x').addEventListener('click', close);
}

function spawnStickyNote() {
  if (STATE.climaxPhase || document.querySelectorAll('.sticky-note').length >= 5) return;

  const container = document.getElementById('notesContainer');
  if (!container) return;

  const note = document.createElement('div');
  note.className = 'sticky-note absolute p-2.5 rounded-lg text-[11px] font-bold font-mono pointer-events-auto cursor-pointer border border-amber-300 shadow-2xl z-20';
  
  const tier = getNarrativeTier();
  const loopKey = STATE.currentLoop === 2 ? 'BUCLE_2' : 'BUCLE_1';
  const list = DATOS_JUEGO.NARRATIVA.POST_ITS[loopKey][tier];
  const randomText = list[Math.floor(Math.random() * list.length)];
  note.textContent = `"${randomText}"`;

  note.style.visibility = 'hidden';

  note.addEventListener('click', () => {
    audio.playPaperRustle();
    note.classList.add('crumple-anim');
    setTimeout(() => note.remove(), 350);
  });

  container.appendChild(note);
  placeStickyNote(note, container);   // [0.087] posición libre por toda la sala (se mide una vez añadido)
  note.style.visibility = '';
}

/* ==========================================================================
   BOTÍN Y RECOMPENSAS
   ========================================================================== */

// [0.2] Estrella pixel art de la experiencia (único dibujo nuevo del botín)
const LOOT_STAR_SVG = '<svg class="star" viewBox="0 0 11 11"><g fill="#0c0f24"><rect x="4" y="0" width="3" height="11"/><rect x="0" y="4" width="11" height="3"/><rect x="1" y="1" width="9" height="9"/></g><g fill="#c7d2fe"><rect x="5" y="1" width="1" height="9"/><rect x="1" y="5" width="9" height="1"/><rect x="4" y="3" width="3" height="5"/><rect x="3" y="4" width="5" height="3"/></g><g fill="#818cf8"><rect x="5" y="4" width="1" height="3"/><rect x="4" y="5" width="3" height="1"/></g></svg>';
function triggerLootExplosion() {
  if (TEST_SERIES.active) { testPuzzleResult(true); return; }   // [0.090] Modo test: sin botín, pasa al siguiente puzle
  // 🟢 CERROJO ANTI-DUPLICACIÓN
  if (isLootProcessing) return;
  isLootProcessing = true;
  humHoldChest = STATE.screenChests[STATE.activeChestIdx] || null;   // [0.091] sin zumbido en la pantalla de botín

  try {
    minigameInProgress = false;
    stopMinigameTimer();
    const active = STATE.screenChests[STATE.activeChestIdx];
    if (!active) return;

    audio.playUnlockFanfare(active.rarity.id);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    const appBody = document.getElementById('appBody');
    if (appBody) appBody.classList.add('shake-screen');
    setTimeout(() => { if (appBody) appBody.classList.remove('shake-screen'); }, 400);

    const cx = canvas ? canvas.width / 2 : 400;
    const cy = canvas ? canvas.height / 2 : 300;
    spawnParticles(cx, cy, active.rarity.color, active.rarity.id === 'legendario' ? 100 : 50, active.rarity.id === 'legendario');

    STATE.chestsOpened++;
    if (isAutoOpenPhase()) { try { autoOpenFx(STATE.chestsOpened); } catch (e) {} }   // [0.104] más partículas, vibración y movimiento en la secuencia final
    // [0.096] Los post-its de jugador ya NO se borran solos: se quedan hasta que el jugador los toque
    statsAdd('chests', 1); if (puzzleStat) { statsPuzzle(puzzleStat, true); puzzleStat = null; }   // [0.090]
    STATE.opensByType = STATE.opensByType || {};
    STATE.opensByType[active.type.id] = (STATE.opensByType[active.type.id] || 0) + 1;
    STATE.cleanStreak++;
    checkAchievements();

    // CONSUMO DE GANZÚA POR TRATO "DEDOS ROTOS"
    if (active.type.consumible === 'picks' && STATE.picksBrokenOnUse) {
      const reqCount = getRequiredToolCount(active.rarity);
      STATE.picks = Math.max(0, STATE.picks - reqCount);
    }

    if (STATE.cursedChestsLeft > 0) {
      STATE.cursedChestsLeft--;
      if (STATE.cursedChestsLeft === 0) {
        STATE.salvageCurseActive = false;
        STATE.curseEndPending = true;   // [0.088] se encola al cobrar el botín
        curseHold = true;   // [0.096] el tinte aguanta hasta cerrar el mensaje
      }
    }
    // [CAMBIO] La Maldición de la Codicia se evalúa ANTES de descontar el contador, para que afecte a los 5 cofres
    const greedActive = STATE.greedCurseLeft > 0 && (active.rarity.id === 'epico' || active.rarity.id === 'legendario');
    const modsAtOpen = Object.assign({}, STATE.mods || {});   // [0.093] se evalúan antes de descontar
    if (STATE.mods) Object.keys(STATE.mods).forEach(k => { if (MODS_POR_USOS.includes(k)) return; if (STATE.mods[k] > 0) STATE.mods[k]--; if (STATE.mods[k] <= 0) delete STATE.mods[k]; });   // [0.096] Seda y Congelada no bajan por cofre
    const mo = id => modsAtOpen[id] > 0;
    if (STATE.heavyChestsLeft > 0) STATE.heavyChestsLeft--;
    if (STATE.greedCurseLeft > 0) STATE.greedCurseLeft--;
    if (STATE.harderPuzzlesLeft > 0) STATE.harderPuzzlesLeft--;
    if (STATE.extremePuzzlesLeft > 0) STATE.extremePuzzlesLeft--;   // [0.105]
    if (STATE.oxidadoLeft > 0) STATE.oxidadoLeft--;
    rechargeTick();

    let baseGpMin = DATOS_JUEGO.ECONOMIA.RECOMPENSAS_BASE.gp_min;
    let baseGpMax = DATOS_JUEGO.ECONOMIA.RECOMPENSAS_BASE.gp_max;
    let baseXpMin = DATOS_JUEGO.ECONOMIA.RECOMPENSAS_BASE.xp_min;
    let baseXpMax = DATOS_JUEGO.ECONOMIA.RECOMPENSAS_BASE.xp_max;

    // [0.085] Carta Perdedor: el botín se calcula como Legendario y se duplica (solo GP y XP)
    const perdedorLoot = !!STATE.perdedorLootPending;
    STATE.perdedorLootPending = false;
    const lootMultiplier = perdedorLoot ? CHEST_RARITIES[3].multiplier : active.rarity.multiplier;
    const lootRarityName = perdedorLoot ? CHEST_RARITIES[3].name : active.rarity.name;

    let baseGp = Math.floor((Math.random() * (baseGpMax - baseGpMin) + baseGpMin) * lootMultiplier);
    let baseXp = Math.floor((Math.random() * (baseXpMax - baseXpMin) + baseXpMin) * lootMultiplier);

    let gpLines = [];
    gpLines.push({ label: `Base ${lootRarityName}`, val: `+${baseGp} GP` });
    let finalGp = baseGp;

    const configRachas = DATOS_JUEGO.ECONOMIA.RACHAS_APERTURA;
    if (STATE.cleanStreak >= configRachas.MINIMO_PARA_BONUS) {
      let fixedBonus = STATE.cleanStreak >= 5 ? configRachas.NIVEL_5.fixedGp : configRachas.NIVEL_3.fixedGp;
      let pctBonus = STATE.cleanStreak >= 5 ? configRachas.NIVEL_5.pctGp : configRachas.NIVEL_3.pctGp;
      if (STATE.perks.goldStreak > 0) {
        fixedBonus += configRachas.BONUS_PERK_BOLSILLO.fixedExtra;
        pctBonus += configRachas.BONUS_PERK_BOLSILLO.pctExtra;
      }
      let streakBonusGp = fixedBonus + Math.floor(baseGp * pctBonus);
      finalGp += streakBonusGp;
      gpLines.push({ 
        label: `<span class="flex items-center gap-1.5"><i class="fa-solid fa-fire text-amber-500"></i> Racha x${STATE.cleanStreak}</span>`, 
        val: `+${streakBonusGp} GP` 
      });
    }

    let masteryLevel = 0;
    let torpezaLevel = 0;

    if (active.type.id === 'wooden') {
      masteryLevel = STATE.perks.bonusMadera || 0;
      torpezaLevel = STATE.torpezas.madera || 0;
    } else if (active.type.id === 'piston') {
      masteryLevel = STATE.perks.bonusAcero || 0;
      torpezaLevel = STATE.torpezas.acero || 0;
    } else if (active.type.id === 'cyber') {
      masteryLevel = STATE.perks.bonusDigital || 0;
      torpezaLevel = STATE.torpezas.digital || 0;
    } else if (active.type.id === 'hydraulic') {
      masteryLevel = STATE.perks.bonusVapor || 0;
      torpezaLevel = STATE.torpezas.vapor || 0;
    } else if (active.type.id === 'neon') {   // [0.202]
      masteryLevel = STATE.perks.bonusNeon || 0;
      torpezaLevel = STATE.torpezas.neon || 0;
    }

    if (masteryLevel > 0) {
      const pctM = getMasteryTorpezaPct(masteryLevel);
      let mGp = Math.floor(finalGp * pctM);
      finalGp += mGp;
      gpLines.push({ label: `⚙️ Maestría Lv.${masteryLevel} (+${Math.round(pctM * 100)}%)`, val: `+${mGp} GP` });
    }

    if (torpezaLevel > 0) {
      const pctT = getMasteryTorpezaPct(torpezaLevel);
      let tGp = Math.floor(finalGp * pctT);
      finalGp = Math.max(1, finalGp - tGp);
      gpLines.push({ label: `⚠️ Torpeza Lv.${torpezaLevel} (-${Math.round(pctT * 100)}%)`, val: `-${tGp} GP` });
    }

    if (STATE.perks.luckyLootChance > 0 && Math.random() <= STATE.perks.luckyLootChance) {
      finalGp *= 2;
      gpLines.push({ label: "🍀 Tipo con Suerte", val: "x2 GP" });
    }

    if (STATE.active2XMultiplier) {
      finalGp *= 2;
      gpLines.push({ label: "⚡ Bonus 2X", val: "x2 GP" });
    }

    if (perdedorLoot) {
      finalGp *= 2;
      gpLines.push({ label: "💀 Premio del Perdedor", val: "x2 GP" });
    }

    if (STATE.cursedChestsLeft > 0) {
      let penaltyGp = Math.floor(finalGp * DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.PENALIZACION_MULTIPLICADOR);
      finalGp = Math.max(1, finalGp - penaltyGp);
      gpLines.push({ label: "💀 Maldición (-50%)", val: `-${penaltyGp} GP` });
    }

    // [CAMBIO] Wildcard Maldición de la Codicia
    if (greedActive) {
      let penaltyGreed = Math.floor(finalGp * DATOS_JUEGO.ECONOMIA.MALDICION_CODICIA_PENALIZACION);
      finalGp = Math.max(1, finalGp - penaltyGreed);
      gpLines.push({ label: "🪙 Maldición de la Codicia (-50%)", val: `-${penaltyGreed} GP` });
    }

    // [0.082] Penalización por tanteo (Ganzúa, Bucle 2/3, Raro+): -30% GP y XP en una línea propia
    const tanteoPenalty = (active.type.juego === 'lockpick' && lpState.tanteoActive && lpState.tanteoUsed)
      ? DATOS_JUEGO.MINIJUEGOS.AVANZADO.LOCKPICK.PENALIZACION_TANTEO : 0;
    lpState.tanteoUsed = false;
    if (tanteoPenalty > 0) {
      let tanteoGp = Math.floor(finalGp * tanteoPenalty);
      finalGp = Math.max(1, finalGp - tanteoGp);
      gpLines.push({ label: DATOS_JUEGO.MINIJUEGOS.AVANZADO.LOCKPICK.ETIQUETA_RECIBO, val: `-${tanteoGp} GP` });
      const loopNow = Math.min(STATE.currentLoop || 1, 3);
      if (STATE.tanteoExplainedLoop !== loopNow) {
        STATE.tanteoExplainedLoop = loopNow;
        STATE.pendingTanteoPhrase = DATOS_JUEGO.MINIJUEGOS.AVANZADO.LOCKPICK.FRASE_TRAPERO[loopNow] || null;
      }
    }

    if (STATE.riskModeActive) {
      const aporteRiesgo = Math.floor(finalGp * 1.5);
      STATE.riskPot += aporteRiesgo;
      gpLines.push({ label: "🎲 Bote de Riesgo", val: `+${aporteRiesgo} GP (Total: ${STATE.riskPot})` });
    }

    let xpLines = [];
    xpLines.push({ label: `Base ${lootRarityName}`, val: `+${baseXp} XP` });
    let finalXp = baseXp;

    if (masteryLevel > 0) {
      const pctM = getMasteryTorpezaPct(masteryLevel);
      let mXp = Math.floor(finalXp * pctM);
      finalXp += mXp;
      xpLines.push({ label: `⚙️ Maestría Lv.${masteryLevel} (+${Math.round(pctM * 100)}%)`, val: `+${mXp} XP` });
    }

    if (torpezaLevel > 0) {
      const pctT = getMasteryTorpezaPct(torpezaLevel);
      let tXp = Math.floor(finalXp * pctT);
      finalXp = Math.max(0, finalXp - tXp);
      xpLines.push({ label: `⚠️ Torpeza Lv.${torpezaLevel} (-${Math.round(pctT * 100)}%)`, val: `-${tXp} XP` });
    }

    if (STATE.traperoBuffs.bonusXp) {
      const pctS = DATOS_JUEGO.ECONOMIA.TRAPERO.xp_pacto_pct;   // [0.105] 25% de verdad
      let sXp = Math.floor(finalXp * pctS);
      finalXp += sXp;
      xpLines.push({ label: "👁️ Pacto Sombra (+25%)", val: `+${sXp} XP` });
    }

    if (STATE.xpBoostChestsLeft > 0) {
      STATE.xpBoostChestsLeft--;
      const pctC = DATOS_JUEGO.ECONOMIA.TRAPERO.xp_pacto_pct;   // [0.105]
      let cXp = Math.floor(finalXp * pctC);
      finalXp += cXp;
      xpLines.push({ label: "✨ Impulso Trabajo (+25%)", val: `+${cXp} XP` });
    }

    if (STATE.active2XMultiplier) {
      finalXp *= 2;
      xpLines.push({ label: "⚡ Bonus 2X", val: "x2 XP" });
    }

    if (perdedorLoot) {
      finalXp *= 2;
      xpLines.push({ label: "💀 Premio del Perdedor", val: "x2 XP" });
    }

    if (STATE.cursedChestsLeft > 0) {
      let penaltyXp = Math.floor(finalXp * DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.PENALIZACION_MULTIPLICADOR);
      finalXp = Math.max(0, finalXp - penaltyXp);
      xpLines.push({ label: "💀 Maldición (-50%)", val: `-${penaltyXp} XP` });
    }

    if (tanteoPenalty > 0) {
      let tanteoXp = Math.floor(finalXp * tanteoPenalty);
      finalXp = Math.max(0, finalXp - tanteoXp);
      xpLines.push({ label: DATOS_JUEGO.MINIJUEGOS.AVANZADO.LOCKPICK.ETIQUETA_RECIBO, val: `-${tanteoXp} XP` });
    }

    if (STATE.noXpChestsLeft > 0) {
      STATE.noXpChestsLeft--;
      finalXp = 0;
      xpLines = [{ label: "🎨 Por Amor al Arte", val: "0 XP" }];
    }

    // [0.093] Modificadores de wildcard sobre el botín
    const MW = DATOS_JUEGO.MODS_WILDCARD;
    if (mo('fiebre')) { const add = finalGp * (MW.FIEBRE_ORO.GP_MULT - 1); finalGp += add; gpLines.push({ label: "🔥 Fiebre del Oro", val: `x${MW.FIEBRE_ORO.GP_MULT} GP` }); }
    if (mo('solitario') && finalXp > 0) { const a = Math.floor(finalXp * MW.SOLITARIOS.XP_PCT); finalXp += a; xpLines.push({ label: "🕯️ Cofre Solitario", val: `+${a} XP` }); }
    if (mo('niebla')) {
      const ag = Math.floor(finalGp * MW.NIEBLA.BOTIN_PCT), ax = Math.floor(finalXp * MW.NIEBLA.BOTIN_PCT);
      finalGp += ag; finalXp += ax;
      gpLines.push({ label: "🌫️ Niebla Espesa", val: `+${ag} GP` }); xpLines.push({ label: "🌫️ Niebla Espesa", val: `+${ax} XP` });
    }
    if (mo('hambre') && finalXp > 0) { finalXp *= MW.HAMBRE_XP.XP_MULT; xpLines.push({ label: "🍽️ Hambre de XP", val: `x${MW.HAMBRE_XP.XP_MULT} XP` }); }
    if (mo('hambre')) { finalGp = Math.floor(finalGp * MW.HAMBRE_XP.GP_MULT); gpLines.push({ label: "🍽️ Hambre de XP", val: "sin GP" }); }

    STATE.active2XMultiplier = false;
    STATE.gold += finalGp;
    STATE.xp += finalXp;

    // [0.2] Desglose línea a línea (mismas etiquetas de siempre): positivas en verde, negativas en rojo, multiplicadores en amarillo
    const lootLineCls = v => /^\s*\+/.test(v) ? 'p' : /^\s*(-|sin)/i.test(v) ? 'n' : 'm';
    const lootLines = L => '<div class="lt-sub">' + L.map(l => `<div><span>${l.label}</span><b class="${lootLineCls(String(l.val))}">${l.val}</b></div>`).join('') + '</div>';
    let gpLinesHTML = lootLines(gpLines);
    let xpLinesHTML = lootLines(xpLines);

    let extraLootHTML = "";
    let toolDropChance = DATOS_JUEGO.PROBABILIDADES.HERRAMIENTA_EXTRA_CHANCE;
    const chestsSinceLevelUp = STATE.chestsOpened - (STATE.chestsAtLevelUp || 0);
    const inGracePeriod = chestsSinceLevelUp < 3 && (STATE.level === 2 || STATE.level === 3 || STATE.level === 5);

    if (inGracePeriod) toolDropChance *= DATOS_JUEGO.PROBABILIDADES.MULTIPLICADOR_DROP_PERIODO_GRACIA;

    // [0.202] El Tomo: bucle 1, desde el nivel 5, en un hueco de cofres sin visitas ni subida de nivel; el Trapero lo comenta justo después
    if (tomeSlotFree(STATE.chestsOpened)) {
      STATE.pendingTraperoTome = true;
      extraLootHTML += `<div class="lt-extra text-amber-300"><span>${DATOS_JUEGO.NARRATIVA.TOMO.BANNER}</span></div>`;
    }
    // [0.201] Bucle 2, nivel 2, cofre 2: aparece la linterna (no funciona todavía) y, justo al cerrar el botín, el Trapero comenta el "cacharro"
    if ((STATE.currentLoop || 1) === 2 && STATE.level === 2 && !STATE.lanternFound && chestsSinceLevelUp === 2) {
      STATE.lanternFound = true; STATE.pendingTraperoLantern = true;
      extraLootHTML += `<div class="lt-extra text-sky-300"><span>${DATOS_JUEGO.NARRATIVA.LINTERNA.BANNER}</span></div>`;
    }

    // [0.082] Dedos Rotos activo: en un cofre NORMAL de madera la ganzúa extra baja a un % fijo (silencioso).
    // No se duplica en periodo de gracia; la herramienta nueva del periodo de gracia conserva su probabilidad original.
    const dedosRotosDrop = STATE.picksBrokenOnUse && active.rarity.id === 'normal' && active.type.id === 'wooden';
    let forcedDrop = null;      // si no es null, sustituye a la tirada normal
    let dropHappens;
    const GANZUA_DROP = { name: 'Ganzúa Básica', prop: 'picks', icon: 'fa-key', color: 'text-amber-400' };
    // [0.201] Herramientas nuevas del periodo de gracia según bucle: bucle 1 igual que siempre; bucle 2+: nivel 3 = USB y válvulas, nivel 5 = pilas
    const DROP_T = { proPicks: { name: 'Pin de Acero', prop: 'proPicks', icon: 'fa-screwdriver', color: 'text-emerald-400' }, usb: { name: 'Llave USB', prop: 'usb', icon: 'fa-microchip', color: 'text-cyan-400' },
      valves: { name: 'Válvula Hidráulica', prop: 'valves', icon: 'fa-faucet', color: 'text-rose-400' }, batteries: { name: 'Pila', prop: 'batteries', icon: 'fa-battery-half', color: 'text-sky-300' } };
    const graceProps = ((STATE.currentLoop || 1) >= 2 ? { 2: ['proPicks'], 3: ['usb', 'valves'], 5: ['batteries'] } : { 2: ['proPicks'], 3: ['usb'], 5: ['valves'] })[STATE.level] || [];
    const graceList = graceProps.map(k => DROP_T[k]).filter(t => t.prop !== 'batteries' || STATE.batteriesUnlocked);
    if (dedosRotosDrop) {
      const graceTool = (inGracePeriod && graceList.length) ? graceList[Math.floor(Math.random() * graceList.length)] : null;
      // Probabilidad original de la herramienta nueva en gracia: (25% x2) repartido entre 2 opciones = 25%
      const graceToolChance = graceTool ? toolDropChance / 2 : 0;
      // Una sola tirada: [0, graceToolChance) = herramienta nueva; el tramo siguiente = Ganzúa (así ambas conservan su % exacto)
      const dropRoll = Math.random();
      if (dropRoll < graceToolChance) forcedDrop = graceTool;
      else if (dropRoll < graceToolChance + DATOS_JUEGO.PROBABILIDADES.DEDOS_ROTOS_GANZUA_CHANCE) forcedDrop = GANZUA_DROP;
      dropHappens = forcedDrop !== null;
    } else {
      dropHappens = Math.random() < toolDropChance;
    }

    if (dropHappens) {
      let availableDrops = [];
      if (active.rarity.id === 'normal') {
        availableDrops = [{ name: 'Ganzúa Básica', prop: 'picks', icon: 'fa-key', color: 'text-amber-400' }];
      } else {
        availableDrops = [
          { name: 'Ganzúa Básica', prop: 'picks', icon: 'fa-key', color: 'text-amber-400' },
          { name: 'Pin de Acero', prop: 'proPicks', icon: 'fa-screwdriver', color: 'text-emerald-400' },
          { name: 'Llave USB', prop: 'usb', icon: 'fa-microchip', color: 'text-cyan-400' },
          { name: 'Válvula Hidráulica', prop: 'valves', icon: 'fa-faucet', color: 'text-rose-400' }
        ];
        if (STATE.batteriesUnlocked) availableDrops.push(DROP_T.batteries);   // [0.201] las pilas no existen hasta que el Duende da la primera
      }

      // [0.089] Sin válvulas en el botín hasta el nivel mínimo (bucle 2+: desde el nivel 3, con las tuberías)
      availableDrops = availableDrops.filter(d => d.prop !== 'valves' || STATE.level >= valvesDropLevel());

      if (inGracePeriod) graceList.forEach(t => availableDrops.push(t));

      const chosenDrop = forcedDrop || availableDrops[Math.floor(Math.random() * availableDrops.length)];
      STATE[chosenDrop.prop]++;
      extraLootHTML += `
        <div class="lt-extra ${chosenDrop.color}">
          <span><i class="fa-solid ${chosenDrop.icon}"></i> ${chosenDrop.name}</span>
          <b>+1</b>
        </div>
      `;
    }

    if (active.rarity.id === 'epico' || active.rarity.id === 'legendario' || Math.random() < DATOS_JUEGO.PROBABILIDADES.ADORNO_SALA_CHANCE) {
      const decorTextStr = spawnSpookyPerimeterDecoration();
      extraLootHTML += `
        <div class="lt-extra dc">
          <span>${decorTextStr}</span>
        </div>
      `;
    }

    const lootList = document.getElementById('lootList');
    if (lootList) {
      const A = (typeof ASSETS !== 'undefined' && ASSETS) || {};
      const coin = (A.tienda || {}).moneda || '';
      lootList.innerHTML = `
        <div>
          <div class="lt-row lt-gp top"><div class="lt-ri">${coin ? `<img src="${coin}" alt="">` : '<i class="fa-solid fa-coins"></i>'}</div><div class="lt-lab">ORO</div><div class="lt-am">+${finalGp} GP</div></div>
          ${gpLinesHTML}
        </div>
        <div>
          <div class="lt-row lt-xp top"><div class="lt-ri">${LOOT_STAR_SVG}</div><div class="lt-lab">EXPERIENCIA</div><div class="lt-am">+${finalXp} XP</div></div>
          ${xpLinesHTML}
        </div>
        ${extraLootHTML}
      `;
      // [0.2] Color, sello y cofre de la tarjeta según la rareza
      const LR = { normal: ['#94a3b8', '#475569', '#94a3b855'], raro: ['#3b82f6', '#1e3a8a', '#3b82f655'], epico: ['#a855f7', '#581c87', '#a855f755'], legendario: ['#f59e0b', '#78490c', '#f59e0b66'] }[active.rarity.id] || ['#c99a3a', '#6b4a2a', '#c99a3a55'];
      const lc = document.getElementById('lootCard');
      if (lc) { lc.style.setProperty('--ac', LR[0]); lc.style.setProperty('--ac2', LR[1]); lc.style.setProperty('--glow', LR[2]); }
      const ls = document.getElementById('lootSeal'); if (ls) ls.textContent = active.rarity.name;
      const li = document.getElementById('lootChestImg'), cs = chestLootSpriteSrc(active.type, active.rarity);   // [0.202]
      if (li) { if (cs) { li.src = cs; li.parentElement.style.display = ''; } else li.parentElement.style.display = 'none'; }
    }

    const lootTitle = document.getElementById('lootHeaderTitle');
    if (lootTitle) lootTitle.textContent = `¡BOTÍN ${active.rarity.name}!`;

    const lootModal = document.getElementById('lootModal');
    if (lootModal) lootModal.classList.remove('hidden');

    const seqConfig = DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA;
    if (!STATE.sequenceBroken && STATE.chestsOpened >= seqConfig.COFRE_AUTO_OPEN_INICIO && STATE.chestsOpened <= seqConfig.COFRE_AUTO_OPEN_FIN) {
      setTimeout(() => {
        const claimBtn = document.getElementById('claimLootBtn');
        if (claimBtn) claimBtn.click();
      }, 450);
    }

    if (!playerNotesFor(STATE.chestsOpened).length) spawnStickyNote();   // [0.096] el post-it del jugador SUSTITUYE al normal de ese turno
    updateUI();
  } finally {
    setTimeout(() => {
      isLootProcessing = false;
    }, 300);
  }
}

// [0.104] ¿Estamos en la parte automática de la secuencia final (cofres 101-110)?
function isAutoOpenPhase() {
  const c = DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA;
  return !STATE.sequenceBroken && STATE.climaxPhase && STATE.chestsOpened >= c.COFRE_AUTO_OPEN_INICIO && STATE.chestsOpened <= c.COFRE_AUTO_OPEN_FIN;
}
function processLevelUp(fromDeal) {
  // [CAMBIO] Si viene del Empujón Siniestro (fromDeal === true) la XP se trata según DATOS_JUEGO.ECONOMIA.TRAPERO.empujon_siniestro_xp
  if (fromDeal === true) {
    const modoXp = DATOS_JUEGO.ECONOMIA.TRAPERO.empujon_siniestro_xp;
    if (modoXp === 'perder') STATE.xp = 0;
    else if (modoXp === 'restar_con_minimo_cero') STATE.xp = Math.max(0, STATE.xp - STATE.xpNext);
    // 'conservar': la XP actual no cambia
  } else {
    STATE.xp -= STATE.xpNext;
  }
  STATE.xp = Math.max(0, STATE.xp);
  STATE.level++;
  STATE.chestsAtLevelUp = STATE.chestsOpened;
  STATE.xpNext = getXpForLevel(STATE.level);

  // [0.104] Subida de nivel rápida SOLO cuando la apertura de cofres ya es totalmente automática (cofres 101-110); antes de eso, subida normal
  if (isAutoOpenPhase()) {
    quickLevelUpFx();
    updateUI();
    if (STATE.xp >= STATE.xpNext) STATE.eventQueue.unshift(() => processLevelUp());   // si sobra XP para otro nivel, se repite el efecto
    processNextQueuedEvent();
    return;
  }

  const unlockKey = `nivel_${STATE.level}`;
  // [0.201] Bucle 2 en adelante: nivel 3 = USB + válvula (hackeo y tuberías a la vez); nivel 5 = primera pila (Arca de Neón). El bucle 1 no cambia.
  const loopB2 = (STATE.currentLoop || 1) >= 2 && DATOS_JUEGO.NARRATIVA.DUENDE_DESBLOQUEOS_BUCLE2[unlockKey];
  if (DATOS_JUEGO.NARRATIVA.DUENDE_DESBLOQUEOS[unlockKey] || loopB2) {
    let giftObj = null;
    if (STATE.level === 2) { STATE.proPicks += 1; giftObj = { name: "Pin de Acero", icon: "fa-screwdriver" }; }
    else if (STATE.level === 3 && loopB2) { STATE.usb += 1; STATE.valves += 1; giftObj = { name: "Llave USB + Válvula Hidráulica", icon: "fa-microchip" }; }
    else if (STATE.level === 3) { STATE.usb += 1; giftObj = { name: "Llave USB", icon: "fa-microchip" }; }
    else if (STATE.level === 5 && loopB2) { STATE.batteriesUnlocked = true; STATE.batteries += 1; giftObj = { name: "Pila", icon: "fa-battery-half" }; }
    else if (STATE.level === 5) { STATE.valves += 1; giftObj = { name: "Válvula Hidráulica", icon: "fa-faucet" }; }

    const speechText = loopB2 ? DATOS_JUEGO.NARRATIVA.DUENDE_DESBLOQUEOS_BUCLE2[unlockKey] : DATOS_JUEGO.NARRATIVA.DUENDE_DESBLOQUEOS[unlockKey];
    triggerSequentialDialogue(
      "EL DUENDE",
      speechText,
      "fa-hat-wizard",
      `¡DESBLOQUEO DE NIVEL ${STATE.level}!`,
      "text-purple-300",
      giftObj,
      () => {
        updateUI();
        triggerLevelUpChoice();
      }
    );
  } else {
    triggerLevelUpChoice();
  }
}

const claimLootBtn = document.getElementById('claimLootBtn');
if (claimLootBtn) {
  claimLootBtn.addEventListener('click', () => {
    const lootModal = document.getElementById('lootModal');
    if (isAutoOpenPhase()) killSceneVeil(); else showSceneVeil();   // [0.088] el telón entra antes de cerrar el botín; [0.104] en la secuencia automática NO hay telón (se ve la sala)
    if (lootModal) lootModal.classList.add('hidden');

    STATE.eventQueue = [];
    // [0.096] El mensaje de fin de maldición se encola al FINAL de los eventos de este cofre (ver más abajo)

    // [0.082] Explicación del Trapero sobre el tanteo (una vez por bucle), antes que cualquier otro evento
    if (STATE.pendingTanteoPhrase) {
      const tanteoPhrase = STATE.pendingTanteoPhrase;
      STATE.pendingTanteoPhrase = null;
      STATE.eventQueue.push(() => triggerSequentialDialogue("EL TRAPERO", tanteoPhrase, "fa-mask", "Sobre tu pulso", "text-rose-400"));
    }

    if (STATE.pendingTraperoLantern) {   // [0.201]
      STATE.pendingTraperoLantern = false;
      STATE.eventQueue.push(() => triggerSequentialDialogue("EL TRAPERO", DATOS_JUEGO.NARRATIVA.LINTERNA.TRAPERO, "fa-mask", "Un cacharro", "text-rose-400", null, null, ASSETS.objetos.linterna));   // [0.202] con la linterna en grande
    }
    if (STATE.pendingTraperoTome) {   // [0.202]
      STATE.pendingTraperoTome = false; setTomeUnlocked();
      STATE.eventQueue.push(() => triggerSequentialDialogue("EL TRAPERO", DATOS_JUEGO.NARRATIVA.TOMO.TRAPERO, "fa-mask", "Un viejo cuaderno", "text-rose-400", null, () => {
        if (typeof showPersistentFeedback === 'function') showPersistentFeedback(DATOS_JUEGO.NARRATIVA.TOMO.BANNER_OPCIONES);
        processNextQueuedEvent();
      }, ASSETS.objetos.tomo));
    }

    const isLevelUpPending = (STATE.xp >= STATE.xpNext);
    if (isLevelUpPending) {
      STATE.eventQueue.push(() => processLevelUp());
    }

    const co = STATE.chestsOpened;
    queuePlayerNotes(co);   // [0.095] post-its de jugador (se muestran al generar los cofres)
    const seqHist = DATOS_JUEGO.NARRATIVA.HISTORIA_SECUENCIA;
    const seqConfig = DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA;

    if (!STATE.sequenceBroken) {
      if (co === seqConfig.COFRE_INICIO_TRAPERO) {
        STATE.seqStage = 1;
        STATE.eventQueue.push(() => {
          triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_79_TRAPERO, "fa-mask", "Advertencia", "text-rose-400");
        });
      } else if (co === seqConfig.COFRE_CONSEJO_NO_COMPRAR) {
        STATE.seqStage = 2;
        STATE.eventQueue.push(() => {
          triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_84_TRAPERO, "fa-mask", "Instrucción", "text-rose-400");
        });
      } else if (co === seqConfig.COFRE_OFERTA_1) {
        STATE.eventQueue.push(() => triggerSpecialMerchantShop());
      } else if (co === seqConfig.COFRE_ADVERTENCIA_1 && STATE.traperoStrikes === 1) {
        STATE.eventQueue.push(() => {
          triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_86_TRAPERO, "fa-mask", "Último Aviso", "text-rose-500");
        });
      } else if (co === seqConfig.COFRE_REFUERZO && STATE.traperoStrikes === 0) {
        STATE.eventQueue.push(() => {
          triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_87_TRAPERO, "fa-mask", "Refuerzo", "text-rose-400");
        });
      } else if (co === seqConfig.COFRE_OFERTA_2) {
        STATE.eventQueue.push(() => triggerSpecialMerchantShop());
      } else if (co === seqConfig.COFRE_EVALUACION) {
        if (STATE.traperoStrikes >= 2) {
          STATE.sequenceBroken = true;
          STATE.eventQueue.push(() => {
            triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_89_TRAPERO_CONDENA, "fa-mask", "Condena Eterna", "text-rose-700");
          });
        } else {
          STATE.eventQueue.push(() => {
            triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_89_TRAPERO_PRECLIMAX, "fa-mask", "Pre-Clímax", "text-rose-400");
          });
        }
      } else if (co === seqConfig.COFRE_OFERTA_3) {
        STATE.eventQueue.push(() => triggerSpecialMerchantShop());
      } else if (co === seqConfig.COFRE_CLIMAX_INICIO) {
        // [0.105b] Se evalúan las compras de la última oferta (cofre 90)
        if (STATE.traperoStrikes >= 2) {
          seqCondemn();
        } else if (STATE.traperoStrikes === 1 && STATE.seqLastBuyCo === seqConfig.COFRE_OFERTA_3) {
          STATE.seqLastChance = true;   // compró solo en la última oferta: otra oportunidad
          STATE.eventQueue.push(() => {
            triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_91_TRAPERO_ULTIMA, "fa-mask", "Última Oportunidad", "text-rose-500");
          });
          STATE.eventQueue.push(() => triggerSpecialMerchantShop());
        } else {
          STATE.climaxPhase = true;
        }
      } else if (co === seqConfig.COFRE_COLAPSO_FINAL) {
        triggerSensoryOverloadCollapse();
        return;
      }
    }

    if (!STATE.climaxPhase && co < seqConfig.COFRE_CLIMAX_INICIO) {
      const duendeFreq = DATOS_JUEGO.PROGRESIÓN.INTERVALOS_VISITAS.DUENDE_INTERVALO;
      const isDuendeChest = (co % duendeFreq === 0) && ![seqConfig.COFRE_OFERTA_1, seqConfig.COFRE_OFERTA_2, seqConfig.COFRE_OFERTA_3].includes(co);

      if (isDuendeChest && (co < seqConfig.COFRE_INICIO_TRAPERO || STATE.sequenceBroken)) {
        if (co < 30) {
          STATE.eventQueue.push(() => triggerMerchantShopModalSequence());
        } else {
          const cycle = co / duendeFreq;
          if (cycle % 2 === 0) STATE.eventQueue.push(() => triggerMerchantShopModalSequence());
          else STATE.eventQueue.push(() => triggerDuendeNarrativeVisit());
        }
      }

      const primerTrapero = DATOS_JUEGO.PROGRESIÓN.INTERVALOS_VISITAS.TRAPERO_PRIMER_COFRE;
      const intervaloTrapero = DATOS_JUEGO.PROGRESIÓN.INTERVALOS_VISITAS.TRAPERO_INTERVALO;
      const isFirstTrapero = (co === primerTrapero);
      const isSubsequentTrapero = (STATE.lastTraperoChest > 0 && (co - STATE.lastTraperoChest >= intervaloTrapero));

      if ((isFirstTrapero || isSubsequentTrapero) && (co < seqConfig.COFRE_INICIO_TRAPERO || STATE.sequenceBroken) && !isDuendeChest) {
        STATE.lastTraperoChest = co;
        if (STATE.paranoiaStage === 0) STATE.paranoiaStage = 1;
        STATE.eventQueue.push(() => triggerTraperoShopSequence());
      }
    }

    if (STATE.curseEndPending) { STATE.curseEndPending = false; queueCurseEndMessage(); }   // [0.096] el último de todos los eventos del cofre
    if (!STATE.eventQueue.length) hideSceneVeil();   // [0.088] sin eventos, el telón se retira enseguida
    processNextQueuedEvent();
    generateScreenChests();

    if (!STATE.sequenceBroken && co >= 100 && co < seqConfig.COFRE_AUTO_OPEN_FIN) {
      setTimeout(() => {
        openActiveChest();   // [0.089] apertura automática: directa, sin doble toque
      }, 350);
    }
  });
}
