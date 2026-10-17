// ==========================================================================
// JUST ONE MORE CHEST — cofres.js — VERSIÓN 0.101
// selección de cofres, banner, diálogos, post-its, botín y subida de nivel
// ==========================================================================

function generateScreenChests() {
  STATE.screenChests = [];
  let chestCount = STATE.chestsOpened < 4 ? 1 : (Math.random() < 0.6 ? 2 : 3);
  const destino = modOn('destino') && !isClimaxActive();
  if (modOn('solitario')) chestCount = 1;   // [0.093] Cofres Solitarios
  if (destino) chestCount = 3;              // [0.093] Cofre del Destino: eliges entre 3 rarezas

  for (let i = 0; i < chestCount; i++) {
    const availableTypes = DATOS_JUEGO.COFRES.ESTANDAR.filter(t => {
      if (t.minNivel === 1) return true;
      if (STATE.level < t.minNivel) return false;
      
      const chestsSinceLevelUp = STATE.chestsOpened - (STATE.chestsAtLevelUp || 0);
      if (STATE.level === t.minNivel && chestsSinceLevelUp < 3) {
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
        const bonus = STATE.perks.rarityBonus * 0.10;
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

    if (destino) {   // [0.093]
      const ids = DATOS_JUEGO.MODS_WILDCARD.DESTINO_RAREZAS;
      rarity = CHEST_RARITIES.find(r => r.id === ids[i % ids.length]) || rarity;
    }
    STATE.screenChests.push({ type: randomType, rarity, fog: modOn('niebla') });   // [0.093] fog = rareza oculta
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

function getRequiredToolCount(rarity) {
  if (isClimaxActive()) return 0;

  let base = rarity.id === 'legendario' ? 2 : 1;
  if (STATE.heavyChestsLeft > 0 && rarity.id !== 'normal') {
    base += 1;
  }
  if (modOn('fiebre')) base += (DATOS_JUEGO.MODS_WILDCARD.FIEBRE_ORO.HERRAMIENTAS_EXTRA || 1);   // [0.093]
  return base;
}

function updateChestSelectionUI() {
  const multiGrid = document.getElementById('multiChestGrid');
  if (multiGrid) {
    multiGrid.innerHTML = '';

    if (STATE.screenChests.length > 1) {
      multiGrid.classList.remove('hidden');
      STATE.screenChests.forEach((c, idx) => {
        const btn = document.createElement('button');
        const isSelected = idx === STATE.activeChestIdx;
        btn.className = `p-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${c.rarity.border} ${isSelected ? 'bg-slate-800 scale-105 ring-2 ring-amber-400' : 'bg-slate-900/80 opacity-70'}`;
        btn.innerHTML = `
          <span class="text-[9px] font-extrabold font-mono" style="color: ${c.fog ? '#94a3b8' : c.rarity.color}">${c.fog ? '???' : c.rarity.name}</span>
          ${ART_ON && ASSETS.cofres[c.type.id] ? `<img src="${chestSpriteSrc(c.type, c.fog ? CHEST_RARITIES[0] : c.rarity)}" alt="" style="image-rendering:pixelated;width:44px;height:auto">` : '<i class="fa-solid fa-box text-sm"></i>'}
        `;
        btn.addEventListener('click', () => {
          audio.init();
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
    if (visible && txt.textContent && txt.textContent !== message && !txt.textContent.includes(message)) txt.textContent = txt.textContent + '\n\n' + message;
    else txt.textContent = message;
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

function triggerSequentialDialogue(speaker, speechText, iconClass, subtitleText, titleColorClass, giftObj = null, onComplete = null) {
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
  if (npcSpeech) npcSpeech.textContent = speechText;

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
    let img = document.getElementById('npcPortraitImg');
    if (src) {
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
  const topMin = hud ? Math.max(0, hud.getBoundingClientRect().bottom - cr.top) + 8 : cr.height * 0.22;
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
  const fill = () => {
    if (p.kind === 'read' || p.written) { el.textContent = p.text ? `"${p.text}"` : ''; el.classList.add('player-text'); }   // [0.096] cursiva
    else el.innerHTML = '<span class="note-caret">|</span>';
  };
  fill();
  el.addEventListener('click', () => {
    if (p.kind === 'write' && !p.written) { openNoteEditor(el, p, fill); return; }
    audio.playPaperRustle();
    el.classList.add('crumple-anim');
    setTimeout(() => el.remove(), 350);
    STATE.pendingNotes = (STATE.pendingNotes || []).filter(x => x.id !== p.id);
    saveDirty = true;
  });
  return el;
}

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
    el.style.top = Math.round(Math.max(70, topA - h - 10 - (n > 1 && i % 2 ? 12 : 0))) + 'px';
    el.style.setProperty('--rot', (n === 1 ? -2 : (i === 0 ? -4 : 3)) + 'deg');
    el.style.visibility = '';
  });
}

function renderPlayerNotes() {
  const container = document.getElementById('notesContainer'); if (!container) return;
  if (document.getElementById('noteEditor')) return;   // editando: no tocar
  container.querySelectorAll('.scene-note').forEach(n => n.remove());
  const list = STATE.pendingNotes || [];
  if (!list.length || STATE.climaxPhase) return;
  list.forEach(p => container.appendChild(buildSceneNote(p)));
  positionSceneNotes();
}
window.addEventListener('resize', () => { try { positionSceneNotes(); } catch (e) {} });

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
      const pctS = getMasteryTorpezaPct(1);
      let sXp = Math.floor(finalXp * pctS);
      finalXp += sXp;
      xpLines.push({ label: "👁️ Pacto Sombra (+25%)", val: `+${sXp} XP` });
    }

    if (STATE.xpBoostChestsLeft > 0) {
      STATE.xpBoostChestsLeft--;
      const pctC = getMasteryTorpezaPct(1);
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

    let gpLinesHTML = gpLines.map(l => `<div class="flex justify-between items-center text-xs font-mono text-amber-200/90"><span>${l.label}</span><span class="font-bold text-amber-300 whitespace-nowrap pl-2">${l.val}</span></div>`).join('');
    let xpLinesHTML = xpLines.map(l => `<div class="flex justify-between items-center text-xs font-mono text-indigo-200/90"><span>${l.label}</span><span class="font-bold text-indigo-300 whitespace-nowrap pl-2">${l.val}</span></div>`).join('');

    let extraLootHTML = "";
    let toolDropChance = DATOS_JUEGO.PROBABILIDADES.HERRAMIENTA_EXTRA_CHANCE;
    const chestsSinceLevelUp = STATE.chestsOpened - (STATE.chestsAtLevelUp || 0);
    const inGracePeriod = chestsSinceLevelUp < 3 && (STATE.level === 2 || STATE.level === 3 || STATE.level === 5);

    if (inGracePeriod) toolDropChance *= DATOS_JUEGO.PROBABILIDADES.MULTIPLICADOR_DROP_PERIODO_GRACIA;

    // [0.082] Dedos Rotos activo: en un cofre NORMAL de madera la ganzúa extra baja a un % fijo (silencioso).
    // No se duplica en periodo de gracia; la herramienta nueva del periodo de gracia conserva su probabilidad original.
    const dedosRotosDrop = STATE.picksBrokenOnUse && active.rarity.id === 'normal' && active.type.id === 'wooden';
    let forcedDrop = null;      // si no es null, sustituye a la tirada normal
    let dropHappens;
    const GANZUA_DROP = { name: 'Ganzúa Básica', prop: 'picks', icon: 'fa-key', color: 'text-amber-400' };
    if (dedosRotosDrop) {
      const graceTool = inGracePeriod ? (
        STATE.level === 2 ? { name: 'Pin de Acero', prop: 'proPicks', icon: 'fa-screwdriver', color: 'text-emerald-400' } :
        STATE.level === 3 ? { name: 'Llave USB', prop: 'usb', icon: 'fa-microchip', color: 'text-cyan-400' } :
        { name: 'Válvula Hidráulica', prop: 'valves', icon: 'fa-faucet', color: 'text-rose-400' }
      ) : null;
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
      }

      // [0.089] Sin válvulas en el botín hasta el nivel mínimo
      availableDrops = availableDrops.filter(d => d.prop !== 'valves' || STATE.level >= (DATOS_JUEGO.VALVULAS_NIVEL_MIN_BOTIN || 4));

      if (inGracePeriod) {
        if (STATE.level === 2) availableDrops.push({ name: 'Pin de Acero', prop: 'proPicks', icon: 'fa-screwdriver', color: 'text-emerald-400' });
        if (STATE.level === 3) availableDrops.push({ name: 'Llave USB', prop: 'usb', icon: 'fa-microchip', color: 'text-cyan-400' });
        if (STATE.level === 5) availableDrops.push({ name: 'Válvula Hidráulica', prop: 'valves', icon: 'fa-faucet', color: 'text-rose-400' });
      }

      const chosenDrop = forcedDrop || availableDrops[Math.floor(Math.random() * availableDrops.length)];
      STATE[chosenDrop.prop]++;
      extraLootHTML += `
        <div class="flex items-center justify-between ${chosenDrop.color} font-bold text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <span class="flex items-center gap-2"><i class="fa-solid ${chosenDrop.icon}"></i> ${chosenDrop.name}</span>
          <span class="text-sm font-black">+1</span>
        </div>
      `;
    }

    if (active.rarity.id === 'epico' || active.rarity.id === 'legendario' || Math.random() < DATOS_JUEGO.PROBABILIDADES.ADORNO_SALA_CHANCE) {
      const decorTextStr = spawnSpookyPerimeterDecoration();
      extraLootHTML += `
        <div class="flex items-center justify-between text-purple-300 font-bold text-xs bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/30">
          <span class="flex items-center gap-2 text-sm">${decorTextStr}</span>
        </div>
      `;
    }

    const lootList = document.getElementById('lootList');
    if (lootList) {
      lootList.innerHTML = `
        <div class="bg-amber-950/40 border border-amber-500/50 p-3 rounded-xl space-y-1">
          <div class="flex justify-between items-center text-amber-400 font-black text-xs border-b border-amber-500/30 pb-1 mb-1">
            <span class="flex items-center gap-1.5 whitespace-nowrap"><i class="fa-solid fa-coins"></i> MONEDAS DE ORO (GP)</span>
            <span class="text-sm font-black text-amber-300 whitespace-nowrap">+${finalGp} GP</span>
          </div>
          ${gpLinesHTML}
        </div>

        <div class="bg-indigo-950/40 border border-indigo-500/50 p-3 rounded-xl space-y-1">
          <div class="flex justify-between items-center text-indigo-400 font-black text-xs border-b border-indigo-500/30 pb-1 mb-1">
            <span class="flex items-center gap-1.5 whitespace-nowrap"><i class="fa-solid fa-star"></i> EXPERIENCIA (XP)</span>
            <span class="text-sm font-black text-indigo-300 whitespace-nowrap">+${finalXp} XP</span>
          </div>
          ${xpLinesHTML}
        </div>

        ${extraLootHTML}
      `;
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

  const unlockKey = `nivel_${STATE.level}`;
  if (DATOS_JUEGO.NARRATIVA.DUENDE_DESBLOQUEOS[unlockKey]) {
    let giftObj = null;
    if (STATE.level === 2) { STATE.proPicks += 1; giftObj = { name: "Pin de Acero", icon: "fa-screwdriver" }; }
    else if (STATE.level === 3) { STATE.usb += 1; giftObj = { name: "Llave USB", icon: "fa-microchip" }; }
    else if (STATE.level === 5) { STATE.valves += 1; giftObj = { name: "Válvula Hidráulica", icon: "fa-faucet" }; }

    const speechText = DATOS_JUEGO.NARRATIVA.DUENDE_DESBLOQUEOS[unlockKey];
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
    showSceneVeil();   // [0.088] el telón entra antes de cerrar el botín (sin destello de la habitación)
    if (lootModal) lootModal.classList.add('hidden');

    STATE.eventQueue = [];
    // [0.096] El mensaje de fin de maldición se encola al FINAL de los eventos de este cofre (ver más abajo)

    // [0.082] Explicación del Trapero sobre el tanteo (una vez por bucle), antes que cualquier otro evento
    if (STATE.pendingTanteoPhrase) {
      const tanteoPhrase = STATE.pendingTanteoPhrase;
      STATE.pendingTanteoPhrase = null;
      STATE.eventQueue.push(() => triggerSequentialDialogue("EL TRAPERO", tanteoPhrase, "fa-mask", "Sobre tu pulso", "text-rose-400"));
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
        STATE.climaxPhase = true;
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
