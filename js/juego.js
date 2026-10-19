// ==========================================================================
// JUST ONE MORE CHEST — juego.js — VERSIÓN 0.205
// arte del cofre abierto, subida de nivel, abrir cofre
// ==========================================================================

/* ==========================================================================
   CARTAS DE SUBIDA DE NIVEL
   ========================================================================== */

// [0.093] Cofre abierto en pixel art (dibujado por código, escalado x3): TAPA abierta por detrás de la carta y FRENTE por delante.
// Se generan una vez y se guardan como imágenes (data URI). Colores ajustables aquí.
let chestArt = null;
function makeChestArt() {
  if (chestArt) return chestArt;
  const k = 3, LW = 106;
  const C = { out: '#2a1608', d: '#5c3a1a', m: '#8a5a2b', l: '#b57d3f', hl: '#d9a15a', iron: '#3f4a5c', ironL: '#8795ab', gold: '#fbbf24', goldD: '#b45309', goldL: '#fff1a8', inner: '#241208', inner2: '#3a1f0c' };
  const mk = (h, draw) => {
    const cv = document.createElement('canvas'); cv.width = LW * k; cv.height = h * k;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    const R = (x, y, w, hh, col) => { g.fillStyle = col; g.fillRect(x * k, y * k, w * k, hh * k); };
    draw(R, h);
    return cv.toDataURL('image/png');
  };
  const bands = (R, h, y0, col, colL) => { [10, LW - 16].forEach(x => { R(x, y0, 6, h - y0, col); R(x, y0, 1, h - y0, colL); R(x + 5, y0, 1, h - y0, C.out); }); };
  const back = mk(16, (R, h) => {
    // tapa abierta (vista desde dentro): borde de madera con interior oscuro y aros de hierro
    R(6, 0, LW - 12, h, C.out);
    R(7, 1, LW - 14, h - 1, C.m); R(7, 1, LW - 14, 1, C.hl);
    R(9, 3, LW - 18, h - 3, C.inner); R(9, 3, LW - 18, 1, C.inner2);
    for (let x = 18; x < LW - 18; x += 14) R(x, 4, 1, h - 4, C.inner2);
    bands(R, h, 0, C.iron, C.ironL);
    R(6, 0, 3, 3, C.out); R(LW - 9, 0, 3, 3, C.out);
  });
  const front = mk(16, (R, h) => {
    R(0, 0, LW, h, C.out);
    R(1, 1, LW - 2, h - 2, C.m);
    R(1, 1, LW - 2, 2, C.gold); R(1, 1, LW - 2, 1, C.goldL); R(1, 3, LW - 2, 1, C.goldD);   // borde dorado: de ahí sale la luz
    for (let x = 18; x < LW - 8; x += 17) { R(x, 4, 1, h - 5, C.d); R(x + 1, 4, 1, h - 5, C.l); }
    R(1, h - 3, LW - 2, 2, C.d); R(1, h - 1, LW - 2, 1, C.out);
    for (let y = 6; y < h - 3; y += 4) { R(2, y, LW - 4, 1, C.l); }
    bands(R, h, 4, C.iron, C.ironL);
    [[12, 6], [12, 11], [LW - 14, 6], [LW - 14, 11]].forEach(([x, y]) => { R(x, y, 2, 2, C.ironL); });
    // cerradura dorada central
    const cx = LW / 2 - 6; R(cx, 3, 12, h - 5, C.out); R(cx + 1, 4, 10, h - 7, C.gold); R(cx + 1, 4, 10, 1, C.goldL); R(cx + 1, h - 4, 10, 1, C.goldD);
    R(cx + 5, 7, 2, 3, C.out); R(cx + 5, 10, 2, 2, C.out);
  });
  chestArt = { back, front };
  return chestArt;
}

// [0.093b] Fondo de mazmorra en pixel art (pared de piedra, cadenas con grilletes, calavera en una repisa). Se dibuja a la medida de la pantalla.
function makeDungeonBg() {
  // [0.096] Se dibuja con el tamaño del MARCO de juego (no de la ventana) y con el píxel de arte proporcional al ancho: en PC se ve igual que en móvil
  const host = (typeof uiHost === 'function') ? uiHost() : null;
  const frameW = (host && host.clientWidth) || window.innerWidth, frameH = (host && host.clientHeight) || window.innerHeight;
  const K = Math.max(4, Math.round(frameW / 105)), W = Math.ceil(frameW / K) + 2, H = Math.ceil(frameH / K) + 2;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  let seed = 90210; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); };
  const stones = ['#2b3040', '#303647', '#262b39', '#343b4d', '#2a2f3d'];
  R(0, 0, W, H, '#14171f');
  const bh = 9, bw = 20;
  for (let row = 0, y = 0; y < H; row++, y += bh) {
    let off = (row % 2) * (bw / 2) - (rnd() * 3 | 0);
    for (let x = -off; x < W; x += bw) {
      const w = bw - 1, c = stones[(rnd() * stones.length) | 0];
      R(x, y, w, bh - 1, c); R(x, y, w, 1, '#3d4559'); R(x, y + bh - 2, w, 1, '#1c2029');
      for (let i = 0; i < 3; i++) R(x + rnd() * w, y + 1 + rnd() * (bh - 3), 1, 1, rnd() < .5 ? '#232836' : '#3a4256');
      if (rnd() < 0.07) { R(x + 2, y + 2, 3 + rnd() * 4, 2, '#2f4a35'); R(x + 3, y + 4, 2, 1, '#3c5e44'); }   // musgo
    }
  }
  // cadena con grillete
  const chain = (x, len, cuff) => {
    for (let i = 0, y = 0; y < len; i++, y += 4) { const sh = i % 2; R(x + (sh ? 0 : 1), y, sh ? 3 : 1, 4, '#6b7385'); R(x + (sh ? 1 : 0), y + 1, 1, 2, '#14171f'); R(x + (sh ? 0 : 1), y, 1, 4, '#9aa3b8'); }
    if (cuff) { const y = len; R(x - 4, y, 11, 2, '#6b7385'); R(x - 5, y + 2, 2, 7, '#6b7385'); R(x + 6, y + 2, 2, 7, '#6b7385'); R(x - 4, y + 9, 11, 2, '#4b5263'); R(x - 3, y + 2, 1, 6, '#14171f'); R(x - 5, y + 2, 1, 6, '#9aa3b8'); R(x + 7, y + 3, 1, 5, '#14171f'); R(x - 1, y - 2, 3, 3, '#9aa3b8'); }
  };
  chain(Math.floor(W * 0.12), Math.floor(H * 0.20), true);
  chain(Math.floor(W * 0.86), Math.floor(H * 0.12), true);
  chain(Math.floor(W * 0.80), Math.floor(H * 0.26), false);
  // repisa con calavera (abajo a la derecha)
  const sx = Math.floor(W * 0.62), sy = Math.floor(H * 0.90);
  R(sx - 6, sy + 9, 32, 4, '#4b5263'); R(sx - 6, sy + 9, 32, 1, '#6b7385'); R(sx - 4, sy + 13, 28, 3, '#1c2029');
  const sk = [' wwwww ', 'wwwwwww', 'wkwwwkw', 'wkkwkkw', 'wwwkwww', ' wwwww ', ' wkwkw '];
  sk.forEach((rw, j) => [...rw].forEach((ch, i) => { if (ch === 'w') R(sx + 4 + i, sy + 2 + j, 1, 1, j === 0 ? '#e8e2cf' : '#cfc7ae'); else if (ch === 'k') R(sx + 4 + i, sy + 2 + j, 1, 1, '#14171f'); }));
  // viñeta y antorcha tenue (fuera de ser pared pura): oscurece los bordes
  const gr = g.createRadialGradient(W / 2, H * 0.3, W * 0.1, W / 2, H / 2, Math.max(W, H) * 0.75);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.72)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  return cv.toDataURL('image/png');
}

function lvlSpectacle() {
  const modal = document.getElementById('levelUpModal'); if (!modal) return;
  const cfg = DATOS_JUEGO.SUBIDA_NIVEL || {};
  try { modal.style.backgroundImage = `linear-gradient(rgba(6,8,16,.50), rgba(6,8,16,.62)), url('${makeDungeonBg()}')`; modal.style.backgroundSize = '100% 100%, 100% 100%'; modal.style.imageRendering = 'pixelated'; modal.style.backdropFilter = 'none'; } catch (e) {}
  let fx = document.getElementById('lvlFx');
  if (fx) fx.remove();
  fx = document.createElement('div'); fx.id = 'lvlFx';
  fx.innerHTML = '<div class="lvl-rays"></div><div class="lvl-flash"></div>';
  modal.insertBefore(fx, modal.firstChild);
  const cols = ['#fbbf24', '#fde68a', '#f59e0b', '#fff7cc', '#a5b4fc', '#34d399'];
  const n = cfg.LLUVIA_PIEZAS != null ? cfg.LLUVIA_PIEZAS : 46;
  for (let i = 0; i < n; i++) {
    const c = document.createElement('i');
    const coin = i % 3 !== 0, sz = coin ? 9 + Math.random() * 7 : 4 + Math.random() * 4;
    c.className = coin ? 'lvl-coin' : 'lvl-spark';
    c.style.cssText = `left:${Math.random() * 100}%;width:${sz}px;height:${coin ? sz : sz}px;background:${coin ? '#fbbf24' : cols[i % cols.length]};animation-duration:${1.5 + Math.random() * 2}s;animation-delay:${Math.random() * (cfg.LLUVIA_MS || 1400) / 1000}s;--rot:${(Math.random() * 720 - 360) | 0}deg`;
    fx.appendChild(c);
  }
  try { screenShake(cfg.SACUDIDA_PX != null ? cfg.SACUDIDA_PX : 9, cfg.SACUDIDA_MS || 520); } catch (e) {}
  lvlTimers.push(setTimeout(() => { fx.querySelectorAll('.lvl-coin, .lvl-spark, .lvl-flash').forEach(e => e.remove()); }, 5200));   // [0.104] la lluvia se acaba, los haces giratorios siguen hasta pulsar SIGUIENTE
}

// [0.103] Subida de nivel "al vuelo" durante la secuencia final: destello en la barra de XP, notas cortas y cartel que entra con zoom y se va rápido. No bloquea nada.
function quickLevelUpFx() {
  try { audio.init(); audio.playLevelUpQuick(); } catch (e) {}
  const bar = document.getElementById('xpBar');
  if (bar && bar.parentElement) { const c = bar.parentElement; c.classList.remove('xp-flash'); void c.offsetWidth; c.classList.add('xp-flash'); setTimeout(() => c.classList.remove('xp-flash'), 900); }
  // [0.104] Solo letras, más espectaculares (cada letra entra con zoom, brilla y se va), dibujadas ENCIMA de todo y sin fondo ni pantalla negra
  const host = (typeof uiHost === 'function') ? uiHost() : document.body;
  const letters = (txt, base) => [...txt].map((ch, i) => ch === ' ' ? '<span class="lq-sp"></span>' : `<span class="lq-l" style="animation-delay:${base + i * 38}ms,${base + 600 + i * 38}ms">${ch}</span>`).join('');
  const b = document.createElement('div');
  b.className = 'lvl-quick';
  b.innerHTML = `<div class="lq-row lq-t">${letters('SUBIDA DE NIVEL', 0)}</div><div class="lq-row lq-n">${letters('NIVEL ' + STATE.level, 260)}</div>`;
  host.appendChild(b);
  try { const cx = canvas ? canvas.width / 2 : 200, cy = canvas ? canvas.height * 0.33 : 200; spawnParticles(cx, cy, '#fbbf24', 55, false); spawnParticles(cx, cy, '#fff7cc', 30, false); } catch (e) {}
  try { screenShake(5, 380); } catch (e) {}
  setTimeout(() => b.remove(), 1900);
}

function triggerLevelUpChoice() {
  lvlClearTimers();
  const lvlNum = document.getElementById('levelUpNum'); 
  if (lvlNum) {
    lvlNum.textContent = `NIVEL ${STATE.level}`;
  }
  
  const modalHeader = document.querySelector('#levelUpModal h2, #levelUpModal .modal-title, #levelUpModal h3');
  if (modalHeader) {
    modalHeader.classList.remove('rainbow-text');   // [0.092] el degradado del título tapaba el número animado
    modalHeader.innerHTML = `<span class="text-xs font-mono font-bold text-indigo-400 block tracking-widest uppercase mb-1">¡HAS SUBIDO DE NIVEL!</span><span class="lvl-pop text-4xl sm:text-5xl font-black text-amber-400 tracking-wider font-retro block">NIVEL ${STATE.level}</span>`;
  }

  const grid = document.getElementById('levelUpCardsGrid') || document.getElementById('chestChoicesGrid'); 
  if (!grid) return;
  grid.innerHTML = '';
  const choices = document.getElementById('levelUpChoices'), nextBtn = document.getElementById('wildcardNextBtn');
  if (choices) choices.classList.add('hidden');
  if (nextBtn) { nextBtn.classList.remove('hidden'); nextBtn.classList.add('invisible'); }   // [0.095] su sitio queda reservado desde el principio: al aparecer no mueve la carta

  // [0.093] Banner viejo fuera al abrir (si no, se veía el resultado del nivel anterior hasta empezar la ruleta)
  const bn = document.getElementById('wildcardBanner'); if (bn) { bn.innerHTML = (typeof wcFirstSpinHtml === 'function') ? wcFirstSpinHtml() : ''; bn.className = 'wcard-host lvl-card-spin'; bn.style.minHeight = 'min(300px, 40vh)'; }   // [0.106b] desde el primer instante, carta neutra con marco (antes un hueco vacío)   // [0.104] hueco con fondo traslúcido desde el principio   // [0.095] hueco reservado y vacío (sin saltos de layout)
  { const lm = document.getElementById('levelUpModal'); if (lm) lm.style.overflowY = 'hidden'; }   // [0.096] sin barra de scroll mientras dura la animación (se reevalúa al acabar de aparecer las 3 mejoras)
  lvlSpectacle();
  // [0.092] Fanfarria + cartel; ruleta de wildcard (se aplica ya, se muestra al frenar); SIGUIENTE; y entonces las 3 mejoras como cofres abiertos
  try { audio.init(); audio.playLevelUpFanfare(); } catch (e) {}
  const wcRes = pickWildcard();
  updateUI();
  const revealChoices = () => {
    if (nextBtn) nextBtn.classList.add('hidden');   // en la pantalla de las 3 cartas ya no hace falta
    { const fxe = document.getElementById('lvlFx'); if (fxe) { fxe.style.transition = 'opacity .5s'; fxe.style.opacity = '0'; setTimeout(() => fxe.remove(), 520); } }   // [0.104] los haces se apagan al pasar a las 3 mejoras
    const bnr = document.getElementById('wildcardBanner'); if (bnr) bnr.classList.add('hidden');   // [0.093b] el evento ya se vio en su pantalla: se quita para que quepan las 3 cartas
    if (choices) choices.classList.remove('hidden');
    const step = (DATOS_JUEGO.SUBIDA_NIVEL || {}).ESCALONADO_COFRES_MS || 260;
    [...grid.children].forEach((el, i) => {
      el.style.opacity = '0';
      lvlTimers.push(setTimeout(() => { el.style.opacity = ''; el.classList.add('lvl-chest-in'); try { audio.playCardRise(); } catch (e) {} }, 120 + i * step));
    });
    // [0.096] Cuando termina la animación de aparición: scroll solo si de verdad no cabe
    lvlTimers.push(setTimeout(() => { const lm = document.getElementById('levelUpModal'); if (lm) lm.style.overflowY = (lm.scrollHeight > lm.clientHeight + 4) ? 'auto' : 'hidden'; }, 120 + 3 * step + 900));
  };
  lvlTimers.push(setTimeout(() => runWildcardRoulette(wcRes, () => {
    if (!nextBtn) { revealChoices(); return; }
    nextBtn.classList.remove('invisible');
    nextBtn.onclick = () => { try { audio.playUiClick(); } catch (e) {} revealChoices(); };
  }), 1300));

  const pool = [...DATOS_JUEGO.CARTAS_NIVEL.PASIVAS, ...DATOS_JUEGO.CARTAS_NIVEL.TACTICAS].filter(c => !c.minBucle || (STATE.currentLoop || 1) >= c.minBucle).sort(() => 0.5 - Math.random()).slice(0, 3);

  pool.forEach(cardData => {
    let currentLvl = 0;
    if (cardData.id === 'clasico') currentLvl = STATE.perks.bonusMadera || 0;
    if (cardData.id === 'mecanico') currentLvl = STATE.perks.bonusAcero || 0;
    if (cardData.id === 'informatico') currentLvl = STATE.perks.bonusDigital || 0;
    if (cardData.id === 'fontanero') currentLvl = STATE.perks.bonusVapor || 0;
    if (cardData.id === 'electricista') currentLvl = STATE.perks.bonusNeon || 0;

    let descText = cardData.desc;
    let titleText = cardData.titulo;

    if (currentLvl > 0) {
      const nextLvl = currentLvl + 1;
      const nextPct = Math.round(getMasteryTorpezaPct(nextLvl) * 100);
      descText = `Sube a Nivel ${nextLvl} (+${nextPct}% botín y EXP).`;
      titleText = `${cardData.titulo} (Lv.${currentLvl} ➔ ${nextLvl})`;
    } else if (['clasico', 'mecanico', 'informatico', 'fontanero', 'electricista'].includes(cardData.id)) {
      const basePct = Math.round(DATOS_JUEGO.ECONOMIA.PORCENTAJE_MAESTRIA_TORPEZA_BASE * 100);
      descText = `Nivel 1: +${basePct}% de botín y EXP en sus cofres.`;
    }

    // [0.092] Cofre abierto (dibujo provisional: el frontal del cofre de madera recorta la parte baja de la carta) con la carta dentro
    const cardEl = document.createElement('button');
    cardEl.className = "lvl-chest group cursor-pointer active:scale-95 transition-transform";
    const art = makeChestArt();
    cardEl.innerHTML = `
      <div class="lvl-chest-glow"></div>
      <div class="lvl-sparks"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="lvl-chest-back" style="background-image:url('${art.back}')"></div>
      <div class="lvl-card bg-slate-900 border border-indigo-500/60 rounded-xl flex items-center gap-2.5 text-left shadow-xl group-hover:border-indigo-300">
        <div class="w-10 h-10 flex-none rounded-xl bg-indigo-950 border border-indigo-500 flex items-center justify-center text-indigo-400 text-lg">
          <i class="fa-solid ${cardData.icono}"></i>
        </div>
        <div class="min-w-0">
          <span class="text-[9px] font-extrabold font-mono uppercase px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded-full border border-indigo-800">${cardData.tipo}</span>
          <div class="text-white font-black text-xs mt-1">${titleText}</div>
          <div class="text-[10px] text-slate-400 font-mono mt-0.5">${descText}</div>
        </div>
      </div>
      <div class="lvl-chest-front" style="background-image:url('${art.front}')"></div>
    `;

    cardEl.addEventListener('click', () => {
      lvlClearTimers();
      audio.playUnlockFanfare('raro');
      
      if (cardData.tipo === 'PERK') {
        if (cardData.id === 'mano_firme') STATE.perks.sweetSpot++;
        if (cardData.id === 'ojo_cazador') STATE.perks.rarityBonus++;
        if (cardData.id === 'regateador') STATE.perks.discount++;
        if (cardData.id === 'pistones_lentos') STATE.perks.slowerPistons++;
        if (cardData.id === 'fondo_bolsillo') STATE.perks.goldStreak++;
        if (cardData.id === 'hombre_tranquilo') STATE.perks.extraTime += cardData.valor;
        if (cardData.id === 'oido_clinico') STATE.perks.oidoClinico = 1;
        if (cardData.id === 'ladron') STATE.perks.shopStealFree = true;
        if (cardData.id === 'tipo_con_suerte') STATE.perks.luckyLootChance = cardData.valor;
        if (cardData.id === 'clasico') STATE.perks.bonusMadera = (STATE.perks.bonusMadera || 0) + 1;
        if (cardData.id === 'mecanico') STATE.perks.bonusAcero = (STATE.perks.bonusAcero || 0) + 1;
        if (cardData.id === 'informatico') STATE.perks.bonusDigital = (STATE.perks.bonusDigital || 0) + 1;
        if (cardData.id === 'fontanero') STATE.perks.bonusVapor = (STATE.perks.bonusVapor || 0) + 1;
        if (cardData.id === 'electricista') STATE.perks.bonusNeon = (STATE.perks.bonusNeon || 0) + 1;
      } else {
        if (cardData.id === 'auto_open') STATE.abilities.auto++;
        if (cardData.id === 'doble_2x') STATE.abilities.double++;
        if (cardData.id === 'escudo') STATE.abilities.shield++;
        if (cardData.id === 'apuesta_riesgo') STATE.abilities.riskPot++;
        if (cardData.id === 'carta_perdedor') STATE.abilities.perdedor++;
        if (cardData.id === 'invocar_duende') STATE.abilities.summonDuende++;
      }

      const levelUpModal = document.getElementById('levelUpModal'); if (levelUpModal) levelUpModal.classList.add('hidden');
      updateUI();

      if (STATE.xp >= STATE.xpNext) {
        STATE.eventQueue.unshift(() => processLevelUp());
      }
      processNextQueuedEvent();
    });

    grid.appendChild(cardEl);
  });

  const levelUpModal = document.getElementById('levelUpModal'); if (levelUpModal) levelUpModal.classList.remove('hidden');
}

/* ==========================================================================
   INTERACCIÓN PRINCIPAL ("FORZAR CERRADURA")
   ========================================================================== */

const openChestBtn = document.getElementById('openChestBtn') || document.getElementById('openActiveChestBtn');

// [0.089] Lógica de apertura (antes dentro del clic del botón). La usan el segundo toque, la cerradura y la apertura automática.
function openActiveChest() {
    const active = STATE.screenChests[STATE.activeChestIdx];
    if (!active) return;

    audio.init();
    audio.playLockOpen(active.type.id);   // [0.087] sonido al abrir (botón o cerradura táctil), propio de cada tipo

    const co = STATE.chestsOpened;

    if (co >= 95 && co < DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA.COFRE_COLAPSO_FINAL && STATE.climaxPhase) {
      const containers = ['lockpickContainer', 'tumblerContainer', 'hackContainer', 'pipeContainer', 'sequenceContainer', 'fuseContainer'];
      containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });
      const minigameModal = document.getElementById('minigameModal');
      if (minigameModal) minigameModal.classList.add('hidden');

      triggerLootExplosion();
      return;
    }

    const staleHelp = document.getElementById('pipeAdvancedHelp'); if (staleHelp) staleHelp.remove();   // [0.105b] el aviso de bombas de las tuberías no debe quedarse en otros puzles
    const reqCount = getRequiredToolCount(active.rarity);
    const toolProp = active.type.consumible;

    if (STATE[toolProp] < reqCount) {
      if (checkCanOpenAnyChestOnScreen()) {
        showPersistentFeedback(`⚠️ No tienes suficientes herramientas para este cofre. Selecciona otro o usa una carta táctica.`);
      } else {
        checkGameOver();
      }
      return;
    }

    const containers = ['lockpickContainer', 'tumblerContainer', 'hackContainer', 'pipeContainer', 'sequenceContainer', 'fuseContainer'];
    containers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    const minigameTitle = document.getElementById('minigameTitle');
    if (minigameTitle) minigameTitle.textContent = active.type.nombre;
    pzHardBadgeUpdate();   // [0.105] aviso de puzle endurecido/extremo
    { const mm0 = document.getElementById('minigameModal'); if (mm0) mm0.classList.remove('pz-seq'); }   // [0.201] startSequenceGame lo vuelve a poner
    setPuzzleBackground(active.type.juego);   // [0.101] imagen de ambiente detrás del puzle

    if (active.type.juego === 'lockpick') startLockpickGame();
    else if (active.type.juego === 'tumbler') startTumblerGame();
    else if (active.type.juego === 'hack') startHackGame();
    else if (active.type.juego === 'pipe') startPipeGame();
    else if (active.type.juego === 'sequence') startSequenceGame();
    else if (active.type.juego === 'fuses') startFuseGame();   // [0.203]
    minigameInProgress = true;
    humHoldChest = active;   // [0.091] el zumbido se calla con este cofre hasta fallar o hasta que salga otro

    // [0.090] Herramientas avanzadas (no madera): se pagan AL ENTRAR al puzle (se ve el "-N" al empezar). Ganar no vuelve a cobrar; fallar tampoco; el Escudo las devuelve.
    puzzleToolPaid = null; puzzleStat = active.type.juego;   // [0.090]
    if (toolProp !== 'picks') {
      STATE[toolProp] = Math.max(0, STATE[toolProp] - reqCount);
      puzzleToolPaid = { prop: toolProp, n: reqCount };
      updateUI();
    }

    const minigameModal = document.getElementById('minigameModal');
    if (minigameModal) minigameModal.classList.remove('hidden');
    pzFit();   // [0.103] reparte la pantalla del puzle (puzle centrado, reloj y botón a mitad de camino)
}

if (openChestBtn) {
  openChestBtn.addEventListener('click', () => {
    const active = STATE.screenChests[STATE.activeChestIdx];
    if (!active) return;
    const hasTools = (STATE[active.type.consumible] || 0) >= getRequiredToolCount(active.rarity);
    if (hasTools && !lockIsArmed(active) && !minigameInProgress) { audio.init(); armLock(active); return; }
    lockArmedChest = null;
    openActiveChest();
  });
}

const closeMinigameBtn = document.getElementById('closeMinigameBtn');
if (closeMinigameBtn) {
  // [CAMBIO] La X cuenta como fallo del puzle: cobra la herramienta (en la ganzúa, ganzúa rota)
  closeMinigameBtn.addEventListener('click', abandonCurrentMinigame);
}

/* ==========================================================================
   DELEGADOR GLOBAL DE EVENTOS (INTERCEPTOR UNIFICADO)
   ========================================================================== */

document.addEventListener('click', (e) => {
  const btn = e.target.closest('button, [role="button"]');
  if (!btn) return;

  const id = btn.id || '';
  const text = (btn.textContent || '').toUpperCase();

  // [CAMBIO] El botón Reiniciar de la cabecera pide confirmación antes de borrar la partida
  if (id === 'resetGameBtn') {
    showResetConfirm();
    return;
  }

  if (
    ['restartGameBtn', 'retryGameBtn', 'resetHeaderBtn', 'resetGameHeaderBtn', 'resetBtn'].includes(id) ||
    text.includes('REINICIAR') || text.includes('REINTENTAR')
  ) {
    resetGame();
    showCover();   // [0.087b] vuelve la pantalla de título
  }

  if (
    ['closeTraperoBtn', 'closeTraperoShopBtn', 'declineTraperoBtn'].includes(id) ||
    (btn.closest('#traperoModal, #traperoShopModal') && (text.includes('RECHAZAR') || text.includes('CERRAR') || text.includes('VOLVER') || text.includes('SALIR')))
  ) {
    closeTraperoShop();
  }
});

// [0.101] Fondo de cada puzle: la imagen va detrás del panel con un velo oscuro (DATOS_JUEGO.GRAFICOS.FONDOS_PUZLES)
function setPuzzleBackground(juego) {
  const m = document.getElementById('minigameModal');
  if (!m) return;
  const cfg = (DATOS_JUEGO.GRAFICOS && DATOS_JUEGO.GRAFICOS.FONDOS_PUZLES) || {};
  const url = cfg.ACTIVAR && typeof ASSETS !== 'undefined' && ASSETS.puzles && ASSETS.puzles[juego];
  if (!url) { m.classList.remove('puz-bg'); return; }
  m.style.setProperty('--puz-img', `url("${url}")`);
  m.style.setProperty('--puz-velo', String(cfg.VELO != null ? cfg.VELO : 0.5));
  m.classList.add('puz-bg');
}


// [0.103] Pantalla de puzles: el pie ("Listo") reserva la altura de la tarjeta de arriba para que el puzle quede centrado en la pantalla,
// y el botón se desplaza media diferencia para quedar a mitad de camino entre el puzle y "Listo".
function pzFit() {
  const m = document.getElementById('minigameModal'), card = document.getElementById('pzCard'), st = document.getElementById('minigameStatus');
  if (!m || !card || !st) return;
  const ch = card.offsetHeight, sh = st.offsetHeight;
  m.style.setProperty('--pzcardh', ch + 'px');
  m.style.setProperty('--pzshift', Math.max(0, (ch - sh) / 2) + 'px');
  pzScale(m);
}
// [0.104] Escala el puzle activo (ganzúa, tuberías, terminal) al espacio libre. En PC hasta un tope; en móvil solo se reduce si no cabe.
// Las tuberías llenan además el ancho del móvil (el tamaño de casilla sale del ancho del marco).
function pzScale(m) {
  const cfg = DATOS_JUEGO.GRAFICOS.ESCALA_PUZLES || {};
  const frame = document.getElementById('pzFrame'), card = document.getElementById('pzCard'), timer = document.getElementById('bigTimer'), foot = document.getElementById('pzFoot');
  if (!frame || m.classList.contains('hidden')) return;
  const sel = { lockpick: '#lockpickContainer .pz-body', tumbler: '#tumblerContainer .pz-body', pipe: '#pipeContainer .pz-body', sequence: '#sequenceContainer .pz-body', fuses: '#fuseContainer .pz-body', hack: '#hackContainer' };
  const idOf = { lockpick: 'lockpickContainer', tumbler: 'tumblerContainer', pipe: 'pipeContainer', sequence: 'sequenceContainer', fuses: 'fuseContainer', hack: 'hackContainer' };
  Object.keys(sel).forEach(k => { const e = document.querySelector(sel[k]); if (e) e.style.zoom = ''; });
  frame.style.removeProperty('--pzw');
  let which = null;
  Object.keys(idOf).forEach(k => { const e = document.getElementById(idOf[k]); if (e && !e.classList.contains('hidden')) which = k; });
  if (!which || cfg.ACTIVAR === false) return;
  const narrow = document.documentElement.classList.contains('narrow-layout');
  const body = document.querySelector(sel[which]); if (!body) return;
  if (which === 'pipe') {   // tamaño de casilla: llena el ancho disponible (marco de 400 px como máximo)
    const grid = document.getElementById('pipeGrid'), n = (typeof pipeGridSize === 'number') ? pipeGridSize : 0;
    if (grid && n > 0) {
      const W = narrow ? Math.min(frame.clientWidth, 400) : 400;
      const pt = Math.max(30, Math.min(cfg.PIPE_TOPE_CASILLA_PX || 72, Math.floor((W - 16 - 22 - 6 - 3 * (n - 1)) / n)));
      grid.style.setProperty('--pt', pt + 'px');
    }
  }
  const btn = m.querySelector('#' + idOf[which] + ' .pz-btn');
  const used = card.offsetHeight + timer.offsetHeight + foot.offsetHeight + (btn ? btn.offsetHeight : 0) + 20 + 2 * (cfg.MARGEN_PX || 26);
  const natH = body.offsetHeight || 1;
  const maxZ = narrow ? 1 : ((cfg.MAX && cfg.MAX[which]) || 1.5);
  let z = Math.min(maxZ, (frame.clientHeight - used) / natH, (m.clientWidth - 16) / 400);   // el ancho útil es el del marco de juego (9:16), no el de la ventana
  z = Math.max(0.55, z);
  if (z > 1.005 || z < 0.995) body.style.zoom = z.toFixed(3);
  if (z > 1.005) frame.style.setProperty('--pzw', Math.round(400 * z) + 'px');
  if (which === 'tumbler' && typeof layoutTumblerLines === 'function') { try { layoutTumblerLines(); } catch (e) {} }   // [0.106b] recolocar la línea verde tras el zoom
}
window.addEventListener('resize', pzFit);
if (window.ResizeObserver) { const c = document.getElementById('pzCard'); if (c) new ResizeObserver(pzFit).observe(c); }
