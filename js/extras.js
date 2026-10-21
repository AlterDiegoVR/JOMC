// ==========================================================================
// JUST ONE MORE CHEST — extras.js — VERSIÓN 0.35
// cartas y comodines nuevos de la 0.210: Inconformista, Herrero, Re-Roll, Pulsera VIP, Ruleta, Hallazgo Táctico+
// ==========================================================================

function helpPasiva(key, vars) {
  let t = ((DATOS_JUEGO.TEXTOS_AYUDA || {}).pasivas210 || {})[key] || '';
  return t.replace('{n}', vars && vars.n != null ? vars.n : '');
}

// Pregunta Sí/No con el mismo estilo que la pantalla previa de las cartas
function askYesNo(titulo, texto, siLabel, onYes, onNo) {
  if (document.getElementById('askYesNoModal')) return;
  const m = document.createElement('div');
  m.id = 'askYesNoModal';
  m.className = 'fixed inset-0 z-[9995] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-5 font-sans';
  m.innerHTML = `
    <div class="bg-slate-900 border-2 border-amber-500/70 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center gap-3">
      <h3 class="text-xl font-black text-amber-300 font-retro">${titulo}</h3>
      <p class="text-sm font-mono text-slate-200 leading-relaxed">${texto}</p>
      <button id="ynYes" class="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm rounded-xl shadow-lg cursor-pointer">${siLabel}</button>
      <button id="ynNo" class="w-full py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">NO, VOLVER</button>
    </div>`;
  (uiHost() || document.body).appendChild(m);
  m.querySelector('#ynYes').addEventListener('click', () => { m.remove(); if (onYes) onYes(); });
  m.querySelector('#ynNo').addEventListener('click', () => { m.remove(); if (onNo) onNo(); });
}

/* ---------- Botones de las pasivas INCONFORMISTA y HERRERO ---------- */
function rerollCost() { const C = DATOS_JUEGO.CARTAS_210.INCONFORMISTA; return C.COSTE_BASE + C.COSTE_POR_USO * (STATE.rerollCount || 0); }
function updatePerkActions() {
  const host = document.getElementById('perkActions'), br = document.getElementById('rerollPerkBtn'), bs = document.getElementById('smithPerkBtn');
  if (!host || !br || !bs) return;
  const climax = isClimaxActive();
  const showR = !!STATE.perks.inconformista && !climax, showS = (STATE.perks.herrero || 0) > 0 && !climax;
  br.classList.toggle('hidden', !showR); bs.classList.toggle('hidden', !showS);
  host.classList.toggle('hidden', !(showR || showS));
  const c = document.getElementById('rerollPerkCost'); if (c) c.textContent = rerollCost() + ' GP';
  br.disabled = STATE.gold < rerollCost();
  br.title = helpPasiva('inconformista', { n: rerollCost() }); bs.title = helpPasiva('herrero');
}
function perkActionsBusy() { return minigameInProgress || isLootProcessing || document.getElementById('cofradiaModal') || !mainScreenFree(); }

(function () {
  const br = document.getElementById('rerollPerkBtn'), bs = document.getElementById('smithPerkBtn');
  if (br) br.addEventListener('click', () => {
    if (perkActionsBusy() || !STATE.perks.inconformista) return;
    const cost = rerollCost();
    if (STATE.gold < cost) { try { audio.playBreak(); } catch (e) {} showPersistentFeedback(`⚠️ Necesitas ${cost} GP para cambiar los cofres.`); return; }
    STATE.gold -= cost; STATE.rerollCount = (STATE.rerollCount || 0) + 1;
    try { audio.init(); audio.playClick(0.9); } catch (e) {}
    updateUI();
    showPersistentFeedback(`🔄 Inconformista: has pagado ${cost} GP y los cofres cambian. El próximo cambio costará ${rerollCost()} GP.`);
    chestMutateFx(() => generateScreenChests());
  });
  if (bs) bs.addEventListener('click', () => { if (perkActionsBusy() || !(STATE.perks.herrero > 0)) return; openSmith(); });
})();

/* ---------- HERRERO: reciclaje en cualquier sitio ---------- */
const SMITH_TOOLS = [
  { prop: 'proPicks', name: 'Pin de Acero', ic: 'ic_pin', minLvl: () => 2 },
  { prop: 'usb', name: 'Llave USB', ic: 'ic_usb', minLvl: () => 3 },
  { prop: 'valves', name: 'Válvula Hidráulica', ic: 'ic_valvula', minLvl: () => valvesShopLevel() },
  { prop: 'batteries', name: 'Pila', ic: 'ic_pila', unlocked: 'batteries' },
  { prop: 'fuses', name: 'Fusible', ic: 'ic_fusible', unlocked: 'fuses' }
];
// Tarifa del Herrero para una herramienta según su nivel (casillas sin rellenar: coge la anterior; recibe lo que da el Duende)
function smithRate(prop) {
  const lvl = Math.min(STATE.perks.herrero || 1, 3), T = (DATOS_JUEGO.ECONOMIA.HERRERO || {})[prop] || {};
  let cell = null;
  for (let l = lvl; l >= 1 && !cell; l--) if (T[l]) cell = T[l];
  const duende = ((DATOS_JUEGO.ECONOMIA.RECICLAJE.otorgadas || {})[prop]) || DATOS_JUEGO.ECONOMIA.RECICLAJE.herramientas_otorgadas;
  return { g: (cell && cell.g) ? +cell.g : 4, r: (cell && cell.r) ? +cell.r : duende };
}
function openSmith() {
  document.querySelectorAll('#smithModal').forEach(e => e.remove());
  const m = document.createElement('div');
  m.id = 'smithModal';
  m.className = 'fixed inset-0 z-[9993] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 font-sans';
  (uiHost() || document.body).appendChild(m);
  const paint = () => {
    const list = SMITH_TOOLS.filter(t => STATE.level >= (t.minLvl ? t.minLvl() : 1) && (!t.unlocked || toolUnlocked(t.unlocked)));
    if (!list.length) list.push(SMITH_TOOLS[0]);
    m.innerHTML = `<div class="smith-card">
      <div class="smith-hdr"><i class="fa-solid fa-hammer"></i><b>EL HERRERO</b><span>Lv.${STATE.perks.herrero}</span></div>
      <p class="smith-sub">Cambia ganzúas por herramientas, donde sea. Tienes <b>${STATE.picks}</b> ganzúas.</p>
      <div class="smith-list">${list.map(t => {
        const r = smithRate(t.prop), poor = STATE.picks < r.g;
        const src = (typeof shopImg === 'function') ? shopImg(t.ic) : '';
        return `<div class="smith-row${poor ? ' poor' : ''}">${src ? `<img src="${src}" alt="">` : ''}<div class="smith-tx"><b>${t.name} +${r.r}</b><span>Tienes ${STATE[t.prop] || 0}</span></div><button type="button" data-prop="${t.prop}"${poor ? ' disabled' : ''}>${r.g} Ganzúas</button></div>`;
      }).join('')}</div>
      <button id="smithClose" class="smith-close" type="button">CERRAR</button></div>`;
    m.querySelectorAll('.smith-row button').forEach(b => b.addEventListener('click', () => {
      const prop = b.getAttribute('data-prop'), r = smithRate(prop), t = SMITH_TOOLS.find(x => x.prop === prop);
      if (STATE.picks < r.g) return;
      STATE.picks -= r.g; STATE[prop] += r.r;
      try { audio.init(); audio.playClick(0.9); } catch (e) {}
      updateUI(); paint();
    }));
    m.querySelector('#smithClose').addEventListener('click', () => m.remove());
  };
  paint();
}

/* ---------- Cartas tácticas nuevas ---------- */
// Cambia los cofres de la pantalla (RE-ROLL)
(function () {
  const b = document.getElementById('abilityRerollBtn');
  if (b) b.addEventListener('click', () => {
    if (!(STATE.abilities.reroll > 0) || perkActionsBusy() || isClimaxActive()) return;
    STATE.abilities.reroll--;
    try { audio.init(); audio.playClick(0.9); } catch (e) {}
    updateUI();
    showPersistentFeedback('🔀 RE-ROLL: los cofres cambian por otros aleatorios.');
    chestMutateFx(() => generateScreenChests());
  });
  const p = document.getElementById('abilityPulseraBtn');
  if (p) p.addEventListener('click', () => {
    if (!(STATE.abilities.pulsera > 0) || STATE.pulseraLeft > 0 || perkActionsBusy() || isClimaxActive()) return;
    STATE.abilities.pulsera--;
    STATE.pulseraLeft = DATOS_JUEGO.CARTAS_210.PULSERA_VIP.COFRES;
    try { audio.init(); audio.playUnlockFanfare('epico'); } catch (e) {}
    updateUI();
    showPersistentFeedback(`🎟️ PULSERA VIP: los próximos ${STATE.pulseraLeft} intentos son de cofres épicos o legendarios y no necesitas herramientas.`);
    chestMutateFx(() => generateScreenChests());
  });
  const r = document.getElementById('abilityRuletaBtn');
  if (r) r.addEventListener('click', () => {
    if (!(STATE.abilities.ruleta > 0) || perkActionsBusy() || isClimaxActive()) return;
    STATE.abilities.ruleta--;
    updateUI();
    openRouletteOnly();
  });
})();

// Ruleta de wildcards fuera de la subida de nivel (carta RULETA)
function openRouletteOnly() {
  const lm = document.getElementById('levelUpModal'), bn = document.getElementById('wildcardBanner');
  const nextBtn = document.getElementById('wildcardNextBtn'), choices = document.getElementById('levelUpChoices');
  if (!lm || !bn || !nextBtn) return;
  lvlClearTimers();
  const hdr = lm.querySelector('h2');
  const sub = hdr && hdr.previousElementSibling;
  const saved = { sub: sub ? sub.textContent : '', h: hdr ? hdr.textContent : '' };
  if (sub) sub.textContent = '¡TIRADA EXTRA!';
  if (hdr) { hdr.classList.remove('rainbow-text'); hdr.textContent = 'RULETA'; }
  if (choices) choices.classList.add('hidden');
  nextBtn.classList.remove('hidden'); nextBtn.classList.add('invisible');
  bn.innerHTML = (typeof wcFirstSpinHtml === 'function') ? wcFirstSpinHtml() : ''; bn.className = 'wcard-host lvl-card-spin'; bn.style.minHeight = 'min(300px, 40vh)';
  lm.style.overflowY = 'hidden'; lm.classList.remove('hidden');
  try { audio.init(); audio.playLevelUpFanfare(); } catch (e) {}
  const res = pickWildcard();
  updateUI();
  lvlTimers.push(setTimeout(() => runWildcardRoulette(res, () => {
    nextBtn.classList.remove('invisible');
    nextBtn.onclick = () => {
      try { audio.playUiClick(); } catch (e) {}
      lm.classList.add('hidden'); bn.classList.add('hidden');
      if (sub) sub.textContent = saved.sub; if (hdr) { hdr.textContent = saved.h; hdr.classList.add('rainbow-text'); }
      updateUI();
      processNextQueuedEvent();
    };
  }), 700));
}

// Hallazgo Táctico+: tres cartas tácticas, eliges n
function openTacticPicker(n) {
  const lm = document.getElementById('levelUpModal'), bn = document.getElementById('wildcardBanner');
  const nextBtn = document.getElementById('wildcardNextBtn'), choices = document.getElementById('levelUpChoices');
  const grid = document.getElementById('levelUpCardsGrid') || document.getElementById('chestChoicesGrid');
  if (!lm || !grid) { processNextQueuedEvent(); return; }
  lvlClearTimers();
  const hdr = lm.querySelector('h2'), sub = hdr && hdr.previousElementSibling;
  const saved = { sub: sub ? sub.textContent : '', h: hdr ? hdr.textContent : '' };
  if (sub) sub.textContent = 'HALLAZGO TÁCTICO+';
  if (hdr) { hdr.classList.remove('rainbow-text'); hdr.textContent = `ELIGE ${n}`; }
  bn.classList.add('hidden'); nextBtn.classList.add('hidden');
  const label = choices.querySelector('div'); const savedLabel = label ? label.textContent : '';
  if (label) label.textContent = `Elige ${n} cartas tácticas:`;
  choices.classList.remove('hidden');
  grid.innerHTML = '';
  const pool = shuffleU(levelCardPool(true)).slice(0, 3);
  let left = Math.min(n, pool.length);
  pool.forEach(cd => {
    const el = document.createElement('button');
    el.className = 'lvl-chest group cursor-pointer active:scale-95 transition-transform';
    const art = makeChestArt();
    el.innerHTML = `
      <div class="lvl-chest-glow"></div>
      <div class="lvl-sparks"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="lvl-chest-back" style="background-image:url('${art.back}')"></div>
      <div class="lvl-card bg-slate-900 border border-indigo-500/60 rounded-xl flex items-center gap-2.5 text-left shadow-xl group-hover:border-indigo-300">
        <div class="w-10 h-10 flex-none rounded-xl bg-indigo-950 border border-indigo-500 flex items-center justify-center text-indigo-400 text-lg"><i class="fa-solid ${cd.icono}"></i></div>
        <div class="min-w-0">
          <span class="text-[9px] font-extrabold font-mono uppercase px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded-full border border-indigo-800">${cd.tipo}</span>
          <div class="text-white font-black text-xs mt-1">${cd.titulo}</div>
          <div class="text-[10px] text-slate-400 font-mono mt-0.5">${cd.desc}</div>
        </div>
      </div>
      <div class="lvl-chest-front" style="background-image:url('${art.front}')"></div>`;
    el.addEventListener('click', () => {
      if (el.dataset.taken) return;
      el.dataset.taken = '1'; el.style.opacity = '0.35'; el.style.pointerEvents = 'none';
      try { audio.playUnlockFanfare('raro'); } catch (e) {}
      applyLevelCard(cd);
      updateUI();
      left--;
      if (label) label.textContent = left > 0 ? `Elige ${left} más:` : '';
      if (left <= 0) {
        setTimeout(() => {
          lm.classList.add('hidden'); choices.classList.add('hidden');
          if (sub) sub.textContent = saved.sub; if (hdr) { hdr.textContent = saved.h; hdr.classList.add('rainbow-text'); }
          if (label) label.textContent = savedLabel;
          updateUI();
          processNextQueuedEvent();
        }, 450);
      }
    });
    grid.appendChild(el);
  });
  lm.style.overflowY = 'auto'; lm.classList.remove('hidden');
  [...grid.children].forEach((el, i) => { el.style.opacity = '0'; setTimeout(() => { el.style.opacity = ''; el.classList.add('lvl-chest-in'); try { audio.playCardRise(); } catch (e) {} }, 120 + i * 260); });
}
