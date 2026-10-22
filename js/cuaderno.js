// ==========================================================================
// JUST ONE MORE CHEST — cuaderno.js — VERSIÓN 0.41
// El cuaderno (el Tomo): registro de lo que el juego ha visto y pantalla del cuaderno.
// REGLA: solo se escribe lo REGISTRADO. Nada de lo no descubierto aparece (ni secciones, ni páginas, ni notas).
// Todos los textos y la lista de secciones están en DATOS_JUEGO.CUADERNO (datos.js). Este archivo solo tiene la lógica.
// El registro se guarda aparte de la partida (como los logros): sobrevive a "Empezar de nuevo" y se borra con "Borrar todos los datos".
// ==========================================================================

const NB_KEY = 'justOneMoreChest_cuaderno_v1';
let nbReg_ = {};      // { clave: { l: bucle, c: cofres abiertos, n: orden } }
let nbCount = 0;
(function nbLoad() {
  try {
    const o = JSON.parse(window.localStorage.getItem(NB_KEY) || 'null');
    if (o && typeof o === 'object') { nbReg_ = o; nbCount = Object.keys(o).reduce((m, k) => Math.max(m, (o[k] && o[k].n) || 0), 0); }
  } catch (e) { nbReg_ = {}; }
})();
function nbSave() { try { window.localStorage.setItem(NB_KEY, JSON.stringify(nbReg_)); } catch (e) {} }

// Registra que el juego ha visto algo (idempotente: solo la primera vez queda anotado el bucle y el cofre)
function nbReg(key) {
  if (!key || nbReg_[key]) return false;
  nbReg_[key] = { l: (typeof STATE !== 'undefined' && STATE.currentLoop) || 1, c: (typeof STATE !== 'undefined' && STATE.chestsOpened) || 0, n: ++nbCount };
  nbSave();
  return true;
}
function nbHas(key) { return !!nbReg_[key]; }

// Mapa clave de perk (STATE.perks) -> id de la carta, para registrar las maestrías
const NB_PERKS = { sweetSpot: 'mano_firme', rarityBonus: 'ojo_cazador', discount: 'regateador', slowerPistons: 'pistones_lentos', goldStreak: 'fondo_bolsillo', extraTime: 'hombre_tranquilo', oidoClinico: 'oido_clinico', shopStealFree: 'ladron', luckyLootChance: 'tipo_con_suerte', bonusMadera: 'clasico', bonusAcero: 'mecanico', bonusDigital: 'informatico', bonusVapor: 'fontanero', bonusNeon: 'electricista', clienteVip: 'cliente_vip', exorcismo: 'exorcismo', inconformista: 'inconformista', herrero: 'herrero' };
let nbSyncT = 0;
// Revisa el estado del juego y anota lo que ya se tiene (herramientas, maestrías, cartas, rachas, objetos...). Barato: se llama desde updateUI con límite de frecuencia.
function nbSync(force) {
  const now = Date.now(); if (!force && now - nbSyncT < 700) return; nbSyncT = now;
  try {
    const S = STATE, C = DATOS_JUEGO.CUADERNO; if (!S || !C) return;
    ['picks', 'proPicks', 'usb', 'valves', 'batteries', 'fuses'].forEach(p => { if ((S[p] || 0) > 0 && toolUnlocked(p)) nbReg('herr.' + p); });
    Object.keys(NB_PERKS).forEach(k => { if (S.perks && S.perks[k]) nbReg('mae.' + NB_PERKS[k]); });
    Object.keys(C.CARTAS).forEach(k => { if (S.abilities && S.abilities[k] > 0) nbReg('carta.' + k); });
    if ((S.cleanStreak || 0) >= (DATOS_JUEGO.ECONOMIA.RACHAS_APERTURA || {}).MINIMO_PARA_BONUS) nbReg('racha.1');
    // [0.44] pequeñas mecánicas de los puzles: unas se apuntan al llevar cierto número de puzles de ese tipo, otras (troll) solo al verlas
    const pz = (S.stats && S.stats.puz) || {}, pn = j => ((pz[j] || {}).ok || 0) + ((pz[j] || {}).fail || 0);
    if (pn('lockpick') >= 6) nbReg('puz.wooden.falsos');
    if (pn('tumbler') >= 5) nbReg('puz.piston.rareza');
    if (pn('hack') >= 5) nbReg('puz.cyber.longitud');
    if (pn('pipe') >= 4) nbReg('puz.hydraulic.obstaculos');
    if (pn('sequence') >= 5) nbReg('puz.neon.prisa');
    // [0.43] arco del personaje
    if ((S.chestsOpened || 0) >= 1) nbReg('arc.despertar');
    if ((S.chestsOpened || 0) >= 5) nbReg('arc.abrir');
    if (nbHas('obj.postit')) nbReg('arc.postits');
    if ((S.level || 1) >= 3 || (S.cleanStreak || 0) >= 3) nbReg('arc.truco');
    if (nbHas('npc.duende.1')) nbReg('arc.duende');
    if (nbHas('npc.trapero.1')) nbReg('arc.trapero');
    if (nbHas('obj.postit.escribir')) nbReg('arc.escribir');
    if (nbHas('obj.oscuridad')) nbReg('arc.luz');
    if (S.climaxPhase || S.finalPhase) nbReg('npc.duende.7');   // al ver cerca su objetivo, el Duende enseña su verdadera cara
    if (S.lanternFound) nbReg('obj.linterna');
    if (typeof isRoomDark === 'function' && isRoomDark()) nbReg('obj.oscuridad');
    if (typeof tomeUnlocked === 'function' && tomeUnlocked()) nbReg('obj.tomo');
    if (S.salvageCurseActive && S.cursedChestsLeft > 0) nbReg('curse.trato');
    if ((S.currentLoop || 1) === 1 && (S.seqStage || 0) >= 1) nbReg('npc.trapero.advierte');
  } catch (e) {}
}

/* ---------- Contenido visible ---------- */
function nbLoopTag(k) {
  const r = nbReg_[k]; if (!r) return '';
  const maxL = Math.max((STATE && STATE.currentLoop) || 1, (typeof lifeStats !== 'undefined' && lifeStats.maxLoop) || 1);
  return maxL >= 2 ? DATOS_JUEGO.CUADERNO.ETIQUETA_BUCLE.replace('{n}', r.l) : '';   // en el bucle 1 el jugador no sabe que hay bucles
}
const nbClean = s => String(s || '').replace(/[{}]/g, '');
function nbNote(o) { return { h: o.h, t: o.t, tag: nbLoopTag(o.k), k: o.k }; }
function nbWildcardNotes(kind) {
  const list = DATOS_JUEGO.WILDCARDS || [];
  return Object.keys(nbReg_).filter(k => k.indexOf('wc.') === 0).sort((a, b) => nbReg_[a].n - nbReg_[b].n).map(k => ({ k, wc: list.find(w => 'wc.' + w.id === k) })).filter(x => x.wc).filter(x => {
    const bad = x.wc.tipo === 'PERJUDICIAL', mod = x.wc.efecto === 'MODIFICADOR';
    return kind === 'maldic' ? bad : kind === 'modif' ? (!bad && mod) : (!bad && !mod);
  }).map(x => ({ h: x.wc.nombre, t: nbClean(x.wc.desc), tag: nbLoopTag(x.k), k: x.k }));
}
// Notas (o páginas) visibles de una sección
function nbSectionItems(sec) {
  const C = DATOS_JUEGO.CUADERNO, vis = o => nbHas(o.k);
  switch (sec.id) {
    case 'cofres': return C.RAREZAS.filter(vis).map(nbNote);
    case 'herram': return C.HERRAMIENTAS.filter(vis).map(nbNote);
    case 'objetos': return C.OBJETOS.filter(vis).map(nbNote);
    case 'rachas': return C.RACHAS.filter(vis).map(o => { const n = nbNote(o); n.t = n.t.replace('{min}', (DATOS_JUEGO.ECONOMIA.RACHAS_APERTURA || {}).MINIMO_PARA_BONUS); const best = (typeof lifeStats !== 'undefined' && lifeStats.bestStreak) || 0; if (best > 0) n.t += ' Mi mejor racha: ' + best + '.'; return n; });
    case 'maestrias': return DATOS_JUEGO.CARTAS_NIVEL.PASIVAS.filter(c => nbHas('mae.' + c.id)).map(c => ({ h: c.titulo, t: c.desc, tag: nbLoopTag('mae.' + c.id), k: 'mae.' + c.id }));
    case 'cartas': return Object.keys(C.CARTAS).filter(k => nbHas('carta.' + k)).map(k => ({ h: C.CARTAS[k], t: ((DATOS_JUEGO.TEXTOS_AYUDA.cartas || {})[k] || '').replace(/^Carta [^:]+:\s*/, ''), tag: nbLoopTag('carta.' + k), k: 'carta.' + k }));
    case 'comodin': case 'modif': return nbWildcardNotes(sec.id);
    case 'maldic': return C.MALDICIONES.filter(vis).map(nbNote).concat(nbWildcardNotes('maldic'));
    case 'pasado': return C.PASADO.filter(vis).map(nbNote);
    case 'puzles': return C.PUZLES.filter(p => p.notas.some(vis)).map(p => ({ id: p.id, titulo: p.titulo, sub: p.sub, notas: p.notas.filter(vis).map(nbNote) }));
    case 'tratos': { const T = DATOS_JUEGO.TRATOS_TRAPERO, all = T.INICIALES.concat(T.OSCUROS).concat([{ id: 'contador_cofres_trapero', titulo: 'Contador de Cofres', desc: 'Entrego 5 ganzúas básicas y a cambio me deja ver cuántos cofres llevo.' }]);
      const fx = d => String(d.desc).replace('{LEONINO}', (typeof leoninoGp === 'function' ? leoninoGp() : '')).replace('{VENTA}', (typeof ventaGp === 'function' ? ventaGp() : ''));
      return all.filter(d => nbHas('trato.' + d.id)).map(d => ({ h: d.titulo, t: fx(d), tag: nbLoopTag('trato.' + d.id), k: 'trato.' + d.id })); }
    case 'npcs': return C.NPCS.filter(p => p.notas.some(vis)).map(p => ({ id: p.id, titulo: p.titulo, sub: p.sub, notas: p.notas.filter(vis).map(nbNote) }));
  }
  return [];
}
function nbVisibleSections() {
  return DATOS_JUEGO.CUADERNO.SECCIONES.map(s => ({ s, items: nbSectionItems(s) })).filter(x => x.items.length > 0);
}

/* ---------- Pantalla del cuaderno ---------- */
const NB_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV'];
let nbView = { v: 'index', sec: null, page: null };
const nbEsc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function nbOpen() {
  nbSync(true);
  if (document.getElementById('nbOverlay')) return;
  nbView = { v: 'index', sec: null, page: null };
  const ov = document.createElement('div'); ov.id = 'nbOverlay'; ov.className = 'nbk';
  uiHost().appendChild(ov);
  try { audio.init(); audio.playUiClick(); } catch (e) {}
  nbRender();
}
function nbClose() { const ov = document.getElementById('nbOverlay'); if (ov) ov.remove(); }
function nbGo(v) { nbView = Object.assign({ v: 'index', sec: null, page: null }, v); try { audio.init(); audio.playUiClick(); } catch (e) {} nbRender(); }

function nbNotesHtml(notes) {
  return notes.map(n => `<div class="nbk-note"><div class="nbk-nh">${nbEsc(n.h)}</div><div class="nbk-nt">${nbEsc(n.t)}</div>${n.tag ? `<span class="nbk-tag">${nbEsc(n.tag)}</span>` : ''}</div>`).join('');
}
function nbRender() {
  const ov = document.getElementById('nbOverlay'); if (!ov) return;
  const vis = nbVisibleSections(), C = DATOS_JUEGO.CUADERNO;
  const roman = id => NB_ROMAN[vis.findIndex(x => x.s.id === id)] || '';
  const cur = nbView.sec ? vis.find(x => x.s.id === nbView.sec) : null;
  if (nbView.sec && !cur) nbView = { v: 'index', sec: null, page: null };
  const tabs = vis.map((x, i) => `<button type="button" class="nbk-tab${cur && cur.s.id === x.s.id ? ' on' : ''}" data-sec="${x.s.id}" style="top:${118 + i * 42}px;background:${x.s.color}" aria-label="${nbEsc(x.s.nombre)}">${roman(x.s.id)}</button>`).join('');
  let head = '', body = '';
  if (nbView.v === 'index' || !cur) {
    head = `<div class="nbk-title">Cuaderno</div><div class="nbk-sub">se escribe solo, a medida que descubres cosas del mundo</div>`;
    body = vis.length ? vis.map(x => `<button type="button" class="nbk-row" data-sec="${x.s.id}"><span class="nbk-num">${roman(x.s.id)}</span><span class="nbk-rn"><b>${nbEsc(x.s.nombre)}</b><i>${nbEsc(x.s.hint)}</i></span><span class="nbk-lead"></span><span class="nbk-cnt">${x.items.length}</span></button>`).join('') : `<div class="nbk-empty">${nbEsc(C.VACIO)}</div>`;
  } else if (nbView.v === 'section') {
    head = `<button type="button" class="nbk-back" data-go="index">‹ Índice</button><div class="nbk-title"><span class="nbk-big">${roman(cur.s.id)}</span> ${nbEsc(cur.s.nombre)}</div><div class="nbk-sub">${nbEsc(cur.s.hint)}</div>`;
    body = cur.s.tipo === 'paginas'
      ? cur.items.map(p => `<button type="button" class="nbk-card" data-page="${p.id}"><span class="nbk-cn"><b>${nbEsc(p.titulo)}</b><i>${nbEsc(p.sub)}</i></span><span class="nbk-lead"></span><span class="nbk-cnt">${p.notas.length}</span></button>`).join('')
      : nbNotesHtml(cur.items);
  } else {
    const pg = cur.items.find(p => p.id === nbView.page);
    if (!pg) { nbView = { v: 'section', sec: cur.s.id, page: null }; return nbRender(); }
    head = `<button type="button" class="nbk-back" data-go="section">‹ ${nbEsc(cur.s.nombre)}</button><div class="nbk-title">${nbEsc(pg.titulo)}</div><div class="nbk-sub">${nbEsc(pg.sub)}</div>`;
    body = nbNotesHtml(pg.notas);
  }
  ov.innerHTML = `<div class="nbk-cover"></div><i class="nbk-st" style="top:70px"></i><i class="nbk-st" style="top:50%"></i><i class="nbk-st" style="bottom:70px"></i><div class="nbk-paper"></div><div class="nbk-margin"></div>
    ${tabs}<button type="button" class="nbk-x" aria-label="Cerrar el cuaderno"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#e6d5ae" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14"/></svg></button>
    <div class="nbk-scroll"><div class="nbk-head">${head}</div><div class="nbk-body">${body}</div></div>`;
  ov.querySelector('.nbk-x').addEventListener('click', () => { try { audio.init(); audio.playUiClick(); } catch (e) {} nbClose(); });
  ov.querySelectorAll('.nbk-tab').forEach(b => b.addEventListener('click', () => nbGo({ v: 'section', sec: b.dataset.sec })));
  ov.querySelectorAll('.nbk-row').forEach(b => b.addEventListener('click', () => nbGo({ v: 'section', sec: b.dataset.sec })));
  ov.querySelectorAll('.nbk-card').forEach(b => b.addEventListener('click', () => nbGo({ v: 'page', sec: nbView.sec, page: b.dataset.page })));
  ov.querySelectorAll('.nbk-back').forEach(b => b.addEventListener('click', () => nbGo(b.dataset.go === 'index' ? { v: 'index' } : { v: 'section', sec: nbView.sec })));
  const sc = ov.querySelector('.nbk-scroll'); if (sc) sc.scrollTop = 0;
}
